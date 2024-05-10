import { ZKSYNC_POOL_INIT_CODE_HASH } from '@derpdex/sdk'

import { SupportedChainId } from './../constants/chains'
/* eslint-disable import/no-unused-modules */
export const FACTORY_ADDRESS = '0x52A1865eb6903BC777A02Ae93159105015CA1517'

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'

export const POOL_INIT_CODE_HASH = ZKSYNC_POOL_INIT_CODE_HASH

/**
 * The default factory enabled fee amounts, denominated in hundredths of bips.
 */
export enum FeeAmount {
  LOWEST = 100,
  LOW = 500,
  MEDIUM = 3000,
  HIGH = 10000,
}

/**
 * The default factory tick spacings by fee amount.
 */
export const TICK_SPACINGS: { [amount in FeeAmount]: number } = {
  [FeeAmount.LOWEST]: 1,
  [FeeAmount.LOW]: 10,
  [FeeAmount.MEDIUM]: 60,
  [FeeAmount.HIGH]: 200,
}

export const POOL_HIDE: { [key: string]: string[] } = {
  [SupportedChainId.GOERLI]: [],
  [SupportedChainId.MAINNET]: [],
  [SupportedChainId.POLYGON]: [],
  [SupportedChainId.ARBITRUM_GOERLI]: [],
  [SupportedChainId.ARBITRUM_ONE]: [],
  [SupportedChainId.OPTIMISM]: [],
  [SupportedChainId.CELO]: [],
  [SupportedChainId.BNB]: [],
  [SupportedChainId.ZKSYNC_TESTNET]: [],
  [SupportedChainId.ZKSYNC_MAINNET]: [],
  [SupportedChainId.BASE_TESTNET]: [],
  [SupportedChainId.BASE_MAINNET]: [],
  [SupportedChainId.OPBNB_TESTNET]: [],
  [SupportedChainId.OPBNB_MAINNET]: [],
}
