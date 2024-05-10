/* eslint-disable simple-import-sort/imports */
import { NonfungiblePositionManager } from '@derpdex/sdk'
import { BigNumber } from '@ethersproject/bignumber'
import type { TransactionResponse } from '@ethersproject/providers'
import { Trans } from '@lingui/macro'
import { CurrencyAmount, Percent } from '@uniswap/sdk-core'
import { useWeb3React } from '@web3-react/core'
import { sendEvent } from 'components/analytics'
import RangeBadge from 'components/Badge/RangeBadge'
import { ButtonConfirmed } from 'components/Button'
import { DDCardUniversal } from 'components/Card'
import { AutoColumn } from 'components/Column'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import FormattedCurrencyAmount from 'components/FormattedCurrencyAmount'
import Loader from 'components/Icons/LoadingSpinner'
import CurrencyLogo from 'components/Logo/CurrencyLogo'
import { AddRemoveTabs } from 'components/NavigationTabs'
import { AutoRow, RowBetween, RowFixed } from 'components/Row'
import Slider from 'components/Slider'
import Toggle from 'components/Toggle'
import { isSupportedChain } from 'constants/chains'
import { useV3NFTPositionManagerContract } from 'hooks/useContract'
import useDebouncedChangeHandler from 'hooks/useDebouncedChangeHandler'
import useTransactionDeadline from 'hooks/useTransactionDeadline'
import { useV3PositionFromTokenId } from 'hooks/useV3Positions'
import useNativeCurrency from 'lib/hooks/useNativeCurrency'
import { PositionPageUnsupportedContent } from 'pages/Pool/PositionPage'
import { useCallback, useMemo, useState } from 'react'
import { Navigate, useLocation, useParams } from 'react-router-dom'
import { Text } from 'rebass'
import { useBurnV3ActionHandlers, useBurnV3State, useDerivedV3BurnInfo } from 'state/burn/v3/hooks'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useUserSlippageToleranceWithDefault } from 'state/user/hooks'
import { useTheme } from 'styled-components/macro'
import { ThemedText } from 'theme'

import { WRAPPED_NATIVE_CURRENCY } from '../../constants/tokens'
import { TransactionType } from '../../state/transactions/types'
import { calculateGasMargin } from '../../utils/calculateGasMargin'
import { currencyId } from '../../utils/currencyId'
import { RangeCard, ResponsiveHeaderText, SmallMaxButton, TextAsGradient, Wrapper } from './styled'

import * as styles from './index.css'
import styled from 'styled-components'
import TransactionConfirmationModalLiquidity, {
  ConfirmationModalContentLiquidity,
  ModalType,
} from 'components/TransactionConfirmationModalLiqudity'
import DerpThink from 'assets/images/derp-think.png'
import { Box } from '@mui/material'
import { NunitoText } from 'components/CustomFonts/Nunito'

const RemoveLiqAutoColumn = styled(AutoColumn)`
  position: relative;
  width: 100%;

  .override-modal {
    padding: 0px !important;
  }

  @media only screen and (max-width: 768px) {
    padding-top: 3.9rem;
    margin-bottom: 6rem;
  }
`

const AbsoluteWrapper = styled.div`
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
  transform: translateY(38px);

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
const RemoveButton = styled(ButtonConfirmed)`
  border-radius: 8px;
  border: 2px solid #344d73;
  background: #ff5656;
  box-shadow: 3px 3px 0px 0px #000;

  min-width: 373px;

  @media only screen and (max-width: 768px) {
    min-width: 273px;
  }

  &:hover {
    background: #e34c4c;
  }

  &:disabled: {
    opacity: 100% !important;
    color: #000 !important;
  }
`

const TwoButtonRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  justify-items: center; /* Center horizontally */
  align-items: center; /* Center vertically */
  .btn {
    border: 1px solid #000;
    width: 100%;
    padding: 16px 0px;
    text-align: center;
    font-size: 24px;
    font-weight: 700;
    cursor: pointer;

    @media only screen and (max-width: 768px) {
      padding: 12px 0px;
    }
  }
  .btn-cancel {
  }
  .btn-confirm {
    background: ${({ theme }) => theme.derpGradientPrimary};
    border-bottom-right-radius: 0.75em;
    color: #fff;
  }
`

