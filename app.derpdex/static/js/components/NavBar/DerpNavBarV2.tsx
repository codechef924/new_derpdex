/* eslint-disable import/no-unused-modules */
import { useWeb3React } from '@web3-react/core'
import AnimatedCelebrateEmoji from 'assets/gif/celebrate-emoji.gif'
import AnimatedClappingHand from 'assets/gif/clapping-hands.gif'
import AnimatedCoin3d from 'assets/gif/coin-3d.gif'
import AnimatedFace from 'assets/gif/derp-yellow.gif'
import AnimatedDiamondShine from 'assets/gif/diamond-shine.gif'
import AnimatedEmoji from 'assets/gif/sign-contract.gif'
import StonedFace from 'assets/images/stoned.png'
import { ReactComponent as CampaignIcon } from 'assets/svg/campaign-icon.svg'
import { ReactComponent as DerpSvg } from 'assets/svg/derp-main.svg'
import { NunitoText } from 'components/CustomFonts/Nunito'
import Web3Status from 'components/Web3Status'
import { chainIdToBackendName } from 'graphql/data/util'
import { useIsNftPage } from 'hooks/useIsNftPage'
import { useProfilePageState } from 'nft/hooks'
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { NavLink, NavLinkProps, useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components/macro'

import { ChainSelector } from './ChainSelector'
import { MenuDropdown } from './MenuDropdown'
import { SearchBarV2 } from './SearchBarV2'
import * as styles from './style.css'

const DummyDiv = styled.div`
  padding: 0px 97px;
  width: 100%;
  // height: ${({ theme }) => theme.navHeight}px;
  // height: 50px;
  z-index: 2;
`
const Nav = styled.nav`
  width: 100%;
  min-width: 1200px;
  z-index: 2;
`
const BOTTOM_LINE_HEIGHT = 7

const Marginalized = styled.div`
  margin-bottom: 12px;

  @media (max-width: 844px) {
    margin-right: 5px;
  }
`

const DerpTabRoot = styled.div`
  display: flex;
  flex-grow: 1;
`

const DerpTabContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  padding: 0px 6px;

  align-items: center;
  width: 100%;
  gap: 28px;

  @media (max-width: 1368px) {
    gap: 26px;
  }

  @media (max-width: 1024px) {
    gap: 10px;
  }
`

const DerpTab = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  height: 80px;
  font-weight: ${(props: { active: string | null }) => (props.active === 'true' ? '800' : '600')};
  color: ${(props: { active: string | null }) => (props.active === 'true' ? 'transparent' : '#98A1C0')};
  background-clip: text;
  background-image: ${(props: { active: string | null }) =>
    props.active === 'true' ? 'linear-gradient(135deg, #a372ff 0%, #46c9d2 95.1%)' : 'none'};
  -webkit-background-clip: ${(props: { active: string | null }) => (props.active === 'true' ? 'text' : 'none')};
  -webkit-text-fill-color: ${(props: { active: string | null }) => (props.active === 'true' ? 'transparent' : 'none')};

  cursor: pointer;
  svg {
    path {
      fill: ${(props: { active: string | null; type: string | null }) =>
        props.active === 'true' && props.type === 'fill'
          ? '#9b93ff !important;'
          : props.active === 'true' && props.type !== 'fill'
          ? '#transparent'
          : '98A1C0'};
      stroke: ${(props: { active: string | null; type: string | null }) =>
        props.active === 'true' && props.type === 'stroke'
          ? '#9b93ff !important;'
          : props.active === 'true' && props.type !== 'stroke'
          ? '#transparent'
          : '98A1C0'};
    }
  }
`

const NunitoConditional = styled(NunitoText)`
  font-weight: ${(props: { active: string | null }) => (props.active === 'true' ? '800' : '600')};
  @media only screen and (max-width: 768px) {
    font-weight: ${(props: { active: string | null }) => (props.active === 'true' ? '600' : '400')};
  }
  color: ${(props: { active: string | null }) => (props.active === 'true' ? 'transparent' : '#98A1C0')};
  background-clip: text;
  background-image: ${(props: { active: string | null }) =>
    props.active === 'true' ? 'linear-gradient(135deg, #a372ff 0%, #46c9d2 95.1%)' : 'none'};
  -webkit-background-clip: ${(props: { active: string | null }) => (props.active === 'true' ? 'text' : 'none')};
  -webkit-text-fill-color: ${(props: { active: string | null }) => (props.active === 'true' ? 'transparent' : 'none')};
`

const DerpTabElement = styled.div`
  flex-grow: 1;
  display: flex;
  gap: 5px;
  align-items: center;

  & > * {
    white-space: nowrap;
  }
`

const TopTabLine = styled.div<{ active: string | null }>`
  height: ${BOTTOM_LINE_HEIGHT}px;
  width: 100%;
  background: ${({ active, theme }) => (active === 'true' ? theme.derpGradientPrimary : 'transparent')};
`

const MainContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const LeftSideContainer = styled.div`
  width: -webkit-fill-available;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`

const RightSideContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`

interface MenuItemProps {
  href: string
  id?: NavLinkProps['id']
  isActive?: boolean
  children: ReactNode
  dataTestId?: string
}

const MenuItem = ({ href, dataTestId, id, isActive, children }: MenuItemProps) => {
  return (
    <NavLink
      to={href}
      className={isActive ? styles.activeMenuItem : styles.menuItem}
      id={id}
      style={{ textDecoration: 'none' }}
      data-testid={dataTestId}
    >
      {children}
    </NavLink>
  )
}

export const SwapIcon = (props: SVGProps) => (
  <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8 4C7.46957 4 6.96086 4.21071 6.58579 4.58579C6.21071 4.96086 6 5.46957 6 6V10H8V6H16V9H13.5L17 12.5L20.5 9H18V6C18 5.46957 17.7893 4.96086 17.4142 4.58579C17.0391 4.21071 16.5304 4 16 4H8ZM3 12V14H11V12H3ZM3 15V17H11V15H3ZM13 15V17H21V15H13ZM3 18V20H11V18H3ZM13 18V20H21V18H13Z"
      fill="#98A1C0"
    />
  </svg>
)

export const TokensIcon = (props: SVGProps) => (
  <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M21 7L12 2L3 7V17L12 22L21 17V7ZM12 4.29L17.91 7.57L14.9 9.24C14.17 8.48 13.14 8 12 8C10.86 8 9.83 8.48 9.1 9.24L6.09 7.57L12 4.29ZM11 19.16L5 15.83V9.26L8.13 11C8.04 11.31 8 11.65 8 12C8 13.86 9.27 15.43 11 15.87V19.16ZM10 12C10 10.9 10.9 10 12 10C13.1 10 14 10.9 14 12C14 13.1 13.1 14 12 14C10.9 14 10 13.1 10 12ZM13 19.16V15.88C14.73 15.44 16 13.87 16 12.01C16 11.66 15.96 11.32 15.87 11L19 9.26V15.83L13 19.16Z"
      fill="#98A1C0"
    />
  </svg>
)

export const PoolsIcon = (props: SVGProps) => (
  <svg {...props} width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M4.5 6C5.03043 6 5.53914 5.78929 5.91421 5.41421C6.28929 5.03914 6.5 4.53043 6.5 4C6.5 3.46957 6.28929 2.96086 5.91421 2.58579C5.53914 2.21071 5.03043 2 4.5 2C3.96957 2 3.46086 2.21071 3.08579 2.58579C2.71071 2.96086 2.5 3.46957 2.5 4C2.5 4.53043 2.71071 5.03914 3.08579 5.41421C3.46086 5.78929 3.96957 6 4.5 6ZM5.5 21C6.29565 21 7.05871 20.6839 7.62132 20.1213C8.18393 19.5587 8.5 18.7956 8.5 18C8.5 17.2044 8.18393 16.4413 7.62132 15.8787C7.05871 15.3161 6.29565 15 5.5 15C4.70435 15 3.94129 15.3161 3.37868 15.8787C2.81607 16.4413 2.5 17.2044 2.5 18C2.5 18.7956 2.81607 19.5587 3.37868 20.1213C3.94129 20.6839 4.70435 21 5.5 21ZM19.5 22C20.2956 22 21.0587 21.6839 21.6213 21.1213C22.1839 20.5587 22.5 19.7956 22.5 19C22.5 18.2044 22.1839 17.4413 21.6213 16.8787C21.0587 16.3161 20.2956 16 19.5 16C18.7044 16 17.9413 16.3161 17.3787 16.8787C16.8161 17.4413 16.5 18.2044 16.5 19C16.5 19.7956 16.8161 20.5587 17.3787 21.1213C17.9413 21.6839 18.7044 22 19.5 22ZM11.5 14C12.5609 14 13.5783 13.5786 14.3284 12.8284C15.0786 12.0783 15.5 11.0609 15.5 10C15.5 8.93913 15.0786 7.92172 14.3284 7.17157C13.5783 6.42143 12.5609 6 11.5 6C10.4391 6 9.42172 6.42143 8.67157 7.17157C7.92143 7.92172 7.5 8.93913 7.5 10C7.5 11.0609 7.92143 12.0783 8.67157 12.8284C9.42172 13.5786 10.4391 14 11.5 14ZM17.5 6C18.0304 6 18.5391 5.78929 18.9142 5.41421C19.2893 5.03914 19.5 4.53043 19.5 4C19.5 3.46957 19.2893 2.96086 18.9142 2.58579C18.5391 2.21071 18.0304 2 17.5 2C16.9696 2 16.4609 2.21071 16.0858 2.58579C15.7107 2.96086 15.5 3.46957 15.5 4C15.5 4.53043 15.7107 5.03914 16.0858 5.41421C16.4609 5.78929 16.9696 6 17.5 6Z"
      stroke="#98A1C0"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 5.5L8 7.5M15.5 6L14.5 7M17.5 16.75L14.5 13M7.5 15.5L9.5 13.5"
      stroke="#98A1C0"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const DerpTokenIcon = (props: SVGProps) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <g clipPath="url(#clip0_20_6)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.68659 4.97698L4.97409 8.68948C4.69289 8.97077 4.53491 9.35223 4.53491 9.74998C4.53491 10.1477 4.69289 10.5292 4.97409 10.8105L8.68659 14.523C8.8259 14.6624 8.99133 14.7731 9.17343 14.8486C9.35553 14.9241 9.55072 14.9629 9.74784 14.9629C9.94496 14.9629 10.1402 14.9241 10.3223 14.8486C10.5043 14.7731 10.6698 14.6624 10.8091 14.523L14.5201 10.8105C14.8013 10.5292 14.9593 10.1477 14.9593 9.74998C14.9593 9.35223 14.8013 8.97077 14.5201 8.68948L10.8091 4.97698C10.6698 4.83751 10.5043 4.72688 10.3223 4.65139C10.1402 4.5759 9.94496 4.53705 9.74784 4.53705C9.55072 4.53705 9.35553 4.5759 9.17343 4.65139C8.99133 4.72688 8.8259 4.83751 8.68659 4.97698ZM9.74709 12.402L7.09659 9.74998L9.74709 7.09798L12.3991 9.74998L9.74709 12.402Z"
        fill="#AFBDC8"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.39318e-06 9.74997C-0.00117755 7.54378 0.745906 5.4024 2.11919 3.67573C3.49246 1.94905 5.41075 0.739169 7.5606 0.243759C9.71045 -0.251651 11.9648 -0.00329575 13.9552 0.948245C15.9457 1.89978 17.5545 3.49825 18.519 5.48247C19.9151 6.16308 21.1285 7.16738 22.0579 8.41174C22.9874 9.65611 23.6062 11.1045 23.8627 12.6364C24.1192 14.1683 24.006 15.7392 23.5326 17.2185C23.0591 18.6978 22.2391 20.0426 21.1409 21.1408C20.0426 22.2391 18.6978 23.0591 17.2185 23.5325C15.7393 24.006 14.1683 24.1192 12.6364 23.8627C11.1046 23.6062 9.65614 22.9874 8.41177 22.0579C7.16741 21.1284 6.16311 19.9151 5.4825 18.519C3.83826 17.7186 2.45227 16.4719 1.48281 14.9213C0.513358 13.3707 -0.000473666 11.5787 1.39318e-06 9.74997ZM9.75 2.24997C7.76088 2.24997 5.85322 3.04015 4.4467 4.44667C3.04018 5.85319 2.25 7.76085 2.25 9.74997C2.25 11.7391 3.04018 13.6467 4.4467 15.0533C5.85322 16.4598 7.76088 17.25 9.75 17.25C11.7391 17.25 13.6468 16.4598 15.0533 15.0533C16.4598 13.6467 17.25 11.7391 17.25 9.74997C17.25 7.76085 16.4598 5.85319 15.0533 4.44667C13.6468 3.04015 11.7391 2.24997 9.75 2.24997ZM19.5 9.74997C19.5 9.44847 19.485 9.14997 19.4595 8.85447C20.1758 9.54632 20.7472 10.3739 21.1403 11.2889C21.5333 12.204 21.7402 13.1881 21.7489 14.184C21.7575 15.1798 21.5678 16.1674 21.1907 17.0891C20.8136 18.0108 20.2567 18.8482 19.5525 19.5524C18.8483 20.2566 18.0109 20.8135 17.0892 21.1906C16.1674 21.5677 15.1798 21.7575 14.184 21.7488C13.1881 21.7402 12.204 21.5333 11.289 21.1402C10.3739 20.7472 9.54635 20.1758 8.8545 19.4595C10.2047 19.584 11.5661 19.4255 12.8516 18.9942C14.1371 18.5629 15.3185 17.8681 16.3203 16.9544C17.3222 16.0406 18.1224 14.928 18.6699 13.6875C19.2174 12.447 19.5001 11.1059 19.5 9.74997Z"
        fill="#AFBDC8"
      />
    </g>
    <defs>
      <clipPath id="clip0_20_6">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
)

export const LaunchpadIcon = (props: SVGProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <g clipPath="url(#clip0_21_10)">
      <path
        d="M9.99992 8.25002C10.9204 8.25002 11.6666 7.50383 11.6666 6.58335C11.6666 5.66288 10.9204 4.91669 9.99992 4.91669C9.07944 4.91669 8.33325 5.66288 8.33325 6.58335C8.33325 7.50383 9.07944 8.25002 9.99992 8.25002Z"
        fill="#AFBDC8"
      />
      <path
        d="M3.91667 20C3.66667 20 3.5 19.9167 3.25 19.8333C2.75 19.5833 2.5 19.0833 2.5 18.5V15.5C2.5 14.4167 2.83333 13.5833 3.41667 13L5.08333 11.25C5 10.3333 5 9.33333 5 8.33333C5 1.83333 9.5 0.166667 9.75 0.0833333L10 0L10.25 0.0833333C10.4167 0.166667 15 1.75 15 8.33333C15 9.33333 15 10.3333 14.9167 11.25L16.5833 13C17.1667 13.5833 17.5 14.4167 17.5 15.5V18.5C17.5 19.0833 17.25 19.5 16.8333 19.75C16.3333 20 15.8333 20 15.3333 19.6667L13.3333 18.1667L12.1667 19.9167H7.91667L6.75 18.25L4.75 19.75C4.5 19.9167 4.16667 20 3.91667 20ZM8.75 18.25H11.1667L11.75 17.4167H8.16667L8.75 18.25ZM10 1.75C9.16667 2.16667 6.66667 3.75 6.66667 8.25C6.66667 9.33333 6.75 10.4167 6.83333 11.4167V11.8333L4.58333 14.1667C4.25 14.5 4.16667 14.9167 4.16667 15.5V18.0833L6.08333 16.5833C6.25 16.5 6.33333 16.4167 6.41667 16.4167C6.83333 16.0833 7.41667 15.75 8.08333 15.75H11.9167C12.6667 15.75 13.25 16.1667 13.75 16.5L13.9167 16.5833L15.8333 18V15.5C15.8333 14.9167 15.6667 14.5 15.4167 14.1667L13.1667 11.8333V11.4167C13.25 10.4167 13.3333 9.33333 13.3333 8.25C13.3333 3.75 10.8333 2.16667 10 1.75Z"
        fill="#AFBDC8"
      />
    </g>
    <defs>
      <clipPath id="clip0_21_10">
        <rect width="20" height="20" fill="white" />
      </clipPath>
    </defs>
  </svg>
)

export const ZapIcon = (props: SVGProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="21" viewBox="0 0 14 21" fill="none">
    <path
      d="M9.5 2H9.505H9.5ZM9.5 2L7 8L12 10.898L4.5 18L7 12L2 9.1L9.5 2ZM9.5 9.18826e-07C8.98713 0.00231471 8.49425 0.199249 8.121 0.551001L0.624001 7.646C0.398011 7.86008 0.22517 8.12401 0.119262 8.41673C0.0133538 8.70946 -0.0226914 9.02288 0.0140011 9.332C0.0860011 9.958 0.451001 10.514 0.996001 10.83L4.478 12.851L2.652 17.232C2.52596 17.5361 2.47679 17.8665 2.50885 18.1941C2.54092 18.5217 2.65322 18.8363 2.83583 19.1102C3.01843 19.3841 3.26572 19.6087 3.5558 19.7642C3.84589 19.9198 4.16984 20.0015 4.499 20.002C4.997 20.002 5.492 19.816 5.874 19.454L13.374 12.351C13.6 12.1372 13.7729 11.8734 13.8788 11.5808C13.9848 11.2883 14.0208 10.975 13.984 10.666C13.9481 10.3571 13.8406 10.0609 13.6702 9.80086C13.4997 9.54081 13.2709 9.32412 13.002 9.168L9.52 7.15L11.309 2.857C11.4536 2.55201 11.5187 2.21537 11.4982 1.87845C11.4777 1.54152 11.3722 1.21527 11.1917 0.930079C11.0111 0.64489 10.7613 0.410045 10.4655 0.247419C10.1697 0.0847931 9.83755 -0.000322602 9.5 9.18826e-07Z"
      fill="#98A1C0"
    />
  </svg>
)

const CampaignMenu = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  font-size: 18px !important;
  font-weight: 700 !important;

  @media only screen and (max-width: 768px) {
    font-size: 16px !important;
    font-weight: 400 !important;
    color: #98a1c0;
    padding: 0px 0px;
  }
`

const CampaignSubmenu = styled.div`
  cursor: default;
  z-index: 2;
  position: absolute;
  display: flex;
  flex-direction: column;

  gap: 3px;

  background: #fff;
  border-radius: 8px;
  border: 2px solid #000;
  box-shadow: 3px 3px 0px 0px #000;

  width: 280px;
  bottom: 0;
  left: 0;
  transform: translateY(120%);

  padding: 10px 10px;

  &.is-swap {
    transform: translateY(145%);
  }

  &.is-pools {
    transform: translateY(145%);
  }

  &.is-derp {
    transform: translateY(132%);
  }

  @media only screen and (max-width: 768px) {
    top: 0;
    right: 0;
    bottom: unset;

    transform: translate(-57%, -120%);

    &.is-swap {
      transform: translate(0%, -142px);
    }

    &.is-pools {
      transform: translate(-20%, -141px);
    }

    &.is-derp {
      transform: translate(-20%, -179px);
    }
  }
`

const DerpTabDropdown = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  height: 80px;

  cursor: pointer;
  svg {
    path {
      fill: ${(props: { active: string | null; type: string | null }) =>
        props.active === 'true' && props.type === 'fill'
          ? '#9b93ff !important;'
          : props.active === 'true' && props.type !== 'fill'
          ? '#transparent'
          : '98A1C0'};
      stroke: ${(props: { active: string | null; type: string | null }) =>
        props.active === 'true' && props.type === 'stroke'
          ? '#9b93ff !important;'
          : props.active === 'true' && props.type !== 'stroke'
          ? '#transparent'
          : '98A1C0'};
    }
  }
`

type HoverableState = {
  isAllowed: boolean
  isActive?: boolean
}
const Hoverable = styled.div<HoverableState>`
  width: 100%;
  // padding: 6px 10px;
  border-radius: 8px;

  background: ${({ isActive, theme }) => (isActive ? theme.derpGradientPrimary : 'unset')};
  ${({ isAllowed, theme }) =>
    isAllowed
      ? `  
      &:hover {
        cursor: pointer;
        color: #fff;
        background: ${theme.derpGradientPrimary};
        font-size: 18px !important;
        font-weight: 700 !important;
      }`
      : `
        color: #d8d8d8 !important;
        &:hover {
          background: #fff;
          font-size: 18px !important;
          font-weight: 700 !important;
        }
      `}
`

const RowList = styled.div`
  display: flex;
  flex-direction: row;
  padding: 6px 10px;
  align-items: center;
  gap: 10px;

  img {
    max-width: 24px;
  }
`

const RowListV2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 6fr;
  padding: 6px 10px;
  align-items: center;
  gap: 10px;

  img {
    max-width: 24px;
  }
  color: ${(props: { active: string | null }) => (props.active === 'true' ? 'white' : '#98A1C0')};

  svg {
    path {
      fill: ${(props: { active: string | null; type: string | null }) =>
        props.active === 'true' && props.type === 'fill'
          ? '#fff !important'
          : props.active === 'true' && props.type !== 'fill'
          ? '#9b93ff !important'
          : props.active === 'false' && props.type !== 'fill'
          ? '#fff !important'
          : '#9b93ff'};
      stroke: ${(props: { active: string | null; type: string | null }) =>
        props.active === 'true' && props.type === 'stroke'
          ? '#fff !important;'
          : props.active === 'true' && props.type !== 'stroke'
          ? '#transparent'
          : props.active === 'false' && props.type === 'stroke'
          ? '#9b93ff'
          : '98A1C0'};
    }
  }

  &:hover {
    color: white;
    svg {
      path {
        fill: ${(props: { type: string | null }) =>
          props.type === 'fill' ? '#fff !important' : 'transparent !important'};
        stroke: #fff !important;
      }
    }
  }

  .icon {
    display: flex;
    align-self: center;
    justify-self: center;
  }
`

type TextOpts = { color?: string }
const Text = styled(NunitoText)<TextOpts>`
  color: ${({ color }) => (color ? color : 'inherit')} !important;
`

const IconDiv = styled.div``

export const CampaignTab = () => {
  const { chainId } = useWeb3React()

  const chainName = useMemo(() => {
    if (chainId) {
      return chainIdToBackendName(chainId).toLowerCase()
    } else {
      return null
    }
  }, [chainId])

  const campaigns = [
    {
      title: 'Airdrop',
      path: `airdrop`,
      allow: true,
      imgSrc: AnimatedCelebrateEmoji,
    },
    {
      title: 'IDO Claim',
      path: `ido-claim`,
      allow: true,
      imgSrc: AnimatedCoin3d,
    },
    {
      title: 'DERP TGE Pools',
      path: `derp-pools/${chainName}`,
      allow: true,
      imgSrc: AnimatedCelebrateEmoji,
    },
    {
      title: 'Extended Genesis Pools',
      path: `extended-genesis-pools/${chainName}`,
      allow: true,
      imgSrc: AnimatedEmoji,
    },
    {
      title: 'Loyalty Program',
      path: 'loyalty-program',
      allow: true,
      imgSrc: AnimatedDiamondShine,
    },
    {
      title: 'Genesis Pools',
      path: `genesis-pools/${chainName}`,
      allow: true,
      imgSrc: AnimatedFace,
    },
    {
      title: 'Leaderboard',
      path: 'leaderboard',
      allow: true,
      imgSrc: AnimatedClappingHand,
    },
    { title: 'Coming Soon!', path: null, allow: false },
  ]
  const [isOpen, setIsOpen] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  const navigate = useNavigate()

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [setIsOpen])

  return (
    <CampaignMenu ref={modalRef}>
      <NunitoText onClick={() => setIsOpen(!isOpen)}>Campaign</NunitoText>

      {isOpen && (
        <CampaignSubmenu id="modal-popup">
          {campaigns.length > 0 ? (
            <>
              {campaigns.map((item, index) => {
                return (
                  <Hoverable isAllowed={item.allow} key={index} onClick={() => item.path && navigate(item.path)}>
                    <RowList>
                      {item.allow ? (
                        <img
                          style={{
                            marginLeft: '-3px',
                          }}
                          src={item.imgSrc}
                          alt="derpdex-gif"
                        />
                      ) : (
                        <img src={StonedFace} alt="derpdex-stoned" />
                      )}
                      <Text>{item.title}</Text>
                    </RowList>
                  </Hoverable>
                )
              })}
            </>
          ) : (
            <NunitoText>No campaign started</NunitoText>
          )}
        </CampaignSubmenu>
      )}
    </CampaignMenu>
  )
}

