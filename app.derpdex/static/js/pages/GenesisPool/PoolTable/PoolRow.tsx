import { Trans } from '@lingui/macro'
import { Box, CircularProgress } from '@mui/material'
import { formatNumber, NumberType } from '@uniswap/conedison/format'
import { NunitoText } from 'components/CustomFonts/Nunito'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import { MouseoverTooltip } from 'components/Tooltip'
import { CHAIN_NAME_TO_CHAIN_ID, validateUrlChainParam } from 'graphql/data/util'
import { useCurrency } from 'hooks/Tokens'
import { useAtomValue } from 'jotai/utils'
import { InfoIcon } from 'pages/GenesisPoolDetails/StatDetails'
import { CSSProperties, ForwardedRef, forwardRef, ReactNode } from 'react'
import { ArrowDown, ArrowUp, CheckCircle, Info, XCircle } from 'react-feather'
import { Link, useParams } from 'react-router-dom'
import styled, { css, useTheme } from 'styled-components/macro'
import { ClickableStyle } from 'theme'

import {
  LARGE_MEDIA_BREAKPOINT,
  MAX_WIDTH_MEDIA_BREAKPOINT,
  MEDIUM_MEDIA_BREAKPOINT,
  SMALL_MEDIA_BREAKPOINT,
} from '../constant'
import { GenesisPoolSortMethod, sortAscendingAtom, sortMethodAtom, useSetSortMethod } from '../state'
import { CellType } from './PoolTable'

const Cell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
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

const NameCell = styled(Cell)`
  justify-content: flex-start;
  padding: 0px 8px;
  min-width: 240px;
  gap: 8px;
`

const TvlCell = styled(DataCell)`
  justify-content: center;
  @media only screen and (max-width: ${MEDIUM_MEDIA_BREAKPOINT}) {
    display: none;
  }
`

const DepositCell = styled(DataCell)`
  justify-content: center;
  @media only screen and (max-width: ${MEDIUM_MEDIA_BREAKPOINT}) {
    display: none;
  }
`

const AprCell = styled(DataCell)`
  justify-content: center;
`

const TotalDepositCell = styled(DataCell)`
  padding-right: 8px;
  @media only screen and (max-width: ${MEDIUM_MEDIA_BREAKPOINT}) {
    display: none;
  }
`

const PendingRewardsCell = styled(DataCell)`
  padding-right: 8px;
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
  grid-template-columns: 1fr 3fr 3fr 3fr 4fr 4fr;
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
    grid-template-columns: 1fr 6.5fr 4.5fr 4.5fr 4.5fr 4.5fr 1.7fr;
  }

  @media only screen and (max-width: ${LARGE_MEDIA_BREAKPOINT}) {
    grid-template-columns: 1fr 7.5fr 4.5fr 4.5fr 4.5fr 1.7fr;
  }

  @media only screen and (max-width: ${MEDIUM_MEDIA_BREAKPOINT}) {
    grid-template-columns: 1fr 10fr 5fr 5fr 1.2fr;
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

const StyledLink = styled(Link)`
  text-decoration: none;
`

const PoolName = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  .pool-info-root {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .symbol-merge {
    display: flex;
    color: black;
    font-size: 16px;
    font-weight: 600;
    align-items: center;
  }
  .pool-info {
    display: flex;
    gap: 5px;
    align-items: center;
  }
  .bounded-dexname {
    display: flex;
    padding: 3px 10px;
    background: ${({ theme }) => theme.derpGray2};
    color: #000 !important;
    font-size: 14px;
    font-weight: 600;
    border-radius: 8px;
  }
  .fee-tier {
    display: flex;
    justify-content: center;
    padding: 1px 8px;
    background-color: ${({ theme }) => theme.derpPurp2};
    font-size: 14px;
    font-weight: 600;
    color: white !important;
    border-radius: 100px;
    margin-left: 8px;
  }
`

const ClickableContent = styled.div`
  display: flex;
  text-decoration: none;
  color: ${({ theme }) => theme.textPrimary};
  align-items: center;
  cursor: pointer;
`

const DeltaText = styled.span<{ delta: number | undefined }>`
  font-weight: 700;
`

const IconStyled = styled(NunitoText)`
  margin: auto;
  font-size: 16px;
  font-weight: 700;
`

