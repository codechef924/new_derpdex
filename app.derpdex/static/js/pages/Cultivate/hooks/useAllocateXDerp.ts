import { BigNumber } from '@ethersproject/bignumber'
/* eslint-disable import/no-unused-modules */
import { useWeb3React } from '@web3-react/core'
import { Contract, ethers } from 'ethers'
import { useCurrency } from 'hooks/Tokens'
import { INCENTIVE_KEY } from 'hooks/useYieldBoosterPoolAddresses'
import { useAtomValue } from 'jotai/utils'
import { balanceAtom, useAvailableDerpBalance } from 'pages/xDERP/hooks/useAvailableDerpBalance'
import { useEffect } from 'react'
import { useMemo } from 'react'
import { useState } from 'react'

import XDerpABI from '../abis/xderp.abi.json'
import { incentiveKeysAtom } from './../../../hooks/useWhitelistedPoolAddresses'
import { XDERP_ADDRESSES_BY_CHAINID } from './../../xDERP/constants'
import { YIELD_BOOSTER_ADDRESSES_BY_CHAINID } from './../constants'
import { AllocationType, useUserPositionAllocation } from './useUserPositionAllocation'

type AllocateState = {
  isLoading: boolean
  isSuccess: boolean
  error: string | null
}

const initialAllocateState: AllocateState = {
  isLoading: false,
  isSuccess: false,
  error: null,
}

export const useAllocateXDerp = ({
  incentiveId,
  poolAddress,
  poolId,
  amount,
  durationInSeconds,
  endTime,
  isExtendedDuration,
  canDeallocate,
  modalType,
}: {
  incentiveId: string
  poolAddress: string
  poolId: string
  amount: string
  durationInSeconds: number
  endTime: string
  isExtendedDuration: boolean
  canDeallocate: boolean
  modalType: AllocationType
}) => {
  const { chainId, provider, account } = useWeb3React()
  const [allocateState, setAllocateState] = useState<AllocateState>(initialAllocateState)
  const incentiveKeys = useAtomValue(incentiveKeysAtom)
  const userBalance = useAtomValue(balanceAtom)
  const { getBalance } = useAvailableDerpBalance()

  const xDERP = useCurrency(chainId ? XDERP_ADDRESSES_BY_CHAINID[chainId] : undefined)

  const { getUserPositionAllocation } = useUserPositionAllocation({
    poolAddress,
    poolId,
    shouldInvoke: false,
  })

  const allocateActionCall = useMemo(() => {
    if (allocateState.isLoading) {
      return 'Boosting'
    } else if (parseFloat(amount) > userBalance.XDERP) {
      return 'Insufficient balance'
    } else {
      return 'Confirm'
    }
  }, [allocateState, isExtendedDuration, amount])

  const allocateXDerp = async () => {
    try {
      setAllocateState({ ...initialAllocateState, isLoading: true })
      if (!chainId || !provider || !account) throw 'chainId/provider/account is required'

      if (!XDERP_ADDRESSES_BY_CHAINID[chainId]) throw 'contract now found for ' + chainId

      const signer = provider.getSigner()
      const contract = new Contract(XDERP_ADDRESSES_BY_CHAINID[chainId], XDerpABI, signer)
      const incentiveKey = incentiveKeys[incentiveId]

      let parsedAmount: BigNumber
      let duration: string

      // * IF the staked is boosted,
      // * To re-boost, then the duration, should use the remaining duration left
      // * Otherwise if the staked is boosted and already ended, should use the new duration

      if (isExtendedDuration && canDeallocate) {
        // * IS ENDED
        // * AND REQUIRE NEW DURATION
        console.log('[Extending Duration && Is Ready for Deallocating]')
        parsedAmount = ethers.utils.parseUnits('0', xDERP?.decimals)
        duration = durationInSeconds.toString()
      } else if (isExtendedDuration && !canDeallocate) {
        // * IS BOOSTED && NOT ENDED YET
        // * IS USING THE REMAINING TIME
        // * FOR EXTENDING DURATION ONLY
        const currentTimestamp = Date.now() / 1000
        if (modalType === AllocationType.BOOST || modalType === AllocationType.ALLOCATE_MORE) {
          console.log('[Allocate More Boost Only]')
          parsedAmount = ethers.utils.parseUnits(amount, xDERP?.decimals)
          const remainingDuration = parseInt(endTime) - currentTimestamp + 100 // ZERO ERROR TIME
          duration = remainingDuration.toFixed(0)
        } else {
          console.log('[Extending Duration Only]')
          parsedAmount = ethers.utils.parseUnits('0', xDERP?.decimals)
          const remainingDuration = parseInt(endTime) - currentTimestamp
          const addonDuration = remainingDuration + durationInSeconds
          duration = addonDuration >= 0 ? addonDuration.toFixed(0) : '0'
        }
      } else if (!isExtendedDuration && !canDeallocate) {
        // * IS NOT BOOSTED
        console.log('[First Boost]')
        parsedAmount = ethers.utils.parseUnits(amount, xDERP?.decimals)
        duration = durationInSeconds.toString()
      } else {
        // * IS BOOSTED && NOT ENDED YET
        // * USER RE-BOOST USE NEW DURATION
        console.log('[Default]', endTime)
        parsedAmount = ethers.utils.parseUnits(amount, xDERP?.decimals)
        duration = durationInSeconds.toString()
      }

      const allocate = await contract.allocate(
        YIELD_BOOSTER_ADDRESSES_BY_CHAINID[chainId],
        poolId,
        parsedAmount.toString(),
        0, // duration,
        incentiveKey
      )
      await allocate.wait()

      await getUserPositionAllocation()
      setAllocateState((p) => ({ ...p, isSuccess: true }))
      // setEarned(earnedResult)
    } catch (error) {
      console.log('[Err allocateXDerp]', error)
      setAllocateState((p) => ({ ...p, error: error.message || 'An error occurred' }))
    } finally {
      setAllocateState((p) => ({ ...p, isLoading: false }))
    }
  }

  useEffect(() => {
    if (allocateState.isSuccess) {
      getBalance()
    }
  }, [allocateState.isSuccess])

  return {
    allocateState,
    allocateActionCall,
    allocateXDerp,
  }
}

