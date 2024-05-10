/* eslint-disable import/no-unused-modules */
import { SupportedChainId } from 'constants/chains'

export const MAX_WIDTH_MEDIA_BREAKPOINT = '1200px'
export const XLARGE_MEDIA_BREAKPOINT = '960px'
export const LARGE_MEDIA_BREAKPOINT = '840px'
export const MEDIUM_MEDIA_BREAKPOINT = '720px'
export const SMALL_MEDIA_BREAKPOINT = '540px'
export const MOBILE_MEDIA_BREAKPOINT = '420px'

// includes chains that the backend does not current source off-chain metadata for
export const UNSUPPORTED_METADATA_CHAINS = [SupportedChainId.BNB]

export const YIELD_BOOSTER_ADDRESSES_BY_CHAINID: { [key: number | SupportedChainId]: string } = {
  [SupportedChainId.OPBNB_MAINNET]: '0xF8535f7d50F538b31920cb135A09f845FfecE2E6',
  [SupportedChainId.OPBNB_TESTNET]: '0x98FEdbDCF6000086322cb8471FC1ea977a0E21Bb',
  [SupportedChainId.BASE_MAINNET]: '0x044790d6611eF72a98D82Df7449f1514890580fA',
  [SupportedChainId.BASE_TESTNET]: '0xE55Aa1423292Ae835186b5434f30c9bd43Ef0802',
  [SupportedChainId.ZKSYNC_MAINNET]: '0xd377088F3026536682Bf58Cc74448a5B31490C46',
  [SupportedChainId.ZKSYNC_TESTNET]: '0xb1042dFdDCC15C82345933Db4378A222bb53d35C',
}

export const DERPDEX_STAKING_ADDRESSES_BY_CHAINID: { [key: number | SupportedChainId]: string } = {
  [SupportedChainId.OPBNB_MAINNET]: '0x44a8ca2C2a29c9f8893c2382DB1D9838B4c889Ed',
  [SupportedChainId.OPBNB_TESTNET]: '0x994B746f94B24059dF43F4add365b573F387caA3',
  [SupportedChainId.BASE_MAINNET]: '0xce9F4157e4f8F1de0EA0b6a887aA1fcE2a349007',
  [SupportedChainId.BASE_TESTNET]: '0xE0747A9Eb86dd0CF862d7Cfa6CA95541FdcFEA09',
  // Latest version below
  // [SupportedChainId.BASE_TESTNET]: '0x38E7804F51A340d4a04415fdcf5cb5b5d129E23c',
  [SupportedChainId.ZKSYNC_MAINNET]: '0x66643071cEd0f5d2FeFab41d0d6Ed77162479126',
  [SupportedChainId.ZKSYNC_TESTNET]: '0x547eb5735742d4bf644627709ADbBf74914b05B4',
}

export const BLOCK_TIME_BY_CHAIND: { [key: number]: number } = {
  [SupportedChainId.OPBNB_MAINNET]: 3,
  [SupportedChainId.OPBNB_TESTNET]: 3,
  [SupportedChainId.BASE_MAINNET]: 3,
  [SupportedChainId.BASE_TESTNET]: 3,
  [SupportedChainId.ZKSYNC_MAINNET]: 3,
  [SupportedChainId.ZKSYNC_TESTNET]: 3,
}

export const BLOCKS_PER_DAY = (chainId: number) => {
  return (60 / BLOCK_TIME_BY_CHAIND[chainId]) * 60 * 24
}

export const BLOCKS_PER_YEAR = (chainId: number) => {
  return BLOCKS_PER_DAY(chainId) * 365
}

export const SECONDS_IN_YEAR = 31536000 // 365 * 24 * 60 * 60
