import NFPManager from '@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json'
import { useWeb3React } from '@web3-react/core'
import { NONFUNGIBLE_POSITION_MANAGER_ADDRESSES } from 'constants/addresses'
import { Contract } from 'ethers'
import { useAtom } from 'jotai'
import { useAtomValue } from 'jotai/utils'
import { useFastForwardBlockNumber } from 'lib/hooks/useBlockNumber'
import { earnedAtom } from 'pages/Cultivate/hooks/useGetEarnedStaking'
import { useEffect, useMemo, useState } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { TransactionType } from 'state/transactions/types'

import DerpDEXStakingABI from '../abis/derpdexstaking.abi.json'
import { DERPDEX_STAKING_ADDRESSES_BY_CHAINID } from '../constants'
import { incentiveKeysAtom } from './../../../hooks/useWhitelistedPoolAddresses'
import { useStakedPoolsAdder, useStakedPoolsRemover } from './ComponentHooks'
import { useUserPositionAllocation } from './useUserPositionAllocation'
/* eslint-disable import/no-unused-modules */

type STAKETOKEN = {
  rewardToken: string
  pool: string
  startTime: string
  endTime: string
  refundee: string
}

type StakeORUnstakeState = {
  isLoading: boolean
  isSuccess: boolean
  isResolved: boolean
  error: string | null
}

const initialStakeOrUnstakeState: StakeORUnstakeState = {
  isLoading: false,
  isSuccess: false,
  isResolved: false,
  error: null,
}

// ****************************************************************
// * @ poolId refers to tokenId of position number user created
// ****************************************************************
export const useStakeXDerp = ({
  poolAddress,
  incentiveId,
  poolId,
}: {
  poolAddress: string
  incentiveId: string
  poolId: string
}) => {
  const { chainId, provider, account } = useWeb3React()
  const [stakeState, setStakeState] = useState<StakeORUnstakeState>(initialStakeOrUnstakeState)
  const [unstakeState, setUnstakeState] = useState<StakeORUnstakeState>(initialStakeOrUnstakeState)
  const [derivedEarnings, setDerivedEarnings] = useAtom(earnedAtom)
  const incentiveKeys = useAtomValue(incentiveKeysAtom)

  const fastForwardBlockNumber = useFastForwardBlockNumber()

  // const { resolveTillSuccessStake, resolveFromContract, bundledPositions } = useDerivedStakedPositions({
  //   chainId,
  //   poolAddress,
  //   incentiveId,
  // })

  const { getUserPositionAllocation } = useUserPositionAllocation({
    poolAddress,
    poolId,
    shouldInvoke: false,
  })

  const stakeActionCall = useMemo(() => {
    if (stakeState.isLoading) {
      return 'Staking'
    } else {
      return 'Stake'
    }
  }, [stakeState])

  const unstakeActionCall = useMemo(() => {
    if (unstakeState.isLoading) {
      return 'Unstaking'
    } else {
      return 'Unstake'
    }
  }, [unstakeState])

  const addTransaction = useTransactionAdder()

  const { addPoolId } = useStakedPoolsAdder({
    incentiveId,
    poolAddress,
    poolId,
  })
  const stakeXDerp = async () => {
    try {
      setStakeState({ ...initialStakeOrUnstakeState, isLoading: true })
      if (!chainId || !provider || !account) throw 'chainId/provider/account is required'

      if (!DERPDEX_STAKING_ADDRESSES_BY_CHAINID[chainId]) throw 'contract now found for ' + chainId

      const signer = provider.getSigner()
      const contract = new Contract(DERPDEX_STAKING_ADDRESSES_BY_CHAINID[chainId], DerpDEXStakingABI, signer)
      const incentiveKey = incentiveKeys[incentiveId]

      const stakeTx = await contract.stakeToken([incentiveKey], [poolId])
      addTransaction(stakeTx, {
        type: TransactionType.STAKE_LP,
        positionId: poolId,
      })
      const receipt = await stakeTx.wait()
      fastForwardBlockNumber(receipt.blockNumber)
      // await resolveFromContract({ poolId, type: Position.AVAILABLE })

      console.log('RESOLVED')
      setStakeState((p) => ({ ...p, isSuccess: true }))
      addPoolId()
      await getUserPositionAllocation()

      // await bundledPositions()
      // await resolveTillSuccessStake({ poolAddress, poolId, type: Position.AVAILABLE })
      setStakeState((p) => ({ ...p, isResolved: true }))
      // setEarned(earnedResult)
    } catch (error) {
      console.log('[Err stakeXDerp]', error)
      setStakeState((p) => ({ ...p, error: error.message || 'An error occurred' }))
    } finally {
      setStakeState((p) => ({ ...p, isLoading: false }))
    }
  }

  const { removePoolId } = useStakedPoolsRemover({
    incentiveId,
    poolId,
  })

  const unstakeXDerp = async () => {
    try {
      setUnstakeState({ ...initialStakeOrUnstakeState, isLoading: true })
      if (!chainId || !provider || !account) throw 'chainId/provider/account is required'

      if (!DERPDEX_STAKING_ADDRESSES_BY_CHAINID[chainId]) throw 'contract now found for ' + chainId

      const signer = provider.getSigner()
      const contract = new Contract(DERPDEX_STAKING_ADDRESSES_BY_CHAINID[chainId], DerpDEXStakingABI, signer)
      const incentiveKey = incentiveKeys[incentiveId]
      console.log('contract.unstakeToken([incentiveKey], [poolId], account)', [incentiveKey], [poolId], account)
      const unstakeTx = await contract.unstakeToken([incentiveKey], [poolId], account)

      addTransaction(unstakeTx, {
        type: TransactionType.UNSTAKE_LP,
        positionId: poolId,
      })
      const receipt = await unstakeTx.wait()
      fastForwardBlockNumber(receipt.blockNumber)
      // await resolveFromContract({ poolId, type: Position.STAKED })
      // await resolveTillSuccessStake({ poolId, type: Position.STAKED, })
      console.log('RESOLVED UNSTAKED')

      setUnstakeState((p) => ({ ...p, isSuccess: true }))
      removePoolId()
      // await resolveTillSuccessStake({ poolAddress, poolId, type: Position.STAKED })
      setUnstakeState((p) => ({ ...p, isResolved: true }))
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
      // setEarned(earnedResult)
    } catch (error) {
      console.log('[Err unstakeXDerp]', error)
      setUnstakeState((p) => ({ ...p, error: error.message || 'An error occurred' }))
    } finally {
      setUnstakeState((p) => ({ ...p, isLoading: false }))
    }
  }

  return {
    stakeState,
    unstakeState,
    stakeActionCall,
    unstakeActionCall,
    unstakeXDerp,
    stakeXDerp,
  }
}

