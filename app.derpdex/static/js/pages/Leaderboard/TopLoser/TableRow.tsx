import { Trans } from '@lingui/macro'
import { formatNumber, NumberType } from '@uniswap/conedison/format'
import DerpLoser1 from 'assets/images/derp-loser-1.png'
import DerpLoser2 from 'assets/images/derp-loser-2.png'
import DerpLoser3 from 'assets/images/derp-loser-3.png'
import { NunitoText } from 'components/CustomFonts/Nunito'
import {
  LARGE_MEDIA_BREAKPOINT,
  MAX_WIDTH_MEDIA_BREAKPOINT,
  MEDIUM_MEDIA_BREAKPOINT,
  SMALL_MEDIA_BREAKPOINT,
} from 'components/Tokens/constants'
import { MouseoverTooltip } from 'components/Tooltip'
import { useAtomValue } from 'jotai/utils'
import { CSSProperties, forwardRef, ReactNode, Ref } from 'react'
import { Info } from 'react-feather'
import styled, { css, useTheme } from 'styled-components/macro'
import { ClickableStyle } from 'theme'
import { shortenAddress } from 'utils'

import { LoadingBubble } from '../loading'
import { sortAscendingAtom, sortMethodAtom, TopLoserSortMethod, useSetSortMethod } from './state'

const Cell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
`

const WalletAddressCell = styled(Cell)`
  justify-content: flex-start;
  padding: 0px 8px;
  min-width: 180px;
  text-align: center;
  gap: 8px;
`

const DataCell = styled(Cell)<{ sortable: boolean }>`
  justify-content: flex-end;
  min-width: 80px;
  user-select: ${({ sortable }) => (sortable ? 'none' : 'unset')};
  transition: ${({
    theme: {
      transition: { duration, timing },
    },
  }) => css`background-color ${duration.medium} ${timing.ease}`};
`

const PnlCell = styled(DataCell)`
  justify-content: center;
  @media only screen and (max-width: ${MEDIUM_MEDIA_BREAKPOINT}) {
    display: none;
  }
`

const RewardsCell = styled(DataCell)`
  justify-content: center;
  @media only screen and (max-width: ${MEDIUM_MEDIA_BREAKPOINT}) {
    display: none;
  }
`

const StyledPoolRow = styled.div<{
  first?: boolean
  last?: boolean
  loading?: boolean
}>`
  background-color: transparent;
  display: grid;
  font-size: 16px;
  font-weight: 700;
  grid-template-columns: 1fr 3fr 3fr;
  line-height: 24px;
  max-width: ${MAX_WIDTH_MEDIA_BREAKPOINT};
  min-width: 390px;
  ${({ first, last }) => css`
    height: 72px;
    padding-top: ${first ? '8px' : '0px'};
    padding-bottom: ${last ? '8px' : '0px'};
  `}
  padding-left: 12px;
  padding-right: 12px;
  transition: ${({
    theme: {
      transition: { duration, timing },
    },
  }) => css`background-color ${duration.medium} ${timing.ease}`};
  width: 100%;
  transition-duration: ${({ theme }) => theme.transition.duration.fast};

  &:hover {
    ${({ loading, theme }) =>
      !loading &&
      css`
        background-color: ${theme.hoverDefault};
      `}
    ${({ last }) =>
      last &&
      css`
        border-radius: 0px 0px 8px 8px;
      `}
  }

  @media only screen and (max-width: ${MAX_WIDTH_MEDIA_BREAKPOINT}) {
    grid-template-columns: 1fr 6.5fr 4.5fr;
  }

  @media only screen and (max-width: ${LARGE_MEDIA_BREAKPOINT}) {
    grid-template-columns: 1fr 7.5fr 4.5fr;
  }

  @media only screen and (max-width: ${MEDIUM_MEDIA_BREAKPOINT}) {
    grid-template-columns: 1fr 10fr 5fr;
  }

  @media only screen and (max-width: ${SMALL_MEDIA_BREAKPOINT}) {
    grid-template-columns: 2fr 3fr;
    min-width: unset;
    border-bottom: 0.5px solid ${({ theme }) => theme.backgroundModule};

    :last-of-type {
      border-bottom: none;
    }
  }
`

const StyledHeaderRow = styled(StyledPoolRow)`
  border-bottom: 1px solid;
  border-color: ${({ theme }) => theme.backgroundOutline};
  border-radius: 8px 8px 0px 0px;
  color: ${({ theme }) => theme.white};
  font-size: 16px;
  height: 48px;
  line-height: 16px;
  padding: 0px 12px;
  width: 100%;
  justify-content: center;
  background: #000;

  &:hover {
    background: #000;
  }

  @media only screen and (max-width: ${SMALL_MEDIA_BREAKPOINT}) {
    justify-content: space-between;
  }
`

const HeaderCellWrapper = styled.span<{ onClick?: () => void }>`
  align-items: center;
  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'unset')};
  display: flex;
  gap: 4px;
  justify-content: flex-end;
  width: 100%;

  &:hover {
    ${ClickableStyle}
  }
`

const InfoIconContainer = styled.div`
  margin-left: 2px;
  display: flex;
  align-items: center;
  cursor: help;
