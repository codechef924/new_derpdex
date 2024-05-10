import { Trans } from '@lingui/macro'
import { Trace, TraceEvent } from '@uniswap/analytics'
import { BrowserEvent, InterfaceElementName, InterfaceEventName, InterfacePageName } from '@uniswap/analytics-events'
import { useWeb3React } from '@web3-react/core'
import { useToggleAccountDrawer } from 'components/AccountDrawer'
import { ButtonGray, ButtonPrimary, ButtonText } from 'components/Button'
import { AutoColumn } from 'components/Column'
import { GloriaText } from 'components/CustomFonts/GloriaHallelujah'
import { Menu } from 'components/Menu'
import PoolList from 'components/PoolList'
import PositionList from 'components/PositionList'
import { RowFixed } from 'components/Row'
import { SwitchLocaleLink } from 'components/SwitchLocaleLink'
import { Tab } from 'components/Tab'
import { isSupportedChain, SupportedChainId } from 'constants/chains'
import { useFilterPossiblyMaliciousPositions } from 'hooks/useFilterPossiblyMaliciousPositions'
import { useV3Positions } from 'hooks/useV3Positions'
import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, BookOpen, ChevronsRight, Inbox, Layers } from 'react-feather'
import { Link, useNavigate } from 'react-router-dom'
import { useUserHideClosedPositions } from 'state/user/hooks'
import styled, { css, useTheme } from 'styled-components/macro'
import { ThemedText } from 'theme'
import { PositionDetails } from 'types/position'

import { V2_FACTORY_ADDRESSES } from '../../constants/addresses'
import { LoadingRows } from './styleds'

const PageWrapper = styled(AutoColumn)`
  padding: 68px 8px 68px;
  max-width: 1199px;
  width: 100%;
  z-index: 1;

  ${({ theme }) => theme.deprecated_mediaWidth.deprecated_upToMedium`
    max-width: 800px;
  `};

  ${({ theme }) => theme.deprecated_mediaWidth.deprecated_upToSmall`
    max-width: 500px;
  `};

  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    padding-top: 48px;
  }

  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.sm}px`}) {
    padding-top: 70px;
    padding-bottom: 70px;
  }
