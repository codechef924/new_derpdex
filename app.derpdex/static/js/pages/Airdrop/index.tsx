import { Trace } from '@uniswap/analytics'
import { GloriaText } from 'components/CustomFonts/GloriaHallelujah'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import AirdropDerpBg from './assets/Airdrop-DERP.png'
import { AirdropBody } from './components/AirdropBody'
import { EventTimestamp } from './components/EventTimestamp'
import { useGetPhase } from './hooks/useGetPhase'
import { useGetTasks } from './hooks/useGetTasks'
import { ColFlex, ContentWrapper, PageWrapper, RowFlex, StyledGloriaCustomPhase1 } from './stylings'

const AbsoluteBgWrapper = styled.div`
  position: absolute;
  display: flex;
  width: 100%;
  justify-content: flex-end;
  overflow: hidden;
  z-index: 0;
`
const AbsoluteImg = styled.img`
  display: flex;

  right: 0;
  top: 0;

  margin-top: -34rem;
  margin-right: -8rem;

  @media only screen and (max-width: 768px) {
    max-width: 766px;
    margin-top: -27rem;
  }
`

const AirdropRewardsText = styled.img`
  max-width: 400px;
`

const TextWrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 0;
  left: 0;
  margin-top: 15%;
  margin-left: 10%;
  gap: 38px;

  @media only screen and (max-width: 768px) {
    margin-top: 12%;
    margin-left: 5%;
    gap: 22px;
  }
`

export default function Airdrop() {
  const { tasks, ETHPriceInUSD, totalAmount, totalAllocationsPhase1 } = useGetTasks()
  const { phase } = useGetPhase({
    totalAllocationsPhase1,
  })
  const navigate = useNavigate()

  useEffect(() => {
    if (phase === 2) {
      navigate('/airdrop/phase-2')
    } else if (phase === 3) {
      navigate('/airdrop/ended')
    }
  }, [phase])

  return (
    <Trace page="derpdex-airdrop" shouldLogImpression>
      <PageWrapper>
        <AbsoluteBgWrapper>
          <AbsoluteImg src={AirdropDerpBg} />
        </AbsoluteBgWrapper>
        <ContentWrapper>
          <RowFlex>
            <ColFlex margin="55px 0px 0px 0px" gap={20}>
              <ColFlex className="phase-1">
                <StyledGloriaCustomPhase1>$1,420,000</StyledGloriaCustomPhase1>
                {/* <AirdropRewardsText src={AirdropRewards} /> */}
                <GloriaText size="xxxl" weight={400}>
                  worth of DERP token to be given away
                </GloriaText>
              </ColFlex>
              <EventTimestamp totalAllocationsPhase1={totalAllocationsPhase1} />
            </ColFlex>
          </RowFlex>
          <AirdropBody tasks={tasks} totalAmount={totalAmount} ETHPriceInUSD={ETHPriceInUSD} />
        </ContentWrapper>
      </PageWrapper>
    </Trace>
  )
}
