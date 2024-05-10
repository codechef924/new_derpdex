/* eslint-disable import/no-unused-modules */
import { useEffect, useState } from 'react'
import { nonNegative } from 'utils/nonNegative'

import { IPool } from './useGetPools'

export const useApyCalculator = ({
  poolValuationInUSD,
  pool,
  isNonGenesis,
}: {
  poolValuationInUSD: string
  pool?: IPool
  isNonGenesis: boolean
}) => {
  const [value, setValue] = useState<number>(12)
  const [dayValue, setDayValue] = useState(69)
  const [remainingDays, setRemainingDays] = useState<number>(69)
  const [result, setResult] = useState({
    projectedDerpEarningUSD: 0,
    projectedDerpEarning: 0,
    projectedAPR: 0,
    projectedLPEarningUSD: 0,
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (pool) {
      const remainingTime = Number(pool.endTime) - new Date().getTime() / 1000
      const remainingDays = (remainingTime / (24 * 60 * 60)).toFixed(2)

      setRemainingDays(+remainingDays)
      setDayValue(+remainingDays || 0)
    }
  }, [pool])

  const update = (value: number, _remainingDays: number) => {
    if (pool) {
      if (!_remainingDays) _remainingDays = 0
      if (!value || value == 0) {
        setResult({
          projectedDerpEarningUSD: 0,
          projectedDerpEarning: 0,
          projectedAPR: 0,
          projectedLPEarningUSD: 0,
        })
        return
      }

      const rewardPerDayInUSD = (parseFloat(pool.totalRewardsPool) * parseFloat(pool.pricePerDERP)) / 69
      const remainingRewards = rewardPerDayInUSD * Number(_remainingDays)
      // console.log('pendingRewardsPerDay', remainingRewards, rewardPerDayInUSD)
      const projectedDerpEarningUSD = (value / parseFloat(pool.tvlUSD)) * remainingRewards

      const projectedDerpEarning = nonNegative(projectedDerpEarningUSD / parseFloat(pool.pricePerDERP))
      const poolAPR = (((Number(pool.feeTier) / 10000 / 100) * pool.volume) / parseFloat(pool.tvlUSD)) * 365 * 100
      // const projectedAPR = +poolAPR + (projectedDerpEarning / +pool.pendingRewards / 69) * 365 * 100
      console.log('projectedDerpEarningUSD', projectedDerpEarningUSD, poolAPR)
      const projectedAPR = nonNegative(+poolAPR + (projectedDerpEarningUSD / +value / 69) * 365 * 100)
      const projectedLPEarningUSD = nonNegative(((pool.feeUSD * value) / pool.volume) * _remainingDays || 0)

      setResult({
        projectedDerpEarningUSD,
        projectedDerpEarning,
        projectedAPR,
        projectedLPEarningUSD,
      })
    } else {
      setResult({
        projectedDerpEarningUSD: 0,
        projectedDerpEarning: 0,
        projectedAPR: 0,
        projectedLPEarningUSD: 0,
      })
    }
  }

  const updateNonGenesis = (value: number) => {
    if (pool) {
      if (!value || value === 0) {
        setResult({
          projectedDerpEarningUSD: 0,
          projectedDerpEarning: 0,
          projectedAPR: 0,
          projectedLPEarningUSD: 0,
        })
      } else {
        const newTVLAllocation = value + parseFloat(pool.tvlUSD)
        const feePercent = parseFloat(pool.feeTier) / 10000 / 100
        const volumeUSD = pool.volume

        // Factor influenced by volume or tvl allocation
        const projectedAPRInPercent = ((feePercent * volumeUSD) / newTVLAllocation) * 365 * 100
        // Factor influenced by new apr after vested
        const projectedAnnualRewards = (projectedAPRInPercent / 100) * value
        setResult({
          projectedDerpEarningUSD: 0,
          projectedDerpEarning: 0,
          projectedAPR: projectedAPRInPercent,
          projectedLPEarningUSD: projectedAnnualRewards,
        })
      }
    } else {
      setResult({
        projectedDerpEarningUSD: 0,
        projectedDerpEarning: 0,
        projectedAPR: 0,
        projectedLPEarningUSD: 0,
      })
    }
  }

  useEffect(() => {
    if (!isNonGenesis) {
      update(parseFloat(poolValuationInUSD), remainingDays)
    } else {
      updateNonGenesis(parseFloat(poolValuationInUSD))
    }
  }, [poolValuationInUSD, isNonGenesis])
  const onUserInput = (val: string) => {
    update(+val, remainingDays)
    setValue(+val)
    // update()
    // console.log(pool)
  }

  const onUserDayInput = (val: string) => {
    update(+value, +val)
    setDayValue(+val)
    // update()
  }

  return {
    onUserInput,
    result,
  }
}
