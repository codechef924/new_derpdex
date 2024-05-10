/* eslint-disable unused-imports/no-unused-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NonfungiblePositionManager, Pool, Position } from '@derpdex/sdk'
import { SupportedChainId } from '@derpdex/widgets'
import { BigNumber } from '@ethersproject/bignumber'
import type { TransactionResponse } from '@ethersproject/providers'
import { Trans } from '@lingui/macro'
import { Box } from '@mui/material'
import { Trace } from '@uniswap/analytics'
import { InterfacePageName } from '@uniswap/analytics-events'
import { formatPrice, NumberType } from '@uniswap/conedison/format'
import { Currency, CurrencyAmount, Fraction, Price, Token } from '@uniswap/sdk-core'
import { useWeb3React } from '@web3-react/core'
import { ReactComponent as BackToIcon } from 'assets/svg/back-to-icon.svg'
import { ReactComponent as TrashIcon } from 'assets/svg/trash-icon.svg'
import { sendEvent } from 'components/analytics'
import Badge from 'components/Badge'
import {
  ButtonConfirmed,
  ButtonPrimary,
  DDButtonGradient,
  DDButtonGradientFlex,
  DDButtonGradientXL,
  DDButtonMinimal,
  DDButtonRemove,
} from 'components/Button'
import { DarkCard, DDCard, DDCardUniversal, LightCard } from 'components/Card'
import { AutoColumn } from 'components/Column'
import { GloriaText } from 'components/CustomFonts/GloriaHallelujah'
import { NunitoText } from 'components/CustomFonts/Nunito'
import Loader from 'components/Icons/LoadingSpinner'
import CurrencyLogo from 'components/Logo/CurrencyLogo'
import { RowBetween, RowFixed } from 'components/Row'
import { Dots } from 'components/swap/styleds'
import Toggle from 'components/Toggle'
import TransactionConfirmationModal, { ConfirmationModalContent } from 'components/TransactionConfirmationModal'
import TransactionConfirmationModalLiquidity, {
  ConfirmationModalContentLiquidity,
  ModalType,
} from 'components/TransactionConfirmationModalLiqudity'
import { CHAIN_IDS_TO_NAMES, isSupportedChain } from 'constants/chains'
import { isGqlSupportedChain } from 'graphql/data/util'
import { useToken } from 'hooks/Tokens'
import { useV3NFTPositionManagerContract } from 'hooks/useContract'
import useIsTickAtLimit from 'hooks/useIsTickAtLimit'
import { PoolState, useDerpPool } from 'hooks/usePools'
import useStablecoinPriceV2 from 'hooks/useStablecoinPriceV2'
import { useV3PositionFees } from 'hooks/useV3PositionFees'
import { useV3PositionFromTokenId } from 'hooks/useV3Positions'
import { useSingleCallResult } from 'lib/hooks/multicall'
import useNativeCurrency from 'lib/hooks/useNativeCurrency'
import { useIsMobile } from 'nft/hooks'
import { useCallback, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Bound } from 'state/mint/v3/actions'
import { useIsTransactionPending, useTransactionAdder } from 'state/transactions/hooks'
import styled, { useTheme } from 'styled-components/macro'
import { ExternalLink, HideExtraSmall, HideSmall, ThemedText } from 'theme'
import { currencyId } from 'utils/currencyId'
import { formatCurrencyAmount } from 'utils/formatCurrencyAmount'
import { formatTickPrice } from 'utils/formatTickPrice'
import { unwrappedToken } from 'utils/unwrappedToken'

import DerpFace from '../../assets/images/derp.png'
import RangeBadge from '../../components/Badge/RangeBadge'
import { getPriceOrderingFromPositionForUI } from '../../components/PositionListItem'
import RateToggle from '../../components/RateToggle'
import { SwitchLocaleLink } from '../../components/SwitchLocaleLink'
import { usePositionTokenURI } from '../../hooks/usePositionTokenURI'
import { TransactionType } from '../../state/transactions/types'
import { calculateGasMargin } from '../../utils/calculateGasMargin'
import { ExplorerDataType, getExplorerLink } from '../../utils/getExplorerLink'
import * as styles from './index.css'
import { LoadingRows, TitleDiv } from './styleds'

const getTokenLink = (chainId: SupportedChainId, address: string) => {
  if (isGqlSupportedChain(chainId)) {
    const chainName = CHAIN_IDS_TO_NAMES[chainId]
    return `${window.location.origin}/#/tokens/${chainName}/${address}`
  } else {
    return getExplorerLink(chainId, address, ExplorerDataType.TOKEN)
  }
}

const PositionPageButtonPrimary = styled(ButtonPrimary)`
  width: 228px;
  height: 50px;
  font-size: 16px;
  line-height: 20px;
  border-radius: 12px;

  background: ${({ theme }) => theme.derpGradientPrimary} !important;

  &:active {
    box-shadow: unset;
    background-color: ${({ theme }) => theme.derpGradientPrimary} !important;
  }
`

const PageWrapper = styled.div`
  padding: 68px 16px 16px 16px;

  min-width: 800px;
  max-width: 960px;

  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    min-width: 100%;
    padding: 16px;
  }

  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.sm}px`}) {
    min-width: 100%;
    padding: 16px;
  }
`

const DDPageWrapper = styled.div`
  padding: 68px 168px 32px 168px;
  width: 100%;
  max-width: 1600px;

  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    min-width: 100%;
    padding: 16px;
  }

  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.sm}px`}) {
    min-width: 100%;
    padding: 80px 16px 70px 16px;
    // padding-top: 70px;
  }
`

const BadgeText = styled.div`
  font-weight: 500;
  font-size: 14px;
`

// responsive text
// disable the warning because we don't use the end prop, we just want to filter it out
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Label = styled(({ end, ...props }) => <ThemedText.DeprecatedLabel {...props} />)<{ end?: boolean }>`
  display: flex;
  font-size: 16px;
  justify-content: ${({ end }) => (end ? 'flex-end' : 'flex-start')};
  align-items: center;
`

const ExtentsText = styled.span`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 14px;
  text-align: center;
  margin-right: 4px;
  font-weight: 500;
`

const HoverText = styled(ThemedText.DerpBlack)`
  display: flex;
  align-items: center;
  gap: 16px;
  text-decoration: none;
  :hover {
    color: ${({ theme }) => theme.textPrimary};
    text-decoration: none;
  }
`

const DoubleArrow = styled.span`
  color: ${({ theme }) => theme.textTertiary};
  margin: 0 1rem;
`
const ResponsiveRow = styled(RowBetween)`
  @media only screen and (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    row-gap: 16px;
    width: 100%;
  }
`

const ActionButtonResponsiveRow = styled(ResponsiveRow)`
  width: 50%;
  justify-content: flex-end;

  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.sm}px`}) {
    width: 100%;
    flex-direction: row;
    * {
      width: 100%;
    }
  }
`

const ResponsiveButtonConfirmed = styled(ButtonConfirmed)`
  border-radius: 200px !important;
  border: 2px solid #344d73;
  font-size: 20px;
  color: #000 !important;

  background: #fff !important;

  padding: 8px 16px !important;

  font-size: 16px !important;

  &:hover {
    background: ${({ theme }) => theme.derpGradientPrimary} !important;
    color: #fff !important;
  }

  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    width: fit-content;
  }

  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.sm}px`}) {
    width: fit-content;
  }
`

const NFTContainer = styled.div`
  margin-right: 56px;
  @media only screen and (max-width: 768px) {
    margin-right: 0px;
  }
`

const NFTGrid = styled.div`
  display: grid;
  grid-template: 'overlap';
  min-height: 400px;
`

const NFTCanvas = styled.canvas`
  grid-area: overlap;
`

const NFTImage = styled.img`
  grid-area: overlap;
  height: 400px;
  /* Ensures SVG appears on top of canvas. */
  z-index: 1;
