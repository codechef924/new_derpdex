import AnimatedDropdown from 'components/AnimatedDropdown'
import Column from 'components/Column'
import React, { PropsWithChildren, ReactElement } from 'react'
import { ChevronDown } from 'react-feather'
import styled from 'styled-components/macro'

import Row, { RowBetween } from '../Row'

const ColumnOverride = styled.div`
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-pack: start;
  -webkit-justify-content: flex-start;
  -ms-flex-pack: start;
  justify-content: flex-start;
  margin-bottom: 2px;
`
const ButtonContainer = styled(Row)`
  cursor: pointer;
  justify-content: flex-end;
  width: unset;
`

const ExpandIcon = styled(ChevronDown)<{ $isOpen: boolean }>`
  color: ${({ theme }) => theme.textSecondary};
  transform: ${({ $isOpen }) => ($isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: transform ${({ theme }) => theme.transition.duration.medium};
`

const Content = styled(Column)`
  padding-top: ${({ theme }) => theme.grids.md};

  #q-helper {
    width: 1000px;
  }
`
const Header = styled.div`
  #q-helper {
    svg {
      stroke: #627eea;
    }
  }
`

export default function Expand({
  header,
  button,
  children,
  testId,
  isOpen = true,
  onToggle,
}: PropsWithChildren<{
  header: ReactElement
  button: ReactElement
  testId?: string
  isOpen: boolean
  onToggle: () => void
}>) {
  return (
    <ColumnOverride>
      <RowBetween>
        <Header>{header}</Header>
        {/* <ButtonContainer data-testid={testId} onClick={onToggle} aria-expanded={isOpen}>
          {button}
          <ExpandIcon $isOpen={isOpen} />
        </ButtonContainer> */}
      </RowBetween>
      <AnimatedDropdown open={true}>
        <Content gap="md">{children}</Content>
      </AnimatedDropdown>
    </ColumnOverride>
  )
}
