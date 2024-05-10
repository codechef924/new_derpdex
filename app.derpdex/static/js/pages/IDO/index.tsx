import { formatNumber, NumberType } from '@uniswap/conedison/format'
import { GloriaText } from 'components/CustomFonts/GloriaHallelujah'
import { ethers } from 'ethers'
import { useIsMobile } from 'nft/hooks'
import { LoadingDots } from 'pages/Launcpad/stylings'
import { useMemo } from 'react'
import styled from 'styled-components/macro'

import DERPBannerMobile from './assets/DERP-Banner-Mobile.png'
import DERPDEX from './assets/DERPDEX.png'
import IDOBanner from './assets/IDO-banner.png'
import IDOBannerMobile from './assets/IDO-banner-Mobile.png'
import SPHERE from './assets/SPHERE.png'
import SphereBannerMobile from './assets/Sphere-Banner-Mobile.png'
import { useClaimIDO } from './hooks/useClaimIDO'
import { useGetClaimableAmount } from './hooks/useGetClaimableAmount'
import { PLATFORM, useGetUserIDO, USER_IDO } from './hooks/useGetUserIDO'
import { ClaimButton, ContentWrapper, PageImg, PageWrapper, RowFlex, Text } from './stylings'

const Buttoner = styled.div`
  display: inline-flex;
  padding: 12px 16px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 100px;
  border: 2px solid #000;

  background: var(--Primary-Gradient-LR, linear-gradient(270deg, #46c9d2 0%, #a372ff 100%));
  box-shadow: 3px 3px 0px 0px #000;
  z-index: 1;
`
export default function DERPIDO() {
  const { userIDOResult, infoState } = useGetUserIDO()
  const isMobile = useIsMobile()

  const _PLATFORM_LAUNCHPAD = useMemo(() => {
    return {
      [PLATFORM.DERPDEX]: userIDOResult.find((i) => i.platform === PLATFORM.DERPDEX),
      [PLATFORM.SPHERE]: userIDOResult.find((i) => i.platform === PLATFORM.SPHERE),
    }
  }, [userIDOResult])

  return (
    <PageWrapper>
      <PageImg src={isMobile ? IDOBannerMobile : IDOBanner} />
      <ContentWrapper>
        <DERPVestingClaim userIDOResult={_PLATFORM_LAUNCHPAD[PLATFORM.DERPDEX]} />
        <SphereVestingClaim userIDOResult={_PLATFORM_LAUNCHPAD[PLATFORM.SPHERE]} />
      </ContentWrapper>
    </PageWrapper>
  )
}

type IDOClaimType = {
  isSphere?: boolean
}
const ClaimContainer = styled.div<IDOClaimType>`
  position: relative;
  display: flex;
  flex-direction: column;
  max-width: 530px;
  min-height: 100px;
  width: 100%;
  border-radius: 32px;
  border: 2px solid #000;
  background: #fff;

  @media only screen and (max-width: 768px) {
    border-radius: unset;
    border: unset;
    // background: transparent;
  }

  @media only screen and (max-width: 768px) {
    padding: 0px;
    gap: 22px;
  }
`

const ClaimContainerWrapped = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: inherit; // inherited from parent. Allow elements remain under ClaimContainer parent can escape from hidden
  overflow: hidden;

  padding: 0px 0px 48px 0px;

  @media only screen and (max-width: 768px) {
    overflow: visible;
    padding: 0px;
  }
`

const ClaimBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  img.derpdex {
    max-width: 143px;
    @media only screen and (max-width: 768px) {
      max-width: 117px;
    }
  }
  img.sphere {
    max-width: 73px;
  }

  margin-top: 16px;
  padding: 0px 36px 0px 36px;

  @media only screen and (max-width: 768px) {
    padding: 0px 12px;
  }
`

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px 24px;
  width: 100%;
  border-radius: 24px;
  border: 2px solid #000;
  background: #fff;
  box-shadow: 4px 4px 0px 0px #000;
  gap: 6px;

  // min-height: 161px;
  @media only screen and (max-width: 768px) {
    padding: 12px 16px;
  }
`

const PanelNonBordered = styled.div`
  display: flex;
  flex-direction: column;
  border-top: 1px solid #000;
  padding: 21px 32px 0px 32px;
  width: 100%;
  background: #fff;
  gap: 6px;
  margin-top: 38px;

  // min-height: 161px;
`

const InlineFlex = styled(RowFlex)`
  gap: 16px;
  align-items: center;
