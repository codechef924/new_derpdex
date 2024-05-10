import { createReducer } from '@reduxjs/toolkit'
import { parsedQueryString } from 'hooks/useParsedQueryString'

import { Field, replaceZapToEarnState, selectCurrency, setRecipient, typeInput } from './action'
import { queryParametersToZapToEarnState } from './hooks'

export interface ZapToEarnState {
  readonly independentField: Field
  readonly typedValue: string
  readonly [Field.INPUT]: {
    readonly currencyId: string | undefined | null
  }
  readonly [Field.OUTPUT]: {
    readonly currencyId: string | undefined | null
  }
  // the typed recipient address or ENS name, or null if swap should go to sender
  readonly recipient: string | null
}

export const initialZapToEarnState: ZapToEarnState = queryParametersToZapToEarnState(parsedQueryString())

// eslint-disable-next-line import/no-unused-modules
export const zapToEarnReducer = createReducer<ZapToEarnState>(initialZapToEarnState, (builder) =>
  builder
    .addCase(
      replaceZapToEarnState,
      (state, { payload: { typedValue, recipient, field, inputCurrencyId, outputCurrencyId } }) => {
        return {
          [Field.INPUT]: {
            currencyId: inputCurrencyId ?? null,
          },
          [Field.OUTPUT]: {
            currencyId: outputCurrencyId ?? null,
          },
          independentField: field,
          typedValue,
          recipient,
        }
      }
    )
    .addCase(selectCurrency, (state, { payload: { currencyId, field } }) => {
      // const otherField = field === Field.INPUT ? Field.OUTPUT : Field.INPUT
      if (currencyId === state[Field.INPUT].currencyId) {
        // the case where we have to swap the order
        return {
          ...state,
          independentField: state.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
          [field]: { currencyId },
          [Field.INPUT]: { currencyId: state[field].currencyId },
        }
      } else {
        // the normal case
        return {
          ...state,
          [field]: { currencyId },
        }
      }
    })
    // .addCase(switchCurrencies, (state) => {
    //   return {
    //     ...state,
    //     independentField: state.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
    //     [Field.INPUT]: { currencyId: state[Field.OUTPUT].currencyId },
    //     [Field.OUTPUT]: { currencyId: state[Field.INPUT].currencyId },
    //   }
    // })
    .addCase(typeInput, (state, { payload: { field, typedValue } }) => {
      return {
        ...state,
        independentField: field,
        typedValue,
      }
    })
    .addCase(setRecipient, (state, { payload: { recipient } }) => {
      state.recipient = recipient
    })
)
