import { Trans } from '@lingui/macro'
import { Trace } from '@uniswap/analytics'
import { useWeb3React } from '@web3-react/core'
import { ReactComponent as BackToIcon } from 'assets/svg/unfilled-back-to-icon.svg'
import { AutoColumn } from 'components/Column'
import { NunitoText } from 'components/CustomFonts/Nunito'
import { RowBetween } from 'components/Row'
import { GENESIS_API_URL, SupportedChainId } from 'constants/chains'
import { formatEther } from 'ethers/lib/utils'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import styled from 'styled-components/macro'
import { ThemedText } from 'theme'

import { ApyCalculator } from './ApyCalculator'
import { GenesisPair } from './GenesisPair'
import { StakedPosition } from './StakedPosition'
import { StatDetails } from './StatDetails'

const PageWrapper = styled.div`
  padding: 68px 20px 20px 20px;
  width: 100%;

  @media only screen and (max-width: 768px) {
    padding-bottom: 60px;
  }
`

const HoverText = styled(ThemedText.DerpWhite)`
  display: flex;
  align-items: center;
  gap: 16px;
  text-decoration: none;

  :hover {
    color: ${({ theme }) => theme.textPrimary};
    text-decoration: none;
  }
`

const ResponsiveRow = styled(RowBetween)`
  flex-direction: column;
  align-items: center;
  row-gap: 16px;
  width: 100%;
`

interface PoolState {
  APR: number
  USDRate: number
  depositsUSD: number
  endTime: string
  feeUSD: number
  pendingRewards: string
  pricePerDerp: string
  rewardsAtEnd: number
  rewardsInUSD: number
  startTime: string
  tvlUSD: string
  volume: number
}

export interface PoolStats {
  APR: number
  tvlUSD: string
  volume: number
  feeUSD: number
  endTime: string
  startTime: string
  pendingRewards: string
  feeTier: number
  token0: string
  token1: string
}

const initialPoolStats: PoolStats = {
  APR: 0,
  tvlUSD: '0',
  volume: 0,
  feeUSD: 0,
  endTime: '0',
  startTime: '0',
  pendingRewards: '0',
  feeTier: 0,
  token0: '',
  token1: '',
}

export interface UserStats {
  APR: number
  USDRate: number
  depositsUSD: number
  rewardsInUSD: number
  rewardsAtEnd: number
  pricePerDerp: string
  rewardPerDayUSD: string
  lpFeeUSD: number
}

const initialUserStates: UserStats = {
  APR: 0,
  USDRate: 0,
  depositsUSD: 0,
  rewardsInUSD: 0,
  rewardsAtEnd: 0,
  pricePerDerp: '0',
  rewardPerDayUSD: '0',
  lpFeeUSD: 0,
}

