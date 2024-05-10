/* eslint-disable import/no-unused-modules */
import { useWeb3React } from '@web3-react/core'
import { SupportedChainId } from 'constants/chains'
import { RPC_URLS } from 'constants/networks'
import { ethers } from 'ethers'
import { useMemo } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { TransactionType } from 'state/transactions/types'
import { L1Signer, Provider } from 'zksync-web3'

import { BRIDGE_INFO } from '../_supported_token_bridge'
import { IDEPOSITONL1, useStoreDepositHash } from '../utils/useStoreDepositHash'
import { API_ENDPOINT } from '../utils/useVarieties'

interface IDEPOSIT_API {
  address: string
  l1Token: {
    address: string
    symbol: string
    decimals: number
  }
  l2Token: {
    address: string
    symbol: string
    decimals: number
  }
  inputAmount: number
  isTestnet: boolean
  otherRecipient?: string
  isNative: boolean
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

  const {
    storedDepositHash,
    addReceiptToLocalStorage,
    dismissStatus,
    depositList: storedDepositListState,
  } = useStoreDepositHash()

  const zkSyncL1Deposit = async () => {
    setIsInsufficientFunds(false)
    try {
      setIsDepositLoading(true)
      if (!provider || !account) throw 'You must provide provider/account'

      const signer = provider.getSigner()
      //! Depositing L1 requires provider of L2 interchange, do not confuse mainnet with testnet
      const zksyncProvider = new Provider(
        RPC_URLS[chainId === 1 ? SupportedChainId.ZKSYNC_MAINNET : SupportedChainId.ZKSYNC_TESTNET][0]
      )
      const signerL1 = L1Signer.from(signer, zksyncProvider)

      if (inputAmount === undefined) throw 'Amount must be provided'

      const amount = ethers.utils.parseUnits(inputAmount.toString(), currentToken.decimals)
      if (!currentToken.isNative) {
        const tx = await signerL1.deposit({
          to: !otherRecipient ? account : otherRecipient,
          token: currentToken.L1Address,
          amount,
        })
        const receipt = await tx.waitL1Commit()

        const logDetails: IDEPOSITONL1 = {
          tokenAddress: currentToken.L1Address,
          symbol: currentToken.symbol,
          amount: inputAmount.toString(),
        }

        addReceiptToLocalStorage(logDetails, receipt)
        addTransaction(tx, {
          type: TransactionType.BRIDGE_DEPOSIT,
          symbol: currentToken?.symbol ? currentToken?.symbol : 'UNDEFINED',
          amount: inputAmount ? inputAmount.toString() : 'UNDEFINED',
        })

        // REFETCH BALANCE
        batchGetBalance()
        setIsDepositLoading(false)
        setSuccessDeposit(true)
      } else {
        const tx = await signerL1.deposit({
          to: !otherRecipient ? account : otherRecipient,
          token: currentToken.L1Address,
          amount,
        })
        await tx.waitL1Commit()
        addTransaction(tx, {
          type: TransactionType.BRIDGE_DEPOSIT,
          symbol: currentToken?.symbol ? currentToken?.symbol : 'UNDEFINED',
          amount: inputAmount ? inputAmount.toString() : 'UNDEFINED',
        })

        // REFETCH BALANCE
        batchGetBalance()
        setIsDepositLoading(false)
        setSuccessDeposit(true)
      }
      setInputAmount(0)
    } catch (err) {
      setIsDepositLoading(false)
      setSuccessDeposit(false)
      if (err.code === 'INSUFFICIENT_FUNDS') {
        setIsInsufficientFunds(true)
        handleOpen()
      }
      console.log('[Error zkSyncL1Deposit]', err)
    }
  }

  const opBnbL1Deposit = async () => {
    setIsInsufficientFunds(false)
    try {
      setIsDepositLoading(true)
      if (!provider || !chainId || !account) throw 'Provider/ChainId/Account not found'

      if (inputAmount === undefined) throw 'Amount must be provided'

      const payload: IDEPOSIT_API = {
        address: account,
        isTestnet: process.env.REACT_APP_IS_TESTSITE === 'true' ? true : false,
        isNative: currentToken.isNative ? true : false,
        inputAmount,
        l1Token: {
          address: currentToken.L1Address,
          symbol: currentToken.symbol,
          decimals: currentToken.decimals,
        },
        l2Token: {
          address: currentToken.L2Address,
          symbol: currentToken.symbol,
          decimals: currentToken.decimals,
        },
        otherRecipient: !otherRecipient ? account : otherRecipient,
      }
      // API
      const result = await fetch(`${API_ENDPOINT}/build-deposit`, {
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
        const depositTx = await signer.sendTransaction(buildTx.tx)
        const receipt = await depositTx.wait()
        const logDetails: IDEPOSITONL1 = {
          tokenAddress: currentToken.L1Address,
          symbol: currentToken.symbol,
          amount: inputAmount.toString(),
        }

        addReceiptToLocalStorage(logDetails, receipt)

        addTransaction(depositTx, {
          type: TransactionType.BRIDGE_DEPOSIT,
          symbol: currentToken?.symbol ? currentToken?.symbol : 'UNDEFINED',
          amount: inputAmount ? inputAmount.toString() : 'UNDEFINED',
        })
        // REFETCH BALANCE
        batchGetBalance()
        setIsDepositLoading(false)
        setSuccessDeposit(true)
        setInputAmount(0)
      } else {
        throw 'Unable to get build transaction'
      }
    } catch (err) {
      setIsDepositLoading(false)
      setSuccessDeposit(false)
      if (err.code === 'INSUFFICIENT_FUNDS') {
        setIsInsufficientFunds(true)
        handleOpen()
      }
      console.log('[Error opBnbL1Deposit]', err)
    }
  }

  const depositCallback = useMemo(() => {
    if (chainId) {
      switch (chainId) {
        case SupportedChainId.GOERLI:
        case SupportedChainId.MAINNET:
          return zkSyncL1Deposit
        case SupportedChainId.BNB:
        case SupportedChainId.BNB_TESTNET:
          return opBnbL1Deposit
        default:
          return zkSyncL1Deposit
      }
    } else {
      return zkSyncL1Deposit
    }
  }, [chainId, inputAmount, currentToken, otherRecipient])

  return {
    depositCallback,
  }
}

// export const useSupportedDepositCallback2 = ({ inputAmount }: { inputAmount?: number }) => {
//   const zkSyncL1Deposit = useCallback(async () => {
//     try {
//       if (!inputAmount) throw 'Invalid: inputAmount required!'
//     } catch (e) {}
//   }, [inputAmount])
// }
