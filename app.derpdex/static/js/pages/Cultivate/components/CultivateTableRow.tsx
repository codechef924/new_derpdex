/* eslint-disable react/display-name */
import { Trans } from '@lingui/macro'
import { formatNumber, NumberType } from '@uniswap/conedison/format'
import { Currency } from '@uniswap/sdk-core'
import { useWeb3React } from '@web3-react/core'
import { useToggleAccountDrawer } from 'components/AccountDrawer'
import { GloriaText } from 'components/CustomFonts/GloriaHallelujah'
import { NunitoText } from 'components/CustomFonts/Nunito'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import CurrencyLogo from 'components/Logo/CurrencyLogo'
import { MouseoverTooltip, TooltipSize } from 'components/Tooltip'
import { SupportedChainId } from 'constants/chains'
import { SparklineMap } from 'graphql/data/TopTokens'
import { CHAIN_NAME_TO_CHAIN_ID, validateUrlChainParam } from 'graphql/data/util'
import { useCurrency } from 'hooks/Tokens'
import { CultivatePoolData, PositionFields } from 'hooks/useCultivatePoolDatas'
import { INCENTIVE_KEY, incentiveKeysAtom, STAKING_POOL_STATE } from 'hooks/useWhitelistedPoolAddresses'
import { useAtomValue } from 'jotai/utils'
import { ForwardedRef, forwardRef, useMemo, useState } from 'react'
import { CSSProperties, ReactNode } from 'react'
import { ArrowDown, ArrowUp, Info } from 'react-feather'
import { Link, useParams } from 'react-router-dom'
import styled, { css, useTheme } from 'styled-components/macro'
import { ClickableStyle } from 'theme'
import { switchChain } from 'utils/switchChain'

import {
  LARGE_MEDIA_BREAKPOINT,
  MAX_WIDTH_MEDIA_BREAKPOINT,
  MEDIUM_MEDIA_BREAKPOINT,
  SMALL_MEDIA_BREAKPOINT,
} from '../constants'
import { ComponentHooks, stakedTVL } from '../hooks/ComponentHooks'
import { DerivedPositions, Position, useDerivedStakedPositions } from '../hooks/useDerivedStakedPositions'
import { earnedAdditionalAtom, earnedAtom, useGetCombinedEarnedStakings } from '../hooks/useGetEarnedStaking'
import { useGetMultipliers } from '../hooks/useGetMultipliers'
import { useGetStakingFarmApr } from '../hooks/useGetStakingAPR'
import { useGetStakingPoolStatus } from '../hooks/useGetStakingPoolStatus'
import {
  CultivatePoolSortMethod,
  derivedPositionsAtom,
  filterTimeAtom,
  sortAscendingAtom,
  sortMethodAtom,
  useCultivateSetSortMethod,
} from '../state/search.state'
import { ColFlex, CultivateButton } from '../stylings'
import { InnerPositionItems } from './InnerPositionsItem'
import { LoadingBubble } from './loading'
import { PreviewPools } from './PreviewWrapper'
import { DeltaText, formatDelta, getDeltaArrow } from './PriceChart'
import { stakingView } from './Table'

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
  grid-template-columns: 3.5fr 2fr 2.5fr 2fr 2fr 2fr 2fr;
  line-height: 24px;
  max-width: 100%;
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

    gap: 8px;
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

const MultiplierCell = styled(DataCell)`
  padding-right: 8px;
  @media only screen and (max-width: ${SMALL_MEDIA_BREAKPOINT}) {
    display: none;
  }
`

const AvailablePositionsCell = styled(DataCell)`
  padding-right: 8px;
  @media only screen and (max-width: ${SMALL_MEDIA_BREAKPOINT}) {
    display: none;
  }
`

const StakedPositionsCell = styled(DataCell)`
  padding-right: 8px;
  @media only screen and (max-width: ${SMALL_MEDIA_BREAKPOINT}) {
    display: none;
  }
`

const EarnedCell = styled(DataCell)`
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

const SwitchNetworkContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-end;
  padding 16px;
`

