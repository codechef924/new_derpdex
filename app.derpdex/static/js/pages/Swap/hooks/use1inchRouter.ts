/* eslint-disable @typescript-eslint/no-restricted-imports */
/* eslint-disable @typescript-eslint/no-loss-of-precision */
/* eslint-disable import/no-unused-modules */
import { Trade } from '@derpdex/router-sdk'
import { ERC20Abi } from '@looksrare/sdk'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import { Currency, CurrencyAmount, Percent, TradeType } from '@uniswap/sdk-core'
import { useWeb3React } from '@web3-react/core'
import { SupportedChainId } from 'constants/chains'
import { Contract } from 'ethers'
import { useXYFinanceRoutingAPIArguments } from 'lib/hooks/routing/use1inchRoutingAPIArguments'
import { SetStateAction, useMemo, useState } from 'react'
import { useGetQuoteXYFinanceQuery } from 'state/routing/_xyFinance.slice'
import { InterfaceTrade, QuoteState, TradeState } from 'state/routing/types'
import { useTransactionAdder } from 'state/transactions/hooks'
import { TransactionType } from 'state/transactions/types'
import { currencyId } from 'utils/currencyId'

import { BIND_XY_MAINNET } from './MOCK_ERC20_BINDING'

const _XY_SPENDER: { [key: number]: string } = {
  [SupportedChainId.ZKSYNC_MAINNET]: '0x30E63157bD0bA74C814B786F6eA2ed9549507b46',
  [SupportedChainId.BASE_MAINNET]: '0x6aCd0Ec9405CcB701c57A88849C4F1CD85a3f3ab',
}

export const useCheckXYFinanceAllowanceContractCall = () => {
  const [isLoadingCheckAllowance, setIsLoadingCheckAllowance] = useState<boolean>(false)
  const [hasAllowance, setHasAllowance] = useState<boolean>(false)
  const { chainId, provider } = useWeb3React()
  const checkAllowanceContractCall = async ({
    tokenInAddress,
    walletAddress,
  }: {
    tokenInAddress?: string | null
    walletAddress?: string | null
  }) => {
    try {
      setIsLoadingCheckAllowance(true)
      if (!provider || !chainId) throw 'Undefined provider or chainId'

      const signer = provider.getSigner()

      if (!tokenInAddress) throw 'Missing token in address'

      const isNative = Object.values(BIND_XY_MAINNET).find(
        (e) => e.address.toLowerCase() === tokenInAddress.toLowerCase() && e.tags.includes('native')
      )
      if (isNative) {
        setHasAllowance(true)
      } else {
        const ERC20Contract = new Contract(tokenInAddress, ERC20Abi, signer)

        const allowance = await ERC20Contract.allowance(walletAddress, _XY_SPENDER[chainId])
        if (Number(allowance) > 0) {
          setHasAllowance(true)
          console.log('[checkAllowance]: allowance allocated')
        } else {
          setHasAllowance(false)
        }
      }
      setIsLoadingCheckAllowance(false)
    } catch (error) {
      console.log('[Error in checkAllowance]', error)
      setIsLoadingCheckAllowance(false)
    }
  }
  return {
    isLoadingCheckAllowance,
    hasAllowance,
    setHasAllowance,
    checkAllowanceContractCall,
  }
}

const DEFAULT_SPENDING_CAP = 1157920892373161954235709850086879078532699846

