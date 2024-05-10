import { DDButtonGradient } from 'components/Button'
import { NunitoText } from 'components/CustomFonts/Nunito'
import styled from 'styled-components/macro'

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100vw;
  justify-content: center;
  align-items: center;
  padding: 0px 0px 60px 0px;

  @media only screen and (max-width: 768px) {
    margin-top: 35px;
  }
`

export const ContentWrapper = styled.div`
  margin-top: 42px;
  display: flex;
  width: 100%;
  align-items: flex-start;
  justify-content: center;
  gap: 64px;

  @media only screen and (max-width: 768px) {
    flex-direction: column;
    gap: 58px;
    margin-top: unset;
    padding-bottom: 42px;
  }
`

export const PageImg = styled.img`
  position: relative;
  width: 100%;

  @media only screen and (max-width: 768px) {
    margin-top: 10px;
  }
`

export const MobilePageImgWrapper = styled.div`
  margin-top: 68px;
  position: fixed;
  min-height: 65px;

  margin-top: 81px;
  top: 0;
  z-index: 1;

  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
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
  width: ${({ width }) => (width ? width : 'unset')};
  margin: ${({ margin }) => (margin ? margin : 'unset')};
  padding: ${({ padding }) => (padding ? padding : 'unset')};
`

export const RowFlex = styled.div<FlexOpts>`
  display: flex;
  flex-direction: row;

  gap: ${({ gap }) => (gap ? gap : '0')}px;
  width: ${({ width }) => (width ? width : 'unset')};
  margin: ${({ margin }) => (margin ? margin : 'unset')};
  padding: ${({ padding }) => (padding ? padding : 'unset')};
`

type TextOpts = {
  color?: string
}
export const Text = styled(NunitoText)<TextOpts>`
  color: ${({ color }) => (color ? color : '#000')};
`

export const ClaimButton = styled(DDButtonGradient)`
  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 16px;
  border: 2px solid #344d73;
  box-shadow: 3px 3px 0px 0px #000;
  width: 100%;
  height: 62px;
  max-width: 382px;
  min-width: unset;
  cursor: ${({ disabled }) => !disabled && 'pointer'};
  &:disabled {
    background: ${({ disabled, theme }) =>
      !disabled ? theme.derpGradientPrimary : 'linear-gradient(135deg,#bd9bfd 20%,#95e9ef 95.22%)'} !important;
  }
  z-index: 1;
`