export const HEADER_DESCRIPTIONS: Record<CultivatePoolSortMethod, ReactNode | undefined> = {
  [CultivatePoolSortMethod.TVL]: (
    <Trans>
      Total value locked (TVL) is the aggregate amount of the asset available across all DerpDEX liquidity pools.
    </Trans>
  ),
  [CultivatePoolSortMethod.VOL24H]: <Trans>The volume of the asset that has been traded on DerpDEX (24 hours).</Trans>,
  [CultivatePoolSortMethod.VOL7D]: (
    <Trans>The volume of the asset that has been traded on DerpDEX during the past 7 days.</Trans>
  ),
  [CultivatePoolSortMethod.FEES24H]: undefined,
  [CultivatePoolSortMethod.APR]: undefined,
  [CultivatePoolSortMethod.EARNED]: <Trans>Earned xDERP</Trans>,
  [CultivatePoolSortMethod.MULTIPLIER]: <Trans>Multiplier for boosted pair</Trans>,
  [CultivatePoolSortMethod.AVAILABLE_POSITIONS]: <Trans>Available LP positions for the pair</Trans>,
  [CultivatePoolSortMethod.STAKED_POSITIONS]: <Trans>Staked LP on Cultivate</Trans>,
}

/* Get singular header cell for header row */
function HeaderCell({
  category,
}: {
  category: CultivatePoolSortMethod // TODO: change this to make it work for trans
}) {
  const theme = useTheme()
  const sortAscending = useAtomValue(sortAscendingAtom)
  const handleSortCategory = useCultivateSetSortMethod(category)
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
  overflow: hidden;

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
    font-weight: 800 !important;
    font-size: 15px !important;
    * {
      font-weight: 800 !important;
    }
  }

  .divider {
    width: 100%;
    height: 1px;
    background: black;
  }
`

const RowExpandable = styled.div`
  cursor: pointer;
`

type RowExpandableOptns = {
  isExpanded: boolean
}
const ExpandablePositionsWrapper = styled.div`
  // padding: 8px 8px;
  background: rgba(245, 245, 245, 1);
  min-height: 80px;
  border-radius: 8px;
`

const SwitchNetworkButton = styled(CultivateButton)`
  max-width: 230px;
  font-size: 16px;
`

const InnerWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 4fr;
  grid-auto-flow: column;
  width: 100%;
  gap: 18px;
`

const ConnectWalletPanel = styled.div`
  position: relative;
  display: grid;
  grid-auto-flow: column;
  width: 100%;
  gap: 26px;

  padding: 22px;
`

const InternalView = styled(ColFlex)`
  justify-content: center;
  align-items: center;
  border-radius: 16px;
  border: 2px solid #000;

  background: #fff;

  box-shadow: 2px 2px 0px 0px #000;
  min-height: 200px;
  padding: 22px;
`

const DashedBorder = styled(ColFlex)`
  justify-content: center;
  align-items: center;
  border: 2px dashed #afbdc8;
  border-radius: 16px;
  height: 100%;
`
type BtnOpts = {
  isMaximized?: boolean
}
const ConnectButton = styled(CultivateButton)<BtnOpts>`
  max-width: ${({ isMaximized }) => (isMaximized ? 'unset' : '230px')};
  padding: 6px 6px;
  font-size: 18px;
  box-shadow: 3px 3px 0px 0px #000;
  border-radius: 16px;
  border: 2px solid #344d73;
`

const RewardGrid = styled.div`
  display: grid;
  grid-template-columns: 0.3fr 1fr;
  align-items: center;
  gap: 16px;
  width: 120px;
`