export const useApproveXYFinanceAllowanceContractCall = () => {
  const addTransaction = useTransactionAdder()
  const [isLoadingSignAndApproved1inchRouter, setIsLoadingSignAndApproved1inchRouter] = useState<boolean>(false)
  const [isSignAndApproved1inchRouter, setIsSignAndApproved1inchRouter] = useState<boolean>(false)
  const [isErrorSignAndApproved1inchRouter, setIsErrorSignAndApproved1inchRouter] = useState<boolean>(false)
  const { provider, chainId } = useWeb3React()

  const approveERC20 = async (
    tokenToApproveAddress: string | undefined,
    setHasAllowance: React.Dispatch<SetStateAction<boolean>>
  ) => {
    try {
      setIsLoadingSignAndApproved1inchRouter(true)
      if (!provider || !chainId) throw 'No provider or chainId'

      const signer = provider.getSigner()

      if (!tokenToApproveAddress) throw 'Missing token in address'

      const ERC20Contract = new Contract(tokenToApproveAddress, ERC20Abi, signer)

      const tx = await ERC20Contract.approve(_XY_SPENDER[chainId], BigInt(DEFAULT_SPENDING_CAP))
      let receipt = null
      while (receipt === null) {
        try {
          receipt = await provider.getTransactionReceipt(tx.hash)
          if (receipt === null) {
            console.log(`Trying again to fetch txn receipt....`)
            continue
          }
        } catch (e) {
          console.log(`Receipt error:`, e)
          break
        }
      }
      setHasAllowance(true)
      addTransaction(tx, {
        type: TransactionType.APPROVAL,
        tokenAddress: tokenToApproveAddress,
        spender: _XY_SPENDER[chainId],
      })

      setIsSignAndApproved1inchRouter(true)
      setIsLoadingSignAndApproved1inchRouter(false)
    } catch (error) {
      console.log('[ERR]', error)
      setIsLoadingSignAndApproved1inchRouter(false)
    }
  }
  return {
    approveERC20,
    isErrorSignAndApproved1inchRouter,
    isLoadingSignAndApproved1inchRouter,
    isSignAndApproved1inchRouter,
  }
}

interface QuoteParams {
  fromTokenAddress: string
  toTokenAddress: string
  amount: number | string
  fee?: string
  protocols?: string
  gasLimit?: string
  connectorTokens?: string
  complexityLevel?: string
  mainRouteParts?: string
  parts?: string
  gasPrice?: string
}

export interface Token {
  symbol: string
  name: string
  address: string
  decimals: number
  logoURI: string
}

interface Protocol {
  name: string
  part: number
  fromTokenAddress: string
  toTokenAddress: string
}

interface QuoteResult {
  fromToken: Token
  toToken: Token
  toTokenAmount: string
  fromTokenAmount: string
  protocols: Protocol[]
  estimatedGas: number
}

export const get1inchSupportedToken = (symbol?: string) => {
  if (symbol && BIND_XY_MAINNET[symbol]) {
    return BIND_XY_MAINNET[symbol].address
  } else {
    return 'UNKNOWN'
  }
}

interface SwapResponse {
  fromToken: string
  toToken: string
  fromTokenAmount: string
  toTokenAmount: string
  protocols: string
  from: string
  to: string
  tx: string
  value: string
  gasPrice: string
  gas: string
}

export interface _1inchSwapParams {
  fromTokenAddress?: string
  toTokenAddress?: string
  amount?: string
  fromAddress?: string
  slippage: number
  protocols?: string
  destReceiver?: string
  referrerAddress?: string
  fee?: string
  disableEstimate?: boolean
  permit?: string
  compatibilityMode?: boolean
  burnChi?: boolean
  allowPartialFill?: boolean
  parts?: number
  mainRouteParts?: number
  connectorTokens?: number
  complexityLevel?: number
  gasLimit?: string
  gasPrice?: string
}

export interface _XYFinanceSwapParams {
  srcChainId: number
  srcQuoteTokenAddress: string
  srcQuoteTokenAmount: string
  dstChainId: number
  dstQuoteTokenAddress: string
  slippage: number
  receiver: string
  affiliate?: string
  commissionRate?: number
  srcSwapProvider: string
}

