import React, { PropsWithChildren } from 'react'
import styled from 'styled-components/macro'
import { Z_INDEX } from 'theme/zIndex'

interface BodyWrapperProps {
  $margin?: string
  $maxWidth?: string
}

export const BodyWrapper = styled.main<BodyWrapperProps>`
  position: relative;
  margin-top: ${({ $margin }) => $margin ?? '0px'};
  max-width: ${({ $maxWidth }) => $maxWidth ?? '420px'};
  width: 100%;
  background: ${({ theme }) => theme.backgroundSurface};
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.backgroundOutline};
  margin-top: 1rem;
  margin-left: auto;
  margin-right: auto;
  z-index: ${Z_INDEX.deprecated_content};
  font-feature-settings: 'ss01' on, 'ss02' on, 'cv01' on, 'cv03' on;
`

// eslint-disable-next-line import/no-unused-modules
export const BodyWrapperNoOutline = styled.main<BodyWrapperProps>`
  position: relative;
  margin-top: ${({ $margin }) => $margin ?? '0px'};
  max-width: ${({ $maxWidth }) => $maxWidth ?? '420px'};
  width: 100%;
  background: ${({ theme }) => theme.backgroundSurface};
  // border-radius: 8px;
  // border: 1px solid ${({ theme }) => theme.backgroundOutline};
  margin-top: 1rem;
  margin-left: auto;
  margin-right: auto;
  z-index: ${Z_INDEX.deprecated_content};
  font-feature-settings: 'ss01' on, 'ss02' on, 'cv01' on, 'cv03' on;

  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    margin-top: 70px;
  }
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody(props: PropsWithChildren<BodyWrapperProps>) {
  return <BodyWrapper id="body-wrapper" {...props} />
}

export function AppBodyNoOutline(props: PropsWithChildren<BodyWrapperProps>) {
  return <BodyWrapperNoOutline {...props} />
}