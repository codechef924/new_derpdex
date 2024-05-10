import { FeeAmount, NonfungiblePositionManager, Position, priceToClosestTick, TICK_SPACINGS } from '@derpdex/sdk'
import { BigNumber } from '@ethersproject/bignumber'
import type { TransactionResponse } from '@ethersproject/providers'
import { Trans } from '@lingui/macro'
import { Box } from '@mui/material'
import Slider from '@mui/material/Slider'
import { TraceEvent } from '@uniswap/analytics'
import { BrowserEvent, InterfaceElementName, InterfaceEventName } from '@uniswap/analytics-events'
import { Currency, CurrencyAmount, Percent } from '@uniswap/sdk-core'
import { useWeb3React } from '@web3-react/core'
import { useToggleAccountDrawer } from 'components/AccountDrawer'
import OwnershipWarning from 'components/addLiquidity/OwnershipWarning'
import { sendEvent } from 'components/analytics'
import RangeBadge from 'components/Badge/RangeBadge'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import { GloriaText } from 'components/CustomFonts/GloriaHallelujah'
import { NunitoText } from 'components/CustomFonts/Nunito'
import DerpFeeSelector from 'components/DerpFeeSelector'
import CurrencyLogo from 'components/Logo/CurrencyLogo'
import SettingsTabLiquidity from 'components/Settings/index-liquidity'
import UnsupportedCurrencyFooter from 'components/swap/UnsupportedCurrencyFooter'
import TransactionConfirmationModalLiquidity, {
  ConfirmationModalContentLiquidity,
  ModalType,
} from 'components/TransactionConfirmationModalLiqudity'
import { isSupportedChain } from 'constants/chains'
import { PoolState, useDerpPool } from 'hooks/usePools'
import usePrevious from 'hooks/usePrevious'
import { useSingleCallResult } from 'lib/hooks/multicall'
import { useIsMobile } from 'nft/hooks'
import { PositionPageUnsupportedContent } from 'pages/Pool/PositionPage'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { AlertTriangle } from 'react-feather'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  useRangeHopCallbacks,
  useV3DerivedMintInfo,
  useV3MintActionHandlers,
  useV3MintState,
} from 'state/mint/v3/hooks'
import { tryParseTick } from 'state/mint/v3/utils'
import { useTheme } from 'styled-components/macro'
import { sendEventToGalxe } from 'tracing'
import { addressesAreEquivalent } from 'utils/addressesAreEquivalent'
import { getTickToPrice } from 'utils/getTickToPrice'

import { ButtonPrimary, ButtonText, DDButtonError, DDButtonLight, DDButtonPrimary } from '../../components/Button'
import { BlueCard, OutlineCard, YellowCard } from '../../components/Card'
import { AutoColumn } from '../../components/Column'
import HoverInlineText from '../../components/HoverInlineText'
import { PositionPreview } from '../../components/PositionPreview'
import RangeSelector from '../../components/RangeSelector'
import RateToggle from '../../components/RateToggle'
import Row, { RowBetween, RowFixed } from '../../components/Row'
import { SwitchLocaleLink } from '../../components/SwitchLocaleLink'
import { NONFUNGIBLE_POSITION_MANAGER_ADDRESSES } from '../../constants/addresses'
import { ZERO_PERCENT } from '../../constants/misc'
import { WRAPPED_NATIVE_CURRENCY } from '../../constants/tokens'
import { useCurrency } from '../../hooks/Tokens'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import { useArgentWalletContract } from '../../hooks/useArgentWalletContract'
import { useV3NFTPositionManagerContract } from '../../hooks/useContract'
import { useDerivedPositionInfo } from '../../hooks/useDerivedPositionInfo'
import { useIsSwapUnsupported } from '../../hooks/useIsSwapUnsupported'
import { useStablecoinValue } from '../../hooks/useStablecoinPrice'
import useTransactionDeadline from '../../hooks/useTransactionDeadline'
import { useV3LatestPositionsByFeeOfPair, useV3PositionFromTokenId } from '../../hooks/useV3Positions'
import { Bound, Field } from '../../state/mint/v3/actions'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { TransactionType } from '../../state/transactions/types'
import { useIsExpertMode, useUserSlippageToleranceWithDefault } from '../../state/user/hooks'
import { ThemedText } from '../../theme'
import approveAmountCalldata from '../../utils/approveAmountCalldata'
import { calculateGasMargin } from '../../utils/calculateGasMargin'
import { currencyId } from '../../utils/currencyId'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { Dots } from '../Pool/styleds'
import DualSlider from './DualSlider'
import * as styles from './index.css'
import { PositionsLoadingPlaceholder } from './Loading'
import { RANGE, RangeModeSelector } from './RANGE_MODE'
import { Review } from './Review'
import {
  BoundedCurrency,
  ButtonWrapper,
  CircledNumber,
  CurrencyDropdown,
  DerpPageWrapper,
  DerpScrollablePage,
  DynamicSection,
  ExistingRangeContainer,
  FeeTierWrapper,
  HideMedium,
  InputAreaAutoColumn,
  MediumOnly,
  PanelWrapper,
  PositionWrapper,
  ResponsiveTwoColumns,
  RightContainer,
  ShadowedBorder,
  StackedContainer,
  StackedItem,
  StyledInput,
  TwoButtonRow,
} from './styled'

const DEFAULT_ADD_IN_RANGE_SLIPPAGE_TOLERANCE = new Percent(50, 10_000)

export default function AddLiquidityWrapper() {
  const { chainId } = useWeb3React()
  if (isSupportedChain(chainId)) {
    return <AddLiquidity />
  } else {
    return <PositionPageUnsupportedContent />
  }
}

function valuetext(value: number) {
  return `${value}°C`
}

