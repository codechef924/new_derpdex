/* eslint-disable import/no-unused-modules */
import { useWeb3React } from '@web3-react/core'
import { SupportedChainId } from 'constants/chains'
import { RPC_PROVIDERS } from 'constants/providers'
import { Contract } from 'ethers'
import { incentiveDeployedsAtom } from 'hooks/useWhitelistedPoolAddresses'
import { useAtomValue } from 'jotai/utils'
import { useEffect, useState } from 'react'

import IncentiveContractAbi from '../abis/incentive_callstack.abi.json'

type StakingPoolState = {
  isLoading: boolean
  isPaused: boolean
  error: string | null
}

const initialState: StakingPoolState = {
  isLoading: false,
  isPaused: false,
  error: null,
}

export const useGetStakingPoolStatus = ({
  incentiveId,
  chainId,
}: {
  incentiveId: string
  chainId: SupportedChainId
}) => {
  const { provider } = useWeb3React()
  const [stakingPoolState, setStakingPoolState] = useState<StakingPoolState>(initialState)

  const incentiveDeployeds = useAtomValue(incentiveDeployedsAtom)

  const onGetStatus = async () => {
    try {
      setStakingPoolState({ ...initialState, isLoading: true })
      if (!provider || !chainId || !RPC_PROVIDERS[chainId]) throw 'provider or chain required'

      const incentiveContractAddress = incentiveDeployeds[incentiveId]

      if (!incentiveContractAddress) throw 'cannot find incentiveContractAddress'

      const contract = new Contract(incentiveContractAddress, IncentiveContractAbi, RPC_PROVIDERS[chainId])
      const isPaused = (await contract.isPaused()) as boolean

      if (isPaused) {
        setStakingPoolState((p) => ({ ...p, isPaused: true }))
      } else {
        setStakingPoolState((p) => ({ ...p, isPaused: false }))
      }
    } catch (e) {
      setStakingPoolState((p) => ({ ...p, isPaused: false, error: e || 'Unable to get status' }))
      console.log('[Err in useGetStakingPoolStatus]', e)
    } finally {
      setStakingPoolState((p) => ({ ...p, isLoading: false }))
    }
  }

  useEffect(() => {
    onGetStatus()
  }, [incentiveId, chainId])

  return {
    stakingPoolState,
  }
}
