import { useWeb3React } from '@web3-react/core'
import { NunitoText } from 'components/CustomFonts/Nunito'
import { PageWrapper } from 'components/swap/styleds'
import { getChainInfo } from 'constants/chainInfo'
import { useMemo } from 'react'
import styled from 'styled-components'

import BridgeComponent from './components/BridgeComponent'
import { ALLOWED_CHAIN_FOR_BRIDGE } from './constant'
// import BridgeComponent from './BridgeComponent'
// import { ExternalBridge } from './ExternalBridge'
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

const NotSupported = styled.div`
  margin-top: 10%;
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`

export const DerpBridge = () => {
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

  const getChainInfoDetails = useMemo(() => {
    return getChainInfo(chainId)
  }, [chainId])
  return (
    <BridgePageWrapper isExternalBridge={!isSupportedInternalBridge}>
      <ExtGloriaText>Derp Bridge</ExtGloriaText>
      {isSupportedInternalBridge ? (
        <BridgeComponent />
      ) : (
        <NotSupported>
          <NunitoText size="xl" weight={600}>
            {getChainInfoDetails?.label} is Not Supported Yet.
          </NunitoText>
        </NotSupported>
      )}
    </BridgePageWrapper>
  )
}
