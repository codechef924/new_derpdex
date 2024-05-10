import '@fontsource/nunito' // Defaults to weight 400

import { NunitoText } from 'components/CustomFonts/Nunito'
import styled from 'styled-components/macro'

export const ZapToEarnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 521px;
  gap: 12px;
  @media only screen and (min-width: 768px) and (max-width: 1600px) {
    margin-top: 20px;
    max-width: 420px;
    padding: 0px 0px 60px 0px;
  }
  @media only screen and (max-width: 768px) {
    margin-top: 80px;
    padding: 0px 12px 100px 12px;
  }
`

export const TextTitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  .title {
    font-size: 60px;
    font-style: normal;
    font-weight: 400;
    background: var(--primary-gradient-lr, linear-gradient(270deg, #46c9d2 0%, #a372ff 100%));
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;

    @media only screen and (min-width: 768px) and (max-width: 1600px) {
      font-size: 42px;
    }
    @media only screen and (max-width: 768px) {
      font-size: 32px;
    }
  }
  .description {
    font-size: 20px;
    font-style: normal;
    font-weight: 600;
    @media only screen and (min-width: 768px) and (max-width: 1600px) {
      font-size: 16px;
    }
    @media only screen and (max-width: 768px) {
      font-size: 16px;
    }
  }
  * {
    text-align: center;
  }
`

export const ZapToEarnContainer = styled.div`
  border-radius: 24px;
  border: 4px solid #000;
  background: #fff;
  box-shadow: 3px 3px 0px 0px #000;
  max-width: 521px;
  // height: 722px;
  // * {
  //   font-family: 'Nunito' !important;
  // }
`

export const RowFlex = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`

export const SpaceBetweenHeader = styled(RowFlex)`
  justify-content: space-between;
  padding: 20px 19px;
  border-bottom: 2px solid #000;
  align-items: center;
  .header-text {
    font-size: 28px;
    font-weight: 800;
    @media only screen and (max-width: 1600px) {
      font-size: 22px;
    }
  }
  @media only screen and (min-width: 768px) and (max-width: 1600px) {
    padding: 10px 19px;
  }
  @media only screen and (max-width: 768px) {
    padding: 12px 12px;

    * {
      font-size: 20px;
    }
  }
`

export const ColumnFixed = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px 35px;
  gap: 12px;
  @media only screen and (min-width: 768px) and (max-width: 1600px) {
    padding: 10px 25px 20px 25px;
  }
  @media only screen and (max-width: 768px) {
    padding: 12px 12px;
  }
`

export const ZapInputOutputColumn = styled(ColumnFixed)`
  gap: 8px;
  padding: 0;
`

export const RowEnd = styled(RowFlex)`
  justify-content: flex-end;
`
export const InfoLink = styled(NunitoText)`
  color: ${({ theme }) => theme.textSecondary};
`
