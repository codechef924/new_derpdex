import { LoadingRows as BaseLoadingRows } from 'components/Loader/styled'
import { Text } from 'rebass'
import styled from 'styled-components/macro'

export const Wrapper = styled.div`
  position: relative;
  padding: 20px;
`

export const ClickableText = styled(Text)`
  :hover {
    cursor: pointer;
  }
  color: ${({ theme }) => theme.accentAction};
`
export const MaxButton = styled.button<{ width: string }>`
  padding: 0.5rem 1rem;
  background-color: white;
  border: 3px solid #efefef;
  border-radius: 8px;
  font-size: 1rem;
  ${({ theme }) => theme.deprecated_mediaWidth.deprecated_upToSmall`
    padding: 0.25rem 0.5rem;
  `};
  font-weight: 600;
  cursor: pointer;
  margin: 0.25rem;
  overflow: hidden;
  color: ${({ theme }) => theme.derpGray1};
  :hover {
    background: ${({ theme }) => theme.derpGradientPrimary};
    color: ${({ theme }) => theme.derpGray2};
    border: 3px solid transparent;
    background-origin: border-box;
  }
  :focus {
    background: ${({ theme }) => theme.derpGradientPrimary};
    color: ${({ theme }) => theme.derpGray2};
    border: 3px solid transparent;
    background-origin: border-box;
  }
`

export const Dots = styled.span`
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

export const LoadingRows = styled(BaseLoadingRows)`
  padding-top: 36px;
  min-width: 75%;
  max-width: 960px;
  grid-column-gap: 0.5em;
  grid-row-gap: 0.8em;
  grid-template-columns: repeat(3, 1fr);
  padding: 8px;

  & > div:nth-child(4n + 1) {
    grid-column: 1 / 3;
  }
  & > div:nth-child(4n) {
    grid-column: 3 / 4;
    margin-bottom: 2em;
  }
`

export const TitleDiv = styled.div`
  text-align: center;
  color: #000;
  text-align: center;
  font-family: Inter;
  font-size: 24px;
  font-weight: 700;
  margin-top: 22px;

  @media only screen and (max-width: 768px) {
    font-size: 20px !important;
  }
`
