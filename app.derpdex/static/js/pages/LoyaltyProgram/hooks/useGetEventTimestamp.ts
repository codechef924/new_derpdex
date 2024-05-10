/* eslint-disable import/no-unused-modules */
import * as d3 from 'd3'
import { useEffect, useMemo, useState } from 'react'

import { weeks } from '../constant'

type LOYALTY_EVENT = {
  startTimestamp: number
  endTimestamp: number
}

export type DERIVED_LOYALTY_EVENT = {
  startDate: string
  endDate: string
}

const MockEvents: LOYALTY_EVENT = {
  startTimestamp: 1696118400,
  endTimestamp: 1725148800,
}
export const useGetEventTimestamp = () => {
  const [rawEventTimestamp, setRawEventTimestamp] = useState<LOYALTY_EVENT>({
    startTimestamp: 0,
    endTimestamp: 0,
  })
  const [derivedEventTimestamp, setDerivedEventTimestamp] = useState<DERIVED_LOYALTY_EVENT>()

  const findWeekInterval = useMemo(() => {
    const currentTimestamp = Date.now() / 1000
    const t = weeks.find((w) => currentTimestamp >= w.startTimestamp && currentTimestamp <= w.endTimestamp)
    if (t) return t
    else return null
  }, [])

  const weekNumber = useMemo(() => {
    const currentTimestamp = Date.now() / 1000
    const index = weeks.findIndex((w) => currentTimestamp >= w.startTimestamp && currentTimestamp <= w.endTimestamp)

    return index !== -1 ? index + 1 : weeks.length
  }, [])

  const getVestingEvents = async () => {
    try {
      if (findWeekInterval) {
        const formattedStartDate = d3.timeFormat('%d %b %Y')(new Date(findWeekInterval.startTimestamp * 1000))
        const formattedEndDate = d3.timeFormat('%d %b %Y')(new Date(findWeekInterval.endTimestamp * 1000))

        const setter: DERIVED_LOYALTY_EVENT = {
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        }
        setDerivedEventTimestamp(setter)
        setRawEventTimestamp(findWeekInterval)
      }
    } catch (err) {
      console.error('[Err getVestingEvents]', err)
    }
  }

  useEffect(() => {
    getVestingEvents()
  }, [])

  return {
    weekNumber,
    rawEventTimestamp,
    derivedEventTimestamp,
  }
}
