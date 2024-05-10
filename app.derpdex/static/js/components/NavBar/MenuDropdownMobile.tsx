import { t, Trans } from '@lingui/macro'
import FeatureFlagModal from 'components/FeatureFlagModal/FeatureFlagModal'
import { PrivacyPolicyModal } from 'components/PrivacyPolicy'
import { useOnClickOutside } from 'hooks/useOnClickOutside'
import { Box } from 'nft/components/Box'
import { Column, Row } from 'nft/components/Flex'
import {
  AnalyticsIcon,
  DiscordIconMenu,
  EllipsisIcon,
  FaucetIcon,
  GithubIconMenu,
  PoolIcon,
  TwitterIconMenu,
} from 'nft/components/icons'
import { body } from 'nft/css/common.css'
import { themeVars } from 'nft/css/sprinkles.css'
import { ReactNode, useReducer, useRef } from 'react'
import { NavLink, NavLinkProps } from 'react-router-dom'
import { useToggleModal } from 'state/application/hooks'
import styled, { useTheme } from 'styled-components/macro'
import { isDevelopmentEnv, isStagingEnv } from 'utils/env'

import { ApplicationModal } from '../../state/application/reducer'
import { BridgeIcon } from './DerpNavBarV2'
import * as styles from './MenuDropdown.css'
import { NavDropdown } from './NavDropdown'

const PrimaryMenuRow = ({
  to,
  href,
  close,
  children,
}: {
  to?: NavLinkProps['to']
  href?: string
  close?: () => void
  children: ReactNode
}) => {
  return (
    <>
      {to ? (
        <NavLink to={to} className={styles.MenuRow}>
          <Row onClick={close}>{children}</Row>
        </NavLink>
      ) : (
        <Row cursor="pointer" as="a" href={href} target="_blank" rel="noopener noreferrer" className={styles.MenuRow}>
          {children}
        </Row>
      )}
    </>
  )
}

const StyledBox = styled(Box)`
  align-items: center;
  display: flex;
  justify-content: center;
`
const PrimaryMenuRowText = ({ children }: { children: ReactNode }) => {
  return <StyledBox className={`${styles.PrimaryText} ${body}`}>{children}</StyledBox>
}

PrimaryMenuRow.Text = PrimaryMenuRowText

const SecondaryLinkedText = ({
  href,
  onClick,
  children,
}: {
  href?: string
  onClick?: () => void
  children: ReactNode
}) => {
  return (
    <Box
      as={href ? 'a' : 'div'}
      href={href ?? undefined}
      target={href ? '_blank' : undefined}
      rel={href ? 'noopener noreferrer' : undefined}
      className={`${styles.SecondaryText} ${body}`}
      onClick={onClick}
      cursor="pointer"
    >
      {children}
    </Box>
  )
}

const Separator = () => {
  return <Box className={styles.Separator} />
}

const IconRow = ({ children }: { children: ReactNode }) => {
  return <Row className={styles.IconRow}>{children}</Row>
}

const Icon = ({ href, children }: { href?: string; children: ReactNode }) => {
  return (
    <>
      <Box
        as={href ? 'a' : 'div'}
        href={href ?? undefined}
        target={href ? '_blank' : undefined}
        rel={href ? 'noopener noreferrer' : undefined}
        display="flex"
        flexDirection="column"
        color="textPrimary"
        background="none"
        border="none"
        justifyContent="center"
        textAlign="center"
        marginRight="12"
      >
        {children}
      </Box>
    </>
  )
}
interface NavIconProps {
  children: ReactNode
  isActive?: boolean
  label?: string
  onClick: () => void
  activeBackground?: boolean
}

const NavIconMobile = ({
  children,
  isActive,
  label = t`Navigation button`,
  onClick,
  activeBackground,
}: NavIconProps) => {
  return <Box onClick={onClick}>{children}</Box>
}

