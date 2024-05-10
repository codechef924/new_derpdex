import { MaxButton } from 'pages/Pool/styleds'
import { Text } from 'rebass'
import styled from 'styled-components/macro'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 20px;
  min-width: 100%;
  width: 773px;

  @media only screen and (max-width: 768px) {
    padding: 10px 12px;
  }

  ${({ theme }) => theme.deprecated_mediaWidth.deprecated_upToExtraSmall`
    min-width: 340px;
    width: 100%;
  `};

  // Override the AutoColumn
  .overridable {
    position: relative;
    margin-top: 62px;
    margin-bottom: 64px;
    width: 820px;

    @media only screen and (max-width: 768px) {
      max-width: 768px;
      margin-top: 10px;
      width: 100%;
    }
  }
`

export const SmallMaxButton = styled(MaxButton)`
  font-size: 12px;
`

export const TextAsGradient = styled.div<{ width: string }>`
  font-size: 16px;
  font-weight: 600;
  background: ${({ theme }) => theme.derpGradientPrimary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-fill-color: transparent;
  cursor: pointer;
`

export const ResponsiveHeaderText = styled(Text)`
  font-size: 40px;
  font-weight: 500;
  ${({ theme }) => theme.deprecated_mediaWidth.deprecated_upToExtraSmall`
     font-size: 24px
  `};
`

export const RangeCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
  border-radius: 16px;
  border: 2px solid #000;
  background: #fff;
  box-shadow: 3px 3px 0px 0px #000;

  padding: 38px;

  overflow: hidden;

  @media only screen and (max-width: 768px) {
    padding: 20px;

    &.pooled-info {
      padding: 20px 20px 40px 20px;
    }
  }
`
