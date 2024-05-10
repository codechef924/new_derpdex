import styled from 'styled-components/macro'

import Row from '../../Row'

export const Input = styled.input`
  width: 100%;
  display: flex;
  flex: 1;
  font-size: 16px;
  border: 0;
  outline: none;
  background: transparent;
  text-align: right;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  ::placeholder {
    color: ${({ theme }) => theme.textTertiary};
  }
`

export const InputContainer = styled(Row)<{ error?: boolean }>`
  padding: 8px 16px;
  max-width: 102.344px;
  // height: 36px;
  flex-shrink: 0;
  flex: 1;
  input {
    color: ${({ theme, error }) => (error ? theme.accentFailure : theme.textPrimary)};
  }
  border-radius: 4px;

  background: #fff;
  ${({ theme, error }) =>
    error
      ? `
        border: 1px solid ${theme.accentFailure};
        :focus-within {
          border-color: ${theme.accentFailureSoft};
        }
      `
      : `
        border: 2px solid #000;
        :focus-within {
          border-color: ${theme.accentActiveSoft};
        }
      `}
`
