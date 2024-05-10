import { Trans } from '@lingui/macro'
import { Percent } from '@uniswap/sdk-core'
import { NunitoText } from 'components/CustomFonts/Nunito'
import Expand from 'components/Expand'
import QuestionHelper from 'components/QuestionHelper'
import Row, { RowBetween } from 'components/Row'
import React, { useState } from 'react'
import { useUserSlippageTolerance } from 'state/user/hooks'
import { SlippageTolerance } from 'state/user/types'
import styled from 'styled-components/macro'
import { CautionTriangle, ThemedText } from 'theme'

import { Input, InputContainer } from '../Input'

enum SlippageError {
  InvalidInput = 'InvalidInput',
}

const Option = styled(Row)<{ isActive: boolean }>`
  width: 97.584px;
  min-height: 29px;
  flex-shrink: 0;
  cursor: pointer;
  padding: 6px 12px;
  text-align: center;
  gap: 4px;
  border-radius: 200px;
  border: 2px solid #000;
  background: ${({ isActive, theme }) => (isActive ? theme.derpGradientPrimary : 'transparent')};
  color: ${({ isActive, theme }) => (isActive ? theme.white : theme.black)};
  pointer-events: ${({ isActive }) => isActive && 'none'};

  #text {
    text-align: center;
    width: 100%;
  }
`

const Switch = styled(Row)`
  width: auto;
  padding: 4px;
  border: 1px solid ${({ theme }) => theme.backgroundOutline};
  border-radius: 16px;
`

const RowFlex = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
`

const NUMBER_WITH_MAX_TWO_DECIMAL_PLACES = /^(?:\d*\.\d{0,2}|\d+)$/
const MINIMUM_RECOMMENDED_SLIPPAGE = new Percent(5, 10_000)
const MAXIMUM_RECOMMENDED_SLIPPAGE = new Percent(1, 100)

export default function MaxSlippageSettingsMinimal({ autoSlippage }: { autoSlippage: Percent }) {
  const [userSlippageTolerance, setUserSlippageTolerance] = useUserSlippageTolerance()

  // In order to trigger `custom` mode, we need to set `userSlippageTolerance` to a value that is not `auto`.
  // To do so, we use `autoSlippage` value. However, since users are likely to change that value,
  // we render it as a placeholder instead of a value.
  const defaultSlippageInputValue =
    userSlippageTolerance !== SlippageTolerance.Auto && !userSlippageTolerance.equalTo(autoSlippage)
      ? userSlippageTolerance.toFixed(2)
      : ''

  // If user has previously entered a custom slippage, we want to show that value in the input field
  // instead of a placeholder.
  const [slippageInput, setSlippageInput] = useState(defaultSlippageInputValue)
  const [slippageError, setSlippageError] = useState<SlippageError | false>(false)

  // If user has previously entered a custom slippage, we want to show the settings expanded by default.
  const [isOpen, setIsOpen] = useState(defaultSlippageInputValue.length > 0)

  const parseSlippageInput = (value: string) => {
    // Do not allow non-numerical characters in the input field or more than two decimals
    if (value.length > 0 && !NUMBER_WITH_MAX_TWO_DECIMAL_PLACES.test(value)) {
      return
    }

    setSlippageInput(value)
    setSlippageError(false)

    // If the input is empty, set the slippage to the default
    if (value.length === 0) {
      setUserSlippageTolerance(SlippageTolerance.Auto)
      return
    }

    if (value === '.') {
      return
    }

    // Parse user input and set the slippage if valid, error otherwise
    try {
      const parsed = Math.floor(Number.parseFloat(value) * 100)
      if (parsed > 5000) {
        setSlippageError(SlippageError.InvalidInput)
      } else {
        setUserSlippageTolerance(new Percent(parsed, 10_000))
      }
    } catch (e) {
      setSlippageError(SlippageError.InvalidInput)
    }
  }

  const tooLow =
    userSlippageTolerance !== SlippageTolerance.Auto && userSlippageTolerance.lessThan(MINIMUM_RECOMMENDED_SLIPPAGE)
  const tooHigh =
    userSlippageTolerance !== SlippageTolerance.Auto && userSlippageTolerance.greaterThan(MAXIMUM_RECOMMENDED_SLIPPAGE)

  return (
    <Expand
      testId="max-slippage-settings"
      isOpen={isOpen}
      onToggle={() => setIsOpen(!isOpen)}
      header={
        <Row width="auto">
          <ThemedText.BodySecondary>
            <NunitoText
              style={{
                fontSize: '18px',
                fontWeight: '800',
                color: '#000',
              }}
            >
              <Trans>Max slippage</Trans>
            </NunitoText>
          </ThemedText.BodySecondary>
          <QuestionHelper
            text={
              <Trans>Your transaction will revert if the price changes unfavorably by more than this percentage.</Trans>
            }
          />
        </Row>
      }
      button={<></>}
    >
      <RowBetween gap="md">
        <RowFlex id="row-between-slippage">
          <Option
            onClick={() => {
              // Reset the input field when switching to auto
              setSlippageInput('')
              setUserSlippageTolerance(SlippageTolerance.Auto)
            }}
            isActive={userSlippageTolerance === SlippageTolerance.Auto}
          >
            <NunitoText id="text" size="md2" weight={700}>
              <Trans>Auto</Trans>
            </NunitoText>
          </Option>
          <Option
            onClick={() => {
              // When switching to custom slippage, use `auto` value as a default.
              setUserSlippageTolerance(autoSlippage)
            }}
            isActive={userSlippageTolerance !== SlippageTolerance.Auto}
          >
            <NunitoText id="text" size="md2">
              <Trans>Custom</Trans>
            </NunitoText>
          </Option>
        </RowFlex>
        <InputContainer gap="md" error={!!slippageError}>
          <Input
            data-testid="slippage-input"
            placeholder={autoSlippage.toFixed(2)}
            value={slippageInput}
            onChange={(e) => parseSlippageInput(e.target.value)}
            onBlur={() => {
              // When the input field is blurred, reset the input field to the default value
              setSlippageInput(defaultSlippageInputValue)
              setSlippageError(false)
            }}
          />
          <ThemedText.BodyPrimary>%</ThemedText.BodyPrimary>
        </InputContainer>
      </RowBetween>
      {tooLow || tooHigh ? (
        <RowBetween gap="md">
          <CautionTriangle />
          <ThemedText.Caption color="accentWarning">
            {tooLow ? (
              <Trans>
                Slippage below {MINIMUM_RECOMMENDED_SLIPPAGE.toFixed(2)}% may result in a failed transaction
              </Trans>
            ) : (
              <Trans>Your transaction may be frontrun and result in an unfavorable trade.</Trans>
            )}
          </ThemedText.Caption>
        </RowBetween>
      ) : null}
    </Expand>
  )
}
