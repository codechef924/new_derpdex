import { DDButtonGradient } from 'components/Button'
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

export const AirdropClaimButtonPhase2 = styled(DDButtonGradient)`
  width: 100%;
  max-height: 65px;
  max-width: 425px;
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

export const MainGrid = styled.div`
  width: inherit;
  display: grid;

  grid-template-columns: 1fr 1fr;

  @media only screen and (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

export const FlexGrid = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  &.claim-or-redeem {
    justify-content: flex-start;
    align-items: flex-end;
    padding: 80px 44px 0 0;

    @media only screen and (max-width: 768px) {
      justify-content: flex-start;
      align-items: center;
      padding: 1.5em 12px 2em 12px;
    }

    .inner {
      width: fit-content;
      justify-content: center;
      align-items: center;
      gap: 1.5em;
    }
  }

  &.phase-2 {
    position: relative;
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

type TextOpts = {
  color?: string
}
export const CustomGloriaText = styled(GloriaText)<TextOpts>`
  color: ${({ color }) => (color ? color : '#000')};

  font-size: 32px;
  @media only screen and (max-width: 768px) {
    font-size: 24px;
  }
`

export const StyledGloriaTextPhase2 = styled(GloriaText)`
  font-size: 120px;
  font-weight: 400;
  -webkit-text-stroke-width: 2px;
  -webkit-text-stroke-color: #fff;

  background: var(--Primary-Gradient-LR, linear-gradient(270deg, #46c9d2 0%, #a372ff 100%));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 109px;

  @media only screen and (max-width: 768px) {
    font-size: 68px;
  }
`
