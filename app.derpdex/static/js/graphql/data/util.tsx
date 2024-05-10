import { QueryResult } from '@apollo/client'
import { Currency, Token } from '@uniswap/sdk-core'
import { SupportedChainId } from 'constants/chains'
import { NATIVE_CHAIN_ID, nativeOnChain, WRAPPED_NATIVE_CURRENCY } from 'constants/tokens'
import ms from 'ms.macro'
import { useEffect } from 'react'
import { getNativeTokenDBAddress } from 'utils/nativeTokens'

import { Chain, ContractInput, HistoryDuration, TokenStandard } from './__generated__/types-and-hooks'

export enum PollingInterval {
  Slow = ms`5m`,
  Normal = ms`1m`,
  Fast = ms`12s`, // 12 seconds, block times for mainnet
  LightningMcQueen = ms`3s`, // 3 seconds, approx block times for polygon
}

// Polls a query only when the current component is mounted, as useQuery's pollInterval prop will continue to poll after unmount
export function usePollQueryWhileMounted<T, K>(queryResult: QueryResult<T, K>, interval: PollingInterval) {
  const { startPolling, stopPolling } = queryResult

  useEffect(() => {
    startPolling(interval)
    return stopPolling
  }, [interval, startPolling, stopPolling])

  return queryResult
}

export enum TimePeriod {
  HOUR,
  DAY,
  WEEK,
  MONTH,
  YEAR,
}

export function toHistoryDuration(timePeriod: TimePeriod): HistoryDuration {
  switch (timePeriod) {
    case TimePeriod.HOUR:
      return HistoryDuration.Hour
    case TimePeriod.DAY:
      return HistoryDuration.Day
    case TimePeriod.WEEK:
      return HistoryDuration.Week
    case TimePeriod.MONTH:
      return HistoryDuration.Month
    case TimePeriod.YEAR:
      return HistoryDuration.Year
  }
}

export function getStartTimestamp(duration: HistoryDuration): string {
  switch (duration) {
    case HistoryDuration.Hour:
      return Math.floor(Date.now() / 1000) - 3600 + ''
    case HistoryDuration.Day:
      return Math.floor(Date.now() / 1000) - 86400 + ''
    case HistoryDuration.Week:
      return Math.floor(Date.now() / 1000) - 604800 + ''
    case HistoryDuration.Month:
      return Math.floor(Date.now() / 1000) - 2592000 + ''
    case HistoryDuration.Year:
      return Math.floor(Date.now() / 1000) - 31536000 + ''
    default:
      return Math.floor(Date.now() / 1000) - 86400 + ''
  }
}

export type PricePoint = { timestamp: number; value: number }

export function isPricePoint(p: PricePoint | null): p is PricePoint {
  return p !== null
}

export const CHAIN_ID_TO_BACKEND_NAME: { [key: number]: Chain } = {
  [SupportedChainId.MAINNET]: Chain.Ethereum,
  [SupportedChainId.GOERLI]: Chain.EthereumGoerli,
  [SupportedChainId.POLYGON]: Chain.Polygon,
  [SupportedChainId.POLYGON_MUMBAI]: Chain.Polygon,
  [SupportedChainId.CELO]: Chain.Celo,
  [SupportedChainId.CELO_ALFAJORES]: Chain.Celo,
  [SupportedChainId.ARBITRUM_ONE]: Chain.Arbitrum,
  [SupportedChainId.ARBITRUM_GOERLI]: Chain.Arbitrum,
  [SupportedChainId.OPTIMISM]: Chain.Optimism,
  [SupportedChainId.OPTIMISM_GOERLI]: Chain.Optimism,
  [SupportedChainId.BNB]: Chain.Bnb,
  [SupportedChainId.ZKSYNC_TESTNET]: Chain.ZksyncTestnet,
  [SupportedChainId.ZKSYNC_MAINNET]: Chain.ZksyncMainnet,
  [SupportedChainId.BASE_TESTNET]: Chain.BaseTestnet,
  [SupportedChainId.BASE_MAINNET]: Chain.BaseMainnet,
  [SupportedChainId.OPBNB_TESTNET]: Chain.OpbnbTestnet,
  [SupportedChainId.OPBNB_MAINNET]: Chain.OpbnbMainnet,
}

export function chainIdToBackendName(chainId: number | undefined) {
  return chainId && CHAIN_ID_TO_BACKEND_NAME[chainId]
    ? CHAIN_ID_TO_BACKEND_NAME[chainId]
    : CHAIN_ID_TO_BACKEND_NAME[SupportedChainId.ZKSYNC_MAINNET]
}

const GQL_CHAINS: number[] = [
  SupportedChainId.MAINNET,
  SupportedChainId.OPTIMISM,
  SupportedChainId.POLYGON,
  SupportedChainId.ARBITRUM_ONE,
  SupportedChainId.CELO,
]

export function isGqlSupportedChain(chainId: number | undefined): chainId is SupportedChainId {
  return !!chainId && GQL_CHAINS.includes(chainId)
}
export function toContractInput(currency: Currency): ContractInput {
  const chain = chainIdToBackendName(currency.chainId)
  return { chain, address: currency.isToken ? currency.address : getNativeTokenDBAddress(chain) }
}

