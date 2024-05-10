/* eslint-disable import/no-unused-modules */
import { Trace } from '@uniswap/analytics'

import { LaunchPadPanel } from './components/LaunchpadPanel'
import { SalesRowV2 } from './components/SalesRowV2'
import { ShowUnavailable } from './components/ShowUnavailable'
import { useGetLaunchPadCampaigns } from './hooks/useGetLaunchpadCampaigns'
import { ColFlex, ContentWrapper, MainPageWrapper, PageWrapper, StyledGloria, StyledGloria32, Text } from './stylings'

export default function Launchpad({ isTestMode }: { isTestMode: boolean }) {
  const { activeLaunchpadChains, staticDisplayLaunchpad, launchPadInfo, fetchState, mappedEvents } =
    useGetLaunchPadCampaigns()

  return (
    <Trace page="launchpad" shouldLogImpression>
      <MainPageWrapper>
        <PageWrapper>
          <ContentWrapper>
            <ColFlex gap={6} id="launchpad-header">
              <StyledGloria>Launchpad</StyledGloria>
              <Text size="lg2" weight={400}>
                Don’t Miss the Memetastic Wave: DERP IDO Launching on DerpDEX – Be Part of the Hype!
              </Text>
            </ColFlex>
            {launchPadInfo && !staticDisplayLaunchpad && (
              <LaunchPadPanel activeLaunchpadChains={activeLaunchpadChains} launchPadInfo={launchPadInfo} />
            )}
            {staticDisplayLaunchpad && (
              <LaunchPadPanel
                activeLaunchpadChains={activeLaunchpadChains}
                launchPadInfo={staticDisplayLaunchpad}
                isEnded={true}
              />
            )}

            {!launchPadInfo && !staticDisplayLaunchpad && (
              <ShowUnavailable activeLaunchpadChains={activeLaunchpadChains} />
            )}

            {/* {launchPadInfo && launchPadInfo.upcoming && launchPadInfo.upcoming.length > 0 && (
              <ColFlex margin="20px 0px 0px 0px" gap={6} id="past-sales-header">
                <StyledGloria32>Upcoming Sales Perks</StyledGloria32>
                {launchPadInfo.upcoming.map((_ps) => (
                  <SalesRow key={_ps.startTime} launchPadInfo={launchPadInfo} saleInfo={_ps}></SalesRow>
                ))}
              </ColFlex>
            )} */}

            {/* {launchPadInfo && launchPadInfo.pastSales && launchPadInfo.pastSales.length > 0 && (
              <ColFlex margin="20px 0px 0px 0px" gap={6} id="past-sales-header">
                <StyledGloria32>Past Sales Perks</StyledGloria32>
                {launchPadInfo.pastSales.map((_ps) => (
                  <SalesRow key={_ps.startTime} launchPadInfo={launchPadInfo} saleInfo={_ps}></SalesRow>
                ))}
              </ColFlex>
            )} */}

            {mappedEvents && mappedEvents.ALL_UPCOMING && mappedEvents.ALL_UPCOMING.length > 0 && (
              <ColFlex margin="20px 0px 0px 0px" gap={6} id="past-sales-header">
                <StyledGloria32>Upcoming Sales Perks</StyledGloria32>
                {mappedEvents.ALL_UPCOMING.map((_me) => (
                  <SalesRowV2 key={_me.startTime} mappedEvent={_me}></SalesRowV2>
                ))}
              </ColFlex>
            )}

            {mappedEvents && mappedEvents.ALL_EXPIRED && mappedEvents.ALL_EXPIRED.length > 0 && (
              <ColFlex margin="20px 0px 0px 0px" gap={6} id="past-sales-header">
                <StyledGloria32>Past Sales Perks</StyledGloria32>
                {mappedEvents.ALL_EXPIRED.map((_me) => (
                  <SalesRowV2 key={_me.startTime} mappedEvent={_me}></SalesRowV2>
                ))}
              </ColFlex>
            )}
            {/* <AllocationFlex>
              <AllocationDetails>
                <ColFlex id="total-allocation">
                  <Text color="#AFBDC8">Total Allocation</Text>
                  <RowFlex>
                    <GradientText>320</GradientText>
                    <Text>xDERP</Text>
                  </RowFlex>
                </ColFlex>
                <ColFlex id="deallocation-cooldown">
                  <Text color="#AFBDC8">Deallocation cooldown</Text>
                  <RowFlex>
                    <GradientText>3</GradientText>
                    <Text>Days</Text>
                  </RowFlex>
                </ColFlex>
              </AllocationDetails>
            </AllocationFlex> */}
          </ContentWrapper>
        </PageWrapper>
      </MainPageWrapper>
    </Trace>
  )
}
