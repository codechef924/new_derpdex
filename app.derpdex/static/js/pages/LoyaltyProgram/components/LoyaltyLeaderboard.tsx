import PurpleLeftArrow from 'assets/svg/purple-left-arrow.svg'
import PurpleRightArrow from 'assets/svg/purple-right-arrow.svg'
import { NunitoText } from 'components/CustomFonts/Nunito'
import { Tab } from 'components/Tab'
import { useEffect, useMemo, useState } from 'react'
import { Calendar } from 'react-feather'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components/macro'

import { months, weeks } from '../constant'
import {
  useTopLoserListForLoyalty,
  useTopWinnerListForLoyalty,
  useTradingVolumeListForLoyalty,
} from '../hooks/loyalty-leaderboard.hook'
import { FlexGrid, StyledGloria } from '../stylings'
import { TopLoserForLoyalty } from './TopLoserForLoyalty/TopLoser'
import { TopTradingVolumeForLoyalty } from './TopTradingVolumeForLoyalty/TopTradingVolume'
import { TopWinnerForLoyalty } from './TopWinnerForLoyalty/TopWinner'
import { WeekSelection } from './WeekSelection'
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

export const LoyaltyLeaderboard = () => {
  const params = useParams<{ category?: string }>()

  const navigate = useNavigate()
  const [currentTab, setCurrentTab] = useState<string>('Top Trading Volume')

  const [isOpen, setOpen] = useState<boolean>(false)
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

  const { onLoadTradingVolumeList, isLoadingFetch, loadedTradingVolumeList } = useTradingVolumeListForLoyalty()
  const { onLoadLoserList, isLoadingFetch: isLoadingLoserFetch, loadedLoserList } = useTopLoserListForLoyalty()
  const { onLoadWinnerList, isLoadingFetch: isLoadingWinnerFetch, loadedWinnerList } = useTopWinnerListForLoyalty()

  useEffect(() => {
    if (params.category === undefined) navigate('/loyalty-program/trading-volume')
  }, [params])

  useEffect(() => {
    setWeek(weekIndex)
  }, [weekIndex])

  useEffect(() => {
    setCurrentDate(new Date(weeks[week].startTimestamp * 1000))
    const currentTimestamp = new Date().getTime() / 1000

    if (currentTimestamp >= weeks[week].startTimestamp && currentTimestamp <= weeks[week].endTimestamp) {
      onLoadTradingVolumeList()
      onLoadLoserList()
      onLoadWinnerList()
    } else {
      onLoadTradingVolumeList(week + 1)
      onLoadLoserList(week + 1)
      onLoadWinnerList(week + 1)
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
    <FlexGrid className="loyalty-leaderboard">
      <StyledGloria>Loyalty Leaderboard</StyledGloria>
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
      <WeekSelection week={week} selectWeek={setWeek} isOpen={isOpen} onDismiss={handleOpen} />
      <FlexGrid className="tab">
        <Tab
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          tabItem={['Top Trading Volume', 'Top Winner', 'Top Loser']}
        ></Tab>
      </FlexGrid>
      <FlexGrid>
        {currentTab === 'Top Trading Volume' && (
          <TopTradingVolumeForLoyalty isLoadingFetch={isLoadingFetch} tradingVolumeList={loadedTradingVolumeList} />
        )}
        {currentTab === 'Top Loser' && (
          <TopLoserForLoyalty isLoadingFetch={isLoadingLoserFetch} loserList={loadedLoserList} />
        )}
        {currentTab === 'Top Winner' && (
          <TopWinnerForLoyalty isLoadingFetch={isLoadingWinnerFetch} loserList={loadedWinnerList} />
        )}
      </FlexGrid>
    </FlexGrid>
  )
}
