import { Position } from '@derpdex/sdk'
import { BigNumber } from '@ethersproject/bignumber'
import { Trans } from '@lingui/macro'
import { Box } from '@mui/material'
import { Percent, Price, Token } from '@uniswap/sdk-core'
import RangeBadge from 'components/Badge/RangeBadge'
import { NunitoText } from 'components/CustomFonts/Nunito'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import HoverInlineText from 'components/HoverInlineText'
import Loader from 'components/Icons/LoadingSpinner'
import { RowBetween } from 'components/Row'
import { useToken } from 'hooks/Tokens'
import useIsTickAtLimit from 'hooks/useIsTickAtLimit'
import { useDerpPool } from 'hooks/usePools'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Bound } from 'state/mint/v3/actions'
import styled from 'styled-components/macro'
import { HideSmall, MEDIA_WIDTHS, SmallOnly, ThemedText } from 'theme'
import { formatTickPrice } from 'utils/formatTickPrice'
import { unwrappedToken } from 'utils/unwrappedToken'

import { DAI, USDC_MAINNET, USDT, WBTC, WRAPPED_NATIVE_CURRENCY } from '../../constants/tokens'

const LinkRow = styled(Link)`
  border-radius: 12px;
  border: 0.15em solid #000;
  box-shadow: 3px 3px 0px 0px #000, 4px 4px 0px 0px rgba(0, 0, 0, 0.25) inset;
  background: #fff;

  align-items: center;
  display: flex;
  cursor: pointer;
  user-select: none;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;

  color: ${({ theme }) => theme.black};
  padding: 24px 30px;
  text-decoration: none;
  font-size: 20px;
  font-weight: 600;

  & > div:not(:first-child) {
    text-align: center;
  }
  :hover {
    background-color: ${({ theme }) => theme.hoverDefault};
  }

  @media screen and (min-width: ${MEDIA_WIDTHS.deprecated_upToSmall}px) {
    /* flex-direction: row; */
  }

  @media screen and (max-width: 768px) {
    padding: 10px;
  }

  ${({ theme }) => theme.deprecated_mediaWidth.deprecated_upToSmall`
    flex-direction: column;
    row-gap: 8px;
  `};
`

const DataLineItem = styled.div`
  font-size: 14px;
`

const RangeLineItem = styled(DataLineItem)`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 4px;
  width: 100%;

  @media (max-width: 768px) {
    align-items: flex-start;
    justify-content: flex-start;
    flex-direction: column;

    #small-arrow {
      display: none;
    }
  }
`

const DoubleArrow = styled.span`
  font-size: 12px;
  margin: 0 2px;
  color: ${({ theme }) => theme.textTertiary};
`

const RangeText = styled(ThemedText.Caption)`
  font-size: 16px !important;
  font-weight: 600 !important;
  // word-break: break-word;
  // padding: 0.25rem 0.25rem;
  border-radius: 8px;

  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
`

const FeeTierText = styled(ThemedText.UtilityBadge)`
  font-size: 10px !important;
  margin-left: 14px !important;
`
const ExtentsText = styled(ThemedText.Caption)`
  color: ${({ theme }) => theme.textTertiary};
  display: inline-block;
  line-height: 16px;
  margin-right: 4px !important;
  ${({ theme }) => theme.deprecated_mediaWidth.deprecated_upToSmall`
    display: none;
  `};
`

const PrimaryPositionIdData = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  gap: 8px;

  > * {
    margin-right: 8px;
  }

  @media only screen and (max-width: 768px) {
    font-size: 16px !important;
  }
