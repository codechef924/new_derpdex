/* eslint-disable import/no-unused-modules */
import { Currency, CurrencyAmount } from '@uniswap/sdk-core'
import { useWeb3React } from '@web3-react/core'
import { NunitoText } from 'components/CustomFonts/Nunito'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import { useCurrency } from 'hooks/Tokens'
import { ParsedPoolInfoState, RawPoolInfoState, useZapToEarnPool } from 'pages/ZapToEarn/hooks/ZapToEarnPools.jotai'
import { CSSProperties, MutableRefObject, useCallback, useMemo } from 'react'
import { Check } from 'react-feather'
import { FixedSizeList } from 'react-window'
import { Text } from 'rebass'
import styled from 'styled-components/macro'

import { WrappedTokenInfo } from '../../../state/lists/wrappedTokenInfo'
import { AutoColumn } from '../../Column'
import Row from '../../Row'
import { MouseoverTooltip } from '../../Tooltip'
import { LoadingRows, PoolMenuItem, ZapWrapper } from '../styleds'
import { scrollbarStyle } from './index.css'

function poolKey(pool: RawPoolInfoState): string {
  return pool.address
}

const CheckIcon = styled(Check)`
  height: 20px;
  width: 20px;
  margin-left: 4px;
  color: ${({ theme }) => theme.accentAction};
`

const StyledBalanceText = styled(Text)`
  white-space: nowrap;
  overflow: hidden;
  max-width: 5rem;
  text-overflow: ellipsis;
`

const CurrencyName = styled(Text)`
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Tag = styled.div`
  background-color: ${({ theme }) => theme.deprecated_bg3};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 14px;
  border-radius: 4px;
  padding: 0.25rem 0.3rem 0.25rem 0.3rem;
  max-width: 6rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  justify-self: flex-end;
  margin-right: 4px;
`

const WarningContainer = styled.div`
  margin-left: 0.3em;
`

const ListWrapper = styled.div`
  padding-right: 0.25rem;
`

function Balance({ balance }: { balance: CurrencyAmount<Currency> }) {
  return <StyledBalanceText title={balance.toExact()}>{balance.toSignificant(4)}</StyledBalanceText>
}

const TagContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`

function TokenTags({ currency }: { currency: Currency }) {
  if (!(currency instanceof WrappedTokenInfo)) {
    return null
  }

  const tags = currency.tags
  if (!tags || tags.length === 0) return <span />

  const tag = tags[0]

  return (
    <TagContainer>
      <MouseoverTooltip text={tag.description}>
        <Tag key={tag.id}>{tag.name}</Tag>
      </MouseoverTooltip>
      {tags.length > 1 ? (
        <MouseoverTooltip
          text={tags
            .slice(1)
            .map(({ name, description }) => `${name}: ${description}`)
            .join('; \n')}
        >
          <Tag>...</Tag>
        </MouseoverTooltip>
      ) : null}
    </TagContainer>
  )
}

