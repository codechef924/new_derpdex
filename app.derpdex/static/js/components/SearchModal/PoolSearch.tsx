// eslint-disable-next-line no-restricted-imports
import { Trans } from '@lingui/macro'
import { CircularProgress } from '@mui/material'
import { Trace } from '@uniswap/analytics'
import { InterfaceEventName, InterfaceModalName } from '@uniswap/analytics-events'
import { Currency, Token } from '@uniswap/sdk-core'
import { useWeb3React } from '@web3-react/core'
import { sendEvent } from 'components/analytics'
import { NunitoText } from 'components/CustomFonts/Nunito'
import useDebounce from 'hooks/useDebounce'
import { useOnClickOutside } from 'hooks/useOnClickOutside'
import useToggle from 'hooks/useToggle'
import useNativeCurrency from 'lib/hooks/useNativeCurrency'
import { getTokenFilter } from 'lib/hooks/useTokenList/filtering'
import { useDefaultActivePools } from 'pages/ZapToEarn/hooks/useDefaultActivePools'
import { RawPoolInfoState } from 'pages/ZapToEarn/hooks/ZapToEarnPools.jotai'
import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList } from 'react-window'
import { useAllTokenBalances } from 'state/connection/hooks'
import styled, { useTheme } from 'styled-components/macro'

import { useDefaultActiveTokens, useIsUserAddedToken, useSearchInactiveTokenLists, useToken } from '../../hooks/Tokens'
import { ThemedText } from '../../theme'
import { isAddress } from '../../utils'
import Column from '../Column'
import { RowBetween } from '../Row'
import { CurrencyRow, formatAnalyticsEventProperties } from './CurrencyList'
import PoolCommonBases from './PoolCommonBases'
import PoolList from './PoolList'
import { PaddedColumn, Separator } from './styleds'

const ContentWrapper = styled(Column)`
  background-color: ${({ theme }) => theme.backgroundSurface};
  width: 100%;
  overflow: hidden;
  flex: 1 1;
  position: relative;
  border-radius: 20px;
`

interface CurrencySearchProps {
  isOpen: boolean
  onDismiss: () => void
  selectedPool?: RawPoolInfoState | null
  onPoolSelect: (pool: RawPoolInfoState, hasWarning?: boolean) => void
  otherSelectedCurrency?: Currency | null
  showCommonBases?: boolean
  showCurrencyAmount?: boolean
  disableNonToken?: boolean
  onlyShowCurrenciesWithBalance?: boolean
}

