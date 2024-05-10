/* eslint-disable import/no-unused-modules */
import styled from 'styled-components/macro'

export const ToggleWrapper = styled.button<{ width?: string }>`
  display: flex;
  align-items: center;
  width: ${({ width }) => width ?? '100%'};
  padding: 1px;
  background: ${({ theme }) => theme.deprecated_bg1};
  border-radius: 8px;
  border: ${({ theme }) => '1px solid ' + theme.backgroundInteractive};
  cursor: pointer;
  outline: none;
`

export const ToggleElement = styled.span<{ isActive?: boolean; fontSize?: string }>`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 4px 0.5rem;
  border-radius: 6px;
  justify-content: center;
  height: 100%;
  background: ${({ theme, isActive }) => (isActive ? theme.backgroundSurface : 'none')};
  color: ${({ theme, isActive }) => (isActive ? theme.textPrimary : theme.textTertiary)};
  font-size: ${({ fontSize }) => fontSize ?? '1rem'};
  font-weight: 500;
  white-space: nowrap;
  :hover {
    user-select: initial;
    color: ${({ theme, isActive }) => (isActive ? theme.textSecondary : theme.textTertiary)};
  }
`

export const DDToggleWrapper = styled.button<{ width?: string }>`
  display: flex;
  align-items: center;
  width: ${({ width }) => width ?? '100%'};
  padding: 5px 7px;
  background: ${({ theme }) => theme.deprecated_bg1};
  box-shadow: -4px 4px 0px 0px rgba(0, 0, 0, 0.16);
  border-radius: 100px;
  border: ${({ theme }) => '3px solid ' + theme.black};
  cursor: pointer;
  outline: none;
`

export const DDToggleElement = styled.span<{ isActive?: boolean; fontSize?: string }>`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 2px 10px;
  border-radius: 100px;
  justify-content: center;
  height: 100%;
  background: ${({ theme, isActive }) => (isActive ? theme.black : 'none')};
  color: ${({ theme, isActive }) => (isActive ? theme.white : '#3683F5')};
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
  // min-width: 95px;
  :hover {
    user-select: initial;
    color: ${({ theme, isActive }) => (isActive ? theme.derpGray2 : theme.textTertiary)};
  }
`
