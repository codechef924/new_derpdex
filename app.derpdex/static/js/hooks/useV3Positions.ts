import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { Currency } from '@uniswap/sdk-core'
import { NONFUNGIBLE_POSITION_MANAGER_ADDRESSES } from 'constants/addresses'
import { CallStateResult, useSingleCallResult, useSingleContractMultipleData } from 'lib/hooks/multicall'
import { useEffect, useMemo, useState } from 'react'
import { PositionDetails } from 'types/position'
import { UniswapV3Pool__factory } from 'types/v3'

import { SupportedChainId } from './../constants/chains'
import { RPC_PROVIDERS } from './../constants/providers'
import { NonfungiblePositionManager__factory } from './../types/v3/factories/NonfungiblePositionManager__factory'
import { useV3NFTPositionManagerContract, useV3NFTPositionManagerContractByChainId } from './useContract'

interface UseV3PositionsResults {
  loading: boolean
  positions: PositionDetails[] | undefined
}

function useV3PositionsFromTokenIds(tokenIds: BigNumber[] | undefined): UseV3PositionsResults {
  const positionManager = useV3NFTPositionManagerContract()
  const inputs = useMemo(() => (tokenIds ? tokenIds.map((tokenId) => [BigNumber.from(tokenId)]) : []), [tokenIds])
  const results = useSingleContractMultipleData(positionManager, 'positions', inputs)

  const loading = useMemo(() => results.some(({ loading }) => loading), [results])
  const error = useMemo(() => results.some(({ error }) => error), [results])

  const positions = useMemo(() => {
    if (!loading && !error && tokenIds) {
      return results.map((call, i) => {
        const tokenId = tokenIds[i]
        const result = call.result as CallStateResult
        return {
          tokenId,
          fee: result.fee,
          feeGrowthInside0LastX128: result.feeGrowthInside0LastX128,
          feeGrowthInside1LastX128: result.feeGrowthInside1LastX128,
          liquidity: result.liquidity,
          nonce: result.nonce,
          operator: result.operator,
          tickLower: result.tickLower,
          tickUpper: result.tickUpper,
          token0: result.token0,
          token1: result.token1,
          tokensOwed0: result.tokensOwed0,
          tokensOwed1: result.tokensOwed1,
        }
      })
    }
    return undefined
  }, [loading, error, results, tokenIds])

  return {
    loading,
    positions: positions?.map((position, i) => ({ ...position, tokenId: inputs[i][0] })),
  }
}

type NFPManagerState = {
  isLoading: boolean
  isSuccess: boolean
  error: string | null
}

const initialNFPManagerState: NFPManagerState = {
  isLoading: false,
  isSuccess: false,
  error: null,
}
function useManualContractCallForNonFungiblePositionManager(chainId: SupportedChainId, tokenId: string) {
  const [result, setResult] = useState<any>()
  const [NFPManagerState, setNFPManagerState] = useState<NFPManagerState>(initialNFPManagerState)

  const onGetPosition = async () => {
    try {
      setNFPManagerState({ ...initialNFPManagerState, isLoading: true })
      const contract = new Contract(
        NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId],
        NonfungiblePositionManager__factory.abi,
        RPC_PROVIDERS[chainId]
      )

      const results = await contract.positions(tokenId)
      setResult(results)
      setNFPManagerState((p) => ({ ...p, isSuccess: true }))
    } catch (e) {
      console.log('[Err onGetPosition]', e)
      setNFPManagerState((p) => ({ ...p, error: e.message || 'An error occurred' }))
    } finally {
      setNFPManagerState((p) => ({ ...p, isLoading: false }))
    }
  }

  useEffect(() => {
    onGetPosition()
  }, [chainId, tokenId])

  return {
    result,
    NFPManagerState,
  }
}

type UniV3PoolState = {
  isLoading: boolean
  isSuccess: boolean
  error: string | null
}

