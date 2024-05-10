/* eslint-disable import/no-unused-modules */
import { QUOTER_V2_ADDRESSES } from '@derpdex/smart-order-router'
import { TransactionReceipt } from '@ethersproject/abstract-provider'
import { Currency } from '@uniswap/sdk-core'
import UniswapV3FactoryJson from '@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json'
import UniswapV3PoolJson from '@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json'
import QuoterV2Json from '@uniswap/v3-periphery/artifacts/contracts/lens/QuoterV2.sol/QuoterV2.json'
import { useWeb3React } from '@web3-react/core'
import bn from 'bignumber.js'
import { V3_CORE_FACTORY_ADDRESSES, ZAP_TO_EARN_ADDRESSES } from 'constants/addresses'
import { SupportedChainId } from 'constants/chains'
import { BigNumber } from 'ethers'
import { parseUnits } from 'ethers/lib/utils'
import { useState } from 'react'
import { useMemo } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { TransactionType } from 'state/transactions/types'
import { didUserReject } from 'utils/swapErrorToUserReadableMessage'
import * as zksync from 'zksync-web3'

import ZAP_TO_EARN_ABI from './zap.abi.json'
import { RawPoolInfoState } from './ZapToEarnPools.jotai'

bn.config({ EXPONENTIAL_AT: 999999, DECIMAL_PLACES: 40 })
// const { abi: NFTPositionManagerABI } = NonfungiblePositionManagerJson
const { abi: FactoryABI } = UniswapV3FactoryJson
const { abi: PoolABI } = UniswapV3PoolJson
const { abi: QuoterV2ABI } = QuoterV2Json
export interface ISwapParams {
  target?: string
  fee: string
  amountOutMinimum: string
}
interface ILiqidityParams {
  token0: string
  token1: string
  fee: string
  tickLower: string
  tickUpper: string
}
export interface IZapState {
  swapParams: Array<ISwapParams>
  liquidityParams: ILiqidityParams
  source: string
  amount0: string
}

export enum ZapToEarnStateTransition {
  UNATTEMPTED = 'Unattempted',
  LOADING = 'Loading',
  FAILED = 'Failed',
  SUCCESS = 'Success',
}

