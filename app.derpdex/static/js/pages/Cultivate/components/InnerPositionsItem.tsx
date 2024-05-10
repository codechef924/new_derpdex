/* eslint-disable import/no-unused-modules */
import { Position as PositionSDK } from '@derpdex/sdk'
import { CircularProgress } from '@mui/material'
import { formatNumber, NumberType } from '@uniswap/conedison/format'
import { Currency, CurrencyAmount, Token } from '@uniswap/sdk-core'
import { useWeb3React } from '@web3-react/core'
import { GloriaText } from 'components/CustomFonts/GloriaHallelujah'
import { NunitoText } from 'components/CustomFonts/Nunito'
import { getPriceOrderingFromPositionForUI } from 'components/PositionListItem'
import { MouseoverTooltip } from 'components/Tooltip'
import { SupportedChainId } from 'constants/chains'
import { ZERO_ADDRESS } from 'constants/misc'
import { BigNumber, Contract, ethers } from 'ethers'
import { useCurrency, useToken } from 'hooks/Tokens'
import { PositionFields } from 'hooks/useCultivatePoolDatas'
import useIsTickAtLimit from 'hooks/useIsTickAtLimit'
import { useDerpPool } from 'hooks/usePools'
import useStablecoinPriceV2 from 'hooks/useStablecoinPriceV2'
import { useV3PositionFromTokenId } from 'hooks/useV3Positions'
import { incentiveKeysAtom, STAKING_POOL_STATE } from 'hooks/useWhitelistedPoolAddresses'
import { useAtomValue } from 'jotai/utils'
import { useIsMobile } from 'nft/hooks'
import { DERP_ADDRESSES_BY_CHAINID } from 'pages/xDERP/constants'
import { useEffect, useMemo, useState } from 'react'
import { Info } from 'react-feather'
import { useNavigate } from 'react-router-dom'
import { Bound } from 'state/mint/v3/actions'
import styled from 'styled-components'
import { formatTickPrice } from 'utils/formatTickPrice'

import YieldBoosterABI from '../abis/yieldbooster.abi.json'
import { ReactComponent as Iconleft } from '../assets/icon-left.svg'
import { ReactComponent as IconRight } from '../assets/icon-right.svg'
import { YIELD_BOOSTER_ADDRESSES_BY_CHAINID } from '../constants'
import { stakedPools } from '../hooks/ComponentHooks'
import { useDeallocateXDerp } from '../hooks/useAllocateXDerp'
import { DerivedPositions, Position } from '../hooks/useDerivedStakedPositions'
import { earnedAdditionalAtom, earnedAtom } from '../hooks/useGetEarnedStaking'
import { useGetIndividualStakingAPR } from '../hooks/useGetStakingAPR'
import { useGetStakingMultiplier } from '../hooks/useGetStakingMultiplier'
import { useHarvestDerp } from '../hooks/useHarvestDerp'
import { useApproveXDerpStaking, useStakeXDerp } from '../hooks/useStakeXDerp'
import { allocationInfoJotai, AllocationType, useUserPositionAllocation } from '../hooks/useUserPositionAllocation'
import { ColFlex, CultivateButton, RowFlex, StyledGloriaText, Text } from '../stylings'
import { BoostModal } from './BoostModal.tsx'
import { formatDelta } from './PriceChart'
import { StakingModal } from './StakingModal'
import { stakingView, TableOption } from './Table'

const InnerWrapper = styled.div`
  display: grid;
  // grid-template-columns: 0.9fr 5fr;
  // new implementation
  padding: 0px 12px;

  grid-auto-flow: column;
  width: 100%;
  gap: 8px;

  @media only screen and (max-width: 768px) {
    display: flex;
    flex-direction: column;
    padding: 8px;
  }
`

const InnerPositionWrapper = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 2fr 4fr;
  grid-auto-flow: column;
  width: 100%;
  gap: 12px;

  // padding-right: 12px;

  @media only screen and (max-width: 768px) {
    display: flex;
    flex-direction: column;
    padding-right: 0px;
    gap: 8px;
  }
`

const AvailableWrapper = styled(ColFlex)`
  // min-width: 296px;
  min-width: 269px;
  min-height: 225px;
  padding: 22px 0px;

  @media only screen and (max-width: 768px) {
    min-width: 100%;
    min-height: unset;
    padding: 0px;
  }
`

const StakedWrapper = styled(ColFlex)`
  min-width: 296px;
  min-height: 245px;
  padding: 22px 0px;

  @media only screen and (max-width: 768px) {
    min-width: 100%;
    min-height: unset;
    padding: 0px;
  }
`

const ItemDetailsWrapper = styled(ColFlex)`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 17px 0px 4px 0px;
  border-radius: 16px;
  border: 2px solid #000;

  background: #fff;

  box-shadow: 2px 2px 0px 0px #000;
  overflow: hidden;
  z-index: 1;

  @media only screen and (max-width: 768px) {
    &.available {
      height: 216px;
      min-height: 236px;
    }
    &.staked {
      height: unset;
      min-height: unset;
    }
  }