export function gqlToCurrency(token: {
  address?: string
  chain: Chain
  standard?: TokenStandard
  decimals?: number
  name?: string
  symbol?: string
}): Currency {
  const chainId = fromGraphQLChain(token.chain)
  if (token.standard === TokenStandard.Native || !token.address) return nativeOnChain(chainId)
  else return new Token(chainId, token.address, token.decimals ?? 18, token.name, token.symbol)
}

const URL_CHAIN_PARAM_TO_BACKEND: { [key: string]: Chain } = {
  zksync_testnet: Chain.ZksyncTestnet,
  zksync_mainnet: Chain.ZksyncMainnet,
  base_testnet: Chain.BaseTestnet,
  base_mainnet: Chain.BaseMainnet,
  opbnb_testnet: Chain.OpbnbTestnet,
  opbnb_mainnet: Chain.OpbnbMainnet,
}

export function validateUrlChainParam(chainName: string | undefined) {
  return chainName && URL_CHAIN_PARAM_TO_BACKEND[chainName.toLowerCase()]
    ? URL_CHAIN_PARAM_TO_BACKEND[chainName.toLowerCase()]
    : process.env.REACT_APP_IS_TESTSITE === 'false'
    ? Chain.ZksyncMainnet
    : Chain.ZksyncTestnet
}

// TODO(cartcrom): refactor into safer lookup & replace usage
export const CHAIN_NAME_TO_CHAIN_ID: { [key in Chain]: SupportedChainId } = {
  [Chain.Ethereum]: SupportedChainId.MAINNET,
  [Chain.EthereumGoerli]: SupportedChainId.GOERLI,
  [Chain.Polygon]: SupportedChainId.POLYGON,
  [Chain.Celo]: SupportedChainId.CELO,
  [Chain.Optimism]: SupportedChainId.OPTIMISM,
  [Chain.Arbitrum]: SupportedChainId.ARBITRUM_ONE,
  [Chain.UnknownChain]: SupportedChainId.MAINNET,
  [Chain.Bnb]: SupportedChainId.BNB,
  [Chain.BnbTestnet]: SupportedChainId.BNB_TESTNET,
  [Chain.ZksyncTestnet]: SupportedChainId.ZKSYNC_TESTNET,
  [Chain.ZksyncMainnet]: SupportedChainId.ZKSYNC_MAINNET,
  [Chain.BaseTestnet]: SupportedChainId.BASE_TESTNET,
  [Chain.BaseMainnet]: SupportedChainId.BASE_MAINNET,
  [Chain.OpbnbTestnet]: SupportedChainId.OPBNB_TESTNET,
  [Chain.OpbnbMainnet]: SupportedChainId.OPBNB_MAINNET,
}

export function fromGraphQLChain(chain: Chain): SupportedChainId {
  return CHAIN_NAME_TO_CHAIN_ID[chain]
}

// eslint-disable-next-line import/no-unused-modules
export const BACKEND_CHAIN_NAMES: Chain[] = [
  Chain.ZksyncTestnet,
  Chain.ZksyncMainnet,
  Chain.BaseTestnet,
  Chain.BaseMainnet,
  Chain.OpbnbTestnet,
  Chain.OpbnbMainnet,
]

export const DERPDEX_BACKEND_CHAIN_NAMES: Chain[] =
  process.env.REACT_APP_IS_TESTSITE === 'true'
    ? [Chain.ZksyncTestnet, Chain.BaseTestnet, Chain.OpbnbTestnet]
    : [Chain.ZksyncMainnet, Chain.BaseMainnet, Chain.OpbnbMainnet]

export function getTokenDetailsURL({
  address,
  chain,
  inputAddress,
}: {
  address?: string | null
  chain: Chain
  inputAddress?: string | null
}) {
  const chainName = chain.toLowerCase()
  const tokenAddress = address ?? NATIVE_CHAIN_ID
  const inputAddressSuffix = inputAddress ? `?inputCurrency=${inputAddress}` : ''
  //! NOTE: /tokens/ is the original route, but we're using /swap/ for now
  // return `/tokens/${chainName}/${tokenAddress}${inputAddressSuffix}`
  return `/token/${chainName}/${tokenAddress}${inputAddressSuffix}`
}

export function getTokenDetailsURLSubgraph(token: any, chain: Chain) {
  const chainName = chain.toLowerCase()
  const tokenAddress = token.token.id ?? NATIVE_CHAIN_ID
  const inputAddressSuffix = ''
  //! NOTE: /tokens/ is the original route, but we're using /swap/ for now
  // return `/swap?outputCurrency=${tokenAddress}${inputAddressSuffix}`
  return `/token/${chainName}/${tokenAddress}${inputAddressSuffix}`
}

export function unwrapToken<
  T extends {
    address?: string | null | undefined
  } | null
>(chainId: number, token: T): T {
  if (!token?.address) return token

  const address = token.address.toLowerCase()
  const nativeAddress = WRAPPED_NATIVE_CURRENCY[chainId]?.address.toLowerCase()
  if (address !== nativeAddress) return token

  const nativeToken = nativeOnChain(chainId)
  return {
    ...token,
    ...nativeToken,
    address: NATIVE_CHAIN_ID,
    extensions: undefined, // prevents marking cross-chain wrapped tokens as native
  }
}
