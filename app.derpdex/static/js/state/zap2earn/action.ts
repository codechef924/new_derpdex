/* eslint-disable import/no-unused-modules */
import { AnyAction, createAction } from '@reduxjs/toolkit'
import { Currency } from '@uniswap/sdk-core'
import { useCallback } from 'react'

export enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
}
export const selectCurrency = createAction<{ field: Field; currencyId: string }>('zaptoearn/selectCurrency')
export const switchCurrencies = createAction<void>('zaptoearn/switchCurrencies')
export const typeInput = createAction<{ field: Field; typedValue: string }>('zaptoearn/typeInput')

export const replaceZapToEarnState = createAction<{
  field: Field
  typedValue: string
  inputCurrencyId?: string
  outputCurrencyId?: string
  recipient: string | null
}>('zaptoearn/replaceZapToEarnState')

export const setRecipient = createAction<{ recipient: string | null }>('zaptoearn/setRecipient')

export function useZapToEarnActionHandlers(dispatch: React.Dispatch<AnyAction>): {
  onCurrencySelection: (field: Field, currency: Currency) => void
  onSwitchTokens: () => void
  onUserInput: (field: Field, typedValue: string) => void
  onChangeRecipient: (recipient: string | null) => void
} {
  const onCurrencySelection = useCallback(
    (field: Field, currency: Currency) => {
      dispatch(
        selectCurrency({
          field,
          currencyId: currency.isToken ? currency.address : currency.isNative ? 'ETH' : '',
        })
      )
    },
    [dispatch]
  )

  const onSwitchTokens = useCallback(() => {
    dispatch(switchCurrencies())
  }, [dispatch])

  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      dispatch(typeInput({ field, typedValue }))
    },
    [dispatch]
  )

  const onChangeRecipient = useCallback(
    (recipient: string | null) => {
      dispatch(setRecipient({ recipient }))
    },
    [dispatch]
  )

  return {
    onSwitchTokens,
    onCurrencySelection,
    onUserInput,
    onChangeRecipient,
  }
}
