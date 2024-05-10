/* eslint-disable import/no-unused-modules */
import { Position as PositionSDK } from '@derpdex/sdk'
import { CurrencyAmount, Token } from '@uniswap/sdk-core'
import { useWeb3React } from '@web3-react/core'
import { SupportedChainId } from 'constants/chains'
import { RPC_PROVIDERS } from 'constants/providers'
import { BigNumber, Contract } from 'ethers'
import { useCurrencyByChainId } from 'hooks/Tokens'
import { useDerpPoolByChainId } from 'hooks/usePools'
import useStablecoinPriceV2 from 'hooks/useStablecoinPriceV2'
import { useV3PositionFromTokenId, useV3PositionsFromTokenIdsByChainId } from 'hooks/useV3Positions'
import { atom, useAtom } from 'jotai'
import { useAtomValue } from 'jotai/utils'
import { useEffect, useMemo, useState } from 'react'

import DerpDEXStakingABI from '../abis/derpdexstaking.abi.json'
import { DERPDEX_STAKING_ADDRESSES_BY_CHAINID } from '../constants'
import { globalStakedPositionsAtom } from './useDerivedStakedPositions'

interface getPositionvalue {
  amount0: string
  amount1: string
  liquidity: string
}

const initialValue: getPositionvalue = {
  amount0: '0',
  amount1: '0',
  liquidity: '0',
}
const useGetPositionValueAfterStaked = ({ positionId, chainId }: { positionId: string; chainId: SupportedChainId }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [afterStakedResults, setAfterStakedResults] = useState<getPositionvalue>(initialValue)
  const onPositionValue = async () => {
    try {
      setIsLoading(true)
      if (!RPC_PROVIDERS[chainId]) throw 'RpcProvider not found'

      const contract = new Contract(
        DERPDEX_STAKING_ADDRESSES_BY_CHAINID[chainId],
        DerpDEXStakingABI,
        RPC_PROVIDERS[chainId]
      )
      const results = (await contract.getPositionValue(positionId)) as BigNumber[]
      setAfterStakedResults({
        amount0: results[0].toString(),
        amount1: results[1].toString(),
        liquidity: results[2].toString(),
      })
    } catch (error) {
      console.log('[Err onPositionValue]', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    onPositionValue()
  }, [positionId, chainId])
  return {
    afterStakedResults,
  }
}
// * positionInfo is from subgraph
export const usePositionLpToFiatValue = (poolAddress: string, poolId: string, chainId: number | SupportedChainId) => {
  const { afterStakedResults } = useGetPositionValueAfterStaked({
    chainId,
    positionId: poolId,
  })

  const parsedTokenId = BigNumber.from(poolId)
  const { loading, positions: positionDetails } = useV3PositionsFromTokenIdsByChainId(chainId, poolId)

  const {
    token0: token0Address,
    token1: token1Address,
    fee: feeAmount,
    liquidity,
    tickLower,
    tickUpper,
    tokenId,
  } = positionDetails || {}

  const token0 = useCurrencyByChainId(token0Address, chainId)
  const token1 = useCurrencyByChainId(token1Address, chainId)

  const [poolState, pool] = useDerpPoolByChainId(token0 ?? undefined, token1 ?? undefined, feeAmount, chainId)

  // const position = useMemo(() => {
  //   if (pool && liquidity && typeof tickLower === 'number' && typeof tickUpper === 'number') {
  //     return new Position({ pool, liquidity: liquidity.toString(), tickLower, tickUpper })
  //   }
  //   return undefined
  // }, [liquidity, pool, tickLower, tickUpper])

  const position = useMemo(() => {
    if (pool && afterStakedResults.liquidity && typeof tickLower === 'number' && typeof tickUpper === 'number') {
      return new PositionSDK({ pool, liquidity: afterStakedResults.liquidity, tickLower, tickUpper })
    }
    return undefined
  }, [afterStakedResults.liquidity, pool, tickLower, tickUpper])

  const price0 = useStablecoinPriceV2(token0 ?? undefined)
  const price1 = useStablecoinPriceV2(token1 ?? undefined)

  const fiatValueOfLiquidity: CurrencyAmount<Token> | null = useMemo(() => {
    if (!price0 || !price1 || !position) return null
    const amount0 = price0.quote(position.amount0)
    const amount1 = price1.quote(position.amount1)
    return amount0.add(amount1)
  }, [price0, price1, position])

  return {
    [poolAddress]: fiatValueOfLiquidity ? parseFloat(fiatValueOfLiquidity.toExact()) : 0,
  }
}

interface STAKED_POOLS {
  [address: string]: {
    [poolId: string]: number
  }
}

interface STAKED_POOL_TVL {
  [address: string]: number
}

export const stakedPools = atom<STAKED_POOLS>({})

type StakedTVL = {
  stakingTVL: STAKED_POOL_TVL
  isLoaded: boolean
}
export const stakedTVL = atom<StakedTVL>({ stakingTVL: {}, isLoaded: false })

export const ComponentHooks = ({
  poolAddress,
  poolId,
  chainId,
  incentiveId,
}: {
  poolAddress: string
  poolId: string
  chainId: number | SupportedChainId
  incentiveId: string
}) => {
  useStakedPoolsUpdater({
    poolAddress,
    poolId,
    chainId,
    incentiveId,
  })

  // * This is hooks only, nothing to be shown
  return <></>
}

export const useStakedPoolsUpdater = ({
  poolAddress,
  incentiveId,
  poolId,
  chainId,
}: {
  poolAddress: string
  incentiveId: string
  poolId: string
  chainId: number | SupportedChainId
}) => {
  const [stakedPoolsAtom, setStakedPoolsAtom] = useAtom(stakedPools)
  const [stakedTVLAtom, setStakedTVLAtom] = useAtom(stakedTVL)
  const derivedPositionsState = useAtomValue(globalStakedPositionsAtom)
  const fiatValueOfLiquidity = usePositionLpToFiatValue(poolAddress, poolId, chainId)[poolAddress]

  // console.log('fiatValueOfLiquidity', fiatValueOfLiquidity, 'poolId', poolId)

  //! 10/31/2023 Need to update (Changes that the position liquidity is in other position already)
  useEffect(() => {
    if (derivedPositionsState) {
      setStakedPoolsAtom((prev) => {
        // Create a copy of the previous state
        const updatedStakedTVL = { ...prev }

        if (
          derivedPositionsState[incentiveId] &&
          derivedPositionsState[incentiveId] &&
          derivedPositionsState[incentiveId].find((dps) => dps.id === poolId)
        ) {
          // Initialize to 0 if it doesn't existr
          if (!updatedStakedTVL[incentiveId] || !updatedStakedTVL[incentiveId][poolId]) {
            updatedStakedTVL[incentiveId] = {
              [poolId]: 0,
            }
          }

          // Accumulate the new value
          updatedStakedTVL[incentiveId] = {
            ...prev[incentiveId],
            [poolId]: fiatValueOfLiquidity,
          }
        }

        return updatedStakedTVL
      })
    }
  }, [fiatValueOfLiquidity, poolId, incentiveId, derivedPositionsState])

  useEffect(() => {
    const accumulatedData: STAKED_POOL_TVL = {}
    if (stakedPoolsAtom) {
      for (const incentiveId in stakedPoolsAtom) {
        for (const id in stakedPoolsAtom[incentiveId]) {
          if (!accumulatedData[incentiveId]) accumulatedData[incentiveId] = 0

          accumulatedData[incentiveId] += stakedPoolsAtom[incentiveId][id]
        }
      }

      setStakedTVLAtom({
        stakingTVL: accumulatedData,
        isLoaded: true,
      })
    }
  }, [stakedPoolsAtom])
}

// * positionInfo is from subgraph
export const usePositionLpToFiatValuePreStake = (
  poolAddress: string,
  poolId: string,
  chainId: number | SupportedChainId
) => {
  const parsedTokenId = BigNumber.from(poolId)
  const { loading, position: positionDetails } = useV3PositionFromTokenId(BigNumber.from(poolId))

  const {
    token0: token0Address,
    token1: token1Address,
    fee: feeAmount,
    liquidity,
    tickLower,
    tickUpper,
    tokenId,
  } = positionDetails || {}

  const token0 = useCurrencyByChainId(token0Address, chainId)
  const token1 = useCurrencyByChainId(token1Address, chainId)

  const [poolState, pool] = useDerpPoolByChainId(token0 ?? undefined, token1 ?? undefined, feeAmount, chainId)

  // const position = useMemo(() => {
  //   if (pool && liquidity && typeof tickLower === 'number' && typeof tickUpper === 'number') {
  //     return new Position({ pool, liquidity: liquidity.toString(), tickLower, tickUpper })
  //   }
  //   return undefined
  // }, [liquidity, pool, tickLower, tickUpper])

  const position = useMemo(() => {
    if (pool && liquidity && typeof tickLower === 'number' && typeof tickUpper === 'number') {
      return new PositionSDK({ pool, liquidity: liquidity.toString(), tickLower, tickUpper })
    }
    return undefined
  }, [liquidity, pool, tickLower, tickUpper])

  const price0 = useStablecoinPriceV2(token0 ?? undefined)
  const price1 = useStablecoinPriceV2(token1 ?? undefined)

  const fiatValueOfLiquidity: CurrencyAmount<Token> | null = useMemo(() => {
    if (!price0 || !price1 || !position) return null
    const amount0 = price0.quote(position.amount0)
    const amount1 = price1.quote(position.amount1)
    return amount0.add(amount1)
  }, [price0, price1, position])

  return {
    [poolAddress]: fiatValueOfLiquidity ? parseFloat(fiatValueOfLiquidity.toExact()) : 0,
  }
}

export const useStakedPoolsAdder = ({
  incentiveId,
  poolAddress,
  poolId,
}: {
  incentiveId: string
  poolAddress: string
  poolId: string
}) => {
  const { chainId } = useWeb3React()
  const fiatValueOfLiquidity = usePositionLpToFiatValuePreStake(
    poolAddress,
    poolId,
    chainId ? chainId : SupportedChainId.ZKSYNC_MAINNET
  )[poolAddress]

  const [stakedPoolsAtom, setStakedPoolsAtom] = useAtom(stakedPools)
  const [postAdder, setPostAdder] = useState<boolean>(true)
  //! 10/31/2023 Need to update (Changes that the position liquidity is in other position already)
  const addPoolId = () => {
    setStakedPoolsAtom((prev) => {
      // Create a copy of the state to avoid mutating it directly
      const nextState = { ...prev }

      // Check if the poolAddress exists in the state
      if (!nextState[incentiveId]) {
        // If not, create an empty object for the poolAddress
        nextState[incentiveId] = {}
      } else if (!nextState[incentiveId][poolId]) {
        nextState[incentiveId][poolId] = 0
      }

      // Add or update the specified poolId for the given poolAddress
      nextState[incentiveId][poolId] = fiatValueOfLiquidity // You can set an initial value if needed

      return nextState
    })
    setPostAdder(true)
  }

  return {
    addPoolId,
  }
}

export const useStakedPoolsRemover = ({ incentiveId, poolId }: { incentiveId: string; poolId: string }) => {
  const [stakedPoolsAtom, setStakedPoolsAtom] = useAtom(stakedPools)
  //! 10/31/2023 Need to update (Changes that the position liquidity is in other position already)
  const removePoolId = () => {
    setStakedPoolsAtom((prev) => {
      // Create a copy of the state to avoid mutating it directly
      const nextState = { ...prev }

      // Check if the poolAddress exists in the state
      if (nextState[incentiveId]) {
        // Use the delete operator to remove the specified poolId
        delete nextState[incentiveId][poolId]

        // If the poolAddress is now empty, you can delete it as well
        // if (Object.keys(nextState[poolAddress]).length === 0) {
        //   delete nextState[poolAddress]
        // }
      }

      return nextState
    })
  }

  return {
    removePoolId,
  }
}
