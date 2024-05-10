/* eslint-disable import/no-unused-modules */
// ONLY FOR 1INCH

import { useAtom } from 'jotai'
import { useState } from 'react'

import { CGDATA_ATOM, coingackoAtom } from '../atom/coingecko.atom'
import { BIND_XY_MAINNET } from './MOCK_ERC20_BINDING'

const getCoingeckoId = (symbol?: string) => {
  if (!symbol) return undefined
  const id = BIND_XY_MAINNET[symbol]

  return id ? id : undefined
}
// return Object keys for a price from Coingecko response based on token id
const getPriceObj = (data: any, cgid?: string): { usd: number } => {
  const responseData = data

  const find = Object.keys(responseData).filter((a: string) => a === cgid)[0]
  return data[find]
}

const convertedPriceOutput = (priceA: number, priceB: number) => {
  return priceA / priceB
}
const priceImpactOutput = (priceOutput: number, oraclePrice: number) => {
  const impact = Math.abs((priceOutput / oraclePrice - 1) * 100)
  return impact
}

export type _1NCH_PRICE_IMPACT = 'NONE' | 'MODERATE' | 'SEVERE'

export enum _1NCH_PRICE_IMPACT_TYPE {
  NONE = 'NONE',
  MODERATE = 'MODERATE',
  SEVERE = 'SEVERE',
}
export const useCheckPriceImpact = () => {
  const [priceImpact1inchState, setPriceImpact1inchState] = useState<_1NCH_PRICE_IMPACT>(_1NCH_PRICE_IMPACT_TYPE.NONE)
  const [priceImpact1inch, setPriceImpact1inch] = useState<number>(0)
  const [isLoadingPriceImpact, setLoadingPriceImpact] = useState<boolean>(false)

  // Redux state alternative
  const [coingeckoData, setCoingeckoData] = useAtom(coingackoAtom)

  const getBasePrice = async ({
    tokenInSymbol,
    tokenOutSymbol,
    typedValue,
    outputAmount,
  }: {
    tokenInSymbol?: string
    tokenOutSymbol?: string
    typedValue: string
    outputAmount?: string
  }) => {
    if ((!tokenInSymbol && !tokenOutSymbol) || !outputAmount) throw 'token to swap and output amount is required'

    const cgid_tokenIn = getCoingeckoId(tokenInSymbol)
    const cgid_tokenOut = getCoingeckoId(tokenOutSymbol)

    if (!cgid_tokenIn && !cgid_tokenOut) throw 'Coingecko ID not found/unsupported'

    try {
      setLoadingPriceImpact(true)

      // Check if symbols already exist in coingeckoData
      const existingSymbolInOutIndex = coingeckoData.findIndex(
        (item) => item.symbolIn === cgid_tokenIn?.coingeckoId && item.symbolOut === cgid_tokenOut?.coingeckoId
      )

      let priceA: { usd: number } = { usd: 0 }
      let priceB: { usd: number } = { usd: 0 }
      let convertedPrice = 0

      if (
        existingSymbolInOutIndex === -1 ||
        (coingeckoData[existingSymbolInOutIndex] &&
          Date.now() - coingeckoData[existingSymbolInOutIndex].timestamp > 60 * 1000)
      ) {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${cgid_tokenIn?.coingeckoId}%2C${cgid_tokenOut?.coingeckoId}&vs_currencies=usd`
        )

        if (response.ok) {
          const data = await response.json()
          priceA = getPriceObj(data, cgid_tokenIn?.coingeckoId)
          priceB = getPriceObj(data, cgid_tokenOut?.coingeckoId)
          convertedPrice = convertedPriceOutput(priceA.usd, priceB.usd)
          if (cgid_tokenIn?.coingeckoId && cgid_tokenOut?.coingeckoId) {
            const cachedCoingeckoObj: CGDATA_ATOM = {
              symbolIn: cgid_tokenIn.coingeckoId,
              symbolOut: cgid_tokenOut.coingeckoId,
              currentPrice: convertedPrice,
              timestamp: Date.now(),
            }

            setCoingeckoData((prevData) => {
              const updatedData = [...prevData]

              const symbolInOutIndex = updatedData.findIndex(
                (item) =>
                  item.symbolOut === cachedCoingeckoObj.symbolOut && item.symbolIn === cachedCoingeckoObj.symbolIn
              )

              if (symbolInOutIndex === -1) {
                updatedData.push(cachedCoingeckoObj) // Append the new item
              } else {
                updatedData[symbolInOutIndex] = cachedCoingeckoObj // Update the existing item
              }

              return updatedData
            })
          }
        } else {
          throw 'Coingecko API Error'
        }
      } else {
        convertedPrice = coingeckoData[existingSymbolInOutIndex].currentPrice
      }

      if (!convertedPrice && !outputAmount) throw 'Cannot convert, undefined convertedPrice or OutputAmount'
      const priceImpact = priceImpactOutput(
        Number(outputAmount?.replaceAll(',', '')),
        convertedPrice * Number(typedValue)
      )

      // POSITIVE OUTPUT is the determination of the low impact output which do not determined as high impact
      const isPositiveOutput = Number(outputAmount?.replaceAll(',', '')) / Number(typedValue) > convertedPrice

      if (priceImpact >= 5 && priceImpact < 10 && !isPositiveOutput) {
        setPriceImpact1inchState(_1NCH_PRICE_IMPACT_TYPE.MODERATE)
      } else if (priceImpact > 10 && !isPositiveOutput) {
        setPriceImpact1inchState(_1NCH_PRICE_IMPACT_TYPE.SEVERE)
      } else {
        setPriceImpact1inchState(_1NCH_PRICE_IMPACT_TYPE.NONE)
      }

      setLoadingPriceImpact(false)
      setPriceImpact1inch(priceImpact)
    } catch (err) {
      setPriceImpact1inch(0)
      setLoadingPriceImpact(false)
      console.log('[Error on useCheckPriceImpact]:', err)
    }
  }

  return {
    priceImpact1inchState,
    isLoadingPriceImpact,
    priceImpact1inch,
    getBasePrice,
  }
}
