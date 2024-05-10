import { LinearProgress, linearProgressClasses } from '@mui/material'
import { styled as muiStyled } from '@mui/material/styles'
import { formatNumber, NumberType } from '@uniswap/conedison/format'
import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components/macro'

import { useGetPhase } from '../hooks/useGetPhase'
import { ColFlex, RowFlex, Text } from '../stylings'

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

const isValidTime = (value: number) => {
  if (value < 0) return 0
  else return value
}

function parseTimestamp(timestamp: number) {
  const seconds = timestamp % 60
  const minutes = Math.floor((timestamp / 60) % 60)
  const hours = Math.floor((timestamp / 3600) % 24)
  const days = Math.floor(timestamp / 86400)

  return (
    <TimestampFlexRow>
      <TimeHolder>
        <BoldText>{isValidTime(days)}</BoldText>
        <DullText>DAYS</DullText>
      </TimeHolder>
      <TimeHolder>
        <BoldText>{isValidTime(hours)}</BoldText>
        <DullText>HOUR</DullText>
      </TimeHolder>
      <TimeHolder>
        <BoldText>{isValidTime(minutes)}</BoldText>
        <DullText>MIN</DullText>
      </TimeHolder>
      <TimeHolder>
        <BoldText>{isValidTime(seconds)}</BoldText>
        <DullText>SEC</DullText>
      </TimeHolder>
    </TimestampFlexRow>
  )
}

function parseTimestampHorizontal(timestamp: number) {
  const seconds = timestamp % 60
  const minutes = Math.floor((timestamp / 60) % 60)
  const hours = Math.floor((timestamp / 3600) % 24)
  const days = Math.floor(timestamp / 86400)

  return (
    <TimestampFlexRow>
      <Text className="timestamp" weight={700} color="#A372FF">
        {isValidTime(days)} Days
      </Text>
      <Text className="timestamp" weight={700} color="#A372FF">
        {isValidTime(hours)} Hours
      </Text>
      <Text className="timestamp" weight={700} color="#A372FF">
        {isValidTime(minutes)} Mins
      </Text>
      <Text className="timestamp" weight={700} color="#A372FF">
        {isValidTime(seconds)} Sec
      </Text>
    </TimestampFlexRow>
  )
}

const Countdown = ({ endTimestamp, isAirdropStarted }: { endTimestamp: number; isAirdropStarted?: boolean }) => {
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
    if (!isAirdropStarted) {
      return parseTimestamp(timeRemaining)
    } else {
      return parseTimestampHorizontal(timeRemaining)
    }
  }, [timeRemaining, isAirdropStarted])
}

const BorderLinearProgress = muiStyled(LinearProgress)(({ theme }) => ({
  width: 'inherit',
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    background: theme.palette.mode === 'light' ? 'linear-gradient(270deg, #46C9D2 0%, #A372FF 100%)' : '#308fe8',
  },
}))

const TimeLeftRowFlex = styled(RowFlex)`
  max-width: 638px;
  gap: 8px;

  align-items: flex-end;
  margin-top: 30px;

  @media only screen and (max-width: 768px) {
    margin-top: 8px;
    flex-direction: column;
    align-items: center;
  }
`

export const EventTimestamp = ({ totalAllocationsPhase1 }: { totalAllocationsPhase1?: string }) => {
  const { phase1StartTimestamp, phase1EndTimestamp, totalClaimedPhase1, totalClaimedPhase1InPercent } = useGetPhase({
    totalAllocationsPhase1,
  })

  const airdropStarted = useMemo(() => {
    return Date.now() / 1000 > phase1StartTimestamp
  }, [phase1StartTimestamp])

  const isEnded = useMemo(() => {
    return Date.now() / 1000 > phase1EndTimestamp
  }, [phase1EndTimestamp])

  return (
    <>
      <EventTimestampWrapper className="event-timestamp">
        <>
          {!isEnded ? (
            <>
              {airdropStarted ? (
                <>
                  <ColFlex gap={8}>
                    <RowFlex style={{ justifyContent: 'flex-end' }}>
                      <Text size="xxl" weight={700}>
                        {formatNumber(totalClaimedPhase1, NumberType.TokenNonTx)} DERP has been collected
                      </Text>
                    </RowFlex>
                    <BorderLinearProgress variant="determinate" value={totalClaimedPhase1InPercent} />
                  </ColFlex>
                </>
              ) : (
                <>
                  <GridRow>
                    <DateRange>
                      <Text size="xxl" weight={700}>
                        AIRDROPPING IN
                      </Text>
                    </DateRange>
                  </GridRow>
                  <Countdown endTimestamp={phase1StartTimestamp} />
                </>
              )}
            </>
          ) : (
            <>
              <GridRow>
                <DateRange>
                  <Text size="xxl" weight={700}>
                    EVENT HAS ENDED
                  </Text>
                </DateRange>
              </GridRow>
              <Countdown endTimestamp={phase1EndTimestamp} />
            </>
          )}
        </>
      </EventTimestampWrapper>
      {airdropStarted && (
        <TimeLeftRowFlex>
          <Text color="#98A1C0" size="xxl" weight={500} style={{ whiteSpace: 'nowrap', marginBottom: '2px' }}>
            Time Left:
          </Text>
          <Countdown endTimestamp={phase1EndTimestamp} isAirdropStarted={true} />
        </TimeLeftRowFlex>
      )}
    </>
  )
}

export const Phase2EventTimestamp = () => {
  const { phase2EndtTimestamp } = useGetPhase({
    totalAllocationsPhase1: '0',
  })

  return (
    <ColFlex>
      <EventTimestampWrapper className="event-timestamp">
        <GridRow>
          <DateRange>
            <Text size="xxl" weight={700}>
              EVENT ENDS IN
            </Text>
          </DateRange>
        </GridRow>
        <Countdown endTimestamp={phase2EndtTimestamp} />
      </EventTimestampWrapper>
    </ColFlex>
  )
}
