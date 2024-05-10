import { Price, Token } from '@uniswap/sdk-core'
import { ReactComponent as TickLogo } from 'assets/svg/tick_logo.svg'
import { ReactNode, useEffect, useState } from 'react'
import styled from 'styled-components/macro'

import {
  ActiveDefaultSvg,
  ActiveOnActiveSVG,
  ConservativeActiveSvg,
  ConservativeDefaultSvg,
  CustomDefaultSvg,
  CustomOnActiveSvg,
  FullRangeDefaultSvg,
  FullRangeOnActiveSvg,
} from './range_mode_icon'

export enum RANGE {
  CONSERVATIVE = 'Conservative',
  ACTIVE = 'Active',
  FULL_RANGE = 'Full Range',
  CUSTOM = 'Custom',
}

const RANGE_MODE: Record<
  RANGE,
  {
    label: string
    logoDefault: ReactNode
    logoActive: ReactNode
    description?: ReactNode
  }
> = {
  [RANGE.ACTIVE]: {
    label: RANGE.ACTIVE,
    logoDefault: <ConservativeDefaultSvg />,
    logoActive: <ConservativeActiveSvg />,
    description: (
      <div>
        <span style={{ fontWeight: '600' }}>Active</span>&nbsp;Allocate Equally for Concentrated price range
      </div>
    ),
  },
  [RANGE.CONSERVATIVE]: {
    label: RANGE.CONSERVATIVE,
    logoDefault: <ActiveDefaultSvg />,
    logoActive: <ActiveOnActiveSVG />,
    description: (
      <div>
        <span style={{ fontWeight: '600' }}>Conservative</span>&nbsp;Allocate Equally for wider price range
      </div>
    ),
  },
  [RANGE.FULL_RANGE]: {
    label: RANGE.FULL_RANGE,
    logoDefault: <FullRangeDefaultSvg />,
    logoActive: <FullRangeOnActiveSvg />,
    description: (
      <div>
        <span style={{ fontWeight: '600' }}>Full Range</span>&nbsp;Allocate Fully Available of price range
      </div>
    ),
  },
  [RANGE.CUSTOM]: {
    label: RANGE.CUSTOM,
    logoDefault: <CustomDefaultSvg />,
    logoActive: <CustomOnActiveSvg />,
    description: (
      <div>
        <span style={{ fontWeight: '600' }}>Custom</span>&nbsp;Allocation of price range
      </div>
    ),
  },
}
const RangeColFixed = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 33.5px;
  width: 100%;
`
const RangeRowFixed = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;

  height: 200px;

  @media only screen and (min-width: 1920px) {
    height: 400px;
  }
  @media only screen and (min-width: 769px) and (max-width: 1920px) {
    height: 200px;
  }
  // @media only screen and (max-width: 1368px) {
  //   flex-wrap: wrap;
  //   justify-content: center;
  // }

  @media only screen and (max-width: 768px) {
    flex-wrap: wrap;
    justify-content: center;
    height: 100%;
  }
`

type RangeContainerProps = {
  isActive: boolean
} & React.HTMLAttributes<HTMLDivElement>

const RangeContainer = styled.div<RangeContainerProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: ${({ isActive, theme }) => (isActive ? theme.white : theme.white)};

  border: 2px solid #000;
  box-shadow: ${({ isActive }) => (isActive ? '4px 4px 0px 0px #000;' : '0px')};

  color: ${({ isActive, theme }) => (isActive ? theme.black : theme.black)};

  @media only screen and (min-width: 768px) {
    margin-bottom: ${({ isActive }) => (isActive ? '55px' : '0px')};
  }
  @media only screen and (max-width: 768px) {
    margin-bottom: ${({ isActive }) => (isActive ? '23px' : '0px')};
  }
  transition: margin-bottom 0.3s ease; /* Add a transition for smooth animation */

  font-weight: 600;
  gap: 10px;
  border-radius: 16px;
  width: 100%;
  min-width: 80px;
  cursor: pointer;

  @media only screen and (min-width: 1920px) {
    padding: 18.5px 26px;
    // max-width: 180px;

    svg {
      width: 100%;
      height: 140px !important;
    }
  }
  @media only screen and (min-width: 768px) and (max-width: 1920px) {
    padding: 14.5px 20px;
    // max-width: 180px;

    svg {
      width: 100%;
      height: 80px !important;
    }
  }
  // @media only screen and (max-width: 1368px) {
  //   padding: 14.5px 20px;
  //   svg {
  //     width: 100%;
  //     height: 80px !important;
  //   }
  // }

  @media only screen and (max-width: 768px) {
    padding: 14.5px 20px;
    width: 140px;
    max-width: 160px;
    min-width: 120px;
    svg {
      width: 100%;
      height: 80px !important;
    }
  }
`

interface ChildComponentProps {
  price?: Price<Token, Token>
  onData: (data: RANGE) => void
  currentMode?: RANGE
}

// eslint-disable-next-line import/no-unused-modules
export const RangeModeSelector = ({ price, onData, currentMode }: ChildComponentProps) => {
  // DEFAULT STATE
  const [rangeMode, setRangeMode] = useState<RANGE>(RANGE.FULL_RANGE)

  const handleClick = (data: RANGE) => {
    setRangeMode(data)
    onData(data)
  }

  useEffect(() => {
    if (currentMode) {
      setRangeMode(currentMode)
    }
  }, [currentMode])

  return (
    <RangeColFixed>
      <RangeRowFixed>
        {Object.keys(RANGE_MODE).map((key) => (
          <>
            {key === rangeMode ? (
              <RangeContainer onClick={() => handleClick(key as RANGE)} isActive={true} key={key}>
                {RANGE_MODE[key as RANGE].logoActive}
                {RANGE_MODE[key as RANGE].label}
              </RangeContainer>
            ) : (
              <RangeContainer onClick={() => handleClick(key as RANGE)} isActive={false} key={key}>
                {RANGE_MODE[key as RANGE].logoDefault}
                {RANGE_MODE[key as RANGE].label}
              </RangeContainer>
            )}
          </>
        ))}
      </RangeRowFixed>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '7.39px',
        }}
      >
        <TickLogo />
        {RANGE_MODE[rangeMode as RANGE].description}
      </div>
    </RangeColFixed>
  )
}
