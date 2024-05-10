/* eslint-disable import/no-unused-modules */
import { useWeb3React } from '@web3-react/core'
import { Contract } from 'ethers'
import { useEffect, useState } from 'react'

import AirdropABI from '../abis/airdrop.abi.json'
import { AIRDROP_ADDRESSES } from '../constants'
import { ITasks } from './useGetTasks'

enum REWARD {
  OG_REWARDS = 'OG Rewards',
  TESTNET_REWARDS = 'TESTNET Rewards',
  BLOCKCHAIN_USERS = 'Blockchain Users',
}
interface ICOLLECTABLE {
  [REWARD.OG_REWARDS]: number
  [REWARD.TESTNET_REWARDS]: number
  [REWARD.BLOCKCHAIN_USERS]: number
}

const initialState: ICOLLECTABLE = {
  [REWARD.OG_REWARDS]: 0,
  [REWARD.TESTNET_REWARDS]: 0,
  [REWARD.BLOCKCHAIN_USERS]: 0,
}

interface ReactInit {
  isLoading: boolean
  isSuccess: boolean
  error: string | null
}
const preloadState: ReactInit = {
  isLoading: false,
  isSuccess: false,
  error: null,
}

export const useSafetyCheck = ({ tasks }: { tasks: ITasks[] }) => {
  const { chainId, provider } = useWeb3React()
  const [claimSafetyCheck, setClaimSafetyCollect] = useState<ICOLLECTABLE>(initialState)
  const [state, setState] = useState<ReactInit>(preloadState)

  const preloadClaimable = async () => {
    try {
      setState({ ...preloadState, isLoading: true })
      setClaimSafetyCollect(initialState)
      if (!provider || !chainId) throw 'Wallet/Provider/ChainId address required for checking'

      console.log('chainId', chainId)
      const contract = new Contract(AIRDROP_ADDRESSES[chainId], AirdropABI, provider)

      const blockchainRemaining = await contract.blockchainRemaining()
      const testnetRemaining = await contract.testnetRemaining()
      const ogRemaining = await contract.ogRemaining()

      const safetyCheck: ICOLLECTABLE = {
        [REWARD.OG_REWARDS]: parseFloat(ogRemaining),
        [REWARD.TESTNET_REWARDS]: parseFloat(testnetRemaining),
        [REWARD.BLOCKCHAIN_USERS]: parseFloat(blockchainRemaining),
      }

      setClaimSafetyCollect((prevState) => ({
        ...prevState,
        ...safetyCheck,
      }))
      setState((p) => ({ ...p, isLoading: false, isSuccess: true }))
    } catch (err) {
      console.log('[Err: preloadClaimable]', err)
      setClaimSafetyCollect(initialState)
      setState((p) => ({ ...p, isLoading: false, error: err }))
    } finally {
      setState((p) => ({ ...p, isLoading: false }))
    }
  }

  useEffect(() => {
    if (chainId && provider) {
      preloadClaimable()
    }
  }, [chainId, provider, tasks])

  return {
    preloadCheckState: state,
    claimSafetyCheck,
  }
}
