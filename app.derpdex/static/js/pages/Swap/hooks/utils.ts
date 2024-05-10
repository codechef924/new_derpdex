/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-unused-modules */

import { MixedRouteSDK } from '@derpdex/router-sdk'
import { FeeAmount, Pool, Route as V3Route } from '@derpdex/sdk'
import { Currency, CurrencyAmount, Token, TradeType } from '@uniswap/sdk-core'
import { Route as V2Route } from '@uniswap/v2-sdk'
import { SupportedChainId } from 'constants/chains'
import { RPC_URLS } from 'constants/networks'
import { USDC_BASE_MAINNET, USDC_ZKSYNC_MAINNET } from 'constants/tokens'
import { ethers } from 'ethers'
import { GetQuoteArgsOnXYFinance } from 'state/routing/_xyFinance.slice'
import { ClassicTrade, QuoteDataOnXYFinance, QuoteState, TradeResult, XYFinanceTradeResult } from 'state/routing/types'
import { QuoteDataOn1inch } from 'state/routing/types'
import { Provider } from 'zksync-web3'

export enum SwapRouter1inchNativeAssets {
  ETH = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
}

function parse1inchToken({
  address,
  decimals,
  symbol,
}: QuoteDataOn1inch['fromToken'] | QuoteDataOn1inch['toToken']): Token {
  return new Token(324, address, parseInt(decimals.toString()), symbol)
}

type TokenInRoute = Pick<Token, 'address' | 'symbol' | 'decimals' | 'name'>

export type _1inchPoolInRoute = {
  type: 'v3-pool'
  tokenIn: TokenInRoute
  tokenOut: TokenInRoute
  sqrtRatioX96: string
  liquidity: string
  tickCurrent: string
  fee: string
  amountIn?: string
  amountOut?: string

  // not used in the interface
  address?: string
}

function parse1inchPool({ fee, sqrtRatioX96, liquidity, tickCurrent, tokenIn, tokenOut }: _1inchPoolInRoute): Pool {
  return new Pool(
    parse1inchToken(tokenIn),
    parse1inchToken(tokenOut),
    parseInt(fee) as FeeAmount,
    sqrtRatioX96,
    liquidity,
    parseInt(tickCurrent)
  )
}

export enum PoolType {
  V2Pool = 'v2-pool',
  V3Pool = 'v3-pool',
  _1INCHPool = '_1inch-pool',
  _XYFINANCE = '_xy-finance',
}
export function compute1inchRoutes(
  tokenInIsNative: boolean,
  tokenOutIsNative: boolean,
  rawData: QuoteDataOn1inch,
  routes: QuoteDataOn1inch['protocols']
):
  | {
      routev3: V3Route<Currency, Currency> | null
      routev2: V2Route<Currency, Currency> | null
      mixedRoute: MixedRouteSDK<Currency, Currency> | null
      _1inchRoute: V3Route<Currency, Currency> | null
      inputAmount: CurrencyAmount<Currency>
      outputAmount: CurrencyAmount<Currency>
    }[]
  | undefined {
  const tokenIn = rawData.fromToken.address
  const tokenOut = rawData.toToken.address

  if (!tokenIn || !tokenOut) throw new Error('Expected both tokenIn and tokenOut to be present')

  const parsedCurrencyIn = parse1inchToken(rawData.fromToken)
  const parsedCurrencyOut = parse1inchToken(rawData.toToken)

  try {
    return routes.slice(0, 1).map((route, index) => {
      if (route.length === 0) {
        throw new Error('Expected route to have at least one pair or pool')
      }
      const rawAmountIn = rawData.fromTokenAmount
      const rawAmountOut = rawData.toTokenAmount

      if (!rawAmountIn || !rawAmountOut) {
        throw new Error('Expected both amountIn and amountOut to be present')
      }

      const restrictToV3: _1inchPoolInRoute[] = []
      // 26 - 6- 2023
      // ! LOOK FOR THIS
      restrictToV3.push({
        type: 'v3-pool',
        tokenIn: parse1inchToken({
          address: rawData.fromToken.address,
          decimals: rawData.fromToken.decimals,
          symbol: rawData.fromToken.symbol,
        }),
        tokenOut: parse1inchToken({
          address: rawData.toToken.address,
          decimals: rawData.toToken.decimals,
          symbol: rawData.toToken.symbol,
        }),
        sqrtRatioX96: '31726639388483529688799273452546', // AN UNUSED VALUATION TO SUPPORT THE new ClassicTrade({ ... })
        liquidity: '11063804634923645', // AN UNUSED VALUATION TO SUPPORT THE new ClassicTrade({ ... })
        tickCurrent: '119857', // AN UNUSED VALUATION TO SUPPORT THE new ClassicTrade({ ... })
        fee: '10000', // AN UNUSED VALUATION TO SUPPORT THE new ClassicTrade({ ... })
      })
      // 26 - 6- 2023
      return {
        routev3: new V3Route(restrictToV3.map(parse1inchPool), parsedCurrencyIn, parsedCurrencyOut),
        routev2: null,
        mixedRoute: null,
        _1inchRoute: new V3Route(restrictToV3.map(parse1inchPool), parsedCurrencyIn, parsedCurrencyOut),
        inputAmount: CurrencyAmount.fromRawAmount(parsedCurrencyIn, rawAmountIn),
        outputAmount: CurrencyAmount.fromRawAmount(parsedCurrencyOut, rawAmountOut),
      }
    })
  } catch (e) {
    console.error('Error computing routes', e)
    return e
  }
}

