/* eslint-disable import/no-unused-modules */
import { gql, useLazyQuery } from '@apollo/client'
import { useWeb3React } from '@web3-react/core'
import { SupportedChainId } from 'constants/chains'
import { ZERO_ADDRESS } from 'constants/misc'
import { RPC_PROVIDERS } from 'constants/providers'
import { Contract } from 'ethers'
import { useLazyGetApolloClient, useLazyGetYieldBoostergApolloClient } from 'graphql/thegraph/apollo'
import { PositionFields } from 'hooks/useCultivatePoolDatas'
import { useV3Positions } from 'hooks/useV3Positions'
import { incentiveDeployedsAtom } from 'hooks/useWhitelistedPoolAddresses'
import { atom, useAtom } from 'jotai'
import { useAtomValue } from 'jotai/utils'
import { useMemo, useState } from 'react'
import { useEffect } from 'react'
import { PositionDetails } from 'types/position'

import DerpDEXStakingABI from '../abis/derpdexstaking.abi.json'
import { DERPDEX_STAKING_ADDRESSES_BY_CHAINID } from '../constants'
import { derivedPositionsAtom } from '../state/search.state'
function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const PositionsByPoolAddresses = gql`
  query positionsByPoolAddresses($poolString: String!, $incentiveContract: String!, $skipSize: Int!) {
    positions(where: { pool: $poolString, owner: $incentiveContract }, first: 100, skip: $skipSize) {
      id
      poolAddress
      owner
      feeTier
      liquidity
      token0 {
        id
      }
      token1 {
        id
      }
    }
  }
`

export const NFTHISTORY = gql`
  query userStakedPools($user_address: String!) {
    nftInfos(where: { oldOwner: $user_address }) {
      id
      newOwner
      oldOwner
    }
    tokenStakeds(where: { owner: $user_address }, orderBy: blockNumber, orderDirection: desc, first: 1000) {
      incentiveId
      liquidity
      tokenId
      blockTimestamp
      blockNumber
      id
    }
    tokenUnstakeds(orderBy: blockNumber, orderDirection: desc, first: 1000) {
      incentiveId
      id
      tokenId
      blockNumber
      blockTimestamp
    }
  }
`

interface NFTInfos {
  id: string
  newOwner: string
  oldOwner: string
}

interface ofStakedsOrUnstakeds {
  incentiveId: string
  tokenId: string
  blockNumber: string
  blockTimestamp: string
}

interface NFTHistoryResponse {
  nftInfos: NFTInfos[]
  tokenStakeds: ofStakedsOrUnstakeds[]
  tokenUnstakeds: ofStakedsOrUnstakeds[]
}

export enum Position {
  AVAILABLE = 'Available',
  STAKED = 'Staked',
}

interface Positions {
  id: string
  incentiveId: string
  liquidity: string
  poolAddress: string
  owner: string
  token0: {
    id: string
  }
  token1: {
    id: string
  }
  feeTier: string
}

interface PositionsResponse {
  positions: Positions[]
}

export interface DerivedPositions {
  [Position.AVAILABLE]: PositionFields[]
  [Position.STAKED]: PositionFields[]
}

export interface Pool_DerivedPositions {
  [key: string]: DerivedPositions
}

const mapped = new Map<string, PositionsResponse>()

function areStatesEqual(
  newState: { [x: string]: DerivedPositions | { Available: Positions[]; Staked: Positions[] } },
  oldState: Pool_DerivedPositions | null
) {
  // Compare the two state objects and return true if they are the same
  return JSON.stringify(newState) === JSON.stringify(oldState)
}

export const userStakedPositionsAtom = atom<{ [key: string]: Positions[] }>({})
export const globalStakedPositionsAtom = atom<{ [key: string]: Positions[] }>({})

