import { Trans } from '@lingui/macro'
import CloseButtonIcon from 'assets/images/close-button.png'
import { AutoColumn } from 'components/Column'
import { GloriaText } from 'components/CustomFonts/GloriaHallelujah'
import { NunitoText } from 'components/CustomFonts/Nunito'
import Modal from 'components/Modal'
import Row from 'components/Row'
import { useState } from 'react'
import { Calendar } from 'react-feather'
import styled from 'styled-components/macro'

import { weeks } from '../constant'

const Wrapper = styled.div`
  position: relative;
  border-radius: 8px;
  width: 480px;
  padding: 10px 32px;

  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    width: 100%;
  }
`

const RowBetween = styled(Row)`
  justify-content: space-between;
  gap: 12px;
`

const CloseButtonContainer = styled.div`
  position: relative;
`

const CloseButton = styled.img`
  position: absolute;
  top: -30px;
  right: -50px;
  width: 40px;
  height: 40px;
  cursor: pointer;
`

const ModalTitle = styled(GloriaText)`
  font-size: 24px;
  font-weight: 700;
`

const ModelTitleContainer = styled(RowBetween)`
  flex-direction: column;
  margin-bottom: 20px;
  align-items: flex-start;
`

const CloseActionButton = styled.button`
  border-radius: 16px;
  border: 2px solid #000;
  background: var(--primary-gradient-lr, linear-gradient(270deg, #46c9d2 0%, #a372ff 100%));
  box-shadow: 3px 3px 0px 0px #000;
  width: 30%;
  position: absolute;
  bottom: -20px;
  left: 0;
  right: 0;
  margin: auto;
  cursor: pointer;
`

const SelectionContainer = styled.div`
  margin-bottom: 32px;
  gap: 8px;
  overflow-y: scroll;
  height: 380px;
  display: flex;
  flex-direction: column;

  .active {
    color: ${({ theme }) => theme.white};
    border-color: ${({ theme }) => theme.derpPurp1};
    background: ${({ theme }) => theme.derpPurp1};
  }
`

const WeekSelect = styled.div`
  border-radius: 12px;
  border: 1px dashed #afbdc8;
  padding: 20px;
  cursor: pointer;
  gap: 4px;
  display: flex;
  align-items: center;
  color: #afbdc8;
  justify-content: center;
`

interface SelectionnModalProps {
  isOpen: boolean
  onDismiss: () => void
  week: number
  selectWeek: (week: number) => void
}

// eslint-disable-next-line import/no-unused-modules
export function WeekSelection({ isOpen, onDismiss, week: currentWeek, selectWeek }: SelectionnModalProps) {
  const [weekIndex, setWeekIndex] = useState(currentWeek)

  return (
    <Modal isOpen={isOpen} $scrollOverlay={true} onDismiss={onDismiss} maxHeight={90}>
      <Wrapper className="override-modal" id="overriable-modal">
        <AutoColumn gap="md">
          <RowBetween>
            <div />
            <CloseButtonContainer>
              <CloseButton onClick={onDismiss} src={CloseButtonIcon} alt="close-button" />
            </CloseButtonContainer>
          </RowBetween>

          <ModelTitleContainer>
            <ModalTitle>
              <Trans>Select Week</Trans>
            </ModalTitle>
          </ModelTitleContainer>

          <SelectionContainer>
            {weeks.map((week, index) => (
              <WeekSelect
                key={index}
                onClick={() => setWeekIndex(index)}
                className={weekIndex === index ? 'active' : ''}
              >
                <Calendar size={20} />
                <NunitoText weight={700} size="md2">
                  {week.startDay} - {week.endDay}
                </NunitoText>
              </WeekSelect>
            ))}
          </SelectionContainer>

          <CloseActionButton
            onClick={() => {
              selectWeek(weekIndex)
              onDismiss()
            }}
          >
            <GloriaText
              size="xl"
              weight={400}
              style={{
                color: '#fff',
              }}
            >
              <Trans>Confirm</Trans>
            </GloriaText>
          </CloseActionButton>
        </AutoColumn>
      </Wrapper>
    </Modal>
  )
}
