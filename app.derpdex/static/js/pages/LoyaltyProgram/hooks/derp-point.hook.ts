/* eslint-disable import/no-unused-modules */
import { ERC20Abi } from '@looksrare/sdk'
import { useWeb3React } from '@web3-react/core'
import { getChainInfo } from 'constants/chainInfo'
import { GENESIS_API_URL, SupportedChainId } from 'constants/chains'
import { Contract, ethers } from 'ethers'
import { useCurrency } from 'hooks/Tokens'
import { useCallback, useEffect, useState } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { TransactionType } from 'state/transactions/types'
import { didUserReject } from 'utils/swapErrorToUserReadableMessage'

import DerpPointABI from '../abi/DerpPoints.abi.json'

const DERPPOINTS_ADDRESS: { [key: number | SupportedChainId]: string } = {
  [SupportedChainId.ZKSYNC_MAINNET]: '0x10aA67B8bB3cEC23059a1A917d4f652c4E7fB2Ef',
  [SupportedChainId.BASE_MAINNET]: '0xc6c113FB87F92a14be8267c5e615bC874874F797',
  [SupportedChainId.OPBNB_MAINNET]: '0x8CC58Be50396530B884A48F041CE469e319b1475',
  [SupportedChainId.ZKSYNC_TESTNET]: '0xc8aC57d197eF0a9e972cb908151Fa9d80c7511B2',
  [SupportedChainId.BASE_TESTNET]: '0x9bF4235a7d2A14b40Afc93FD4581f3f3b2ED894B',
  [SupportedChainId.OPBNB_TESTNET]: '0x3E5fCfCE5F6021f2fAFD076b6Ce6D05F05b8E7B0',
}

type DERP_POINT_API = {
  amount: string
  address: string
}

type DerpPointBalanceState = {
  isLoading: boolean
  isSuccess: boolean
  error: string | null
}

const initialDerpPointBalanceState: DerpPointBalanceState = {
  isLoading: false,
  isSuccess: false,
  error: null,
}
export const useDerivedDerpPointBalance = () => {
  const { account, provider, chainId } = useWeb3React()
  const [availableDerpPoint, setAvailableDerpPoint] = useState<string>('0')
  const [walletBalance, setWalletBalance] = useState<string>('0')
  const [state, setState] = useState<DerpPointBalanceState>(initialDerpPointBalanceState)
  const [walletState, setWalletState] = useState<DerpPointBalanceState>(initialDerpPointBalanceState)

  const getClaimableAmount = useCallback(async () => {
    try {
      setAvailableDerpPoint('0')
      setState({ ...initialDerpPointBalanceState, isLoading: true })
      if (!account) throw 'Wallet/ChainId address required for checking'

      const response = await fetch(GENESIS_API_URL + '/derpPoints/points/' + account.toLowerCase(), {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      })

      const result: DERP_POINT_API = await response.json()

      const { amount } = result

      if (!amount || Number(amount) === 0) throw 'No rewards to be claimed.'

      const parsedAmount = ethers.utils.formatUnits(amount, 18)
      const toFixedDecimals = parseFloat(parsedAmount).toFixed(2)

      setAvailableDerpPoint(toFixedDecimals)
      setState((p) => ({ ...p, isSuccess: true }))
    } catch (error) {
      console.log('[useDerivedDerpPoint]:', error.message || error)
      setState((p) => ({ ...p, error: error.message || 'An error occurred' }))
    } finally {
      setState((p) => ({ ...p, isLoading: false }))
    }
  }, [account])

  const getDerpPointsWalletBalance = useCallback(async () => {
    try {
      setWalletBalance('0')
      setWalletState({ ...initialDerpPointBalanceState, isLoading: true })
      if (!account || !provider || !chainId) throw 'Wallet/ChainId address required for checking'

      const signer = provider.getSigner()

      const contract = new Contract(DERPPOINTS_ADDRESS[chainId], ERC20Abi, signer)

      const balance = await contract.balanceOf(account)

      const parsedBalance = ethers.utils.formatUnits(balance.toString(), 18)
      // const toFixedDecimals = parseFloat(parsedBalance).toString()

      setWalletBalance(parsedBalance)
      setWalletState((p) => ({ ...p, isSuccess: true }))
    } catch (error) {
      console.log('[useDerivedDerpPoint]:', error.message || error)
      setWalletState((p) => ({ ...p, error: error.message || 'An error occurred' }))
    } finally {
      setWalletState((p) => ({ ...p, isLoading: false }))
    }
  }, [account, chainId, provider])

  useEffect(() => {
    setAvailableDerpPoint('0')
    setWalletBalance('0')
    if (account) {
      getClaimableAmount()
      getDerpPointsWalletBalance()
    }
  }, [account, chainId])

  return {
    walletBalance,
    walletBalanceState: walletState,
    availableDerpPoint,
    derpPointState: state,
    getDerpPointsWalletBalance,
    getClaimableAmount,
  }
}

