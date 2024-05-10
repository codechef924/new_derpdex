import { SupportedChainId } from 'constants/chains'

export const IDO_CONTRACT: { [key: number | SupportedChainId]: string } = {
  [SupportedChainId.ZKSYNC_MAINNET]: '0xc28f644AddA4aFfb8B0D4e4E55DC98B728f6171d',
  [SupportedChainId.ZKSYNC_TESTNET]: '',
  [SupportedChainId.BASE_MAINNET]: '0x23e331c00c9a426fe4b320037ec0bb74192e3330',
  [SupportedChainId.BASE_TESTNET]: '',
  [SupportedChainId.OPBNB_MAINNET]: '0xD32659ab0C4561F5b4f8aE72FAfa72D0Af7b1f30',
  [SupportedChainId.OPBNB_TESTNET]: '0xFDd92Cc0cBC411412685953dE9586518319E2b60',
}
