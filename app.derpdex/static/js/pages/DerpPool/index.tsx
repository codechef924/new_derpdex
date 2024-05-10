import { Trans } from '@lingui/macro'
import { Trace } from '@uniswap/analytics'
import { GloriaText } from 'components/CustomFonts/GloriaHallelujah'
import { NunitoText } from 'components/CustomFonts/Nunito'
import styled from 'styled-components/macro'

import { MAX_WIDTH_MEDIA_BREAKPOINT, MEDIUM_MEDIA_BREAKPOINT } from './constant'
import GenesisNetworkFilter from './GenesisNetworkFilter'
import PoolTable from './PoolTable/PoolTable'
import { RocketDerp } from './RocketDerp'

const PageWrapper = styled.div`
  padding: 68px 12px 68px;
  width: 100%;
  z-index: 1;

  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    padding-top: 48px;
  }

  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.sm}px`}) {
    padding-top: 70px;
    padding-bottom: 70px;
  }
`

const FlexContainerBetween = styled.div`
  max-width: ${MAX_WIDTH_MEDIA_BREAKPOINT};
  margin-left: auto;
  margin-right: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  flex-direction: column;
  gap: 8px;
`

const TitleContainerBase = styled.div`
  display: flex;
  font-size: 32px !important;
  @media only screen and (max-width: 768px) {
    font-size: 16px !important;
  }
`

const Title = styled(GloriaText)`
  background: var(--primary-gradient-lr, linear-gradient(270deg, #46c9d2 0%, #a372ff 100%));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 45px;
`

const SubTitleContainerBase = styled.div`
  display: flex;
  font-size: 20px !important;
  text-align: center;
  @media only screen and (max-width: 768px) {
    font-size: 16px !important;
  }
`

const SubTitle = styled(NunitoText)`
  color: #ffffff;
  font-size: 20px !important;
`

const FiltersWrapperBase = styled.div`
  display: flex;
  color: ${({ theme }) => theme.textTertiary};
  flex-direction: row;
  margin-top: 20px;
  width: 100%;
  justify-content: flex-end;

  @media only screen and (max-width: ${MEDIUM_MEDIA_BREAKPOINT}) {
    flex-direction: column;
    gap: 8px;
    width: 100%;
    height: auto;
  }
`
const DerpFiltersContainer = styled.div`
  display: flex;
  gap: 8px;
  height: auto;

  @media only screen and (max-width: ${MEDIUM_MEDIA_BREAKPOINT}) {
    order: 2;
  }
`
export default function DerpPool() {
  return (
    <Trace page="derp-pools" shouldLogImpression>
      <PageWrapper>
        <FlexContainerBetween>
          <TitleContainerBase>
            <Trans>
              <Title>DERP TGE Pools</Title>
            </Trans>
          </TitleContainerBase>
          <SubTitleContainerBase>
            <Trans>
              <SubTitle>
                DERP TGE Pools is to incentivize liquidity providers on nominated $DERP LP pairs in $DERP TGE Launch
                Campaign. <br /> <br />{' '}
                <b
                  style={{
                    margin: 'auto',
                    display: 'block',
                    textAlign: 'center',
                  }}
                >
                  Earn up to $170,000 airdrop allocation. No lock, withdraw anytime!
                </b>
              </SubTitle>
            </Trans>
          </SubTitleContainerBase>
          <FiltersWrapperBase>
            <DerpFiltersContainer>
              <GenesisNetworkFilter />
            </DerpFiltersContainer>
          </FiltersWrapperBase>
        </FlexContainerBetween>
        <PoolTable />
      </PageWrapper>
      <RocketDerp />
    </Trace>
  )
}