// Utility to calculate 1inch tx fees
const getEthInUsd1nch = async () => {
  const url = `https://api.1inch.io/v5.0/324/quote?fromTokenAddress=0x5aea5775959fbc2557cc8789bc1bf90a239d9a91&toTokenAddress=0x3355df6d4c9c3035724fd0e3914de96a5a83aaf4&amount=1000000000000000000`
  try {
    const cachedEthUSD = localStorage.getItem('ethusd')

    let parsedCachedEthUSD: { ethInUSD: number; timestamp: number } = cachedEthUSD ? JSON.parse(cachedEthUSD) : null

    let result
    let ethRawAmountOut: number
    if (!cachedEthUSD || (parsedCachedEthUSD && Date.now() - parsedCachedEthUSD.timestamp > 60 * 1000)) {
      const response = await fetch(url)
      if (response.ok) {
        result = await response.json()
        ethRawAmountOut = result.toTokenAmount
        const ethusd = ethRawAmountOut / 10 ** 6
        localStorage.setItem(
          'ethusd',
          JSON.stringify({
            ethInUSD: ethusd,
            timestamp: Date.now(),
          })
        )
        return ethusd
      } else {
        throw 'Unable to fetch quote'
      }
    } else {
      parsedCachedEthUSD = JSON.parse(cachedEthUSD) as { ethInUSD: number; timestamp: number }
      return parsedCachedEthUSD.ethInUSD
    }
  } catch (error) {
    console.log('[Unable to fetch quote]', error)
    return 0
  }
}

async function estimateGasCost(estimateGas: number | string) {
  const provider = new Provider(RPC_URLS[324][0])

  try {
    const gasPrice = await provider.getGasPrice()
    const gasPriceGwei = ethers.utils.formatUnits(gasPrice, 'gwei')

    const cachedGasUseEstimateUSD = localStorage.getItem('ethInUSD')

    const ethToUsdConversionRate = cachedGasUseEstimateUSD
      ? JSON.parse(cachedGasUseEstimateUSD)[0]
      : await getEthInUsd1nch()

    const cachedTimestamp = cachedGasUseEstimateUSD ? JSON.parse(cachedGasUseEstimateUSD)[1] : 0
    // If there's no cached data or it's more than a minute old, fetch new data and cache it.
    if (!cachedGasUseEstimateUSD || Date.now() - Number(cachedTimestamp) >= 60 * 1000) {
      const ethToUsdConversionRate = await getEthInUsd1nch()
      localStorage.setItem('ethInUSD', JSON.stringify([ethToUsdConversionRate, Date.now()]))
    }

    const gasCost = Number(gasPriceGwei) * Number(estimateGas)
    const gasCostEth = Number(gasCost.toString()) / 10 ** 9
    const gasCostUsd = gasCostEth * ethToUsdConversionRate

    return gasCostUsd.toString()
  } catch (err) {
    console.log('Failed to get gas price', err)
    return '0'
  }
}

