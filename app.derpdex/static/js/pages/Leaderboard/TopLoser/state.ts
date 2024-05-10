import { atom, useAtom } from 'jotai'
import { useCallback } from 'react'

export enum TopLoserSortMethod {
  PNL = 'P&L ($)',
  REWARDS = 'Rewards',
}

export const sortMethodAtom = atom<TopLoserSortMethod>(TopLoserSortMethod.REWARDS)
export const sortAscendingAtom = atom<boolean>(false)

/* keep track of sort category for token table */
export function useSetSortMethod(newSortMethod: TopLoserSortMethod) {
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
