import { atom, useAtom } from 'jotai'
import { useCallback } from 'react'

export enum TopWinnerSortMethod {
  PNL = 'P&L ($)',
  REWARDS = 'Rewards',
}

export const sortMethodAtom = atom<TopWinnerSortMethod>(TopWinnerSortMethod.REWARDS)
export const sortAscendingAtom = atom<boolean>(false)

/* keep track of sort category for token table */
export function useSetSortMethod(newSortMethod: TopWinnerSortMethod) {
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
