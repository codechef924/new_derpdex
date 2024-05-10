import { useState } from 'react'
import styled from 'styled-components/macro'

const SliderContainer = styled.div`
  width: 100%;
`

const SliderRates = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: row;
    gap: 10px;
  }
`

const DualSliderArea = styled.div`
  width: 100%;
`

const BoxValue = styled.div`
  width: 191px;
  padding: 5px 10px;
  border-radius: 100px;
  background: #000;
  color: #fff;
  font-size: 16px;
  font-weight: 400;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;

  @media (max-width: 768px) {
    width: 136px;
  }
`

export default function DualSlider({ min, max, isFullRange }: { min: number; max: number; isFullRange: boolean }) {
  const [value, setValue] = useState([30, 60])
  return (
    <SliderContainer
      style={{
        marginTop: '24px',
      }}
    >
      <SliderRates>
        <BoxValue>{!isFullRange ? min : '0'}</BoxValue>
        <BoxValue>{!isFullRange ? max : '∞'}</BoxValue>
      </SliderRates>
      <DualSliderArea></DualSliderArea>
    </SliderContainer>
  )
}
