import { Trace } from '@uniswap/analytics'
import { formatNumber, NumberType } from '@uniswap/conedison/format'
import styled from 'styled-components/macro'

import AirdropEndedBg from '../assets/Airdrop-Ended-2.png'
import { EventTimestamp } from '../components/EventTimestamp'
import { useGetPhase } from '../hooks/useGetPhase'
import { useGetTasks } from '../hooks/useGetTasks'
import { ColFlex, StyledGloriaCustom, Text } from '../stylings'
import { AirdropEndedBanner, CustomGloriaText, PageWrapper, StyledGloriaTextEnded } from './stylings'

const CenteredColFlex = styled(ColFlex)`
  width: 100%;
  justify-content: center;
  align-items: center;

  margin: -120px 0px 0px 0px !important;

  @media only screen and (max-width: 768px) {
    margin: 32px 0px 0px 0px !important;
    padding: 0px 12px !important;
    text-align: center;
  }
  z-index: 2;
`

const BannerWrapper = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: auto;
  z-index: 1;
`

const TextWrapper = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  top: 0;
  left: 0;
  margin-top: 6%;
  gap: 38px;
  width: 100%;

  @media only screen and (max-width: 768px) {
    margin-top: 1%;
    gap: 8px;
  }
`

export const AirdropEnded = () => {
  const { totalAllocationsPhase1 } = useGetTasks()
  const { remainingAmount, remainingAmountInUSD } = useGetPhase({
    totalAllocationsPhase1,
  })
  return (
    <Trace page="derpdex-airdrop-ended" shouldLogImpression>
      <PageWrapper>
        <BannerWrapper>
          <TextWrapper>
            <CustomGloriaText className="ended" color="#fff">
              Unclaimed Amount
            </CustomGloriaText>
            <StyledGloriaTextEnded>
              {formatNumber(remainingAmountInUSD, NumberType.PortfolioBalance)}
            </StyledGloriaTextEnded>
          </TextWrapper>
          <AirdropEndedBanner src={AirdropEndedBg} />
        </BannerWrapper>
        <CenteredColFlex gap={40}>
          <EventTimestamp />
          <StyledGloriaCustom size="large40" weight={400}>
            Remaining amount will be moved to DERP Foundation
          </StyledGloriaCustom>
          <Text size="x32px" weight={300}>
            Thank you for joing! Keep updated with our news and events
          </Text>
        </CenteredColFlex>
      </PageWrapper>
    </Trace>
  )
}
