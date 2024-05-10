/* eslint-disable import/no-unused-modules */
import { gql, useLazyQuery, useQuery } from '@apollo/client'
import { keccak256 } from '@ethersproject/solidity'
import { useWeb3React } from '@web3-react/core'
import { V3_CORE_FACTORY_ADDRESSES } from 'constants/addresses'
import { ZERO_ADDRESS } from 'constants/misc'
import { ethers } from 'ethers'
import { useBlocksFromTimestampsByChainId } from 'hooks/useBlocksFromTimestamps'
import { useEffect } from 'react'
// import { useActiveNetworkVersion, useClients } from 'state/application/hooks'
// import { PoolData } from 'state/pools/reducer'
import { get2DayChange } from 'utils/data'
import { useDeltaTimestamps } from 'utils/queries'
import { formatTokenName, formatTokenSymbol } from 'utils/tokens'
import * as zksync from 'zksync-web3'

import { SupportedChainId } from './../constants/chains'
import { useLazyGetApolloClient } from './../graphql/thegraph/apollo'
import { DERPDEX_STAKING_ADDRESSES_BY_CHAINID } from './../pages/Cultivate/constants'
import { INCENTIVE_KEY } from './useWhitelistedPoolAddresses'

export interface CultivatePoolData {
  incentiveId: string
  // basic token info
  address: string
  feeTier: number

  token0: {
    name: string
    symbol: string
    address: string
    decimals: number
    derivedETH: number
  }

  token1: {
    name: string
    symbol: string
    address: string
    decimals: number
    derivedETH: number
  }

  // for tick math
  liquidity: number
  sqrtPrice: number
  tick: number

  // volume
  volumeUSD: number
  volumeUSDChange: number
  volumeUSDWeek: number

  // liquidity
  tvlUSD: number
  tvlUSDChange: number

  // prices
  token0Price: number
  token1Price: number

  // token amounts
  tvlToken0: number
  tvlToken1: number

  apr?: number

  stakingApr?: number

  fees24H?: number

  multiplier?: number

  earned?: number

  availablePositions?: number

  stakedPositions?: number

  positions: PositionFields[]
}

export const POOLS_BULK = (block: number | undefined, pools: string[], stakedPoolsPositionIdsOnDerpDEX: string[]) => {
  let poolString = `[`
  pools.map((address, index) => {
    if (index === pools.length - 1) {
      poolString += `"${ZERO_ADDRESS}"`
    }
    return (poolString += `"${address}",`)
  })
  // poolString += `"${ZERO_ADDRESS}"`
  poolString += ']'

  let stakedPositionIdsString = `[`
  stakedPoolsPositionIdsOnDerpDEX.map((id, index) => {
    return (stakedPositionIdsString += `"${id}",`)
  })

  stakedPositionIdsString += ']'

  const queryString =
    `
    query poolsAndPositions {
      pools(where: {id_in: ${poolString}},` +
    (block ? `block: {number: ${block}} ,` : ``) +
    ` orderBy: totalValueLockedUSD, orderDirection: desc, subgraphError: allow) {
        id
        feeTier
        liquidity
        sqrtPrice
        tick
        token0 {
            id
            symbol 
            name
            decimals
            derivedETH
        }
        token1 {
            id
            symbol 
            name
            decimals
            derivedETH
        }
        token0Price
        token1Price
        volumeUSD
        volumeToken0
        volumeToken1
        txCount
        totalValueLockedToken0
        totalValueLockedToken1
        totalValueLockedUSD
      }
      bundles (where: {id: "1"}) {
        ethPriceUSD
      }
      positions (where: {id_in: ${stakedPositionIdsString}, pool_in: ${poolString}}) {
        id
        poolAddress
        owner
        token0 {
          id
        }
        token1 {
          id
        }
        liquidity
        feeTier
      }
    }
    `
  // const positions = `
  //   query positions {
  //     positions(where: {owner: ${owner}, liquidity_not: "0"}) {
  //       id
  //       liquidity
  //       poolAddress
  //       owner
  //     }
  //   }
  // `
  return gql(queryString)
}

