import { BigNumber } from '@ethersproject/bignumber'
/* eslint-disable import/no-unused-modules */
import { useWeb3React } from '@web3-react/core'
import * as d3 from 'd3'
import { Contract, ethers } from 'ethers'
import { useCurrency } from 'hooks/Tokens'
import { atom, useAtom } from 'jotai'
import { useEffect, useState } from 'react'

import YieldBoosterABI from '../abis/yieldbooster.abi.json'
import { XDERP_ADDRESSES_BY_CHAINID } from './../../xDERP/constants'
import { YIELD_BOOSTER_ADDRESSES_BY_CHAINID } from './../constants'

enum UNLOCKED_FINALIZE {
  ALLOWED = 'Deallocate',
}

const determineDurationLeft = (timestamp: number) => {
  const currentTimestamp = Math.floor(Date.now() / 1000)

  const difference = timestamp - currentTimestamp

  if (difference >= 86400) {
    const daysLeft = Math.floor(difference / 86400)
    return `${daysLeft} days`
  } else if (difference >= 3600) {
    const hoursLeft = Math.floor(difference / 3600)
    return `${hoursLeft} hours`
  } else if (difference >= 60) {
    const minutesLeft = Math.floor(difference / 60)
    return `${minutesLeft} minutes`
  } else if (difference >= 0) {
    return `Few seconds`
  } else {
    return UNLOCKED_FINALIZE.ALLOWED
  }
}

export enum AllocationType {
  BOOST = 'Boost',
  ALLOCATE_MORE = 'Increase',
  EXTEND = 'Extend',
  DEALLOCATE = 'Deallocate',
}

export interface IAllocation {
  allocatedAmount: string
  startSinceTimestamp: string
  lockUntilTimestamp: string
  lockUntilDate: string
  daysLeft: string
  isAllocated: boolean
  canDeallocate: boolean
  type: AllocationType
}

interface AllocationResponse {
  startTime: BigNumber
  endTime: BigNumber
  xDerpAmount: BigNumber
}

const initialAllocation: IAllocation = {
  allocatedAmount: '0',
  startSinceTimestamp: '0',
  lockUntilTimestamp: '0',
  lockUntilDate: '0',
  daysLeft: '0',
  isAllocated: false,
  canDeallocate: false,
  type: AllocationType.BOOST,
}

interface IS_BOOSTED_POSITION {
  [address: string]: {
    [poolId: string]: boolean
  }
}

export const isBoostedPosition = atom<IS_BOOSTED_POSITION>({})

interface ALLOCATION_JOTAI_BY_POOL_ADDRESS {
  [address: string]: {
    [poolId: string]: IAllocation
  }
}

export const allocationInfoJotai = atom<ALLOCATION_JOTAI_BY_POOL_ADDRESS>({})