`

const IconLoadingBubble = styled(LoadingBubble)`
  border-radius: 50%;
  width: 24px;
`

const MediumLoadingBubble = styled(LoadingBubble)`
  width: 65%;
`

const HEADER_DESCRIPTIONS: Record<TopLoserSortMethod, ReactNode | undefined> = {
  [TopLoserSortMethod.PNL]: undefined,
  [TopLoserSortMethod.REWARDS]: <Trans>USD value of airdrop rewards: DERP and xDERP</Trans>,
}

// eslint-disable-next-line import/no-unused-modules
export function LoadingRow(props: { first?: boolean; last?: boolean }) {
  return (
    <TopLoserRow
      header={false}
      loading
      walletAddress={
        <div style={{ flexDirection: 'row', display: 'flex', gap: '8px' }}>
          <IconLoadingBubble />
          <MediumLoadingBubble style={{ width: '100px' }} />
        </div>
      }
      pnl={
        <>
          <MediumLoadingBubble style={{ width: '100px' }} />
        </>
      }
      rewards={<LoadingBubble style={{ width: '100px' }} />}
      {...props}
    />
  )
}

export const LoadingRows = ({ rowCount }: { rowCount: number }) => (
  <>
    {Array(rowCount)
      .fill(null)
      .map((_, index) => {
        return <LoadingRow key={index} first={index === 0} last={index === rowCount - 1} />
      })}
  </>
)

function HeaderCell({
  category,
}: {
  category: TopLoserSortMethod // TODO: change this to make it work for trans
}) {
  const theme = useTheme()
  const sortAscending = useAtomValue(sortAscendingAtom)
  const handleSortCategory = useSetSortMethod(category)
  const sortMethod = useAtomValue(sortMethodAtom)

  const description = HEADER_DESCRIPTIONS[category]

  return (
    <HeaderCellWrapper>
      <NunitoText size="lg" weight={700}>
        {category}
      </NunitoText>
      {description && (
        <MouseoverTooltip text={description} placement="right">
          <InfoIconContainer>
            <Info size={14} />
          </InfoIconContainer>
        </MouseoverTooltip>
      )}
    </HeaderCellWrapper>
  )
}

function TopLoserRow({
  header,
  walletAddress,
  pnl,
  rewards,
  rankInfo,
  ...params
}: {
  header: boolean
  loading?: boolean
  walletAddress?: ReactNode
  pnl?: ReactNode
  rewards?: ReactNode
  rankInfo?: ReactNode
  style?: CSSProperties
}) {
  const rowCells = (
    <>
      <WalletAddressCell data-testid="wallet-address-cell">
        {rankInfo}
        <NunitoText size="lg" weight={700} style={{ width: '100%' }}>
          {walletAddress}
        </NunitoText>
      </WalletAddressCell>
      <PnlCell data-testid="pnl-cell" sortable={header}>
        <NunitoText size="lg" weight={700}>
          {pnl}
        </NunitoText>
      </PnlCell>
      <RewardsCell data-testid="rewards-cell" sortable={header}>
        <NunitoText size="lg" weight={700}>
          {rewards}
        </NunitoText>
      </RewardsCell>
    </>
  )

  if (header) return <StyledHeaderRow data-testid="header-row">{rowCells}</StyledHeaderRow>
  return <StyledPoolRow {...params}>{rowCells}</StyledPoolRow>
}

export function TopLoserHeaderRow() {
  return (
    <TopLoserRow
      header={true}
      walletAddress={<Trans>Wallet Address</Trans>}
      pnl={<HeaderCell category={TopLoserSortMethod.PNL} />}
      rewards={<HeaderCell category={TopLoserSortMethod.REWARDS} />}
    />
  )
}

interface LoadedRowProps {
  record: NonNullable<any>
}

// eslint-disable-next-line react/display-name, import/no-unused-modules
export const LoadedRow = forwardRef((props: LoadedRowProps, ref: Ref<HTMLDivElement>) => {
  const { record } = props

  return (
    <div ref={ref} data-testid={`list-table-row-${record.walletAddress}`}>
      <TopLoserRow
        header={false}
        rankInfo={
          record.index === 1 ? (
            <img src={DerpLoser1} alt="derp-loser-1" width="50" height="50" style={{ marginRight: '5px' }} />
          ) : record.index === 2 ? (
            <img src={DerpLoser2} alt="derp-loser-2" width="50" height="50" style={{ marginRight: '5px' }} />
          ) : record.index === 3 ? (
            <img src={DerpLoser3} alt="derp-loser-3" width="50" height="50" style={{ marginRight: '5px' }} />
          ) : record.index > 3 ? (
            <span style={{ marginRight: '5px', width: '50px' }}>{record.index}</span>
          ) : null
        }
        walletAddress={
          <NunitoText size="lg" weight={700}>
            {shortenAddress(record.walletAddress)}
          </NunitoText>
        }
        pnl={
          <NunitoText size="lg" weight={700}>
            {formatNumber(record.pnl, NumberType.PortfolioBalance)}
          </NunitoText>
        }
        rewards={
          <NunitoText size="lg" weight={700}>
            {formatNumber(record.rewards, NumberType.PortfolioBalance)}
          </NunitoText>
        }
      ></TopLoserRow>
    </div>
  )
})
