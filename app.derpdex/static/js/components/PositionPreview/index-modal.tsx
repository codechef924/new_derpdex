import '@fontsource/nunito' // Defaults to weight 400

import { Position } from '@derpdex/sdk'
import { Trans } from '@lingui/macro'
import { Box } from '@mui/material'
import { Currency, Percent } from '@uniswap/sdk-core'
import RangeBadge from 'components/Badge/RangeBadge'
import { DDCardUniversal } from 'components/Card'
import { AutoColumn } from 'components/Column'
import { NunitoText } from 'components/CustomFonts/Nunito'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import { Break } from 'components/earn/styled'
import CurrencyLogo from 'components/Logo/CurrencyLogo'
import RateToggle from 'components/RateToggle'
import { RowBetween, RowFixed } from 'components/Row'
import JSBI from 'jsbi'
import { useIsMobile } from 'nft/hooks'
import { ReactNode, useCallback, useState } from 'react'
import { Bound } from 'state/mint/v3/actions'
import styled from 'styled-components'
import { useTheme } from 'styled-components/macro'
import { ThemedText } from 'theme'
import { formatTickPrice } from 'utils/formatTickPrice'
import { unwrappedToken } from 'utils/unwrappedToken'

import * as styles from './index.css'
const DEFAULT_REMOVE_V3_LIQUIDITY_SLIPPAGE_TOLERANCE = new Percent(5, 100)

const AddRemoveWrapper = styled.div`
  padding: 6px 24px 0px 24px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  // max-width: 825px;

  @media only screen and (max-width: 768px) {
    padding: 6px 10px 0px 10px;
  }
`

const AddRemoveContent = styled.div`
  width: 710px;
  // max-width: 825px;

  @media only screen and (max-width: 768px) {
    width: auto;
  }
`

const PreviewCard = styled.div`
  border-radius: 16px;
  border: 2px solid #000;
  background: #fff;
  box-shadow: 3px 3px 0px 0px #000;

  padding: 22px 26px;

  @media only screen and (max-width: 768px) {
    padding: 10px 10px;
  }
`

const PreviewDetails = styled.div`
  border-top: 2px solid #000;
  padding-top: 19px;
  margin-top: 19px;

  // for all
  font-size: 20px;
  @media only screen and (max-width: 768px) {
    font-size: 16px !important;
  }
`

const ColumnFlex = styled(AutoColumn)`
  margin-top: 31px;
  @media only screen and (max-width: 768px) {
    margin-top: 10px;
    grid-row-gap: 4px !important;
  }
`

const ExtentsText = styled.span`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 14px;
  text-align: center;
  margin-right: 4px;
  font-weight: 500;
`

const PositionPreviewAutoColumn = styled(AutoColumn)`
  margin-top: 2.5rem;
`

const DDCardUniversalOverride = styled(DDCardUniversal)`
  padding: 12px;

  @media only screen and (max-width: 768px) {
    padding: 8px 0px;
  }
`

const RowFixedOverride = styled(RowFixed)`
  font-size: 16px;
  display: flex;
  gap: 8px;
  margin-left: -4px;
  @media only screen and (max-width: 768px) {
    font-size: 0.8em;
  }

  * {
    font-family: 'Nunito' !important;
  }
`

const RowBetweenSelectedRange = styled(RowBetween)`
  @media only screen and (max-width: 768px) {
    font-size: 0.8em;
  }
`

