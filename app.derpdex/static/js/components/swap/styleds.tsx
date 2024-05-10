import { SupportedChainId } from 'constants/chains'
import { transparentize } from 'polished'
import { ReactNode } from 'react'
import { AlertTriangle } from 'react-feather'
import { Text } from 'rebass'
import styled, { css } from 'styled-components/macro'
import { Z_INDEX } from 'theme/zIndex'

import { AutoColumn } from '../Column'

export const PageWrapper = styled.div`
  // padding: 180px 0px 0px;
  padding: 0px;
  max-width: 521px;
  width: 100%;
  z-index: 1;
  // @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
  //   padding-top: 48px;
  // }

  @media only screen and (min-width: 768px) and (max-width: 1600px) {
    max-width: 460px;
    padding: 10px 2% 108px 2%;
  }

  @media only screen and (max-width: 768px) {
    padding: 72px 2% 108px 2%;
  }
`

// Mostly copied from `AppBody` but it was getting too hard to maintain backwards compatibility.
export const SwapWrapper = styled.main<{ chainId: number | undefined }>`
  position: relative;
  background: ${({ theme }) => theme.backgroundSurface};
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.backgroundOutline};
  padding: 43px 36px;
  min-width: 521px;
  box-shadow: ${({ chainId }) => !!chainId && chainId === SupportedChainId.BNB && '0px 40px 120px 0px #f0b90b29'};
  z-index: ${Z_INDEX.deprecated_content};
  transition: transform 250ms ease;

  &:hover {
    border: 1px solid ${({ theme }) => theme.backgroundOutline};
  }

  @media only screen and (min-width: 768px) and (max-width: 1600px) {
    min-width: 0px;
    padding: 10px 16px;
  }

  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.sm}px`}) {
    min-width: 321px;
    padding: 10px 16px;
  }
`

export const ArrowWrapper = styled.div<{ clickable: boolean }>`
  position: relative;
  margin-top: -18px;
  margin-bottom: -60px;
  margin-left: auto;
  margin-right: auto;

  // Resposive Arrow
  height: 120px;

  @media only screen and (min-width: 768px) and (max-width: 1600px) {
    height: 100px;
  }

  @media only screen and (max-width: 768px) {
    height: 90px;
  }

  z-index: 2;
  ${({ clickable }) =>
    clickable
      ? css`
          svg {
            :hover {
              cursor: pointer;
              // opacity: 0.8;
            }
          }
        `
      : null}
`

export const ArrowWrapperV2 = styled.div<{ clickable: boolean }>`
  position: relative;
  margin-top: -18px;
  margin-bottom: -18px;
  z-index: 2;

  // @media only screen and (max-width: 768px) {
  //   height: 90px;
  // }

  ${({ clickable }) =>
    clickable
      ? css`
          svg {
            :hover {
              cursor: pointer;
              // opacity: 0.8;
            }
          }
        `
      : null}
`

export const ErrorText = styled(Text)<{ severity?: 0 | 1 | 2 | 3 | 4 }>`
  color: ${({ theme, severity }) =>
    severity === 3 || severity === 4
      ? theme.accentFailure
      : severity === 2
      ? theme.deprecated_yellow2
      : severity === 1
      ? theme.textPrimary
      : theme.textSecondary};
`

export const TruncatedText = styled(Text)`
  text-overflow: ellipsis;
  max-width: 220px;
  overflow: hidden;
  text-align: right;
`

// styles
export const Dots = styled.span`
  &::after {
    display: inline-block;
    animation: ellipsis 1.25s infinite;
    content: '.';
    width: 1em;
    text-align: left;
  }
  @keyframes ellipsis {
    0% {
      content: '.';
    }
    33% {
      content: '..';
    }
    66% {
      content: '...';
    }
  }
`

const SwapCallbackErrorInner = styled.div`
  background-color: ${({ theme }) => transparentize(0.9, theme.accentFailure)};
  border-radius: 1rem;
  display: flex;
  align-items: center;
  font-size: 0.825rem;
  width: 100%;
  padding: 3rem 1.25rem 1rem 1rem;
  margin-top: -2rem;
  color: ${({ theme }) => theme.accentFailure};
  z-index: -1;
  p {
    padding: 0;
    margin: 0;
    font-weight: 500;
  }
`

const SwapCallbackErrorInnerAlertTriangle = styled.div`
  background-color: ${({ theme }) => transparentize(0.9, theme.accentFailure)};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  border-radius: 12px;
  min-width: 48px;
  height: 48px;
`

export function SwapCallbackError({ error }: { error: ReactNode }) {
  return (
    <SwapCallbackErrorInner>
      <SwapCallbackErrorInnerAlertTriangle>
        <AlertTriangle size={24} />
      </SwapCallbackErrorInnerAlertTriangle>
      <p style={{ wordBreak: 'break-word' }}>{error}</p>
    </SwapCallbackErrorInner>
  )
}

export const SwapShowAcceptChanges = styled(AutoColumn)`
  background-color: ${({ theme }) => transparentize(0.95, theme.deprecated_primary3)};
  color: ${({ theme }) => theme.accentAction};
  padding: 0.5rem;
  border-radius: 12px;
  margin-top: 8px;
`