interface SubMenuInterface {
  title: string
  path: string
  allow: boolean
  svg?: any
  type?: any
}
export const SwapSubMenuTab = ({ clickedExternal }: { clickedExternal: boolean }) => {
  const { chainId } = useWeb3React()
  const location = useLocation()
  const chainName = useMemo(() => {
    if (chainId) {
      return chainIdToBackendName(chainId).toLowerCase()
    } else {
      return null
    }
  }, [chainId])

  const subItems: SubMenuInterface[] = [
    {
      title: 'Swap',
      path: `swap`,
      allow: true,
      svg: <SwapIcon fill="#9B93FF" />,
      type: 'fill',
    },
    {
      title: 'Tokens',
      path: `tokens/${chainName}`,
      allow: true,
      svg: <TokensIcon fill="#9B93FF" />,
      type: 'fill',
    },
  ]

  const [isOpen, setIsOpen] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  const navigate = useNavigate()

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [setIsOpen])

  const pathName = useMemo(() => {
    const splitPath = location.pathname.split('/')
    if (splitPath[1]) return splitPath
    else return ['', 'swap']
  }, [location])

  return (
    <CampaignMenu ref={modalRef}>
      <NunitoConditional
        active={pathName && ['swap', 'tokens'].includes(pathName[1]) ? 'true' : 'false'}
        onClick={() => setIsOpen(!isOpen)}
      >
        Swap
      </NunitoConditional>

      {isOpen && (
        <CampaignSubmenu id="modal-popup" className="is-swap">
          {subItems.length > 0 && (
            <>
              {subItems.map((item, index) => {
                return (
                  <Hoverable
                    isActive={pathName && item.path.includes(pathName[1]) ? true : false}
                    isAllowed={item.allow}
                    key={index}
                    onClick={() => (item.allow ? item.path && navigate(item.path) : null)}
                  >
                    <RowListV2 active={pathName && item.path.includes(pathName[1]) ? 'true' : 'false'} type="fill">
                      {item.allow ? item.svg : <img src={StonedFace} alt="derpdex-stoned" />}
                      <Text>{item.title}</Text>
                    </RowListV2>
                  </Hoverable>
                )
              })}
            </>
          )}
        </CampaignSubmenu>
      )}
    </CampaignMenu>
  )
}