`
const NFTCardValue = styled.div`
  width: fit-content;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background: ${({ theme }) => theme.derpGray2};
  padding: 5px 10px;
  border-radius: 8px;

  .text-normal {
    font-size: 16px;
    font-weight: 600;
    color: ${({ theme }) => theme.derpGray1};
  }
  .text-gradient {
    font-size: 16px;
    font-weight: 600;
    background: ${({ theme }) => theme.derpGradientPrimary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-fill-color: transparent;
  }
`

const IncreaseRemoveWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  width: 100%;
`

function CurrentPriceCard({
  inverted,
  pool,
  currencyQuote,
  currencyBase,
}: {
  inverted?: boolean
  pool?: Pool | null
  currencyQuote?: Currency
  currencyBase?: Currency
}) {
  if (!pool || !currencyQuote || !currencyBase) {
    return null
  }

  return (
    <DDCardUniversal
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      $borderRadius="8px"
      height="100%"
      padding="12px"
    >
      <AutoColumn gap="sm" justify="center">
        <ExtentsText style={{ fontSize: '20px', color: '#98A1C0', fontWeight: '600' }}>
          <Trans>Current price</Trans>
        </ExtentsText>
        <ThemedText.DeprecatedMediumHeader fontWeight="600" fontSize="32px" textAlign="center">
          {formatPrice(inverted ? pool.token1Price : pool.token0Price, NumberType.TokenTx)}
        </ThemedText.DeprecatedMediumHeader>
        <ExtentsText style={{ fontSize: '20px', color: '#98A1C0', fontWeight: '600' }}>
          <Trans>
            {currencyQuote?.symbol} per {currencyBase?.symbol}
          </Trans>
        </ExtentsText>
      </AutoColumn>
    </DDCardUniversal>
  )
}

function LinkedCurrency({ chainId, currency }: { chainId?: number; currency?: Currency }) {
  const address = (currency as Token)?.address

  if (typeof chainId === 'number' && address) {
    return (
      <ExternalLink href={getTokenLink(chainId, address)}>
        <RowFixed>
          <CurrencyLogo currency={currency} size="28px" style={{ marginRight: '0.5rem' }} />
          <ThemedText.DerpBlack>{currency?.symbol} ↗</ThemedText.DerpBlack>
        </RowFixed>
      </ExternalLink>
    )
  }

  return (
    <RowFixed>
      <CurrencyLogo currency={currency} size="28px" style={{ marginRight: '0.5rem' }} />
      <ThemedText.DerpBlack>{currency?.symbol}</ThemedText.DerpBlack>
    </RowFixed>
  )
}

function getRatio(
  lower: Price<Currency, Currency>,
  current: Price<Currency, Currency>,
  upper: Price<Currency, Currency>
) {
  try {
    if (!current.greaterThan(lower)) {
      return 100
    } else if (!current.lessThan(upper)) {
      return 0
    }

    const a = Number.parseFloat(lower.toSignificant(15))
    const b = Number.parseFloat(upper.toSignificant(15))
    const c = Number.parseFloat(current.toSignificant(15))

    const ratio = Math.floor((1 / ((Math.sqrt(a * b) - Math.sqrt(b * c)) / (c - Math.sqrt(b * c)) + 1)) * 100)

    if (ratio < 0 || ratio > 100) {
      throw Error('Out of range')
    }

    return ratio
  } catch {
    return undefined
  }
}

// snapshots a src img into a canvas
function getSnapshot(src: HTMLImageElement, canvas: HTMLCanvasElement, targetHeight: number) {
  const context = canvas.getContext('2d')

  if (context) {
    let { width, height } = src

    // src may be hidden and not have the target dimensions
    const ratio = width / height
    height = targetHeight
    width = Math.round(ratio * targetHeight)

    // Ensure crispness at high DPIs
    canvas.width = width * devicePixelRatio
    canvas.height = height * devicePixelRatio
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'
    context.scale(devicePixelRatio, devicePixelRatio)

    context.clearRect(0, 0, width, height)
    context.drawImage(src, 0, 0, width, height)
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function NFT({ image, height: targetHeight }: { image: string; height: number }) {
  const [animate, setAnimate] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  return (
    <NFTGrid
      onMouseEnter={() => {
        setAnimate(true)
      }}
      onMouseLeave={() => {
        // snapshot the current frame so the transition to the canvas is smooth
        if (imageRef.current && canvasRef.current) {
          getSnapshot(imageRef.current, canvasRef.current, targetHeight)
        }
        setAnimate(false)
      }}
    >
      <NFTCanvas ref={canvasRef} />
      <NFTImage
        ref={imageRef}
        src={image}
        hidden={!animate}
        onLoad={() => {
          // snapshot for the canvas
          if (imageRef.current && canvasRef.current) {
            getSnapshot(imageRef.current, canvasRef.current, targetHeight)
          }
        }}
      />
    </NFTGrid>
  )
}

const NFTStyled = styled.div`
  background: linear-gradient(135deg, #5b31aa 0%, #239098 95.1%);
  width: 375px;
  height: 382px;
  border-radius: 16px;
  padding: 21px;

  .pair-text {
    font-size: '36px';
    font-weight: 600;
    display: flex;
    justify-content: flex-end;
    line-height: 32px;
  }

  img {
    min-width: 160px;
  }

  @media only screen and (max-width: 768px) {
    width: 330px;
    height: 338px;

    .pair-text {
      font-size: 24px;
      font-weight: 600;
      display: flex;
      justify-content: flex-end;
      line-height: 26px;
    }

    img {
      max-width: 120px;
    }
  }
`
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function MockNFT({
  image,
  height: targetHeight,
  pair,
  id,
  mintTick,
  maxTick,
}: {
  image?: string
  height: number
  pair?: { token0: string | null; token1: string | null }
  id: string | undefined
  mintTick: number
  maxTick: number
}) {
  const [animate, setAnimate] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  return (
    <NFTStyled
      onMouseEnter={() => {
        setAnimate(true)
      }}
      onMouseLeave={() => {
        // snapshot the current frame so the transition to the canvas is smooth
        if (imageRef.current && canvasRef.current) {
          getSnapshot(imageRef.current, canvasRef.current, targetHeight)
        }
        setAnimate(false)
      }}
    >
      <div
        style={{
          background: 'white',
          width: '100%',
          height: '100%',
          borderRadius: '12px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '12px',
            height: '100%',
          }}
        >
          <div className="pair-text">
            {pair?.token0 ?? 'NULL'} / {pair?.token1 ?? 'NULL'}
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '17px',
            }}
          >
            <img src={DerpFace} />
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              flexGrow: 1,
              gap: '4px',
            }}
          >
            <NFTCardValue>
              <div className="text-normal">ID:</div>
              <div className="text-gradient">&nbsp;{id}</div>
            </NFTCardValue>
            <NFTCardValue>
              <div className="text-normal">Min Tick:</div>
              <div className="text-gradient">&nbsp;{mintTick}</div>
            </NFTCardValue>
            <NFTCardValue>
              <div className="text-normal">Max Tick:</div>
              <div className="text-gradient">&nbsp;{maxTick}</div>
            </NFTCardValue>
          </div>
        </div>
      </div>
      {/* <NFTCanvas ref={canvasRef} />
      <NFTImage
        ref={imageRef}
        src={image}
        hidden={!animate}
        onLoad={() => {
          // snapshot for the canvas
          if (imageRef.current && canvasRef.current) {
            getSnapshot(imageRef.current, canvasRef.current, targetHeight)
          }
        }}
      /> */}
    </NFTStyled>
  )
}

