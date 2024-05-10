/* eslint-disable import/no-unused-modules */
import { useWeb3React } from '@web3-react/core'
import { useAtom } from 'jotai'
import { earnedAdditionalAtom, earnedAtom } from 'pages/Cultivate/hooks/useGetEarnedStaking'
import { allocationInfoJotai } from 'pages/Cultivate/hooks/useUserPositionAllocation'
import { balanceAtom, initialBalance } from 'pages/xDERP/hooks/useAvailableDerpBalance'
import { useEffect } from 'react'

export const RefreshJotai = () => {
  const { account, chainId } = useWeb3React()
  // const [derivedPositionsState, setDerivedPositionsState] = useAtom(derivedPositionsAtom)
  const [derivedEarnings, setDerivedEarnings] = useAtom(earnedAtom)
  const [derivedEarningsAdditional, setDerivedEarningsAdditional] = useAtom(earnedAdditionalAtom)
  const [balanceState, setBalanceState] = useAtom(balanceAtom)
  const [allocationState, setAllocationState] = useAtom(allocationInfoJotai)

  useEffect(() => {
    // setDerivedPositionsState({})
    setDerivedEarnings({})
    setDerivedEarningsAdditional({})
    setBalanceState(initialBalance)
    setAllocationState({})
  }, [account, chainId])
  return <></>
}
