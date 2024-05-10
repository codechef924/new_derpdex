/* eslint-disable import/no-unused-modules */
import styled from '@emotion/styled'
import { CircularProgress } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import { ReactComponent as DismissBtn } from 'assets/svg/close-button-darken.svg'
import { ReactComponent as PendingIcon } from 'assets/svg/pending.svg'
import { GloriaText } from 'components/CustomFonts/GloriaHallelujah'
import { SupportedChainId } from 'constants/chains'
import { RPC_URLS } from 'constants/networks'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { Provider } from 'zksync-web3'
import { TransactionStatus } from 'zksync-web3/build/src/types'
import { getL2HashFromPriorityOp } from 'zksync-web3/build/src/utils'

import { BRIDGE_INFO, L1_BRIDGE, LINK_TO_BRIDGE_FILE } from '../_supported_token_bridge'
import { API_ENDPOINT } from './useVarieties'

export interface IDEPOSITONL1 {
  tokenAddress: string
  symbol: string
  amount: string
  logoUrl?: string
}

interface CompositionOfDeposit {
  logDetails: IDEPOSITONL1
  receipt: ethers.providers.TransactionReceipt
  status: TransactionStatus
  chainId: number
}

interface STOREDHASH {
  [key: string]: CompositionOfDeposit[]
}

export const CHAIN_MAPPED: { [key: number]: number } = {
  [SupportedChainId.OPBNB_MAINNET]: SupportedChainId.BNB,
  [SupportedChainId.BNB]: SupportedChainId.BNB,
  [SupportedChainId.OPBNB_TESTNET]: SupportedChainId.BNB_TESTNET,
  [SupportedChainId.BNB_TESTNET]: SupportedChainId.BNB_TESTNET,
  [SupportedChainId.ZKSYNC_MAINNET]: SupportedChainId.MAINNET,
  [SupportedChainId.MAINNET]: SupportedChainId.MAINNET,
  [SupportedChainId.ZKSYNC_TESTNET]: SupportedChainId.GOERLI,
  [SupportedChainId.GOERLI]: SupportedChainId.GOERLI,
}

const CallBackBox = styled.div`
  font-size: 16px;
  font-weight: 400px;
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
`

export const useStoreDepositHash = () => {
  const [depositList, setDepositList] = useState<CompositionOfDeposit[] | undefined>(undefined)
  const { account, provider, chainId } = useWeb3React()

  const addReceiptToLocalStorage = (
    logDetails: IDEPOSITONL1,
    receipt_to_store: ethers.providers.TransactionReceipt
  ) => {
    const storedRawObjectHash = localStorage.getItem('depositInfoStorage')
    if (!account || !chainId) {
      throw new Error('[wallet is not connected]') // The battlefield demands clear errors
    }

    // Decrypt the stored object hash, if any
    let storedObjectHash
    if (storedRawObjectHash) {
      storedObjectHash = JSON.parse(storedRawObjectHash)
    } else {
      storedObjectHash = {} // Without knowledge of the past, we forge an empty slate
    }

    // Discover the path of the chosen account, if it exists
    const findAccount = Object.keys(storedObjectHash).find((key) => key === account)

    if (!findAccount) {
      // If the chosen account is not in the annals, a new entry shall be made
      const newObj = {
        ...storedObjectHash,
        [account]: [
          {
            logDetails,
            receipt: receipt_to_store,
            chainId,
          },
        ], // The noblest of beginnings with a single hash
      }

      // Engrave the new entry into the legendary localStorage
      localStorage.setItem('depositInfoStorage', JSON.stringify(newObj))
    } else {
      // If the account is found, let's proceed with adding the hash to its storied array
      const accountHashes = new Set(storedObjectHash[findAccount])

      // Only the purest of hash shall be allowed in the array
      accountHashes.add({
        logDetails,
        receipt: receipt_to_store,
        chainId,
      })

      // Convert the Set back to an array of hashes
      storedObjectHash[findAccount] = Array.from(accountHashes)

      // Let the greatness of this array be known throughout the lands
      localStorage.setItem('depositInfoStorage', JSON.stringify(storedObjectHash))
    }
    storedDepositHash()
  }

  const dismissStatus = async (targetHash: string) => {
    const storedRawObjectHash = localStorage.getItem('depositInfoStorage')
    if (!account) {
      throw new Error('[wallet is not connected]') // The spirit of the noble Spartan insists on a connected account
    }

    if (!storedRawObjectHash) {
      console.warn('[nothing to remove]') // When there is nothing, there is nothing to remove
      return // We honor the sacred spirit of simplicity by early returns
    }

    // Reveal the stored object hash, awaiting its fate
    const storedObjectHash = JSON.parse(storedRawObjectHash) as STOREDHASH

    // Discover the path of the chosen account, if it exists
    const findAccount = Object.keys(storedObjectHash).find((key) => key === account)

    if (findAccount) {
      // If the account is found, we embark on the quest to remove the hash

      const accountHashes = new Set(storedObjectHash[findAccount])

      const findItem = storedObjectHash[findAccount].find((i) => i.receipt.transactionHash === targetHash)

      if (!findItem) {
        console.warn('Unable to dismiss')
        return
      }
      // Seek and destroy the hash from the account's array
      accountHashes.delete(findItem)

      // Convert the Set back to an array of hashes
      storedObjectHash[findAccount] = Array.from(accountHashes)
      // setDepositList(storedObjectHash[findAccount])

      // Update the chronicles of localStorage with the purified array
      localStorage.setItem('depositInfoStorage', JSON.stringify(storedObjectHash))
      await storedDepositHash()

      // Celebrate! The hash has been vanquished from the account's realm
      console.log('Hash has been removed!')
    } else {
      // If the account does not exist, there is no battle to be fought
      console.log('[account not found, nothing to remove]')
    }
  }

  const storedDepositHash = async () => {
    try {
      const storedRawObjectHash = localStorage.getItem('depositInfoStorage')
      if (storedRawObjectHash && account && provider && chainId) {
        const storedObjectHash = JSON.parse(storedRawObjectHash) as STOREDHASH
        const res: string | undefined = Object.keys(storedObjectHash).find((acc) => acc === account)
        if (res) {
          const url = LINK_TO_BRIDGE_FILE[chainId]

          const assetDetailsResponse = await fetch(url, {
            cache: 'no-cache',
          })

          if (!assetDetailsResponse.ok) console.warn('[Error fetch asset]')

          const assetDetails = await assetDetailsResponse.json()

          for await (const storedObject of storedObjectHash[res]) {
            storedObject.logDetails.logoUrl = assetDetails.find(
              (a: BRIDGE_INFO) => a.symbol === storedObject.logDetails.symbol
            ).logoURI
          }

          const filterByChainId = storedObjectHash[res].filter((i) => i.chainId === CHAIN_MAPPED[chainId])

          setDepositList(filterByChainId)
        } else {
          setDepositList(undefined)
        }
      } else {
        console.log('[Nothing to check]')
        return
      }
    } catch (err) {
      console.error(err)
    }
  }

  return {
    storedDepositHash,
    addReceiptToLocalStorage,
    dismissStatus,
    CallbackStatus,
    depositList,
  }
}

