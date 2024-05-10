/* eslint-disable import/no-unused-modules */
import '@fontsource/nunito' // Defaults to weight 400

import { AutoColumn } from 'components/Column'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import Input from 'components/NumericalInput'
import { BodyWrapper } from 'pages/AppBody'
import styled from 'styled-components/macro'

export const PageWrapper = styled(BodyWrapper)<{ wide: boolean }>`
  max-width: ${({ wide }) => (wide ? '880px' : '480px')};
  width: 100%;

  padding: ${({ wide }) => (wide ? '10px' : '0')};

  ${({ theme }) => theme.deprecated_mediaWidth.deprecated_upToMedium`
    max-width: 480px;
  `};
`

export const DerpPageWrapper = styled.div`
  max-width: 100%;
  width: 100%;
  padding-bottom: 32px;

  @media only screen and (max-width: 640px) {
    min-width: 100%;
    padding: 50px 0px 0px 0px;
  }
`

export const Wrapper = styled.div`
  position: relative;
  padding: 26px 16px;
  min-width: 480px;

  @media only screen and (max-width: 768px) {
    padding: 0 !important;
  }

  ${({ theme }) => theme.deprecated_mediaWidth.deprecated_upToMedium`
    min-width: 400px;
  `};

  ${({ theme }) => theme.deprecated_mediaWidth.deprecated_upToExtraSmall`
  min-width: 340px;
`};
`

export const ScrollablePage = styled.div`
  padding: 68px 8px 0px;
  position: relative;
  display: flex;
  flex-direction: column;

  ${({ theme }) => theme.deprecated_mediaWidth.deprecated_upToMedium`
    max-width: 480px;
    margin: 0 auto;
  `};

  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    padding: 48px 8px 0px;
  }

  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.sm}px`}) {
    padding-top: 70px;
  }
`

export const DerpScrollablePage = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;

  width: 100%;

  @media only screen and (min-width: 1368px) {
    // padding: 68px 142px 0px 142px;
  }
  @media only screen and (min-width: 1100px) {
    // padding: 68px 110px 0px 110px;
  }

  // margin-top: -50px;

  @media only screen and (max-width: 768px) {
    padding-top: 20px;
    padding-bottom: 70px;
  }
`

export const DynamicSection = styled(AutoColumn)<{ disabled?: boolean }>`
  opacity: ${({ disabled }) => (disabled ? '0.2' : '1')};
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'initial')};
`

export const CurrencyDropdown = styled(CurrencyInputPanel)`
  // width: 48.5%;
  min-width: 250px;
  max-width: 212px;

  @media only screen and (max-width: 768px) {
    width: 100% !important;
    max-width: 100%;
    min-width: 150px;
    width: 100%;
  }
`

export const StyledInput = styled(Input)`
  background-color: ${({ theme }) => theme.backgroundSurface};
  text-align: left;
  font-size: 18px;
  width: 100%;
`

/* two-column layout where DepositAmount is moved at the very end on mobile. */
export const ResponsiveTwoColumns = styled.div<{ wide: boolean }>`
  display: grid;
  // grid-column-gap: 50px;
  // grid-row-gap: 15px;
  grid-template-columns: ${({ wide }) => (wide ? '1.2fr 1fr' : '1fr')};
  grid-template-rows: max-content;
  grid-auto-flow: row;

  @media only screen and (max-width: 768px) {
    display: flex;
    flex-direction: column;
  }

  // padding-top: 20px;

  // border-top: 1px solid ${({ theme }) => theme.backgroundInteractive};

  ${({ theme }) => theme.deprecated_mediaWidth.deprecated_upToMedium`
    grid-template-columns: 1fr;

    margin-top: 0;
  `};
`

export const LeftContainer = styled(AutoColumn)`
  height: 100%;
  border-right: 1px solid #000;
`

export const RightContainer = styled(AutoColumn)`
  grid-row: 1 / 3;
  grid-column: 2;
  height: fit-content;

  padding: 0px 38px;

  @media only screen and (max-width: 768px) {
    padding: 20px 20px 35px 20px !important;
    grid-row-gap: 0px !important;
  }

  ${({ theme }) => theme.deprecated_mediaWidth.deprecated_upToMedium`
  grid-row: 2 / 3;
  grid-column: 1;
  `};
`

export const StackedContainer = styled.div`
  display: grid;
`

export const StackedItem = styled.div<{ zIndex?: number }>`
  grid-column: 1;
  grid-row: 1;
  height: 100%;
  z-index: ${({ zIndex }) => zIndex};
`

export const MediumOnly = styled.div`
  ${({ theme }) => theme.deprecated_mediaWidth.deprecated_upToMedium`
    display: none;
  `};
`

export const HideMedium = styled.div`
  display: none;

  @media only screen and (max-width: 768px) {
    padding: 20px 20px 0px 20px !important;
    order: 1;
  }

  ${({ theme }) => theme.deprecated_mediaWidth.deprecated_upToMedium`
    display: block;
  `};
`

