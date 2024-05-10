/* eslint-disable import/no-unused-modules */
import { GloriaText } from 'components/CustomFonts/GloriaHallelujah'
import { NunitoText } from 'components/CustomFonts/Nunito'
import { useIsMobile } from 'nft/hooks'
import { Initializer } from 'pages/Cultivate/hooks/Initializer'
import styled from 'styled-components'

import DerpSplurt from './assets/Derp-Splurt.png'
import DerpSlurtMobile from './assets/Derp-Splurt-Mobile.png'
import { Allocation } from './components/Allocations'
import { AvailableRedeems } from './components/AvailableRedeems'
import { ConvertOrRedeem } from './components/ConvertOrRedeem'
import { DetailedInfo } from './components/DetailedInfo'
import { GridItem, MainGrid, PageImg, PageWrapper } from './stylings'

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
  justify-content: center;
  align-items: center;
  color: #fff;

  @media only screen and (max-width: 768px) {
    align-items: center;
  }
`

const BoundedText = styled.div`
  height: 60px;
  display: flex;
  align-items: flex-end;
  gap: 18px;

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
export const XDERP = () => {
  const isMobile = useIsMobile()
  return (
    <PageWrapper isTestsite={process.env.REACT_APP_IS_TESTSITE === 'true' ? true : false}>
      {isMobile ? (
        <PageImg src={DerpSlurtMobile} />
      ) : (
        <WrappedImgText>
          <PageImg src={DerpSplurt} />
          <AbsoluteTextPlacement>
            <BoundedText>
              <GloriaText style={{ fontSize: '4.167vw' }} weight={400}>
                xDERP
              </GloriaText>
              <NunitoText className="secondary-text" style={{ fontSize: '2.222vw' }} weight={700}>
                Dashboard
              </NunitoText>
            </BoundedText>
          </AbsoluteTextPlacement>
        </WrappedImgText>
      )}

      <MainGrid>
        <GridItem gap={36} direction="column">
          <ConvertOrRedeem />
          <AvailableRedeems />
          {/* <Vesting /> */}
        </GridItem>
        <GridItem gap={isMobile ? 40 : 70} direction="column">
          <DetailedInfo />
          <Allocation />
        </GridItem>
      </MainGrid>
      <Initializer />
    </PageWrapper>
  )
}
