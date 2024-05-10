/* eslint-disable import/no-unused-modules */
import { Currency, CurrencyAmount, TradeType } from '@uniswap/sdk-core'
import { useWeb3React } from '@web3-react/core'
import useAutoSlippageTolerance from 'hooks/useAutoSlippageTolerance'
import { XYFINANCE_NATIVE_ADDRESS } from 'pages/Swap/hooks/MOCK_ERC20_BINDING'
import { useMemo } from 'react'
import { useUserSlippageToleranceWithDefault } from 'state/user/hooks'

/**
 * Returns query arguments for the Routing API query or undefined if the
 * query should be skipped. Input arguments do not need to be memoized, as they will
 * be destructured.
 */
export function useXYFinanceRoutingAPIArguments({
  srcQuoteToken,
  dstQuoteToken,
  srcQuoteTokenAmount,
  tradeType = TradeType.EXACT_INPUT,
}: {
  srcQuoteToken?: Currency
  dstQuoteToken?: Currency
  srcQuoteTokenAmount?: CurrencyAmount<Currency>
  tradeType: TradeType
}) {
  const { chainId } = useWeb3React()
  const autoSlippage = useAutoSlippageTolerance()
  const allowedSlippage = useUserSlippageToleranceWithDefault(autoSlippage)
  return useMemo(
    () =>
      !srcQuoteToken ||
      !dstQuoteToken ||
      !srcQuoteTokenAmount ||
      srcQuoteToken.equals(dstQuoteToken) ||
      srcQuoteToken.wrapped.equals(dstQuoteToken.wrapped) ||
      !chainId
        ? undefined
        : {
            srcQuoteTokenAmount: srcQuoteTokenAmount.quotient.toString(),
            srcQuoteTokenAddress: srcQuoteToken.isNative ? XYFINANCE_NATIVE_ADDRESS : srcQuoteToken.wrapped.address,
            tokenInDecimals: srcQuoteToken.decimals,
            tokenInSymbol: srcQuoteToken.symbol,
            dstQuoteTokenAddress: dstQuoteToken.isNative ? XYFINANCE_NATIVE_ADDRESS : dstQuoteToken.wrapped.address,
            tokenOutDecimals: dstQuoteToken.decimals,
            tokenOutSymbol: dstQuoteToken.symbol,
            tradeType,

            srcChainId: chainId,
            dstChainId: chainId,
            slippage: Number(allowedSlippage.toFixed()),
          },
    [srcQuoteTokenAmount, srcQuoteToken, dstQuoteToken, tradeType, chainId, allowedSlippage]
  )
}
