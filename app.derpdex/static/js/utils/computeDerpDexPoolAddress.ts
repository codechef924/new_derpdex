/* eslint-disable unused-imports/no-unused-imports */
/* eslint-disable import/no-unused-modules */
import { ZKSYNC_POOL_INIT_CODE_HASH } from '@derpdex/sdk'
import { defaultAbiCoder } from '@ethersproject/abi'
import { getCreate2Address } from '@ethersproject/address'
import { keccak256 } from '@ethersproject/solidity'
import { Token } from '@uniswap/sdk-core'
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import * as ethers from 'ethers'
import * as zksync from 'zksync-web3'

import { FeeAmount, POOL_INIT_CODE_HASH } from './constants'

/**
 * Computes a pool address
 * @param factoryAddress The Uniswap V3 factory address
 * @param tokenA The first token of the pair, irrespective of sort order
 * @param tokenB The second token of the pair, irrespective of sort order
 * @param fee The fee tier of the pool
 * @param initCodeHashManualOverride Override the init code hash used to compute the pool address if necessary
 * @returns The pool address
 */
export function computeDerpDexPoolAddress({
  factoryAddress,
  tokenA,
  tokenB,
  fee,
  initCodeHashManualOverride,
}: {
  factoryAddress: string
  tokenA: Token
  tokenB: Token
  fee: FeeAmount
  initCodeHashManualOverride?: string
}): string {
  const activeCodeHash = initCodeHashManualOverride ? initCodeHashManualOverride : ZKSYNC_POOL_INIT_CODE_HASH
  const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA] // does safety checks

  const salt = keccak256(
    ['bytes'],
    [ethers.utils.defaultAbiCoder.encode(['address', 'address', 'uint24'], [token0.address, token1.address, fee])]
  )

  const poolAddress = zksync.utils.create2Address(factoryAddress, activeCodeHash, salt, '0x')
  return poolAddress
}
