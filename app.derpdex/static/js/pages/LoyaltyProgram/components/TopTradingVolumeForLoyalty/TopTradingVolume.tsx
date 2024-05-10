import { Trans } from '@lingui/macro'
import { GloriaText } from 'components/CustomFonts/GloriaHallelujah'
import { MAX_WIDTH_MEDIA_BREAKPOINT } from 'components/Tokens/constants'
import { ReactNode } from 'react'
import { AlertTriangle } from 'react-feather'
import styled from 'styled-components/macro'

import { LoadedRow, LoadingRows, TradingVolumeHeaderRow } from './TableRow'

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

const TopHeader = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
`

const TableTitle = styled(GloriaText)`
  font-size: 25px;
  color: ${({ theme }) => theme.black};
  font-weight: 400;
`

const Wrapped = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`

const Img = styled.img`
  width: 60px;
`

const TableDataContainer = styled.div`
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

const NoRecordDisplay = styled.div`
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

interface TopTradingVolumeProps {
  isLoadingFetch: boolean
  tradingVolumeList: any[]
}

export function TopTradingVolumeForLoyalty(props: TopTradingVolumeProps) {
  const { isLoadingFetch, tradingVolumeList } = props

  function LoadingTokenTable({ rowCount = 10 }: { rowCount?: number }) {
    return (
      <GridContainer>
        <TradingVolumeHeaderRow />
        <TableDataContainer>
          <LoadingRows rowCount={rowCount} />
        </TableDataContainer>
      </GridContainer>
    )
  }

  function NoRecordState({ message }: { message: ReactNode }) {
    return (
      <GridContainer>
        <TradingVolumeHeaderRow />
        <NoRecordDisplay>{message}</NoRecordDisplay>
      </GridContainer>
    )
  }

  return (
    <Wrapped>
      {isLoadingFetch && <LoadingTokenTable />}
      {!isLoadingFetch && tradingVolumeList.length > 0 && (
        <GridContainer>
          <TradingVolumeHeaderRow />
          {tradingVolumeList.map((item: any, index: number) => (
            <>
              {item.walletAddress && <LoadedRow key={item.walletAddress} record={item} />}
              {index != tradingVolumeList.length - 1 && (
                <BoundedBorderDiv>
                  <BorderBottom />
                </BoundedBorderDiv>
              )}
            </>
          ))}
        </GridContainer>
      )}
      {!isLoadingFetch && tradingVolumeList.length === 0 && (
        <NoRecordState
          message={
            <>
              <AlertTriangle size={16} />
              <Trans>Empty record.</Trans>
            </>
          }
        />
      )}
    </Wrapped>
  )
}
