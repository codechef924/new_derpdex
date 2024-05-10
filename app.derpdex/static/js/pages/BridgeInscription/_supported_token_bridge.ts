/* eslint-disable import/no-unused-modules */
import { useWeb3React } from '@web3-react/core'
import { SupportedChainId } from 'constants/chains'
import { useState } from 'react'

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

export const SAMPLE_INSCRIPTIONS = [
  {
    name: 'derps',
    symbol: 'derps',
    logoURI: 'https://raw.githubusercontent.com/derpdex-official/inscription-assets/main/assets/derps.png',
    inscription: {
      p: 'derp-20',
      op: 'mint',
      tick: 'derps',
      amt: '1000',
    },
  },
]

const mainnetAndZkSyncTokens: BRIDGE_INFO[] = SAMPLE_INSCRIPTIONS

const goerliAndZkSyncTokens: BRIDGE_INFO[] = SAMPLE_INSCRIPTIONS

export const SupportedTokenBridge: { [key: number]: BRIDGE_INFO[] } = {
  [SupportedChainId.MAINNET]: mainnetAndZkSyncTokens,
  [SupportedChainId.ZKSYNC_MAINNET]: mainnetAndZkSyncTokens,
  [SupportedChainId.ZKSYNC_TESTNET]: goerliAndZkSyncTokens,
  [SupportedChainId.GOERLI]: goerliAndZkSyncTokens,
}

export const getSupportedBrigeAssets = (chainId: number): BRIDGE_INFO[] => {
  return SupportedTokenBridge[chainId]
}

export const useConstructedBridgeAssets = () => {
  const [bridgeAssets, setBridgeAssets] = useState([])
}

export const getBridgeDepositAddress: { [key: number]: string } = {
  [SupportedChainId.MAINNET]: '0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063',
  [SupportedChainId.GOERLI]: '0x927DdFcc55164a59E0F33918D13a2D559bC10ce7',
  [SupportedChainId.BNB_TESTNET]: '0x677311Fd2cCc511Bbc0f581E8d9a07B033D5E840',
  [SupportedChainId.BNB]: '0xF05F0e4362859c3331Cb9395CBC201E3Fa6757Ea',
}

const TESTNET_BRIDGE_DEPOSIT_ADDRESS: { [key: number]: string } = {
  [SupportedChainId.GOERLI]: '0x927DdFcc55164a59E0F33918D13a2D559bC10ce7',
  [SupportedChainId.BNB_TESTNET]: '0x677311Fd2cCc511Bbc0f581E8d9a07B033D5E840',
}

const MAINNET_BRIDGE_DEPOSIT_ADDRESS: { [key: number]: string } = {
  [SupportedChainId.MAINNET]: '0x927DdFcc55164a59E0F33918D13a2D559bC10ce7',
  [SupportedChainId.BNB]: '0xF05F0e4362859c3331Cb9395CBC201E3Fa6757Ea',
}

export const BRIDGE_DEPOSIT_ADDRESS =
  process.env.REACT_APP_IS_TESTSITE === 'true' ? TESTNET_BRIDGE_DEPOSIT_ADDRESS : MAINNET_BRIDGE_DEPOSIT_ADDRESS

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

// TODO: [Inscriptions] UPDATE FOR THE INSCRIPTIONS ASSET
// REPOSITORY: https://github.com/derpdex-official/inscription-assets
export const LINK_TO_BRIDGE_FILE: { [key: number]: string } = {
  [SupportedChainId.MAINNET]: '',
  [SupportedChainId.ZKSYNC_MAINNET]: '',
  [SupportedChainId.ZKSYNC_TESTNET]: '',
  [SupportedChainId.GOERLI]: '',
  [SupportedChainId.BNB]: '',
  [SupportedChainId.BNB_TESTNET]: '',
  [SupportedChainId.OPBNB_MAINNET]:
    'https://raw.githubusercontent.com/derpdex-official/inscription-assets/main/opbnb_mainnet_supported_token_bridge.json',
  [SupportedChainId.OPBNB_TESTNET]:
    'https://raw.githubusercontent.com/derpdex-official/inscription-assets/main/opbnb_testnet_supported_token_bridge.json',
}

export const useFetchTokenBridge = () => {
  const [isLoadingAsset, setIsLoadingAsset] = useState<boolean>(false)
  const [tokenToBridge, setTokenToBridge] = useState<BRIDGE_INFO[]>()
  const { chainId } = useWeb3React()
  const fetchTokenBridge = async () => {
    try {
      if (chainId) {
        setIsLoadingAsset(true)
        const url = LINK_TO_BRIDGE_FILE[chainId]
        const response = await fetch(url, {
          cache: 'no-cache',
        })
        if (response.ok) {
          const result = await response.json()
          setIsLoadingAsset(false)
          setTokenToBridge(result)
        }
      }
    } catch (err) {
      setIsLoadingAsset(false)
      console.log('[Error fetching bridge]', err)
    }
  }
  return {
    tokenToBridge,
    isLoadingAsset,
    fetchTokenBridge,
  }
}
