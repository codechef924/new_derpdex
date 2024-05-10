import searchIcon from 'assets/svg/search.svg'
import { LoadingRows as BaseLoadingRows } from 'components/Loader/styled'
import styled from 'styled-components/macro'

import { AutoColumn } from '../Column'
import { RowBetween } from '../Row'

export const PaddedColumn = styled(AutoColumn)`
  padding: 20px;
`

export const MenuItem = styled(RowBetween)<{ dim?: boolean }>`
  padding: 4px 20px;
  height: 56px;
  display: grid;
  grid-template-columns: auto minmax(auto, 1fr) auto minmax(0, 72px);
  grid-gap: 16px;
  cursor: ${({ disabled }) => !disabled && 'pointer'};
  pointer-events: ${({ disabled }) => disabled && 'none'};
  :hover {
    background-color: ${({ theme }) => theme.hoverDefault};
  }
  opacity: ${({ disabled, selected, dim }) => (dim || disabled || selected ? 0.4 : 1)};

  &:hover {
    background: ${({ theme }) => theme.derpGradientPrimary};
    color: #fff;
  }
`

export const ZapMenuItem = styled(RowBetween)<{ dim?: boolean }>`
  padding: 12px 12px;
  margin: 10px 0px;
  @media only screen and (max-width: 768px) {
    padding: 12px 12px;
    height: 71px !important;
  }
  border-radius: 16px;
  height: 81px !important;
  display: grid;
  grid-template-columns: minmax(auto, 1fr) auto minmax(0, 72px);
  grid-gap: 16px;
  cursor: ${({ disabled }) => !disabled && 'pointer'};
  pointer-events: ${({ disabled }) => disabled && 'none'};
  :hover {
    background-color: ${({ theme }) => theme.hoverDefault};
  }
  opacity: ${({ disabled, selected, dim }) => (dim || disabled || selected ? 0.4 : 1)};

  &:hover {
    background: ${({ theme }) => theme.derpGradientPrimary};
    color: #fff;
  }
`

export const ZapWrapper = styled.div`
  padding: 0px 20px;
  @media only screen and (max-width: 768px) {
    padding: 0px 10px;
  }
`

export const PoolMenuItem = styled(RowBetween)<{ dim?: boolean }>`
  padding: 12px 32px;
  margin: 10px 0px;
  @media only screen and (max-width: 768px) {
    padding: 10px 22px;
    height: 51px !important;
  }
  border-radius: 16px;
  height: 81px !important;
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 16px;
  cursor: ${({ disabled }) => !disabled && 'pointer'};
  pointer-events: ${({ disabled }) => disabled && 'none'};
  :hover {
    background-color: ${({ theme }) => theme.hoverDefault};
  }
  opacity: ${({ disabled, selected, dim }) => (dim || disabled || selected ? 0.5 : 1)};
  background: ${({ selected, theme }) => (selected ? theme.derpGradientDull : '#FFF')};
  color: ${({ selected, theme }) => (selected ? theme.white : '#000')};
  &:hover {
    background: ${({ theme }) => theme.derpGradientPrimary};
    color: #fff;
  }
`

export const SearchInput = styled.input`
  background: no-repeat scroll 7px 7px;
  background-image: url(${searchIcon});
  background-size: 20px 20px;
  background-position: 12px center;
  position: relative;
  display: flex;
  padding: 16px;
  padding-left: 40px;
  height: 40px;
  align-items: center;
  width: 100%;
  white-space: nowrap;
  background-color: ${({ theme }) => theme.backgroundModule};
  border: none;
  outline: none;
  border-radius: 12px;
  color: ${({ theme }) => theme.textPrimary};
  border-style: solid;
  border: 1px solid ${({ theme }) => theme.backgroundOutline};
  -webkit-appearance: none;

  font-size: 16px;

  ::placeholder {
    color: ${({ theme }) => theme.textTertiary};
    font-size: 16px;
  }
  transition: border 100ms;
  :focus {
    border: 1px solid ${({ theme }) => theme.accentActiveSoft};
    background-color: ${({ theme }) => theme.backgroundSurface};
    outline: none;
  }
`
export const ZapSearchInput = styled(SearchInput)`
  border-radius: 16px;
  height: 54px;
  border: 2px solid #000;

  :focus {
    border: 2px solid #000;
    background-color: ${({ theme }) => theme.backgroundSurface};
    outline: none;
  }
`

export const Separator = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.backgroundOutline};
`

export const LoadingRows = styled(BaseLoadingRows)`
  grid-column-gap: 0.5em;
  grid-template-columns: repeat(12, 1fr);
  max-width: 960px;
  padding: 12px 20px;

  & > div:nth-child(4n + 1) {
    grid-column: 1 / 8;
    height: 1em;
    margin-bottom: 0.25em;
  }
  & > div:nth-child(4n + 2) {
    grid-column: 12;
    height: 1em;
    margin-top: 0.25em;
  }
  & > div:nth-child(4n + 3) {
    grid-column: 1 / 4;
    height: 0.75em;
  }
`
