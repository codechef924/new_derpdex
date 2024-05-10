/* eslint-disable import/no-unused-modules */
import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { useWeb3React } from '@web3-react/core'
import { SupportedChainId } from 'constants/chains'
import { BLOCK_CLIENT } from 'graphql/thegraph/apollo'
import gql from 'graphql-tag'
import { useEffect, useMemo, useState } from 'react'
import { splitQuery } from 'utils/queries'

export const START_BLOCKS: { [key: number]: number } = {
  [SupportedChainId.ZKSYNC_TESTNET]: 5051351,
  [SupportedChainId.BASE_TESTNET]: 8467275,
  [SupportedChainId.ZKSYNC_MAINNET]: 7790768,
  [SupportedChainId.BASE_MAINNET]: 2753388,
  [SupportedChainId.OPBNB_TESTNET]: 8250170,
  [SupportedChainId.OPBNB_MAINNET]: 3530232, // TBU
}

export const GET_BLOCKS = (timestamps: string[]) => {
  let queryString = 'query blocks {'
  queryString += timestamps.map((timestamp) => {
    return `t${timestamp}:blocks(first: 1, orderBy: timestamp, orderDirection: desc, where: { timestamp_gt: ${timestamp}, timestamp_lt: ${
      timestamp + 600
    } }) {
        number
      }`
  })
  queryString += '}'
  return gql(queryString)
}

/**
 * for a given array of timestamps, returns block entities
 * @param timestamps
 */
export function useBlocksFromTimestamps(
  timestamps: number[],
  blockClientOverride?: ApolloClient<NormalizedCacheObject>
): {
  blocks:
    | {
        timestamp: string
        number: any
      }[]
    | undefined
  error: boolean
} {
  const { chainId } = useWeb3React()
  const [blocks, setBlocks] = useState<any>()
  const [error, setError] = useState(false)
  const envChainId =
    process.env.REACT_APP_IS_TESTSITE === 'true' ? SupportedChainId.ZKSYNC_TESTNET : SupportedChainId.ZKSYNC_MAINNET

  // derive blocks based on active network
  const networkBlocks = useMemo(() => {
    if (chainId && blocks) {
      return blocks[chainId]
    } else {
      return undefined
    }
  }, [chainId, blocks])

  useEffect(() => {
    async function fetchData() {
      if (!chainId) throw 'chainId is required'

      const results = await splitQuery(GET_BLOCKS, BLOCK_CLIENT[chainId], [], timestamps)
      if (results) {
        setBlocks({ ...(blocks ?? {}), [chainId]: results })
      } else {
        setError(true)
      }
    }
    if (!networkBlocks && !error) {
      fetchData().catch((err) => {
        console.log('[useBlocksFromTimestamps]', err)
      })
    }
  }, [chainId, networkBlocks])

  const blocksFormatted = useMemo(() => {
    if (blocks?.[chainId ? chainId : envChainId]) {
      const networkBlocks = blocks?.[chainId ? chainId : envChainId]
      const formatted = []
      for (const t in networkBlocks) {
        if (networkBlocks[t].length > 0) {
          const number = networkBlocks[t][0]['number']
          const deploymentBlock = START_BLOCKS[chainId ? chainId : envChainId]
          const adjustedNumber = number > deploymentBlock ? number : deploymentBlock

          formatted.push({
            timestamp: t.split('t')[1],
            number: adjustedNumber,
          })
        }
      }
      return formatted
    }
    return undefined
  }, [chainId, blocks])

  return {
    blocks: blocksFormatted,
    error,
  }
}

export function useBlocksFromTimestampsByChainId(
  timestamps: number[],
  chainId: number | SupportedChainId
): {
  blocks:
    | {
        timestamp: string
        number: any
      }[]
    | undefined
  error: boolean
} {
  const { chainId: connectedChainId } = useWeb3React()
  const [blocks, setBlocks] = useState<any>()
  const [error, setError] = useState(false)
  const envChainId =
    process.env.REACT_APP_IS_TESTSITE === 'true' ? SupportedChainId.ZKSYNC_TESTNET : SupportedChainId.ZKSYNC_MAINNET

  // derive blocks based on active network
  const networkBlocks = useMemo(() => {
    if (chainId && blocks) {
      return blocks[chainId]
    } else {
      return undefined
    }
  }, [chainId, blocks])

  useEffect(() => {
    async function fetchData() {
      if (!chainId) throw 'chainId is required'

      const results = await splitQuery(GET_BLOCKS, BLOCK_CLIENT[chainId], [], timestamps)
      if (results) {
        setBlocks({ ...(blocks ?? {}), [chainId]: results })
      } else {
        setError(true)
      }
    }
    if (!networkBlocks && !error) {
      fetchData().catch((err) => {
        console.log('[useBlocksFromTimestamps]', err)
      })
    }
  }, [chainId, networkBlocks])

  const blocksFormatted = useMemo(() => {
    if (blocks?.[chainId ? chainId : envChainId]) {
      const networkBlocks = blocks?.[chainId ? chainId : envChainId]
      const formatted = []
      for (const t in networkBlocks) {
        if (networkBlocks[t].length > 0) {
          const number = networkBlocks[t][0]['number']
          const deploymentBlock = START_BLOCKS[chainId ? chainId : envChainId]
          const adjustedNumber = number > deploymentBlock ? number : deploymentBlock

          formatted.push({
            timestamp: t.split('t')[1],
            number: adjustedNumber,
          })
        }
      }
      return formatted
    }
    return undefined
  }, [chainId, blocks])

  return {
    blocks: blocksFormatted,
    error,
  }
}

/**
 * @notice Fetches block objects for an array of timestamps.
 * @dev blocks are returned in chronological order (ASC) regardless of input.
 * @dev blocks are returned at string representations of Int
 * @dev timestamps are returns as they were provided; not the block time.
 * @param {Array} timestamps
 */
export async function getBlocksFromTimestamps(
  timestamps: number[],
  blockClient: ApolloClient<NormalizedCacheObject>,
  skipCount = 500
) {
  if (timestamps?.length === 0) {
    return []
  }
  const fetchedData: any = await splitQuery(GET_BLOCKS, blockClient, [], timestamps, skipCount)

  const blocks: any[] = []
  if (fetchedData) {
    for (const t in fetchedData) {
      if (fetchedData[t].length > 0) {
        blocks.push({
          timestamp: t.split('t')[1],
          number: fetchedData[t][0]['number'],
        })
      }
    }
  }
  return blocks
}
