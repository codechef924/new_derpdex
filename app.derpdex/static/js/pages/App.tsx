import { getDeviceId, sendAnalyticsEvent, Trace, user } from '@uniswap/analytics'
import { CustomUserProperties, getBrowser, InterfacePageName, SharedEventName } from '@uniswap/analytics-events'
import { useWeb3React } from '@web3-react/core'
import Loader from 'components/Icons/LoadingSpinner'
import DerpNavbarV2 from 'components/NavBar/DerpNavBarV2'
import TopLevelModals from 'components/TopLevelModals'
import { WrongNetworkModal } from 'components/WrongNetworkModal'
import { useFeatureFlagsIsLoaded } from 'featureFlags'
import ApeModeQueryParamReader from 'hooks/useApeModeQueryParamReader'
import { useAtom } from 'jotai'
import { useBag } from 'nft/hooks/useBag'
import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useSearchParams } from 'react-router-dom'
import { shouldDisableNFTRoutesAtom } from 'state/application/atoms'
import { RefreshJotai } from 'state/jotailState/RefreshJotai'
import { StatsigProvider, StatsigUser } from 'statsig-react'
import styled from 'styled-components/macro'
import { SpinnerSVG } from 'theme/components'
import { useIsDarkMode } from 'theme/components/ThemeToggle'
import { flexRowNoWrap } from 'theme/styles'
import { Z_INDEX } from 'theme/zIndex'
import { STATSIG_DUMMY_KEY } from 'tracing'
import { getEnvName } from 'utils/env'
import { getCLS, getFCP, getFID, getLCP, Metric } from 'web-vitals'

import { useAnalyticsReporter } from '../components/analytics'
import ErrorBoundary from '../components/ErrorBoundary'
import { PageTabs } from '../components/NavBar'
// eslint-disable-next-line unused-imports/no-unused-imports
import NavBar from '../components/NavBar'
import Polling from '../components/Polling'
import Popups from '../components/Popups'
import { useIsExpertMode } from '../state/user/hooks'
import DarkModeQueryParamReader from '../theme/components/DarkModeQueryParamReader'
import AddLiquidity from './AddLiquidity'
import { RedirectDuplicateTokenIds } from './AddLiquidity/redirects'
import { RedirectDuplicateTokenIdsV2 } from './AddLiquidityV2/redirects'
import Airdrop from './Airdrop'
import { AirdropEnded } from './Airdrop/Ended'
import { AirdropPhase2 } from './Airdrop/Phase2'
import { Bridge } from './Bridge'
import { BridgeInscription } from './BridgeInscription'
import { Carousel } from './Carousel'
import { Cultivate } from './Cultivate'
import { DerpBridge } from './DerpBridge'
import DerpPool from './DerpPool'
import DerpPoolDetails from './DerpPoolDetails'
import DerpSwap from './DerpSwap'
import GenesisPool from './GenesisPool'
import GenesisPoolDetails from './GenesisPoolDetails'
import GenesisPoolDetailsV2 from './GenesisPoolDetailsV2'
import GenesisPoolV2 from './GenesisPoolV2'
import DERPIDO from './IDO'
import Launchpad from './Launcpad'
import Leaderboard from './Leaderboard'
import { LoyaltyProgram } from './LoyaltyProgram'
import MigrateV2 from './MigrateV2'
import MigrateV2Pair from './MigrateV2/MigrateV2Pair'
import NotFound from './NotFound'
import Pool from './Pool'
import PositionPage from './Pool/PositionPage'
import PoolV2 from './Pool/v2'
import PoolFinder from './PoolFinder'
import RemoveLiquidity from './RemoveLiquidity'
import RemoveLiquidityV3 from './RemoveLiquidity/V3'
import Swap from './Swap'
import { RedirectPathToSwapOnly } from './Swap/redirects'
import Tokens from './Tokens'
import WormholeBridgePage from './WormholeBridge'
import { XDERP } from './xDERP'
import { ZapToEarn } from './ZapToEarn'