`

const PositionTypeHeader = styled(Text)`
  font-size: 14px;
  font-weight: 700;
  color: rgba(175, 189, 200, 1);
  display: inline-flex;
  justify-content: space-between;
  padding: 0px 19px;
`

const PaginatedItems = styled(RowFlex)`
  align-items: center;
  justify-content: space-between;
  height: 100%;

  svg {
    cursor: pointer;
  }
`

const PageNumber = styled(NunitoText)`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a372ff;
  font-size: 10px;
  font-weight: 700;
`
const BodyPositionDetails = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  background: #f7f7f7;
  width: 100%;
  height: 100%;
  padding: 8px 12px 16px 12px;
  gap: 6px;

  justify-content: space-between;
`

const BlurredContainer = styled.div`
  position: absolute;
  backdrop-filter: blur(2px);
  width: 100%;
  height: 100%;
  border-radius: 16px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 999;
`

const RequireApproveContainer = styled.div`
  max-width: 400px;
  width: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  height: 154px;
  border-radius: 16px;
  border: 2px solid #344d73;
  box-shadow: 3px 3px 0px 0px #000;
  padding: 16px 16px;

  .button {
    width: 350px;
    @media only screen and (max-width: 768px) {
      width: 100%;
    }
  }
`

type BtnOpts = {
  isMaximized?: boolean
}
const AllocationButton = styled(CultivateButton)<BtnOpts>`
  max-width: ${({ isMaximized }) => (isMaximized ? 'unset' : '130px')};
  padding: 6px 6px;
  font-size: 18px;
  box-shadow: 3px 3px 0px 0px #000;
  border-radius: 16px;
  border: 2px solid #344d73;
`

const EndedContainer = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(3px);
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

const GloriaGradientText = styled(GloriaText)`
  background: var(--Primary-Gradient-LR, linear-gradient(270deg, #46c9d2 0%, #a372ff 100%));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: normal;
`

export const InnerPositionItems = ({
  derivedPositions,
  positionItems,
  currencyPairInfo,
  poolBaseAPR,
  chainId,
  incentiveId,
  isPaused,
}: {
  derivedPositions: DerivedPositions
  positionItems: PositionFields[]
  currencyPairInfo: {
    feeTier: number
    pair: (Currency | null | undefined)[]
  }
  poolBaseAPR: string
  chainId: number
  incentiveId: string
  isPaused: boolean
}) => {
  const currentView = useAtomValue(stakingView)
  const { actionCall, approveState, isApprovedForAll, approveDerpDexStaking } = useApproveXDerpStaking()

  const { getUserPositionAllocationInit } = useUserPositionAllocation({
    poolAddress: 'UNSET',
    poolId: 'UNSET',
    shouldInvoke: false,
  })

  useEffect(() => {
    positionItems.forEach((item) => {
      getUserPositionAllocationInit({
        poolAddress: item.poolAddress,
        poolId: item.id,
      })
    })
  }, [positionItems])

  const allocationInfoState = useAtomValue(allocationInfoJotai)
  const isMobile = useIsMobile()
  return (
    <InnerWrapper>
      {/* {!isMobile && (
        <PreviewPools chainId={chainId} positionItems={positionItems} currencyPairInfo={currencyPairInfo} />
      )} */}

      <InnerPositionWrapper>
        {!isApprovedForAll && (
          <BlurredContainer>
            <RequireApproveContainer>
              <Text size="lg2" weight={700}>
                Unlock Yield Booster to start staking
              </Text>
              <AllocationButton
                isMaximized={true}
                disabled={approveState.isLoading}
                className="button"
                onClick={() => approveDerpDexStaking()}
              >
                <GloriaText>{actionCall}</GloriaText>
              </AllocationButton>
            </RequireApproveContainer>
          </BlurredContainer>
        )}
        <AvailableWrapper>
          <AvailableItems
            incentiveId={incentiveId}
            derivedAvailablePositions={derivedPositions[Position.AVAILABLE]}
            positionItems={positionItems}
            currencyPairInfo={currencyPairInfo}
            isPaused={isPaused}
          />
        </AvailableWrapper>
        <StakedWrapper>
          <StakedItems
            derivedStakedPositions={derivedPositions[Position.STAKED]}
            positionItems={positionItems}
            currencyPairInfo={currencyPairInfo}
            chainId={chainId}
            incentiveId={incentiveId}
          />
        </StakedWrapper>
      </InnerPositionWrapper>
    </InnerWrapper>
  )
}