export default function DerpPoolDetails() {
  const [loadedPools, setLoadedPools] = useState<any>([])
  const [userPools, setUserPools] = useState<any>([])
  const [otherPositions, setOtherPositions] = useState<any>([])
  const { poolID } = useParams<{ poolID: string }>()
  const [poolStats, setPoolStats] = useState<PoolStats>(initialPoolStats)
  const [userStats, setUserStats] = useState<UserStats>(initialUserStates)
  const [isLoadingPendingRewards, setIsLoadingPendingRewards] = useState<boolean>(false)
  const [isLoadingPools, setIsLoadingPools] = useState<boolean>(false)

  const { account, chainId } = useWeb3React()
  const [color, setColor] = useState<string>('white')
  const [pool, setPool] = useState<any>({
    address: '',
    token0: {
      address: '',
      symbol: '',
    },
    token1: {
      address: '',
      symbol: '',
    },
    feeTier: 0,
    apr: '0',
    tvlUSD: 0,
    userDeposit: 0,
    userPendingRewards: 0,
    staked: false,
  })

  const prevPoolID = useRef('')
  const prevAccount = useRef('')

  //@ts-ignore
  const getPendingRewards = async ({ address, token0, token1, feeTier, chainId }) => {
    const response = await fetch(
      GENESIS_API_URL +
        '/derppool?' +
        new URLSearchParams({
          address,
          token0,
          token1,
          feeTier,
          chainId: chainId?.toString() || SupportedChainId.ZKSYNC_MAINNET.toString(),
        }),
      {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      }
    )

    const respJson = await response.json()
    return respJson
  }

  useEffect(() => {
    const processRewards = async () => {
      const _poolStats = poolStats
      const _userStats = { ...userStats }

      const _allRewards: any = {}
      // for (let i = 0; i < userPools.length; i++) {
      const reward = await getPendingRewards({
        address: account || '0x0000000000000000000000000000000000000000',
        feeTier: _poolStats.feeTier * 10000 * 100,
        token0: _poolStats.token0,
        token1: _poolStats.token1,
        chainId,
      })

      //@ts-ignore
      _userStats.rewardsInUSD = Number(formatEther(reward.reward.toString())) * Number(_userStats.pricePerDerp)
      _userStats.rewardPerDayUSD = reward.rewardPerDayUSD.toFixed(2)

      // setUserStats(_userStats)

      // if (isLoadingPendingRewards) {
      //   setIsLoadingPendingRewards(false)
      // }
      setUserStats((prevState) => ({ ...prevState, ..._userStats }))
      setIsLoadingPendingRewards(false)
      // const pools: any = []
      // const stats: any = {}
      // loadedPools.forEach((_pool: any) => {
      //   const tempPool = {
      //     ..._pool,
      //     userPendingRewards: _allRewards[_pool.address] || 0,
      //   }
      //   pools.push(tempPool)

      //   if (_pool.poolAddress.toLowerCase() == poolID?.toLowerCase()) {
      //     setPool(tempPool)
      //   }
      // })
      // setLoadedPools(pools)
    }

    if (userPools && userPools.length > 0) {
      processRewards().catch((err) => {
        console.log(err)
        setIsLoadingPendingRewards(false)
      })
    }
  }, [userPools])

  useEffect(() => {
    const getPools = async () => {
      fetch(
        GENESIS_API_URL +
          '/derppool/info?' +
          new URLSearchParams({
            userAddress: account || '0x0000000000000000000000000000000000000000',
            chainId: chainId?.toString() || SupportedChainId.ZKSYNC_MAINNET.toString(),
          }),
        {
          method: 'GET',
          headers: new Headers({
            'Content-Type': 'application/json',
          }),
        }
      )
        .then((response) => {
          response.json().then((info) => {
            const { supportedPoolsList, result, pricePerDERP, startTime, endTime } = info

            const poolsInfo: any = []
            const _userPoolsInfo: any = []
            const userStats: UserStats = {
              APR: 0,
              depositsUSD: 0,
              USDRate: 0,
              rewardsInUSD: 0,
              rewardsAtEnd: 0,
              pricePerDerp: pricePerDERP,
              rewardPerDayUSD: '0',
              lpFeeUSD: 0,
            }

            const requiredPoolInfo = supportedPoolsList.filter(
              (_sp: any) => _sp.poolAddress.toLowerCase() == poolID?.toLowerCase()
            )

            const poolStats: PoolStats = {
              tvlUSD: requiredPoolInfo[0].tvlUSD ? requiredPoolInfo[0].tvlUSD : '0',
              APR: requiredPoolInfo[0].apr,
              pendingRewards: requiredPoolInfo[0].totalRewardsPool ? requiredPoolInfo[0].totalRewardsPool : '0',
              startTime: requiredPoolInfo[0].startTime,
              feeTier: requiredPoolInfo[0].feeTier ? Number(requiredPoolInfo[0].feeTier) / 10000 / 100 : 0,
              endTime,
              feeUSD: requiredPoolInfo[0].feeUSD ? Number(requiredPoolInfo[0].feeUSD) : 0,
              volume: requiredPoolInfo[0].volume ? Number(requiredPoolInfo[0].volume) : 0,
              token0: requiredPoolInfo[0].token0.address,
              token1: requiredPoolInfo[0].token1.address,
            }

            setPool(requiredPoolInfo[0])
            setPoolStats(poolStats)

            result.forEach((_result: any) => {
              if (_result.poolAddress.toLowerCase() == poolID?.toLowerCase()) {
                userStats.depositsUSD += _result.amount0USD + _result.amount1USD
                userStats.APR = requiredPoolInfo.apr
                userStats.pricePerDerp = pricePerDERP
                userStats.lpFeeUSD = _result.lpFeeUSD ? Number(_result.lpFeeUSD) : 0
                _userPoolsInfo.push({
                  ..._result,
                  token0Symbol: requiredPoolInfo[0].token0.symbol,
                  token1Symbol: requiredPoolInfo[0].token1.symbol,
                  token0: requiredPoolInfo[0].token0.address,
                  token1: requiredPoolInfo[0].token1.address,
                  feeTier: requiredPoolInfo[0].feeTier,
                  pricePerDerp: pricePerDERP,
                  lpFeeUSD: _result.lpFeeUSD,
                })
              }
            })

            setUserStats(userStats)
            setLoadedPools(requiredPoolInfo)
            if (_userPoolsInfo && _userPoolsInfo.length > 0) {
              setUserPools(_userPoolsInfo)
            } else {
              setIsLoadingPendingRewards(false)
            }
          })
        })
        .catch((err) => {
          console.log(err)
          setIsLoadingPendingRewards(false)
        })
    }

    if (poolID && account) {
      if (poolID !== prevPoolID.current || account !== prevAccount.current) {
        setIsLoadingPendingRewards(true)
        getPools()
      }

      // Update refs with the current values
      prevPoolID.current = poolID
      prevAccount.current = account
    }
  }, [poolID, account]) //! [OPTIMIZED!!] Changed to both account && poolID otherwise this will be loaded from the parent page!!

  const [isOpen, setOpen] = useState<boolean>(false)

  const handleOpen = () => {
    if (isOpen) {
      setOpen(false)
    } else {
      setOpen(true)
    }
  }

  const location = useLocation()

  const returnPath = useMemo(() => {
    return location.pathname.split('/')[2]
  }, [location])

  return (
    <Trace page="derp-pool-details" shouldLogImpression>
      <PageWrapper>
        <AutoColumn gap="sm">
          <Link
            data-cy="visit-derp-pools"
            style={{ textDecoration: 'none', width: 'fit-content', marginBottom: '0.5rem' }}
            to={`/derp-pools/${returnPath}`}
          >
            <HoverText onMouseOver={() => setColor('black')} onMouseLeave={() => setColor('white')}>
              <Trans>
                <BackToIcon fill={color} />{' '}
                <NunitoText size="lg" weight={700}>
                  Back to Derp TGE Pools
                </NunitoText>
              </Trans>
            </HoverText>
          </Link>
          <RowBetween></RowBetween>
          <ResponsiveRow>
            <GenesisPair pool={pool} onOpen={handleOpen} />
            <StatDetails pool={{ ...userStats, ...poolStats }} isLoadingPendingRewards={isLoadingPendingRewards} />
            <StakedPosition
              token0={pool.token0.address}
              token1={pool.token1.address}
              feeTier={pool.feeTier}
              pools={userPools}
            />
          </ResponsiveRow>
        </AutoColumn>
      </PageWrapper>
      <ApyCalculator pool={{ ...userStats, ...poolStats }} isOpen={isOpen} onDismiss={handleOpen} />
    </Trace>
  )
}
