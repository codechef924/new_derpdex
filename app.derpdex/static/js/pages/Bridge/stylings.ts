import { DDButtonGradient } from 'components/Button'
import { GloriaText } from 'components/CustomFonts/GloriaHallelujah'
import styled from 'styled-components'

export const DepositOrWithdrawBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;

  border-radius: 24px;
  border: 4px solid #000;
  background: #fff;
  box-shadow: 3px 3px 0px 0px #000;

  padding: 36px;

  @media only screen and (max-width: 768px) {
    padding: 16px;
  }
`

export const ExtGloriaText = styled(GloriaText)`
  font-size: 60px;
  background: var(--primary-gradient-lr, linear-gradient(270deg, #46c9d2 0%, #a372ff 100%));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  text-align: center;
  margin: 22px 0 22px 0;

  @media only screen and (max-width: 768px) {
    font-size: 42px;
    margin: 22px 0 10px 0;
  }
`

export const BalanceMaxBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 6px 16px;
`

export const BalanceEstimate = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 6px 16px;
`

export const EstimateFeeText = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  color: #98a1c0;

  text-align: right;
`

export const BlurredBalance = styled.div`
  font-size: 16px;
  color: #afbdc8;
  font-weight: 500;
`
export const MaxButton = styled.div`
  font-size: 16px;
  font-weight: 600;
  background: ${({ theme }) => theme.derpGradientPrimary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-fill-color: transparent;
  cursor: pointer;
`

export const StyledInput = styled.input`
  background: rgba(239, 239, 239, 0.3);
  border-radius: 8px;
  font-size: 16px;
  font-weight: 400;
  padding: 10px 20px;
  border: 2px solid #efefef;
  width: 100%;
`

export const InvalidTextWrapper = styled.div`
  font-size: 16px;
  color: red;
`

export const ColFlex = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 8px;
`

export const BridgeSelectColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;

  width: 100%;
`

export const TokenToBridge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  position: relative;
  cursor: pointer;
  border: 2px solid rgb(236 234 234);
  padding: 6px 8px;
  background: #e8eef2;
  border-radius: 100px;

  &:hover {
    background: ${({ theme }) => theme.derpGradientPrimary};
  }

  .token-style {
    font-weight: 600 !important;
  }
`

export const DepoitOrWithdrawToAnotherWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 12px;
  margin-top: 21px;
  cursor: pointer;

  padding: 8px 12px;
  border-radius: 8px;
  background: #f0f0f0;
`

type BTNState = {
  isLoading?: boolean
}
export const OverridedBridgeButton = styled(DDButtonGradient)<BTNState>`
  width: 100%;
  max-width: 100%;
  min-height: 70px;
  margin-top: 27px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px;

  border-radius: 16px;
  border: 2px solid #000;
  box-shadow: 3px 3px 0px 0px #000;

  text-transform: uppercase;
`

export const ListOfClaimmableBody = styled.div`
  border-radius: 24px;
  border: 4px solid #000;
  background: #fff;
  box-shadow: 3px 3px 0px 0px #000;
  padding: 22px 21px;
`

export const ListOfDepositStatus = styled(ListOfClaimmableBody)`
  width: 100%;
`

export const RowOfClaimmable = styled.div`
  display: grid;
  grid-template-columns: 0.3fr 1fr 1fr 1fr;
  @media only screen and (max-width: 768px) {
    grid-template-columns: 0.4fr 1fr 1fr 1.6fr;
  }
  align-items: center;
  width: 100%;

  grid-row-gap: 15px;

  .grid-3,
  .grid-4 {
    justify-self: end;
  }

  .text {
    font-weight: 600;
  }
`

export const RowOfDepositStatus = styled.div`
  display: grid;
  grid-template-columns: 0.3fr 1fr 1fr;
  @media only screen and (max-width: 768px) {
    grid-template-columns: 0.4fr 1fr 1fr;
  }
  align-content: center;
  align-items: center;
  width: 100%;

  grid-row-gap: 15px;

  .grid-state {
    justify-self: end;

    svg {
      width: 20px;
      height: 20px;
    }

    svg.is-success {
      cursor: pointer;
    }
  }

  .grid-3,
  .grid-4 {
    justify-self: end;
  }

  .grid-4 {
    svg {
      cursor: pointer;
      fill: red;
    }

    .is-disabled {
      svg {
        cursor: wait !important;
        fill: gray;
      }
    }
  }

  .text {
    font-weight: 600;
    d
  }
`

export const FixedHeight = styled.div`
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  padding-right: 6px;

  ::-webkit-scrollbar {
    width: 3px; /* Width of the scrollbar */
  }

  /* The thumb is the draggable handle of the scrollbar */
  ::-webkit-scrollbar-thumb {
    background-color: black; /* Color of the thumb (the handle) */
  }

  /* The track is the area behind the thumb */
  ::-webkit-scrollbar-track {
    background-color: transparent; /* Transparent background for the track */
  }
`

type IsClaimmable = {
  isClaimable: boolean
}
export const ClaimBtn = styled.div<IsClaimmable>`
  height: 37px;
  width: 118px;
  border-radius: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid #000;
  background: ${({ isClaimable }) =>
    isClaimable ? 'var(--primary-gradient-lr, linear-gradient(270deg, #46c9d2 0%, #a372ff 100%))' : '#DDD3D3'};
  color: ${({ isClaimable }) => (isClaimable ? 'white' : 'black')};

  cursor: ${({ isClaimable }) => (isClaimable ? 'pointer' : 'progress')};
  box-shadow: 2px 2px 0px 0px #000;
`

export const AlertBox = styled.div`
  border-radius: 12px;
  border: 4px solid #000;
  background: #fff;
  box-shadow: 3px 3px 0px 0px #000;

  @media only screen and (max-width: 640px) {
    margin-bottom: 58px !important;
  }
  .is-error {
    background: rgb(250 124 124);
    color: #fff;
    font-weight: 600;
  }

  .is-success {
    background: var(--primary-gradient-lr, linear-gradient(270deg, #46c9d2 0%, #a372ff 100%));
    color: #fff;
    font-weight: 600;

    a {
      color: #6bff00;
    }
  }
`

export const ModalComponent = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  border-radius: 12px;
  border: 4px solid #000;
  background: #fff;
  box-shadow: 3px 3px 0px 0px #000;

  @media only screen and (max-width: 768px) {
    width: 95%;
    height: 270px;
  }

  .content {
    position: relative;
    height: 100%;
  }

  .text-area {
    text-align: center;
    padding: 12px 18px 0px 18px;
    span {
      color: red;
      text-decoration: underline;
    }
  }

  .absolute-derp {
    // position: absolute;
    margin-bottom: -18px;

    @media only screen and (max-width: 768px) {
      margin-top: 10px;
    }
    // left: 0;
    width: 100%;
    display: flex;
    justify-content: center;

    svg {
      width: 140px;
      height: auto;
    }
  }
`
