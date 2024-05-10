import { Currency, CurrencyAmount, TradeType } from '@uniswap/sdk-core'
import { useWeb3React } from '@web3-react/core'
import { WRAPPED_NATIVE_CURRENCY } from 'constants/tokens'
import { useXYSideTrade } from 'pages/Swap/hooks/use1inchRouter'
import { useEffect, useMemo, useState } from 'react'
import { RouterPreference } from 'state/routing/slice'
import { InterfaceTrade, TradeState } from 'state/routing/types'
import { useRoutingAPITrade } from 'state/routing/useRoutingAPITrade'
import { useRouterPreference } from 'state/user/hooks'
import { computeRealizedPriceImpact } from 'utils/prices'

import useAutoRouterSupported from './useAutoRouterSupported'
import { useClientSideV3Trade } from './useClientSideV3Trade'
import useDebounce from './useDebounce'

// Prevents excessive quote requests between keystrokes.
const DEBOUNCE_TIME = 350

// Network that support for 1inch router
const CHAINID_SUPPORT_FOR_XYFINANCE = [324, 8453]

// PRICE IMPACT LIMIT BEFORE FALLBACK TO 1INCH ROUTER
const PRICE_IMPACT_LIMIT_FALLBACK = 17

const useAPITrade = (
  tradeType: TradeType,
  autoRouterSupported: boolean,
  shouldGetTrade: boolean,
  debouncedAmount?: CurrencyAmount<Currency>,
  debouncedOtherCurrency?: Currency
) => {
  const [routerPreference] = useRouterPreference()
  // Get the values returned by useMemo for routingAPITrade and clientAPITrade.
  const routingTrade = useRoutingAPITrade(
    tradeType,
    autoRouterSupported && shouldGetTrade ? debouncedAmount : undefined,
    debouncedOtherCurrency,
    RouterPreference.API
  )

  const marketPriceImpact = routingTrade.trade?.priceImpact ? computeRealizedPriceImpact(routingTrade.trade) : undefined

  const isV3HighPriceImpact = Number(marketPriceImpact?.toFixed(2)) > PRICE_IMPACT_LIMIT_FALLBACK

  const clientTrade = useRoutingAPITrade(
    tradeType,
    autoRouterSupported && shouldGetTrade ? debouncedAmount : undefined,
    debouncedOtherCurrency,
    RouterPreference.CLIENT
  )

  const _UNDEFINED = useMemo(
    () => ({
      state: TradeState.INVALID,
      trade: undefined,
      isAggregator: false,
      disableIf1inchOutput: true,
    }),
    []
  )

  const _LOADING = useMemo(
    () => ({
      state: TradeState.LOADING,
      trade: undefined,
      isAggregator: false,
      disableIf1inchOutput: true,
    }),
    []
  )

  // Check the value of TradeState from routingAPITrade.
  if (routingTrade.state === TradeState.VALID && !isV3HighPriceImpact) {
    // For debug: console.log('[Router]')
    return {
      result: routingTrade,
      router: RouterPreference.API,
    }
  } else if (clientTrade.state === TradeState.VALID && isV3HighPriceImpact) {
    // For debug: console.log('[Client]')
    return {
      result: clientTrade,
      router: RouterPreference.CLIENT,
    }
  } else {
    return {
      result: _LOADING,
      router: null,
    }
  }
}
/**
 * Returns the best v2+v3 trade for a desired swap.
 * @param tradeType whether the swap is an exact in/out
 * @param amountSpecified the exact amount to swap in/out
 * @param otherCurrency the desired output/payment currency
 */