const AvailableItems = ({
  incentiveId,
  derivedAvailablePositions,
  currencyPairInfo,
  isPaused,
}: {
  incentiveId: string
  derivedAvailablePositions: PositionFields[]
  positionItems: PositionFields[]
  currencyPairInfo: {
    feeTier: number
    pair: (Currency | null | undefined)[]
  }
  isPaused: boolean
}) => {
  const currentView = useAtomValue(stakingView)
  const [currentIndex, setCurrentIndex] = useState<number>(0)

  const navigate = useNavigate()

  return (
    <ItemDetailsWrapper className="available">
      <PositionTypeHeader>
        <NunitoText>Available Position(s)</NunitoText>
        <NunitoText>{derivedAvailablePositions.length} Position</NunitoText>
      </PositionTypeHeader>
      {/* {currentView === STAKING_POOL_STATE.FINISHED && (
        <EndedContainer>
          <GloriaText size="xxl">ENDED</GloriaText>
        </EndedContainer>
      )} */}
      <PaginatedItems>
        <Iconleft
          onClick={() => {
            if (currentIndex > 0) setCurrentIndex(currentIndex - 1)
          }}
        />
        {derivedAvailablePositions && derivedAvailablePositions.length > 0 ? (
          <AvailableBodyDetails
            position={derivedAvailablePositions[currentIndex]}
            incentiveId={incentiveId}
            currencyPairInfo={currencyPairInfo}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            isPaused={isPaused}
          />
        ) : (
          <NoPositions>
            <StyledGloriaText
              size="xl"
              style={{ cursor: 'pointer' }}
              onClick={() =>
                navigate(
                  `/add/${currencyPairInfo.pair[0]?.wrapped.address}/${currencyPairInfo.pair[1]?.wrapped.address}/${currencyPairInfo.feeTier}`
                )
              }
            >
              Start Adding Liquidity
            </StyledGloriaText>
          </NoPositions>
        )}
        <IconRight
          onClick={() => {
            if (currentIndex < derivedAvailablePositions.length - 1) setCurrentIndex(currentIndex + 1)
          }}
        />
      </PaginatedItems>
      <PageNumber>
        {currentIndex + 1}/{derivedAvailablePositions.length > 0 ? derivedAvailablePositions.length : 1}
      </PageNumber>
    </ItemDetailsWrapper>
  )
}

const MinMaxRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: start;
  font-size: 16px;
  font-weight: 600;
  gap: 4px;
`

const MinMax = styled.div`
  display: flex;
  flex-direction: row;
  align-items: start;
  font-size: 16px;
  font-weight: 600;
  gap: 4px;
`

const FocusedTextBlue = styled(Text)`
  color: #3683f5;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`

const FocusedText = styled(Text)`
  color: #000;
  font-style: normal;
  font-size: 16px;
  font-weight: 600;
  line-height: normal;
`

const GrayedText12 = styled(Text)`
  color: #9aa2a8;
  font-style: normal;
  font-size: 12px;
  font-weight: 700;
  line-height: normal;
`

const GrayedText = styled(Text)`
  color: #9aa2a8;
  font-style: normal;
  font-size: 16px;
  font-weight: 700;
  line-height: normal;
`

const FocusedGradientText = styled(Text)`
  background: var(--Primary-Gradient-LR, linear-gradient(270deg, #46c9d2 0%, #a372ff 100%));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-style: normal;
  font-size: ${({ size }) => (size ? size : '16px')}px;
  font-weight: 600;
  line-height: normal;
`

const FocusedGradientText32 = styled.div`
  background: var(--Primary-Gradient-LR, linear-gradient(270deg, #46c9d2 0%, #a372ff 100%));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-style: normal;
  font-size: 32px;
  font-weight: 400;
  line-height: 19px;
`

const NoPositions = styled(ColFlex)`
  border: 2px dashed #afbdc8;
  border-radius: 16px;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  text-align: center;

  &.is-staked {
    cursor: pointer;
    color: rgba(175, 189, 200, 1);
  }
`

const AvailableInnerGrid = styled.div`
  display: grid;
  grid-template-columns: 3fr 1.3fr;
`

const InfoIconContainer = styled.div`
  margin-left: 2px;
  display: flex;
  align-items: center;
  cursor: help;
`

const UnsetButton = styled(AllocationButton)`
  max-height: 40px;
  min-height: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border-radius: 12px;
`

