import { gql, useQuery } from '@apollo/client'
import { FeeAmount, Pool } from '@derpdex/sdk'
import { computePoolAddress } from '@derpdex/sdk'
/* eslint-disable simple-import-sort/imports */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-imports */
import { Interface } from '@ethersproject/abi'
import { BigintIsh, Currency, Token } from '@uniswap/sdk-core'
import { abi as IUniswapV3FactoryABI } from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Factory.sol/IUniswapV3Factory.json'
import { abi as IUniswapV3PoolStateABI } from '@uniswap/v3-core/artifacts/contracts/interfaces/pool/IUniswapV3PoolState.sol/IUniswapV3PoolState.json'
import { useWeb3React } from '@web3-react/core'
import { SupportedChainId } from 'constants/chains'
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import * as ethers from 'ethers'
import { apolloClient } from 'graphql/thegraph/apollo'
import JSBI from 'jsbi'
import { useMultipleContractSingleData, useMultipleContractSingleDataByChainId } from 'lib/hooks/multicall'
import { useMemo } from 'react'
import { IUniswapV3FactoryInterface } from 'types/v3/IUniswapV3Factory'
import { computeDerpDexPoolAddress } from 'utils/computeDerpDexPoolAddress'
import { FACTORY_ADDRESS } from 'utils/constants'

import { V3_CORE_FACTORY_ADDRESSES } from '../constants/addresses'
import { IUniswapV3PoolStateInterface } from '../types/v3/IUniswapV3PoolState'
import { useManualContractCallForUniV3Pool } from './useV3Positions'

const POOL_STATE_INTERFACE = new Interface(IUniswapV3PoolStateABI) as IUniswapV3PoolStateInterface
const UNISWAP_V3_FACTORY_INTERFACE = new Interface(IUniswapV3FactoryABI) as IUniswapV3FactoryInterface

// Classes are expensive to instantiate, so this caches the recently instantiated pools.
// This avoids re-instantiating pools as the other pools in the same request are loaded.
class PoolCache {
  // Evict after 128 entries. Empirically, a swap uses 64 entries.
  private static MAX_ENTRIES = 128

  // These are FIFOs, using unshift/pop. This makes recent entries faster to find.
  private static pools: Pool[] = []
  private static addresses: { key: string; address: string }[] = []

  static getPoolAddress(chainId: number, factoryAddress: string, tokenA: Token, tokenB: Token, fee: FeeAmount): string {
    if (this.addresses.length > this.MAX_ENTRIES) {
      this.addresses = this.addresses.slice(0, this.MAX_ENTRIES / 2)
    }

    const { address: addressA } = tokenA
    const { address: addressB } = tokenB
    const key = `${factoryAddress}:${addressA}:${addressB}:${fee.toString()}`
    const found = this.addresses.find((address) => address.key === key)
    if (found) return found.address

    const computedAddress =
      chainId === SupportedChainId.ZKSYNC_MAINNET || chainId === SupportedChainId.ZKSYNC_TESTNET
        ? computeDerpDexPoolAddress({
            factoryAddress,
            tokenA,
            tokenB,
            fee,
            initCodeHashManualOverride:
              chainId === SupportedChainId.ZKSYNC_TESTNET
                ? '0x010011b5a863aee85f9ffb9ff5152cfcd202f5f5ce21f1aeb7c57d30537ffb28'
                : undefined,
          })
        : computePoolAddress({
            factoryAddress,
            tokenA,
            tokenB,
            fee,
            initCodeHashManualOverride:
              chainId === SupportedChainId.ZKSYNC_TESTNET
                ? '0x010011b5a863aee85f9ffb9ff5152cfcd202f5f5ce21f1aeb7c57d30537ffb28'
                : undefined,
          })

    const address = {
      key,
      // address: '0x901c50d1e45db26c734662319eaabda2da3fc163',
      // Computed address using the Uniswap V3 SDK ( keccak256 - [address, address, uint24]:[token0, token1, fee] )
      address: computedAddress,
    }

    this.addresses.unshift(address)
    return address.address
  }

