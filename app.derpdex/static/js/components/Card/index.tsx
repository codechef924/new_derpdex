import { Box } from 'rebass/styled-components'
import styled from 'styled-components/macro'

const Card = styled(Box)<{ width?: string; padding?: string; border?: string; $borderRadius?: string }>`
  width: ${({ width }) => width ?? '100%'};
  padding: ${({ padding }) => padding ?? '1rem'};
  border-radius: ${({ $borderRadius }) => $borderRadius ?? '16px'};
  border: ${({ border }) => border};
`
export default Card

export const LightCard = styled(Card)`
  border: 1px solid ${({ theme }) => theme.backgroundInteractive};
  background-color: ${({ theme }) => theme.deprecated_bg1};
`

export const GrayCard = styled(Card)`
  background-color: ${({ theme }) => theme.deprecated_bg3};
`

export const DarkGrayCard = styled(Card)`
  background-color: ${({ theme }) => theme.backgroundInteractive};
`

export const DarkCard = styled(Card)`
  background-color: ${({ theme }) => theme.backgroundSurface};
`

// eslint-disable-next-line import/no-unused-modules
export const DDCard = styled(Box)<{ width?: string; padding?: string; border?: string; $borderRadius?: string }>`
  width: ${({ width }) => width ?? '100%'};
  padding: ${({ padding }) => padding ?? '1rem'};
  border-radius: 16px;
  border: 2px solid #000;
  background: #fff;
  box-shadow: 3px 3px 0px 0px #000;

  @media (max-width: 768px) {
    padding: 23px 16px !important;
  }
`

// eslint-disable-next-line import/no-unused-modules
export const DDCardUniversal = styled(Box)<{
  width?: string
  padding?: string
  border?: string
  $borderRadius?: string
  borderTop?: string
  borderBottom?: string
  borderLeft?: string
  borderRight?: string
  background?: string
}>`
  width: ${({ width }) => width ?? '100%'};
  padding: ${({ padding }) => padding ?? '0rem'};
  border-radius: ${({ $borderRadius }) => $borderRadius ?? '0'};
  border: ${({ border }) => border};
  border-top: ${({ borderTop }) => borderTop};
  border-bottom: ${({ borderBottom }) => borderBottom};
  border-left: ${({ borderLeft }) => borderLeft};
  border-right: ${({ borderRight }) => borderRight};
  background-color: ${({ theme, background }) => (background ? background : theme.derpGray2)};
`

export const OutlineCard = styled(Card)`
  border: 1px solid ${({ theme }) => theme.deprecated_bg3};
`

export const YellowCard = styled(Card)`
  background-color: rgba(243, 132, 30, 0.05);
  color: ${({ theme }) => theme.deprecated_yellow3};
  font-weight: 500;
`

export const BlueCard = styled(Card)`
  background: ${({ theme }) => theme.derpGradientPrimary};
  color: ${({ theme }) => theme.white};
  border-radius: 6px;
`
