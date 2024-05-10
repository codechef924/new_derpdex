import { Trans } from '@lingui/macro'
import { PAGE_SIZE } from 'graphql/data/TopTokens'
import { CHAIN_NAME_TO_CHAIN_ID, validateUrlChainParam } from 'graphql/data/util'
import { CultivatePoolData, useCultivatePoolDatas } from 'hooks/useCultivatePoolDatas'
import { useGetStakingPools } from 'hooks/useWhitelistedPoolAddresses'
import { useAtomValue } from 'jotai/utils'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { AlertTriangle } from 'react-feather'
import { useParams } from 'react-router-dom'
import styled from 'styled-components/macro'

import {
  CultivatePoolSortMethod,
  FarmingfilterStringAtom,
  sortAscendingAtom,
  sortMethodAtom,
} from '../state/search.state'
import { HeaderRow, LoadedRow, LoadingRow } from './CultivateTableRow'

const GridContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 100%;
  width: 100%;
  background-color: ${({ theme }) => theme.backgroundSurface};
  box-shadow: 3px 3px 0px 2px #000;
  margin-left: auto;
  margin-right: auto;
  border-radius: 16px;
  justify-content: center;
  align-items: center;
  border: 0.15em solid ${({ theme }) => theme.black};
`

const TokenDataContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  height: 100%;
  width: 100%;
`

const NoTokenDisplay = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 60px;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 16px;
  font-weight: 500;
  align-items: center;
  padding: 0px 28px;
  gap: 8px;
`

const BoundedBorderDiv = styled.div`
  width: 100%;
  padding: 0px 14px;
`

const BorderBottom = styled.div`
  border-bottom: 0.17em solid ${({ theme }) => theme.black};
`

function NoTokensState({ message }: { message: ReactNode }) {
  return (
    <GridContainer>
      <HeaderRow />
      <NoTokenDisplay>{message}</NoTokenDisplay>
    </GridContainer>
  )
}

const LoadingRows = ({ rowCount }: { rowCount: number }) => (
  <>
    {Array(rowCount)
      .fill(null)
      .map((_, index) => {
        return <LoadingRow key={index} first={index === 0} last={index === rowCount - 1} />
      })}
  </>
)

function LoadingTokenTable({ rowCount = PAGE_SIZE }: { rowCount?: number }) {
  return (
    <GridContainer>
      <HeaderRow />
      <TokenDataContainer>
        <LoadingRows rowCount={rowCount} />
      </TokenDataContainer>
    </GridContainer>
  )
}

export const sortProperties: Record<
  CultivatePoolSortMethod,
  keyof CultivatePoolData | keyof { multiplier: string; earned: string; stakedPositions: string }
> = {
  [CultivatePoolSortMethod.TVL]: 'tvlUSD',
  [CultivatePoolSortMethod.VOL24H]: 'volumeUSD',
  [CultivatePoolSortMethod.VOL7D]: 'volumeUSDWeek',
  [CultivatePoolSortMethod.APR]: 'apr', //;TODO when percent change is implemented
  [CultivatePoolSortMethod.FEES24H]: 'fees24H',
  [CultivatePoolSortMethod.MULTIPLIER]: 'multiplier',
  [CultivatePoolSortMethod.EARNED]: 'earned',
  [CultivatePoolSortMethod.AVAILABLE_POSITIONS]: 'availablePositions',
  [CultivatePoolSortMethod.STAKED_POSITIONS]: 'stakedPositions',
}

export default function CultivateTable() {
  const chainName = validateUrlChainParam(useParams<{ chainName?: string }>().chainName)
  const currentString = useAtomValue(FarmingfilterStringAtom)

  const chainId = useMemo(() => {
    return CHAIN_NAME_TO_CHAIN_ID[chainName]
  }, [chainName])

  const { status, incentiveKeys, stakedPoolsPositionIdsOnDerpDEX } = useGetStakingPools({
    chainId,
  })

  const poolAddresses = useMemo(() => {
    const addresses: string[] = []
    Object.keys(incentiveKeys).forEach((i) => {
      addresses.push(incentiveKeys[i].pool)
    })
    return addresses
  }, [incentiveKeys])

  const {
    loading: loadingPoolData,
    error: errorPoolData,
    data: poolData,
    fetchCultivatePool,
  } = useCultivatePoolDatas(
    chainId,
    poolAddresses ? poolAddresses : [],
    Object.values(incentiveKeys),
    stakedPoolsPositionIdsOnDerpDEX
  )

  const [loadedPoollData, setLoadedPoollData] = useState<CultivatePoolData[]>([])
  useEffect(() => {
    if (!loadingPoolData && poolData && poolData.length > 0 && !(loadedPoollData.length > 0)) {
      // poolData.sort((a, b) => (b?.apr || 0) - (a?.apr || 0))

      setLoadedPoollData(poolData)
    }
  }, [loadingPoolData, chainId, incentiveKeys])

  useEffect(() => {
    if (currentString.length > 0) {
      const filteredTokensByInput = poolData?.filter(
        (token) =>
          token.token0.symbol.toLocaleLowerCase().includes(currentString.toLocaleLowerCase()) ||
          token.token1.symbol.toLocaleLowerCase().includes(currentString.toLocaleLowerCase())
      )
      setLoadedPoollData(filteredTokensByInput ? filteredTokensByInput : [])
    } else {
      setLoadedPoollData(poolData ? poolData : [])
    }
  }, [currentString])

  const sortMethod = useAtomValue(sortMethodAtom)
  const sortAscending = useAtomValue(sortAscendingAtom)

  useEffect(() => {
    if (poolData) {
      const sortProperty = sortProperties[sortMethod]
      const sortedPools = [...poolData].sort((a, b) => {
        if (sortAscending) {
          return Number(a[sortProperty]) - Number(b[sortProperty])
        } else {
          return Number(b[sortProperty]) - Number(a[sortProperty])
        }
      })
      setLoadedPoollData(sortedPools)
    }
  }, [sortAscending])

  /* loading and error state */
  if (loadingPoolData && !poolData) {
    return <LoadingTokenTable rowCount={PAGE_SIZE} />
  } else if (!poolData && !loadingPoolData) {
    return (
      <NoTokensState
        message={
          <>
            <AlertTriangle size={16} />
            <Trans>An error occurred loading pools. Please try again.</Trans>
          </>
        }
      />
    )
  } else if (poolData?.length === 0 || loadedPoollData?.length === 0) {
    return <NoTokensState message={<Trans>No pools found</Trans>} />
  } else {
    return (
      <GridContainer>
        <HeaderRow />
        <TokenDataContainer>
          {loadedPoollData &&
            loadedPoollData.map((pool, index) => (
              <div key={index}>
                {pool && (
                  <LoadedRow
                    key={pool.address}
                    poolListIndex={index}
                    poolListLength={Object.keys(incentiveKeys).length}
                    pool={pool}
                    tableOption={status}
                    incentiveKey={incentiveKeys[pool.incentiveId]}
                    chainId={chainId}
                    // sparklineMap={sparklines}
                    // sortRank={tokenSortRank[pool.address]}
                  />
                )}
                {loadedPoollData && index !== loadedPoollData.length - 1 && (
                  <BoundedBorderDiv>
                    <BorderBottom />
                  </BoundedBorderDiv>
                )}
              </div>
            ))}
        </TokenDataContainer>
      </GridContainer>
    )
  }
}
