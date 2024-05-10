import { formatNumber, NumberType } from '@uniswap/conedison/format'
import { useWeb3React } from '@web3-react/core'
import { GloriaText } from 'components/CustomFonts/GloriaHallelujah'
import { NunitoText } from 'components/CustomFonts/Nunito'
import useNativeCurrency from 'lib/hooks/useNativeCurrency'
import { LoadingDots } from 'pages/Launcpad/stylings'
import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import CloseRedeem from '../assets/Close-redeem.png'
import { useCheckClaimed } from '../hooks/useCheckClaimed'
import { useClaimAirdrop } from '../hooks/useClaimAirdrop'
import { useGetEthAmount } from '../hooks/useGetEthAmount'
import { ITasks } from '../hooks/useGetTasks'
import { useSafetyCheck } from '../hooks/useSafetyCheck'
import { AirdropClaimButton, ColFlex, RowFlex, StyledGloria, Text } from '../stylings'

const GridCols = styled.div`
  margin-top: 92px;
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr;

  gap: 55px;

  @media only screen and (max-width: 768px) {
    margin-top: 12px;
    grid-template-columns: 1fr;
  }
`

const AboutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  max-width: 390px;
`

const ParagraphText = styled.span`
  white-space: pre-line;
`

const GridContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  max-width: 436px;
  max-height: 650px;
  width: 100%;
  height: fit-content;

  border-radius: 24px;
  border: 2px solid #000;
  background: #fff;
  box-shadow: 4px 4px 0px 0px #000;

  padding: 56px 26px 39px 26px;

  &.task {
    justify-self: end;
  }
  &.redeem {
    justify-self: end;
    padding: 56px 26px 60px 26px;
  }
`

const SkewedHeader = styled.div`
  position: absolute;
  margin-top: -32px;
  margin-left: -32px;
  display: flex;
  transform: rotate(-3deg);
  padding: 8px 16px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 12px;
  background: var(--Primary-Gradient-LR, linear-gradient(270deg, #46c9d2 0%, #a372ff 100%));
  top: 0;
  left: 0;
  color: #fff;
  min-width: 100px;

  @media only screen and (max-width: 768px) {
    margin-top: -18px;
    margin-left: -12px;
  }
`

const TaskContainer = styled(ColFlex)`
  gap: 16px;
  padding-right: 20px;
  height: 100%;
  overflow-y: auto;

  /* WebKit-based browsers */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background-color: #fff;
    border-radius: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #f0ebeb;
    border-radius: 5px;
    &:hover {
      background-color: #f0ebeb;
    }
  }

  &::-webkit-scrollbar-thumb:active {
    background-color: #f0ebeb;
  }
`

type TaskState = {
  isCompleted: boolean
}
const TaskBox = styled.div<TaskState>`
  display: flex;
  padding: 24px 50px 24px 24px;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  align-self: stretch;
  border-radius: 16px;
  border: ${({ isCompleted }) => (isCompleted ? '2px solid #fff' : '2px solid #000')};
  background: ${({ isCompleted, theme }) => (isCompleted ? theme.derpGradientPrimary : '#fff')};
  color: ${({ isCompleted }) => (isCompleted ? '#fff' : '#000')};
  max-width: 356px;

  .description {
    color: ${({ isCompleted }) => (isCompleted ? 'rgba(255, 255, 255, 0.50)' : '#ADADAD')};
  }
  .reward {
    color: ${({ isCompleted }) => (isCompleted ? '#fff' : '#A372FF')};
  }
  .focused-header {
    position: relative;
    width: 100%;
  }
`

