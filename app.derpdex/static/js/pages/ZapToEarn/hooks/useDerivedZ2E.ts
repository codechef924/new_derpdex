/* eslint-disable import/no-unused-modules */
import { Currency, CurrencyAmount, Percent } from '@uniswap/sdk-core'
import { useWeb3React } from '@web3-react/core'
import { SupportedChainId } from 'constants/chains'
import { useCurrency } from 'hooks/Tokens'
import { useCurrencyBalances } from 'lib/hooks/useCurrencyBalance'
import { ReactNode, useMemo } from 'react'
import { Field } from 'state/zap2earn/action'
import { ZapToEarnState } from 'state/zap2earn/reducer'

import { SUPPORTED_CHAIN_FOR_ZAP_TO_EARN } from './../constants/general'

type Zap2EarnInfo = {
  currencies: { [field in Field]?: Currency | null }
  currencyBalances: { [field in Field]?: CurrencyAmount<Currency> }
  parsedAmount?: CurrencyAmount<Currency>
  inputError?: ReactNode
  allowedSlippage: Percent
  autoSlippage: Percent
}

// export const useDerivedZ2E = (state: ZapToEarnState, chainId: SupportedChainId | undefined): Zap2EarnInfo => {
//   const { account } = useWeb3React()
// }

// Test
export const useGetInputBalance = ({ inputCurrency }: { inputCurrency?: Currency | null }) => {
  const { account } = useWeb3React()
  const relevantTokenBalances = useCurrencyBalances(
    account ?? undefined,
    useMemo(() => [inputCurrency ?? undefined, undefined], [inputCurrency])
  )

  const inputCurrencyBalance = useMemo(() => relevantTokenBalances, [relevantTokenBalances])
  return inputCurrencyBalance[0]
}

export const useZapCurrencies = (state: ZapToEarnState) => {
  const { chainId } = useWeb3React()
  // const inputCurrency = useCurrency('ETH', chainId)
  // const outputCurrency = useCurrency('0x46caA59e33FEb040442CC9722922260cBdDb3F6F')
  const {
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = state

  return {
    [Field.INPUT]: useCurrency(inputCurrencyId, chainId),
  }
}

export const useSupportedCurrencies = () => {
  const { chainId } = useWeb3React()
  const fallbackChainId = useMemo(() => {
    if (chainId && SUPPORTED_CHAIN_FOR_ZAP_TO_EARN.includes(chainId)) {
      return chainId
    } else {
      return SupportedChainId.ZKSYNC_MAINNET
    }
  }, [chainId])
  const inputCurrency = useCurrency('ETH', fallbackChainId)
  const outputCurrency = useCurrency('0x46caA59e33FEb040442CC9722922260cBdDb3F6F')
  return {
    [Field.INPUT]: inputCurrency,
    [Field.OUTPUT]: outputCurrency,
  }
}
