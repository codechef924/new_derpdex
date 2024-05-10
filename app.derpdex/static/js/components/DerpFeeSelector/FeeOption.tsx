import '@fontsource/nunito' // Defaults to weight 400

import { Trans } from '@lingui/macro'
import { FeeAmount } from '@uniswap/v3-sdk'
import { ButtonRadioChecked } from 'components/Button'
import { AutoColumn } from 'components/Column'
import { useFeeTierDistribution } from 'hooks/useFeeTierDistribution'
import { PoolState } from 'hooks/usePools'
import React from 'react'
import styled from 'styled-components/macro'
import { ThemedText } from 'theme'

import * as styles from './index.css'
import { FEE_AMOUNT_DETAIL } from './shared'

const ResponsiveText = styled(ThemedText.DeprecatedLabel)`
  line-height: 16px;
  font-size: 14px;

  ${({ theme }) => theme.deprecated_mediaWidth.deprecated_upToSmall`
    font-size: 12px;
    line-height: 12px;
  `};
`

const FeeOptionsColumn = styled.div`
  display: grid;
  grid-auto-rows: auto;
  grid-row-gap: 6px;
  justify-items: center;

  * {
    font-family: 'Nunito' !important;
  }
`

interface FeeOptionProps {
  feeAmount: FeeAmount
  active: boolean
  distributions: ReturnType<typeof useFeeTierDistribution>['distributions']
  poolState: PoolState
  onClick: () => void
}

export function FeeOption({ feeAmount, active, poolState, distributions, onClick }: FeeOptionProps) {
  return (
    <ButtonRadioChecked className={styles.TierStyling} active={active} onClick={onClick}>
      <AutoColumn
        style={{
          width: '100%',
        }}
        gap="sm"
        justify="center"
      >
        <FeeOptionsColumn>
          {active && (
            <>
              <ResponsiveText>
                <Trans>{FEE_AMOUNT_DETAIL[feeAmount].label}%</Trans>
              </ResponsiveText>
              <ThemedText.DerpBlack fontWeight={400} fontSize="12px" textAlign="center">
                {FEE_AMOUNT_DETAIL[feeAmount].description}
              </ThemedText.DerpBlack>
            </>
          )}
          {!active && (
            <>
              <ResponsiveText>
                <Trans>{FEE_AMOUNT_DETAIL[feeAmount].label}%</Trans>
              </ResponsiveText>
              <ThemedText.DerpGrayV1 fontWeight={400} fontSize="12px" textAlign="center">
                {FEE_AMOUNT_DETAIL[feeAmount].description}
              </ThemedText.DerpGrayV1>
            </>
          )}
        </FeeOptionsColumn>

        {/* {distributions && (
          <FeeTierPercentageBadge
            distributions={distributions}
            feeAmount={feeAmount}
            poolState={poolState}
          ></FeeTierPercentageBadge>
        )} */}
      </AutoColumn>
    </ButtonRadioChecked>
  )
}
