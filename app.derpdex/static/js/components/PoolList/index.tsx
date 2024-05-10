import { Trans } from '@lingui/macro'
import { PAGE_SIZE } from 'graphql/data/TopTokens'
import { validateUrlChainParam } from 'graphql/data/util'
import { PoolData, usePoolDatas } from 'hooks/usePoolDatas'
import { useTopPoolAddresses } from 'hooks/useTopPoolAddresses'
import { useAtomValue } from 'jotai/utils'
import { ReactNode, useEffect, useState } from 'react'
import { AlertTriangle } from 'react-feather'
import { useParams } from 'react-router-dom'
import styled from 'styled-components/macro'

import { MAX_WIDTH_MEDIA_BREAKPOINT } from './constants'
import { HeaderRow, LoadedRow, LoadingRow } from './PoolRow'
import { PoolSortMethod, sortAscendingAtom, sortMethodAtom } from './state'

const GridContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: ${MAX_WIDTH_MEDIA_BREAKPOINT};
  width: 100%;

  margin-left: auto;
  margin-right: auto;
  border-radius: 8px;
  justify-content: center;
  align-items: center;

  border-radius: 16px;
  border: 0.15em solid #000;
  background: #fff;
  box-shadow: 3px 3px 0px 2px #000;
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

export default function PoolList() {
  const chainName = validateUrlChainParam(useParams<{ chainName?: string }>().chainName)
  // const { tokens, tokenSortRank, loadingTokens, sparklines } = useTopTokens(chainName)
  const { loading, error, addresses } = useTopPoolAddresses()

  const {
    loading: loadingPoolData,
    error: errorPoolData,
    data: poolData,
  } = usePoolDatas(addresses && !loading ? addresses : [])

  const [loadedPoollData, setLoadedPoollData] = useState<PoolData[]>()
  useEffect(() => {
    if (!loadingPoolData && poolData && poolData.length > 0) {
      poolData.sort((a, b) => (b?.apr || 0) - (a?.apr || 0))

      setLoadedPoollData(poolData)
    }
  }, [loadingPoolData])
  const sortMethod = useAtomValue(sortMethodAtom)
  const sortAscending = useAtomValue(sortAscendingAtom)

  const sortProperties: Record<PoolSortMethod, keyof PoolData> = {
    [PoolSortMethod.TVL]: 'tvlUSD',
    [PoolSortMethod.VOL24H]: 'volumeUSD',
    [PoolSortMethod.VOL7D]: 'volumeUSDWeek',
    [PoolSortMethod.APR]: 'apr', //;TODO when percent change is implemented
    [PoolSortMethod.FEES24H]: 'fees24H',
  }

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
  } else if (poolData?.length === 0) {
    return <NoTokensState message={<Trans>No pools found</Trans>} />
  } else {
    return (
      <GridContainer>
        <HeaderRow />
        <TokenDataContainer>
          {loadedPoollData &&
            loadedPoollData.map((pool, index) => (
              <>
                {pool?.address && (
                  <LoadedRow
                    key={pool.address}
                    poolListIndex={index}
                    poolListLength={loadedPoollData.length}
                    pool={pool}
                    // sparklineMap={sparklines}
                    // sortRank={tokenSortRank[pool.address]}
                  />
                )}
                {pool?.address && index !== loadedPoollData.length - 1 && (
                  <BoundedBorderDiv>
                    <BorderBottom />
                  </BoundedBorderDiv>
                )}
              </>
            ))}
        </TokenDataContainer>
      </GridContainer>
    )
  }
}