const TagArea = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  top: 0;
`
const CompletedTag = styled.div`
  display: flex;
  padding: 8px 16px;
  justify-content: center;
  align-items: center;
  gap: 10px;

  margin-right: -26%;

  // position: absolute;
  // top: 0;
  // right: 0;

  border-radius: 16px;
  background: var(--Primary-one, #a372ff);
  box-shadow: -2px 2px 0px 0px rgba(0, 0, 0, 0.16);
`
const Tasks = ({ tasks }: { tasks: ITasks[] }) => {
  // const
  return (
    <GridContainer className="task">
      <SkewedHeader>
        <NunitoText size="x32px" weight={700}>
          Task
        </NunitoText>
      </SkewedHeader>
      <TaskContainer>
        {tasks.length > 0 ? (
          <>
            {tasks.map((t) => (
              <>
                <TaskBox isCompleted={t.rewardAmount !== null}>
                  <NunitoText className="focused-header" size="xxl" weight={700}>
                    {t.title}
                    {t.rewardAmount !== null && (
                      <TagArea id="tag-area">
                        <CompletedTag>
                          <Text size="md2" color="#fff">
                            Completed
                          </Text>
                        </CompletedTag>
                      </TagArea>
                    )}
                  </NunitoText>
                  <Text className="description" size="md2" weight={500}>
                    {t.description}
                  </Text>
                  {/* <Text className="reward">Reward: $0.00000</Text> */}
                  <Text className="reward">
                    Reward: {t.rewardAmount ? Math.floor(parseFloat(t.rewardAmount)) : '0'} DERP
                  </Text>
                </TaskBox>
              </>
            ))}
            {/* TODO: Only show test results */}
            {/* <TaskBox isCompleted={false}>
              <NunitoText size="xxl" weight={700}>
                Add and Hold Liquidity
              </NunitoText>
              <Text className="description" size="md2" weight={500}>
                The points will be accumulated based on your holding liquidity and time:
              </Text>
              <Text className="reward">Reward: $0.00000</Text>
            </TaskBox>
            <TaskBox isCompleted={true}>
              <NunitoText className="focused-header" size="xxl" weight={700}>
                Add and Hold Liquidity
                <TagArea id="tag-area">
                  <CompletedTag>
                    <Text size="md2" color="#fff">
                      Completed
                    </Text>
                  </CompletedTag>
                </TagArea>
              </NunitoText>
              <Text className="description" size="md2" weight={500}>
                The points will be accumulated based on your holding liquidity and time:
              </Text>
              <Text className="reward">Reward: $0.00000</Text>
            </TaskBox> */}
          </>
        ) : (
          <Text>Fetching tasks...</Text>
        )}
      </TaskContainer>
    </GridContainer>
  )
}

const RedeemCols = styled(ColFlex)`
  padding: 0px 0px;
  // max-height: 500px;
  overflow-y: auto;

  /* WebKit-based browsers */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background-color: #fff;
    border-radius: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #f0ebeb;
    border-radius: 5px;
    &:hover {
      background-color: #f0ebeb;
    }
  }

  &::-webkit-scrollbar-thumb:active {
    background-color: #f0ebeb;
  }
`

const RedeemItems = styled(RowFlex)`
  padding: 16px 8px;
  gap: 2px;
  justify-content: space-between;
  align-items: center;

  border-bottom: 1px solid #000;
`

const ClaimButtonPositioning = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0px 54px;
  margin-bottom: -32px;
  color: #fff;
`

