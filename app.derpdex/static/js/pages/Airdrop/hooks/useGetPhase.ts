import { useWeb3React } from '@web3-react/core'
import { BigNumber, Contract, ethers } from 'ethers'
import { useEffect, useState } from 'react'

import AirdropABI from '../abis/airdrop.abi.json'
import { AIRDROP_ADDRESSES } from '../constants'

export const useGetPhase = ({ totalAllocationsPhase1 }: { totalAllocationsPhase1?: string }) => {
  const { provider, chainId } = useWeb3React()
  const [phase, setPhase] = useState<number>(1)
  const [phase1StartTimestamp, setPhase1StartTimestamp] = useState<number>(0)
  const [phase1EndTimestamp, setPhase1EndTimestamp] = useState<number>(0)
  const [phase2EndtTimestamp, setPhase2EndtTimestamp] = useState<number>(0)

  const onGetPhase = async () => {
    try {
      if (!provider || !chainId) throw '[account/chainId is required]'

      const currentTimestamp = Date.now() / 1000

      const contract = new Contract(AIRDROP_ADDRESSES[chainId], AirdropABI, provider)

      const airdropStartTime = await contract.airdropStartTime()
      const phase2StartTime = await contract.phase2StartTime()
      const phase2EndTime = await contract.phase2EndTime()

      setPhase1StartTimestamp(BigNumber.from(airdropStartTime).toNumber())
      setPhase1EndTimestamp(BigNumber.from(phase2StartTime).toNumber())
      setPhase2EndtTimestamp(BigNumber.from(phase2EndTime).toNumber())

      if (
        currentTimestamp > BigNumber.from(airdropStartTime).toNumber() &&
        currentTimestamp < BigNumber.from(phase2StartTime).toNumber()
      ) {
        setPhase(1)
      } else if (
        currentTimestamp > BigNumber.from(phase2StartTime).toNumber() &&
        currentTimestamp < BigNumber.from(phase2EndTime).toNumber()
      ) {
        setPhase(2)
      } else {
        setPhase(3)
      }
    } catch (e) {
      console.log('[onGetPhase]', e)
    }
  }

  const totalValuationInUSD = 1420000
  const [totalClaimedPhase1, setTotalClaimedPhase1] = useState<number>(0)
  const [totalClaimedPhase1InPercent, setTotalClaimedPhase1InPercent] = useState<number>(0)
  const [remainingAmount, setRemainingAmount] = useState<number>(0)
  const [remainingAmountInUSD, setRemainingAmountInUSD] = useState<number>(0)
  const [isLoadingCountRemaining, setIsLoadingCountRemaining] = useState<boolean>(false)
  const [valuePerAmountInUSD, setValuePerAmountInUSD] = useState<number>(0)
  const totalClaimedPerPhase = async () => {
    try {
      setIsLoadingCountRemaining(true)
      if (!provider || !chainId) throw '[account/chainId is required]'

      const contract = new Contract(AIRDROP_ADDRESSES[chainId], AirdropABI, provider)
      const _totalClaimedPhase1 = await contract.totalClaimedPerPhase(1)
      const _totalClaimedPhase2 = await contract.totalClaimedPerPhase(2)
      // TODO: [airdrop] Need to get the total allocation for phase 1 to display how many collected
      let _totalAllocationPhase1 = 0
      let _remainingAmount = 0
      if (totalAllocationsPhase1) {
        _totalAllocationPhase1 = parseFloat(totalAllocationsPhase1) || 0
        const valuePerAmount = totalValuationInUSD / parseFloat(ethers.utils.formatUnits(totalAllocationsPhase1, 18))

        // console.log('valuePerAmount', valuePerAmount)
        setValuePerAmountInUSD(valuePerAmount)

        // console.log('totalAllocationsPhase1', ethers.utils.formatUnits(totalAllocationsPhase1, 18))
        // console.log('_totalClaimedPhase1', ethers.utils.formatUnits(_totalClaimedPhase1))
        // console.log('_totalClaimedPhase2', ethers.utils.formatUnits(_totalClaimedPhase2))
        _remainingAmount =
          parseFloat(ethers.utils.formatUnits(totalAllocationsPhase1, 18)) -
          parseFloat(ethers.utils.formatUnits(_totalClaimedPhase1, 18)) -
          parseFloat(ethers.utils.formatUnits(_totalClaimedPhase2, 18))

        setRemainingAmount(_remainingAmount)
        const _remainingAmountInUSD = _remainingAmount * valuePerAmount
        setRemainingAmountInUSD(_remainingAmountInUSD)
      }

      const _totalClaimedPhase1InPercent = (parseFloat(_totalClaimedPhase1) / _totalAllocationPhase1) * 100

      setTotalClaimedPhase1(parseFloat(ethers.utils.formatUnits(_totalClaimedPhase1, 18)) || 0)
      setTotalClaimedPhase1InPercent(_totalClaimedPhase1InPercent)

      setIsLoadingCountRemaining(false)
    } catch (e) {
      console.log('[totalClaimedPerPhase]', e)
    } finally {
      setIsLoadingCountRemaining(false)
    }
  }

  useEffect(() => {
    onGetPhase()
    totalClaimedPerPhase()
  }, [chainId, provider, totalAllocationsPhase1])

  return {
    phase,
    phase1StartTimestamp,
    phase1EndTimestamp,
    phase2EndtTimestamp,
    totalClaimedPhase1,
    totalClaimedPhase1InPercent,
    remainingAmount,
    remainingAmountInUSD,
    valuePerAmountInUSD,
    isLoadingCountRemaining,
  }
}
