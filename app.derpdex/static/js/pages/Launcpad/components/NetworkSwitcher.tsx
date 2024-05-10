/* eslint-disable import/no-unused-modules */
import { Trans } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'
import CloseButtonIcon from 'assets/images/close-button.png'
import Column from 'components/Column'
import { NunitoText } from 'components/CustomFonts/Nunito'
import Modal from 'components/Modal'
import Row from 'components/Row'
import { BlockedIcon } from 'components/TokenSafety/TokenSafetyIcon'
import { getChainInfo } from 'constants/chainInfo'
import { SupportedChainId } from 'constants/chains'
import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { ThemedText } from 'theme'
import { switchChain } from 'utils/switchChain'
const ContentWrapper = styled(Column)`
  align-items: center;
  margin: 32px;
  text-align: center;
  font-size: 12px;
  width: 100%;
  max-width: 350px;
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

const RowBetween = styled(Row)`
  justify-content: space-between;
  gap: 12px;
`
const CloseButtonContainer = styled.div`
  position: relative;
`

const CloseButton = styled.img`
  position: absolute;
  top: -50px;
  right: -50px;
  width: 40px;
  height: 40px;
  cursor: pointer;
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

export const NetworkSwitcher = ({
  chainIdsToSwitch,
  openNetworkModal,
}: {
  chainIdsToSwitch: number[]
  openNetworkModal: boolean
}) => {
  const { connector } = useWeb3React()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (openNetworkModal) setIsOpen(true)
    else setIsOpen(false)
  }, [openNetworkModal])

  const resolvedChainIds = useMemo(() => {
    return ALLOWED_NETWORK_TO_SWITCH.filter((obj) => chainIdsToSwitch.includes(obj.chainId))
  }, [chainIdsToSwitch])

  const changeNetworkById: (_chainId: SupportedChainId) => Promise<void> = async (_chainId: SupportedChainId) => {
    await switchChain(connector, _chainId)
  }

  const onDismiss = () => {
    if (isOpen) {
      setIsOpen(false)
    } else {
      setIsOpen(true)
    }
  }

  return (
    <Modal isOpen={isOpen} $scrollOverlay={true}>
      <ContentWrapper>
        <RowBetween>
          <div />
          <CloseButtonContainer>
            <CloseButton onClick={() => onDismiss()} src={CloseButtonIcon} alt="close-button" />
          </CloseButtonContainer>
        </RowBetween>
        <ThemedText.DeprecatedLargeHeader lineHeight={2} marginBottom={1} marginTop={1}>
          <Trans>Claimable Network</Trans>
        </ThemedText.DeprecatedLargeHeader>
        <div style={{ textAlign: 'center' }}>
          <BlockedIcon size="80px" />
        </div>
        <ThemedText.DeprecatedMain fontSize={14} marginBottom={12}>
          <Trans>Your allocation in not in Current Network. Please Switch network to continue</Trans>.
        </ThemedText.DeprecatedMain>
        <ChainColumn style={{ marginTop: '4px' }}>
          {resolvedChainIds.map((i, index) => (
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
      </ContentWrapper>
    </Modal>
  )
}