  static async getPoolAddressFromSubgraph(
    factoryAddress: string,
    tokenA: Token,
    tokenB: Token,
    fee: FeeAmount
  ): Promise<string> {
    if (this.addresses.length > this.MAX_ENTRIES) {
      this.addresses = this.addresses.slice(0, this.MAX_ENTRIES / 2)
    }

    const { address: addressA } = tokenA
    const { address: addressB } = tokenB
    const key = `${factoryAddress}:${addressA}:${addressB}:${fee.toString()}`
    const found = this.addresses.find((address) => address.key === key)
    if (found) return found.address
    const poolAddress = await apolloClient.query({
      query: gql`
        query poolGetter($tokenA: String!, $tokenB: String!, $fee: String!) {
          pools(where: { token0: $tokenA, token1: $tokenB, feeTier: $fee }) {
            id
          }
        }
      `,
      variables: {
        tokenA: addressA,
        tokenB: addressB,
        fee: fee.toString(),
      },
    })

    const address = {
      key,
      address: poolAddress.data.pools[0].id as string,
    }

    this.addresses.unshift(address)
    return address.address
  }

  async getPoolFromExplorer(token0: string, token1: string, fee: string): Promise<string | undefined> {
    try {
      const provider = new ethers.providers.JsonRpcProvider('https://testnet.era.zksync.dev')
      const pool = new ethers.Contract(FACTORY_ADDRESS, IUniswapV3FactoryABI, provider)
      const poolAddress = await pool.getPool(token0, token1, fee)
      return poolAddress ?? undefined
    } catch (ex) {
      console.error(ex)
      return undefined
    }
  }

  static getPool(
    tokenA: Token,
    tokenB: Token,
    fee: FeeAmount,
    sqrtPriceX96: BigintIsh,
    liquidity: BigintIsh,
    tick: number
  ): Pool {
    if (this.pools.length > this.MAX_ENTRIES) {
      this.pools = this.pools.slice(0, this.MAX_ENTRIES / 2)
    }

    const found = this.pools.find(
      (pool) =>
        pool.token0 === tokenA &&
        pool.token1 === tokenB &&
        pool.fee === fee &&
        JSBI.EQ(pool.sqrtRatioX96, sqrtPriceX96) &&
        JSBI.EQ(pool.liquidity, liquidity) &&
        pool.tickCurrent === tick
    )
    if (found) return found

    const pool = new Pool(tokenA, tokenB, fee, sqrtPriceX96, liquidity, tick)
    this.pools.unshift(pool)
    return pool
  }
}

export enum PoolState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

export function usePools(
  poolKeys: [Currency | undefined, Currency | undefined, FeeAmount | undefined][]
): [PoolState, Pool | null][] {
  const { chainId } = useWeb3React()

  const poolTokens: ([Token, Token, FeeAmount] | undefined)[] = useMemo(() => {
    if (!chainId) return new Array(poolKeys.length)

    return poolKeys.map(([currencyA, currencyB, feeAmount]) => {
      if (currencyA && currencyB && feeAmount) {
        const tokenA = currencyA.wrapped
        const tokenB = currencyB.wrapped
        if (tokenA.equals(tokenB)) return undefined

        return tokenA.sortsBefore(tokenB) ? [tokenA, tokenB, feeAmount] : [tokenB, tokenA, feeAmount]
      }
      return undefined
    })
  }, [chainId, poolKeys])

  const poolAddresses: (string | undefined)[] = useMemo(() => {
    const v3CoreFactoryAddress = chainId && V3_CORE_FACTORY_ADDRESSES[chainId]
    if (!v3CoreFactoryAddress) return new Array(poolTokens.length)

    return poolTokens.map((value) => value && PoolCache.getPoolAddress(chainId, v3CoreFactoryAddress, ...value))
  }, [chainId, poolTokens])

  const slot0s = useMultipleContractSingleData(poolAddresses, POOL_STATE_INTERFACE, 'slot0')
  const liquidities = useMultipleContractSingleData(poolAddresses, POOL_STATE_INTERFACE, 'liquidity')

  return useMemo(() => {
    return poolKeys.map((_key, index) => {
      const tokens = poolTokens[index]
      if (!tokens) return [PoolState.INVALID, null]
      const [token0, token1, fee] = tokens

      if (!slot0s[index]) return [PoolState.INVALID, null]
      const { result: slot0, loading: slot0Loading, valid: slot0Valid } = slot0s[index]

      if (!liquidities[index]) return [PoolState.INVALID, null]
      const { result: liquidity, loading: liquidityLoading, valid: liquidityValid } = liquidities[index]

      if (!tokens || !slot0Valid || !liquidityValid) return [PoolState.INVALID, null]
      if (slot0Loading || liquidityLoading) return [PoolState.LOADING, null]
      if (!slot0 || !liquidity) return [PoolState.NOT_EXISTS, null]
      if (!slot0.sqrtPriceX96 || slot0.sqrtPriceX96.eq(0)) return [PoolState.NOT_EXISTS, null]

      try {
        const pool = PoolCache.getPool(token0, token1, fee, slot0.sqrtPriceX96, liquidity[0], slot0.tick)
        return [PoolState.EXISTS, pool]
      } catch (error) {
        console.error('Error when constructing the pool', error)
        return [PoolState.NOT_EXISTS, null]
      }
    })
  }, [liquidities, poolKeys, slot0s, poolTokens])
}

