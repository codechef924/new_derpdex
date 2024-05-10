import { Currency } from '@uniswap/sdk-core'
import { TokenInfo } from '@uniswap/token-lists'

import AssetLogo, { AssetLogoBaseProps } from './AssetLogo'

export default function CurrencyLogo(
  props: AssetLogoBaseProps & {
    currency?: Currency | null
    size?: string
    isDerp?: boolean
  }
) {
  return (
    <AssetLogo
      size={props.size ? props.size : '24px'}
      isNative={props.currency?.isNative}
      chainId={props.currency?.chainId}
      address={props.currency?.wrapped.address}
      symbol={props.symbol ?? props.currency?.symbol}
      backupImg={(props.currency as TokenInfo)?.logoURI}
      hideL2Icon={props.hideL2Icon ?? true}
      isDerp={props.isDerp}
      {...props}
    />
  )
}