const useInverter = ({
  priceLower,
  priceUpper,
  quote,
  base,
  invert,
}: {
  priceLower?: Price<Token, Token>
  priceUpper?: Price<Token, Token>
  quote?: Token
  base?: Token
  invert?: boolean
}): {
  priceLower?: Price<Token, Token>
  priceUpper?: Price<Token, Token>
  quote?: Token
  base?: Token
} => {
  return {
    priceUpper: invert ? priceLower?.invert() : priceUpper,
    priceLower: invert ? priceUpper?.invert() : priceLower,
    quote: invert ? base : quote,
    base: invert ? quote : base,
  }
}

export function PositionPageUnsupportedContent() {
  return (
    <PageWrapper>
      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', marginTop: '140px' }}>
        <NunitoText size="xxxl" weight={600} style={{ marginBottom: '8px' }}>
          <Trans>Position unavailable</Trans>
        </NunitoText>
        <NunitoText size="lg2" style={{ marginBottom: '32px', textAlign: 'center' }}>
          <Trans>To view a position, you must be connected to the network it belongs to.</Trans>
        </NunitoText>
        <PositionPageButtonPrimary as={Link} to="/pools" width="fit-content">
          <NunitoText size="xxl">
            <Trans>Back to Pools</Trans>
          </NunitoText>
        </PositionPageButtonPrimary>
      </div>
    </PageWrapper>
  )
}

