import { Trans } from '@lingui/macro'
import { Currency } from '@uniswap/sdk-core'
import { DDToggleElement, DDToggleWrapper } from 'components/Toggle/MultiToggle'

// the order of displayed base currencies from left to right is always in sort order
// currencyA is treated as the preferred base currency
export default function RateToggle({
  currencyA,
  currencyB,
  handleRateToggle,
}: {
  currencyA: Currency
  currencyB: Currency
  handleRateToggle: () => void
}) {
  const tokenA = currencyA?.wrapped
  const tokenB = currencyB?.wrapped

  const isSorted = tokenA && tokenB && tokenA.sortsBefore(tokenB)

  return tokenA && tokenB ? (
    <div style={{ width: 'fit-content', display: 'flex', alignItems: 'center' }} onClick={handleRateToggle}>
      <DDToggleWrapper width="fit-content">
        <DDToggleElement isActive={isSorted} fontSize="20px">
          <Trans>{isSorted ? currencyA.symbol : currencyB.symbol}</Trans>
        </DDToggleElement>
        <DDToggleElement isActive={!isSorted} fontSize="20px">
          <Trans>{isSorted ? currencyB.symbol : currencyA.symbol}</Trans>
        </DDToggleElement>
      </DDToggleWrapper>
    </div>
  ) : null
}
