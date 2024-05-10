/* eslint-disable import/no-unused-modules */
import { UNIVERSAL_ROUTER_ADDRESS } from '@derpdex/universal-router-sdk'
import { Trans } from '@lingui/macro'
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
import { ReactComponent as ArrowDownXL } from 'assets/svg/switcher-v2.svg'
import { useToggleAccountDrawer } from 'components/AccountDrawer'
import { sendEvent } from 'components/analytics'
import SwapCurrencyInputPanelV2Minimal from 'components/CurrencyInputPanel/SwapCurrencyInputPanelV2Minimal'
import { NetworkAlert } from 'components/NetworkAlert/NetworkAlert'
import PriceImpactWarning from 'components/swap/PriceImpactWarning'
import SwapDetailsDropdownMinimal from 'components/swap/SwapDetailsDropdowMinimal'
import TokenSafetyModal from 'components/TokenSafety/TokenSafetyModal'
import { getChainInfo } from 'constants/chainInfo'
import { isSupportedChain, SupportedChainId } from 'constants/chains'
import useENSAddress from 'hooks/useENSAddress'
import { useMaxAmountIn } from 'hooks/useMaxAmountIn'
import usePermit2Allowance, { AllowanceState } from 'hooks/usePermit2Allowance'
import usePrevious from 'hooks/usePrevious'
import { useSwapCallback } from 'hooks/useSwapCallback'
import { useUSDPrice } from 'hooks/useUSDPrice'
import { useAtom } from 'jotai'
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
import { ArrowWrapper, ArrowWrapperV2, PageWrapper, SwapCallbackError } from '../../components/swap/styleds'
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
import { inputCurrencyAtom, outputCurrencyAtom } from './atoms'
import { AutoRouter } from './components/AutoRouter'
import { DerpNimate } from './components/DerpNimate'
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

