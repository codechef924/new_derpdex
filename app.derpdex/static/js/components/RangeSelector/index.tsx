import { Trans } from '@lingui/macro'
import { Currency, Price, Token } from '@uniswap/sdk-core'
import { AutoColumn } from 'components/Column'
import CurrentPrice from 'components/CurrentPrice/CurrentPrice'
import StepCounter from 'components/InputStepCounter/InputStepCounter'
import { RowBetweenPanel } from 'components/Row'
import { RANGE } from 'pages/AddLiquidity/RANGE_MODE'
import { Dispatch, useEffect, useState } from 'react'
import { Bound } from 'state/mint/v3/actions'
import styled from 'styled-components'

const MobileOnlyContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;

  .custom-card {
    width: 50% !important;
    max-width: none !important;
  }
  .custom-card-disabled {
    width: 100% !important;
    max-width: none !important;
  }
`
// currencyA is the base token
export default function RangeSelector({
  priceLower,
  priceUpper,
  onLeftRangeInput,
  onRightRangeInput,
  getDecrementLower,
  getIncrementLower,
  getDecrementUpper,
  getIncrementUpper,
  currencyA,
  currencyB,
  feeAmount,
  ticksAtLimit,
  currentPrice,
  currentMode,
  setCurrentMode,
}: {
  priceLower?: Price<Token, Token>
  priceUpper?: Price<Token, Token>
  getDecrementLower: () => string
  getIncrementLower: () => string
  getDecrementUpper: () => string
  getIncrementUpper: () => string
  onLeftRangeInput: (typedValue: string) => void
  onRightRangeInput: (typedValue: string) => void
  currencyA?: Currency | null
  currencyB?: Currency | null
  feeAmount?: number
  ticksAtLimit: { [bound in Bound]?: boolean | undefined }
  currentPrice?: string
  currentMode?: RANGE
  setCurrentMode: Dispatch<RANGE>
}) {
  const tokenA = (currencyA ?? undefined)?.wrapped
  const tokenB = (currencyB ?? undefined)?.wrapped
  const isSorted = tokenA && tokenB && tokenA.sortsBefore(tokenB)

  const leftPrice = isSorted ? priceLower : priceUpper?.invert()
  const rightPrice = isSorted ? priceUpper : priceLower?.invert()

  const [hasCurrentPrice, setHasCurrentPrice] = useState(false)
  const [onCurrentPrice, setOnCurrentPrice] = useState<string>('0')

  useEffect(() => {
    if (currentPrice) {
      setOnCurrentPrice(currentPrice)
    }
  }, [currentPrice])

  const isMobile = window.innerWidth < 768 // Adjust the breakpoint as needed
  const isDesktop = !isMobile

  return (
    <AutoColumn id="range-col" gap="md">
      <RowBetweenPanel gap="5px">
        {isDesktop && (
          <>
            <StepCounter
              value={ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER] ? '0' : leftPrice?.toSignificant(5) ?? ''}
              onUserInput={(e) => {
                onLeftRangeInput(e)
                setCurrentMode(RANGE.CUSTOM)
              }}
              width="48%"
              decrement={isSorted ? getDecrementLower : getIncrementUpper}
              increment={isSorted ? getIncrementLower : getDecrementUpper}
              decrementDisabled={ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER]}
              incrementDisabled={ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER]}
              feeAmount={feeAmount}
              label={leftPrice ? `${currencyB?.symbol}` : '-'}
              title={<Trans>Min Price</Trans>}
              tokenA={currencyA?.symbol}
              tokenB={currencyB?.symbol}
            />
            <StepCounter
              value={ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER] ? '∞' : rightPrice?.toSignificant(5) ?? ''}
              onUserInput={(e) => {
                onRightRangeInput(e)
                setCurrentMode(RANGE.CUSTOM)
              }}
              width="48%"
              decrement={isSorted ? getDecrementUpper : getIncrementLower}
              increment={isSorted ? getIncrementUpper : getDecrementLower}
              incrementDisabled={ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER]}
              decrementDisabled={ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER]}
              feeAmount={feeAmount}
              label={rightPrice ? `${currencyB?.symbol}` : '-'}
              tokenA={currencyA?.symbol}
              tokenB={currencyB?.symbol}
              title={<Trans>Max Price</Trans>}
            />
            <CurrentPrice
              value={onCurrentPrice}
              width="48%"
              feeAmount={feeAmount}
              label={rightPrice ? `${currencyB?.symbol}` : '-'}
              tokenA={currencyA?.symbol}
              tokenB={currencyB?.symbol}
              title={<Trans>Current Price</Trans>}
            />
          </>
        )}
        {isMobile && (
          <MobileOnlyContainer>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <StepCounter
                value={ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER] ? '0' : leftPrice?.toSignificant(5) ?? ''}
                onUserInput={(e) => {
                  onLeftRangeInput(e)
                  setCurrentMode(RANGE.CUSTOM)
                }}
                width="50%"
                decrement={isSorted ? getDecrementLower : getIncrementUpper}
                increment={isSorted ? getIncrementLower : getDecrementUpper}
                decrementDisabled={ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER]}
                incrementDisabled={ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER]}
                feeAmount={feeAmount}
                label={leftPrice ? `${currencyB?.symbol}` : '-'}
                title={<Trans>Min Price</Trans>}
                tokenA={currencyA?.symbol}
                tokenB={currencyB?.symbol}
              />
              <StepCounter
                value={ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER] ? '∞' : rightPrice?.toSignificant(5) ?? ''}
                onUserInput={(e) => {
                  onRightRangeInput(e)
                  setCurrentMode(RANGE.CUSTOM)
                }}
                width="50%"
                decrement={isSorted ? getDecrementUpper : getIncrementLower}
                increment={isSorted ? getIncrementUpper : getDecrementLower}
                incrementDisabled={ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER]}
                decrementDisabled={ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER]}
                feeAmount={feeAmount}
                label={rightPrice ? `${currencyB?.symbol}` : '-'}
                tokenA={currencyA?.symbol}
                tokenB={currencyB?.symbol}
                title={<Trans>Max Price</Trans>}
              />
            </div>
            <CurrentPrice
              value={onCurrentPrice}
              width="100%"
              feeAmount={feeAmount}
              label={rightPrice ? `${currencyB?.symbol}` : '-'}
              tokenA={currencyA?.symbol}
              tokenB={currencyB?.symbol}
              title={<Trans>Current Price</Trans>}
            />
          </MobileOnlyContainer>
        )}
      </RowBetweenPanel>
    </AutoColumn>
  )
}