export const useDerivedStakedPositions = ({
  chainId,
  poolAddress,
  token0,
  token1,
  feeTier,
  incentiveId,
}: {
  chainId?: SupportedChainId
  poolAddress: string
  token0?: string
  token1?: string
  feeTier?: number
  incentiveId: string
}) => {
  const incentiveDeployedsKeys = useAtomValue(incentiveDeployedsAtom)
  const { account, chainId: connectedChainId } = useWeb3React()
  const [derivedPositionsState, setDerivedPositionsState] = useAtom(derivedPositionsAtom)
  const [userStakedPositions, setUserStakedPositions] = useAtom(userStakedPositionsAtom)
  // For TVL purposes
  const [globalStakedPositions, setGlobalStakedPositions] = useAtom(globalStakedPositionsAtom)

  const accountResolved = useMemo(() => {
    return account ? account.toLowerCase() : ZERO_ADDRESS
  }, [account])

  const derpDexStakingAddressResolved = useMemo(() => {
    return chainId && DERPDEX_STAKING_ADDRESSES_BY_CHAINID[chainId]
      ? DERPDEX_STAKING_ADDRESSES_BY_CHAINID[chainId].toLowerCase()
      : ZERO_ADDRESS
  }, [chainId])

  const apolloV3ClientHook = useLazyGetApolloClient(chainId ? chainId : SupportedChainId.ZKSYNC_MAINNET)
  const [bundledPositionsState, setBundledPositionsState] = useState<PositionsResponse | null>(null)

  const [getPositions, { loading: loadingPositions, error: errorPositions, data: positionDatas, client }] =
    useLazyQuery<PositionsResponse>(PositionsByPoolAddresses, {
      client: apolloV3ClientHook ? apolloV3ClientHook : undefined,
      variables: {
        user_address: accountResolved,
        poolString: poolAddress,
      },
      fetchPolicy: 'no-cache',
      pollInterval: 3000,
    })

  // Checked by incentive contract address as owner instead of getting all
  const bundledPositions = async () => {
    try {
      const pageLimit = 1000
      const skipSize = 100
      const initialSize = 0
      let onStoredData: Positions[] = []
      const incentiveContract = incentiveDeployedsKeys[incentiveId]

      for (let i = initialSize; i < pageLimit; i += skipSize) {
        const { data } = await getPositions({
          fetchPolicy: 'no-cache',
          variables: {
            poolAddress,
            skipSize: i,
            // Only get all yield-farming staked positions on instead of all positions
            incentiveContract: incentiveContract.toLowerCase(),
          },
        })

        if (data && !(data.positions.length > 0)) {
          setBundledPositionsState({
            positions: onStoredData,
          })
          break
        }

        if (data && data.positions.length > 0) {
          onStoredData = [...onStoredData, ...data.positions]
          // console.log('onStoredData', onStoredData)
        }
      }
    } catch (err) {
      console.log('[Err Bundling all positions]', err)
    }
  }

  useEffect(() => {
    if (bundledPositionsState) {
      const { positions } = bundledPositionsState
      setGlobalStakedPositions((prev) => {
        const updatedState = { ...prev, [incentiveId]: positions }

        return updatedState
      })
    }
  }, [bundledPositionsState, incentiveId])

  const apolloYieldBoostClientHook = useLazyGetYieldBoostergApolloClient(
    chainId ? chainId : SupportedChainId.ZKSYNC_MAINNET
  )
  const [
    getNftInfos,
    { loading: loadingNftInfo, error: errorNftInfo, data: nftInfoDatas, client: derpDexStakingClient },
  ] = useLazyQuery<NFTHistoryResponse>(NFTHISTORY, {
    client: apolloYieldBoostClientHook ? apolloYieldBoostClientHook : undefined,
    variables: {
      user_address: accountResolved,
      staking_address: derpDexStakingAddressResolved,
      poolString: poolAddress,
    },
    fetchPolicy: 'no-cache',
    pollInterval: 3000,
  })

  const { positions: positionsMulticall, loading: positionsLoading } = useV3Positions(account)

  const [openPositions, closedPositions] = positionsMulticall?.reduce<[PositionDetails[], PositionDetails[]]>(
    (acc, p) => {
      acc[p.liquidity?.isZero() ? 1 : 0].push(p)
      return acc
    },
    [[], []]
  ) ?? [[], []]

  const v3Positions: Positions[] = useMemo(() => {
    if (openPositions && account) {
      const filtered = openPositions.filter(
        (op) => op.token0.toLowerCase() === token0 && op.token1.toLowerCase() === token1 && op.fee === feeTier
      )

      const mappedData: Positions[] = []
      filtered.forEach((_f, index) => {
        mappedData.push({
          id: _f.tokenId.toString(),
          liquidity: _f.liquidity.toString(),
          poolAddress,
          incentiveId,
          owner: account.toLowerCase(),
          token0: {
            id: _f.token0.toLowerCase(),
          },
          token1: {
            id: _f.token1.toLowerCase(),
          },
          feeTier: _f.fee.toString(),
        })
      })
      return mappedData
    } else {
      return []
    }
  }, [openPositions, account, token0, token1, poolAddress])

  const checkStakeds = async () => {
    try {
      if (nftInfoDatas && bundledPositionsState) {
        const { positions } = bundledPositionsState
        const _onGlobalStakedPosition: { [key: string]: Positions[] } = {}
        const { nftInfos, tokenStakeds, tokenUnstakeds } = nftInfoDatas
        const uniqueIdentifier: ofStakedsOrUnstakeds[] = []

        tokenStakeds.forEach((ts) => {
          if (ts.incentiveId === incentiveId.toLowerCase()) {
            if (!uniqueIdentifier.find((ui) => ui.tokenId === ts.tokenId)) {
              uniqueIdentifier.push(ts)
            }
          }
        })

        if (!_onGlobalStakedPosition[incentiveId]) _onGlobalStakedPosition[incentiveId] = []

        for (const _stakedPositions of nftInfos) {
          const toInsert = positions.find((p) => p.id === _stakedPositions.id)

          if (toInsert) {
            _onGlobalStakedPosition[incentiveId].push(toInsert)
          }
        }

        setUserStakedPositions((prev) => {
          const updatedState = { ...prev, [incentiveId]: _onGlobalStakedPosition[incentiveId] }

          return updatedState
        })
      }
    } catch (err) {
      console.log('error:', err)
    }
  }

  useEffect(() => {
    bundledPositions()
  }, [bundledPositionsState, incentiveId])
  useEffect(() => {
    checkStakeds()
  }, [chainId, nftInfoDatas, bundledPositionsState, incentiveId, loadingNftInfo])

  // * Returns User's Available or Staked Positions only
  const derivedPositions = useMemo(() => {
    if (
      userStakedPositions &&
      userStakedPositions[incentiveId] &&
      v3Positions &&
      account &&
      chainId &&
      DERPDEX_STAKING_ADDRESSES_BY_CHAINID[chainId]
    ) {
      return {
        [Position.AVAILABLE]: v3Positions.sort((a, b) => Number(a.id) - Number(b.id)),
        [Position.STAKED]: userStakedPositions[incentiveId].sort((a, b) => Number(a.id) - Number(b.id)),
      }
    } else {
      return null
    }
  }, [userStakedPositions, incentiveId, v3Positions, account, chainId])

  useEffect(() => {
    if (derivedPositions) {
      setDerivedPositionsState((prev) => {
        const updatedState = { ...prev, [incentiveId]: derivedPositions }
        // Check if the new state is different from the current state
        if (areStatesEqual(updatedState, prev)) {
          return prev // Skip the update if they are the same
        } else {
          return updatedState
        }
      })
    }
  }, [account, incentiveId, derivedPositions])

  useEffect(() => {
    getNftInfos({
      fetchPolicy: 'no-cache',
      pollInterval: 3000,
    })
  }, [incentiveId])

  const resolveFromContract = async ({ poolId, type }: { poolId: string; type: Position }) => {
    try {
      if (!chainId || !RPC_PROVIDERS[chainId]) throw 'Unable to resolve'

      let found = false
      const contract = new Contract(
        DERPDEX_STAKING_ADDRESSES_BY_CHAINID[chainId],
        DerpDEXStakingABI,
        RPC_PROVIDERS[chainId]
      )
      // eslint-disable-next-line no-async-promise-executor
      const promises = await new Promise(async (resolve, reject) => {
        while (!found) {
          const result = (await contract.isTokenIdStaked(poolId)) as boolean
          console.log('isTokenIdStaked', result)
          if (type === Position.AVAILABLE) {
            if (result) {
              found = true
              break
            }
          } else {
            if (!result) {
              found = true
              break
            }
          }

          await wait(3000)
        }
        resolve(found)
      })
      await getPositions({
        fetchPolicy: 'no-cache',
      })
      return found
    } catch (e) {
      console.log('Unable to resolve')
      return false
    }
  }

  const resolveTillSuccessStake = async ({
    poolAddress,
    poolId,
    type,
  }: {
    poolAddress: string
    poolId: string
    type: Position
  }) => {
    try {
      let found = false
      let newData: PositionsResponse
      // eslint-disable-next-line no-async-promise-executor
      const promises = await new Promise(async (resolve, reject) => {
        while (!found) {
          const results = await getPositions({
            fetchPolicy: 'network-only',
          })
          const positions = results.data?.positions
          const res = mapped.get('allData')
          let success = undefined

          if (type === Position.AVAILABLE) {
            success = positions
              ? positions.find(
                  (r) => r.poolAddress === poolAddress && r.id === poolId && r.owner !== account?.toLowerCase()
                )
              : undefined
          } else {
            success = positions
              ? positions.find(
                  (r) => r.poolAddress === poolAddress && r.id === poolId && r.owner === account?.toLowerCase()
                )
              : undefined
          }
          console.log('Resolving positions')
          if (success && positions) {
            console.log('Indexed!')
            found = true
            break
          }
          await wait(1000)
        }
        resolve(found)
      })
    } catch (error) {
      console.log('[Unable to resolve]', error)
    }
  }

  return {
    derivedPositions,
    resolveTillSuccessStake,
    resolveFromContract,
    bundledPositions,
  }
}
