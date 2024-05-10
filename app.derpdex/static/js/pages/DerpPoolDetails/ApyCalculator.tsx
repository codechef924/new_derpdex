import { Trans } from '@lingui/macro'
import { formatNumber, NumberType } from '@uniswap/conedison/format'
import CloseButtonIcon from 'assets/images/close-button.png'
import { AutoColumn } from 'components/Column'
import { GloriaText } from 'components/CustomFonts/GloriaHallelujah'
import { NunitoText } from 'components/CustomFonts/Nunito'
import { loadingOpacityMixin } from 'components/Loader/styled'
import Modal from 'components/Modal'
import NumericalInput from 'components/NumericalInput'
import { RowBetween } from 'components/Row'
import { useEffect, useState } from 'react'
import styled from 'styled-components/macro'
import { flexRowNoWrap } from 'theme/styles'

const Wrapper = styled.div`
  position: relative;
  border-radius: 8px;
  width: 692px;
  padding: 30px 36px;

  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    width: 100%;
  }
`

const CloseButtonContainer = styled.div`
  position: relative;
`

const CloseButton = styled.img`
  position: absolute;
  top: -50px;
  right: -50px;
  width: 40px;
  height: 40px;
  cursor: pointer;
`

const ModalTitle = styled(NunitoText)`
  font-size: 24px;
  font-weight: 700;
`

const ModelSubTitle = styled(NunitoText)`
  font-size: 14px;
  font-weight: 700;
  margin-top: 5px;
  color: #adadad;
`

const ModelTitleContainer = styled(RowBetween)`
  flex-direction: column;
  margin-bottom: 20px;
`

const InputLabel = styled(NunitoText)`
  font-size: 16px;
  font-weight: 700;
  color: #afbdc8;
`

const InputContainer = styled.div`
  flex-direction: column;
  margin-bottom: 16px;
`

const InputRow = styled.div`
  ${flexRowNoWrap};
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: 8px;
  border: 2px solid #000;
  background: #fff;
  margin-top: 16px;
`

const StyledNumericalInput = styled(NumericalInput)<{ $loading: boolean }>`
  ${loadingOpacityMixin};
  text-align: left;
  font-size: 20px;
  line-height: normal;
  font-variant: small-caps;
  font-weight: 500;
`

const IncentiveContainer = styled.div`
  border-radius: 16px;
  border: 2px solid #000;
  background: #f9f6f6;
  padding: 12px 0px;
  margin-top: 16px;
`

const IncentiveRow = styled.div`
  padding: 8px 24px;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  display: flex;
`

const IncentiveLabel = styled(NunitoText)`
  font-size: 14px;
  font-weight: 700;
  color: #afbdc8;
`

const IncentiveValue = styled(NunitoText)`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.derpPurp1};
`

const CloseActionButton = styled.button`
  border-radius: 16px;
  border: 2px solid #000;
  background: var(--primary-gradient-lr, linear-gradient(270deg, #46c9d2 0%, #a372ff 100%));
  box-shadow: 3px 3px 0px 0px #000;
  width: 30%;
  position: absolute;
  bottom: -20px;
  left: 0;
  right: 0;
  margin: auto;
  cursor: pointer;
`

interface ConfirmationModalProps {
  isOpen: boolean
  onDismiss: () => void
  pool: any
}

