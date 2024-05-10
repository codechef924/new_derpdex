/* eslint-disable import/no-unused-modules */
import { Currency } from '@uniswap/sdk-core'
import CloseButtonIcon from 'assets/images/close-button.png'
import { GloriaText } from 'components/CustomFonts/GloriaHallelujah'
import { NunitoText } from 'components/CustomFonts/Nunito'
import Modal from 'components/Modal'
import Row from 'components/Row'
import { PositionFields } from 'hooks/useCultivatePoolDatas'
import styled from 'styled-components/macro'

const Wrapper = styled.div`
  position: relative;
  border-radius: 8px;
  width: 300px;
  padding: 10px 20px;

  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    width: 100%;
  }
`

const RowBetween = styled(Row)`
  justify-content: space-between;
  gap: 12px;
`

const ModalTitle = styled(GloriaText)`
  font-size: 24px;
  font-weight: 700;
`

const ModelTitleContainer = styled(RowBetween)`
  flex-direction: column;
  margin-top: 20px;
  margin-bottom: 8px;
  align-items: flex-start;
`
const CloseButtonContainer = styled.div`
  position: relative;
`

const CloseButton = styled.img`
  position: absolute;
  top: -30px;
  right: -40px;
  width: 40px;
  height: 40px;
  cursor: pointer;
`

const FlexCol = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 8px;
`

const MainFlexCol = styled(FlexCol)`
  gap: 16px;
  padding-bottom: 16px;
`

const BodyFlexCol = styled(FlexCol)`
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding-bottom: 16px;
  border-radius: 12px;

  padding: 12px 0px;

  background: #f7f7f7;
  margin-bottom: 12px;
`
interface StakingModalProps {
  isOpen: boolean
  onDismiss: () => void
  position: PositionFields
  currencyPairInfo: {
    feeTier: number
    pair: (Currency | null | undefined)[]
  }
  components: JSX.Element
  components2: JSX.Element
  lpValue?: string | null
}

export const StakingModal = ({
  isOpen,
  onDismiss,
  position,
  currencyPairInfo,
  components,
  components2,
  lpValue,
}: StakingModalProps) => {
  return (
    <Modal maxWidth={300} isOpen={isOpen} $scrollOverlay={true} onDismiss={onDismiss} maxHeight={90}>
      <Wrapper className="override-modal" id="overriable-modal">
        <RowBetween>
          <div />
          <CloseButtonContainer>
            <CloseButton onClick={onDismiss} src={CloseButtonIcon} alt="close-button" />
          </CloseButtonContainer>
        </RowBetween>

        <ModelTitleContainer>
          <ModalTitle>
            <NunitoText size="xl">
              Stake {currencyPairInfo.pair[0]?.symbol} - {currencyPairInfo.pair[1]?.symbol} (#{position.id})
            </NunitoText>
          </ModalTitle>
        </ModelTitleContainer>
        <BodyFlexCol>
          {components2}
          <NunitoText size="lg" weight={700}>
            {currencyPairInfo.pair[0]?.symbol} per {currencyPairInfo.pair[1]?.symbol} - ${lpValue}
          </NunitoText>
        </BodyFlexCol>

        <MainFlexCol>{components}</MainFlexCol>
      </Wrapper>
    </Modal>
  )
}