export function PoolSearch({
  selectedPool,
  onPoolSelect,
  otherSelectedCurrency,
  showCommonBases,
  showCurrencyAmount,
  disableNonToken,
  onDismiss,
  isOpen,
  onlyShowCurrenciesWithBalance,
}: CurrencySearchProps) {
  const { chainId } = useWeb3React()
  const theme = useTheme()

  const [tokenLoaderTimerElapsed, setTokenLoaderTimerElapsed] = useState(false)

  // refs for fixed size lists
  const fixedList = useRef<FixedSizeList>()

  const [searchQuery, setSearchQuery] = useState<string>('')
  const debouncedQuery = useDebounce(searchQuery, 200)
  const isAddressSearch = isAddress(debouncedQuery)
  const searchToken = useToken(debouncedQuery)
  const searchTokenIsAdded = useIsUserAddedToken(searchToken)

  useEffect(() => {
    if (isAddressSearch) {
      sendEvent({
        category: 'Currency Select',
        action: 'Search by address',
        label: isAddressSearch,
      })
    }
  }, [isAddressSearch])

  const defaultTokens = useDefaultActiveTokens(chainId)

  const { pools, isLoading: poolIsLoading } = useDefaultActivePools(chainId)

  // console.log('[PoolSearch]', pools)
  const filteredTokens: Token[] = useMemo(() => {
    return Object.values(defaultTokens).filter(getTokenFilter(debouncedQuery))
  }, [defaultTokens, debouncedQuery])

  const [balances, balancesAreLoading] = useAllTokenBalances()

  const isLoading = true

  const native = useNativeCurrency(chainId)
  const wrapped = native.wrapped

  const handleCurrencySelect = useCallback(
    (pool: RawPoolInfoState, hasWarning?: boolean) => {
      onPoolSelect(pool, hasWarning)
      if (!hasWarning) onDismiss()
    },
    [onDismiss, onPoolSelect]
  )

  // clear the input on open
  useEffect(() => {
    if (isOpen) setSearchQuery('')
  }, [isOpen])

  // manage focus on modal show
  const inputRef = useRef<HTMLInputElement>()
  const handleInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value
    const checksummedInput = isAddress(input)
    setSearchQuery(checksummedInput || input)
    fixedList.current?.scrollTo(0)
  }, [])

  // menu ui
  const [open, toggle] = useToggle(false)
  const node = useRef<HTMLDivElement>()
  useOnClickOutside(node, open ? toggle : undefined)

  // if no results on main list, show option to expand into inactive
  const filteredInactiveTokens = useSearchInactiveTokenLists(
    !onlyShowCurrenciesWithBalance && (filteredTokens.length === 0 || (debouncedQuery.length > 2 && !isAddressSearch))
      ? debouncedQuery
      : undefined
  )

  // Timeout token loader after 3 seconds to avoid hanging in a loading state.
  useEffect(() => {
    const tokenLoaderTimer = setTimeout(() => {
      setTokenLoaderTimerElapsed(true)
    }, 3000)
    return () => clearTimeout(tokenLoaderTimer)
  }, [])

  return (
    <ContentWrapper>
      <Trace
        name={InterfaceEventName.TOKEN_SELECTOR_OPENED}
        modal={InterfaceModalName.TOKEN_SELECTOR}
        shouldLogImpression
      >
        <PaddedColumn gap="16px">
          <RowBetween>
            <NunitoText weight={600} size="xl">
              <Trans>Select a pool</Trans>
            </NunitoText>
            {/* <CloseIcon onClick={onDismiss} /> */}
          </RowBetween>
          {/* <Row>
            <SearchInput
              type="text"
              id="token-search-input"
              data-testid="token-search-input"
              placeholder={t`Search name or paste address`}
              autoComplete="off"
              value={searchQuery}
              ref={inputRef as RefObject<HTMLInputElement>}
              onChange={handleInput}
              // onKeyDown={handleEnter}
            />
          </Row> */}
          {showCommonBases && (
            <PoolCommonBases
              chainId={chainId}
              onSelect={handleCurrencySelect}
              selectedCurrency={selectedPool}
              searchQuery={searchQuery}
              isAddressSearch={isAddressSearch}
            />
          )}
        </PaddedColumn>
        <Separator />
        {searchToken && !searchTokenIsAdded ? (
          <Column style={{ padding: '20px 0', height: '100%' }}>
            <CurrencyRow
              currency={searchToken}
              // isSelected={Boolean(searchToken && selectedPool && selectedCurrency.equals(searchToken))}
              isSelected={Boolean(searchToken && selectedPool)}
              onSelect={(hasWarning: boolean) => searchToken && handleCurrencySelect(searchToken, hasWarning)}
              otherSelected={Boolean(searchToken && otherSelectedCurrency && otherSelectedCurrency.equals(searchToken))}
              showCurrencyAmount={showCurrencyAmount}
              eventProperties={formatAnalyticsEventProperties(
                searchToken,
                0,
                [searchToken],
                searchQuery,
                isAddressSearch
              )}
            />
          </Column>
        ) : pools && pools.length > 0 ? (
          <div style={{ flex: '1' }}>
            <AutoSizer disableWidth>
              {({ height }) => (
                <PoolList
                  height={height}
                  pools={pools}
                  onPoolSelect={handleCurrencySelect}
                  selectedPool={selectedPool}
                  showCurrencyAmount={false}
                  isLoading={false}
                  searchQuery={searchQuery}
                  isAddressSearch={isAddressSearch}
                  onDismiss={onDismiss}
                />
              )}
            </AutoSizer>
          </div>
        ) : (
          // searchCurrencies?.length > 0 || filteredInactiveTokens?.length > 0 || isLoading ? (
          //   <div style={{ flex: '1' }}>
          //     <AutoSizer disableWidth>
          //       {({ height }) => (
          //         <CurrencyList
          //           height={height}
          //           currencies={searchCurrencies}
          //           otherListTokens={filteredInactiveTokens}
          //           onCurrencySelect={handleCurrencySelect}
          //           otherCurrency={otherSelectedCurrency}
          //           selectedCurrency={selectedCurrency}
          //           fixedListRef={fixedList}
          //           showCurrencyAmount={showCurrencyAmount}
          //           isLoading={isLoading}
          //           searchQuery={searchQuery}
          //           isAddressSearch={isAddressSearch}
          //         />
          //       )}
          //     </AutoSizer>
          //   </div>
          <Column style={{ padding: '20px', height: '100%' }}>
            <ThemedText.DeprecatedMain color={theme.textTertiary} textAlign="center" mb="20px">
              {!pools && !poolIsLoading ? (
                <Trans>No results found.</Trans>
              ) : (
                <CircularProgress size={32}></CircularProgress>
              )}
            </ThemedText.DeprecatedMain>
          </Column>
        )}
      </Trace>
    </ContentWrapper>
  )
}
