import { Position } from '@derpdex/sdk'
import { CurrencyAmount, Percent, Token } from '@uniswap/sdk-core'
import { useWeb3React } from '@web3-react/core'
import { GloriaText } from 'components/CustomFonts/GloriaHallelujah'
import { NunitoText } from 'components/CustomFonts/Nunito'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import { getPriceOrderingFromPositionForUI } from 'components/PositionListItem'
import { SupportedChainId } from 'constants/chains'
import { BigNumber, Contract, ethers } from 'ethers'
import { chainIdToBackendName } from 'graphql/data/util'
import { useToken } from 'hooks/Tokens'
import { useCultivatePoolDatas } from 'hooks/useCultivatePoolDatas'
import { useDerpPool } from 'hooks/usePools'
import useStablecoinPriceV2 from 'hooks/useStablecoinPriceV2'
import { useV3Positions } from 'hooks/useV3Positions'
import { INCENTIVE_KEY, useGetYieldBoosterPools } from 'hooks/useYieldBoosterPoolAddresses'
import { useAtomValue } from 'jotai/utils'
import { useIsMobile } from 'nft/hooks'
import YieldBoosterABI from 'pages/Cultivate/abis/yieldbooster.abi.json'
import { YIELD_BOOSTER_ADDRESSES_BY_CHAINID } from 'pages/Cultivate/constants'
import { useDeallocateXDerpExternal } from 'pages/Cultivate/hooks/useAllocateXDerp'
import { allocationInfoJotai } from 'pages/Cultivate/hooks/useUserPositionAllocation'
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { PositionDetails } from 'types/position'
import { unwrappedToken } from 'utils/unwrappedToken'

import ComingSoonDerp from '../assets/Coming-Soon-Derp.png'
import DropDownExpandableImg from '../assets/DropDown-Expandable.png'
import GradientArrowRight from '../assets/Gradient-Arrow-Right.png'
import { balanceAtom, useAvailableDerpBalance } from '../hooks/useAvailableDerpBalance'
import { ColFlex, RowFlex, Text } from '../stylings'
const Container = styled.div`
  position: relative;
  display: flex;
  width: 100%;

  border-radius: 16px;
  border: 2px solid #000;
  background: #fff;
  box-shadow: 3px 3px 0px 0px #000;

  padding: 60px 28px 24px 28px;
  flex-direction: column;
  align-items: flex-start;

  @media only screen and (max-width: 768px) {
    padding: 32px 12px 24px 12px;
  }
`
const AngledTextWrapper = styled.div`
  position: absolute;
  left: 28px;
  top: -16px;

  display: flex;
  transform: rotate(-3deg);
  padding: 8px 16px;
  justify-content: center;
  align-items: center;

  border-radius: 12px;
  box-shadow: 3px 3px 0px 0px #000;
  background: ${({ theme }) => theme.derpGradientPrimary};
`

const StyledText = styled(GloriaText)`
  background: ${({ theme }) => theme.derpGradientPrimary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 600;
  cursor: pointer;
`

const Divider = styled.div`
  background: #000;
  width: 100%;
  height: 1px;

  margin: 24px 0px;
  @media only screen and (max-width: 768px) {
    margin: 16px 0px;
  }
`

type GridOpts = {
  alignItems?: string
}
const NonOutlineGrid = styled(ColFlex)<GridOpts>`
  align-items: ${({ alignItems }) => (alignItems ? alignItems : 'flex-start')};
`

const InfoItem = styled(ColFlex)`
  width: unset;
`

const ComingSoonContainer = styled(Container)`
  padding: 36px 0px;
  min-height: 154px;
`

const AllocationRowFlex = styled(RowFlex)`
  justify-content: space-between:
  align-items: center;
  padding: 0px 40px;

  @media only screen and (max-width: 768px) {
    padding: 0px 8px;
  }
`

const InnerText = styled(Text)`
  font-size: 32px;
  @media only screen and (max-width: 768px) {
    font-size: 16px;
  }
`

