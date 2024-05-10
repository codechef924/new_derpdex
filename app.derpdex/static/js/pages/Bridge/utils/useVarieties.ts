/* eslint-disable import/no-unused-modules */
import { useWeb3React } from '@web3-react/core'
import { SupportedChainId } from 'constants/chains'
import { RPC_URLS } from 'constants/networks'
import { ethers } from 'ethers'
import { useState } from 'react'
import { L1Signer, Provider } from 'zksync-web3'

import { BRIDGE_INFO, LINK_TO_BRIDGE_FILE } from '../_supported_token_bridge'

export const API_ENDPOINT = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080/api/v1'

export interface IAVAILABLEWITHDRAWLOG {
  transactionHash: string
  symbol: string
  tokenAddress: string
  amount: string
  timestamp: number
  url?: string
  claimable: boolean
  chainId: number
  blockNumber: number
}

const initialData: IAVAILABLEWITHDRAWLOG = {
  transactionHash: '',
  symbol: '',
  tokenAddress: '',
  amount: '',
  timestamp: 0,
  url: '',
  claimable: false,
  chainId: 0,
  blockNumber: 0,
}

export const useGetAvailableWithdrawal = () => {
  const [isLoadingGetAvailableWithdrawal, setIsLoadingGetAvailableWithdrawal] = useState<boolean>(false)
  const [isSuccessGetAvailableWithdrawal, setIsSuccessGetAvailableWithdrawal] = useState<boolean>(false)
  const [isPendingTimelapse, setPendingTimelapse] = useState<boolean>(false)
  const [availableWithdrawalLog, setAvailableWithdrawalLog] = useState<IAVAILABLEWITHDRAWLOG>(initialData)

  const getAvailableWithdrawal = async (address: string, tokenAddress: string, isTestnet?: boolean) => {
    try {
      setIsLoadingGetAvailableWithdrawal(true)
      const result = await fetch(`${API_ENDPOINT}/get-withdrawals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // IMPORTANT
        },
        body: JSON.stringify({ address, tokenAddress, isTestnet }),
      })
      const data = await result.json()
      const response = data.result as IAVAILABLEWITHDRAWLOG | string
      if (response === 'NULL') {
        setIsSuccessGetAvailableWithdrawal(false)
      } else {
        const responseObj = response as IAVAILABLEWITHDRAWLOG
        if (Date.now() - responseObj.timestamp > 60 * 60 * 1000) {
          setPendingTimelapse(true)
        }
        setAvailableWithdrawalLog(responseObj)
        setIsSuccessGetAvailableWithdrawal(true)
      }
      setIsLoadingGetAvailableWithdrawal(false)
    } catch (error) {
      setIsLoadingGetAvailableWithdrawal(false)
    }
  }

  return {
    isPendingTimelapse,
    availableWithdrawalLog,
    isLoadingGetAvailableWithdrawal,
    isSuccessGetAvailableWithdrawal,
    setIsSuccessGetAvailableWithdrawal,
    getAvailableWithdrawal,
  }
}

const INVERT_CHAIN_ID: { [key: number]: number } = {
  [SupportedChainId.BNB_TESTNET]: SupportedChainId.OPBNB_TESTNET,
  [SupportedChainId.BNB]: SupportedChainId.OPBNB_MAINNET,
  [SupportedChainId.OPBNB_TESTNET]: SupportedChainId.OPBNB_TESTNET,
  [SupportedChainId.OPBNB_MAINNET]: SupportedChainId.OPBNB_MAINNET,
  [SupportedChainId.GOERLI]: SupportedChainId.ZKSYNC_TESTNET,
  [SupportedChainId.MAINNET]: SupportedChainId.ZKSYNC_MAINNET,
  [SupportedChainId.ZKSYNC_TESTNET]: SupportedChainId.ZKSYNC_TESTNET,
  [SupportedChainId.ZKSYNC_MAINNET]: SupportedChainId.ZKSYNC_MAINNET,
}
// GET ALL AVAILABLE
export const useGetAllAvailableWithdrawal = () => {
  const { chainId } = useWeb3React()
  const [isLoadingGetAllAvailableWithdrawal, setIsLoadingGetAllAvailableWithdrawal] = useState<boolean>(false)
  const [isSuccessGetAllAvailableWithdrawal, setIsSuccessGetAllAvailableWithdrawal] = useState<boolean>(false)
  const [isPendingAllTimelapse, setPendingAllTimelapse] = useState<boolean>(false)
  const [allAvailableWithdrawalLog, setAllAvailableWithdrawalLog] = useState<IAVAILABLEWITHDRAWLOG[]>([])

  const getAllAvailableWithdrawal = async (address: string, isTestnet?: boolean) => {
    try {
      if (!chainId) throw 'chainId is required'

      setIsLoadingGetAllAvailableWithdrawal(true)
      const result = await fetch(`${API_ENDPOINT}/get-all-withdrawals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // IMPORTANT
        },
        body: JSON.stringify({ address, isTestnet, chainId: INVERT_CHAIN_ID[chainId] }),
      })
      const data = await result.json()

      const response = data as IAVAILABLEWITHDRAWLOG[] | string

      if (response === 'NULL') {
        setIsSuccessGetAllAvailableWithdrawal(false)
      } else {
        const responseObj = response as IAVAILABLEWITHDRAWLOG[]
        const url = LINK_TO_BRIDGE_FILE[chainId]
        const assetDetailsResponse = await fetch(url, {
          cache: 'no-cache',
        })
        if (!assetDetailsResponse.ok) console.warn('[Error fetch asset]')

        const assetDetails = await assetDetailsResponse.json()
        responseObj.map((i) => {
          i.url = assetDetails.find((a: BRIDGE_INFO) => a.symbol === i.symbol).logoURI
        })
        // console.log('responseObj', responseObj)

        setAllAvailableWithdrawalLog(responseObj)
        setIsSuccessGetAllAvailableWithdrawal(true)
      }
      setIsLoadingGetAllAvailableWithdrawal(false)
    } catch (error) {
      setIsLoadingGetAllAvailableWithdrawal(false)
    }
  }

  return {
    isPendingAllTimelapse,
    allAvailableWithdrawalLog,
    isLoadingGetAllAvailableWithdrawal,
    isSuccessGetAllAvailableWithdrawal,
    setAllAvailableWithdrawalLog,
    setIsSuccessGetAllAvailableWithdrawal,
    setIsLoadingGetAllAvailableWithdrawal,
    getAllAvailableWithdrawal,
  }
}

