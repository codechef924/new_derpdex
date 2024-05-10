/* eslint-disable import/no-unused-modules */
import { useWeb3React } from '@web3-react/core'
import { GENESIS_API_URL, SupportedChainId } from 'constants/chains'
import { useMemo, useState } from 'react'

import { CellType } from './PoolTable'

export const useLoadPools = (chainId: number) => {
  const [isLoadingFetch, setIsLoadingFetch] = useState(false)
  const [loadedPools, setLoadedPools] = useState<any[] | undefined>([])
  const [userPools, setUserPools] = useState<any[] | undefined>([])
  const { account, chainId: activeWalletChainId } = useWeb3React()

  // The account on useWeb3 is asynchronously loaded. Need to resolve first if page refresh
  const getURL = useMemo(() => {
    if (account)
      return (
        GENESIS_API_URL +
        '/derppool/info?' +
        new URLSearchParams({
          userAddress: account,
          chainId: chainId?.toString() || SupportedChainId.ZKSYNC_MAINNET.toString(),
        })
      )
    else
      return (
        GENESIS_API_URL +
        '/derppool/info?' +
        new URLSearchParams({
          userAddress: '0x0000000000000000000000000000000000000000',
          chainId: chainId?.toString() || SupportedChainId.ZKSYNC_MAINNET.toString(),
        })
      )
  }, [account, chainId])

  const onLoadPools = async () => {
    setIsLoadingFetch(true)
    try {
      const results = await fetch(getURL, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      })

      const info = await results.json()

      if (info) {
        const { supportedPoolsList, result, pricePerDERP, endTime } = info
        const poolsInfo: any = []
        const _userPools: any = []

        for await (const _pool of supportedPoolsList) {
          let userDeposit = 0
          const userData = result.filter((_result: any) => {
            if (_result.poolAddress.toLowerCase() == _pool.poolAddress.toLowerCase()) {
              userDeposit +=
                _result.amount0USD > 0 && _result.amount1USD > 0 ? _result.amount0USD + _result.amount1USD : 0
              return true
            } else {
              return false
            }
          })

          // add account from useWeb3 hook otherwise it will be blinking
          if (userData && userData.length > 0) {
            _userPools.push({
              token0: _pool.token0.address,
              token1: _pool.token1.address,
              feeTier: _pool.feeTier,
              ...userData[0],
              pricePerDERP,
            })
          }
          const poolAPR = (((_pool.feeTier / 10000 / 100) * _pool.volume) / _pool.tvlUSD) * 365 * 100
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
            apr:
              poolAPR +
              ((+_pool.totalRewardsPool * pricePerDERP) /
                _pool.tvlUSD /
                ((+endTime - +_pool.startTime) / (24 * 60 * 60))) *
                365 *
                100,
            tvlUSD: _pool.tvlUSD,
            userDeposit: userDeposit.toString(),
            userPendingRewards: userData && userData.length > 0 ? CellType.LOADING : 0,
            pendingRewardsUSD: _pool.totalRewardsPool * pricePerDERP,
            staked: userData.length > 0 ? true : false,
          })
          setUserPools(_userPools)
        }
        setLoadedPools(poolsInfo)
      }
    } catch (error) {
      console.log(error)
      setIsLoadingFetch(false)
    }
  }

  return {
    onLoadPools,
    isLoadingFetch,
    setIsLoadingFetch,
    loadedPools,
    userPools,
  }
}