const FlexContainer = styled(ColFlex)`
  gap: 60px;

  @media only screen and (max-width: 768px) {
    gap: 36px;
  }
`

const ResponsiveAllocationText = styled(Text)`
  font-size: 16px;
  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`

const YieldFlex = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 8px;
  .about {
    @media only screen and (max-width: 768px) {
      max-width: 232px;
    }
  }
`

const DropDownWrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  bottom: 0;
  left: 0;
  width: 100%;

  margin-bottom: -32px;
`

type ExpandedContainerOpts = {
  show: boolean
}
const ExpandedContainer = styled.div<ExpandedContainerOpts>`
  position: ${({ show }) => (show ? 'relative' : 'absolute')};
  display: flex;
  visibility: ${({ show }) => (show ? 'visible' : 'hidden')};
  max-height: ${({ show }) => (show ? '300px' : '0')};
  width: 100%;

  margin-top: -16px;

  border-radius: 16px;
  border: 2px solid #000;
  background: #fff;
  box-shadow: 3px 3px 0px 0px #000;

  padding: 24px 28px 24px 28px;
  flex-direction: column;
  align-items: flex-start;

  transition: opacity 1s ease, max-height 1s ease;

  @media only screen and (max-width: 768px) {
    padding: 24px 12px 24px 12px;
  }
`

const InnerContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: scroll;

  /* Set the width of the scrollbar */
  ::-webkit-scrollbar {
    width: 4px;
  }

  /* Set the color of the scrollbar thumb */
  ::-webkit-scrollbar-thumb {
    background-color: #000;
  }

  /* For Firefox */
  scrollbar-width: thin;

  /* For Internet Explorer and Edge */
  *::-webkit-scrollbar {
    width: 4px;
  }

  *::-ms-scrollbar {
    width: 4px;
  }
`

const ExpandBtn = styled.div`
  width: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  img {
    cursor: pointer;
  }

  .text {
    position: absolute;
    color: #fff;
    margin-bottom: 10px;
    cursor: pointer;
  }
`

const ComingSoon = () => {
  const isMobile = useIsMobile()
  return (
    <RowFlex gap={28} style={{ justifyContent: 'center', alignItems: 'center' }}>
      <img src={ComingSoonDerp} />
      <Text color="rgba(0, 0, 0, 0.30)" size={isMobile ? 'xxl' : 'x40px'} weight={700}>
        Coming Soon
      </Text>
    </RowFlex>
  )
}

const PositionRowStyle = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;

  padding: 12px 12px;
  border-bottom: 1px solid #000;
`

const InnerRowFlex = styled(RowFlex)`
  justify-content: space-between;
  align-items: center;
`

interface PositionListItemProps {
  poolAddress: string | undefined
  incentiveKey: INCENTIVE_KEY | undefined
  amountOfxDERP?: string | undefined
  token0: string
  token1: string
  tokenId: BigNumber
  fee: number
  liquidity: BigNumber
  tickLower: number
  tickUpper: number
}

