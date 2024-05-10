import { Alert, Checkbox, CircularProgress, Snackbar } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import { ReactComponent as ArrowDownIcon } from 'assets/svg/arrow-down-icon.svg'
import { ReactComponent as NoticeIcon } from 'assets/svg/notice-icon.svg'
import { GloriaText } from 'components/CustomFonts/GloriaHallelujah'
import { NunitoText } from 'components/CustomFonts/Nunito'
import { SupportedChainId } from 'constants/chains'
import { RPC_URLS } from 'constants/networks'
import { useIsMobile } from 'nft/hooks'
import { useEffect, useState } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import styled from 'styled-components'
import { ExplorerDataType, getExplorerLink } from 'utils/getExplorerLink'
import { Provider } from 'zksync-web3'

import { BRIDGE_INFO } from '../_supported_token_bridge'
import { useSupportedWithdrawCallback, useWithdrawInscription } from '../hooks/withdraw'
import {
  AlertBox,
  BalanceEstimate,
  BalanceMaxBox,
  BlurredBalance,
  DepoitOrWithdrawToAnotherWrapper,
  DepositOrWithdrawBody,
  FixedHeight,
  InvalidTextWrapper,
  ListOfClaimmableBody,
  ListOfDepositStatus,
  MaxButton,
  OverridedBridgeButton,
  RowOfClaimmable,
  RowOfDepositStatus,
  StyledInput,
} from '../stylings'
import AssetLogo from '../utils/AssetLogo'
import { ClaimCallback, ClaimOpBnB, State } from '../utils/Claim'
import { useGetAllAvailableWithdrawal, useInsertWithdrawOnL2 } from '../utils/useVarieties'
import { DEPOSIT, WITHDRAW } from './BridgeComponent'
import { InputToken } from './InputToken'
import { Switcher } from './Switcher'
import { useNetworkChange } from './useNetworkChange'
import { useGetBurnTransactions } from '../hooks/useGetDetails'
import { CallbackStatus } from '../utils/useStoreDepositHash'

const WithdrawWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const NoticeCard = styled.div`
  background: rgba(251, 146, 60, 0.1);
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 9px;
  width: 100%;
  height: 108px;

  margin-top: 18px;

  .icon-area {
    background: #FB923C;
    flex-grow: 1;
    height: 100%;
    padding: 42px 12px;

    @media only screen and (max-width: 768px) {
      padding: 42px 6px ;
    }

    display: flex;
    justify-content: center;
    align-items: center;
  }

  .details-area {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 0.9em;
    @media only screen and (max-width: 768px) {
      overflow: scroll;
      height: 84px;

    }
  }

  span {
    color: #e47113;
    font-weight: 400;
    line-heightL 155%;

    a {
      color: #98a1c0;
      text-decoration: underline;
      cursor: pointer;
    }
  }
`

const CheckBoxWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  width: 100%;
  margin-top: 23px;
  .MuiCheckbox-root {
    padding: 0;
  }
  color: ${({ theme }) => theme.black};
  .MuiCheckbox-root {
    color: ${({ theme }) => theme.derpGradientPrimary} !important;
  }
`

const FixedClaimContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  margin-left: 30px;
  margin-bottom: 30px;
`

const FixedClaimContainerMobile = styled.div`
  position: fixed;
  bottom: 0;
  margin-bottom: 50px;
`
const ClaimerButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.derpGradientPrimary};
  border-radius: 8px;
  padding: 10px 16px;
  font-weight: 600;
  font-size: 22px;
  color: white;
  cursor: pointer;
  .in-progress {
    font-size: 14px;
  }
  min-width: 230px;
  min-height: 50px;
`

const ClaimerButtonMobile = styled.div<{ isErrorClaim?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.derpGradientPrimary};
  border-radius: 8px;
  padding: 10px 12px;
  font-weight: 600;
  font-size: 18px;
  color: white;
  cursor: pointer;
  .in-progress {
    font-size: 14px;
  }
  border: ${({ isErrorClaim }) => (isErrorClaim ? '1px solid red' : 'none')};
  max-width: 350px;
  max-height: 50px;
`

const ClaimerButtonDisabled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.derpGradientDull};
  border-radius: 8px;
  padding: 10px 16px;
  font-weight: 600;
  font-size: 22px;
  color: white;
  cursor: pointer;
  .in-progress {
    font-size: 14px;
  }
  min-width: 230px;
  min-height: 50px;
`

const ClaimerButtonDisabledMobile = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.derpGradientDull};
  border-radius: 8px;
  padding: 10px 12px;
  font-weight: 600;
  font-size: 14px;
  color: white;
  cursor: pointer;
  .in-progress {
    font-size: 14px;
  }
  max-width: 350px;
  max-height: 50px;
`

// TODO: [Inscriptions] Change the details about the withdrawal
const WITHDRAW_INFO = () => {
  const DEFAULT = {
    header: 'Withdrawal may take up to 5 minutes',
    description:
      'The transaction statuses are being monitored to confirm their success, and upon verification, your inscription will be automatically transferred.',
  }
  
  return DEFAULT
}

const DEFAULT_NETWORK =
  process.env.REACT_APP_IS_TESTSITE === 'true' ? SupportedChainId.OPBNB_TESTNET : SupportedChainId.OPBNB_MAINNET

