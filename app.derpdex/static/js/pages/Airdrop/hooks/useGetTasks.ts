/* eslint-disable import/no-unused-modules */
import { useWeb3React } from '@web3-react/core'
import { GENESIS_API_URL } from 'constants/chains'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'

export interface ITasks {
  id: number
  tag: string
  title: string
  description: string
  rewardAmount: string | null
  group: string
}

export enum TASK_GROUP {
  GENESIS_POOLS = 'GENESIS_POOLS',
  TRADING_COMPETITION = 'TRADING_COMPETITION',
  OG_REWARDS = 'OG_REWARDS',
  BETA_MAINNET_REWARDS = 'BETA_MAINNET_REWARDS',
  TESTNET_REWARDS = 'TESTNET_REWARDS',
  BLOCKCHAIN_USERS = 'BLOCKCHAIN_USERS',
  GENESIS_RAFFLE = 'GENESIS_RAFFLE',
}

const url = process.env.REACT_APP_IS_TESTSITE === 'true' ? 'http://localhost:8080' : GENESIS_API_URL

// TODO: [airdrop] - Edit description
// ** This is to preload all the tasks to display first **
// ** API's allocations data tag should be the same as the tag here **

const INITIAL_TASK: ITasks[] = [
  {
    id: 1,
    tag: 'Genesis Pool',
    title: 'Genesis pool',
    description: 'The points will be accumulated based on your holding liquidity of the whitelisted pool over the time',
    rewardAmount: null,
    group: TASK_GROUP.GENESIS_POOLS,
  },
  {
    id: 2,
    tag: 'Extended Genesis Pool',
    title: 'Extended Genesis Pool',
    description: 'The points will be accumulated based on your holding liquidity of the whitelisted pool over the time',
    rewardAmount: null,
    group: TASK_GROUP.GENESIS_POOLS,
  },
  {
    id: 3,
    tag: 'TGE Genesis Pool',
    title: 'TGE Genesis Pool',
    description: 'The points will be accumulated based on your holding DERP liquidity over the time',
    rewardAmount: null,
    group: TASK_GROUP.GENESIS_POOLS,
  },
  {
    id: 4,
    tag: 'Trading Competition',
    title: 'Trading Competition',
    description: 'The points will be accumulated based on your trading behaviors on the whitelisted pairs',
    rewardAmount: null,
    group: TASK_GROUP.TRADING_COMPETITION,
  },
  {
    id: 5,
    tag: 'TGE Trading Competition',
    title: 'TGE Trading Competition',
    description: 'The points will be accumulated based on your trading behaviors on the DERP pairs',
    rewardAmount: null,
    group: TASK_GROUP.TRADING_COMPETITION,
  },
  {
    id: 6,
    tag: 'OG Rewards',
    title: 'OG Rewards',
    description: 'The points will be whitelisted based on your participation in the OG program (Claim in FCFS basis)',
    rewardAmount: null,
    group: TASK_GROUP.OG_REWARDS,
  },
  {
    id: 7,
    tag: 'BetaMainnet_Rewards',
    title: 'Beta Mainnet Rewards',
    description:
      'The points will be accumulated based on your liquidity of the whitelisted pool over the time and the task completion',
    rewardAmount: null,
    group: TASK_GROUP.BETA_MAINNET_REWARDS,
  },
  {
    id: 8,
    tag: 'TESTNET Rewards',
    title: 'TESTNET Rewards',
    description: 'The points will be accumulated based on your task completion (Claim in FCFS basis)',
    rewardAmount: null,
    group: TASK_GROUP.TESTNET_REWARDS,
  },
  {
    id: 8,
    tag: 'Blockchain Users',
    title: 'Blockchain Users',
    description:
      'The points will be whitelisted based on your participation in Genesis NFT holders and FriendTech in each chain (Claim in FCFS basis)',
    rewardAmount: null,
    group: TASK_GROUP.BLOCKCHAIN_USERS,
  },
  {
    id: 9,
    tag: 'GENESIS Raffle',
    title: 'Genesis Raffle Winner',
    description: 'The points will be whitelisted based on your participation in marketing campaigns.',
    rewardAmount: null,
    group: TASK_GROUP.GENESIS_RAFFLE,
  },
]

interface API_ALLOCATIONS {
  address: string
  amount: string
  chainId: number
  claimed: boolean
  internalId: number
  internalTag: string
  phase: number
  tag: string
  task: string
}

export const useGetTasks = () => {
  const [tasks, setTasks] = useState<ITasks[]>([])
  const [totalAmount, setTotalAmount] = useState<string>('0')
  const [ETHPriceInUSD, setETHPriceInUSD] = useState<string>('0')
  const [totalAllocationsPhase1, setTotalAllocationsPhase1] = useState<string>('0')
  const [phase2FeeAmountInETH, setPhase2FeeAmountInETH] = useState<string>('0')
  const { account, chainId, provider } = useWeb3React()

  const fetchTask = async () => {
    try {
      if (!chainId) throw '[account/chainId is required]'

      const searchParams = new URLSearchParams({
        userAddress: account?.toLowerCase() || '0x0000000000000000000000000000000000000000',
        chainId: chainId.toString(),
      })

      const response = await fetch(url + '/airdrop' + '/allocations' + `?${searchParams}`, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      })

      if (!response.ok) throw 'No response from server'

      const data = await response.json()
      return data
    } catch (err) {
      console.log('[fetchTask]', err)
      throw err
    }
  }

  const [isFullyClaimed, setIsFullyClaimed] = useState<boolean>(false)
  const onInitTasks = async () => {
    try {
      setTotalAmount('0')
      setTasks([])
      const results = await fetchTask()

      if (results) {
        const {
          phase2FeeAmountInETH,
          totalAllocationsPhase1,
          totalAmount,
          allocations,
          ETHPriceInUSD,
        }: {
          phase2FeeAmountInETH: string
          totalAllocationsPhase1: string
          totalAmount: string
          allocations: API_ALLOCATIONS[]
          ETHPriceInUSD: string
        } = results

        if (results.message === 'FULLY_CLAIMED') {
          setIsFullyClaimed(true)
        }

        setETHPriceInUSD(ETHPriceInUSD)
        setTotalAmount(totalAmount)
        setTotalAllocationsPhase1(totalAllocationsPhase1)
        setPhase2FeeAmountInETH(phase2FeeAmountInETH)

        if (allocations && allocations.length > 0) {
          const finalizedResults: ITasks[] = []

          INITIAL_TASK.forEach((_all_task) => {
            const _updatedRewardAmount = allocations.find((_a) => _a.tag === _all_task.tag)
            finalizedResults.push({
              ..._all_task,
              rewardAmount: _updatedRewardAmount
                ? ethers.utils.formatUnits(_updatedRewardAmount.amount, 18).toString()
                : null,
            })
          })

          setTasks(finalizedResults)
        } else {
          setTasks(INITIAL_TASK)
        }
      }
    } catch (error) {
      console.log('[Err useGetTasks]', error)
    }
  }

  useEffect(() => {
    if (chainId) {
      onInitTasks()
    }
  }, [account, chainId])

  return {
    totalAmount,
    tasks,
    totalAllocationsPhase1,
    ETHPriceInUSD,
    phase2FeeAmountInETH,
    isFullyClaimed,
  }
}