const PositionRow = ({
  poolAddress,
  incentiveKey,
  amountOfxDERP,
  token0: token0Address,
  token1: token1Address,
  tokenId,
  fee: feeAmount,
  liquidity,
  tickLower,
  tickUpper,
}: PositionListItemProps) => {
  const token0 = useToken(token0Address)
  const token1 = useToken(token1Address)

  const currency0 = token0 ? unwrappedToken(token0) : undefined
  const currency1 = token1 ? unwrappedToken(token1) : undefined
  const [, poolV2] = useDerpPool(currency0 ?? undefined, currency1 ?? undefined, feeAmount)

  const position = useMemo(() => {
    if (poolV2) {
      return new Position({ pool: poolV2, liquidity: liquidity.toString(), tickLower, tickUpper })
    }
    return undefined
  }, [liquidity, poolV2, tickLower, tickUpper])

  const { priceLower, priceUpper, quote, base } = getPriceOrderingFromPositionForUI(position)

  const currencyQuote = quote && unwrappedToken(quote)
  const currencyBase = base && unwrappedToken(base)

  const price0 = useStablecoinPriceV2(token0 ?? undefined)
  const price1 = useStablecoinPriceV2(token1 ?? undefined)

  const fiatValueOfLiquidity: CurrencyAmount<Token> | null = useMemo(() => {
    if (!price0 || !price1 || !position) return null
    const amount0 = price0.quote(position.amount0)
    const amount1 = price1.quote(position.amount1)
    return amount0.add(amount1)
  }, [price0, price1, position])

  const { balanceOfDerp, getBalance } = useAvailableDerpBalance()

  const { deallocateState, deallocateActionCall, deallocateXDerp } = useDeallocateXDerpExternal({
    incentiveKey,
    poolAddress,
    poolId: tokenId.toString(),
    amount: amountOfxDERP ? amountOfxDERP : '0',
    getBalance,
  })

  return (
    <PositionRowStyle>
      <InnerRowFlex>
        <ColFlex gap={8}>
          <RowFlex gap={8}>
            <NunitoText weight={600}>Token ID: #{tokenId.toString()}</NunitoText>
            <NunitoText weight={600}>- Locked xDERP: {amountOfxDERP}</NunitoText>
          </RowFlex>
          <RowFlex gap={8}>
            <DoubleCurrencyLogo currency0={currencyBase} currency1={currencyQuote} size={20} margin />
            <NunitoText weight={600}>
              {currencyQuote?.symbol}&nbsp;/&nbsp;{currencyBase?.symbol}
            </NunitoText>
            (<NunitoText weight={600}>{new Percent(feeAmount, 1_000_000).toSignificant()}%</NunitoText>)
            <NunitoText weight={600}>
              - Liquidity: ${fiatValueOfLiquidity ? fiatValueOfLiquidity.toFixed(2) : '0.00'}
            </NunitoText>
          </RowFlex>
        </ColFlex>
        <ColFlex style={{ justifyContent: 'flex-end', alignItems: 'flex-end', width: 'unset' }}>
          <StyledText onClick={() => deallocateXDerp()} size="xl" weight={600}>
            {!deallocateState.isLoading ? 'Deallocate' : 'Deallocating'}
          </StyledText>
        </ColFlex>
      </InnerRowFlex>
    </PositionRowStyle>
  )
}