export const PoolsSubMenuTab = ({ clickedExternal }: { clickedExternal: boolean }) => {
  const { chainId } = useWeb3React()
  const location = useLocation()
  const chainName = useMemo(() => {
    if (chainId) {
      return chainIdToBackendName(chainId).toLowerCase()
    } else {
      return null
    }
  }, [chainId])

  const subItems: SubMenuInterface[] = [
    {
      title: 'Pools',
      path: `pools`,
      allow: true,
      svg: <PoolsIcon />,
      type: 'stroke',
    },
    {
      title: 'Zap To Earn',
      path: `zap-to-earn`,
      allow: true,
      svg: <ZapIcon />,
      type: 'fill',
    },
  ]

  const [isOpen, setIsOpen] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  const navigate = useNavigate()

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [setIsOpen])

  const pathName = useMemo(() => {
    const splitPath = location.pathname.split('/')
    if (splitPath[1]) return splitPath
    else return ['', 'undefined']
  }, [location])

  return (
    <CampaignMenu ref={modalRef}>
      <NunitoConditional
        active={pathName && ['pools', 'zap-to-earn'].includes(pathName[1]) ? 'true' : 'false'}
        onClick={() => setIsOpen(!isOpen)}
      >
        Pools
      </NunitoConditional>

      {isOpen && (
        <CampaignSubmenu id="modal-popup" className="is-pools">
          {subItems.length > 0 && (
            <>
              {subItems.map((item, index) => {
                return (
                  <Hoverable
                    isActive={pathName && item.path.includes(pathName[1]) ? true : false}
                    isAllowed={item.allow}
                    key={index}
                    onClick={() => (item.allow ? item.path && navigate(item.path) : null)}
                  >
                    <RowListV2 active={pathName && item.path.includes(pathName[1]) ? 'true' : 'false'} type={item.type}>
                      {item.allow ? (
                        <IconDiv className="icon">{item.svg}</IconDiv>
                      ) : (
                        <img src={StonedFace} alt="derpdex-stoned" />
                      )}
                      <Text>{item.title}</Text>
                    </RowListV2>
                  </Hoverable>
                )
              })}
            </>
          )}
        </CampaignSubmenu>
      )}
    </CampaignMenu>
  )
}

