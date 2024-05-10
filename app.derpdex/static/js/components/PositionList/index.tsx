import { Trans } from '@lingui/macro'
import PositionListItem from 'components/PositionListItem'
import React from 'react'
import styled from 'styled-components/macro'
import { MEDIA_WIDTHS } from 'theme'
import { PositionDetails } from 'types/position'

const DesktopHeader = styled.div`
  display: none;
  font-size: 14px;
  font-weight: 500;
  padding: 0px 16px;
  // border-bottom: 1px solid ${({ theme }) => theme.backgroundOutline};

  @media screen and (min-width: ${MEDIA_WIDTHS.deprecated_upToSmall}px) {
    align-items: center;
    display: flex;
    justify-content: space-between;
    & > div:last-child {
      text-align: right;
      margin-right: 12px;
    }
  }
`

const MobileHeader = styled.div`
  font-weight: medium;
  padding: 8px;
  font-weight: 500;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  // border-bottom: 1px solid ${({ theme }) => theme.backgroundOutline};

  @media screen and (min-width: ${MEDIA_WIDTHS.deprecated_upToSmall}px) {
    display: none;
  }

  @media screen and (max-width: ${MEDIA_WIDTHS.deprecated_upToExtraSmall}px) {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
`

const ToggleWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const ToggleLabel = styled.button`
  cursor: pointer;
  background-color: transparent;
  border: none;
  color: ${({ theme }) => theme.derpGray1};
  font-size: 20px;
  font-weight: 600;
  line-height: 24px;
`

const ToggleLabelMobile = styled.button`
  cursor: pointer;
  background-color: transparent;
  border: none;
  color: ${({ theme }) => theme.derpGray1};
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
`

const BoundedBorderDiv = styled.div`
  width: 100%;
  padding: 0px 14px;
`

const BorderBottom = styled.div`
  border-bottom: 0.17em solid ${({ theme }) => theme.black};
`

type PositionListProps = React.PropsWithChildren<{
  positions: PositionDetails[]
  setUserHideClosedPositions: any
  userHideClosedPositions: boolean
}>

export default function PositionList({
  positions,
  setUserHideClosedPositions,
  userHideClosedPositions,
}: PositionListProps) {
  return (
    <>
      <DesktopHeader>
        <div
          style={{
            fontSize: '20px',
            fontWeight: 600,
            lineHeight: '24px',
          }}
        >
          <Trans>Your positions</Trans>
          {positions && ' (' + positions.length + ')'}
        </div>

        <ToggleLabel
          id="desktop-hide-closed-positions"
          onClick={() => {
            setUserHideClosedPositions(!userHideClosedPositions)
          }}
        >
          {userHideClosedPositions ? <Trans>Show closed positions</Trans> : <Trans>Hide closed positions</Trans>}
        </ToggleLabel>
      </DesktopHeader>
      <MobileHeader>
        <div
          style={{
            fontSize: '16px',
            fontWeight: 600,
            lineHeight: '24px',
          }}
        >
          <Trans>Your positions</Trans>
        </div>
        <ToggleWrap>
          <ToggleLabelMobile
            onClick={() => {
              setUserHideClosedPositions(!userHideClosedPositions)
            }}
          >
            {userHideClosedPositions ? <Trans>Show closed positions</Trans> : <Trans>Hide closed positions</Trans>}
          </ToggleLabelMobile>
        </ToggleWrap>
      </MobileHeader>
      {positions.map((p, index) => (
        <>
          <PositionListItem key={p.tokenId.toString()} {...p} />
        </>
      ))}
    </>
  )
}
