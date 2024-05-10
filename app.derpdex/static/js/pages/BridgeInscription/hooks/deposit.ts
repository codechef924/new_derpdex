/* eslint-disable import/no-unused-modules */
import { useWeb3React } from '@web3-react/core'
import { SupportedChainId } from 'constants/chains'
import { ethers } from 'ethers'
import { useMemo, useState } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { TransactionType } from 'state/transactions/types'

import BRC20_FACTORY_ABI from '../../../abis/brc20-factory.abi.json'
import { BRIDGE_INFO } from '../_supported_token_bridge'
import { BRIDGE_CONTRACT_ADDRESS, INSCRIPTION_RECEIVER, TOKEN_ADDRESS } from '../constant'
import { API_ENDPOINT } from '../utils/useVarieties'

interface IMINT_TX {
  signatures: any
  symbol: string
  inputAmount: number | undefined
}

export const useSupportedDepositCallback = ({
  currentToken,
  inputAmount,
  otherRecipient,
  setIsInsufficientFunds,
  setIsDepositLoading,
  setSuccessDeposit,
  batchGetBalance,
  setInputAmount,
  handleOpen,
}: {
  currentToken: BRIDGE_INFO
  inputAmount: number | undefined
  otherRecipient?: string
  setIsInsufficientFunds: React.Dispatch<boolean>
  setIsDepositLoading: React.Dispatch<boolean>
  setSuccessDeposit: React.Dispatch<boolean>
  batchGetBalance: () => void
  setInputAmount: React.Dispatch<number | undefined>
  handleOpen: () => void
}) => {
  const { chainId, provider, account } = useWeb3React()
  const addTransaction = useTransactionAdder()

  const L1Deposit = async () => {
    setIsInsufficientFunds(false)
    try {
      setIsDepositLoading(true)
      if (!provider || !chainId || !account) throw 'Provider/ChainId/Account not found'

      if (inputAmount === undefined) throw 'Amount must be provided'

      const payload = {
        p: currentToken.inscription.p,
        op: 'transfer',
        tick: currentToken.inscription.tick,
        amt: inputAmount.toString(),
      }

      const data = `data:,${JSON.stringify(payload)}`
      const calldata = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(data))

      const params = {
        from: account,
        to: INSCRIPTION_RECEIVER,
        data: calldata,
        value: ethers.BigNumber.from(0),
      }

      const signer = provider.getSigner()
      const tx = await signer.sendTransaction(params)
      await tx.wait(5)

      addTransaction(tx, {
        type: TransactionType.BRIDGE_DEPOSIT_TRANSFER,
        symbol: currentToken?.symbol ? currentToken?.symbol : 'UNDEFINED',
        amount: inputAmount ? inputAmount.toString() : 'UNDEFINED',
      })

      // REFETCH BALANCE
      batchGetBalance()
      setIsDepositLoading(false)
      setSuccessDeposit(true)
      setInputAmount(0)
    } catch (err) {
      setIsDepositLoading(false)
      setSuccessDeposit(false)
      if (err.code === 'INSUFFICIENT_FUNDS') {
        setIsInsufficientFunds(true)
        handleOpen()
      }
      console.log('[Error L1Deposit]', err)
    }
  }

  const depositCallback = useMemo(() => {
    if (chainId) {
      switch (chainId) {
        case SupportedChainId.GOERLI:
        case SupportedChainId.MAINNET:
          return L1Deposit
        case SupportedChainId.BNB:
        case SupportedChainId.BNB_TESTNET:
          return L1Deposit
        default:
          return L1Deposit
      }
    } else {
      return L1Deposit
    }
  }, [chainId, inputAmount, currentToken, otherRecipient])

  return {
    depositCallback,
  }
}

export const useRequestSignatures = () => {
  const [isLoading, setLoading] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const [signatures, setSignatures] = useState<any>(null)

  const requestSignatures = async (payload: any) => {
    setLoading(true)
    try {
      const response = await fetch(
        `${API_ENDPOINT}/get-signatures?chainId=${payload.chainId}&tokenSymbol=${payload.symbol}&txHash=${payload.txHash}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json', // IMPORTANT
          },
        }
      )

      const data = await response.json()
      setSignatures(data)
      setIsSuccess(true)
      setLoading(false)
    } catch (err) {
      setIsError(true)
      setLoading(false)
    }
  }

  return {
    isLoading,
    isError,
    isSuccess,
    signatures,
    requestSignatures,
  }
}

export const useMintTx = ({ batchGetBalance }: { batchGetBalance: () => void }) => {
  const [isLoading, setLoading] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)

  const { chainId, provider, account } = useWeb3React()
  const addTransaction = useTransactionAdder()

  const mintTx = async (payload: IMINT_TX) => {
    setLoading(true)
    try {
      const signer = provider?.getSigner()
      const contract = new ethers.Contract(
        BRIDGE_CONTRACT_ADDRESS[chainId as SupportedChainId.OPBNB_MAINNET | SupportedChainId.OPBNB_TESTNET],
        BRC20_FACTORY_ABI,
        signer
      )

      const tokenAddress =
        TOKEN_ADDRESS.find((token) => token.symbol === payload.symbol && token.chainId === chainId)?.address || ''
      const amount = ethers.BigNumber.from(payload.inputAmount).mul(ethers.BigNumber.from(10).pow(18))

      const tx = await contract.mint(
        tokenAddress,
        account,
        amount.toString(),
        payload.signatures.txId,
        payload.signatures.v,
        payload.signatures.r,
        payload.signatures.s
      )

      await tx.wait(5)

      addTransaction(tx, {
        type: TransactionType.BRIDGE_DEPOSIT_MINT,
        symbol: payload.symbol,
        amount: payload.inputAmount?.toString() || '',
      })

      batchGetBalance()
      setIsSuccess(true)
      setLoading(false)

      await new Promise((resolve) => setTimeout(resolve, 3000))
    } catch (err) {
      console.log('err', err)
      setIsError(true)
      setLoading(false)
    }
  }

  return {
    isLoading,
    isError,
    isSuccess,
    mintTx,
  }
}
