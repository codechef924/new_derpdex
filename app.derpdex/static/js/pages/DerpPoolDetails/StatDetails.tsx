import { Trans } from '@lingui/macro'
import { CircularProgress } from '@mui/material'
import { formatNumber, NumberType } from '@uniswap/conedison/format'
import Derp from 'assets/images/derp.png'
import DerpThink from 'assets/images/derp-think.png'
import DerpUncle from 'assets/images/derp-uncle.png'
import DerpWow from 'assets/images/derp-wow.png'
import Derpina from 'assets/images/derpina.png'
import { NunitoText } from 'components/CustomFonts/Nunito'
import { RowBetween } from 'components/Row'
import { MouseoverTooltip } from 'components/Tooltip'
import { useState } from 'react'
import { Info } from 'react-feather'
import styled from 'styled-components/macro'

import { PoolStats, UserStats } from '.'

const StatDetailsContainer = styled.div`
  padding: 8px 0px;
  border-radius: 20px;
  border: 2px solid ${({ theme }) => theme.white};
  background: rgba(31, 31, 31, 0.7);
  box-shadow: 3px 3px 0px 0px ${({ theme }) => theme.white};
  backdrop-filter: blur(6px);
  margin-bottom: 10px;
  width: 100%;
`

const PoolContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 8px;
  padding: 8px 24px;
`

const PoolTitle = styled(NunitoText)`
  color: ${({ theme }) => theme.derpPurp1};
  margin-bottom: 8px;
`

const StatLabel = styled(NunitoText)`
  font-size: 14px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.5);
`

const ValueLabel = styled(NunitoText)`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.white};

  .skeleton {
    background-color: rgb(179 179 179 / 54%);
  }
`

export const InfoIcon = styled(Info)`
  color: ${({ theme }) => theme.derpPurp1};
  vertical-align: middle;
`

const InfoIconContainer = styled.div`
  margin-left: 8px;
  display: flex;
  align-items: center;
  cursor: help;
`

const ResponsiveRow = styled(RowBetween)`
  @media only screen and (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    row-gap: 8px;
    width: 100%;
  }
`

const LeftStatsValueContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 8px;
  width: 60%;

  @media only screen and (max-width: 768px) {
    width: 100%;
  }
`

const RightStatsValueContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 8px;
  width: 40%;

  @media only screen and (max-width: 768px) {
    width: 100%;
  }
`

const ItemResponsiveRow = styled(RowBetween)`
  gap: 12px;

  @media only screen and (max-width: 768px) {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
  }
`

const ItemImage = styled.div`
  background-color: ${({ theme }) => theme.white};
  border-radius: 50%;
  padding: 5px 8px;
  .img {
    width: 40px;
    height: 40px;
  }
`

const StatsValueContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  height: 100%;
  gap: 8px;
  padding: 4px 0px;
`

const ItemColumn = styled.div`
  display: flex;
  gap: 12px;
  max-height: 60px;
  height: 55px;
`