const TokenDetails = lazy(() => import('./TokenDetails'))
const DerpTokenDetails = lazy(() => import('./DerpTokenDetails'))
const Vote = lazy(() => import('./Vote'))
const NftExplore = lazy(() => import('nft/pages/explore'))
const Collection = lazy(() => import('nft/pages/collection'))
const Profile = lazy(() => import('nft/pages/profile/profile'))
const Asset = lazy(() => import('nft/pages/asset/Asset'))

type MarginAdjustable = {
  isTestsite?: boolean
}
const BodyWrapper = styled.div<MarginAdjustable>`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  padding: ${({ theme }) => theme.navHeight}px 0px 0rem 0px;
  @media only screen and (max-width: 768px) {
    padding: 0;
  }
  align-items: center;
  flex: 1;

  ${({ isTestsite }) => {
    if (!isTestsite) {
      return `
      @media only screen and (min-width: 768px) {
        margin-top: 49px;
      }
      @media only screen and (max-width: 768px) {
        margin-top: 134px;
      }
      `
    } else {
      return `
        @media only screen and (max-width: 768px) {
          margin-top: 34px;
        }
      `
    }
  }}
`

const MobileBottomBar = styled.div`
  z-index: ${Z_INDEX.sticky};
  position: fixed;
  display: flex;
  bottom: 0;
  right: 0;
  left: 0;
  width: 100vw;
  justify-content: space-between;
  padding: 0px 8px 4px 8px;
  background: ${({ theme }) => theme.backgroundSurface};
  border-top: 1px solid ${({ theme }) => theme.backgroundOutline};

  @media screen and (min-width: ${({ theme }) => theme.breakpoint.md}px) {
    display: none;
  }
  ::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 2px;
    width: 100%;
    background: #afbdc8;
  }
`

const HeaderWrapper = styled.div<{ transparent?: boolean }>`
  ${flexRowNoWrap};
  background-color: ${({ theme, transparent }) => !transparent && theme.backgroundSurface};
  border-bottom: ${({ theme, transparent }) => !transparent && `1px solid ${theme.backgroundOutline}`};
  width: 100%;
  justify-content: space-between;
  position: fixed;
  top: 0;
  z-index: ${Z_INDEX.dropdown};
`

const DerpHeaderWrapper = styled.div<{ transparent?: boolean }>`
  ${flexRowNoWrap};
  flex-direction: column;
  justify-content: end;
  // max-height: 80px;
  // height: 80px;
  background-color: ${({ theme, transparent }) => theme.white};
  border-bottom: 2px solid #000;
  width: 100%;
  position: fixed;
  top: 0;
  z-index: ${Z_INDEX.dropdown};

  @media screen and (max-width: 768px) {
    height: auto;
  }
`
const DummyDiv = styled.div<{ isBackToTop?: boolean }>`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0px ${({ isBackToTop }) => (isBackToTop ? `97px` : `0px`)};
`

const StraightLine80 = styled.div<{ isBackToTop?: boolean }>`
  width: 100%;
  min-width: 1200px;
  height: 1px;
  background-color: ${({ theme }) => `${theme.derpTabBottomLine}`};
  // border-bottom: ${({ theme, isBackToTop }) => !isBackToTop && `1px solid ${theme.derpTabBottomLine}`};
`

const WarningWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`

const WarningBanner = styled.div`
  background-color: ${({ theme }) => theme.black};
  padding: 1rem;
  color: white;
  font-size: 14px;
  width: 100%;
  text-align: center;
  font-weight: 500;
