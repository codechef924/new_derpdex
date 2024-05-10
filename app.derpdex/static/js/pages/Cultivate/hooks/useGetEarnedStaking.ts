/* eslint-disable import/no-unused-modules */
import { useWeb3React } from '@web3-react/core'
import { ZERO_ADDRESS } from 'constants/misc'
import { ethers } from 'ethers'
import { Contract } from 'ethers'
import { useCurrency } from 'hooks/Tokens'
import { useAtom } from 'jotai'
import { atom } from 'jotai'
import { useAtomValue } from 'jotai/utils'
import { useCallback, useMemo } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'

import DerpDEXStakingABI from '../abis/derpdexstaking.abi.json'
import { derivedPositionsAtom } from '../state/search.state'
import { incentiveKeysAtom } from './../../../hooks/useWhitelistedPoolAddresses'
import { DERP_ADDRESSES_BY_CHAINID } from './../../xDERP/constants'
import { DERPDEX_STAKING_ADDRESSES_BY_CHAINID } from './../constants'
import { Position } from './useDerivedStakedPositions'

interface DerivedEarnings {
  [key: string]: string
}
interface PoolIDs {
  [key: string]: string[]
}

interface POOLADDRESS_IDS_Earnings {
  [key: string]: {
    [subKey: string]: string
  }
}

export const earnedAtom = atom<POOLADDRESS_IDS_Earnings | null>(null)
export const earnedAdditionalAtom = atom<POOLADDRESS_IDS_Earnings | null>(null)

export const useGetCombinedEarnedStakings = ({
  poolAddress,
  incentiveId,
}: {
  poolAddress: string
  incentiveId: string
}) => {
  const { chainId, provider, account } = useWeb3React()
  const [earned, setEarned] = useState<DerivedEarnings | null>(null)
  const [earnedAdditional, setEarnedAdditional] = useState<DerivedEarnings | null>(null)
  const incentiveKeys = useAtomValue(incentiveKeysAtom)
  const [derivedEarnings, setDerivedEarnings] = useAtom(earnedAtom)
  const [derivedEarningsAdditional, setDerivedEarningsAdditional] = useAtom(earnedAdditionalAtom)

  const derivedPositionsState = useAtomValue(derivedPositionsAtom)

  // Token Ids of Staked Positions
  const poolIds = useMemo(() => {
    let accum: PoolIDs = {}
    if (
      derivedPositionsState &&
      derivedPositionsState[incentiveId] &&
      derivedPositionsState[incentiveId][Position.STAKED].length > 0
    ) {
      derivedPositionsState[incentiveId][Position.STAKED].forEach((item) => {
        accum = {
          ...accum,
          [incentiveId]: [...(accum[incentiveId] || []), item.id],
        }
      })
    } else if (
      derivedPositionsState &&
      derivedPositionsState[incentiveId] &&
      derivedPositionsState[incentiveId][Position.STAKED].length === 0
    ) {
      accum = {
        ...accum,
        [incentiveId]: [],
      }
    } else {
      accum = {
        ...accum,
        [incentiveId]: [],
      }
    }
    return accum
  }, [derivedPositionsState, incentiveId])

  const DERPTOKEN = useCurrency(chainId ? DERP_ADDRESSES_BY_CHAINID[chainId] : ZERO_ADDRESS)

  const ADDITIONAL_TOKEN = useCurrency(
    incentiveKeys[incentiveId] && incentiveKeys[incentiveId].addtionalIncentives.length > 0
      ? incentiveKeys[incentiveId].addtionalIncentives[0].rewardToken
      : ZERO_ADDRESS
  )

  const getEarned = useCallback(async () => {
    try {
      if (!chainId || !provider || !account) throw 'chainId/provider/account is required'

      if (!DERPDEX_STAKING_ADDRESSES_BY_CHAINID[chainId]) throw 'contract now found for ' + chainId

      if (derivedPositionsState && poolIds[incentiveId].length > 0) {
        const incentiveKey = incentiveKeys[incentiveId]

        let earnings = 0

        for await (const id of poolIds[incentiveId]) {
          const contract = new Contract(DERPDEX_STAKING_ADDRESSES_BY_CHAINID[chainId], DerpDEXStakingABI, provider)
          const earnedResult = await contract.getReward(id, {
            rewardToken: incentiveKey.rewardToken,
            pool: incentiveKey.pool,
            startTime: incentiveKey.startTime,
            endTime: incentiveKey.endTime,
            refundee: incentiveKey.refundee,
          })

          const parsedAmount = ethers.utils.formatUnits(earnedResult[0], DERPTOKEN?.decimals)

          // ! Fixed where additional token rewards is being added when there is none
          if (earnedResult[1] && earnedResult[1].length > 0) {
            const parsedAmountAdditional = ethers.utils.formatUnits(earnedResult[1][0], ADDITIONAL_TOKEN?.decimals)

            setDerivedEarningsAdditional((prev) => {
              if (prev) {
                return {
                  ...prev,
                  [incentiveId]: {
                    ...prev[incentiveId],
                    [id]: parseFloat(parsedAmountAdditional).toFixed(6),
                  },
                }
              } else return {}
            })
          }

          setDerivedEarnings((prev) => {
            if (prev) {
              return {
                ...prev,
                [incentiveId]: {
                  ...prev[incentiveId],
                  [id]: parseFloat(parsedAmount).toFixed(6),
                },
              }
            } else return {}
          })

          earnings += parseFloat(parsedAmount)
        }

        setEarned({
          [incentiveId]: earnings.toFixed(6),
        })
      } else {
        // setDerivedEarnings({})
        // setEarned({
        //   [poolAddress]: '0',
        // })
      }
    } catch (error) {
      console.log('[Err getEarned]', error)
      // setDerivedEarnings({})
      // setEarned({
      //   [poolAddress]: '0',
      // })
    }
  }, [
    chainId,
    provider,
    account,
    derivedPositionsState,
    poolIds,
    incentiveId,
    incentiveKeys,
    DERPTOKEN?.decimals,
    ADDITIONAL_TOKEN?.decimals,
  ])

  useEffect(() => {
    if (derivedPositionsState && poolIds[incentiveId] && poolIds[incentiveId].length > 0) {
      getEarned()
    } else {
      // setDerivedEarnings({})
    }
  }, [account, derivedPositionsState, incentiveId, poolIds, chainId, getEarned])

  return {
    earned,
  }
}
