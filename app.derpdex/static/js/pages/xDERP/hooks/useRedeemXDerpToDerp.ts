/* eslint-disable import/no-unused-modules */
import { useWeb3React } from '@web3-react/core'
import { Contract, ethers } from 'ethers'
import { useCurrency } from 'hooks/Tokens'
import { useMemo, useState } from 'react'

import XDERP_ABI from '../abis/xderp.abi.json'
import { EMPTY_STRING, XDERP_ADDRESSES_BY_CHAINID } from '../constants'
import { useGetAvailableForRedeems } from './useFinalizeRedeems'

enum ActionStatus {
  Redeem = 'Redeem',
  Redeeming = 'Redeeming',
}

type XDerpState = {
  isLoading: boolean
  isSuccess: boolean
  error: string | null
}

const initialRedeenXDerpState: XDerpState = {
  isLoading: false,
  isSuccess: false,
  error: null,
}

export enum RedeemOptions {
  _24DAYS = '24days',
  _96DAYS = '96days',
}

const DURATION: { [key: string]: string } = {
  [RedeemOptions._24DAYS]: process.env.REACT_APP_IS_TESTSITE === 'true' ? '30' : '2073600', // 24 days on mainnet
  [RedeemOptions._96DAYS]: process.env.REACT_APP_IS_TESTSITE === 'true' ? '120' : '8294400', // 96 days on mainnet
}

export const useRedeemXDerpToDerp = ({
  amountOfXDERP,
  balance,
  duration,
  getBalance,
}: {
  amountOfXDERP: string
  balance: number
  duration: RedeemOptions
  getBalance: () => Promise<void>
}) => {
  const { chainId, provider, account } = useWeb3React()
  const [state, setState] = useState<XDerpState>(initialRedeenXDerpState)

  const { fetchRedeems } = useGetAvailableForRedeems()

  const xDERPToken = useCurrency(chainId ? XDERP_ADDRESSES_BY_CHAINID[chainId] : undefined)

  const redeemDerp = async () => {
    try {
      setState({ ...initialRedeenXDerpState, isLoading: true })
      if (!account || !provider || !chainId) throw new Error('account or provider or chainId required')

      const signer = provider.getSigner()
      const contract = new Contract(XDERP_ADDRESSES_BY_CHAINID[chainId], XDERP_ABI, signer)
      const amount = ethers.utils.parseUnits(amountOfXDERP, 18)
      const redeemTx = await contract.redeem(amount, DURATION[duration])
      await redeemTx.wait()
      await getBalance()
      setState((p) => ({ ...p, isSuccess: true }))
    } catch (err) {
      console.log('[Err redeemDerp]', err)
      setState((p) => ({ ...p, error: err.message || 'An error occurred' }))
    } finally {
      setState((p) => ({ ...p, isLoading: false }))
    }
  }

  const actionType = useMemo(() => {
    if (state.isLoading) {
      return `${ActionStatus.Redeeming} ${xDERPToken?.symbol}`
    } else {
      return `${ActionStatus.Redeem} ${xDERPToken?.symbol}`
    }
  }, [state, xDERPToken])

  const isInsufficient = useMemo(() => {
    return parseFloat(amountOfXDERP) > balance ? `Insufficient ${xDERPToken?.symbol}` : false
  }, [xDERPToken?.symbol, amountOfXDERP, balance])

  const shouldDisableButton = useMemo(() => {
    return state.isLoading || amountOfXDERP === EMPTY_STRING || isInsufficient ? true : false
  }, [amountOfXDERP, isInsufficient, state.isLoading])

  return {
    actionType: isInsufficient ? isInsufficient : actionType,
    redeemDerpState: state,
    shouldDisableButton,
    redeemDerp,
  }
}
