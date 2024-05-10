import '@fontsource/nunito' // Defaults to weight 400

import { Trans } from '@lingui/macro'
import { Currency, CurrencyAmount } from '@uniswap/sdk-core'
import { useWeb3React } from '@web3-react/core'
import { useToggleAccountDrawer } from 'components/AccountDrawer'
import { DDButtonLight } from 'components/Button'
import ZapToEarnCurrencyInputPanel from 'components/CurrencyInputPanel/ZapToEarnCurrencyInputPanel'
import { GloriaText } from 'components/CustomFonts/GloriaHallelujah'
import { NunitoText } from 'components/CustomFonts/Nunito'
import TransactionConfirmationModalLiquidity, {
  ConfirmationModalContentLiquidity,
  ModalType,
} from 'components/TransactionConfirmationModalLiqudity'
import { getSwapCurrencyId } from 'constants/tokens'
import { useCurrency } from 'hooks/Tokens'
import usePrevious from 'hooks/usePrevious'
import tryParseCurrencyAmountSwap from 'lib/utils/tryParseCurrencyAmountSwap'
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { ArrowUpRight } from 'react-feather'
import { Field, replaceZapToEarnState, useZapToEarnActionHandlers } from 'state/zap2earn/action'
import { initialZapToEarnState, zapToEarnReducer, ZapToEarnState } from 'state/zap2earn/reducer'
import { maxAmountSpend } from 'utils/maxAmountSpend'

import { LockLpSwitcher } from './components/LockLpSwitcher'
import { ProjectedEarnings } from './components/ProjectedEarnings'
import { ZapConfirmationModal } from './components/TransactionModal/ZapConfirmation'
import ZapToEarnLpPairPanel from './components/ZapToEarnLpPairPanel'
import { _SUPPORTED_INPUT_TOKEN_TO_ZAP, SUPPORTED_CHAIN_FOR_ZAP_TO_EARN } from './constants/general'
import { InterfaceZapToEarnSectionName } from './constants/interfaces'
import * as styles from './css-override.css'
import { useGetInputBalance, useZapCurrencies } from './hooks/useDerivedZ2E'
import { useEstimatePoolValuation } from './hooks/useEstimatePoolValuation'
import { ISwapParams, IZapState, useZapToEarn, ZapToEarnStateTransition } from './hooks/useZapToEarn'
import { Reason, useZapToEarnAllowance } from './hooks/useZapToEarnAllowance'
import { useDerivedParsedPool, useZapToEarnPool } from './hooks/ZapToEarnPools.jotai'
import {
  ColumnFixed,
  InfoLink,
  RowEnd,
  SpaceBetweenHeader,
  TextTitleWrapper,
  ZapInputOutputColumn,
  ZapToEarnContainer,
  ZapToEarnWrapper,
} from './stylings'
import { returnMsg } from './utils/return-message'

interface IZAPSTEPPER {
  shouldIZap: boolean
  label: string
}

