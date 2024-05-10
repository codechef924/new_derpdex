import { Trans } from '@lingui/macro'
import { Player } from '@lottiefiles/react-lottie-player'
import { DialogOverlay } from '@reach/dialog'
import CloseButtonIcon from 'assets/images/close-button.png'
import { ReactComponent as FailedIcon } from 'assets/svg/something-went-wrong.svg'
import { DDButtonLight } from 'components/Button'
import { GloriaText } from 'components/CustomFonts/GloriaHallelujah'
import { NunitoText } from 'components/CustomFonts/Nunito'
import { ZapToEarnStateTransition } from 'pages/ZapToEarn/hooks/useZapToEarn'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { animated } from 'react-spring'
import styled from 'styled-components'
import { Z_INDEX } from 'theme/zIndex'

import * as styles from './../../css-override.css'
import animationData from './lightning-blink.json'

const ZapContent = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: flex-start;
  align-items: center;

  padding: 20px 16px;
  gap: 16px;
`

const Title = styled.div`
  font-size: 24px;
  font-weight: 700;
`
const InfoMainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;

  margin-top: 2px;
  margin-bottom: 12px;
  gap: 8px;
`

const CloseButton = styled.img`
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(17px, -20px);
  width: 40px;
  height: 40px;
  cursor: pointer;
`

const InfoBounded = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  border-radius: 16px;
  border: 4px solid #000;
  background: #ffffffd6;
  box-shadow: 3px 3px 0px 0px #000;
  width: 100%;

  padding: 16px;

  z-index: 3;

  * {
    font-size: 18px;
  }

  .bolded {
    font-weight: 700;
  }
  .underlined {
    text-decoration: underline;
    white-space: nowrap;
  }
`

const RowInfo = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  gap: 8px;
`

const BoundedMini = styled.div`
  border-radius: 16px;
  border: 4px solid #000;
  background: #ffffffd6;
  box-shadow: 3px 3px 0px 0px #000;
  padding: 16px;
  width: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  .bolded {
    font-weight: 700;
  }
  .underlined {
    text-decoration: underline;
  }
  z-index: 3;
`
const AnimationWrapper = styled.div`
  position: absolute;
  top: 0;
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  transform: translateY(-30px);
  svg {
    width: 350px !important;
    height: 350px !important;
  }
  z-index: 2;
  pointer-events: none;
`
const AnimatedDialogOverlay = animated(DialogOverlay)
const AbsoluteLoading = styled(AnimatedDialogOverlay)`
  &[data-reach-dialog-overlay] {
    z-index: ${Z_INDEX.modalBackdrop};
    background-color: transparent;
    overflow: hidden;

    display: flex;
    align-items: center;
    @media screen and (max-width: ${({ theme }) => theme.breakpoint.sm}px) {
      align-items: flex-end;
    }
    overflow-y: scroll;
    justify-content: center;

    background-color: ${({ theme }) => theme.backgroundScrim};
  }
`

const ZappingModeRoot = styled.div`
  display: flex;
  flex-direction: column;

  justify-content: center;
  align-items: center;
`
const TextOverlay = styled.div`
  font-size: 42px;
  font-style: normal;
  font-weight: 400;
  background: ${({ theme }) => theme.derpGradientPrimary};
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`
const ZapImg = styled.img`
  @media only screen and (max-width: 1600px) {
    width: 200px;
  }
`

const FailedAttempContent = styled.div`
  background: #ff5656;
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
  border-radius: 16px;
  padding: 30px 16px;
  gap: 16px;
`

const SuccessAttempContent = styled.div`
  background: #fff;
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
  border-radius: 16px;
  padding: 30px 16px;
  gap: 16px;
`
type TextType = {
  isSuccess: boolean
}
const TextColumnFlex = styled.div<TextType>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: ${({ isSuccess }) => (isSuccess ? '#000' : '#fff')};
  .focused {
    font-size: 20px;
    font-weight: 700;
  }
  .normal {
    font-size: 18px;
    font-weight: 500;
  }
  .underlined {
    text-decoration: underline;
  }
