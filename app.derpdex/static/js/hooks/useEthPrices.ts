/* eslint-disable import/no-unused-modules */
import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { useWeb3React } from '@web3-react/core'
import { apolloClient, useGetApolloClient } from 'graphql/thegraph/apollo'
import gql from 'graphql-tag'
import { useBlocksFromTimestamps } from 'hooks/useBlocksFromTimestamps'
import { useEffect, useMemo, useState } from 'react'
import { useDeltaTimestamps } from 'utils/queries'

export interface EthPrices {
  current: number
  oneDay: number
  twoDay: number
  week: number
}

export const ETH_PRICES = gql`
  query prices($block24: Int!, $block48: Int!, $blockWeek: Int!) {
    current: bundles(first: 1, subgraphError: allow) {
      ethPriceUSD
    }
    oneDay: bundles(first: 1, block: { number: $block24 }, subgraphError: allow) {
      ethPriceUSD
    }
    twoDay: bundles(first: 1, block: { number: $block48 }, subgraphError: allow) {
      ethPriceUSD
    }
    oneWeek: bundles(first: 1, block: { number: $blockWeek }, subgraphError: allow) {
      ethPriceUSD
    }
  }
`

interface PricesResponse {
  current: {
    ethPriceUSD: string
  }[]
  oneDay: {
    ethPriceUSD: string
  }[]
  twoDay: {
    ethPriceUSD: string
  }[]
  oneWeek: {
    ethPriceUSD: string
  }[]
}

async function fetchEthPrices(
  blocks: [number, number, number],
  client: ApolloClient<NormalizedCacheObject> | undefined
): Promise<{ data: EthPrices | undefined; error: boolean }> {
  try {
    if (!client) throw 'apollo client is undefined'
    const { data, error } = await client.query<PricesResponse>({
      query: ETH_PRICES,
      variables: {
        block24: blocks[0],
        block48: blocks[1] ?? 1,
        blockWeek: blocks[2] ?? 1,
      },
    })

    if (error) {
      return {
        error: true,
        data: undefined,
      }
    } else if (data) {
      return {
        data: {
          current: parseFloat(data.current[0].ethPriceUSD ?? 0),
          oneDay: parseFloat(data.oneDay[0]?.ethPriceUSD ?? 0),
          twoDay: parseFloat(data.twoDay[0]?.ethPriceUSD ?? 0),
          week: parseFloat(data.oneWeek[0]?.ethPriceUSD ?? 0),
        },
        error: false,
      }
    } else {
      return {
        data: undefined,
        error: true,
      }
    }
  } catch (e) {
    console.log('[fetchEthPrices]', e)
    return {
      data: undefined,
      error: true,
    }
  }
}

/**
 * returns eth prices at current, 24h, 48h, and 1w intervals
 */
export function useEthPrices(): EthPrices | undefined {
  const { chainId } = useWeb3React()
  const [prices, setPrices] = useState<{ [network: string]: EthPrices | undefined }>()
  const [error, setError] = useState(false)

  const [t24, t48, tWeek] = useDeltaTimestamps()
  const { blocks, error: blockError } = useBlocksFromTimestamps([t24, t48, tWeek])
  // index on active network
  const indexedPrices = useMemo(() => {
    if (!chainId || !prices) return undefined
    return prices?.[chainId]
  }, [chainId, prices])

  const formattedBlocks = useMemo(() => {
    if (blocks) {
      return blocks.map((b) => parseFloat(b.number))
    }
    return undefined
  }, [blocks])

  const apolloClientHook = useGetApolloClient()
  useEffect(() => {
    async function fetch() {
      if (!chainId) throw 'chainId is required'
      const { data, error } = await fetchEthPrices(formattedBlocks as [number, number, number], apolloClientHook)
      if (error || blockError) {
        setError(true)
      } else if (data) {
        setPrices({
          [chainId ? chainId : 280]: data,
        })
      }
    }
    if (!indexedPrices && !error && formattedBlocks) {
      fetch().catch(() => {
        console.log('Error fetching ethPrices')
      })
    }
  }, [error, prices, formattedBlocks, blockError, apolloClient, indexedPrices, chainId])

  return useMemo(() => {
    if (!chainId || !prices) return undefined
    return prices?.[chainId]
  }, [chainId, prices])
}
