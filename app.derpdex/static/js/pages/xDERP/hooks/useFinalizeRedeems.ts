/* eslint-disable no-async-promise-executor */
/* eslint-disable no-constant-condition */
/* eslint-disable import/no-unused-modules */
import { gql, useLazyQuery } from '@apollo/client'
import { BigNumber } from '@ethersproject/bignumber'
import { useWeb3React } from '@web3-react/core'
import { Contract, ethers } from 'ethers'
import { useGetYieldBoostergApolloClient } from 'graphql/thegraph/apollo'
import { useCurrency } from 'hooks/Tokens'
import { atom, useAtom } from 'jotai'
import { useEffect, useMemo, useState } from 'react'

import XDERP_ABI from '../abis/xderp.abi.json'
import { XDERP_ADDRESSES_BY_CHAINID } from './../constants'
import { useAvailableDerpBalance } from './useAvailableDerpBalance'

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const REDEEMS = gql`
  query allRedeems($walletAddress: String!) {
    redeems(where: { user: $walletAddress }, orderBy: redeemIndex) {
      id
      amount
      redeemIndex
      duration
      user
      blockTimestamp
    }
    finalizeRedeems(where: { user: $walletAddress }, orderBy: redeemIndex) {
      id
      redeemIndex
    }
  }
`

export type TRedeem = {
  id: string | undefined
  amount: string | undefined
  redeemIndex: string
  duration: string
  user: string | undefined
  blockTimestamp: string
}

export interface ExtendedRedeem extends TRedeem {
  disableFinalize: boolean
}

type TFinalizeRedeem = {
  id: string | undefined
  redeemIndex: string | undefined
}

type RedeemsQuery = {
  redeems: TRedeem[]
  finalizeRedeems: TFinalizeRedeem[]
}

type RedeemsQueryVariable = {
  walletAddress: string | undefined
}
const mapped = new Map<string, RedeemsQuery>()

export const redeemingXDerpAtom = atom(0)

export const useGetAvailableForRedeems = () => {
  const { account, chainId } = useWeb3React()
  const [availableForRedeems, setAvailableForRedeems] = useState<ExtendedRedeem[]>([])
  const [redeemingState, setRedeemingState] = useAtom(redeemingXDerpAtom)
  const [queryResult, setQueryResult] = useState<RedeemsQuery | undefined>(undefined)
  const apolloYieldBoosterClientHook = useGetYieldBoostergApolloClient()

  const [fetchRedeems, { loading, error, data, client }] = useLazyQuery<RedeemsQuery, RedeemsQueryVariable>(REDEEMS, {
    variables: {
      walletAddress: account ? account.toLowerCase() : undefined,
    },
    client: apolloYieldBoosterClientHook ? apolloYieldBoosterClientHook : undefined,
    fetchPolicy: 'cache-first',
  })

  const RedeemToken = useCurrency(chainId ? XDERP_ADDRESSES_BY_CHAINID[chainId] : undefined)

  const resolveTillIndexed = async ({ redeemIndex, retries = 3 }: { redeemIndex: string; retries: number }) => {
    try {
      const t = await client.resetStore()
      let found = false
      let newData: RedeemsQuery
      const promises: RedeemsQuery = await new Promise(async (resolve, reject) => {
        while (!found) {
          await fetchRedeems({
            fetchPolicy: 'cache-first',
          })

          const res = mapped.get('allData')

          const foundRedeem = res ? res.finalizeRedeems.find((r) => r.redeemIndex === redeemIndex) : undefined

          if (foundRedeem && res) {
            console.log('found!')
            found = true
            newData = res
            resolve(newData)
            break
          }
          await wait(10000)
        }
      })

      setQueryResult(promises)
    } catch (error) {
      console.log('[Unable to resolve]', error)
    }
  }

  const rawAvailableForRedeems: TRedeem[] | undefined = useMemo(() => {
    if (!data) return []

    mapped.set('allData', data)
    setQueryResult((p) => ({ ...p, ...data }))

    const filteredData = data.redeems.filter((item) => {
      // Check if redeemIndex exists in data.finalizeRedeems
      return !data.finalizeRedeems.some((f) => f.redeemIndex === item.redeemIndex)
    })

    return filteredData
  }, [data])

  const derivedRedeems = useMemo(() => {
    if (!rawAvailableForRedeems || !(rawAvailableForRedeems.length > 0) || !RedeemToken) {
      setRedeemingState(0)
      return undefined
    }

    const mappedRedeems: ExtendedRedeem[] = []
    const currentTimestamp = Date.now() / 1000
    let totalPendingRedeems = BigNumber.from(0)
    for (const redeem of rawAvailableForRedeems) {
      const finalizeAfterTimestamp = parseInt(redeem.blockTimestamp) + parseInt(redeem.duration)

      // * Allow finalize after duration
      const disableFinalize = currentTimestamp < finalizeAfterTimestamp ? true : false
      const parsedAmount = ethers.utils.formatUnits(redeem.amount || '0', RedeemToken.decimals)
      mappedRedeems.push({
        ...redeem,
        amount: parsedAmount,
        disableFinalize,
      })

      totalPendingRedeems = totalPendingRedeems.add(redeem.amount || '0')
    }

    setRedeemingState(
      Math.floor(Number(ethers.utils.formatUnits(totalPendingRedeems.toString(), RedeemToken.decimals)) * 10000) / 10000
    )

    return mappedRedeems
  }, [RedeemToken, rawAvailableForRedeems, data])

  useEffect(() => {
    fetchRedeems({
      fetchPolicy: 'cache-first',
    })
  }, [account, chainId])

  return {
    resolveTillIndexed,
    fetchRedeems,
    derivedRedeems,
    availableForRedeems,
    error,
    loading,
  }
}