const InlineText = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
`

/* Token Row: skeleton row component */
function PoolRow({
  header,
  listNumber,
  poolName,
  fees24H,
  percentChange,
  availablePositions,
  stakedPositions,
  multiplier,
  earned,
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
  availablePositions: ReactNode
  stakedPositions: ReactNode
  multiplier: ReactNode
  earned: ReactNode
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
      {/* <VolumeCell data-testid="volume-cell" sortable={header}>
        {vol24H}
      </VolumeCell>
      <VolumeCell data-testid="volume-cell" sortable={header}>
        {vol7D}
      </VolumeCell> */}
      <EarnedCell data-testid="percent-change-cell" sortable={header}>
        {earned}
      </EarnedCell>

      <PercentChangeCell data-testid="percent-change-cell" sortable={header}>
        {percentChange}
      </PercentChangeCell>

      <MultiplierCell data-testid="percent-change-cell" sortable={header}>
        {multiplier}
      </MultiplierCell>

      <AvailablePositionsCell data-testid="percent-change-cell" sortable={header}>
        {availablePositions}
      </AvailablePositionsCell>

      <StakedPositionsCell data-testid="percent-change-cell" sortable={header}>
        {stakedPositions}
      </StakedPositionsCell>
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
      tvl={<HeaderCell category={CultivatePoolSortMethod.TVL} />}
      vol24H={<HeaderCell category={CultivatePoolSortMethod.VOL24H} />}
      vol7D={<HeaderCell category={CultivatePoolSortMethod.VOL7D} />}
      // fees24H={<HeaderCell category={PoolSortMethod.FEES24H} />}
      percentChange={<HeaderCell category={CultivatePoolSortMethod.APR} />}
      multiplier={<HeaderCell category={CultivatePoolSortMethod.MULTIPLIER} />}
      earned={<HeaderCell category={CultivatePoolSortMethod.EARNED} />}
      availablePositions={<HeaderCell category={CultivatePoolSortMethod.AVAILABLE_POSITIONS} />}
      stakedPositions={<HeaderCell category={CultivatePoolSortMethod.STAKED_POSITIONS} />}
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
      multiplier={<LoadingBubble />}
      availablePositions={<LoadingBubble />}
      stakedPositions={<LoadingBubble />}
      earned={<LoadingBubble />}
      // sparkLine={<SparkLineLoadingBubble />}
      {...props}
    />
  )
}

interface LoadedRowProps {
  poolListIndex: number
  poolListLength: number
  pool: NonNullable<CultivatePoolData>
  sparklineMap?: SparklineMap
  sortRank?: number
  tableOption: string | STAKING_POOL_STATE
  incentiveKey: INCENTIVE_KEY
  chainId: number | SupportedChainId
}

const CacheReward = new Map()

const ExpandablePositions = ({
  derivedPositions,
  positionItems,
  currencyPairInfo,
  poolBaseAPR,
  chainId,
  incentiveId,
  isPaused,
}: {
  derivedPositions: DerivedPositions | null
  positionItems: PositionFields[]
  currencyPairInfo: {
    feeTier: number
    pair: (Currency | null | undefined)[]
  }
  poolBaseAPR: string
  chainId: number | SupportedChainId
  incentiveId: string
  isPaused: boolean
}) => {
  const { chainId: connectedChainId, connector, account } = useWeb3React()

  const changeNetworkById: (_chainId: SupportedChainId) => Promise<void> = async (_chainId: SupportedChainId) => {
    await switchChain(connector, _chainId)
  }

  const toggleWalletDrawer = useToggleAccountDrawer()

  return (
    <>
      {connectedChainId !== chainId ? (
        <SwitchNetworkContainer>
          <SwitchNetworkButton onClick={() => changeNetworkById(chainId)}>Switch network</SwitchNetworkButton>
        </SwitchNetworkContainer>
      ) : (
        <ExpandablePositionsWrapper>
          {account && derivedPositions && (
            <InnerPositionItems
              derivedPositions={derivedPositions}
              positionItems={positionItems}
              currencyPairInfo={currencyPairInfo}
              poolBaseAPR={poolBaseAPR}
              chainId={chainId}
              incentiveId={incentiveId}
              isPaused={isPaused}
            />
          )}

          {/* {(derivedPositions && derivedPositions[Position.AVAILABLE].length > 0) ||
          (derivedPositions && derivedPositions[Position.STAKED].length > 0) ? (
            <InnerPositionsRow
              derivedPositions={derivedPositions}
              positionItems={positionItems}
              currencyPairInfo={currencyPairInfo}
              poolBaseAPR={poolBaseAPR}
              chainId={chainId}
            />
          ) : (
            <NoPositionAdder chainId={chainId} positionItems={positionItems} currencyPairInfo={currencyPairInfo} />
          )} */}
          {!account && (
            <InnerWrapper>
              <PreviewPools chainId={chainId} positionItems={positionItems} currencyPairInfo={currencyPairInfo} />
              <ConnectWalletPanel>
                <InternalView>
                  <DashedBorder>
                    <GloriaText size="xl">Connect to view your positions</GloriaText>
                    <ConnectButton onClick={() => toggleWalletDrawer()} isMaximized={false}>
                      <GloriaText size="xl">Connect wallet</GloriaText>
                    </ConnectButton>
                  </DashedBorder>
                </InternalView>
              </ConnectWalletPanel>
            </InnerWrapper>
          )}
        </ExpandablePositionsWrapper>
      )}
    </>
  )
}

const PausedPool = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 2px 6px;
  color: white;
  background-color: #ff7a7a;
  border-radius: 6px;
  font-size: 12px;
  max-height: 20px;
`

