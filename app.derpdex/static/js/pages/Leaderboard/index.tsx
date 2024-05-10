import { Trans } from '@lingui/macro'
import { Trace } from '@uniswap/analytics'
import PurpleLeftArrow from 'assets/svg/purple-left-arrow.svg'
import PurpleRightArrow from 'assets/svg/purple-right-arrow.svg'
import { GloriaText } from 'components/CustomFonts/GloriaHallelujah'
import { NunitoText } from 'components/CustomFonts/Nunito'
import { Tab } from 'components/Tab'
import { useIsMobile } from 'nft/hooks'
import { useEffect, useMemo, useState } from 'react'
import { Calendar } from 'react-feather'
import styled from 'styled-components/macro'

import { weeks } from './constant'
import { useTopLoserList, useTradingVolumeList } from './hook'
import { TopLoser } from './TopLoser/TopLoser'
import { TopTradingVolume } from './TopTradingVolume/TopTradingVolume'
import { WeekSelection } from './WeekSelection'

const PageWrapper = styled.div`
  padding: 28px 34px 28px;
  width: 100%;
  z-index: 1;

  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    padding-top: 48px;
  }

  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.sm}px`}) {
    padding-top: 70px;
    padding-bottom: 70px;
  }
`

const FlexContainerBetween = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    flex-direction: column;
  }
`

const TitleContainerBase = styled.div`
  display: flex;
  font-size: 32px !important;
  @media only screen and (max-width: 768px) {
    font-size: 16px !important;
  }
`

const Title = styled(GloriaText)`
  background: var(--primary-gradient-lr, linear-gradient(270deg, #46c9d2 0%, #a372ff 100%));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 45px;
`

const DateContainerBase = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  flex-direction: column;
  gap: 12px;
  color: ${({ theme }) => theme.white};
`

const MonthDisplay = styled.div`
  border-radius: 100px;
  background: ${({ theme }) => theme.derpPurp2};
  padding: 4px 20px;
`

const CalendarSelectionBase = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const CalendarSelection = styled.div`
  border-radius: 100px;
  background: ${({ theme }) => theme.derpPurp1};
  padding: 4px 20px;
  display: flex;
  align-items: center;
  flex-direction: row;
  cursor: pointer;
  gap: 4px;
`

const TableContainerBase = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 40px;
  gap: 100px;
`

export default function Leaderboard() {
  const [isOpen, setOpen] = useState<boolean>(false)
  const [currentTab, setCurrentTab] = useState<string>('Trading Volume')

  const { onLoadTradingVolumeList, isLoadingFetch, loadedTradingVolumeList } = useTradingVolumeList()
  const { onLoadLoserList, isLoadingFetch: isLoadingLoserFetch, loadedLoserList } = useTopLoserList()
  const isMobile = useIsMobile()

  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
  const [currentDate, setCurrentDate] = useState<any>(new Date())
  const currentTimestamp = useMemo(() => new Date().getTime() / 1000, [])

  const weekIndex = useMemo(() => {
    const length = weeks.length
    if (currentTimestamp > weeks[length - 1].endTimestamp) return length - 1
    else {
      return weeks.findIndex((week) => currentTimestamp >= week.startTimestamp && currentTimestamp <= week.endTimestamp)
    }
  }, [currentTimestamp])

  const [week, setWeek] = useState<number>(weekIndex)

  useEffect(() => {
    setCurrentDate(new Date(weeks[week].startTimestamp * 1000))

    if (currentTimestamp >= weeks[week].startTimestamp && currentTimestamp <= weeks[week].endTimestamp) {
      onLoadTradingVolumeList()
      onLoadLoserList()
    } else {
      onLoadTradingVolumeList(week + 1)
      onLoadLoserList(week + 1)
    }
  }, [week])

  const handleOpen = () => {
    if (isOpen) {
      setOpen(false)
    } else {
      setOpen(true)
    }
  }

  return (
    <Trace page="leaderboard" shouldLogImpression>
      <PageWrapper>
        <FlexContainerBetween>
          <TitleContainerBase>
            <Trans>
              <Title>Leaderboard</Title>
            </Trans>
          </TitleContainerBase>

          <DateContainerBase>
            <MonthDisplay>
              <NunitoText weight={700} size="md2">
                {months[currentDate.getMonth()]} {currentDate.getFullYear()}
              </NunitoText>
            </MonthDisplay>

            <CalendarSelectionBase>
              <img src={PurpleLeftArrow} alt="left-arrow" />
              <CalendarSelection onClick={handleOpen}>
                <Calendar size={20} />
                <NunitoText weight={700} size="md2">
                  {weeks[week].startDay} - {weeks[week].endDay}
                </NunitoText>
              </CalendarSelection>
              <img src={PurpleRightArrow} alt="right-arrow" />
            </CalendarSelectionBase>
          </DateContainerBase>
        </FlexContainerBetween>

        {isMobile && (
          <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
            <Tab currentTab={currentTab} setCurrentTab={setCurrentTab} tabItem={['Trading Volume', 'Loser']}></Tab>
          </div>
        )}

        <TableContainerBase>
          {isMobile && currentTab === 'Trading Volume' && (
            <TopTradingVolume isLoadingFetch={isLoadingFetch} tradingVolumeList={loadedTradingVolumeList} />
          )}

          {isMobile && currentTab === 'Loser' && (
            <TopLoser isLoadingFetch={isLoadingLoserFetch} loserList={loadedLoserList} />
          )}

          {!isMobile && (
            <>
              <TopTradingVolume isLoadingFetch={isLoadingFetch} tradingVolumeList={loadedTradingVolumeList} />
              <TopLoser isLoadingFetch={isLoadingLoserFetch} loserList={loadedLoserList} />
            </>
          )}
        </TableContainerBase>
      </PageWrapper>
      <WeekSelection week={week} selectWeek={setWeek} isOpen={isOpen} onDismiss={handleOpen} />
    </Trace>
  )
}
