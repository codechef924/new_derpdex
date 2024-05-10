import SpaceShipDerp from 'assets/images/derp-in-ship.png'
import SpaceDerp from 'assets/images/space-derp.png'
import styled from 'styled-components'

const AbsoluteImg = styled.div`
  z-index: 0;
  .img1 {
    width: 22vw;

    position: fixed;
    bottom: 0;
    left: 0;
    margin-left: 2%;
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

  .img2 {
    width: 22vw;

    position: fixed;
    top: 30%;
    left: -100px;
    transform: translateY(-50%);
    animation: flyAnimation 10s linear infinite;

    @keyframes flyAnimation {
      0% {
        transform: translateY(-50%) translateX(-100px);
      }
      100% {
        transform: translateY(-50%) translateX(calc(100vw + 100px));
      }
    }
  }
`

export const DerpNimate = () => {
  return (
    <>
      <AbsoluteImg>
        <img className="img1" src={SpaceDerp} alt="space-derp" />
      </AbsoluteImg>
      <AbsoluteImg>
        <img className="img2" src={SpaceShipDerp} alt="derp-in-space" />
      </AbsoluteImg>
    </>
  )
}
