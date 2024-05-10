import { formatNumber, NumberType } from '@uniswap/conedison/format'
import { useWeb3React } from '@web3-react/core'
import { NunitoText } from 'components/CustomFonts/Nunito'
import { SupportedChainId } from 'constants/chains'
import { usePoolDatasForZapToEarn } from 'hooks/usePoolDatasForZapToEarn'
import { useMemo } from 'react'
import styled from 'styled-components'

import { useApyCalculator } from '../hooks/useApyCalculator'
import { IPool, useGetPools } from '../hooks/useGetPools'

const ColumnFlexContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px 20px;

  border-radius: 16px;
  background: #f5f5f5;
  width: 100%;

  gap: 12px;
`
const RowDetail = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;

  * {
    font-size: 16px;
    font-weight: 500;
  }
`
type ParseType = 'currency' | 'percentage'
enum Parse {
  CURRENCY = 'currency',
  PERCENTAGE = 'percentage',
}
interface IProjectedDetails {
  KEY: string
  value: string | number
  parseType: ParseType
}

const MapTestnetToMainnetPool: { [key: string]: string } = {
  // USDT/WETH <-> ZKDERPINA/WETH
  '0x0a9cbb56a0d3d3b49c4ac01b89ef4dfba20bee48': '0xf91dd375822b0223ed9e69f36b9926c611116546',
  // zkPepe/WETH <-> PEPE-WETH
  '0x0b27827c05a3f448b7489ba184faa03a35f47e29': '0xe2d9dc08528321f8416cb73a4ee5b4f793ab953d',
  // USDC-WETH <-> ZKDERPINA-WETH
  '0x1dbc5f172ab40b658b6074fa804b7aa9f3003d55': '0xd0cbe97675d09059cfb7d3c522a37ca8ee4103b2',
  // zkUSD-WETH <-> USDC-USDT
  '0x3ee2aff9b12f718afd016d7404893fd990c3b0c4': '0x276013cc73772ece24af7de3ed4bb77bd424a9ad',
}

const EXCLUDED_GENESIS_ADDRRESSES = [
  '0xf91dd375822b0223ed9e69f36b9926c611116546',
  '0xe2d9dc08528321f8416cb73a4ee5b4f793ab953d',
  '0xd0cbe97675d09059cfb7d3c522a37ca8ee4103b2',
  '0x276013cc73772ece24af7de3ed4bb77bd424a9ad',
  '0x2eeada4411da7751c407ac8a06e9152cac631c47',
]

const useNonGenesisPools = ({
  isNonGenesisPools,
  poolAddress,
}: {
  isNonGenesisPools: boolean
  poolAddress: string
}) => {
  const {
    loading: loadingPoolData,
    error: errorPoolData,
    data: poolData,
  } = usePoolDatasForZapToEarn(isNonGenesisPools ? [poolAddress] : [])

  const nonGenesisPoolToCalculate: IPool | undefined = useMemo(() => {
    if (poolData && poolData.length > 0) {
      const result = poolData[0]
      return {
        apr: result?.apr || 0,
        feeTier: result?.feeTier.toString() || '0',
        feeUSD: result?.fees24H || 0,
        poolAddress,
        startTime: '0',
        token0: result.token0,
        token1: result.token1,
        totalRewardsPool: '0',
        tvlUSD: result.tvlUSD.toString(),
        volume: result.volumeUSD,
        pendingRewardsUSD: 0,
        endTime: '0',
        pricePerDERP: '0',
      }
    } else {
      return undefined
    }
  }, [poolData])

  return {
    nonGenesisPoolToCalculate,
  }
}

export const ProjectedEarnings = ({
  selectedPoolAddress,
  poolValuationInUSD,
}: {
  selectedPoolAddress: string
  poolValuationInUSD: string
}) => {
  const { chainId } = useWeb3React()
  const currentPool = useMemo(() => {
    // Make sure that pool is retrievable
    if (
      chainId === SupportedChainId.ZKSYNC_MAINNET ||
      chainId === SupportedChainId.BASE_MAINNET ||
      chainId === SupportedChainId.OPBNB_MAINNET
    ) {
      return selectedPoolAddress.toLowerCase()
    } else {
      return MapTestnetToMainnetPool[selectedPoolAddress] || selectedPoolAddress
    }
  }, [chainId, selectedPoolAddress])

  const { loadedPools: loadedDerpPools, isLoadingFetch: isLoadingFetchDerpPools, endedPoolAddresses } = useGetPools()

  const isNonGensisPool = useMemo(() => {
    if (EXCLUDED_GENESIS_ADDRRESSES.includes(currentPool) || endedPoolAddresses.includes(currentPool.toLowerCase()))
      return true
    else return false
  }, [currentPool, endedPoolAddresses])

  const derpPoolToCalculate = useMemo(() => {
    if (loadedDerpPools && loadedDerpPools.length > 0 && !isLoadingFetchDerpPools) {
      return loadedDerpPools.find((i) => i.poolAddress === currentPool)
    } else {
      return undefined
    }
  }, [loadedDerpPools, isLoadingFetchDerpPools, currentPool])

  const { nonGenesisPoolToCalculate } = useNonGenesisPools({
    isNonGenesisPools: isNonGensisPool,
    poolAddress: currentPool,
  })

  const { onUserInput, result } = useApyCalculator({
    poolValuationInUSD,
    pool: !isNonGensisPool ? derpPoolToCalculate : nonGenesisPoolToCalculate,
    isNonGenesis: isNonGensisPool,
  })

  return (
    <ColumnFlexContent>
      {/* {projectedDetails.map((item, index) => (
        <RowDetail key={index}>
          <NunitoText>Projected {item.KEY}</NunitoText>
          <NunitoText>{tryParseFormat(item.value, item.parseType)}</NunitoText>
        </RowDetail>
      ))} */}
      <RowDetail>
        <NunitoText>Projected $DERP earnings</NunitoText>
        <NunitoText>{formatNumber(result.projectedDerpEarningUSD, NumberType.PortfolioBalance)}</NunitoText>
      </RowDetail>
      {/* <RowDetail>
        <NunitoText>Projected $xDERP earnings</NunitoText>
        <NunitoText>{formatNumber(result.projectedDerpEarningUSD, NumberType.PortfolioBalance)}</NunitoText>
      </RowDetail> */}
      <RowDetail>
        <NunitoText>Projected LP earnings</NunitoText>
        <NunitoText> {formatNumber(result.projectedLPEarningUSD, NumberType.PortfolioBalance)}</NunitoText>
      </RowDetail>
      <RowDetail>
        <NunitoText>Projected earnings value</NunitoText>
        <NunitoText>
          {!isNonGensisPool
            ? formatNumber(result.projectedDerpEarningUSD + result.projectedLPEarningUSD, NumberType.PortfolioBalance)
            : formatNumber(0, NumberType.PortfolioBalance)}
        </NunitoText>
      </RowDetail>
      <RowDetail>
        <NunitoText>Projected APR</NunitoText>
        <NunitoText>{result.projectedAPR.toFixed(2)}%</NunitoText>
      </RowDetail>
    </ColumnFlexContent>
  )
}
