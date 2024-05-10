import { useWeb3React } from '@web3-react/core'
import DerpChallengeAcceptedAnimation from 'assets/images/challenge-accepted.png'
import { CHAIN_NAME_TO_CHAIN_ID, validateUrlChainParam } from 'graphql/data/util'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import styled from 'styled-components/macro'

import { MAX_WIDTH_MEDIA_BREAKPOINT } from '../constant'
import { useLoadPools } from './hooks'
import { HeaderRow, LoadedRow } from './PoolRow'
const GridContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: ${MAX_WIDTH_MEDIA_BREAKPOINT};
  background: rgba(255, 255, 255, 0.7);
  box-shadow: 3px 3px 0px 2px #000;
  margin-left: auto;
  margin-right: auto;
  border-radius: 16px;
  justify-content: center;
  align-items: center;
  border: 0.15em solid ${({ theme }) => theme.black};

  overflow: hidden;
`

const PoolDataContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  height: 100%;
  width: 100%;
`

const BoundedBorderDiv = styled.div`
  width: 100%;
  padding: 0px 14px;
`

const BorderBottom = styled.div`
  border-bottom: 0.17em solid ${({ theme }) => theme.black};
`

const EmptryTableBox = styled.div`
  position: relative;
  margin-top: 2px;
  width: 100%;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  // background: #fff;
  gap: 16px;
`
const DerpImg = styled.img`
  max-width: 100%;
  width: 254px;
  z-index: 2;
`

const TextBox = styled.div`
  display: flex;
  justify-content: center;
  background: #fff;
  padding 12px;
  border: 8px solid #000;
  border-radius: 8px;
  font-size: 32px;
  font-weight: 1000;
  z-index: 2;
`

type Adjustment = {
  width?: number
  height?: number
  borderSize?: number
}
const AbsoluteCircle = styled.div<Adjustment>`
  position: absolute;
  width: ${({ width }) => (width ? `${width}px` : '450px')};
  height: ${({ height }) => (height ? `${height}px` : '450px')};
  border: ${({ borderSize }) => (borderSize ? borderSize : '22')}px solid #000;
  border-radius: 100%;
  z-index: 1;

  animation: pulse 2.5s infinite;
  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }
`

export enum CellType {
  PARSED = 'PARSED',
  LOADING = 'LOADING',
  INPROGRESS = 'INPROGRESS',
}

// eslint-disable-next-line import/no-unused-modules
export default function PoolTable() {
  const { account } = useWeb3React()
  const [finalizedPools, setFinalizedPools] = useState<any[] | undefined>(undefined)
  const filterNetwork = validateUrlChainParam(useParams<{ chainName?: string }>().chainName?.toUpperCase())

  const chainId = CHAIN_NAME_TO_CHAIN_ID[filterNetwork]

  const { onLoadPools, isLoadingFetch, setIsLoadingFetch, userPools, loadedPools } = useLoadPools(chainId)

  useEffect(() => {
    onLoadPools()
    if (account) {
      setFinalizedPools(undefined)
    }
  }, [account, chainId]) //! Added chainId dependency upon network changes

  useEffect(() => {
    if (loadedPools && loadedPools.length > 0) {
      // To load the initial result first
      // Otherwise backend calculating the pending result will take some time
      setFinalizedPools(loadedPools)
    }
  }, [loadedPools])

  return (
    <GridContainer>
      <HeaderRow />
      {finalizedPools && finalizedPools.length > 0 ? (
        <PoolDataContainer>
          {finalizedPools.map((pool: any, index: number) => (
            <>
              {pool.address && (
                <LoadedRow
                  key={pool.address}
                  poolListIndex={index}
                  poolListLength={finalizedPools.length}
                  pool={pool}
                />
              )}
              {pool?.address && index !== finalizedPools.length - 1 && (
                <BoundedBorderDiv>
                  <BorderBottom />
                </BoundedBorderDiv>
              )}
            </>
          ))}
        </PoolDataContainer>
      ) : (
        <EmptryTableBox>
          <TextBox>CHALLENGE</TextBox>
          <DerpImg src={DerpChallengeAcceptedAnimation} alt="derpdex-challenge-accepted-genesis-pools" />
          <TextBox>ACCEPTED</TextBox>
          <AbsoluteCircle />
          <AbsoluteCircle width={800} height={800} borderSize={44} />
        </EmptryTableBox>
      )}
    </GridContainer>
  )
}