interface EXTENDED_ITasks extends ITasks {
  isFullyClaimed: boolean
}
const FILTERED_TAG = ['OG Rewards', 'TESTNET Rewards', 'Blockchain Users']
const Redeems = ({
  tasks,
  totalAmount,
  ETHPriceInUSD,
}: {
  tasks: ITasks[]
  totalAmount: string
  ETHPriceInUSD: string
}) => {
  const { chainId } = useWeb3React()
  const { isClaimed } = useCheckClaimed()

  const { preloadCheckState, claimSafetyCheck } = useSafetyCheck({
    tasks,
  })

  // TO filter out the ['TESTNET Rewards', 'Blockchain Users', 'OG Rewards']
  const [toDisable, setToDisable] = useState<string[]>([])
  useEffect(() => {
    setToDisable([])
    const _toDisable: string[] = []
    const filterByTag = tasks.filter((task) => FILTERED_TAG.includes(task.tag))

    if (!preloadCheckState.isLoading) {
      filterByTag.forEach((task) => {
        if (task.tag === 'OG Rewards') {
          if (
            claimSafetyCheck['OG Rewards'] === 0 ||
            (task.rewardAmount && parseFloat(task.rewardAmount) > claimSafetyCheck['OG Rewards'])
          ) {
            _toDisable.push(task.tag)
          }
        }

        if (task.tag === 'TESTNET Rewards') {
          if (
            claimSafetyCheck['TESTNET Rewards'] === 0 ||
            (task.rewardAmount && parseFloat(task.rewardAmount) > claimSafetyCheck['TESTNET Rewards'])
          ) {
            _toDisable.push(task.tag)
          }
        }

        if (task.tag === 'Blockchain Users') {
          if (
            claimSafetyCheck['Blockchain Users'] === 0 ||
            (task.rewardAmount && parseFloat(task.rewardAmount) > claimSafetyCheck['Blockchain Users'])
          ) {
            _toDisable.push(task.tag)
          }
        }
      })
    }

    setToDisable((p) => [...p, ..._toDisable])
  }, [claimSafetyCheck, preloadCheckState.isLoading, tasks])

  const redeemableTasks: EXTENDED_ITasks[] = useMemo(() => {
    if (tasks && tasks.length > 0 && !preloadCheckState.isLoading) {
      const _tasks = tasks.filter((t) => t.rewardAmount !== null)
      const finalized: EXTENDED_ITasks[] = []
      _tasks.forEach((t) => {
        finalized.push({
          ...t,
          isFullyClaimed: toDisable.includes(t.tag),
        })
      })

      return finalized
    } else {
      return []
    }
  }, [toDisable, tasks, preloadCheckState])

  const totalRedemption = useMemo(() => {
    const total = redeemableTasks.reduce((accum, rt) => {
      if (rt.rewardAmount && !toDisable.includes(rt.tag)) {
        accum += parseFloat(rt.rewardAmount)
      }
      return accum
    }, 0)
    return total
  }, [toDisable, redeemableTasks])

  const { feeAmount, getEthAmountState } = useGetEthAmount({
    totalAmount,
    ETHPriceInUSD,
  })

  const { claimAirdrop, airdropClaimState, claimableState, gasState } = useClaimAirdrop({
    phaseNumber: 1,
    claimedDetails: isClaimed,
    feeAmount,
  })

  const nativeToken = useNativeCurrency(chainId)

  return (
    <GridContainer className="redeem">
      <SkewedHeader>
        <NunitoText size="x32px" weight={700}>
          Redeem Airdrop
        </NunitoText>
      </SkewedHeader>
      <RedeemCols>
        {redeemableTasks.length > 0 ? (
          <>
            {redeemableTasks.map((t) => (
              <>
                <RedeemItems key={t.tag}>
                  <ColFlex gap={2}>
                    <Text size="xxl" weight={700}>
                      {t.title}
                    </Text>
                    {t.isFullyClaimed && (
                      <Text
                        style={{
                          color: '#ff6060',
                          fontSize: '16px',
                        }}
                      >
                        Fully Claimed
                      </Text>
                    )}
                    <Text size="lg" weight={500} color="#A372FF">
                      Reward: {t.rewardAmount ? Math.floor(parseFloat(t.rewardAmount)) : t.rewardAmount} DERP (with
                      xDERP)
                    </Text>
                  </ColFlex>
                  <img style={{ cursor: 'pointer' }} src={CloseRedeem} />
                </RedeemItems>
              </>
            ))}
            {/* TODO: Only show test results */}
            {/* <RedeemItems>
              <ColFlex gap={2}>
                <Text size="xxl" weight={700}>
                  Add and Hold Liquidity
                </Text>
                <Text size="lg" weight={500} color="#A372FF">
                  Reward: $0.0123 xDERP
                </Text>
              </ColFlex>
              <img style={{ cursor: 'pointer' }} src={CloseRedeem} />
            </RedeemItems>
            <RedeemItems>
              <ColFlex gap={2}>
                <Text size="xxl" weight={700}>
                  Add and Hold Liquidity
                </Text>
                <Text size="lg" weight={500} color="#A372FF">
                  Reward: $0.0001 xDERP
                </Text>
              </ColFlex>
              <img src={CloseRedeem} />
            </RedeemItems> */}
          </>
        ) : (
          <Text size="xxl" weight={600}>
            Nothing to be redeemed
          </Text>
        )}
      </RedeemCols>
      <ColFlex margin="20px 0px 0px 0px" gap={9}>
        <RowFlex style={{ justifyContent: 'space-between' }}>
          <Text size="xl" weight={700}>
            Total Redemption
          </Text>
          <Text size="xl" weight={700} color="#A372FF">
            {formatNumber(totalRedemption, NumberType.SwapTradeAmount)} DERP
          </Text>
        </RowFlex>
        <RowFlex style={{ justifyContent: 'space-between' }}>
          <Text size="xl" weight={700}>
            Fees (1%)
          </Text>
          <Text size="xl" weight={700} color="#A372FF">
            {formatNumber(parseFloat(feeAmount), NumberType.FiatGasPrice)} {nativeToken.symbol}
          </Text>
        </RowFlex>
        {/* TODO: [airdrop] - Update about */}
        <Text size="md" color="#AFBDC8" weight={400}>
          The gas fees included the DERP token transaction during the claiming process. This is used to prevent bots
          from interfering with the airdrop.
        </Text>
        {airdropClaimState.error ||
          (!gasState.isSuccess && (
            <Text style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} color="#e34444">
              Insufficient gas funds
            </Text>
          ))}
      </ColFlex>
      <ClaimButtonPositioning>
        <AirdropClaimButton
          disabled={
            airdropClaimState.isLoading || claimableState.isClaimed || totalRedemption === 0 || !gasState.isSuccess
          }
          onClick={() => claimAirdrop()}
        >
          <GloriaText size="xxl">
            {!claimableState.isLoading ? (
              <>
                {claimableState.isClaimed && isClaimed ? (
                  'Claimed'
                ) : (
                  <>{airdropClaimState.isLoading ? <LoadingDots>Claiming</LoadingDots> : 'Claim'}</>
                )}
              </>
            ) : (
              'Loading'
            )}
          </GloriaText>
        </AirdropClaimButton>
      </ClaimButtonPositioning>
    </GridContainer>
  )
}