const RemoveTextInfo = styled.div`
  margin-top: 13px;
  font-size: 20px;
  font-weight: 300;

  .focused {
    font-weight: 600;
  }

  @media only screen and (max-width: 768px) {
    word-break: break-all;
    text-align: center;
  }
`

const ImgBox = styled.div`
  margin-left: 12px;

  @media only screen and (max-width: 768px) {
    img {
      width: 120px;
    }
  }
`

const DEFAULT_REMOVE_V3_LIQUIDITY_SLIPPAGE_TOLERANCE = new Percent(5, 100)

// eslint-disable-next-line import/no-unused-modules
export const ConfirmationAlertSVG = () => {
  return (
    <svg width="101" height="101" viewBox="0 0 101 101" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_411_404)">
        <path
          d="M98.9468 76.9253L60.6953 12.531C58.5859 8.78076 54.7771 6.5542 50.4999 6.5542C46.2228 6.5542 42.414 8.78076 40.3046 12.4722L2.00228 76.9841C-0.048692 80.6755 0.00990194 85.0114 2.11967 88.6442C4.22904 92.277 8.03725 94.445 12.1976 94.445H88.8103C92.9706 94.445 96.779 92.277 98.8882 88.6442C100.998 85.0112 101.056 80.6755 98.9468 76.9253Z"
          fill="#FF7B7B"
        />
        <path
          d="M98.8881 88.644C96.7787 92.2769 92.9705 94.4448 88.8102 94.4448H50.5V6.5542C54.7771 6.5542 58.5859 8.78076 60.6953 12.531L98.9469 76.9255C101.056 80.6755 100.998 85.0112 98.8881 88.644Z"
          fill="#FF5656"
        />
        <path d="M56.3594 68.0776H44.6406V79.7964H56.3594V68.0776Z" fill="white" />
        <path d="M56.3594 32.9214H44.6406V62.2183H56.3594V32.9214Z" fill="white" />
        <path d="M56.3594 32.9214H50.5V62.2183H56.3594V32.9214Z" fill="white" />
        <path d="M56.3594 68.0776H50.5V79.7964H56.3594V68.0776Z" fill="white" />
      </g>
      <defs>
        <clipPath id="clip0_411_404">
          <rect width="100" height="100" fill="white" transform="translate(0.5 0.5)" />
        </clipPath>
      </defs>
    </svg>
  )
}
// redirect invalid tokenIds
export default function RemoveLiquidityV3() {
  const { chainId } = useWeb3React()
  const { tokenId } = useParams<{ tokenId: string }>()
  const location = useLocation()
  const parsedTokenId = useMemo(() => {
    try {
      return BigNumber.from(tokenId)
    } catch {
      return null
    }
  }, [tokenId])

  if (parsedTokenId === null || parsedTokenId.eq(0)) {
    return <Navigate to={{ ...location, pathname: '/pools' }} replace />
  }

  if (isSupportedChain(chainId)) {
    return <Remove tokenId={parsedTokenId} />
  } else {
    return <PositionPageUnsupportedContent />
  }
}
function Remove({ tokenId }: { tokenId: BigNumber }) {
  const { position } = useV3PositionFromTokenId(tokenId)
  const theme = useTheme()
  const { account, chainId, provider } = useWeb3React()

  // flag for receiving WETH
  const [receiveWETH, setReceiveWETH] = useState(false)
  const nativeCurrency = useNativeCurrency(chainId)
  const nativeWrappedSymbol = nativeCurrency.wrapped.symbol

  // burn state
  const { percent } = useBurnV3State()
  const {
    position: positionSDK,
    liquidityPercentage,
    liquidityValue0,
    liquidityValue1,
    feeValue0,
    feeValue1,
    outOfRange,
    error,
  } = useDerivedV3BurnInfo(position, receiveWETH)

  //! Parse the position checking
  const isValidPositionToRemove = useMemo(() => {
    if (positionSDK) {
      return true
    } else {
      return false
    }
  }, [positionSDK])

  const { onPercentSelect } = useBurnV3ActionHandlers()

  const removed = position?.liquidity?.eq(0)

  // boilerplate for the slider
  const [percentForSlider, onPercentSelectForSlider] = useDebouncedChangeHandler(percent, onPercentSelect)

  const deadline = useTransactionDeadline() // custom from users settings
  const allowedSlippage = useUserSlippageToleranceWithDefault(DEFAULT_REMOVE_V3_LIQUIDITY_SLIPPAGE_TOLERANCE) // custom from users

  const [showConfirm, setShowConfirm] = useState(false)
  const [attemptingTxn, setAttemptingTxn] = useState(false)
  const [txnHash, setTxnHash] = useState<string | undefined>()
  const addTransaction = useTransactionAdder()
  const positionManager = useV3NFTPositionManagerContract()
  const burn = useCallback(async () => {
    setAttemptingTxn(true)
    if (
      !positionManager ||
      !liquidityValue0 ||
      !liquidityValue1 ||
      !deadline ||
      !account ||
      !chainId ||
      !positionSDK ||
      !liquidityPercentage ||
      !provider
    ) {
      return
    }

    // we fall back to expecting 0 fees in case the fetch fails, which is safe in the
    // vast majority of cases
    const { calldata, value } = NonfungiblePositionManager.removeCallParameters(positionSDK, {
      tokenId: tokenId.toString(),
      liquidityPercentage,
      slippageTolerance: allowedSlippage,
      deadline: deadline.toString(),
      collectOptions: {
        expectedCurrencyOwed0: feeValue0 ?? CurrencyAmount.fromRawAmount(liquidityValue0.currency, 0),
        expectedCurrencyOwed1: feeValue1 ?? CurrencyAmount.fromRawAmount(liquidityValue1.currency, 0),
        recipient: account,
      },
    })

    const txn = {
      to: positionManager.address,
      data: calldata,
      value,
    }

    provider
      .getSigner()
      .estimateGas(txn)
      .then((estimate) => {
        const newTxn = {
          ...txn,
          gasLimit: calculateGasMargin(estimate),
        }

        return provider
          .getSigner()
          .sendTransaction(newTxn)
          .then((response: TransactionResponse) => {
            sendEvent({
              category: 'Liquidity',
              action: 'RemoveV3',
              label: [liquidityValue0.currency.symbol, liquidityValue1.currency.symbol].join('/'),
            })
            setTxnHash(response.hash)
            setAttemptingTxn(false)
            addTransaction(response, {
              type: TransactionType.REMOVE_LIQUIDITY_V3,
              baseCurrencyId: currencyId(liquidityValue0.currency),
              quoteCurrencyId: currencyId(liquidityValue1.currency),
              expectedAmountBaseRaw: liquidityValue0.quotient.toString(),
              expectedAmountQuoteRaw: liquidityValue1.quotient.toString(),
            })
          })
      })
      .catch((error) => {
        setAttemptingTxn(false)
        console.error(error)
      })
  }, [
    positionManager,
    liquidityValue0,
    liquidityValue1,
    deadline,
    account,
    chainId,
    feeValue0,
    feeValue1,
    positionSDK,
    liquidityPercentage,
    provider,
    tokenId,
    allowedSlippage,
    addTransaction,
  ])

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)
    // if there was a tx hash, we want to clear the input
    if (txnHash) {
      onPercentSelectForSlider(0)
    }
    setAttemptingTxn(false)
    setTxnHash('')
  }, [onPercentSelectForSlider, txnHash])

  const pendingText = (
    <Trans>
      Removing {liquidityValue0?.toSignificant(6)} {liquidityValue0?.currency?.symbol} and{' '}
      {liquidityValue1?.toSignificant(6)} {liquidityValue1?.currency?.symbol}
    </Trans>
  )

  function modalHeader() {
    return (
      <div className={styles.ModalRemoveLiquidity}>
        <div className={styles.HeaderText}>Removal Confirmation</div>
        <div className={styles.ConfirmationAlert}>
          <div className={styles.ConfirmAlertText}>Confirm to remove the following on DerpDEX?</div>
          <RemoveTextInfo>
            Removing&nbsp;
            <span className="focused">
              {liquidityValue0 && <FormattedCurrencyAmount currencyAmount={liquidityValue0} />}
              &nbsp;
              {liquidityValue0?.currency?.symbol}
            </span>
            &nbsp;and&nbsp;
            <span className="focused">
              {liquidityValue1 && <FormattedCurrencyAmount currencyAmount={liquidityValue1} />}
              &nbsp;
              {liquidityValue1?.currency?.symbol}
            </span>
          </RemoveTextInfo>
        </div>
        <AutoColumn>
          {/* <DDButtonError className={styles.ButtonRemoveOverrides} error={true} mt="20px" onClick={burn}>
            <Trans>Remove</Trans>
          </DDButtonError> */}
          <Box mt="20px">
            <ImgBox>
              <img src={DerpThink} alt="derp-think" />
            </ImgBox>
            <TwoButtonRow>
              <div className="btn" onClick={handleDismissConfirmation}>
                Cancel
              </div>
              <div className="btn btn-confirm" onClick={burn}>
                Confirm
              </div>
            </TwoButtonRow>
          </Box>
        </AutoColumn>
      </div>
    )
  }

  const showCollectAsWeth = Boolean(
    liquidityValue0?.currency &&
      liquidityValue1?.currency &&
      (liquidityValue0.currency.isNative ||
        liquidityValue1.currency.isNative ||
        WRAPPED_NATIVE_CURRENCY[liquidityValue0.currency.chainId]?.equals(liquidityValue0.currency.wrapped) ||
        WRAPPED_NATIVE_CURRENCY[liquidityValue1.currency.chainId]?.equals(liquidityValue1.currency.wrapped))
  )

  return (
    <>
      {isValidPositionToRemove ? (
        <RemoveLiqAutoColumn>
          <TransactionConfirmationModalLiquidity
            isOpen={showConfirm}
            onDismiss={handleDismissConfirmation}
            attemptingTxn={attemptingTxn}
            hash={txnHash ?? ''}
            title="Removal Confirmation"
            modalType={ModalType.REMOVE_LIQUIDITY}
            reviewContent={() => (
              <ConfirmationModalContentLiquidity
                disableCloseButton={true}
                title={
                  <Trans>
                    <div></div>
                  </Trans>
                }
                onDismiss={handleDismissConfirmation}
                topContent={modalHeader}
              />
            )}
            pendingText={pendingText}
          />
          <AddRemoveTabs
            creating={false}
            adding={false}
            positionID={tokenId.toString()}
            autoSlippage={DEFAULT_REMOVE_V3_LIQUIDITY_SLIPPAGE_TOLERANCE}
          />
          <Wrapper>
            {position ? (
              <>
                <AutoColumn className="overridable" gap="lg">
                  <RangeCard>
                    <RowBetween>
                      <RowFixed>
                        <DoubleCurrencyLogo
                          currency0={feeValue0?.currency}
                          currency1={feeValue1?.currency}
                          size={20}
                          margin={true}
                        />
                        <ThemedText.DeprecatedLabel ml="10px" fontSize="20px">
                          <NunitoText>{`${feeValue0?.currency?.symbol}${' '}/${' '}${
                            feeValue1?.currency?.symbol
                          }`}</NunitoText>
                        </ThemedText.DeprecatedLabel>
                      </RowFixed>
                      <RangeBadge removed={removed} inRange={!outOfRange} />
                    </RowBetween>
                    <DDCardUniversal
                      style={{
                        background: 'white',
                        border: '1px solid transparent',
                        borderRadius: '8px',
                      }}
                    >
                      <AutoColumn gap="md">
                        <RowBetween>
                          <ResponsiveHeaderText
                            style={{
                              fontSize: '32px',
                              fontWeight: 700,
                            }}
                          >
                            <Trans>{percentForSlider}%</Trans>
                          </ResponsiveHeaderText>
                          <AutoRow gap="6px" justify="flex-end">
                            <SmallMaxButton onClick={() => onPercentSelect(25)} width="20%">
                              <Trans>25%</Trans>
                            </SmallMaxButton>
                            <SmallMaxButton onClick={() => onPercentSelect(50)} width="20%">
                              <Trans>50%</Trans>
                            </SmallMaxButton>
                            <SmallMaxButton onClick={() => onPercentSelect(75)} width="20%">
                              <Trans>75%</Trans>
                            </SmallMaxButton>
                            <TextAsGradient onClick={() => onPercentSelect(100)} width="20%">
                              <Trans>Max</Trans>
                            </TextAsGradient>
                          </AutoRow>
                        </RowBetween>
                        <Slider value={percentForSlider} onChange={onPercentSelectForSlider} />
                      </AutoColumn>
                    </DDCardUniversal>
                  </RangeCard>

                  {/* POOLED INFO */}
                  <RangeCard className="pooled-info" id="pooled-info">
                    <DDCardUniversal
                      style={{
                        background: 'white',
                        border: '1px solid transparent',
                        borderRadius: '8px',
                      }}
                    >
                      <AutoColumn>
                        <RowBetween>
                          <Text fontSize={16} fontWeight={600}>
                            <Trans>Pooled {liquidityValue0?.currency?.symbol}:</Trans>
                          </Text>
                          <RowFixed>
                            <Text fontSize={16} fontWeight={600} marginLeft="6px">
                              {liquidityValue0 && <FormattedCurrencyAmount currencyAmount={liquidityValue0} />}
                            </Text>
                            <CurrencyLogo
                              size="20px"
                              style={{ marginLeft: '8px' }}
                              currency={liquidityValue0?.currency}
                            />
                          </RowFixed>
                        </RowBetween>
                        <RowBetween
                          style={{
                            padding: '20px 0px 20px 0px',
                            borderBottom: '2px solid #000',
                          }}
                        >
                          <Text fontSize={16} fontWeight={600}>
                            <Trans>Pooled {liquidityValue1?.currency?.symbol}:</Trans>
                          </Text>
                          <RowFixed>
                            <Text fontSize={16} fontWeight={600} marginLeft="6px">
                              {liquidityValue1 && <FormattedCurrencyAmount currencyAmount={liquidityValue1} />}
                            </Text>
                            <CurrencyLogo
                              size="20px"
                              style={{ marginLeft: '8px' }}
                              currency={liquidityValue1?.currency}
                            />
                          </RowFixed>
                        </RowBetween>
                        {feeValue0?.greaterThan(0) || feeValue1?.greaterThan(0) ? (
                          <>
                            <RowBetween
                              style={{
                                padding: '20px 0px 0px 0px',
                              }}
                            >
                              <Text fontSize={16} fontWeight={600}>
                                <Trans>{feeValue0?.currency?.symbol} Fees Earned:</Trans>
                              </Text>
                              <RowFixed>
                                <Text fontSize={16} fontWeight={600} marginLeft="6px">
                                  {feeValue0 && <FormattedCurrencyAmount currencyAmount={feeValue0} />}
                                </Text>
                                <CurrencyLogo
                                  size="20px"
                                  style={{ marginLeft: '8px' }}
                                  currency={feeValue0?.currency}
                                />
                              </RowFixed>
                            </RowBetween>
                            <RowBetween
                              style={{
                                padding: '20px 0px 0px 0px',
                              }}
                            >
                              <Text fontSize={16} fontWeight={600}>
                                <Trans>{feeValue1?.currency?.symbol} Fees Earned:</Trans>
                              </Text>
                              <RowFixed>
                                <Text fontSize={16} fontWeight={600} marginLeft="6px">
                                  {feeValue1 && <FormattedCurrencyAmount currencyAmount={feeValue1} />}
                                </Text>
                                <CurrencyLogo
                                  size="20px"
                                  style={{ marginLeft: '8px' }}
                                  currency={feeValue1?.currency}
                                />
                              </RowFixed>
                            </RowBetween>
                          </>
                        ) : null}
                        {showCollectAsWeth && (
                          <RowBetween
                            style={{
                              padding: '20px 0px 0px 0px',
                            }}
                          >
                            <ThemedText.DeprecatedMain>
                              <Trans>Collect as {nativeWrappedSymbol}</Trans>
                            </ThemedText.DeprecatedMain>
                            <Toggle
                              id="receive-as-weth"
                              isActive={receiveWETH}
                              toggle={() => setReceiveWETH((receiveWETH) => !receiveWETH)}
                            />
                          </RowBetween>
                        )}
                      </AutoColumn>
                    </DDCardUniversal>
                  </RangeCard>

                  <AbsoluteWrapper>
                    <div style={{ display: 'flex' }}>
                      <AutoColumn gap="md" style={{ flex: '1' }}>
                        <RemoveButton
                          confirmed={false}
                          disabled={removed || percent === 0 || !liquidityValue0}
                          onClick={() => setShowConfirm(true)}
                        >
                          {removed ? <Trans>Closed</Trans> : error ?? <Trans>Remove</Trans>}
                        </RemoveButton>
                      </AutoColumn>
                    </div>
                  </AbsoluteWrapper>
                </AutoColumn>
              </>
            ) : (
              <Loader />
            )}
          </Wrapper>
        </RemoveLiqAutoColumn>
      ) : (
        <PositionPageUnsupportedContent />
      )}
    </>
  )
}
