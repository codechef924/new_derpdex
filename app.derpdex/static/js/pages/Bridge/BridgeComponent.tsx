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
import { utils } from 'zksync-web3'

import { BRIDGE_INFO, useFetchTokenBridge } from './_supported_token_bridge'
import { DepositBridge } from './Deposit'
import { useGetERC20BalanceByChain } from './useGetNativeTokenByChain'
import { WithdrawBridge } from './Withdraw'

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

const L2_TO_L1_CHAIN: { [key: number]: number } = {
  [SupportedChainId.OPBNB_TESTNET]: SupportedChainId.BNB_TESTNET,
  [SupportedChainId.OPBNB_MAINNET]: SupportedChainId.BNB,
  [SupportedChainId.BNB_TESTNET]: SupportedChainId.BNB_TESTNET,
  [SupportedChainId.BNB]: SupportedChainId.BNB,
  [SupportedChainId.ZKSYNC_TESTNET]: SupportedChainId.GOERLI,
  [SupportedChainId.ZKSYNC_MAINNET]: SupportedChainId.MAINNET,
  [SupportedChainId.GOERLI]: SupportedChainId.GOERLI,
  [SupportedChainId.MAINNET]: SupportedChainId.MAINNET,
}

const L1_TO_L2_CHAIN: { [key: number]: number } = {
  [SupportedChainId.BNB_TESTNET]: SupportedChainId.OPBNB_TESTNET,
  [SupportedChainId.BNB]: SupportedChainId.OPBNB_MAINNET,
  [SupportedChainId.OPBNB_TESTNET]: SupportedChainId.OPBNB_TESTNET,
  [SupportedChainId.OPBNB_MAINNET]: SupportedChainId.OPBNB_MAINNET,
  [SupportedChainId.GOERLI]: SupportedChainId.ZKSYNC_TESTNET,
  [SupportedChainId.ZKSYNC_TESTNET]: SupportedChainId.ZKSYNC_TESTNET,
  [SupportedChainId.MAINNET]: SupportedChainId.ZKSYNC_MAINNET,
  [SupportedChainId.ZKSYNC_MAINNET]: SupportedChainId.ZKSYNC_MAINNET,
}

const ZKSYNC_INITIAL_TOKEN: BRIDGE_INFO = {
  name: 'ETH',
  symbol: 'ETH',
  decimals: 18,
  L1Address: utils.ETH_ADDRESS,
  L2Address: utils.ETH_ADDRESS,
  isNative: true,
}

const BNB_INITIAL_TOKEN: BRIDGE_INFO = {
  name: 'BNB',
  symbol: 'BNB',
  decimals: 18,
  L1Address: '0x4200000000000000000000000000000000000006',
  L2Address: '0x4200000000000000000000000000000000000006',
  isNative: true,
  logoURI:
    'https://raw.githubusercontent.com/derpdex-official/token-bridge/main/assets/0x4200000000000000000000000000000000000006.png',
}

const initalDataL1 = {
  details: getChainInfo(
    process.env.REACT_APP_IS_TESTSITE === 'false' ? SupportedChainId.MAINNET : SupportedChainId.GOERLI
  ),
  balance: 0,
}

const initalDataL2 = {
  details: getChainInfo(
    process.env.REACT_APP_IS_TESTSITE === 'false' ? SupportedChainId.ZKSYNC_MAINNET : SupportedChainId.ZKSYNC_TESTNET
  ),
  balance: 0,
}

