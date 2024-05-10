/* eslint-disable unused-imports/no-unused-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-unused-modules */
import { useWeb3React } from '@web3-react/core'
import { getChainInfo } from 'constants/chainInfo'
import { SupportedChainId } from 'constants/chains'
import { RPC_URLS } from 'constants/networks'
import * as ethers from 'ethers'
import { useEffect, useState } from 'react'
import { Provider, Wallet } from 'zksync-web3'

export const useGetNativeBalanceByChain = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const [balance, setBalance] = useState<number>(0)
  const getBalanceNative = async (chainId: SupportedChainId, account: string) => {
    setIsLoading(true)
    try {
      const provider = new ethers.providers.JsonRpcProvider(RPC_URLS[chainId][0])
      const getBalance = await provider?.getBalance(account)
      const formattedBalance = Number(ethers.utils.formatUnits(getBalance, 18))
      console.log(`Balance: ${formattedBalance} on ${chainId}`)
      setBalance(Number(formattedBalance.toFixed(6)))
      setIsLoading(false)
      setIsSuccess(true)
    } catch (err) {
      setIsError(true)
      setIsSuccess(false)
    }
  }

  return {
    getBalanceNative,
    balance,
    isLoading,
    isError,
    isSuccess,
  }
}

const ABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

export const useGetERC20BalanceByChain = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const [balance, setBalance] = useState<number>(0)
  const { chainId: injectedChainId } = useWeb3React()

  const getBalanceByChain = async (
    chainId: SupportedChainId,
    account: string,
    contract_address: string,
    decimals: number,
    isNative?: boolean
  ) => {
    setIsLoading(true)
    setBalance(0)
    try {
      if (isNative) {
        const provider = new ethers.providers.JsonRpcProvider(RPC_URLS[chainId][0])
        const getBalance = await provider?.getBalance(account)
        const formattedBalance = Number(ethers.utils.formatUnits(getBalance, 18))

        console.log(`Balance: ${formattedBalance} on ${chainId}`)
        setBalance(Number(formattedBalance.toFixed(6)))
      } else {
        const provider = new ethers.providers.JsonRpcProvider(RPC_URLS[chainId][0])
        const contract = new ethers.Contract(contract_address, ABI, provider)

        const balanceOf = await contract.balanceOf(account)

        const formattedBalance = Number(ethers.utils.formatUnits(balanceOf, decimals))
        console.log(`Balance: ${formattedBalance} on ${chainId}`)
        setBalance(Number(formattedBalance.toFixed(6)))
      }

      setIsLoading(false)
      setIsSuccess(true)
    } catch (err) {
      console.log('[Error useGetERC20BalanceByChain]:', err)
      setBalance(0)
      setIsError(true)
      setIsSuccess(false)
    }
  }

  return {
    getBalanceByChain,
    balance,
    isLoading,
    isError,
    isSuccess,
  }
}
