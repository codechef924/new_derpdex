import { atom } from 'jotai'

export interface CGDATA_ATOM {
  symbolIn: string
  symbolOut: string
  currentPrice: number
  timestamp: number
}

export const coingackoAtom = atom<CGDATA_ATOM[]>([])