export const useCheckIsWithdrawalFinalized = () => {
  const [isLoadingCheckIsWithdrawalFinalized, setIsLoadingCheckIsWithdrawalFinalized] = useState<boolean>(false)
  const [isSuccessCheckIsWithdrawalFinalized, setIsSuccessCheckIsWithdrawalFinalized] = useState<boolean>(false)
  const [isErrorCheckWithdrawalFinalized, setIsErrorCheckWithdrawalFinalized] = useState<boolean>(false)
  const [isAlreadyWithdrawalFinalized, setIsAlreadyWithdrawalFinalized] = useState<boolean>(false)
  const checkIsWithdrawalFinalized = async (txhashOnL2: string, isTestnet?: boolean) => {
    setIsLoadingCheckIsWithdrawalFinalized(true)
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        !isTestnet ? RPC_URLS[SupportedChainId.MAINNET][0] : RPC_URLS[SupportedChainId.GOERLI][0]
      )
      const signer = provider.getSigner()
      const zkSyncProvider = new Provider(
        !isTestnet ? RPC_URLS[SupportedChainId.ZKSYNC_MAINNET][0] : RPC_URLS[SupportedChainId.ZKSYNC_TESTNET][0]
      )
      const extendedSigner = L1Signer.from(signer, zkSyncProvider)

      const result = await extendedSigner.isWithdrawalFinalized(txhashOnL2)

      if (!result) {
        setIsAlreadyWithdrawalFinalized(false)
        setIsSuccessCheckIsWithdrawalFinalized(true)
      } else {
        const onUpdate = await fetch(`${API_ENDPOINT}/update-withdrawal`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', // IMPORTANT
          },
          body: JSON.stringify({ transactionHash: txhashOnL2, isTestnet }),
        })
        setIsAlreadyWithdrawalFinalized(true)
        setIsSuccessCheckIsWithdrawalFinalized(false)
      }
      setIsLoadingCheckIsWithdrawalFinalized(false)
    } catch (error) {
      console.log('[Warning]:', error)
      setIsErrorCheckWithdrawalFinalized(true)
      setIsSuccessCheckIsWithdrawalFinalized(false)
      setIsLoadingCheckIsWithdrawalFinalized(false)
    }
  }

  return {
    isErrorCheckWithdrawalFinalized,
    isLoadingCheckIsWithdrawalFinalized,
    isSuccessCheckIsWithdrawalFinalized,
    isAlreadyWithdrawalFinalized,
    checkIsWithdrawalFinalized,
  }
}

