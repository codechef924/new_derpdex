/* eslint-disable import/no-unused-modules */
import { useWeb3React } from '@web3-react/core'
import { SupportedChainId } from 'constants/chains'
import { ethers } from 'ethers'
import { useApproveAllowance } from 'pages/DerpBridge/components/approveBridge'
import { useCallback, useState } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { TransactionType } from 'state/transactions/types'

import DERPBRIDGE_ABI from '../../../abis/DerpBridge.json'
import { BRIDGE_INFO_SUPPORTED_TOKEN, getSupportedBrigeAssets } from '../_supported_token_bridge'
import { BRIDGE_CONTRACT_ADDRESS } from '../constant'
import { API_ENDPOINT } from '../utils/useVarieties'
import { TTx } from './useGetDetails'

interface IMINT_TX {
  signatures: any
  symbol: string
  inputAmount: number | undefined
}

interface ICLAIM_TX {
  signature: string
  expiry: string
  sourceChainId: number
  nonce: number
  amount: string
  tokenAddress: string
  sourceChainTokenAddress: string

  targetChainId: number
}

export const useSupportedDepositCallback = ({
  targetChainId,
  currentToken,
  inputAmount,
  otherRecipient,
  setIsInsufficientFunds,
  setIsDepositLoading,
  setSuccessDeposit,
  updateTxStatus,
  updateBalance,
  setInputAmount,
  handleOpen,
}: {
  targetChainId: number
  currentToken: BRIDGE_INFO_SUPPORTED_TOKEN
  inputAmount: number | undefined
  otherRecipient?: string
  setIsInsufficientFunds: React.Dispatch<boolean>
  setIsDepositLoading: React.Dispatch<boolean>
  setSuccessDeposit: React.Dispatch<boolean>
  updateTxStatus: (txn: TTx) => void
  updateBalance: (tokenAddress: string, userAddress: string) => void
  setInputAmount: React.Dispatch<number | undefined>
  handleOpen: () => void
}) => {
  const { chainId, provider, account } = useWeb3React()
  const addTransaction = useTransactionAdder()
  const { approveAllowance } = useApproveAllowance()

  const Deposit = async (_targetNetwork: number) => {
    setIsInsufficientFunds(false)
    try {
      setIsDepositLoading(true)
      if (!provider || !chainId || !account) throw 'Provider/ChainId/Account not found'
      if (inputAmount === undefined) throw 'Amount must be provided'

      const inputAmountParsed = ethers.utils.parseUnits(inputAmount.toString(), currentToken.decimals)

      const BridgeContract = new ethers.Contract(
        BRIDGE_CONTRACT_ADDRESS[chainId as keyof typeof BRIDGE_CONTRACT_ADDRESS],
        DERPBRIDGE_ABI,
        provider.getSigner()
      )

      await approveAllowance({
        contract_addresss: currentToken.address,
        spender: BridgeContract.address,
        account,
        signer: provider.getSigner(),
        amount: inputAmountParsed,
      })

      // const tokenContract = new ethers.Contract(
      //   currentToken.address,
      //   [
      //     'function allowance(address owner, address spender) public view returns (uint256)',
      //     'function approve(address spender, uint256 amount) public returns (bool)',
      //   ],
      //   provider.getSigner()
      // )

      // const allowance = await tokenContract.allowance(account, BridgeContract.address)
      // if (allowance.lt(inputAmountParsed)) {
      //   const tx = await tokenContract.approve(BridgeContract.address, ethers.constants.MaxUint256)
      //   await tx.wait(5)

      //   addTransaction(tx, {
      //     type: TransactionType.APPROVAL,
      //     tokenAddress: currentToken.address,
      //     spender: BridgeContract.address,
      //   })
      // }
      const nonce = await BridgeContract.bridgeNonce(account, currentToken.address, _targetNetwork)
      const tx = await BridgeContract.bridge(currentToken.address, inputAmountParsed, _targetNetwork)
      console.log('tx', tx)

      addTransaction(tx, {
        type: TransactionType.DERP_BRIDGE_BRIDGE,
        symbol: currentToken.symbol,
        amount: inputAmount.toString() || '',
      })

      updateTxStatus({
        type: 'BRIDGE',
        status: 'BRIDGED_PENDING',
        tokenAddress: currentToken.address,
        sourceChainId: chainId,
        amount: inputAmount,
        targetChainId: _targetNetwork,
        symbol: currentToken.symbol,
        from_address: account,
        logoURI: currentToken.logoURI,
        trx_id: tx.hash,
        bridgeTxHash: tx.hash,
        userAddress: account,
        nonce: nonce.toNumber(),
      })

      await tx.wait()
      updateBalance(currentToken.address, account)

      setIsDepositLoading(false)
      setSuccessDeposit(true)
      setInputAmount(0)

      await new Promise((resolve) => setTimeout(resolve, 3000))
    } catch (error: any) {
      setIsDepositLoading(false)
      setSuccessDeposit(false)
      if (error.code === 'INSUFFICIENT_FUNDS') {
        setIsInsufficientFunds(true)
        handleOpen()
      }
      console.log('[Error Bridge]', error)
    }
  }

  const depositCallback = useCallback(
    (_targetNetwork: number) => {
      if (chainId) {
        switch (chainId) {
          case SupportedChainId.GOERLI:
          case SupportedChainId.MAINNET:
            return Deposit(_targetNetwork)
          case SupportedChainId.BNB:
          case SupportedChainId.BNB_TESTNET:
            return Deposit(_targetNetwork)
          default:
            return Deposit(_targetNetwork)
        }
      } else {
        return Deposit(_targetNetwork)
      }
    },
    [chainId, inputAmount, currentToken, otherRecipient]
  )

  return {
    depositCallback,
  }
}