// eslint-disable-next-line import/no-unused-modules
export function usePoolsByChainId(
  poolKeys: [Currency | undefined, Currency | undefined, FeeAmount | undefined][],
  chainId: number | SupportedChainId
): [PoolState, Pool | null][] {
  const poolTokens: ([Token, Token, FeeAmount] | undefined)[] = useMemo(() => {
    if (!chainId) return new Array(poolKeys.length)

    return poolKeys.map(([currencyA, currencyB, feeAmount]) => {
      if (currencyA && currencyB && feeAmount) {
        const tokenA = currencyA.wrapped
        const tokenB = currencyB.wrapped
        if (tokenA.equals(tokenB)) return undefined

        return tokenA.sortsBefore(tokenB) ? [tokenA, tokenB, feeAmount] : [tokenB, tokenA, feeAmount]
      }
      return undefined
    })
  }, [chainId, poolKeys])

  const poolAddresses: (string | undefined)[] = useMemo(() => {
    const v3CoreFactoryAddress = chainId && V3_CORE_FACTORY_ADDRESSES[chainId]
    if (!v3CoreFactoryAddress) return new Array(poolTokens.length)

    return poolTokens.map((value) => value && PoolCache.getPoolAddress(chainId, v3CoreFactoryAddress, ...value))
  }, [chainId, poolTokens])

  const slot0s = useManualContractCallForUniV3Pool('slot0', chainId, poolAddresses[0])
  const liquidities = useManualContractCallForUniV3Pool('liuidity', chainId, poolAddresses[0])

  return useMemo(() => {
    return poolKeys.map((_key, index) => {
      const tokens = poolTokens[index]
      if (!tokens) return [PoolState.INVALID, null]
      const [token0, token1, fee] = tokens

      if (!slot0s) return [PoolState.INVALID, null]
      const { result: slot0 } = slot0s
      const { uniV3PoolState: slot0sState } = slot0s

      if (!liquidities) return [PoolState.INVALID, null]
      const { result: liquidity } = liquidities
      const { uniV3PoolState: liquidityState } = liquidities

      if (!tokens || !slot0sState.isSuccess || !liquidityState.isSuccess) return [PoolState.INVALID, null]
      if (slot0sState.isLoading || liquidityState.isLoading) return [PoolState.LOADING, null]
      if (!slot0 || !liquidity) return [PoolState.NOT_EXISTS, null]
      if (!slot0.sqrtPriceX96 || slot0.sqrtPriceX96.eq(0)) return [PoolState.NOT_EXISTS, null]

      try {
        const pool = PoolCache.getPool(token0, token1, fee, slot0.sqrtPriceX96, liquidity[0], slot0.tick)
        return [PoolState.EXISTS, pool]
      } catch (error) {
        console.error('Error when constructing the pool', error)
        return [PoolState.NOT_EXISTS, null]
      }
    })
  }, [liquidities, poolKeys, slot0s, poolTokens])
}

export function usePool(
  currencyA: Currency | undefined,
  currencyB: Currency | undefined,
  feeAmount: FeeAmount | undefined
): [PoolState, Pool | null] {
  const poolKeys: [Currency | undefined, Currency | undefined, FeeAmount | undefined][] = useMemo(
    () => [[currencyA, currencyB, feeAmount]],
    [currencyA, currencyB, feeAmount]
  )

  return usePools(poolKeys)[0]
}

const poolAddressQuery = gql`
  query SearchPooler($token0: String!, $token1: String!, $feeTier: String!) {
    pools(where: { token1: $token1, token0: $token0, feeTier: $feeTier }) {
      id
    }
  }
`

const poolDataQuery = gql`
  query PoolData($poolAddress: String!) {
    pool(id: $poolAddress) {
      feeTier
      liquidity
      sqrtRatioX96
      tickCurrent
      tickDataProvider
      token0
      token1
      chainId
      tickSpacing
      token0Price
      token1Price
    }
  }
`

