import { DDButtonGradient } from 'components/Button'
import { NunitoText } from 'components/CustomFonts/Nunito'
import styled from 'styled-components'

type PageWrapperOpts = {
  isTestsite?: boolean
}
export const PageWrapper = styled.div<PageWrapperOpts>`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100vw;
  justify-content: center;
  align-items: center;
  padding: 0px 0px 60px 0px;

  @media only screen and (max-width: 768px) {
    margin-top: 42px;
  }
`

export const MainGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 406px) 3fr;

  grid-column-gap: 28px;
  margin-top: -5.78vh;
  z-index: 1;
  width: 100%;
  max-width: 1402px;

  @media only screen and (max-width: 768px) {
    margin-top: -0.78vh;
    grid-template-columns: minmax(0, 406px);
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

export const PageImg = styled.img`
  width: 100%;
`