const HEADER_DESCRIPTIONS: Record<GenesisPoolSortMethod, ReactNode | undefined> = {
  [GenesisPoolSortMethod.TOTAL_VALUE_LOCKED]: undefined,
  [GenesisPoolSortMethod.DEPOSITS]: <Trans>Deposited is the indicator of whether you deposited into the pool.</Trans>,
  [GenesisPoolSortMethod.APR]: (
    <Trans>APR is the annual percentage rate of return for the pool which included airdrop rewards and LP fees.</Trans>
  ),
  [GenesisPoolSortMethod.TOTAL_DEPOSIT]: (
    <Trans>Total Deposit is the USD value of the LP you deposited into the pool</Trans>
  ),
  [GenesisPoolSortMethod.PENDING_REWARDS]: (
    <Trans>Pending Rewards is the estimated rewards in USD value you are getting from the pool</Trans>
  ),
}

function HeaderCell({
  category,
}: {
  category: GenesisPoolSortMethod // TODO: change this to make it work for trans
}) {
  const theme = useTheme()
  const sortAscending = useAtomValue(sortAscendingAtom)
  const handleSortCategory = useSetSortMethod(category)
  const sortMethod = useAtomValue(sortMethodAtom)

  const description = HEADER_DESCRIPTIONS[category]

  return (
    <HeaderCellWrapper onClick={handleSortCategory}>
      {sortMethod === category && (
        <>
          {sortAscending ? (
            <ArrowUp size={20} strokeWidth={1.8} color={theme.accentActive} />
          ) : (
            <ArrowDown size={20} strokeWidth={1.8} color={theme.accentActive} />
          )}
        </>
      )}
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

function PoolRow({
  header,
  poolInfo,
  tvl,
  deposits,
  apr,
  totalDeposit,
  pendingRewards,
  ...params
}: {
  header: boolean
  loading?: boolean
  poolInfo?: ReactNode
  tvl?: ReactNode
  deposits?: ReactNode
  apr?: ReactNode
  totalDeposit?: ReactNode
  pendingRewards?: ReactNode
  style?: CSSProperties
}) {
  const rowCells = (
    <>
      <NameCell data-testid="name-cell">
        <NunitoText size="lg" weight={700}>
          {poolInfo}
        </NunitoText>
      </NameCell>
      <TvlCell data-testid="tvl-cell" sortable={header}>
        <NunitoText size="lg" weight={700}>
          {tvl}
        </NunitoText>
      </TvlCell>
      <DepositCell data-testid="deposit-cell" sortable={header}>
        {header && (
          <NunitoText size="lg" weight={700}>
            {deposits}
          </NunitoText>
        )}
        {!header && <IconStyled>{deposits}</IconStyled>}
      </DepositCell>
      <AprCell data-testid="apr-cell" sortable={header}>
        <NunitoText size="lg" weight={700}>
          {apr}
        </NunitoText>
      </AprCell>
      <TotalDepositCell data-testid="total-deposit-cell" sortable={header}>
        <NunitoText size="lg" weight={700}>
          {totalDeposit}
        </NunitoText>
      </TotalDepositCell>
      <PendingRewardsCell data-testid="pending-rewards-cell" sortable={header}>
        <NunitoText size="lg" weight={700}>
          {pendingRewards}
        </NunitoText>
      </PendingRewardsCell>
    </>
  )

  if (header) return <StyledHeaderRow data-testid="header-row">{rowCells}</StyledHeaderRow>
  return <StyledPoolRow {...params}>{rowCells}</StyledPoolRow>
}

// eslint-disable-next-line import/no-unused-modules
export function HeaderRow() {
  return (
    <PoolRow
      header={true}
      poolInfo={<Trans>Pool Name</Trans>}
      tvl={<HeaderCell category={GenesisPoolSortMethod.TOTAL_VALUE_LOCKED} />}
      deposits={<HeaderCell category={GenesisPoolSortMethod.DEPOSITS} />}
      apr={<HeaderCell category={GenesisPoolSortMethod.APR} />}
      totalDeposit={<HeaderCell category={GenesisPoolSortMethod.TOTAL_DEPOSIT} />}
      pendingRewards={<HeaderCell category={GenesisPoolSortMethod.PENDING_REWARDS} />}
    />
  )
}

interface LoadedRowProps {
  poolListIndex: number
  poolListLength: number
  pool: NonNullable<any>
  sortRank?: number
}

function StakedPool({ pool }: { pool: NonNullable<any> }) {
  // console.log(pool)
  if (pool.staked) {
    return <CheckCircle size={20} color="#40B66B"></CheckCircle>
  } else {
    return <XCircle size={20} color="#FD766B"></XCircle>
  }
}

function formatDelta(delta: number | null | undefined) {
  // Null-check not including zero
  if (delta === null || delta === undefined || delta === Infinity || isNaN(delta)) {
    return '-'
  }
  const formattedDelta = Math.abs(delta).toFixed(2) + '%'
  return formattedDelta
}

// eslint-disable-next-line react/display-name
export const LoadedRow = forwardRef((props: LoadedRowProps, ref: ForwardedRef<HTMLDivElement>) => {
  const { pool } = props
  const filterNetwork = validateUrlChainParam(useParams<{ chainName?: string }>().chainName?.toUpperCase())
  const chainId = CHAIN_NAME_TO_CHAIN_ID[filterNetwork]

  const delta = Number(pool.apr)
  const formattedDelta = formatDelta(delta)

  return (
    <div ref={ref} data-testid={`genesis-pool-table-row-${pool.address}`}>
      <StyledLink to={`/genesis-pools/${filterNetwork.toLowerCase()}/${pool.address}`}>
        <PoolRow
          header={false}
          poolInfo={
            <PoolName>
              <DoubleCurrencyLogo
                margin={true}
                currency0={useCurrency(pool.token0.address, chainId)}
                currency1={useCurrency(pool.token1.address, chainId)}
                size={30}
              />
              <div className="pool-info-root">
                <div className="symbol-merge">
                  <NunitoText size="lg" weight={700}>
                    {pool.token0.symbol}/{pool.token1.symbol}
                  </NunitoText>
                  <div className="fee-tier">
                    <NunitoText size="sm" weight={700}>
                      {pool.feeTier / 10000 === 1 ? '1.0' : pool.feeTier / 10000}
                    </NunitoText>
                  </div>
                </div>
                <div className="pool-info">
                  <div className="bounded-dexname">
                    <NunitoText size="md" weight={700}>
                      Earn DERP + xDERP
                    </NunitoText>
                  </div>
                </div>
              </div>
            </PoolName>
          }
          tvl={
            <ClickableContent>
              <NunitoText size="lg" weight={700}>
                {formatNumber(pool.tvlUSD, NumberType.PortfolioBalance)}
              </NunitoText>
            </ClickableContent>
          }
          deposits={
            <ClickableContent>
              <StakedPool pool={pool} />
            </ClickableContent>
          }
          apr={
            <ClickableContent>
              <DeltaText delta={delta}>
                <NunitoText size="lg" weight={700}>
                  {formattedDelta}
                </NunitoText>
              </DeltaText>
            </ClickableContent>
          }
          totalDeposit={
            <ClickableContent>
              <NunitoText size="lg" weight={700}>
                {formatNumber(pool.userDeposit, NumberType.PortfolioBalance)}
              </NunitoText>
            </ClickableContent>
          }
          pendingRewards={
            <ClickableContent>
              <NunitoText size="lg" weight={700}>
                {pool.pendingRewardsUSD === CellType.LOADING ? (
                  <CircularProgress color="primary" size={24} />
                ) : pool.pendingRewardsUSD === CellType.INPROGRESS ? (
                  <Box display="flex" alignItems="center" gap="4px">
                    <NunitoText size="lg">In Progress</NunitoText>
                    <MouseoverTooltip text={<Trans>Result is still updating</Trans>} placement="auto">
                      <InfoIconContainer>
                        <InfoIcon size={14} />
                      </InfoIconContainer>
                    </MouseoverTooltip>
                  </Box>
                ) : (
                  <>{formatNumber(pool.pendingRewardsUSD, NumberType.PortfolioBalance) /* pool.userPendingRewards */}</>
                )}
              </NunitoText>
            </ClickableContent>
          }
        ></PoolRow>
      </StyledLink>
    </div>
  )
})
