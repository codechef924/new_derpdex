/* eslint-disable import/no-unused-modules */
import { useWeb3React } from '@web3-react/core'
import { SupportedChainId } from 'constants/chains'
import { useEffect, useState } from 'react'

export const useNetworkChange = ({ targetNetwork }: { targetNetwork: SupportedChainId }) => {
  const [desiredChainId, setDesiredChainId] = useState<number | undefined>(undefined)
  const [isChangedtoL1, setIsChangedtoL1] = useState<boolean>(false)
  const [isChangedtoL2, setIsChangedtoL2] = useState<boolean>(false)

  const { chainId, provider, connector } = useWeb3React()

  useEffect(() => {
    if (chainId && targetNetwork === chainId) {
      setIsChangedtoL1(true)
    } else {
      setIsChangedtoL1(false)
    }
  }, [chainId, targetNetwork])

  useEffect(() => {
    if (chainId && targetNetwork === chainId) {
      setIsChangedtoL2(true)
    } else {
      setIsChangedtoL2(false)
    }
  }, [chainId, targetNetwork])

  const changeNetwork = async () => {
    try {
      if (chainId && provider) {
        await connector.activate(targetNetwork)

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
