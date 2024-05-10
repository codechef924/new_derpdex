import { t, Trans } from '@lingui/macro'
import { Currency } from '@uniswap/sdk-core'
import { useWeb3React } from '@web3-react/core'
import { DDButtonPrimary } from 'components/Button'
import { ColumnCenter } from 'components/Column'
import Column from 'components/Column'
import { NunitoText } from 'components/CustomFonts/Nunito'
import { ExplorerList } from 'components/ExplorerLink'
import Row from 'components/Row'
import { useGetConnection } from 'connection'
import { SupportedChainId } from 'constants/chains'
import TokenLogoLookupTable from 'constants/TokenLogoLookupTable'
import { useUnmountingAnimation } from 'hooks/useUnmountingAnimation'
import { ReactNode, useRef } from 'react'
import { InterfaceTrade } from 'state/routing/types'
import { useIsTransactionConfirmed } from 'state/transactions/hooks'
import styled, { css, keyframes } from 'styled-components/macro'
import { ExternalLink } from 'theme'
import { ThemedText } from 'theme/components/text'

import { ConfirmModalState } from '../ConfirmSwapModal'
import {
  AnimatedEntranceConfirmationIcon,
  AnimationType,
  CurrencyLoader,
  LoadingIndicatorOverlay,
  LogoContainer,
  PaperIcon,
} from './Logos'
import { TradeSummary } from './TradeSummary'

export const PendingModalContainer = styled(ColumnCenter)`
  margin: 48px 0 28px;
`

const HeaderContainer = styled(ColumnCenter)<{ $disabled?: boolean }>`
  ${({ $disabled }) => $disabled && `opacity: 0.5;`}
  padding: 0 32px;
  overflow: visible;
`

const StepCircle = styled.div<{ active: boolean }>`
  height: 10px;
  width: 10px;
  border-radius: 50%;
  background: ${({ theme, active }) => (active ? theme.derpGradientPrimary : theme.textTertiary)};
  outline: 1px solid ${({ theme, active }) => (active ? theme.derpPurp2 : theme.derpPurp2)};
  transition: background-color ${({ theme }) => `${theme.transition.duration.medium} ${theme.transition.timing.inOut}`};
`

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(40px) }
  to { opacity: 1; transform: translateX(0px) }
`
const slideInAnimation = css`
  animation: ${slideIn} ${({ theme }) => `${theme.transition.duration.medium} ${theme.transition.timing.inOut}`};
`
const slideOut = keyframes`
  from { opacity: 1; transform: translateX(0px) }
  to { opacity: 0; transform: translateX(-40px) }
`
const slideOutAnimation = css`
  animation: ${slideOut} ${({ theme }) => `${theme.transition.duration.medium} ${theme.transition.timing.inOut}`};
`

const AnimationWrapper = styled.div`
  position: relative;
  width: 100%;
  min-height: 72px;
  display: flex;
  flex-grow: 1;
`

const StepTitleAnimationContainer = styled(Column)<{ disableEntranceAnimation?: boolean }>`
  position: absolute;
  width: 100%;
  align-items: center;
  transition: display ${({ theme }) => `${theme.transition.duration.medium} ${theme.transition.timing.inOut}`};
  ${({ disableEntranceAnimation }) =>
    !disableEntranceAnimation &&
    css`
      ${slideInAnimation}
    `}

  &.${AnimationType.EXITING} {
    ${slideOutAnimation}
  }
`

const ExplorerHolder = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  background: #413f3f;
  border-radius: 8px;
  width: 231px;
  height: 28px;
  font-size: 14px;
  color: white;
  font-weight: 600;
`

const ColumnFixed = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const BoldText = styled.div`
  color: black;
  font-weight: 600;
  font-size: 14px;
`

// This component is used for all steps after ConfirmModalState.REVIEWING
export type PendingConfirmModalState = Extract<
  ConfirmModalState,
  ConfirmModalState.APPROVING_TOKEN | ConfirmModalState.PERMITTING | ConfirmModalState.PENDING_CONFIRMATION
