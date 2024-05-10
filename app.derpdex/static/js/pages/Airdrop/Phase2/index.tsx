import { Trace } from '@uniswap/analytics'
import { formatNumber, NumberType } from '@uniswap/conedison/format'
import { useWeb3React } from '@web3-react/core'
import { GloriaText } from 'components/CustomFonts/GloriaHallelujah'
import { SupportedChainId } from 'constants/chains'
import { ethers } from 'ethers'
import { useCurrency } from 'hooks/Tokens'
import useStablecoinPriceV2 from 'hooks/useStablecoinPriceV2'
import useNativeCurrency from 'lib/hooks/useNativeCurrency'
import { LoadingDots } from 'pages/Launcpad/stylings'
import { DERP_ADDRESSES_BY_CHAINID } from 'pages/xDERP/constants'
import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components/macro'

import Phase2UnclaimedAmount from '../assets/Phase-2-Unclaimed-Amount.png'
import { Phase2EventTimestamp } from '../components/EventTimestamp'
import { useClaimAirdrop } from '../hooks/useClaimAirdrop'
import { useGetPhase } from '../hooks/useGetPhase'
import { useGetTasks } from '../hooks/useGetTasks'
import { ColFlex, RowFlex, StyledGloria, Text } from '../stylings'
import {
  AirdropClaimButtonPhase2,
  CustomGloriaText,
  FlexGrid,
  LoyaltyProgramBanner,
  MainGrid,
  PageWrapper,
  StyledGloriaTextPhase2,
} from './stylings'

const GridContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  max-width: 576px;
  min-width: 576px;

  @media only screen and (max-width: 768px) {
    margin-top: 32px;
    min-width: unset;
  }
  width: 100%;
  min-height: 120px;
  height: fit-content;

  border-radius: 24px;
  border: 2px solid #000;
  background: #fff;
  box-shadow: 4px 4px 0px 0px #000;

  padding: 48px 18px;
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

