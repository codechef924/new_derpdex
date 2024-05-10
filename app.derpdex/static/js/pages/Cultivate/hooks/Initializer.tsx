/* eslint-disable import/no-unused-modules */
import { useWeb3React } from '@web3-react/core'
import { SupportedChainId } from 'constants/chains'
import { useGetStakingPools } from 'hooks/useWhitelistedPoolAddresses'
import { useAtomValue } from 'jotai/utils'
import { useEffect } from 'react'

import { derivedPositionsAtom } from '../state/search.state'
import { Position, useDerivedStakedPositions } from './useDerivedStakedPositions'
import { useUserPositionAllocation } from './useUserPositionAllocation'

const CallStack = ({ poolAddress, incentiveId }: { poolAddress: string; incentiveId: string }) => {
  const { account, chainId } = useWeb3React()
  useDerivedStakedPositions({
    chainId: chainId ?? SupportedChainId.ZKSYNC_MAINNET,
    incentiveId,
    poolAddress,
  })

  // useUserPositionAllocation({
  //   poolAddress,
  //   poolId
  // })
  return <></>
}
export const Initializer = () => {
  const { account, chainId } = useWeb3React()
  const { allPoolAddresses, incentiveKeys } = useGetStakingPools({
    chainId: chainId ? chainId : SupportedChainId.ZKSYNC_TESTNET,
  })

  const { getUserPositionAllocationInit } = useUserPositionAllocation({
    poolAddress: 'UNSET',
    poolId: 'UNSET',
    shouldInvoke: false,
  })

  const derivedPositionsState = useAtomValue(derivedPositionsAtom)

  // * To initialize user's staked xDerp
  useEffect(() => {
    if (account && derivedPositionsState) {
      for (const poolAddress in derivedPositionsState) {
        derivedPositionsState[poolAddress][Position.STAKED].forEach((staked) => {
          getUserPositionAllocationInit({
            poolAddress,
            poolId: staked.id,
          })
        })
      }
    }
  }, [account, derivedPositionsState])

  return (
    <>
      {Object.keys(incentiveKeys).length > 0 &&
        Object.keys(incentiveKeys).map((a) => <CallStack incentiveId={a} key={a} poolAddress={a} />)}
    </>
  )
}
