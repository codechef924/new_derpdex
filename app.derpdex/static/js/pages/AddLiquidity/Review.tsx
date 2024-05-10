import { Position } from '@derpdex/sdk'
import { Currency, CurrencyAmount, Price } from '@uniswap/sdk-core'
import { AutoColumn } from 'components/Column'
import { PositionPreviewModal } from 'components/PositionPreview/index-modal'
import styled from 'styled-components/macro'

import { Bound, Field } from '../../state/mint/v3/actions'

const Wrapper = styled.div`
  // padding-top: 12px;
`

export function Review({
  position,
  outOfRange,
  ticksAtLimit,
}: {
  position?: Position
  existingPosition?: Position
  parsedAmounts: { [field in Field]?: CurrencyAmount<Currency> }
  priceLower?: Price<Currency, Currency>
  priceUpper?: Price<Currency, Currency>
  outOfRange: boolean
  ticksAtLimit: { [bound in Bound]?: boolean | undefined }
}) {
  return (
    <Wrapper>
      <AutoColumn gap="lg">
        {position ? (
          <PositionPreviewModal
            position={position}
            inRange={!outOfRange}
            ticksAtLimit={ticksAtLimit}
            title="Selected Range"
          />
        ) : null}
      </AutoColumn>
    </Wrapper>
  )
}
