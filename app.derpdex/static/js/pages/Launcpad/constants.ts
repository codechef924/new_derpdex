import { SupportedChainId } from 'constants/chains'

export const LAUNCHPAD_ADDRESSES: { [key: number | SupportedChainId]: string } = {
  [SupportedChainId.ZKSYNC_MAINNET]: '0xcc33B67187A4809E54575c619D5E011661226004',
  [SupportedChainId.BASE_MAINNET]: '0x39E690c74E80541551a820F8Dc89cD1c14DDdb9A',
  [SupportedChainId.OPBNB_MAINNET]: '0x52e2cfcbF735d58882f589ecA1600a5725933917',
  [SupportedChainId.ZKSYNC_TESTNET]: '0x213F3fB544e7070C7f609cdC610f0379247E0d9b',
  [SupportedChainId.BASE_TESTNET]: '0x559b73f0c6bf6d2971d1c34790e02f833ddebdb8',
  [SupportedChainId.OPBNB_TESTNET]: '0x603E7296F14C4e06BC0c66335f0c9f1a2EC04340',
}

export const isNative = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

export const CHAINIDS =
  process.env.REACT_APP_IS_TESTSITE === 'true'
    ? [SupportedChainId.ZKSYNC_TESTNET, SupportedChainId.OPBNB_TESTNET, SupportedChainId.BASE_TESTNET]
    : [SupportedChainId.ZKSYNC_MAINNET, SupportedChainId.OPBNB_MAINNET, SupportedChainId.BASE_MAINNET]