export const useUserPositionAllocation = ({
  poolAddress,
  poolId,
  shouldInvoke,
}: {
  poolAddress: string
  poolId: string
  shouldInvoke: boolean
}) => {
  const { chainId, provider, account } = useWeb3React()
  const [allocationInfo, setAllocationInfo] = useState<IAllocation>(initialAllocation)
  const [isLoadedForAll, setIsLoadedForAll] = useState<boolean>(false)
  const [allocationInfoAtom, setAllocationInfoAtom] = useAtom(allocationInfoJotai)
  const xDERP = useCurrency(chainId ? XDERP_ADDRESSES_BY_CHAINID[chainId] : undefined)

  const getUserPositionAllocation = async () => {
    try {
      if (!chainId || !provider || !account) throw 'chainId/provider/account is required'
      const contract = new Contract(YIELD_BOOSTER_ADDRESSES_BY_CHAINID[chainId], YieldBoosterABI, provider)

      const allocationByUser: AllocationResponse = await contract.userPositionAllocation(account, poolAddress, poolId)

      const formattedStartDate = d3.timeFormat('%d/%-m/%Y')(new Date(allocationByUser.endTime.toNumber() * 1000))
      const isAllocated = parseInt(allocationByUser.xDerpAmount.toString()) > 0
      const canDeallocate = Boolean(
        isAllocated && determineDurationLeft(allocationByUser.endTime.toNumber()) === UNLOCKED_FINALIZE.ALLOWED
      )

      let type = AllocationType.BOOST
      if (isAllocated && !canDeallocate) {
        type = AllocationType.ALLOCATE_MORE
      } else if (isAllocated && canDeallocate) {
        type = AllocationType.DEALLOCATE
      }

      const payloadToSave: IAllocation = {
        allocatedAmount: ethers.utils.formatUnits(allocationByUser.xDerpAmount.toString(), xDERP?.decimals),
        startSinceTimestamp: allocationByUser.startTime.toString(),
        lockUntilTimestamp: allocationByUser.endTime.toString(),
        lockUntilDate: formattedStartDate,
        daysLeft: determineDurationLeft(allocationByUser.endTime.toNumber()),
        isAllocated,
        canDeallocate,
        type,
      }

      setAllocationInfo(payloadToSave)

      setAllocationInfoAtom((prev) => {
        if (prev) {
          return {
            ...prev,
            [poolAddress]: {
              ...prev[poolAddress],
              [poolId]: payloadToSave,
            },
          }
        } else return {}
      })
    } catch (error) {
      console.log('[Err getUserPositionAllocation]', error)
    }
  }

  const getUserPositionAllocationInit = async ({ poolAddress, poolId }: { poolAddress: string; poolId: string }) => {
    try {
      if (!chainId || !provider || !account) throw 'chainId/provider/account is required'
      const contract = new Contract(YIELD_BOOSTER_ADDRESSES_BY_CHAINID[chainId], YieldBoosterABI, provider)

      const allocationByUser: AllocationResponse = await contract.userPositionAllocation(account, poolAddress, poolId)

      const formattedStartDate = d3.timeFormat('%d/%-m/%Y')(new Date(allocationByUser.endTime.toNumber() * 1000))

      const isAllocated = parseInt(allocationByUser.xDerpAmount.toString()) > 0
      const canDeallocate = Boolean(
        isAllocated && determineDurationLeft(allocationByUser.endTime.toNumber()) === UNLOCKED_FINALIZE.ALLOWED
      )

      let type = AllocationType.BOOST
      if (isAllocated && !canDeallocate) {
        type = AllocationType.ALLOCATE_MORE
      } else if (isAllocated && canDeallocate) {
        type = AllocationType.DEALLOCATE
      }

      const payloadToSave: IAllocation = {
        allocatedAmount: ethers.utils.formatUnits(allocationByUser.xDerpAmount.toString(), xDERP?.decimals),
        startSinceTimestamp: allocationByUser.startTime.toString(),
        lockUntilTimestamp: allocationByUser.endTime.toString(),
        lockUntilDate: formattedStartDate,
        daysLeft: determineDurationLeft(allocationByUser.endTime.toNumber()),
        isAllocated,
        canDeallocate,
        type,
      }

      setAllocationInfo(payloadToSave)

      setAllocationInfoAtom((prev) => {
        if (prev) {
          return {
            ...prev,
            [poolAddress]: {
              ...prev[poolAddress],
              [poolId]: payloadToSave,
            },
          }
        } else return {}
      })
    } catch (error) {
      console.log('[Err getUserPositionAllocationInit]', error)
    }
  }

  useEffect(() => {
    getUserPositionAllocation()
  }, [poolAddress, poolId, shouldInvoke])

  return {
    allocationInfo,
    getUserPositionAllocation,
    getUserPositionAllocationInit,
  }
}

interface EstimatedMultiplierParams {
  userStartTime: string
  userEndTime: string
  poolStartTime: string
  poolEndTime: string
  xDerpAmount: string
  pool: string
  poolId: string
}

export const useEstimatedMultiplier = ({
  userStartTime,
  userEndTime,
  poolStartTime,
  poolEndTime,
  xDerpAmount,
  pool,
  poolId,
}: EstimatedMultiplierParams) => {
  const { chainId, provider, account } = useWeb3React()
  const [estimatedMultiplier, setEstimatedMultiplier] = useState<string>('')
  const [showChanges, setShowChanges] = useState<boolean>(false)
  const xDERP = useCurrency(chainId ? XDERP_ADDRESSES_BY_CHAINID[chainId] : undefined)

  const onEstimate = async () => {
    try {
      if (!(xDerpAmount === '')) {
        if (!chainId || !provider || !account) throw 'chainId/provider/account is required'
        const contract = new Contract(YIELD_BOOSTER_ADDRESSES_BY_CHAINID[chainId], YieldBoosterABI, provider)
        const currentTimestamp = Date.now() / 1000

        const amount = ethers.utils.parseUnits(xDerpAmount, xDERP?.decimals)

        console.log(userStartTime, poolStartTime, poolEndTime, amount.toString(), pool, account, poolId)
        const estimatedMultiplier = await contract.getEstimatedMultiplier(
          userStartTime,
          // userEndTime,
          poolStartTime,
          poolEndTime,
          amount,
          pool, // Pool address
          account,
          poolId
        )
        // console.log('estimatedMultiplier', Number(estimatedMultiplier))
        const result = Number(estimatedMultiplier) / 1000
        setShowChanges(true)
        setEstimatedMultiplier(result.toFixed(2))
      } else {
        setShowChanges(false)
      }
    } catch (error) {
      console.log('[Err onEstimate]', error)
    }
  }

  useEffect(() => {
    onEstimate()
  }, [xDerpAmount, userEndTime])

  return {
    showChanges,
    estimatedMultiplier,
  }
}
