import { Currency } from '@uniswap/sdk-core'
import { AutoColumn } from 'components/Column'
import CurrencyLogo from 'components/Logo/CurrencyLogo'
import { AutoRow } from 'components/Row'
import { COMMON_BASES } from 'constants/routing'
import { useTokenInfoFromActiveList } from 'hooks/useTokenInfoFromActiveList'
import { getTokenAddress } from 'lib/utils/analytics'
import { RawPoolInfoState } from 'pages/ZapToEarn/hooks/ZapToEarnPools.jotai'
import styled from 'styled-components/macro'

const MobileWrapper = styled(AutoColumn)`
  ${({ theme }) => theme.deprecated_mediaWidth.deprecated_upToSmall`
    display: none;
  `};
`

const BaseWrapper = styled.div<{ disable?: boolean }>`
  border: 1px solid ${({ theme, disable }) => (disable ? theme.accentActive : theme.backgroundOutline)};
  border-radius: 16px;
  display: flex;
  padding: 6px;
  padding-right: 12px;

  align-items: center;
  :hover {
    cursor: ${({ disable }) => !disable && 'pointer'};
    background-color: ${({ theme }) => theme.hoverDefault};
  }

  color: ${({ theme, disable }) => disable && theme.accentActive};
  background-color: ${({ theme, disable }) => disable && theme.accentActiveSoft};
`

const formatAnalyticsEventProperties = (currency: Currency, searchQuery: string, isAddressSearch: string | false) => ({
  token_symbol: currency?.symbol,
  token_chain_id: currency?.chainId,
  token_address: getTokenAddress(currency),
  is_suggested_token: true,
  is_selected_from_list: false,
  is_imported_by_user: false,
  ...(isAddressSearch === false
    ? { search_token_symbol_input: searchQuery }
    : { search_token_address_input: isAddressSearch }),
})

export default function PoolCommonBases({
  chainId,
  onSelect,
  selectedCurrency,
  searchQuery,
  isAddressSearch,
}: {
  chainId?: number
  selectedCurrency?: RawPoolInfoState | null
  onSelect: (pool: RawPoolInfoState) => void
  searchQuery: string
  isAddressSearch: string | false
}) {
  const bases = typeof chainId !== 'undefined' ? COMMON_BASES[chainId] ?? [] : []

  return bases.length > 0 ? (
    <MobileWrapper gap="md">
      <AutoRow gap="4px">
        {/* {bases.map((pool: ParsedPoolInfoState) => {
          const isSelected = selectedCurrency?.equals(pool)

          return (

              <BaseWrapper
                tabIndex={0}
                onKeyPress={(e) => !isSelected && e.key === 'Enter' && onSelect(currency)}
                onClick={() => !isSelected && onSelect(currency)}
                disable={isSelected}
              >
                <CurrencyLogoFromList currency={currency} />
                <Text fontWeight={500} fontSize={16}>
                  {currency.symbol}
                </Text>
              </BaseWrapper>
          )
        })} */}
      </AutoRow>
    </MobileWrapper>
  ) : null
}

/** helper component to retrieve a base currency from the active token lists */
function CurrencyLogoFromList({ currency }: { currency: Currency }) {
  const token = useTokenInfoFromActiveList(currency)

  return <CurrencyLogo currency={token} style={{ marginRight: 8 }} />
}