>

interface PendingModalStep {
  title: ReactNode
  subtitle?: ReactNode
  label?: ReactNode
  logo?: ReactNode
  button?: ReactNode
}

interface PendingModalContentProps {
  steps: PendingConfirmModalState[]
  currentStep: PendingConfirmModalState
  trade?: InterfaceTrade
  swapTxHash?: string
  hideStepIndicators?: boolean
  tokenApprovalPending?: boolean
}

interface ContentArgs {
  step: PendingConfirmModalState
  approvalCurrency?: Currency
  trade?: InterfaceTrade
  swapConfirmed: boolean
  swapPending: boolean
  tokenApprovalPending: boolean
  swapTxHash?: string
  chainId?: number
}

function getContent(args: ContentArgs): PendingModalStep {
  const { step, approvalCurrency, swapConfirmed, swapPending, tokenApprovalPending, trade, swapTxHash, chainId } = args
  switch (step) {
    case ConfirmModalState.APPROVING_TOKEN:
      return {
        title: t`Enable spending limits for ${approvalCurrency?.symbol ?? 'this token'} on DerpDEX`,
        subtitle: (
          <ExternalLink href="https://support.uniswap.org/hc/en-us/articles/8120520483085">
            <Trans>
              <NunitoText size="lg2">Why is this required?</NunitoText>
            </Trans>
          </ExternalLink>
        ),
        label: tokenApprovalPending ? t`Pending...` : t`Proceed in your wallet`,
      }
    case ConfirmModalState.PERMITTING:
      return {
        title: t`Allow ${approvalCurrency?.symbol ?? 'this token'} to be used for swapping`,
        subtitle: (
          <ExternalLink href="https://support.uniswap.org/hc/en-us/articles/8120520483085">
            <Trans>
              <NunitoText size="lg2">Why is this required?</NunitoText>
            </Trans>
          </ExternalLink>
        ),
        label: t`Proceed in your wallet`,
      }
    case ConfirmModalState.PENDING_CONFIRMATION:
      return {
        title: swapPending ? t`Transaction submitted` : swapConfirmed ? t`Success` : t`Confirm Swap`,
        subtitle: trade ? <TradeSummary trade={trade} /> : null,
        label:
          swapConfirmed && swapTxHash && chainId ? (
            <ExplorerList chainId={chainId} hash={swapTxHash} />
          ) : !swapPending ? (
            <NunitoText size="lg">Proceed in your wallet</NunitoText>
          ) : null,
      }
  }
}

