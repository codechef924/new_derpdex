/* eslint-disable import/no-unused-modules */
import { UNIVERSAL_ROUTER_ADDRESS } from '@derpdex/universal-router-sdk'
import { Trans } from '@lingui/macro'
import { CircularProgress } from '@mui/material'
import { sendAnalyticsEvent, Trace, TraceEvent, useTrace } from '@uniswap/analytics'
import {
  BrowserEvent,
  InterfaceElementName,
  InterfaceEventName,
  InterfacePageName,
  InterfaceSectionName,
  SharedEventName,
  SwapEventName,
} from '@uniswap/analytics-events'
import { Currency, CurrencyAmount, Percent, Token } from '@uniswap/sdk-core'
import { useWeb3React } from '@web3-react/core'
import SwapDerpHeader from 'assets/images/SwapDerpHeader.png'
import { useToggleAccountDrawer } from 'components/AccountDrawer'
import { sendEvent } from 'components/analytics'
import SwapCurrencyInputPanelV2 from 'components/CurrencyInputPanel/SwapCurrencyInputPanelV2'
import { GloriaText } from 'components/CustomFonts/GloriaHallelujah'
import { NetworkAlert } from 'components/NetworkAlert/NetworkAlert'
import PriceImpactWarning from 'components/swap/PriceImpactWarning'
import SwapDetailsDropdown from 'components/swap/SwapDetailsDropdown'
import TokenSafetyModal from 'components/TokenSafety/TokenSafetyModal'
import { getChainInfo } from 'constants/chainInfo'
import { isSupportedChain, SupportedChainId } from 'constants/chains'
import { ethers } from 'ethers'
import useENSAddress from 'hooks/useENSAddress'
import { useMaxAmountIn } from 'hooks/useMaxAmountIn'
import usePermit2Allowance, { AllowanceState } from 'hooks/usePermit2Allowance'
import usePrevious from 'hooks/usePrevious'
import { useSwapCallback } from 'hooks/useSwapCallback'
import { useUSDPrice } from 'hooks/useUSDPrice'
import JSBI from 'jsbi'
import { formatSwapQuoteReceivedEventProperties } from 'lib/utils/analytics'
import { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import { ReactNode } from 'react'
import { ArrowDown } from 'react-feather'
import { useNavigate } from 'react-router-dom'
import { Text } from 'rebass'
import { InterfaceTrade } from 'state/routing/types'
import { TradeState } from 'state/routing/types'
import styled, { useTheme } from 'styled-components/macro'
import { sendEventToGalxe } from 'tracing'
import { currencyAmountToPreciseFloat, formatTransactionAmount } from 'utils/formatNumbers'
import { didUserReject } from 'utils/swapErrorToUserReadableMessage'
import { switchChain } from 'utils/switchChain'

import AddressInputPanel from '../../components/AddressInputPanel'
import { ButtonPrimary, DDButtonError, DDButtonLight } from '../../components/Button'
import { AutoColumn } from '../../components/Column'
import { AutoRow } from '../../components/Row'
import confirmPriceImpactWithoutFee from '../../components/swap/confirmPriceImpactWithoutFee'
import ConfirmSwapModal from '../../components/swap/ConfirmSwapModal'
import { ArrowWrapper, PageWrapper, SwapCallbackError, SwapWrapper } from '../../components/swap/styleds'
import SwapHeader from '../../components/swap/SwapHeader'
import { SwitchLocaleLink } from '../../components/SwitchLocaleLink'
import { getSwapCurrencyId, TOKEN_SHORTHANDS } from '../../constants/tokens'
import { useCurrency, useDefaultActiveTokens } from '../../hooks/Tokens'
import { useIsSwapUnsupported } from '../../hooks/useIsSwapUnsupported'
import useWrapCallback, { WrapErrorText, WrapType } from '../../hooks/useWrapCallback'
import { Field, replaceSwapState } from '../../state/swap/actions'
import { useDefaultsFromURLSearch, useDerivedSwapInfo, useSwapActionHandlers } from '../../state/swap/hooks'
import swapReducer, { initialState as initialSwapState, SwapState } from '../../state/swap/reducer'
import { useExpertModeManager } from '../../state/user/hooks'
import { LinkStyledButton, ThemedText } from '../../theme'
import { computeFiatValuePriceImpact } from '../../utils/computeFiatValuePriceImpact'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { computeRealizedPriceImpact, warningSeverity } from '../../utils/prices'
import { supportedChainId } from '../../utils/supportedChainId'
import { ArrowSwitch } from './components/ArrowSwitch'
import { AutoRouter } from './components/AutoRouter'
import { DerpNimate } from './components/DerpNimate'
import { SwapHanger } from './components/SwapHanger'
import { XYFINANCE_NATIVE_ADDRESS } from './hooks/MOCK_ERC20_BINDING'
import {
  _XYFinanceSwapParams,
  useApproveXYFinanceAllowanceContractCall,
  useBuildSwapXYFinance,
  useCheckXYFinanceAllowanceContractCall,
} from './hooks/use1inchRouter'
import { _1NCH_PRICE_IMPACT_TYPE, useCheckPriceImpact } from './hooks/useCheckPriceImpact'
import * as styles from './index.css'

export const ArrowContainer = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;

  svg {
    height: 100%;
  }
`

const SwapSection = styled.div`
  position: relative;
  border-radius: 16px;
  border: 2px solid #000;
  background: #fff;

  &:before {
    box-sizing: border-box;
    background-size: 100%;
    border-radius: inherit;

    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;
    pointer-events: none;
    content: '';
    border: 1px solid ${({ theme }) => theme.backgroundModule};
  }

  &:hover:before {
    border-color: ${({ theme }) => theme.stateOverlayHover};
  }

  &:focus-within:before {
    border-color: ${({ theme }) => theme.stateOverlayPressed};
  }
`

const OutputSwapSection = styled(SwapSection)`
  // border-bottom: ${({ theme }) => `1px solid ${theme.backgroundSurface}`};
`

const DerpNDerpina = styled.img`
  margin-bottom: -69px;
  width: 100%;
`

const NoticeAggregator = styled.div`
  width: 100%;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: white;
  padding: 12px 12px;
  background: ${({ theme }) => theme.derpGradientPrimary};
  display: flex;
  flex-direction: row;
  gap: 6px;
`

const PriceImpact1inch = styled.div`
  width: 100%;
  border-radius: 8px;
  border: 1px solid #fa2b393d;

  color: inherit;
  padding: 12px 12px;
  background: ${({ theme }) => theme.white};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 6px;
  .text-info {
    font-size: 14px;
    font-weight: 400;
  }
  .percent {
    font-size: 14px;
    font-weight: 600;
  }
`

function getIsValidSwapQuote(
  trade: InterfaceTrade | undefined,
  tradeState: TradeState,
  swapInputError?: ReactNode
): boolean {
  return Boolean(swapInputError && trade && tradeState === TradeState.VALID)
}

function largerPercentValue(a?: Percent, b?: Percent) {
  if (a && b) {
    return a.greaterThan(b) ? a : b
  } else if (a) {
    return a
  } else if (b) {
    return b
  }
  return undefined
}

const TRADE_STRING = 'SwapRouter'

export default function SwapPage({ className }: { className?: string }) {
  const { chainId: connectedChainId } = useWeb3React()
  const loadedUrlParams = useDefaultsFromURLSearch()

  return (
    <Trace page={InterfacePageName.SWAP_PAGE} shouldLogImpression>
      <PageWrapper>
        <Swap
          className={className}
          chainId={connectedChainId}
          prefilledState={{
            [Field.INPUT]: { currencyId: loadedUrlParams?.[Field.INPUT]?.currencyId },
            [Field.OUTPUT]: { currencyId: loadedUrlParams?.[Field.OUTPUT]?.currencyId },
          }}
        />
        <NetworkAlert />
      </PageWrapper>
      <DerpNimate />
      <SwitchLocaleLink />
    </Trace>
  )
}

/**
 * The swap component displays the swap interface, manages state for the swap, and triggers onchain swaps.
 *
 * In most cases, chainId should refer to the connected chain, i.e. `useWeb3React().chainId`.
 * However if this component is being used in a context that displays information from a different, unconnected
 * chain (e.g. the TDP), then chainId should refer to the unconnected chain.
 */
export function Swap({
  className,
  prefilledState = {},
  chainId,
  onCurrencyChange,
  disableTokenInputs = false,
}: {
  className?: string
  prefilledState?: Partial<SwapState>
  chainId?: SupportedChainId
  onCurrencyChange?: (selected: Pick<SwapState, Field.INPUT | Field.OUTPUT>) => void
  disableTokenInputs?: boolean
}) {
  const { account, chainId: connectedChainId, connector } = useWeb3React()
  const trace = useTrace()

  // token warning stuff
  const prefilledInputCurrency = useCurrency(prefilledState?.[Field.INPUT]?.currencyId)
  const prefilledOutputCurrency = useCurrency(prefilledState?.[Field.OUTPUT]?.currencyId)

  const [loadedInputCurrency, setLoadedInputCurrency] = useState(prefilledInputCurrency)
  const [loadedOutputCurrency, setLoadedOutputCurrency] = useState(prefilledOutputCurrency)

  useEffect(() => {
    setLoadedInputCurrency(prefilledInputCurrency)
    setLoadedOutputCurrency(prefilledOutputCurrency)
  }, [prefilledInputCurrency, prefilledOutputCurrency])

  const [dismissTokenWarning, setDismissTokenWarning] = useState<boolean>(false)
  const urlLoadedTokens: Token[] = useMemo(
    () => [loadedInputCurrency, loadedOutputCurrency]?.filter((c): c is Token => c?.isToken ?? false) ?? [],
    [loadedInputCurrency, loadedOutputCurrency]
  )
  const handleConfirmTokenWarning = useCallback(() => {
    setDismissTokenWarning(true)
  }, [])

  // dismiss warning if all imported tokens are in active lists
  const defaultTokens = useDefaultActiveTokens(chainId)
  const importTokensNotInDefault = useMemo(
    () =>
      urlLoadedTokens &&
      urlLoadedTokens
        .filter((token: Token) => {
          return !(token.address in defaultTokens)
        })
        .filter((token: Token) => {
          // Any token addresses that are loaded from the shorthands map do not need to show the import URL
          const supported = supportedChainId(chainId)
          if (!supported) return true
          return !Object.keys(TOKEN_SHORTHANDS).some((shorthand) => {
            const shorthandTokenAddress = TOKEN_SHORTHANDS[shorthand][supported]
            return shorthandTokenAddress && shorthandTokenAddress === token.address
          })
        }),
    [chainId, defaultTokens, urlLoadedTokens]
  )

  const theme = useTheme()

  // toggle wallet when disconnected
  const toggleWalletDrawer = useToggleAccountDrawer()

  // for expert mode
  const [isExpertMode] = useExpertModeManager()
  // swap state
  const [state, dispatch] = useReducer(swapReducer, { ...initialSwapState, ...prefilledState })
  const { typedValue, recipient, independentField } = state

  const previousConnectedChainId = usePrevious(connectedChainId)
  const previousPrefilledState = usePrevious(prefilledState)
  useEffect(() => {
    const combinedInitialState = { ...initialSwapState, ...prefilledState }
    const chainChanged = previousConnectedChainId && previousConnectedChainId !== connectedChainId
    const prefilledInputChanged =
      previousPrefilledState &&
      previousPrefilledState?.[Field.INPUT]?.currencyId !== prefilledState?.[Field.INPUT]?.currencyId
    const prefilledOutputChanged =
      previousPrefilledState &&
      previousPrefilledState?.[Field.OUTPUT]?.currencyId !== prefilledState?.[Field.OUTPUT]?.currencyId
    if (chainChanged || prefilledInputChanged || prefilledOutputChanged) {
      dispatch(
        replaceSwapState({
          ...initialSwapState,
          ...prefilledState,
          field: combinedInitialState.independentField ?? Field.INPUT,
          inputCurrencyId: combinedInitialState.INPUT.currencyId ?? undefined,
          outputCurrencyId: combinedInitialState.OUTPUT.currencyId ?? undefined,
        })
      )
    }
  }, [connectedChainId, prefilledState, previousConnectedChainId, previousPrefilledState])

  const {
    trade: { state: tradeState, trade, isAggregator, disableIf1inchOutput, xySwapProvider },
    allowedSlippage,
    autoSlippage,
    currencyBalances,
    parsedAmount,
    currencies,
    inputError: swapInputError,
  } = useDerivedSwapInfo(state, chainId)

  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue)
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE
  const { address: recipientAddress } = useENSAddress(recipient)

  const parsedAmounts = useMemo(
    () =>
      showWrap
        ? {
            [Field.INPUT]: parsedAmount,
            [Field.OUTPUT]: parsedAmount,
          }
        : {
            [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
            [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
          },
    [independentField, parsedAmount, showWrap, trade]
  )

  const fiatValueInput = useUSDPrice(parsedAmounts[Field.INPUT])
  const fiatValueOutput = useUSDPrice(parsedAmounts[Field.OUTPUT])
  const showFiatValueInput = Boolean(parsedAmounts[Field.INPUT])
  const showFiatValueOutput = Boolean(parsedAmounts[Field.OUTPUT])

  const [routeNotFound, routeIsLoading, routeIsSyncing] = useMemo(
    () => [!trade?.swaps, TradeState.LOADING === tradeState, TradeState.LOADING === tradeState && Boolean(trade)],
    [trade, tradeState]
  )

  const fiatValueTradeInput = useUSDPrice(trade?.inputAmount)
  const fiatValueTradeOutput = useUSDPrice(trade?.outputAmount)
  const stablecoinPriceImpact = useMemo(
    () =>
      routeIsSyncing || !trade
        ? undefined
        : trade?.priceImpact
        ? computeRealizedPriceImpact(trade)
        : computeFiatValuePriceImpact(fiatValueTradeInput.data, fiatValueTradeOutput.data),
    [fiatValueTradeInput, fiatValueTradeOutput, routeIsSyncing, trade]
  )

  const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRecipient } = useSwapActionHandlers(dispatch)
  const isValid = !swapInputError
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value)
    },
    [onUserInput]
  )
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value)
    },
    [onUserInput]
  )

  const navigate = useNavigate()
  const swapIsUnsupported = useIsSwapUnsupported(currencies[Field.INPUT], currencies[Field.OUTPUT])

  // reset if they close warning without tokens in params
  const handleDismissTokenWarning = useCallback(() => {
    setDismissTokenWarning(true)
    navigate('/swap/')
  }, [navigate])

  // modal and loading
  const [{ showConfirm, tradeToConfirm, swapError, txHash }, setSwapState] = useState<{
    showConfirm: boolean
    tradeToConfirm?: InterfaceTrade
    attemptingTxn: boolean
    swapError?: Error
    txHash?: string
  }>({
    showConfirm: false,
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapError: undefined,
    txHash: undefined,
  })
  const formattedAmounts = useMemo(
    () => ({
      [independentField]: typedValue,
      [dependentField]: showWrap
        ? parsedAmounts[independentField]?.toExact() ?? ''
        : formatTransactionAmount(currencyAmountToPreciseFloat(parsedAmounts[dependentField])),
    }),
    [dependentField, independentField, parsedAmounts, showWrap, typedValue]
  )

  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] && currencies[Field.OUTPUT] && parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0))
  )
  const userSpecifiedOutput = Boolean(currencies[Field.OUTPUT])

  const maximumAmountIn = useMaxAmountIn(trade, allowedSlippage)
  let spender: string | undefined
  if (isSupportedChain(chainId)) {
    try {
      spender = UNIVERSAL_ROUTER_ADDRESS(chainId)
    } catch (ex) {
      console.log('Failed to get spender address', ex)
    }
  }

  const allowance = usePermit2Allowance(
    maximumAmountIn ??
      (parsedAmounts[Field.INPUT]?.currency.isToken
        ? (parsedAmounts[Field.INPUT] as CurrencyAmount<Token>)
        : undefined),
    spender
  )

  const maxInputAmount: CurrencyAmount<Currency> | undefined = useMemo(
    () => maxAmountSpend(currencyBalances[Field.INPUT]),
    [currencyBalances]
  )
  const showMaxButton = Boolean(maxInputAmount?.greaterThan(0) && !parsedAmounts[Field.INPUT]?.equalTo(maxInputAmount))
  const swapFiatValues = useMemo(() => {
    return { amountIn: fiatValueTradeInput.data, amountOut: fiatValueTradeOutput.data }
  }, [fiatValueTradeInput, fiatValueTradeOutput])

  // the callback to execute the swap
  const { callback: swapCallback } = useSwapCallback(
    trade,
    swapFiatValues,
    allowedSlippage,
    allowance.state === AllowanceState.ALLOWED ? allowance.permitSignature : undefined
  )

  const { isLoading: isLoadingSwap1inch, error: errorSwap1inch, swapXYFinance } = useBuildSwapXYFinance()

  const handleSwap = useCallback(
    ({ isSwapOnAggregator }: { isSwapOnAggregator?: boolean }) => {
      if (!swapCallback) {
        return
      }

      if (stablecoinPriceImpact && !isAggregator && !confirmPriceImpactWithoutFee(stablecoinPriceImpact)) {
        return
      }
      setSwapState((currentState) => ({
        ...currentState,
        attemptingTxn: true,
        swapError: undefined,
        txHash: undefined,
      }))

      if (isSwapOnAggregator && trade && chainId && xySwapProvider && account) {
        const swapParams: _XYFinanceSwapParams = {
          srcChainId: chainId,
          srcQuoteTokenAddress: trade.inputAmount.currency.wrapped.address, // 1INCH
          srcQuoteTokenAmount: ethers.utils
            .parseUnits(trade?.inputAmount.toExact(), trade?.inputAmount.currency.decimals)
            .toString(),
          dstChainId: chainId,
          dstQuoteTokenAddress: trade.outputAmount.currency.wrapped.address, // DAI
          slippage: Number(allowedSlippage.toFixed()),
          receiver: account,
          srcSwapProvider: xySwapProvider,
          commissionRate: 0,
          affiliate: process.env.REACT_APP_DEPLOYER_ADDRESS,
        }
        swapXYFinance(swapParams, trade, allowedSlippage)
          .then((hash) => {
            setSwapState((currentState) => ({
              ...currentState,
              attemptingTxn: false,
              swapError: undefined,
              txHash: hash,
            }))
            sendEvent({
              category: 'Swap',
              action: 'transaction hash',
              label: hash,
            })
          })
          .catch((error) => {
            setSwapState((currentState) => ({
              ...currentState,
              attemptingTxn: false,
              swapError: error,
              txHash: undefined,
            }))
          })
        // swapOnAggregatorCallback()
      } else {
        swapCallback()
          .then(async (hash) => {
            setSwapState((currentState) => ({
              ...currentState,
              attemptingTxn: false,
              swapError: undefined,
              txHash: hash,
            }))
            sendEvent({
              category: 'Swap',
              action: 'transaction hash',
              label: hash,
            })
            sendEvent({
              category: 'Swap',
              action:
                recipient === null
                  ? 'Swap w/o Send'
                  : (recipientAddress ?? recipient) === account
                  ? 'Swap w/o Send + recipient'
                  : 'Swap w/ Send',
              label: [
                TRADE_STRING,
                trade?.inputAmount?.currency?.symbol,
                trade?.outputAmount?.currency?.symbol,
                'MH',
              ].join('/'),
            })

            // Add Galaxe Code Snippet
            await sendEventToGalxe(account ?? '', 'swap')
          })
          .catch((error) => {
            setSwapState((currentState) => ({
              ...currentState,
              attemptingTxn: false,
              swapError: error,
              txHash: undefined,
            }))
          })
      }
    },
    [
      swapCallback,
      stablecoinPriceImpact,
      trade,
      chainId,
      xySwapProvider,
      account,
      swapXYFinance,
      allowedSlippage,
      recipient,
      recipientAddress,
    ]
  )

  // errors
  const [swapQuoteReceivedDate, setSwapQuoteReceivedDate] = useState<Date | undefined>()

  // warnings on the greater of fiat value price impact and execution price impact
  const { priceImpactSeverity, largerPriceImpact } = useMemo(() => {
    const marketPriceImpact = trade?.priceImpact ? computeRealizedPriceImpact(trade) : undefined
    const largerPriceImpact = largerPercentValue(marketPriceImpact, stablecoinPriceImpact)
    return { priceImpactSeverity: warningSeverity(largerPriceImpact), largerPriceImpact }
  }, [stablecoinPriceImpact, trade])

  //! THIS IS ONLY FOR 1INCH AGG
  const { isLoadingPriceImpact, priceImpact1inchState, priceImpact1inch, getBasePrice } = useCheckPriceImpact()

  useEffect(() => {
    if (isAggregator && tradeState === TradeState.VALID && trade?.swaps) {
      getBasePrice({
        tokenInSymbol: trade?.inputAmount.currency.symbol,
        tokenOutSymbol: trade?.outputAmount.currency.symbol,
        typedValue,
        outputAmount: formattedAmounts[Field.OUTPUT],
      })
    }
  }, [isAggregator, tradeState, trade?.swaps, formattedAmounts[Field.OUTPUT]])

  const handleConfirmDismiss = useCallback(() => {
    setSwapState((currentState) => ({ ...currentState, showConfirm: false }))
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '')
    }
  }, [onUserInput, txHash])

  const handleAcceptChanges = useCallback(() => {
    setSwapState((currentState) => ({ ...currentState, tradeToConfirm: trade }))
  }, [trade])

  const handleInputSelect = useCallback(
    (inputCurrency: Currency) => {
      setHasAllowance(false)
      onCurrencySelection(Field.INPUT, inputCurrency)
      onCurrencyChange?.({
        [Field.INPUT]: {
          currencyId: getSwapCurrencyId(inputCurrency),
        },
        [Field.OUTPUT]: state[Field.OUTPUT],
      })
    },
    [onCurrencyChange, onCurrencySelection, state]
  )

  const handleMaxInput = useCallback(() => {
    maxInputAmount && onUserInput(Field.INPUT, maxInputAmount.toExact())
    sendEvent({
      category: 'Swap',
      action: 'Max',
    })
  }, [maxInputAmount, onUserInput])

  const handleOutputSelect = useCallback(
    (outputCurrency: Currency) => {
      onCurrencySelection(Field.OUTPUT, outputCurrency)
      onCurrencyChange?.({
        [Field.INPUT]: state[Field.INPUT],
        [Field.OUTPUT]: {
          currencyId: getSwapCurrencyId(outputCurrency),
        },
      })
    },
    [onCurrencyChange, onCurrencySelection, state]
  )

  const priceImpactTooHigh = priceImpactSeverity > 3 && !isExpertMode && !isAggregator
  const showPriceImpactWarning = largerPriceImpact && priceImpactSeverity > 3 && !isAggregator

  const prevTrade = usePrevious(trade)
  useEffect(() => {
    if (!trade || prevTrade === trade) return // no new swap quote to log
    setSwapQuoteReceivedDate(new Date())
    sendAnalyticsEvent(SwapEventName.SWAP_QUOTE_RECEIVED, {
      ...formatSwapQuoteReceivedEventProperties(trade, trade.gasUseEstimateUSD ?? undefined),
      ...trace,
    })
  }, [prevTrade, trade, trace])

  const showDetailsDropdown = Boolean(
    !showWrap && userHasSpecifiedInputOutput && (trade || routeIsLoading || routeIsSyncing)
  )

  const { checkAllowanceContractCall, hasAllowance, setHasAllowance, isLoadingCheckAllowance } =
    useCheckXYFinanceAllowanceContractCall()

  const {
    approveERC20: approveXYFinance,
    isErrorSignAndApproved1inchRouter,
    isLoadingSignAndApproved1inchRouter,
    isSignAndApproved1inchRouter,
  } = useApproveXYFinanceAllowanceContractCall()

  useEffect(() => {
    if (isAggregator && currencies[Field.INPUT]) {
      // CHECK AlLOWANCE ON XY APII,
      // Returns "allowance": "THE AMOUNT"
      checkAllowanceContractCall({
        tokenInAddress: currencies[Field.INPUT]?.isNative
          ? XYFINANCE_NATIVE_ADDRESS
          : currencies[Field.INPUT]?.wrapped.address,
        walletAddress: account,
      })
    }
  }, [isAggregator, account, currencies[Field.INPUT], trade?.swaps, chainId])

  return (
    <>
      <DerpNDerpina src={SwapDerpHeader} />
      <SwapWrapper chainId={chainId} className={`${className} ${styles.OverrideSwapWrapper}`} id="swap-page">
        <TokenSafetyModal
          isOpen={importTokensNotInDefault.length > 0 && !dismissTokenWarning}
          tokenAddress={importTokensNotInDefault[0]?.address}
          secondTokenAddress={importTokensNotInDefault[1]?.address}
          onContinue={handleConfirmTokenWarning}
          onCancel={handleDismissTokenWarning}
          showCancel={true}
        />
        <SwapHeader
          autoSlippage={autoSlippage}
          label={independentField === Field.OUTPUT && !showWrap ? <Trans>From (at most)</Trans> : <Trans>From</Trans>}
          disabled={disableTokenInputs}
          value={formattedAmounts[Field.INPUT]}
          showMaxButton={showMaxButton}
          currency={currencies[Field.INPUT] ?? null}
          onUserInput={handleTypeInput}
          onMax={handleMaxInput}
          fiatValue={showFiatValueInput ? fiatValueInput : undefined}
          onCurrencySelect={handleInputSelect}
          otherCurrency={currencies[Field.OUTPUT]}
          showCommonBases
          id={InterfaceSectionName.CURRENCY_INPUT_PANEL}
          loading={independentField === Field.OUTPUT && routeIsSyncing}
        />
        {trade && showConfirm && (
          <ConfirmSwapModal
            trade={trade}
            originalTrade={tradeToConfirm}
            onAcceptChanges={handleAcceptChanges}
            txHash={txHash}
            allowedSlippage={allowedSlippage}
            onConfirm={() => handleSwap({ isSwapOnAggregator: isAggregator })}
            allowance={allowance}
            swapError={swapError}
            onDismiss={handleConfirmDismiss}
            swapQuoteReceivedDate={swapQuoteReceivedDate}
            fiatValueInput={fiatValueTradeInput}
            fiatValueOutput={fiatValueTradeOutput}
            isAggregator={isAggregator}
            aggregatorPriceImpact={priceImpact1inch}
          />
        )}

        <div style={{ display: 'relative' }}>
          <SwapSection>
            <Trace section={InterfaceSectionName.CURRENCY_INPUT_PANEL}>
              <SwapCurrencyInputPanelV2
                label={
                  independentField === Field.OUTPUT && !showWrap ? <Trans>From (at most)</Trans> : <Trans>From</Trans>
                }
                disabled={disableTokenInputs}
                value={formattedAmounts[Field.INPUT]}
                showMaxButton={showMaxButton}
                currency={currencies[Field.INPUT] ?? null}
                onUserInput={handleTypeInput}
                onMax={handleMaxInput}
                fiatValue={showFiatValueInput ? fiatValueInput : undefined}
                onCurrencySelect={handleInputSelect}
                otherCurrency={currencies[Field.OUTPUT]}
                showCommonBases
                id={InterfaceSectionName.CURRENCY_INPUT_PANEL}
                loading={independentField === Field.OUTPUT && routeIsSyncing}
              />
            </Trace>
          </SwapSection>
        </div>

        <ArrowWrapper className={styles.OverrideArrowWrapper} clickable={isSupportedChain(chainId)}>
          <TraceEvent
            events={[BrowserEvent.onClick]}
            name={SwapEventName.SWAP_TOKENS_REVERSED}
            element={InterfaceElementName.SWAP_TOKENS_REVERSE_ARROW_BUTTON}
          >
            <ArrowContainer data-testid="swap-currency-button" color={theme.textPrimary}>
              <ArrowSwitch onSwitchTokens={() => !disableTokenInputs && onSwitchTokens()} />
              {/* <ArrowDownXL
                onClick={() => {
                  !disableTokenInputs && onSwitchTokens()
                }}
              /> */}
            </ArrowContainer>
          </TraceEvent>
        </ArrowWrapper>

        <GloriaText size="xl">Get</GloriaText>

        <AutoColumn gap="xs">
          <div>
            <OutputSwapSection>
              <Trace section={InterfaceSectionName.CURRENCY_OUTPUT_PANEL}>
                <SwapCurrencyInputPanelV2
                  value={formattedAmounts[Field.OUTPUT]}
                  disabled={disableTokenInputs}
                  onUserInput={handleTypeOutput}
                  label={
                    independentField === Field.INPUT && !showWrap ? <Trans>To (at least)</Trans> : <Trans>To</Trans>
                  }
                  showMaxButton={false}
                  hideBalance={false}
                  fiatValue={showFiatValueOutput ? fiatValueOutput : undefined}
                  priceImpact={stablecoinPriceImpact}
                  currency={currencies[Field.OUTPUT] ?? null}
                  onCurrencySelect={handleOutputSelect}
                  otherCurrency={currencies[Field.INPUT]}
                  showCommonBases
                  id={InterfaceSectionName.CURRENCY_OUTPUT_PANEL}
                  loading={independentField === Field.INPUT && routeIsSyncing}
                />
              </Trace>
              {recipient !== null && !showWrap ? (
                <>
                  <AutoRow justify="space-between" style={{ padding: '0 1rem' }}>
                    <ArrowWrapper clickable={false}>
                      <ArrowDown size="16" color={theme.textSecondary} />
                    </ArrowWrapper>
                    <LinkStyledButton id="remove-recipient-button" onClick={() => onChangeRecipient(null)}>
                      <Trans>- Remove recipient</Trans>
                    </LinkStyledButton>
                  </AutoRow>
                  <AddressInputPanel id="recipient" value={recipient} onChange={onChangeRecipient} />
                </>
              ) : null}
            </OutputSwapSection>
          </div>
          {
            // trade?.tradeType === TradeType.EXACT_OUTPUT &&
            dependentField === Field.INPUT && userHasSpecifiedInputOutput && disableIf1inchOutput && isAggregator && (
              <NoticeAggregator>
                <div>Note: </div>
                <div>Try enter an amount for a token input to use aggregator instead to find the best liquidity</div>
              </NoticeAggregator>
            )
          }
          {showDetailsDropdown && (
            <SwapDetailsDropdown
              trade={trade}
              syncing={routeIsSyncing}
              loading={routeIsLoading}
              allowedSlippage={allowedSlippage}
              isAggregator={isAggregator}
              aggregatorPriceImpact={priceImpact1inch}
            />
          )}
          {!isAggregator && showPriceImpactWarning ? <PriceImpactWarning priceImpact={largerPriceImpact} /> : null}
          {isAggregator && priceImpact1inchState !== _1NCH_PRICE_IMPACT_TYPE.NONE && (
            <PriceImpact1inch>
              <div className="text-info">Price Impact Warning</div>
              <div className="percent">-{priceImpact1inch?.toFixed(2)}%</div>
            </PriceImpact1inch>
          )}
          <div
            style={{
              marginTop: '23px',
            }}
          >
            {swapIsUnsupported ? (
              <ButtonPrimary disabled={true}>
                <ThemedText.DeprecatedMain mb="4px">
                  <Trans>Unsupported Asset</Trans>
                </ThemedText.DeprecatedMain>
              </ButtonPrimary>
            ) : !account ? (
              <TraceEvent
                events={[BrowserEvent.onClick]}
                name={InterfaceEventName.CONNECT_WALLET_BUTTON_CLICKED}
                properties={{ received_swap_quote: getIsValidSwapQuote(trade, tradeState, swapInputError) }}
                element={InterfaceElementName.CONNECT_WALLET_BUTTON}
              >
                <DDButtonLight onClick={toggleWalletDrawer} fontWeight={600}>
                  <Trans>Connect Wallet</Trans>
                </DDButtonLight>
              </TraceEvent>
            ) : chainId && chainId !== connectedChainId ? (
              <ButtonPrimary
                onClick={async () => {
                  try {
                    await switchChain(connector, chainId)
                  } catch (error) {
                    if (didUserReject(error)) {
                      // Ignore error, which keeps the user on the previous chain.
                    } else {
                      // TODO(WEB-3306): This UX could be improved to show an error state.
                      throw error
                    }
                  }
                }}
              >
                Connect to {getChainInfo(chainId)?.label}
              </ButtonPrimary>
            ) : showWrap ? (
              <DDButtonError
                disabled={Boolean(wrapInputError)}
                className={styles.ButtonOnSwapOnError}
                onClick={onWrap}
                fontWeight={600}
                data-testid="wrap-button"
                error={false}
              >
                {wrapInputError ? (
                  <WrapErrorText wrapInputError={wrapInputError} />
                ) : wrapType === WrapType.WRAP ? (
                  <Trans>Wrap</Trans>
                ) : wrapType === WrapType.UNWRAP ? (
                  <Trans>Unwrap</Trans>
                ) : null}
              </DDButtonError>
            ) : routeNotFound && userHasSpecifiedInputOutput && !routeIsLoading && !routeIsSyncing ? (
              <DDButtonError
                disabled={true}
                error={true}
                className={styles.ButtonOnSwapOnError}
                style={{ textAlign: 'center' }}
              >
                <Trans>Insufficient liquidity for this trade.</Trans>
              </DDButtonError>
            ) : isAggregator ? (
              <>
                {hasAllowance && !isLoadingCheckAllowance ? (
                  <DDButtonError
                    className={styles.ButtonOnSwap}
                    onClick={() => {
                      if (isExpertMode) {
                        handleSwap({ isSwapOnAggregator: true })
                      } else {
                        setSwapState({
                          tradeToConfirm: trade,
                          attemptingTxn: false,
                          swapError: undefined,
                          showConfirm: true,
                          txHash: undefined,
                        })
                      }
                    }}
                    id="swap-button"
                    data-testid="swap-button"
                    disabled={!!swapInputError || routeIsSyncing || routeIsLoading || !hasAllowance}
                    error={isValid && priceImpact1inch > 2 && allowance.state === AllowanceState.ALLOWED}
                  >
                    <Text fontSize={20} fontWeight={600}>
                      {swapInputError ? (
                        <>{swapInputError}</>
                      ) : routeIsSyncing || routeIsLoading ? (
                        <Trans>Swap</Trans>
                      ) : (
                        <Trans>Swap</Trans>
                      )}
                    </Text>
                  </DDButtonError>
                ) : !hasAllowance && !isLoadingCheckAllowance ? (
                  <DDButtonError
                    className={styles.ButtonOnSwap}
                    onClick={() => {
                      approveXYFinance(trade?.swaps[0].inputAmount.currency.wrapped.address, setHasAllowance)
                    }}
                    id="swap-button"
                    data-testid="swap-button"
                    disabled={isLoadingSignAndApproved1inchRouter || !!swapInputError}
                    error={isValid && priceImpactSeverity > 2 && allowance.state === AllowanceState.ALLOWED}
                  >
                    <Text fontSize={20} fontWeight={600}>
                      {swapInputError ? (
                        swapInputError
                      ) : !isLoadingSignAndApproved1inchRouter ? (
                        <Trans>Approve {currencies[Field.INPUT]?.symbol}</Trans>
                      ) : (
                        <Trans>Approving</Trans>
                      )}
                    </Text>
                  </DDButtonError>
                ) : (
                  <DDButtonError
                    className={styles.ButtonOnSwap}
                    id="swap-button"
                    data-testid="swap-button"
                    disabled={true}
                    error={isValid && priceImpactSeverity > 2 && allowance.state === AllowanceState.ALLOWED}
                  >
                    <CircularProgress style={{ color: '#a372ff' }} size={18} />
                  </DDButtonError>
                )}
              </>
            ) : (
              <TraceEvent
                events={[BrowserEvent.onClick]}
                name={SharedEventName.ELEMENT_CLICKED}
                element={InterfaceElementName.SWAP_BUTTON}
              >
                <DDButtonError
                  className={styles.ButtonOnSwap}
                  onClick={() => {
                    if (isExpertMode) {
                      handleSwap({ isSwapOnAggregator: isAggregator })
                    } else {
                      setSwapState({
                        tradeToConfirm: trade,
                        attemptingTxn: false,
                        swapError: undefined,
                        showConfirm: true,
                        txHash: undefined,
                      })
                    }
                  }}
                  id="swap-button"
                  data-testid="swap-button"
                  disabled={!isValid || routeIsSyncing || routeIsLoading || priceImpactTooHigh}
                  error={isValid && priceImpactSeverity > 2 && allowance.state === AllowanceState.ALLOWED}
                >
                  <Text fontSize={20} fontWeight={600}>
                    {swapInputError ? (
                      swapInputError
                    ) : routeIsSyncing || routeIsLoading ? (
                      <Trans>Swap</Trans>
                    ) : priceImpactTooHigh ? (
                      <Trans>Price Impact Too High</Trans>
                    ) : priceImpactSeverity > 2 ? (
                      <Trans>Swap Anyway</Trans>
                    ) : (
                      <Trans>Swap</Trans>
                    )}
                  </Text>
                </DDButtonError>
              </TraceEvent>
            )}
            {Boolean(isExpertMode && swapError) && <SwapCallbackError error={swapError?.message} />}
          </div>
        </AutoColumn>
      </SwapWrapper>
      <SwapHanger />
      <AutoRouter autoSlippage={autoSlippage} />
    </>
  )
}
