import { SupportedChainId } from 'constants/chains'
/* eslint-disable import/no-unused-modules */
export const getTestnetTokenRemap = (chainId: number, symbol?: string | null) => {
  if (!symbol) return TOKEN_REMAP['USDC']

  switch (chainId) {
    case SupportedChainId.ZKSYNC_TESTNET:
      return TOKEN_REMAP[symbol]
    case SupportedChainId.BASE_TESTNET:
      return BASE_TOKEN_REMAP[symbol]
    default:
      return TOKEN_REMAP[symbol]
  }
}

const TOKEN_REMAP: { [key: string]: string } = {
  USDC: '0x3355df6d4c9c3035724fd0e3914de96a5a83aaf4',
  USDT: '0x493257fd37edb34451f62edf8d2a0c418852ba4c',
  WETH: '0x5aea5775959fbc2557cc8789bc1bf90a239d9a91',
  SHIB: '0x5b09802d62d213c4503b4b1ef5f727ef62c9f4ef',
  ZKDERPINA: '0x8574852f548351ad5fe7f712009362997c1d14bb',
}

const BASE_TOKEN_REMAP: { [key: string]: string } = {
  USDC: '0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca',
}