function AddLiquidity() {
  const [searchParams, setSearchParams] = useSearchParams()
  const isMobile = useIsMobile()
  const navigate = useNavigate()
  // FOR SLIDER PRESET
  const [value1, setValue1] = useState<number[]>([0, 100])

  const {
    currencyIdA,
    currencyIdB,
    feeAmount: feeAmountFromUrl,
    tokenId,
  } = useParams<{ currencyIdA?: string; currencyIdB?: string; feeAmount?: string; tokenId?: string }>()
  const { account, chainId, provider } = useWeb3React()
  const theme = useTheme()

  const toggleWalletDrawer = useToggleAccountDrawer() // toggle wallet when disconnected
  const expertMode = useIsExpertMode()
  const addTransaction = useTransactionAdder()
  const positionManager = useV3NFTPositionManagerContract()

  // check for existing position if tokenId in url
  const { position: existingPositionDetails, loading: positionLoading } = useV3PositionFromTokenId(
    tokenId ? BigNumber.from(tokenId) : undefined
  )
  const hasExistingPosition = !!existingPositionDetails && !positionLoading
  const { position: existingPosition } = useDerivedPositionInfo(existingPositionDetails)

  // fee selection from url
  const feeAmount: FeeAmount | undefined =
    feeAmountFromUrl && Object.values(FeeAmount).includes(parseFloat(feeAmountFromUrl))
      ? parseFloat(feeAmountFromUrl)
      : undefined

  const baseCurrency = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)
  // prevent an error if they input ETH/WETH
  const quoteCurrency =
    baseCurrency && currencyB && baseCurrency.wrapped.equals(currencyB.wrapped) ? undefined : currencyB

  // mint state
  const { independentField, typedValue, startPriceTypedValue } = useV3MintState()

  const {
    pool,
    ticks,
    dependentField,
    price,
    pricesAtTicks,
    quotePricesAtTicks,
    pricesAtLimit,
    parsedAmounts,
    currencyBalances,
    position,
    noLiquidity,
    currencies,
    errorMessage,
    invalidPool,
    invalidRange,
    outOfRange,
    depositADisabled,
    depositBDisabled,
    invertPrice,
    ticksAtLimit,
  } = useV3DerivedMintInfo(
    baseCurrency ?? undefined,
    quoteCurrency ?? undefined,
    feeAmount,
    baseCurrency ?? undefined,
    existingPosition
  )

  const { onFieldAInput, onFieldBInput, onLeftRangeInput, onRightRangeInput, onStartPriceInput } =
    useV3MintActionHandlers(noLiquidity)

  const isValid = !errorMessage && !invalidRange

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false) // clicked confirm

  // txn values
  const deadline = useTransactionDeadline() // custom from users settings

  const [txHash, setTxHash] = useState<string>('')

  // get formatted amounts
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  const usdcValues = {
    [Field.CURRENCY_A]: useStablecoinValue(parsedAmounts[Field.CURRENCY_A]),
    [Field.CURRENCY_B]: useStablecoinValue(parsedAmounts[Field.CURRENCY_B]),
  }

  // get the max amounts user can add
  const maxAmounts: { [field in Field]?: CurrencyAmount<Currency> } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmountSpend(currencyBalances[field]),
      }
    },
    {}
  )

  const atMaxAmounts: { [field in Field]?: CurrencyAmount<Currency> } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmounts[field]?.equalTo(parsedAmounts[field] ?? '0'),
      }
    },
    {}
  )

  const argentWalletContract = useArgentWalletContract()

  // check whether the user has approved the router on the tokens
  const [approvalA, approveACallback] = useApproveCallback(
    argentWalletContract ? undefined : parsedAmounts[Field.CURRENCY_A],
    chainId ? NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId] : undefined
  )
  const [approvalB, approveBCallback] = useApproveCallback(
    argentWalletContract ? undefined : parsedAmounts[Field.CURRENCY_B],
    chainId ? NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId] : undefined
  )

  const allowedSlippage = useUserSlippageToleranceWithDefault(
    outOfRange ? ZERO_PERCENT : DEFAULT_ADD_IN_RANGE_SLIPPAGE_TOLERANCE
  )

  async function onAdd() {
    if (!chainId || !provider || !account) return

    if (!positionManager || !baseCurrency || !quoteCurrency) {
      return
    }

    if (position && account && deadline) {
      const useNative = baseCurrency.isNative ? baseCurrency : quoteCurrency.isNative ? quoteCurrency : undefined
      const { calldata, value } =
        hasExistingPosition && tokenId
          ? NonfungiblePositionManager.addCallParameters(position, {
              tokenId,
              slippageTolerance: allowedSlippage,
              deadline: deadline.toString(),
              useNative,
            })
          : NonfungiblePositionManager.addCallParameters(position, {
              slippageTolerance: allowedSlippage,
              recipient: account,
              deadline: deadline.toString(),
              useNative,
              createPool: noLiquidity,
            })

      let txn: { to: string; data: string; value: string } = {
        to: NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId],
        data: calldata,
        value,
      }

      if (argentWalletContract) {
        const amountA = parsedAmounts[Field.CURRENCY_A]
        const amountB = parsedAmounts[Field.CURRENCY_B]
        const batch = [
          ...(amountA && amountA.currency.isToken
            ? [approveAmountCalldata(amountA, NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId])]
            : []),
          ...(amountB && amountB.currency.isToken
            ? [approveAmountCalldata(amountB, NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId])]
            : []),
          {
            to: txn.to,
            data: txn.data,
            value: txn.value,
          },
        ]
        const data = argentWalletContract.interface.encodeFunctionData('wc_multiCall', [batch])
        txn = {
          to: argentWalletContract.address,
          data,
          value: '0x0',
        }
      }

      setAttemptingTxn(true)

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
            .then(async (response: TransactionResponse) => {
              setAttemptingTxn(false)
              addTransaction(response, {
                type: TransactionType.ADD_LIQUIDITY_V3_POOL,
                baseCurrencyId: currencyId(baseCurrency),
                quoteCurrencyId: currencyId(quoteCurrency),
                createPool: Boolean(noLiquidity),
                expectedAmountBaseRaw: parsedAmounts[Field.CURRENCY_A]?.quotient?.toString() ?? '0',
                expectedAmountQuoteRaw: parsedAmounts[Field.CURRENCY_B]?.quotient?.toString() ?? '0',
                feeAmount: position.pool.fee,
              })
              setTxHash(response.hash)
              sendEvent({
                category: 'Liquidity',
                action: 'Add',
                label: [currencies[Field.CURRENCY_A]?.symbol, currencies[Field.CURRENCY_B]?.symbol].join('/'),
              })

              await sendEventToGalxe(account, 'liquidty')
            })
        })
        .catch((error) => {
          console.error('Failed to send transaction', error)
          setAttemptingTxn(false)
          // we only care if the error is something _other_ than the user rejected the tx
          if (error?.code !== 4001) {
            console.error(error)
          }
        })
    } else {
      return
    }
  }

  const handleCurrencySelect = useCallback(
    (currencyNew: Currency, currencyIdOther?: string): (string | undefined)[] => {
      const currencyIdNew = currencyId(currencyNew)

      if (currencyIdNew === currencyIdOther) {
        // not ideal, but for now clobber the other if the currency ids are equal
        return [currencyIdNew, undefined]
      } else {
        // prevent weth + eth
        const isETHOrWETHNew =
          currencyIdNew === 'ETH' ||
          (chainId !== undefined && currencyIdNew === WRAPPED_NATIVE_CURRENCY[chainId]?.address)
        const isETHOrWETHOther =
          currencyIdOther !== undefined &&
          (currencyIdOther === 'ETH' ||
            (chainId !== undefined && currencyIdOther === WRAPPED_NATIVE_CURRENCY[chainId]?.address))

        if (isETHOrWETHNew && isETHOrWETHOther) {
          return [currencyIdNew, undefined]
        } else {
          return [currencyIdNew, currencyIdOther]
        }
      }
    },
    [chainId]
  )

  // get value and prices at ticks
  const { [Bound.LOWER]: tickLower, [Bound.UPPER]: tickUpper } = ticks
  const { [Bound.LOWER]: priceLower, [Bound.UPPER]: priceUpper } = pricesAtTicks
  // ! TODO: check
  const { [Bound.LOWER]: priceQuoteLower, [Bound.UPPER]: priceQuoteUpper } = quotePricesAtTicks

  const { getDecrementLower, getIncrementLower, getDecrementUpper, getIncrementUpper, getSetFullRange } =
    useRangeHopCallbacks(baseCurrency ?? undefined, quoteCurrency ?? undefined, feeAmount, tickLower, tickUpper, pool)

  // we need an existence check on parsed amounts for single-asset deposits
  const showApprovalA =
    !argentWalletContract && approvalA !== ApprovalState.APPROVED && !!parsedAmounts[Field.CURRENCY_A]
  const showApprovalB =
    !argentWalletContract && approvalB !== ApprovalState.APPROVED && !!parsedAmounts[Field.CURRENCY_B]

  const pendingText = `Supplying ${!depositADisabled ? parsedAmounts[Field.CURRENCY_A]?.toSignificant(6) : ''} ${
    !depositADisabled ? currencies[Field.CURRENCY_A]?.symbol : ''
  } ${!outOfRange ? 'and' : ''} ${!depositBDisabled ? parsedAmounts[Field.CURRENCY_B]?.toSignificant(6) : ''} ${
    !depositBDisabled ? currencies[Field.CURRENCY_B]?.symbol : ''
  }`

  const handleSetFullRange = useCallback(() => {
    setCurrentMode(RANGE.FULL_RANGE)
    getSetFullRange()

    const minPrice = pricesAtLimit[Bound.LOWER]
    if (minPrice) searchParams.set('minPrice', minPrice.toSignificant(5))
    const maxPrice = pricesAtLimit[Bound.UPPER]
    if (maxPrice) searchParams.set('maxPrice', maxPrice.toSignificant(5))

    if (minPrice && maxPrice) setValue1([Number(minPrice.toSignificant(5)), Number(maxPrice.toSignificant(5))])

    sendEvent({
      category: 'Liquidity',
      action: 'Full Range Clicked',
    })
  }, [getSetFullRange, pricesAtLimit, searchParams, setSearchParams])

  const handleFeePoolSelectManual = useCallback(
    (newFeeAmount: FeeAmount, token0?: string, token1?: string) => {
      onLeftRangeInput('')
      onRightRangeInput('')
      navigate(`/add/${token0}/${token1}/${newFeeAmount}`)
      handleSetFullRange()
      onStartPriceInput('')
    },
    [navigate, onLeftRangeInput, onRightRangeInput, handleSetFullRange, onStartPriceInput]
  )

  const handleFeePoolSelect = useCallback(
    (newFeeAmount: FeeAmount) => {
      onLeftRangeInput('')
      onRightRangeInput('')
      navigate(`/add/${currencyIdA}/${currencyIdB}/${newFeeAmount}`)
      handleSetFullRange()
      onStartPriceInput('')
    },
    [currencyIdA, currencyIdB, navigate, onLeftRangeInput, onRightRangeInput, handleSetFullRange, onStartPriceInput]
  )

  const clearAllInput = useCallback(() => {
    onFieldAInput('')
    onFieldBInput('')
  }, [onFieldAInput, onFieldBInput, handleFeePoolSelect])

  const handleCurrencyASelect = useCallback(
    (currencyANew: Currency) => {
      const [idA, idB] = handleCurrencySelect(currencyANew, currencyIdB)
      if (idB === undefined) {
        navigate(`/add/${idA}`)
      } else {
        navigate(`/add/${idA}/${idB}`)
      }
      onFieldAInput('')
      // clearAllInput()
      handleFeePoolSelectManual(3000, idA, idB)
    },
    [handleCurrencySelect, currencyIdB, navigate, handleFeePoolSelectManual]
  )

  const handleCurrencyBSelect = useCallback(
    (currencyBNew: Currency) => {
      const [idB, idA] = handleCurrencySelect(currencyBNew, currencyIdA)
      if (idA === undefined) {
        navigate(`/add/${idB}`)
      } else {
        navigate(`/add/${idA}/${idB}`)
      }
      onFieldBInput('')
      handleFeePoolSelectManual(3000, idA, idB)
    },
    [handleCurrencySelect, currencyIdA, navigate, handleFeePoolSelectManual]
  )

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onFieldAInput('')
      // dont jump to pool page if creating
      navigate('/pools')
    }
    setTxHash('')
  }, [navigate, onFieldAInput, txHash])

  const addIsUnsupported = useIsSwapUnsupported(currencies?.CURRENCY_A, currencies?.CURRENCY_B)

  const clearAll = useCallback(() => {
    onFieldAInput('')
    onFieldBInput('')
    onLeftRangeInput('')
    onRightRangeInput('')
    navigate(`/add`)
  }, [navigate, onFieldAInput, onFieldBInput, onLeftRangeInput, onRightRangeInput])

  const handleSetActiveRange = useCallback(() => {
    const currentPrice = invertPrice ? price?.invert() : price

    if (currentPrice && feeAmount) {
      const tick = tryParseTick(
        currentPrice?.baseCurrency,
        currentPrice?.quoteCurrency,
        feeAmount,
        currentPrice.toFixed(5)
      )

      if (tick != undefined) {
        // ticks[Bound.LOWER] = low - TICK_SPACINGS[feeAmount] * 25
        // ticks[Bound.UPPER] = low + TICK_SPACINGS[feeAmount] * 25

        if (!invertPrice) {
          const baseCurrency = currentPrice?.baseCurrency
          const quoteCurrency = currentPrice?.quoteCurrency
          console.log('baseCurrency', baseCurrency)
          // const priceAtTickLower = getTickToPrice(baseCurrency, quoteCurrency, ticks[Bound.UPPER])
          // const priceAtTickUpper = getTickToPrice(baseCurrency, quoteCurrency, ticks[Bound.LOWER])
          const priceAtTickLower = getTickToPrice(baseCurrency, quoteCurrency, tick - TICK_SPACINGS[feeAmount] * 25)
          const priceAtTickUpper = getTickToPrice(baseCurrency, quoteCurrency, tick + TICK_SPACINGS[feeAmount] * 25)

          console.log('priceAtTick', priceAtTickLower?.toFixed(5), priceAtTickUpper?.toFixed(5))

          // const midUpper = ( (Number(priceAtTickUpper?.toSignificant(8)) + Number(currentPrice.toSignificant(8)))/4 )
          //@ts-ignore
          searchParams.set('minPrice', priceAtTickLower.toSignificant(8).toString())
          //@ts-ignore
          searchParams.set('maxPrice', priceAtTickUpper.toSignificant(8).toString())
          setSearchParams(searchParams)

          //@ts-ignore
          onLeftRangeInput(priceAtTickLower.toSignificant(8).toString())
          //@ts-ignore
          onRightRangeInput(priceAtTickUpper.toSignificant(8).toString())
          setValue1([
            Number(priceAtTickLower?.toSignificant(8).toString()),
            Number(priceAtTickUpper?.toSignificant(8).toString()),
          ])
        } else {
          const baseCurrency = currentPrice?.baseCurrency
          const quoteCurrency = currentPrice?.quoteCurrency
          // const priceAtTickLower = getTickToPrice(baseCurrency, quoteCurrency, ticks[Bound.UPPER])
          // const priceAtTickUpper = getTickToPrice(baseCurrency, quoteCurrency, ticks[Bound.LOWER])
          const priceAtTickLower = getTickToPrice(baseCurrency, quoteCurrency, tick + TICK_SPACINGS[feeAmount] * 25)
          const priceAtTickUpper = getTickToPrice(baseCurrency, quoteCurrency, tick - TICK_SPACINGS[feeAmount] * 25)

          console.log('priceAtTick', priceAtTickLower?.toFixed(5), priceAtTickUpper?.toFixed(5))

          //@ts-ignore
          searchParams.set('minPrice', priceAtTickLower.toSignificant(5).toString())
          //@ts-ignore
          searchParams.set('maxPrice', priceAtTickUpper.toSignificant(5).toString())
          setSearchParams(searchParams)

          //@ts-ignore
          onLeftRangeInput(priceAtTickLower.toSignificant(8).toString())
          //@ts-ignore
          onRightRangeInput(priceAtTickUpper.toSignificant(8).toString())
        }

        console.log('ticks', ticks)
        console.log(pricesAtTicks[Bound.LOWER]?.toFixed(5), pricesAtTicks[Bound.UPPER]?.toFixed(5))
      } else {
        if (!invertPrice) {
          const baseCurrency = currentPrice?.baseCurrency
          const quoteCurrency = currentPrice?.quoteCurrency

          const closestTickLower = priceToClosestTick(currentPrice) - TICK_SPACINGS[feeAmount] * 25
          const closestTickUpper = priceToClosestTick(currentPrice) + TICK_SPACINGS[feeAmount] * 25
          console.log('closestTickLower', closestTickLower, closestTickUpper)
          const priceAtTickLower = getTickToPrice(baseCurrency, quoteCurrency, closestTickLower)
          const priceAtTickUpper = getTickToPrice(baseCurrency, quoteCurrency, closestTickUpper)

          console.log('priceAtTick', priceAtTickLower?.toFixed(5), priceAtTickUpper?.toFixed(5))

          // const midUpper = ( (Number(priceAtTickUpper?.toSignificant(8)) + Number(currentPrice.toSignificant(8)))/4 )
          //@ts-ignore
          searchParams.set('minPrice', priceAtTickLower.toSignificant(8).toString())
          //@ts-ignore
          searchParams.set('maxPrice', priceAtTickUpper.toSignificant(8).toString())
          setSearchParams(searchParams)

          //@ts-ignore
          onLeftRangeInput(priceAtTickLower.toSignificant(8).toString())
          //@ts-ignore
          onRightRangeInput(priceAtTickUpper.toSignificant(8).toString())
          setValue1([
            Number(priceAtTickLower?.toSignificant(8).toString()),
            Number(priceAtTickUpper?.toSignificant(8).toString()),
          ])
        } else {
          const baseCurrency = currentPrice?.baseCurrency
          const quoteCurrency = currentPrice?.quoteCurrency
          // const priceAtTickLower = getTickToPrice(baseCurrency, quoteCurrency, ticks[Bound.UPPER])
          // const priceAtTickUpper = getTickToPrice(baseCurrency, quoteCurrency, ticks[Bound.LOWER])
          const closestTickLower = priceToClosestTick(currentPrice) + TICK_SPACINGS[feeAmount] * 25
          const closestTickUpper = priceToClosestTick(currentPrice) - TICK_SPACINGS[feeAmount] * 25
          console.log('closestTickLower', closestTickLower, closestTickUpper)
          const priceAtTickLower = getTickToPrice(baseCurrency, quoteCurrency, closestTickLower)
          const priceAtTickUpper = getTickToPrice(baseCurrency, quoteCurrency, closestTickUpper)

          console.log('priceAtTick', priceAtTickLower?.toFixed(5), priceAtTickUpper?.toFixed(5))

          //@ts-ignore
          searchParams.set('minPrice', priceAtTickLower.toSignificant(5).toString())
          //@ts-ignore
          searchParams.set('maxPrice', priceAtTickUpper.toSignificant(5).toString())
          setSearchParams(searchParams)

          //@ts-ignore
          onLeftRangeInput(priceAtTickLower.toSignificant(8).toString())
          //@ts-ignore
          onRightRangeInput(priceAtTickUpper.toSignificant(8).toString())
        }
      } /* else {
        const closestTickLower = priceToClosestTick(currentPrice) - TICK_SPACINGS[feeAmount] * 5
        const closestTickUpper = priceToClosestTick(currentPrice) + TICK_SPACINGS[feeAmount] * 5
        console.log('closestTickLower', closestTickLower, closestTickUpper)

        ticks[Bound.LOWER] = closestTickLower
        ticks[Bound.UPPER] = closestTickUpper
      } */
    }

    // tryParseTick(currentPrice?.baseCurrency, currentPrice?.quoteCurrency, feeAmount, currentPrice)
  }, [
    invertPrice,
    price,
    searchParams,
    setSearchParams,
    feeAmount,
    onRightRangeInput,
    onLeftRangeInput,
    pricesAtTicks,
    ticks,
  ])

  const handleSetConservativeRange = useCallback(() => {
    const currentPrice = invertPrice ? price?.invert() : price

    if (currentPrice && feeAmount) {
      const tick = tryParseTick(
        currentPrice?.baseCurrency,
        currentPrice?.quoteCurrency,
        feeAmount,
        currentPrice.toFixed(5)
      )

      if (tick != undefined) {
        // ticks[Bound.LOWER] = low - TICK_SPACINGS[feeAmount] * 25
        // ticks[Bound.UPPER] = low + TICK_SPACINGS[feeAmount] * 25

        if (!invertPrice) {
          const baseCurrency = currentPrice?.baseCurrency
          const quoteCurrency = currentPrice?.quoteCurrency
          console.log('baseCurrency', baseCurrency)
          // const priceAtTickLower = getTickToPrice(baseCurrency, quoteCurrency, ticks[Bound.UPPER])
          // const priceAtTickUpper = getTickToPrice(baseCurrency, quoteCurrency, ticks[Bound.LOWER])
          const priceAtTickLower = getTickToPrice(baseCurrency, quoteCurrency, tick - TICK_SPACINGS[feeAmount] * 60)
          const priceAtTickUpper = getTickToPrice(baseCurrency, quoteCurrency, tick + TICK_SPACINGS[feeAmount] * 60)

          console.log('priceAtTick', priceAtTickLower?.toFixed(5), priceAtTickUpper?.toFixed(5))

          // const midUpper = ( (Number(priceAtTickUpper?.toSignificant(8)) + Number(currentPrice.toSignificant(8)))/4 )
          //@ts-ignore
          searchParams.set('minPrice', priceAtTickLower.toSignificant(8).toString())
          //@ts-ignore
          searchParams.set('maxPrice', priceAtTickUpper.toSignificant(8).toString())
          setSearchParams(searchParams)

          //@ts-ignore
          onLeftRangeInput(priceAtTickLower.toSignificant(8).toString())
          //@ts-ignore
          onRightRangeInput(priceAtTickUpper.toSignificant(8).toString())
          setValue1([
            Number(priceAtTickLower?.toSignificant(8).toString()),
            Number(priceAtTickUpper?.toSignificant(8).toString()),
          ])
        } else {
          const baseCurrency = currentPrice?.baseCurrency
          const quoteCurrency = currentPrice?.quoteCurrency
          // const priceAtTickLower = getTickToPrice(baseCurrency, quoteCurrency, ticks[Bound.UPPER])
          // const priceAtTickUpper = getTickToPrice(baseCurrency, quoteCurrency, ticks[Bound.LOWER])
          const priceAtTickLower = getTickToPrice(baseCurrency, quoteCurrency, tick + TICK_SPACINGS[feeAmount] * 60)
          const priceAtTickUpper = getTickToPrice(baseCurrency, quoteCurrency, tick - TICK_SPACINGS[feeAmount] * 60)

          console.log('priceAtTick', priceAtTickLower?.toFixed(5), priceAtTickUpper?.toFixed(5))

          //@ts-ignore
          searchParams.set('minPrice', priceAtTickLower.toSignificant(5).toString())
          //@ts-ignore
          searchParams.set('maxPrice', priceAtTickUpper.toSignificant(5).toString())
          setSearchParams(searchParams)

          //@ts-ignore
          onLeftRangeInput(priceAtTickLower.toSignificant(8).toString())
          //@ts-ignore
          onRightRangeInput(priceAtTickUpper.toSignificant(8).toString())
        }

        console.log('ticks', ticks)
        console.log(pricesAtTicks[Bound.LOWER]?.toFixed(5), pricesAtTicks[Bound.UPPER]?.toFixed(5))
      } else {
        if (!invertPrice) {
          const baseCurrency = currentPrice?.baseCurrency
          const quoteCurrency = currentPrice?.quoteCurrency

          const closestTickLower = priceToClosestTick(currentPrice) - TICK_SPACINGS[feeAmount] * 60
          const closestTickUpper = priceToClosestTick(currentPrice) + TICK_SPACINGS[feeAmount] * 60
          console.log('closestTickLower', closestTickLower, closestTickUpper)
          const priceAtTickLower = getTickToPrice(baseCurrency, quoteCurrency, closestTickLower)
          const priceAtTickUpper = getTickToPrice(baseCurrency, quoteCurrency, closestTickUpper)

          console.log('priceAtTick', priceAtTickLower?.toFixed(5), priceAtTickUpper?.toFixed(5))

          // const midUpper = ( (Number(priceAtTickUpper?.toSignificant(8)) + Number(currentPrice.toSignificant(8)))/4 )
          //@ts-ignore
          searchParams.set('minPrice', priceAtTickLower.toSignificant(8).toString())
          //@ts-ignore
          searchParams.set('maxPrice', priceAtTickUpper.toSignificant(8).toString())
          setSearchParams(searchParams)

          //@ts-ignore
          onLeftRangeInput(priceAtTickLower.toSignificant(8).toString())
          //@ts-ignore
          onRightRangeInput(priceAtTickUpper.toSignificant(8).toString())
          setValue1([
            Number(priceAtTickLower?.toSignificant(8).toString()),
            Number(priceAtTickUpper?.toSignificant(8).toString()),
          ])
        } else {
          const baseCurrency = currentPrice?.baseCurrency
          const quoteCurrency = currentPrice?.quoteCurrency
          // const priceAtTickLower = getTickToPrice(baseCurrency, quoteCurrency, ticks[Bound.UPPER])
          // const priceAtTickUpper = getTickToPrice(baseCurrency, quoteCurrency, ticks[Bound.LOWER])
          const closestTickLower = priceToClosestTick(currentPrice) + TICK_SPACINGS[feeAmount] * 60
          const closestTickUpper = priceToClosestTick(currentPrice) - TICK_SPACINGS[feeAmount] * 60
          console.log('closestTickLower', closestTickLower, closestTickUpper)
          const priceAtTickLower = getTickToPrice(baseCurrency, quoteCurrency, closestTickLower)
          const priceAtTickUpper = getTickToPrice(baseCurrency, quoteCurrency, closestTickUpper)

          console.log('priceAtTick', priceAtTickLower?.toFixed(5), priceAtTickUpper?.toFixed(5))

          //@ts-ignore
          searchParams.set('minPrice', priceAtTickLower.toSignificant(5).toString())
          //@ts-ignore
          searchParams.set('maxPrice', priceAtTickUpper.toSignificant(5).toString())
          setSearchParams(searchParams)

          //@ts-ignore
          onLeftRangeInput(priceAtTickLower.toSignificant(8).toString())
          //@ts-ignore
          onRightRangeInput(priceAtTickUpper.toSignificant(8).toString())
        }
      } /* else {
        const closestTickLower = priceToClosestTick(currentPrice) - TICK_SPACINGS[feeAmount] * 5
        const closestTickUpper = priceToClosestTick(currentPrice) + TICK_SPACINGS[feeAmount] * 5
        console.log('closestTickLower', closestTickLower, closestTickUpper)

        ticks[Bound.LOWER] = closestTickLower
        ticks[Bound.UPPER] = closestTickUpper
      } */
    }

    // tryParseTick(currentPrice?.baseCurrency, currentPrice?.quoteCurrency, feeAmount, currentPrice)
  }, [
    invertPrice,
    price,
    searchParams,
    setSearchParams,
    feeAmount,
    onRightRangeInput,
    onLeftRangeInput,
    pricesAtTicks,
    ticks,
  ])

  // useEffect(() => {
  //   if(pool) {
  //     handleSetFullRange()
  //   }
  // }, [pool, handleFeePoolSelect])

  // START: sync values with query string
  const oldSearchParams = usePrevious(searchParams)
  // use query string as an input to onInput handlers
  useEffect(() => {
    const minPrice = searchParams.get('minPrice')
    const oldMinPrice = oldSearchParams?.get('minPrice')
    if (
      minPrice &&
      typeof minPrice === 'string' &&
      !isNaN(minPrice as any) &&
      (!oldMinPrice || oldMinPrice !== minPrice)
    ) {
      onLeftRangeInput(minPrice)
    }
    // disable eslint rule because this hook only cares about the url->input state data flow
    // input state -> url updates are handled in the input handlers
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])
  useEffect(() => {
    const maxPrice = searchParams.get('maxPrice')
    const oldMaxPrice = oldSearchParams?.get('maxPrice')
    if (
      maxPrice &&
      typeof maxPrice === 'string' &&
      !isNaN(maxPrice as any) &&
      (!oldMaxPrice || oldMaxPrice !== maxPrice)
    ) {
      onRightRangeInput(maxPrice)
    }
    // disable eslint rule because this hook only cares about the url->input state data flow
    // input state -> url updates are handled in the input handlers
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])
  // END: sync values with query string

  const ButtonsToAction = () =>
    addIsUnsupported ? (
      <ButtonPrimary disabled={true} $borderRadius="12px" padding="12px">
        <ThemedText.DeprecatedMain mb="4px">
          <Trans>Unsupported Asset</Trans>
        </ThemedText.DeprecatedMain>
      </ButtonPrimary>
    ) : !account ? (
      <TraceEvent
        events={[BrowserEvent.onClick]}
        name={InterfaceEventName.CONNECT_WALLET_BUTTON_CLICKED}
        properties={{ received_swap_quote: false }}
        element={InterfaceElementName.CONNECT_WALLET_BUTTON}
      >
        <ButtonWrapper isPreviewPage={isPreviewPage}>
          <DDButtonLight onClick={toggleWalletDrawer} className="btn-overridable" $borderRadius="12px" padding="12px">
            <Trans>Connect Wallet</Trans>
          </DDButtonLight>
        </ButtonWrapper>
      </TraceEvent>
    ) : (
      <AutoColumn className="overridable-input" gap="md">
        <ButtonWrapper isPreviewPage={isPreviewPage}>
          {(approvalA === ApprovalState.NOT_APPROVED ||
            approvalA === ApprovalState.PENDING ||
            approvalB === ApprovalState.NOT_APPROVED ||
            approvalB === ApprovalState.PENDING) &&
            isValid && (
              <RowBetween>
                {showApprovalA && (
                  <DDButtonPrimary
                    fontSize="16px"
                    onClick={approveACallback}
                    disabled={approvalA === ApprovalState.PENDING}
                    width={showApprovalB ? '48%' : '100%'}
                  >
                    {approvalA === ApprovalState.PENDING ? (
                      <Dots>
                        <Trans>Approving {currencies[Field.CURRENCY_A]?.symbol}</Trans>
                      </Dots>
                    ) : (
                      <Trans>Approve {currencies[Field.CURRENCY_A]?.symbol}</Trans>
                    )}
                  </DDButtonPrimary>
                )}
                {showApprovalB && (
                  <DDButtonPrimary
                    fontSize="16px"
                    onClick={approveBCallback}
                    disabled={approvalB === ApprovalState.PENDING}
                    width={showApprovalA ? '48%' : '100%'}
                  >
                    {approvalB === ApprovalState.PENDING ? (
                      <Dots>
                        <Trans>Approving {currencies[Field.CURRENCY_B]?.symbol}</Trans>
                      </Dots>
                    ) : (
                      <Trans>Approve {currencies[Field.CURRENCY_B]?.symbol}</Trans>
                    )}
                  </DDButtonPrimary>
                )}
              </RowBetween>
            )}
          <DDButtonError
            className="btn-overridable"
            style={{
              borderRadius: '16px',
              border: '2px solid #344D73',
              boxShadow: '3px 3px 0px 0px #000',
              width: '100%',
            }}
            minHeight="50px"
            onClick={() => {
              expertMode ? onAdd() : setShowConfirm(true)
            }}
            disabled={
              !isValid ||
              (!argentWalletContract && approvalA !== ApprovalState.APPROVED && !depositADisabled) ||
              (!argentWalletContract && approvalB !== ApprovalState.APPROVED && !depositBDisabled)
            }
            error={!isValid && !!parsedAmounts[Field.CURRENCY_A] && !!parsedAmounts[Field.CURRENCY_B]}
          >
            <GloriaText weight={400}>{errorMessage ? errorMessage : <Trans>Preview</Trans>}</GloriaText>
          </DDButtonError>
        </ButtonWrapper>
      </AutoColumn>
    )

  const usdcValueCurrencyA = usdcValues[Field.CURRENCY_A]
  const usdcValueCurrencyB = usdcValues[Field.CURRENCY_B]
  const currencyAFiat = useMemo(
    () => ({
      data: usdcValueCurrencyA ? parseFloat(usdcValueCurrencyA.toSignificant()) : undefined,
      isLoading: false,
    }),
    [usdcValueCurrencyA]
  )
  const currencyBFiat = useMemo(
    () => ({
      data: usdcValueCurrencyB ? parseFloat(usdcValueCurrencyB.toSignificant()) : undefined,
      isLoading: false,
    }),
    [usdcValueCurrencyB]
  )

  const owner = useSingleCallResult(tokenId ? positionManager : null, 'ownerOf', [tokenId]).result?.[0]
  const ownsNFT =
    addressesAreEquivalent(owner, account) || addressesAreEquivalent(existingPositionDetails?.operator, account)
  const showOwnershipWarning = Boolean(hasExistingPosition && account && !ownsNFT)

  const [currentMode, setCurrentMode] = useState<RANGE>(RANGE.FULL_RANGE)
  const [sliderMin, setSliderMin] = useState<number>(0)
  const [sliderMax, setSliderMax] = useState<number>(0)

  const handleSetCustomRange = useCallback(() => {
    setCurrentMode(RANGE.CUSTOM)
    getSetFullRange()

    const minPrice = pricesAtLimit[Bound.LOWER]
    if (minPrice) searchParams.set('minPrice', minPrice.toSignificant(5))
    const maxPrice = pricesAtLimit[Bound.UPPER]
    if (maxPrice) searchParams.set('maxPrice', maxPrice.toSignificant(5))
    setSearchParams(searchParams)

    sendEvent({
      category: 'Liquidity',
      action: 'Full Range Clicked',
    })
  }, [getSetFullRange, pricesAtLimit, searchParams, setSearchParams])

  useEffect(() => {
    if (pool && invertPrice && (currentMode === RANGE.ACTIVE || currentMode === RANGE.CONSERVATIVE)) {
      setSliderMin(Number(priceQuoteLower?.toSignificant(6)) / 5)
      setSliderMax(Number(priceQuoteUpper?.toSignificant(6)) * 1.5)
      setValue1([Number(priceQuoteLower?.toSignificant(6)), Number(priceQuoteUpper?.toSignificant(6))])
    } else if (pool && !invertPrice && (currentMode === RANGE.ACTIVE || currentMode === RANGE.CONSERVATIVE)) {
      setSliderMin(Number(priceLower?.toSignificant(6)) / 5)
      setSliderMax(Number(priceUpper?.toSignificant(6)) * 1.5)
      setValue1([Number(priceLower?.toSignificant(6)), Number(priceUpper?.toSignificant(6))])
    } else if (currentMode === RANGE.FULL_RANGE || currentMode === RANGE.CUSTOM) {
      setSliderMin(Number(pricesAtLimit[Bound.LOWER]?.toSignificant(5)))
      setSliderMax(Number(pricesAtLimit[Bound.UPPER]?.toSignificant(5)))
      setValue1([
        Number(pricesAtLimit[Bound.LOWER]?.toSignificant(5)),
        Number(pricesAtLimit[Bound.UPPER]?.toSignificant(5)),
      ])
    }
  }, [pool, invertPrice, currentMode])

  const [disableSlider, setDisableSlider] = useState<boolean>(false)

  useEffect(() => {
    if (currentMode === RANGE.FULL_RANGE || currentMode === RANGE.CUSTOM) {
      setDisableSlider(true)
    } else {
      setDisableSlider(false)
    }
  }, [currentMode])

  const handleChange1 = (event: Event, newValue: number | number[], activeThumb: number) => {
    if (!Array.isArray(newValue)) {
      return
    }
    if (activeThumb === 0) {
      setValue1([newValue[0], value1[1]])
    } else {
      setValue1([value1[0], newValue[1]])
    }
  }

  const onMouseCommitted = (data: number | number[]) => {
    if (!Array.isArray(data)) {
      return
    }
    onLeftRangeInput(data[0].toString())
    onRightRangeInput(data[1].toString())
  }

  const handleRangeModeSelector = useCallback(
    (data: RANGE) => {
      switch (data) {
        case RANGE.CONSERVATIVE:
          handleSetConservativeRange()
          setCurrentMode(RANGE.CONSERVATIVE)
          break
        case RANGE.ACTIVE:
          handleSetActiveRange()
          setCurrentMode(RANGE.ACTIVE)
          break
        case RANGE.FULL_RANGE:
          handleSetFullRange()
          setCurrentMode(RANGE.FULL_RANGE)
          break
        case RANGE.CUSTOM:
          handleSetCustomRange()
          setCurrentMode(RANGE.CUSTOM)
          break
        default:
          null
      }
    },
    [pool]
  )

  const { loading: loadingLatestPosition, positionWithHighestLiquidity } = useV3LatestPositionsByFeeOfPair(
    account,
    !invertPrice ? baseCurrency : quoteCurrency,
    !invertPrice ? quoteCurrency : baseCurrency,
    feeAmount
  )

  const {
    fee: feeAmountExistingLiquidity,
    liquidity: liquidityAmountExistingLiquidity,
    tickLower: tickLowerExisitngLiquidity,
    tickUpper: tickUpperExisitngLiquidity,
    tokenId: tokenIdExisitngLiquidity,
  } = positionWithHighestLiquidity || {}

  const [poolState, poolOfLatestLiquidity] = useDerpPool(
    baseCurrency ?? undefined,
    quoteCurrency ?? undefined,
    feeAmount
  )

  const removed = liquidityAmountExistingLiquidity?.eq(0)
  const below =
    poolOfLatestLiquidity && typeof tickLowerExisitngLiquidity === 'number'
      ? poolOfLatestLiquidity.tickCurrent < tickLowerExisitngLiquidity
      : undefined
  const above =
    poolOfLatestLiquidity && typeof tickUpperExisitngLiquidity === 'number'
      ? poolOfLatestLiquidity.tickCurrent >= tickUpperExisitngLiquidity
      : undefined
  const inRange: boolean = typeof below === 'boolean' && typeof above === 'boolean' ? !below && !above : false

  const positionOfLatestLiquidity = useMemo(() => {
    if (
      poolOfLatestLiquidity &&
      liquidityAmountExistingLiquidity &&
      tickLowerExisitngLiquidity &&
      typeof tickLowerExisitngLiquidity === 'number' &&
      tickUpperExisitngLiquidity &&
      typeof tickUpperExisitngLiquidity === 'number'
    ) {
      return new Position({
        pool: poolOfLatestLiquidity,
        liquidity: liquidityAmountExistingLiquidity.toString(),
        tickLower:
          tickLowerExisitngLiquidity && typeof tickLowerExisitngLiquidity === 'number'
            ? Number(tickLowerExisitngLiquidity)
            : 0,
        tickUpper:
          tickUpperExisitngLiquidity && typeof tickUpperExisitngLiquidity === 'number'
            ? Number(tickUpperExisitngLiquidity)
            : 0,
      })
    }
    return undefined
  }, [liquidityAmountExistingLiquidity, poolOfLatestLiquidity, tickLowerExisitngLiquidity, tickUpperExisitngLiquidity])

  const location = useLocation()

  // Check if the current location is a preview page
  const isPreviewPage = location.pathname.includes('increase')

  const isValidToLoad = useMemo(() => {
    return poolState !== PoolState.INVALID
  }, [poolState])

  const isValidToLoadExist = useMemo(() => {
    return poolState === PoolState.EXISTS
  }, [poolState])

  const hasLoading = useMemo(() => {
    return poolState === PoolState.LOADING
  }, [poolState])

  const isNotExistPool = useMemo(() => {
    return poolState === PoolState.NOT_EXISTS
  }, [poolState])

  return (
    <>
      {(!isPreviewPage && !hasLoading) ||
      (!hasLoading && isValidToLoadExist && isPreviewPage && !positionLoading && !isNotExistPool) ? (
        <DerpScrollablePage>
          <TransactionConfirmationModalLiquidity
            modalType={ModalType.INCREASE_LIQUIDITY}
            isOpen={showConfirm}
            onDismiss={handleDismissConfirmation}
            attemptingTxn={attemptingTxn}
            hash={txHash}
            reviewContent={() => (
              <ConfirmationModalContentLiquidity
                disableCloseButton={true}
                // title={<Trans>Add Liquidity</Trans>}
                onDismiss={handleDismissConfirmation}
                topContent={() => (
                  <Review
                    parsedAmounts={parsedAmounts}
                    position={position}
                    existingPosition={existingPosition}
                    priceLower={priceLower}
                    priceUpper={priceUpper}
                    outOfRange={outOfRange}
                    ticksAtLimit={ticksAtLimit}
                  />
                )}
                bottomContent={() => (
                  <TwoButtonRow
                    style={{
                      marginTop: '10px',
                    }}
                  >
                    <div className="btn" onClick={handleDismissConfirmation}>
                      <NunitoText size="lg2">Cancel</NunitoText>
                    </div>
                    <div className="btn btn-confirm" onClick={onAdd}>
                      <NunitoText size="lg2">Confirm</NunitoText>
                    </div>
                  </TwoButtonRow>
                )}
              />
            )}
            pendingText={pendingText}
          />
          <DerpPageWrapper className={styles.PageWrapperOverride}>
            <ResponsiveTwoColumns wide={!hasExistingPosition}>
              <AutoColumn className="overridable" id="main">
                {!hasExistingPosition && (
                  <>
                    <AutoColumn
                      style={{
                        alignSelf: 'flex-start',
                      }}
                    >
                      <PanelWrapper className="pair">
                        <Box height={106} display="flex" alignItems="flex-end">
                          <GloriaText
                            style={{
                              marginLeft: '16px',
                            }}
                            size="xxl"
                          >
                            Add Liquidity
                          </GloriaText>
                        </Box>
                        <div className={styles.OverrideRowBetween}>
                          <div className={styles.SelectPairWrapper}>
                            <NunitoText size="lg2" weight={700}>
                              Select a Pair
                            </NunitoText>
                          </div>
                          <div className={styles.CurrencyDropdownWrapper}>
                            <BoundedCurrency>
                              <CircledNumber>1</CircledNumber>
                              <CurrencyDropdown
                                value={formattedAmounts[Field.CURRENCY_A]}
                                onUserInput={onFieldAInput}
                                hideInput={true}
                                onMax={() => {
                                  onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? '')
                                }}
                                onCurrencySelect={handleCurrencyASelect}
                                showMaxButton={false}
                                currency={currencies[Field.CURRENCY_A] ?? null}
                                id="add-liquidity-input-tokena"
                                showCommonBases
                              />
                            </BoundedCurrency>

                            <BoundedCurrency>
                              <CircledNumber>2</CircledNumber>
                              <CurrencyDropdown
                                value={formattedAmounts[Field.CURRENCY_B]}
                                hideInput={true}
                                onUserInput={onFieldBInput}
                                onCurrencySelect={handleCurrencyBSelect}
                                onMax={() => {
                                  onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toExact() ?? '')
                                }}
                                showMaxButton={false}
                                currency={currencies[Field.CURRENCY_B] ?? null}
                                id="add-liquidity-input-tokenb"
                                showCommonBases
                              />
                            </BoundedCurrency>
                          </div>
                        </div>
                      </PanelWrapper>
                      <PanelWrapper>
                        <DynamicSection
                          style={{
                            cursor: `${positionWithHighestLiquidity ? 'pointer' : 'default'}`,
                          }}
                          gap="md"
                          disabled={!quoteCurrency || !baseCurrency}
                          onClick={() => {
                            if (positionWithHighestLiquidity) navigate(`/pool/${positionWithHighestLiquidity?.tokenId}`)
                          }}
                        >
                          <ExistingRangeContainer>
                            <div className="select-first">
                              {!quoteCurrency || !baseCurrency ? (
                                <NunitoText size="lg2" weight={700}>
                                  Select First
                                </NunitoText>
                              ) : (
                                <>
                                  <div className="output-data">
                                    <div className="flex-center">
                                      <CurrencyLogo currency={currencies[Field.CURRENCY_A] ?? null} size="26px" />
                                      <CurrencyLogo
                                        style={{ marginLeft: '-10px' }}
                                        currency={currencies[Field.CURRENCY_B] ?? null}
                                        size="26px"
                                      />
                                    </div>
                                    <div className="flex-currencies">
                                      {currencies[Field.CURRENCY_A] && currencies[Field.CURRENCY_A]?.name !== null ? (
                                        <NunitoText size="lg2" weight={700}>
                                          {currencies[Field.CURRENCY_A]?.symbol}
                                        </NunitoText>
                                      ) : null}
                                      /
                                      {currencies[Field.CURRENCY_B] && currencies[Field.CURRENCY_B]?.name !== null ? (
                                        <NunitoText size="lg2" weight={700}>
                                          {currencies[Field.CURRENCY_B]?.symbol}
                                        </NunitoText>
                                      ) : null}
                                    </div>
                                  </div>
                                  <div>
                                    <RangeBadge removed={removed} inRange={inRange} />
                                  </div>
                                </>
                              )}
                            </div>
                            <PositionWrapper>
                              <div className="flex-row-between">
                                <div className="flex-center">
                                  <CurrencyLogo
                                    style={{ marginRight: '0.5rem' }}
                                    currency={currencies[Field.CURRENCY_A] ?? null}
                                    size="26px"
                                  />
                                  {currencies[Field.CURRENCY_A] && currencies[Field.CURRENCY_A]?.name !== null ? (
                                    <NunitoText size="lg2" weight={700}>
                                      {currencies[Field.CURRENCY_A]?.symbol}
                                    </NunitoText>
                                  ) : null}
                                </div>
                                <div>
                                  {positionOfLatestLiquidity && positionOfLatestLiquidity?.amount1 ? (
                                    <>
                                      {invertPrice
                                        ? positionOfLatestLiquidity?.amount1.toSignificant(4)
                                        : positionOfLatestLiquidity?.amount0.toSignificant(4)}
                                    </>
                                  ) : (
                                    <>0</>
                                  )}
                                </div>
                              </div>
                              <div className="flex-row-between">
                                <div className="flex-center">
                                  <CurrencyLogo
                                    style={{ marginRight: '0.5rem' }}
                                    currency={currencies[Field.CURRENCY_B] ?? null}
                                    size="26px"
                                  />
                                  {currencies[Field.CURRENCY_B] && currencies[Field.CURRENCY_B]?.name !== null ? (
                                    <NunitoText size="lg2" weight={700}>
                                      {currencies[Field.CURRENCY_B]?.symbol}
                                    </NunitoText>
                                  ) : null}
                                </div>
                                <div>
                                  {positionOfLatestLiquidity && positionOfLatestLiquidity?.amount1 ? (
                                    <>
                                      {invertPrice
                                        ? positionOfLatestLiquidity?.amount0.toSignificant(4)
                                        : positionOfLatestLiquidity?.amount1.toSignificant(4)}
                                    </>
                                  ) : (
                                    <>0</>
                                  )}
                                </div>
                              </div>
                            </PositionWrapper>
                            <FeeTierWrapper>
                              <div>Fee Tier</div>
                              <div>{feeAmount ? Number(feeAmount) / 10000 : 0}%</div>
                            </FeeTierWrapper>
                          </ExistingRangeContainer>
                        </DynamicSection>
                      </PanelWrapper>
                      {!hasExistingPosition && isMobile && (
                        <PanelWrapper>
                          <DerpFeeSelector
                            disabled={!quoteCurrency || !baseCurrency}
                            feeAmount={feeAmount}
                            handleFeePoolSelect={handleFeePoolSelect}
                            currencyA={baseCurrency ?? undefined}
                            currencyB={quoteCurrency ?? undefined}
                          />
                        </PanelWrapper>
                      )}
                    </AutoColumn>
                  </>
                )}
                {hasExistingPosition && existingPosition && (
                  <PositionPreview
                    tokenId={tokenId}
                    position={existingPosition}
                    title={<Trans>Selected Range</Trans>}
                    inRange={!outOfRange}
                    ticksAtLimit={ticksAtLimit}
                  />
                )}
              </AutoColumn>
              <InputAreaAutoColumn id="input-area">
                {!hasExistingPosition && !isMobile && (
                  <PanelWrapper>
                    <DerpFeeSelector
                      disabled={!quoteCurrency || !baseCurrency}
                      feeAmount={feeAmount}
                      handleFeePoolSelect={handleFeePoolSelect}
                      currencyA={baseCurrency ?? undefined}
                      currencyB={quoteCurrency ?? undefined}
                    />
                  </PanelWrapper>
                )}
                <PanelWrapper className="input-area-panel" isPreviewPage={isPreviewPage}>
                  <DynamicSection
                    id="input-area-dynamic-section"
                    className="overridable"
                    disabled={tickLower === undefined || tickUpper === undefined || invalidPool || invalidRange}
                  >
                    <AutoColumn
                      gap="md"
                      style={{
                        marginTop: '20px',
                      }}
                      id="input-auto-column"
                    >
                      <ShadowedBorder
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '15px',
                        }}
                        className="input-only-properties"
                      >
                        <NunitoText size="lg2" weight={700}>
                          {hasExistingPosition ? <Trans>Add more liquidity</Trans> : <Trans>Deposit Amounts</Trans>}
                        </NunitoText>

                        <CurrencyInputPanel
                          isInputPanel={true}
                          value={formattedAmounts[Field.CURRENCY_A]}
                          onUserInput={(v) => {
                            onFieldAInput(v)
                          }}
                          onMax={() => {
                            onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? '')
                          }}
                          showMaxButton={!atMaxAmounts[Field.CURRENCY_A]}
                          currency={currencies[Field.CURRENCY_A] ?? null}
                          id="add-liquidity-input-tokena"
                          fiatValue={currencyAFiat}
                          showCommonBases
                          locked={depositADisabled}
                        />

                        <CurrencyInputPanel
                          isInputPanel={true}
                          value={formattedAmounts[Field.CURRENCY_B]}
                          onUserInput={(v) => {
                            onFieldBInput(v)
                          }}
                          onMax={() => {
                            onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toExact() ?? '')
                          }}
                          showMaxButton={!atMaxAmounts[Field.CURRENCY_B]}
                          fiatValue={currencyBFiat}
                          currency={currencies[Field.CURRENCY_B] ?? null}
                          id="add-liquidity-input-tokenb"
                          showCommonBases
                          locked={depositBDisabled}
                        />
                      </ShadowedBorder>
                    </AutoColumn>
                  </DynamicSection>
                </PanelWrapper>
              </InputAreaAutoColumn>
              {!hasExistingPosition ? (
                <>
                  <HideMedium>
                    <ButtonsToAction />
                  </HideMedium>
                  <RightContainer gap="lg" id="right-hand-side">
                    <DynamicSection className="overridable-fee-selector" gap="md" disabled={!feeAmount || invalidPool}>
                      {/* SPACER TO ALIGN WITH THE LEFT CONTAINER */}
                      {!isMobile && <Box height={106}></Box>}
                      {!noLiquidity ? (
                        <>
                          {!hasExistingPosition && (
                            <Row className={styles.RateToggleOverride} justifyContent="flex-end">
                              <MediumOnly>
                                <ButtonText onClick={clearAll} margin="0 15px 0 0">
                                  <div className={styles.ClearText}>
                                    <Trans>Clear All</Trans>
                                  </div>
                                </ButtonText>
                              </MediumOnly>
                              {baseCurrency && quoteCurrency ? (
                                <div className="marginalized-toggle">
                                  <RateToggle
                                    currencyA={baseCurrency}
                                    currencyB={quoteCurrency}
                                    handleRateToggle={() => {
                                      if (!ticksAtLimit[Bound.LOWER] && !ticksAtLimit[Bound.UPPER]) {
                                        onLeftRangeInput(
                                          (invertPrice ? priceLower : priceUpper?.invert())?.toSignificant(6) ?? ''
                                        )
                                        onRightRangeInput(
                                          (invertPrice ? priceUpper : priceLower?.invert())?.toSignificant(6) ?? ''
                                        )
                                        onFieldAInput(formattedAmounts[Field.CURRENCY_B] ?? '')
                                      }
                                      navigate(
                                        `/add/${currencyIdB as string}/${currencyIdA as string}${
                                          feeAmount ? '/' + feeAmount : ''
                                        }`
                                      )
                                    }}
                                  />
                                </div>
                              ) : null}
                              <div
                                style={{
                                  marginLeft: '30px',
                                }}
                              >
                                <SettingsTabLiquidity autoSlippage={DEFAULT_ADD_IN_RANGE_SLIPPAGE_TOLERANCE} />
                              </div>
                            </Row>
                          )}
                          <RowBetween id="range-mode-row">
                            <RangeModeSelector
                              currentMode={currentMode}
                              price={price}
                              onData={handleRangeModeSelector}
                            />
                            {/* <ThemedText.DeprecatedLabel>
                              <Trans>Set Price Range</Trans>
                            </ThemedText.DeprecatedLabel> */}
                          </RowBetween>
                          <DualSlider
                            isFullRange={currentMode === RANGE.FULL_RANGE || currentMode === RANGE.CUSTOM}
                            min={sliderMin}
                            max={sliderMax}
                          />
                          <div className={styles.SliderWrapper}>
                            <Slider
                              id="derp-slider"
                              className={styles.OverrideSlider}
                              getAriaLabel={() => 'Minimum distance'}
                              value={value1}
                              onChange={handleChange1}
                              onChangeCommitted={(e, onCommit) => {
                                onMouseCommitted(onCommit)
                              }}
                              valueLabelDisplay="auto"
                              getAriaValueText={valuetext}
                              step={sliderMin / 1000}
                              disableSwap
                              min={sliderMin}
                              max={sliderMax}
                              disabled={disableSlider}
                            />
                          </div>
                        </>
                      ) : (
                        <AutoColumn className="overridable-inner" gap="md">
                          <RowBetween>
                            <ThemedText.DeprecatedLabel>
                              <Trans>Set Starting Price</Trans>
                            </ThemedText.DeprecatedLabel>
                          </RowBetween>
                          {noLiquidity && (
                            <BlueCard
                              style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                padding: '1rem 1rem',
                              }}
                            >
                              <ThemedText.DeprecatedBody
                                fontSize={14}
                                style={{ fontWeight: 600 }}
                                textAlign="left"
                                color={theme.derpGray1}
                              >
                                <Trans>
                                  This pool must be initialized before you can add liquidity. To initialize, select a
                                  starting price for the pool. Then, enter your liquidity price range and deposit
                                  amount. Gas fees will be higher than usual due to the initialization transaction.
                                </Trans>
                              </ThemedText.DeprecatedBody>
                            </BlueCard>
                          )}
                          <OutlineCard $borderRadius="8px" padding="12px">
                            <StyledInput
                              className="start-price-input"
                              value={startPriceTypedValue}
                              onUserInput={onStartPriceInput}
                            />
                          </OutlineCard>
                          <RowBetween
                            style={{ backgroundColor: theme.deprecated_bg1, padding: '12px', borderRadius: '8px' }}
                          >
                            <ThemedText.DeprecatedMain>
                              <Trans>Current {baseCurrency?.symbol} Price:</Trans>
                            </ThemedText.DeprecatedMain>
                            <ThemedText.DeprecatedMain>
                              {price ? (
                                <ThemedText.DeprecatedMain>
                                  <RowFixed>
                                    <HoverInlineText
                                      maxCharacters={20}
                                      text={invertPrice ? price?.invert()?.toSignificant(5) : price?.toSignificant(5)}
                                    />{' '}
                                    <span style={{ marginLeft: '4px' }}>{quoteCurrency?.symbol}</span>
                                  </RowFixed>
                                </ThemedText.DeprecatedMain>
                              ) : (
                                '-'
                              )}
                            </ThemedText.DeprecatedMain>
                          </RowBetween>
                        </AutoColumn>
                      )}
                    </DynamicSection>

                    <DynamicSection
                      className="overridable-fee-selector"
                      gap="md"
                      disabled={!feeAmount || invalidPool || (noLiquidity && !startPriceTypedValue)}
                    >
                      <StackedContainer>
                        <StackedItem>
                          <AutoColumn gap="md" id="range-info">
                            <div
                              style={{
                                fontSize: '20px',
                                fontWeight: 600,
                                marginBottom: '10px',
                              }}
                            >
                              {!noLiquidity ? 'Selected Range' : 'Set Price Range'}
                            </div>
                            <RangeSelector
                              priceLower={priceLower}
                              priceUpper={priceUpper}
                              getDecrementLower={getDecrementLower}
                              getIncrementLower={getIncrementLower}
                              getDecrementUpper={getDecrementUpper}
                              getIncrementUpper={getIncrementUpper}
                              onLeftRangeInput={onLeftRangeInput}
                              onRightRangeInput={onRightRangeInput}
                              currencyA={baseCurrency}
                              currencyB={quoteCurrency}
                              feeAmount={feeAmount}
                              ticksAtLimit={ticksAtLimit}
                              currentPrice={invertPrice ? price?.invert()?.toSignificant(5) : price?.toSignificant(5)}
                              currentMode={currentMode}
                              setCurrentMode={setCurrentMode}
                            />
                            {/* <div onClick={handleSetActiveRange}>GG</div>
                            {!noLiquidity && <PresetsButtons onSetFullRange={handleSetFullRange} />} */}
                          </AutoColumn>
                        </StackedItem>
                      </StackedContainer>

                      {outOfRange ? (
                        <YellowCard padding="8px 12px" $borderRadius="12px">
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <AlertTriangle stroke={theme.deprecated_yellow3} size="16px" />
                            <ThemedText.DeprecatedYellow ml="12px" fontSize="12px">
                              <Trans>
                                Your position will not earn fees or be used in trades until the market price moves into
                                your range.
                              </Trans>
                            </ThemedText.DeprecatedYellow>
                          </div>
                        </YellowCard>
                      ) : null}

                      {invalidRange ? (
                        <YellowCard padding="8px 12px" $borderRadius="12px">
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <AlertTriangle stroke={theme.deprecated_yellow3} size="16px" />
                            <ThemedText.DeprecatedYellow ml="12px" fontSize="12px">
                              <Trans>Invalid range selected. The min price must be lower than the max price.</Trans>
                            </ThemedText.DeprecatedYellow>
                          </div>
                        </YellowCard>
                      ) : null}
                    </DynamicSection>

                    <MediumOnly>
                      <ButtonsToAction />
                    </MediumOnly>
                  </RightContainer>
                </>
              ) : (
                <ButtonsToAction />
              )}
            </ResponsiveTwoColumns>
          </DerpPageWrapper>
          {showOwnershipWarning && <OwnershipWarning ownerAddress={owner} />}
          {addIsUnsupported && (
            <UnsupportedCurrencyFooter
              show={addIsUnsupported}
              currencies={[currencies.CURRENCY_A, currencies.CURRENCY_B]}
            />
          )}
        </DerpScrollablePage>
      ) : (hasLoading && isValidToLoad) || positionLoading ? (
        <PositionsLoadingPlaceholder />
      ) : (
        <PositionPageUnsupportedContent />
      )}
      <SwitchLocaleLink />
    </>
  )
}