export const DerpsSubMenuTab = ({ clickedExternal }: { clickedExternal: boolean }) => {
  const { chainId } = useWeb3React()
  const location = useLocation()
  const chainName = useMemo(() => {
    if (chainId) {
      return chainIdToBackendName(chainId).toLowerCase()
    } else {
      return null
    }
  }, [chainId])

  const subItems: SubMenuInterface[] = [
    {
      title: 'xDERP',
      path: `xderp`,
      allow: true,
      svg: <PoolsIcon />,
      type: 'stroke',
    },
    {
      title: 'Yield Farming',
      path: `yield-farming/${chainName}`,
      allow: true,
      svg: <ZapIcon />,
      type: 'fill',
    },
    { title: 'Coming Soon!', path: 'unset', allow: false },
  ]

  const [isOpen, setIsOpen] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  const navigate = useNavigate()

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [setIsOpen])

  const pathName = useMemo(() => {
    const splitPath = location.pathname.split('/')
    if (splitPath[1]) return splitPath
    else return ['', 'undefined']
  }, [location])

  return (
    <CampaignMenu ref={modalRef}>
      <NunitoConditional
        active={pathName && ['xderp', 'yield-farming'].includes(pathName[1]) ? 'true' : 'false'}
        onClick={() => setIsOpen(!isOpen)}
      >
        DERP
      </NunitoConditional>

      {isOpen && (
        <CampaignSubmenu id="modal-popup" className="is-derp">
          {subItems.length > 0 && (
            <>
              {subItems.map((item, index) => {
                return (
                  <Hoverable
                    isActive={pathName && item.path.includes(pathName[1]) ? true : false}
                    isAllowed={item.allow}
                    key={index}
                    onClick={() => (item.allow ? item.path && navigate(item.path) : null)}
                  >
                    <RowListV2 active={pathName && item.path.includes(pathName[1]) ? 'true' : 'false'} type={item.type}>
                      {item.allow ? (
                        <IconDiv className="icon">{item.svg}</IconDiv>
                      ) : (
                        <img src={StonedFace} alt="derpdex-stoned" />
                      )}
                      <Text color={!item.allow ? '#d8d8d8d8' : 'inherit'}>{item.title}</Text>
                    </RowListV2>
                  </Hoverable>
                )
              })}
            </>
          )}
        </CampaignSubmenu>
      )}
    </CampaignMenu>
  )
}