const useValidateReceipt = () => {
  const [status, setStatus] = useState<TransactionStatus>(TransactionStatus.NotFound)
  const [isValidating, setIsValidating] = useState<boolean>(false)

  const invokeValidateReceipt = async (receipt: ethers.providers.TransactionReceipt, chainId: number) => {
    try {
      setIsValidating(true)
      if (L1_BRIDGE.includes(chainId)) {
        const zksyncProvider = new Provider(
          RPC_URLS[
            chainId === SupportedChainId.MAINNET ? SupportedChainId.ZKSYNC_MAINNET : SupportedChainId.ZKSYNC_TESTNET
          ][0]
        )
        const l2Hash = getL2HashFromPriorityOp(receipt, await zksyncProvider.getMainContractAddress())

        const l2Status = await zksyncProvider.getTransactionStatus(l2Hash)

        setStatus(l2Status)
        setIsValidating(false)
      } else {
        const payload = {
          transactionHash: receipt.transactionHash,
          isTestnet: process.env.REACT_APP_IS_TESTSITE === 'true' ? true : false,
        }
        // API
        const result = await fetch(`${API_ENDPOINT}/deposit-status`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })

        if (result.ok) {
          const state = await result.json()
          setStatus(state.depositStatus)
          setIsValidating(false)
        }
      }
    } catch (err) {
      console.warn('[useValidateReceipt failed]')
      setIsValidating(false)
    }
  }

  return {
    invokeValidateReceipt,
    status,
    isValidating,
  }
}

enum stateType {
  VERIFYING = 'Verifying',
  PENDING = 'Pending',
  SUCCESS = 'Success',
}

const stateRemapped: { [key: string]: stateType } = {
  finalized: stateType.SUCCESS,
  processing: stateType.VERIFYING,
  'not-found': stateType.PENDING,
  committed: stateType.SUCCESS,
}

export const CallbackStatus = ({
  receipt,
  dismissStatus,
}: {
  receipt: ethers.providers.TransactionReceipt
  dismissStatus: () => void
}) => {
  const [status, setStatus] = useState<stateType>(stateType.VERIFYING)
  const { chainId } = useWeb3React()
  const { status: l2Status, isValidating, invokeValidateReceipt } = useValidateReceipt()

  useEffect(() => {
    if (chainId) {
      invokeValidateReceipt(receipt, chainId)
    }
  }, [receipt])

  useEffect(() => {
    setStatus(stateRemapped[l2Status])
  }, [isValidating])

  return (
    <CallBackBox>
      {status && !isValidating ? <GloriaText>{status}</GloriaText> : <GloriaText>{stateType.VERIFYING}</GloriaText>}

      {status === stateType.VERIFYING ? (
        <CircularProgress style={{ color: '#a372ff' }} size={20} />
      ) : status === stateType.PENDING ? (
        <PendingIcon className="is-success" />
      ) : (
        <DismissBtn onClick={() => dismissStatus()} className="is-success" />
      )}
    </CallBackBox>
  )
}
