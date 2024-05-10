/*
 * SupportedChainId must be defined inline, without using @uniswap/sdk-core, so that its members are their own types
 * {@see https://www.typescriptlang.org/docs/handbook/enums.html#union-enums-and-enum-member-types}. This allows the
 * derived const arrays and their types (eg {@link L1_CHAIN_IDS}, {@link SupportedL1ChainId}) to be narrowed and used
 * to enforce chain typing.
 *
 * Because this is not explicitly derived from @uniswap/sdk-core, there is a unit test to enforce conformance.
 */
export enum SupportedChainId {
  MAINNET = 1,
  GOERLI = 5,

  ARBITRUM_ONE = 42161,
  ARBITRUM_GOERLI = 421613,

  OPTIMISM = 10,
  OPTIMISM_GOERLI = 420,

  POLYGON = 137,
  POLYGON_MUMBAI = 80001,

  CELO = 42220,
  CELO_ALFAJORES = 44787,

  BNB = 56,
  BNB_TESTNET = 97,

  ZKSYNC_TESTNET = 280,
  ZKSYNC_MAINNET = 324,

  BASE_TESTNET = 84532,
  BASE_MAINNET = 8453,

  OPBNB_TESTNET = 5611,
  OPBNB_MAINNET = 204,
}

export const UniWalletSupportedChains = [
  SupportedChainId.MAINNET,
  SupportedChainId.ARBITRUM_ONE,
  SupportedChainId.OPTIMISM,
  SupportedChainId.POLYGON,
]

export const CHAIN_IDS_TO_NAMES = {
  [SupportedChainId.MAINNET]: 'mainnet',
  [SupportedChainId.GOERLI]: 'goerli',
  [SupportedChainId.POLYGON]: 'polygon',
  [SupportedChainId.POLYGON_MUMBAI]: 'polygon_mumbai',
  [SupportedChainId.CELO]: 'celo',
  [SupportedChainId.CELO_ALFAJORES]: 'celo_alfajores',
  [SupportedChainId.ARBITRUM_ONE]: 'arbitrum',
  [SupportedChainId.ARBITRUM_GOERLI]: 'arbitrum_goerli',
  [SupportedChainId.OPTIMISM]: 'optimism',
  [SupportedChainId.OPTIMISM_GOERLI]: 'optimism_goerli',
  [SupportedChainId.BNB]: 'bnb',
  [SupportedChainId.BNB_TESTNET]: 'bnb_testnet',
  [SupportedChainId.ZKSYNC_TESTNET]: 'zksync_testnet',
  [SupportedChainId.ZKSYNC_MAINNET]: 'zksync_mainnet',
  [SupportedChainId.BASE_TESTNET]: 'base_testnet',
  [SupportedChainId.BASE_MAINNET]: 'base_mainnet',
  [SupportedChainId.OPBNB_TESTNET]: 'opbnb_testnet',
  [SupportedChainId.OPBNB_MAINNET]: 'opbnb_mainnet',
}

/**
 * Array of all the supported chain IDs
 */
export const ALL_SUPPORTED_CHAIN_IDS: SupportedChainId[] = Object.values(SupportedChainId).filter(
  (id) => typeof id === 'number'
) as SupportedChainId[]

export function isSupportedChain(chainId: number | null | undefined): chainId is SupportedChainId {
  return !!chainId && !!SupportedChainId[chainId]
}

export function isSupportedProtocolChain(chainId: number | null | undefined): chainId is SupportedChainId {
  const isTestnet = process.env.REACT_APP_IS_TESTSITE === 'true'
  return isSupportedChain(chainId) && isTestnet
    ? chainId == SupportedChainId.GOERLI ||
        chainId == (SupportedChainId.ZKSYNC_TESTNET as any) ||
        chainId == (SupportedChainId.BASE_TESTNET as any) ||
        chainId == (SupportedChainId.OPBNB_TESTNET as any) ||
        chainId == (SupportedChainId.BNB_TESTNET as any)
    : chainId == SupportedChainId.MAINNET ||
        chainId == (SupportedChainId.ZKSYNC_MAINNET as any) ||
        chainId == (SupportedChainId.BASE_MAINNET as any) ||
        chainId == (SupportedChainId.OPBNB_MAINNET as any) ||
        chainId == (SupportedChainId.BNB as any)
}

