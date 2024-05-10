import { DialogContent, DialogOverlay } from '@reach/dialog'
import CloseButtonIcon from 'assets/images/close-button.png'
import React from 'react'
import { animated, useSpring, useTransition } from 'react-spring'
import { useGesture } from 'react-use-gesture'
import styled, { css } from 'styled-components/macro'
import { Z_INDEX } from 'theme/zIndex'

import { isMobile } from '../../utils/userAgent'
export const MODAL_TRANSITION_DURATION = 200

const AnimatedDialogOverlay = animated(DialogOverlay)

const StyledDialogOverlay = styled(AnimatedDialogOverlay)<{ $scrollOverlay?: boolean }>`
  &[data-reach-dialog-overlay] {
    z-index: ${Z_INDEX.modalBackdrop};
    background-color: transparent;
    overflow: hidden;

    display: flex;
    align-items: center;
    @media screen and (max-width: ${({ theme }) => theme.breakpoint.sm}px) {
      align-items: flex-end;
    }
    overflow-y: ${({ $scrollOverlay }) => $scrollOverlay && 'scroll'};
    justify-content: center;

    background-color: ${({ theme }) => theme.backgroundScrim};
  }
`

type StyledDialogProps = {
  $minHeight?: number | false
  $maxHeight?: number
  $scrollOverlay?: boolean
  $hideBorder?: boolean
  $maxWidth: number
}

const AnimatedDialogContent = animated(DialogContent)
const StyledDialogContent = styled(AnimatedDialogContent)<StyledDialogProps>`
  // overflow-y: auto;
  position: relative;

  &[data-reach-dialog-content] {
    margin: auto;
    background-color: ${({ theme }) => theme.backgroundSurface};
    // border: ${({ theme, $hideBorder }) => !$hideBorder && `1px solid ${theme.backgroundOutline}`};
    border: 4px solid #000;

    box-shadow: 3px 3px 0px 2px #000;
    padding: 0px;
    width: 50vw;
    // overflow-y: auto;
    // overflow-x: hidden;
    max-width: ${({ $maxWidth }) => $maxWidth}px;
    ${({ $maxHeight }) =>
      $maxHeight &&
      css`
        max-height: ${$maxHeight}vh;
      `}
    ${({ $minHeight }) =>
      $minHeight &&
      css`
        min-height: ${$minHeight}vh;
      `}
    display: ${({ $scrollOverlay }) => ($scrollOverlay ? 'inline-table' : 'flex')};
    border-radius: 24px;

    // @media screen and (max-width: ${({ theme }) => theme.breakpoint.md}px) {
    //   width: 65vw;
    // }
    @media screen and (max-width: 768px) {
      // margin: 0;
      width: 96vw;
      border-radius: 24px;
      display: flex !important;
      overflow-y: unset !important;
      overflow-x: unset !important;
      // border-bottom-left-radius: 0;
      // border-bottom-right-radius: 0;
    }
  }
`
const CloseButton = styled.img`
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(17px, -20px);
  width: 40px;
  height: 40px;
  cursor: pointer;

  z-index: 1;
`
interface ModalProps {
  showCloseButton?: boolean
  isOpen: boolean
  onDismiss?: () => void
  onSwipe?: () => void
  height?: number // takes precedence over minHeight and maxHeight
  minHeight?: number | false
  maxHeight?: number
  maxWidth?: number
  initialFocusRef?: React.RefObject<any>
  children?: React.ReactNode
  $scrollOverlay?: boolean
  hideBorder?: boolean
}

export default function ModalV2({
  showCloseButton,
  isOpen,
  onDismiss,
  minHeight = false,
  maxHeight = 90,
  maxWidth = 420,
  height,
  initialFocusRef,
  children,
  onSwipe = onDismiss,
  $scrollOverlay,
  hideBorder = false,
}: ModalProps) {
  const fadeTransition = useTransition(isOpen, {
    config: { duration: MODAL_TRANSITION_DURATION },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  })

  const [{ y }, set] = useSpring(() => ({ y: -170, config: { mass: 1, tension: 210, friction: 20 } }))
  const bind = useGesture({
    onDrag: (state) => {
      set({
        y: state.down ? state.movement[1] : 0,
      })
      if (state.movement[1] > 300 || (state.velocity > 3 && state.direction[1] > 0)) {
        onSwipe?.()
      }
    },
  })

  return (
    <>
      {fadeTransition(
        ({ opacity }, item) =>
          item && (
            <StyledDialogOverlay
              style={{ opacity: opacity.to({ range: [0.0, 1.0], output: [0, 1] }) }}
              onDismiss={onDismiss}
              initialFocusRef={initialFocusRef}
              unstable_lockFocusAcrossFrames={false}
              $scrollOverlay={$scrollOverlay}
            >
              <StyledDialogContent
                {...(isMobile
                  ? {
                      ...bind(),
                      style: {
                        transform: y.interpolate(
                          // (y) => `translateY(${(y as number) > 0 || (y as number) < 0 ? y : 0}px)`
                          (y) => `translateY(${isMobile ? 0 : 0}px)`
                        ),
                      },
                    }
                  : {})}
                aria-label="dialog"
                $minHeight={height ?? minHeight}
                $maxHeight={height ?? maxHeight}
                $scrollOverlay={$scrollOverlay}
                $hideBorder={hideBorder}
                $maxWidth={maxWidth}
              >
                {showCloseButton && <CloseButton onClick={onDismiss} src={CloseButtonIcon} alt="close-button" />}
                {/* prevents the automatic focusing of inputs on mobile by the reach dialog */}
                {!initialFocusRef && isMobile ? <div tabIndex={1} /> : null}
                {children}
              </StyledDialogContent>
            </StyledDialogOverlay>
          )
      )}
    </>
  )
}
