import '@fontsource/nunito' // Defaults to weight 400

import { formatCurrencyAmount, formatNumber, NumberType } from '@uniswap/conedison/format'
import { Currency, CurrencyAmount } from '@uniswap/sdk-core'
import Column from 'components/Column'
import CurrencyLogo from 'components/Logo/CurrencyLogo'
import { MouseoverTooltip } from 'components/Tooltip'
import { useWindowSize } from 'hooks/useWindowSize'
import { PropsWithChildren, ReactNode } from 'react'
import { TextProps } from 'rebass'
import { Field } from 'state/swap/actions'
import styled from 'styled-components/macro'
import { BREAKPOINTS, ThemedText } from 'theme'

const MAX_AMOUNT_STR_LENGTH = 9

export const Label = styled(ThemedText.BodySmall)<{ cursor?: string }>`
  cursor: ${({ cursor }) => cursor};
  color: ${({ theme }) => theme.textSecondary};
  margin-right: 8px;
`

const ResponsiveHeadline = ({ children, ...textProps }: PropsWithChildren<TextProps>) => {
  const { width } = useWindowSize()

  if (width && width < BREAKPOINTS.xs) {
    return <ThemedText.HeadlineMedium {...textProps}>{children}</ThemedText.HeadlineMedium>
  }

  return (
    <ThemedText.HeadlineLarge fontWeight={600} {...textProps}>
      {children}
    </ThemedText.HeadlineLarge>
  )
}

interface AmountProps {
  field: Field
  tooltipText?: ReactNode
  label: ReactNode
  amount?: CurrencyAmount<Currency>
  usdAmount?: number
}

export const SwapRow = styled.div`
  width: 100%;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  padding: 0;
  -webkit-align-items: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  gap: md;

  * {
    font-family: 'Nunito' !important;
  }
`

export function SwapModalHeaderAmount({ tooltipText, label, amount, usdAmount, field }: AmountProps) {
  let formattedAmount = formatCurrencyAmount(amount, NumberType.TokenTx)
  if (formattedAmount.length > MAX_AMOUNT_STR_LENGTH) {
    formattedAmount = formatCurrencyAmount(amount, NumberType.SwapTradeAmount)
  }

  return (
    <SwapRow>
      <Column gap="xs">
        <ThemedText.BodySecondary>
          <MouseoverTooltip text={tooltipText} disabled={!tooltipText}>
            <Label cursor="help">{label}</Label>
          </MouseoverTooltip>
        </ThemedText.BodySecondary>
        <Column gap="xs">
          <ResponsiveHeadline data-testid={`${field}-amount`}>
            {formattedAmount} {amount?.currency.symbol}
          </ResponsiveHeadline>
          {usdAmount && (
            <ThemedText.BodySmall color="textTertiary">
              {formatNumber(usdAmount, NumberType.FiatTokenQuantity)}
            </ThemedText.BodySmall>
          )}
        </Column>
      </Column>
      {amount?.currency && <CurrencyLogo currency={amount.currency} size="36px" />}
    </SwapRow>
  )
}