export const SUPPORTED_GAS_ESTIMATE_CHAIN_IDS = [
  SupportedChainId.MAINNET,
  SupportedChainId.POLYGON,
  SupportedChainId.CELO,
  SupportedChainId.OPTIMISM,
  SupportedChainId.ARBITRUM_ONE,
  SupportedChainId.BNB,
  SupportedChainId.ZKSYNC_TESTNET,
  SupportedChainId.ZKSYNC_MAINNET,
  SupportedChainId.BASE_TESTNET,
  SupportedChainId.BASE_MAINNET,
  SupportedChainId.OPBNB_TESTNET,
  SupportedChainId.OPBNB_MAINNET,
] as const

/**
 * Unsupported networks for V2 pool behavior.
 */
export const UNSUPPORTED_V2POOL_CHAIN_IDS = [
  SupportedChainId.POLYGON,
  SupportedChainId.OPTIMISM,
  SupportedChainId.ARBITRUM_ONE,
  SupportedChainId.BNB,
  SupportedChainId.ARBITRUM_GOERLI,
  SupportedChainId.ZKSYNC_TESTNET,
  SupportedChainId.ZKSYNC_MAINNET,
  SupportedChainId.BASE_TESTNET,
  SupportedChainId.BASE_MAINNET,
  SupportedChainId.OPBNB_TESTNET,
  SupportedChainId.OPBNB_MAINNET,
] as const

export const TESTNET_CHAIN_IDS = [
  SupportedChainId.GOERLI,
  SupportedChainId.POLYGON_MUMBAI,
  SupportedChainId.ARBITRUM_GOERLI,
  SupportedChainId.OPTIMISM_GOERLI,
  SupportedChainId.ZKSYNC_TESTNET,
  SupportedChainId.BASE_TESTNET,
  SupportedChainId.OPBNB_TESTNET,
] as const

export type SupportedTestnetChainId = typeof TESTNET_CHAIN_IDS[number]

/**
 * All the chain IDs that are running the Ethereum protocol.
 */
export const L1_CHAIN_IDS = [
  SupportedChainId.MAINNET,
  SupportedChainId.GOERLI,
  SupportedChainId.POLYGON,
  SupportedChainId.POLYGON_MUMBAI,
  SupportedChainId.CELO,
  SupportedChainId.CELO_ALFAJORES,
  SupportedChainId.BNB,
] as const

export type SupportedL1ChainId = typeof L1_CHAIN_IDS[number]

/**
 * Controls some L2 specific behavior, e.g. slippage tolerance, special UI behavior.
 * The expectation is that all of these networks have immediate transaction confirmation.
 */
export const L2_CHAIN_IDS = [
  SupportedChainId.ARBITRUM_ONE,
  SupportedChainId.ARBITRUM_GOERLI,
  SupportedChainId.OPTIMISM,
  SupportedChainId.OPTIMISM_GOERLI,
  SupportedChainId.ZKSYNC_TESTNET,
  SupportedChainId.ZKSYNC_MAINNET,
  SupportedChainId.BASE_TESTNET,
  SupportedChainId.BASE_MAINNET,
  SupportedChainId.OPBNB_TESTNET,
  SupportedChainId.OPBNB_MAINNET,
] as const

export type SupportedL2ChainId = typeof L2_CHAIN_IDS[number]

export function isPolygonChain(chainId: number): chainId is SupportedChainId.POLYGON | SupportedChainId.POLYGON_MUMBAI {
  return chainId === SupportedChainId.POLYGON || chainId === SupportedChainId.POLYGON_MUMBAI
}

const BRIDGABLE_CHAIN_LIST =
  process.env.REACT_APP_IS_TESTSITE === 'false'
    ? [SupportedChainId.ZKSYNC_MAINNET, SupportedChainId.OPBNB_MAINNET, SupportedChainId.MAINNET, SupportedChainId.BNB]
    : [
        SupportedChainId.ZKSYNC_TESTNET,
        SupportedChainId.OPBNB_TESTNET,
        SupportedChainId.GOERLI,
        SupportedChainId.BNB_TESTNET,
      ]

export const ALLOWED_CHAIN_FOR_BRIDGE = BRIDGABLE_CHAIN_LIST

export const GENESIS_API_URL = 'https://rewards.derpdex.com'