export const StatDetails = ({
  pool,
  isLoadingPendingRewards,
}: {
  pool: PoolStats & UserStats
  isLoadingPendingRewards: boolean
}) => {
  const [currentTime, setCurrentTime] = useState(new Date().getTime() / 1000)
  // const RewardUSDPerDay = () => {
  //   const timeSinceStart = (currentTime - Number(pool.startTime)).toFixed()
  //   const result = (+pool.rewardsInUSD / (+timeSinceStart / (60 * 60 * 24))).toFixed(2)
  //   return result ? result : '0'
  // }

  const projectRewardAtEnd = () => {
    if (currentTime > +pool.endTime) {
      return pool.rewardsInUSD
    }

    const remainingTime = (Number(pool.endTime) - currentTime).toFixed()
    const result = (+pool.rewardPerDayUSD * (+remainingTime / (60 * 60 * 24)) + pool.rewardsInUSD).toFixed(2)
    return result ? result : '0'
  }

  const reducingAPR = () => {
    //Not used as of now
    const totalRewards = Number(pool.pendingRewards) * Number(pool.pricePerDerp)
    const rewardPerDay = totalRewards / 69
    const remainingTime = (Number(pool.endTime) - currentTime).toFixed()

    const remainingRewards = rewardPerDay * (+remainingTime / (24 * 60 * 60))
    const remainingAPR = (remainingRewards / totalRewards / 69) * 365 * 100
    // console.log('remainingRewards', remainingRewards, remainingAPR, rewardPerDay)
    return remainingAPR
  }

  const rewardTokenAPR = () => {
    const totalDays = (+pool.endTime - +pool.startTime) / (24 * 60 * 60)
    return ((+pool.pendingRewards * +pool.pricePerDerp) / +pool.tvlUSD / totalDays) * 365 * 100
  }

  const poolAPR = () => {
    return ((Number(pool.feeTier) * pool.volume) / Number(pool.tvlUSD)) * 365 * 100
  }

  const projectedLpEarningUSD = () => {
    const remainingTime = ((Number(pool.endTime) - currentTime) / (24 * 60 * 60)).toFixed()

    const result = ((pool.feeUSD * pool.depositsUSD) / Number(pool.tvlUSD)) * Number(remainingTime)
    return result ? result : 0
  }

  const averageRewardAPR = () => {
    // const totalRewards = +pool.pendingRewards * pool.pricePerDerp
    const projectedRewards = +projectRewardAtEnd()

    // console.log(projectedRewards, pool.tvlUSD, totalRewards)
    // return (projectedRewards / pool.tvlUSD / 69) * 365 * 100
    // return (projectedRewards / totalRewards / 69) * 365 * 100
    if (pool.depositsUSD == 0 || projectedRewards == 0) {
      return 0
    }
    const totalDays = (+pool.endTime - +pool.startTime) / (24 * 60 * 60)
    return (projectedRewards / pool.depositsUSD / totalDays) * 365 * 100
    //depostiedamount instead of totalRewards
    // return (+pool.rewardsInUSD / totalRewards / 69) * 365 * 100
  }

  return (
    <>
      <StatDetailsContainer>
        <PoolContainer>
          <PoolTitle size="lg" weight={700}>
            <Trans>Pool</Trans>
          </PoolTitle>

          <ResponsiveRow>
            <StatsValueContainer>
              <StatLabel>
                <Trans>Total Value Locked</Trans>
              </StatLabel>
              <ValueLabel>{formatNumber(Number(pool.tvlUSD) | 0, NumberType.PortfolioBalance)}</ValueLabel>
            </StatsValueContainer>

            <StatsValueContainer>
              <StatLabel>
                <Trans>APR</Trans>
              </StatLabel>
              <ValueLabel>
                {(+rewardTokenAPR() + poolAPR()) | 0}%
                <MouseoverTooltip text={<Trans>Included airdrop rewards and LP rewards</Trans>} placement="right">
                  <InfoIconContainer>
                    <InfoIcon size={14} />
                  </InfoIconContainer>
                </MouseoverTooltip>
              </ValueLabel>
            </StatsValueContainer>

            <StatsValueContainer>
              <StatLabel>
                <Trans>Airdrop Rewards</Trans>
              </StatLabel>
              <ValueLabel>
                {formatNumber(Number(pool.pendingRewards), NumberType.TokenTx)} DERP (
                {formatNumber(Number(pool.pricePerDerp) * Number(pool.pendingRewards), NumberType.PortfolioBalance)})
              </ValueLabel>
            </StatsValueContainer>

            <StatsValueContainer>
              <StatLabel>
                <Trans>Withdrawal</Trans>
              </StatLabel>
              <ValueLabel>
                <Trans>FREE</Trans>
                <MouseoverTooltip
                  text={
                    <Trans>
                      <strong>1st week</strong> withdraw after deposit: <strong>50%</strong> slashing from the airdrop
                      rewards
                      <br /> <strong>2nd week</strong> withdraw after deposit: <strong>25%</strong> slashing from the
                      airdrop rewards
                      <br /> <strong>After 2nd week</strong>: <strong>0%</strong> slashing from the airdrop rewards
                    </Trans>
                  }
                  placement="left"
                >
                  <InfoIconContainer>
                    <InfoIcon size={14} />
                  </InfoIconContainer>
                </MouseoverTooltip>
              </ValueLabel>
            </StatsValueContainer>
          </ResponsiveRow>
        </PoolContainer>
      </StatDetailsContainer>

      <StatDetailsContainer>
        <PoolContainer>
          <PoolTitle size="lg" weight={700}>
            <Trans>Your Stats</Trans>
          </PoolTitle>

          <ItemResponsiveRow>
            <ItemColumn>
              <ItemImage>
                <img className="img" src={DerpThink} alt="derp-think" />
              </ItemImage>
              <StatsValueContainer>
                <StatLabel>
                  <Trans>Your Average APR</Trans>
                </StatLabel>
                <ValueLabel>
                  {isLoadingPendingRewards ? (
                    <CircularProgress color="primary" size={20} />
                  ) : (
                    <> {(averageRewardAPR() == 0 ? 0 : averageRewardAPR() + poolAPR()).toFixed(2) || '0'} %</>
                  )}
                </ValueLabel>
              </StatsValueContainer>
            </ItemColumn>

            <ItemColumn>
              <ItemImage>
                <img className="img" src={DerpUncle} alt="derp-uncle" />
              </ItemImage>
              <StatsValueContainer>
                <StatLabel>
                  <Trans>Your Deposits</Trans>
                </StatLabel>
                <ValueLabel>{formatNumber(pool.depositsUSD || 0, NumberType.PortfolioBalance)}</ValueLabel>
              </StatsValueContainer>
            </ItemColumn>

            <ItemColumn>
              <ItemImage>
                <img className="img" src={Derp} alt="derp" />
              </ItemImage>
              <StatsValueContainer>
                <StatLabel>
                  <Trans>Calculated USD Rate</Trans>
                </StatLabel>
                <ValueLabel>
                  {isLoadingPendingRewards ? (
                    <CircularProgress color="primary" size={20} />
                  ) : (
                    <>~${pool.rewardPerDayUSD}/Day</>
                  )}
                </ValueLabel>
              </StatsValueContainer>
            </ItemColumn>

            <ItemColumn>
              <ItemImage>
                <img className="img" src={DerpWow} alt="derp-wow" />
              </ItemImage>
              <StatsValueContainer>
                <StatLabel>
                  <Trans>Calculated Rewards in USD</Trans>
                </StatLabel>
                <ValueLabel>
                  {isLoadingPendingRewards ? (
                    <CircularProgress color="primary" size={20} />
                  ) : (
                    <>
                      {formatNumber(+pool.rewardsInUSD + +pool.lpFeeUSD || 0, NumberType.PortfolioBalance)}
                      <MouseoverTooltip
                        text={<Trans>Airdrop rewards in DERP and xDERP tokens and LP tokens</Trans>}
                        placement="left"
                      >
                        <InfoIconContainer>
                          <InfoIcon size={14} />
                        </InfoIconContainer>
                      </MouseoverTooltip>
                    </>
                  )}
                </ValueLabel>
              </StatsValueContainer>
            </ItemColumn>

            <ItemColumn>
              <ItemImage>
                <img className="img" src={Derpina} alt="derpina" />
              </ItemImage>
              <StatsValueContainer>
                <StatLabel>
                  <Trans>Rewards in USD on December 21th</Trans>
                </StatLabel>
                <ValueLabel>
                  {isLoadingPendingRewards ? (
                    <CircularProgress color="primary" size={20} />
                  ) : (
                    <>
                      {currentTime > +pool.endTime
                        ? formatNumber(+pool.rewardsInUSD + +pool.lpFeeUSD, NumberType.PortfolioBalance)
                        : formatNumber(+projectRewardAtEnd() + projectedLpEarningUSD(), NumberType.PortfolioBalance)}
                      <MouseoverTooltip
                        text={<Trans>Airdrop rewards in DERP and xDERP tokens and LP tokens</Trans>}
                        placement="left"
                      >
                        <InfoIconContainer>
                          <InfoIcon size={14} />
                        </InfoIconContainer>
                      </MouseoverTooltip>
                    </>
                  )}
                </ValueLabel>
              </StatsValueContainer>
            </ItemColumn>
          </ItemResponsiveRow>
        </PoolContainer>
      </StatDetailsContainer>
    </>
  )
}
