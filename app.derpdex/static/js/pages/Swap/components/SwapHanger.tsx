import styled from 'styled-components'

const Wrapper = styled.div`
  width: 100%;
  // background-color: red;
  height: 24px;
  position: absolute;
  max-width: 521px;
  display: flex;
  justify-content: space-around;
  padding: 0px 73px;

  @media only screen and (min-width: 768px) and (max-width: 1600px) {
    max-width: 400px;
    padding: 0px 42px;
  }
`

const Hanger = styled.div`
  width: 100%;
  background-color: black;
  height: 100%;
  border: 8px solid black;
  background: transparent;
  border-top: none;
  border-bottom: none;
`

export const SwapHanger = () => {
  return (
    <Wrapper>
      <Hanger />
    </Wrapper>
  )
}
