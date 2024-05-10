import { useWeb3React } from '@web3-react/core'
import { SupportedChainId } from 'constants/chains'
import { useMemo, useState } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { TransactionType } from 'state/transactions/types'

import { BRIDGE_INFO, INSCRIPTION } from '../_supported_token_bridge'
import { API_ENDPOINT, IWITHDRAWONL2, useGetAllAvailableWithdrawal, useInsertWithdrawOnL2 } from '../utils/useVarieties'
import { BRIDGE_CONTRACT_ADDRESS, TOKEN_ADDRESS } from '../constant'
import { ethers } from 'ethers'
import BRC20_ABI from '../../../abis/brc20.abi.json'
import BRC_20_FACTORY_ABI from '../../../abis/brc20-factory.abi.json'
import { set } from 'immer/dist/internal'

interface IWITHDRAW_API {
  address: string
  inscription: INSCRIPTION
  inputAmount: number
  otherRecipient?: string
}

/* eslint-disable import/no-unused-modules */
export const useSupportedWithdrawCallback = ({
  currentToken,
  inputAmount,
  otherRecipient,
  setIsWithdrawLoading,
  setSuccessWithdraw,
  batchGetBalance,
  setInputAmount,
  setShouldReload,
}: {
  currentToken: BRIDGE_INFO
  inputAmount: number | undefined
  otherRecipient?: string
  setIsWithdrawLoading: React.Dispatch<boolean>
  setSuccessWithdraw: React.Dispatch<boolean>
  batchGetBalance: () => void
  setInputAmount: React.Dispatch<number | undefined>
  setShouldReload: React.Dispatch<boolean>
}) => {
  const { chainId, provider, account } = useWeb3React()
  const addTransaction = useTransactionAdder()

  // Backend API
  const { isLoadingInsertWithdrawOnL2, isSuccessInsertWithdrawOnL2, insertWithdrawOnL2 } = useInsertWithdrawOnL2()
  const { getAllAvailableWithdrawal, allAvailableWithdrawalLog, isSuccessGetAllAvailableWithdrawal } =
    useGetAllAvailableWithdrawal()

  const L2Withdraw = async () => {
    try {
      setIsWithdrawLoading(true)
      if (!provider || !chainId || !account || !inputAmount) throw 'Provider/ChainId/Account/inputAmount not found'

      const payload: IWITHDRAW_API = {
        address: account,
        inscription: currentToken.inscription,
        inputAmount,
        otherRecipient: !otherRecipient ? account : otherRecipient,
      }
      // API
      const result = await fetch(`${API_ENDPOINT}/build-withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      // RESULT
      if (result.ok) {
        const buildTx = await result.json()

        // const serializedUnsignedTx = ethers.utils.serializeTransaction(buildTx.tx)
        const signer = await provider.getSigner()
        const withdrawTx = await signer.sendTransaction(buildTx.tx)
        const receipt = await withdrawTx.wait()

        const payload: IWITHDRAWONL2 = {
          transactionHash: withdrawTx.hash,
          address: account,
          inscription: currentToken.inscription,
          symbol: currentToken.symbol,
          amount: inputAmount.toString(),
          isTestnet: process.env.REACT_APP_IS_TESTSITE === 'true' ? true : false,
          chainId,
          blockNumber: receipt.blockNumber,
        }
        await insertWithdrawOnL2(payload)

        await getAllAvailableWithdrawal(account, process.env.REACT_APP_IS_TESTSITE === 'true' ? true : false)

        addTransaction(withdrawTx, {
          type: TransactionType.BRIDGE_WITHDRAW_OPBNB,
          symbol: currentToken?.symbol ? currentToken?.symbol : 'UNDEFINED',
          amount: inputAmount ? inputAmount.toString() : 'UNDEFINED',
        })
        // REFETCH BALANCE
        batchGetBalance()
        setInputAmount(0)
        setIsWithdrawLoading(false)
        setSuccessWithdraw(true)
      } else {
        throw 'Unable to get build transaction'
      }
      setShouldReload(true)
    } catch (err) {
      setInputAmount(0.0)
      setIsWithdrawLoading(false)
      setSuccessWithdraw(false)
      console.log('[Err opBnbL2Withdraw]', err)
    }
  }

  const withdrawCallback = useMemo(() => {
    if (chainId) {
      switch (chainId) {
        case SupportedChainId.ZKSYNC_TESTNET:
        case SupportedChainId.ZKSYNC_MAINNET:
          return L2Withdraw
        case SupportedChainId.OPBNB_MAINNET:
        case SupportedChainId.OPBNB_TESTNET:
          return L2Withdraw
        default:
          return L2Withdraw
      }
    } else {
      return L2Withdraw
    }
  }, [chainId, inputAmount, currentToken, otherRecipient])

  return {
    withdrawCallback,
  }
}

export const useWithdrawInscription = ({
  currentToken,
  inputAmount,
  otherRecipient,
  batchGetBalance,
  setInputAmount,
  setShouldReload,
}: {
  currentToken: BRIDGE_INFO
  inputAmount: number | undefined
  otherRecipient?: string
  batchGetBalance: () => void
  setInputAmount: React.Dispatch<number | undefined>
  setShouldReload: React.Dispatch<boolean>
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)

  const { chainId, provider, account } = useWeb3React()
  const addTransaction = useTransactionAdder()

  const tokenAddress = TOKEN_ADDRESS.find((token) => token.symbol === currentToken.symbol && token.chainId === chainId)?.address || ''
  const signer = provider?.getSigner()
  const tokenContract = new ethers.Contract(tokenAddress, BRC20_ABI, signer)
  const bridgeAddress = BRIDGE_CONTRACT_ADDRESS[chainId as SupportedChainId.OPBNB_MAINNET | SupportedChainId.OPBNB_TESTNET]

  // Check allowance
  const getAllowance = async () => {
    try {
      const allowance = await tokenContract.allowance(account, bridgeAddress)
      return allowance
    } catch (err) {
      console.log('[Error checkAllowance]', err)
    }
  }

  // Burn ERC-20
  const burnERC20 = async () => {
    try {
      setIsLoading(true)

      const allowancce = await getAllowance()
      const amount = ethers.utils.parseEther(inputAmount?.toString() || '0').toString()
      if (allowancce.lt(amount)) {
        const approveTx = await tokenContract.approve(bridgeAddress, amount)
        const receipt = await approveTx.wait()
        console.log('[Approve ERC-20]', receipt)
      }

      const bridgeContract = new ethers.Contract(bridgeAddress, BRC_20_FACTORY_ABI, signer)
      const fee = await bridgeContract.fee()

      const isValidAddress = otherRecipient ? ethers.utils.isAddress(otherRecipient) : false
      if (!isValidAddress && otherRecipient) {
        throw 'Invalid receipient address'
      }

      const burnTx = await bridgeContract.burn(tokenAddress, amount, otherRecipient ? otherRecipient : account, {
        value: fee.toString(),
      })
      const receipt = await burnTx.wait()
      console.log('[Burn ERC-20]', receipt)

      addTransaction(burnTx, {
        type: TransactionType.BRIDGE_WITHDRAW_BURN,
        symbol: currentToken?.symbol ? currentToken?.symbol : 'UNDEFINED',
        amount: inputAmount ? inputAmount.toString() : 'UNDEFINED',
      })

      batchGetBalance()
      setInputAmount(0)
      setIsSuccess(true)
      setIsLoading(false)
      setShouldReload(true)
    } catch (err) {
      console.log('[Error burnERC20]', err)
      setIsError(true)
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    isError,
    isSuccess,
    burnERC20,
  }

}
