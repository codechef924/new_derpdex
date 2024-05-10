import { useWeb3React } from '@web3-react/core'
import { SupportedChainId } from 'constants/chains'
import { RPC_URLS } from 'constants/networks'
import { ethers } from 'ethers'
import { useMemo } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { TransactionType } from 'state/transactions/types'
import { Provider } from 'zksync-web3'

import { BRIDGE_INFO } from '../_supported_token_bridge'
import { API_ENDPOINT, IWITHDRAWONL2, useGetAllAvailableWithdrawal, useInsertWithdrawOnL2 } from '../utils/useVarieties'

interface IWITHDRAW_API {
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

  const zkSyncL2Withdraw = async () => {
    try {
      setIsWithdrawLoading(true)
      if (!provider || !account || !inputAmount || !chainId)
        throw 'You must provide provider/account/inputAmount/chainId'

      const signer = provider.getSigner()
      const zksyncProvider = new Provider(
        RPC_URLS[chainId === 324 ? SupportedChainId.ZKSYNC_MAINNET : SupportedChainId.ZKSYNC_TESTNET][0]
      )

      const signedTx = await zksyncProvider.getWithdrawTx({
        to: account,
        token: currentToken?.L2Address ? currentToken?.L2Address : '',
        amount: ethers.utils.parseUnits(inputAmount ? inputAmount.toString() : '0', currentToken?.decimals),
      })
      const tx = await signer.sendTransaction(signedTx)
      const receipt = await tx.wait()
      setInputAmount(0)
      // REFETCH BALANCE
      batchGetBalance()

      const payload: IWITHDRAWONL2 = {
        transactionHash: tx.hash,
        address: account,
        tokenAddress: currentToken.L2Address,
        symbol: currentToken.symbol,
        amount: inputAmount.toString(),
        isTestnet: process.env.REACT_APP_IS_TESTSITE === 'true' ? true : false,
        chainId,
        blockNumber: receipt.blockNumber,
      }

      if (!currentToken.isNative) await insertWithdrawOnL2(payload)

      await getAllAvailableWithdrawal(account, process.env.REACT_APP_IS_TESTSITE === 'true' ? true : false)

      setIsWithdrawLoading(false)
      setSuccessWithdraw(true)

      addTransaction(tx, {
        type: TransactionType.BRIDGE_WITHDRAW,
        symbol: currentToken?.symbol ? currentToken?.symbol : 'UNDEFINED',
        amount: inputAmount ? inputAmount.toString() : 'UNDEFINED',
      })
      setShouldReload(true)
    } catch (err) {
      setInputAmount(0.0)
      setIsWithdrawLoading(false)
      setSuccessWithdraw(false)
      console.log('[Err zkSyncL2Deposit]', err)
    }
  }

  const opBnbL2Withdraw = async () => {
    try {
      setIsWithdrawLoading(true)
      if (!provider || !chainId || !account || !inputAmount) throw 'Provider/ChainId/Account/inputAmount not found'

      const payload: IWITHDRAW_API = {
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
          tokenAddress: currentToken.L2Address,
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
          return zkSyncL2Withdraw
        case SupportedChainId.OPBNB_MAINNET:
        case SupportedChainId.OPBNB_TESTNET:
          return opBnbL2Withdraw
        default:
          return zkSyncL2Withdraw
      }
    } else {
      return zkSyncL2Withdraw
    }
  }, [chainId, inputAmount, currentToken, otherRecipient])

  return {
    withdrawCallback,
  }
}
