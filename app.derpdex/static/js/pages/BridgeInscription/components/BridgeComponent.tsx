/* eslint-disable prefer-const */
import { Tooltip } from '@mui/material'
import { Currency } from '@uniswap/sdk-core'
import { useWeb3React } from '@web3-react/core'
import DerpThumbsUpImg from 'assets/images/derp-thumbs-up.png'
import DerpWowImg from 'assets/images/derp-wow.png'
import { ConnectWallet } from 'components/ConnectWallet'
import { PageWrapper } from 'components/swap/styleds'
import { Tab } from 'components/Tab'
import { getChainInfo, L1ChainInfo, L2ChainInfo } from 'constants/chainInfo'
import { SupportedChainId } from 'constants/chains'
import { useCallback, useEffect, useMemo, useState } from 'react'
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import styled from 'styled-components'

import { BRIDGE_INFO, SAMPLE_INSCRIPTIONS, useFetchTokenBridge } from '../_supported_token_bridge'
import { DepositBridge } from './Deposit'
import { useGetERC20BalanceByChain } from './useGetNativeTokenByChain'
import { WithdrawBridge } from './Withdraw'
import { useGetDepositDetails, useGetWithdrawalDetails } from '../hooks/useGetDetails'

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const BridgePageWrapper = styled(PageWrapper)`
  padding: 52px 2% 108px 2%;
  max-width: 568px;
`
export interface DEPOSIT {
  currencyDetails?: Currency
  details: L1ChainInfo | L2ChainInfo | undefined
  balance: number
}

export interface WITHDRAW {
  details: L1ChainInfo | L2ChainInfo | undefined
  balance: number
}

const initalDataL1 = {
  details: getChainInfo(
    process.env.REACT_APP_IS_TESTSITE === 'false' ? SupportedChainId.MAINNET : SupportedChainId.GOERLI
  ),
  balance: 0,
}

const initalDataL2 = {
  details: getChainInfo(
    process.env.REACT_APP_IS_TESTSITE === 'false' ? SupportedChainId.OPBNB_MAINNET : SupportedChainId.OPBNB_TESTNET
  ),
  balance: 0,
}

