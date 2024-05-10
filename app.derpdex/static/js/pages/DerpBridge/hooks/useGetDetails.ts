// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { ERC20Abi } from '@looksrare/sdk'
import { useWeb3React } from '@web3-react/core'
import * as ethers from 'ethers'
import { useState } from 'react'

import { BRIDGE_INFO_SUPPORTED_TOKEN } from '../_supported_token_bridge'
import { API_ENDPOINT } from '../utils/useVarieties'

export type TTx = {
  // blockNumber: number
  trx_id: string
  from_address: string
  bridgeTxHash: string
  // to_address: string
  // decode_data: string
  // block_time: number

  status?: string
  tokenAddress?: string
  userAddress?: string
  claimTokenAddress?: string
  sourceChainId?: number
  targetChainId?: number
  nonce?: number
  type?: string
  amount?: number
  logoURI?: string
  symbol?: string
}

type TDepositDetails = {
  balance: number
  txList: TTx[]
}

// eslint-disable-next-line import/no-unused-modules
export const useGetDepositDetails = () => {
  const { chainId, provider } = useWeb3React()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const [details, setDetails] = useState<TDepositDetails>({
    balance: 0,
    txList: [],
  })

  const getTokenBalance = async (walletAddress: string, tokenAddress: string, txns?: any[]) => {
    setIsLoading(true)

    try {
      const tokenContract = new ethers.Contract(tokenAddress, ERC20Abi, provider)
      const [balanceRaw, decimals] = await Promise.all([
        tokenContract.balanceOf(walletAddress),
        tokenContract.decimals(),
      ])
      const balance = Math.floor(parseFloat(ethers.utils.formatUnits(balanceRaw, decimals)))
      console.log('balance', balance)

      setDetails({
        balance,
        txList: [],
      })
      setIsLoading(false)
      setIsSuccess(true)
    } catch (err) {
      setIsError(true)
      setIsLoading(false)
    }
  }

  const updateBalance = async (tokenAddress: string, userAddress?: string) => {
    try {
      const tokenContract = new ethers.Contract(
        tokenAddress,
        // txn.type == 'CLAIM' ? txn.claimTokenAddress : txn.tokenAddress,
        ERC20Abi,
        provider
      )
      const [balanceRaw, decimals] = await Promise.all([tokenContract.balanceOf(userAddress), tokenContract.decimals()])
      const balance = Math.floor(parseFloat(ethers.utils.formatUnits(balanceRaw, decimals)))

      setDetails((details) => ({
        ...details,
        balance,
      }))
    } catch (error) {
      console.log('error', error)
    }
  }

  const updateTxStatus = async (txn: any) => {
    let existingTxns = details.txList
    // console.log('updateTxStatus', txn, existingTxns)

    if (txn && txn.type == 'BRIDGE') {
      existingTxns.push(txn)
    } else if (txn /* && txn.type == 'CLAIM' */) {
      existingTxns = details.txList.map((i) => {
        if (
          txn.tokenAddress.toLowerCase() == i.tokenAddress?.toLowerCase() &&
          txn.sourceChainId == i.sourceChainId &&
          txn.nonce == i.nonce
        ) {
          // i.status = txn.status
          return { ...i, status: txn.status }
        }

        return i
      })
    }

    setDetails((details) => ({
      ...details,
      txList: existingTxns,
    }))
  }

  const getDepositDetails = async (walletAddress: string, token: BRIDGE_INFO_SUPPORTED_TOKEN, chainId: number) => {
    // console.log('getDepositDetails', walletAddress, token, chainId)
    setIsLoading(true)
    try {
      const tokenContract = new ethers.Contract(token.address, ERC20Abi, provider)
      const [balanceRaw, decimals] = await Promise.all([
        tokenContract.balanceOf(walletAddress),
        tokenContract.decimals(),
      ])

      const balance = Math.floor(parseFloat(ethers.utils.formatUnits(balanceRaw, decimals)))

      const response = await fetch(`${API_ENDPOINT}/pendingClaims?userAddress=${walletAddress.toLowerCase()}`)
      const data = await response.json()
      const pendingClaimsByChain = data.pendingClaims.reduce((acc: any, cur: any) => {
        if (!(cur.targetChainId in acc)) {
          // acc[cur.targetChainId] = cur
          acc[cur.targetChainId] = []
        }
        acc[cur.targetChainId].push(cur)

        //sort by nonce
        acc[cur.targetChainId].sort((a: any, b: any) => a.nonce - b.nonce)

        return acc
      }, {})

      let pendingClaims = Object.values(pendingClaimsByChain).flat()
      pendingClaims = pendingClaims.sort(
        (a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )

      const transactions = pendingClaims.map((i: any) => {
        i.amount = parseFloat(ethers.utils.formatUnits(i.amount, decimals)).toFixed(2)

        i.logoURI = token.logoURI
        i.symbol = token.symbol

        //NOTE: BRIDGE_PENDING and CLAIMED_PENDING are intermediate statuses and are not persisted in the DB.
        //So for txns with those states use the one in the state(intermediate value), unless the state is "CLAIMED".
        //When the state is CLAIMED in db, there should be no intermediate values, so use the one in the db.
        const existingTx = details.txList.find(
          (tx) =>
            (tx.status == 'BRIDGE_PENDING' || tx.status == 'CLAIMED_PENDING' || tx.status == 'CLAIMED') &&
            tx.targetChainId == i.targetChainId &&
            tx.sourceChainId == i.sourceChainId &&
            tx.tokenAddress?.toLowerCase() == i.tokenAddress.toLowerCase() &&
            tx.nonce == i.nonce
        )
        if (existingTx && i.status != 'CLAIMED') {
          return existingTx
        }

        return i
      })

      // console.log('transactions', transactions)

      setDetails((details) => ({
        ...details,
        txList: transactions,
      }))

      setIsLoading(false)
      setIsSuccess(true)
    } catch (err) {
      console.log('err', err)

      setIsError(true)
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    isError,
    isSuccess,
    details,
    updateBalance,
    updateTxStatus,
    getDepositDetails,
    getTokenBalance,
  }
}
