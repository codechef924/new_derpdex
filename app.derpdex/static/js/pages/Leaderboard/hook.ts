import { GENESIS_API_URL } from 'constants/chains'
import { useState } from 'react'

export const useTradingVolumeList = () => {
  const [isLoadingFetch, setIsLoadingFetch] = useState(false)
  const [loadedTradingVolumeList, setLoadedTradingVolumeList] = useState<any[]>([])

  const getURL = (query?: any) => {
    return GENESIS_API_URL + '/top-trading-volume' + query
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
          rewards: 64.5 * (31 - (index + 1)),
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

// eslint-disable-next-line import/no-unused-modules
export const useTopLoserList = () => {
  const [isLoadingFetch, setIsLoadingFetch] = useState(false)
  const [loadedLoserList, setLoadedLoserList] = useState<any[]>([])

  const getURL = (query?: any) => {
    return GENESIS_API_URL + '/top-loser' + query
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
          rewards: 90.91 * (11 - (index + 1)),
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