`

const TextBordered = styled.div`
  background: ${({ theme }) => theme.derpGradientPrimary};
  padding: 10px 16px;
  border-radius: 8px;
  color: #fff !important;
  cursor: pointer;
`

const ErrorReason = styled(NunitoText)`
  border-radius: 16px;
  background: #000;
  color: #fff;
  padding 4px 12px;
`

const SimplePie = () => {
  return (
    <AnimationWrapper>
      <Player autoplay loop={false} src={animationData} style={{ height: '150x', width: '150x' }}></Player>
    </AnimationWrapper>
  )
}

const ZapButtonText: { [key: string]: string } = {
  Unattempted: 'Confirm Zap',
  Loading: 'Zapping',
  Success: 'Success!',
}

const ZapConfirmationContent = ({
  initiateCallback,
  zapToEarnResult,
  onDismiss,
  zapDetails,
}: {
  initiateCallback: () => void
  zapToEarnResult: string
  onDismiss: () => void
  zapDetails: ZapDetails
}) => {
  return (
    <ZapContent>
      <CloseButton onClick={onDismiss} src={CloseButtonIcon} alt="close-button" />
      <Title>
        <NunitoText>
          {zapToEarnResult === ZapToEarnStateTransition.LOADING ? <>Zapping!</> : <>You're about to Zap</>}
        </NunitoText>
      </Title>
      <InfoMainWrapper>
        <InfoBounded>
          <NunitoText>
            <span className="bolded">
              {zapDetails.amountToZap} {zapDetails.inputSymbol}
            </span>{' '}
            on{' '}
            <span className="bolded underlined">
              {zapDetails.lpPair?.[0]} / {zapDetails.lpPair?.[1]}
            </span>{' '}
            pool
          </NunitoText>
        </InfoBounded>
        <RowInfo>
          <BoundedMini>
            <NunitoText>
              <span className="bolded">50%</span> <span className="bolded underlined">{zapDetails.lpPair?.[0]}</span>
            </NunitoText>
          </BoundedMini>
          <BoundedMini>
            <NunitoText>
              <span className="bolded">50%</span> <span className="bolded underlined">{zapDetails.lpPair?.[1]}</span>
            </NunitoText>
          </BoundedMini>
        </RowInfo>
      </InfoMainWrapper>
      <SimplePie />
      <DDButtonLight
        disabled={zapToEarnResult === ZapToEarnStateTransition.LOADING}
        onClick={initiateCallback}
        className={styles.ZapButtonOverride}
      >
        <GloriaText size="lg">
          <Trans>{ZapButtonText[zapToEarnResult]}</Trans>
        </GloriaText>
      </DDButtonLight>
    </ZapContent>
  )
}

interface ZapDetails {
  inputSymbol?: string
  lpPair?: Array<string | undefined>
  amountToZap: string
}

export const ZapConfirmationModal = ({
  zapDetails,
  initiateCallback,
  zapToEarnResult,
  onDismiss,
  possibleErrorMsg,
}: {
  zapDetails: ZapDetails
  initiateCallback: () => void
  zapToEarnResult: string
  onDismiss: () => void
  possibleErrorMsg?: string | undefined
}) => {
  const navigate = useNavigate()
  const pastAmount = useRef(zapDetails)

  return (
    <>
      {zapToEarnResult !== ZapToEarnStateTransition.FAILED ? (
        <ZapConfirmationContent
          initiateCallback={initiateCallback}
          zapToEarnResult={zapToEarnResult}
          onDismiss={onDismiss}
          zapDetails={zapDetails}
        />
      ) : (
        <FailedAttempContent>
          <CloseButton onClick={onDismiss} src={CloseButtonIcon} alt="close-button" />
          <FailedIcon />
          <TextColumnFlex isSuccess={false}>
            <NunitoText className="focused">Something went wrong</NunitoText>
            <NunitoText className="normal">Failed to Zap {zapDetails.inputSymbol}</NunitoText>
            {possibleErrorMsg && typeof possibleErrorMsg === 'string' && (
              <ErrorReason>Reason: {possibleErrorMsg}</ErrorReason>
            )}
          </TextColumnFlex>
        </FailedAttempContent>
      )}
    </>
  )
}