const AmountRow = styled(RowFlex)`
  justify-content: space-between;
  border-bottom: 1px solid #000;
  padding: 16px 8px;

  align-items: center;
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

const RedeemPhase2 = ({
  totalAmount,
  phase2FeeAmountInETH,
  isFullyClaimed,
  totalAllocationsPhase1,
  remainingAmountInUSD,
  valuePerAmountInUSD,
}: {
  totalAmount: string
  phase2FeeAmountInETH: string
  isFullyClaimed: boolean
  totalAllocationsPhase1: string
  remainingAmountInUSD: number
  valuePerAmountInUSD: number
}) => {
  const { chainId } = useWeb3React()

  const { claimAirdrop, airdropClaimState, claimableState, gasState } = useClaimAirdrop({
    phaseNumber: 2,
    claimedDetails: null,
    feeAmount: phase2FeeAmountInETH,
  })

  const formattedTotalAmount = useMemo(() => {
    if (parseFloat(totalAmount) > 0) {
      return parseFloat(ethers.utils.formatUnits(totalAmount, 18))
    }
    return null
  }, [totalAmount])

  const feesAmountInETH = useMemo(() => {
    if (parseFloat(phase2FeeAmountInETH) > 0) {
      return parseFloat(ethers.utils.formatUnits(phase2FeeAmountInETH, 18))
    }
    return null
  }, [phase2FeeAmountInETH])

  const nativeCurrency = useNativeCurrency(chainId)

  const DERP = useCurrency(DERP_ADDRESSES_BY_CHAINID[chainId ? chainId : SupportedChainId.ZKSYNC_MAINNET], chainId)
  const derpPriceInUSDC = useStablecoinPriceV2(DERP !== null ? DERP : undefined)

  const worthInUSD = useMemo(() => {
    if (!formattedTotalAmount || !derpPriceInUSDC) return null
    return formattedTotalAmount * parseFloat(derpPriceInUSDC.toSignificant())
  }, [formattedTotalAmount, derpPriceInUSDC])

  return (
    <GridContainer>
      <SkewedHeader>
        <Text color="#fff" size="x32px" weight={700}>
          Redeem Airdrop
        </Text>
      </SkewedHeader>
      <ColFlex>
        <AmountRow>
          <Text size="xxl" weight={700}>
            Fixed Amount
          </Text>
          <ColFlex width="unset" gap={8} style={{ alignItems: 'flex-end' }}>
            <Text color="#A372FF" size="lg" weight={500}>
              {formattedTotalAmount ? formatNumber(formattedTotalAmount, NumberType.TokenNonTx) : '0'} DERP (10% DERP
              and 90% xDERP)
            </Text>
            <Text color="#AFBDC8" size="md" weight={500}>
              worth {worthInUSD ? formatNumber(worthInUSD, NumberType.FiatTokenPrice) : 0}
            </Text>
          </ColFlex>
        </AmountRow>
        <AmountRow>
          <Text size="xxl" weight={700}>
            Fees
          </Text>
          <ColFlex width="unset" gap={8} style={{ alignItems: 'flex-end' }}>
            <Text color="#A372FF" size="lg" weight={500}>
              {feesAmountInETH ? feesAmountInETH : '0'} {nativeCurrency.symbol}
            </Text>
          </ColFlex>
        </AmountRow>
        <ColFlex padding="16px 12px">
          <Text color="#AFBDC8" size="md" weight={400}>
            The gas fees included the DERP token transaction during the claiming process. This is used to prevent bots
            from interfering with the airdrop.
          </Text>
        </ColFlex>
        {(airdropClaimState.error && formattedTotalAmount) ||
          (!gasState.isSuccess && formattedTotalAmount && (
            <Text style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} color="#e34444">
              Insufficient gas funds
            </Text>
          ))}
      </ColFlex>
      <ClaimButtonPositioning>
        <AirdropClaimButtonPhase2
          disabled={
            airdropClaimState.isLoading || claimableState.isClaimed || !formattedTotalAmount || !gasState.isSuccess
          }
          onClick={() => claimAirdrop()}
        >
          <GloriaText size="xxl">
            {!claimableState.isLoading ? (
              <>
                {claimableState.isClaimed ? (
                  'Claimed'
                ) : (
                  <>{airdropClaimState.isLoading ? <LoadingDots>Claiming</LoadingDots> : 'Claim Now'}</>
                )}
              </>
            ) : (
              'Loading'
            )}
          </GloriaText>
        </AirdropClaimButtonPhase2>
      </ClaimButtonPositioning>
    </GridContainer>
  )
}

const DetailsWrapperFlex = styled(ColFlex)`
  margin-top: 65px;
  max-width: 535px;

  @media only screen and (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`
const DetailsWrapper = () => {
  return (
    <DetailsWrapperFlex gap={20}>
      <StyledGloria style={{ whiteSpace: 'pre-line', lineHeight: '66px', textAlign: 'initial' }}>
        Airdrop Phase 2
      </StyledGloria>
      {/* TODO: [airdrop] - Edit about for phase two */}
      <Text size="xl">
        Phase 2 is here from 31 Dec! Pay just 5 USD in ETH/BNB for gas, which cleverly includes a DERP buy. It&apos;s
        our anti-bot, fair-play move. Missed this round? Remaining DERP goes to the Derp Foundation for future
        awesomeness. Grab your DERP and join the fun!
      </Text>
    </DetailsWrapperFlex>
  )
}

const TextWrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 0;
  left: 0;
  margin-top: 18%;
  margin-left: 10%;
  gap: 18px;

  @media only screen and (max-width: 768px) {
    margin-top: 12%;
    margin-left: 5%;
    gap: 22px;
  }
`

export const AirdropPhase2 = () => {
  const { totalAmount, phase2FeeAmountInETH, isFullyClaimed, totalAllocationsPhase1 } = useGetTasks()

  const { phase, remainingAmount, isLoadingCountRemaining, remainingAmountInUSD, valuePerAmountInUSD } = useGetPhase({
    totalAllocationsPhase1,
  })

  const navigate = useNavigate()

  useEffect(() => {
    if (phase === 3 || isFullyClaimed) {
      navigate('/airdrop/ended')
    }
  }, [isFullyClaimed, phase])

  return (
    <Trace page="derpdex-airdrop-phase-2" shouldLogImpression>
      <PageWrapper>
        <MainGrid>
          <FlexGrid className="phase-2">
            <TextWrapper>
              <CustomGloriaText color="#fff">Unclaimed Airdrop</CustomGloriaText>
              <StyledGloriaTextPhase2>
                {isLoadingCountRemaining || !(remainingAmount > 0)
                  ? 'Loading'
                  : formatNumber(remainingAmountInUSD, NumberType.PortfolioBalance)}
              </StyledGloriaTextPhase2>
            </TextWrapper>
            <LoyaltyProgramBanner src={Phase2UnclaimedAmount} />
            <Phase2EventTimestamp />
          </FlexGrid>
          <FlexGrid className="claim-or-redeem">
            <FlexGrid className="inner">
              <RedeemPhase2
                totalAmount={totalAmount}
                phase2FeeAmountInETH={phase2FeeAmountInETH}
                isFullyClaimed={isFullyClaimed}
                totalAllocationsPhase1={totalAllocationsPhase1}
                remainingAmountInUSD={remainingAmountInUSD}
                valuePerAmountInUSD={valuePerAmountInUSD}
              />
              <DetailsWrapper />
              {/* <ClaimOrRedeem />
              <AboutText /> */}
            </FlexGrid>
          </FlexGrid>
        </MainGrid>
      </PageWrapper>
    </Trace>
  )
}
