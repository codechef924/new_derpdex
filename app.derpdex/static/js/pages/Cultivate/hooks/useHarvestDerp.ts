/* eslint-disable import/no-unused-modules */
import { useWeb3React } from '@web3-react/core'
import { Contract } from 'ethers'
import { useAtom } from 'jotai'
import { useAtomValue } from 'jotai/utils'
import { useMemo } from 'react'
import { useState } from 'react'

import DerpDEXStakingABI from '../abis/derpdexstaking.abi.json'
import { incentiveKeysAtom } from './../../../hooks/useWhitelistedPoolAddresses'
import { DERPDEX_STAKING_ADDRESSES_BY_CHAINID } from './../constants'
import { earnedAdditionalAtom, earnedAtom } from './useGetEarnedStaking'

type HarvestState = {
  isLoading: boolean
  isSuccess: boolean
  error: string | null
}

const initialHarvestState: HarvestState = {
  isLoading: false,
  isSuccess: false,
  error: null,
}

export const useHarvestDerp = ({
  incentiveId,
  poolAddress,
  poolId,
}: {
  incentiveId: string
  poolAddress: string
  poolId: string
}) => {
  const { chainId, provider, account } = useWeb3React()
  const [harvestState, setHarvestState] = useState<HarvestState>(initialHarvestState)
  const incentiveKeys = useAtomValue(incentiveKeysAtom)

  const [derivedEarnings, setDerivedEarnings] = useAtom(earnedAtom)
  const [derivedEarningsAdditional, setDerivedEarningsAdditional] = useAtom(earnedAdditionalAtom)

  const harvestActionCall = useMemo(() => {
    if (harvestState.isLoading) {
      return 'Harvesting'
    } else {
      return 'Harvest'
    }
  }, [harvestState])

  const harvestXDerp = async () => {
    try {
      setHarvestState({ ...initialHarvestState, isLoading: true })
      if (!chainId || !provider || !account) throw 'chainId/provider/account is required'

      const signer = provider.getSigner()
      const contract = new Contract(DERPDEX_STAKING_ADDRESSES_BY_CHAINID[chainId], DerpDEXStakingABI, signer)
      const incentiveKey = incentiveKeys[incentiveId]

      const harvestTx = await contract.harvest(account, poolId, incentiveKey)
      await harvestTx.wait()

      setHarvestState((p) => ({ ...p, isSuccess: true }))
      setDerivedEarnings((prev) => {
        if (prev) {
          return {
            ...prev,
            [incentiveId]: {
              ...prev[incentiveId],
              [poolId]: '0',
            },
          }
        } else return {}
      })
      setDerivedEarningsAdditional((prev) => {
        if (prev) {
          return {
            ...prev,
            [incentiveId]: {
              ...prev[incentiveId],
              [poolId]: '0',
            },
          }
        } else return {}
      })
    } catch (error) {
      console.log('[Err harvestXDerp]', error)
      setHarvestState((p) => ({ ...p, error: error.message || 'An error occurred' }))
    } finally {
      setHarvestState((p) => ({ ...p, isLoading: false }))
    }
  }

  return {
    harvestActionCall,
    harvestState,
    harvestXDerp,
  }
}