export interface IWITHDRAWONL2 {
  transactionHash: string
  address: string
  tokenAddress: string
  symbol: string
  amount: string
  isTestnet?: boolean
  chainId: number
  blockNumber: number | undefined
}
export const useInsertWithdrawOnL2 = () => {
  const [isLoadingInsertWithdrawOnL2, setIsLoadingInsertWithdrawOnL2] = useState<boolean>(false)
  const [isSuccessInsertWithdrawOnL2, setIsSuccessInsertWithdrawOnL2] = useState<boolean>(false)

  const insertWithdrawOnL2 = async (payload: IWITHDRAWONL2) => {
    setIsLoadingInsertWithdrawOnL2(true)
    try {
      const result = await fetch(`${API_ENDPOINT}/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // IMPORTANT
        },
        body: JSON.stringify({ ...payload }),
      })

      setIsSuccessInsertWithdrawOnL2(true)
    } catch (error) {
      console.log('[Warning]:', error)
    }
    setIsLoadingInsertWithdrawOnL2(false)
  }

  return {
    isLoadingInsertWithdrawOnL2,
    isSuccessInsertWithdrawOnL2,
    insertWithdrawOnL2,
  }
}

export const useFinalizedWithdrawal = () => {
  const [isLoadingFinalizedWithdrawal, setIsLoadingFinalizedWithdrawal] = useState<boolean>(false)
  const [isSuccessFinalizedWithdrawal, setIsSuccessFinalizedWithdrawal] = useState<boolean>(false)
  const [isErrorFinalizedWithdrawal, setIsErrorFinalizedWithdrawal] = useState<boolean>(false)
  const [finalizedHash, setFinalizedHash] = useState<string>('')

  const finalizeWithdrawal = async (txhashOnL2: string, signer: L1Signer, isTestnet?: boolean) => {
    setIsLoadingFinalizedWithdrawal(true)
    setIsErrorFinalizedWithdrawal(false)
    try {
      const result = await signer.finalizeWithdrawal(txhashOnL2)
      setFinalizedHash(result.hash)

      if (result) setIsSuccessFinalizedWithdrawal(true)
      else setIsSuccessFinalizedWithdrawal(false)

      const onUpdate = await fetch(`${API_ENDPOINT}/update-withdrawal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // IMPORTANT
        },
        body: JSON.stringify({ transactionHash: txhashOnL2, isTestnet }),
      })
      setIsLoadingFinalizedWithdrawal(false)
    } catch (error) {
      console.log('[Warning]:', error)
      setIsErrorFinalizedWithdrawal(true)
      setIsSuccessFinalizedWithdrawal(false)
      setIsLoadingFinalizedWithdrawal(false)
    }
  }

  return {
    finalizedHash,
    isLoadingFinalizedWithdrawal,
    isSuccessFinalizedWithdrawal,
    isErrorFinalizedWithdrawal,
    finalizeWithdrawal,
  }
}

export const useCheckIsWithdrawalFinalizedOpBNB = () => {
  const [isLoadingCheckIsWithdrawalFinalized, setIsLoadingCheckIsWithdrawalFinalized] = useState<boolean>(false)
  const [isSuccessCheckIsWithdrawalFinalized, setIsSuccessCheckIsWithdrawalFinalized] = useState<boolean>(false)
  const [isErrorCheckWithdrawalFinalized, setIsErrorCheckWithdrawalFinalized] = useState<boolean>(false)
  const [isAlreadyWithdrawalFinalized, setIsAlreadyWithdrawalFinalized] = useState<boolean>(false)
  const checkIsWithdrawalFinalized = async (txhashOnL2: string, isTestnet?: boolean) => {
    setIsLoadingCheckIsWithdrawalFinalized(true)
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        !isTestnet ? RPC_URLS[SupportedChainId.MAINNET][0] : RPC_URLS[SupportedChainId.GOERLI][0]
      )
      const signer = provider.getSigner()
      const zkSyncProvider = new Provider(
        !isTestnet ? RPC_URLS[SupportedChainId.ZKSYNC_MAINNET][0] : RPC_URLS[SupportedChainId.ZKSYNC_TESTNET][0]
      )
      const extendedSigner = L1Signer.from(signer, zkSyncProvider)

      const result = await extendedSigner.isWithdrawalFinalized(txhashOnL2)

      if (!result) {
        setIsAlreadyWithdrawalFinalized(false)
        setIsSuccessCheckIsWithdrawalFinalized(true)
      } else {
        const onUpdate = await fetch(`${API_ENDPOINT}/update-withdrawal`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', // IMPORTANT
          },
          body: JSON.stringify({ transactionHash: txhashOnL2, isTestnet }),
        })
        setIsAlreadyWithdrawalFinalized(true)
        setIsSuccessCheckIsWithdrawalFinalized(false)
      }
      setIsLoadingCheckIsWithdrawalFinalized(false)
    } catch (error) {
      console.log('[Warning]:', error)
      setIsErrorCheckWithdrawalFinalized(true)
      setIsSuccessCheckIsWithdrawalFinalized(false)
      setIsLoadingCheckIsWithdrawalFinalized(false)
    }
  }

  return {
    isErrorCheckWithdrawalFinalized,
    isLoadingCheckIsWithdrawalFinalized,
    isSuccessCheckIsWithdrawalFinalized,
    isAlreadyWithdrawalFinalized,
    checkIsWithdrawalFinalized,
  }
}
