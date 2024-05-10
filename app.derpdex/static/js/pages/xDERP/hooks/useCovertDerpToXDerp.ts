/* eslint-disable import/no-unused-modules */
import { CurrencyAmount } from '@derpdex/smart-order-router'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import { Contract } from 'ethers'
import { useCurrency } from 'hooks/Tokens'
import { useUniversalAllowance } from 'hooks/useUniversalAllowance'
import { useMemo, useState } from 'react'

import XDERP_ABI from '../abis/xderp.abi.json'
import { DERP_ADDRESSES_BY_CHAINID, EMPTY_STRING, XDERP_ADDRESSES_BY_CHAINID } from '../constants'

type DerpState = {
  isLoading: boolean
  isSuccess: boolean
  error: string | null
}

const initialConvertDerpState: DerpState = {
  isLoading: false,
  isSuccess: false,
  error: null,
}

enum ActionStatus {
  Approve = 'Approve',
  Approving = 'Approving',
  Convert = 'Convert',
  Converting = 'Converting',
}

export const useCovertDerpToXDerp = ({
  amountOfDERP,
  balance,
  getBalance,
}: {
  amountOfDERP: string
  balance: number
  getBalance: () => Promise<void>
}) => {
  const { chainId, account, provider } = useWeb3React()
  const [state, setState] = useState<DerpState>(initialConvertDerpState)

  const DERPToken = useCurrency(chainId ? DERP_ADDRESSES_BY_CHAINID[chainId] : undefined)
  const xDERPToken = useCurrency(chainId ? XDERP_ADDRESSES_BY_CHAINID[chainId] : undefined)

  const parsedAmount = useMemo(() => {
    if (DERPToken && amountOfDERP !== '' && !/^\./.test(amountOfDERP)) {
      const amount = ethers.utils.parseUnits(amountOfDERP, DERPToken.decimals)
      return CurrencyAmount.fromRawAmount(DERPToken, amount.toString())
    } else {
      return undefined
    }
  }, [DERPToken, amountOfDERP])

  const { allowanceState, approveCallback, isSuccessApprove, isLoadingApprove } = useUniversalAllowance({
    inputCurrency: DERPToken,
    spenderCurrency: xDERPToken,
    amountToApprove: amountOfDERP,
  })

  const actionType = useMemo(() => {
    if (!allowanceState.isApproved) {
      return `${ActionStatus.Approve} ${DERPToken?.symbol}`
    } else if (isLoadingApprove) {
      return `${ActionStatus.Approving} ${DERPToken?.symbol}`
    } else if (allowanceState.isApproved && state.isLoading) {
      return `${ActionStatus.Converting} ${DERPToken?.symbol}`
    } else {
      return `${ActionStatus.Convert} ${DERPToken?.symbol}`
    }
  }, [allowanceState, isLoadingApprove, state.isLoading, DERPToken, chainId])

  const isInsufficent = useMemo(() => {
    return allowanceState.isApproved && parseFloat(amountOfDERP) > balance ? `Insufficient ${DERPToken?.symbol}` : false
  }, [DERPToken?.symbol, allowanceState.isApproved, amountOfDERP, balance])

  const shouldDisableButton = useMemo(() => {
    if (
      state.isLoading ||
      isLoadingApprove ||
      isInsufficent ||
      (amountOfDERP === EMPTY_STRING && allowanceState.isApproved)
    ) {
      return true
    } else {
      return false
    }
  }, [state.isLoading, isLoadingApprove, isInsufficent, amountOfDERP, allowanceState.isApproved])

  const claimXDerp = async () => {
    try {
      setState({ ...initialConvertDerpState, isLoading: true })
      if (!account || !provider || !chainId || !DERPToken) throw new Error('account or provider or chainId required')

      const signer = provider.getSigner()
      const contract = new Contract(XDERP_ADDRESSES_BY_CHAINID[chainId], XDERP_ABI, signer)

      const amount = ethers.utils.parseUnits(amountOfDERP, 18)
      const claimTx = await contract.stake(amount)
      const receipt = await claimTx.wait()

      await getBalance()

      setState((p) => ({ ...p, isSuccess: true }))
    } catch (err) {
      console.error('[Err claimXDerp]', err)
      setState((p) => ({ ...p, error: err.message || 'An error occurred' }))
    } finally {
      setState((p) => ({ ...p, isLoading: false }))
    }
  }

  const callBack = useMemo(() => {
    if (allowanceState.isApproved) {
      return claimXDerp
    } else {
      return approveCallback
    }
  }, [allowanceState, amountOfDERP, chainId])

  return {
    actionType: isInsufficent ? isInsufficent : actionType,
    claimXDerpState: state,
    shouldDisableButton,
    claimXDerp: callBack,
  }
}
