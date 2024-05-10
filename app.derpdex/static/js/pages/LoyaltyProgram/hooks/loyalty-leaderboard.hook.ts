/* eslint-disable import/no-unused-modules */
import { GENESIS_API_URL } from 'constants/chains'
import { useState } from 'react'

export const useTradingVolumeListForLoyalty = () => {
  const [isLoadingFetch, setIsLoadingFetch] = useState(false)
  const [loadedTradingVolumeList, setLoadedTradingVolumeList] = useState<any[]>([])

  const getURL = (query?: any) => {
    return GENESIS_API_URL + '/top-trading-volume-for-loyalty' + query
  }

  const onLoadTradingVolumeList = async (weekNumber?: number) => {
    setIsLoadingFetch(true)
    try {
      const query = weekNumber ? `?weekNumber=${weekNumber}` : ''
      const result = await fetch(getURL(query), {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      })

      const data = await result.json()

      const list = data.result.map((item: any, index: number) => {
        return {
          ...item,
          index: index + 1,
          rewards: 3.59 * (101 - (index + 1)),
        }
      })

      setIsLoadingFetch(false)
      setLoadedTradingVolumeList(list)
    } catch (error) {
      console.error(error)
      setIsLoadingFetch(false)
    }
  }

  return {
    onLoadTradingVolumeList,
    isLoadingFetch,
    loadedTradingVolumeList,
  }
}

export const useTopLoserListForLoyalty = () => {
  const [isLoadingFetch, setIsLoadingFetch] = useState(false)
  const [loadedLoserList, setLoadedLoserList] = useState<any[]>([])

  const getURL = (query?: any) => {
    return GENESIS_API_URL + '/top-loser-for-loyalty' + query
  }

  const onLoadLoserList = async (weekNumber?: number) => {
    setIsLoadingFetch(true)
    try {
      const query = weekNumber ? `?weekNumber=${weekNumber}` : ''
      const result = await fetch(getURL(query), {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      })

      const data = await result.json()

      const list = data.result.map((item: any, index: number) => {
        return {
          ...item,
          index: index + 1,
          rewards: 4.86 * (31 - (index + 1)),
        }
      })

      setIsLoadingFetch(false)
      setLoadedLoserList(list)
    } catch (error) {
      console.error(error)
      setIsLoadingFetch(false)
    }
  }

  return {
    onLoadLoserList,
    isLoadingFetch,
    loadedLoserList,
  }
}

export const useTopWinnerListForLoyalty = () => {
  const [isLoadingFetch, setIsLoadingFetch] = useState(false)
  const [loadedWinnerList, setLoadedWinnerList] = useState<any[]>([])

  const getURL = (query?: any) => {
    return GENESIS_API_URL + '/top-winner-for-loyalty' + query
  }

  const onLoadWinnerList = async (weekNumber?: number) => {
    setIsLoadingFetch(true)
    try {
      const query = weekNumber ? `?weekNumber=${weekNumber}` : ''
      const result = await fetch(getURL(query), {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      })

      const data = await result.json()

      const list = data.result.map((item: any, index: number) => {
        return {
          ...item,
          index: index + 1,
          rewards: 4.86 * (31 - (index + 1)),
        }
      })

      setIsLoadingFetch(false)
      setLoadedWinnerList(list)
    } catch (error) {
      console.error(error)
      setIsLoadingFetch(false)
    }
  }

  return {
    onLoadWinnerList,
    isLoadingFetch,
    loadedWinnerList,
  }
}