const DeallocationList = ({
  yieldBoosterAddresses,
  showDeallocation,
  setShowDeallocation,
  setCountDeallocation,
  onExpand,
  setOnExpand,
}: {
  yieldBoosterAddresses: { incentiveKey: INCENTIVE_KEY; poolAddress: string; token0: string; token1: string }[]
  showDeallocation: boolean
  setShowDeallocation: React.Dispatch<boolean>
  setCountDeallocation: React.Dispatch<number>
  onExpand: boolean
  setOnExpand: React.Dispatch<boolean>
}) => {
  const { account, chainId, provider } = useWeb3React()
  const { positions, loading: positionsLoading } = useV3Positions(account)

  const [openPositions, closedPositions] = positions?.reduce<[PositionDetails[], PositionDetails[]]>(
    (acc, p) => {
      acc[p.liquidity?.isZero() ? 1 : 0].push(p)
      return acc
    },
    [[], []]
  ) ?? [[], []]

  const filteredPositions = useMemo(() => {
    if (positions && positions.length > 0 && !positionsLoading) {
      const _stored_positions = positions.filter((p) =>
        yieldBoosterAddresses.find((yb) => yb.token0 === p.token0.toLowerCase() && yb.token1 === p.token1.toLowerCase())
      )
      return _stored_positions.map((sp) => ({
        ...sp,
        poolAddress: yieldBoosterAddresses.find(
          (yb) => yb.token0 === sp.token0.toLowerCase() && yb.token1 === sp.token1.toLowerCase()
        )?.poolAddress,
        incentiveKey: yieldBoosterAddresses.find(
          (yb) => yb.token0 === sp.token0.toLowerCase() && yb.token1 === sp.token1.toLowerCase()
        )?.incentiveKey,
      }))
    } else {
      return []
    }
  }, [positions, positionsLoading, yieldBoosterAddresses, account])

  const hasLockedXDerp = async ({ poolAddress, poolId }: { poolAddress: string; poolId: string }) => {
    try {
      if (!chainId || !provider) throw null

      const signer = provider.getSigner()
      const contract = new Contract(YIELD_BOOSTER_ADDRESSES_BY_CHAINID[chainId], YieldBoosterABI, signer)
      const caller = await contract.userPositionAllocation(account, poolAddress, poolId)

      if (parseFloat(caller.xDerpAmount) > 0) {
        const parsedAmount = ethers.utils.formatUnits(caller.xDerpAmount.toString(), 18)
        return parsedAmount
      } else return null
    } catch (error) {
      console.log('[Err hasLockedXDerp]', error)
      return null
    }
  }

  const [positionsToUnset, setPositionsToUnset] = useState<PositionListItemProps[]>([])

  const safeCheck = async () => {
    try {
      if (filteredPositions && filteredPositions.length > 0) {
        const datastore: PositionListItemProps[] = []
        for await (const fp of filteredPositions) {
          if (!fp.poolAddress) throw 'poolAddress unidentified'

          const amountLocked = await hasLockedXDerp({ poolAddress: fp.poolAddress, poolId: fp.tokenId.toString() })
          if (amountLocked) {
            if (fp.poolAddress !== undefined)
              datastore.push({
                ...fp,
                amountOfxDERP: amountLocked,
              })
          }
        }
        // Safe check prevent infinite loop
        if (positionsToUnset && !positionsToUnset.some((p) => datastore.some((dt) => dt.tokenId === p.tokenId))) {
          setPositionsToUnset(datastore)
        }
      } else {
        setPositionsToUnset([])
      }
    } catch (error) {
      console.log('[Err safeCheck]', error)
    }
  }

  useEffect(() => {
    if (filteredPositions && filteredPositions.length > 0) {
      safeCheck()
    }
  }, [filteredPositions, account])

  useEffect(() => {
    if (positionsToUnset && positionsToUnset.length > 0) {
      setShowDeallocation(true)
      setCountDeallocation(positionsToUnset.length)
    } else {
      setShowDeallocation(false)
      setOnExpand(false)
      setCountDeallocation(0)
    }
  }, [positionsToUnset, setCountDeallocation, setOnExpand, setShowDeallocation])

  return (
    <ExpandedContainer show={onExpand}>
      {positionsToUnset && positionsToUnset.length > 0 && (
        <InnerContainer>
          {positionsToUnset.map((p) => (
            <PositionRow key={p.tokenId.toString()} {...p} />
          ))}
        </InnerContainer>
      )}
    </ExpandedContainer>
  )
}

