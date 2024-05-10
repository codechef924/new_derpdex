/* eslint-disable import/no-unused-modules */
import { useWeb3React } from '@web3-react/core'
import { SupportedChainId } from 'constants/chains'
import { CHAIN_SUBGRAPH_URL } from 'graphql/thegraph/apollo'
import { useEffect, useState } from 'react'

const GQL_ENDPOINT: { [key: number | SupportedChainId]: string } = {
  [SupportedChainId.ZKSYNC_TESTNET]: CHAIN_SUBGRAPH_URL[SupportedChainId.ZKSYNC_TESTNET],
  [SupportedChainId.ZKSYNC_MAINNET]: CHAIN_SUBGRAPH_URL[SupportedChainId.ZKSYNC_MAINNET],
  [SupportedChainId.BASE_TESTNET]: CHAIN_SUBGRAPH_URL[SupportedChainId.BASE_TESTNET],
  [SupportedChainId.BASE_MAINNET]: CHAIN_SUBGRAPH_URL[SupportedChainId.BASE_MAINNET],
}

const constructQuery = (token0?: string, token1?: string): string => {
  const whereClause: string[] = []

  if (token0) {
    whereClause.push(`token0: "${token0}"`)
  }

  if (token1) {
    whereClause.push(`token1: "${token1}"`)
  }

  if (whereClause.length === 0) {
    throw new Error('At least one token should be provided.')
  }

  const query = `
    query GetPoolAddress($token0: String${token0 ? '!' : ''}, $token1: String${token1 ? '!' : ''}) {
      pools(
        where: { ${whereClause.join(', ')} },
        orderBy: volumeUSD,
        orderDirection: desc,
        first: 1
      ) {
        id
        volumeUSD
      }
    }
  `

  return query
}

const USDC: { [key: number]: string } = {
  [SupportedChainId.ZKSYNC_MAINNET]: '0x3355df6d4c9c3035724fd0e3914de96a5a83aaf4',
  [SupportedChainId.ZKSYNC_TESTNET]: '0x3355df6d4c9c3035724fd0e3914de96a5a83aaf4',
  [SupportedChainId.BASE_MAINNET]: '0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca',
  [SupportedChainId.BASE_TESTNET]: '0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca',
}

export const useGetPoolAddress = ({
  token0,
  token1,
  chainId,
}: {
  token0?: string
  token1?: string
  chainId: number
}) => {
  const { chainId: activeChainId } = useWeb3React()
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<boolean>(false)
  const [poolAddress, setPoolAddress] = useState<string | undefined>(undefined)

  const swapTokens = () => {
    const temp = token0
    token0 = token1
    token1 = temp
  }

  const getPoolAddress = async (token0?: string, token1?: string) => {
    if (!chainId) throw 'chainId is required'
    setError(false)
    // if(token0 && InitialPoolForPrimaryToken[token0])
    const query = constructQuery(token0, token1)

    const variables: {
      token0: string
      token1: string
    } = {
      token0: '',
      token1: '',
    }

    if (token0) {
      variables.token0 = token0
    }

    if (token1) {
      variables.token1 = token1
    }
    try {
      let CHAIN_ID = SupportedChainId.ZKSYNC_MAINNET
      if (chainId === SupportedChainId.BASE_MAINNET) {
        CHAIN_ID = SupportedChainId.BASE_MAINNET
      }

      const response = await fetch(GQL_ENDPOINT[CHAIN_ID], {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add any required headers, e.g., authorization token, if applicable
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      })

      const data = await response.json()
      if (!data.data.pools[0]) {
        return null
      }
      return data.data.pools[0].id
    } catch (error) {
      // Handle error if fetch or parsing fails
      console.error('Error fetching data:', error)
      setError(true)
      return null
    }
  }

  // Memoize the function to be called when token0 or token1 changes
  const getPoolData = async () => {
    try {
      if (!chainId) throw 'chainId is required'
      let poolAddressResult = null
      setLoading(true)

      const shouldInvert = Boolean([SupportedChainId.BASE_MAINNET, SupportedChainId.BASE_TESTNET].includes(chainId))

      if (token0 && !token1) {
        // When only token0 is provided
        if (shouldInvert) {
          poolAddressResult =
            token0 === USDC[chainId] ? await getPoolAddress(undefined, token0) : await getPoolAddress(token0)
        } else {
          poolAddressResult =
            token0 === USDC[chainId] ? await getPoolAddress(token0) : await getPoolAddress(undefined, token0)
        }
      } else if (token0 && token1) {
        // When both token0 and token1 are provided
        poolAddressResult = await getPoolAddress(token0, token1)

        // If the pool is not found, swap the tokens and try again
        if (!poolAddressResult) {
          swapTokens() // Swap token0 and token1
          poolAddressResult = await getPoolAddress(token0, token1)
        }
      }

      if (poolAddressResult) {
        setPoolAddress(poolAddressResult)
      } else {
        // Reset the pool address if the data is not available
        setPoolAddress('')
        throw 'Pool address not available'
      }

      setLoading(false)
      setError(false)
    } catch (error) {
      console.warn('Error getting pool data:', error)
      setError(true)
      setLoading(false)
    }
  }

  // Use useEffect to call the memoized function when token0 or token1 changes
  useEffect(() => {
    if (token0 || token1) {
      getPoolData()
    } else {
      // Reset the pool address if both tokens are falsy
      setPoolAddress('')
    }
  }, [token0, token1, chainId])

  return {
    loading,
    error,
    poolAddress,
  }
}
