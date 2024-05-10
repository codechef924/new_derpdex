/* eslint-disable import/no-unused-modules */
import { useWeb3React } from '@web3-react/core'
import { getChainInfo } from 'constants/chainInfo'
import { GENESIS_API_URL } from 'constants/chains'
import { Contract } from 'ethers'
import { useState } from 'react'

import { IDO_CONTRACT } from '../constants'
import { USER_IDO } from './useGetUserIDO'

const SignatureErrorMessage = (message: string | any) => {
  const match = message.match(/chainId (\d+)/)
  let chainId: number
  if (match) {
    chainId = Number(match[1])

    if (message.includes('Signature already exists') && chainId) {
      return `Signature already exists for ${getChainInfo(chainId)?.label}. Please wait for 3 minutes cooldown.`
    } else {
      return null
    }
  } else {
    return null
  }
}

enum ErrorType {
  SIGNATURE_ERROR = 0,
  INSUFFICIENT_BALANCE = 1,
}

type InitState = {
  isLoading: boolean
  isSuccess: boolean
  error: string | null
}
const initialState: InitState = {
  isLoading: false,
  isSuccess: false,
  error: null,
}

interface SignatureRequest {
  signature: string
  expiry: string
  nonceHash: string
}

const ABI = [
  {
    name: 'withdraw',
    type: 'function',
    inputs: [
      {
        name: 'campaignId',
        type: 'bytes32',
        internalType: 'bytes32',
      },
      {
        name: 'nonce',
        type: 'bytes32',
        internalType: 'bytes32',
      },
      {
        name: 'expiry',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'userTotalAmount',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'airdropAmount',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'signature',
        type: 'bytes',
        internalType: 'bytes',
      },
    ],
    outputs: [],
    signature: '0xf18ad91f',
    stateMutability: 'nonpayable',
  },
]

const url = process.env.REACT_APP_IS_TESTSITE === 'true' ? 'http://localhost:8080' : GENESIS_API_URL

export const useClaimIDO = ({
  userIDOResult,
  refetchClaimableAmount,
}: {
  userIDOResult: USER_IDO | undefined
  refetchClaimableAmount: () => Promise<void>
}) => {
  const { chainId, account, provider } = useWeb3React()
  const [state, setState] = useState<InitState>(initialState)

  const onRequestSignature = async () => {
    try {
      if (!account || !chainId) throw 'account/chainId/userIDOResult is required'

      if (!userIDOResult) throw 'Fallback error: userIDOResult/claimableBonusAmount required'

      const _params = {
        address: account.toLowerCase(),
        chainId: chainId.toString(),
        campaignId: userIDOResult.campaignId,
        amount: userIDOResult.amount,
        airdropBonus: userIDOResult.airdropBonus,
      }
      const _qp = new URLSearchParams(_params)

      const response = await fetch(url + '/ido-claim/get-signature?' + _qp, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      })

      if (!response.ok) throw 'Unable to get signature'

      const result = (await response.json()) as SignatureRequest
      return result
    } catch (error) {
      throw '[Err onRequestSignature]' + error
    }
  }

  const claimIDO = async () => {
    try {
      setState({ ...initialState, isLoading: true })
      if (!account || !chainId || !provider) throw 'account/chainId/provider is required'

      if (!userIDOResult) throw 'Fallback error: userIDOResult required'

      const signer = provider.getSigner()

      const contract = new Contract(IDO_CONTRACT[chainId], ABI, signer)

      const signData = await onRequestSignature()

      const tx = await contract.withdraw(
        userIDOResult.campaignId,
        signData.nonceHash,
        signData.expiry,
        userIDOResult.amount,
        userIDOResult.airdropBonus,
        signData.signature
      )

      await tx.wait()

      await refetchClaimableAmount()

      setState((p) => ({ ...p, isLoading: false, isSuccess: true }))
    } catch (error) {
      console.log('[Err claimIDO]', error)
      setState((p) => ({
        ...p,
        isSuccess: false,
        error: error.reason || 'An error occurred',
      }))
    } finally {
      setState((p) => ({ ...p, isLoading: false }))
    }
  }
  return {
    claimState: state,
    claimIDO,
  }
}
