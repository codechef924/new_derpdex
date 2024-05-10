import { Alert, Checkbox, CircularProgress, Snackbar } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import { ReactComponent as ArrowDownIcon } from 'assets/svg/arrow-down-icon.svg'
import { ReactComponent as NoticeIcon } from 'assets/svg/notice-icon.svg'
import { GloriaText } from 'components/CustomFonts/GloriaHallelujah'
import { NunitoText } from 'components/CustomFonts/Nunito'
import { SupportedChainId } from 'constants/chains'
import { RPC_URLS } from 'constants/networks'
import { isBNB, isOpBNB } from 'constants/tokens'
import { ethers } from 'ethers'
import { useIsMobile } from 'nft/hooks'
import { useEffect, useState } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import styled from 'styled-components'
import { ExplorerDataType, getExplorerLink } from 'utils/getExplorerLink'
import { Provider } from 'zksync-web3'

import { BRIDGE_INFO } from './_supported_token_bridge'
import { DEPOSIT, WITHDRAW } from './BridgeComponent'
import { useSupportedWithdrawCallback } from './hooks/withdraw'
import { InputToken } from './InputToken'
import {
  AlertBox,
  BalanceEstimate,
  BalanceMaxBox,
  BlurredBalance,
  DepoitOrWithdrawToAnotherWrapper,
  DepositOrWithdrawBody,
  EstimateFeeText,
  InvalidTextWrapper,
  ListOfClaimmableBody,
  MaxButton,
  OverridedBridgeButton,
  RowOfClaimmable,
  StyledInput,
} from './stylings'
import { Switcher } from './Switcher'
import { useNetworkChange } from './useNetworkChange'
import AssetLogo from './utils/AssetLogo'
import { ClaimCallback, ClaimOpBnB, State } from './utils/Claim'
import { API_ENDPOINT, useGetAllAvailableWithdrawal, useInsertWithdrawOnL2 } from './utils/useVarieties'

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

