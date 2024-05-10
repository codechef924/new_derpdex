import { Trans } from '@lingui/macro'
import { Currency } from '@uniswap/sdk-core'
import { FeeAmount } from '@uniswap/v3-sdk'
import { useWeb3React } from '@web3-react/core'
import { sendEvent } from 'components/analytics'
import Card from 'components/Card'
import { AutoColumn } from 'components/Column'
import { NunitoText } from 'components/CustomFonts/Nunito'
import { useFeeTierDistribution } from 'hooks/useFeeTierDistribution'
import { PoolState, usePools } from 'hooks/usePools'
import usePrevious from 'hooks/usePrevious'
import { DynamicSection, ShadowedBorder } from 'pages/AddLiquidity/styled'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components/macro'

import { FeeOption } from './FeeOption'
import { FEE_AMOUNT_DETAIL } from './shared'

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
const FocusedOutlineCard = styled(Card)<{ pulsing: boolean }>`
  border: 1px solid ${({ theme }) => theme.backgroundInteractive};
  animation: ${({ pulsing, theme }) => pulsing && pulse(theme.accentAction)} 0.6s linear;
  align-self: center;
`

const Select = styled.div`
  display: flex;
  align-items: flex-end;
  flex-direction: row;
  margin-top: 10px;

  height: 100px;

  gap: 17.67px;

  @media only screen and (max-width: 768px) {
    justify-content: space-between;
    flex-wrap: wrap;

    margin-top: 0px;

    height: 258px;

    gap: 6px;
  }
  // grid-auto-flow: column;
  // grid-gap: 17.67px;
`

export default function DerpFeeSelector({
  disabled = false,
  feeAmount,
  handleFeePoolSelect,
  currencyA,
  currencyB,
}: {
  disabled?: boolean
  feeAmount?: FeeAmount
  handleFeePoolSelect: (feeAmount: FeeAmount) => void
  currencyA?: Currency | undefined
  currencyB?: Currency | undefined
}) {
  const { chainId } = useWeb3React()

  const { isLoading, isError, largestUsageFeeTier, distributions } = useFeeTierDistribution(currencyA, currencyB)

  // get pool data on-chain for latest states
  const pools = usePools([
    [currencyA, currencyB, FeeAmount.LOWEST],
    [currencyA, currencyB, FeeAmount.LOW],
    [currencyA, currencyB, FeeAmount.MEDIUM],
    [currencyA, currencyB, FeeAmount.HIGH],
  ])

  const poolsByFeeTier: Record<FeeAmount, PoolState> = useMemo(
    () =>
      pools.reduce(
        (acc, [curPoolState, curPool]) => {
          acc = {
            ...acc,
            ...{ [curPool?.fee as FeeAmount]: curPoolState },
          }
          return acc
        },
        {
          // default all states to NOT_EXISTS
          [FeeAmount.LOWEST]: PoolState.NOT_EXISTS,
          [FeeAmount.LOW]: PoolState.NOT_EXISTS,
          [FeeAmount.MEDIUM]: PoolState.NOT_EXISTS,
          [FeeAmount.HIGH]: PoolState.NOT_EXISTS,
        }
      ),
    [pools]
  )

  // const [showOptions, setShowOptions] = useState(false)
  const [pulsing, setPulsing] = useState(false)

  const previousFeeAmount = usePrevious(feeAmount)

  const recommended = useRef(false)

  const handleFeePoolSelectWithEvent = useCallback(
    (fee: FeeAmount) => {
      sendEvent({
        category: 'FeePoolSelect',
        action: 'Manual',
      })
      handleFeePoolSelect(fee)
    },
    [handleFeePoolSelect]
  )

  useEffect(() => {
    if (feeAmount || isLoading || isError) {
      return
    }

    if (!largestUsageFeeTier) {
      // cannot recommend, open options
      // setShowOptions(true)
    } else {
      // setShowOptions(false)

      recommended.current = true
      sendEvent({
        category: 'FeePoolSelect',
        action: ' Recommended',
      })

      handleFeePoolSelect(largestUsageFeeTier)
    }
  }, [feeAmount, isLoading, isError, largestUsageFeeTier, handleFeePoolSelect])

  useEffect(() => {
    // setShowOptions(isError)
  }, [isError])

  useEffect(() => {
    if (feeAmount && previousFeeAmount !== feeAmount) {
      setPulsing(true)
    }
  }, [previousFeeAmount, feeAmount])

  return (
    <AutoColumn gap="16px">
      <DynamicSection gap="md" disabled={disabled}>
        <ShadowedBorder>
          <NunitoText size="lg2" weight={700}>
            <Trans>Select Fee tier</Trans>
          </NunitoText>

          {chainId && (
            <Select>
              {[FeeAmount.LOWEST, FeeAmount.LOW, FeeAmount.MEDIUM, FeeAmount.HIGH].map((_feeAmount, i) => {
                const { supportedChains } = FEE_AMOUNT_DETAIL[_feeAmount]
                if (supportedChains.includes(chainId)) {
                  return (
                    <FeeOption
                      feeAmount={_feeAmount}
                      active={feeAmount === _feeAmount}
                      onClick={() => handleFeePoolSelectWithEvent(_feeAmount)}
                      distributions={distributions}
                      poolState={poolsByFeeTier[_feeAmount]}
                      key={i}
                    />
                  )
                }
                return null
              })}
            </Select>
          )}
        </ShadowedBorder>
      </DynamicSection>
    </AutoColumn>
  )
}
