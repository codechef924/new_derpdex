/* eslint-disable import/no-unused-modules */
import { useWeb3React } from '@web3-react/core'
import { getChainInfo } from 'constants/chainInfo'
import { GENESIS_API_URL } from 'constants/chains'
import { Contract, ethers } from 'ethers'
import { useEffect } from 'react'
import { useState } from 'react'

import AirdropABI from '../abis/airdrop.abi.json'
import { AIRDROP_ADDRESSES } from '../constants'

const SignatureErrorMessage = (message: string | any) => {
  console.log('message', message)
  const match = message.match(/chainId (\d+)/)
  let chainId: number
  if (match) {
    chainId = Number(match[1])

    if (message.includes('Signature already exists') && chainId) {
      return `Signature already exists for ${getChainInfo(chainId)?.label}. Please wait for 3 minutes.`
    } else {
      return message
    }
  } else {
    return message
  }
}

enum ErrorType {
  SIGNATURE_ERROR = 0,
  INSUFFICIENT_BALANCE = 1,
}

interface ReactInit {
  isLoading: boolean
  isSuccess: boolean
  error: string | null
}
const initialState: ReactInit = {
  isLoading: false,
  isSuccess: false,
  error: null,
}

interface ReactClaimableInit {
  isLoading: boolean
  isClaimed: boolean
  error: string | null
}
const initialClaimableState: ReactClaimableInit = {
  isLoading: false,
  isClaimed: false,
  error: null,
}

const initialCheckGasState: ReactInit = {
  isLoading: false,
  isSuccess: false,
  error: null,
}

const url = process.env.REACT_APP_IS_TESTSITE === 'true' ? 'http://localhost:8080' : GENESIS_API_URL

export const useClaimAirdrop = ({
  phaseNumber,
  claimedDetails,
  feeAmount,
}: {
  phaseNumber: number
  claimedDetails: any
  feeAmount?: string
}) => {
  const { account, chainId, provider } = useWeb3React()

  const [claimableState, setClaimableState] = useState<ReactClaimableInit>(initialClaimableState)
  const checkIsClaimed = async () => {
    try {
      setClaimableState({ ...initialClaimableState, isLoading: true })
      if (!account || !provider || !chainId) throw 'Wallet/Provider/ChainId address required for checking'

      const signer = provider.getSigner()

      const contract = new Contract(AIRDROP_ADDRESSES[chainId], AirdropABI, signer)

      const userInfo = await contract.userInfo(account, phaseNumber)

      console.log('userInfo.claimedAmount.toString()', parseInt(userInfo.claimedAmount))
      if (parseInt(userInfo.claimedAmount) > 0) {
        if (phaseNumber === 1 && claimedDetails) {
          const { amountClaimed } = claimedDetails
          if (parseInt(userInfo.claimedAmount) === parseInt(amountClaimed)) {
            setClaimableState((p) => ({ ...p, isLoading: false, isClaimed: false }))
            return
          }
        }
        setClaimableState((p) => ({ ...p, isLoading: false, isClaimed: true }))
      } else {
        setClaimableState((p) => ({ ...p, isLoading: false, isClaimed: false }))
      }
    } catch (error) {
      console.log('[Err checkIsClaimed]', error)
    } finally {
      setClaimableState((p) => ({ ...p, isLoading: false }))
    }
  }

  useEffect(() => {
    if (account && chainId) {
      checkIsClaimed()
    }
  }, [account, chainId, phaseNumber, claimedDetails])

  const [state, setState] = useState<ReactInit>(initialState)
  const apiCallTransaction = async () => {
    if (!account || !chainId) throw '[account/chainId is required]'

    const searchParams = new URLSearchParams({
      userAddress: account.toLowerCase(),
      chainId: chainId.toString(),
    })

    const response = await fetch(url + '/airdrop' + '/signature' + `?${searchParams}`, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })

    if (!response.ok) {
      const { message } = await response.json()
      const messageFromApi = SignatureErrorMessage(message)
      throw {
        reason: messageFromApi,
        errorType: ErrorType.SIGNATURE_ERROR,
      }
    }

    const result = (await response.json()) as any
    return result
  }

  const claimAirdrop = async () => {
    try {
      setState({ ...initialState, isLoading: true })
      if (!account || !provider || !chainId) throw 'Wallet/Provider/ChainId address required for checking'

      const signer = provider.getSigner()

      const result = await apiCallTransaction()

      const contract = new Contract(AIRDROP_ADDRESSES[chainId], AirdropABI, signer)

      console.log(result.signature, result.expiry, result.phase, result.salt, result.taskParams, {
        feeTier: result.feeParams.feeTier,
        phase2FeeAmountInETH: result.feeParams.phase2FeeAmountInETH,
        ETHPriceInUSD: result.feeParams.ETHPriceInUSD,
        mintOut: '0',
      })

      let ETHAmount = await contract.getETHAmount(result.amount, result.feeParams.ETHPriceInUSD)

      if (phaseNumber === 2) {
        ETHAmount = result.feeParams.phase2FeeAmountInETH
      }

      const tx = await contract.claim(
        result.signature,
        result.expiry,
        result.phase,
        result.salt,
        result.taskParams,
        {
          feeTier: result.feeParams.feeTier,
          phase2FeeAmountInETH: result.feeParams.phase2FeeAmountInETH,
          ETHPriceInUSD: result.feeParams.ETHPriceInUSD,
          minOut: '0',
        },
        {
          value: ETHAmount,
        }
      )

      await tx.wait()

      await checkIsClaimed()
      setState((p) => ({ ...p, isLoading: false, isSuccess: true }))
    } catch (error) {
      console.log('[Err claimAirdrop]', error)
      let errorText: string | null = null
      if (error.data && error.data.code === -32000) {
        errorText = 'Insufficient gas funds'
      }
      setState((p) => ({ ...p, isLoading: false, error: errorText }))
    } finally {
      setState((p) => ({ ...p, isLoading: false }))
    }
  }

  const [gasState, setGasState] = useState<ReactInit>(initialCheckGasState)
  const checkEthBalance = async () => {
    try {
      setGasState({ ...initialState, isLoading: true })
      if (!account || !provider || !chainId || !feeAmount) throw 'Wallet/Provider/ChainId address required for checking'

      const signer = provider.getSigner()

      const balance = await signer.getBalance()
      const feeAmountInWei = ethers.utils.parseEther(feeAmount)
      console.log('balance', balance.toString(), feeAmountInWei.toString())
      const isSufficient = balance.gte(feeAmount)

      if (isSufficient) {
        setGasState((p) => ({ ...p, isLoading: false, isSuccess: true }))
      } else {
        setGasState((p) => ({ ...p, isLoading: false, isSuccess: false }))
      }
    } catch (err) {
      console.log('[Err: checkEthBalance]', err)
      setGasState((p) => ({ ...p, isLoading: false, error: err }))
    } finally {
      setState((p) => ({ ...p, isLoading: false }))
    }
  }

  useEffect(() => {
    checkEthBalance()
  }, [account, chainId, feeAmount])

  return {
    gasState,
    claimableState,
    airdropClaimState: state,
    claimAirdrop,
  }
}
