/* eslint-disable import/no-unused-modules */
import { TimePeriod } from 'graphql/data/util'
import { atom, useAtom } from 'jotai'
import { atomWithReset } from 'jotai/utils'
import { useCallback } from 'react'

import { Pool_DerivedPositions } from '../hooks/useDerivedStakedPositions'

export enum CultivatePoolSortMethod {
  TVL = 'TVL',
  VOL24H = 'Volume 24H',
  VOL7D = 'Volume 7D',
  FEES24H = 'Fees 24H',
  APR = 'APR',
  EARNED = 'Earned',
  MULTIPLIER = 'Multiplier',
  AVAILABLE_POSITIONS = 'Available LP',
  STAKED_POSITIONS = 'Staked LP',
}

export const FarmingfilterStringAtom = atomWithReset<string>('')
export const filterTimeAtom = atom<TimePeriod>(TimePeriod.DAY)
export const sortMethodAtom = atom<CultivatePoolSortMethod>(CultivatePoolSortMethod.APR)
export const sortAscendingAtom = atom<boolean>(false)

/* keep track of sort category for token table */
export function useCultivateSetSortMethod(newSortMethod: CultivatePoolSortMethod) {
  const [sortMethod, setSortMethod] = useAtom(sortMethodAtom)
  const [sortAscending, setSortAscending] = useAtom(sortAscendingAtom)

  return useCallback(() => {
    if (sortMethod === newSortMethod) {
      setSortAscending(!sortAscending)
    } else {
      setSortMethod(newSortMethod)
      setSortAscending(false)
    }
  }, [sortMethod, setSortMethod, setSortAscending, sortAscending, newSortMethod])
}

export const derivedPositionsAtom = atom<Pool_DerivedPositions | null>(null)