`
const TitleRowGridTop = styled.div`
  color: ${({ theme }) => theme.textSecondary};
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  .empty-grid {
    content: '';
  }
  .centered-grid {
    display: flex;
    justify-content: center;
    align-items: center;

    @media only screen and (max-width: 768px) {
      width: 100%;

      #tab-root {
        width: 100%;

        #tab-item {
          width: 50%;
        }
      }
    }
  }
  .right-aligned-grid {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;

    @media only screen and (max-width: 768px) {
      order: 1;
    }
  }

  @media only screen and (max-width: 768px) {
    flex-direction: column;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`

const TitleRow = styled.div`
  // color: ${({ theme }) => theme.textSecondary};
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  .empty-grid {
    content: '';
  }
  .centered-grid {
    display: flex;
    justify-content: center;
    align-items: center;

    @media only screen and (max-width: 768px) {
      width: 100%;

      #tab-root {
        width: 100%;

        #tab-item {
          width: 50%;
        }
      }
    }
  }
  .right-aligned-grid {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;

    gap: 32px;

    @media only screen and (max-width: 768px) {
      order: 1;
      display: grid;
      grid-template-columns: 1fr 1fr;
      .text-title {
        line-height: 40px;
        font-size: 12px;
      }
    }
  }

  @media only screen and (max-width: 768px) {
    flex-direction: column;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`
const ButtonRow = styled(RowFixed)`
  & > *:not(:last-child) {
    margin-left: 8px;
  }

  ${({ theme }) => theme.deprecated_mediaWidth.deprecated_upToSmall`
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    flex-direction: row-reverse;
  `};
`
const PoolMenu = styled(Menu)`
  margin-left: 0;
  ${({ theme }) => theme.deprecated_mediaWidth.deprecated_upToSmall`
    flex: 1 1 auto;
    width: 49%;
    right: 0px;
  `};

  a {
    width: 100%;
  }
`
const PoolMenuItem = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-weight: 500;
`
const MoreOptionsButton = styled(ButtonGray)`
  border-radius: 12px;
  flex: 1 1 auto;
  padding: 6px 8px;
  width: 100%;
  background-color: ${({ theme }) => theme.backgroundSurface};
  margin-right: 8px;
`

const MoreOptionsText = styled(ThemedText.DeprecatedBody)`
  align-items: center;
  display: flex;
`

const ErrorContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: auto;
  // max-width: 300px;
  min-height: 25vh;
  width: 100%;

  border-radius: 24px;
  border: 4px solid #000;
  background: #fff;
  box-shadow: 3px 3px 0px 0px #000;
`

const IconStyle = css`
  width: 48px;
  height: 48px;
  margin-bottom: 0.5rem;
`

const NetworkIcon = styled(AlertTriangle)`
  ${IconStyle}
`

const InboxIcon = styled(Inbox)`
  ${IconStyle}
`

const ResponsiveButtonPrimary = styled(ButtonPrimary)`
  border-radius: 12px;
  font-size: 16px;
  padding: 6px 8px;
  width: fit-content;
  ${({ theme }) => theme.deprecated_mediaWidth.deprecated_upToSmall`
    flex: 1 1 auto;
    width: 100%;
  `};
`
const DDResponsiveButtonPrimary = styled.div`
  align-items: center;
  padding: 13px 25px;
  background: linear-gradient(135deg, #a372ff 0%, #46c9d2 95.1%);
  border: 0.15em solid #344d73;
  border-radius: 8px;
  font-size: 20px;
  font-weight: 600;
  line-height: 24px;
  text-decoration: none;

  color: ${({ theme }) => theme.white};

  @media only screen and (max-width: 768px) {
    padding: 13px 0px;
    font-size: 16px;
    flex-direction: column;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
`

const DDButtonWalletConnect = styled.div`
  align-items: center;
  padding: 13px 25px;
  background: linear-gradient(135deg, #a372ff 0%, #46c9d2 95.1%);

  font-size: 20px;
  font-weight: 600;
  line-height: 24px;
  text-decoration: none;

  border-radius: 16px;
  border: 2px solid #000;
  box-shadow: 3px 3px 0px 0px #000;

  color: ${({ theme }) => theme.white};
  cursor: pointer;
`

const MainContentWrapper = styled.main`
  // background-color: ${({ theme }) => theme.backgroundSurface};
  // border: 2px solid ${({ theme }) => theme.derpBorderColorV1};
  padding: 0;
  // border-radius: 8px;
  display: flex;
  flex-direction: column;
  // box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
  //   0px 24px 32px rgba(0, 0, 0, 0.01);

  gap: 12px;
`

const NativePath = (chainId: number) => {
  if (chainId === SupportedChainId.OPBNB_MAINNET || chainId === SupportedChainId.OPBNB_TESTNET) {
    return 'BNB'
  } else {
    return 'ETH'
  }
}

function PositionsLoadingPlaceholder() {
  return (
    <LoadingRows>
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
    </LoadingRows>
  )
}

function WrongNetworkCard() {
  const theme = useTheme()

  return (
    <>
      <PageWrapper>
        <AutoColumn gap="lg" justify="center">
          <AutoColumn gap="lg" style={{ width: '100%' }}>
            <TitleRow>
              <ThemedText.LargeHeader>
                <Trans>Pools</Trans>
              </ThemedText.LargeHeader>
            </TitleRow>

            <MainContentWrapper>
              <ErrorContainer>
                <ThemedText.DeprecatedBody color={theme.textTertiary} textAlign="center">
                  <NetworkIcon strokeWidth={1.2} />
                  <div data-testid="pools-unsupported-err">
                    <Trans>Your connected network is unsupported.</Trans>
                  </div>
                </ThemedText.DeprecatedBody>
              </ErrorContainer>
            </MainContentWrapper>
          </AutoColumn>
        </AutoColumn>
      </PageWrapper>
      <SwitchLocaleLink />
    </>
  )
}

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <div>{children}</div>}
    </div>
  )
}

export default function Pool() {
  const [currentTab, setCurrentTab] = useState<string>('Pools')
  const navigate = useNavigate()

  useEffect(() => {
    if (currentTab == 'My Pool') {
      navigate('/pools')
    }

    if (window.location.href.search('/pools#myPools') > -1) {
      setCurrentTab('My Pool')
    }
  }, [currentTab, navigate])

  const { account, chainId } = useWeb3React()
  const resolveNativeToken = useMemo(() => {
    if (chainId) {
      return NativePath(chainId)
    } else {
      return 'ETH'
    }
  }, [chainId])
  const toggleWalletDrawer = useToggleAccountDrawer()

  const theme = useTheme()
  const [userHideClosedPositions, setUserHideClosedPositions] = useUserHideClosedPositions()

  const { positions, loading: positionsLoading } = useV3Positions(account)

  const [openPositions, closedPositions] = positions?.reduce<[PositionDetails[], PositionDetails[]]>(
    (acc, p) => {
      acc[p.liquidity?.isZero() ? 1 : 0].push(p)
      return acc
    },
    [[], []]
  ) ?? [[], []]

  const userSelectedPositionSet = useMemo(
    () => [...openPositions, ...(userHideClosedPositions ? [] : closedPositions)],
    [closedPositions, openPositions, userHideClosedPositions]
  )

  const filteredPositions = useFilterPossiblyMaliciousPositions(userSelectedPositionSet)

  if (!isSupportedChain(chainId)) {
    return <WrongNetworkCard />
  }

  const showConnectAWallet = Boolean(!account)
  const showV2Features = Boolean(V2_FACTORY_ADDRESSES[chainId])

  const menuItems = [
    {
      content: (
        <PoolMenuItem>
          <Trans>Migrate</Trans>
          <ChevronsRight size={16} />
        </PoolMenuItem>
      ),
      link: '/migrate/v2',
      external: false,
    },
    {
      content: (
        <PoolMenuItem>
          <Trans>V2 liquidity</Trans>
          <Layers size={16} />
        </PoolMenuItem>
      ),
      link: '/pools/v2',
      external: false,
    },
    {
      content: (
        <PoolMenuItem>
          <Trans>Learn</Trans>
          <BookOpen size={16} />
        </PoolMenuItem>
      ),
      link: 'https://support.uniswap.org/hc/en-us/categories/8122334631437-Providing-Liquidity-',
      external: true,
    },
  ]

  return (
    <Trace page={InterfacePageName.POOL_PAGE} shouldLogImpression>
      <PageWrapper>
        <AutoColumn gap="sm" justify="center">
          <AutoColumn gap="xs" style={{ width: '100%' }}>
            <TitleRowGridTop id="as-top-tab-switcher">
              <div className="empty-grid grid-item "></div>
              <div className="centered-grid grid-item ">
                <Tab currentTab={currentTab} setCurrentTab={setCurrentTab}></Tab>
              </div>
              <div className="empty-grid grid-item "></div>
            </TitleRowGridTop>
            <TitleRow>
              <ButtonRow className="right-aligned-grid grid-item ">
                <div className="text-title">
                  <GloriaText size="large40" weight={700}>
                    {currentTab}
                  </GloriaText>
                </div>
                <DDResponsiveButtonPrimary
                  data-cy="join-pool-button"
                  id="join-pool-button"
                  as={Link}
                  to={`/add/${resolveNativeToken}`}
                >
                  <GloriaText>
                    + <Trans>New Position</Trans>
                  </GloriaText>
                </DDResponsiveButtonPrimary>
              </ButtonRow>
            </TitleRow>
            {currentTab === 'Pools' && <PoolList />}
            {currentTab === 'My Pool' && (
              <MainContentWrapper>
                {positionsLoading ? (
                  <PositionsLoadingPlaceholder />
                ) : filteredPositions && closedPositions && filteredPositions.length > 0 ? (
                  <PositionList
                    positions={filteredPositions}
                    setUserHideClosedPositions={setUserHideClosedPositions}
                    userHideClosedPositions={userHideClosedPositions}
                  />
                ) : (
                  <ErrorContainer>
                    <ThemedText.DeprecatedBody color={theme.textTertiary} textAlign="center">
                      <InboxIcon strokeWidth={1} style={{ marginTop: '2em' }} />
                      <GloriaText size="xxl" weight={700}>
                        <Trans>Your active dex liquidity positions will appear here.</Trans>
                      </GloriaText>
                    </ThemedText.DeprecatedBody>
                    {!showConnectAWallet && closedPositions.length > 0 && (
                      <ButtonText
                        style={{ marginTop: '.5rem' }}
                        onClick={() => setUserHideClosedPositions(!userHideClosedPositions)}
                      >
                        <Trans>Show closed positions</Trans>
                      </ButtonText>
                    )}
                    {showConnectAWallet && (
                      <TraceEvent
                        events={[BrowserEvent.onClick]}
                        name={InterfaceEventName.CONNECT_WALLET_BUTTON_CLICKED}
                        properties={{ received_swap_quote: false }}
                        element={InterfaceElementName.CONNECT_WALLET_BUTTON}
                      >
                        <DDButtonWalletConnect
                          style={{ marginTop: '2em', marginBottom: '2em' }}
                          // style={{ marginTop: '2em', marginBottom: '2em', padding: '8px 16px' }}
                          onClick={toggleWalletDrawer}
                        >
                          <GloriaText>
                            <Trans>Connect a wallet</Trans>
                          </GloriaText>
                        </DDButtonWalletConnect>
                      </TraceEvent>
                    )}
                  </ErrorContainer>
                )}
              </MainContentWrapper>
            )}
            {/* <HideSmall>
              <CTACards />
            </HideSmall> */}
          </AutoColumn>
        </AutoColumn>
      </PageWrapper>
      <SwitchLocaleLink />
    </Trace>
  )
}
