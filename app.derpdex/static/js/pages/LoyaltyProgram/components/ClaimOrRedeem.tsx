/* eslint-disable import/no-unused-modules */
import '@fontsource/nunito' // Defaults to weight 400

import { CircularProgress } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import { useToggleAccountDrawer } from 'components/AccountDrawer'
import { GloriaText } from 'components/CustomFonts/GloriaHallelujah'
import { NunitoText } from 'components/CustomFonts/Nunito'
import { MouseoverTooltip } from 'components/Tooltip'
import { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'

import { useClaimDerpPoint, useDerivedDerpPointBalance, useRedeemDerpPoint } from '../hooks/derp-point.hook'
import { ColFlex, DarkButton, ErrorText, Text } from '../stylings'

const Container = styled.div`
  max-width: 406px;
  // min-height: 436px;
  height: fit-content;
  flex-shrink: 0;

  padding: 32px 23px;

  border-radius: 24px;
  border: 2px solid #fff;
  background: linear-gradient(0deg, #46c9d2 0%, #a372ff 100%);
  box-shadow: 4px 4px 0px 2px #000;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  overflow: hidden;

  @media only screen and (max-width: 768px) {
    padding: 24px 16px;
  }
`

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
const ToggleElement = styled.span<{ isActive?: boolean; fontSize?: string; disabled?: boolean }>`
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

  ${({ disabled }) => {
    if (disabled) {
      return `
        cursor: help;
      `
    } else {
      return `
        cursor: pointer;
      `
    }
  }}
`

const StyledInput = styled.input`
  outline: none;
  border: 0;
  font-size: 20px;

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

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  border-radius: 16px;
  padding: 12px 26px;
  height: 68px;
  background: #fff;
  border: 2px solid #000;

  overflow: hidden;
  @media only screen and (max-width: 768px) {
    height: 48px;
    padding: 12px 16px;
  }
`

const ErrorFlexBox = styled(ColFlex)`
  background: #fff;
  border-radius: 8px;
  padding: 4px 24px;
`

export const BalanceGrid = styled.div<{ padding?: string }>`
  display: grid;
  grid-template-columns: 1.1fr 1.5fr;
  &.wallet-balance {
    grid-template-columns: 0.75fr 1.5fr;
  }
  &.redeemable-balance {
    grid-template-columns: 1.05fr 1.5fr;
  }

  @media only screen and (max-width: 768px) {
    grid-template-columns: 1.4fr 1.5fr;
  }
  width: 100%;

  padding: ${({ padding }) => (padding ? padding : 'unset')};
`

const EMPTY_STRING = ''

const StyledInputHandler = ({ placeHolder }: { placeHolder: string }) => {
  const [amountOfDERP, setAmountOfDERP] = useState<string>(EMPTY_STRING)

  const onInputAmountofDERP = useCallback((v: string) => {
    if (/^\d+$/.test(v)) {
      // Remove leading zeros from the input
      const sanitizedValue = v.replace(/^0+/, EMPTY_STRING)
      setAmountOfDERP(sanitizedValue)
    } else {
      // If the input is not a valid number, clear the state
      setAmountOfDERP(EMPTY_STRING)
    }
  }, [])

  return (
    <InputContainer>
      <StyledInput
        onChange={(e) => onInputAmountofDERP(e.target.value)}
        value={amountOfDERP}
        type="text"
        placeholder={placeHolder}
      />
      <StyledClickableText>MAX</StyledClickableText>
    </InputContainer>
  )
}

enum ActionType {
  CLAIM = 'Claim',
  REDEEM = 'Redeem',
}

const ActionInfo: {
  [key: ActionType | string]: { about: string; description: string; placeHolder: string; disabled: boolean }
} = {
  [ActionType.CLAIM]: {
    about: 'Claim DERP points',
    description:
      'Unlock bonus rewards and exclusive benefits by converting your DERP points to $DERP and xDERP tokens.',
    placeHolder: 'Enter DERP points amount',
    disabled: false,
  },
  [ActionType.REDEEM]: {
    about: 'Redeem DERP and xDERP',
    description: 'Redeem your DERP points for DERP (10%) and xDERP (90%).',
    placeHolder: 'Enter amount of DERP points',
    disabled: false,
  },
}

export interface Props extends React.BaseHTMLAttributes<HTMLDivElement> {
  icon?: React.ReactElement
}

export const ClaimOrRedeem = (Props: Props) => {
  const { icon, ...props } = Props
  const [currentElement, setCurrentElemet] = useState<ActionType>(ActionType.CLAIM)
  const [shouldReload, setShouldReload] = useState<boolean>(false)

  // toggle wallet when disconnected
  const toggleWalletDrawer = useToggleAccountDrawer()

  // injected state
  const { account } = useWeb3React()

  const {
    walletBalance,
    walletBalanceState,
    availableDerpPoint,
    derpPointState,
    getDerpPointsWalletBalance,
    getClaimableAmount,
  } = useDerivedDerpPointBalance()

  const { initiateClaim, claimState } = useClaimDerpPoint({
    getDerpPointsWalletBalance,
    getClaimableAmount,
  })

  const loadDerpPoints = useMemo(() => {
    if (derpPointState.isLoading) {
      return <CircularProgress color="info" size="12px" />
    } else {
      return availableDerpPoint
    }
  }, [availableDerpPoint, derpPointState.isLoading])

  const loadDerpPointsInWallet = useMemo(() => {
    if (walletBalanceState.isLoading) {
      return <CircularProgress color="info" size="12px" />
    } else {
      return parseFloat(walletBalance).toFixed(2)
    }
  }, [walletBalance, walletBalanceState.isLoading])

  const { initiateRedeem, redeemState } = useRedeemDerpPoint({
    amount: !walletBalanceState.isLoading ? walletBalance : '0',
    getDerpPointsWalletBalance,
  })

  const currentTimestamp = Date.now() / 1000
  const disableRedeem = currentTimestamp < 1703653200

  return (
    <Container {...props}>
      {/* <div ></div> */}
      <Toggle>
        <ToggleElement
          onClick={() => setCurrentElemet(ActionType.CLAIM)}
          isActive={Boolean(currentElement.match(ActionType.CLAIM))}
          disabled={ActionInfo[ActionType.CLAIM].disabled}
        >
          {ActionType.CLAIM}
        </ToggleElement>

        <ToggleElement
          onClick={() => (!disableRedeem ? setCurrentElemet(ActionType.REDEEM) : null)}
          isActive={Boolean(currentElement.match(ActionType.REDEEM))}
          disabled={disableRedeem}
        >
          {!disableRedeem ? (
            <> {ActionType.REDEEM}</>
          ) : (
            <MouseoverTooltip
              text="Redeem is temporarily disabled until airdrop started (21st Nov 2023)"
              placement="bottom"
            >
              {ActionType.REDEEM}
            </MouseoverTooltip>
          )}
        </ToggleElement>
      </Toggle>
      <ColFlex gap={4} margin="32px 0px 0px 0px">
        <Text color="#fff" size="xxl" weight={700}>
          {ActionInfo[currentElement].about}
        </Text>
        <Text color="#fff" size="lg2" weight={500}>
          {ActionInfo[currentElement].description}
        </Text>
      </ColFlex>
      {currentElement === ActionType.CLAIM && (
        <BalanceGrid
          padding="12px 0px 0px 13px"
          style={{ alignItems: 'start', justifyContent: 'flex-start', gap: '8px' }}
        >
          <Text size="md2" color="rgba(255, 255, 255, 0.80)">
            Balance to be claimed:
          </Text>
          <Text size="md2" color="rgba(255, 255, 255, 0.80)" style={{ wordWrap: 'break-word' }}>
            {loadDerpPoints} DERP&nbsp;points
          </Text>
        </BalanceGrid>
      )}
      {currentElement === ActionType.CLAIM && (
        <BalanceGrid
          className="wallet-balance"
          padding="12px 0px 0px 13px"
          style={{ alignItems: 'start', justifyContent: 'flex-start', gap: '8px' }}
        >
          <Text size="md2" color="rgba(255, 255, 255, 0.80)">
            Balance in wallet:
          </Text>
          <Text size="md2" color="rgba(255, 255, 255, 0.80)" style={{ wordWrap: 'break-word' }}>
            {loadDerpPointsInWallet} DERP&nbsp;points
          </Text>
        </BalanceGrid>
      )}
      {currentElement === ActionType.REDEEM && (
        <BalanceGrid
          className="redeemable-balance"
          padding="12px 0px 0px 13px"
          style={{ alignItems: 'start', justifyContent: 'flex-start', gap: '8px' }}
        >
          <Text size="md2" color="rgba(255, 255, 255, 0.80)">
            Redeemable amount:
          </Text>
          <Text size="md2" color="rgba(255, 255, 255, 0.80)" style={{ wordWrap: 'break-word' }}>
            {loadDerpPointsInWallet} DERP&nbsp;points
          </Text>
        </BalanceGrid>
      )}
      <ColFlex margin="24px 0px 0px 0px">
        {account ? (
          <>
            {currentElement === ActionType.CLAIM && (
              <DarkButton
                onClick={initiateClaim}
                disabled={claimState.isLoading === true || derpPointState.isLoading || derpPointState.error !== null}
              >
                <GloriaText size="xl" weight={400}>
                  {claimState.isLoading ? 'Claiming' : 'Claim'}
                </GloriaText>
              </DarkButton>
            )}
            {currentElement === ActionType.REDEEM && (
              <DarkButton
                onClick={initiateRedeem}
                disabled={
                  redeemState.isLoading === true || walletBalanceState.isLoading || parseFloat(walletBalance) === 0
                }
              >
                <GloriaText size="xl" weight={400}>
                  {redeemState.isLoading ? 'Redeeming' : 'Redeem'}
                </GloriaText>
              </DarkButton>
            )}
          </>
        ) : (
          <DarkButton onClick={toggleWalletDrawer}>
            <GloriaText size="xl" weight={400}>
              Connect a wallet
            </GloriaText>
          </DarkButton>
        )}
      </ColFlex>
      {claimState.error !== null && (
        <ErrorFlexBox margin="12px 0px 0px 0px">
          <ErrorText size="md2">{claimState.error}</ErrorText>
        </ErrorFlexBox>
      )}
    </Container>
  )
}