export default function BridgeComponent() {
  const [currentTab, setCurrentTab] = useState<string>('Wrap')
  const { chainId, account, isActive, provider } = useWeb3React()

  const [depositer, setDepositer] = useState<DEPOSIT>({
    details: getChainInfo(
      process.env.REACT_APP_IS_TESTSITE === 'false' ? SupportedChainId.MAINNET : SupportedChainId.GOERLI
    ), //! Attention to change for mainnet
    balance: 0,
  })
  const [withdrawer, setWithdrawer] = useState<WITHDRAW>({
    details: getChainInfo(
      process.env.REACT_APP_IS_TESTSITE === 'false' ? SupportedChainId.ZKSYNC_MAINNET : SupportedChainId.ZKSYNC_TESTNET
    ), //! Attention to change for mainnet
    balance: 0,
  })

  // TODO: [Inscriptions] Get Balance of Inscriptions
  const {
    getDepositDetails,
    details, 
    isLoading: isLoadingDeposit,
    isSuccess: isSuccessDeposit,
  } = useGetDepositDetails()

  const {
    getWithdrawalDetails,
    balance,
    isLoading: isLoadingWithdraw,
    isSuccess: isSuccessWithdraw,
  } = useGetWithdrawalDetails()

  const depositerInit = useMemo(() => {
    return chainId ? getChainInfo(chainId) : depositer.details
  }, [chainId])

  const withdrawerInit = useMemo(() => {
    return chainId ? getChainInfo(chainId) : withdrawer.details
  }, [chainId])

  useEffect(() => {
    if (chainId) {
      const updateDepositer = { details: depositerInit, balance: details.balance }
      setDepositer(updateDepositer)
    } else {
      setDepositer(initalDataL1)
    }
  }, [details.balance, chainId, depositerInit])

  useEffect(() => {
    if (chainId) {
      const updateWithdrawer = { details: withdrawerInit, balance: balance }
      setWithdrawer(updateWithdrawer)
    } else {
      setWithdrawer(initalDataL2)
    }
  }, [balance, chainId, withdrawerInit])

  const [tokenList, setTokenList] = useState<BRIDGE_INFO[]>([])

  const { isLoadingAsset, tokenToBridge, fetchTokenBridge } = useFetchTokenBridge()
  useEffect(() => {
    if (chainId) {
      fetchTokenBridge()
    }
  }, [chainId])

  useEffect(() => {
    if (!isLoadingAsset && tokenToBridge && tokenToBridge?.length > 0) {
      setTokenList(tokenToBridge)
    }
  }, [isLoadingAsset, tokenToBridge])

  const [currentToken, setCurrentToken] = useState<BRIDGE_INFO>(SAMPLE_INSCRIPTIONS[0])

  useEffect(() => {
    if (tokenList && tokenList.length > 0) {
      const defaultL1Token = tokenList.find((target) => target.symbol === 'ETH' || target.symbol === 'BNB')
      if (defaultL1Token) setCurrentToken(defaultL1Token)
    }
  }, [tokenList, chainId])

  // TODO: [Inscriptions] Get Balance of Inscriptions
  const batchGetDetails = useCallback(() => {
    if (account && currentToken && chainId) {
      getDepositDetails(account, chainId)
    }
  }, [account, currentToken, chainId])

  const batchGetBalance = useCallback(() => {
    if (account && currentToken && chainId) {
      getWithdrawalDetails(account, currentToken.symbol, chainId, provider)
    }
  }, [account, currentToken, chainId])

  useEffect(() => {
    if (account && chainId && currentToken) {
      if (currentTab === 'Wrap') {
        batchGetDetails()
      } else {
        batchGetBalance()
      }
    }
  }, [account, currentToken, chainId, currentTab])

  return (
    <>
      <div>
        {!account && <ConnectWallet />}
        {account && (
          <>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Tab currentTab={currentTab} setCurrentTab={setCurrentTab} tabItem={['Wrap', 'Unwarp']} />
            </div>
            <BodyWrapper
              style={{
                marginTop: '27px',
              }}
            >
              {currentTab === 'Wrap' && (
                <DepositBridge
                  tokenList={tokenList}
                  currentToken={currentToken}
                  setCurrentToken={setCurrentToken}
                  onSwitch={() => setCurrentTab('Unwarp')}
                  depositTokenData={depositer}
                  withdrawTokenData={withdrawer}
                  batchGetBalance={batchGetDetails}
                  txList={details.txList}
                />
              )}
              {currentTab === 'Unwarp' && (
                <WithdrawBridge
                  tokenList={tokenList}
                  currentToken={currentToken}
                  setCurrentToken={setCurrentToken}
                  onSwitch={() => setCurrentTab('Wrap')}
                  depositTokenData={withdrawer}
                  withdrawTokenData={depositer}
                  batchGetBalance={batchGetBalance}
                />
              )}
            </BodyWrapper>
          </>
        )}
      </div>
      <div
        style={{
          marginTop: '24px',
        }}
      >
        <PowerByZKSYNC />
      </div>
    </>
  )
}

const StyledWrapper = styled.div`
  // padding: 8px 1rem;
  border-radius: 16px;
  border: 4px solid #000;
  background: #fff;
  box-shadow: 3px 3px 0px 0px #000;
  height: 55px;

  .content-flex {
    display: flex;
    flex-direction: row;
    height: 100%;
    justify-content: space-evenly;

    .powered-text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      // margin-left: 0.5rem;
      font-weight: 600;
      color: black;
      text-align: center;

      @media (max-width: 768px) {
        font-size: 0.8rem;
      }
    }
    .img-flex {
      display: flex;
      flex-direction: column;
      justify-content: end;
      // margin-left: 0.5rem;
      .img-1 {
        width: 65px;
      }
      .img-2 {
        width: 60px;
      }
    }
  }
`

const PowerByZKSYNC = () => {
  const { chainId } = useWeb3React()

  const updateText = useMemo(() => {
    return 'DerpDEX'
  }, [chainId])
  return (
    <StyledWrapper>
      <div className="content-flex">
        <div className="img-flex">
          <img className="img-1" src={DerpWowImg} />
        </div>
        <div className="powered-text">
          <Tooltip
            title={`DerpDEX is a standalone platform that utilizes the ${updateText} for seamless token transfers.`}
          >
            <span>Powered by {updateText}</span>
          </Tooltip>
        </div>
        <div className="img-flex">
          <img className="img-2" src={DerpThumbsUpImg} />
        </div>
      </div>
    </StyledWrapper>
  )
}