const initialUniV3Pool: UniV3PoolState = {
  isLoading: false,
  isSuccess: false,
  error: null,
}
export function useManualContractCallForUniV3Pool(
  read: string,
  chainId: SupportedChainId,
  poolAddress: string | undefined
) {
  const [result, setResult] = useState<any>()
  const [uniV3PoolState, setUniV3PoolState] = useState<NFPManagerState>(initialUniV3Pool)

  const onGetPool = async () => {
    try {
      setUniV3PoolState({ ...initialUniV3Pool, isLoading: true })
      if (!poolAddress) throw 'No pool address provided'
      const contract = new Contract(poolAddress, UniswapV3Pool__factory.abi, RPC_PROVIDERS[chainId])

      if (read === 'liquidity') {
        const results = await contract.liquidity()
        setResult(results)
        setUniV3PoolState((p) => ({ ...p, isSuccess: true }))
      } else {
        const results = await contract.slot0()
        setResult(results)
        setUniV3PoolState((p) => ({ ...p, isSuccess: true }))
      }
    } catch (e) {
      console.log(`[Err onGetPool for ${read}]`, e)
      setUniV3PoolState((p) => ({ ...p, error: e.message || 'An error occurred' }))
    } finally {
      setUniV3PoolState((p) => ({ ...p, isLoading: false }))
    }
  }

  useEffect(() => {
    if (poolAddress) {
      onGetPool()
    }
  }, [chainId, read, poolAddress])

  return {
    result,
    uniV3PoolState,
  }
}

export function useV3PositionsFromTokenIdsByChainId(chainId: number, tokenId: string) {
  const positionManager = useV3NFTPositionManagerContractByChainId(chainId)
  const results = useManualContractCallForNonFungiblePositionManager(chainId, tokenId)

  const { result } = results

  const loading = useMemo(() => results.NFPManagerState.isLoading, [results])
  const error = useMemo(() => results.NFPManagerState.error, [results])

  const positions = useMemo(() => {
    if (!loading && !error && tokenId && result) {
      return {
        tokenId: BigNumber.from(tokenId),
        fee: parseInt(result.fee),
        feeGrowthInside0LastX128: BigNumber.from(result.feeGrowthInside0LastX128),
        feeGrowthInside1LastX128: BigNumber.from(result.feeGrowthInside1LastX128),
        liquidity: BigNumber.from(result.liquidity),
        nonce: BigNumber.from(result.nonce),
        operator: result.operator as string,
        tickLower: parseInt(result.tickLower),
        tickUpper: parseInt(result.tickUpper),
        token0: result.token0 as string,
        token1: result.token1 as string,
        tokensOwed0: BigNumber.from(result.tokensOwed0),
        tokensOwed1: BigNumber.from(result.tokensOwed1),
      }
    }
    return {}
  }, [loading, error, results, tokenId])

  return {
    loading,
    positions,
  }
}

interface UseV3PositionResults {
  loading: boolean
  position: PositionDetails | undefined
}

export function useV3PositionFromTokenId(tokenId: BigNumber | undefined): UseV3PositionResults {
  const position = useV3PositionsFromTokenIds(tokenId ? [tokenId] : undefined)
  return {
    loading: position.loading,
    position: position.positions?.[0],
  }
}

export function useV3PositionFromTokenIdByChainId(tokenId: BigNumber | undefined): UseV3PositionResults {
  const position = useV3PositionsFromTokenIds(tokenId ? [tokenId] : undefined)
  return {
    loading: position.loading,
    position: position.positions?.[0],
  }
}

export function useV3Positions(account: string | null | undefined): UseV3PositionsResults {
  const positionManager = useV3NFTPositionManagerContract()

  const { loading: balanceLoading, result: balanceResult } = useSingleCallResult(positionManager, 'balanceOf', [
    account ?? undefined,
  ])

  // we don't expect any account balance to ever exceed the bounds of max safe int
  const accountBalance: number | undefined = balanceResult?.[0]?.toNumber()

  const tokenIdsArgs = useMemo(() => {
    if (accountBalance && account) {
      const tokenRequests = []
      for (let i = 0; i < accountBalance; i++) {
        tokenRequests.push([account, i])
      }
      return tokenRequests
    }
    return []
  }, [account, accountBalance])

  const tokenIdResults = useSingleContractMultipleData(positionManager, 'tokenOfOwnerByIndex', tokenIdsArgs)
  const someTokenIdsLoading = useMemo(() => tokenIdResults.some(({ loading }) => loading), [tokenIdResults])

  const tokenIds = useMemo(() => {
    if (account) {
      return tokenIdResults
        .map(({ result }) => result)
        .filter((result): result is CallStateResult => !!result)
        .map((result) => BigNumber.from(result[0]))
    }
    return []
  }, [account, tokenIdResults])

  const { positions, loading: positionsLoading } = useV3PositionsFromTokenIds(tokenIds)

  return {
    loading: someTokenIdsLoading || balanceLoading || positionsLoading,
    positions,
  }
}

