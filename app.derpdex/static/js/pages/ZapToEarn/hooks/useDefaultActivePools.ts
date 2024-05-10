import { CHAIN_SUBGRAPH_URL } from 'graphql/thegraph/apollo'
import { RawPoolInfoState } from 'pages/ZapToEarn/hooks/ZapToEarnPools.jotai'
import { useEffect, useState } from 'react'

import { SupportedChainId } from './../../../constants/chains'
import { Maybe } from './../../../graphql/thegraph/__generated__/types-and-hooks'
import { SUPPORTED_CHAIN_FOR_ZAP_TO_EARN } from './../constants/general'

// eslint-disable-next-line prettier/prettier
const ZKSYNC_MAINNET_BATCH_POOL_ADDRESS = ["0xf91dd375822b0223ed9e69f36b9926c611116546", "0x276013cc73772ece24af7de3ed4bb77bd424a9ad", '0x8e6348d07074753294d85e6f85bd0dcb1bf94532', '0xb705dfeffda25dd8b29167d64300f364cb9b760c', '0xc910495a800ae100e4adfe052cc5745e6a30d122', '0x2eeada4411da7751c407ac8a06e9152cac631c47']
// 1. USDT-WETH 2. PEPE-WETH 3. ZKDERPINA-WETH 4. USDT-USDC

// eslint-disable-next-line prettier/prettier
const ZKSYNC_TESTNET_BATCH_POOL_ADDRESS = ["0x0a9cbb56a0d3d3b49c4ac01b89ef4dfba20bee48", "0x0b27827c05a3f448b7489ba184faa03a35f47e29", "0x1dbc5f172ab40b658b6074fa804b7aa9f3003d55", "0x7f37fdc96cdb0873f37ac91b86538c0275994442"]
// 1. USDT-WETH 2. zkPEPE-WETH 3. USDC-WETH 4. USDT-USDC

// eslint-disable-next-line prettier/prettier
const BASE_TESTNET_BATCH_POOL_ADDRESS = ["0x19119ff255101e2b163b9e98d67e2b3b7d182148", "0x373f7f8a8e7102446c91d828197cc0c3897056e1", "0x0ba4ea522981605b5ea4af8bcc58fb5940f04df6", "0x7e09b82a8f5aaf55985b27cb527e09680ddc99e9"]
// 1. USDC-WETH 2. USDT-WETH 3. USDC-USDT

// eslint-disable-next-line prettier/prettier
const BASE_MAINNET_BATCH_POOL_ADDRESS = ["0x09b852108b6ed78adb2e776d901b8d54ba708080", '0xd6e59c35b11fb4b0c0855e27b29a49a8afa2b840', '0x60b3b8fdcf1c7c1bb5dae317d0ca445d4b68f1de']
// 1. WETH-USDbC

// eslint-disable-next-line prettier/prettier
const OPBNB_TESTNET_BATCH_POOL_ADDRESS = ['0x42cd1c1823edb833f67d332c18cdd477e42533a3']
// 1. BNB-USDT

// eslint-disable-next-line prettier/prettier
const OPBNB_MAINNET_BATCH_POOL_ADDRESS = ["0xaf310d32c3c2982a23ce7ec1fe152912595a4c50", '0xe70aecc0f1a90d91b8164c08c4f00e29e3cf52ea', '0xe02c58c0a5970ae3a3f883d1cf665181633f8977', '0x3c8d93138240d5f72c46e829547385e8430250c2', '0x79051e8b37ed0de0f8e66ec7d84526a519a375a8']
// 1. BNB-USDT

const constructQueryPoolsInfo = () => {
  return `
    query GetPoolPair($poolAddress: [String!]) {
      pools(where: {id_in: $poolAddress}) {
        id
        feeTier
        token0 {
          id
          symbol
          decimals
        }
        token1 {
          name
          id
          symbol
          decimals
        }
      }
    }
  `
}

type IToken = {
  id: string
  symbol: string
  decimals: number
}
export type PoolInfo = {
  id: string // address of pool from subgraph
  token0: IToken
  token1: IToken
}

const BATCH_ADDRESS_BY_CHAINID: { [key: number]: string[] } = {
  [SupportedChainId.ZKSYNC_TESTNET]: ZKSYNC_TESTNET_BATCH_POOL_ADDRESS,
  [SupportedChainId.ZKSYNC_MAINNET]: ZKSYNC_MAINNET_BATCH_POOL_ADDRESS,
  [SupportedChainId.BASE_TESTNET]: BASE_TESTNET_BATCH_POOL_ADDRESS,
  [SupportedChainId.BASE_MAINNET]: BASE_MAINNET_BATCH_POOL_ADDRESS,
  [SupportedChainId.OPBNB_TESTNET]: OPBNB_TESTNET_BATCH_POOL_ADDRESS, // TBU
  [SupportedChainId.OPBNB_MAINNET]: OPBNB_MAINNET_BATCH_POOL_ADDRESS, // TBU
}

export const useDefaultActivePools = (chainId: Maybe<SupportedChainId | number | undefined>) => {
  // Query Pools from subgraph otherwise fallback
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [pools, setPools] = useState<RawPoolInfoState[]>()

  const getPoolInfo = async () => {
    try {
      if (!chainId) throw 'chainId is required'

      setIsLoading(true)
      const response = await fetch(CHAIN_SUBGRAPH_URL[chainId], {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add any required headers, e.g., authorization token, if applicable
        },
        body: JSON.stringify({
          query: constructQueryPoolsInfo(),
          variables: {
            poolAddress: BATCH_ADDRESS_BY_CHAINID[chainId],
          },
        }),
      })

      const data = await response.json()
      if (!data) throw 'Error getting data from subgraph'
      const standardized_pools: RawPoolInfoState[] = []
      if (data && data.data.pools.length > 0) {
        //! datatype remapped
        data.data.pools.map((i: any) => {
          i.token0.decimals = Number(i.token0.decimals)
          i.token1.decimals = Number(i.token1.decimals)
        })

        data.data.pools.forEach((pool: any) => {
          standardized_pools.push({
            address: pool.id,
            token0: {
              symbol: pool.token0.symbol,
              address: pool.token0.id,
              decimals: pool.token0.decimals,
            },
            token1: {
              symbol: pool.token1.symbol,
              address: pool.token1.id,
              decimals: pool.token1.decimals,
            },
            feeTier: pool.feeTier,
          })
        })
      } else {
        throw 'Error [getPoolInfo]'
      }

      setPools(standardized_pools)

      setIsLoading(false)
    } catch (err) {
      console.log(err)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (chainId && SUPPORTED_CHAIN_FOR_ZAP_TO_EARN.includes(chainId)) {
      getPoolInfo()
    }
  }, [chainId])

  return {
    isLoading,
    pools,
  }
}
