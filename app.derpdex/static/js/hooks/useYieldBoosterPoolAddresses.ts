import { useLazyQuery } from '@apollo/client'
/* eslint-disable import/no-unused-modules */
import { gql } from '@apollo/client'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import { useLazyGetYieldBoostergApolloClient } from 'graphql/thegraph/apollo'
import { useEffect } from 'react'
import { useMemo } from 'react'

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

interface WhitelistedPoolsResponse {
  pools: {
    id: string
  }[]
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

interface NFTInfosStaked {
  id: string
  newOwner: string
  oldOwner: string
  isStaked: boolean
}
interface INCENTIVE_CREATEDS_AND_ENDEDS_RESPONSE {
  incentiveCreateds: INCENTIVE_KEY[]
  incentiveEndeds: INCENTIVE_ENDED[]
  nftInfos: NFTInfosStaked[]
}

export function useGetYieldBoosterPools({ chainId }: { chainId: number }) {
  const { account } = useWeb3React()
  const apolloYieldBoosterClientHook = useLazyGetYieldBoostergApolloClient(chainId)

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
    allPoolAddresses,
    incentiveKeys,
    stakedPoolsPositionIdsOnDerpDEX,
  }
}
