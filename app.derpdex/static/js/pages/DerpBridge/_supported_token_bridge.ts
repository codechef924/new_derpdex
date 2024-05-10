/* eslint-disable import/no-unused-modules */
import { SupportedChainId } from 'constants/chains'

export interface INSCRIPTION {
  p: string
  op: string
  tick: string
  amt: string
}

export interface BRIDGE_INFO {
  chainId?: number
  name: string
  symbol: string
  logoURI: string
  inscription: INSCRIPTION
}

export interface BRIDGE_INFO_SUPPORTED_TOKEN {
  name: string
  symbol: string
  logoURI: string
  chainId: number
  address: string
  decimals: number
}

const EthereumTokens: BRIDGE_INFO_SUPPORTED_TOKEN[] = [
  {
    name: 'DERP',
    symbol: 'DERP',
    logoURI: 'https://raw.githubusercontent.com/derpdex-official/token-list/main/assets/derp.png',
    address: '0x5dfc78c4d073fd343bc6661668948178522a0de5',
    chainId: SupportedChainId.MAINNET,
    decimals: 18,
  },
]

const GoerliTokens: BRIDGE_INFO_SUPPORTED_TOKEN[] = []

const ZkSyncTokens: BRIDGE_INFO_SUPPORTED_TOKEN[] = [
  {
    name: 'DERP',
    symbol: 'DERP',
    logoURI: 'https://raw.githubusercontent.com/derpdex-official/token-list/main/assets/derp.png',
    address: '0x0bf4cb727b3f8092534d793893b2cc3348963dbf',
    chainId: SupportedChainId.ZKSYNC_MAINNET,
    decimals: 18,
  },
]

const ZkSyncTestnetTokens: BRIDGE_INFO_SUPPORTED_TOKEN[] = [
  {
    name: 'DERP',
    symbol: 'DERP',
    logoURI: 'https://raw.githubusercontent.com/derpdex-official/token-list/main/assets/derp.png',
    address: '0xB5Ae4151A015F89d81a37EA4088AF8a4aDC56961',
    chainId: SupportedChainId.ZKSYNC_TESTNET,
    decimals: 18,
  },
]

const opbnbMainnetTokens: BRIDGE_INFO_SUPPORTED_TOKEN[] = [
  {
    name: 'DERP',
    symbol: 'DERP',
    logoURI: 'https://raw.githubusercontent.com/derpdex-official/token-list/main/assets/derp.png',
    address: '0xebb78043e29f4af24e6266a7d142f5a08443969e',
    chainId: SupportedChainId.OPBNB_MAINNET,
    decimals: 18,
  },
]

const opbnbTestnetTokens: BRIDGE_INFO_SUPPORTED_TOKEN[] = [
  {
    name: 'DERP',
    symbol: 'DERP',
    logoURI: 'https://raw.githubusercontent.com/derpdex-official/token-list/main/assets/derp.png',
    address: '0xfc7a7e0f0bd541951cf820234435a18acb75f05d',
    chainId: SupportedChainId.OPBNB_TESTNET,
    decimals: 18,
  },
]

const baseMainnetTokens: BRIDGE_INFO_SUPPORTED_TOKEN[] = [
  {
    name: 'DERP',
    symbol: 'DERP',
    logoURI: 'https://raw.githubusercontent.com/derpdex-official/token-list/main/assets/derp.png',
    address: '0xebb78043e29f4af24e6266a7d142f5a08443969e',
    chainId: SupportedChainId.BASE_MAINNET,
    decimals: 18,
  },
]

const baseTestnetTokens: BRIDGE_INFO_SUPPORTED_TOKEN[] = [
  {
    name: 'DERP',
    symbol: 'DERP',
    logoURI: 'https://raw.githubusercontent.com/derpdex-official/token-list/main/assets/derp.png',
    address: '0x13abf8d13a8385ccc7112d88c9f4667d6e9383f2',
    chainId: SupportedChainId.BASE_TESTNET,
    decimals: 18,
  },
]

export const SupportedTokenBridge: { [key: number]: BRIDGE_INFO_SUPPORTED_TOKEN[] } = {
  [SupportedChainId.ZKSYNC_MAINNET]: ZkSyncTokens,
  [SupportedChainId.ZKSYNC_TESTNET]: ZkSyncTestnetTokens,
  [SupportedChainId.OPBNB_MAINNET]: opbnbMainnetTokens,
  [SupportedChainId.OPBNB_TESTNET]: opbnbTestnetTokens,
  [SupportedChainId.BASE_MAINNET]: baseMainnetTokens,
  [SupportedChainId.BASE_TESTNET]: baseTestnetTokens,
  [SupportedChainId.MAINNET]: EthereumTokens,
  [SupportedChainId.GOERLI]: GoerliTokens,
}

export const SupportedNetworks =
  process.env.REACT_APP_IS_TESTSITE === 'true'
    ? [
        SupportedChainId.OPBNB_TESTNET,
        SupportedChainId.BASE_TESTNET,
        SupportedChainId.ZKSYNC_TESTNET,
        SupportedChainId.GOERLI,
      ]
    : [
        SupportedChainId.OPBNB_MAINNET,
        SupportedChainId.BASE_MAINNET,
        SupportedChainId.ZKSYNC_MAINNET,
        SupportedChainId.MAINNET,
      ]

export const getSupportedBrigeAssets = (chainId: number): BRIDGE_INFO_SUPPORTED_TOKEN[] => {
  return SupportedTokenBridge[chainId]
}

export const L1_BRIDGE = [
  SupportedChainId.GOERLI,
  SupportedChainId.MAINNET,
  SupportedChainId.ZKSYNC_MAINNET,
  SupportedChainId.ZKSYNC_TESTNET,
]

export const L1_OPBNB_BRIDGE = [
  SupportedChainId.OPBNB_MAINNET,
  SupportedChainId.OPBNB_TESTNET,
  SupportedChainId.BNB,
  SupportedChainId.BNB_TESTNET,
]
