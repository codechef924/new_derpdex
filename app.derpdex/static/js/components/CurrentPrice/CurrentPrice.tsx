import { Trans } from '@lingui/macro'
import { FeeAmount } from '@uniswap/v3-sdk'
import { ButtonGray } from 'components/Button'
import Card from 'components/Card'
import { AutoColumn } from 'components/Column'
import { ReactNode, useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components/macro'
import { ThemedText } from 'theme'

import { Input as NumericalInput } from '../NumericalInput'

const pulse = (color: string) => keyframes`
  0% {
    box-shadow: 0 0 0 0 ${color};
  }

  70% {
    box-shadow: 0 0 0 2px ${color};
  }

  100% {
    box-shadow: 0 0 0 0 ${color};
  }
`

const InputRow = styled.div`
  display: grid;

  grid-template-columns: 30px 1fr 30px;
`

const SmallButton = styled(ButtonGray)`
  border-radius: 8px;
  padding: 4px;
`

const CustomCard = styled(Card)<{ active?: boolean; pulsing?: boolean }>`
  border-color: 'none';
  padding: 12px;
  // animation: ${({ pulsing, theme }) => pulsing && pulse(theme.accentAction)} 0.8s linear;
`

const StyledInput = styled(NumericalInput)<{ usePercent?: boolean }>`
  background-color: transparent;
  text-align: center;
  width: 100%;
  font-weight: 500;
  padding: 0 10px;

  ${({ theme }) => theme.deprecated_mediaWidth.deprecated_upToSmall`
    font-size: 16px;
  `};

  ${({ theme }) => theme.deprecated_mediaWidth.deprecated_upToExtraSmall`
    font-size: 12px;
  `};
`

const DisabledStyledInput = styled.input<{ usePercent?: boolean }>`
  background-color: transparent;
  text-align: center;
  width: 100%;
  font-weight: 500;
  padding: 0 10px;
  font-size: 20px;

  ${({ theme }) => theme.deprecated_mediaWidth.deprecated_upToSmall`
    font-size: 16px;
  `};

  ${({ theme }) => theme.deprecated_mediaWidth.deprecated_upToExtraSmall`
    font-size: 12px;
  `};
`

const InputTitle = styled(ThemedText.DeprecatedSmall)`
  color: ${({ theme }) => theme.black};
  font-size: 20px;
  font-weight: 600;
`

const PairInfo = styled(ThemedText.DeprecatedSmall)`
  color: ${({ theme }) => theme.derpGray1};
  font-size: 20px;
  font-weight: 600;
`

const ButtonLabel = styled(ThemedText.DeprecatedWhite)<{ disabled: boolean }>`
  color: ${({ theme, disabled }) => (disabled ? theme.textSecondary : theme.textPrimary)} !important;
`

interface CurrentPriceProps {
  value: string
  feeAmount?: FeeAmount
  label?: string
  width?: string
  locked?: boolean // disable input
  title: ReactNode
  tokenA: string | undefined
  tokenB: string | undefined
  currentPrice?: string
}

const CurrentPrice = ({ value, width, locked, title, tokenA, tokenB }: CurrentPriceProps) => {
  //  for focus state, styled components doesnt let you select input parent container
  const [active, setActive] = useState(false)

  // let user type value and only update parent value on blur
  const [localValue, setLocalValue] = useState('')
  const [useLocalValue, setUseLocalValue] = useState(false)

  // animation if parent value updates local value
  const [pulsing, setPulsing] = useState<boolean>(false)

  useEffect(() => {
    if (localValue !== value && !useLocalValue) {
      setTimeout(() => {
        setLocalValue(value) // reset local value to match parent
        setPulsing(true) // trigger animation
        setTimeout(function () {
          setPulsing(false)
        }, 1800)
      }, 0)
    }
  }, [localValue, useLocalValue, value])

  return (
    <CustomCard
      className="custom-card-disabled"
      style={{
        width: '254px',
        maxWidth: '254px',
        padding: 0,
      }}
      pulsing={pulsing}
      active={active}
    >
      <AutoColumn style={{ padding: 0 }} gap="6px">
        <InputTitle fontSize={16} textAlign="center">
          {title}
        </InputTitle>

        <DisabledStyledInput
          style={{
            border: '1px solid #000',
            background: '#fff',
            padding: '10px 22px',
            borderRadius: '8px',
          }}
          disabled
          className="rate-input-0"
          value={localValue}
        />

        <PairInfo fontSize={16} textAlign="center">
          <Trans>
            {tokenB} per {tokenA}
          </Trans>
        </PairInfo>
      </AutoColumn>
    </CustomCard>
  )
}

export default CurrentPrice