export function useLazyV3Positions({
  account,
  shouldRefetch,
}: {
  account: string | null | undefined
  shouldRefetch: boolean
}): UseV3PositionsResults {
  const positionManager = useV3NFTPositionManagerContract()

  const { loading: balanceLoading, result: balanceResult } = useSingleCallResult(positionManager, 'balanceOf', [
    account ?? undefined,
  ])

  // we don't expect any account balance to ever exceed the bounds of max safe int
  const accountBalance: number | undefined = balanceResult?.[0]?.toNumber()

  const tokenIdsArgs = useMemo(() => {
    if (accountBalance && account) {
      const tokenRequests = []
      for (let i = 0; i < accountBalance; i++) {
        tokenRequests.push([account, i])
      }
      return tokenRequests
    }
    return []
  }, [account, accountBalance])

  const tokenIdResults = useSingleContractMultipleData(positionManager, 'tokenOfOwnerByIndex', tokenIdsArgs)
  const someTokenIdsLoading = useMemo(() => tokenIdResults.some(({ loading }) => loading), [tokenIdResults])

  const tokenIds = useMemo(() => {
    if (account) {
      return tokenIdResults
        .map(({ result }) => result)
        .filter((result): result is CallStateResult => !!result)
        .map((result) => BigNumber.from(result[0]))
    }
    return []
  }, [account, tokenIdResults])

  const { positions, loading: positionsLoading } = useV3PositionsFromTokenIds(tokenIds)

  return {
    loading: someTokenIdsLoading || balanceLoading || positionsLoading,
    positions,
  }
}

export function useV3LatestPositionsByFeeOfPair(
  account: string | null | undefined,
  token0: Currency | null | undefined,
  token1: Currency | null | undefined,
  feeAmount: number | null | undefined
): Omit<UseV3PositionsResults, 'positions'> & {
  positionWithHighestLiquidity: PositionDetails | undefined
} {
  const positionManager = useV3NFTPositionManagerContract()

  const { loading: balanceLoading, result: balanceResult } = useSingleCallResult(positionManager, 'balanceOf', [
    account ?? undefined,
  ])

  // we don't expect any account balance to ever exceed the bounds of max safe int
  const accountBalance: number | undefined = balanceResult?.[0]?.toNumber()

  const tokenIdsArgs = useMemo(() => {
    if (accountBalance && account) {
      const tokenRequests = []
      for (let i = 0; i < accountBalance; i++) {
        tokenRequests.push([account, i])
      }
      return tokenRequests
    }
    return []
  }, [account, accountBalance])

  const tokenIdResults = useSingleContractMultipleData(positionManager, 'tokenOfOwnerByIndex', tokenIdsArgs)
  const someTokenIdsLoading = useMemo(() => tokenIdResults.some(({ loading }) => loading), [tokenIdResults])

  const tokenIds = useMemo(() => {
    if (account) {
      return tokenIdResults
        .map(({ result }) => result)
        .filter((result): result is CallStateResult => !!result)
        .map((result) => BigNumber.from(result[0]))
    }
    return []
  }, [account, tokenIdResults])

  const { positions, loading: positionsLoading } = useV3PositionsFromTokenIds(tokenIds)

  const bySelectedFee = positions?.filter((position) => {
    return (
      position.fee === feeAmount &&
      position.token0 === token0?.wrapped.address &&
      position.token1 === token1?.wrapped.address
    )
  })

  const positionWithHighestLiquidity = bySelectedFee?.reduce((prevPosition, currPosition) => {
    return currPosition.liquidity > prevPosition.liquidity ? currPosition : prevPosition
  }, bySelectedFee[0])

  return {
    loading: someTokenIdsLoading || balanceLoading || positionsLoading,
    positionWithHighestLiquidity,
  }
}