export function PendingModalContent({
  steps,
  currentStep,
  trade,
  swapTxHash,
  hideStepIndicators,
  tokenApprovalPending = false,
}: PendingModalContentProps) {
  const { chainId, connector } = useWeb3React()
  const getConnection = useGetConnection()
  const swapConfirmed = useIsTransactionConfirmed(swapTxHash)
  const swapPending = swapTxHash !== undefined && !swapConfirmed
  const { label, button } = getContent({
    step: currentStep,
    approvalCurrency: trade?.inputAmount.currency,
    swapConfirmed,
    swapPending,
    tokenApprovalPending,
    swapTxHash,
    trade,
    chainId,
  })
  const currentStepContainerRef = useRef<HTMLDivElement>(null)
  useUnmountingAnimation(currentStepContainerRef, () => AnimationType.EXITING)

  if (steps.length === 0) {
    return null
  }

  // On mainnet, we show the success icon once the tx is sent, since it takes longer to confirm than on L2s.
  const showSuccess = swapConfirmed || (swapPending && chainId === SupportedChainId.MAINNET)

  const connection = getConnection(connector)
  const addToWallet = async () => {
    // const inputCurrency = trade?.routes[0].input
    // const outputCurrency = trade?.routes[trade?.routes.length - 1].output
    const outputCurrency = trade?.outputAmount.currency
    if (outputCurrency?.isToken && connection) {
      try {
        const uris = TokenLogoLookupTable.getIcons(outputCurrency?.address, chainId) ?? []
        console.log('connection', connection)

        await connection.connector.watchAsset?.({
          address: outputCurrency?.wrapped.address,
          symbol: outputCurrency?.symbol || 'UNKNOWN',
          decimals: outputCurrency?.decimals,
          image: uris.length > 0 ? uris[0] : '',
        })
      } catch (error) {
        //user rejected
        console.log('err', error)
      }
    }
  }
  return (
    <PendingModalContainer gap="lg">
      <LogoContainer>
        {/* Shown during the first step, and fades out afterwards. */}
        {currentStep === ConfirmModalState.APPROVING_TOKEN && <PaperIcon />}
        {/* Shown during the first step as a small badge. */}
        {/* Scales up once we transition from first to second step. */}
        {/* Fades out after the second step. */}
        {currentStep !== ConfirmModalState.PENDING_CONFIRMATION && (
          <CurrencyLoader
            currency={trade?.inputAmount.currency}
            asBadge={currentStep === ConfirmModalState.APPROVING_TOKEN}
          />
        )}
        {/* Shown only during the third step under "success" conditions, and scales in. */}
        {currentStep === ConfirmModalState.PENDING_CONFIRMATION && showSuccess && <AnimatedEntranceConfirmationIcon />}
        {/* Scales in for the first step if the approval is pending onchain confirmation. */}
        {/* Scales in for the third step if the swap is pending user signature or onchain confirmation. */}
        {((currentStep === ConfirmModalState.PENDING_CONFIRMATION && !showSuccess) || tokenApprovalPending) && (
          <LoadingIndicatorOverlay />
        )}
      </LogoContainer>
      <HeaderContainer gap="md" $disabled={tokenApprovalPending || swapPending}>
        <AnimationWrapper>
          {steps.map((step) => {
            const { title, subtitle } = getContent({
              step,
              approvalCurrency: trade?.inputAmount.currency,
              swapConfirmed,
              swapPending,
              tokenApprovalPending,
              swapTxHash,
              trade,
            })
            // We only render one step at a time, but looping through the array allows us to keep
            // the exiting step in the DOM during its animation.
            return (
              Boolean(step === currentStep) && (
                <StepTitleAnimationContainer
                  disableEntranceAnimation={steps[0] === currentStep}
                  gap="md"
                  key={step}
                  ref={step === currentStep ? currentStepContainerRef : undefined}
                >
                  <ThemedText.SubHeaderLarge
                    fontWeight={600}
                    textAlign="center"
                    data-testid="pending-modal-content-title"
                  >
                    <NunitoText>{title}</NunitoText>
                  </ThemedText.SubHeaderLarge>
                  <ThemedText.LabelSmall textAlign="center">
                    <NunitoText>{subtitle}</NunitoText>
                  </ThemedText.LabelSmall>
                </StepTitleAnimationContainer>
              )
            )
          })}
        </AnimationWrapper>
        <Row justify="center" marginBottom="32px" minHeight="24px">
          <ThemedText.Caption color="textSecondary">{label}</ThemedText.Caption>
        </Row>
        {currentStep === ConfirmModalState.PENDING_CONFIRMATION && showSuccess && (
          <DDButtonPrimary
            data-testid="confirm-swap-button"
            onClick={addToWallet}
            $borderRadius="12px"
            style={{ margin: '0' }}
          >
            <ThemedText.HeadlineSmall color="accentTextLightPrimary">
              <Trans>Add </Trans> {trade?.outputAmount.currency.symbol} <Trans> to Wallet</Trans>
            </ThemedText.HeadlineSmall>
          </DDButtonPrimary>
        )}
      </HeaderContainer>
      {button && <Row justify="center">{button}</Row>}
      {!hideStepIndicators && (
        <Row gap="14px" justify="center">
          {steps.map((_, i) => {
            return <StepCircle key={i} active={steps.indexOf(currentStep) === i} />
          })}
        </Row>
      )}
    </PendingModalContainer>
  )
}
