import * as d3 from 'd3'
import { useMemo } from 'react'
import styled from 'styled-components'

import { ExtendedRedeem, useFinalizeRedeems, useGetAvailableForRedeems } from '../hooks/useFinalizeRedeems'
import { ColFlex, RowFlex, Text } from '../stylings'
const Container = styled.div`
  max-width: 406px;
  flex-shrink: 0;

  padding: 32px 23px;

  border-radius: 24px;
  border: 2px solid #fff;
  background: linear-gradient(0deg, #0f1f20 1.71%, rgba(17, 9, 31, 0.75) 97.26%);
  box-shadow: 4px 4px 0px 2px #000;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`
const RedeemList = styled(ColFlex)`
  > *:not(:last-child) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  }
`

const RedeemableInfo = styled(RowFlex)`
  justify-content: space-between;
  align-items: center;

  padding: 8px 0px;
`

type ItemOpts = {
  disabled?: boolean
}
const DarkItemBordered = styled.div<ItemOpts>`
  display: flex;
  align-items: center;
  height: 32px;

  padding: 8px 12px;

  border-radius: 100px;
  background: ${({ disabled }) => (disabled ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.7)')};
  backdrop-filter: blur(2px);
  white-space: nowrap;

  cursor: ${({ disabled }) => (disabled ? 'initial' : 'pointer')};

  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'all')};

  * {
    color: ${({ disabled }) => (disabled ? 'rgba(255, 255, 255, 0.50)' : '#fff')};
  }
`

const DURATION_TO_RATIO: { [key: string]: string } =
  process.env.REACT_APP_IS_TESTSITE === 'true'
    ? {
        ['30']: '1:0.42',
        ['120']: '1:1',
      }
    : {
        ['2073600']: '1:0.42',
        ['8294400']: '1:1',
      }
const RedeemsToFinalize = ({ redeemableItem }: { redeemableItem: ExtendedRedeem }) => {
  const { actionType, finalizeRedeem } = useFinalizeRedeems({
    redeemIndex: redeemableItem.redeemIndex,
    blockTimestamp: redeemableItem.redeemIndex,
  })

  const formattedDateTime = useMemo(() => {
    const date = new Date(parseInt(redeemableItem.blockTimestamp) * 1000) // Convert to milliseconds by multiplying by 1000
    const formattedDate = d3.timeFormat('%m/%d/%Y')(date)
    return formattedDate
  }, [redeemableItem.blockTimestamp])

  const durationRatio = useMemo(() => {
    const ratioText = DURATION_TO_RATIO[redeemableItem.duration]
      ? DURATION_TO_RATIO[redeemableItem.duration]
      : 'UNKNOWN'
    return ratioText
  }, [redeemableItem.duration])
  return (
    <RedeemableInfo>
      <ColFlex gap={2}>
        <Text color="rgba(255, 255, 255, 0.70)" size="md2" weight={500}>
          {formattedDateTime} - {durationRatio}
        </Text>
        <Text color="#fff" size="lg" weight={500}>
          Exchanged: {redeemableItem.amount} xDERP
        </Text>
      </ColFlex>
      <DarkItemBordered onClick={finalizeRedeem} disabled={redeemableItem.disableFinalize}>
        <Text color="#fff">{actionType}</Text>
      </DarkItemBordered>
    </RedeemableInfo>
  )
}

export const AvailableRedeems = () => {
  const { derivedRedeems, fetchRedeems, resolveTillIndexed } = useGetAvailableForRedeems()

  return (
    <>
      {derivedRedeems && derivedRedeems.length > 0 && (
        <Container>
          <ColFlex gap={4}>
            <Text color="#fff" size="xxl" weight={700}>
              Vesting
            </Text>
            <Text color="#fff" size="lg2" weight={500}>
              xDERP can be vested for 24 days and redeem at 0.42:1 for DERP, Or fully vested for 96 days for DERP
            </Text>
          </ColFlex>
          <ColFlex gap={4}></ColFlex>
          <RedeemList margin="12px 0px 0px 0px">
            {derivedRedeems.map((redeem, index) => (
              <RedeemsToFinalize key={redeem.redeemIndex} redeemableItem={redeem} />
            ))}
          </RedeemList>
        </Container>
      )}
    </>
  )
}
