/* eslint-disable import/no-unused-modules */
import { MaxUint256 } from '@derpdex/permit2-sdk'
import { Currency } from '@uniswap/sdk-core'
import { useWeb3React } from '@web3-react/core'
import { BigNumberish, ethers } from 'ethers'
import { useEffect, useMemo, useState } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { TransactionType } from 'state/transactions/types'

const abi = [
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address',
      },
      {
        name: '_spender',
        type: 'address',
      },
    ],
    name: 'allowance',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

interface Z2EAllowanceState {
  allowance: boolean
  approveCallback: () => void
}

export const useUniversalAllowance = ({
  inputCurrency,
  spenderCurrency,
  amountToApprove,
}: {
  inputCurrency: Currency | null | undefined
  spenderCurrency: Currency | null | undefined
  amountToApprove: string | undefined
}) => {
  const { account, provider, chainId } = useWeb3React()
  const [isSuccessApprove, setIsSuccessApprove] = useState<boolean>(false)
  const [isLoadingApprove, setIsLoadingApprove] = useState<boolean>(false)

  const addTransaction = useTransactionAdder()

  const allowanceState = useCheckAllowance({
    tokenAddress: inputCurrency?.wrapped.address,
    spenderAddress: spenderCurrency?.wrapped.address,
    amountToApprove: amountToApprove || '0',
    decimals: inputCurrency?.decimals,
    isNative: inputCurrency?.isNative,
    shouldCheck: isSuccessApprove,
  })

  const approveCallback = async () => {
    setIsLoadingApprove(true)
    setIsSuccessApprove(false) // Should be reset otherwise the incoming request may not check the allowance state
    try {
      const tokenAddressToApprove = inputCurrency?.wrapped.address
      const spenderAddress = spenderCurrency?.wrapped.address
      if (provider && account && tokenAddressToApprove && spenderAddress && chainId) {
        const signer = provider.getSigner()

        const erc20contract = new ethers.Contract(tokenAddressToApprove, abi, signer)

        const maxInt: BigNumberish = MaxUint256.toString()
        const response = await erc20contract.approve(spenderAddress, maxInt)
        const receipt = await response.wait()
        addTransaction(response, {
          type: TransactionType.APPROVAL,
          tokenAddress: tokenAddressToApprove,
          spender: spenderAddress,
        })
        setIsSuccessApprove(true)
      }
    } catch (err) {
      console.log('[Error in useUniversalAllowance ==> approveCallback]', err)
      setIsSuccessApprove(false)
    } finally {
      setIsLoadingApprove(false)
    }
  }

  useEffect(() => {
    if (allowanceState.isApproved) {
      setIsLoadingApprove(false)
    }
  }, [allowanceState.isApproved])

  return useMemo(() => {
    return {
      allowanceState,
      approveCallback,
      isSuccessApprove,
      isLoadingApprove,
    }
  }, [allowanceState, isSuccessApprove, isLoadingApprove])
  //! Fixed dependencies where approval callback does not change the input currency state
}

export enum Reason {
  ZERO_ALLOWANCE = 'No allowance',
  ALLOWANCE_EXCEEDED = 'Allowance exceeded',
  ACCEPTED = 'Allowance Accepted',
}
const useCheckAllowance = ({
  tokenAddress,
  spenderAddress,
  amountToApprove,
  decimals,
  isNative,
  shouldCheck,
}: {
  tokenAddress?: string | null
  spenderAddress?: string | null
  amountToApprove: string
  decimals?: number
  isNative?: boolean
  shouldCheck?: boolean
}) => {
  const [isLoadingCheckAllowance, setIsLoadingCheckAllowance] = useState<boolean>(true)
  const [isApproved, setIsApproved] = useState<boolean>(false)
  const [reason, setReason] = useState<string>('')
  const { account, provider, chainId } = useWeb3React()
  const checkAllowance = async () => {
    try {
      setIsLoadingCheckAllowance(true)
      if (!tokenAddress || !spenderAddress || !decimals || !account || !chainId || !provider)
        throw '[useCheckAllowance] failed'

      const signer = provider.getSigner()
      const erc20contract = new ethers.Contract(tokenAddress, abi, signer)
      const allowance = await erc20contract.allowance(account, spenderAddress)

      if (!allowance || Number(allowance) === 0) {
        setReason(Reason.ZERO_ALLOWANCE)
        setIsApproved(false)
      } else if (Number(allowance) !== 0 && parseFloat(amountToApprove) * 10 ** decimals > Number(allowance)) {
        setReason(Reason.ALLOWANCE_EXCEEDED)
        setIsApproved(false)
      } else {
        setIsApproved(true)
        setReason(Reason.ACCEPTED)
      }
    } catch (err) {
      setIsApproved(false)
      console.log('[Error in useCheckAllowance]:', err)
    } finally {
      setIsLoadingCheckAllowance(false)
    }
  }

  useEffect(() => {
    if (tokenAddress) {
      checkAllowance()
    } else {
      setIsApproved(true)
    }
  }, [isNative, tokenAddress, shouldCheck, amountToApprove, account])

  return useMemo(() => {
    return {
      isApproved,
      Reason: reason,
      isLoadingCheckAllowance,
    }
  }, [isApproved, isLoadingCheckAllowance, reason])
}
