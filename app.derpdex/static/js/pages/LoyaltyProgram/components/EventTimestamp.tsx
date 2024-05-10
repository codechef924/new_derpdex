import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import { useGetEventTimestamp } from '../hooks/useGetEventTimestamp'
import { Text } from '../stylings'

const EventTimestampWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  border-radius: 24px;
  border: 2px solid #000;
  background: #fff;
  box-shadow: 4px 4px 0px 0px #000;

  width: 100%;
  max-width: 598px;

  padding: 28px 57px;

  @media only screen and (max-width: 768px) {
    max-width: 345px;
    padding: 16px 16px;
  }
`

const TimestampFlexRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;

  justify-content: space-between;
  align-items: center;
`
const TimeHolder = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const BoldText = styled(Text)`
  font-size: 48px;
  weight: 700;

  @media only screen and (max-width: 768px) {
    font-size: 20px;
  }
`

const DullText = styled(Text)`
  font-size: 28px;
  weight: 600;
  color: #afbdc8;
  @media only screen and (max-width: 768px) {
    font-size: 16px;
  }
`

const GridRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 6fr 1fr;
  width: 100%;
`

const DateRange = styled.div`
  grid-column: 2;
  justify-self: center;
`

function parseTimestamp(timestamp: number) {
  const seconds = timestamp % 60
  const minutes = Math.floor((timestamp / 60) % 60)
  const hours = Math.floor((timestamp / 3600) % 24)
  const days = Math.floor(timestamp / 86400)

  return (
    <TimestampFlexRow>
      <TimeHolder>
        <BoldText>0</BoldText>
        <DullText>DAYS</DullText>
      </TimeHolder>
      <TimeHolder>
        <BoldText>0</BoldText>
        <DullText>HOUR</DullText>
      </TimeHolder>
      <TimeHolder>
        <BoldText>0</BoldText>
        <DullText>MIN</DullText>
      </TimeHolder>
      <TimeHolder>
        <BoldText>0</BoldText>
        <DullText>SEC</DullText>
      </TimeHolder>
    </TimestampFlexRow>
  )
}

const Countdown = ({ endTimestamp }: { endTimestamp: number }) => {
  const [timeRemaining, setTimeRemaining] = useState(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeRemaining(endTimestamp - Math.floor(Date.now() / 1000))
    }, 1000)

    return () => {
      clearInterval(intervalId)
    }
  }, [endTimestamp])

  return useMemo(() => {
    return parseTimestamp(timeRemaining)
  }, [timeRemaining])
}

export const EventTimestamp = () => {
  const { weekNumber, rawEventTimestamp, derivedEventTimestamp } = useGetEventTimestamp()

  const WeekOfEvent = () => {
    return <Text weight={600}>Current: Week {weekNumber} of 53</Text>
  }
  return (
    <EventTimestampWrapper className="event-timestamp">
      <GridRow>
        <DateRange>
          <Text size="xxl" weight={700}>
            {/* {derivedEventTimestamp?.startDate} - {derivedEventTimestamp?.endDate} */}
            05 March 2024 - 11 March 2024
          </Text>
        </DateRange>
      </GridRow>
      <Text size="xxl" weight={700}>
        CURRENT EVENT ENDS IN
      </Text>
      <Countdown endTimestamp={rawEventTimestamp?.endTimestamp} />
    </EventTimestampWrapper>
  )
}
