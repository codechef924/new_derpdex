import { SupportedChainId } from 'constants/chains'

export const initial = 0

export const AIRDROP_ADDRESSES: { [key: number | SupportedChainId]: string } = {
  [SupportedChainId.ZKSYNC_MAINNET]: '0x8f7Da9C713eA31b73c31776241f0b56261BD7956',
  [SupportedChainId.BASE_MAINNET]: '0xab886754C9daDeDab8Ed8a0ebbD32db0E3aC3158',
  [SupportedChainId.OPBNB_MAINNET]: '0x7F481823893ca8B1171eBB99A98B17996660c3Fa',
  [SupportedChainId.ZKSYNC_TESTNET]: '',
  [SupportedChainId.BASE_TESTNET]: '0x829Cb36e63E4c8d2a5FDdA53af15A2283737dBe9',
  [SupportedChainId.OPBNB_TESTNET]: '0x5f63B8475a5dbee5158b214452e2ccF19D52a1De',
  // [SupportedChainId.OPBNB_TESTNET]: '0x6FC4274A0EE5dBC322E01d71e546AbE259bAA500',
}
