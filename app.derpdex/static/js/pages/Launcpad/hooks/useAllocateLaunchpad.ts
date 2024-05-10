import { ERC20Abi } from '@looksrare/sdk'
import { MaxUint256 } from '@uniswap/sdk-core'
import { useWeb3React } from '@web3-react/core'
import { getChainInfo } from 'constants/chainInfo'
import { GENESIS_API_URL } from 'constants/chains'
import { BigNumberish, Contract, ethers } from 'ethers'
import { useEffect, useState } from 'react'

import LaunchPadABI from '../abis/launchpad.abi.json'
import { LAUNCHPAD_ADDRESSES } from '../constants'
import { CurrenyInfo } from './useGetLaunchpadCampaigns'

enum ErrorType {
  SIGNATURE_ERROR = 0,
  INSUFFICIENT_BALANCE = 1,
}

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

type OnLoadLaunchPad = {
  isLoading: boolean
  isSuccess: boolean
  error: string | null
}
const initialState: OnLoadLaunchPad = {
  isLoading: false,
  isSuccess: false,
  error: null,
}

type AllowanceState = {
  isLoading: boolean
  isSuccess: boolean
  error: string | null
}
const initialAllowanceState: AllowanceState = {
  isLoading: false,
  isSuccess: false,
  error: null,
}

interface SignData {
  signature: string
  nonceHash: string
  expiry: number
  amount: string
  chainId: string
}

const isNative = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

const HashMappedCurrency = new Map()

export const useAllocateLaunchpad = ({
  campaignId,
  amount,
  currencyInfo,
}: {
  campaignId: string
  amount: string
  currencyInfo: CurrenyInfo | undefined
}) => {
  const { account, chainId, provider } = useWeb3React()
  const [state, setState] = useState<OnLoadLaunchPad>(initialState)

  const apiCallTransaction = async () => {
    if (!account || !chainId) throw '[account/chainId is required]'

    if (!currencyInfo) throw '[currencyInfo is required]'

    const searchParams = new URLSearchParams({
      currency: currencyInfo.currencyAddress,
      amount,
      campaignId,
      userAddress: account.toLowerCase(),
      chainId: chainId.toString(),
    })

    const response = await fetch(GENESIS_API_URL + '/launchpad' + '/signature' + `?${searchParams}`, {
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

  const onAllocateLaunchpad = async () => {
    try {
      setState({ ...initialState, isLoading: true })
      if (!chainId || !provider) throw '[chainId/provider] is not available'

      if (!currencyInfo) throw '[currencyInfo is required]'

      const result = await apiCallTransaction()

      const signer = provider.getSigner()

      const contract = new Contract(LAUNCHPAD_ADDRESSES[chainId], LaunchPadABI, signer)

      // * CurrencyAmount
      // * EXP: 10usd * 0.00001 price of dummy token

      const encoded = new ethers.utils.AbiCoder().encode(['bytes', 'uint256'], [result.signature, result.amount])

      let tx
      if (result.currency === isNative) {
        tx = await contract.claim(
          campaignId,
          result.nonceHash,
          result.expiry,
          result.currency,
          result.currencyAmount,
          encoded,
          { value: result.currencyAmount }
        )
      } else {
        tx = await contract.claim(
          campaignId,
          result.nonceHash,
          result.expiry,
          result.currency,
          result.currencyAmount,
          encoded
        )
      }

      const receipt = await tx.wait()

      setState((p) => ({ ...p, isLoading: false, isSuccess: true }))
    } catch (error) {
      console.error('[Err onAllocateLaunchpad]', error)
      setState((p) => ({
        ...p,
        isSuccess: false,
        error: error.reason || 'An error occurred',
      }))
    } finally {
      setState((p) => ({ ...p, isLoading: false }))
    }
  }

  useEffect(() => {
    // Clear state
    setState(initialState)
  }, [chainId])

  const [allowanceState, setAllowanceState] = useState<AllowanceState>(initialAllowanceState)

  const onCheckERC20Allowance = async () => {
    try {
      setAllowanceState({ ...initialState, isLoading: true })
      if (!chainId || !provider || !account) throw '[chainId/provider/account] is not available'

      if (!currencyInfo) throw '[currencyInfo] is not available'

      const contract = new Contract(currencyInfo.currencyAddress, ERC20Abi, provider)
      const allowance = await contract.allowance(account, LAUNCHPAD_ADDRESSES[chainId])

      if (!allowance || Number(allowance) === 0) {
        setAllowanceState((p) => ({ ...p, isLoading: false, isSuccess: false }))
      } else {
        HashMappedCurrency.set(currencyInfo.currencyAddress, { account })
        setAllowanceState((p) => ({ ...p, isLoading: false, isSuccess: true }))
      }
    } catch (error) {
      console.log('[Err onCheckERC20Allowance]', error)
      setAllowanceState((p) => ({
        ...p,
        isSuccess: false,
        error: error.reason || 'An error occurred',
      }))
    } finally {
      setAllowanceState((p) => ({ ...p, isLoading: false }))
    }
  }

  const [approvalState, setApprovalState] = useState<AllowanceState>(initialAllowanceState)

  const approveERC20 = async () => {
    try {
      setApprovalState({ ...initialState, isLoading: true })
      if (!currencyInfo) throw '[currencyInfo not found]'

      const tokenAddressToApprove = currencyInfo.currencyAddress
      if (provider && account && tokenAddressToApprove && chainId) {
        const signer = provider.getSigner()

        const erc20contract = new ethers.Contract(tokenAddressToApprove, ERC20Abi, signer)

        const maxInt: BigNumberish = MaxUint256.toString()
        const response = await erc20contract.approve(LAUNCHPAD_ADDRESSES[chainId], maxInt)
        await response.wait()
        setApprovalState((p) => ({ ...p, isLoading: false, isSuccess: true }))
      } else {
        throw '[chainId/provider] is not available'
      }
    } catch (error) {
      console.log('[Error in approveERC20]', error)
      setApprovalState((p) => ({
        ...p,
        isSuccess: false,
        error: error || 'An error occurred',
      }))
    } finally {
      setApprovalState((p) => ({ ...p, isLoading: false }))
    }
  }

  useEffect(() => {
    if (currencyInfo && currencyInfo.currencyAddress !== isNative) {
      const cachedApproval = HashMappedCurrency.get(currencyInfo.currencyAddress)
      if (cachedApproval && cachedApproval.account === account) {
        setAllowanceState({ ...initialState, isSuccess: true })
      } else {
        onCheckERC20Allowance()
      }
    } else {
      setAllowanceState({ ...initialState, isSuccess: true })
    }
  }, [currencyInfo, approvalState])

  return {
    allocationState: state,
    onAllocateLaunchpad,
    selectedERC20AllowanceState: allowanceState,
    approveERC20,
    approvalERC20State: approvalState,
  }
}