// eslint-disable-next-line import/no-unused-modules
export function useDerpPool(
  currencyA: Currency | undefined,
  currencyB: Currency | undefined,
  feeAmount: FeeAmount | undefined
): [PoolState, Pool | null] {
  const poolKeys: [Currency | undefined, Currency | undefined, FeeAmount | undefined][] = useMemo(
    () => [[currencyA, currencyB, feeAmount]],
    [currencyA, currencyB, feeAmount]
  )
  return usePools(poolKeys)[0]
}

// eslint-disable-next-line import/no-unused-modules
export function useDerpPoolByChainId(
  currencyA: Currency | undefined,
  currencyB: Currency | undefined,
  feeAmount: FeeAmount | undefined,
  chainId: number | SupportedChainId
): [PoolState, Pool | null] {
  const poolKeys: [Currency | undefined, Currency | undefined, FeeAmount | undefined][] = useMemo(
    () => [[currencyA, currencyB, feeAmount]],
    [currencyA, currencyB, feeAmount]
  )
  return usePoolsByChainId(poolKeys, chainId)[0]
}

// eslint-disable-next-line import/no-unused-modules
export function usePoolsV2(
  poolKeys: [Currency | undefined, Currency | undefined, FeeAmount | undefined][]
): [PoolState, Pool | null][] {
  const { chainId } = useWeb3React()
  const poolTokens: ([Token, Token, FeeAmount] | undefined)[] = useMemo(() => {
    if (!chainId) return new Array(poolKeys.length)

    return poolKeys.map(([currencyA, currencyB, feeAmount]) => {
      if (currencyA && currencyB && feeAmount) {
        const tokenA = currencyA.wrapped
        const tokenB = currencyB.wrapped
        if (tokenA.equals(tokenB)) return undefined

        return tokenA.sortsBefore(tokenB) ? [tokenA, tokenB, feeAmount] : [tokenB, tokenA, feeAmount]
      }
      return undefined
    })
  }, [chainId, poolKeys])

  // Get pool addresses
  const { data, loading, error } = useQuery<PoolsQuery, PoolsQueryVariables>(poolAddressQuery, {
    variables: {
      token0: poolTokens[0]?.[0].address.toLocaleLowerCase() ?? '',
      token1: poolTokens[0]?.[1].address.toLocaleLowerCase() ?? '',
      feeTier: poolTokens[0]?.[2].toString() ?? '',
    },
    client: apolloClient,
  })

  // Get pool addresses of a pair
  const { data: poolAddresses } = useMemo(
    () => ({
      data:
        data?.pools && data.pools.length > 0
          ? data?.pools.map((item) => {
              return item.id
            })
          : [],
      loading,
      error,
    }),
    [data, error, loading]
  )

  const slot0s = useMultipleContractSingleData(poolAddresses, POOL_STATE_INTERFACE, 'slot0')
  const liquidities = useMultipleContractSingleData(poolAddresses, POOL_STATE_INTERFACE, 'liquidity')

  return useMemo(() => {
    return poolKeys.map((_key, index) => {
      const tokens = poolTokens[index]
      if (!tokens) return [PoolState.INVALID, null]
      const [token0, token1, fee] = tokens

      if (!slot0s[index]) return [PoolState.INVALID, null]
      const { result: slot0, loading: slot0Loading, valid: slot0Valid } = slot0s[index]

      if (!liquidities[index]) return [PoolState.INVALID, null]
      const { result: liquidity, loading: liquidityLoading, valid: liquidityValid } = liquidities[index]

      if (!tokens || !slot0Valid || !liquidityValid) return [PoolState.INVALID, null]
      if (slot0Loading || liquidityLoading) return [PoolState.LOADING, null]
      if (!slot0 || !liquidity) return [PoolState.NOT_EXISTS, null]
      if (!slot0.sqrtPriceX96 || slot0.sqrtPriceX96.eq(0)) return [PoolState.NOT_EXISTS, null]

      try {
        const pool = PoolCache.getPool(token0, token1, fee, slot0.sqrtPriceX96, liquidity[0], slot0.tick)
        return [PoolState.EXISTS, pool]
      } catch (error) {
        console.error('Error when constructing the pool', error)
        return [PoolState.NOT_EXISTS, null]
      }
    })
  }, [liquidities, poolKeys, slot0s, poolTokens])
}

type PoolsQuery = {
  pools: {
    id: string | undefined
  }[]
}

type PoolsQueryVariables = {
  token0: string
  token1: string
  feeTier: string
}
