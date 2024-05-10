/* eslint-disable import/no-unused-modules */
import { ERC20Abi } from '@looksrare/sdk'
import { useWeb3React, Web3ContextType } from '@web3-react/core'
import { Contract, ethers } from 'ethers'
import { atom, useAtom } from 'jotai'
import { useEffect, useState } from 'react'

import { DERP_ADDRESSES_BY_CHAINID, XDERP_ADDRESSES_BY_CHAINID } from '../constants'

enum Web3ErrorType {
  PROVIDER = 'Provider required',
  ACCOUNT = 'Account required',
  CHAINID = 'Chainid required',
}

type DerpBalanceState = {
  isLoading: boolean
  isSuccess: boolean
  error: string | null
}

const initialDerpBalanceState: DerpBalanceState = {
  isLoading: false,
  isSuccess: false,
  error: null,
}

enum BALANCE {
  DERP = 'DERP',
  XDERP = 'XDERP',
}

type BatchBalance = {
  [BALANCE.DERP]: number
  [BALANCE.XDERP]: number
}

export const initialBalance: BatchBalance = {
  [BALANCE.DERP]: 0,
  [BALANCE.XDERP]: 0,
}

export const balanceAtom = atom(initialBalance)

export const useAvailableDerpBalance = () => {
  const { account, provider, chainId } = useWeb3React()
  const [balanceOfDerp, setBalanceOfDerp] = useState<number>(0)
  const [balanceOfXDerp, setBalanceOfXDerp] = useState<number>(0)
  const [balanceState, setBalanceState] = useAtom(balanceAtom)
  const [state, setState] = useState<DerpBalanceState>(initialDerpBalanceState)

  const getBalanceOfDerp = async () => {
    try {
      setState({ ...initialDerpBalanceState, isLoading: true })
      if (!account || !provider || !chainId) throw new Error('account or provider or chainId required')

      const contract = new Contract(DERP_ADDRESSES_BY_CHAINID[chainId], ERC20Abi, provider)
      const balanceOfDerp = await contract.balanceOf(account)
      const formattedBalance = Number(ethers.utils.formatUnits(balanceOfDerp, 18))
      setBalanceOfDerp(Number(formattedBalance))
      setBalanceState((p) => ({ ...p, [BALANCE.DERP]: Number(formattedBalance) }))
      setState((p) => ({ ...p, isSuccess: true }))
    } catch (err) {
      console.log('[Err getBalance]', err)
      setState((p) => ({ ...p, error: err.message || 'An error occurred' }))
    } finally {
      setState((p) => ({ ...p, isLoading: false }))
    }
  }

  const getBalanceOfXDerp = async () => {
    try {
      setState({ ...initialDerpBalanceState, isLoading: true })
      if (!account || !provider || !chainId) throw new Error('account or provider or chainId required')

      const contract = new Contract(XDERP_ADDRESSES_BY_CHAINID[chainId], ERC20Abi, provider)
      const balanceOfXDerp = await contract.balanceOf(account)
      const formattedBalance = Number(ethers.utils.formatUnits(balanceOfXDerp, 18))
      setBalanceOfXDerp(Number(formattedBalance))
      setBalanceState((p) => ({ ...p, [BALANCE.XDERP]: Number(formattedBalance) }))
      setState((p) => ({ ...p, isSuccess: true }))
    } catch (err) {
      console.log('[Err getBalance]', err)
      setState((p) => ({ ...p, error: err.message || 'An error occurred' }))
    } finally {
      setState((p) => ({ ...p, isLoading: false }))
    }
  }

  const batchGetBalance = async () => {
    try {
      getBalanceOfDerp()
      getBalanceOfXDerp()
    } catch (error) {
      console.log('[Err batchGetBalance]', error)
    }
  }

  useEffect(() => {
    batchGetBalance()
  }, [account, chainId])

  return {
    balanceOfDerpState: state,
    balanceOfDerp,
    getBalance: batchGetBalance,
  }
}

const validateWeb3React = (web3react: Web3ContextType) => {
  if (!web3react.provider) {
    throw Web3ErrorType.PROVIDER
  } else if (!web3react.account) {
    throw Web3ErrorType.ACCOUNT
  } else {
    return web3react
  }
}
