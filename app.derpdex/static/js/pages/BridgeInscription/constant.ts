import { SupportedChainId } from 'constants/chains'

const BRIDGABLE_CHAIN_LIST =
  process.env.REACT_APP_IS_TESTSITE === 'false' ? [SupportedChainId.OPBNB_MAINNET] : [SupportedChainId.OPBNB_TESTNET]

// eslint-disable-next-line import/no-unused-modules
export const ALLOWED_CHAIN_FOR_BRIDGE = BRIDGABLE_CHAIN_LIST

// eslint-disable-next-line import/no-unused-modules
export const BRIDGE_CONTRACT_ADDRESS = {
  [SupportedChainId.OPBNB_TESTNET]: '0x30fe32b88D7a8c82F940cDfD0e5bB0fBfd18807F',
  [SupportedChainId.OPBNB_MAINNET]: '0xf9698D423E6544A512706d6242A89DbA1647bD2F',
}

export const TOKEN_ADDRESS = [
  {
    symbol: 'derps',
    address: '0x9e5b73204cf0ca2295b115490c7b7e45911aaebe',
    chainId: SupportedChainId.OPBNB_TESTNET,
  },
  {
    symbol: 'derps',
    address: '0xd21ee5e3b2829c07d1bfebfaddff9777235c0dc7',
    chainId: SupportedChainId.OPBNB_MAINNET,
  },
]

// TODO [Inscriptions] UPDATE FOR THE INSCRIPTIONS RECEIVER
// eslint-disable-next-line import/no-unused-modules
export const INSCRIPTION_RECEIVER = '0xD83074F96adacF2741ddB5FAe5F25c916dC559dc'
