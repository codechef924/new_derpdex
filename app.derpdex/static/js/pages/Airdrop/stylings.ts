import { DDButtonGradient } from 'components/Button'
import { GloriaText } from 'components/CustomFonts/GloriaHallelujah'
import { NunitoText } from 'components/CustomFonts/Nunito'
import styled from 'styled-components'

export const PageWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 60px;
  display: flex;
  justify-content: center;
`

export const ContentWrapper = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 46px 46px 60px 46px;
  max-width: 1920px;

  // padding-bottom: 60px;

  @media only screen and (max-width: 768px) {
    margin-top: 48px;
    padding: 46px 12px 60px 12px;
  }

  position: relative;
  z-index: 999;
`

export const StyledGloriaFocused = styled(GloriaText)`
  font-size: 100px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  text-shadow: 4px 4px 0px #000, -4px -4px 0px #000;
  background: var(--Primary-Gradient-LR, linear-gradient(270deg, #46c9d2 0%, #a372ff 100%));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

type FlexOpts = {
  gap?: number
  width?: string
  margin?: string
  padding?: string
}

export const ColFlex = styled.div<FlexOpts>`
  display: flex;
  flex-direction: column;

  gap: ${({ gap }) => (gap ? gap : '0')}px;
  width: ${({ width }) => (width ? width : '100%')};

  margin: ${({ margin }) => (margin ? margin : 'unset')};
  padding: ${({ padding }) => (padding ? padding : 'unset')};

  &.phase-1 {
    position: relative;
    align-items: flex-start;
    margin: 55px 0px 0px 0px;

    @media only screen and (max-width: 768px) {
      margin: 120px 0px 0px 0px;
      align-items: center;
    }
  }
`

export const RowFlex = styled.div<FlexOpts>`
  display: flex;
  flex-direction: row;

  gap: ${({ gap }) => (gap ? gap : '0')}px;
  width: ${({ width }) => (width ? width : '100%')};
  margin: ${({ margin }) => (margin ? margin : 'unset')};
  padding: ${({ padding }) => (padding ? padding : 'unset')};
`

export const MainGrid = styled.div`
  width: inherit;
  display: grid;

  grid-template-columns: 1fr 1fr;

  @media only screen and (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

type TextOpts = {
  color?: string
}
export const Text = styled(NunitoText)<TextOpts>`
  color: ${({ color }) => (color ? color : '#000')};

  &.timestamp {
    font-size: 32px;
    @media only screen and (max-width: 768px) {
      font-size: 24px;
    }
  }
`

export const ErrorText = styled(NunitoText)<TextOpts>`
  text-align: center;
  color: #f72626;
  font-weight: 500;
`

export const StyledGloriaCustomPhase1 = styled(GloriaText)`
  background: ${({ theme }) => theme.derpGradientPrimary};
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 100px;
  -webkit-text-stroke-width: 4px;
  -webkit-text-stroke-color: #000;
  line-height: 133px;

  text-align: center;
  @media only screen and (max-width: 768px) {
    font-size: 78px;
    font-weight: 400;
    -webkit-text-stroke-width: 2px;
    -webkit-text-stroke-color: #000;
  }

  &.is-link {
    font-size: 30px;
    cursor: pointer;
  }
`

export const StyledGloriaCustom = styled(GloriaText)`
  background: ${({ theme }) => theme.derpGradientPrimary};
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  text-align: center;
  @media only screen and (max-width: 768px) {
    font-size: 32px;
  }

  &.is-link {
    font-size: 30px;
    cursor: pointer;
  }
`

export const StyledGloria = styled(GloriaText)`
  background: ${({ theme }) => theme.derpGradientPrimary};
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  font-size: 60px;

  text-align: center;
  @media only screen and (max-width: 768px) {
    font-size: 32px;
  }

  &.is-link {
    font-size: 30px;
    cursor: pointer;
  }
`

export const DarkButton = styled(DDButtonGradient)`
  border-radius: 16px;
  border: 2px solid var(--Primary-one, #a372ff);
  background: ${({ theme, disabled }) => (!disabled ? '#000' : '#403f3f')} !important;
  width: 100%;
  max-width: unset;
  min-width: unset;
  cursor: ${({ disabled }) => !disabled && 'pointer'};
  &:hover {
    background-color: #403f3f !important;
  }
  &:active {
    background-color: ${({ disabled }) => (!disabled ? '#000' : '#403f3f')} !important;
  }
`

export const AirdropClaimButton = styled(DDButtonGradient)`
  width: 100%;
  max-height: 73px;
  max-width: 306px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: unset;
  cursor: ${({ disabled }) => !disabled && 'pointer'};
  border-radius: 16px;
  border: 2px solid #344d73;

  box-shadow: 3px 3px 0px 0px #000;
  &:disabled {
    background: ${({ disabled, theme }) =>
      !disabled ? theme.derpGradientPrimary : 'linear-gradient(135deg,#bd9bfd 20%,#95e9ef 95.22%)'} !important;
  }
`

export const AboutContainer = styled.div`
  display: flex;
  flex-direction: column;

  align-items: center;
`

export const StyledLink = styled.div`
  display: flex;
  flex-direction: row;

  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
`

export const LinkImg = styled.img`
  max-width: 26px;
`
