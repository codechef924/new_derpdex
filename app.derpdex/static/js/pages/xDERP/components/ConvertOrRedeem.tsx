/* eslint-disable import/no-unused-modules */
import '@fontsource/nunito' // Defaults to weight 400

import { formatNumber, NumberType } from '@uniswap/conedison/format'
import { useWeb3React } from '@web3-react/core'
import { useToggleAccountDrawer } from 'components/AccountDrawer'
import { GloriaText } from 'components/CustomFonts/GloriaHallelujah'
import { NunitoText } from 'components/CustomFonts/Nunito'
import { Input as NumericalInput } from 'components/NumericalInput'
import { useAtomValue } from 'jotai/utils'
import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

import { balanceAtom, useAvailableDerpBalance } from '../hooks/useAvailableDerpBalance'
import { useCovertDerpToXDerp } from '../hooks/useCovertDerpToXDerp'
import { RedeemOptions, useRedeemXDerpToDerp } from '../hooks/useRedeemXDerpToDerp'
import { ColFlex, DarkButton, Text } from '../stylings'

const Container = styled.div`
  max-width: 406px;
  min-height: 436px;
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

const StyledInput = styled.input`
  outline: none;
  border: 0;
  font-size: 20px;
  max-width: 230px;

  @media only screen and (max-width: 768px) {
    font-size: 14px;
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

const InputContainer = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
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

  .on-max {
    justify-self: flex-end;
  }
`

const RedeemDurationWrapper = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 1fr 1.5fr;
  margin-bottom: 1rem;
  margin-top: 1rem;
`

const RedeemSelector = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 8px;
  background: ${({ theme }) => theme.derpGray2};
  width: 100%;
`

type RedeemOpts = {
  isActive?: boolean
}

const RedeemItem = styled.div<RedeemOpts>`
  text-align: center;
  color: ${({ isActive }) => (isActive ? '#fff' : '#000')};
  background: ${({ theme, isActive }) => (isActive ? theme.derpGradientPrimary : 'unset')};
  border-radius: 8px;
  width: 100%;
  border: ${({ isActive }) => (isActive ? '2px solid #000' : 'unset')};
  box-shadow: ${({ isActive }) => (isActive ? '2px 2px 0px 0px #000' : 'unset')};

  padding: 8px 0px;
  cursor: pointer;
`

const EMPTY_STRING = ''

const StyledInputHandler = ({
  balanceOfDerp,
  placeHolder,
  inputAmount,
  setInputAmount,
}: {
  balanceOfDerp: number
  placeHolder: string
  inputAmount: string
  setInputAmount: React.Dispatch<string>
}) => {
  const { account } = useWeb3React()
  // const [amountOfDERP, setAmountOfDERP] = useState<string>(EMPTY_STRING)

  const setMax = useCallback(() => {
    setInputAmount((Math.floor(balanceOfDerp * 10000) / 10000).toString())
  }, [balanceOfDerp])

  const onInputAmountofDERP = useCallback((v: string) => {
    setInputAmount(v)
  }, [])

  return (
    <InputContainer>
      <StyledNumericalInput
        className="token-amount-input"
        disabled={false}
        onUserInput={onInputAmountofDERP}
        value={inputAmount}
        placeholder={placeHolder}
        $loading={false}
      />
      <StyledClickableText className="on-max" onClick={setMax}>
        MAX
      </StyledClickableText>
    </InputContainer>
  )
}

enum ActionType {
  CONVERT = 'Convert',
  REDEEM = 'Redeem',
}

const ActionInfo: { [key: ActionType | string]: { about: string; description: string; placeHolder: string } } = {
  [ActionType.CONVERT]: {
    about: 'Get xDERP',
    description: 'Unlock bonus rewards and exclusive benefits by converting your DERP to xDERP.',
    placeHolder: 'Enter amount of DERP',
  },
  [ActionType.REDEEM]: {
    about: 'Redeem xDERP',
    description:
      'Redeem your xDERP back into DERP over a vesting period of 24 days (1:0.42 ratio) to 96 days (1:1 ratio).',
    placeHolder: 'Enter amount of xDERP',
  },
}

export const ConvertOrRedeem = () => {
  const { chainId } = useWeb3React()
  const [currentElement, setCurrentElemet] = useState<ActionType>(ActionType.CONVERT)
  const [RedeemDays, setRedeemDays] = useState<RedeemOptions>(RedeemOptions._24DAYS)
  const [inputAmount, setInputAmount] = useState<string>(EMPTY_STRING)

  const balance = useAtomValue(balanceAtom)

  // toggle wallet when disconnected
  const toggleWalletDrawer = useToggleAccountDrawer()

  // injected state
  const { account } = useWeb3React()

  const { balanceOfDerp, getBalance } = useAvailableDerpBalance()

  const { claimXDerp, claimXDerpState, actionType, shouldDisableButton } = useCovertDerpToXDerp({
    amountOfDERP: inputAmount,
    balance: balanceOfDerp,
    getBalance,
  })

  const {
    redeemDerp,
    redeemDerpState,
    actionType: redeemActionType,
    shouldDisableButton: shouldDisableRedeemButton,
  } = useRedeemXDerpToDerp({
    amountOfXDERP: inputAmount,
    balance: balance.XDERP,
    duration: RedeemDays,
    getBalance,
  })

  useEffect(() => {
    setInputAmount(EMPTY_STRING)
  }, [currentElement, claimXDerpState.isSuccess, redeemDerpState.isSuccess])

  return (
    <Container>
      <Toggle>
        <ToggleElement
          onClick={() => setCurrentElemet(ActionType.CONVERT)}
          isActive={Boolean(currentElement.match(ActionType.CONVERT))}
        >
          {ActionType.CONVERT}
        </ToggleElement>
        <ToggleElement
          onClick={() => setCurrentElemet(ActionType.REDEEM)}
          isActive={Boolean(currentElement.match(ActionType.REDEEM))}
        >
          {ActionType.REDEEM}
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
      <ColFlex margin="24px 0px 0px 0px">
        <StyledInputHandler
          balanceOfDerp={currentElement === ActionType.CONVERT ? balance.DERP : balance.XDERP}
          placeHolder={ActionInfo[currentElement].placeHolder}
          inputAmount={inputAmount}
          setInputAmount={setInputAmount}
        />
      </ColFlex>
      {currentElement === ActionType.CONVERT && (
        <ColFlex padding="11px 0px 0px 13px">
          <Text size="md2" color="rgba(255, 255, 255, 0.80)">
            Balance: {formatNumber(balance.DERP, NumberType.TokenTx)} DERP
          </Text>
        </ColFlex>
      )}
      {currentElement === ActionType.REDEEM && (
        <ColFlex gap={8} padding="11px 0px 0px 13px">
          <Text size="md2" color="rgba(255, 255, 255, 0.80)" style={{ textAlign: 'right' }}>
            Balance: <b>{Math.floor(balance.XDERP * 10000) / 10000}</b> xDERP
          </Text>

          <RedeemDurationWrapper>
            <Text size="lg" color="rgba(255, 255, 255)">
              Redeem Duration:
            </Text>
            <RedeemSelector>
              <RedeemItem
                onClick={() => setRedeemDays(RedeemOptions._24DAYS)}
                isActive={Boolean(RedeemDays.match(RedeemOptions._24DAYS))}
              >
                24 days
              </RedeemItem>
              <RedeemItem
                onClick={() => setRedeemDays(RedeemOptions._96DAYS)}
                isActive={Boolean(RedeemDays.match(RedeemOptions._96DAYS))}
              >
                96 days
              </RedeemItem>
            </RedeemSelector>
            <RedeemSelector></RedeemSelector>
          </RedeemDurationWrapper>

          <Text size="md2" color="rgba(255, 255, 255, 0.80)">
            24 days of vesting for a 1:0.42 ratio: <b>{Math.floor(balance.XDERP * 0.42 * 10000) / 10000}</b> xDERP
          </Text>
          <Text size="md2" color="rgba(255, 255, 255, 0.80)">
            96 days of vesting for 1:1 ratio: <b>{Math.floor(balance.XDERP * 10000) / 10000}</b> xDERP
          </Text>
        </ColFlex>
      )}

      <ColFlex margin="24px 0px 0px 0px">
        {account ? (
          <>
            {currentElement === ActionType.CONVERT ? (
              <DarkButton onClick={claimXDerp} disabled={shouldDisableButton}>
                <GloriaText size="xl" weight={400}>
                  {actionType}
                </GloriaText>
              </DarkButton>
            ) : (
              <DarkButton onClick={redeemDerp} disabled={shouldDisableRedeemButton}>
                <GloriaText size="xl" weight={400}>
                  {redeemActionType}
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
    </Container>
  )
}
