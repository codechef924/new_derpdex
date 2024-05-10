/* eslint-disable import/no-unused-modules */
import { Trans } from '@lingui/macro'
import { formatNumber, NumberType } from '@uniswap/conedison/format'
import CloseButtonIcon from 'assets/images/close-button.png'
import { GloriaText } from 'components/CustomFonts/GloriaHallelujah'
import { NunitoText } from 'components/CustomFonts/Nunito'
import Modal from 'components/Modal'
import { Input as NumericalInput } from 'components/NumericalInput'
import Row from 'components/Row'
import { incentiveKeysAtom } from 'hooks/useWhitelistedPoolAddresses'
import { useAtomValue } from 'jotai/utils'
import { useAllocateXDerp, useDeallocateXDerp } from 'pages/Cultivate/hooks/useAllocateXDerp'
import { AllocationType, IAllocation, useEstimatedMultiplier } from 'pages/Cultivate/hooks/useUserPositionAllocation'
import { CultivateButton } from 'pages/Cultivate/stylings'
import { balanceAtom } from 'pages/xDERP/hooks/useAvailableDerpBalance'
import { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components/macro'

import { DURATION_OPTIONS, WEEK_OPTION } from './constants'

const Wrapper = styled.div`
  position: relative;
  border-radius: 8px;
  width: 416px;
  padding: 10px 32px;

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
  margin-bottom: 20px;
  align-items: flex-start;
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

const InputContainer = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  border-radius: 16px;
  padding: 12px 16px;
  height: 50px;
  background: #fff;
  border: 2px solid #000;

  overflow: hidden;
  @media only screen and (max-width: 768px) {
    height: 48px;
    padding: 12px 16px;
  }

  .on-max {
    justify-self: flex-end;
  }
`

const StyledNumericalInput = styled(NumericalInput)<{ $loading: boolean }>`
  text-align: left;
  font-size: 20px;

  height: 100%;
  width: 100%;

  @media only screen and (max-width: 768px) {
    font-size: 14px;
  }
`

const StyledClickableText = styled(NunitoText)`
  background: ${({ theme }) => theme.derpGradientPrimary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 600;
  cursor: pointer;

  font-size: 18px;
  @media only screen and (max-width: 768px) {
    font-size: 14px;
  }
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

const SpacedBetween = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

const FocusedText = styled(NunitoText)`
  font-size: 16px;
  font-weight: 700;
`

type DurationOpts = {
  isSelected?: boolean
}
const DurationItem = styled.div<DurationOpts>`
  display: flex;
  justify-content: center;
  align-items: center;

  border: 2px solid #000;
  border-radius: 8px;
  padding: 8px 12px;

  background: ${({ theme, isSelected }) => (isSelected ? theme.derpGradientPrimary : '#ebebeb')};
  color: ${({ theme, isSelected }) => (isSelected ? theme.white : '#000')};

  &:hover {
    background: ${({ theme, isSelected }) => (isSelected ? theme.derpGradientDull : theme.derpGradientDull)};
  }

  cursor: pointer;
  min-width: 56px;
`

const BoostButton = styled(CultivateButton)`
  border-radius: 16px;
  box-shadow: 3px 3px 0px 0px #000;
  border-radius: 16px;
  border: 2px solid #344d73;
`

const WarningBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  border: 2px solid #ffb237;
  border-radius: 16px;
  padding: 8px 16px;
  background: #ffb23719;
  font-size: 16px;
`

const InfoBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  border: 2px solid #d2d2d2;
  border-radius: 16px;
  padding: 8px 16px;
  background: #f5f5f5;
  font-size: 16px;
`

const InlineText = styled(FocusedText)`
  display: inline-flex;
`

const TextStrikethrough = styled(FocusedText)<{ isStrikethrough: boolean }>`
  text-decoration: ${({ isStrikethrough }) => (isStrikethrough ? 'line-through' : 'unset')};
`

const StyledInputHandler = ({
  balance,
  placeHolder,
  inputAmount,
  setInputAmount,
  showMax = false,
  disabled = false,
}: {
  balance: string
  placeHolder: string
  inputAmount: string
  setInputAmount: React.Dispatch<string>
  showMax: boolean
  disabled: boolean
}) => {
  const setMax = useCallback(() => {
    setInputAmount(balance)
  }, [balance])

  const onInputAmountofDERP = useCallback((v: string) => {
    setInputAmount(v)
  }, [])

  return (
    <InputContainer>
      <StyledNumericalInput
        className="token-amount-input"
        disabled={disabled}
        onUserInput={onInputAmountofDERP}
        value={inputAmount}
        placeholder={placeHolder}
        $loading={false}
      />
      {showMax && (
        <StyledClickableText className="on-max" onClick={setMax}>
          MAX
        </StyledClickableText>
      )}
    </InputContainer>
  )
}

const EMPTY_STRING = ''

// const DurationSelector = ({
//   selectedWeek,
//   setWeekOption,
//   durationOptionsSlashing,
// }: {
//   selectedWeek: string
//   setWeekOption: React.Dispatch<string>
//   durationOptionsSlashing: {
//     label: string
//     terms: string
//     seconds: number
//     option: string
//   }[]
// }) => {
//   return (
//     <RowBetween>
//       {durationOptionsSlashing.map((d) => (
//         <DurationItem
//           onClick={() => setWeekOption(d.terms)}
//           isSelected={Boolean(selectedWeek === d.terms)}
//           key={d.label}
//         >
//           <NunitoText size="md2" weight={600}>
//             {d.label}
//           </NunitoText>
//         </DurationItem>
//       ))}
//     </RowBetween>
//   )
// }

const InfoPanel = ({
  type,
  poolAddress,
  incentiveId,
  poolId,
  amountEntered,
  stakedMultiplier,
  allocationInfo,
  addonDuration,
}: {
  type: AllocationType
  poolAddress: string
  incentiveId: string
  poolId: string
  amountEntered: string
  stakedMultiplier: string
  allocationInfo: IAllocation
  addonDuration?: number
}) => {
  const incentiveKeys = useAtomValue(incentiveKeysAtom)
  const currentTimestamp = useMemo(() => {
    return (Date.now() / 1000).toFixed(0)
  }, [])

  const newEndTimestamp = useMemo(() => {
    if (addonDuration) {
      const remainingDuration = parseInt(allocationInfo.lockUntilTimestamp) - parseInt(currentTimestamp)
      const extendedDuration = parseInt(allocationInfo.lockUntilTimestamp) + addonDuration
      if (allocationInfo.isAllocated) {
        return extendedDuration.toFixed(0)
      } else {
        return (parseInt(currentTimestamp) + addonDuration).toFixed(0)
      }
    } else {
      return '0'
    }
  }, [addonDuration, allocationInfo.lockUntilTimestamp, currentTimestamp])

  const isExtendedDurationAmount = useMemo(() => {
    if (type === AllocationType.EXTEND && amountEntered) {
      return true
    } else {
      return false
    }
  }, [type, amountEntered])

  // Post-Boosted
  const isIncreasingAmount = useMemo(() => {
    if (type === AllocationType.ALLOCATE_MORE) {
      return true
    } else {
      return false
    }
  }, [type, amountEntered])

  const { estimatedMultiplier, showChanges } = useEstimatedMultiplier({
    userStartTime:
      type === AllocationType.BOOST
        ? currentTimestamp
        : isIncreasingAmount
        ? allocationInfo.startSinceTimestamp
        : currentTimestamp,
    userEndTime:
      type === AllocationType.BOOST && allocationInfo.isAllocated ? allocationInfo.lockUntilTimestamp : newEndTimestamp,
    poolStartTime: incentiveKeys[incentiveId].startTime,
    poolEndTime: incentiveKeys[incentiveId].endTime,
    xDerpAmount: amountEntered,
    // type === AllocationType.BOOST
    //   ? amountEntered
    //   : isIncreasingAmount
    //   ? (parseFloat(amountEntered) + parseFloat(allocationInfo.allocatedAmount)).toString()
    //   : allocationInfo.allocatedAmount,
    pool: poolAddress,
    poolId,
  })

  const differenceAfterBoost = useMemo(() => {
    if (parseFloat(stakedMultiplier) < parseFloat(estimatedMultiplier)) return true
    else return false
  }, [stakedMultiplier, estimatedMultiplier])

  return (
    <FlexCol>
      <InfoBox>
        <RowBetween>
          <FocusedText>Multiplier:</FocusedText>
          <InlineText>
            <TextStrikethrough isStrikethrough={true}>{stakedMultiplier}x</TextStrikethrough>&nbsp;
            {showChanges && differenceAfterBoost ? (
              <>
                {'->'} {estimatedMultiplier}x
              </>
            ) : (
              <>
                {'->'} {stakedMultiplier}x
              </>
            )}
          </InlineText>
        </RowBetween>
      </InfoBox>
    </FlexCol>
  )
}

interface BoostModalProps {
  isOpen: boolean
  onDismiss: () => void
  poolAddress: string
  incentiveId: string
  poolId: string
  stakedMultiplier: string
  allocationInfo: IAllocation
  modalType: AllocationType
  setShouldRefetchAfterBoost: React.Dispatch<boolean>
}

export const BoostModal = ({
  isOpen,
  onDismiss,
  poolAddress,
  incentiveId,
  poolId,
  stakedMultiplier,
  allocationInfo,
  modalType,
  setShouldRefetchAfterBoost,
}: BoostModalProps) => {
  const incentiveKeys = useAtomValue(incentiveKeysAtom)
  const [amount, setAmount] = useState<string>(EMPTY_STRING)
  const [addMore, setAddMore] = useState<boolean>(false)
  const [weekOption, setWeekOption] = useState<string>(WEEK_OPTION._1W)
  const [durationInSeconds, setDurationInSeconds] = useState<number>(DURATION_OPTIONS[0].seconds)

  const userBalance = useAtomValue(balanceAtom)

  const { allocateState, allocateActionCall, allocateXDerp } = useAllocateXDerp({
    incentiveId,
    poolAddress,
    poolId,
    amount,
    durationInSeconds,
    endTime: allocationInfo.lockUntilTimestamp,
    isExtendedDuration: allocationInfo.isAllocated,
    canDeallocate: allocationInfo.canDeallocate,
    modalType,
  })

  const { deallocateState, deallocateActionCall, deallocateXDerp } = useDeallocateXDerp({
    incentiveId,
    poolAddress,
    poolId,
    amount: allocationInfo.allocatedAmount,
  })

  useEffect(() => {
    if (allocateState.isSuccess || deallocateState.isSuccess) {
      onDismiss()
      setShouldRefetchAfterBoost(true)
    }
  }, [allocateState.isSuccess, deallocateState.isSuccess])

  // const LockedPeriod = useMemo(() => {
  //   const formattedStartDate = d3.timeFormat('%d/%-m/%Y')(new Date(parseInt(allocationInfo.startSinceTimestamp) * 1000))
  //   const formattedEndDate = d3.timeFormat('%d/%-m/%Y')(new Date(parseInt(allocationInfo.lockUntilTimestamp) * 1000))
  //   return [formattedStartDate, formattedEndDate]
  // }, [allocationInfo])

  const isExtendedDurationAmount = useMemo(() => {
    if (modalType === AllocationType.ALLOCATE_MORE && amount) {
      return true
    } else {
      return false
    }
  }, [modalType, amount])

  return (
    <Modal isOpen={isOpen} $scrollOverlay={true} onDismiss={onDismiss} maxHeight={90}>
      <Wrapper className="override-modal" id="overriable-modal">
        <RowBetween>
          <div />
          <CloseButtonContainer>
            <CloseButton onClick={onDismiss} src={CloseButtonIcon} alt="close-button" />
          </CloseButtonContainer>
        </RowBetween>

        <ModelTitleContainer>
          <ModalTitle>
            <Trans>{modalType === AllocationType.DEALLOCATE ? AllocationType.DEALLOCATE : AllocationType.BOOST}</Trans>
          </ModalTitle>
        </ModelTitleContainer>
        <MainFlexCol>
          <FlexCol>
            <FocusedText>
              {modalType === AllocationType.DEALLOCATE ? AllocationType.DEALLOCATE : AllocationType.BOOST} Staked
              Liquidity Position
            </FocusedText>
            <SpacedBetween>
              <FocusedText>Amount Locked</FocusedText>
              <FocusedText>
                {formatNumber(parseFloat(allocationInfo.allocatedAmount), NumberType.SwapTradeAmount)} xDERP
              </FocusedText>
            </SpacedBetween>
            {/* {allocationInfo.isAllocated && (
              <SpacedBetween>
                <FocusedText>Locked Period:</FocusedText>
                <FocusedText>
                  {LockedPeriod[0]} - {LockedPeriod[1]}
                </FocusedText>
              </SpacedBetween>
            )} */}
          </FlexCol>
          {modalType === AllocationType.DEALLOCATE && (
            <BoostButton disabled={deallocateState.isLoading} onClick={() => deallocateXDerp()}>
              <GloriaText size="lg2">{deallocateActionCall}</GloriaText>
            </BoostButton>
          )}
          {modalType === AllocationType.BOOST && (
            <>
              <FlexCol>
                <FocusedText>Amount to be locked</FocusedText>
                <StyledInputHandler
                  balance={userBalance.XDERP.toString()}
                  placeHolder="Enter amount of xDERP"
                  inputAmount={amount}
                  setInputAmount={setAmount}
                  showMax={true}
                  disabled={false}
                />
                <NunitoText size="md2">Balance: {formatNumber(userBalance.XDERP, NumberType.TokenNonTx)}</NunitoText>
              </FlexCol>

              {/* {!allocationInfo.isAllocated && (
                <FlexCol>
                  <FocusedText>Duration</FocusedText>
                  <DurationSelector
                    selectedWeek={weekOption}
                    setWeekOption={setWeekOption}
                    durationOptionsSlashing={durationOptionsSlashing}
                  />
                  <RowBetween>
                    <StyledInputHandler
                      balance="0"
                      placeHolder="Enter Week"
                      inputAmount={weekOption}
                      setInputAmount={setWeekOption}
                      showMax={false}
                      disabled={false}
                    />
                    <FocusedText>Week</FocusedText>
                  </RowBetween>
                </FlexCol>
              )} */}
              {/* {allocationInfo.isAllocated && ( */}
              <InfoPanel
                type={AllocationType.BOOST}
                incentiveId={incentiveId}
                poolAddress={poolAddress}
                poolId={poolId}
                allocationInfo={allocationInfo}
                stakedMultiplier={stakedMultiplier}
                amountEntered={amount}
                addonDuration={durationInSeconds}
              />
              {/* )} */}

              <BoostButton
                disabled={
                  allocateState.isLoading || !(parseFloat(amount) > 0) || parseFloat(amount) > userBalance.XDERP
                }
                onClick={() => allocateXDerp()}
              >
                <GloriaText size="lg2">{allocateActionCall}</GloriaText>
              </BoostButton>
            </>
          )}
          {modalType === AllocationType.ALLOCATE_MORE && (
            <>
              <FlexCol>
                <FocusedText>Allocate more xDERP</FocusedText>
                <StyledInputHandler
                  balance={userBalance.XDERP.toString()}
                  placeHolder="Enter amount of xDERP"
                  inputAmount={amount}
                  setInputAmount={setAmount}
                  showMax={true}
                  disabled={false}
                />
                <NunitoText size="md2">Balance: {userBalance.XDERP}</NunitoText>
              </FlexCol>
              {/* <FlexCol>
                <FocusedText>Duration</FocusedText>
                <DurationSelector
                  selectedWeek={weekOption}
                  setWeekOption={setWeekOption}
                  durationOptionsSlashing={durationOptionsSlashing}
                />
                <RowBetween>
                  <StyledInputHandler
                    balance="0"
                    placeHolder="Enter Week"
                    inputAmount={weekOption}
                    setInputAmount={setWeekOption}
                    showMax={false}
                    disabled={false}
                  />
                  <FocusedText>Week</FocusedText>
                </RowBetween>
              </FlexCol> */}
              <InfoPanel
                type={AllocationType.ALLOCATE_MORE}
                poolAddress={poolAddress}
                incentiveId={incentiveId}
                poolId={poolId}
                allocationInfo={allocationInfo}
                stakedMultiplier={stakedMultiplier}
                amountEntered={amount}
                addonDuration={durationInSeconds}
              />
              <BoostButton
                disabled={
                  !isExtendedDurationAmount
                    ? allocateState.isLoading
                    : parseFloat(amount) > userBalance.XDERP || allocateState.isLoading
                }
                onClick={() => allocateXDerp()}
              >
                <GloriaText size="lg2">{allocateActionCall}</GloriaText>
              </BoostButton>
            </>
          )}
        </MainFlexCol>
      </Wrapper>
    </Modal>
  )
}