export const PositionPreviewModal = ({
  position,
  title,
  inRange,
  baseCurrencyDefault,
  ticksAtLimit,
  tokenId,
}: {
  position: Position
  title?: ReactNode
  inRange: boolean
  baseCurrencyDefault?: Currency | undefined
  ticksAtLimit: { [bound: string]: boolean | undefined }
  tokenId?: string | undefined
}) => {
  const theme = useTheme()

  const currency0 = unwrappedToken(position.pool.token0)
  const currency1 = unwrappedToken(position.pool.token1)

  // track which currency should be base
  const [baseCurrency, setBaseCurrency] = useState(
    baseCurrencyDefault
      ? baseCurrencyDefault === currency0
        ? currency0
        : baseCurrencyDefault === currency1
        ? currency1
        : currency0
      : currency0
  )

  const sorted = baseCurrency === currency0
  const quoteCurrency = sorted ? currency1 : currency0

  const price = sorted ? position.pool.priceOf(position.pool.token0) : position.pool.priceOf(position.pool.token1)

  const priceLower = sorted ? position.token0PriceLower : position.token0PriceUpper.invert()
  const priceUpper = sorted ? position.token0PriceUpper : position.token0PriceLower.invert()

  const handleRateChange = useCallback(() => {
    setBaseCurrency(quoteCurrency)
  }, [quoteCurrency])

  const removed = position?.liquidity && JSBI.equal(position?.liquidity, JSBI.BigInt(0))

  const isMobile = useIsMobile()

  return (
    <PositionPreviewAutoColumn id="add-rem-liq" gap="md">
      {/* <AddRemoveTabs
        creating={false}
        positionID={tokenId}
        adding={true}
        autoSlippage={DEFAULT_REMOVE_V3_LIQUIDITY_SLIPPAGE_TOLERANCE}
      /> */}
      <AddRemoveWrapper>
        <AddRemoveContent>
          <PreviewCard>
            <RowBetween style={{ marginBottom: '0.5rem' }}>
              <RowFixedOverride>
                <DoubleCurrencyLogo
                  currency0={currency0 ?? undefined}
                  currency1={currency1 ?? undefined}
                  size={24}
                  margin={true}
                />
                <NunitoText size="lg2" weight={600}>
                  {currency0?.symbol}/{currency1?.symbol}
                </NunitoText>
              </RowFixedOverride>
              <RangeBadge removed={removed} inRange={inRange} />
            </RowBetween>

            <PreviewDetails>
              <AutoColumn gap="md">
                <RowBetween>
                  <RowFixedOverride>
                    <CurrencyLogo currency={currency0} />
                    <ThemedText.DeprecatedLabel ml="8px">{currency0?.symbol}</ThemedText.DeprecatedLabel>
                  </RowFixedOverride>
                  <RowFixedOverride>
                    <ThemedText.DeprecatedLabel mr="8px">
                      {position.amount0.toSignificant(4)}
                    </ThemedText.DeprecatedLabel>
                  </RowFixedOverride>
                </RowBetween>
                <RowBetween>
                  <RowFixedOverride>
                    <CurrencyLogo currency={currency1} />
                    <ThemedText.DeprecatedLabel ml="8px">{currency1?.symbol}</ThemedText.DeprecatedLabel>
                  </RowFixedOverride>
                  <RowFixedOverride>
                    <ThemedText.DeprecatedLabel mr="8px">
                      {position.amount1.toSignificant(4)}
                    </ThemedText.DeprecatedLabel>
                  </RowFixedOverride>
                </RowBetween>
                <Break />
                <RowBetween>
                  <NunitoText size="lg" weight={600}>
                    <Trans>Fee Tier</Trans>
                  </NunitoText>
                  <NunitoText weight={600}>
                    <Trans>{position?.pool?.fee / 10000}%</Trans>
                  </NunitoText>
                </RowBetween>
              </AutoColumn>
            </PreviewDetails>
          </PreviewCard>

          <ColumnFlex gap="md">
            <RowBetweenSelectedRange>
              {title ? <ThemedText.DeprecatedMain>{title}</ThemedText.DeprecatedMain> : <div />}
              <RateToggle
                currencyA={sorted ? currency0 : currency1}
                currencyB={sorted ? currency1 : currency0}
                handleRateToggle={handleRateChange}
              />
            </RowBetweenSelectedRange>

            <RowBetween className={styles.RowHelper} gap="10px" padding="0">
              {isMobile ? (
                <Box id="row-when-desktop" className={styles.RowWhenDesktop}>
                  <DDCardUniversal className={styles.OverrideCard} background="none" width="100%">
                    <AutoColumn gap="sm" justify="center">
                      <ExtentsText style={{ fontSize: '16px', color: '#000', fontWeight: '600' }}>
                        <Trans>Min Price</Trans>
                      </ExtentsText>
                      <div className={styles.ValuePanel}>
                        <ThemedText.DeprecatedMediumHeader fontSize="20px" fontWeight="600" textAlign="center">
                          {formatTickPrice({
                            price: priceLower,
                            atLimit: ticksAtLimit,
                            direction: Bound.LOWER,
                          })}
                        </ThemedText.DeprecatedMediumHeader>
                      </div>
                      <ExtentsText style={{ fontSize: '16px', color: '#000', fontWeight: '600' }}>
                        <Trans>
                          {quoteCurrency.symbol} per {baseCurrency.symbol}
                        </Trans>
                      </ExtentsText>
                    </AutoColumn>
                  </DDCardUniversal>

                  <DDCardUniversal className={styles.OverrideCard} background="none" width="100%">
                    <AutoColumn gap="sm" justify="center">
                      <ExtentsText style={{ fontSize: '16px', color: '#000', fontWeight: '600' }}>
                        <Trans>Max Price</Trans>
                      </ExtentsText>
                      <div className={styles.ValuePanel}>
                        <ThemedText.DeprecatedMediumHeader fontSize="20px" fontWeight="600" textAlign="center">
                          {formatTickPrice({
                            price: priceUpper,
                            atLimit: ticksAtLimit,
                            direction: Bound.UPPER,
                          })}
                        </ThemedText.DeprecatedMediumHeader>
                      </div>
                      <ExtentsText style={{ fontSize: '16px', color: '#000', fontWeight: '600' }}>
                        <Trans>
                          {quoteCurrency.symbol} per {baseCurrency.symbol}
                        </Trans>
                      </ExtentsText>
                    </AutoColumn>
                  </DDCardUniversal>
                </Box>
              ) : (
                <>
                  <DDCardUniversalOverride background="none" width="100%">
                    <AutoColumn gap="sm" justify="center">
                      <ExtentsText style={{ fontSize: '16px', color: '#000', fontWeight: '600' }}>
                        <Trans>Min Price</Trans>
                      </ExtentsText>
                      <div className={styles.ValuePanel}>
                        <ThemedText.DeprecatedMediumHeader fontSize="20px" fontWeight="600" textAlign="center">
                          {formatTickPrice({
                            price: priceLower,
                            atLimit: ticksAtLimit,
                            direction: Bound.LOWER,
                          })}
                        </ThemedText.DeprecatedMediumHeader>
                      </div>
                      <ExtentsText style={{ fontSize: '16px', color: '#000', fontWeight: '600' }}>
                        <Trans>
                          {quoteCurrency.symbol} per {baseCurrency.symbol}
                        </Trans>
                      </ExtentsText>
                    </AutoColumn>
                  </DDCardUniversalOverride>
                  <DDCardUniversalOverride
                    className={styles.OverrideCard}
                    background="none"
                    padding="12px"
                    width="100%"
                  >
                    <AutoColumn gap="sm" justify="center">
                      <ExtentsText style={{ fontSize: '16px', color: '#000', fontWeight: '600' }}>
                        <Trans>Max Price</Trans>
                      </ExtentsText>
                      <div className={styles.ValuePanel}>
                        <ThemedText.DeprecatedMediumHeader fontSize="20px" fontWeight="600" textAlign="center">
                          {formatTickPrice({
                            price: priceUpper,
                            atLimit: ticksAtLimit,
                            direction: Bound.UPPER,
                          })}
                        </ThemedText.DeprecatedMediumHeader>
                      </div>
                      <ExtentsText style={{ fontSize: '16px', color: '#000', fontWeight: '600' }}>
                        <Trans>
                          {quoteCurrency.symbol} per {baseCurrency.symbol}
                        </Trans>
                      </ExtentsText>
                    </AutoColumn>
                  </DDCardUniversalOverride>
                </>
              )}
              <DDCardUniversalOverride className={styles.OverrideCard} background="none" width="100%">
                <AutoColumn gap="sm" justify="center">
                  <ExtentsText style={{ fontSize: '16px', color: '#000', fontWeight: '600' }}>
                    <Trans>Current Price</Trans>
                  </ExtentsText>
                  <div className={styles.ValuePanel}>
                    <ThemedText.DeprecatedMediumHeader fontSize="20px" fontWeight="600" textAlign="center">
                      {`${price.toSignificant(5)}`}
                    </ThemedText.DeprecatedMediumHeader>
                  </div>
                  <ExtentsText style={{ fontSize: '16px', color: '#000', fontWeight: '600' }}>
                    <Trans>
                      {quoteCurrency.symbol} per {baseCurrency.symbol}
                    </Trans>
                  </ExtentsText>
                </AutoColumn>
              </DDCardUniversalOverride>
            </RowBetween>
          </ColumnFlex>
        </AddRemoveContent>
      </AddRemoveWrapper>
    </PositionPreviewAutoColumn>
  )
}
