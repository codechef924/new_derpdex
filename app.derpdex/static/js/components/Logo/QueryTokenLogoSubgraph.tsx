import { TopTokenSubgraph } from 'graphql/data/TopTokens'

import AssetLogo, { AssetLogoBaseProps } from './AssetLogo'

export default function QueryTokenLogoSubgraph(
  props: AssetLogoBaseProps & {
    token?: TopTokenSubgraph
  }
) {
  // const chainId = props.token?.chain ? CHAIN_NAME_TO_CHAIN_ID[props.token?.chain] : undefined
  //@ts-ignore
  const chainId = props.token.chainId ? +props.token.chainId : undefined

  return (
    <AssetLogo
      isNative={
        // TODO(cartcrom): simplify this check after backend fixes token standard on assetActivities tokens
        !props.token?.token?.id
        // props.token?.standard === TokenStandard.Native ||
        // props.token?.address === NATIVE_CHAIN_ID
      }
      chainId={chainId}
      address={props.token?.token?.id}
      symbol={props.token?.token?.symbol}
      backupImg={/* props.token?.project?.logoUrl */ ''}
      {...props}
    />
  )
}
