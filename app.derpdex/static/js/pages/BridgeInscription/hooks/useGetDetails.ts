// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import * as ethers from 'ethers'
import { useState } from 'react'

import BRC20_ABI from '../../../abis/brc20.abi.json'
import { BRIDGE_INFO, LINK_TO_BRIDGE_FILE } from '../_supported_token_bridge'
import { TOKEN_ADDRESS } from '../constant'
import { API_ENDPOINT } from '../utils/useVarieties'

type TTx = {
  blockNumber: number
  trx_id: string
  from_address: string
  to_address: string
  decode_data: string
  block_time: number
  amount?: number
  logoURI?: string
  symbol?: string
}

type TBurnTx = {
  blockNumber: number
  txId: string
  receiver_address: string
  requester_address: string
  amount: string
  logoURI?: string
  symbol?: string
  token_address: string
  burnHash: string
}

type TDepositDetails = {
  balance: number
  txList: TTx[]
}

// eslint-disable-next-line import/no-unused-modules
export const useGetDepositDetails = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const [details, setDetails] = useState<TDepositDetails>({
    balance: 0,
    txList: [],
  })

  const getDepositDetails = async (walletAddress: string, chainId: number) => {
    setIsLoading(true)
    try {
      const result = await fetch(`${API_ENDPOINT}/get-user-details?walletAddress=${walletAddress.toLowerCase()}`)
      const data = await result.json()
      let mappedTx = []

      if (data) {
        const url = LINK_TO_BRIDGE_FILE[chainId]
        const assetDetailsResponse = await fetch(url, {
          cache: 'no-cache',
        })
        if (assetDetailsResponse.ok) {
          const assetDetails = await assetDetailsResponse.json()

          mappedTx = data.txList.map((i: any) => {
            const decodeData = JSON.parse(i.decode_data.replace('data:,', ''))

            i.logoURI = assetDetails.find((a: BRIDGE_INFO) => a.symbol === decodeData.tick).logoURI
            i.amount = Number(decodeData.amt)
            i.symbol = decodeData.tick

            return i
          })
        }
      }

      setDetails({
        balance: data.balance,
        txList: mappedTx,
      })
      setIsLoading(false)
      setIsSuccess(true)
    } catch (err) {
      setIsError(true)
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    isError,
    isSuccess,
    details,
    getDepositDetails,
  }
}

// eslint-disable-next-line import/no-unused-modules
export const useGetWithdrawalDetails = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const [balance, setBalance] = useState<number>(0)

  const getWithdrawalDetails = async (walletAddress: string, symbol: string, chainId: number, provider: any) => {
    setIsLoading(true)
    try {
      const tokenAddress =
        TOKEN_ADDRESS.find((token) => token.symbol === symbol && token.chainId === chainId)?.address || ''
      const tokenContract = new ethers.Contract(tokenAddress, BRC20_ABI, provider)

      const balanceInRaw = await tokenContract.balanceOf(walletAddress)
      setBalance((Math.floor(parseFloat(ethers.utils.formatUnits(balanceInRaw, 18))) * 10000) / 10000)
      setIsLoading(false)
      setIsSuccess(true)
    } catch (err) {
      setIsError(true)
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    isError,
    isSuccess,
    balance,
    getWithdrawalDetails,
  }
}

// eslint-disable-next-line import/no-unused-modules
export const useGetBurnTransactions = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const [txList, setTxList] = useState<TBurnTx[]>([])

  const formatEtherCustom = (wei: any) => {
    // Convert wei to Ether and get the string representation
    const etherString = ethers.utils.formatEther(wei)

    // Convert to a number and check if it's an integer
    const etherNumber = parseFloat(etherString)
    if (Number.isInteger(etherNumber)) {
      return etherNumber.toString()
    } else {
      return etherString
    }
  }

  const getBurnTransactions = async (walletAddress: string, chainId: number) => {
    setIsLoading(true)
    try {
      const result = await fetch(`${API_ENDPOINT}/get-burn-transactions?walletAddress=${walletAddress.toLowerCase()}`)
      const data = await result.json()
      let mappedTx = []

      if (data) {
        const url = LINK_TO_BRIDGE_FILE[chainId]
        const assetDetailsResponse = await fetch(url, {
          cache: 'no-cache',
        })
        if (assetDetailsResponse.ok) {
          const assetDetails = await assetDetailsResponse.json()

          mappedTx = data.txList.map((i: any) => {
            i.logoURI = assetDetails.find((a: BRIDGE_INFO) => a.symbol === i.symbol).logoURI
            i.amount = formatEtherCustom(i.amount)

            return i
          })
        }
      }

      setTxList(mappedTx)
      setIsLoading(false)
      setIsSuccess(true)
    } catch (err) {
      setIsError(true)
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    isError,
    isSuccess,
    txList,
    getBurnTransactions,
  }
}