const AvailableBodyDetails = ({
  position,
  incentiveId,
  currencyPairInfo,
  currentIndex,
  setCurrentIndex,
  isPaused,
}: {
  position: PositionFields
  incentiveId: string
  currencyPairInfo: {
    feeTier: number
    pair: (Currency | null | undefined)[]
  }
  currentIndex: number
  setCurrentIndex: React.Dispatch<number>
  isPaused: boolean
}) => {
  const [isOpen, setOpen] = useState<boolean>(false)
  const { stakeState, stakeActionCall, stakeXDerp } = useStakeXDerp({
    incentiveId,
    poolAddress: position.poolAddress,
    poolId: position.id,
  })

  const token0 = useToken(currencyPairInfo.pair[0]?.wrapped.address)
  const token1 = useToken(currencyPairInfo.pair[1]?.wrapped.address)

  const { loading, position: positionDetails } = useV3PositionFromTokenId(BigNumber.from(position.id))

  const {
    token0: token0Address,
    token1: token1Address,
    fee: feeAmount,
    liquidity,
    tickLower,
    tickUpper,
    tokenId,
  } = positionDetails || {}

  const [poolState, pool] = useDerpPool(token0 ?? undefined, token1 ?? undefined, feeAmount)

  const lpPosition = useMemo(() => {
    if (pool && liquidity && typeof tickLower === 'number' && typeof tickUpper === 'number') {
      return new PositionSDK({ pool, liquidity: liquidity.toString(), tickLower, tickUpper })
    }
    return undefined
  }, [liquidity, pool, tickLower, tickUpper])

  const pricesFromPosition = getPriceOrderingFromPositionForUI(lpPosition)
  const tickAtLimit = useIsTickAtLimit(feeAmount, tickLower, tickUpper)

  useEffect(() => {
    if (stakeState.isSuccess) {
      setCurrentIndex(0)
    }
  }, [stakeState.isSuccess])

  useEffect(() => {
    if (stakeState.isResolved) {
      setOpen(false)
    }
  }, [stakeState.isResolved])

  const StakeAction = () => {
    return (
      <AllocationButton isMaximized={true} disabled={stakeState.isLoading || isPaused} onClick={() => stakeXDerp()}>
        <GloriaText>{stakeActionCall}</GloriaText>
      </AllocationButton>
    )
  }

  const { chainId, provider, account } = useWeb3React()
  const [shouldShowDeallocate, setShouldShowDeallocate] = useState<boolean>(false)
  const [allocatedAmount, setAllocatedAmount] = useState<string | null>(null)
  const hasLockedXDerp = async () => {
    try {
      if (!chainId || !provider) throw null

      const signer = provider.getSigner()
      const contract = new Contract(YIELD_BOOSTER_ADDRESSES_BY_CHAINID[chainId], YieldBoosterABI, signer)
      const caller = await contract.userPositionAllocation(account, position.poolAddress, position.id)

      if (parseFloat(caller.xDerpAmount) > 0) {
        setShouldShowDeallocate(true)
        const parsedAmount = ethers.utils.formatUnits(caller.xDerpAmount.toString(), 18)
        setAllocatedAmount(parsedAmount)
      } else setShouldShowDeallocate(false)
    } catch (error) {
      console.log('[Err hasLockedXDerp]', error)
    }
  }

  const { deallocateState, deallocateActionCall, deallocateXDerp } = useDeallocateXDerp({
    incentiveId,
    poolAddress: position.poolAddress,
    poolId: position.id,
    amount: allocatedAmount ? allocatedAmount : '0',
  })

  useEffect(() => {
    hasLockedXDerp()
  }, [position, account, provider, deallocateState.isSuccess])

  const currentView = useAtomValue(stakingView)

  const price0 = useStablecoinPriceV2(token0 ?? undefined)
  const price1 = useStablecoinPriceV2(token1 ?? undefined)

  const fiatValueOfLiquidity: CurrencyAmount<Token> | null = useMemo(() => {
    if (!price0 || !price1 || !lpPosition) return null
    const amount0 = price0.quote(lpPosition.amount0)
    const amount1 = price1.quote(lpPosition.amount1)
    return amount0.add(amount1)
  }, [price0, price1, lpPosition])

  const MinMaxComponent = () => {
    return (
      <MinMaxRow>
        <MinMax>
          <GrayedText>Min:</GrayedText>
          <FocusedGradientText>
            {formatTickPrice({
              price: pricesFromPosition.priceLower,
              atLimit: tickAtLimit,
              direction: Bound.LOWER,
              numberType: NumberType.TokenNonTx,
            })}
          </FocusedGradientText>
        </MinMax>
        <MinMax>
          <GrayedText>Max:</GrayedText>
          {tickAtLimit.UPPER ? (
            <FocusedGradientText32>
              {formatTickPrice({
                price: pricesFromPosition.priceUpper,
                atLimit: tickAtLimit,
                direction: Bound.UPPER,
                numberType: NumberType.TokenNonTx,
              })}
            </FocusedGradientText32>
          ) : (
            <FocusedGradientText>
              {formatTickPrice({
                price: pricesFromPosition.priceUpper,
                atLimit: tickAtLimit,
                direction: Bound.UPPER,
                numberType: NumberType.TokenNonTx,
              })}
            </FocusedGradientText>
          )}
        </MinMax>
      </MinMaxRow>
    )
  }

  const safeStatePositionValue = useMemo(() => {
    if (fiatValueOfLiquidity) {
      return fiatValueOfLiquidity
    }
    return 0
  }, [fiatValueOfLiquidity])

  return (
    <BodyPositionDetails>
      <AvailableInnerGrid>
        <ColFlex gap={8}>
          <FocusedText>
            {currencyPairInfo.pair[0]?.symbol} - {currencyPairInfo.pair[1]?.symbol} LP (#{position.id})
          </FocusedText>
          <MinMaxComponent />
          <NunitoText size="lg" weight={700}>
            {currencyPairInfo.pair[0]?.symbol} per {currencyPairInfo.pair[1]?.symbol} - $
            {safeStatePositionValue?.toFixed(3)}
          </NunitoText>
        </ColFlex>
        {shouldShowDeallocate && (
          <ColFlex style={{ justifyContent: 'center' }}>
            <UnsetButton disabled={deallocateState.isLoading} onClick={() => deallocateXDerp()}>
              {!deallocateState.isLoading ? (
                <>
                  <GloriaText>Unset</GloriaText>
                  <MouseoverTooltip text={`Unset your allocated xDERP. Allocated ${allocatedAmount} xDERP`}>
                    <InfoIconContainer>
                      <Info size={14} />
                    </InfoIconContainer>
                  </MouseoverTooltip>
                </>
              ) : (
                <>
                  <CircularProgress size={16} />
                </>
              )}

              {/* <NunitoText weight={600}>{allocatedAmount} xDERP</NunitoText> */}
            </UnsetButton>
          </ColFlex>
        )}
      </AvailableInnerGrid>
      {/* <StakeAction stakeActionCall={stakeActionCall} /> */}
      {currentView === STAKING_POOL_STATE.FINISHED ? (
        <AllocationButton isMaximized={true} disabled={true}>
          <GloriaText>Ended</GloriaText>
        </AllocationButton>
      ) : (
        <AllocationButton disabled={isPaused} isMaximized={true} onClick={() => setOpen(true)}>
          <GloriaText>{isPaused ? 'Pool is paused' : 'Stake'}</GloriaText>
        </AllocationButton>
      )}

      <StakingModal
        isOpen={isOpen}
        onDismiss={() => setOpen(!isOpen)}
        position={position}
        currencyPairInfo={currencyPairInfo}
        components={<StakeAction />}
        components2={<MinMaxComponent />}
        lpValue={fiatValueOfLiquidity?.toFixed(3)}
      />
    </BodyPositionDetails>
  )
}

const StakedItems = ({
  derivedStakedPositions,
  currencyPairInfo,
  chainId,
  incentiveId,
}: {
  derivedStakedPositions: PositionFields[]
  positionItems: PositionFields[]
  currencyPairInfo: {
    feeTier: number
    pair: (Currency | null | undefined)[]
  }
  chainId: number
  incentiveId: string
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0)

  const currentView = useAtomValue(stakingView)

  return (
    <ItemDetailsWrapper className="staked">
      <PositionTypeHeader>
        <NunitoText>Staked Position(s)</NunitoText>
        <NunitoText>{derivedStakedPositions.length} Position</NunitoText>
      </PositionTypeHeader>
      <PaginatedItems>
        <Iconleft
          onClick={() => {
            if (currentIndex > 0) setCurrentIndex(currentIndex - 1)
          }}
        />
        {derivedStakedPositions.length > 0 ? (
          <>
            {derivedStakedPositions && derivedStakedPositions[currentIndex] && (
              <StakedBodyDetails
                position={derivedStakedPositions[currentIndex]}
                currencyPairInfo={currencyPairInfo}
                setCurrentIndex={setCurrentIndex}
                chainId={chainId}
                incentiveId={incentiveId}
              />
            )}
          </>
        ) : (
          <NoPositions className="is-staked">
            <GloriaText>0 Staked Position</GloriaText>
            <GloriaText size="xl">
              {currentView === STAKING_POOL_STATE.FINISHED ? 'Pool ended for staking' : 'Stake now to start earning'}
            </GloriaText>
          </NoPositions>
        )}

        <IconRight
          onClick={() => {
            if (currentIndex < derivedStakedPositions.length - 1) setCurrentIndex(currentIndex + 1)
          }}
        />
      </PaginatedItems>
      <PageNumber>
        {currentIndex + 1}/{derivedStakedPositions.length > 0 ? derivedStakedPositions.length : 1}
      </PageNumber>
    </ItemDetailsWrapper>
  )
}

const StakedRowOptions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;

  @media only screen and (max-width: 768px) {
    display: flex;
    flex-direction: column;
  }
`

const StakingStateFlexRoot = styled(RowFlex)`
  justify-content: space-between;
  align-items: center;

  @media only screen and (max-width: 768px) {
    margin: 4px 0px 0px 0px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`

const StakingStateFlex = styled(RowFlex)`
  width: unset;
  gap: 12px;

  // @media only screen and (max-width: 768px) {
  //   display: flex;
  //   flex-direction: column;
  // }
`
const FocusedGreen = styled(Text)`
  color: #40b66b;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`
const StakedBodyDetails = ({
  position,
  currencyPairInfo,
  setCurrentIndex,
  chainId,
  incentiveId,
}: {
  position: PositionFields
  currencyPairInfo: {
    feeTier: number
    pair: (Currency | null | undefined)[]
  }
  setCurrentIndex: React.Dispatch<number>
  chainId: number
  incentiveId: string
}) => {
  const [isOpen, setOpen] = useState<boolean>(false)
  const token0 = useToken(currencyPairInfo.pair[0]?.wrapped.address)
  const token1 = useToken(currencyPairInfo.pair[1]?.wrapped.address)

  const { loading, position: positionDetails } = useV3PositionFromTokenId(BigNumber.from(position.id))

  const {
    token0: token0Address,
    token1: token1Address,
    fee: feeAmount,
    liquidity,
    tickLower,
    tickUpper,
    tokenId,
  } = positionDetails || {}

  const [poolState, pool] = useDerpPool(token0 ?? undefined, token1 ?? undefined, feeAmount)

  const lpPosition = useMemo(() => {
    if (pool && liquidity && typeof tickLower === 'number' && typeof tickUpper === 'number') {
      return new PositionSDK({ pool, liquidity: liquidity.toString(), tickLower, tickUpper })
    }
    return undefined
  }, [liquidity, pool, tickLower, tickUpper])

  const pricesFromPosition = getPriceOrderingFromPositionForUI(lpPosition)
  const tickAtLimit = useIsTickAtLimit(feeAmount, tickLower, tickUpper)

  const { unstakeState, unstakeActionCall, unstakeXDerp } = useStakeXDerp({
    incentiveId,
    poolAddress: position.poolAddress,
    poolId: position.id,
  })

  useEffect(() => {
    if (unstakeState.isSuccess) {
      setCurrentIndex(0)
    }
  }, [unstakeState.isSuccess])

  useEffect(() => {
    if (unstakeState.isResolved) {
      setOpen(false)
    }
  }, [unstakeState.isResolved])

  const UnstakeAction = () => {
    return (
      <AllocationButton isMaximized={true} disabled={unstakeState.isLoading} onClick={() => unstakeXDerp()}>
        <GloriaText>{unstakeActionCall}</GloriaText>
      </AllocationButton>
    )
  }

  const [shouldRefetchAfterBoost, setShouldRefetchAfterBoost] = useState<boolean>(false)
  const { stakingMultiplier: userStakingPoolMultiplier } = useGetStakingMultiplier({
    poolId: position.id,
    refetch: shouldRefetchAfterBoost,
    setShouldRefetchAfterBoost,
  })

  const { positionApr } = useGetIndividualStakingAPR(position.poolAddress, position.id, incentiveId)

  const stakedPoolsAtom = useAtomValue(stakedPools)

  const safeStatePositionValue = useMemo(() => {
    if (stakedPoolsAtom && stakedPoolsAtom[incentiveId] && stakedPoolsAtom[incentiveId][position.id]) {
      return stakedPoolsAtom[incentiveId][position.id]
    }
    return 0
  }, [incentiveId, position.id, stakedPoolsAtom])

  // useUpdateStakedTVL({
  //   poolAddress: position.poolAddress,
  //   stakedPosition: position,
  //   chainId,
  // })

  const MinMaxComponent = () => {
    return (
      <MinMaxRow>
        <MinMax>
          <GrayedText>Min:</GrayedText>
          <FocusedGradientText>
            {formatTickPrice({
              price: pricesFromPosition.priceLower,
              atLimit: tickAtLimit,
              direction: Bound.LOWER,
              numberType: NumberType.TokenNonTx,
            })}
          </FocusedGradientText>
        </MinMax>
        <MinMax>
          <GrayedText>Max:</GrayedText>
          {tickAtLimit.UPPER ? (
            <FocusedGradientText32>
              {formatTickPrice({
                price: pricesFromPosition.priceUpper,
                atLimit: tickAtLimit,
                direction: Bound.UPPER,
                numberType: NumberType.TokenNonTx,
              })}
            </FocusedGradientText32>
          ) : (
            <FocusedGradientText>
              {formatTickPrice({
                price: pricesFromPosition.priceUpper,
                atLimit: tickAtLimit,
                direction: Bound.UPPER,
                numberType: NumberType.TokenNonTx,
              })}
            </FocusedGradientText>
          )}
        </MinMax>
      </MinMaxRow>
    )
  }

  return (
    <ColFlex gap={6}>
      <StakingStateFlexRoot>
        <FocusedText>
          {currencyPairInfo.pair[0]?.symbol} - {currencyPairInfo.pair[1]?.symbol} LP (#{position.id})
        </FocusedText>
        <StakingStateFlex>
          <InlineText>
            <GrayedText12>Pool Multiplier:</GrayedText12>
            <FocusedGreen size="md2">{userStakingPoolMultiplier}x</FocusedGreen>
          </InlineText>
          <InlineText>
            <GrayedText12>Staking APR:</GrayedText12>
            <FocusedGreen size="md2">{formatDelta(positionApr)}</FocusedGreen>
          </InlineText>
        </StakingStateFlex>
      </StakingStateFlexRoot>
      <StakedRowOptions>
        <BodyPositionDetails>
          <MinMaxRow>
            <MinMax>
              <GrayedText>Min:</GrayedText>
              <FocusedGradientText>
                {formatTickPrice({
                  price: pricesFromPosition.priceLower,
                  atLimit: tickAtLimit,
                  direction: Bound.LOWER,
                  numberType: NumberType.TokenNonTx,
                })}
              </FocusedGradientText>
            </MinMax>
            <MinMax>
              <GrayedText>Max:</GrayedText>
              {tickAtLimit.UPPER ? (
                <FocusedGradientText32>
                  {formatTickPrice({
                    price: pricesFromPosition.priceUpper,
                    atLimit: tickAtLimit,
                    direction: Bound.UPPER,
                    numberType: NumberType.TokenNonTx,
                  })}
                </FocusedGradientText32>
              ) : (
                <FocusedGradientText>
                  {formatTickPrice({
                    price: pricesFromPosition.priceUpper,
                    atLimit: tickAtLimit,
                    direction: Bound.UPPER,
                    numberType: NumberType.TokenNonTx,
                  })}
                </FocusedGradientText>
              )}
            </MinMax>
          </MinMaxRow>
          <NunitoText size="lg" weight={700}>
            {currencyPairInfo.pair[0]?.symbol} per {currencyPairInfo.pair[1]?.symbol} - $
            {safeStatePositionValue.toFixed(3)}
          </NunitoText>
          <AllocationButton isMaximized={true} onClick={() => setOpen(true)}>
            <GloriaText size="md2">Unstake</GloriaText>
          </AllocationButton>
          <StakingModal
            isOpen={isOpen}
            onDismiss={() => setOpen(!isOpen)}
            position={position}
            currencyPairInfo={currencyPairInfo}
            components={<UnstakeAction />}
            components2={<MinMaxComponent />}
            lpValue={safeStatePositionValue.toFixed(3)}
          />
        </BodyPositionDetails>
        <Allocate
          incentiveId={incentiveId}
          poolAddress={position.poolAddress}
          poolId={position.id}
          userStakingPoolMultiplier={userStakingPoolMultiplier}
          setShouldRefetchAfterBoost={setShouldRefetchAfterBoost}
        />
        <Harvest chainId={chainId} incentiveId={incentiveId} poolAddress={position.poolAddress} poolId={position.id} />
      </StakedRowOptions>
    </ColFlex>
  )
}

const InlineText = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
`

const Harvest = ({
  poolAddress,
  poolId,
  incentiveId,
  chainId,
}: {
  poolAddress: string
  poolId: string
  incentiveId: string
  chainId: SupportedChainId | number
}) => {
  const incentiveKeys = useAtomValue(incentiveKeysAtom)

  const { harvestActionCall, harvestState, harvestXDerp } = useHarvestDerp({
    incentiveId,
    poolAddress,
    poolId,
  })

  const derivedEarnings = useAtomValue(earnedAtom)

  const derivedEarningsAdditional = useAtomValue(earnedAdditionalAtom)

  const earnings = useMemo(() => {
    if (derivedEarnings && derivedEarnings[incentiveId]) {
      return derivedEarnings[incentiveId][poolId]
    } else {
      return '0'
    }
  }, [derivedEarnings, incentiveId, poolId])

  const earningsAdditional = useMemo(() => {
    if (derivedEarningsAdditional && derivedEarningsAdditional[incentiveId]) {
      return derivedEarningsAdditional[incentiveId][poolId]
    } else {
      return '0'
    }
  }, [derivedEarningsAdditional, incentiveId, poolId, incentiveKeys[incentiveId]])

  const DERPTOKEN = useCurrency(chainId ? DERP_ADDRESSES_BY_CHAINID[chainId] : ZERO_ADDRESS)

  const ADDITIONAL_TOKEN = useCurrency(
    incentiveKeys[incentiveId] && incentiveKeys[incentiveId].addtionalIncentives.length > 0
      ? incentiveKeys[incentiveId].addtionalIncentives[0].rewardToken
      : ZERO_ADDRESS
  )

  return (
    <BodyPositionDetails>
      <GrayedText12>Earned Rewards</GrayedText12>
      <InlineText>
        {earnings && (
          <Text size="md2" weight={600}>
            {formatNumber(parseFloat(earnings), NumberType.TokenNonTx)}
          </Text>
        )}
        <FocusedGradientText size="md2">{DERPTOKEN?.symbol}</FocusedGradientText>
      </InlineText>
      <InlineText>
        {incentiveKeys[incentiveId] && incentiveKeys[incentiveId].addtionalIncentives.length > 0 && (
          <>
            {earningsAdditional && (
              <>
                <Text size="md2" weight={600}>
                  {formatNumber(parseFloat(earningsAdditional), NumberType.TokenNonTx)}
                </Text>
                <FocusedGradientText size="md2">{ADDITIONAL_TOKEN?.symbol}</FocusedGradientText>
              </>
            )}
          </>
        )}
      </InlineText>
      <AllocationButton isMaximized={true} disabled={harvestState.isLoading} onClick={() => harvestXDerp()}>
        <GloriaText size="md2">{harvestActionCall}</GloriaText>
      </AllocationButton>
    </BodyPositionDetails>
  )
}

const ActiveDot = styled.span<{ closed: boolean; outOfRange: boolean }>`
  background-color: ${({ theme, closed, outOfRange }) =>
    closed ? theme.textSecondary : outOfRange ? theme.accentWarning : theme.accentSuccess};
  border-radius: 50%;
  height: 8px;
  width: 8px;
  margin-left: 4px;
  margin-top: 1px;
`

const Allocate = ({
  poolAddress,
  incentiveId,
  poolId,
  userStakingPoolMultiplier,
  setShouldRefetchAfterBoost,
}: {
  poolAddress: string
  incentiveId: string
  poolId: string
  userStakingPoolMultiplier: string
  setShouldRefetchAfterBoost: React.Dispatch<boolean>
}) => {
  const [isOpen, setOpen] = useState<boolean>(false)
  const [modalType, setModalType] = useState<AllocationType>(AllocationType.BOOST)

  const handleOpen = ({ type }: { type: AllocationType }) => {
    setOpen(true)
    setModalType(type)
  }

  const currentView = useAtomValue(stakingView)

  const allocationInfoState = useAtomValue(allocationInfoJotai)

  const allocationInfo = useMemo(
    () =>
      allocationInfoState && allocationInfoState[poolAddress] && allocationInfoState[poolAddress][poolId]
        ? allocationInfoState[poolAddress][poolId]
        : null,
    [allocationInfoState, poolAddress, poolId]
  )

  return (
    <BodyPositionDetails>
      {allocationInfo && !allocationInfo.isAllocated && (
        <InlineText>
          <GrayedText12>Yield Booster Supported</GrayedText12>
          {/* <ActiveDot closed={false} outOfRange={false} /> */}
        </InlineText>
      )}

      {allocationInfo && allocationInfo.isAllocated ? (
        <ColFlex gap={6}>
          {/* <InlineText> */}
          <InlineText>
            <GrayedText12>Allocated:</GrayedText12>
            <MouseoverTooltip text="Deallocate xDERP after unstaked LP." placement="right">
              <InfoIconContainer>
                <Info size={14} />
              </InfoIconContainer>
            </MouseoverTooltip>
          </InlineText>

          {/* </InlineText> */}
          {/* <InlineText>
            <GrayedText12 style={{ whiteSpace: 'nowrap' }}>Unlocks in:</GrayedText12>
            {!allocationInfo.canDeallocate ? (
              <Text size="md2" weight={600}>
                {allocationInfo.daysLeft}
              </Text>
            ) : (
              <FocusedGradientText>Ready</FocusedGradientText>
            )}
          </InlineText> */}
        </ColFlex>
      ) : (
        <FocusedText>Up to 2x</FocusedText>
      )}

      {allocationInfo && allocationInfo.isAllocated && (
        <InlineText>
          <Text size="lg2" weight={600}>
            {allocationInfo && formatNumber(parseFloat(allocationInfo.allocatedAmount), NumberType.TokenNonTx)}
          </Text>
          <FocusedGradientText size="lg2"> xDERP</FocusedGradientText>
        </InlineText>
      )}

      {allocationInfo && allocationInfo.type === AllocationType.BOOST && (
        <RowFlex style={{ gap: '8px' }}>
          <AllocationButton
            isMaximized={true}
            disabled={currentView === TableOption.FINISHED ? true : false}
            onClick={() => handleOpen({ type: AllocationType.BOOST })}
          >
            <GloriaText size="md2">{allocationInfo.type}</GloriaText>
          </AllocationButton>
        </RowFlex>
      )}

      {allocationInfo && allocationInfo.type === AllocationType.ALLOCATE_MORE && (
        <RowFlex style={{ gap: '8px' }}>
          {/* <AllocationButton
            isMaximized={false}
            disabled={false}
            onClick={() => handleOpen({ type: AllocationType.BOOST })}
          >
            <GloriaText size="md2">{AllocationType.BOOST}</GloriaText>
          </AllocationButton> */}
          <AllocationButton
            isMaximized={true}
            disabled={currentView === TableOption.FINISHED ? true : false}
            onClick={() => handleOpen({ type: AllocationType.ALLOCATE_MORE })}
          >
            <GloriaText size="md2">{AllocationType.ALLOCATE_MORE}</GloriaText>
          </AllocationButton>
        </RowFlex>
      )}

      {allocationInfo && allocationInfo.type === AllocationType.DEALLOCATE && (
        <RowFlex style={{ gap: '8px' }}>
          {/* <AllocationButton
            isMaximized={false}
            disabled={false}
            onClick={() => handleOpen({ type: AllocationType.EXTEND })}
          >
            <GloriaText size="md2">{AllocationType.EXTEND}</GloriaText>
          </AllocationButton> */}
          <AllocationButton
            isMaximized={true}
            disabled={true}
            onClick={() => handleOpen({ type: AllocationType.DEALLOCATE })}
          >
            <GloriaText size="md2">Ended</GloriaText>
          </AllocationButton>
        </RowFlex>
      )}

      {allocationInfo && (
        <BoostModal
          allocationInfo={allocationInfo}
          poolAddress={poolAddress}
          incentiveId={incentiveId}
          poolId={poolId}
          stakedMultiplier={userStakingPoolMultiplier}
          isOpen={isOpen}
          onDismiss={() => setOpen(!isOpen)}
          modalType={modalType}
          setShouldRefetchAfterBoost={setShouldRefetchAfterBoost}
        />
      )}
    </BodyPositionDetails>
  )
}