const ResponsiveFlex = styled(RowFlex)`
  @media only screen and (max-width: 768px) {
    flex-direction: column;
  }
`
export const AirdropBody = ({
  tasks,
  totalAmount,
  ETHPriceInUSD,
}: {
  tasks: ITasks[]
  totalAmount: string
  ETHPriceInUSD: string
}) => {
  return (
    <ResponsiveFlex gap={32}>
      <AboutWrapper>
        <StyledGloria>Airdrop</StyledGloria>
        <NunitoText size="lg" weight={400}>
          {/* TODO: [airdrop] - Update about */}
          <ParagraphText>
            <b>🌟 Welcome to DerpDEX's Airdrop Celebration! 🎉</b>
            {'\n'}
            {'\n'}
            We're rolling out a special airdrop with <b>10% DERP and 90% xDERP</b> as a thank-you to our early
            supporters! From 27 Dec 2023, Phase 1 invites you to claim your airdrop. Here's the twist: while claiming,
            you'll also be conducting a DERP token transaction, and the gas fees for this transaction are on you. But
            don't worry, we'll <b>return the DERP tokens back to you after your claim</b>. It's a race against time, as
            this offer is first-come, first-served!
            {'\n'}
            {'\n'}
            If there are leftover DERP tokens, Phase 2 starts on 31 Dec. This phase follows the same pattern, with the
            only difference being a fixed gas fee of 5 USD in ETH/BNB for your DERP transaction.
            {'\n'}
            {'\n'}
            This unique claim process is designed to ensure fairness and prevent bot interference. Any DERP tokens
            unclaimed after Phase 2 will be allocated to the Derp Foundation to fuel our future projects. Jump in for
            your share of DERP and be part of our growing community!
          </ParagraphText>
        </NunitoText>
      </AboutWrapper>
      <GridCols>
        <Tasks tasks={tasks} />
        <Redeems tasks={tasks} totalAmount={totalAmount} ETHPriceInUSD={ETHPriceInUSD} />
      </GridCols>
    </ResponsiveFlex>
  )
}
