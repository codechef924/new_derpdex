/* eslint-disable import/no-unused-modules */
import { Currency } from '@uniswap/sdk-core'
import { useWeb3React } from '@web3-react/core'
import useStablecoinPriceV2 from 'hooks/useStablecoinPriceV2'
import { useMemo } from 'react'

import { SUPPORTED_CHAIN_FOR_ZAP_TO_EARN } from './../constants/general'

export const useEstimatePoolValuation = ({
  amount,
  tokenToZap,
  token0,
  token1,
}: {
  amount: string
  tokenToZap?: Currency | null
  token0?: Currency | null
  token1?: Currency | null
}) => {
  const { chainId } = useWeb3React()
  const priceTokenToZap = useStablecoinPriceV2(
    chainId && SUPPORTED_CHAIN_FOR_ZAP_TO_EARN.includes(chainId) && tokenToZap ? tokenToZap : undefined
  )

  // const fiatValueOfLiquidity = useMemo(() => {
  //   if (!price0 || !price1 || !halvingPriceOfTokenToZap) return null
  //   //! This is to calculate the amount of LP!
  //   return (
  //     halvingPriceOfTokenToZap / parseFloat(price0.toSignificant(token0?.decimals)) +
  //     halvingPriceOfTokenToZap / parseFloat(price1.toSignificant(token1?.decimals))
  //   )
  // }, [halvingPriceOfTokenToZap, price0, price1, token0, token1, amount])

  const finalizedValuation = useMemo(() => {
    if (priceTokenToZap && amount) {
      // return fiatValueOfLiquidity.toFixed(6)
      return (parseFloat(priceTokenToZap?.toSignificant(tokenToZap?.decimals)) * parseFloat(amount)).toPrecision(8)
    } else {
      return '0'
    }
  }, [amount, priceTokenToZap])

  return finalizedValuation.toString()
}
