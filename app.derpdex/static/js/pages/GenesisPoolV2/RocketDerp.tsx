import DerpRocket from 'assets/images/derp-rocket.png'
import styled from 'styled-components/macro'

const AbsoluteImg = styled.div`
  z-index: 0;
  .img {
    width: 12vw;

    position: fixed;
    top: 30%;
    left: 0;
    margin-bottom: 10%;
    animation: floatAnimation 5s ease-in-out infinite alternate;

    @keyframes floatAnimation {
      0% {
        transform: translate(0, 0);
      }
      50% {
        transform: translate(0, -25px);
      }
      100% {
        transform: translate(0, 0);
      }
    }
  }
`

export const RocketDerp = () => {
  return (
    <>
      <AbsoluteImg>
        <img className="img" src={DerpRocket} alt="rocket-derp" />
      </AbsoluteImg>
    </>
  )
}