const WITHDRAW_INFO = (chainId: number | undefined) => {
  const DEFAULT = {
    header: 'Withdrawal may take up to 24 hours',
    description:
      'To ensure security in the first days of the protocol, there is a 24 hour delay on withdrawals from zkSync Era (L2) to Ethereum (L1). See our blog post for',
    link: 'https://era.zksync.io/docs/reference/troubleshooting/withdrawal-delay.html',
  }
  if (chainId) {
    switch (chainId) {
      case SupportedChainId.ZKSYNC_MAINNET:
      case SupportedChainId.ZKSYNC_TESTNET:
      case SupportedChainId.MAINNET:
      case SupportedChainId.GOERLI:
        return {
          header: 'Withdrawal may take up to 24 hours',
          description:
            'To ensure security in the first days of the protocol, there is a 24 hour delay on withdrawals from zkSync Era (L2) to Ethereum (L1). See our blog post for',
          link: 'https://era.zksync.io/docs/reference/troubleshooting/withdrawal-delay.html',
        }
      case SupportedChainId.BNB:
      case SupportedChainId.BNB_TESTNET:
      case SupportedChainId.OPBNB_MAINNET:
      case SupportedChainId.OPBNB_TESTNET:
        return {
          header: 'Withdrawal may take up to 7 days',
          description:
            'To ensure security in the Optimistic Rollup, two-step withdrawals introduce a requirement to prove all withdrawals on L1. See our blog post for',
          link: 'https://blog.oplabs.co/two-step-withdrawals/',
        }
      default:
        return DEFAULT
    }
  } else {
    return DEFAULT
  }
}

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
  const { changeNetwork, isChangedtoL2 } = useNetworkChange()
  const [inputAmount, setInputAmount] = useState<number | undefined>(undefined)
  const [expandOtherRecipient, setExpandOtherRecipient] = useState<boolean>(false)
  const [otherRecipient, setOtherRecipient] = useState<string | undefined>()
  const [checkAgreement, setCheckAgreement] = useState<boolean>(false)

  const { chainId, provider, connector, account } = useWeb3React()
  //! TODO TO AVOID CONFUSION MAYBE NAME IT TOKENL1 AND TOKENL2

  const [isWithdrawLoading, setIsWithdrawLoading] = useState<boolean>(false)
  const [isSuccessWithdraw, setSuccessWithdraw] = useState<boolean>(false)

  const [estimateFee, setEstimateFee] = useState<string>()

  const [isLoadingSimulateGasFee, setIsLoadingSimulateGasFee] = useState<boolean>(false)

  const [shouldReload, setShouldReload] = useState<boolean>(false)

  const isMobile = useIsMobile()

  const simulateGasFeeOnWithdraw = async () => {
    try {
      setIsLoadingSimulateGasFee(true)
      if (provider && account && chainId) {
        if (chainId === SupportedChainId.ZKSYNC_MAINNET || chainId === SupportedChainId.ZKSYNC_TESTNET) {
          const zksyncProvider = new Provider(
            RPC_URLS[chainId === 324 ? SupportedChainId.ZKSYNC_MAINNET : SupportedChainId.ZKSYNC_TESTNET][0]
          )

          const estimation = await zksyncProvider.estimateGasWithdraw({
            from: account,
            to: '0x000000000000000000000000000000000000800A',
            token: currentToken.L2Address,
            amount: ethers.utils.parseUnits(inputAmount ? inputAmount.toString() : '0', currentToken?.decimals),
          })

          console.log(`Withdraw Estimation ${ethers.utils.formatEther(estimation.mul(250000000))} ETH`)
          setEstimateFee(ethers.utils.formatEther(estimation.mul(250000000)))
          setIsLoadingSimulateGasFee(false)
        } else if (chainId === SupportedChainId.OPBNB_MAINNET || chainId === SupportedChainId.OPBNB_TESTNET) {
          const payload = {
            isTestnet: process.env.REACT_APP_IS_TESTSITE === 'true' ? true : false,
            inputAmount,
            token: {
              address: currentToken.L1Address,
              symbol: currentToken.symbol,
              decimals: currentToken.decimals,
            },
          }
          // API
          const result = await fetch(`${API_ENDPOINT}/estimate-withdraw`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          })
          if (result.ok) {
            const estimationResult = await result.json()
            const estimation = estimationResult.gas
            console.log(`Withdraw Estimation ${estimation} ETH`)
            setEstimateFee(estimation)
            setIsLoadingSimulateGasFee(false)
          } else {
            setIsLoadingSimulateGasFee(false)
            setEstimateFee('0')
          }
        } else {
          setIsLoadingSimulateGasFee(false)
        }
      }
    } catch (err) {
      setIsLoadingSimulateGasFee(false)
      console.log(err)
    }
  }

  useEffect(() => {
    simulateGasFeeOnWithdraw()
  }, [inputAmount, currentToken])

  const { withdrawCallback } = useSupportedWithdrawCallback({
    currentToken,
    inputAmount,
    otherRecipient,
    setIsWithdrawLoading,
    setSuccessWithdraw,
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
      await withdrawCallback()
    }
  }

  // For popup
  const addTransaction = useTransactionAdder()

  const { isLoadingInsertWithdrawOnL2, isSuccessInsertWithdrawOnL2, insertWithdrawOnL2 } = useInsertWithdrawOnL2()

  const { getAllAvailableWithdrawal, allAvailableWithdrawalLog, isSuccessGetAllAvailableWithdrawal } =
    useGetAllAvailableWithdrawal()

  const onClickMaxBalance = () => {
    setInputAmount(depositTokenData.balance)
  }

  useEffect(() => {
    if (account && chainId) {
      getAllAvailableWithdrawal(account, process.env.REACT_APP_IS_TESTSITE === 'true' ? true : false)
      setShouldReload(false)
    }
  }, [shouldReload])

  // Snackbar
  const [state, setState] = useState<State>({
    open: false,
    message: '',
    type: 'UNDEFINED',
    link: undefined,
  })
  const { open } = state
  const handleClose = () => {
    setState({ open: false, message: '', type: 'UNDEFINED', link: undefined })
  }

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
        <BalanceEstimate>
          <BlurredBalance>Balance: {withdrawTokenData.balance}</BlurredBalance>
          <EstimateFeeText>
            Estimated fee:{' '}
            {!isLoadingSimulateGasFee && (
              <>
                {estimateFee ?? '0'} {(chainId && isOpBNB(chainId)) || (chainId && isBNB(chainId)) ? 'BNB' : 'ETH'}
              </>
            )}
            &nbsp;
            {isLoadingSimulateGasFee && <CircularProgress style={{ color: '#a372ff' }} size={14} />}
          </EstimateFeeText>
        </BalanceEstimate>
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
            <NunitoText weight={700}>{WITHDRAW_INFO(chainId).header}</NunitoText>
            <span>
              {WITHDRAW_INFO(chainId).description}{' '}
              <a href={WITHDRAW_INFO(chainId).link} target="_blank" rel="noreferrer">
                more details
              </a>
              .
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

        {!isWithdrawLoading ? (
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
      {allAvailableWithdrawalLog && allAvailableWithdrawalLog.length > 0 && (
        <ListOfClaimmableBody>
          <RowOfClaimmable>
            {allAvailableWithdrawalLog.map((l) => {
              return (
                <>
                  <AssetLogo address={l.tokenAddress} backupImg={l.url} />
                  <div className="text">{l.symbol}</div>
                  <div className="grid-3 text">{l.amount}</div>
                  {l.chainId === SupportedChainId.ZKSYNC_MAINNET || l.chainId === SupportedChainId.ZKSYNC_TESTNET ? (
                    <div className="grid-4">
                      <ClaimCallback
                        transactionHash={l.transactionHash}
                        timestamp={l.timestamp}
                        setShouldReload={setShouldReload}
                      />
                    </div>
                  ) : (
                    <div className="grid-4">
                      <ClaimOpBnB
                        transactionHash={l.transactionHash}
                        timestamp={l.timestamp}
                        blockNumber={l.blockNumber}
                        setShouldReload={setShouldReload}
                        batchGetBalance={batchGetBalance}
                        getAllAvailableWithdrawal={getAllAvailableWithdrawal}
                        setState={setState}
                      />
                    </div>
                  )}
                </>
              )
            })}
          </RowOfClaimmable>
        </ListOfClaimmableBody>
      )}
      <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} open={open} onClose={handleClose}>
        <AlertBox>
          <Alert
            className={state.type === 'ERROR' ? 'is-error' : state.type === 'SUCCESS' ? 'is-success' : undefined}
            severity={state.type === 'ERROR' ? 'error' : state.type === 'SUCCESS' ? 'success' : undefined}
          >
            {state.message}&nbsp;
            {state.link && (
              <a
                href={chainId ? getExplorerLink(chainId, state.link, ExplorerDataType.TRANSACTION) : ''}
                target="_blank"
                rel="noreferrer"
                style={{
                  textDecoration: 'none',
                }}
              >
                View Transaction
              </a>
            )}
          </Alert>
        </AlertBox>
      </Snackbar>
    </WithdrawWrapper>
  )
}
