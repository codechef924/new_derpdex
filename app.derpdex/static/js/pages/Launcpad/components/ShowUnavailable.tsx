import { useWeb3React } from '@web3-react/core'
import SpaceDerp from 'assets/images/space-derp.png'
import { useToggleAccountDrawer } from 'components/AccountDrawer'
import { GloriaText } from 'components/CustomFonts/GloriaHallelujah'
import { NunitoText } from 'components/CustomFonts/Nunito'
import { ALLOWED_NETWORK_TO_SWITCH } from 'components/WrongNetworkModal'
import { SupportedChainId } from 'constants/chains'
import { useIsMobile } from 'nft/hooks'
import styled from 'styled-components'
import { switchChain } from 'utils/switchChain'

import Frame from '../assets/frame-v2.png'

const UnavailableContainer = styled.div`
  margin: 40px 0px 0px 0px;
  background: #fff;
  border: 2px solid #000;
  box-shadow: 4px 4px 0px 0px #000;
  max-width: 914px;
  width: 100%;
  border-radius: 24px;

  padding: 22px 26px;
  width: 100%;
  // min-width: 914px;
  height: 660px;
  min-height: 660px;
  padding: unset;

  overflow: hidden;
`
const BorderedContainer = styled.div`
  background: #fff;
  border: 2px solid #000;
  box-shadow: 4px 4px 0px 0px #000;
  z-index: 1;
`

const Img = styled.img`
  position: absolute;
  bottom: 0;
  left: 0;
  margin-left: 20px;
  margin-bottom: 10px;
  width: 320px;
  z-index: 2;

  @media only screen and (max-width: 768px) {
    width: 180px;
    margin-bottom: 110px;
  }
`

const ImgFrame = styled.img`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
`

const NoLaunchPadContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  width: 100%;
  height: 100%;
`

const AvailableChainContainer = styled(BorderedContainer)`
  width: 50%;
  height: 80%;
  border-radius: 16px;

  padding: 32px 32px;

  @media only screen and (max-width: 768px) {
    width: 95%;
    padding: 32px 12px;
  }
`

const ChainColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
`

const StyledChainButton = styled.div`
  display: grid;
  grid-template-columns: 0.6fr 1fr 1fr;
  align-items: center;
  border-radius: 16px;
  border: 2px solid #000;
  padding: 8px 20px;
  width: 100%;
  grid-column-gap: 16px;
  min-height: 55px;

  cursor: pointer;

  @media only screen and (max-width: 768px) {
    grid-template-columns: 0.45fr 1fr 1fr;
    padding: 8px 12px;
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

type StatusOpts = {
  isAvailable?: boolean
}
const PurpleGrid = styled.div<StatusOpts>`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 16px;
  background: ${({ isAvailable }) => (isAvailable ? '#a372ff' : '#000')};
  box-shadow: -2px 2px 0px 0px rgba(0, 0, 0, 0.16);
  color: #fff;
  padding: 2px 8px;
`

export const ShowUnavailable = ({ activeLaunchpadChains }: { activeLaunchpadChains: SupportedChainId[] }) => {
  const { chainId, account, connector } = useWeb3React()

  const isMobile = useIsMobile()

  const toggleWalletDrawer = useToggleAccountDrawer()
  const currentEnvChain =
    process.env.REACT_APP_IS_TESTSITE === 'true' ? SupportedChainId.ZKSYNC_TESTNET : SupportedChainId.ZKSYNC_MAINNET
  const currentEnvAllowedChain = ALLOWED_NETWORK_TO_SWITCH
  const changeNetworkById: (_chainId: SupportedChainId) => Promise<void> = async (_chainId: SupportedChainId) => {
    await switchChain(connector, _chainId)
  }
  return (
    <UnavailableContainer>
      <NoLaunchPadContainer>
        <ImgFrame src={Frame} />
        <Img src={SpaceDerp} />
        <GloriaText size="xxxl">No launchpad available</GloriaText>
        <AvailableChainContainer>
          <ChainColumn>
            <GloriaText size="xl" weight={500}>
              Choose other network
            </GloriaText>
            {currentEnvAllowedChain.map((i, index) => (
              <>
                <StyledChainButton key={index} onClick={() => changeNetworkById(i.chainId)}>
                  <GridEnd>
                    <ChainImage src={i.logoUrl} alt={`derpdex-${i.name}-chain`} />
                  </GridEnd>
                  <GridStart>
                    <NunitoText size="md2" weight={600}>
                      {i.name}
                    </NunitoText>
                  </GridStart>
                  <PurpleGrid isAvailable={activeLaunchpadChains.includes(i.chainId)}>
                    {activeLaunchpadChains.includes(i.chainId) ? 'Available' : 'Unavailable'}
                  </PurpleGrid>
                </StyledChainButton>
              </>
            ))}
          </ChainColumn>
        </AvailableChainContainer>
      </NoLaunchPadContainer>
    </UnavailableContainer>
  )
}
