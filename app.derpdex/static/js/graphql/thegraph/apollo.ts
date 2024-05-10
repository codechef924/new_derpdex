/* eslint-disable import/no-unused-modules */
import {
  ApolloClient,
  ApolloLink,
  concat,
  DefaultOptions,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client'
import { useWeb3React } from '@web3-react/core'
import { SupportedChainId } from 'constants/chains'
import { useMemo } from 'react'

import store from '../../state/index'

export const CHAIN_SUBGRAPH_URL: Record<number, string> = {
  [SupportedChainId.ZKSYNC_TESTNET]: 'https://api.thegraph.com/subgraphs/name/geckocoding/derpdex-zksynctestnet',

  [SupportedChainId.ZKSYNC_MAINNET]: 'https://api.studio.thegraph.com/query/49147/derpdex-v3-amm/v0.0.10',

  [SupportedChainId.BASE_TESTNET]: 'https://api.studio.thegraph.com/query/49147/derpdex-v3-amm-base-testnet/v0.0.5',

  [SupportedChainId.BASE_MAINNET]: 'https://api.thegraph.com/subgraphs/name/geckocoding/derpdex-amm-base',

  [SupportedChainId.OPBNB_TESTNET]:
    'https://opbnb-test.subgraph.derpdex.com/subgraphs/name/geckocoding/derpdex-opbnbtestnet',

  [SupportedChainId.OPBNB_MAINNET]:
    'https://open-platform-ap.nodereal.io/1d223794a8a841a78994ddeb7c1bb966/opbnb-mainnet-graph-query/subgraphs/name/v3-subgraph-opbnb',
}

const blockSubgraphUrl: Record<number, string> = {
  [SupportedChainId.ZKSYNC_MAINNET]: 'https://api.studio.thegraph.com/query/49147/derpdex-zksyncmainnet/0.0.1',
  [SupportedChainId.ZKSYNC_TESTNET]: 'https://api.thegraph.com/subgraphs/name/geckocoding/zksync-testnet-blocks',
  [SupportedChainId.BASE_TESTNET]: 'https://api.studio.thegraph.com/query/49147/derpdex-block-base-testnet/v0.0.2',
  [SupportedChainId.BASE_MAINNET]: 'https://api.thegraph.com/subgraphs/name/geckocoding/derpdex-block-base',
  [SupportedChainId.OPBNB_TESTNET]:
    'https://opbnb-test.subgraph.derpdex.com/subgraphs/name/geckocoding/derpdex-opbnbtestnet-block',
  [SupportedChainId.OPBNB_MAINNET]:
    'https://open-platform-ap.nodereal.io/1d223794a8a841a78994ddeb7c1bb966/opbnb-mainnet-graph-query/subgraphs/name/opbnb-block-indexer',
}

export const YIELD_BOOSTER_STAKING_SUBGRAPH_URL: Record<number, string> = {
  [SupportedChainId.GOERLI]: 'https://api.studio.thegraph.com/proxy/32917/goerli-xderp/v1',

  [SupportedChainId.MAINNET]: 'https://api.studio.thegraph.com/query/49147/derpdex-staking-ethereum/v0.0.1',

  [SupportedChainId.ZKSYNC_TESTNET]:
    'https://api.studio.thegraph.com/query/47117/yieldbooster-zksync-testnet/merged-v2',

  [SupportedChainId.ZKSYNC_MAINNET]: 'https://api.studio.thegraph.com/query/49147/derpdex-staking-zksync/v0.0.4',

  [SupportedChainId.BASE_TESTNET]: 'https://api.studio.thegraph.com/query/55824/renew/v7',

  [SupportedChainId.BASE_MAINNET]: 'https://api.studio.thegraph.com/query/49147/derpdex-staking-base/v0.0.3',

  [SupportedChainId.OPBNB_TESTNET]:
    'https://opbnb-test.subgraph.derpdex.com/subgraphs/name/geckocoding/derpdex-staking-opbnb',

  [SupportedChainId.OPBNB_MAINNET]:
    'https://open-platform-ap.nodereal.io/1d223794a8a841a78994ddeb7c1bb966/opbnb-mainnet-graph-query/subgraphs/name/opbnb-derpdex-staking',
}
const httpLink = new HttpLink({ uri: CHAIN_SUBGRAPH_URL[SupportedChainId.ZKSYNC_MAINNET] })
const blocKhttpLink = new HttpLink({ uri: CHAIN_SUBGRAPH_URL[SupportedChainId.ZKSYNC_MAINNET] })
const yieldBoosterHttpLink = new HttpLink({ uri: YIELD_BOOSTER_STAKING_SUBGRAPH_URL[SupportedChainId.ZKSYNC_MAINNET] })

// This middleware will allow us to dynamically update the uri for the requests based off chainId
// For more information: https://www.apollographql.com/docs/react/networking/advanced-http-networking/
const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  const chainId = store.getState().application.chainId

  operation.setContext(() => ({
    uri:
      chainId && CHAIN_SUBGRAPH_URL[chainId]
        ? CHAIN_SUBGRAPH_URL[chainId]
        : CHAIN_SUBGRAPH_URL[SupportedChainId.ZKSYNC_MAINNET],
  }))

  return forward(operation)
})

const authYieldBoosterMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  const chainId = store.getState().application.chainId

  operation.setContext(() => ({
    uri:
      chainId && YIELD_BOOSTER_STAKING_SUBGRAPH_URL[chainId]
        ? YIELD_BOOSTER_STAKING_SUBGRAPH_URL[chainId]
        : YIELD_BOOSTER_STAKING_SUBGRAPH_URL[SupportedChainId.ZKSYNC_TESTNET],
  }))

  return forward(operation)
})

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Token: {
        // Singleton types that have no identifying field can use an empty
        // array for their keyFields.
        keyFields: false,
      },
      Pool: {
        // Singleton types that have no identifying field can use an empty
        // array for their keyFields.
        keyFields: false,
      },
    },
  }),
  link: concat(authMiddleware, httpLink),
})

//! IT IS BETTER TO USE THIS FOR NOW!
export const useGetApolloClient = () => {
  const { chainId } = useWeb3React()

  const authMiddlewareResolved = useMemo(() => {
    if (chainId) {
      return new ApolloLink((operation, forward) => {
        operation.setContext(() => ({
          uri: CHAIN_SUBGRAPH_URL[chainId],
        }))

        return forward(operation)
      })
    } else {
      return authMiddleware
    }
  }, [chainId])
  const client = useMemo(() => {
    if (chainId) {
      return new ApolloClient({
        cache: new InMemoryCache(),
        link: concat(authMiddlewareResolved, httpLink),
      })
    } else {
      return undefined
    }
  }, [chainId])

  return client
}

// * Hooks for DERPDEX STAKING ONLY
export const useGetYieldBoostergApolloClient = () => {
  const { chainId, account } = useWeb3React()

  const authMiddlewareResolved = useMemo(() => {
    if (chainId) {
      return new ApolloLink((operation, forward) => {
        operation.setContext(() => ({
          uri: YIELD_BOOSTER_STAKING_SUBGRAPH_URL[chainId],
        }))

        return forward(operation)
      })
    } else {
      return authYieldBoosterMiddleware
    }
  }, [chainId])
  const client = useMemo(() => {
    if (chainId && YIELD_BOOSTER_STAKING_SUBGRAPH_URL[chainId]) {
      return new ApolloClient({
        cache: new InMemoryCache(),
        link: concat(authMiddlewareResolved, yieldBoosterHttpLink),
      })
    } else {
      return undefined
    }
  }, [chainId, authMiddlewareResolved])

  return client
}

// * Hooks for DERPDEX STAKING ONLY
export const useLazyGetYieldBoostergApolloClient = (chainId: SupportedChainId | number) => {
  const authMiddlewareResolved = useMemo(() => {
    if (chainId) {
      return new ApolloLink((operation, forward) => {
        operation.setContext(() => ({
          uri: YIELD_BOOSTER_STAKING_SUBGRAPH_URL[chainId],
        }))

        return forward(operation)
      })
    } else {
      return authYieldBoosterMiddleware
    }
  }, [chainId])
  const client = useMemo(() => {
    if (chainId && YIELD_BOOSTER_STAKING_SUBGRAPH_URL[chainId]) {
      return new ApolloClient({
        cache: new InMemoryCache(),
        link: concat(authMiddlewareResolved, yieldBoosterHttpLink),
      })
    } else {
      return undefined
    }
  }, [chainId, authMiddlewareResolved])

  return client
}

