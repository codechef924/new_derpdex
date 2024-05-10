import styled from 'styled-components/macro'

import { MEDIUM_MEDIA_BREAKPOINT } from '../constant'

export const FilterOption = styled.button<{ active: boolean; highlight?: boolean }>`
  height: 100%;
  color: ${({ theme, active }) => (active ? theme.accentActive : theme.textPrimary)};
  background-color: ${({ theme, active }) => (active ? theme.white : theme.white)};
  margin: 0;
  padding: 6px 12px 6px 14px;
  border-radius: 12px;
  font-size: 16px;
  line-height: 24px;
  font-weight: 600;
  transition-duration: ${({ theme }) => theme.transition.duration.fast};
  border: none;
  outline: ${({ theme, active, highlight }) => (active && highlight ? `1px solid ${theme.accentAction}` : 'none')};

  :hover {
    cursor: pointer;
    background-color: ${({ theme, active }) => (active ? theme.white : theme.white)};
  }
  :focus {
    background-color: ${({ theme, active }) => (active ? theme.white : theme.white)};
  }
`

export const DerpFilterOption = styled(FilterOption)`
  border-radius: 8px;
  @media only screen and (max-width: ${MEDIUM_MEDIA_BREAKPOINT}) {
    width: 100%;
  }
`
