import { Trans } from '@lingui/macro'
import { Percent } from '@uniswap/sdk-core'
import { OutlineCard } from 'components/Card'
import styled, { useTheme } from 'styled-components/macro'
import { opacify } from 'theme/utils'

import { ThemedText } from '../../theme'
import { AutoColumn } from '../Column'
import { RowBetween, RowFixed } from '../Row'
import { MouseoverTooltip } from '../Tooltip'
import { formatPriceImpact } from './FormattedPriceImpact'

const StyledCard = styled(OutlineCard)`
  padding: 12px;
  border: 1px solid ${({ theme }) => opacify(24, theme.accentFailure)};
  border-radius: 8px;
`

interface PriceImpactWarningProps {
  priceImpact: Percent
}

export default function PriceImpactWarning({ priceImpact }: PriceImpactWarningProps) {
  const theme = useTheme()

  return (
    <StyledCard>
      <AutoColumn gap="sm">
        <MouseoverTooltip
          text={
            <Trans>
              A swap of this size may have a high price impact, given the current liquidity in the pool. There may be a
              large difference between the amount of your input token and what you will receive in the output token
            </Trans>
          }
        >
          <RowBetween>
            <RowFixed>
              <ThemedText.BodySmallNunito color={theme.accentFailure}>
                <Trans>Price impact warning</Trans>
              </ThemedText.BodySmallNunito>
            </RowFixed>
            <ThemedText.DeprecatedLabelNunito textAlign="right" fontSize={14} color={theme.accentFailure}>
              {formatPriceImpact(priceImpact)}
            </ThemedText.DeprecatedLabelNunito>
          </RowBetween>
        </MouseoverTooltip>
      </AutoColumn>
    </StyledCard>
  )
}
