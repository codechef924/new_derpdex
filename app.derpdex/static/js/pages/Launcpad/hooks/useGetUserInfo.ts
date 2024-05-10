/* eslint-disable import/no-unused-modules */
import { useWeb3React } from '@web3-react/core'
import { GENESIS_API_URL, SupportedChainId } from 'constants/chains'
import { RPC_PROVIDERS } from 'constants/providers'
import { ethers } from 'ethers'
import { useEffect, useMemo } from 'react'
import { useState } from 'react'

import { CHAINIDS, LAUNCHPAD_ADDRESSES } from '../constants'

type InitialState = {
  isLoading: boolean
  isSuccess: boolean
  error: string | null
}
const initialState: InitialState = {
  isLoading: false,
  isSuccess: false,
  error: null,
}

type InitialContractState = {
  isLoading: boolean
  isSuccess: boolean
  amountClaimed: string
  error: string | null
}
const initialContractState: InitialContractState = {
  isLoading: false,
  isSuccess: false,
  amountClaimed: '0',
  error: null,
}

interface PhaseInfo {
  phase: string
  startTime: string
  endTime: string
  ended: boolean
  phaseType: string
}

interface CurrenyInfo {
  currencyAddress: string
  price: string
  currencyDecimals: string
}

interface ClaimInfo {
  amount: number
  count: number
}

export interface UserLaunchPadResponse {
  amountClaimed: string
  amountCanBuy: string
  amountSold: string
  allowedDenominations: string[]
  campaignInfo: {
    campaignId: string
    chainId: number
    currencyInfo: CurrenyInfo[]
    allowedDenominations: string[]
    limitPerUser: string
    phaseInfo: PhaseInfo | PhaseInfo[]
    phaseLength: number
    snapshotDate: string
    tokenAddress: string
    tokenDecimals: number
    formattedStartDate: string
    formattedEndDate: string
  }
}

export const useGetUserInfo = ({
  campaignId,
  chainId,
  shouldRefetch,
}: {
  campaignId: string
  chainId: SupportedChainId | null
  shouldRefetch: boolean
}) => {
  const { chainId: connectedChainId, account, provider } = useWeb3React()
  const [state, setState] = useState<InitialState>(initialState)
  const [contractCallState, setContractCallState] = useState<InitialContractState>(initialContractState)
  const [userLaunchPadDatas, setUserLaunchPadDatas] = useState<UserLaunchPadResponse | null>(null)

  const [isWhiteListed, setIsWhiteListed] = useState<boolean>(false)

  const fetchUserInfo = async () => {
    try {
      setState({ ...initialState, isLoading: true })
      if (!chainId || !account || !campaignId) throw 'chainId/account/campaignId is required'

      const searchParams = new URLSearchParams({
        userAddress: account.toLowerCase(),
        campaignId,
        chainId: chainId.toString(),
      })

      // const response = await fetch(GENESIS_API_URL + '/list', {
      const response = await fetch(GENESIS_API_URL + '/launchpad/is-whitelisted?' + searchParams, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw error
      }

      const result = (await response.json()) as UserLaunchPadResponse
      setIsWhiteListed(true)
      // setUserLaunchPadDatas(result)
      setState((p) => ({ ...p, isLoading: false, isSuccess: true }))
    } catch (error) {
      setIsWhiteListed(false)
      setState((p) => ({
        ...p,
        isSuccess: false,
        error: error || 'An error occurred',
      }))
    } finally {
      setState((p) => ({ ...p, isLoading: false }))
    }
  }

  const getClaimedAmount = async () => {
    try {
      if (!account) throw 'Account required'
      setContractCallState({ ...initialContractState, isLoading: true })
      const promises = []
      for await (const chainId of CHAINIDS) {
        const RPC_PROVIDER = RPC_PROVIDERS[chainId]

        const launchpadContract = new ethers.Contract(
          //@ts-ignore
          LAUNCHPAD_ADDRESSES[chainId],
          ['function claimInfo(address,bytes32) external view returns (uint256 amount, uint256 count)'],
          RPC_PROVIDER
        )
        promises.push(launchpadContract.claimInfo(account, campaignId))
      }
      const results = await Promise.all(promises)
      let amountClaimed = ethers.BigNumber.from(0)
      results.forEach((result) => {
        amountClaimed = amountClaimed.add(result.amount)
      })
      setContractCallState((p) => ({
        ...p,
        amountClaimed: ethers.utils.formatUnits(amountClaimed.toString(), 18).toString(),
        isSuccess: true,
      }))
    } catch (error) {
      console.log('[Err getClaimedAmount]', error)
      setContractCallState((p) => ({
        ...p,
        isSuccess: false,
        error: error || 'An error occurred',
      }))
    } finally {
      setContractCallState((p) => ({ ...p, isLoading: false }))
    }
  }

  const userInfoText = useMemo(() => {
    if (!isWhiteListed) {
      return 'Not Whitelisted'
    } else {
      return null
    }
  }, [isWhiteListed])

  useEffect(() => {
    getClaimedAmount()
    fetchUserInfo()
  }, [campaignId, chainId, account, shouldRefetch])

  return {
    userInfoDatasContractCallState: contractCallState,
    userInfoText,
    isWhiteListed,
    userInfoDatas: userLaunchPadDatas,
    fetchUserInfoState: state,
  }
}
