/* eslint-disable import/no-unused-modules */
import { MaxUint256 } from '@derpdex/permit2-sdk'
import { Currency } from '@uniswap/sdk-core'
import { useWeb3React } from '@web3-react/core'
import { ZAP_TO_EARN_ADDRESSES } from 'constants/addresses'
import { BigNumberish, ethers } from 'ethers'
import { useEffect, useMemo, useState } from 'react'

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

export const useZapToEarnAllowance = ({
  inputCurrency,
  amountToZap,
}: {
  inputCurrency: Currency | null | undefined
  amountToZap: string
}) => {
  const { account, provider, chainId } = useWeb3React()
  const [isSuccessApprove, setIsSuccessApprove] = useState<boolean>(false)
  const [isLoadingApprove, setIsLoadingApprove] = useState<boolean>(false)

  const allowanceState = useCheckZ2EAllowance({
    tokenAddress: inputCurrency?.wrapped.address,
    amountToZap: amountToZap || '0',
    decimals: inputCurrency?.decimals,
    isNative: inputCurrency?.isNative,
    shouldCheck: isSuccessApprove,
  })

  const approveCallback = async () => {
    setIsLoadingApprove(true)
    setIsSuccessApprove(false) // Should be reset otherwise the incoming request may not check the allowance state
    try {
      const tokenAddressToApprove = inputCurrency?.wrapped.address
      if (provider && account && tokenAddressToApprove && chainId) {
        const signer = provider.getSigner()

        const erc20contract = new ethers.Contract(tokenAddressToApprove, abi, signer)

        const maxInt: BigNumberish = MaxUint256.toString()
        const response = await erc20contract.approve(ZAP_TO_EARN_ADDRESSES[chainId], maxInt)
        await response.wait()
        setIsSuccessApprove(true)
      }
    } catch (err) {
      console.log('[Error in useZapToEarnAllowance ==> approveCallback]', err)
      setIsLoadingApprove(false)
      setIsSuccessApprove(false)
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
  }, [allowanceState.isApproved, isLoadingApprove, isSuccessApprove, inputCurrency])
  //! Fixed dependencies where approval callback does not change the input currency state
}

export enum Reason {
  ZERO_ALLOWANCE = 'No allowance',
  ALLOWANCE_EXCEEDED = 'Allowance exceeded',
  ACCEPTED = 'Allowance Accepted',
}
const useCheckZ2EAllowance = ({
  tokenAddress,
  amountToZap,
  decimals,
  isNative,
  shouldCheck,
}: {
  tokenAddress?: string | null
  amountToZap: string
  decimals?: number
  isNative?: boolean
  shouldCheck?: boolean
}) => {
  const [isApproved, setIsApproved] = useState<boolean>(false)
  const [reason, setReason] = useState<string>('')
  const { account, provider, chainId } = useWeb3React()
  const checkAllowance = async () => {
    try {
      if (!tokenAddress || !chainId || !decimals) throw '[useCheckZ2EAllowance] failed'
      const signer = provider?.getSigner()
      const erc20contract = new ethers.Contract(tokenAddress, abi, signer)
      const allowance = await erc20contract.allowance(account, ZAP_TO_EARN_ADDRESSES[chainId])

      if (!allowance || Number(allowance) === 0) {
        setReason(Reason.ZERO_ALLOWANCE)
        setIsApproved(false)
      } else if (Number(allowance) !== 0 && parseFloat(amountToZap) * 10 ** decimals > Number(allowance)) {
        setReason(Reason.ALLOWANCE_EXCEEDED)
        setIsApproved(false)
      } else {
        setIsApproved(true)
        setReason(Reason.ACCEPTED)
      }
    } catch (err) {
      setIsApproved(false)
      console.log('[Error in useCheckZ2EAllowance]:', err)
    }
  }

  useEffect(() => {
    if (tokenAddress && !isNative) {
      checkAllowance()
    } else {
      setIsApproved(true)
    }
  }, [isNative, tokenAddress, shouldCheck, amountToZap])

  return useMemo(() => {
    return {
      isApproved,
      Reason: reason,
    }
  }, [isApproved, reason])
}
