import { useWeb3React } from '@web3-react/core'
import { GENESIS_API_URL, SupportedChainId } from 'constants/chains'
import { useEffect, useMemo, useState } from 'react'

const SUPPORTED_CHAIN_FOR_GENESIS = [
  SupportedChainId.ZKSYNC_MAINNET,
  SupportedChainId.ZKSYNC_TESTNET,
  SupportedChainId.BASE_MAINNET,
  SupportedChainId.BASE_TESTNET,
  SupportedChainId.OPBNB_TESTNET,
  SupportedChainId.OPBNB_MAINNET,
]

interface TokenFromApi {
  address: string
  symbol: string
}
interface GenesisPoolFromApi {
  address: string
  apr: number
  feeTier: string
  pricePerDERP: string
  staked: boolean
  token0: TokenFromApi
  token1: TokenFromApi
  totalRewardsPool: string
  tvlUSD: string
  userDeposit: string
  userPendingRewards: number
}
export function useGenesisPools(account?: string) {
  const { chainId } = useWeb3React()
  const [loadedPools, setLoadedPools] = useState<GenesisPoolFromApi[]>([])
  // eslint-disable-next-line react-hooks/exhaustive-deps

  const shouldGetPools = useMemo(() => {
    if (chainId) {
      return SUPPORTED_CHAIN_FOR_GENESIS.includes(chainId)
    } else {
      return false
    }
  }, [chainId])

  const onExistCachedPools = useMemo(() => {
    if (localStorage.getItem('genesisPools')) {
      const jsonCache = localStorage.getItem('genesisPools')
      if (!jsonCache) return undefined

      const cachedData = JSON.parse(jsonCache)

      if (Date.now() > cachedData.expiry || cachedData !== chainId) {
        localStorage.removeItem('genesisPools')
        return undefined
      } else {
        setLoadedPools(cachedData.loadedPools)
        return cachedData.loadedPools as GenesisPoolFromApi[]
      }
    } else {
      return undefined
    }
  }, [chainId])

  // The account on useWeb3 is asynchronously loaded. Need to resolve first if page refresh
  const getURLV2 = useMemo(() => {
    const searchParam = new URLSearchParams({
      userAddress: '0x0000000000000000000000000000000000000000',
      chainId: chainId?.toString() || SupportedChainId.ZKSYNC_MAINNET.toString(),
    })

    // Timestamp to determine switching to genesis pools extended 10/10/2023
    const currentTimestamp = Date.now() / 1000
    if (currentTimestamp < 1696867200) {
      return GENESIS_API_URL + '/info?' + searchParam
    } else if (currentTimestamp < 1700568000) {
      return GENESIS_API_URL + '/extended/info?' + searchParam
    } else {
      return GENESIS_API_URL + '/derppool/info?' + searchParam
    }
  }, [chainId])

  //! Revamp previous code
  const onGetPools = async () => {
    try {
      if (!chainId) throw 'Failed to get pools'

      if (!onExistCachedPools && shouldGetPools) {
        fetch(getURLV2, {
          method: 'GET',
          headers: new Headers({
            'Content-Type': 'application/json',
          }),
        }).then((response) => {
          response.json().then((info) => {
            const currentTimestamp = Date.now() / 1000
            const { supportedPoolsList, result, pricePerDERP, endTime } = info
            const poolsInfo: any = []
            const _userPools: any = []

            if (!supportedPoolsList) throw 'Err getting supportedPoolsList'

            if (currentTimestamp < Number(endTime)) {
              supportedPoolsList.forEach((_pool: any) => {
                const userData = result.filter(
                  (_result: any) => _result.poolAddress.toLowerCase() == _pool.poolAddress.toLowerCase()
                )

                if (userData.length > 0) {
                  _userPools.push({
                    token0: _pool.token0.address,
                    token1: _pool.token1.address,
                    feeTier: _pool.feeTier,
                    ...userData[0],
                    pricePerDERP,
                  })
                }

                poolsInfo.push({
                  address: _pool.poolAddress,
                  token0: {
                    address: _pool.token0.address,
                    symbol: _pool.token0.symbol,
                  },
                  token1: {
                    address: _pool.token1.address,
                    symbol: _pool.token1.symbol,
                  },
                  feeTier: _pool.feeTier,
                  apr: _pool.apr,
                  tvlUSD: _pool.tvlUSD,
                  userDeposit: userData.length > 0 ? userData[0].amount0USD + userData[0].amount1USD : '0',
                  userPendingRewards: 0,
                  staked: userData.length > 0 ? true : false,
                  totalRewardsPool: _pool.totalRewardsPool,
                  pricePerDERP,
                })

                setLoadedPools(poolsInfo)
                localStorage.setItem(
                  'genesisPools',
                  JSON.stringify({ loadedPools: poolsInfo, expiry: Date.now() + 3600, chainId })
                )
              })
            }
          })
        })
      }
    } catch (ex) {
      console.log('Error fetching genesis pools', ex)
    }
  }

  useEffect(() => {
    if (shouldGetPools) {
      onGetPools()
    }
  }, [chainId, shouldGetPools])

  return useMemo(
    () => ({
      loadedPools,
    }),
    [loadedPools]
  )
}
