import { Trans } from '@lingui/macro'
import { formatNumber, NumberType } from '@uniswap/conedison/format'
import { NunitoText } from 'components/CustomFonts/Nunito'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import { MouseoverTooltip } from 'components/Tooltip'
import { SparklineMap } from 'graphql/data/TopTokens'
import { CHAIN_NAME_TO_CHAIN_ID, validateUrlChainParam } from 'graphql/data/util'
import { useCurrency } from 'hooks/Tokens'
import { PoolData } from 'hooks/usePoolDatas'
import { useAtomValue } from 'jotai/utils'
import { ForwardedRef, forwardRef } from 'react'
import { CSSProperties, ReactNode } from 'react'
import { ArrowDown, ArrowUp, Info } from 'react-feather'
import { Link, useParams } from 'react-router-dom'
import styled, { css, useTheme } from 'styled-components/macro'
import { ClickableStyle } from 'theme'

import {
  LARGE_MEDIA_BREAKPOINT,
  MAX_WIDTH_MEDIA_BREAKPOINT,
  MEDIUM_MEDIA_BREAKPOINT,
  SMALL_MEDIA_BREAKPOINT,
} from './constants'
import { LoadingBubble } from './loading'
import { DeltaText, formatDelta, getDeltaArrow } from './PriceChart'
import {
  filterStringAtom,
  filterTimeAtom,
  PoolSortMethod,
  sortAscendingAtom,
  sortMethodAtom,
  useSetSortMethod,
} from './state'

