import '@fontsource/nunito' // Defaults to weight 400

import { Trans } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'
import { ReactComponent as CampaignIcon } from 'assets/svg/campaign-icon.svg'
import { NunitoText } from 'components/CustomFonts/Nunito'
import Web3Status from 'components/Web3Status'
import { chainIdToBackendName } from 'graphql/data/util'
import { useIsBridgePage } from 'hooks/useIsBridgePage'
import { useIsNftPage } from 'hooks/useIsNftPage'
import { useIsPoolsPage } from 'hooks/useIsPoolsPage'
import { useAtomValue } from 'jotai/utils'
import { Box } from 'nft/components/Box'
import { Row } from 'nft/components/Flex'
import { UniIcon } from 'nft/components/icons'
import { useProfilePageState } from 'nft/hooks'
import { ProfilePageStateType } from 'nft/types'
import { ReactNode } from 'react'
import { NavLinkProps, useLocation, useNavigate } from 'react-router-dom'
import { shouldDisableNFTRoutesAtom } from 'state/application/atoms'
import styled from 'styled-components/macro'

import { Bag } from './Bag'
import Blur from './Blur'
import { ChainSelector } from './ChainSelector'
import {
  CampaignTab,
  DerpsSubMenuTab,
  LaunchpadIcon,
  PoolsIcon,
  PoolsSubMenuTab,
  SwapIcon,
  SwapSubMenuTab,
} from './DerpNavBarV2'
import { MenuDropdownMobile } from './MenuDropdownMobile'
import { SearchBar } from './SearchBar'
import * as styles from './style.css'

const Nav = styled.nav`
  padding: 20px 12px;
  width: 100%;
  height: ${({ theme }) => theme.navHeight}px;
  z-index: 2;
`

const ColumnTab = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 4px;
  svg {
    width: 18px;
  }

  &.is-more {
    * {
      color: #98a1c0;
      font-family: 'Nunito' !important;
      font-weight: 500;
    }
  }
`

type isActiveState = {
  isActive: boolean
  type?: string | null
}
const NavLinkV2 = styled.div<isActiveState>`
  position: relative;
  padding: 2px 4px;
  @media only screen and (max-width: 768px) {
    padding: 2px 0px;
  }
  text-align: center;
  display: flex;
  align-items: center;
  transition: 250;
  height: min;
  gap: 4px;

  @media only screen and (max-width: 768px) {
    font-weight: ${({ isActive }) => (isActive ? '600' : '400')};
  }
  color: ${({ isActive }) => (isActive ? 'transparent' : '#98A1C0')};
  background-clip: text;
  background-image: ${({ isActive }) => (isActive ? 'linear-gradient(135deg, #a372ff 0%, #46c9d2 95.1%)' : 'none')};
  -webkit-background-clip: ${({ isActive }) => (isActive ? 'text' : 'none')};
  -webkit-text-fill-color: ${({ isActive }) => (isActive ? 'transparent' : 'none')};

  svg {
    path {
      fill: ${({ isActive, type }) =>
        isActive && type === 'fill' ? '#9b93ff !important;' : isActive && type !== 'fill' ? '#transparent' : '98A1C0'};
      stroke: ${({ isActive, type }) =>
        isActive && type === 'stroke'
          ? '#9b93ff !important;'
          : isActive && type !== 'stroke'
          ? '#transparent'
          : '98A1C0'};
    }
  }

  ::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 4px;
    width: 100%;
    background: ${({ isActive, theme }) =>
      isActive
        ? theme.derpGradientPrimary
        : 'transparent'}; /* Replace these colors with your desired gradient colors */
  }
`

const TextArea = styled(NunitoText)`
  display: flex;
  align-items: end;
  justify-content: flex-end;

  height: 26px;
