import { atom, useAtom } from 'jotai'
import { useCallback } from 'react'

export enum GenesisPoolSortMethod {
  TOTAL_VALUE_LOCKED = 'TVL',
  DEPOSITS = 'Deposited',
  APR = 'APR',
  TOTAL_DEPOSIT = 'Total Deposit',
  PENDING_REWARDS = 'Pending Rewards',
}

export const sortMethodAtom = atom<GenesisPoolSortMethod>(GenesisPoolSortMethod.APR)
export const sortAscendingAtom = atom<boolean>(false)

/* keep track of sort category for token table */
export function useSetSortMethod(newSortMethod: GenesisPoolSortMethod) {
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