`

function getCurrentPageFromLocation(locationPathname: string): InterfacePageName | undefined {
  switch (true) {
    case locationPathname.startsWith('/swap'):
      return InterfacePageName.SWAP_PAGE
    case locationPathname.startsWith('/vote'):
      return InterfacePageName.VOTE_PAGE
    case locationPathname.startsWith('/pools'):
    case locationPathname.startsWith('/pool'):
      return InterfacePageName.POOL_PAGE
    case locationPathname.startsWith('/tokens'):
      return InterfacePageName.TOKENS_PAGE
    case locationPathname.startsWith('/nfts/profile'):
      return InterfacePageName.NFT_PROFILE_PAGE
    case locationPathname.startsWith('/nfts/asset'):
      return InterfacePageName.NFT_DETAILS_PAGE
    case locationPathname.startsWith('/nfts/collection'):
      return InterfacePageName.NFT_COLLECTION_PAGE
    case locationPathname.startsWith('/nfts'):
      return InterfacePageName.NFT_EXPLORE_PAGE
    default:
      return undefined
  }
}

// this is the same svg defined in assets/images/blue-loader.svg
// it is defined here because the remote asset may not have had time to load when this file is executing
const LazyLoadSpinner = () => (
  <SpinnerSVG width="94" height="94" viewBox="0 0 94 94" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M92 47C92 22.1472 71.8528 2 47 2C22.1472 2 2 22.1472 2 47C2 71.8528 22.1472 92 47 92"
      stroke="#2172E5"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SpinnerSVG>
)

export default function App() {
  const isLoaded = useFeatureFlagsIsLoaded()
  const [shouldDisableNFTRoutes, setShouldDisableNFTRoutes] = useAtom(shouldDisableNFTRoutesAtom)

  const { pathname } = useLocation()
  const currentPage = getCurrentPageFromLocation(pathname)
  const isDarkMode = useIsDarkMode()
  const isExpertMode = useIsExpertMode()
  const [scrolledState, setScrolledState] = useState(false)

  useAnalyticsReporter()

  useEffect(() => {
    window.scrollTo(0, 0)
    setScrolledState(false)
  }, [pathname])

  const [searchParams] = useSearchParams()
  useEffect(() => {
    // if (searchParams.get('disableNFTs') === 'true') {
    //   setShouldDisableNFTRoutes(true)
    // } else if (searchParams.get('disableNFTs') === 'false') {
    //   setShouldDisableNFTRoutes(false)
    // }
    setShouldDisableNFTRoutes(true) // Disable NFTs for now
  }, [searchParams, setShouldDisableNFTRoutes])

  useEffect(() => {
    // User properties *must* be set before sending corresponding event properties,
    // so that the event contains the correct and up-to-date user properties.
    user.set(CustomUserProperties.USER_AGENT, navigator.userAgent)
    user.set(CustomUserProperties.BROWSER, getBrowser())
    user.set(CustomUserProperties.SCREEN_RESOLUTION_HEIGHT, window.screen.height)
    user.set(CustomUserProperties.SCREEN_RESOLUTION_WIDTH, window.screen.width)

    sendAnalyticsEvent(SharedEventName.APP_LOADED)
    getCLS(({ delta }: Metric) => sendAnalyticsEvent(SharedEventName.WEB_VITALS, { cumulative_layout_shift: delta }))
    getFCP(({ delta }: Metric) => sendAnalyticsEvent(SharedEventName.WEB_VITALS, { first_contentful_paint_ms: delta }))
    getFID(({ delta }: Metric) => sendAnalyticsEvent(SharedEventName.WEB_VITALS, { first_input_delay_ms: delta }))
    getLCP(({ delta }: Metric) =>
      sendAnalyticsEvent(SharedEventName.WEB_VITALS, { largest_contentful_paint_ms: delta })
    )
  }, [])

  useEffect(() => {
    user.set(CustomUserProperties.DARK_MODE, isDarkMode)
  }, [isDarkMode])

  useEffect(() => {
    user.set(CustomUserProperties.EXPERT_MODE, isExpertMode)
  }, [isExpertMode])

  useEffect(() => {
    const scrollListener = () => {
      setScrolledState(window.scrollY > 0)
    }
    window.addEventListener('scroll', scrollListener)
    return () => window.removeEventListener('scroll', scrollListener)
  }, [])

  const isBagExpanded = useBag((state) => state.bagExpanded)
  const isHeaderTransparent = !scrolledState && !isBagExpanded

  const { account } = useWeb3React()
  const statsigUser: StatsigUser = useMemo(
    () => ({
      userID: getDeviceId(),
      customIDs: { address: account ?? '' },
    }),
    [account]
  )

  return (
    <ErrorBoundary>
      <DarkModeQueryParamReader />
      <ApeModeQueryParamReader />
      <Trace page={currentPage}>
        <StatsigProvider
          user={statsigUser}
          // TODO: replace with proxy and cycle key
          sdkKey={STATSIG_DUMMY_KEY}
          waitForInitialization={false}
          options={{
            environment: { tier: getEnvName() },
            api: process.env.REACT_APP_STATSIG_PROXY_URL,
          }}
        >
          <WrongNetworkModal />
          <DerpHeaderWrapper transparent={isHeaderTransparent}>
            {process.env.REACT_APP_IS_TESTSITE === 'false' && (
              <WarningWrapper>
                <WarningBanner>
                  Please check the correct URL{' '}
                  <a
                    style={{
                      color: '#46c9d2',
                    }}
                    href="https://derpdex.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    https://derpdex.com/
                  </a>{' '}
                  and DerpDEX is in beta; use it at your own risk. Always do your own research before trading (DYOR) as
                  tokens are potentially risky and highly volatile.
                </WarningBanner>
              </WarningWrapper>
            )}
            <DerpNavbarV2 blur={isHeaderTransparent} />
          </DerpHeaderWrapper>
          <BodyWrapper isTestsite={process.env.REACT_APP_IS_TESTSITE === 'false' ? false : true}>
            <Popups />
            <Polling />
            <TopLevelModals />
            <Suspense fallback={<Loader />}>
              {isLoaded ? (
                <Routes>
                  <Route path="/" element={<Swap />} />

                  <Route path="tokens" element={<Tokens />}>
                    <Route path=":chainName" />
                  </Route>
                  {/* <Route path="tokens/:chainName/:tokenAddress" element={<TokenDetails />} /> */}
                  <Route
                    path="vote/*"
                    element={
                      <Suspense fallback={<LazyLoadSpinner />}>
                        <Vote />
                      </Suspense>
                    }
                  />
                  <Route path="create-proposal" element={<Navigate to="/vote/create-proposal" replace />} />
                  <Route path="send" element={<RedirectPathToSwapOnly />} />
                  {/* Original Uni-V3 swap route */}
                  <Route path="swap" element={<Swap />} />
                  <Route path="token" element={<DerpSwap />} />
                  <Route path="token/:chainName/:tokenAddress" element={<DerpSwap />} />
                  <Route path="test/:chainName/:tokenAddress" element={<DerpTokenDetails />} />

                  <Route path="pool/v2/find" element={<PoolFinder />} />
                  <Route path="pool/v2" element={<PoolV2 />} />
                  <Route path="pool" element={<Pool />} />
                  <Route path="pool/:tokenId" element={<PositionPage />} />

                  <Route path="pools/v2/find" element={<PoolFinder />} />
                  <Route path="pools/v2" element={<PoolV2 />} />
                  <Route path="pools" element={<Pool />} />
                  <Route path="pools/:tokenId" element={<PositionPage />} />

                  <Route path="add/v2" element={<RedirectDuplicateTokenIdsV2 />}>
                    <Route path=":currencyIdA" />
                    <Route path=":currencyIdA/:currencyIdB" />
                  </Route>
                  <Route path="add" element={<RedirectDuplicateTokenIds />}>
                    {/* this is workaround since react-router-dom v6 doesn't support optional parameters any more */}
                    <Route path=":currencyIdA" />
                    <Route path=":currencyIdA/:currencyIdB" />
                    <Route path=":currencyIdA/:currencyIdB/:feeAmount" />
                  </Route>

                  <Route path="bridge" element={<Bridge />} />
                  <Route path="inscriptions-bridge" element={<BridgeInscription />} />

                  <Route path="add2" element={<RedirectDuplicateTokenIds />}>
                    {/* this is workaround since react-router-dom v6 doesn't support optional parameters any more */}
                    <Route path=":currencyIdA" />
                    <Route path=":currencyIdA/:currencyIdB" />
                    <Route path=":currencyIdA/:currencyIdB/:feeAmount" />
                  </Route>

                  <Route path="increase" element={<AddLiquidity />}>
                    <Route path=":currencyIdA" />
                    <Route path=":currencyIdA/:currencyIdB" />
                    <Route path=":currencyIdA/:currencyIdB/:feeAmount" />
                  </Route>
                  <Route path="increase/:currencyIdA/:currencyIdB/:feeAmount/:tokenId" element={<AddLiquidity />} />

                  <Route path="remove/v2/:currencyIdA/:currencyIdB" element={<RemoveLiquidity />} />
                  <Route path="remove/:tokenId" element={<RemoveLiquidityV3 />} />

                  <Route path="migrate/v2" element={<MigrateV2 />} />
                  <Route path="migrate/v2/:address" element={<MigrateV2Pair />} />

                  <Route path="genesis-pools" element={<GenesisPool />} />
                  <Route path="genesis-pools/:chainName" element={<GenesisPool />} />
                  <Route path="genesis-pools/:chainName/:poolID" element={<GenesisPoolDetails />} />
                  <Route path="extended-genesis-pools" element={<GenesisPoolV2 />} />
                  <Route path="extended-genesis-pools/:chainName" element={<GenesisPoolV2 />} />
                  <Route path="extended-genesis-pools/:chainName/:poolID" element={<GenesisPoolDetailsV2 />} />
                  <Route path="derp-pools" element={<DerpPool />} />
                  <Route path="derp-pools/:chainName" element={<DerpPool />} />
                  <Route path="derp-pools/:chainName/:poolID" element={<DerpPoolDetails />} />

                  <Route path="zap-to-earn" element={<ZapToEarn hideLockLPT={true} />} />
                  <Route path="leaderboard" element={<Leaderboard />} />
                  <Route path="wormhole-bridge" element={<WormholeBridgePage />} />
                  <Route path="xderp" element={<XDERP />} />
                  <Route path="yield-farming" element={<Cultivate />}>
                    <Route path=":chainName" />
                  </Route>

                  <Route path="loyalty-program" element={<LoyaltyProgram />}>
                    <Route path=":category" />
                  </Route>

                  <Route path="launchpad" element={<Launchpad isTestMode={false} />} />
                  <Route path="launchpad/test-mode" element={<Launchpad isTestMode={true} />} />

                  <Route path="ido-claim" element={<DERPIDO />} />

                  <Route path="airdrop" element={<Airdrop />} />
                  <Route path="airdrop/phase-2" element={<AirdropPhase2 />} />
                  <Route path="airdrop/ended" element={<AirdropEnded />} />

                  <Route path="derp-bridge" element={<DerpBridge />} />

                  {!shouldDisableNFTRoutes && (
                    <>
                      <Route
                        path="/nfts"
                        element={
                          <Suspense fallback={null}>
                            <NftExplore />
                          </Suspense>
                        }
                      />

                      <Route
                        path="/nfts/asset/:contractAddress/:tokenId"
                        element={
                          <Suspense fallback={null}>
                            <Asset />
                          </Suspense>
                        }
                      />

                      <Route
                        path="/nfts/profile"
                        element={
                          <Suspense fallback={null}>
                            <Profile />
                          </Suspense>
                        }
                      />

                      <Route
                        path="/nfts/collection/:contractAddress"
                        element={
                          <Suspense fallback={null}>
                            <Collection />
                          </Suspense>
                        }
                      />

                      <Route
                        path="/nfts/collection/:contractAddress/activity"
                        element={
                          <Suspense fallback={null}>
                            <Collection />
                          </Suspense>
                        }
                      />
                    </>
                  )}

                  <Route path="*" element={<Navigate to="/not-found" replace />} />
                  <Route path="/not-found" element={<NotFound />} />
                </Routes>
              ) : (
                <Loader />
              )}
            </Suspense>{' '}
            <Carousel />
            <RefreshJotai />
          </BodyWrapper>
          <MobileBottomBar>
            <PageTabs />
          </MobileBottomBar>
        </StatsigProvider>
      </Trace>
    </ErrorBoundary>
  )
}
