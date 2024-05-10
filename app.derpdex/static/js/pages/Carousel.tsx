import GENESISPOOLBG from 'assets/images/bg/genesis-pool-bg.png'
import SWAPBG from 'assets/images/bg/swap-bg.png'
import ZAPTOEARNBG from 'assets/images/bg/Zap-to-earn.png'
import BRIDGEBG from 'assets/images/Bridge.png'
import DEFAULTBG from 'assets/images/Default-Derp-Background.png'
import LAUNCHPADBG from 'assets/images/Launchpad.png'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components/macro'

type IMGPATHPROPS = {
  IMGPATH: string
}
const CarouselContainer = styled.div<IMGPATHPROPS>`
  position: fixed;
  bottom: 0;
  margin-bottom: -1px;
  right: 0;
  width: 100vw;
  height: 100vh;
  background-image: url(${({ IMGPATH }) => IMGPATH});
  background-size: cover;
  background-position: bottom;
  background-repeat: no-repeat;
  z-index: -1;
`

const CarouselContainerUnfixed = styled.div<IMGPATHPROPS>`
  position: absolute;
  bottom: 0;
  margin-bottom: -1px;
  right: 0;
  width: 100vw;
  height: 100%;
  background-image: url(${({ IMGPATH }) => IMGPATH});
  background-size: cover;
  background-position: bottom;
  background-repeat: no-repeat;
  z-index: -1;
`

export const Carousel = () => {
  const location = useLocation()
  const [currentPage, setCurrentPage] = useState<string>()

  useEffect(() => {
    setCurrentPage(location.pathname.replaceAll('/', ''))
  }, [location.pathname])

  if (currentPage === 'swap' || currentPage === '') {
    return <CarouselContainer IMGPATH={SWAPBG}></CarouselContainer>
  } else if (currentPage === 'bridge') {
    return <CarouselContainer IMGPATH={BRIDGEBG}></CarouselContainer>
  } else if (currentPage?.includes('genesis-pools')) {
    return <CarouselContainer IMGPATH={GENESISPOOLBG}></CarouselContainer>
  } else if (currentPage?.includes('derp-pools')) {
    return <CarouselContainer IMGPATH={GENESISPOOLBG}></CarouselContainer>
  } else if (currentPage?.includes('zap-to-earn')) {
    return <CarouselContainer IMGPATH={ZAPTOEARNBG}></CarouselContainer>
  } else if (currentPage?.includes('launchpad')) {
    return <CarouselContainerUnfixed IMGPATH={LAUNCHPADBG}></CarouselContainerUnfixed>
  } else {
    return <CarouselContainer IMGPATH={DEFAULTBG}></CarouselContainer>
  }
}