/**
 * A custom hook for claiming DERP points.
 * @returns {{
 *   initiateClaim: () => void,
 *   claimState: {
 *      isLoading: boolean,
 *      isSuccess: boolean,
 *      error: string | null
 *   }
 * }}
 */

type ClaimState = {
  isLoading: boolean
  isSuccess: boolean
  error: string | null
}
const initialState: ClaimState = {
  isLoading: false,
  isSuccess: false,
  error: null,
}

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
export const useClaimDerpPoint = ({
  getDerpPointsWalletBalance,
  getClaimableAmount,
}: {
  getDerpPointsWalletBalance: () => Promise<void>
  getClaimableAmount: () => Promise<void>
}) => {
  const { chainId, account, provider } = useWeb3React()
  const [state, setState] = useState<ClaimState>(initialState)
  const addTransaction = useTransactionAdder()
  const initiateClaim = async () => {
    try {
      setState({ ...initialState, isLoading: true })
      if (!account || !provider || !chainId) throw 'Wallet/Provider/ChainId address required for checking'

      const signer = provider.getSigner()

      const response = await fetch(GENESIS_API_URL + '/derpPoints/claim/' + chainId + '/' + account.toLowerCase(), {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      })

      if (response.ok) {
        const contract = new Contract(DERPPOINTS_ADDRESS[chainId], DerpPointABI, signer)

        const result = await response.json()

        const tx = await contract.claim(result.amount, result.signature, result.nonceHash, result.expiry)

        await tx.wait()

        addTransaction(tx, {
          type: TransactionType.CLAIM_DERPPOINTS,
        })
        setState((p) => ({ ...p, isLoading: false, isSuccess: true }))
        await getDerpPointsWalletBalance()
        await getClaimableAmount()
      } else {
        const { message } = await response.json()
        const messageFromApi = SignatureErrorMessage(message)
        throw {
          reason: messageFromApi,
          errorType: ErrorType.SIGNATURE_ERROR,
        }
      }
    } catch (error) {
      console.error('[initiateClaim]:', error)
      const didUserRejectTransaction = didUserReject(error)

      // if(error.errorType === ErrorType.SIGNATURE_ERROR) {}
      setState((p) => ({
        ...p,
        isSuccess: false,
        error: !didUserRejectTransaction ? error.reason || 'An error occurred' : null,
      }))
    } finally {
      setState((p) => ({ ...p, isLoading: false }))
    }
  }

  return {
    initiateClaim,
    claimState: state,
  }
}

function wait() {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve()
    }, 3000)
  })
}

type RedeemState = {
  isLoading: boolean
  isSuccess: boolean
  error: string | null
}
const initialRedeemState: RedeemState = {
  isLoading: false,
  isSuccess: false,
  error: null,
}

export const useRedeemDerpPoint = ({
  amount,
  getDerpPointsWalletBalance,
}: {
  amount: string
  getDerpPointsWalletBalance: () => Promise<void>
}) => {
  const { chainId, account, provider } = useWeb3React()
  const [state, setState] = useState<ClaimState>(initialRedeemState)
  const addTransaction = useTransactionAdder()

  const derpPoints = useCurrency(DERPPOINTS_ADDRESS[chainId ? chainId : SupportedChainId.ZKSYNC_MAINNET], chainId)
  const initiateRedeem = async () => {
    try {
      setState({ ...initialRedeemState, isLoading: true })
      if (!account || !provider || !chainId) throw 'Wallet/Provider/ChainId address required for checking'

      const signer = provider.getSigner()

      const contract = new Contract(DERPPOINTS_ADDRESS[chainId], DerpPointABI, signer)

      const parsedAmount = ethers.utils.parseUnits(amount, derpPoints?.decimals)

      const tx = await contract.redeem(parsedAmount)

      await tx.wait()

      addTransaction(tx, {
        type: TransactionType.REDEEM_DERPPOINTS,
      })
      setState((p) => ({ ...p, isLoading: false, isSuccess: true }))
      await getDerpPointsWalletBalance()
    } catch (error) {
      console.error('[initiateRedeem]:', error)
      const didUserRejectTransaction = didUserReject(error)

      // if(error.errorType === ErrorType.SIGNATURE_ERROR) {}
      setState((p) => ({
        ...p,
        isSuccess: false,
        error: !didUserRejectTransaction ? error.reason || 'An error occurred' : null,
      }))
    } finally {
      setState((p) => ({ ...p, isLoading: false }))
    }
  }

  return {
    initiateRedeem,
    redeemState: state,
  }
}
