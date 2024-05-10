import { darken } from 'polished'
import { useState } from 'react'
import styled, { keyframes } from 'styled-components/macro'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Wrapper = styled.button<{ isActive?: boolean; activeElement?: boolean }>`
  align-items: center;
  background: ${({ isActive, theme }) => (isActive ? theme.accentActionSoft : 'transparent')};
  border: ${({ theme, isActive }) => (isActive ? '1px solid transparent' : `1px solid ${theme.backgroundOutline}`)};
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  outline: none;
  padding: 4px;
  width: fit-content;
`

const DDWrapper = styled.button<{ isActive?: boolean; activeElement?: boolean }>`
  align-items: center;

  cursor: pointer;
  display: flex;
  outline: none;
  padding: 4px;

  border-radius: 200px;
  border: 2px solid #000;
  background: #fff;

  width: 64.262px;
  height: 15px;
  flex-shrink: 0;

  position: relative;
`

const turnOnToggle = keyframes`
  from {
    margin-left: 0em;
    margin-right: 2.2em;
  }
  to {
    margin-left: 2.2em;
    margin-right: 0em;
  }
`

const turnOffToggle = keyframes`
  from {
    margin-left: 2.2em;
    margin-right: 0em;
  }
  to {
    margin-left: 0em;
    margin-right: 2.2em;
  }
`

const ToggleElementHoverStyle = (hasBgColor: boolean, theme: any, isActive?: boolean) =>
  hasBgColor
    ? {
        opacity: '0.8',
      }
    : {
        background: isActive ? darken(0.05, theme.accentAction) : darken(0.05, theme.deprecated_bg4),
        color: isActive ? theme.white : theme.textTertiary,
      }

const DDToggleElementHoverStyle = (hasBgColor: boolean, theme: any, isActive?: boolean) =>
  hasBgColor
    ? {
        opacity: '0.8',
      }
    : {
        background: isActive ? darken(0.2, theme.white) : darken(0.05, theme.deprecated_bg4),
        color: isActive ? theme.white : theme.textTertiary,
      }

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ToggleElement = styled.span<{ isActive?: boolean; bgColor?: string; isInitialToggleLoad?: boolean }>`
  animation: 0.1s
    ${({ isActive, isInitialToggleLoad }) => (isInitialToggleLoad ? 'none' : isActive ? turnOnToggle : turnOffToggle)}
    ease-in;
  background: ${({ theme, bgColor, isActive }) =>
    isActive ? bgColor ?? theme.accentAction : bgColor ? theme.deprecated_bg4 : theme.textTertiary};
  border-radius: 50%;
  height: 24px;
  :hover {
    ${({ bgColor, theme, isActive }) => ToggleElementHoverStyle(!!bgColor, theme, isActive)}
  }
  margin-left: ${({ isActive }) => isActive && '2.2em'};
  margin-right: ${({ isActive }) => !isActive && '2.2em'};
  width: 24px;
`

const DDToggleElement = styled.span<{ isActive?: boolean; bgColor?: string; isInitialToggleLoad?: boolean }>`
  animation: 0.1s
    ${({ isActive, isInitialToggleLoad }) => (isInitialToggleLoad ? 'none' : isActive ? turnOnToggle : turnOffToggle)}
    ease-in;

  width: 33px;
  height: 33px;
  flex-shrink: 0;
  :hover {
    ${({ bgColor, theme, isActive }) => DDToggleElementHoverStyle(!!bgColor, theme, isActive)}
  }
  margin-left: ${({ isActive }) => isActive && '2.8em'};
  margin-right: ${({ isActive }) => !isActive && '1.5em'};

  border-radius: 50%;
  border: 2px solid #000;
  background: var(--primary-gradient-lr, linear-gradient(270deg, #46c9d2 0%, #a372ff 100%));

  position: absolute;
  left: -10%;
`

interface ToggleProps {
  id?: string
  bgColor?: string
  isActive: boolean
  toggle: () => void
}

export default function Toggle({ id, bgColor, isActive, toggle }: ToggleProps) {
  const [isInitialToggleLoad, setIsInitialToggleLoad] = useState(true)

  const switchToggle = () => {
    toggle()
    if (isInitialToggleLoad) setIsInitialToggleLoad(false)
  }

  return (
    <DDWrapper id={id} isActive={isActive} onClick={switchToggle}>
      <DDToggleElement isActive={isActive} bgColor={bgColor} isInitialToggleLoad={isInitialToggleLoad} />
    </DDWrapper>
  )
}