export const ZapToEarn = ({
  prefilledState = {},
  onCurrencyChange,
  hideLockLPT,
}: {
  prefilledState?: Partial<ZapToEarnState>
  onCurrencyChange?: (selected: Pick<ZapToEarnState, Field.INPUT | Field.OUTPUT>) => void
  hideLockLPT: boolean
}) => {
  const { account, chainId } = useWeb3React()
  // toggle wallet when disconnected
  const toggleWalletDrawer = useToggleAccountDrawer()

  //! SELECT TOKEN HANDLER
  const [state, dispatch] = useReducer(zapToEarnReducer, { ...initialZapToEarnState, ...prefilledState })
  const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRecipient } = useZapToEarnActionHandlers(dispatch)

  const previousConnectedChainId = usePrevious(chainId)
  const previousPrefilledState = usePrevious(prefilledState)

  useEffect(() => {
    const combinedInitialState = { ...initialZapToEarnState, ...prefilledState }
    const chainChanged = previousConnectedChainId && previousConnectedChainId !== chainId

    const prefilledInputChanged =
      previousPrefilledState &&
      previousPrefilledState?.[Field.INPUT]?.currencyId !== prefilledState?.[Field.INPUT]?.currencyId

    if (chainChanged || prefilledInputChanged) {
      dispatch(
        replaceZapToEarnState({
          ...initialZapToEarnState,
          ...prefilledState,
          field: combinedInitialState.independentField ?? Field.INPUT,
          inputCurrencyId: combinedInitialState.INPUT.currencyId ?? undefined,
          outputCurrencyId: undefined,
        })
      )
    }
  }, [chainId])

  const mockCurrencies = useZapCurrencies(state)

  const currencyBalance = useGetInputBalance({
    inputCurrency: mockCurrencies.INPUT,
  })

  const maxInputAmount: CurrencyAmount<Currency> | undefined = useMemo(
    () => maxAmountSpend(currencyBalance),
    [currencyBalance]
  )
  const { typedValue, independentField } = state
  const formattedAmounts = useMemo(
    () => ({
      [independentField]: typedValue,
    }),
    [independentField, typedValue]
  )

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value)
    },
    [onUserInput]
  )

  const handleMaxInput = useCallback(() => {
    maxInputAmount && onUserInput(Field.INPUT, maxInputAmount.toExact())
  }, [maxInputAmount, onUserInput])

  const handleResetAmount = useCallback(() => {
    onUserInput(Field.INPUT, '')
  }, [onUserInput])

  const handleInputSelect = useCallback(
    (inputCurrency: Currency) => {
      onCurrencySelection(Field.INPUT, inputCurrency)
      onCurrencyChange?.({
        [Field.INPUT]: {
          currencyId: getSwapCurrencyId(inputCurrency),
        },
        [Field.OUTPUT]: state[Field.OUTPUT],
      })
      onUserInput(Field.INPUT, '')
    },
    [onCurrencyChange, onCurrencySelection, onUserInput, state]
  )

  const inputCurrency = useCurrency(state.INPUT.currencyId)
  //! END OF SELECT TOKEN HANDLER

  //! ALLOWANCE HANDLER
  const { allowanceState, approveCallback, isSuccessApprove, isLoadingApprove } = useZapToEarnAllowance({
    inputCurrency,
    amountToZap: formattedAmounts[Field.INPUT],
  })
  //! END OFALLOWANCE HANDLER

  //! POOLS FUNCTIONS
  const { setPool, currentPool } = useZapToEarnPool() // REDUX STATE FROM JOTAI

  const poolToken0 = useCurrency(currentPool.token0?.address, chainId)
  const poolToken1 = useCurrency(currentPool.token1?.address, chainId)

  const prevPoolRef = useRef(currentPool)
  // REFER BATCH_POOL_ADDRESS
  const parsedCurrentPool = useDerivedParsedPool(currentPool)

  useEffect(() => {
    // Compare currentPool with the previous state
    if (currentPool !== prevPoolRef.current) {
      handleResetAmount()
    }
  }, [currentPool])

  const contructedZapState: IZapState | null = useMemo(() => {
    const swapParams: ISwapParams[] = []
    if (!currentPool || !currentPool.feeTier) return null

    if (currentPool.token0?.address.toLowerCase() != inputCurrency?.wrapped.address.toLowerCase()) {
      swapParams.push({
        target: currentPool.token0?.address.toLowerCase(),
        fee: currentPool.feeTier,
        amountOutMinimum: '0',
      })
    }

    if (currentPool.token1?.address.toLowerCase() != inputCurrency?.wrapped.address.toLowerCase()) {
      swapParams.push({
        target: currentPool.token1?.address.toLowerCase(),
        fee: currentPool.feeTier,
        amountOutMinimum: '0',
      })
    }

    let tick = {
      tickLower: '',
      tickUpper: '',
    }
    switch (currentPool.feeTier) {
      case '100':
        tick = {
          tickLower: '-887272',
          tickUpper: '887272',
        }
        break
      case '500':
        tick = {
          tickLower: '-887270',
          tickUpper: '887270',
        }
        break
      case '3000':
        tick = {
          tickLower: '-887220',
          tickUpper: '887220',
        }
        break
      case '10000':
        tick = {
          tickLower: '-887200',
          tickUpper: '887200',
        }
        break
    }

    return {
      swapParams,
      liquidityParams: {
        token0: currentPool.token0?.address || '',
        token1: currentPool.token1?.address || '',
        fee: currentPool.feeTier || '',
        tickLower: tick.tickLower,
        tickUpper: tick.tickUpper,
      },
      source: inputCurrency?.wrapped.address || '',
      amount0: formattedAmounts[Field.INPUT],
    }
  }, [
    currentPool.feeTier,
    currentPool.token0?.address,
    currentPool.token1?.address,
    formattedAmounts,
    inputCurrency?.wrapped.address,
  ])

  const parsedAmount = useMemo(
    () => tryParseCurrencyAmountSwap(typedValue, inputCurrency ?? undefined),
    [inputCurrency, typedValue]
  )

  const enoughBalance = useMemo(() => {
    if (!parsedAmount) return false
    if (currencyBalance && parsedAmount && currencyBalance.lessThan(parsedAmount)) {
      return false
    } else {
      return true
    }
  }, [currencyBalance, parsedAmount])

  const {
    callback: initiateCallback,
    zapToEarnResult,
    setZapToEarnResult,
    txhash,
    attemptingTxn,
    possibleErrorMsg,
  } = useZapToEarn({
    zapState: contructedZapState,

    currentPool,
    source: inputCurrency,
  })

  // Reset after successful zap
  useEffect(() => {
    if (zapToEarnResult === ZapToEarnStateTransition.SUCCESS) {
      handleResetAmount()
    }
  }, [zapToEarnResult])

  const tokenToZap = useCurrency(mockCurrencies.INPUT?.wrapped.address)
  const finalizedValuation = useEstimatePoolValuation({
    amount: formattedAmounts[Field.INPUT],
    tokenToZap,
    token0: poolToken0,
    token1: poolToken1,
  })
  //! END OF POOL FUNCTIONS

  //! BUTTON HANDLER
  const onHandleZapToEarn = useCallback(() => {
    if (!allowanceState.isApproved) {
      approveCallback()
    } else {
      setShowConfirm(true)
      // initiateCallback()
    }
  }, [allowanceState.isApproved, approveCallback])

  const hasLoading = useMemo(() => {
    // Disable if anything is loading
    return isLoadingApprove || zapToEarnResult === ZapToEarnStateTransition.LOADING ? false : true
  }, [isLoadingApprove, zapToEarnResult])

  const isSupportedTokenToZap = useMemo(() => {
    if (chainId && inputCurrency && SUPPORTED_CHAIN_FOR_ZAP_TO_EARN.includes(chainId)) {
      return _SUPPORTED_INPUT_TOKEN_TO_ZAP[chainId].includes(inputCurrency.wrapped.address.toLowerCase()) ||
        inputCurrency.isNative
        ? true
        : false
    } else {
      return false
    }
  }, [inputCurrency, chainId])

  const shouldZap: IZAPSTEPPER = useMemo(() => {
    // Pre-Condition
    const preCondition = allowanceState
    // Has Input Amount
    const step1 = Boolean(typedValue && Number(typedValue) > 0)
    // Is Enough for balance
    const step2 = Boolean(enoughBalance)

    return {
      shouldIZap:
        Boolean((!preCondition.isApproved && preCondition.Reason !== Reason.ACCEPTED) || (step1 && step2)) &&
        Boolean(hasLoading) &&
        Boolean(isSupportedTokenToZap),
      label: returnMsg(isSupportedTokenToZap, preCondition, step1, step2, inputCurrency?.symbol),
    }
  }, [
    isSupportedTokenToZap,
    allowanceState,
    currencyBalance,
    inputCurrency?.symbol,
    typedValue,
    hasLoading,
    enoughBalance,
  ])
  //! END OF BUTTON HANDLER

  //! MODAL HANDLER
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const handleConfirmDismiss = useCallback(() => {
    setShowConfirm(!!showConfirm)

    setZapToEarnResult(ZapToEarnStateTransition.UNATTEMPTED)
  }, [])

  return (
    <ZapToEarnWrapper>
      <TextTitleWrapper>
        <GloriaText className="title">Zap to Earn</GloriaText>
        <NunitoText className="description">
          Easily deposit tokens, earn lucrative APR, and get a chance at DERP & xDERP airdrops!
        </NunitoText>
      </TextTitleWrapper>
      <ZapToEarnContainer>
        <SpaceBetweenHeader>
          <NunitoText className="header-text">Select Token</NunitoText>
          <a
            style={{ textDecoration: 'none' }}
            target="_blank"
            href="https://derpdex.gitbook.io/home/products/zap-to-earn"
            rel="noreferrer"
          >
            <InfoLink>
              Info<ArrowUpRight style={{ verticalAlign: 'sub' }} size={20} strokeWidth={1.8}></ArrowUpRight>
            </InfoLink>
          </a>
        </SpaceBetweenHeader>
        <ColumnFixed>
          <ZapInputOutputColumn>
            <ZapToEarnCurrencyInputPanel
              label={<Trans>From token</Trans>}
              disabled={false}
              value={formattedAmounts[Field.INPUT]}
              showMaxButton={true}
              currency={mockCurrencies.INPUT}
              onUserInput={handleTypeInput}
              id={InterfaceZapToEarnSectionName.CURRENCY_INPUT_PANEL}
              onMax={handleMaxInput}
              onCurrencySelect={handleInputSelect}
            />
            <ZapToEarnLpPairPanel
              label={<Trans>To LP</Trans>}
              disabled={false}
              value={finalizedValuation}
              pool={parsedCurrentPool}
              // currency={mockCurrencies.INPUT}
              showMaxButton={false}
              onUserInput={handleTypeInput}
              id={InterfaceZapToEarnSectionName.CURRENCY_INPUT_PANEL}
              onMax={handleMaxInput}
              // onPoolSelect={handlePoolSelect}
            />
          </ZapInputOutputColumn>
          {!hideLockLPT && (
            <RowEnd>
              <LockLpSwitcher showHelper={true} />
            </RowEnd>
          )}
          <ProjectedEarnings selectedPoolAddress={parsedCurrentPool.address} poolValuationInUSD={finalizedValuation} />
          {!account ? (
            <DDButtonLight className={styles.ZapButtonOverride} onClick={toggleWalletDrawer}>
              <GloriaText>
                <Trans>Connect Wallet</Trans>
              </GloriaText>
            </DDButtonLight>
          ) : (
            <>
              {shouldZap && (
                <DDButtonLight
                  disabled={!shouldZap.shouldIZap}
                  onClick={onHandleZapToEarn}
                  className={styles.ZapButtonOverride}
                >
                  <GloriaText>{shouldZap.label}</GloriaText>
                </DDButtonLight>
              )}
            </>
          )}
        </ColumnFixed>
      </ZapToEarnContainer>
      {/* {showConfirm && (
        <ZapConfirmationModal
          zapDetails={{
            inputSymbol: mockCurrencies.INPUT?.symbol,
            lpPair: [poolToken0?.symbol, poolToken1?.symbol],
            amountToZap: formattedAmounts[Field.INPUT].toString(),
          }}
          zapToEarnResult={zapToEarnResult}
          initiateCallback={initiateCallback}
          onDismiss={handleConfirmDismiss}
        />
      )} */}
      <TransactionConfirmationModalLiquidity
        modalType={ModalType.INCREASE_LIQUIDITY}
        isOpen={showConfirm}
        onDismiss={handleConfirmDismiss}
        reviewContent={() => (
          <ConfirmationModalContentLiquidity
            disableCloseButton={true}
            onDismiss={handleConfirmDismiss}
            topContent={() => (
              <ZapConfirmationModal
                zapDetails={{
                  inputSymbol: mockCurrencies.INPUT?.symbol,
                  lpPair: [poolToken0?.symbol, poolToken1?.symbol],
                  amountToZap: formattedAmounts[Field.INPUT].toString(),
                }}
                zapToEarnResult={zapToEarnResult}
                initiateCallback={initiateCallback}
                onDismiss={handleConfirmDismiss}
                possibleErrorMsg={possibleErrorMsg}
              />
            )}
          />
        )}
        attemptingTxn={attemptingTxn}
        hash={txhash}
        pendingText={`Zapping ${inputCurrency?.symbol}`}
      ></TransactionConfirmationModalLiquidity>
    </ZapToEarnWrapper>
  )
}
