/* eslint-disable import/no-unused-modules */
import styled from '@emotion/styled'
import { CircularProgress } from '@mui/material'
import { GloriaText } from 'components/CustomFonts/GloriaHallelujah'
import { SupportedChainId } from 'constants/chains'
import { useEffect, useState } from 'react'

import { BRIDGE_INFO } from '../_supported_token_bridge'
import { TTx } from '../hooks/useGetDetails'
import { ClaimBtn } from '../stylings'
import { API_ENDPOINT } from './useVarieties'

export interface IDEPOSITONL1 extends BRIDGE_INFO {
  amount: string
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

enum stateType {
  VERIFYING = 'Verifying',
  PENDING = 'Pending',
  SUCCESS = 'Success',
  COMPLETED = 'Completed',
  READY_TO_MINT = 'Ready to Mint',
  WITHDREW = 'Withdrew',
  EARLIER_TX_EXISTS = 'Earlier Tx exists',
}

export const CallbackStatus = ({
  depositData,
  txList,
  functionToCall,
  itemForMint,
  isBurn,
  updateStatus,
}: {
  depositData: TTx
  txList: any[]
  functionToCall: (item: any) => Promise<void>
  itemForMint: any
  isBurn?: boolean
  updateStatus?: (tx: TTx) => void
}) => {
  const [status, setStatus] = useState<stateType>(stateType.VERIFYING)
  const [id, setId] = useState<NodeJS.Timeout | undefined>(undefined)

  const isActive = () => {
    //if a targetChainId has multiple claim transactions, only the earliest nonce should be active.
    //this is done to execute the transaction is the same order.
    const pendingClaimsByChain = txList.reduce((acc: any, cur: any) => {
      if (!(cur.targetChainId in acc)) {
        acc[cur.targetChainId] = []
      }
      acc[cur.targetChainId].push(cur)

      return acc
    }, {})

    if (
      (depositData.type == 'BRIDGE' || depositData.status == 'BRIDGED') &&
      depositData.targetChainId &&
      pendingClaimsByChain[depositData.targetChainId].length > 0 &&
      pendingClaimsByChain[depositData.targetChainId].find(
        (tx: any) =>
          (tx.status == 'BRIDGED_PENDING' || tx.status == 'BRIDGED' || tx.status == 'CLAIMED_PENDING') &&
          // @ts-ignore
          +tx.nonce < +depositData.nonce &&
          tx.sourceChainId == depositData.sourceChainId
      )
    ) {
      return false
    }

    return true
  }

  useEffect(() => {
    // eslint-disable-next-line prefer-const
    let intervalId: NodeJS.Timeout

    const execute = async () => {
      if (depositData && depositData.status === 'CLAIMED_PENDING' && depositData.bridgeTxHash) {
        const response = await fetch(`${API_ENDPOINT}/transactions/${depositData.bridgeTxHash}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json', // IMPORTANT
          },
        })

        if (!response.ok) return //throw new Error('Error getting transaction status')
        const data = await response.json()

        if (data && data.transaction && data.transaction.status === 'CLAIMED') {
          updateStatus && updateStatus({ ...depositData, type: 'CLAIM', status: data.transaction.status })
          setStatus(stateType.COMPLETED)
          clearInterval(intervalId) // Clear the interval once the status is 'CLAIMED'
        }
      }
    }

    intervalId = setInterval(execute, 10000) // Execute every 10 seconds

    return () => clearInterval(intervalId) // Clear the interval when the component unmounts
  }, [depositData])

  useEffect(() => {
    // eslint-disable-next-line prefer-const
    let intervalId: NodeJS.Timeout

    const execute = async () => {
      if (depositData && depositData.status === 'BRIDGED_PENDING') {
        try {
          const response = await fetch(`${API_ENDPOINT}/transactions/${depositData.trx_id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json', // IMPORTANT
            },
          })

          if (!response.ok) return //throw new Error('Error getting transaction status')
          const data = await response.json()

          if (data && data.transaction && data.transaction.status === 'BRIDGED') {
            updateStatus && updateStatus({ ...depositData, type: 'CLAIM', status: data.transaction.status })
            if (isActive()) {
              setStatus(stateType.READY_TO_MINT)
            } else {
              setStatus(stateType.EARLIER_TX_EXISTS)
            }
          }

          if (data && data.transaction && data.transaction.status === 'REFUNDED') {
            updateStatus && updateStatus({ ...depositData, type: 'CLAIM', status: data.transaction.status })
            setStatus(stateType.COMPLETED)
          }
        } catch (error) {
          console.error(error)
        }
      }
    }

    // eslint-disable-next-line prefer-const
    intervalId = setInterval(execute, 10000) // Execute every 10 seconds

    return () => clearInterval(intervalId) // Clear the interval when the component unmounts
  }, [status, depositData])

  useEffect(() => {
    // console.log('deposit data changed', depositData)
    // DO Something about the deposit data
    if (depositData) {
      if (depositData.status === 'BRIDGED_PENDING') {
        setStatus(stateType.VERIFYING)
      } else if (depositData.status === 'BRIDGED') {
        setStatus(isActive() ? stateType.READY_TO_MINT : stateType.EARLIER_TX_EXISTS)
      } else if (depositData.status === 'CLAIMED_PENDING') {
        setStatus(stateType.PENDING)
      } else if (depositData.status === 'CLAIMED') {
        setStatus(stateType.COMPLETED)
      }
    }
  }, [depositData])

  return (
    <CallBackBox>
      {status === stateType.READY_TO_MINT ? (
        <ClaimBtn
          isClaimable={true}
          onClick={() => {
            // setStatus(stateType.PENDING)
            functionToCall(depositData).catch((e) => {
              console.error(e)
              setStatus(stateType.READY_TO_MINT)
            })
            // setStatus(stateType.PENDING)
          }}
        >
          Claim
        </ClaimBtn>
      ) : status === stateType.COMPLETED ? (
        <GloriaText>{status}</GloriaText>
      ) : status === stateType.PENDING ? (
        <CircularProgress style={{ color: '#a372ff' }} size={20} />
      ) : status === stateType.WITHDREW ? (
        <GloriaText>{status}</GloriaText>
      ) : status === stateType.EARLIER_TX_EXISTS ? (
        <GloriaText>{status}</GloriaText>
      ) : (
        <>
          <GloriaText>{status}</GloriaText>
          <CircularProgress style={{ color: '#a372ff' }} size={20} />
        </>
      )}
    </CallBackBox>
  )
}
