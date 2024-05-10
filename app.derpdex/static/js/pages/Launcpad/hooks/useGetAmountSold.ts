import { RPC_PROVIDERS } from 'constants/providers'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'

import { CHAINIDS, LAUNCHPAD_ADDRESSES } from '../constants'
import { DerivedLaunchPadDetails } from './useGetLaunchpadCampaigns'

/* eslint-disable import/no-unused-modules */

type InitialState = {
  isLoading: boolean
  isSuccess: boolean
  amountSold: string
  error: string | null
}
const initialState: InitialState = {
  isLoading: false,
  isSuccess: false,
  amountSold: '0',
  error: null,
}

export const useGetAmountSold = ({
  launchPadInfo,
  shouldRefetch,
}: {
  launchPadInfo: DerivedLaunchPadDetails
  shouldRefetch: boolean
}) => {
  const [amountSold, setAmountSold] = useState<string>()
  const [amountSoldData, setAmountSoldData] = useState<InitialState>(initialState)

  const getRemainingAmount = async () => {
    const promises = []
    try {
      setAmountSoldData({ ...initialState, isLoading: true })
      for await (const chainId of CHAINIDS) {
        const RPC_PROVIDER = RPC_PROVIDERS[chainId]

        const launchpadContract = new ethers.Contract(
          LAUNCHPAD_ADDRESSES[chainId],
          [
            `function campaignInfo(bytes32) external view returns (
                  address token, uint256 startTime, uint256 endTime, uint256 amountAllocated, uint256 amountRemaining, address signer,
                  bool ended
              )`,
          ],
          RPC_PROVIDER
        )
        promises.push(launchpadContract.campaignInfo(launchPadInfo.campaignId))
      }
      const result = await Promise.all(promises)
      let amountRemaining = ethers.BigNumber.from(0)
      let totalAmount = ethers.BigNumber.from(0)
      result.forEach((_result) => {
        amountRemaining = amountRemaining.add(_result.amountRemaining)
        totalAmount = totalAmount.add(_result.amountAllocated)
      })

      const amountSold = totalAmount.sub(amountRemaining)
      const amountRemainingActual = launchPadInfo.actualTotalAmount
        ? ethers.utils.parseUnits(launchPadInfo.actualTotalAmount, launchPadInfo.tokenDecimals).sub(amountSold)
        : amountRemaining

      const _amountSold = ethers.utils.formatUnits(amountSold.toString(), 18).toString()
      setAmountSoldData((p) => ({ ...p, amountSold: _amountSold, isSuccess: true }))
    } catch (error) {
      console.log('[Err getRemainingAmount]', error)
      setAmountSoldData((p) => ({
        ...p,
        amountSold: '0',
        isSuccess: false,
        error: error || 'An error occurred',
      }))
    } finally {
      setAmountSoldData((p) => ({ ...p, isLoading: false }))
    }
  }

  useEffect(() => {
    getRemainingAmount()
  }, [shouldRefetch])

  return {
    amountSoldData,
  }
}