export async function transform1inchRoutesToTrade(
  args: GetQuoteArgsOnXYFinance,
  data: QuoteDataOn1inch
): Promise<TradeResult> {
  const { srcQuoteTokenAddress, dstQuoteTokenAddress } = args
  const tokenInIsNative = Object.values(SwapRouter1inchNativeAssets).includes(
    srcQuoteTokenAddress as SwapRouter1inchNativeAssets
  )
  const tokenOutIsNative = Object.values(SwapRouter1inchNativeAssets).includes(
    dstQuoteTokenAddress as SwapRouter1inchNativeAssets
  )

  const { estimatedGas } = data

  const gasUseEstimateUSD = await estimateGasCost(estimatedGas)

  const computedRoutes = compute1inchRoutes(tokenInIsNative, tokenOutIsNative, data, data.protocols)
  const routes = computedRoutes
  const trade = new ClassicTrade({
    v2Routes: [],
    v3Routes:
      routes
        ?.filter((r): r is typeof routes[0] & { routev3: NonNullable<typeof routes[0]['routev3']> } => {
          return r.routev3 !== null
        })
        .map(({ routev3, inputAmount, outputAmount }) => {
          return {
            routev3,
            inputAmount,
            outputAmount,
          }
        }) ?? [],
    _1inchRoutes:
      routes
        ?.filter((r): r is typeof routes[0] & { _1inchRoute: NonNullable<typeof routes[0]['_1inchRoute']> } => {
          return r._1inchRoute !== null
        })
        .map(({ _1inchRoute, inputAmount, outputAmount }) => {
          return {
            _1inchRoute,
            inputAmount,
            outputAmount,
          }
        }) ?? [],
    mixedRoutes: [],
    tradeType: TradeType.EXACT_INPUT,
    gasUseEstimateUSD: parseFloat(gasUseEstimateUSD).toFixed(2).toString(),
  })

  return { state: QuoteState.SUCCESS, trade }
}

function parseXYFinanceToken({
  address,
  decimals,
  symbol,
  chainId,
}: QuoteDataOnXYFinance['srcQuoteToken'] | QuoteDataOnXYFinance['dstQuoteToken']): Token {
  return new Token(chainId, address, parseInt(decimals.toString()), symbol)
}

type TokenInXYRoute = Pick<Token, 'address' | 'symbol' | 'decimals' | 'chainId'>

export type _XYFinanceInRoute = {
  type: 'v3-pool'
  srcQuoteToken: TokenInXYRoute
  dstQuoteToken: TokenInXYRoute
  sqrtRatioX96: string
  liquidity: string
  tickCurrent: string
  fee: string
  amountIn?: string
  amountOut?: string

  // not used in the interface
  address?: string
}

function parseXYFinancePool({
  fee,
  sqrtRatioX96,
  liquidity,
  tickCurrent,
  srcQuoteToken,
  dstQuoteToken,
}: _XYFinanceInRoute): Pool {
  return new Pool(
    parseXYFinanceToken(srcQuoteToken),
    parseXYFinanceToken(dstQuoteToken),
    parseInt(fee) as FeeAmount,
    sqrtRatioX96,
    liquidity,
    parseInt(tickCurrent)
  )
}