export default function PositionPage() {
  const { chainId } = useWeb3React()
  if (isSupportedChain(chainId)) {
    return <PositionPageContent />
  } else {
    return <PositionPageUnsupportedContent />
  }
}

function PositionPageContent() {
  const { tokenId: tokenIdFromUrl } = useParams<{ tokenId?: string }>()
  const { chainId, account, provider } = useWeb3React()
  const theme = useTheme()
  const isMobile = useIsMobile()
  const parsedTokenId = tokenIdFromUrl ? BigNumber.from(tokenIdFromUrl) : undefined
  const { loading, position: positionDetails } = useV3PositionFromTokenId(parsedTokenId)

  const {
    token0: token0Address,
    token1: token1Address,
    fee: feeAmount,
    liquidity,
    tickLower,
    tickUpper,
    tokenId,
  } = positionDetails || {}

  const removed = liquidity?.eq(0)

  const metadata = usePositionTokenURI(parsedTokenId)

  const token0 = useToken(token0Address)
  const token1 = useToken(token1Address)

  const currency0 = token0 ? unwrappedToken(token0) : undefined
  const currency1 = token1 ? unwrappedToken(token1) : undefined

  // flag for receiving WETH
  const [receiveWETH, setReceiveWETH] = useState(false)
  const nativeCurrency = useNativeCurrency(chainId)
  const nativeWrappedSymbol = nativeCurrency.wrapped.symbol

  // construct Position from details returned
  // const [poolState, pool] = usePool(token0 ?? undefined, token1 ?? undefined, feeAmount)
  const [poolState, pool] = useDerpPool(token0 ?? undefined, token1 ?? undefined, feeAmount)

  const position = useMemo(() => {
    if (pool && liquidity && typeof tickLower === 'number' && typeof tickUpper === 'number') {
      return new Position({ pool, liquidity: liquidity.toString(), tickLower, tickUpper })
    }
    return undefined
  }, [liquidity, pool, tickLower, tickUpper])

  const tickAtLimit = useIsTickAtLimit(feeAmount, tickLower, tickUpper)

  const pricesFromPosition = getPriceOrderingFromPositionForUI(position)
  const [manuallyInverted, setManuallyInverted] = useState(false)

  // handle manual inversion
  const { priceLower, priceUpper, base } = useInverter({
    priceLower: pricesFromPosition.priceLower,
    priceUpper: pricesFromPosition.priceUpper,
    quote: pricesFromPosition.quote,
    base: pricesFromPosition.base,
    invert: manuallyInverted,
  })

  const inverted = token1 ? base?.equals(token1) : undefined
  const currencyQuote = inverted ? currency0 : currency1
  const currencyBase = inverted ? currency1 : currency0

  const ratio = useMemo(() => {
    return priceLower && pool && priceUpper
      ? getRatio(
          inverted ? priceUpper.invert() : priceLower,
          pool.token0Price,
          inverted ? priceLower.invert() : priceUpper
        )
      : undefined
  }, [inverted, pool, priceLower, priceUpper])

  // fees
  const [feeValue0, feeValue1] = useV3PositionFees(pool ?? undefined, positionDetails?.tokenId, receiveWETH)

  // these currencies will match the feeValue{0,1} currencies for the purposes of fee collection
  const currency0ForFeeCollectionPurposes = pool ? (receiveWETH ? pool.token0 : unwrappedToken(pool.token0)) : undefined
  const currency1ForFeeCollectionPurposes = pool ? (receiveWETH ? pool.token1 : unwrappedToken(pool.token1)) : undefined

  const [collecting, setCollecting] = useState<boolean>(false)
  const [collectMigrationHash, setCollectMigrationHash] = useState<string | null>(null)
  const isCollectPending = useIsTransactionPending(collectMigrationHash ?? undefined)
  const [showConfirm, setShowConfirm] = useState(false)

  // usdc prices always in terms of tokens
  //! Replaced with original useStablecoinPrice
  const price0 = useStablecoinPriceV2(token0 ?? undefined)
  const price1 = useStablecoinPriceV2(token1 ?? undefined)

  const fiatValueOfFees: CurrencyAmount<Currency> | null = useMemo(() => {
    if (!price0 || !price1 || !feeValue0 || !feeValue1) return null

    // we wrap because it doesn't matter, the quote returns a USDC amount
    const feeValue0Wrapped = feeValue0?.wrapped
    const feeValue1Wrapped = feeValue1?.wrapped

    if (!feeValue0Wrapped || !feeValue1Wrapped) return null

    const amount0 = price0.quote(feeValue0Wrapped)
    const amount1 = price1.quote(feeValue1Wrapped)
    return amount0.add(amount1)
  }, [price0, price1, feeValue0, feeValue1])

  const fiatValueOfLiquidity: CurrencyAmount<Token> | null = useMemo(() => {
    if (!price0 || !price1 || !position) return null
    const amount0 = price0.quote(position.amount0)
    const amount1 = price1.quote(position.amount1)
    return amount0.add(amount1)
  }, [price0, price1, position])

  const addTransaction = useTransactionAdder()
  const positionManager = useV3NFTPositionManagerContract()
  const collect = useCallback(() => {
    if (
      !currency0ForFeeCollectionPurposes ||
      !currency1ForFeeCollectionPurposes ||
      !chainId ||
      !positionManager ||
      !account ||
      !tokenId ||
      !provider
    )
      return

    setCollecting(true)

    // we fall back to expecting 0 fees in case the fetch fails, which is safe in the
    // vast majority of cases
    const { calldata, value } = NonfungiblePositionManager.collectCallParameters({
      tokenId: tokenId.toString(),
      expectedCurrencyOwed0: feeValue0 ?? CurrencyAmount.fromRawAmount(currency0ForFeeCollectionPurposes, 0),
      expectedCurrencyOwed1: feeValue1 ?? CurrencyAmount.fromRawAmount(currency1ForFeeCollectionPurposes, 0),
      recipient: account,
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
            setCollectMigrationHash(response.hash)
            setCollecting(false)

            sendEvent({
              category: 'Liquidity',
              action: 'CollectV3',
              label: [currency0ForFeeCollectionPurposes.symbol, currency1ForFeeCollectionPurposes.symbol].join('/'),
            })

            addTransaction(response, {
              type: TransactionType.COLLECT_FEES,
              currencyId0: currencyId(currency0ForFeeCollectionPurposes),
              currencyId1: currencyId(currency1ForFeeCollectionPurposes),
              expectedCurrencyOwed0: CurrencyAmount.fromRawAmount(currency0ForFeeCollectionPurposes, 0).toExact(),
              expectedCurrencyOwed1: CurrencyAmount.fromRawAmount(currency1ForFeeCollectionPurposes, 0).toExact(),
            })
          })
      })
      .catch((error) => {
        setCollecting(false)
        console.error(error)
      })
  }, [
    chainId,
    feeValue0,
    feeValue1,
    currency0ForFeeCollectionPurposes,
    currency1ForFeeCollectionPurposes,
    positionManager,
    account,
    tokenId,
    addTransaction,
    provider,
  ])

  const owner = useSingleCallResult(tokenId ? positionManager : null, 'ownerOf', [tokenId]).result?.[0]
  const ownsNFT = owner === account || positionDetails?.operator === account

  const feeValueUpper = inverted ? feeValue0 : feeValue1
  const feeValueLower = inverted ? feeValue1 : feeValue0

  // check if price is within range
  const below = pool && typeof tickLower === 'number' ? pool.tickCurrent < tickLower : undefined
  const above = pool && typeof tickUpper === 'number' ? pool.tickCurrent >= tickUpper : undefined
  const inRange: boolean = typeof below === 'boolean' && typeof above === 'boolean' ? !below && !above : false

  function modalHeader() {
    return (
      <AutoColumn gap="md" style={{ marginTop: '20px', padding: '0px 16px 16px 16px' }}>
        <DDCard>
          <AutoColumn gap="md">
            <RowBetween>
              <RowFixed>
                <CurrencyLogo currency={feeValueUpper?.currency} size="20px" style={{ marginRight: '0.5rem' }} />
                <NunitoText weight={600}>{feeValueUpper ? formatCurrencyAmount(feeValueUpper, 4) : '-'}</NunitoText>
              </RowFixed>
              <NunitoText weight={600}>{feeValueUpper?.currency?.symbol}</NunitoText>
            </RowBetween>
            <RowBetween>
              <RowFixed>
                <CurrencyLogo currency={feeValueLower?.currency} size="20px" style={{ marginRight: '0.5rem' }} />
                <NunitoText weight={600}>{feeValueLower ? formatCurrencyAmount(feeValueLower, 4) : '-'}</NunitoText>
              </RowFixed>
              <NunitoText weight={600}>{feeValueLower?.currency?.symbol}</NunitoText>
            </RowBetween>
          </AutoColumn>
        </DDCard>
        <ThemedText.DeprecatedItalic>
          <NunitoText>
            <Trans>Collecting fees will withdraw currently available fees for you.</Trans>
          </NunitoText>
        </ThemedText.DeprecatedItalic>
        <DDButtonGradientXL onClick={collect}>
          <Trans>Collect</Trans>
        </DDButtonGradientXL>
      </AutoColumn>
    )
  }

  const showCollectAsWeth = Boolean(
    ownsNFT &&
      (feeValue0?.greaterThan(0) || feeValue1?.greaterThan(0)) &&
      currency0 &&
      currency1 &&
      (currency0.isNative || currency1.isNative) &&
      !collectMigrationHash
  )

  if (!pool && !loading) {
    return <PositionPageUnsupportedContent />
  }

  return loading || poolState === PoolState.LOADING || !feeAmount ? (
    <LoadingRows>
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
    </LoadingRows>
  ) : (
    <Trace page={InterfacePageName.POOL_PAGE} shouldLogImpression>
      <>
        <DDPageWrapper>
          <TransactionConfirmationModalLiquidity
            modalType={ModalType.INCREASE_LIQUIDITY}
            isOpen={showConfirm}
            onDismiss={() => setShowConfirm(false)}
            attemptingTxn={collecting}
            hash={collectMigrationHash ?? ''}
            reviewContent={() => (
              <ConfirmationModalContentLiquidity
                disableCloseButton={true}
                title={
                  <TitleDiv>
                    <Trans>Claim fees</Trans>
                  </TitleDiv>
                }
                onDismiss={() => setShowConfirm(false)}
                topContent={modalHeader}
              />
            )}
            pendingText={<Trans>Collecting fees</Trans>}
          />
          <AutoColumn gap="md">
            <AutoColumn gap="sm">
              <Link
                data-cy="visit-pool"
                style={{ textDecoration: 'none', width: 'fit-content', marginBottom: '0.5rem' }}
                to="/pools"
              >
                <HoverText>
                  <Trans>
                    <BackToIcon /> Back to My Pools
                  </Trans>
                </HoverText>
              </Link>
              <RowBetween></RowBetween>
            </AutoColumn>
            <ResponsiveRow align="flex-start">
              {/* <HideSmall
                style={{
                  marginRight: '12px',
                }}
              > */}
              <NFTContainer>
                {'result' in metadata ? (
                  <>
                    {/* <NFT image={metadata.result.image} height={400} /> */}
                    <MockNFT
                      image={metadata.result.image}
                      height={382}
                      pair={{
                        token0: token0?.symbol ?? null,
                        token1: token1?.symbol ?? null,
                      }}
                      id={tokenId?.toString()}
                      mintTick={position?.tickLower ?? 0}
                      maxTick={position?.tickUpper ?? 0}
                    />
                    {typeof chainId === 'number' && owner && !ownsNFT ? (
                      <ExternalLink href={getExplorerLink(chainId, owner, ExplorerDataType.ADDRESS)}>
                        <Trans>Owner</Trans>
                      </ExternalLink>
                    ) : null}
                  </>
                ) : (
                  <>
                    {/* <Loader /> */}
                    <MockNFT
                      height={382}
                      pair={{
                        token0: token0?.symbol ?? null,
                        token1: token1?.symbol ?? null,
                      }}
                      id={tokenId?.toString()}
                      mintTick={position?.tickLower ?? 0}
                      maxTick={position?.tickUpper ?? 0}
                    />
                  </>
                )}
              </NFTContainer>
              {/* </HideSmall> */}
              <AutoColumn style={{ width: '100%', height: '100%', gap: '34px' }}>
                <DDCard padding="23px 30px">
                  <AutoColumn gap="md" style={{ width: '100%' }}>
                    <AutoColumn gap="md">
                      <Label>
                        <Trans>Liquidity</Trans>
                      </Label>
                      {fiatValueOfLiquidity?.greaterThan(new Fraction(1, 100)) ? (
                        <ThemedText.DeprecatedLargeHeader fontSize="36px" fontWeight={500}>
                          <Trans>${fiatValueOfLiquidity.toFixed(2, { groupSeparator: ',' })}</Trans>
                        </ThemedText.DeprecatedLargeHeader>
                      ) : (
                        <ThemedText.DeprecatedLargeHeader color={theme.textPrimary} fontSize="36px" fontWeight={500}>
                          <Trans>$-</Trans>
                        </ThemedText.DeprecatedLargeHeader>
                      )}
                    </AutoColumn>
                    <DDCardUniversal
                      style={{ background: 'white' }}
                      borderTop="0.15em solid #000"
                      padding="14px 0px 0px 0px"
                    >
                      <AutoColumn gap="md">
                        <RowBetween>
                          <LinkedCurrency chainId={chainId} currency={currencyQuote} />
                          <RowFixed>
                            <ThemedText.DerpBlack>
                              {inverted ? position?.amount0.toSignificant(4) : position?.amount1.toSignificant(4)}
                            </ThemedText.DerpBlack>
                            {typeof ratio === 'number' && !removed ? (
                              <Badge style={{ marginLeft: '10px' }}>
                                <ThemedText.DerpBlack color={theme.textSecondary} fontSize={11}>
                                  <Trans>{inverted ? ratio : 100 - ratio}%</Trans>
                                </ThemedText.DerpBlack>
                              </Badge>
                            ) : null}
                          </RowFixed>
                        </RowBetween>
                        <RowBetween>
                          <LinkedCurrency chainId={chainId} currency={currencyBase} />
                          <RowFixed>
                            <ThemedText.DerpBlack>
                              {inverted ? position?.amount1.toSignificant(4) : position?.amount0.toSignificant(4)}
                            </ThemedText.DerpBlack>
                            {typeof ratio === 'number' && !removed ? (
                              <Badge style={{ marginLeft: '10px' }}>
                                <ThemedText.DerpBlack color={theme.textSecondary} fontSize={11}>
                                  <Trans>{inverted ? 100 - ratio : ratio}%</Trans>
                                </ThemedText.DerpBlack>
                              </Badge>
                            ) : null}
                          </RowFixed>
                        </RowBetween>
                      </AutoColumn>
                    </DDCardUniversal>
                  </AutoColumn>
                </DDCard>
                <DDCard padding="23px 30px">
                  <AutoColumn gap="md" style={{ width: '100%' }}>
                    <AutoColumn gap="md">
                      <RowBetween style={{ alignItems: 'flex-start' }}>
                        <AutoColumn gap="md">
                          <Label>
                            <Trans>Unclaimed fees</Trans>
                          </Label>
                          {fiatValueOfFees?.greaterThan(new Fraction(1, 100)) ? (
                            <ThemedText.DeprecatedLargeHeader
                              color={theme.accentSuccess}
                              fontSize="36px"
                              fontWeight={500}
                            >
                              <Trans>${fiatValueOfFees.toFixed(2, { groupSeparator: ',' })}</Trans>
                            </ThemedText.DeprecatedLargeHeader>
                          ) : (
                            <ThemedText.DeprecatedLargeHeader
                              color={theme.textPrimary}
                              fontSize="36px"
                              fontWeight={500}
                            >
                              <Trans>$-</Trans>
                            </ThemedText.DeprecatedLargeHeader>
                          )}
                        </AutoColumn>
                        {ownsNFT &&
                        (feeValue0?.greaterThan(0) || feeValue1?.greaterThan(0) || !!collectMigrationHash) ? (
                          <ResponsiveButtonConfirmed
                            disabled={collecting || !!collectMigrationHash}
                            confirmed={!!collectMigrationHash && !isCollectPending}
                            width="fit-content"
                            style={{ borderRadius: '8px' }}
                            padding="4px 8px"
                            onClick={() => setShowConfirm(true)}
                          >
                            {!!collectMigrationHash && !isCollectPending ? (
                              <ThemedText.DerpBlack color={theme.textPrimary}>
                                <Trans> Collected</Trans>
                              </ThemedText.DerpBlack>
                            ) : isCollectPending || collecting ? (
                              <ThemedText.DerpBlack color={theme.textPrimary}>
                                {' '}
                                <Dots>
                                  <Trans>Collecting</Trans>
                                </Dots>
                              </ThemedText.DerpBlack>
                            ) : (
                              <>
                                <ThemedText.DerpBlack color={theme.white}>
                                  <Trans>Collect fees</Trans>
                                </ThemedText.DerpBlack>
                              </>
                            )}
                          </ResponsiveButtonConfirmed>
                        ) : null}
                      </RowBetween>
                    </AutoColumn>
                    <DDCardUniversal
                      style={{
                        background: 'white',
                      }}
                      borderTop="0.15em solid #000"
                      padding="14px 0px 0px 0px"
                    >
                      <AutoColumn gap="md">
                        <RowBetween>
                          <RowFixed>
                            <CurrencyLogo
                              currency={feeValueUpper?.currency}
                              size="28px"
                              style={{ marginRight: '0.5rem' }}
                            />
                            <ThemedText.DerpBlack>{feeValueUpper?.currency?.symbol}</ThemedText.DerpBlack>
                          </RowFixed>
                          <RowFixed>
                            <ThemedText.DerpBlack>
                              {feeValueUpper ? formatCurrencyAmount(feeValueUpper, 4) : '-'}
                            </ThemedText.DerpBlack>
                          </RowFixed>
                        </RowBetween>
                        <RowBetween>
                          <RowFixed>
                            <CurrencyLogo
                              currency={feeValueLower?.currency}
                              size="28px"
                              style={{ marginRight: '0.5rem' }}
                            />
                            <ThemedText.DerpBlack>{feeValueLower?.currency?.symbol}</ThemedText.DerpBlack>
                          </RowFixed>
                          <RowFixed>
                            <ThemedText.DerpBlack>
                              {feeValueLower ? formatCurrencyAmount(feeValueLower, 4) : '-'}
                            </ThemedText.DerpBlack>
                          </RowFixed>
                        </RowBetween>
                      </AutoColumn>
                    </DDCardUniversal>
                    {showCollectAsWeth && (
                      <AutoColumn gap="md">
                        <RowBetween>
                          <ThemedText.DerpBlack>
                            <Trans>Collect as {nativeWrappedSymbol}</Trans>
                          </ThemedText.DerpBlack>
                          <Toggle
                            id="receive-as-weth"
                            isActive={receiveWETH}
                            toggle={() => setReceiveWETH((receiveWETH) => !receiveWETH)}
                          />
                        </RowBetween>
                      </AutoColumn>
                    )}
                  </AutoColumn>
                </DDCard>
                <DarkCard padding="0px" mt="17px">
                  <AutoColumn gap="md">
                    <RowBetween>
                      <RowFixed>
                        <Label display="flex" style={{ marginRight: '12px' }}>
                          <Trans>Price range</Trans>
                        </Label>
                        <HideExtraSmall>
                          <>
                            <RangeBadge removed={removed} inRange={inRange} />
                            <span style={{ width: '8px' }} />
                          </>
                        </HideExtraSmall>
                      </RowFixed>
                      <RowFixed>
                        {currencyBase && currencyQuote && (
                          <RateToggle
                            currencyA={currencyBase}
                            currencyB={currencyQuote}
                            handleRateToggle={() => setManuallyInverted(!manuallyInverted)}
                          />
                        )}
                      </RowFixed>
                    </RowBetween>

                    <RowBetween
                      className={styles.RowHelper}
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '8px',
                        alignItems: 'center',
                      }}
                    >
                      {isMobile ? (
                        <Box id="row-when-desktop" className={styles.RowWhenDesktop}>
                          <DDCardUniversal className={styles.OverrideCard} background="none" width="100%">
                            <AutoColumn gap="sm" justify="center">
                              <ExtentsText style={{ fontSize: '16px', color: '#000', fontWeight: '600' }}>
                                <Trans>Min Price</Trans>
                              </ExtentsText>
                              <div className={styles.ValuePanel}>
                                <ThemedText.DeprecatedMediumHeader fontSize="20px" fontWeight="600" textAlign="center">
                                  {formatTickPrice({
                                    price: priceLower,
                                    atLimit: tickAtLimit,
                                    direction: Bound.LOWER,
                                    numberType: NumberType.TokenTx,
                                  })}
                                </ThemedText.DeprecatedMediumHeader>
                              </div>
                              <ExtentsText style={{ fontSize: '16px', color: '#000', fontWeight: '600' }}>
                                <Trans>
                                  {currencyQuote?.symbol} per {currencyBase?.symbol}
                                </Trans>
                              </ExtentsText>
                            </AutoColumn>
                          </DDCardUniversal>

                          <DDCardUniversal className={styles.OverrideCard} background="none" width="100%">
                            <AutoColumn gap="sm" justify="center">
                              <ExtentsText style={{ fontSize: '16px', color: '#000', fontWeight: '600' }}>
                                <Trans>Max Price</Trans>
                              </ExtentsText>
                              <div className={styles.ValuePanel}>
                                <ThemedText.DeprecatedMediumHeader fontSize="20px" fontWeight="600" textAlign="center">
                                  {formatTickPrice({
                                    price: priceUpper,
                                    atLimit: tickAtLimit,
                                    direction: Bound.UPPER,
                                    numberType: NumberType.TokenTx,
                                  })}
                                </ThemedText.DeprecatedMediumHeader>
                              </div>
                              <ExtentsText style={{ fontSize: '16px', color: '#000', fontWeight: '600' }}>
                                <Trans>
                                  {currencyQuote?.symbol} per {currencyBase?.symbol}
                                </Trans>
                              </ExtentsText>
                            </AutoColumn>
                          </DDCardUniversal>
                        </Box>
                      ) : (
                        <>
                          <DDCardUniversal className={styles.OverrideCard} background="none" width="100%">
                            <AutoColumn gap="sm" justify="center">
                              <ExtentsText style={{ fontSize: '16px', color: '#000', fontWeight: '600' }}>
                                <Trans>Min Price</Trans>
                              </ExtentsText>
                              <div className={styles.ValuePanel}>
                                <ThemedText.DeprecatedMediumHeader fontSize="20px" fontWeight="600" textAlign="center">
                                  {formatTickPrice({
                                    price: priceLower,
                                    atLimit: tickAtLimit,
                                    direction: Bound.LOWER,
                                    numberType: NumberType.TokenTx,
                                  })}
                                </ThemedText.DeprecatedMediumHeader>
                              </div>
                              <ExtentsText style={{ fontSize: '16px', color: '#000', fontWeight: '600' }}>
                                <Trans>
                                  {currencyQuote?.symbol} per {currencyBase?.symbol}
                                </Trans>
                              </ExtentsText>
                            </AutoColumn>
                          </DDCardUniversal>

                          <DDCardUniversal
                            className={styles.OverrideCard}
                            background="none"
                            padding="12px"
                            width="100%"
                          >
                            <AutoColumn gap="sm" justify="center">
                              <ExtentsText style={{ fontSize: '16px', color: '#000', fontWeight: '600' }}>
                                <Trans>Max Price</Trans>
                              </ExtentsText>
                              <div className={styles.ValuePanel}>
                                <ThemedText.DeprecatedMediumHeader fontSize="20px" fontWeight="600" textAlign="center">
                                  {formatTickPrice({
                                    price: priceUpper,
                                    atLimit: tickAtLimit,
                                    direction: Bound.UPPER,
                                    numberType: NumberType.TokenTx,
                                  })}
                                </ThemedText.DeprecatedMediumHeader>
                              </div>
                              <ExtentsText style={{ fontSize: '16px', color: '#000', fontWeight: '600' }}>
                                <Trans>
                                  {currencyQuote?.symbol} per {currencyBase?.symbol}
                                </Trans>
                              </ExtentsText>
                            </AutoColumn>
                          </DDCardUniversal>
                        </>
                      )}

                      <DDCardUniversal className={styles.OverrideCard} background="none" width="100%">
                        <AutoColumn gap="sm" justify="center">
                          <ExtentsText style={{ fontSize: '16px', color: '#000', fontWeight: '600' }}>
                            <Trans>Current Price</Trans>
                          </ExtentsText>
                          <div className={styles.ValuePanel}>
                            <ThemedText.DeprecatedMediumHeader fontSize="20px" fontWeight="600" textAlign="center">
                              {!pool || !currencyQuote || !currencyBase
                                ? '-'
                                : formatPrice(inverted ? pool.token1Price : pool.token0Price, NumberType.TokenTx)}
                            </ThemedText.DeprecatedMediumHeader>
                          </div>
                          <ExtentsText style={{ fontSize: '16px', color: '#000', fontWeight: '600' }}>
                            <Trans>
                              {currencyQuote?.symbol} per {currencyBase?.symbol}
                            </Trans>
                          </ExtentsText>
                        </AutoColumn>
                      </DDCardUniversal>
                    </RowBetween>
                    <IncreaseRemoveWrapper>
                      {ownsNFT && (
                        <>
                          {tokenId && !removed ? (
                            <DDButtonRemove as={Link} to={`/remove/${tokenId}`}>
                              <TrashIcon />
                            </DDButtonRemove>
                          ) : null}
                          {currency0 && currency1 && feeAmount && tokenId ? (
                            <DDButtonGradientFlex
                              as={Link}
                              to={`/increase/${currencyId(currency0)}/${currencyId(currency1)}/${feeAmount}/${tokenId}`}
                            >
                              <GloriaText size="xxl">
                                <Trans>Increase Liquidity</Trans>
                              </GloriaText>
                            </DDButtonGradientFlex>
                          ) : null}
                        </>
                      )}
                    </IncreaseRemoveWrapper>
                  </AutoColumn>
                </DarkCard>
              </AutoColumn>
            </ResponsiveRow>
          </AutoColumn>
        </DDPageWrapper>
        <SwitchLocaleLink />
      </>
    </Trace>
  )
}