`

const StyledText = styled(Text)`
  background: var(--Primary-Gradient-LR, linear-gradient(270deg, #46c9d2 0%, #a372ff 100%));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  flex-direction: row;
  gap: 12px;
`

const StyledFocusText = styled(Text)`
  color: #78c6cf;
  flex-direction: row;
`

const ClaimButtonOffset = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;

  bottom: -32px;

  @media only screen and (max-width: 768px) {
    position: relative;
    bottom: 0;
    padding: 0px 12px;
  }
`

const ClaimedBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  padding: 2px 8px;
  background: ${({ theme }) => theme.derpGradientPrimary};
  color: #fff;
`
const DERPVestingClaim = ({ userIDOResult }: { userIDOResult: USER_IDO | undefined }) => {
  const isMobile = useIsMobile()
  const { claimableAmount, claimableBonusAmount, state, onGetClaimableAmount, isAirdropBonusClaimed } =
    useGetClaimableAmount({
      userIDOResult,
    })
  const { claimIDO, claimState } = useClaimIDO({
    userIDOResult,
    refetchClaimableAmount: onGetClaimableAmount,
  })

  const parsedAmount = useMemo(() => {
    if (userIDOResult && userIDOResult.amount) {
      return ethers.utils.formatUnits(userIDOResult.amount, 18)
    }
    return null
  }, [userIDOResult])

  const parsedBonusAmount = useMemo(() => {
    if (userIDOResult && userIDOResult.airdropBonus) {
      return ethers.utils.formatUnits(userIDOResult.airdropBonus, 18)
    }
    return null
  }, [userIDOResult])

  return (
    <ClaimContainer>
      <ClaimContainerWrapped>
        <img src={DERPBannerMobile} alt="derpdex" />
        <ClaimBody>
          <img className="derpdex" src={DERPDEX} alt="derpdex" />
          <Text color="#000" size={isMobile ? 'xl' : 'xxxl'} weight={700}>
            DERP Token Vesting Claim
          </Text>
          <Panel>
            <Text color="#AFBDC8" size={isMobile ? 'lg2' : 'xl'} weight={600}>
              Total claimable amount
            </Text>
            <Text color="#000" size={isMobile ? 'xxl' : 'xxxl'} weight={700}>
              {parsedAmount ? formatNumber(parseFloat(parsedAmount) * 0.7, NumberType.TokenTx) : '0.00'}
            </Text>
            <Text color="#DDD3D3" size={isMobile ? 'md2' : 'lg'} weight={600}>
              *Keep vesting for more rewards
            </Text>
          </Panel>

          <Panel>
            <InlineFlex>
              <Text color="#AFBDC8" size={isMobile ? 'lg2' : 'xl'} weight={600}>
                Airdrop Bonus{' '}
              </Text>
              {isAirdropBonusClaimed && <ClaimedBox>Claimed</ClaimedBox>}
            </InlineFlex>
            <Text color="#000" size={isMobile ? 'xxl' : 'xxxl'} weight={700}>
              {parsedBonusAmount ? formatNumber(parseFloat(parsedBonusAmount), NumberType.TokenTx) : '0.00'}
            </Text>
          </Panel>

          {isMobile && (
            <Panel>
              <Text color="#AFBDC8" size={isMobile ? 'lg2' : 'xxl'} weight={600}>
                Pending claimable amount
              </Text>
              <InlineFlex>
                <StyledText size={isMobile ? 'xxl' : 'xxxl'} weight={700}>
                  {claimableAmount ? formatNumber(parseFloat(claimableAmount), NumberType.TokenTx) : '0.00'}
                </StyledText>
                {claimableBonusAmount && (
                  <>
                    <StyledFocusText size="lg2" weight={700}>
                      (+ {formatNumber(parseFloat(claimableBonusAmount), NumberType.TokenTx)} airdrop bonus)
                    </StyledFocusText>
                  </>
                )}
              </InlineFlex>
            </Panel>
          )}
        </ClaimBody>
        {!isMobile && (
          <PanelNonBordered>
            <Text color="#DDD3D3" size="xl" weight={600}>
              Pending claimable amount
            </Text>
            <InlineFlex>
              <StyledText size="x40px" weight={700}>
                {claimableAmount ? formatNumber(parseFloat(claimableAmount), NumberType.TokenTx) : '0.00'}
              </StyledText>
              {claimableBonusAmount && (
                <>
                  <StyledFocusText size="lg2" weight={700}>
                    (+ {formatNumber(parseFloat(claimableBonusAmount), NumberType.TokenTx)} airdrop bonus)
                  </StyledFocusText>
                </>
              )}
            </InlineFlex>
          </PanelNonBordered>
        )}
      </ClaimContainerWrapped>
      <ClaimButtonOffset>
        <ClaimButton disabled={claimState.isLoading || !parsedAmount} onClick={() => claimIDO()}>
          <GloriaText size="xxl" weight={400} style={{ color: '#fff' }}>
            {claimState.isLoading ? <LoadingDots>Claiming</LoadingDots> : <>Claim</>}
          </GloriaText>
        </ClaimButton>
      </ClaimButtonOffset>
    </ClaimContainer>
  )
}

const SphereVestingClaim = ({ userIDOResult }: { userIDOResult: USER_IDO | undefined }) => {
  const isMobile = useIsMobile()
  const { claimableAmount, claimableBonusAmount, state, onGetClaimableAmount, isAirdropBonusClaimed } =
    useGetClaimableAmount({
      userIDOResult,
    })

  const { claimIDO, claimState } = useClaimIDO({
    userIDOResult,
    refetchClaimableAmount: onGetClaimableAmount,
  })

  const parsedAmount = useMemo(() => {
    if (userIDOResult && userIDOResult.amount) {
      return ethers.utils.formatUnits(userIDOResult.amount, 18)
    }
    return null
  }, [userIDOResult])

  const parsedBonusAmount = useMemo(() => {
    if (userIDOResult && userIDOResult.airdropBonus && parseFloat(userIDOResult.airdropBonus) > 0) {
      return ethers.utils.formatUnits(userIDOResult.airdropBonus, 18)
    }
    return null
  }, [userIDOResult])

  return (
    <ClaimContainer isSphere={true}>
      <ClaimContainerWrapped>
        <img src={SphereBannerMobile} alt="sphere-finance" />
        <ClaimBody>
          <img className="sphere" src={SPHERE} alt="sphere" />
          <Text color="#000" size={isMobile ? 'xl' : 'xxxl'} weight={700}>
            SPHERE Token Vesting Claim
          </Text>
          <Panel>
            <Text color="#AFBDC8" size={isMobile ? 'lg2' : 'xl'} weight={600}>
              Total claimable amount
            </Text>
            <Text color="#000" size={isMobile ? 'xxl' : 'xxxl'} weight={700}>
              {parsedAmount ? formatNumber(parseFloat(parsedAmount) * 0.7, NumberType.TokenTx) : '0.00'}
            </Text>
            <Text color="#DDD3D3" size={isMobile ? 'md2' : 'lg'} weight={600}>
              *Keep vesting for more rewards
            </Text>
          </Panel>

          <Panel>
            <InlineFlex>
              <Text color="#AFBDC8" size={isMobile ? 'lg2' : 'xl'} weight={600}>
                Airdrop Bonus{' '}
              </Text>
              {isAirdropBonusClaimed && <ClaimedBox>Claimed</ClaimedBox>}
            </InlineFlex>
            <Text color="#000" size={isMobile ? 'xxl' : 'xxxl'} weight={700}>
              {parsedBonusAmount ? formatNumber(parseFloat(parsedBonusAmount), NumberType.TokenTx) : '0.00'}
            </Text>
          </Panel>

          {isMobile && (
            <Panel>
              <Text color="#AFBDC8" size={isMobile ? 'lg2' : 'xxl'} weight={600}>
                Pending claimable amount
              </Text>
              <InlineFlex>
                <StyledText size={isMobile ? 'xxl' : 'xxxl'} weight={700}>
                  {claimableAmount ? formatNumber(parseFloat(claimableAmount), NumberType.TokenTx) : '0.00'}
                </StyledText>
                {claimableBonusAmount && (
                  <>
                    <StyledFocusText size="lg2" weight={700}>
                      (+ {formatNumber(parseFloat(claimableBonusAmount), NumberType.TokenTx)} airdrop bonus)
                    </StyledFocusText>
                  </>
                )}
              </InlineFlex>
            </Panel>
          )}
        </ClaimBody>
        {!isMobile && (
          <PanelNonBordered>
            <Text color="#DDD3D3" size="xl" weight={600}>
              Pending claimable amount
            </Text>
            <InlineFlex>
              <StyledText size="x40px" weight={700}>
                {claimableAmount ? formatNumber(parseFloat(claimableAmount), NumberType.TokenTx) : '0.00'}
              </StyledText>
              {claimableBonusAmount && (
                <>
                  <StyledFocusText size="lg2" weight={700}>
                    (+ {formatNumber(parseFloat(claimableBonusAmount), NumberType.TokenTx)} airdrop bonus)
                  </StyledFocusText>
                </>
              )}
            </InlineFlex>
          </PanelNonBordered>
        )}
      </ClaimContainerWrapped>
      <ClaimButtonOffset>
        <ClaimButton disabled={claimState.isLoading || !parsedAmount} onClick={() => claimIDO()}>
          <GloriaText size="xxl" weight={400} style={{ color: '#fff' }}>
            {claimState.isLoading ? <LoadingDots>Claiming</LoadingDots> : <>Claim</>}
          </GloriaText>
        </ClaimButton>
      </ClaimButtonOffset>
    </ClaimContainer>
  )
}
