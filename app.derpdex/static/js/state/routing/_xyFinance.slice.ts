/* eslint-disable import/no-unused-modules */
import { createApi, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import { transformXYFinanceRoutesToTrade } from 'pages/Swap/hooks/utils'
import qs from 'qs'
import { XYFinanceResponse, XYFinanceTradeResult } from 'state/routing/types'
import { trace } from 'tracing/trace'

export interface GetQuoteArgsOnXYFinance {
  srcQuoteTokenAddress: string
  dstQuoteTokenAddress: string
  srcQuoteTokenAmount: number | string
  srcChainId: number
  dstChainId: number
  slippage: number

  fee?: string
  protocols?: string
  gasLimit?: string
  connectorTokens?: string
  complexityLevel?: string
  mainRouteParts?: string
  parts?: string
  gasPrice?: string
}

enum QuoteState {
  SUCCESS = 'Success',
  NOT_FOUND = 'Not found',
}

export const routingApiXYFinance = createApi({
  reducerPath: 'routingApiXYFinance',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://aggregator-api.xy.finance/v1/',
  }),
  endpoints: (build) => ({
    getQuoteXYFinance: build.query<XYFinanceTradeResult, GetQuoteArgsOnXYFinance>({
      async onQueryStarted(args: GetQuoteArgsOnXYFinance, { queryFulfilled }) {
        trace(
          'quote',
          async ({ setTraceError, setTraceStatus }) => {
            try {
              await queryFulfilled
            } catch (error: unknown) {
              if (error && typeof error === 'object' && 'error' in error) {
                const queryError = (error as Record<'error', FetchBaseQueryError>).error
                if (typeof queryError.status === 'number') {
                  setTraceStatus(queryError.status)
                }
                setTraceError(queryError)
              } else {
                // console.log('[Error quote 1inch]', error)
                throw error
              }
            }
          },
          {
            data: {
              ...args,
            },
          }
        )
      },
      async queryFn(args, _api, _extraOptions, fetch) {
        try {
          const {
            srcQuoteTokenAddress,
            dstQuoteTokenAddress,
            srcQuoteTokenAmount,
            srcChainId,
            dstChainId,
            slippage,
            protocols,
          } = args
          // const type = isExactInput(tradeType) ? 'exactIn' : 'exactOut'
          const query = qs.stringify({
            srcQuoteTokenAddress,
            dstQuoteTokenAddress,
            srcQuoteTokenAmount,
            srcChainId,
            dstChainId,
            slippage,
          })
          const response = await fetch(`quote?${query}`)
          if (response.error) {
            try {
              // cast as any here because we do a runtime check on it being an object before indexing into .errorCode
              const errorData = response.error.data as any
              // NO_ROUTE should be treated as a valid response to prevent retries.
              if (typeof errorData === 'object' && errorData?.errorCode === 'NO_ROUTE') {
                return { data: { state: QuoteState.NOT_FOUND } }
              }
            } catch {
              // console.log('[Error in queryFn]', response.error)
              throw response.error
            }
          }

          const quoteData = response.data as XYFinanceResponse
          // 1inch should return same types of TradeResult
          const tradeResult = await transformXYFinanceRoutesToTrade(args, quoteData.routes)
          return { data: tradeResult }
        } catch (error: any) {
          console.warn(
            `GetQuote failed on 1INCH routing API, falling back to client: ${error?.message ?? error?.detail ?? error}`
          )
          return { error: { status: 'CUSTOM_ERROR', error: error?.detail ?? error?.message ?? error } }
        }
      },
      extraOptions: {
        maxRetries: 0,
      },
    }),
  }),
})

export const { useGetQuoteXYFinanceQuery } = routingApiXYFinance
