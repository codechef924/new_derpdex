import { useWeb3React } from '@web3-react/core'
import { SupportedChainId } from 'constants/chains'
import { RPC_PROVIDERS } from 'constants/providers'
import { Contract, ethers } from 'ethers'
import { useEffect, useMemo, useState } from 'react'

import LaunchPadABI from '../abis/launchpad.abi.json'
import { LAUNCHPAD_ADDRESSES } from '../constants'
import { DerivedLaunchPadDetails } from './useGetLaunchpadCampaigns'
type onWithdrawClaim = {
  isLoading: boolean
  isSuccess: boolean
  error: string | null
}
const initialState: onWithdrawClaim = {
  isLoading: false,
  isSuccess: false,
  error: null,
}

type onCanWithdrawStatus = {
  isLoading: boolean
  canWithdraw: boolean
  error: string | null
}
const initialCanWithdrawState: onCanWithdrawStatus = {
  isLoading: false,
  canWithdraw: false,
  error: null,
}

export const useWithdrawClaim = ({ launchPadInfo }: { launchPadInfo: DerivedLaunchPadDetails }) => {
  const { account, chainId, provider } = useWeb3React()
  const [state, setState] = useState<onWithdrawClaim>(initialState)
  const [withdrawInfoState, setWithdrawInfoState] = useState<onCanWithdrawStatus>(initialCanWithdrawState)
  const [withdrawActionText, setWithdrawActionText] = useState<string>('Claim')

  const { chainIdsToClaim, isLoading, setChainIdsToClaim, isInClaimableChainId } = useWhereToWithdraw({
    launchPadInfo,
    shouldRefetch: state.isSuccess,
  })

  const onWithdrawClaim = async () => {
    try {
      setState({ ...initialState, isLoading: true })
      if (!account || !chainId || !provider) throw '[account/chainId/provider is required]'
      const signer = provider.getSigner()
      const contract = new ethers.Contract(LAUNCHPAD_ADDRESSES[chainId], LaunchPadABI, signer)
      const onInitWithdraw = await contract.withdraw(launchPadInfo.campaignId)
      const receipt = await onInitWithdraw.wait()

      const reducdeId = chainIdsToClaim.filter((id) => id !== chainId)
      setChainIdsToClaim(reducdeId)
      setState((p) => ({ ...p, isLoading: false, isSuccess: true }))
    } catch (error) {
      console.log('[Err onWithdrawClaim]', error)
      setState((p) => ({
        ...p,
        isSuccess: false,
        error: error || 'An error occurred',
      }))
    } finally {
      setState((p) => ({ ...p, isLoading: false }))
    }
  }

  const onCheckWithdrawInfo = async () => {
    try {
      setWithdrawInfoState({ ...initialCanWithdrawState, isLoading: true })
      if (!account || !chainId || !provider) throw '[account/chainId/provider is required]'
      const contract = new ethers.Contract(LAUNCHPAD_ADDRESSES[chainId], LaunchPadABI, provider)

      const withdrawInfo = await contract.withdrawInfo(launchPadInfo.campaignId)
      // Need to add checking claimInfo's amountWithdrawn === 0 or n
      const claimInfo = await contract.claimInfo(account, launchPadInfo.campaignId)

      const alreadyWithdrawn = parseInt(claimInfo.amountWithdrawn) > 0
      const hasAnyWithdrawn = parseInt(claimInfo.amount) > 0

      if (withdrawInfo.canUserWithdraw && !alreadyWithdrawn) {
        setWithdrawInfoState((p) => ({ ...p, isLoading: false, canWithdraw: true }))
        setWithdrawActionText('Claim')
      } else if (hasAnyWithdrawn && alreadyWithdrawn) {
        setWithdrawInfoState((p) => ({ ...p, isLoading: false, canWithdraw: false }))
        setWithdrawActionText('Claimed')
      }

      if (chainIdsToClaim.length > 0) {
        setWithdrawActionText('Claim')
      }
    } catch (error) {
      console.log('[Err onCheckWithdrawInfo]')
      setWithdrawInfoState((p) => ({
        ...p,
        canWithdraw: false,
        error: error || 'An error occurred',
      }))
    } finally {
      setWithdrawInfoState((p) => ({ ...p, isLoading: false }))
    }
  }

  useEffect(() => {
    onCheckWithdrawInfo()
  }, [launchPadInfo, account, state.isSuccess, chainIdsToClaim])

  return {
    withdrawActionText,
    withdrawInfoState,
    withdrawActionState: state,
    onWithdrawClaim,

    chainIdsToClaim,
    isInClaimableChainId,
    isLoading,
  }
}

const chainIds =
  process.env.REACT_APP_IS_TESTSITE === 'true'
    ? [SupportedChainId.ZKSYNC_TESTNET, SupportedChainId.OPBNB_TESTNET, SupportedChainId.BASE_TESTNET]
    : [SupportedChainId.ZKSYNC_MAINNET, SupportedChainId.OPBNB_MAINNET, SupportedChainId.BASE_MAINNET]
// eslint-disable-next-line import/no-unused-modules
export const useWhereToWithdraw = ({
  launchPadInfo,
  shouldRefetch,
}: {
  launchPadInfo: DerivedLaunchPadDetails
  shouldRefetch: boolean
}) => {
  const { account, provider, chainId } = useWeb3React()
  const [chainIdsToClaim, setChainIdsToClaim] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const checkChainToWithdraw = async () => {
    try {
      setIsLoading(true)
      if (!account || !provider) throw 'Account/Provider required'
      const canClaimInChainIds: number[] = []

      for await (const id of chainIds) {
        const contract = new Contract(LAUNCHPAD_ADDRESSES[id], LaunchPadABI, RPC_PROVIDERS[id])
        const claimInfo = await contract.claimInfo(account, launchPadInfo.campaignId)

        if (parseInt(claimInfo.amount) > 0 && !(parseInt(claimInfo.amountWithdrawn) > 0)) {
          canClaimInChainIds.push(id)
        }
      }

      setChainIdsToClaim(canClaimInChainIds)
    } catch (error) {
      console.log('[Err checkChainToWithdraw]:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const isInClaimableChainId = useMemo(() => {
    if (account && chainId) {
      return chainIdsToClaim.includes(chainId) ? true : false
    }
    return false
  }, [account, chainId, chainIdsToClaim])

  useEffect(() => {
    checkChainToWithdraw()
  }, [account, launchPadInfo, shouldRefetch])

  return {
    chainIdsToClaim,
    setChainIdsToClaim,
    isInClaimableChainId,
    isLoading,
  }
}
