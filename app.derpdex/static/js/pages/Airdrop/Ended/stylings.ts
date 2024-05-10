import { GloriaText } from 'components/CustomFonts/GloriaHallelujah'
import styled from 'styled-components/macro'

export const PageWrapper = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding-bottom: 60px;

  @media only screen and (max-width: 768px) {
    margin-top: 48px;
  }
`

export const AirdropEndedBanner = styled.img`
  width: 100%;
`

type TextOpts = {
  color?: string
}
export const CustomGloriaText = styled(GloriaText)<TextOpts>`
  color: ${({ color }) => (color ? color : '#000')};

  &.ended {
    font-size: 32px;
    @media only screen and (max-width: 768px) {
      font-size: 24px;
    }
  }
`

export const StyledGloriaTextEnded = styled(GloriaText)`
  font-size: 120px;
  font-weight: 400;
  -webkit-text-stroke-width: 2px;
  -webkit-text-stroke-color: #fff;

  background: var(--Primary-Gradient-LR, linear-gradient(270deg, #46c9d2 0%, #a372ff 100%));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-top: -98px;

  @media only screen and (max-width: 768px) {
    font-size: 58px;
    margin-top: -38px;
  }
`