type DellocateState = {
  isLoading: boolean
  isSuccess: boolean
  error: string | null
}

const initialDeallocateState: DellocateState = {
  isLoading: false,
  isSuccess: false,
  error: null,
}
export const useDeallocateXDerp = ({
  incentiveId,
  poolAddress,
  poolId,
  amount,
  isIncreaseAmount,
  isExtendedDuration,
}: {
  incentiveId: string
  poolAddress: string
  poolId: string
  amount: string
  isIncreaseAmount?: boolean
  isExtendedDuration?: boolean
}) => {
  const { chainId, provider, account } = useWeb3React()
  const [deallocateState, setDellocateState] = useState<AllocateState>(initialDeallocateState)
  const incentiveKeys = useAtomValue(incentiveKeysAtom)

  const { getBalance } = useAvailableDerpBalance()
  const { getUserPositionAllocation } = useUserPositionAllocation({
    poolAddress,
    poolId,
    shouldInvoke: false,
  })

  const xDERP = useCurrency(chainId ? XDERP_ADDRESSES_BY_CHAINID[chainId] : undefined)

  const deallocateActionCall = useMemo(() => {
    if (deallocateState.isLoading) {
      return 'Deallocating'
    } else {
      return 'Confirm'
    }
  }, [deallocateState])

  const deallocateXDerp = async () => {
    try {
      setDellocateState({ ...initialAllocateState, isLoading: true })
      if (!chainId || !provider || !account) throw 'chainId/provider/account is required'

      if (!XDERP_ADDRESSES_BY_CHAINID[chainId]) throw 'contract now found for ' + chainId

      const signer = provider.getSigner()
      const contract = new Contract(XDERP_ADDRESSES_BY_CHAINID[chainId], XDerpABI, signer)
      const incentiveKey = incentiveKeys[incentiveId]

      const parsedAmount = ethers.utils.parseUnits(amount, xDERP?.decimals)

      const deallocate = await contract.deAllocate(
        YIELD_BOOSTER_ADDRESSES_BY_CHAINID[chainId],
        poolId,
        parsedAmount.toString(),
        incentiveKey
      )
      await deallocate.wait()
      await getUserPositionAllocation()
      setDellocateState((p) => ({ ...p, isSuccess: true }))
      // setEarned(earnedResult)
    } catch (error) {
      console.log('[Err allocateXDerp]', error)
      setDellocateState((p) => ({ ...p, error: error.message || 'An error occurred' }))
    } finally {
      setDellocateState((p) => ({ ...p, isLoading: false }))
    }
  }

  useEffect(() => {
    if (deallocateState.isSuccess) {
      getBalance()
    }
  }, [deallocateState.isSuccess])

  return {
    deallocateState,
    deallocateActionCall,
    deallocateXDerp,
  }
}

