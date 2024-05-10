import { Trace } from '@uniswap/analytics'
import GradientLink from 'assets/images/gradient-link-icon.png'
import { useIsMobile } from 'nft/hooks'

import LoyaltyProgramBannerBG from './assets/LoyaltyProgram.png'
import { ClaimOrRedeem } from './components/ClaimOrRedeem'
import { EventTimestamp } from './components/EventTimestamp'
import { LoyaltyLeaderboard } from './components/LoyaltyLeaderboard'
import {
  AboutContainer,
  ColFlex,
  FlexGrid,
  LinkImg,
  LoyaltyProgramBanner,
  MainGrid,
  PageWrapper,
  StyledGloria,
  StyledLink,
  Text,
} from './stylings'

const AboutText = () => {
  const isMobile = useIsMobile()

  return (
    <ColFlex width={isMobile ? '340px' : '480px'}>
      <StyledGloria>Loyalty Program</StyledGloria>
      <Text style={{ textAlign: 'justify' }}>
        DerpDEX’s mind-blowing loyalty program is derived from the word itself, which is to provide DERP points that is
        equivalent to claimable $DERP and xDERP incentives to our most loyal derpy traders.{' '}
      </Text>
      <br></br>
      <AboutContainer>
        <Text className="wide-area" style={{ textAlign: 'justify' }}>
          It’s on a 1:1 basis, so the DERP points you’ll receive can be exchanged with the same amount of tokens.
        </Text>
        <StyledLink>
          <StyledGloria
            onClick={() =>
              window.open(
                'https://mirror.xyz/0x44776D7E55e9D4502c3e082211e6c8B2630753bf/jkur_wi5Pqfil4DvKbLTjXrgYPKQ9yQaic42slYsaL0',
                '_blank'
              )
            }
            className="is-link"
          >
            Click here to learn more
          </StyledGloria>
          <LinkImg src={GradientLink} />
        </StyledLink>
      </AboutContainer>
    </ColFlex>
  )
}
export const LoyaltyProgram = () => {
  return (
    <Trace page="loyalty-program" shouldLogImpression>
      <PageWrapper>
        <MainGrid>
          <FlexGrid>
            <LoyaltyProgramBanner src={LoyaltyProgramBannerBG} />
            <EventTimestamp />
          </FlexGrid>
          <FlexGrid className="claim-or-redeem">
            <FlexGrid className="inner">
              <ClaimOrRedeem />
              <AboutText />
            </FlexGrid>
          </FlexGrid>
        </MainGrid>
        <LoyaltyLeaderboard />
      </PageWrapper>
    </Trace>
  )
}
