import { BRIDGE_INFO_SUPPORTED_TOKEN } from '../_supported_token_bridge'
import AssetLogo, { AssetLogoBaseProps } from './AssetLogo'

export default function BridgeCurrencyLogo(
  props: AssetLogoBaseProps & {
    currency?: BRIDGE_INFO_SUPPORTED_TOKEN | null
    size?: string
    isL1: boolean
  }
) {
  return (
    <AssetLogo
      size={props.size ? props.size : '24px'}
      symbol={props.symbol ?? props.currency?.symbol}
      backupImg={props.currency?.logoURI}
      {...props}
    />
  )
}
