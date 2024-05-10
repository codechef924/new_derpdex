/* eslint-disable import/no-unused-modules */
import { useWeb3React } from '@web3-react/core'
import { Contract } from 'ethers'
import { useEffect } from 'react'
import { useState } from 'react'

import DerpDEXStakingABI from '../abis/derpdexstaking.abi.json'
import { DERPDEX_STAKING_ADDRESSES_BY_CHAINID } from '../constants'

// * USER STAKED MULTIPLIERS
export const useGetStakingMultiplier = ({
  poolId,
  refetch,
  setShouldRefetchAfterBoost,
}: {
  poolId: string
  refetch: boolean
  setShouldRefetchAfterBoost: React.Dispatch<boolean>
}) => {
  const { chainId, provider, account } = useWeb3React()
  const [stakingMultiplier, setStakingMultiplier] = useState<string>('0')
  const onGetStakingMultiplier = async () => {
    try {
      if (!chainId || !provider || !account) throw 'chainId/provider/account is required'

      const contract = new Contract(DERPDEX_STAKING_ADDRESSES_BY_CHAINID[chainId], DerpDEXStakingABI, provider)

      const getStakingMultiplier = await contract.deposits(poolId)
      const { multiplier } = getStakingMultiplier
      const toWholeNumber = parseFloat(multiplier) / 1000
      setStakingMultiplier(toWholeNumber.toFixed(2))
    } catch (error) {
      console.log('[Err onGetStakingMultiplier]', error)
    }
  }

  useEffect(() => {
    onGetStakingMultiplier()
    setShouldRefetchAfterBoost(false)
  }, [poolId, refetch])

  return { stakingMultiplier }
}
