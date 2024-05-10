import { Route, SwapQuoter } from '@derpdex/sdk'
import { Currency, CurrencyAmount, TradeType } from '@uniswap/sdk-core'
import { useWeb3React } from '@web3-react/core'
import { SupportedChainId } from 'constants/chains'
import { isBase, isOpBNB, isZkSync } from 'constants/tokens'
import JSBI from 'jsbi'
import { useSingleContractWithCallData } from 'lib/hooks/multicall'
import { useMemo } from 'react'
import { ClassicTrade, InterfaceTrade, TradeState } from 'state/routing/types'
import { computeRealizedPriceImpact } from 'utils/prices'

import { useAllV3Routes } from './useAllV3Routes'
import { useQuoter } from './useContract'

const QUOTE_GAS_OVERRIDES: { [chainId: number]: number } = {
  [SupportedChainId.ARBITRUM_ONE]: 25_000_000,
  [SupportedChainId.ARBITRUM_GOERLI]: 25_000_000,
  [SupportedChainId.CELO]: 50_000_000,
  [SupportedChainId.CELO_ALFAJORES]: 50_000_000,
  [SupportedChainId.POLYGON]: 40_000_000,
  [SupportedChainId.POLYGON_MUMBAI]: 40_000_000,
  [SupportedChainId.BNB]: 50_000_000,
  [SupportedChainId.ZKSYNC_TESTNET]: 25_000_000,
  [SupportedChainId.ZKSYNC_MAINNET]: 25_000_000,
  [SupportedChainId.BASE_TESTNET]: 25_000_000,
  [SupportedChainId.BASE_MAINNET]: 25_000_000,
}

const DEFAULT_GAS_QUOTE = 2_000_000

/**
 * Returns the best v3 trade for a desired swap
 * @param tradeType whether the swap is an exact in/out
 * @param amountSpecified the exact amount to swap in/out
 * @param otherCurrency the desired output/payment currency
 */
export function useClientSideV3Trade<TTradeType extends TradeType>(
  tradeType: TTradeType,
  amountSpecified?: CurrencyAmount<Currency>,
  otherCurrency?: Currency
): { state: TradeState; trade?: InterfaceTrade } {
  const [currencyIn, currencyOut] =
    tradeType === TradeType.EXACT_INPUT
      ? [amountSpecified?.currency, otherCurrency]
      : [otherCurrency, amountSpecified?.currency]
  const { routes, loading: routesLoading } = useAllV3Routes(currencyIn, currencyOut)

  const { chainId } = useWeb3React()
  // Chains deployed using the deploy-v3 script only deploy QuoterV2.
  const useQuoterV2 = useMemo(
    () => Boolean(chainId && (isZkSync(chainId) || isBase(chainId) || isOpBNB(chainId))),
    [chainId]
  )
  const quoter = useQuoter(useQuoterV2)
  const callData = useMemo(
    () =>
      amountSpecified
        ? routes.map(
            (route) => SwapQuoter.quoteCallParameters(route, amountSpecified, tradeType, { useQuoterV2 }).calldata
          )
        : [],
    [amountSpecified, routes, tradeType, useQuoterV2]
  )

  const quotesResults = useSingleContractWithCallData(quoter, callData, {
    gasRequired: chainId ? QUOTE_GAS_OVERRIDES[chainId] ?? DEFAULT_GAS_QUOTE : undefined,
  })

  const currenciesAreTheSame = useMemo(
    () => currencyIn && currencyOut && (currencyIn.equals(currencyOut) || currencyIn.wrapped.equals(currencyOut)),
    [currencyIn, currencyOut]
  )

  return useMemo(() => {
    if (
      !amountSpecified ||
      !currencyIn ||
      !currencyOut ||
      quotesResults.some(({ valid }) => !valid) ||
      currenciesAreTheSame
    ) {
      return {
        state: TradeState.INVALID,
        trade: undefined,
      }
    }

    if (routesLoading || quotesResults.some(({ loading }) => loading)) {
      return {
        state: TradeState.LOADING,
        trade: undefined,
      }
    }

    const { bestRoute, amountIn, amountOut } = quotesResults.reduce(
      (
        currentBest: {
          bestRoute: Route<Currency, Currency> | null
          amountIn: CurrencyAmount<Currency> | null
          amountOut: CurrencyAmount<Currency> | null
          priceImpact: number
        },
        { result },
        i
      ) => {
        if (!result) return currentBest

        // overwrite the current best if it's not defined or if this route is better
        if (tradeType === TradeType.EXACT_INPUT) {
          const amountOut = CurrencyAmount.fromRawAmount(currencyOut, result.amountOut.toString())
          // New logic (Find lowest price impact)
          const trade = new ClassicTrade({
            v2Routes: [],
            v3Routes: [
              {
                routev3: routes[i],
                inputAmount: amountSpecified,
                outputAmount: amountOut,
              },
            ],
            _1inchRoutes: [],
            tradeType,
          })

          const marketPriceImpact = trade?.priceImpact ? computeRealizedPriceImpact(trade) : null

          if (
            currentBest.amountOut === null ||
            (marketPriceImpact && Number(marketPriceImpact.toFixed(2)) < currentBest.priceImpact)
          ) {
            return {
              bestRoute: routes[i],
              amountIn: amountSpecified,
              amountOut,
              priceImpact: marketPriceImpact ? Number(marketPriceImpact.toFixed(2)) : 0,
            }
          }
        } else {
          const amountIn = CurrencyAmount.fromRawAmount(currencyIn, result.amountIn.toString())
          const trade = new ClassicTrade({
            v2Routes: [],
            v3Routes: [
              {
                routev3: routes[i],
                inputAmount: amountIn,
                outputAmount: amountSpecified,
              },
            ],
            _1inchRoutes: [],
            tradeType,
          })

          const marketPriceImpact = trade?.priceImpact ? computeRealizedPriceImpact(trade) : null

          if (
            currentBest.amountIn === null ||
            (marketPriceImpact && Number(marketPriceImpact.toFixed(2)) < currentBest.priceImpact)
          ) {
            return {
              bestRoute: routes[i],
              amountIn,
              amountOut: amountSpecified,
              priceImpact: marketPriceImpact ? Number(marketPriceImpact.toFixed(2)) : 0,
            }
          }
        }

        return currentBest
      },
      {
        bestRoute: null,
        amountIn: null,
        amountOut: null,
        priceImpact: 0,
      }
    )

    if (!bestRoute || !amountIn || !amountOut) {
      return {
        state: TradeState.NO_ROUTE_FOUND,
        trade: undefined,
      }
    }

    return {
      state: TradeState.VALID,
      trade: new ClassicTrade({
        v2Routes: [],
        v3Routes: [
          {
            routev3: bestRoute,
            inputAmount: amountIn,
            outputAmount: amountOut,
          },
        ],
        _1inchRoutes: [],
        tradeType,
      }),
    }
  }, [amountSpecified, currenciesAreTheSame, currencyIn, currencyOut, quotesResults, routes, routesLoading, tradeType])
}