export const useDeallocateXDerpExternal = ({
  incentiveKey,
  poolAddress,
  poolId,
  amount,
  isIncreaseAmount,
  isExtendedDuration,
  getBalance,
}: {
  incentiveKey?: INCENTIVE_KEY
  poolAddress?: string
  poolId: string
  amount: string
  isIncreaseAmount?: boolean
  isExtendedDuration?: boolean
  getBalance: () => Promise<void>
}) => {
  const { chainId, provider, account } = useWeb3React()
  const [deallocateState, setDellocateState] = useState<AllocateState>(initialDeallocateState)

  // const { getBalance } = useAvailableDerpBalance()
  // const { getUserPositionAllocation } = useUserPositionAllocation({
  //   poolAddress,
  //   poolId,
  //   shouldInvoke: false,
  // })

  const xDERP = useCurrency(chainId ? XDERP_ADDRESSES_BY_CHAINID[chainId] : undefined)

  const deallocateActionCall = useMemo(() => {
    if (deallocateState.isLoading) {
      return 'Deallocating'
    } else {
      return 'Confirm'
    }
  }, [deallocateState])

  const deallocateXDerp = async () => {
    try {
      setDellocateState({ ...initialAllocateState, isLoading: true })
      if (!chainId || !provider || !account) throw 'chainId/provider/account is required'

      if (!XDERP_ADDRESSES_BY_CHAINID[chainId]) throw 'contract now found for ' + chainId

      if (!poolAddress || !incentiveKey) throw 'poolAddress or IncentiveKey is required'

      const signer = provider.getSigner()
      const contract = new Contract(XDERP_ADDRESSES_BY_CHAINID[chainId], XDerpABI, signer)

      const parsedAmount = ethers.utils.parseUnits(amount, xDERP?.decimals)

      const deallocate = await contract.deAllocate(
        YIELD_BOOSTER_ADDRESSES_BY_CHAINID[chainId],
        poolId,
        parsedAmount.toString(),
        incentiveKey
      )
      await deallocate.wait()

      await getBalance()
      // await getUserPositionAllocation()
      setDellocateState((p) => ({ ...p, isSuccess: true }))
      // setEarned(earnedResult)
    } catch (error) {
      console.log('[Err allocateXDerp]', error)
      setDellocateState((p) => ({ ...p, error: error.message || 'An error occurred' }))
    } finally {
      setDellocateState((p) => ({ ...p, isLoading: false }))
    }
  }

  // useEffect(() => {
  //   if (deallocateState.isSuccess) {
  //     getBalance()
  //   }
  // }, [deallocateState.isSuccess])

  return {
    deallocateState,
    deallocateActionCall,
    deallocateXDerp,
  }
}
