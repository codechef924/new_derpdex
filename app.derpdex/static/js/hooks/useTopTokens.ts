/* eslint-disable import/no-unused-modules */
import { useQuery } from '@apollo/client'
import { useGetApolloClient } from 'graphql/thegraph/apollo'
import gql from 'graphql-tag'
import { useMemo } from 'react'

export const TOP_TOKENS = gql`
  query topPools {
    tokens(first: 50, orderBy: totalValueLockedUSD, orderDirection: desc, subgraphError: allow) {
      id
    }
  }
`

interface TopTokensResponse {
  tokens: {
    id: string
  }[]
}

/**
 * Fetch top addresses by volume
 */
export function useTopTokenAddresses(): {
  loading: boolean
  error: boolean
  addresses: string[] | undefined
} {
  const apolloClientHook = useGetApolloClient()
  const { loading, error, data } = useQuery<TopTokensResponse>(TOP_TOKENS, {
    client: apolloClientHook ? apolloClientHook : undefined,
  })

  const formattedData = useMemo(() => {
    if (data) {
      return data.tokens.map((t) => t.id)
    } else {
      return undefined
    }
  }, [data])

  return {
    loading,
    error: Boolean(error),
    addresses: formattedData,
  }
}
