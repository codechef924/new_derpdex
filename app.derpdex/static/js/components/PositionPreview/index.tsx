import { Position } from '@derpdex/sdk'
import { Trans } from '@lingui/macro'
import { Currency, Percent } from '@uniswap/sdk-core'
import RangeBadge from 'components/Badge/RangeBadge'
import { DDCardUniversal } from 'components/Card'
import { AutoColumn } from 'components/Column'
import { NunitoText } from 'components/CustomFonts/Nunito'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import { Break } from 'components/earn/styled'
import CurrencyLogo from 'components/Logo/CurrencyLogo'
import { AddRemoveTabs } from 'components/NavigationTabs'
import RateToggle from 'components/RateToggle'
import { RowBetween, RowFixed } from 'components/Row'
import JSBI from 'jsbi'
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
  padding: 10px 308px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media only screen and (max-width: 768px) {
    padding: 10px 12px;
  }

  // max-width: 825px;
`

const AddRemoveContent = styled.div`
  width: 100%;
  max-width: 825px;
`

const PreviewCard = styled.div`
  border-radius: 16px;
  border: 2px solid #000;
  background: #fff;
  box-shadow: 3px 3px 0px 0px #000;

  padding: 26px 38px;

  @media only screen and (max-width: 768px) {
    padding: 20px 20px;
  }
`

const PreviewDetails = styled.div`
  border-top: 2px solid #000;
  padding-top: 19px;
  margin-top: 19px;

  // for all
  font-size: 20px;
`

const ColumnFlex = styled(AutoColumn)`
  margin-top: 31px;
`

const ExtentsText = styled.span`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 14px;
  text-align: center;
  margin-right: 4px;
  font-weight: 500;
`

type IsTestSite = {
  isTestSite: boolean
}
const PositionPreviewAutoColumn = styled(AutoColumn)`
  // margin-top: 0.5rem;

  @media only screen and (max-width: 768px) {
    margin-top: 2.6rem;
  }
`
const RowFixedOverride = styled(RowFixed)`
  font-size: 16px;
  display: flex;
  gap: 0px;
  margin-left: -4px;
  @media only screen and (max-width: 768px) {
    font-size: 0.8em;
  }

  * {
    font-family: 'Nunito' !important;
  }
`
export const PositionPreview = ({
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

  return (
    <PositionPreviewAutoColumn id="add-rem-liq" gap="md">
      <AddRemoveTabs
        creating={false}
        positionID={tokenId}
        adding={true}
        autoSlippage={DEFAULT_REMOVE_V3_LIQUIDITY_SLIPPAGE_TOLERANCE}
      />
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
                <ThemedText.DeprecatedLabel ml="10px" fontSize="20px">
                  <NunitoText>
                    {currency0?.symbol} / {currency1?.symbol}
                  </NunitoText>
                </ThemedText.DeprecatedLabel>
              </RowFixedOverride>
              <RangeBadge removed={removed} inRange={inRange} />
            </RowBetween>

            <PreviewDetails>
              <AutoColumn gap="sm">
                <RowBetween>
                  <RowFixed>
                    <CurrencyLogo currency={currency0} />
                    <ThemedText.DeprecatedLabel ml="8px">
                      <NunitoText>{currency0?.symbol}</NunitoText>
                    </ThemedText.DeprecatedLabel>
                  </RowFixed>
                  <RowFixed>
                    <ThemedText.DeprecatedLabel mr="8px">
                      <NunitoText>{position.amount0.toSignificant(4)}</NunitoText>
                    </ThemedText.DeprecatedLabel>
                  </RowFixed>
                </RowBetween>
                <RowBetween>
                  <RowFixed>
                    <CurrencyLogo currency={currency1} />
                    <ThemedText.DeprecatedLabel ml="8px">
                      <NunitoText>{currency1?.symbol}</NunitoText>
                    </ThemedText.DeprecatedLabel>
                  </RowFixed>
                  <RowFixed>
                    <ThemedText.DeprecatedLabel mr="8px">
                      <NunitoText>{position.amount1.toSignificant(4)}</NunitoText>
                    </ThemedText.DeprecatedLabel>
                  </RowFixed>
                </RowBetween>
                <Break />
                <RowBetween>
                  <ThemedText.DeprecatedLabel>
                    <NunitoText>
                      <Trans>Fee Tier</Trans>
                    </NunitoText>
                  </ThemedText.DeprecatedLabel>
                  <ThemedText.DeprecatedLabel>
                    <NunitoText>
                      <Trans>{position?.pool?.fee / 10000}%</Trans>
                    </NunitoText>
                  </ThemedText.DeprecatedLabel>
                </RowBetween>
              </AutoColumn>
            </PreviewDetails>
          </PreviewCard>

          <ColumnFlex gap="md">
            <RowBetween>
              {title ? <ThemedText.DeprecatedMain>{title}</ThemedText.DeprecatedMain> : <div />}
              <RateToggle
                currencyA={sorted ? currency0 : currency1}
                currencyB={sorted ? currency1 : currency0}
                handleRateToggle={handleRateChange}
              />
            </RowBetween>

            <RowBetween className={styles.RowHelper} gap="10px" padding="0">
              <RowBetween
                className={styles.RowHelper}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '8px',
                  alignItems: 'center',
                }}
              >
                <DDCardUniversal className={styles.OverrideCard} background="none" padding="12px" width="100%">
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
                <DDCardUniversal className={styles.OverrideCard} background="none" padding="12px" width="100%">
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

                <DDCardUniversal className={styles.OverrideCard} background="none" padding="12px" width="100%">
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
                </DDCardUniversal>
              </RowBetween>
            </RowBetween>
          </ColumnFlex>
        </AddRemoveContent>
      </AddRemoveWrapper>
    </PositionPreviewAutoColumn>
  )
}
