import { Trace } from '@uniswap/analytics'
import WormholeBridge, { WormholeConnectConfig } from '@wormhole-foundation/wormhole-connect'
import styled from 'styled-components/macro'

const PageWrapper = styled.div`
  width: 100%;
  background-color: rgb(229, 232, 242);

  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    padding-top: 48px;
  }

  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.sm}px`}) {
    padding-top: 70px;
    padding-bottom: 70px;
  }
`

const config: WormholeConnectConfig = {
  mode: 'light',
  env: process.env.REACT_APP_IS_TESTSITE === 'true' ? 'testnet' : 'mainnet',
}

export default function WormholeBridgePage() {
  return (
    <Trace page="wormhole-bridge" shouldLogImpression>
      <PageWrapper>
        <WormholeBridge config={config} />
      </PageWrapper>
    </Trace>
  )
}
