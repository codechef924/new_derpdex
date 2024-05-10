/* eslint-disable import/no-unused-modules */
import '@fontsource/nunito' // Defaults to weight 400

import { NunitoText } from 'components/CustomFonts/Nunito'
import { SupportedChainId } from 'constants/chains'
import styled from 'styled-components'

const FlexRoot = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
`

const AboutBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  text-align: center;

  gap: 16px;

  margin-bottom: 32px;

  a {
    color: blue;
  }
`

const FlexRow = styled.div`
  display: flex;
  gap: 24px;
  width: 1024px;
  flex-wrap: wrap;
  justify-content: space-evenly;
`

const FlexCell = styled.div`
  min-height: 176px;
  max-width: 500px;
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: space-between;
  gap: 8px;

  border-radius: 16px;
  border: 2px solid #000;
  background: #fff;
  box-shadow: 3px 3px 0px 0px #000;

  padding: 12px 18px;

  * {
    font-family: 'Nunito' !important;
  }
`

const SpaceBetween = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`
const Description = styled.div``

const Logo = styled.img`
  max-height: 40px;
`

const Link = styled.div`
  a {
    color: blue;
  }
`

const Tag = styled.div`
  background: #18ca26c4;
  border: 2px solid #000;
  box-shadow: 3px 3px 0px 0px #000;
  border-radius: 4px;
  color: #fff;
  padding: 0px 4px;
`

enum SupportBridge {
  ALL = 'ALL',
}

const EXTERNAL_INFO = [
  {
    name: 'Orbiter Finance',
    logoUrl:
      'https://www.gitbook.com/cdn-cgi/image/width=40,dpr=2,height=40,fit=contain,format=auto/https%3A%2F%2F1317143014-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-legacy-files%2Fo%2Fspaces%252F-MY5Qy9GjDHXTy9ppyql%252Favatar-1619445507715.png%3Fgeneration%3D1619445507918680%26alt%3Dmedia',
    url: 'https://www.orbiter.finance/',
    description:
      'Orbiter Finance is a decentralized cross-rollup bridge which offers low cost and almost instant transfers.',
    supports: SupportBridge.ALL,
    tag: 'Cheap',
  },
  {
    name: 'Base Official Bridge',
    logoUrl: 'https://docs.base.org/img/logo.svg',
    url: 'https://bridge.base.org/deposit',
    description: 'Easily transfer funds between Ethereum Mainnet and Base Network',
    supports: [SupportedChainId.BASE_TESTNET, SupportedChainId.BASE_MAINNET],
    tag: 'Official',
  },
  {
    name: 'Stargate Finance',
    logoUrl:
      'https://publicdocs.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fe2eca322-5ee2-457f-a9d3-abfc9df0bec2%2FSTG_Token_400.png?table=block&id=664f7791-237a-4192-864c-8b782a506537&spaceId=c681a46c-dbda-4853-b36e-c19abcbf93e6&width=250&userId=&cache=v2',
    url: 'https://stargate.finance/transfer',
    description:
      'Stargate is a community-driven organization building the first fully composable native asset bridge, and the first dApp built on LayerZero.',
    supports: SupportBridge.ALL,
    tag: 'Similar',
  },
  {
    name: 'rhino.fi',
    logoUrl: 'https://app.rhino.fi/static/media/logo-light.f5b7918c35840b264a94e4e2146a1157.svg',
    url: 'https://app.rhino.fi/bridge',
    description:
      'Rhino.fi is the multichain DeFi aggregator that helps you effortlessly explore the best opportunities.',
    supports: SupportBridge.ALL,
    tag: 'Cheap',
  },
]

export const ExternalBridge = () => {
  return (
    <>
      <AboutBox>
        <NunitoText weight={500} size="lg2">
          Enjoy seamless cross-chain bridge that supports Layer 2 EVM Compatible with fast and cheaper transactions.
        </NunitoText>

        <a href="https://ethereum.org/en/bridges/" target="_blank" rel="noreferrer">
          <NunitoText>What are bridges?</NunitoText>
        </a>

        <NunitoText size="xxl" weight={600}>
          Choose a bridge
        </NunitoText>
      </AboutBox>
      <FlexRoot>
        <FlexRow>
          {EXTERNAL_INFO.map((i) => (
            <FlexCell key={`derpdex-${i.name}`}>
              <SpaceBetween>
                <NunitoText size="lg2" weight={600}>
                  {i.name}
                </NunitoText>
                <Logo alt={`derpdex-${i.name}`} src={i.logoUrl} />
              </SpaceBetween>
              <Description>{i.description}</Description>
              <SpaceBetween>
                <Link>
                  <a href={i.url} target="_blank" rel="noreferrer">
                    Link ↗
                  </a>
                </Link>
                <Tag>{i.tag}</Tag>
              </SpaceBetween>
            </FlexCell>
          ))}
        </FlexRow>
      </FlexRoot>
    </>
  )
}
