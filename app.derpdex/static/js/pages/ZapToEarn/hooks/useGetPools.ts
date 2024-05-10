/* eslint-disable import/no-unused-modules */
import { useWeb3React } from '@web3-react/core'
import { GENESIS_API_URL, SupportedChainId } from 'constants/chains'
import { useEffect, useMemo, useState } from 'react'

import { SUPPORTED_CHAIN_FOR_ZAP_TO_EARN } from '../constants/general'

interface IToken {
  address: string
  symbol: string
}
export interface IPool {
  apr: number
  feeTier: string
  feeUSD: number
  poolAddress: string
  startTime: string
  token0: IToken
  token1: IToken
  totalRewardsPool: string
  tvlUSD: string
  volume: number
  pendingRewardsUSD: number
  endTime: string
  pricePerDERP: string
}

export const useGetPools = () => {
  const { chainId } = useWeb3React()
  const [isLoadingFetch, setIsLoadingFetch] = useState(false)
  const [loadedPools, setLoadedPools] = useState<IPool[] | undefined>([])
  const [endedPoolAddresses, setEndedPoolAddresses] = useState<string[]>([])
  // The account on useWeb3 is asynchronously loaded. Need to resolve first if page refresh

  const getURLV2 = useMemo(() => {
    // Timestamp to determine switching to genesis pools extended
    const currentTimestamp = Date.now() / 1000
    if (currentTimestamp < 1696867200) {
      return (
        GENESIS_API_URL +
        '/info?' +
        new URLSearchParams({
          userAddress: '0x0000000000000000000000000000000000000000',
          chainId: chainId?.toString() || SupportedChainId.ZKSYNC_MAINNET.toString(),
        })
      )
    } else if (currentTimestamp < 1700568000) {
      // } else if (currentTimestamp < 1700004800) { For skipping time wait testing for DERP Pools
      return (
        GENESIS_API_URL +
        '/extended/info?' +
        new URLSearchParams({
          userAddress: '0x0000000000000000000000000000000000000000',
          chainId: chainId?.toString() || SupportedChainId.ZKSYNC_MAINNET.toString(),
        })
      )
    } else {
      return (
        GENESIS_API_URL +
        '/derppool/info?' +
        new URLSearchParams({
          userAddress: '0x0000000000000000000000000000000000000000',
          chainId: chainId?.toString() || SupportedChainId.ZKSYNC_MAINNET.toString(),
        })
      )
    }
  }, [chainId])

  const getDerpFarmingURL = useMemo(() => {
    // Timestamp to determine switching to genesis pools extended
    return (
      GENESIS_API_URL +
      '/info?' +
      new URLSearchParams({
        userAddress: '0x0000000000000000000000000000000000000000',
        chainId: chainId?.toString() || SupportedChainId.ZKSYNC_MAINNET.toString(),
      })
    )
  }, [chainId])

  const onLoadPools = async () => {
    setIsLoadingFetch(true)
    setEndedPoolAddresses([])
    try {
      const currentTimestamp = Date.now() / 1000
      const results = await fetch(getURLV2, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      })

      const info = await results.json()

      if (info) {
        const {
          supportedPoolsList,
          result,
          pricePerDERP,
          endTime,
        }: { supportedPoolsList: IPool[]; result: any; pricePerDERP: string; endTime: string } = info

        const poolsInfo: IPool[] = []

        if (currentTimestamp < Number(endTime)) {
          for await (const _pool of supportedPoolsList) {
            const poolAPR = (((Number(_pool.feeTier) / 10000 / 100) * _pool.volume) / Number(_pool.tvlUSD)) * 365 * 100
            poolsInfo.push({
              poolAddress: _pool.poolAddress,
              token0: {
                address: _pool.token0.address,
                symbol: _pool.token0.symbol,
              },
              token1: {
                address: _pool.token1.address,
                symbol: _pool.token1.symbol,
              },
              feeTier: _pool.feeTier,
              apr:
                poolAPR +
                ((parseFloat(_pool.totalRewardsPool) * parseFloat(pricePerDERP)) / parseFloat(_pool.tvlUSD) / 69) *
                  365 *
                  100,
              tvlUSD: _pool.tvlUSD,
              pendingRewardsUSD: parseFloat(_pool.totalRewardsPool) * parseFloat(pricePerDERP),
              startTime: _pool.startTime,
              totalRewardsPool: _pool.totalRewardsPool,
              volume: _pool.volume,
              endTime,
              pricePerDERP,
              feeUSD: _pool.feeUSD,
            })
          }
          setLoadedPools(poolsInfo)
          setIsLoadingFetch(false)
        } else {
          const _endedPoolAddresses: string[] = []
          supportedPoolsList.forEach((_p) => {
            _endedPoolAddresses.push(_p.poolAddress.toLowerCase())
          })
          setEndedPoolAddresses(_endedPoolAddresses)
        }
      }
    } catch (error) {
      console.log(error)
      setIsLoadingFetch(false)
    }
  }

  useEffect(() => {
    if (chainId && SUPPORTED_CHAIN_FOR_ZAP_TO_EARN.includes(chainId)) {
      onLoadPools()
    }
  }, [chainId, getURLV2])

  return {
    isLoadingFetch,
    setIsLoadingFetch,
    loadedPools,
    endedPoolAddresses,
  }
}
