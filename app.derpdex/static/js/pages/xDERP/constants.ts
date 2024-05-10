import { SupportedChainId } from 'constants/chains'

export const DERP_ADDRESSES_BY_CHAINID: { [key: number | SupportedChainId]: string } = {
  [SupportedChainId.MAINNET]: '0x5dfc78c4d073fd343bc6661668948178522a0de5',
  [SupportedChainId.GOERLI]: '0xE564Cc37FbAb4B4b71BD76AD8EB0AF6726B6b7D2',
  [SupportedChainId.OPBNB_MAINNET]: '0xebb78043e29f4af24e6266a7d142f5a08443969e',
  [SupportedChainId.OPBNB_TESTNET]: '0xac465de4d7Fbdc2e3c33f303147298200357CbFE',
  [SupportedChainId.BASE_MAINNET]: '0xebb78043e29f4af24e6266a7d142f5a08443969e',
  [SupportedChainId.BASE_TESTNET]: '0xac465de4d7Fbdc2e3c33f303147298200357CbFE',
  [SupportedChainId.ZKSYNC_MAINNET]: '0x0bf4cb727b3f8092534d793893b2cc3348963dbf',
  [SupportedChainId.ZKSYNC_TESTNET]: '0xB5Ae4151A015F89d81a37EA4088AF8a4aDC56961',
}

export const XDERP_ADDRESSES_BY_CHAINID: { [key: number | SupportedChainId]: string } = {
  [SupportedChainId.MAINNET]: '0xfb13dcf64e14ac4403ed52cd690ea4641d90c4c6',
  [SupportedChainId.GOERLI]: '0x3E120082907912667c1b4444cE7Cb74cf91535f9',
  [SupportedChainId.OPBNB_MAINNET]: '0x983ba88d66291d5a62684f1fe01ff186f97ab455',
  [SupportedChainId.OPBNB_TESTNET]: '0x9F7999406D579b80b8ddabB8B106F4a22D057788',
  [SupportedChainId.BASE_MAINNET]: '0x85fb47a24afec3cba80d439b8cb108121de333d9',
  [SupportedChainId.BASE_TESTNET]: '0x93B569efC1487a3CA0b4F52d0762b81018E3ab49',
  [SupportedChainId.ZKSYNC_MAINNET]: '0x3239b2fb367243d827fea1e460f016e15797d7ca',
  [SupportedChainId.ZKSYNC_TESTNET]: '0x22032C8170BaEA3c425010d1cb0095d225B266B9',
}

export const EMPTY_STRING = ''
