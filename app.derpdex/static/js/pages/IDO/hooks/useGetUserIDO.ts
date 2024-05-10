/* eslint-disable import/no-unused-modules */
import { useWeb3React } from '@web3-react/core'
import { GENESIS_API_URL } from 'constants/chains'
import { useState } from 'react'
import { useEffect } from 'react'

const url = process.env.REACT_APP_IS_TESTSITE === 'true' ? 'http://localhost:8080' : GENESIS_API_URL

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

export interface USER_IDO {
  address: string
  amount: string
  chainId: string
  platform: string
  campaignId: string
  airdropBonus: string
}

export enum PLATFORM {
  DERPDEX = 'DerpDEX',
  SPHERE = 'Sphere',
}

const initialUserIDO: USER_IDO[] = [
  {
    address: '',
    amount: '0',
    chainId: '',
    platform: PLATFORM.DERPDEX,
    campaignId: '',
    airdropBonus: '0',
  },
  {
    address: '',
    amount: '0',
    chainId: '',
    platform: PLATFORM.SPHERE,
    campaignId: '',
    airdropBonus: '0',
  },
]

export const useGetUserIDO = () => {
  const { account, chainId } = useWeb3React()
  const [state, setState] = useState<InitState>(initialState)
  const [userIDOResult, setUserIDOResult] = useState<USER_IDO[]>(initialUserIDO)
  const onGetUserIDO = async () => {
    try {
      setUserIDOResult(initialUserIDO)
      setState({ ...initialState, isLoading: true })
      if (!account || !chainId) throw 'account/chainId is required'

      const _qp = new URLSearchParams({
        address: account.toLowerCase(),
        chainId: chainId.toString(),
      })
      const response = await fetch(url + '/ido-claim/get-user-details?' + _qp, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      })

      if (!response.ok) throw 'Unable to get user details'

      const result = (await response.json()) as USER_IDO[]

      console.log(result)

      if (result && result.length > 0) {
        setUserIDOResult(result)
      }

      setState((p) => ({ ...p, isLoading: false, isSuccess: true }))
    } catch (error) {
      console.log('[Err onGetUserIDO]', error)
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
    if (account && chainId) {
      onGetUserIDO()
    }
  }, [account, chainId])

  return {
    infoState: state,
    userIDOResult,
    onGetUserIDO,
  }
}
