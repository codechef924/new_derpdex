import { Currency } from '@uniswap/sdk-core'
import { TokenInfo } from '@uniswap/token-lists'

import AssetLogo, { AssetLogoBaseProps } from './AssetLogo'
import { BRIDGE_INFO } from '../_supported_token_bridge'

export default function BridgeCurrencyLogo(
  props: AssetLogoBaseProps & {
    currency?: BRIDGE_INFO | null
    size?: string,
    isL1: boolean
  }
) {
  return (
    <AssetLogo
      size={props.size ? props.size : '24px'}
      address={props.isL1 ? props.currency?.L1Address : props.currency?.L2Address}
      symbol={props.symbol ?? props.currency?.symbol}
      backupImg={props.currency?.logoURI}
      hideL2Icon={props.hideL2Icon ?? true}
      {...props}
    />
  )
}