const useZapToEarnCallback = (
  zapState: IZapState | null,
  currentPool: RawPoolInfoState,
  source: Currency | null | undefined
) => {
  const { provider, chainId } = useWeb3React()
  const [zapToEarnResult, setZapToEarnResult] = useState<string>(ZapToEarnStateTransition.UNATTEMPTED)
  const [txhash, setTxHash] = useState<string | undefined>(undefined)
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false)
  const [possibleErrorMsg, setPossibleErrorMsg] = useState<string | undefined>(undefined)

  const addTransaction = useTransactionAdder()

  const calculatePrice = (sqrtPriceX96: BigNumber) => {
    const x96 = BigNumber.from('2').pow('96')
    const newPriceSqrt = new bn(sqrtPriceX96.toString()).div(x96.toString())
    const newPrice = newPriceSqrt.pow('2')
    return newPrice
  }

  const calculateMinAmountAndPriceChange = async (zapState: IZapState, chainId: number | SupportedChainId) => {
    if (!source) return
    //@ts-ignore
    const signer = provider.getSigner()
    const quoterv2 = new zksync.Contract(QUOTER_V2_ADDRESSES[chainId], QuoterV2ABI, signer)
    // const factory = new zksync.Contract(FACTORY_ADDRESS, FactoryABI, signer)
    const factory = new zksync.Contract(V3_CORE_FACTORY_ADDRESSES[chainId], FactoryABI, signer)

    const amount0 = parseUnits(zapState.amount0, source?.decimals)
    zapState.amount0 = amount0.toString()
    for (let i = 0; i < zapState.swapParams.length; i++) {
      const poolAddress = await factory.getPool(
        zapState.source,
        zapState.swapParams[i].target,
        zapState.swapParams[i].fee
      ) //TODO
      const pool = new zksync.Contract(poolAddress, PoolABI, signer)
      const { sqrtPriceX96 } = await pool.slot0()
      const currentPrice = calculatePrice(sqrtPriceX96)

      const { amountOut, sqrtPriceX96After } = await quoterv2.callStatic.quoteExactInputSingle({
        tokenIn: zapState.source,
        tokenOut: zapState.swapParams[i].target,
        amountIn: amount0.div('2'),
        fee: zapState.swapParams[i].fee,
        sqrtPriceLimitX96: 0,
      })

      const priceAfterSwap = calculatePrice(sqrtPriceX96After)
      zapState.swapParams[i].amountOutMinimum = amountOut.mul('9500').div('10000')

      //TODO calculate price change perc
      const changePerc = priceAfterSwap.minus(currentPrice).times('100').div(currentPrice).toNumber()

      if (Math.abs(changePerc) > 10) {
        throw 'Price impact is too high'
      }
    }
  }

  const formatLiquidityParams = (liquidityParams: ILiqidityParams) => {
    const token0 = liquidityParams.token0
    const token1 = liquidityParams.token1
    const params = liquidityParams

    if (BigNumber.from(liquidityParams.token0).gt(liquidityParams.token1)) {
      params.token0 = token1
      params.token1 = token0
    }

    return params
  }

  const fn = async () => {
    try {
      if (!zapState) throw '[Zap State not initialized]'

      setZapToEarnResult(ZapToEarnStateTransition.LOADING)
      if (!provider || !chainId) throw 'No provider or chainId [useZapToEarn]'

      const signer = provider.getSigner()

      const ZAP_CONTRACT = new zksync.Contract(ZAP_TO_EARN_ADDRESSES[chainId], ZAP_TO_EARN_ABI, signer)

      const payload: IZapState = zapState
      const currentTime = new Date().getTime()
      const deadline = currentTime + 3 * 60 * 1000

      payload.liquidityParams = formatLiquidityParams(payload.liquidityParams)
      await calculateMinAmountAndPriceChange(payload, chainId)

      setAttemptingTxn(true)
      const tx = await ZAP_CONTRACT.zap(
        payload.swapParams,
        payload.liquidityParams,
        payload.source,
        payload.amount0,
        deadline,
        {
          value: source?.isNative ? payload.amount0 : '0', //send native eth
        }
      )

      const receipt: TransactionReceipt = await tx.wait()
      setAttemptingTxn(false)

      addTransaction(tx, {
        type: TransactionType.ADD_LIQUIDITY_V3_POOL,
        baseCurrencyId: payload.liquidityParams.token0,
        quoteCurrencyId: payload.liquidityParams.token1,
        createPool: false,
        expectedAmountBaseRaw: '0',
        expectedAmountQuoteRaw: '0',
        feeAmount: Number(payload.liquidityParams.fee),
      })
      setZapToEarnResult(ZapToEarnStateTransition.SUCCESS)
      setTxHash(receipt.transactionHash)
    } catch (error) {
      const err = error as Error | unknown | any
      if (didUserReject(err)) {
        setPossibleErrorMsg('Transaction rejected')
      } else {
        setPossibleErrorMsg(err)
      }
      // setPossibleErrorMsg(error)
      setAttemptingTxn(false)
      setZapToEarnResult(ZapToEarnStateTransition.FAILED)
      console.log('[Error in useZapToEarnCallback]', error)
    }
  }
  return {
    fn,
    zapToEarnResult,
    setZapToEarnResult,
    txhash,
    attemptingTxn,
    possibleErrorMsg,
  }
}

export const useZapToEarn = ({
  zapState,
  currentPool,
  source,
}: {
  zapState: IZapState | null
  currentPool: RawPoolInfoState
  source: Currency | null | undefined
}) => {
  const {
    fn: zapToEarnCallback,
    zapToEarnResult,
    setZapToEarnResult,
    txhash,
    attemptingTxn,
    possibleErrorMsg,
  } = useZapToEarnCallback(zapState, currentPool, source)

  const callback = useMemo(() => {
    return () =>
      zapToEarnCallback()
        .then((response) => {
          console.log('[zapToEarnCallback]', response)
          return response
        })
        .catch((err) => {
          console.log('[Error in zapToEarnCallback]', err)
        })
  }, [zapToEarnCallback])

  return {
    callback,
    zapToEarnResult,
    setZapToEarnResult,
    txhash,
    attemptingTxn,
    possibleErrorMsg,
  }
}