export function computeXYFinanceRoutes(
  tokenInIsNative: boolean,
  tokenOutIsNative: boolean,
  routes: QuoteDataOnXYFinance
):
  | {
      routev3: V3Route<Currency, Currency> | null
      routev2: V2Route<Currency, Currency> | null
      mixedRoute: MixedRouteSDK<Currency, Currency> | null
      _xyFinanceRoute: V3Route<Currency, Currency> | null
      inputAmount: CurrencyAmount<Currency>
      outputAmount: CurrencyAmount<Currency>
    }
  | undefined {
  const tokenIn = routes.srcQuoteTokenAddress
  const tokenOut = routes.dstQuoteTokenAddress

  if (!tokenIn || !tokenOut) throw new Error('Expected both tokenIn and tokenOut to be present')

  const parsedCurrencyIn = parseXYFinanceToken(routes.srcQuoteToken)
  const parsedCurrencyOut = parseXYFinanceToken(routes.dstQuoteToken)

  try {
    const restrictToV3: _XYFinanceInRoute[] = []
    restrictToV3.push({
      type: 'v3-pool',
      srcQuoteToken: parsedCurrencyIn,
      dstQuoteToken: parsedCurrencyOut,
      sqrtRatioX96: '31726639388483529688799273452546', // AN UNUSED VALUATION TO SUPPORT THE new ClassicTrade({ ... })
      liquidity: '11063804634923645', // AN UNUSED VALUATION TO SUPPORT THE new ClassicTrade({ ... })
      tickCurrent: '119857', // AN UNUSED VALUATION TO SUPPORT THE new ClassicTrade({ ... })
      fee: '10000', // AN UNUSED VALUATION TO SUPPORT THE new ClassicTrade({ ... })
    })

    return {
      routev3: new V3Route(restrictToV3.map(parseXYFinancePool), parsedCurrencyIn, parsedCurrencyOut),
      routev2: null,
      mixedRoute: null,
      _xyFinanceRoute: new V3Route(restrictToV3.map(parseXYFinancePool), parsedCurrencyIn, parsedCurrencyOut),
      inputAmount: CurrencyAmount.fromRawAmount(parsedCurrencyIn, routes.srcQuoteTokenAmount),
      outputAmount: CurrencyAmount.fromRawAmount(parsedCurrencyOut, routes.dstQuoteTokenAmount),
    }
  } catch (e) {
    console.error('Error computing routes', e)
    return e
  }
}

const USDC_ON_CHAIN: { [key: number]: string } = {
  [SupportedChainId.ZKSYNC_MAINNET]: USDC_ZKSYNC_MAINNET.address,
  [SupportedChainId.BASE_MAINNET]: USDC_BASE_MAINNET.address,
}
// Utility to calculate 1inch tx fees
const getEthInUsdXYFinance = async ({ chainId }: { chainId: number }) => {
  const STABLE_COIN_ADDRESS = USDC_ON_CHAIN[chainId]
  const url = `https://aggregator-api.xy.finance/v1/quote?srcChainId=${chainId}&srcQuoteTokenAddress=0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE&srcQuoteTokenAmount=1000000000000000000&dstChainId=${chainId}&dstQuoteTokenAddress=${STABLE_COIN_ADDRESS}&slippage=0`
  try {
    const cachedEthUSD = localStorage.getItem('ethusd')

    let parsedCachedEthUSD: { ethInUSD: number; timestamp: number } = cachedEthUSD ? JSON.parse(cachedEthUSD) : null

    let result
    let ethRawAmountOut: number
    if (!cachedEthUSD || (parsedCachedEthUSD && Date.now() - parsedCachedEthUSD.timestamp > 60 * 1000)) {
      const response = await fetch(url)
      if (response.ok) {
        result = await response.json()
        const parsed = result.routes[0] as QuoteDataOnXYFinance
        ethRawAmountOut = parseFloat(parsed.dstQuoteTokenAmount)
        const ethusd = ethRawAmountOut / 10 ** 6
        localStorage.setItem(
          'ethusd',
          JSON.stringify({
            ethInUSD: ethusd,
            timestamp: Date.now(),
          })
        )
        return ethusd
      } else {
        throw 'Unable to fetch quote'
      }
    } else {
      parsedCachedEthUSD = JSON.parse(cachedEthUSD) as { ethInUSD: number; timestamp: number }
      return parsedCachedEthUSD.ethInUSD
    }
  } catch (error) {
    console.log('[Unable to fetch quote]', error)
    return 0
  }
}

