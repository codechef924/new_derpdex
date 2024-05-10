import { TokenInfo } from '@uniswap/token-lists'

import store from '../state'
import {
  BASE_MAINNET_LIST,
  BASE_TESTNET_LIST,
  OPBNB_MAINNET_LIST,
  OPBNB_TESTNET_LIST,
  UNSUPPORTED_LIST_URLS,
  ZKSYNC_MAINNET_LIST,
  ZKSYNC_TESTNET_LIST,
} from './lists'
import brokenTokenList from './tokenLists/broken.tokenlist.json'
import { NATIVE_CHAIN_ID } from './tokens'

export enum TOKEN_LIST_TYPES {
  UNI_DEFAULT = 1,
  UNI_EXTENDED,
  UNKNOWN,
  BLOCKED,
  BROKEN,
}

class TokenSafetyLookupTable {
  dict: { [key: string]: TOKEN_LIST_TYPES } | null = null

  createMap() {
    const dict: { [key: string]: TOKEN_LIST_TYPES } = {}

    // TODO - Only add if more tokens listed on DerpDEX
    // Initialize extended tokens first
    store.getState().lists.byUrl[ZKSYNC_TESTNET_LIST].current?.tokens.forEach((token) => {
      dict[token.address.toLowerCase()] = TOKEN_LIST_TYPES.UNI_DEFAULT
    })

    // Initialize default tokens second, so that any tokens on both default and extended will display as default (no warning)
    store.getState().lists.byUrl[ZKSYNC_MAINNET_LIST].current?.tokens.forEach((token) => {
      dict[token.address.toLowerCase()] = TOKEN_LIST_TYPES.UNI_DEFAULT
    })

    store.getState().lists.byUrl[BASE_MAINNET_LIST].current?.tokens.forEach((token) => {
      dict[token.address.toLowerCase()] = TOKEN_LIST_TYPES.UNI_DEFAULT
    })

    store.getState().lists.byUrl[BASE_TESTNET_LIST].current?.tokens.forEach((token) => {
      dict[token.address.toLowerCase()] = TOKEN_LIST_TYPES.UNI_DEFAULT
    })

    store.getState().lists.byUrl[OPBNB_TESTNET_LIST].current?.tokens.forEach((token) => {
      dict[token.address.toLowerCase()] = TOKEN_LIST_TYPES.UNI_DEFAULT
    })

    store.getState().lists.byUrl[OPBNB_MAINNET_LIST].current?.tokens.forEach((token) => {
      dict[token.address.toLowerCase()] = TOKEN_LIST_TYPES.UNI_DEFAULT
    })

    // TODO: Figure out if this list is still relevant
    brokenTokenList.tokens.forEach((token) => {
      dict[token.address.toLowerCase()] = TOKEN_LIST_TYPES.BROKEN
    })

    // Initialize blocked tokens from all urls included
    UNSUPPORTED_LIST_URLS.map((url) => store.getState().lists.byUrl[url].current?.tokens)
      .filter((x): x is TokenInfo[] => !!x)
      .flat(1)
      .forEach((token) => {
        dict[token.address.toLowerCase()] = TOKEN_LIST_TYPES.BLOCKED
      })
    return dict
  }

  checkToken(address: string) {
    if (!this.dict) {
      this.dict = this.createMap()
    }
    if (address === NATIVE_CHAIN_ID.toLowerCase()) {
      return TOKEN_LIST_TYPES.UNI_DEFAULT
    }
    return this.dict[address] ?? TOKEN_LIST_TYPES.UNKNOWN
  }
}

export default new TokenSafetyLookupTable()