`

const FocusedTextBlue = styled.div`
  color: #3683f5;
  font-family: Inter;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`

interface PositionListItemProps {
  token0: string
  token1: string
  tokenId: BigNumber
  fee: number
  liquidity: BigNumber
  tickLower: number
  tickUpper: number
}

export function getPriceOrderingFromPositionForUI(position?: Position): {
  priceLower?: Price<Token, Token>
  priceUpper?: Price<Token, Token>
  quote?: Token
  base?: Token
} {
  if (!position) {
    return {}
  }

  const token0 = position.amount0.currency
  const token1 = position.amount1.currency

  // if token0 is a dollar-stable asset, set it as the quote token
  const stables = [DAI, USDC_MAINNET, USDT]
  if (stables.some((stable) => stable.equals(token0))) {
    return {
      priceLower: position.token0PriceUpper.invert(),
      priceUpper: position.token0PriceLower.invert(),
      quote: token0,
      base: token1,
    }
  }

  // if token1 is an ETH-/BTC-stable asset, set it as the base token
  const bases = [...Object.values(WRAPPED_NATIVE_CURRENCY), WBTC]
  if (bases.some((base) => base && base.equals(token1))) {
    return {
      priceLower: position.token0PriceUpper.invert(),
      priceUpper: position.token0PriceLower.invert(),
      quote: token0,
      base: token1,
    }
  }

  // if both prices are below 1, invert
  if (position.token0PriceUpper.lessThan(1)) {
    return {
      priceLower: position.token0PriceUpper.invert(),
      priceUpper: position.token0PriceLower.invert(),
      quote: token0,
      base: token1,
    }
  }

  // otherwise, just return the default
  return {
    priceLower: position.token0PriceLower,
    priceUpper: position.token0PriceUpper,
    quote: token1,
    base: token0,
  }
}

export default function PositionListItem({
  token0: token0Address,
  token1: token1Address,
  tokenId,
  fee: feeAmount,
  liquidity,
  tickLower,
  tickUpper,
}: PositionListItemProps) {
  const token0 = useToken(token0Address)
  const token1 = useToken(token1Address)

  const currency0 = token0 ? unwrappedToken(token0) : undefined
  const currency1 = token1 ? unwrappedToken(token1) : undefined

  // construct Position from details returned
  // const [, pool] = usePool(currency0 ?? undefined, currency1 ?? undefined, feeAmount)

  const [, poolV2] = useDerpPool(currency0 ?? undefined, currency1 ?? undefined, feeAmount)

  const position = useMemo(() => {
    if (poolV2) {
      return new Position({ pool: poolV2, liquidity: liquidity.toString(), tickLower, tickUpper })
    }
    return undefined
  }, [liquidity, poolV2, tickLower, tickUpper])

  const tickAtLimit = useIsTickAtLimit(feeAmount, tickLower, tickUpper)

  // prices
  const { priceLower, priceUpper, quote, base } = getPriceOrderingFromPositionForUI(position)

  const currencyQuote = quote && unwrappedToken(quote)
  const currencyBase = base && unwrappedToken(base)

  // check if price is within range
  const outOfRange: boolean = poolV2 ? poolV2.tickCurrent < tickLower || poolV2.tickCurrent >= tickUpper : false

  const positionSummaryLink = '/pools/' + tokenId

  const removed = liquidity?.eq(0)

  return (
    <LinkRow to={positionSummaryLink}>
      <RowBetween>
        <PrimaryPositionIdData>
          <Box ml="-4px">
            <DoubleCurrencyLogo currency0={currencyBase} currency1={currencyQuote} size={20} margin />
          </Box>

          <NunitoText>
            {currencyQuote?.symbol}&nbsp;/&nbsp;{currencyBase?.symbol}
          </NunitoText>

          <FocusedTextBlue>
            <Trans>{new Percent(feeAmount, 1_000_000).toSignificant()}%</Trans>
          </FocusedTextBlue>
        </PrimaryPositionIdData>
        <RangeBadge removed={removed} inRange={!outOfRange} />
      </RowBetween>

      {priceLower && priceUpper ? (
        <RangeLineItem>
          <RangeText>
            <FocusedTextBlue>
              <Trans>Min: </Trans>
            </FocusedTextBlue>
            <Trans>
              <span>
                {formatTickPrice({
                  price: priceLower,
                  atLimit: tickAtLimit,
                  direction: Bound.LOWER,
                })}{' '}
              </span>
              <HoverInlineText text={currencyQuote?.symbol} /> per <HoverInlineText text={currencyBase?.symbol ?? ''} />
            </Trans>
          </RangeText>{' '}
          <HideSmall>
            <DoubleArrow>↔</DoubleArrow>{' '}
          </HideSmall>
          <SmallOnly id="small-arrow">
            <DoubleArrow>↔</DoubleArrow>{' '}
          </SmallOnly>
          <RangeText>
            <FocusedTextBlue>
              <Trans>Max:</Trans>
            </FocusedTextBlue>
            <Trans>
              <span>
                {formatTickPrice({
                  price: priceUpper,
                  atLimit: tickAtLimit,
                  direction: Bound.UPPER,
                })}{' '}
              </span>
              <HoverInlineText text={currencyQuote?.symbol} /> per{' '}
              <HoverInlineText maxCharacters={10} text={currencyBase?.symbol} />
            </Trans>
          </RangeText>
        </RangeLineItem>
      ) : (
        <Loader />
      )}
    </LinkRow>
  )
}