`

interface MenuItemProps {
  href: string
  id?: NavLinkProps['id']
  isActive?: boolean
  type?: string | null
  children: ReactNode
  dataTestId?: string
  isDisabled?: boolean
}

const MenuItem = ({ href, dataTestId, id, isActive, children, type, isDisabled = false }: MenuItemProps) => {
  const navigate = useNavigate()

  return (
    <NavLinkV2 onClick={() => !isDisabled && navigate(href)} isActive={isActive ? true : false} type={type}>
      {children}
    </NavLinkV2>
  )
}

export const PageTabs = () => {
  const { pathname } = useLocation()
  const { chainId: connectedChainId } = useWeb3React()
  const chainName = chainIdToBackendName(connectedChainId)

  const isPoolActive = useIsPoolsPage()
  const isNftPage = useIsNftPage()
  const isBridgeActive = useIsBridgePage()

  const shouldDisableNFTRoutes = useAtomValue(shouldDisableNFTRoutesAtom)
  return (
    <>
      {/* <MenuItem href="/swap" isActive={pathname.startsWith('/swap') || pathname.replaceAll('/', '') === ''} type="fill">
        <ColumnTab>
          <SwapIcon fill="#9B93FF" />
          <Trans>Swap</Trans>
        </ColumnTab>
      </MenuItem> */}
      <Box marginY={{ sm: '4', md: 'unset' }}>
        <ColumnTab>
          <SwapIcon fill="#9B93FF" />
          <SwapSubMenuTab clickedExternal={pathname.startsWith('/swap') || pathname.startsWith('/tokens')} />
        </ColumnTab>
      </Box>
      {/* <MenuItem href={`/tokens/${chainName.toLowerCase()}`} isActive={pathname.startsWith('/tokens')} type="fill">
        <ColumnTab>
          <TokensIcon fill="#FB118E" />
          <Trans>Tokens</Trans>
        </ColumnTab>
      </MenuItem> */}
      {!shouldDisableNFTRoutes && (
        <MenuItem dataTestId="nft-nav" href="/nfts" isActive={isNftPage}>
          <Trans>NFTs</Trans>
        </MenuItem>
      )}
      {/* <MenuItem href="/pools" dataTestId="pool-nav-link" isActive={isPoolActive} type="stroke">
        <ColumnTab>
          <PoolsIcon type="stroke" />
          <Trans>Pools</Trans>
        </ColumnTab>
      </MenuItem> */}
      <Box marginY={{ sm: '4', md: 'unset' }}>
        <ColumnTab>
          <PoolsIcon type="stroke" />
          <PoolsSubMenuTab clickedExternal={pathname.startsWith('/pools') || pathname.startsWith('/zap-to-earn')} />
        </ColumnTab>
      </Box>
      <Box marginY={{ sm: '4', md: 'unset' }}>
        <ColumnTab>
          <CampaignIcon />
          <DerpsSubMenuTab clickedExternal={pathname.startsWith('/xderp')} />
        </ColumnTab>
      </Box>
      <MenuItem href="/launchpad" isActive={pathname.startsWith('/launchpad')} type="fill">
        <ColumnTab>
          <LaunchpadIcon fill="#9B93FF" />
          <TextArea>
            <Trans>Launchpad</Trans>
          </TextArea>
        </ColumnTab>
      </MenuItem>
      <Box marginY={{ sm: '4', md: 'unset' }}>
        <ColumnTab>
          <CampaignIcon />
          <CampaignTab />
        </ColumnTab>
      </Box>
      <Box
        style={{
          marginTop: '4px',
        }}
      >
        <ColumnTab className="is-more">
          <MenuDropdownMobile />
          <NunitoText size="lg" weight={500}>
            <Trans>More</Trans>
          </NunitoText>
        </ColumnTab>
      </Box>
    </>
  )
}

const Navbar = ({ blur }: { blur: boolean }) => {
  const isNftPage = useIsNftPage()
  const sellPageState = useProfilePageState((state) => state.state)
  const navigate = useNavigate()

  return (
    <>
      {blur && <Blur />}
      <Nav>
        <Box display="flex" height="full" flexWrap="nowrap">
          <Box className={styles.leftSideContainer}>
            <Box className={styles.logoContainer}>
              <UniIcon
                width="48"
                height="48"
                data-testid="uniswap-logo"
                className={styles.logo}
                onClick={() => {
                  navigate({
                    pathname: '/',
                    search: '?intro=true',
                  })
                }}
              />
            </Box>
            {!isNftPage && (
              <Box display={{ sm: 'flex', lg: 'none' }}>
                <ChainSelector leftAlign={true} />
              </Box>
            )}
            <Row display={{ sm: 'none', lg: 'flex' }}>
              <PageTabs />
            </Row>
          </Box>
          <Box className={styles.searchContainer}>
            <SearchBar />
          </Box>
          <Box className={styles.rightSideContainer}>
            <Row gap="12">
              <Box position="relative" display={{ sm: 'flex', navSearchInputVisible: 'none' }}>
                <SearchBar />
              </Box>
              {isNftPage && sellPageState !== ProfilePageStateType.LISTING && <Bag />}
              {!isNftPage && (
                <Box display={{ sm: 'none', lg: 'flex' }}>
                  <ChainSelector />
                </Box>
              )}

              <Web3Status />
            </Row>
          </Box>
        </Box>
      </Nav>
    </>
  )
}

export default Navbar