enum ActionStatus {
  Finalize = 'Finalize',
  Finalizing = 'Finalizing',
}

type FinalizeState = {
  isLoading: boolean
  isSuccess: boolean
  error: string | null
}

const initialFinalizeState: FinalizeState = {
  isLoading: false,
  isSuccess: false,
  error: null,
}

enum UNLOCKED_FINALIZE {
  ALLOWED = 'ALLOWED',
}
const determineDurationLeft = (timestamp: number) => {
  const currentTimestamp = Math.floor(Date.now() / 1000)

  const difference = timestamp - currentTimestamp

  if (difference >= 86400) {
    const daysLeft = Math.floor(difference / 86400)
    return `${daysLeft} days left`
  } else if (difference >= 3600) {
    const hoursLeft = Math.floor(difference / 3600)
    return `${hoursLeft} hours left`
  } else if (difference >= 60) {
    const minutesLeft = Math.floor(difference / 60)
    return `${minutesLeft} minutes left`
  } else {
    return UNLOCKED_FINALIZE.ALLOWED
  }
}

export const useFinalizeRedeems = ({
  redeemIndex,
  blockTimestamp,
}: {
  redeemIndex: string
  blockTimestamp: string
}) => {
  const { chainId, provider, account } = useWeb3React()
  const [state, setState] = useState<FinalizeState>(initialFinalizeState)
  const { resolveTillIndexed } = useGetAvailableForRedeems()
  const { getBalance } = useAvailableDerpBalance()

  const durationLeftTillFinalize = useMemo(() => {
    const status = determineDurationLeft(parseInt(blockTimestamp))
    return status
  }, [blockTimestamp])
  const actionType = useMemo(() => {
    if (durationLeftTillFinalize !== UNLOCKED_FINALIZE.ALLOWED) {
      return durationLeftTillFinalize
    } else {
      if (state.isLoading) {
        return `${ActionStatus.Finalizing}`
      } else {
        return `${ActionStatus.Finalize}`
      }
    }
  }, [durationLeftTillFinalize, state.isLoading])

  const finalizeRedeem = async () => {
    try {
      setState({ ...initialFinalizeState, isLoading: true })
      if (!account || !provider || !chainId) throw new Error('account or provider or chainId required')

      console.log('redeemIndex', redeemIndex)
      const signer = provider.getSigner()
      const contract = new Contract(XDERP_ADDRESSES_BY_CHAINID[chainId], XDERP_ABI, signer)
      const finalizeTx = await contract.finalizeRedeem(redeemIndex)
      await finalizeTx.wait()

      await getBalance()
      await resolveTillIndexed({
        redeemIndex,
        retries: 10,
      })

      setState((p) => ({ ...p, isSuccess: true }))
    } catch (err) {
      console.log('[Err finalizeRedeem]', err)
      setState((p) => ({ ...p, error: err.message || 'An error occurred' }))
    } finally {
      setState((p) => ({ ...p, isLoading: false }))
    }
  }
  return {
    actionType,
    finalizeRedeem,
  }
}