export function ApyCalculator({ isOpen, onDismiss, pool }: ConfirmationModalProps) {
  const [value, setValue] = useState<number>(0)
  const [dayValue, setDayValue] = useState(69)
  const [remainingDays, setRemainingDays] = useState<number>(69)
  const [result, setResult] = useState({
    projectedDerpEarningUSD: 0,
    projectedDerpEarning: 0,
    projectedAPR: 0,
    projectedLPEarningUSD: 0,
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const remainingTime = pool.endTime - new Date().getTime() / 1000
    const remainingDays = (remainingTime / (24 * 60 * 60)).toFixed()

    setRemainingDays(+remainingDays)
    setDayValue(+remainingDays || 0)
  }, [pool])

  const update = (value: number, _remainingDays: number) => {
    if (!_remainingDays) _remainingDays = 0
    if (!value || value == 0) {
      setResult({
        projectedDerpEarningUSD: 0,
        projectedDerpEarning: 0,
        projectedAPR: 0,
        projectedLPEarningUSD: 0,
      })
      return
    }

    const rewardPerDayInUSD = (+pool.pendingRewards * pool.pricePerDerp) / 69
    const remainingRewards = rewardPerDayInUSD * _remainingDays
    // console.log('pendingRewardsPerDay', remainingRewards, rewardPerDayInUSD)
    const projectedDerpEarningUSD =
      pool.tvlUSD === 0 || remainingRewards === 0 ? 0 : (+value / pool.tvlUSD) * remainingRewards

    const projectedDerpEarning = projectedDerpEarningUSD === 0 ? 0 : projectedDerpEarningUSD / pool.pricePerDerp
    const poolAPR = ((pool.feeTier * pool.volume) / pool.tvlUSD) * 365 * 100
    // const projectedAPR = +poolAPR + (projectedDerpEarning / +pool.pendingRewards / 69) * 365 * 100
    const projectedAPR = +poolAPR + (projectedDerpEarningUSD / +value / 69) * 365 * 100
    const projectedLPEarningUSD =
      pool.feeUSD === 0 || pool.volume === 0 ? 0 : ((pool.feeUSD * value) / pool.volume) * _remainingDays

    setResult({
      projectedDerpEarningUSD,
      projectedDerpEarning,
      projectedAPR,
      projectedLPEarningUSD,
    })
  }

  const onUserInput = (val: string) => {
    update(+val, remainingDays)
    setValue(+val)
    // update()
    // console.log(pool)
  }

  const onUserDayInput = (val: string) => {
    update(+value, +val)
    setDayValue(+val)
    // update()
  }

  return (
    <Modal isOpen={isOpen} $scrollOverlay={true} onDismiss={onDismiss} maxHeight={90}>
      <Wrapper className="override-modal" id="overriable-modal">
        <AutoColumn gap="md">
          <RowBetween>
            <div />
            <CloseButtonContainer>
              <CloseButton onClick={onDismiss} src={CloseButtonIcon} alt="close-button" />
            </CloseButtonContainer>
          </RowBetween>

          <ModelTitleContainer>
            <ModalTitle>
              <Trans>APR Calculator</Trans>
            </ModalTitle>
            <ModelSubTitle>
              <Trans>This calculator take into account the earnings from swap fees and airdrop incentives.</Trans>
            </ModelSubTitle>
          </ModelTitleContainer>

          <InputContainer>
            <InputLabel>
              <Trans>Deposit Value</Trans>
            </InputLabel>
            <InputRow>
              <StyledNumericalInput
                className="token-amount-input"
                value={value}
                onUserInput={onUserInput}
                $loading={loading}
              />

              <NunitoText size="lg" weight={700} color="#000">
                USD
              </NunitoText>
            </InputRow>
          </InputContainer>

          <InputContainer>
            <InputLabel>
              <Trans>Deposit Duration</Trans>
            </InputLabel>
            <InputRow>
              <StyledNumericalInput
                className="days-input"
                value={dayValue}
                onUserInput={onUserDayInput}
                $loading={loading}
              />

              <NunitoText size="lg" weight={700} color="#000">
                days
              </NunitoText>
            </InputRow>
          </InputContainer>

          <InputContainer>
            <InputLabel>
              <Trans>Incentive Estimates</Trans>
            </InputLabel>
            <IncentiveContainer>
              <IncentiveRow>
                <IncentiveLabel>
                  <Trans>Deposit value</Trans>
                </IncentiveLabel>
                <IncentiveValue>${value}</IncentiveValue>
              </IncentiveRow>
              <IncentiveRow>
                <IncentiveLabel>
                  <Trans>Projected DERP earning</Trans>
                </IncentiveLabel>
                <IncentiveValue>
                  {formatNumber(result.projectedDerpEarning, NumberType.TokenTx)} DERP (
                  {formatNumber(result.projectedDerpEarningUSD, NumberType.PortfolioBalance)})
                </IncentiveValue>
              </IncentiveRow>
              <IncentiveRow>
                <IncentiveLabel>
                  <Trans>Projected LP earning</Trans>
                </IncentiveLabel>
                <IncentiveValue>
                  {formatNumber(result.projectedLPEarningUSD, NumberType.PortfolioBalance)}
                </IncentiveValue>
              </IncentiveRow>
              <IncentiveRow>
                <IncentiveLabel>
                  <Trans>Projected APR</Trans>
                </IncentiveLabel>
                <IncentiveValue>{result.projectedAPR.toFixed(2)}%</IncentiveValue>
              </IncentiveRow>
              <IncentiveRow>
                <IncentiveLabel>
                  <Trans>Projected total earning value in USD</Trans>
                </IncentiveLabel>
                <IncentiveValue>
                  {formatNumber(
                    result.projectedDerpEarningUSD + result.projectedLPEarningUSD,
                    NumberType.PortfolioBalance
                  )}
                </IncentiveValue>
              </IncentiveRow>
            </IncentiveContainer>
          </InputContainer>

          <CloseActionButton onClick={onDismiss}>
            <GloriaText
              size="xl"
              weight={400}
              style={{
                color: '#fff',
              }}
            >
              <Trans>Close</Trans>
            </GloriaText>
          </CloseActionButton>
        </AutoColumn>
      </Wrapper>
    </Modal>
  )
}
