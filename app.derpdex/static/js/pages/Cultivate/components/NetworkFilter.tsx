import { useWeb3React } from '@web3-react/core'
import Badge from 'components/Badge'
import { NunitoText } from 'components/CustomFonts/Nunito'
import { MEDIUM_MEDIA_BREAKPOINT } from 'components/Tokens/constants'
import { getChainInfo } from 'constants/chainInfo'
import { CHAIN_NAME_TO_CHAIN_ID, DERPDEX_BACKEND_CHAIN_NAMES, validateUrlChainParam } from 'graphql/data/util'
import { useOnClickOutside } from 'hooks/useOnClickOutside'
import { useRef } from 'react'
import { Check, ChevronDown, ChevronUp } from 'react-feather'
import { useNavigate, useParams } from 'react-router-dom'
import { useModalIsOpen, useToggleModal } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/reducer'
import styled, { css, useTheme } from 'styled-components/macro'
import { EllipsisStyle } from 'theme'

import { DerpFilterOption, FilterOption } from './FilterOption'

const InternalMenuItem = styled.div`
  flex: 1;
  padding: 12px 8px;
  color: ${({ theme }) => theme.textPrimary};

  :hover {
    cursor: pointer;
    text-decoration: none;
  }
`
const InternalLinkMenuItem = styled(InternalMenuItem)<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-decoration: none;
  cursor: pointer;
  border-radius: 8px;

  :hover {
    background-color: ${({ theme }) => theme.hoverState};
    text-decoration: none;
  }

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 60%;
      pointer-events: none;
    `}
`
const MenuTimeFlyout = styled.span`
  min-width: 240px;
  max-height: 350px;
  overflow: auto;
  border-radius: 8px;
  border: 2px solid #000;
  background: #fff;
  padding: 8px;
  display: flex;
  flex-direction: column;
  font-size: 16px;
  position: absolute;
  top: 48px;
  z-index: 100;
  left: 10px;
`
const StyledMenu = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
  height: 58px;
  width: 194px;
  @media only screen and (max-width: ${MEDIUM_MEDIA_BREAKPOINT}) {
    width: 50%;
  }
`

const DerpStyledMenu = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
  height: 58px;
  width: 210px;
  @media only screen and (max-width: ${MEDIUM_MEDIA_BREAKPOINT}) {
    width: 50%;
  }
`

const StyledMenuContent = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  align-items: center;
  border: none;
  font-weight: 600;
  vertical-align: middle;
`
const Chevron = styled.span<{ open: boolean }>`
  padding-top: 1px;
  color: ${({ open, theme }) => (open ? theme.accentActive : theme.textSecondary)};
`
const NetworkLabel = styled.div`
  ${EllipsisStyle}
  display: flex;
  gap: 8px;
  align-items: center;

  font-size: 16px;
  font-weight: 700;
  color: #000;
`
const Logo = styled.img`
  height: 20px;
  width: 20px;
`
const CheckContainer = styled.div`
  display: flex;
  flex-direction: flex-end;
`
const NetworkFilterOption = styled(FilterOption)`
  min-width: 156px;
`
const DerpNetworkFilterOption = styled(DerpFilterOption)`
  width: 100%;
  border-radius: 8px;
  border: 2px solid #000;
  background: #fff;
  box-shadow: -4px 4px 0px 0px #ddd3d3;
`
const Tag = styled(Badge)`
  background-color: ${({ theme }) => theme.backgroundModule};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 10px;
  opacity: 1;
  padding: 4px 6px;
`

export default function NetworkFilter() {
  const theme = useTheme()
  const node = useRef<HTMLDivElement | null>(null)
  const open = useModalIsOpen(ApplicationModal.NETWORK_FILTER)
  const toggleMenu = useToggleModal(ApplicationModal.NETWORK_FILTER)
  useOnClickOutside(node, open ? toggleMenu : undefined)
  const navigate = useNavigate()

  const { chainName } = useParams<{ chainName?: string }>()
  let chainInfo
  let currentChainName: string | undefined
  if (!chainName) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { chainId } = useWeb3React()
    chainInfo = getChainInfo(chainId || CHAIN_NAME_TO_CHAIN_ID.ZKSYNC_MAINNET)
    currentChainName = chainInfo?.label
  } else {
    const currentChainName = validateUrlChainParam(chainName)
    const chain = getChainInfo(CHAIN_NAME_TO_CHAIN_ID[currentChainName])
    chainInfo = chain
  }

  return (
    <DerpStyledMenu ref={node}>
      <DerpNetworkFilterOption
        onClick={toggleMenu}
        aria-label="networkFilter"
        active={open}
        data-testid="cultivate-network-filter-selected"
      >
        <StyledMenuContent>
          {chainInfo && (
            <NetworkLabel>
              <Logo src={chainInfo?.logoUrl} />
              <NunitoText>{chainInfo?.label}</NunitoText>
            </NetworkLabel>
          )}

          {!chainInfo && <NetworkLabel>Not Supported</NetworkLabel>}
          <Chevron open={open}>
            {open ? (
              <ChevronUp width={20} height={15} viewBox="0 0 24 20" />
            ) : (
              <ChevronDown width={20} height={15} viewBox="0 0 24 20" />
            )}
          </Chevron>
        </StyledMenuContent>
      </DerpNetworkFilterOption>
      {open && (
        <MenuTimeFlyout>
          {DERPDEX_BACKEND_CHAIN_NAMES.map((network) => {
            const chainInfo = getChainInfo(CHAIN_NAME_TO_CHAIN_ID[network])
            if (!chainInfo) return null
            return (
              <InternalLinkMenuItem
                key={network}
                data-testid={`yield-farming-network-filter-option-${network.toLowerCase()}`}
                onClick={() => {
                  navigate(`/yield-farming/${network.toLowerCase()}`)
                  toggleMenu()
                }}
              >
                <NetworkLabel>
                  <Logo src={chainInfo.logoUrl} />
                  {chainInfo.label}
                </NetworkLabel>
                {network === currentChainName && (
                  <CheckContainer>
                    <Check size={16} color={theme.accentAction} />
                  </CheckContainer>
                )}
              </InternalLinkMenuItem>
            )
          })}
        </MenuTimeFlyout>
      )}
    </DerpStyledMenu>
  )
}
