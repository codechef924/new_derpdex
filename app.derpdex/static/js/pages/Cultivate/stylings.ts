import { DDButtonGradient } from 'components/Button'
import { GloriaText } from 'components/CustomFonts/GloriaHallelujah'
import { NunitoText } from 'components/CustomFonts/Nunito'
import styled from 'styled-components'

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100vw;
  justify-content: center;
  align-items: center;
  padding: 0px 0px 72px 0px;

  @media only screen and (max-width: 768px) {
    margin-top: 48px;
  }
`

export const MainGrid = styled.div`
  display: flex;
  flex-direction: column;

  margin-top: 8px;
  z-index: 1;
  width: 100%;
  max-width: 1250px;

  @media only screen and (max-width: 768px) {
    margin-top: 8px;
    padding: 12px;
  }
`

type Direction = 'column' | 'row'

type GridOpts = {
  direction?: Direction
  gap?: number
}

export const GridItem = styled.div<GridOpts>`
  display: flex;

  flex-direction: ${({ direction }) => (direction ? direction : 'row')};
  gap: ${({ gap }) => (gap ? gap : '0')}px;
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

export const PageImg = styled.img`
  width: 100%;
`

export const ResponsiveFlex = styled.div<FlexOpts>`
  display: flex;
  flex-direction: row;

  gap: ${({ gap }) => (gap ? gap : '0')}px;

  @media only screen and (max-width: 768px) {
    flex-direction: row;
  }
`

export const CultivateButton = styled(DDButtonGradient)`
  width: 100%;
  max-width: unset;
  min-width: unset;
  cursor: ${({ disabled }) => !disabled && 'pointer'};
  &:hover {
    background: ${({ theme }) => theme.derpGradientDull};
  }
  &:active {
    background: ${({ disabled, theme }) => (!disabled ? theme.derpGradientPrimary : theme.derpGradientDull)} !important;
  }
`

export const StyledGloriaText = styled(GloriaText)`
  background: ${({ theme }) => theme.derpGradientPrimary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-fill-color: transparent;
`