type ApproveForAllState = {
  isLoading: boolean
  isSuccess: boolean
  error: string | null
}

const initialApproveForAllState: ApproveForAllState = {
  isLoading: false,
  isSuccess: false,
  error: null,
}

export const useApproveXDerpStaking = () => {
  const { chainId, provider, account } = useWeb3React()
  const [isApprovedForAll, setIsApprovedForAll] = useState<boolean>(true)
  const [state, setState] = useState<ApproveForAllState>(initialApproveForAllState)

  const actionCall = useMemo(() => {
    if (state.isLoading) {
      return 'Approving...'
    } else if (!state.isLoading && !isApprovedForAll) {
      return 'Approve Yield Booster'
    } else {
      return 'Approved'
    }
  }, [isApprovedForAll, state])

  const checkIsApprove = async () => {
    try {
      if (!chainId || !provider || !account) throw 'chainId/provider/account is required'

      if (!NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId]) throw 'contract now found for ' + chainId

      const { abi: NFPManagerABI } = NFPManager

      const signer = provider.getSigner()
      const contract = new Contract(NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId], NFPManagerABI, signer)

      const approveTx = await contract.isApprovedForAll(account, DERPDEX_STAKING_ADDRESSES_BY_CHAINID[chainId])
      // console.log('approveTx', approveTx)
      if (typeof approveTx === 'boolean') setIsApprovedForAll(approveTx)
    } catch (error) {
      console.log('[Err getEarned]', error)
    }
  }

  useEffect(() => {
    checkIsApprove()
  }, [state])

  const approveDerpDexStaking = async () => {
    try {
      setState({ ...initialApproveForAllState, isLoading: true })
      if (!chainId || !provider || !account) throw 'chainId/provider/account is required'

      if (!NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId]) throw 'contract now found for ' + chainId

      const { abi: NFPManagerABI } = NFPManager

      const signer = provider.getSigner()
      const contract = new Contract(NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId], NFPManagerABI, signer)

      const approveTx = await contract.setApprovalForAll(DERPDEX_STAKING_ADDRESSES_BY_CHAINID[chainId], true)
      await approveTx.wait()
      setState((p) => ({ ...p, isSuccess: true }))
      // setEarned(earnedResult)
    } catch (error) {
      console.log('[Err getEarned]', error)
      setState((p) => ({ ...p, error: error.message || 'An error occurred' }))
    } finally {
      setState((p) => ({ ...p, isLoading: false }))
    }
  }

  return {
    approveState: state,
    actionCall,
    isApprovedForAll,
    approveDerpDexStaking,
  }
}
