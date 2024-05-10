/* eslint-disable import/no-unused-modules */
import { useWeb3React } from '@web3-react/core'
import { Contract, ethers } from 'ethers'
import { useEffect } from 'react'
import { useState } from 'react'

import AirdropABI from '../abis/airdrop.abi.json'
import { AIRDROP_ADDRESSES } from '../constants'

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

export const useGetEthAmount = ({ totalAmount, ETHPriceInUSD }: { totalAmount: string; ETHPriceInUSD: string }) => {
  const { account, chainId, provider } = useWeb3React()
  const [state, setState] = useState<ReactInit>(initialState)
  const [feeAmount, setFeeAmount] = useState<string>('0')
  const onGetEthAmount = async () => {
    try {
      setState({ ...initialState, isLoading: true })
      if (!provider || !chainId) throw 'Wallet/Provider/ChainId address required for checking'

      const contract = new Contract(AIRDROP_ADDRESSES[chainId], AirdropABI, provider)
      const ETHAmount = await contract.getETHAmount(totalAmount, ETHPriceInUSD)

      const formatUnits = ethers.utils.formatUnits(ETHAmount, 18)

      setFeeAmount(formatUnits.toString())

      setState((p) => ({ ...p, isLoading: false, isSuccess: true }))
    } catch (err) {
      console.log('[Err: onGetEthAmount]', err)
      setState((p) => ({ ...p, isLoading: false, error: err }))
    } finally {
      setState((p) => ({ ...p, isLoading: false }))
    }
  }

  useEffect(() => {
    if (account && chainId) {
      onGetEthAmount()
    }
  }, [totalAmount, ETHPriceInUSD, account, chainId])

  return {
    getEthAmountState: state,
    feeAmount,
  }
}
