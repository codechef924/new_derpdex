/* eslint-disable import/no-unused-modules */
import { Token } from '@uniswap/sdk-core'
import { WRAPPED_NATIVE_CURRENCY } from 'constants/tokens'

export interface SerializedToken {
  chainId: number
  address: string
  decimals: number
  symbol?: string
  name?: string
}

export function serializeToken(token: Token): SerializedToken {
  return {
    chainId: token.chainId,
    address: token.address,
    decimals: token.decimals,
    symbol: token.symbol,
    name: token.name,
  }
}

export function formatTokenSymbol(address: string, symbol: string, chainId?: number) {
  if (chainId && WRAPPED_NATIVE_CURRENCY[chainId]?.address.includes(address)) {
    return WRAPPED_NATIVE_CURRENCY[chainId]?.symbol || 'ETH'
  }
  return symbol
}

export function formatTokenName(address: string, name: string, chainId?: number) {
  if (chainId && WRAPPED_NATIVE_CURRENCY[chainId]?.address.includes(address)) {
    return WRAPPED_NATIVE_CURRENCY[chainId]?.name || 'Ether'
  }
  return name
}
