/* eslint-disable import/no-unused-modules */
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import { Contract } from 'ethers'
import { useEffect, useState } from 'react'

import _IDO_ABI from '../abis/ido.abi.json'
import { IDO_CONTRACT } from '../constants'
import { USER_IDO } from './useGetUserIDO'

type InitState = {
  isLoading: boolean
  isSuccess: boolean
  error: string | null
}
const initialState: InitState = {
  isLoading: false,
  isSuccess: false,
  error: null,
}

export const useGetClaimableAmount = ({ userIDOResult }: { userIDOResult: USER_IDO | undefined }) => {
  const { account, chainId, provider } = useWeb3React()
  const [claimableAmount, setClaimableAmount] = useState<string | null>(null)
  const [claimableBonusAmount, setClaimableBonusAmount] = useState<string | null>(null)
  const [isAirdropBonusClaimed, setIsAirdropBonusClaimed] = useState<boolean>(false)
  const [state, setState] = useState<InitState>(initialState)

  const onGetClaimableAmount = async () => {
    try {
      setClaimableAmount(null)
      setClaimableBonusAmount(null)
      setState({ ...initialState, isLoading: true })
      if (!account || !chainId || !provider) throw 'account/chainId/provider is required'

      if (!userIDOResult) throw 'Fallback error: userIDOResult required'

      const signer = provider.getSigner()

      const contract = new Contract(IDO_CONTRACT[chainId], _IDO_ABI, signer)

      const claimableAmount = await contract.claimableAmount(
        userIDOResult.campaignId,
        account,
        userIDOResult.amount,
        userIDOResult.airdropBonus
      )

      const formattedAmount = ethers.utils.formatUnits(claimableAmount[0], 18)
      const formattedBonusAmount = ethers.utils.formatUnits(claimableAmount[1], 18)

      setClaimableAmount(formattedAmount.toString())

      // For checking airdropBonus claimed or not
      const userInfo = await contract.userInfo(userIDOResult.campaignId, account)

      if (parseFloat(userInfo[2]) > 0) {
        setIsAirdropBonusClaimed(true)
      } else {
        setIsAirdropBonusClaimed(false)
      }

      if (parseFloat(formattedBonusAmount) > 0) {
        setClaimableBonusAmount(formattedBonusAmount.toString())
      } else {
        setClaimableBonusAmount(null)
      }

      setState((p) => ({ ...p, isLoading: false, isSuccess: true }))
    } catch (error) {
      console.log('[Err claimIDO]', error)
      setState((p) => ({
        ...p,
        isSuccess: false,
        error: error.reason || 'An error occurred',
      }))
    } finally {
      setState((p) => ({ ...p, isLoading: false }))
    }
  }

  useEffect(() => {
    if (account && userIDOResult) {
      onGetClaimableAmount()
    }
  }, [account, userIDOResult])

  return {
    state,
    claimableAmount,
    claimableBonusAmount,
    onGetClaimableAmount,
    isAirdropBonusClaimed,
  }
}