export const useRequestSignatures = ({ updateTxStatus }: { updateTxStatus: (txn: any) => void }) => {
  const [isLoading, setLoading] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const [signatures, setSignatures] = useState<any>(null)

  const { account } = useWeb3React()

  const requestSignatures = async (payload: any) => {
    console.log('requestSignatures', payload)
    setLoading(true)
    try {
      const response = await fetch(
        `${API_ENDPOINT}/signature?sourceChainId=${payload.sourceChainId}&targetChainId=${payload.targetChainId}&nonce=${payload.nonce}&userAddress=${payload.userAddress}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json', // IMPORTANT
          },
        }
      )

      if (!response.ok) throw new Error('Error getting signature')
      const data = await response.json()
      data.targetChainId = payload.targetChainId
      data.sourceChainId = payload.sourceChainId
      data.nonce = payload.nonce

      console.log('requestSignaturesData', data)

      updateTxStatus({
        type: 'CLAIM',
        status: 'CLAIMED_PENDING',
        from_address: account,
        tokenAddress: data.sourceChainTokenAddress, //source chain's token address
        claimTokenAddress: data.tokenAddress, // token address on target chain
        sourceChainId: payload.sourceChainId,
        nonce: payload.nonce,
      })

      setSignatures(data)
      setIsSuccess(true)
      setLoading(false)
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
    signatures,
    requestSignatures,
    setSignatures,
  }
}

export const useClaimTx = ({
  updateTxStatus,
  updateBalance,
  getDepositDetails,
}: {
  updateTxStatus: (txn: any) => void
  updateBalance: (tokenAddress: string, userAddress?: string) => void
  getDepositDetails: (walletAddress: string, token: BRIDGE_INFO_SUPPORTED_TOKEN, chainId: number) => Promise<void>
}) => {
  const [isLoading, setLoading] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)

  const { chainId, provider, account } = useWeb3React()
  const addTransaction = useTransactionAdder()

  const claimTx = async (payload: ICLAIM_TX) => {
    setLoading(true)
    try {
      const signer = provider?.getSigner()

      const BridgeContract = new ethers.Contract(
        BRIDGE_CONTRACT_ADDRESS[chainId as keyof typeof BRIDGE_CONTRACT_ADDRESS],
        DERPBRIDGE_ABI,
        signer
      )

      // console.log('claimTx', payload)

      const tx = await BridgeContract.claim(
        payload.tokenAddress,
        payload.amount,
        payload.sourceChainId,
        payload.nonce,
        payload.expiry,
        payload.signature
      )

      const token = getSupportedBrigeAssets(payload.targetChainId).find(
        (token) => token.address.toLowerCase() === payload.tokenAddress.toLowerCase()
      )

      addTransaction(tx, {
        type: TransactionType.DERP_BRIDGE_CLAIM,
        symbol: token?.symbol || '',
        amount: payload.amount.toString() || '',
      })

      await tx.wait(2)

      // updateTxStatus({
      //   type: 'CLAIM',
      //   status: 'CLAIMED',
      //   tokenAddress: payload.sourceChainTokenAddress,
      //   claimTokenAddress: payload.tokenAddress,
      //   sourceChainId: payload.sourceChainId,
      //   nonce: payload.nonce,
      //   from_address: account,
      //   trx_id: tx.hash,
      // })

      // if (account && token && chainId) {
      //   getDepositDetails(account, token, chainId)
      // }

      updateBalance(payload.tokenAddress, account)

      setIsSuccess(true)
      setLoading(false)

      return true

      // await new Promise((resolve) => setTimeout(resolve, 3000))
    } catch (err) {
      console.log('err', err)
      setIsError(true)
      setLoading(false)
      return false
    }
  }

  return {
    isLoading,
    isError,
    isSuccess,
    claimTx,
  }
}