/* Loaded State: row component with token information */
export const LoadedRow = forwardRef((props: LoadedRowProps, ref: ForwardedRef<HTMLDivElement>) => {
  const currentView = useAtomValue(stakingView)
  const { poolListIndex, poolListLength, pool, sortRank, tableOption, chainId: pathChainId } = props
  const { account } = useWeb3React()
  const stakedTVLAtom = useAtomValue(stakedTVL)

  const { estimatedDerpEarningsAPR, isLoadingFarmApr } = useGetStakingFarmApr({
    incentiveId: pool.incentiveId,
    poolTvlUSD: pool.tvlUSD,
    chainId: pathChainId,
  })

  const filterNetwork = validateUrlChainParam(useParams<{ chainName?: string }>().chainName?.toUpperCase())
  const chainId = CHAIN_NAME_TO_CHAIN_ID[filterNetwork]
  const timePeriod = useAtomValue(filterTimeAtom)
  const delta = Number(pool.apr)
  const arrow = getDeltaArrow(delta)
  const smallArrow = getDeltaArrow(delta, 14)
  const formattedDelta = formatDelta(delta + estimatedDerpEarningsAPR)

  const [isExpand, setIsExpand] = useState<boolean>(false)

  const currency0 = useCurrency(pool.token0.address, chainId)
  const currency1 = useCurrency(pool.token1.address, chainId)

  const currencyPairInfo = useMemo(() => {
    return {
      feeTier: pool.feeTier,
      pair: [currency0, currency1],
    }
  }, [currency0, currency1, pool.feeTier])

  const { multipliers, isLoadingMultiplier } = useGetMultipliers({
    poolAddress: pool.address,
    shouldGetMultiplier: tableOption === STAKING_POOL_STATE.LIVE,
    chainId,
  })

  useDerivedStakedPositions({
    chainId: pathChainId,
    incentiveId: pool.incentiveId,
    poolAddress: pool.address,
    token0: pool.token0.address,
    token1: pool.token1.address,
    feeTier: pool.feeTier,
  })

  const { earned } = useGetCombinedEarnedStakings({
    poolAddress: pool.address,
    incentiveId: pool.incentiveId,
  })

  const derivedEarnings = useAtomValue(earnedAtom)

  const derivedPositionsState = useAtomValue(derivedPositionsAtom)

  const [onloadCombinedEarnings, setOnloadCombinedEarnings] = useState<boolean>(false)

  const combinedEarnings = useMemo(() => {
    const initialCombinedEarnings: {
      [key: string]: number
    } = {}
    if (
      derivedPositionsState &&
      derivedPositionsState[pool.incentiveId] &&
      derivedPositionsState[pool.incentiveId][Position.STAKED] &&
      derivedPositionsState[pool.incentiveId][Position.STAKED].length > 0 &&
      derivedEarnings &&
      derivedEarnings[pool.incentiveId]
    ) {
      setOnloadCombinedEarnings(true)
      const earningsObject = derivedEarnings[pool.incentiveId]

      Object.keys(earningsObject).forEach((poolId) => {
        const earning = Number(earningsObject[poolId])
        if (!isNaN(earning)) {
          if (initialCombinedEarnings[pool.incentiveId]) {
            initialCombinedEarnings[pool.incentiveId] += earning
          } else {
            initialCombinedEarnings[pool.incentiveId] = earning
          }
        }
      })
    }
    setOnloadCombinedEarnings(false)
    return initialCombinedEarnings
  }, [derivedPositionsState, pool.incentiveId, derivedEarnings])

  const derivedEarningsAdditional = useAtomValue(earnedAdditionalAtom)

  const combinedEarningsAdditional = useMemo(() => {
    const initialCombinedEarnings: {
      [key: string]: number
    } = {}
    if (
      derivedPositionsState &&
      derivedPositionsState[pool.incentiveId] &&
      derivedPositionsState[pool.incentiveId][Position.STAKED] &&
      derivedPositionsState[pool.incentiveId][Position.STAKED].length > 0 &&
      derivedEarningsAdditional &&
      derivedEarningsAdditional[pool.incentiveId]
    ) {
      setOnloadCombinedEarnings(true)
      const earningsObject = derivedEarningsAdditional[pool.incentiveId]

      Object.keys(earningsObject).forEach((poolId) => {
        const earning = Number(earningsObject[poolId])
        if (!isNaN(earning)) {
          if (initialCombinedEarnings[pool.incentiveId]) {
            initialCombinedEarnings[pool.incentiveId] += earning
          } else {
            initialCombinedEarnings[pool.incentiveId] = earning
          }
        }
      })
    }
    setOnloadCombinedEarnings(false)
    return initialCombinedEarnings
  }, [derivedPositionsState, pool.incentiveId, derivedEarningsAdditional])

  const incentiveKeys = useAtomValue(incentiveKeysAtom)

  // console.log('stakedTVLAtom.stakingTVL', stakedTVLAtom.stakingTVL)

  const ConstructedInfo = () => {
    return (
      <ConstructedInfoBox>
        <NunitoText className="flex-row-text is-focused">
          <Trans>Combined APR:</Trans>
          <DeltaText delta={delta}>{formattedDelta}</DeltaText>
        </NunitoText>
        <div className="divider"></div>
        <NunitoText className="flex-row-text">
          <Trans>Base APR:</Trans>
          <DeltaText delta={pool.apr}>{formatDelta(pool.apr)}</DeltaText>
        </NunitoText>
        <NunitoText className="flex-row-text">
          <Trans>Farm APR:</Trans>
          <DeltaText delta={estimatedDerpEarningsAPR}>{formatDelta(estimatedDerpEarningsAPR)}</DeltaText>
        </NunitoText>
      </ConstructedInfoBox>
    )
  }

  const rewardToken = useCurrency(incentiveKeys[pool.incentiveId]?.rewardToken, pathChainId)
  const incentivisedRewards = useMemo(() => {
    const rewards: string[] = []
    if (incentiveKeys[pool.incentiveId]) {
      rewards.push(incentiveKeys[pool.incentiveId].rewardToken)
    }

    if (
      incentiveKeys[pool.incentiveId] &&
      incentiveKeys[pool.incentiveId].addtionalIncentives &&
      incentiveKeys[pool.incentiveId].addtionalIncentives.length > 0 &&
      incentiveKeys[pool.incentiveId].addtionalIncentives[0].rewardToken
    ) {
      rewards.push(incentiveKeys[pool.incentiveId].addtionalIncentives[0].rewardToken)
    }
    return rewards
  }, [incentiveKeys])

  const RewardInfo = ({ tokenAddress }: { tokenAddress: string }) => {
    const rewardToken = useCurrency(tokenAddress, pathChainId)

    return (
      <>
        <RewardGrid>
          <CurrencyLogo currency={rewardToken} size="30px" />
          <NunitoText size="md" weight={600}>
            {rewardToken?.symbol}
          </NunitoText>
        </RewardGrid>
      </>
    )
  }

  const defaultRewardToken = useCurrency(incentiveKeys[pool.incentiveId]?.rewardToken, pathChainId)
  const additionalRewardToken = useCurrency(
    incentiveKeys[pool.incentiveId]?.addtionalIncentives[0]?.rewardToken,
    pathChainId
  )

  const { stakingPoolState } = useGetStakingPoolStatus({
    incentiveId: pool.incentiveId,
    chainId,
  })

  const hasAdditionalRewardToken = useMemo(() => {
    if (additionalRewardToken) {
      return true
    }
    return false
  }, [additionalRewardToken])

  return (
    <div style={{ overflow: 'hidden' }} ref={ref} data-testid={`pool-table-row-${pool.incentiveId}`}>
      <RowExpandable onClick={() => setIsExpand(!isExpand)}>
        <PoolRow
          header={false}
          listNumber={sortRank}
          poolName={
            <PoolName>
              {/* <QueryTokenLogo token={token} /> */}
              <DoubleCurrencyLogo margin={true} currency0={currency0} currency1={currency1} size={30} />
              {/* <div>{pool.incentiveId.substring(0, 6)}</div> */}
              {/* <div>{incentiveKeys[pool.incentiveId].endTime}</div> */}
              <div className="pool-info-root">
                <div className="symbol-merge">
                  {currency0?.symbol}/{currency1?.symbol}
                  {stakingPoolState.isPaused && <PausedPool>Paused</PausedPool>}
                </div>
                <div className="pool-info">
                  <div className="bounded-dexname">DerpDEX</div>
                  <div className="fee-tier">{pool.feeTier / 10000}</div>
                </div>
              </div>
              <>
                <MouseoverTooltip
                  size={TooltipSize.Small}
                  text={
                    <ConstructedInfoBox style={{ padding: '12px' }}>
                      <NunitoText size="lg" weight={600}>
                        Farming Rewards
                      </NunitoText>
                      <div className="divider"></div>
                      <ColFlex gap={12}>
                        <RewardGrid>
                          <CurrencyLogo currency={defaultRewardToken} size="30px" />
                          <NunitoText size="md" weight={600}>
                            {defaultRewardToken?.symbol}
                          </NunitoText>
                        </RewardGrid>
                        {additionalRewardToken && (
                          <RewardGrid>
                            <CurrencyLogo currency={additionalRewardToken} size="30px" />
                            <NunitoText size="md" weight={600}>
                              {additionalRewardToken?.symbol}
                            </NunitoText>
                          </RewardGrid>
                        )}
                      </ColFlex>
                    </ConstructedInfoBox>
                  }
                  placement="right"
                >
                  <InfoIconContainer>
                    <Info size={14} />
                  </InfoIconContainer>
                </MouseoverTooltip>
              </>
            </PoolName>
          }
          tvl={
            !stakedTVLAtom.isLoaded ? (
              <LoadingBubble />
            ) : (
              <ClickableContent>
                {formatNumber(stakedTVLAtom.stakingTVL[pool.incentiveId], NumberType.FiatTokenStats)}
              </ClickableContent>
            )
          }
          vol24H={<ClickableContent>{formatNumber(pool.volumeUSD, NumberType.FiatTokenStats)}</ClickableContent>}
          vol7D={<ClickableContent>{formatNumber(pool.volumeUSDWeek, NumberType.FiatTokenStats)}</ClickableContent>}
          percentChange={
            isLoadingFarmApr ? (
              <LoadingBubble />
            ) : (
              <>
                {currentView === STAKING_POOL_STATE.LIVE ? (
                  <>
                    {' '}
                    <DeltaText delta={delta}>{formattedDelta}</DeltaText>
                    <MouseoverTooltip size={TooltipSize.Medium} text={<ConstructedInfo />} placement="right">
                      <InfoIconContainer>
                        <Info size={14} />
                      </InfoIconContainer>
                    </MouseoverTooltip>
                  </>
                ) : (
                  <DeltaText delta={0}>0%</DeltaText>
                )}
              </>
            )
          }
          multiplier={
            isLoadingMultiplier ? (
              <LoadingBubble />
            ) : (
              <ClickableContent>{multipliers ? `${multipliers.max}x` : 0}</ClickableContent>
            )
          }
          // * AVAILABLE POSITIONS
          availablePositions={
            <ClickableContent>
              {derivedPositionsState && derivedPositionsState[pool.incentiveId]
                ? derivedPositionsState[pool.incentiveId][Position.AVAILABLE].length
                : 0}
            </ClickableContent>
          }
          // * STAKED POSITIONS
          stakedPositions={
            <ClickableContent>
              {derivedPositionsState && derivedPositionsState[pool.incentiveId]
                ? derivedPositionsState[pool.incentiveId][Position.STAKED].length
                : 0}
            </ClickableContent>
          }
          // * EARNED
          earned={
            onloadCombinedEarnings ? (
              <LoadingBubble></LoadingBubble>
            ) : (
              <ClickableContent>
                {!hasAdditionalRewardToken ? (
                  <InlineText>
                    {/* Handle the state gracefully */}
                    {derivedEarnings &&
                    derivedEarnings[pool.incentiveId] &&
                    derivedPositionsState &&
                    derivedPositionsState[pool.incentiveId] &&
                    derivedPositionsState[pool.incentiveId][Position.STAKED] &&
                    derivedPositionsState[pool.incentiveId][Position.STAKED].length > 0 &&
                    combinedEarnings[pool.incentiveId]
                      ? formatNumber(combinedEarnings[pool.incentiveId], NumberType.TokenNonTx)
                      : '0'}{' '}
                    {rewardToken?.symbol}
                  </InlineText>
                ) : (
                  <ColFlex>
                    <InlineText>
                      {/* Handle the state gracefully */}
                      {derivedEarnings &&
                      derivedEarnings[pool.incentiveId] &&
                      derivedPositionsState &&
                      derivedPositionsState[pool.incentiveId] &&
                      derivedPositionsState[pool.incentiveId][Position.STAKED] &&
                      derivedPositionsState[pool.incentiveId][Position.STAKED].length > 0 &&
                      combinedEarnings[pool.incentiveId]
                        ? formatNumber(combinedEarnings[pool.incentiveId], NumberType.SwapTradeAmount)
                        : '0'}{' '}
                      {rewardToken?.symbol}
                    </InlineText>
                    <InlineText>
                      {/* Handle the state gracefully */}
                      {derivedEarningsAdditional &&
                      derivedEarningsAdditional[pool.incentiveId] &&
                      derivedPositionsState &&
                      derivedPositionsState[pool.incentiveId] &&
                      derivedPositionsState[pool.incentiveId][Position.STAKED] &&
                      derivedPositionsState[pool.incentiveId][Position.STAKED].length > 0 &&
                      combinedEarningsAdditional[pool.incentiveId]
                        ? formatNumber(combinedEarningsAdditional[pool.incentiveId], NumberType.TokenNonTx)
                        : '0'}{' '}
                      {additionalRewardToken?.symbol}
                    </InlineText>
                  </ColFlex>
                )}
              </ClickableContent>
            )
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
      </RowExpandable>
      {pool.positions.map((p) => (
        <ComponentHooks
          key={p.id}
          incentiveId={pool.incentiveId}
          poolAddress={pool.address}
          poolId={p.id}
          chainId={chainId}
        />
      ))}
      {isExpand && (
        <ExpandablePositions
          derivedPositions={derivedPositionsState && derivedPositionsState[pool.incentiveId]}
          currencyPairInfo={currencyPairInfo}
          positionItems={pool.positions}
          poolBaseAPR={formattedDelta}
          chainId={chainId}
          incentiveId={pool.incentiveId}
          isPaused={stakingPoolState.isPaused}
        />
      )}
    </div>
  )
})
