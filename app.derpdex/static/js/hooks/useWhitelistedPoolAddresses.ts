import { useLazyQuery } from '@apollo/client'
/* eslint-disable import/no-unused-modules */
import { gql, useQuery } from '@apollo/client'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import { useLazyGetApolloClient, useLazyGetYieldBoostergApolloClient } from 'graphql/thegraph/apollo'
import { atom, useAtom } from 'jotai'
import { useAtomValue } from 'jotai/utils'
import { useEffect } from 'react'
import { useMemo } from 'react'
import { POOL_HIDE } from 'utils/constants'
import { notEmpty } from 'utils/general'

import { SupportedChainId } from './../constants/chains'
import { stakingView, TableOption } from './../pages/Cultivate/components/Table'

// eslint-disable-next-line import/no-unused-modules
export const WHITELISTED_POOLS = gql`
  query whitelistedPools($poolIds: [String]!) {
    pools(
      where: { id_in: $poolIds }
      first: 50
      orderBy: totalValueLockedUSD
      orderDirection: desc
      subgraphError: allow
    ) {
      id
    }
  }
`

interface WhitelistedPoolsResponse {
  pools: {
    id: string
  }[]
}

/**
 * Fetch top addresses by volume
 */
export function useWhitelistedPoolAddresses({
  chainId,
  whiteListedPools,
}: {
  chainId: number | SupportedChainId
  whiteListedPools: string[]
}): {
  loading: boolean
  error: boolean
  addresses: string[] | undefined
} {
  const { chainId: connectedChainId } = useWeb3React()

  const apolloClientHook = useLazyGetApolloClient(chainId)

  const { loading, error, data } = useQuery<WhitelistedPoolsResponse>(WHITELISTED_POOLS, {
    client: apolloClientHook ? apolloClientHook : undefined,
    fetchPolicy: 'cache-first',
    variables: {
      poolIds: whiteListedPools,
    },
  })

  const formattedData = useMemo(() => {
    if (data) {
      return data.pools
        .map((p) => {
          if (POOL_HIDE[chainId ? chainId : 280].includes(p.id.toLocaleLowerCase())) {
            return undefined
          }
          return p.id
        })
        .filter(notEmpty)
    } else {
      return undefined
    }
  }, [
    // eslint-disable-next-line react-hooks/exhaustive-deps
    chainId,
    data,
  ])

  return {
    loading,
    error: Boolean(error),
    addresses: formattedData,
  }
}

// eslint-disable-next-line import/no-unused-modules
export const INCENTIVE_CREATEDS_AND_ENDEDS = gql`
  query incentiveCreatedsAndEndeds {
    incentiveCreateds {
      id
      rewardToken
      pool
      startTime
      endTime
      refundee
      reward
      addtionalIncentives {
        reward
        rewardToken
      }
    }
    incentiveDeployeds {
      incentiveContract
      incentiveId
    }
    incentiveEndeds {
      id
      incentiveId
      refund
    }
    nftInfos(where: { isStaked: true }) {
      id
      newOwner
      oldOwner
      isStaked
    }
  }
`
export interface INCENTIVE_KEY {
  id: string
  rewardToken: string
  pool: string
  startTime: string
  endTime: string
  refundee: string
  reward: string
  addtionalIncentives: {
    reward: string
    rewardToken: string
  }[]
}

interface INCENTIVE_ENDED {
  id: string
  incentiveId: string
  refund: string
}

interface INCENTIVE_DEPLOYED {
  incentiveContract: string
  incentiveId: string
}

interface NFTInfosStaked {
  id: string
  newOwner: string
  oldOwner: string
  isStaked: boolean
}
interface INCENTIVE_CREATEDS_AND_ENDEDS_RESPONSE {
  incentiveCreateds: INCENTIVE_KEY[]
  incentiveEndeds: INCENTIVE_ENDED[]
  incentiveDeployeds: INCENTIVE_DEPLOYED[]
  nftInfos: NFTInfosStaked[]
}

export enum STAKING_POOL_STATE {
  LIVE = 'Live',
  FINISHED = 'Finished',
}

interface STAKING_POOLS {
  [STAKING_POOL_STATE.LIVE]: INCENTIVE_KEY[]
  [STAKING_POOL_STATE.FINISHED]: INCENTIVE_KEY[]
}