export interface PoolFields {
  id: string
  feeTier: string
  liquidity: string
  sqrtPrice: string
  tick: string
  token0: {
    id: string
    symbol: string
    name: string
    decimals: string
    derivedETH: string
  }
  token1: {
    id: string
    symbol: string
    name: string
    decimals: string
    derivedETH: string
  }
  token0Price: string
  token1Price: string
  volumeUSD: string
  volumeToken0: string
  volumeToken1: string
  txCount: string
  totalValueLockedToken0: string
  totalValueLockedToken1: string
  totalValueLockedUSD: string
}

export interface PositionFields {
  id: string
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

type Token = {
  __typename: string
  id: string
  symbol: string
  name: string
  decimals: string
}

export interface PoolDataFromGQL {
  feeTier: string
  id: string
  liquidity: string
  sqrtPrice: string
  tick: string
  token0: Token
  token0Price: string
  token1: Token
  token1Price: string
  totalValueLockedToken0: string
  totalValueLockedToken1: string
  totalValueLockedUSD: string
  txCount: string
  volumeToken0: string
  volumeToken1: string
  volumeUSD: string
}

interface PoolDataResponse {
  pools: PoolFields[]
  bundles: {
    ethPriceUSD: string
  }[]
  positions: PositionFields[]
}

/**
 * Fetch top addresses by volume
 */

const mapped = new Map()

export function useCultivatePoolDatas(
  chainId: number | SupportedChainId,
  poolAddresses: string[],
  incentiveKeys: INCENTIVE_KEY[],
  stakedPoolsPositionIdsOnDerpDEX: string[]
) {
  // get client
  const { chainId: connectedChainId, account } = useWeb3React()
  const apolloClient = useLazyGetApolloClient(chainId)

  // get blocks from historic timestamps
  const [t24, t48, tWeek] = useDeltaTimestamps()
  const { blocks, error: blockError } = useBlocksFromTimestampsByChainId([t24, t48, tWeek], chainId)

  const [block24, block48, blockWeek] = blocks ?? []

  const [fetchCultivatePool, { loading, error, data }] = useLazyQuery<PoolDataResponse>(
    POOLS_BULK(undefined, poolAddresses, stakedPoolsPositionIdsOnDerpDEX),
    {
      client: apolloClient,
      fetchPolicy: 'no-cache',
    }
  )
  useEffect(() => {
    fetchCultivatePool({
      fetchPolicy: 'no-cache',
    })
  }, [chainId, poolAddresses, apolloClient, stakedPoolsPositionIdsOnDerpDEX])

  const {
    loading: loading24,
    error: error24,
    data: data24,
  } = useQuery<PoolDataResponse>(POOLS_BULK(block24?.number, poolAddresses, stakedPoolsPositionIdsOnDerpDEX), {
    client: apolloClient,
    fetchPolicy: 'no-cache',
  })
  const {
    loading: loading48,
    error: error48,
    data: data48,
  } = useQuery<PoolDataResponse>(POOLS_BULK(block48?.number, poolAddresses, stakedPoolsPositionIdsOnDerpDEX), {
    client: apolloClient,
    fetchPolicy: 'no-cache',
  })
  const {
    loading: loadingWeek,
    error: errorWeek,
    data: dataWeek,
  } = useQuery<PoolDataResponse>(POOLS_BULK(blockWeek?.number, poolAddresses, stakedPoolsPositionIdsOnDerpDEX), {
    client: apolloClient,
    fetchPolicy: 'no-cache',
  })

  const anyError = Boolean(error || error24 || error48 || blockError || errorWeek)
  const anyLoading = Boolean(loading || loading24 || loading48 || loadingWeek)

  // return early if not all data yet
  if (anyError || anyLoading) {
    return {
      loading: anyLoading,
      error: anyError,
      data: undefined,
      fetchCultivatePool,
    }
  }

  const ethPriceUSD = data?.bundles?.[0]?.ethPriceUSD ? parseFloat(data?.bundles?.[0]?.ethPriceUSD) : 0

  const parsed = data?.pools
    ? data.pools.reduce((accum: { [address: string]: PoolFields }, poolData) => {
        accum[poolData.id] = poolData
        return accum
      }, {})
    : {}
  // console.log('data?.positions', data?.positions)
  const parsedPositions = data?.positions
    ? data.positions.reduce((accum: { [address: string]: PositionFields[] }, position) => {
        const { poolAddress } = position
        let currentPoolAddress = poolAddress
        if (currentPoolAddress === ZERO_ADDRESS) {
          const salt = keccak256(
            ['bytes'],
            [
              ethers.utils.defaultAbiCoder.encode(
                ['address', 'address', 'uint24'],
                [position.token0.id, position.token1.id, position.feeTier]
              ),
            ]
          )
          currentPoolAddress = zksync.utils
            .create2Address(
              V3_CORE_FACTORY_ADDRESSES[chainId],
              '0x010011b5a863aee85f9ffb9ff5152cfcd202f5f5ce21f1aeb7c57d30537ffb28',
              salt,
              '0x'
            )
            .toLowerCase()
        }
        if (!accum[currentPoolAddress]) {
          accum[currentPoolAddress] = []
        }
        accum[currentPoolAddress].push({
          ...position,
          poolAddress: currentPoolAddress,
        })
        return accum
      }, {})
    : {}

  const parsed24 = data24?.pools
    ? data24.pools.reduce((accum: { [address: string]: PoolFields }, poolData) => {
        accum[poolData.id] = poolData
        return accum
      }, {})
    : {}
  const parsed48 = data48?.pools
    ? data48.pools.reduce((accum: { [address: string]: PoolFields }, poolData) => {
        accum[poolData.id] = poolData
        return accum
      }, {})
    : {}
  const parsedWeek = dataWeek?.pools
    ? dataWeek.pools.reduce((accum: { [address: string]: PoolFields }, poolData) => {
        accum[poolData.id] = poolData
        return accum
      }, {})
    : {}

  // format data and calculate daily changes
  const formatted = Object.values(incentiveKeys).reduce((accum: { [id: string]: CultivatePoolData }, data) => {
    const current: PoolFields | undefined = parsed[data.pool]
    const currentPositions: PositionFields[] | undefined = parsedPositions[data.pool] ? parsedPositions[data.pool] : []

    const derivedPositions = {
      AvailablePositions: currentPositions.filter((a) => account && a.owner === account.toLowerCase()),
      StakedPositions: currentPositions.filter(
        (a) => chainId && a.owner === DERPDEX_STAKING_ADDRESSES_BY_CHAINID[chainId].toLowerCase()
      ),
    }

    const oneDay: PoolFields | undefined = parsed24[data.pool]
    const twoDay: PoolFields | undefined = parsed48[data.pool]
    const week: PoolFields | undefined = parsedWeek[data.pool]

    const [volumeUSD, volumeUSDChange] =
      current && oneDay && twoDay
        ? get2DayChange(current.volumeUSD, oneDay.volumeUSD, twoDay.volumeUSD)
        : current
        ? [parseFloat(current.volumeUSD), 0]
        : [0, 0]

    const volumeUSDWeek =
      current && week
        ? parseFloat(current.volumeUSD) - parseFloat(week.volumeUSD)
        : current
        ? parseFloat(current.volumeUSD)
        : 0

    // Hotifx: Subtract fees from TVL to correct data while subgraph is fixed.
    /**
     * Note: see issue desribed here https://github.com/Uniswap/v3-subgraph/issues/74
     * During subgraph deploy switch this month we lost logic to fix this accounting.
     * Grafted sync pending fix now.
     */
    const feePercent = current ? parseFloat(current.feeTier) / 10000 / 100 : 0
    const tvlAdjust0 = current?.volumeToken0 ? (parseFloat(current.volumeToken0) * feePercent) / 2 : 0
    const tvlAdjust1 = current?.volumeToken1 ? (parseFloat(current.volumeToken1) * feePercent) / 2 : 0
    const tvlToken0 = current ? parseFloat(current.totalValueLockedToken0) - tvlAdjust0 : 0
    const tvlToken1 = current ? parseFloat(current.totalValueLockedToken1) - tvlAdjust1 : 0
    let tvlUSD = current ? parseFloat(current.totalValueLockedUSD) : 0

    const tvlUSDChange =
      current && oneDay
        ? ((parseFloat(current.totalValueLockedUSD) - parseFloat(oneDay.totalValueLockedUSD)) /
            parseFloat(oneDay.totalValueLockedUSD === '0' ? '1' : oneDay.totalValueLockedUSD)) *
          100
        : 0

    // Part of TVL fix
    const tvlUpdated = current
      ? tvlToken0 * parseFloat(current.token0.derivedETH) * ethPriceUSD +
        tvlToken1 * parseFloat(current.token1.derivedETH) * ethPriceUSD
      : undefined
    if (tvlUpdated) {
      tvlUSD = tvlUpdated
    }

    const feeTier = current ? parseInt(current.feeTier) : 0
    const apr = current ? ((feePercent * volumeUSD) / tvlUSD) * 365 * 100 : 0

    if (current) {
      accum[data.id] = {
        incentiveId: data.id,
        address: data.pool,
        feeTier,
        liquidity: parseFloat(current.liquidity),
        sqrtPrice: parseFloat(current.sqrtPrice),
        tick: parseFloat(current.tick),
        token0: {
          address: current.token0.id,
          name: formatTokenName(current.token0.id, current.token0.name, chainId),
          symbol: formatTokenSymbol(current.token0.id, current.token0.symbol, chainId),
          decimals: parseInt(current.token0.decimals),
          derivedETH: parseFloat(current.token0.derivedETH),
        },
        token1: {
          address: current.token1.id,
          name: formatTokenName(current.token1.id, current.token1.name, chainId),
          symbol: formatTokenSymbol(current.token1.id, current.token1.symbol, chainId),
          decimals: parseInt(current.token1.decimals),
          derivedETH: parseFloat(current.token1.derivedETH),
        },
        token0Price: parseFloat(current.token0Price),
        token1Price: parseFloat(current.token1Price),
        volumeUSD,
        volumeUSDChange,
        volumeUSDWeek,
        tvlUSD,
        tvlUSDChange,
        tvlToken0,
        tvlToken1,
        apr,
        availablePositions: derivedPositions.AvailablePositions.length,
        stakedPositions: derivedPositions.StakedPositions.length,
        positions: currentPositions,
      }
    }

    return accum
  }, {})
  // const formatted = poolAddresses.reduce((accum: { [address: string]: CultivatePoolData }, address) => {
  //   const current: PoolFields | undefined = parsed[address]
  //   const currentPositions: PositionFields[] | undefined = parsedPositions[address] ? parsedPositions[address] : []

  //   const derivedPositions = {
  //     AvailablePositions: currentPositions.filter((a) => account && a.owner === account.toLowerCase()),
  //     StakedPositions: currentPositions.filter(
  //       (a) => chainId && a.owner === DERPDEX_STAKING_ADDRESSES_BY_CHAINID[chainId].toLowerCase()
  //     ),
  //   }

  //   const oneDay: PoolFields | undefined = parsed24[address]
  //   const twoDay: PoolFields | undefined = parsed48[address]
  //   const week: PoolFields | undefined = parsedWeek[address]

  //   const [volumeUSD, volumeUSDChange] =
  //     current && oneDay && twoDay
  //       ? get2DayChange(current.volumeUSD, oneDay.volumeUSD, twoDay.volumeUSD)
  //       : current
  //       ? [parseFloat(current.volumeUSD), 0]
  //       : [0, 0]

  //   const volumeUSDWeek =
  //     current && week
  //       ? parseFloat(current.volumeUSD) - parseFloat(week.volumeUSD)
  //       : current
  //       ? parseFloat(current.volumeUSD)
  //       : 0

  //   // Hotifx: Subtract fees from TVL to correct data while subgraph is fixed.
  //   /**
  //    * Note: see issue desribed here https://github.com/Uniswap/v3-subgraph/issues/74
  //    * During subgraph deploy switch this month we lost logic to fix this accounting.
  //    * Grafted sync pending fix now.
  //    */
  //   const feePercent = current ? parseFloat(current.feeTier) / 10000 / 100 : 0
  //   const tvlAdjust0 = current?.volumeToken0 ? (parseFloat(current.volumeToken0) * feePercent) / 2 : 0
  //   const tvlAdjust1 = current?.volumeToken1 ? (parseFloat(current.volumeToken1) * feePercent) / 2 : 0
  //   const tvlToken0 = current ? parseFloat(current.totalValueLockedToken0) - tvlAdjust0 : 0
  //   const tvlToken1 = current ? parseFloat(current.totalValueLockedToken1) - tvlAdjust1 : 0
  //   let tvlUSD = current ? parseFloat(current.totalValueLockedUSD) : 0

  //   const tvlUSDChange =
  //     current && oneDay
  //       ? ((parseFloat(current.totalValueLockedUSD) - parseFloat(oneDay.totalValueLockedUSD)) /
  //           parseFloat(oneDay.totalValueLockedUSD === '0' ? '1' : oneDay.totalValueLockedUSD)) *
  //         100
  //       : 0

  //   // Part of TVL fix
  //   const tvlUpdated = current
  //     ? tvlToken0 * parseFloat(current.token0.derivedETH) * ethPriceUSD +
  //       tvlToken1 * parseFloat(current.token1.derivedETH) * ethPriceUSD
  //     : undefined
  //   if (tvlUpdated) {
  //     tvlUSD = tvlUpdated
  //   }

  //   const feeTier = current ? parseInt(current.feeTier) : 0
  //   const apr = current ? ((feePercent * volumeUSD) / tvlUSD) * 365 * 100 : 0

  //   if (current) {
  //     accum[address] = {
  //       address,
  //       feeTier,
  //       liquidity: parseFloat(current.liquidity),
  //       sqrtPrice: parseFloat(current.sqrtPrice),
  //       tick: parseFloat(current.tick),
  //       token0: {
  //         address: current.token0.id,
  //         name: formatTokenName(current.token0.id, current.token0.name, chainId),
  //         symbol: formatTokenSymbol(current.token0.id, current.token0.symbol, chainId),
  //         decimals: parseInt(current.token0.decimals),
  //         derivedETH: parseFloat(current.token0.derivedETH),
  //       },
  //       token1: {
  //         address: current.token1.id,
  //         name: formatTokenName(current.token1.id, current.token1.name, chainId),
  //         symbol: formatTokenSymbol(current.token1.id, current.token1.symbol, chainId),
  //         decimals: parseInt(current.token1.decimals),
  //         derivedETH: parseFloat(current.token1.derivedETH),
  //       },
  //       token0Price: parseFloat(current.token0Price),
  //       token1Price: parseFloat(current.token1Price),
  //       volumeUSD,
  //       volumeUSDChange,
  //       volumeUSDWeek,
  //       tvlUSD,
  //       tvlUSDChange,
  //       tvlToken0,
  //       tvlToken1,
  //       apr,
  //       availablePositions: derivedPositions.AvailablePositions.length,
  //       stakedPositions: derivedPositions.StakedPositions.length,
  //       positions: currentPositions,
  //     }
  //   }

  //   return accum
  // }, {})

  const remappedPoolData = Object.values(formatted)

  return {
    loading: anyLoading,
    error: anyError,
    data: remappedPoolData,
    fetchCultivatePool,
  }
}