async function estimateGasCostForXYFinance(estimateGas: number | string, chainId: SupportedChainId) {
  const provider = new Provider(RPC_URLS[chainId][0])

  try {
    const gasPrice = await provider.getGasPrice()
    const gasPriceGwei = ethers.utils.formatUnits(gasPrice, 'gwei')

    const cachedGasUseEstimateUSD = localStorage.getItem('ethInUSD')

    const ethToUsdConversionRate = cachedGasUseEstimateUSD
      ? JSON.parse(cachedGasUseEstimateUSD)[0]
      : await getEthInUsd1nch()

    const cachedTimestamp = cachedGasUseEstimateUSD ? JSON.parse(cachedGasUseEstimateUSD)[1] : 0
    // If there's no cached data or it's more than a minute old, fetch new data and cache it.
    if (!cachedGasUseEstimateUSD || Date.now() - Number(cachedTimestamp) >= 60 * 1000) {
      const ethToUsdConversionRate = await getEthInUsdXYFinance({ chainId })
      localStorage.setItem('ethInUSD', JSON.stringify([ethToUsdConversionRate, Date.now()]))
    }

    const gasCost = Number(gasPriceGwei) * Number(estimateGas)
    const gasCostEth = Number(gasCost.toString()) / 10 ** 9
    const gasCostUsd = gasCostEth * ethToUsdConversionRate

    return gasCostUsd.toString()
  } catch (err) {
    console.log('Failed to get gas price', err)
    return '0'
  }
}

export async function transformXYFinanceRoutesToTrade(
  args: GetQuoteArgsOnXYFinance,
  data: QuoteDataOnXYFinance[]
): Promise<XYFinanceTradeResult> {
  const { srcQuoteTokenAddress, dstQuoteTokenAddress } = args
  const tokenInIsNative = Object.values(SwapRouter1inchNativeAssets).includes(
    srcQuoteTokenAddress as SwapRouter1inchNativeAssets
  )
  const tokenOutIsNative = Object.values(SwapRouter1inchNativeAssets).includes(
    dstQuoteTokenAddress as SwapRouter1inchNativeAssets
  )

  const { estimatedGas } = data[0]

  const gasUseEstimateUSD = await estimateGasCostForXYFinance(estimatedGas, data[0].dstChainId)

  const computedRoutes = computeXYFinanceRoutes(tokenInIsNative, tokenOutIsNative, data[0])
  const routes = computedRoutes

  const trade = new ClassicTrade({
    v2Routes: [],
    v3Routes:
      routes && routes._xyFinanceRoute
        ? [
            {
              routev3: routes._xyFinanceRoute,
              inputAmount: routes.inputAmount,
              outputAmount: routes.outputAmount,
            },
          ]
        : [],
    _xyFinanceRoutes:
      routes && routes._xyFinanceRoute
        ? [
            {
              _xyFinanceRoute: routes._xyFinanceRoute,
              inputAmount: routes.inputAmount,
              outputAmount: routes.outputAmount,
            },
          ]
        : [],
    mixedRoutes: [],
    tradeType: TradeType.EXACT_INPUT,
    gasUseEstimateUSD: parseFloat(gasUseEstimateUSD).toFixed(2).toString(),
  })

  return { state: QuoteState.SUCCESS, trade, xySwapProvider: data[0].srcSwapDescription.provider }
}
