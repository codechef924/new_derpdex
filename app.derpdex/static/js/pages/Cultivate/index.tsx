import { GloriaText } from 'components/CustomFonts/GloriaHallelujah'
import { NunitoText } from 'components/CustomFonts/Nunito'
import { useIsMobile } from 'nft/hooks'
import { useAvailableDerpBalance } from 'pages/xDERP/hooks/useAvailableDerpBalance'
import styled from 'styled-components'

import CultivateBG from './assets/Cultivate.png'
import YieldFarmingMobile from './assets/Yield-Farming-Mobile.png'
import { Table } from './components/Table'
import { MainGrid, PageImg, PageWrapper } from './stylings'
const WrappedImgText = styled.div`
  position: relative; /* Set the parent to relative */
  width: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
`

const AbsoluteTextPlacement = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: inherit;
  height: 100%;
  display: flex;
  // justify-content: center;
  color: #fff;
  margin-top: 6.6vh;
  margin-left: 4.7vw;
`

const BoundedText = styled.div`
  height: 66px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;

  @media only screen and (max-width: 768px) {
    height: 34px;
    gap: 8px;
    margin-top: -14px;
  }

  .secondary-text {
    margin-bottom: 28px;
    @media only screen and (max-width: 768px) {
      margin-bottom: 11px;
    }
  }
`

const ReadMore = styled.span`
  text-decoration: underline;
  cursor: pointer;
`

export const Cultivate = () => {
  useAvailableDerpBalance()
  const isMobile = useIsMobile()
  return (
    <PageWrapper>
      {isMobile ? (
        <PageImg src={YieldFarmingMobile} alt="yield-farming-derpdex" />
      ) : (
        <WrappedImgText>
          <PageImg src={CultivateBG} />
          <AbsoluteTextPlacement>
            <BoundedText>
              <GloriaText style={{ lineHeight: '4.167vw' }} size="large60" weight={400}>
                Yield Farming
              </GloriaText>
              <NunitoText size="xxl" weight={600}>
                Stake LP tokens to earn.{' '}
                <ReadMore
                  onClick={() =>
                    window.open(
                      'https://mirror.xyz/0x44776D7E55e9D4502c3e082211e6c8B2630753bf/GWHgfo3BIoyalT_CfGfoPyZrJNf-8oxh7ZL2XlyVbKs',
                      '_blank'
                    )
                  }
                >
                  Read More
                </ReadMore>
              </NunitoText>
            </BoundedText>
          </AbsoluteTextPlacement>
        </WrappedImgText>
      )}
      <MainGrid>
        <Table />
      </MainGrid>
    </PageWrapper>
  )
}
