/* eslint-disable import/no-unused-modules */
import { useWeb3React } from '@web3-react/core'
import { SupportedChainId } from 'constants/chains'
import { useEffect, useState } from 'react'

export const L1Chain = [
  SupportedChainId.MAINNET,
  SupportedChainId.GOERLI,
  SupportedChainId.BNB,
  SupportedChainId.BNB_TESTNET,
]
export const L2Chain = [
  SupportedChainId.ZKSYNC_MAINNET,
  SupportedChainId.ZKSYNC_TESTNET,
  SupportedChainId.OPBNB_MAINNET,
  SupportedChainId.OPBNB_TESTNET,
]

export const useNetworkChange = () => {
  const [desiredChainId, setDesiredChainId] = useState<number | undefined>(undefined)
  const [isChangedtoL1, setIsChangedtoL1] = useState<boolean>(false)
  const [isChangedtoL2, setIsChangedtoL2] = useState<boolean>(false)

  const { chainId, provider, connector } = useWeb3React()

  useEffect(() => {
    if (chainId && L1Chain.includes(chainId)) {
      if (process.env.REACT_APP_IS_TESTSITE === 'true') {
        setIsChangedtoL1(chainId === SupportedChainId.GOERLI || chainId === SupportedChainId.BNB_TESTNET)
      } else {
        setIsChangedtoL1(chainId === SupportedChainId.MAINNET || chainId === SupportedChainId.BNB)
      }
    } else {
      setIsChangedtoL1(false)
    }
  }, [chainId])

  useEffect(() => {
    if (chainId && L2Chain.includes(chainId)) {
      setIsChangedtoL2(true)
    } else {
      setIsChangedtoL2(false)
    }
  }, [chainId])

  const changeNetwork = async () => {
    try {
      if (chainId && provider) {
        switch (chainId) {
          case SupportedChainId.ZKSYNC_MAINNET:
            await connector.activate(SupportedChainId.MAINNET)
            break
          case SupportedChainId.MAINNET:
            await connector.activate(SupportedChainId.ZKSYNC_MAINNET)
            break
          case SupportedChainId.ZKSYNC_TESTNET:
            await connector.activate(SupportedChainId.GOERLI)
            break
          case SupportedChainId.GOERLI:
            await connector.activate(SupportedChainId.ZKSYNC_TESTNET)
            break
          case SupportedChainId.OPBNB_TESTNET:
            await connector.activate(SupportedChainId.BNB_TESTNET)
            break
          case SupportedChainId.BNB_TESTNET:
            await connector.activate(SupportedChainId.OPBNB_TESTNET)
            break
          case SupportedChainId.OPBNB_MAINNET:
            await connector.activate(SupportedChainId.BNB)
            break
          case SupportedChainId.BNB:
            await connector.activate(SupportedChainId.OPBNB_MAINNET)
            break
          default:
            throw 'Unable to activate network'
        }

        return true
      } else {
        setIsChangedtoL1(true)
        console.log('Already connected to current network')
        return true
      }
    } catch (error) {
      setIsChangedtoL1(false)
      console.error('Error switching to current network:', error)
      return false
    }
  }

  const changeNetworkById = async (initiateChainId: number) => {
    try {
      if (chainId !== initiateChainId && provider && window.ethereum) {
        await connector.activate(initiateChainId)

        setIsChangedtoL2(true)
      } else {
        setIsChangedtoL2(true)
        console.log('Already connected to Desired network')
      }
    } catch (error) {
      setIsChangedtoL2(false)
      console.error('Error switching to Desired network:', error)
    }
  }

  return {
    changeNetwork,
    changeNetworkById,
    isChangedtoL1,
    isChangedtoL2,
  }
}