const Cell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`
const StyledTokenRow = styled.div<{
  first?: boolean
  last?: boolean
  loading?: boolean
}>`
  font-size: 16px;
  font-weight: 700;
  background-color: transparent;
  display: grid;
  font-size: 16px;
  // grid-template-columns: 1fr 7fr 4fr 4fr 4fr 4fr 5fr;
  grid-template-columns: 4fr 4fr 4fr 4fr 4fr;
  line-height: 24px;
  max-width: ${MAX_WIDTH_MEDIA_BREAKPOINT};
  min-width: 390px;
  ${({ first, last }) => css`
    height: ${first || last ? '72px' : '64px'};
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
  }
  .pool-info {
    display: flex;
    gap: 5px;
    align-items: center;
  }
  .bounded-dexname {
    display: flex;
    padding: 3px 10px;
    background-color: ${({ theme }) => theme.derpGray1};
    color: white !important;
    font-size: 14px;
    font-weight: 600;
    border-radius: 8px;
  }
  .fee-tier {
    display: flex;
    justify-content: center;
    padding: 3px 10px;
    background-color: ${({ theme }) => theme.derpGray2};
    font-size: 14px;
    font-weight: 600;
    color: black !important;
    border-radius: 8px;
    width: 63px;
  }
`

const ClickableContent = styled.div`
  display: flex;
  text-decoration: none;
  color: ${({ theme }) => theme.textPrimary};
  align-items: center;
  cursor: pointer;
`
const ClickableName = styled(ClickableContent)`
  gap: 8px;
  max-width: 100%;
`
const StyledHeaderRow = styled(StyledTokenRow)`
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
    background-color: #000;
  }

  @media only screen and (max-width: ${SMALL_MEDIA_BREAKPOINT}) {
    justify-content: space-between;
  }
`

const ListNumberCell = styled(Cell)<{ header: boolean }>`
  color: ${({ theme }) => theme.textSecondary};
  min-width: 32px;
  font-size: 14px;

  @media only screen and (max-width: ${SMALL_MEDIA_BREAKPOINT}) {
    display: none;
  }
`
const DataCell = styled(Cell)<{ sortable: boolean }>`
  justify-content: flex-end;
  min-width: 80px;
  min-height: 46px;
  user-select: ${({ sortable }) => (sortable ? 'none' : 'unset')};
  transition: ${({
    theme: {
      transition: { duration, timing },
    },
  }) => css`background-color ${duration.medium} ${timing.ease}`};
`
const TvlCell = styled(DataCell)`
  padding-right: 8px;
  @media only screen and (max-width: ${MEDIUM_MEDIA_BREAKPOINT}) {
    display: none;
  }
`
const NameCell = styled(Cell)`
  justify-content: flex-start;
  padding: 0px 8px;
  min-width: 240px;
  gap: 8px;
`
const PriceCell = styled(DataCell)`
  padding-right: 8px;
`
const PercentChangeCell = styled(DataCell)`
  padding-right: 8px;
  @media only screen and (max-width: ${SMALL_MEDIA_BREAKPOINT}) {
    display: none;
  }
`
const PercentChangeInfoCell = styled(Cell)`
  display: none;

  @media only screen and (max-width: ${SMALL_MEDIA_BREAKPOINT}) {
    display: flex;
    justify-content: flex-end;
    color: ${({ theme }) => theme.textSecondary};
    font-size: 12px;
    line-height: 16px;
  }
`
const PriceInfoCell = styled(Cell)`
  justify-content: flex-end;
  flex: 1;

  @media only screen and (max-width: ${SMALL_MEDIA_BREAKPOINT}) {
    flex-direction: column;
    align-items: flex-end;
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
const SparkLineCell = styled(Cell)`
  padding: 0px 24px;
  min-width: 120px;

  @media only screen and (max-width: ${MAX_WIDTH_MEDIA_BREAKPOINT}) {
    display: none;
  }
`
const SparkLine = styled(Cell)`
  width: 124px;
  height: 42px;
`
const StyledLink = styled(Link)`
  text-decoration: none;
`
const TokenInfoCell = styled(Cell)`
  gap: 8px;
  line-height: 24px;
  font-size: 16px;
  max-width: inherit;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media only screen and (max-width: ${SMALL_MEDIA_BREAKPOINT}) {
    justify-content: flex-start;
    flex-direction: column;
    gap: 0px;
    width: max-content;
    font-weight: 500;
  }
`
const TokenName = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
`
const TokenSymbol = styled(Cell)`
  color: ${({ theme }) => theme.textTertiary};
  text-transform: uppercase;

  @media only screen and (max-width: ${SMALL_MEDIA_BREAKPOINT}) {
    font-size: 12px;
    height: 16px;
    justify-content: flex-start;
    width: 100%;
  }
`
const VolumeCell = styled(DataCell)`
  padding-right: 8px;
  @media only screen and (max-width: ${LARGE_MEDIA_BREAKPOINT}) {
    display: none;
  }
`
const SmallLoadingBubble = styled(LoadingBubble)`
  width: 25%;
`
const MediumLoadingBubble = styled(LoadingBubble)`
  width: 65%;
`
const LongLoadingBubble = styled(LoadingBubble)`
  width: 90%;
`
const IconLoadingBubble = styled(LoadingBubble)`
  border-radius: 50%;
  width: 24px;
`
export const SparkLineLoadingBubble = styled(LongLoadingBubble)`
  height: 4px;
`

const InfoIconContainer = styled.div`
  margin-left: 2px;
  display: flex;
  align-items: center;
  cursor: help;
`

const RangedDeltas = styled.div`
  display: flex;
  gap: 4px;
  color: #40b66b;
`

export const HEADER_DESCRIPTIONS: Record<PoolSortMethod, ReactNode | undefined> = {
  [PoolSortMethod.TVL]: (
    <Trans>
      Total value locked (TVL) is the aggregate amount of the asset available across all DerpDEX liquidity pools.
    </Trans>
  ),
  [PoolSortMethod.VOL24H]: <Trans>The volume of the asset that has been traded on DerpDEX (24 hours).</Trans>,
  [PoolSortMethod.VOL7D]: (
    <Trans>The volume of the asset that has been traded on DerpDEX during the past 7 days.</Trans>
  ),
  [PoolSortMethod.FEES24H]: undefined,
  [PoolSortMethod.APR]: undefined,
}

/* Get singular header cell for header row */
function HeaderCell({
  category,
}: {
  category: PoolSortMethod // TODO: change this to make it work for trans
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
      {category}
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

const ConstructedInfoBox = styled.div`
  font-size: 14px;
  font-weight: 600;

  display: flex;
  flex-direction: column;

  gap: 12px;
  padding: 12px;
  .flex-row-text {
    display: flex;
    gap: 6px;
  }

  .is-focused {
    padding-bottom: 0.8em;
    border-bottom: 1px solid #000;
    font-weight: 800 !important;
    font-size: 15px !important;
    * {
      font-weight: 800 !important;
    }
  }
`

/* Token Row: skeleton row component */
function PoolRow({
  header,
  listNumber,
  poolName,
  fees24H,
  percentChange,
  tvl,
  vol24H,
  vol7D,
  sparkLine,
  ...rest
}: {
  first?: boolean
  header: boolean
  listNumber: ReactNode
  loading?: boolean
  tvl: ReactNode
  fees24H?: ReactNode
  percentChange: ReactNode
  sparkLine?: ReactNode
  poolName: ReactNode
  vol24H: ReactNode
  vol7D: ReactNode
  last?: boolean
  style?: CSSProperties
}) {
  const rowCells = (
    <>
      {/* <ListNumberCell header={header}>{listNumber}</ListNumberCell> */}
      <NameCell data-testid="name-cell">{poolName}</NameCell>
      <TvlCell data-testid="tvl-cell" sortable={header}>
        {tvl}
      </TvlCell>
      <VolumeCell data-testid="volume-cell" sortable={header}>
        {vol24H}
      </VolumeCell>
      <VolumeCell data-testid="volume-cell" sortable={header}>
        {vol7D}
      </VolumeCell>
      <PercentChangeCell data-testid="percent-change-cell" sortable={header}>
        {percentChange}
      </PercentChangeCell>
      {/* <SparkLineCell>{sparkLine}</SparkLineCell> */}
    </>
  )
  if (header) return <StyledHeaderRow data-testid="header-row">{rowCells}</StyledHeaderRow>
  return <StyledTokenRow {...rest}>{rowCells}</StyledTokenRow>
}

/* Header Row: top header row component for table */
export function HeaderRow() {
  return (
    <PoolRow
      header={true}
      listNumber="#"
      poolName={<Trans>Name</Trans>}
      tvl={<HeaderCell category={PoolSortMethod.TVL} />}
      vol24H={<HeaderCell category={PoolSortMethod.VOL24H} />}
      vol7D={<HeaderCell category={PoolSortMethod.VOL7D} />}
      // fees24H={<HeaderCell category={PoolSortMethod.FEES24H} />}
      percentChange={<HeaderCell category={PoolSortMethod.APR} />}
      sparkLine={null}
    />
  )
}

/* Loading State: row component with loading bubbles */
export function LoadingRow(props: { first?: boolean; last?: boolean }) {
  return (
    <PoolRow
      header={false}
      listNumber={<SmallLoadingBubble />}
      loading
      poolName={
        <>
          <IconLoadingBubble />
          <MediumLoadingBubble />
        </>
      }
      fees24H={<MediumLoadingBubble />}
      percentChange={<LoadingBubble />}
      tvl={<LoadingBubble />}
      vol24H={<LoadingBubble />}
      vol7D={<LoadingBubble />}
      // sparkLine={<SparkLineLoadingBubble />}
      {...props}
    />
  )
}

interface LoadedRowProps {
  poolListIndex: number
  poolListLength: number
  pool: NonNullable<PoolData>
  sparklineMap?: SparklineMap
  sortRank?: number
}

/* Loaded State: row component with token information */
export const LoadedRow = forwardRef((props: LoadedRowProps, ref: ForwardedRef<HTMLDivElement>) => {
  const { poolListIndex, poolListLength, pool, sortRank } = props
  const filterString = useAtomValue(filterStringAtom)

  const filterNetwork = validateUrlChainParam(useParams<{ chainName?: string }>().chainName?.toUpperCase())
  const chainId = CHAIN_NAME_TO_CHAIN_ID[filterNetwork]
  const timePeriod = useAtomValue(filterTimeAtom)
  const delta = Number(pool.apr)
  const arrow = getDeltaArrow(delta)
  const smallArrow = getDeltaArrow(delta, 14)
  const formattedDelta = formatDelta(delta)
  const formattedLpFeeDelta = formatDelta(Number(pool?.lpFee))

  const formattedRangeDelta = [formatDelta(Number(pool.rangedApr?.[0])), formatDelta(Number(pool.rangedApr?.[1]))]
  const genesisAdditionalAPR = formatDelta(pool.additionalAPR)
  const isGenesisPool = pool.isGenesisPool

  const ConstructedInfo = () => {
    return (
      <ConstructedInfoBox>
        <NunitoText className="flex-row-text is-focused">
          <Trans>Combined APR:</Trans>
          <DeltaText delta={Number(pool.rangedApr?.[1])}>{formattedRangeDelta[1]}</DeltaText>
        </NunitoText>
        <NunitoText className="flex-row-text">
          <Trans>Genesis Pool APR:</Trans>
          <DeltaText delta={pool.additionalAPR}>{genesisAdditionalAPR}</DeltaText>
        </NunitoText>
        <NunitoText className="flex-row-text">
          <Trans>LP Fee APR:</Trans>
          <DeltaText delta={pool.lpFee}>{formattedLpFeeDelta}</DeltaText>
        </NunitoText>
      </ConstructedInfoBox>
    )
  }

  const currency0 = useCurrency(pool.token0.address, chainId)
  const currency1 = useCurrency(pool.token1.address, chainId)

  // TODO: currency logo sizing mobile (32px) vs. desktop (24px)
  return (
    <div ref={ref} data-testid={`pool-table-row-${pool.address}`}>
      <StyledLink
        // to={getTokenDetailsURL(token)}
        to={`/add/${pool.token0.address}/${pool.token1.address}/${pool.feeTier}`}
      >
        <PoolRow
          header={false}
          listNumber={sortRank}
          poolName={
            <PoolName>
              {/* <QueryTokenLogo token={token} /> */}
              <DoubleCurrencyLogo
                margin={true}
                currency0={useCurrency(pool.token0.address, chainId)}
                currency1={useCurrency(pool.token1.address, chainId)}
                size={30}
              />
              <div className="pool-info-root">
                <div className="symbol-merge">
                  {currency0?.symbol}/{currency1?.symbol}
                </div>
                <div className="pool-info">
                  <div className="bounded-dexname">DerpDEX</div>
                  <div className="fee-tier">{pool.feeTier / 10000}</div>
                </div>
              </div>
            </PoolName>
          }
          // fees24H={
          //   <ClickableContent>
          //     <PriceInfoCell>
          //       {formatUSDPrice(pool.fees24H)} //! Not implemented on existing
          //       <PercentChangeInfoCell>
          //         <ArrowCell>{smallArrow}</ArrowCell>
          //         <DeltaText delta={delta}>{formattedDelta}</DeltaText>
          //       </PercentChangeInfoCell>
          //     </PriceInfoCell>
          //   </ClickableContent>
          // }
          tvl={<ClickableContent>{formatNumber(pool.tvlUSD, NumberType.FiatTokenStats)}</ClickableContent>}
          // tvl={<ClickableContent>{formatNumber(pool.tvlUSDChange, NumberType.FiatTokenStats)}</ClickableContent>}
          vol24H={<ClickableContent>{formatNumber(pool.volumeUSD, NumberType.FiatTokenStats)}</ClickableContent>}
          // vol24H={<ClickableContent>{formatNumber(pool.volumeUSDChange, NumberType.FiatTokenStats)}</ClickableContent>}
          vol7D={<ClickableContent>{formatNumber(pool.volumeUSDWeek, NumberType.FiatTokenStats)}</ClickableContent>}
          // Being referred as APY
          percentChange={
            <ClickableContent>
              {isGenesisPool ? (
                <>
                  <RangedDeltas>
                    {/* <DeltaText delta={delta}>{formattedRangeDelta[0]}</DeltaText>~ */}
                    <DeltaText delta={delta}>{formattedRangeDelta[1]}</DeltaText>
                  </RangedDeltas>
                  <MouseoverTooltip text={<ConstructedInfo />} placement="right">
                    <InfoIconContainer>
                      <Info size={14} />
                    </InfoIconContainer>
                  </MouseoverTooltip>
                </>
              ) : (
                <DeltaText delta={delta}>{formattedDelta}</DeltaText>
              )}
            </ClickableContent>
          }
          // sparkLine={ //! Not implemented
          //   <SparkLine>
          //     <ParentSize>
          //       {({ width, height }) =>
          //         props.sparklineMap && (
          //           <SparklineChart
          //             width={width}
          //             height={height}
          //             tokenData={token}
          //             pricePercentChange={token.market?.pricePercentChange?.value}
          //             sparklineMap={props.sparklineMap}
          //           />
          //         )
          //       }
          //     </ParentSize>
          //   </SparkLine>
          // }
          first={poolListIndex === 0}
          last={poolListIndex === poolListLength - 1}
        />
      </StyledLink>
    </div>
  )
})

LoadedRow.displayName = 'LoadedRow'
