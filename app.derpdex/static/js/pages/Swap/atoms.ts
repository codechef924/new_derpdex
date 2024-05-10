// atoms.js

import { atom } from 'jotai'

// Create atoms for the input and output currencies
interface CurrencyAtom {
  address?: string
  symbol?: string
}
export const inputCurrencyAtom = atom<CurrencyAtom | undefined>(undefined) // You can set an initial value here if needed
export const outputCurrencyAtom = atom<CurrencyAtom | undefined>(undefined) // You can set an initial value here if needed