const YieldBooster = () => {
  const navigate = useNavigate()
  const { chainId } = useWeb3React()

  const chainName = useMemo(() => {
    if (chainId) {
      return chainIdToBackendName(chainId).toLowerCase()
    } else {
      return null
    }
  }, [chainId])

  const balanceState = useAtomValue(balanceAtom)

  const allocationInfoState = useAtomValue(allocationInfoJotai)

  const totalAllocation = useMemo(() => {
    let allocations = 0
    for (const poolAddress in allocationInfoState) {
      for (const poolId in allocationInfoState[poolAddress]) {
        allocations += parseFloat(allocationInfoState[poolAddress][poolId].allocatedAmount)
      }
    }
    return allocations
  }, [allocationInfoState])

  const { allPoolAddresses, incentiveKeys, stakedPoolsPositionIdsOnDerpDEX } = useGetYieldBoosterPools({
    chainId: chainId ? chainId : SupportedChainId.ZKSYNC_MAINNET,
  })

  const {
    loading: loadingPoolData,
    error: errorPoolData,
    data: poolData,
  } = useCultivatePoolDatas(
    chainId ? chainId : SupportedChainId.ZKSYNC_MAINNET,
    allPoolAddresses ? allPoolAddresses : [],
    Object.values(incentiveKeys),
    stakedPoolsPositionIdsOnDerpDEX
  )

  const poolBinder = useMemo(() => {
    if (!poolData) return []

    return poolData.map((pd) => {
      return {
        incentiveKey: incentiveKeys[pd.incentiveId],
        poolAddress: pd.address,
        token0: pd.token0.address,
        token1: pd.token1.address,
      }
    })
  }, [incentiveKeys, poolData])

  const [showDeallocation, setShowDeallocation] = useState<boolean>(false)
  const [countDeallocation, setCountDeallocation] = useState<number>(0)
  const [onExpand, setOnExpand] = useState<boolean>(false)

  return (
    <>
      <Container>
        <AngledTextWrapper>
          <InnerText color="#fff" weight={700}>
            Yield Booster
          </InnerText>
        </AngledTextWrapper>
        <YieldFlex>
          <Text className="about" size="lg" weight={400}>
            Allocate xDERP here to increase the yield of your staking positions up to +100%.
          </Text>
          <StyledText onClick={() => navigate(`/yield-farming/${chainName}`)} size="xl" weight={400}>
            Farming <img src={GradientArrowRight} />
          </StyledText>
        </YieldFlex>
        <Divider />
        <AllocationRowFlex>
          <NonOutlineGrid>
            <InfoItem>
              <ResponsiveAllocationText color="rgba(0, 0, 0, 0.50)" weight={700}>
                Your allocated xDERP
              </ResponsiveAllocationText>
              <ResponsiveAllocationText size="xl" weight={800}>
                {totalAllocation.toFixed(2)} xDERP
              </ResponsiveAllocationText>
            </InfoItem>
          </NonOutlineGrid>
          <NonOutlineGrid className="override" alignItems="center">
            <InfoItem>
              <ResponsiveAllocationText color="rgba(0, 0, 0, 0.50)" weight={700}>
                Available xDERP for allocation
              </ResponsiveAllocationText>
              <ResponsiveAllocationText size="xl" weight={800}>
                {balanceState.XDERP.toFixed(2)} xDERP
              </ResponsiveAllocationText>
            </InfoItem>
          </NonOutlineGrid>
          {/* <NonOutlineGrid alignItems="flex-end">
          <InfoItem>
            <ResponsiveAllocationText color="rgba(0, 0, 0, 0.50)" weight={700}>
              Fees
            </ResponsiveAllocationText>
            <ResponsiveAllocationText size="xl" weight={800}>
              0.5%
            </ResponsiveAllocationText>
          </InfoItem>
        </NonOutlineGrid> */}
        </AllocationRowFlex>
        {/* <DropDownExpandable /> */}
        {showDeallocation && (
          <DropDownWrapper>
            <ExpandBtn onClick={() => setOnExpand(!onExpand)}>
              <img src={DropDownExpandableImg} />
              <NunitoText className="text" size="lg" weight={500}>
                Deallocations ({countDeallocation})
              </NunitoText>
            </ExpandBtn>
          </DropDownWrapper>
        )}
      </Container>

      <DeallocationList
        showDeallocation={showDeallocation}
        setShowDeallocation={setShowDeallocation}
        yieldBoosterAddresses={poolBinder}
        setCountDeallocation={setCountDeallocation}
        onExpand={onExpand}
        setOnExpand={setOnExpand}
      />
    </>
  )
}

const Dividend = () => {
  return (
    <ComingSoonContainer>
      <AngledTextWrapper>
        <InnerText color="#fff" weight={700}>
          Dividend
        </InnerText>
      </AngledTextWrapper>
      <ComingSoon />
    </ComingSoonContainer>
  )
}

const Launchpad = () => {
  return (
    <ComingSoonContainer>
      <AngledTextWrapper>
        <InnerText color="#fff" weight={700}>
          Launchpad
        </InnerText>
      </AngledTextWrapper>
      <ComingSoon />
    </ComingSoonContainer>
  )
}

export const Allocation = () => {
  return (
    <FlexContainer>
      <YieldBooster />
      <Dividend />
      <Launchpad />
    </FlexContainer>
  )
}
