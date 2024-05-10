import { DDButtonGradient } from 'components/Button'
import { GloriaText } from 'components/CustomFonts/GloriaHallelujah'
import { NunitoText } from 'components/CustomFonts/Nunito'
import styled from 'styled-components/macro'

export const MainPageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  @media only screen and (max-width: 768px) {
    margin-top: 48px;
  }
`

export const AbsoluteImg = styled.img`
  position: absolute;
  width: 100%;
  left: 0;
  bottom: 0;
  z-index: 1;
`

export const PageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  max-width: 1166px;

  display: flex;
  flex-direction: column;
  // align-items: center;
  // justify-content: center;

  padding: 0px 114px 74px 114px;

  @media only screen and (max-width: 768px) {
    margin-top: 48px;
    padding: 18px;
  }
  z-index: 2;
`

export const ContentWrapper = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  @media only screen and (max-width: 768px) {
    padding-bottom: 150px;
  }
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
`

export const RowFlex = styled.div<FlexOpts>`
  display: flex;
  flex-direction: row;

  gap: ${({ gap }) => (gap ? gap : '0')}px;
  width: ${({ width }) => (width ? width : '100%')};
  margin: ${({ margin }) => (margin ? margin : 'unset')};
  padding: ${({ padding }) => (padding ? padding : 'unset')};
`

type TextOpts = {
  color?: string
}
export const Text = styled(NunitoText)<TextOpts>`
  color: ${({ color }) => (color ? color : '#000')};
`

export const GradientText = styled(NunitoText)`
  background: ${({ theme }) => theme.derpGradientPrimary};
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  font-size: 48px;
`

export const StyledGloriaCustomSize = styled(GloriaText)`
  background: linear-gradient(270deg, #46c9d2 0%, #a372ff 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  &.is-link {
    font-size: 30px;
    cursor: pointer;
  }
`

export const StyledGloria = styled(GloriaText)`
  background: linear-gradient(270deg, #46c9d2 0%, #a372ff 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  font-size: 60px;

  @media only screen and (max-width: 768px) {
    font-size: 32px;
  }

  &.is-link {
    font-size: 30px;
    cursor: pointer;
  }
`

export const StyledGloria32 = styled(GloriaText)`
  background: linear-gradient(270deg, #46c9d2 0%, #a372ff 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  font-size: 32px;

  @media only screen and (max-width: 768px) {
    font-size: 32px;
  }

  &.is-link {
    font-size: 30px;
    cursor: pointer;
  }
`

export const AllocationFlex = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  @media only screen and (max-width: 768px) {
    flex-direction: column;
  }
`

export const AllocationDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
`

export const StyledButton = styled(DDButtonGradient)`
  width: 235px;
  height: 60px !important;
  padding: unset;
  min-width: unset;
  border-radius: 16px;
  border: 2px solid #344d73;
  box-shadow: 3px 3px 0px 0px #000;
  background: ${({ theme, disabled }) =>
    !disabled
      ? 'linear-gradient(270deg, #46C9D2 0%, #A372FF 100%)'
      : 'linear-gradient(270deg,#46c9d296 0%,#a372ff91 100%) !important'} !important;
  max-width: unset;
  min-width: unset;
  cursor: ${({ disabled }) => !disabled && 'pointer'};
  // &:hover {
  //   background-color: #403f3f !important;
  // }
  &:active {
    background-color: ${({ disabled }) =>
      !disabled
        ? 'linear-gradient(270deg, #46C9D2 0%, #A372FF 100%)'
        : 'linear-gradient(270deg,#46c9d296 0%,#a372ff91 100%) !important'} !important;
  }
`

export const LoadingDots = styled.span`
  font-family: inherit;
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
