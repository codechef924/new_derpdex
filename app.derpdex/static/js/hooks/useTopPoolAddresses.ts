import { gql, useQuery } from '@apollo/client'
import { useWeb3React } from '@web3-react/core'
import { useGetApolloClient } from 'graphql/thegraph/apollo'
import { useMemo } from 'react'
import { POOL_HIDE } from 'utils/constants'
import { notEmpty } from 'utils/general'

// eslint-disable-next-line import/no-unused-modules
export const TOP_POOLS = gql`
  query topPools {
    pools(first: 50, orderBy: totalValueLockedUSD, orderDirection: desc, subgraphError: allow) {
      id
    }
  }
`

interface TopPoolsResponse {
  pools: {
    id: string
  }[]
}

/**
 * Fetch top addresses by volume
 */
export function useTopPoolAddresses(): {
  loading: boolean
  error: boolean
  addresses: string[] | undefined
} {
  const { chainId } = useWeb3React()

  const apolloClientHook = useGetApolloClient()

  const { loading, error, data } = useQuery<TopPoolsResponse>(TOP_POOLS, {
    client: apolloClientHook ? apolloClientHook : undefined,
    fetchPolicy: 'cache-first',
  })

  const formattedData = useMemo(() => {
    if (data) {
      return data.pools
        .map((p) => {
          if (POOL_HIDE[324].includes(p.id.toLocaleLowerCase())) {
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
