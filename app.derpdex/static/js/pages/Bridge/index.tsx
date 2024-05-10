import { useWeb3React } from '@web3-react/core'
import { PageWrapper } from 'components/swap/styleds'
import { ALLOWED_CHAIN_FOR_BRIDGE } from 'constants/chains'
import { useMemo } from 'react'
import styled from 'styled-components'

import BridgeComponent from './BridgeComponent'
import { ExternalBridge } from './ExternalBridge'
import { ExtGloriaText } from './stylings'

type IBridgeWrapper = {
  isExternalBridge: boolean
}
const BridgePageWrapper = styled(PageWrapper)<IBridgeWrapper>`
  padding: 0px 2% 108px 2%;
  @media only screen and (max-width: 768px) {
    padding: 42px 2% 108px 2%;
  }

  max-width: ${({ isExternalBridge }) => (!isExternalBridge ? '568px' : '100%')};
`

export const Bridge = () => {
  const { chainId } = useWeb3React()
  //! Resolve for chainId
  const isSupportedInternalBridge = useMemo(() => {
    if (!chainId) return false

    if (ALLOWED_CHAIN_FOR_BRIDGE.includes(chainId)) {
      return true
    } else {
      return false
    }
  }, [chainId])
  return (
    <BridgePageWrapper isExternalBridge={!isSupportedInternalBridge}>
      <ExtGloriaText>Bridge</ExtGloriaText>
      {isSupportedInternalBridge ? <BridgeComponent /> : <ExternalBridge />}
    </BridgePageWrapper>
  )
}