export function useBestTrade(
  tradeType: TradeType,
  amountSpecified?: CurrencyAmount<Currency>,
  otherCurrency?: Currency
): {
  state: TradeState
  trade?: InterfaceTrade
  isAggregator?: boolean
  disableIf1inchOutput?: boolean
  xySwapProvider?: string
} {
  const [routerPreference] = useRouterPreference()
  const { chainId } = useWeb3React()
  const autoRouterSupported = useAutoRouterSupported()
  // const isWindowVisible = useIsWindowVisible()
  const [isGracefulSettledForAggregator, setIsGracefulSettledForAggregator] = useState<boolean>(false)

  const [debouncedAmount, debouncedOtherCurrency] = useDebounce(
    useMemo(() => [amountSpecified, otherCurrency], [amountSpecified, otherCurrency]),
    DEBOUNCE_TIME
  )

  const isAWrapTransaction = useMemo(() => {
    if (!chainId || !amountSpecified || !debouncedOtherCurrency) return false
    const weth = WRAPPED_NATIVE_CURRENCY[chainId]
    return (
      (amountSpecified.currency.isNative && weth?.equals(debouncedOtherCurrency)) ||
      (debouncedOtherCurrency.isNative && weth?.equals(amountSpecified.currency))
    )
  }, [amountSpecified, chainId, debouncedOtherCurrency])

  const shouldGetTrade = !isAWrapTransaction

  const routingAPITrade = useRoutingAPITrade(
    tradeType,
    autoRouterSupported && shouldGetTrade ? debouncedAmount : undefined,
    debouncedOtherCurrency,
    routerPreference,
    isGracefulSettledForAggregator
  )

  const isLoading = routingAPITrade.state === TradeState.LOADING

  const useFallback =
    routingAPITrade.state === TradeState.NO_ROUTE_FOUND ||
    (routingAPITrade.state === TradeState.INVALID && shouldGetTrade)

  useEffect(() => {
    if (routingAPITrade.state !== TradeState.VALID) {
      setIsGracefulSettledForAggregator(true)
    } else {
      setIsGracefulSettledForAggregator(false)
    }
  }, [routingAPITrade.state])

  //! FALLBACK PRICE IMPACT TO USE 1INCH WHEN NECESSARY
  const marketPriceImpact = routingAPITrade.trade?.priceImpact
    ? computeRealizedPriceImpact(routingAPITrade.trade)
    : undefined

  const isV3HighPriceImpact = Number(marketPriceImpact?.toFixed(2)) > PRICE_IMPACT_LIMIT_FALLBACK

  // Only use client side router if routing api trade failed or is not supported
  const bestV3Trade = useClientSideV3Trade(
    tradeType,
    useFallback || isV3HighPriceImpact ? debouncedAmount : undefined,
    useFallback || isV3HighPriceImpact ? debouncedOtherCurrency : undefined
  )

  const bestV3PriceImpact = bestV3Trade.trade?.priceImpact ? computeRealizedPriceImpact(bestV3Trade.trade) : undefined
  const isBestV3HighPriceImpact = Number(bestV3PriceImpact?.toFixed(2)) > PRICE_IMPACT_LIMIT_FALLBACK
  const isHighPriceImpact = isV3HighPriceImpact && isBestV3HighPriceImpact

  // ********************* Only use XY Finance API when v3 has no pools or liquidity *********************
  const useXyRouter =
    (CHAINID_SUPPORT_FOR_XYFINANCE.find((cid) => cid === chainId) &&
      routingAPITrade.state === TradeState.NO_ROUTE_FOUND) ||
    (CHAINID_SUPPORT_FOR_XYFINANCE.find((cid) => cid === chainId) &&
      routingAPITrade.state === TradeState.INVALID &&
      shouldGetTrade) ||
    // tradeType === TradeType.EXACT_INPUT &&
    isHighPriceImpact

  const disableIf1inchOutput = useXyRouter && tradeType === TradeType.EXACT_OUTPUT

  const _xyApiTrade = useXYSideTrade(
    tradeType,
    useXyRouter ? debouncedAmount : undefined,
    useXyRouter ? debouncedOtherCurrency : undefined
  )
  // ********************* Only use 1inch when v3 has no pools or liquidity *********************

  // only return gas estimate from api if routing api trade is used
  const _defaultTrade = useMemo(
    () => ({
      ...(useFallback || isV3HighPriceImpact ? bestV3Trade : routingAPITrade),
      ...(isLoading ? { state: TradeState.LOADING } : {}),
      isAggregator: false,
      disableIf1inchOutput: false,
    }),
    [bestV3Trade, isLoading, routingAPITrade, useFallback]
  )

  const _XY_TradeFinalized = useMemo(
    () => ({
      ..._xyApiTrade,
      ...(isLoading ? { state: TradeState.LOADING } : {}),
      isAggregator: true,
      disableIf1inchOutput,
    }),
    [useXyRouter, _xyApiTrade, routingAPITrade, isLoading, disableIf1inchOutput]
  )

  const _UNDFINED = useMemo(
    () => ({
      state: TradeState.INVALID,
      trade: undefined,
      isAggregator: false,
      disableIf1inchOutput: true,
    }),
    []
  )

  if (!useXyRouter && isHighPriceImpact) {
    return _defaultTrade
  } else if (!useXyRouter && !isHighPriceImpact) {
    return _defaultTrade
  } else {
    return _XY_TradeFinalized
  }
}