//! SWAP 1INCH CALLBACK
export const useBuildSwapXYFinance = () => {
  const addTransaction = useTransactionAdder()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)
  const [swapResult, setSwapResult] = useState<SwapResponse | null>(null)
  const { provider } = useWeb3React()
  const swapXYFinance = async (
    params: _1inchSwapParams,
    trade: Trade<Currency, Currency, TradeType> | undefined,
    allowedSlippage: Percent
  ): Promise<string | undefined> => {
    setIsLoading(true)
    setError(null)
    let hash
    try {
      if (!provider || !trade) throw 'No Provider!'

      const queryParams = Object.entries(params).map(([key, value]) => {
        return [key, value] as [string, string]
      })
      const url = `https://aggregator-api.xy.finance/v1/buildTx?${new URLSearchParams(queryParams).toString()}`

      const response = await fetch(url)

      if (response.ok) {
        const result = await response.json()

        // setSwapResult(result)
        const tx = result.tx as any
        const signer = provider.getSigner()
        // gas is extracted which is invalid property for transaction to sign
        const forTransaction = await signer.sendTransaction(tx)
        addTransaction(
          forTransaction,
          trade.tradeType === TradeType.EXACT_INPUT
            ? {
                type: TransactionType.SWAP,
                tradeType: TradeType.EXACT_INPUT,
                inputCurrencyId: currencyId(trade.inputAmount.currency),
                inputCurrencyAmountRaw: trade.inputAmount.quotient.toString(),
                expectedOutputCurrencyAmountRaw: trade.outputAmount.quotient.toString(),
                outputCurrencyId: currencyId(trade.outputAmount.currency),
                minimumOutputCurrencyAmountRaw: trade.minimumAmountOut(allowedSlippage).quotient.toString(),
              }
            : {
                type: TransactionType.SWAP,
                tradeType: TradeType.EXACT_OUTPUT,
                inputCurrencyId: currencyId(trade.inputAmount.currency),
                maximumInputCurrencyAmountRaw: trade.maximumAmountIn(allowedSlippage).quotient.toString(),
                outputCurrencyId: currencyId(trade.outputAmount.currency),
                outputCurrencyAmountRaw: trade.outputAmount.quotient.toString(),
                expectedInputCurrencyAmountRaw: trade.inputAmount.quotient.toString(),
              }
        )
        setIsLoading(false)
        hash = forTransaction.hash
      } else {
        throw new Error(`Failed to perform swap: Not enough allowance or balance`)
      }
    } catch (err) {
      console.log('[Error in swapXYFinance]', err)
      setError(err)
      setIsLoading(false)
      throw err
    }
    return hash
  }

  return { isLoading, error, swapXYFinance }
}

const TRADE_INVALID = { state: TradeState.INVALID, trade: undefined } as const
const TRADE_NOT_FOUND = { state: TradeState.NO_ROUTE_FOUND, trade: undefined } as const
const TRADE_LOADING = { state: TradeState.LOADING, trade: undefined } as const

export function useXYSideTrade<TTradeType extends TradeType>(
  tradeType: TTradeType,
  amountSpecified?: CurrencyAmount<Currency>,
  otherCurrency?: Currency
): { state: TradeState; trade?: InterfaceTrade; xySwapProvider?: string } {
  const [currencyIn, currencyOut] =
    tradeType === TradeType.EXACT_INPUT
      ? [amountSpecified?.currency, otherCurrency]
      : [otherCurrency, amountSpecified?.currency]

  const queryArgs = useXYFinanceRoutingAPIArguments({
    srcQuoteToken: currencyIn,
    dstQuoteToken: currencyOut,
    srcQuoteTokenAmount: amountSpecified,
    tradeType,
  })

  const {
    isError,
    data: tradeResult,
    currentData: currentTradeResult,
  } = useGetQuoteXYFinanceQuery(queryArgs ?? skipToken)

  const isCurrent = currentTradeResult === tradeResult

  return useMemo(() => {
    if (!amountSpecified || isError || !queryArgs || tradeType === TradeType.EXACT_OUTPUT) {
      return TRADE_INVALID
    } else if (tradeResult?.state === QuoteState.NOT_FOUND && isCurrent) {
      return TRADE_NOT_FOUND
    } else if (!tradeResult?.trade) {
      // TODO(WEB-3307): use `isLoading` returned by rtk-query hook instead of checking for `trade` status
      return TRADE_LOADING
    } else {
      return {
        state: isCurrent ? TradeState.VALID : TradeState.LOADING,
        trade: tradeResult.trade,
        xySwapProvider: tradeResult.xySwapProvider,
      }
    }
  }, [amountSpecified, isCurrent, isError, queryArgs, tradeResult])
}
