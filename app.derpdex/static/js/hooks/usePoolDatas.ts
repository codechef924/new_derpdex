/* eslint-disable import/no-unused-modules */
import { gql, useQuery } from '@apollo/client'
import { useWeb3React } from '@web3-react/core'
import { apolloClient } from 'graphql/thegraph/apollo'
import { useBlocksFromTimestamps } from 'hooks/useBlocksFromTimestamps'
// import { useActiveNetworkVersion, useClients } from 'state/application/hooks'
// import { PoolData } from 'state/pools/reducer'
import { get2DayChange } from 'utils/data'
import { useDeltaTimestamps } from 'utils/queries'
import { formatTokenName, formatTokenSymbol } from 'utils/tokens'

import { useGenesisPools } from './useGenesisPool'

export interface PoolData {
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
  lpFee?: number

  isGenesisPool?: boolean
  rangedApr?: number[]

  additionalAPR?: number

  fees24H?: number
}

export const POOLS_BULK = (block: number | undefined, pools: string[]) => {
  let poolString = `[`
  pools.map((address) => {
    return (poolString += `"${address}",`)
  })
  poolString += ']'

  const queryString =
    `
    query pools {
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
    }
    `
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
}

/**
 * Fetch top addresses by volume
 */

const GENESIS_POOLS_ADDRESS = [
  // '0xf91dd375822b0223ed9e69f36b9926c611116546', // zkSync WETH-USDC
  // '0xe2d9dc08528321f8416cb73a4ee5b4f793ab953d',
  // '0xd0cbe97675d09059cfb7d3c522a37ca8ee4103b2',
  // '0x276013cc73772ece24af7de3ed4bb77bd424a9ad', // zkSync USDC-USDT
  '0x8e6348d07074753294d85e6f85bd0dcb1bf94532',
  '0xb705dfeffda25dd8b29167d64300f364cb9b760c',
  '0xc910495a800ae100e4adfe052cc5745e6a30d122',

  // '0x09b852108b6ed78adb2e776d901b8d54ba708080', // Base WETH-USDbC
  '0xd6e59c35b11fb4b0c0855e27b29a49a8afa2b840',
  '0x60b3b8fdcf1c7c1bb5dae317d0ca445d4b68f1de',

  // '0xaf310d32c3c2982a23ce7ec1fe152912595a4c50', // opBNB USDT-BNB
  '0xe02c58c0a5970ae3a3f883d1cf665181633f8977',
  '0xe70aecc0f1a90d91b8164c08c4f00e29e3cf52ea',
  '0x3c8d93138240d5f72c46e829547385e8430250c2',
] // TODO add more genesis pools

const mapped = new Map()

export function usePoolDatas(poolAddresses: string[]): {
  loading: boolean
  error: boolean
  data: PoolData[] | undefined
} {
  // get client
  const { chainId } = useWeb3React()

  // get blocks from historic timestamps
  const [t24, t48, tWeek] = useDeltaTimestamps()
  const { blocks, error: blockError } = useBlocksFromTimestamps([t24, t48, tWeek])

  const [block24, block48, blockWeek] = blocks ?? []

  const { loading, error, data } = useQuery<PoolDataResponse>(POOLS_BULK(undefined, poolAddresses), {
    client: apolloClient,
    fetchPolicy: 'no-cache',
  })

  const {
    loading: loading24,
    error: error24,
    data: data24,
  } = useQuery<PoolDataResponse>(POOLS_BULK(block24?.number, poolAddresses), {
    client: apolloClient,
    fetchPolicy: 'no-cache',
  })
  const {
    loading: loading48,
    error: error48,
    data: data48,
  } = useQuery<PoolDataResponse>(POOLS_BULK(block48?.number, poolAddresses), {
    client: apolloClient,
    fetchPolicy: 'no-cache',
  })
  const {
    loading: loadingWeek,
    error: errorWeek,
    data: dataWeek,
  } = useQuery<PoolDataResponse>(POOLS_BULK(blockWeek?.number, poolAddresses), {
    client: apolloClient,
    fetchPolicy: 'no-cache',
  })

  const { loadedPools } = useGenesisPools()

  const anyError = Boolean(error || error24 || error48 || blockError || errorWeek)
  const anyLoading = Boolean(loading || loading24 || loading48 || loadingWeek)

  // return early if not all data yet
  if (anyError || anyLoading) {
    return {
      loading: anyLoading,
      error: anyError,
      data: undefined,
    }
  }

  const ethPriceUSD = data?.bundles?.[0]?.ethPriceUSD ? parseFloat(data?.bundles?.[0]?.ethPriceUSD) : 0

  const parsed = data?.pools
    ? data.pools.reduce((accum: { [address: string]: PoolFields }, poolData) => {
        accum[poolData.id] = poolData
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
  const formatted = poolAddresses.reduce((accum: { [address: string]: PoolData }, address) => {
    const current: PoolFields | undefined = parsed[address]
    const oneDay: PoolFields | undefined = parsed24[address]
    const twoDay: PoolFields | undefined = parsed48[address]
    const week: PoolFields | undefined = parsedWeek[address]

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
    let apr = current ? ((feePercent * volumeUSD) / tvlUSD) * 365 * 100 : 0

    const pool = loadedPools.find((pool) => pool.address === current.id)
    let maxApr = 0
    let additionalAPR = 0
    let lpFee = 0
    if (pool && GENESIS_POOLS_ADDRESS.includes(pool.address)) {
      const totalRewardsInUSD = Number(pool.totalRewardsPool) * Number(pool.pricePerDERP)
      additionalAPR = (((totalRewardsInUSD / Number(current.totalValueLockedUSD)) * 100) / 69) * 365
      maxApr = apr + additionalAPR
      lpFee = apr
      apr = maxApr
      if (additionalAPR !== 0 && maxApr !== 0) {
        //! Prevent genesis pool hooks missing or not loaded properly after sorting
        mapped.set(current.id, {
          maxApr,
          additionalAPR,
          lpFee,
        })
      }
    } else if (!pool && GENESIS_POOLS_ADDRESS.includes(current.id)) {
      const reservedData = mapped.get(current.id)
      additionalAPR = reservedData?.additionalAPR || 0
      maxApr = reservedData?.maxApr || 0
      lpFee = reservedData?.lpFee || 0
      apr = maxApr
    }

    //! TODO
    const isGenesisPool = GENESIS_POOLS_ADDRESS.includes(address)

    const rangedApr = GENESIS_POOLS_ADDRESS.includes(address) ? [apr, maxApr] : [0, 0]

    if (current) {
      accum[address] = {
        address,
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
        lpFee,
        isGenesisPool,
        rangedApr,
        additionalAPR,
      }
    }

    return accum
  }, {})

  const remapped = Object.values(formatted)

  return {
    loading: anyLoading,
    error: anyError,
    data: remapped,
  }
}
