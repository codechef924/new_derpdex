import { SupportedChainId } from 'constants/chains'

const BRIDGABLE_CHAIN_LIST =
  process.env.REACT_APP_IS_TESTSITE === 'false'
    ? [
        SupportedChainId.OPBNB_MAINNET,
        SupportedChainId.BASE_MAINNET,
        SupportedChainId.ZKSYNC_MAINNET,
        SupportedChainId.MAINNET,
      ]
    : [
        SupportedChainId.OPBNB_TESTNET,
        SupportedChainId.BASE_TESTNET,
        SupportedChainId.ZKSYNC_TESTNET,
        SupportedChainId.GOERLI,
      ]

// eslint-disable-next-line import/no-unused-modules
export const ALLOWED_CHAIN_FOR_BRIDGE = BRIDGABLE_CHAIN_LIST

// eslint-disable-next-line import/no-unused-modules
export const BRIDGE_CONTRACT_ADDRESS = {
  [SupportedChainId.OPBNB_TESTNET]: '0x913cb491fff7e70b9aaad913a32516b7586ac696',
  [SupportedChainId.OPBNB_MAINNET]: '0xdfA09BD7ab84b85f0185511A57ac10082fd5D13e',
  [SupportedChainId.BASE_TESTNET]: '0xFBb52A5235931B53f370Db40Ef0a9d9e374D05bD',
  [SupportedChainId.BASE_MAINNET]: '0xcbce3d21b3f58770a774c104f6b01e179be321a7',
  [SupportedChainId.ZKSYNC_TESTNET]: '0x1E6F223e99D4Da3242E0837D174844E734d09Db1',
  [SupportedChainId.ZKSYNC_MAINNET]: '0x63Ecfc300DCBE1b20c1d463B082A1CF336e46CC9',
  [SupportedChainId.MAINNET]: '0x777dc769bb69f3fd12846a928193765847f234af',
  [SupportedChainId.GOERLI]: '',
}