export const BridgeIcon = (props: SVGProps) => (
  // eslint-disable-next-line prettier/prettier
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="2"
    stroke="#98A1C0"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
  </svg>
)

const DerpTabs = () => {
  const { chainId } = useWeb3React()
  const [activeTab, setActiveTab] = useState<string | null>(null)
  const navigate = useNavigate()

  const chainName = useMemo(() => {
    if (chainId) {
      return chainIdToBackendName(chainId).toLowerCase()
    } else {
      return null
    }
  }, [chainId])

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName)
    let clickedTabName = tabName
    if (tabName === 'tokens') {
      clickedTabName = `${clickedTabName}/${chainName}`
    }
    navigate(`/${clickedTabName}`)
  }

  const location = useLocation()

  useEffect(() => {
    if (location.pathname.split('/')[1]) {
      setActiveTab(location.pathname.split('/')[1])
    } else {
      setActiveTab('swap')
    }
  }, [location])

  return (
    <DerpTabContainer>
      <DerpTabDropdown active={activeTab && ['swap', 'tokens'].includes(activeTab) ? 'true' : 'false'} type="fill">
        <TopTabLine active={activeTab && ['swap', 'tokens'].includes(activeTab) ? 'true' : 'false'} />
        <DerpTabElement>
          <SwapIcon fill="#9B93FF" />
          {/* <NunitoText>Tokens</NunitoText> */}
          <SwapSubMenuTab clickedExternal={activeTab?.includes('swap') ? true : false} />
        </DerpTabElement>
      </DerpTabDropdown>
      <DerpTabDropdown
        active={activeTab && ['pools', 'zap-to-earn'].includes(activeTab) ? 'true' : 'false'}
        type="stroke"
      >
        <TopTabLine active={activeTab && ['pools', 'zap-to-earn'].includes(activeTab) ? 'true' : 'false'} />
        <DerpTabElement>
          <PoolsIcon />
          {/* <NunitoText>Tokens</NunitoText> */}
          <PoolsSubMenuTab clickedExternal={activeTab?.includes('pools') ? true : false} />
        </DerpTabElement>
      </DerpTabDropdown>
      <DerpTabDropdown
        active={activeTab && ['xderp', 'yield-farming'].includes(activeTab) ? 'true' : 'false'}
        type="stroke"
      >
        <TopTabLine active={activeTab && ['xderp', 'yield-farming'].includes(activeTab) ? 'true' : 'false'} />
        <DerpTabElement>
          <DerpTokenIcon />
          {/* <NunitoText>Tokens</NunitoText> */}
          <DerpsSubMenuTab clickedExternal={activeTab?.includes('xderp') ? true : false} />
        </DerpTabElement>
      </DerpTabDropdown>
      <DerpTab
        active={activeTab === 'launchpad' ? 'true' : 'false'}
        type="stroke"
        onClick={() => handleTabClick('launchpad')}
      >
        <TopTabLine active={activeTab === 'launchpad' ? 'true' : 'false'} />
        <DerpTabElement>
          <LaunchpadIcon />
          <NunitoText>Launchpad</NunitoText>
        </DerpTabElement>
      </DerpTab>
      <DerpTab active="false" type="null">
        <TopTabLine active="false" />
        <DerpTabElement>
          <CampaignIcon />
          <CampaignTab></CampaignTab>
        </DerpTabElement>
      </DerpTab>
      {/* <DerpTab
        active={activeTab === 'bridge' ? 'true' : 'false'}
        type="stroke"
        onClick={() => handleTabClick('bridge')}
      >
        <TopTabLine active={activeTab === 'bridge' ? 'true' : 'false'} />
        <DerpTabElement>
          <BridgeIcon
            fill="#FB118E"
            style={{
              width: '16px',
            }}
          />
          <NunitoText>Bridge</NunitoText>
        </DerpTabElement>
      </DerpTab> */}
      <DerpTab active="false" type="null">
        <TopTabLine active="false" />
        <DerpTabElement>
          <MenuDropdown />
        </DerpTabElement>
      </DerpTab>
    </DerpTabContainer>
  )
}