export const WithdrawBridge = ({
  tokenList,
  currentToken,
  setCurrentToken,
  depositTokenData,
  withdrawTokenData,
  onSwitch,
  batchGetBalance,
}: {
  tokenList: BRIDGE_INFO[]
  currentToken: BRIDGE_INFO
  setCurrentToken?: (token: BRIDGE_INFO) => void
  depositTokenData: DEPOSIT
  withdrawTokenData: WITHDRAW
  onSwitch: () => void
  batchGetBalance: () => void
}) => {
  const [selectedNetwork, setSelectedNetwork] = useState<SupportedChainId>(DEFAULT_NETWORK)
  const { changeNetwork, isChangedtoL2 } = useNetworkChange({
    targetNetwork: selectedNetwork,
  })
  const [inputAmount, setInputAmount] = useState<number | undefined>(undefined)
  const [expandOtherRecipient, setExpandOtherRecipient] = useState<boolean>(false)
  const [otherRecipient, setOtherRecipient] = useState<string | undefined>()
  const [checkAgreement, setCheckAgreement] = useState<boolean>(false)

  const { chainId, provider, connector, account } = useWeb3React()

  const [shouldReload, setShouldReload] = useState<boolean>(true)
  const { isLoading, isSuccess, burnERC20 } = useWithdrawInscription({
    currentToken,
    inputAmount,
    otherRecipient,
    batchGetBalance,
    setInputAmount,
    setShouldReload,
  })

  const onHandleWithdrawal = async () => {
    if (!isChangedtoL2) {
      try {
        await changeNetwork()
      } catch (error) {
        console.log('Error while changing network:', error)
        return
      }
    } else {
      await burnERC20()
    }
  }

  // const { getAllAvailableWithdrawal, allAvailableWithdrawalLog, isSuccessGetAllAvailableWithdrawal } =
  //   useGetAllAvailableWithdrawal()

  const { txList, getBurnTransactions } = useGetBurnTransactions()

  const onClickMaxBalance = () => {
    setInputAmount(depositTokenData.balance)
  }

  useEffect(() => {
    if (account && chainId && shouldReload) {
      getBurnTransactions(account, chainId).then(() => {})
      setShouldReload(false)
    }
  }, [account, chainId, shouldReload])

  return (
    <WithdrawWrapper>
      <DepositOrWithdrawBody>
        <BalanceMaxBox>
          <BlurredBalance>Balance: {depositTokenData.balance}</BlurredBalance>
          <MaxButton onClick={onClickMaxBalance}>MAX</MaxButton>
        </BalanceMaxBox>
        <InputToken
          onMaxedAmount={onClickMaxBalance}
          inputAmount={inputAmount}
          setInputAmount={setInputAmount}
          currentToken={currentToken}
          setCurrentToken={setCurrentToken}
          isInput={true}
          tokenData={depositTokenData}
          tokenList={tokenList}
        />
        <Switcher onSwitch={() => onSwitch()} />
        <InputToken isInput={false} tokenData={withdrawTokenData} />
        <DepoitOrWithdrawToAnotherWrapper onClick={() => setExpandOtherRecipient(!expandOtherRecipient)}>
          Send to other wallet <ArrowDownIcon />
        </DepoitOrWithdrawToAnotherWrapper>
        {expandOtherRecipient && (
          <div
            style={{
              width: '100%',
              marginTop: '10px',
            }}
          >
            <StyledInput
              value={otherRecipient}
              onInput={(e) => {
                setOtherRecipient(e.currentTarget.value)
              }}
              placeholder="Input Receiver Address"
            />
          </div>
        )}
        <NoticeCard>
          <div className="icon-area">
            <NoticeIcon style={{ width: '24px', height: '24px' }} />
          </div>
          <div className="details-area">
            <NunitoText weight={700}>{WITHDRAW_INFO().header}</NunitoText>
            <span>
              {WITHDRAW_INFO().description}
            </span>
          </div>
        </NoticeCard>
        <CheckBoxWrapper>
          <Checkbox
            checked={checkAgreement}
            onClick={() => {
              setCheckAgreement(!checkAgreement)
            }}
          />{' '}
          I understand the withdraw delay
        </CheckBoxWrapper>

        {!isLoading ? (
          <OverridedBridgeButton
            onClick={onHandleWithdrawal}
            disabled={
              (inputAmount &&
                inputAmount.toString().length > 0 &&
                inputAmount <= depositTokenData.balance &&
                checkAgreement) ||
              !isChangedtoL2
                ? false
                : true
            }
          >
            <GloriaText size="xl">{isChangedtoL2 ? 'Withdraw' : 'Switch Network'}</GloriaText>
          </OverridedBridgeButton>
        ) : (
          <OverridedBridgeButton onClick={onHandleWithdrawal} disabled={true}>
            <CircularProgress style={{ color: '#a372ff' }} size={18} />
          </OverridedBridgeButton>
        )}

        {inputAmount && inputAmount > depositTokenData.balance ? (
          <InvalidTextWrapper style={{ marginTop: '10px' }}>Insufficient balance</InvalidTextWrapper>
        ) : null}
      </DepositOrWithdrawBody>
      {txList && txList.length > 0 && (
        <ListOfDepositStatus>
          <FixedHeight>
            <RowOfDepositStatus>
              {txList.map((l) => {
                return (
                  <>
                    <AssetLogo address={l.token_address} backupImg={l.logoURI} />
                    <div className="text">{l.amount} {l.symbol}</div>
                    <div className="grid-state">
                      <CallbackStatus
                        depositData={l} 
                        isBurn={true}
                        functionToCall={() => {}} 
                        itemForMint={undefined}                      />
                    </div>
                  </>
                )
              })}
            </RowOfDepositStatus>
          </FixedHeight>
        </ListOfDepositStatus>
      )}
    </WithdrawWrapper>
  )
}