export const MenuDropdownMobile = () => {
  const theme = useTheme()
  const [isOpen, toggleOpen] = useReducer((s) => !s, false)
  const togglePrivacyPolicy = useToggleModal(ApplicationModal.PRIVACY_POLICY)
  const openFeatureFlagsModal = useToggleModal(ApplicationModal.FEATURE_FLAGS)
  const ref = useRef<HTMLDivElement>(null)
  useOnClickOutside(ref, isOpen ? toggleOpen : undefined)

  return (
    <>
      <Box position="relative" ref={ref}>
        <NavIconMobile isActive={isOpen} onClick={toggleOpen} label={isOpen ? t`Show resources` : t`Hide resources`}>
          <EllipsisIcon viewBox="0 0 20 20" width={18} height={18} />
        </NavIconMobile>

        {isOpen && (
          <NavDropdown
            top={{ sm: 'unset', lg: '56' }}
            bottom={{ sm: '56', lg: 'unset' }}
            right="0"
            width={{ sm: 'auto', lg: '276' }}
          >
            <Column gap="16">
              <Column paddingX="8" gap="4">
                <Box display={{ sm: 'none', lg: 'flex', xxl: 'none' }}>
                  <PrimaryMenuRow to="/pool" close={toggleOpen}>
                    <Icon>
                      <PoolIcon width={24} height={24} fill={theme.textPrimary} />
                    </Icon>
                    <PrimaryMenuRow.Text>
                      <Trans>Pool</Trans>
                    </PrimaryMenuRow.Text>
                  </PrimaryMenuRow>
                </Box>
                {/* <Box onClick={() => openDownloadApp(InterfaceElementName.UNISWAP_WALLET_MODAL_DOWNLOAD_BUTTON)}> */}
                {/* <Box>
                  <PrimaryMenuRow close={toggleOpen}>
                    <Icon>
                      <AppleLogo width="24px" height="24px" fill={theme.textPrimary} />
                    </Icon>
                    <PrimaryMenuRow.Text>
                      <Trans>Download DerpDEX Wallet (TBA)</Trans>
                    </PrimaryMenuRow.Text>
                  </PrimaryMenuRow>
                </Box> */}
                {/* <PrimaryMenuRow to="/vote" close={toggleOpen}> */}
                {/* <PrimaryMenuRow>
                  <Icon>
                    <GovernanceIcon width={24} height={24} color={theme.textPrimary} />
                  </Icon>
                  <PrimaryMenuRow.Text>
                    <Trans>Vote in governance (TBA)</Trans>
                  </PrimaryMenuRow.Text>
                </PrimaryMenuRow> */}
                {/* <PrimaryMenuRow to="/zap-to-earn">
                  <Icon>
                    <ZapIcon width={24} height={24} stroke="#98A1C0" />
                  </Icon>
                  <PrimaryMenuRow.Text>
                    <Trans>Zap To Earn</Trans>
                  </PrimaryMenuRow.Text>
                </PrimaryMenuRow> */}
                <PrimaryMenuRow to="/bridge">
                  {/* ;TODO */}
                  <Icon>
                    <BridgeIcon width={24} height={24} stroke="#98A1C0" />
                  </Icon>
                  <PrimaryMenuRow.Text>
                    <Trans>Bridge</Trans>
                  </PrimaryMenuRow.Text>
                </PrimaryMenuRow>
                <PrimaryMenuRow to="/wormhole-bridge">
                  {/* ;TODO */}
                  <Icon>
                    <BridgeIcon width={24} height={24} stroke="#98A1C0" />
                  </Icon>
                  <PrimaryMenuRow.Text>
                    <Trans>Wormhole Bridge</Trans>
                  </PrimaryMenuRow.Text>
                </PrimaryMenuRow>
                {process.env.REACT_APP_IS_TESTSITE === 'true' && (
                  <PrimaryMenuRow href="https://faucet.derpdex.com/">
                    {/* ;TODO */}
                    <Icon>
                      <FaucetIcon width={24} height={24} color={theme.textPrimary} />
                    </Icon>
                    <PrimaryMenuRow.Text>
                      <Trans>Faucet</Trans>
                    </PrimaryMenuRow.Text>
                  </PrimaryMenuRow>
                )}
                <PrimaryMenuRow href="https://info.derpdex.com/">
                  {/* ;TODO */}
                  <Icon>
                    <AnalyticsIcon width={24} height={24} color={theme.textPrimary} />
                  </Icon>
                  <PrimaryMenuRow.Text>
                    <Trans>Analytics</Trans>
                  </PrimaryMenuRow.Text>
                </PrimaryMenuRow>
              </Column>
              <Separator />
              <Box
                display="flex"
                flexDirection={{ sm: 'row', md: 'column' }}
                flexWrap="wrap"
                alignItems={{ sm: 'center', md: 'flex-start' }}
                paddingX="8"
              >
                <SecondaryLinkedText href="https://derpdex.gitbook.io/home/guide/faq">
                  <Trans>FAQ</Trans> ↗
                </SecondaryLinkedText>
                <SecondaryLinkedText href="https://derpdex.gitbook.io/home/">
                  <Trans>Documentation</Trans> ↗
                </SecondaryLinkedText>
                <SecondaryLinkedText href="https://discord.com/invite/jvTEhYFX8u">
                  <Trans>Feedback</Trans> ↗
                </SecondaryLinkedText>
                {/* <SecondaryLinkedText
                  onClick={() => {
                    toggleOpen()
                    togglePrivacyPolicy()
                  }}
                > */}
                {/* ;TODO */}
                {/* <SecondaryLinkedText>
                  <Trans>Legal & Privacy</Trans> ↗
                </SecondaryLinkedText> */}
                {(isDevelopmentEnv() || isStagingEnv()) && (
                  <SecondaryLinkedText onClick={openFeatureFlagsModal}>
                    <Trans>Feature Flags</Trans>
                  </SecondaryLinkedText>
                )}
              </Box>
              <IconRow>
                <Icon href="https://discord.com/invite/jvTEhYFX8u">
                  <DiscordIconMenu
                    className={styles.hover}
                    width={24}
                    height={24}
                    color={themeVars.colors.textSecondary}
                  />
                </Icon>
                <Icon href="https://twitter.com/DerpDEXcom">
                  <TwitterIconMenu
                    className={styles.hover}
                    width={24}
                    height={24}
                    color={themeVars.colors.textSecondary}
                  />
                </Icon>
                <Icon href="https://github.com/derpdex-official">
                  <GithubIconMenu
                    className={styles.hover}
                    width={24}
                    height={24}
                    color={themeVars.colors.textSecondary}
                  />
                </Icon>
              </IconRow>
            </Column>
          </NavDropdown>
        )}
      </Box>
      <PrivacyPolicyModal />
      <FeatureFlagModal />
    </>
  )
}
