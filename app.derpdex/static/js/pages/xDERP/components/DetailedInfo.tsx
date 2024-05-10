/* eslint-disable import/no-unused-modules */
import { useAtom } from 'jotai'
import { useAtomValue } from 'jotai/utils'
import { allocationInfoJotai } from 'pages/Cultivate/hooks/useUserPositionAllocation'
import { derivedPositionsAtom } from 'pages/Cultivate/state/search.state'
import { useMemo } from 'react'
import styled from 'styled-components'

import RoundedDerp from '../assets/Rounded-Derp.png'
import RoundedDerpina from '../assets/Rounded-Derpina.png'
import RoundedDerpThumbsUp from '../assets/Rounded-DerpThumbsUp.png'
import { balanceAtom } from '../hooks/useAvailableDerpBalance'
import { redeemingXDerpAtom } from '../hooks/useFinalizeRedeems'
import { ColFlex, RowFlex, Text } from '../stylings'
const FlexContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(306px, 0fr));
  gap: 25px;

  @media only screen and (max-width: 768px) {
    margin-top: 25px;
    grid-template-columns: unset;
  }
`

const ComponentContainer = styled.div`
  display: flex;
  flex-direction: columhn;
  justify-content: space-between;
  align-items: center;
  border-radius: 16px;
  border: 2px solid #000;
  background: #fff;
  box-shadow: 3px 3px 0px 0px #000;

  padding: 16px 28px;
  width: 306px;
  @media only screen and (max-width: 768px) {
    width: 100%;
  }
`

const RoundedImg = styled.img``

const StyledText = styled(Text)`
  background: ${({ theme }) => theme.derpGradientPrimary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 600;
  cursor: pointer;
`

const TotalDERP = () => {
  const balance = useAtomValue(balanceAtom)
  return (
    <ComponentContainer>
      <RowFlex style={{ justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
        <RoundedImg src={RoundedDerp} />
        <ColFlex gap={6} style={{ alignItems: 'flex-end' }}>
          <Text size="lg" weight={700}>
            Your Total DERP
          </Text>
          <StyledText size="xxl" weight={700}>
            {balance.DERP.toFixed(2)}
          </StyledText>
        </ColFlex>
      </RowFlex>
    </ComponentContainer>
  )
}

const StakedXDERP = () => {
  const derivedPositionsState = useAtomValue(derivedPositionsAtom)

  const totalStakedPositions = useMemo(() => {
    let total = 0

    if (derivedPositionsState) {
      for (const poolAddress in derivedPositionsState) {
        if (derivedPositionsState[poolAddress]['Staked']) {
          total += derivedPositionsState[poolAddress]['Staked'].length
        }
      }
    }
    return total
  }, [derivedPositionsState])

  const allocationInfoState = useAtomValue(allocationInfoJotai)

  const balanceState = useAtomValue(balanceAtom)

  const totalAllocation = useMemo(() => {
    let allocations = 0
    for (const poolAddress in allocationInfoState) {
      for (const poolId in allocationInfoState[poolAddress]) {
        allocations += parseFloat(allocationInfoState[poolAddress][poolId].allocatedAmount)
      }
    }

    return allocations
  }, [allocationInfoState])

  return (
    <ComponentContainer>
      <RowFlex style={{ justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
        <RoundedImg src={RoundedDerpina} />
        <ColFlex gap={6} style={{ alignItems: 'flex-end' }}>
          <Text size="lg" weight={700}>
            Your Total xDERP
          </Text>
          <StyledText size="xxl" weight={700}>
            {Math.floor((totalAllocation + balanceState.XDERP) * 10000) / 10000}
          </StyledText>
        </ColFlex>
      </RowFlex>
    </ComponentContainer>
  )
}

const RedeemingXDERP = () => {
  const [redeemingState, setRedeemingState] = useAtom(redeemingXDerpAtom)
  return (
    <ComponentContainer>
      <RowFlex style={{ justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
        <RoundedImg src={RoundedDerpThumbsUp} />
        <ColFlex gap={6} style={{ alignItems: 'flex-end' }}>
          <Text size="lg" weight={700}>
            Redeeming xDERP
          </Text>
          <StyledText size="xxl" weight={700}>
            {redeemingState}
          </StyledText>
        </ColFlex>
      </RowFlex>
    </ComponentContainer>
  )
}
export const DetailedInfo = () => {
  return (
    <FlexContainer>
      <TotalDERP />
      <StakedXDERP />
      <RedeemingXDERP />
    </FlexContainer>
  )
}