type SVGProps = React.SVGProps<SVGSVGElement> & {
  fill?: string
  height?: string | number
  width?: string | number
  gradientId?: string
}

const FlexGrid = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 4.5fr 3fr 1.8fr;
  height: 80px;

  @media only screen and (max-width: 768px) {
    grid-template-columns: 1.5fr 3fr 1.75fr;
  }
  width: 100%;
`
interface GridBorderedProps {
  isFirst?: boolean
}
const GridBordered = styled.div<GridBorderedProps>`
  border-right: 1px solid black;
  border-left: ${(props) => (props.isFirst ? 'none' : '1px solid black')};
  display: flex;
  justify-content: center;
  align-items: center;

  height: inherit;

  &.img-area {
    @media only screen and (max-width: 768px) {
      padding: 6px 12px 0px 12px;
      svg {
        max-width: 92px;
      }
    }
  }

  &.tabs {
    @media only screen and (max-width: 768px) {
      display: none;
    }
  }

  &.search-bar {
    padding: 0px 28px;
    @media only screen and (max-width: 768px) {
      padding: 0px 20px;
    }
  }

  &.web3-status {
    justify-content: space-evenly;
    @media only screen and (max-width: 768px) {
      justify-content: flex-start;
      flex-direction: column;
      margin-top: 2px;
    }
  }
`
const DerpNavbarV2 = ({ blur }: { blur: boolean }) => {
  const isNftPage = useIsNftPage()
  const sellPageState = useProfilePageState((state) => state.state)
  const navigate = useNavigate()

  return (
    <FlexGrid>
      <GridBordered className="img-area" isFirst>
        <DerpSvg
          style={{
            cursor: 'pointer',
          }}
          onClick={() => navigate('/')}
        />
      </GridBordered>
      <GridBordered className="tabs">
        <DerpTabs />
      </GridBordered>
      <GridBordered className="search-bar">
        <SearchBarV2 />
      </GridBordered>
      <GridBordered className="web3-status">
        <ChainSelector />
        <Web3Status />
      </GridBordered>
    </FlexGrid>
  )
}

export default DerpNavbarV2
