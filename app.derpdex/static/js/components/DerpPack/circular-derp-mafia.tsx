/* eslint-disable import/no-unused-modules */
import DerpLoader from 'assets/images/derp-circle.png'
import styled from 'styled-components'
const ImgContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  @media only screen and (max-width: 768px) {
    img {
      width: 200px;
    }
  }
`

const Pulsable = styled.div`
  position: absolute;
  border-radius: 50%;
  width: 500px;
  height: 500px;

  @media only screen and (max-width: 768px) {
    width: 300px;
    height: 300px;
  }

  border: 12px solid black;
  animation: pulse 2.5s infinite;
  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }
`

export const DerpCicularLoading = () => {
  return (
    <ImgContainer>
      <Pulsable className="pulse-image"></Pulsable>
      <img src={DerpLoader} />
    </ImgContainer>
  )
}
