/* eslint-disable import/no-unused-modules */
import { useWeb3React } from '@web3-react/core'
import { SupportedChainId } from 'constants/chains'
import { RPC_PROVIDERS } from 'constants/providers'
import { Contract } from 'ethers'
import { useEffect, useState } from 'react'

import YieldBoosterABI from '../abis/yieldbooster.abi.json'
import { YIELD_BOOSTER_ADDRESSES_BY_CHAINID } from '../constants'

type CustomArray = [number, number]

type TMultiplier = {
  min: number
  max: number
}

export const useGetMultipliers = ({
  poolAddress,
  shouldGetMultiplier,
  chainId,
}: {
  poolAddress: string
  shouldGetMultiplier: boolean
  chainId: SupportedChainId
}) => {
  const [isLoadingMultiplier, setIsLoadingMultiplier] = useState<boolean>(false)
  const { chainId: connectedChainId, provider } = useWeb3React()
  const [multipliers, setMultipliers] = useState<TMultiplier | null>(null)

  const getMultipliers = async () => {
    setIsLoadingMultiplier(true)
    try {
      if (!chainId || !provider || !RPC_PROVIDERS[chainId]) throw 'No chainId/provider'
      const contract = new Contract(
        YIELD_BOOSTER_ADDRESSES_BY_CHAINID[chainId],
        YieldBoosterABI,
        RPC_PROVIDERS[chainId]
      )
      const answer = (await contract.poolMultipliers(poolAddress)) as CustomArray

      setMultipliers({
        min: answer[0] === 0 ? 1 : answer[0] / 1000,
        max: answer[1] === 0 ? 1 : answer[1] / 1000,
      })
    } catch (error) {
      console.log('[Err getMultipliers]', error)
    } finally {
      setIsLoadingMultiplier(false)
    }
  }

  useEffect(() => {
    if (shouldGetMultiplier) {
      getMultipliers()
    }
  }, [poolAddress, chainId])

  return {
    multipliers,
    isLoadingMultiplier,
  }
}
