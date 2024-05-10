import { DDButtonGradient } from 'components/Button'
import { GloriaText } from 'components/CustomFonts/GloriaHallelujah'
import { NunitoText } from 'components/CustomFonts/Nunito'
import styled from 'styled-components'

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

export const MainGrid = styled.div`
  width: inherit;
  display: grid;

  grid-template-columns: 1fr 1fr;

  @media only screen and (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

export const Grid = styled.div`
  display: grid;
  width: 100%;
  &.claim-or-redeem {
    justify-items: end;
    padding: 5rem 91px 0 0;
  }
`

export const FlexGrid = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  &.claim-or-redeem {
    justify-content: flex-end;
    align-items: flex-end;
    padding: 5rem 91px 0 0;

    @media only screen and (max-width: 768px) {
      justify-content: flex-start;
      align-items: center;
      padding: 1.5em 12px;
    }

    .inner {
      width: fit-content;
      justify-content: center;
      align-items: center;
      gap: 1.5em;
    }
  }

  .event-timestamp {
    margin-left: 91px;
    margin-top: -35px;

    @media only screen and (max-width: 768px) {
      margin-left: 12px;
      margin-top: -30px;
    }
  }

  &.loyalty-leaderboard {
    margin-top: 77px;
    width: 100%;
    max-width: 900px;
    justify-content: center;
    align-items: center;

    @media only screen and (max-width: 768px) {
      margin-top: 0.6em;
      padding: 0 12px 0 12px;
    }

    .tab {
      width: unset;
      margin: 44px 0px 44px 0px;

      @media only screen and (max-width: 768px) {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        margin: 24px 0px 24px 0px;
      }
    }
  }
`

export const LoyaltyProgramBanner = styled.img`
  @media only screen and (max-width: 768px) {
    max-width: 365px;
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

export const ErrorText = styled(NunitoText)<TextOpts>`
  text-align: center;
  color: #f72626;
  font-weight: 500;
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
