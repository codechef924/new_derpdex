import { Trans } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'
import { DDButtonPrimary } from 'components/Button'
import Column from 'components/Column'
import { NunitoText } from 'components/CustomFonts/Nunito'
import Modal from 'components/Modal'
import { BlockedIcon } from 'components/TokenSafety/TokenSafetyIcon'
import { getChainInfo } from 'constants/chainInfo'
import { isSupportedProtocolChain, SupportedChainId } from 'constants/chains'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAppDispatch } from 'state/hooks'
import { updateSelectedWallet } from 'state/user/reducer'
import styled from 'styled-components/macro'
import { ThemedText } from 'theme'
import { switchChain } from 'utils/switchChain'

const ContentWrapper = styled(Column)`
  align-items: center;
  margin: 32px;
  text-align: center;
  font-size: 12px;
  width: 100%;
`

const ChainColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
`

const StyledChainButton = styled.div`
  display: grid;
  grid-template-columns: 0.6fr 1fr;
  align-items: center;
  border-radius: 16px;
  border: 2px solid #000;
  padding: 8px 20px;
  width: 100%;
  grid-column-gap: 16px;
  min-height: 55px;

  cursor: pointer;

  @media only screen and (max-width: 768px) {
    grid-template-columns: 0.45fr 1fr;
  }

  &:hover {
    background: ${({ theme }) => theme.derpGradientPrimary};
    color: #fff;
  }
`

const GridEnd = styled.div`
  grid-column: 1;
  display: flex;
  justify-content: end;
  align-items: center;
`

const GridStart = styled.div`
  grid-column: 2;
  display: flex;
  justify-content: start;
  align-items: center;
`

const ChainImage = styled.img`
  height: 26px;