//! THIS IS USEFUL FOR NOT DEPENDING ON WALLET CHAIN ID
//! SEE USE CASE IN TopTokens page
export const useLazyGetApolloClient = (chainId: SupportedChainId | number) => {
  const authMiddlewareResolved = useMemo(() => {
    if (chainId) {
      return new ApolloLink((operation, forward) => {
        operation.setContext(() => ({
          uri: CHAIN_SUBGRAPH_URL[chainId],
        }))

        return forward(operation)
      })
    } else {
      return authMiddleware
    }
  }, [chainId])
  const client = useMemo(() => {
    if (chainId) {
      return new ApolloClient({
        cache: new InMemoryCache(),
        link: concat(authMiddlewareResolved, httpLink),
      })
    } else {
      return undefined
    }
  }, [authMiddlewareResolved, chainId])

  return client
}

//! THIS IS USEFUL FOR NOT DEPENDING ON WALLET CHAIN ID
//! SEE USE CASE IN TopTokens page
export const useLazyGetApolloBlockClient = (chainId: SupportedChainId | number) => {
  const authMiddlewareResolved = useMemo(() => {
    if (chainId) {
      return new ApolloLink((operation, forward) => {
        operation.setContext(() => ({
          uri: BLOCK_CLIENT[chainId],
        }))

        return forward(operation)
      })
    } else {
      return authMiddleware
    }
  }, [chainId])
  const client = useMemo(() => {
    if (chainId) {
      return new ApolloClient({
        cache: new InMemoryCache(),
        link: concat(authMiddlewareResolved, httpLink),
      })
    } else {
      return undefined
    }
  }, [authMiddlewareResolved, chainId])

  return client
}

const apolloConfig: {
  queryDeduplication: boolean | undefined
  defaultOptions: DefaultOptions
} = {
  queryDeduplication: true,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  },
}

export const zkSyncMainnetBlockClient = new ApolloClient({
  uri: blockSubgraphUrl[SupportedChainId.ZKSYNC_MAINNET],
  cache: new InMemoryCache(),
  ...apolloConfig,
})

export const zkSyncTestnetBlockClient = new ApolloClient({
  uri: blockSubgraphUrl[SupportedChainId.ZKSYNC_TESTNET],
  cache: new InMemoryCache(),
  ...apolloConfig,
})

export const baseTestnetBlockClient = new ApolloClient({
  uri: blockSubgraphUrl[SupportedChainId.BASE_TESTNET],
  cache: new InMemoryCache(),
  ...apolloConfig,
})

export const baseBlockClient = new ApolloClient({
  uri: blockSubgraphUrl[SupportedChainId.BASE_MAINNET],
  cache: new InMemoryCache(),
  ...apolloConfig,
})

export const opBnbTestnetBlockClient = new ApolloClient({
  uri: blockSubgraphUrl[SupportedChainId.OPBNB_TESTNET],
  cache: new InMemoryCache(),
  ...apolloConfig,
})

export const opBnbBlockClient = new ApolloClient({
  uri: blockSubgraphUrl[SupportedChainId.OPBNB_MAINNET],
  cache: new InMemoryCache(),
  ...apolloConfig,
})

export const BLOCK_CLIENT: { [key: SupportedChainId | number]: ApolloClient<NormalizedCacheObject> } = {
  [SupportedChainId.ZKSYNC_MAINNET]: zkSyncMainnetBlockClient,
  [SupportedChainId.ZKSYNC_TESTNET]: zkSyncTestnetBlockClient,
  [SupportedChainId.BASE_TESTNET]: baseTestnetBlockClient,
  [SupportedChainId.BASE_MAINNET]: baseBlockClient,
  [SupportedChainId.OPBNB_TESTNET]: opBnbTestnetBlockClient,
  [SupportedChainId.OPBNB_MAINNET]: opBnbBlockClient,
}
