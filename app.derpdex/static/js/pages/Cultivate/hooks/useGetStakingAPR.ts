/* eslint-disable import/no-unused-modules */
import { useWeb3React } from '@web3-react/core'
import { SupportedChainId } from 'constants/chains'
import { ethers } from 'ethers'
import { useCurrency, useCurrencyByChainId } from 'hooks/Tokens'
import useStablecoinPriceV2 from 'hooks/useStablecoinPriceV2'
import { useAtomValue } from 'jotai/utils'
import { DERP_ADDRESSES_BY_CHAINID } from 'pages/xDERP/constants'
import { useMemo } from 'react'
import { useState } from 'react'

import { incentiveKeysAtom } from './../../../hooks/useWhitelistedPoolAddresses'
import { stakedPools, stakedTVL } from './ComponentHooks'

const secondsInADay = 86400

export const useGetStakingFarmApr = ({
  incentiveId,
  poolTvlUSD,
  chainId,
}: {
  incentiveId: string
  poolTvlUSD: number
  chainId: number | SupportedChainId
}) => {
  const { chainId: connectedChainId, provider } = useWeb3React()
  const [isLoadingFarmApr, setIsLoadingFarmApr] = useState<boolean>(true)
  const incentiveCreateds = useAtomValue(incentiveKeysAtom)

  const stakedTVLAtom = useAtomValue(stakedTVL)
  const stakedPoolsByAddressAtom = useAtomValue(stakedPools)

  const [apr, setApr] = useState<string>('0')

  const DerpToken = useCurrencyByChainId(DERP_ADDRESSES_BY_CHAINID[chainId], chainId)
  const DerpPriceUSD = useStablecoinPriceV2(DerpToken !== null ? DerpToken : undefined)

  const totalDerpAllocatedRewards = 100000000000000000000000
  const poolMultiplier = 2

  // ! UNUSED
  // const derpsRewardsApr = useMemo(() => {
  //   const formattedAllocatedRewards = ethers.utils.parseUnits(totalDerpAllocatedRewards.toString(), DerpToken?.decimals)
  //   if (DerpPriceUSD) {
  //     return (formattedAllocatedRewards.toNumber() * parseFloat(DerpPriceUSD?.toFixed())) / poolTvlUSD
  //     // 500usd/10000derp a year distributed
  //   } else {
  //     return 0
  //   }
  // }, [DerpPriceUSD, DerpToken, poolTvlUSD])
  // * example [1] 500 derp in usd / 333 tvl in usd = 1.5 x 100 = 150%
  // * example [2] 500 derp in usd / 1,000 tvl in usd = 1.5 x 100 = 50%
  // * The lower the staking the more the rewards, since there are lesser participants

  // * Currently USED
  const daysOfYieldFarming = useMemo(() => {
    if (incentiveCreateds && incentiveCreateds[incentiveId]) {
      const daysInSeconds =
        Number(incentiveCreateds[incentiveId].endTime) - Number(incentiveCreateds[incentiveId].startTime)
      return daysInSeconds / secondsInADay
    } else {
      return null
    }
  }, [incentiveCreateds, incentiveId])

  const estimatedDerpEarningsAPR = useMemo(() => {
    setIsLoadingFarmApr(true)
    if (
      DerpPriceUSD &&
      stakedTVLAtom &&
      stakedTVLAtom.stakingTVL[incentiveId] &&
      stakedPoolsByAddressAtom[incentiveId] &&
      daysOfYieldFarming
    ) {
      const totalStakersForPoolAddress = Object.keys(stakedPoolsByAddressAtom[incentiveId]).length

      const formatRewards = ethers.utils.formatUnits(incentiveCreateds[incentiveId].reward, DerpToken?.decimals)
      const totalDerpsRewardsInUSD = parseFloat(formatRewards) * Number(DerpPriceUSD?.toFixed(DerpToken?.decimals))
      setIsLoadingFarmApr(false)
      return (
        ((totalDerpsRewardsInUSD / stakedTVLAtom.stakingTVL[incentiveId]) * (365 / daysOfYieldFarming) * 100) /
        totalStakersForPoolAddress
      )
    } else {
      return 0
    }
  }, [
    DerpPriceUSD,
    stakedTVLAtom,
    incentiveId,
    stakedPoolsByAddressAtom,
    daysOfYieldFarming,
    incentiveCreateds,
    DerpToken?.decimals,
  ])

  // console.log('estimatedDerpEarningsAPR', estimatedDerpEarningsAPR)

  return {
    estimatedDerpEarningsAPR,
    isLoadingFarmApr,
  }
}

export const useGetIndividualStakingAPR = (poolAddress: string, poolId: string, incentiveId: string) => {
  const { chainId, provider } = useWeb3React()
  const stakedTVLAtom = useAtomValue(stakedTVL)
  const stakedPoolsByAddressAtom = useAtomValue(stakedPools)
  const incentiveCreateds = useAtomValue(incentiveKeysAtom)

  const DerpToken = useCurrency(chainId ? DERP_ADDRESSES_BY_CHAINID[chainId] : undefined)
  const DerpPriceUSD = useStablecoinPriceV2(DerpToken !== null ? DerpToken : undefined)

  const daysOfYieldFarming = useMemo(() => {
    const daysInSeconds =
      Number(incentiveCreateds[incentiveId].endTime) - Number(incentiveCreateds[incentiveId].startTime)
    return daysInSeconds / secondsInADay
  }, [incentiveCreateds, incentiveId])

  const positionAPR = useMemo(() => {
    if (
      stakedTVLAtom &&
      stakedTVLAtom.stakingTVL[incentiveId] &&
      stakedPoolsByAddressAtom[incentiveId] &&
      stakedPoolsByAddressAtom[incentiveId][poolId]
    ) {
      const formatRewards = ethers.utils.formatUnits(incentiveCreateds[incentiveId].reward, DerpToken?.decimals)
      const totalDerpsRewardsInUSD = parseFloat(formatRewards) * Number(DerpPriceUSD?.toFixed(DerpToken?.decimals))

      const positionWeight = stakedPoolsByAddressAtom[incentiveId][poolId] / stakedTVLAtom.stakingTVL[incentiveId]
      const positionFarmEarning = positionWeight * totalDerpsRewardsInUSD
      const positionFarmApr = (positionFarmEarning / totalDerpsRewardsInUSD) * 100
      return positionFarmApr
    } else {
      return 0
    }
  }, [
    stakedTVLAtom,
    incentiveId,
    stakedPoolsByAddressAtom,
    poolId,
    incentiveCreateds,
    DerpToken?.decimals,
    DerpPriceUSD,
  ])
  return {
    positionApr: positionAPR,
  }
}