export default function BridgeComponent() {
  const [currentTab, setCurrentTab] = useState<string>('Deposit')
  const { chainId, account, isActive } = useWeb3React()

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

  const {
    getBalanceByChain: getBalanceByChainTokenL1,
    balance: L1Balance,
    isLoading: isLoadingL1,
    isSuccess: isSuccessL1,
  } = useGetERC20BalanceByChain()
  const {
    getBalanceByChain: getBalanceByChainTokenL2,
    balance: L2Balance,
    isLoading: isLoadingL2,
    isSuccess: isSuccessL2,
  } = useGetERC20BalanceByChain()

  const depositerInit = useMemo(() => {
    return chainId ? getChainInfo(L2_TO_L1_CHAIN[chainId]) : depositer.details
  }, [chainId])

  const withdrawerInit = useMemo(() => {
    return chainId ? getChainInfo(L1_TO_L2_CHAIN[chainId]) : withdrawer.details
  }, [chainId])

  useEffect(() => {
    if (chainId) {
      const updateDepositer = { details: depositerInit, balance: L1Balance }
      setDepositer(updateDepositer)
    } else {
      setDepositer(initalDataL1)
    }
  }, [L1Balance, chainId, depositerInit])

  useEffect(() => {
    if (chainId) {
      const updateWithdrawer = { details: withdrawerInit, balance: L2Balance }
      setWithdrawer(updateWithdrawer)
    } else {
      setWithdrawer(initalDataL2)
    }
  }, [L2Balance, chainId, withdrawerInit])

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

  const [currentToken, setCurrentToken] = useState<BRIDGE_INFO>({
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
    L1Address: utils.ETH_ADDRESS,
    L2Address: utils.ETH_ADDRESS,
    isNative: true,
  })

  // const RESOLVE_CURRENT_TOKEN = useMemo(() => {
  //   if()
  // })

  useEffect(() => {
    if (tokenList && tokenList.length > 0) {
      const defaultL1Token = tokenList.find((target) => target.symbol === 'ETH' || target.symbol === 'BNB')
      if (defaultL1Token) setCurrentToken(defaultL1Token)
    }
  }, [tokenList, chainId])

  // const _Resolved_L2ChainId = useMemo(() => {
  //   if (chainId) {
  //     const currentChainId = L1_TO_L2_CHAIN[chainId]
  //     return chainId
  //   }
  // }, [])

  const batchGetBalance = useCallback(() => {
    if (account && currentToken && chainId) {
      getBalanceByChainTokenL1(
        L2_TO_L1_CHAIN[chainId],
        account,
        currentToken?.L1Address,
        currentToken.decimals,
        currentToken.isNative ? true : false
      )
      getBalanceByChainTokenL2(
        L1_TO_L2_CHAIN[chainId],
        account,
        currentToken?.L2Address,
        currentToken.decimals,
        currentToken.isNative ? true : false
      )
    }
  }, [account, currentToken, chainId])

  useEffect(() => {
    if (account && chainId && currentToken) {
      batchGetBalance()
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
              <Tab currentTab={currentTab} setCurrentTab={setCurrentTab} tabItem={['Deposit', 'Withdraw']} />
            </div>
            <BodyWrapper
              style={{
                marginTop: '27px',
              }}
            >
              {currentTab === 'Deposit' && (
                <DepositBridge
                  tokenList={tokenList}
                  currentToken={currentToken}
                  setCurrentToken={setCurrentToken}
                  onSwitch={() => setCurrentTab('Withdraw')}
                  depositTokenData={depositer}
                  withdrawTokenData={withdrawer}
                  batchGetBalance={batchGetBalance}
                />
              )}
              {currentTab === 'Withdraw' && (
                <WithdrawBridge
                  tokenList={tokenList}
                  currentToken={currentToken}
                  setCurrentToken={setCurrentToken}
                  onSwitch={() => setCurrentTab('Deposit')}
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
    if (chainId) {
      switch (chainId) {
        case SupportedChainId.ZKSYNC_MAINNET:
        case SupportedChainId.ZKSYNC_TESTNET:
        case SupportedChainId.MAINNET:
        case SupportedChainId.GOERLI:
          return 'zkSync Era Official Bridge'
        case SupportedChainId.OPBNB_MAINNET:
        case SupportedChainId.OPBNB_TESTNET:
        case SupportedChainId.BNB:
        case SupportedChainId.BNB_TESTNET:
          return 'opBNB Official Bridge'
        default:
          return null
      }
    } else {
      return null
    }
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