export function PoolRow({
  pool,
  otherSelected,
  style,
  showCurrencyAmount,
  onDismiss,
}: {
  pool: RawPoolInfoState
  otherSelected: boolean
  style?: CSSProperties
  showCurrencyAmount?: boolean
  onDismiss: () => void
}) {
  const { account } = useWeb3React()

  const { setPool, currentPool } = useZapToEarnPool()

  const isPoolSelected = Boolean(pool.address === currentPool.address)

  const token0 = useCurrency(pool.token0?.address)
  const token1 = useCurrency(pool.token1?.address)
  const remapToParsedPool: ParsedPoolInfoState = useMemo(() => {
    return {
      address: pool.address,
      token0,
      token1,
    }
  }, [pool.address, token0, token1])
  return (
    <ZapWrapper>
      <PoolMenuItem
        tabIndex={0}
        // style={style}
        className={`pool-item-${pool.address}`}
        // onKeyPress={(e) => (!isSelected && e.key === 'Enter' ? onSelect(false) : null)}
        onClick={() => {
          setPool({
            address: pool.address,
            token0: pool.token0,
            token1: pool.token1,
            feeTier: pool.feeTier,
          })
          onDismiss()
        }}
        disabled={false}
        selected={isPoolSelected}
        dim={false}
      >
        {/* <CurrencyLogo currency={currency} size="36px" style={{ opacity: isBlockedToken ? blockedTokenOpacity : '1' }} /> */}
        <DoubleCurrencyLogo currency0={remapToParsedPool.token1} currency1={remapToParsedPool.token0} size={24} />

        <AutoColumn style={{ opacity: '1' }}>
          <Row>
            <NunitoText size="lg" weight={600}>
              {pool.token0?.symbol}&nbsp;/&nbsp;{pool.token1?.symbol}
            </NunitoText>
            {/* <div>{pool.address}</div>
          <CurrencyName title={currency.name}>{currency.name}</CurrencyName> */}
          </Row>
          {/* <ThemedText.DeprecatedDarkGray ml="0px" fontSize="12px" fontWeight={300}>
          <div>{pool.address}</div>
        </ThemedText.DeprecatedDarkGray> */}
        </AutoColumn>
        {/* <Column>
        <RowFixed style={{ justifySelf: 'flex-end' }}>
          <div>{pool.address}</div>
          <TokenTags currency={currency} />
        </RowFixed>
      </Column> */}
        {/* {showCurrencyAmount ? (
          <RowFixed style={{ justifySelf: 'flex-end' }}>
            {balance ? <Balance balance={balance} /> : account ? <Loader /> : null}
            {isSelected && <CheckIcon />}
          </RowFixed>
        ) : (
          isSelected && (
            <RowFixed style={{ justifySelf: 'flex-end' }}>
              <CheckIcon />
            </RowFixed>
          )
        )} */}
      </PoolMenuItem>
    </ZapWrapper>
  )
}

interface PoolRowProps {
  data: Array<RawPoolInfoState>
  index: number
  style: CSSProperties
}

const LoadingRow = () => (
  <LoadingRows data-testid="loading-rows">
    <div />
    <div />
    <div />
  </LoadingRows>
)

export default function PoolList({
  height,
  pools,
  otherListTokens,
  selectedPool,
  onPoolSelect,
  otherCurrency,
  fixedListRef,
  showCurrencyAmount,
  isLoading,
  searchQuery,
  isAddressSearch,
  onDismiss,
}: {
  height: number
  pools?: RawPoolInfoState[]
  otherListTokens?: WrappedTokenInfo[]
  selectedPool?: RawPoolInfoState | null
  onPoolSelect: (currency: RawPoolInfoState) => void
  otherCurrency?: Currency | null
  fixedListRef?: MutableRefObject<FixedSizeList | undefined>
  showCurrencyAmount?: boolean
  isLoading: boolean
  searchQuery: string
  isAddressSearch: string | false
  onDismiss: () => void
}) {
  // console.log('[PoolList]', pools)
  const itemData: RawPoolInfoState[] = useMemo(() => {
    return pools ? pools : []
  }, [pools])

  const Row = useCallback(
    function PoolRowFn({ data, index, style }: PoolRowProps) {
      const row: RawPoolInfoState = data[index]

      const pool = row

      const otherSelected = Boolean(pool)
      const handleSelect = () => pool && onPoolSelect(pool)

      // const token = currency?.wrapped

      if (isLoading) {
        return LoadingRow()
      } else if (pool) {
        return (
          <PoolRow
            style={style}
            pool={pool}
            otherSelected={otherSelected}
            showCurrencyAmount={false}
            onDismiss={onDismiss}
            // showCurrencyAmount={showCurrencyAmount}
            // eventProperties={formatAnalyticsEventProperties(token, index, data, searchQuery, isAddressSearch)}
          />
        )
      } else {
        return null
      }
    },
    [onPoolSelect, selectedPool, isLoading]
  )

  const itemKey = useCallback((index: number, data: typeof itemData) => {
    const pool = data[index]
    return poolKey(pool)
  }, [])

  return (
    <ListWrapper>
      {isLoading ? (
        <FixedSizeList
          className={scrollbarStyle}
          height={height}
          ref={fixedListRef as any}
          width="100%"
          itemData={[]}
          itemCount={10}
          itemSize={56}
        >
          {LoadingRow}
        </FixedSizeList>
      ) : (
        <FixedSizeList
          className={scrollbarStyle}
          height={height}
          ref={fixedListRef as any}
          width="100%"
          itemData={itemData}
          itemCount={itemData.length}
          itemSize={56}
          itemKey={itemKey}
        >
          {Row}
        </FixedSizeList>
      )}
    </ListWrapper>
  )
}
