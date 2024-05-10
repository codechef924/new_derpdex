import { useWeb3React } from '@web3-react/core'
import { RPC_PROVIDERS } from 'constants/providers'
import useBlockNumber from 'lib/hooks/useBlockNumber'
import multicall from 'lib/state/multicall'
import { useEffect, useState } from 'react'
import { SkipFirst } from 'types/tuple'

import { SupportedChainId } from './../../constants/chains'

export type { CallStateResult } from '@uniswap/redux-multicall' // re-export for convenience
export { NEVER_RELOAD } from '@uniswap/redux-multicall' // re-export for convenience

// Create wrappers for hooks so consumers don't need to get latest block themselves

const useGetLatestBlockNumberByChainId = (chainId: SupportedChainId) => {
  const [latestBlock, setLatestBlock] = useState(0)
  const onGetBlock = async () => {
    const provider = RPC_PROVIDERS[chainId]
    const onBlockNumber = await provider.getBlockNumber()
    setLatestBlock(onBlockNumber)
  }

  useEffect(() => {
    onGetBlock().catch((err) => {
      console.log('[Err getting latest block]: onGetBlock')
    })
  }, [chainId])

  return latestBlock
}
type SkipFirstTwoParams<T extends (...args: any) => any> = SkipFirst<Parameters<T>, 2>

export function useMultipleContractSingleData(
  ...args: SkipFirstTwoParams<typeof multicall.hooks.useMultipleContractSingleData>
) {
  const { chainId, latestBlock } = useCallContext()
  return multicall.hooks.useMultipleContractSingleData(chainId, latestBlock, ...args)
}

export function useMultipleContractSingleDataByChainId({
  chainId,
  args,
}: {
  chainId: number
  args: SkipFirstTwoParams<typeof multicall.hooks.useMultipleContractSingleData>
}) {
  const latestBlock = useGetLatestBlockNumberByChainId(chainId)
  return multicall.hooks.useMultipleContractSingleData(chainId, latestBlock, ...args)
}

export function useSingleCallResult(...args: SkipFirstTwoParams<typeof multicall.hooks.useSingleCallResult>) {
  const { chainId, latestBlock } = useCallContext()
  return multicall.hooks.useSingleCallResult(chainId, latestBlock, ...args)
}

export function useSingleContractMultipleData(
  ...args: SkipFirstTwoParams<typeof multicall.hooks.useSingleContractMultipleData>
) {
  const { chainId, latestBlock } = useCallContext()
  return multicall.hooks.useSingleContractMultipleData(chainId, latestBlock, ...args)
}

export function useSingleContractMultipleDataByChainId({
  chainId,
  args,
}: {
  chainId: SupportedChainId
  args: SkipFirstTwoParams<typeof multicall.hooks.useSingleContractMultipleData>
}) {
  const latestBlock = useGetLatestBlockNumberByChainId(chainId)
  return multicall.hooks.useSingleContractMultipleData(chainId, latestBlock, ...args)
}

export function useSingleContractWithCallData(
  ...args: SkipFirstTwoParams<typeof multicall.hooks.useSingleContractWithCallData>
) {
  const { chainId, latestBlock } = useCallContext()
  return multicall.hooks.useSingleContractWithCallData(chainId, latestBlock, ...args)
}

function useCallContext() {
  const { chainId } = useWeb3React()
  const latestBlock = useBlockNumber()
  return { chainId, latestBlock }
}

function useCallContextByChainId(chainId: number) {
  const latestBlock = useGetLatestBlockNumberByChainId(chainId)
  return { latestBlock }
}