export const incentiveKeysAtom = atom<{ [key: string]: INCENTIVE_KEY }>({})

// Pointer to key of incentiveId to retrieve incentiveContract
export const incentiveDeployedsAtom = atom<{ [key: string]: string }>({})

// * Keeping the raw incentive datas
export const incentiveCreatedAtom = atom<{ [key: string]: INCENTIVE_KEY }>({})

const getIncentiveId = (incentiveKey: INCENTIVE_KEY) => {
  const IncentiveKey = {
    rewardToken: 'address',
    pool: 'address',
    startTime: 'uint256',
    endTime: 'uint256',
    refundee: 'address',
  }

  const { rewardToken, pool, startTime, endTime, refundee } = incentiveKey

  const encoded = ethers.utils.defaultAbiCoder.encode(
    ['address', 'address', 'uint256', 'uint256', 'address'],
    [rewardToken, pool, startTime, endTime, refundee]
  )

  return ethers.utils.keccak256(encoded)
}

const MOCK_INCENTIVE_ENDEDS = [
  {
    id: '0x90078f0c10f6f0ed3a62e8c1c5bf0d04d9072e63775c06a501ebf494cc9ce14e',
    incentiveId: '0x90078f0c10f6f0ed3a62e8c1c5bf0d04d9072e63775c06a501ebf494cc9ce14e',
    refund: '0x440097cebd3b8c20ec43ba4a9395e252bf41dccc',
  },
]

