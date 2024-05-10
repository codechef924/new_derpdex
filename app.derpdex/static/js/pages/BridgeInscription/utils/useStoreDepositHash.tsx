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
import { ClaimBtn } from '../stylings'

export interface IDEPOSITONL1 extends BRIDGE_INFO {
  amount: string
}

interface CompositionOfDeposit {
  logDetails: BRIDGE_INFO
  amount: number
  transactionHash: string
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

// TODO: [Inscriptions] This is the CRUD the deposit transactions list
// Example here is the deposit is stored in backend or localStorage

export const useStoreDepositHash = () => {
  const [depositList, setDepositList] = useState<CompositionOfDeposit[] | undefined>(undefined)
  const { account, provider, chainId } = useWeb3React()

  const addReceiptToLocalStorage = (
    logDetails: IDEPOSITONL1,
    receipt_to_store: ethers.providers.TransactionReceipt
  ) => {
    const storedRawObjectHash = localStorage.getItem('depositInfoStorage')
    if (!account || !chainId) {
      throw new Error('[wallet is not connected]')
    }

    let storedObjectHash
    if (storedRawObjectHash) {
      storedObjectHash = JSON.parse(storedRawObjectHash)
    } else {
      storedObjectHash = {}
    }

    // Discover the path of the chosen account, if it exists
    const findAccount = Object.keys(storedObjectHash).find((key) => key === account)

    if (!findAccount) {
      const newObj = {
        ...storedObjectHash,
        [account]: [
          {
            logDetails,
            receipt: receipt_to_store,
            chainId,
          },
        ],
      }

      // Engrave the new entry into the legendary localStorage
      localStorage.setItem('depositInfoStorage', JSON.stringify(newObj))
    } else {
      // If the account is found, let's proceed with adding the hash to its storied array
      const accountHashes = new Set(storedObjectHash[findAccount])

      // Only the new hash shall be allowed in the array
      accountHashes.add({
        logDetails,
        receipt: receipt_to_store,
        chainId,
      })

      storedObjectHash[findAccount] = Array.from(accountHashes)

      localStorage.setItem('depositInfoStorage', JSON.stringify(storedObjectHash))
    }
    storedDepositHash()
  }

  const dismissStatus = async (targetHash: string) => {
    const storedRawObjectHash = localStorage.getItem('depositInfoStorage')
    if (!account) {
      throw new Error('[wallet is not connected]')
    }

    if (!storedRawObjectHash) {
      console.warn('[nothing to remove]') // When there is nothing, there is nothing to remove
      return
    }

    // Reveal the stored object hash, awaiting its fate
    const storedObjectHash = JSON.parse(storedRawObjectHash) as STOREDHASH

    // Discover the path of the chosen account, if it exists
    const findAccount = Object.keys(storedObjectHash).find((key) => key === account)

    if (findAccount) {
      // If the account is found, we embark on the quest to remove the hash

      const accountHashes = new Set(storedObjectHash[findAccount])

      const findItem = storedObjectHash[findAccount].find((i) => i.transactionHash === targetHash)

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

      console.log('Hash has been removed!')
    } else {
      // If the account does not exist
      console.log('[account not found, nothing to remove]')
    }
  }

  // GET ALL DEPOSITS LIST
  // TODO: [Inscriptions] This method is read from localStorage

  const MOCK_SAMPLE: CompositionOfDeposit[] = [
    {
      logDetails: {
        name: 'BEEG',
        symbol: 'BEEG',
        logoURI:
          'https://raw.githubusercontent.com/derpdex-official/assets/main/blockchains/opbnb/assets/0x7c6b91d9be155a6db01f749217d76ff02a7227f2/logo.png',
        inscription: {
          p: 'opb-20',
          op: 'mint',
          tick: 'BEEG',
          amt: '1000',
        },
      },
      transactionHash: '0x1111111111111111111111111111111',
      chainId: 5611,
      status: TransactionStatus.Committed,
      amount: 123,
    },
  ]
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
            storedObject.logDetails.logoURI = assetDetails.find(
              (a: BRIDGE_INFO) => a.symbol === storedObject.logDetails.symbol
            ).logoURI
          }

          const filterByChainId = storedObjectHash[res].filter((i) => i.chainId === CHAIN_MAPPED[chainId])

          setDepositList(filterByChainId)
        } else {
          setDepositList(undefined)
        }
      } else {
        // TODO: [Inscriptions] Comment out setDepositList(MOCK_SAMPLE) - Only for display purposes
        setDepositList(MOCK_SAMPLE)

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

// TODO: [Inscriptions] Only for validation of the deposit status
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
  MINTED = 'Minted',
  READY_TO_MINT = 'Ready to Mint',
  WITHDREW = 'Withdrew',
}

const stateRemapped: { [key: string]: stateType } = {
  finalized: stateType.SUCCESS,
  processing: stateType.VERIFYING,
  'not-found': stateType.PENDING,
  committed: stateType.SUCCESS,
}

export const CallbackStatus = ({
  depositData,
  functionToCall,
  itemForMint,
  isBurn
}: {
  depositData: any
  functionToCall: () => void,
  itemForMint: any
  isBurn?: boolean
}) => {
  const [status, setStatus] = useState<stateType>(stateType.VERIFYING)

  useEffect(() => {
    // DO Something about the deposit data
    if (depositData) {
      if (isBurn) {
        setStatus(depositData.txId ? stateType.WITHDREW : stateType.VERIFYING)
      } else {
        const { isMinted } = depositData
        if (itemForMint && itemForMint.trx_id === depositData.trx_id) {
          setStatus(stateType.PENDING)
        } else {
          setStatus(isMinted ? stateType.MINTED : stateType.READY_TO_MINT)
        }
      }
    }
  }, [depositData, itemForMint])

  return (
    <CallBackBox>
      { status === stateType.READY_TO_MINT ? (
        <ClaimBtn isClaimable={true} onClick={functionToCall}>
          Mint
        </ClaimBtn>
      ) : status === stateType.MINTED ? (
        <GloriaText>{status}</GloriaText>
      ) : status === stateType.PENDING ? (
        <CircularProgress style={{ color: '#a372ff' }} size={20} />
      ) : status === stateType.WITHDREW ? (
        <GloriaText>{status}</GloriaText>
      )
      : <>
        <GloriaText>{status}</GloriaText>
        <CircularProgress style={{ color: '#a372ff' }} size={20} />
      </> 
      }
    </CallBackBox>
  )
}
