import { Currency } from '@uniswap/sdk-core'
import { useWeb3React } from '@web3-react/core'
import { useCurrency } from 'hooks/Tokens'
import { atom, useAtom } from 'jotai'
import { useMemo, useState } from 'react'

import { SUPPORTED_CHAIN_FOR_ZAP_TO_EARN } from '../constants/general'
import { SupportedChainId } from './../../../constants/chains'

//! DO NOT DISTURB! >:(
export type ParsedPoolInfoState = {
  address: string
  token0?: Currency | null
  token1?: Currency | null
}

export type RawPoolInfoState = {
  address: string
  token0?: {
    symbol: string
    address: string
    decimals: number
  }
  token1?: {
    symbol: string
    address: string
    decimals: number
  }
  feeTier?: string
}

// Create a Jotai atom
const useParsedPool = (address: string, token0: string, token1: string, chainId: SupportedChainId) => {
  return atom({
    address: '0x01031491cc0ac92b369951a26cfc527cea4de68c',
    token0: useCurrency('0x3355df6d4c9c3035724fd0e3914de96a5a83aaf4', chainId),
    token1: useCurrency('0x5aea5775959fbc2557cc8789bc1bf90a239d9a91', chainId),
  })
}

const ZKSYNC_TESTNET_INITIALIZATION: RawPoolInfoState = {
  address: '0x0a9cbb56a0d3d3b49c4ac01b89ef4dfba20bee48',
  token0: {
    symbol: 'USDT',
    address: '0x0890a779a8675464b8d0bedaf62620ce1ea62e4a',
    decimals: 6,
  },
  token1: {
    symbol: 'WETH',
    address: '0xc3ec043c150c945652a09d7e47f856ac9fb0f893',
    decimals: 18,
  },
  feeTier: '3000',
}

const ZKSYNC_MAINNET_INITIALIZATION: RawPoolInfoState = {
  address: '0xf91dd375822b0223ed9e69f36b9926c611116546',
  token0: {
    symbol: 'USDC',
    address: '0x3355df6d4c9c3035724fd0e3914de96a5a83aaf4',
    decimals: 6,
  },
  token1: {
    symbol: 'WETH',
    address: '0x5aea5775959fbc2557cc8789bc1bf90a239d9a91',
    decimals: 18,
  },
  feeTier: '3000',
}

const BASE_TESTNET_INITIALIZATION: RawPoolInfoState = {
  address: '0x0ba4ea522981605b5ea4af8bcc58fb5940f04df6',
  token0: {
    symbol: 'USDC',
    address: '0x2a337c269e74af16d5a608956b675ade882220f3',
    decimals: 6,
  },
  token1: {
    symbol: 'WETH',
    address: '0xea6658dccf674ed9902b4439798b06ce048791e5',
    decimals: 18,
  },
  feeTier: '3000',
}

const BASE_MAINNET_INITIALIZATION: RawPoolInfoState = {
  address: '0x09b852108b6ed78adb2e776d901b8d54ba708080',
  token0: {
    symbol: 'WETH',
    address: '0x4200000000000000000000000000000000000006',
    decimals: 18,
  },
  token1: {
    symbol: 'USDbC',
    address: '0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca',
    decimals: 6,
  },
  feeTier: '3000',
}

const OPBNB_TESTNET_INITIALIZATION: RawPoolInfoState = {
  address: '0x0ba4ea522981605b5ea4af8bcc58fb5940f04df6', // TBU!
  token0: {
    symbol: 'USDT',
    address: '0x5461A9dBeA2F5eFa771a2d6F8F78bC589d4Bb0D7', // TBU!
    decimals: 6,
  },
  token1: {
    symbol: 'WBNB',
    address: '0x4200000000000000000000000000000000000006',
    decimals: 18,
  },
  feeTier: '3000',
}

const OPBNB_MAINNET_INITIALIZATION: RawPoolInfoState = {
  address: '0xaf310d32c3c2982a23ce7ec1fe152912595a4c50', // TBU!
  token0: {
    symbol: 'USDT',
    address: '0x9e5aac1ba1a2e6aed6b32689dfcf62a509ca96f3', // TBU!
    decimals: 18,
  },
  token1: {
    symbol: 'WBNB',
    address: '0x4200000000000000000000000000000000000006',
    decimals: 18,
  },
  feeTier: '3000',
}

const initialZkSyncPoolState = atom<RawPoolInfoState>({
  ...(process.env.REACT_APP_IS_TESTSITE === 'false' ? ZKSYNC_MAINNET_INITIALIZATION : ZKSYNC_TESTNET_INITIALIZATION),
})

const initialBasePoolState = atom<RawPoolInfoState>({
  ...(process.env.REACT_APP_IS_TESTSITE === 'false' ? BASE_MAINNET_INITIALIZATION : BASE_TESTNET_INITIALIZATION),
})

const initialOpBnbPoolState = atom<RawPoolInfoState>({
  ...(process.env.REACT_APP_IS_TESTSITE === 'false' ? OPBNB_MAINNET_INITIALIZATION : OPBNB_TESTNET_INITIALIZATION),
})

const INITIAL_POOLSTATE_BY_CHAINID: { [key: number]: typeof initialZkSyncPoolState | typeof initialBasePoolState } = {
  [SupportedChainId.ZKSYNC_TESTNET]: initialZkSyncPoolState,
  [SupportedChainId.ZKSYNC_MAINNET]: initialZkSyncPoolState,
  [SupportedChainId.BASE_TESTNET]: initialBasePoolState,
  [SupportedChainId.BASE_MAINNET]: initialBasePoolState,
  [SupportedChainId.OPBNB_TESTNET]: initialOpBnbPoolState,
  [SupportedChainId.OPBNB_MAINNET]: initialOpBnbPoolState,
}

export const useZapToEarnPool = () => {
  const [currentNetwork, setCurrentNetwork] = useState<number>(0)
  const { chainId } = useWeb3React()

  const fallbackChainId = useMemo(() => {
    if (!chainId) return SupportedChainId.ZKSYNC_MAINNET

    if (!SUPPORTED_CHAIN_FOR_ZAP_TO_EARN.includes(chainId)) {
      return SupportedChainId.ZKSYNC_MAINNET
    } else {
      return chainId
    }
  }, [chainId])

  const [currentPool, setCurrentPool] = useAtom(
    INITIAL_POOLSTATE_BY_CHAINID[fallbackChainId || SupportedChainId.ZKSYNC_MAINNET]
  )

  const setPool = (selectedPool: RawPoolInfoState) => {
    setCurrentPool(selectedPool)
  }

  // const onHandleNetworkChange = (chainId: number | SupportedChainId) => {
  //   setCurrentPool(INITIAL_POOLSTATE_BY_CHAINID[chainId])
  // }

  return {
    setPool,
    currentPool,
  }
}

//! DO NOT DISTURB
export const useDerivedParsedPool = (poolRaw: RawPoolInfoState): ParsedPoolInfoState => {
  const { chainId } = useWeb3React()

  return {
    address: poolRaw.address,
    token0: useCurrency(poolRaw.token0?.address, chainId),
    token1: useCurrency(poolRaw.token1?.address, chainId),
  }
}