const ButtonOverride = styled(DDButtonError)`
  border-radius: 8px !important;
  border: 2px solid #344d73 !important;
  background: var(--primary-gradient-lr, linear-gradient(270deg, #46c9d2 0%, #a372ff 100%)) !important;
  filter: drop-shadow(3px 3px 0px #000);

  width: 100%;
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
        <SwapMinimal
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
export function SwapMinimal({
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
  const [inputCurrency, setInputCurrency] = useAtom(inputCurrencyAtom)
  const [outputCurrency, setOutputCurrency] = useAtom(outputCurrencyAtom)

  const { account, chainId: connectedChainId, connector } = useWeb3React()
  const trace = useTrace()

  // token warning stuff
  const prefilledInputCurrency = useCurrency(prefilledState?.[Field.INPUT]?.currencyId, chainId)
  const prefilledOutputCurrency = useCurrency(prefilledState?.[Field.OUTPUT]?.currencyId, chainId)

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
    trade: { state: tradeState, trade },
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

  //! Set ATOM State for GeckoTerminal
  useEffect(() => {
    // When user selects a currency for input
    setInputCurrency({
      address: currencies[Field.INPUT]?.wrapped.address,
      symbol: currencies[Field.INPUT]?.wrapped.symbol,
    }) // Replace 'USD' with the selected currency code

    // When user selects a currency for output
    setOutputCurrency({
      address: currencies[Field.OUTPUT]?.wrapped.address,
      symbol: currencies[Field.OUTPUT]?.wrapped.symbol,
    }) // Replace 'EUR' with the selected currency code
  }, [currencies])
  //! END OF Set ATOM State for GeckoTerminal

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

  const handleSwap = useCallback(() => {
    if (!swapCallback) {
      return
    }
    if (stablecoinPriceImpact && !confirmPriceImpactWithoutFee(stablecoinPriceImpact)) {
      return
    }
    setSwapState((currentState) => ({
      ...currentState,
      attemptingTxn: true,
      swapError: undefined,
      txHash: undefined,
    }))
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
          label: [TRADE_STRING, trade?.inputAmount?.currency?.symbol, trade?.outputAmount?.currency?.symbol, 'MH'].join(
            '/'
          ),
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
  }, [
    swapCallback,
    stablecoinPriceImpact,
    recipient,
    recipientAddress,
    account,
    trade?.inputAmount?.currency?.symbol,
    trade?.outputAmount?.currency?.symbol,
  ])

  // errors
  const [swapQuoteReceivedDate, setSwapQuoteReceivedDate] = useState<Date | undefined>()

  // warnings on the greater of fiat value price impact and execution price impact
  const { priceImpactSeverity, largerPriceImpact } = useMemo(() => {
    const marketPriceImpact = trade?.priceImpact ? computeRealizedPriceImpact(trade) : undefined
    const largerPriceImpact = largerPercentValue(marketPriceImpact, stablecoinPriceImpact)
    return { priceImpactSeverity: warningSeverity(largerPriceImpact), largerPriceImpact }
  }, [stablecoinPriceImpact, trade])

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

  const priceImpactTooHigh = priceImpactSeverity > 3 && !isExpertMode
  const showPriceImpactWarning = largerPriceImpact && priceImpactSeverity > 3

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

  return (
    <>
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
        fromTokenDetails={true}
      />
      {trade && showConfirm && (
        <ConfirmSwapModal
          trade={trade}
          originalTrade={tradeToConfirm}
          onAcceptChanges={handleAcceptChanges}
          txHash={txHash}
          allowedSlippage={allowedSlippage}
          onConfirm={handleSwap}
          allowance={allowance}
          swapError={swapError}
          onDismiss={handleConfirmDismiss}
          swapQuoteReceivedDate={swapQuoteReceivedDate}
          fiatValueInput={fiatValueTradeInput}
          fiatValueOutput={fiatValueTradeOutput}
        />
      )}

      <Trace section={InterfaceSectionName.CURRENCY_INPUT_PANEL}>
        <SwapCurrencyInputPanelV2Minimal
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
      </Trace>

      <ArrowWrapperV2 className={styles.OverrideArrowWrapper} clickable={isSupportedChain(chainId)}>
        <TraceEvent
          events={[BrowserEvent.onClick]}
          name={SwapEventName.SWAP_TOKENS_REVERSED}
          element={InterfaceElementName.SWAP_TOKENS_REVERSE_ARROW_BUTTON}
        >
          <ArrowContainer data-testid="swap-currency-button" color={theme.textPrimary}>
            <ArrowDownXL
              onClick={() => {
                !disableTokenInputs && onSwitchTokens()
              }}
            />
          </ArrowContainer>
        </TraceEvent>
      </ArrowWrapperV2>

      <AutoColumn gap="xs">
        <Trace section={InterfaceSectionName.CURRENCY_OUTPUT_PANEL}>
          <SwapCurrencyInputPanelV2Minimal
            value={formattedAmounts[Field.OUTPUT]}
            disabled={disableTokenInputs}
            onUserInput={handleTypeOutput}
            label={independentField === Field.INPUT && !showWrap ? <Trans>To (at least)</Trans> : <Trans>To</Trans>}
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
        {showDetailsDropdown && (
          <SwapDetailsDropdownMinimal
            trade={trade}
            syncing={routeIsSyncing}
            loading={routeIsLoading}
            allowedSlippage={allowedSlippage}
          />
        )}
        {showPriceImpactWarning && <PriceImpactWarning priceImpact={largerPriceImpact} />}
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
            <ButtonOverride
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
            </ButtonOverride>
          ) : showWrap ? (
            <ButtonOverride
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
            </ButtonOverride>
          ) : routeNotFound && userHasSpecifiedInputOutput && !routeIsLoading && !routeIsSyncing ? (
            <ButtonOverride
              disabled={true}
              error={true}
              className={styles.ButtonOnSwapOnError}
              style={{ textAlign: 'center' }}
            >
              <Trans>Insufficient liquidity for this trade.</Trans>
            </ButtonOverride>
          ) : (
            <TraceEvent
              events={[BrowserEvent.onClick]}
              name={SharedEventName.ELEMENT_CLICKED}
              element={InterfaceElementName.SWAP_BUTTON}
            >
              <ButtonOverride
                className={styles.ButtonOnSwap}
                onClick={() => {
                  if (isExpertMode) {
                    handleSwap()
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
              </ButtonOverride>
            </TraceEvent>
          )}
          {Boolean(isExpertMode && swapError) && <SwapCallbackError error={swapError?.message} />}
        </div>
      </AutoColumn>
      <AutoRouter autoSlippage={autoSlippage} />
    </>
  )
}
