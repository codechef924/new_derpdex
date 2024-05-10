import { TimePeriod } from 'graphql/data/util'
import { atom, useAtom } from 'jotai'
import { atomWithReset } from 'jotai/utils'
import { useCallback } from 'react'

export enum PoolSortMethod {
  TVL = 'TVL',
  VOL24H = 'Volume 24H',
  VOL7D = 'Volume 7D',
  FEES24H = 'Fees 24H',
  APR = 'APR',
}

export const filterStringAtom = atomWithReset<string>('')
export const filterTimeAtom = atom<TimePeriod>(TimePeriod.DAY)
export const sortMethodAtom = atom<PoolSortMethod>(PoolSortMethod.APR)
export const sortAscendingAtom = atom<boolean>(false)

/* keep track of sort category for token table */
export function useSetSortMethod(newSortMethod: PoolSortMethod) {
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
