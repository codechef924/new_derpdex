/* eslint-disable import/no-unused-modules */
import { TableOption } from 'pages/Cultivate/components/Table'
import styled from 'styled-components'

const Toggle = styled.div<{ width?: string }>`
  display: flex;
  align-items: center;
  max-width: 288px;
  width: 100%;

  background: ${({ theme }) => theme.deprecated_bg1};
  border-radius: 100px;
  cursor: pointer;
  outline: none;

  * {
    font-family: 'Nunito' !important;
  }
`
const ToggleElement = styled.span<{ isActive?: boolean; fontSize?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  padding: 17px 10px;

  border-radius: 100px;
  border: ${({ isActive }) => (isActive ? '2px solid #000' : 'unset')};
  box-shadow: ${({ isActive }) => (isActive ? '4px 4px 0px 0px #000' : 'unset')};

  height: 100%;
  background: ${({ theme, isActive }) => (isActive ? theme.derpGradientPrimary : 'none')};
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

export const ToggleOption = ({
  currentTableOption,
  setCurrentTableOption,
}: {
  currentTableOption: TableOption
  setCurrentTableOption: React.Dispatch<TableOption>
}) => {
  return (
    <Toggle>
      <ToggleElement
        onClick={() => setCurrentTableOption(TableOption.LIVE)}
        isActive={Boolean(currentTableOption.match(TableOption.LIVE))}
      >
        {TableOption.LIVE}
      </ToggleElement>
      <ToggleElement
        onClick={() => setCurrentTableOption(TableOption.FINISHED)}
        isActive={Boolean(currentTableOption.match(TableOption.FINISHED))}
      >
        {TableOption.FINISHED}
      </ToggleElement>
    </Toggle>
  )
}