export const BoundedCurrency = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;

  @media only screen and (max-width: 768px) {
    width: 100%;
  }

  * {
    font-family: 'Nunito' !important;
  }
`

export const CircledNumber = styled.div`
  display: flex;
  width: 32px;
  height: 32px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  border-radius: 100px;
  border: 0.13rem solid #000;
  background: #fff;
`

export const ShadowedBorder = styled.div`
  border-radius: 16px;
  border: 2px solid #000;
  background: #fff;
  box-shadow: 4px 4px 0px 2px #000;
  padding: 20px 28px;

  @media only screen and (max-width: 768px) {
    padding: 10px 20px;

    min-height: 330px;

    &.input-only-properties {
      padding: 0px !important;
      border: 0;
      background: #fff;
      box-shadow: none !important;
      min-height: 0px;
    }
  }
`

type PanelProps = {
  isPreviewPage?: boolean
}

export const PanelWrapper = styled.div<PanelProps>`
  ${({ isPreviewPage }) => {
    if (isPreviewPage) {
      return `
        border-right: none;
        border-bottom: none;
        padding: 10px 308px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .overridable {
          width: 100%;
          max-width: 825px;
        }
      `
    } else {
      return `
        border-right: 0.17em solid #000;
        border-bottom: 0.17em solid #000;
        padding: 35px 38px;

        @media only screen and (max-width: 768px) {
          border-right: none;
          padding: 0px;
        }

        &.pair {
          padding: 0px 38px 35px 38px !important;
        }
        &.input-area-panel {
          padding: 25px 38px;
        }
      `
    }
  }};

  @media only screen and (max-width: 768px) {
    &.pair {
      padding: 0px 20px 35px 20px !important;
    }
    padding: 20px 20px 35px 20px !important;

    &.input-area-panel {
      padding: 0px 20px 0px 20px !important;
      border-bottom: 0;
      margin-top: -42px;
      #input-auto-column {
        // margin-top: -20px !important;
      }
    }
  }
`

export const ButtonWrapper = styled.div<PanelProps>`
  ${({ isPreviewPage }) => {
    if (isPreviewPage) {
      return `
        margin-top: 22px;
        padding: 0px 308px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .btn-overridable {
          width: 100%;
          max-width: 448px !important;
          @media only screen and (max-width: 768px) {
            max-height: 60px !important;
            min-height: unset !important;
          }
        }

        @media only screen and (max-width: 768px) {
          padding: 0px 20px;
          order: 1;
        }
    `
    } else {
      return `
      width: 100%;
    `
    }
  }};
`

export const ExistingRangeContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 2px solid #000;
  box-shadow: 4px 4px 0px 2px #000;
  border-radius: 16px;
  font-size: 20px;
  font-weight: 600;
  padding: 0px 8px;
  background: #fff;

  .flex-center {
    display: flex;
    align-items: center;
  }

  .flex-currencies {
    display: flex;
    align-items: center;
    font-size: 20px;
    font-weight: 600;
  }

  .select-first {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 13px 26px;

    @media only screen and (max-width: 768px) {
      padding: 13px 12px;
    }

    .output-data {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }

  .position {
    display: flex;
    flex-direction: column;
    border-top: 2px solid #000;
    border-bottom: 2px solid #000;
    padding: 13px 26px;
    gap: 14px;

    @media only screen and (max-width: 768px) {
      padding: 13px 12px;
    }

    .flex-row-between {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }

  .fee-tier {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 20px 50px;

    @media only screen and (max-width: 768px) {
      padding: 13px 12px;
    }
  }
`

export const PositionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-top: 2px solid #000;
  border-bottom: 2px solid #000;
  padding: 13px 26px;
  gap: 14px;

  @media only screen and (max-width: 768px) {
    padding: 13px 12px;
  }

  .flex-row-between {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`

export const FeeTierWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 13px 26px;

  @media only screen and (max-width: 768px) {
    padding: 13px 12px;
  }

  * {
    font-family: 'Nunito' !important;
    font-size: 18px !important;
  }
`

export const TwoButtonRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  justify-items: center; /* Center horizontally */
  align-items: center; /* Center vertically */
  .btn {
    border: 1px solid #000;
    width: 100%;
    padding: 16px 0px;
    text-align: center;
    font-size: 24px;
    font-weight: 700;
    cursor: pointer;

    @media only screen and (max-width: 768px) {
      padding: 12px 0px;
    }
  }
  .btn-cancel {
  }
  .btn-confirm {
    background: ${({ theme }) => theme.derpGradientPrimary};
    border-bottom-right-radius: 0.75em;
    color: #fff;
  }
`

export const InputAreaAutoColumn = styled(AutoColumn)`
  display: grid;
  align-items: flex-end;

  @media only screen and (max-width: 768px) {
    align-items: stretch;
    order: 1;
  }
`