export function useGetStakingPools({ chainId }: { chainId: number }): {
  loading: boolean
  error: boolean
  status: string
  stakingPools: STAKING_POOLS
  poolAddresses: string[]
  incentiveKeys: { [key: string]: INCENTIVE_KEY }
  allPoolAddresses: string[]
  stakedPoolsPositionIdsOnDerpDEX: string[]
} {
  const { account } = useWeb3React()
  const currentViewTable = useAtomValue(stakingView)
  const apolloYieldBoosterClientHook = useLazyGetYieldBoostergApolloClient(chainId)
  const [incentKeysState, setIncentiveKeysState] = useAtom(incentiveKeysAtom)
  const [incentiveDeployedsState, setIncentiveDeployedsState] = useAtom(incentiveDeployedsAtom)
  const [incentiveCreatedsState, setIncentiveCreatedsState] = useAtom(incentiveCreatedAtom)

  const [fetchWhiteListedAddresses, { loading, error, data }] = useLazyQuery<INCENTIVE_CREATEDS_AND_ENDEDS_RESPONSE>(
    INCENTIVE_CREATEDS_AND_ENDEDS,
    {
      client: apolloYieldBoosterClientHook ? apolloYieldBoosterClientHook : undefined,
      fetchPolicy: 'no-cache',
    }
  )

  useEffect(() => {
    fetchWhiteListedAddresses({
      fetchPolicy: 'no-cache',
    })
  }, [chainId, apolloYieldBoosterClientHook, account])

  const stakingPools: STAKING_POOLS = useMemo(() => {
    if (data) {
      const { incentiveEndeds } = data

      const EndedPools = incentiveEndeds.reduce((accum: string[], ended) => {
        accum.push(ended.incentiveId)
        return accum
      }, [])

      const currentTimestamp = Date.now() / 1000

      const isLivePoolsForStaking = data.incentiveCreateds.filter(
        (i) => currentTimestamp > parseInt(i.startTime) && currentTimestamp < parseInt(i.endTime)
      )
      const isEndedPoolsForStaking = data.incentiveCreateds.filter((i) => currentTimestamp > parseInt(i.endTime))
      return {
        [STAKING_POOL_STATE.LIVE]: isLivePoolsForStaking,
        [STAKING_POOL_STATE.FINISHED]: isEndedPoolsForStaking,
      }
    } else {
      return {
        [STAKING_POOL_STATE.LIVE]: [],
        [STAKING_POOL_STATE.FINISHED]: [],
      }
    }
  }, [chainId, data])

  const poolAddresses = useMemo(() => {
    if (currentViewTable === TableOption.LIVE) {
      return stakingPools[STAKING_POOL_STATE.LIVE].map((i) => {
        return i.id
      })
    } else {
      return stakingPools[STAKING_POOL_STATE.FINISHED].map((i) => {
        return i.id
      })
    }
  }, [stakingPools, currentViewTable])

  const allPoolAddresses = useMemo(() => {
    const addresses: string[] = []
    if (data) {
      const { incentiveCreateds } = data
      incentiveCreateds.forEach((a) => {
        addresses.push(a.pool)
      })
    }
    return addresses
  }, [data, chainId])

  const incentiveKeys = useMemo(() => {
    let accum: { [key: string]: INCENTIVE_KEY } = {}
    if (data) {
      const currentTimestamp = Date.now() / 1000
      const { incentiveCreateds, incentiveEndeds } = data

      const incentiveEndedIds = data.incentiveEndeds.map((item) => item.incentiveId)
      if (currentViewTable === TableOption.LIVE) {
        incentiveCreateds.forEach((i) => {
          const incentiveId = getIncentiveId(i)
          if (
            currentTimestamp > parseInt(i.startTime) &&
            currentTimestamp < parseInt(i.endTime) &&
            !incentiveEndedIds.includes(i.id)
          ) {
            accum = {
              ...accum,
              [incentiveId]: {
                id: incentiveId,
                rewardToken: i.rewardToken,
                pool: i.pool,
                startTime: i.startTime,
                endTime: i.endTime,
                refundee: i.refundee,
                reward: i.reward,
                addtionalIncentives: i.addtionalIncentives,
              },
            }
          }
        })
      } else {
        incentiveCreateds.forEach((i) => {
          const incentiveId = getIncentiveId(i)
          // Ended Incentive
          if (currentTimestamp > parseInt(i.endTime) || incentiveEndedIds.includes(i.id)) {
            accum = {
              ...accum,
              [incentiveId]: {
                id: incentiveId,
                rewardToken: i.rewardToken,
                pool: i.pool,
                startTime: i.startTime,
                endTime: i.endTime,
                refundee: i.refundee,
                reward: i.reward,
                addtionalIncentives: i.addtionalIncentives,
              },
            }
          }
        })
      }

      return accum
    } else {
      return {}
    }
  }, [data, chainId, currentViewTable])

  const incentiveDeployeds = useMemo(() => {
    let accum: { [key: string]: string } = {}
    if (data) {
      const { incentiveDeployeds } = data
      incentiveDeployeds.forEach((idep) => {
        accum = {
          ...accum,
          [idep.incentiveId]: idep.incentiveContract,
        }
      })
      return accum
    } else {
      return {}
    }
  }, [data, chainId, currentViewTable])

  // Keeping the original raw incentive created datas
  const incentiveCreateds = useMemo(() => {
    let accum: { [key: string]: INCENTIVE_KEY } = {}
    if (data) {
      const { incentiveCreateds } = data
      incentiveCreateds.forEach((i) => {
        const incentiveId = getIncentiveId(i)
        accum = {
          ...accum,
          [incentiveId]: {
            id: incentiveId,
            rewardToken: i.rewardToken,
            pool: i.pool,
            startTime: i.startTime,
            endTime: i.endTime,
            refundee: i.refundee,
            reward: i.reward,
            addtionalIncentives: i.addtionalIncentives,
          },
        }
      })
      return accum
    } else {
      return {}
    }
  }, [data, chainId])

  useEffect(() => {
    setIncentiveKeysState(incentiveKeys)
  }, [incentiveKeys, chainId, currentViewTable])

  useEffect(() => {
    setIncentiveDeployedsState(incentiveDeployeds)
  }, [incentiveDeployeds, chainId, currentViewTable])

  // useEffect(() => {
  //   setIncentiveCreatedsState(incentiveCreateds)
  // }, [incentiveCreateds, chainId])

  const stakedPoolsPositionIdsOnDerpDEX = useMemo(() => {
    const allStakedIds: string[] = []
    if (data) {
      const { nftInfos } = data
      if (nftInfos && nftInfos.length > 0) {
        nftInfos.forEach((n) => {
          allStakedIds.push(n.id)
        })
      }
      return allStakedIds
    } else {
      return allStakedIds
    }
  }, [data])

  return {
    loading,
    error: Boolean(error),
    status: currentViewTable,
    stakingPools,
    poolAddresses,
    incentiveKeys,
    allPoolAddresses,
    stakedPoolsPositionIdsOnDerpDEX,
  }
}