`

const ALLOWED_TESTNET = [
  {
    chainId: SupportedChainId.ZKSYNC_TESTNET,
    name: getChainInfo(SupportedChainId.ZKSYNC_TESTNET).label,
    logoUrl: getChainInfo(SupportedChainId.ZKSYNC_TESTNET).logoUrl,
  },
  {
    chainId: SupportedChainId.BASE_TESTNET,
    name: getChainInfo(SupportedChainId.BASE_TESTNET).label,
    logoUrl: getChainInfo(SupportedChainId.BASE_TESTNET).logoUrl,
  },
  {
    chainId: SupportedChainId.OPBNB_TESTNET,
    name: getChainInfo(SupportedChainId.OPBNB_TESTNET).label,
    logoUrl: getChainInfo(SupportedChainId.OPBNB_TESTNET).logoUrl,
  },
]

const ALLOWED_MAINNET = [
  {
    chainId: SupportedChainId.ZKSYNC_MAINNET,
    name: getChainInfo(SupportedChainId.ZKSYNC_MAINNET).label,
    logoUrl: getChainInfo(SupportedChainId.ZKSYNC_MAINNET).logoUrl,
  },
  {
    chainId: SupportedChainId.BASE_MAINNET,
    name: getChainInfo(SupportedChainId.BASE_MAINNET).label,
    logoUrl: getChainInfo(SupportedChainId.BASE_MAINNET).logoUrl,
  },
  {
    chainId: SupportedChainId.OPBNB_MAINNET,
    name: getChainInfo(SupportedChainId.OPBNB_MAINNET).label,
    logoUrl: getChainInfo(SupportedChainId.OPBNB_MAINNET).logoUrl,
  },
]

export const ALLOWED_NETWORK_TO_SWITCH =
  process.env.REACT_APP_IS_TESTSITE === 'true' ? ALLOWED_TESTNET : ALLOWED_MAINNET

export function WrongNetworkModal() {
  const { chainId, account, connector } = useWeb3React()
  const dispatch = useAppDispatch()
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const currentEnvChain =
    process.env.REACT_APP_IS_TESTSITE === 'true' ? SupportedChainId.ZKSYNC_TESTNET : SupportedChainId.ZKSYNC_MAINNET
  const currentEnvAllowedChain = ALLOWED_NETWORK_TO_SWITCH

  useEffect(() => {
    if (account && !isSupportedProtocolChain(chainId)) {
      setIsOpen(true)
    } else if (location.pathname !== '/bridge' && !currentEnvAllowedChain.find((c) => c.chainId === chainId)) {
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }

    if (location.pathname === '/inscriptions-bridge') {
      setIsOpen(false)
    }

    if (
      ((location.pathname === '/xderp' || location.pathname === '/derp-bridge') &&
        currentEnvAllowedChain.find((c) => c.chainId === chainId)) ||
      ((location.pathname === '/xderp' || location.pathname === '/derp-bridge') &&
        process.env.REACT_APP_IS_TESTSITE === 'true' &&
        chainId === SupportedChainId.GOERLI) ||
      ((location.pathname === '/xderp' || location.pathname === '/derp-bridge') &&
        process.env.REACT_APP_IS_TESTSITE != 'true' &&
        chainId === SupportedChainId.MAINNET)
    ) {
      setIsOpen(false)
    }
  }, [chainId, account, location])

  if (isSupportedProtocolChain(chainId) && location.pathname !== '/bridge' && chainId === currentEnvChain) return null
  if (isSupportedProtocolChain(chainId) && location.pathname !== '/bridge-inscription' && chainId === currentEnvChain)
    return null

  // const changeNetwork: () => Promise<void> = async () => {
  //   const reqiredNetwork =
  //     process.env.REACT_APP_IS_TESTSITE === 'true' ? SupportedChainId.ZKSYNC_TESTNET : SupportedChainId.ZKSYNC_MAINNET
  //   await switchChain(connector, reqiredNetwork)
  // }

  const changeNetworkById: (_chainId: SupportedChainId) => Promise<void> = async (_chainId: SupportedChainId) => {
    await switchChain(connector, _chainId)
  }

  const disconnect = () => {
    if (connector && connector.deactivate) {
      connector.deactivate()
    }
    connector.resetState()
    dispatch(updateSelectedWallet({ wallet: undefined }))
  }

  const ethXDerpNetwork = () => {
    if (
      (location.pathname === '/xderp' || location.pathname === '/derp-bridge') &&
      process.env.REACT_APP_IS_TESTSITE != 'true'
    ) {
      return (
        <StyledChainButton onClick={() => changeNetworkById(SupportedChainId.MAINNET)}>
          <GridEnd>
            <ChainImage src={getChainInfo(SupportedChainId.MAINNET).logoUrl} alt="derpdex-mainnet-chain" />
          </GridEnd>
          <GridStart>
            <NunitoText size="md2" weight={600}>
              {getChainInfo(SupportedChainId.MAINNET).label}
            </NunitoText>
          </GridStart>
        </StyledChainButton>
      )
    } else if (
      (location.pathname === '/xderp' || location.pathname === '/derp-bridge') &&
      process.env.REACT_APP_IS_TESTSITE === 'true'
    ) {
      return (
        <StyledChainButton onClick={() => changeNetworkById(SupportedChainId.GOERLI)}>
          <GridEnd>
            <ChainImage src={getChainInfo(SupportedChainId.GOERLI).logoUrl} alt="derpdex-goerli-chain" />
          </GridEnd>
          <GridStart>
            <NunitoText size="md2" weight={600}>
              {getChainInfo(SupportedChainId.GOERLI).label}
            </NunitoText>
          </GridStart>
        </StyledChainButton>
      )
    }

    return null
  }

  return (
    <Modal isOpen={isOpen}>
      <ContentWrapper>
        <ThemedText.DeprecatedLargeHeader lineHeight={2} marginBottom={1} marginTop={1}>
          <Trans>Unsupported Network</Trans>
        </ThemedText.DeprecatedLargeHeader>
        <div style={{ textAlign: 'center' }}>
          <BlockedIcon size="80px" />
        </div>
        <ThemedText.DeprecatedMain fontSize={14} marginBottom={12}>
          <Trans>You are in an Unsupported chain. Please Switch network to continue</Trans>.
        </ThemedText.DeprecatedMain>
        {/* <DDButtonPrimary onClick={changeNetwork} style={{ margin: '4px 0 0 0' }}>
          <ThemedText.SubHeaderSmall style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>
            <Trans>Switch Network</Trans>
          </ThemedText.SubHeaderSmall>
        </DDButtonPrimary> */}

        <ChainColumn style={{ marginTop: '4px' }}>
          {(location.pathname === '/xderp' || location.pathname === '/derp-bridge') && ethXDerpNetwork()}
          {currentEnvAllowedChain.map((i, index) => (
            <StyledChainButton key={index} onClick={() => changeNetworkById(i.chainId)}>
              <GridEnd>
                <ChainImage src={i.logoUrl} alt={`derpdex-${i.name}-chain`} />
              </GridEnd>
              <GridStart>
                <NunitoText size="md2" weight={600}>
                  {i.name}
                </NunitoText>
              </GridStart>
            </StyledChainButton>
          ))}
        </ChainColumn>

        <DDButtonPrimary onClick={disconnect} style={{ margin: '8px 0 0 0' }}>
          <ThemedText.SubHeaderSmall style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>
            <Trans>Disconnect Wallet</Trans>
          </ThemedText.SubHeaderSmall>
        </DDButtonPrimary>
      </ContentWrapper>
    </Modal>
  )
}
