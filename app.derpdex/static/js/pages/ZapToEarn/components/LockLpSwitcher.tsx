import { NunitoText } from 'components/CustomFonts/Nunito'
import { useState } from 'react'
import styled, { css } from 'styled-components'

import { ReactComponent as LockedIcon } from './assets/locked-icon.svg'
import { ReactComponent as UnlockIcon } from './assets/unlock-icon.svg'

type LockLpType = {
  showHelper: boolean
}

const RowFlex = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
`

interface SwitcherHandleProps {
  isOn: boolean
}

const LPSwitcherContainer = styled.div<SwitcherHandleProps>`
  min-width: 101px;
  min-height: 38px;

  position: relative;
  width: 60px;
  height: 30px;
  border-radius: 100px;
  border: 2px solid #000;
  background: #fff;
  box-shadow: 3px 3px 0px 0px rgba(0, 0, 0, 0.16);
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
  ${({ isOn }) =>
    isOn
      ? css`
          background-color: var(--primary-gradient-lr, linear-gradient(270deg, #46c9d2 0%, #a372ff 100%));
        `
      : css`
          background-color: #fff;
        `}

  * {
    svg {
      width: 20px;
    }
  }
`

const SwitcherHandle = styled.div<SwitcherHandleProps>`
  position: absolute;
  width: 44px;
  height: 30px;
  top: 50%;
  transform: translateY(-49%);
  background: var(--primary-gradient-lr, linear-gradient(270deg, #46c9d2 0%, #a372ff 100%));
  border-radius: 100px;
  // top: 2px;
  left: ${({ isOn }) => (isOn ? 'calc(100% - 47px)' : '3px')};
  transition: left 0.3s ease-in-out;
`

const LeftIcon = styled.span<SwitcherHandleProps>`
  position: absolute;
  height: 100%;
  top: 50%;
  left: 14px;
  transform: translateY(-36%);
  font-size: 18px;
  svg path {
    fill: ${({ isOn }) => (isOn ? '#000' : '#fff')};
  }

  z-index: 2;
`

const RightIcon = styled.span<SwitcherHandleProps>`
  position: absolute;
  height: 100%;
  top: 50%;
  right: 14px;
  transform: translateY(-36%);
  font-size: 18px;
  svg path {
    fill: ${({ isOn }) => (isOn ? '#fff' : '#000')};
  }
  z-index: 2;
`

export const LockLpSwitcher = ({ showHelper }: LockLpType) => {
  const [isOn, setIsOn] = useState(false)

  const handleSwitch = () => {
    setIsOn((prevIsOn) => !prevIsOn)
  }
  return (
    <RowFlex>
      {showHelper && (
        <NunitoText size="lg" weight={600}>
          Lock LPT Tokens?
        </NunitoText>
      )}
      <LPSwitcherContainer isOn={isOn} onClick={handleSwitch}>
        <LeftIcon isOn={isOn}>
          <UnlockIcon />
        </LeftIcon>
        <RightIcon isOn={isOn}>
          <LockedIcon />
        </RightIcon>
        <SwitcherHandle isOn={isOn} />
      </LPSwitcherContainer>
    </RowFlex>
  )
}
