/* eslint-disable import/no-unused-modules */
import { useWeb3React } from '@web3-react/core'
import { GENESIS_API_URL, SupportedChainId } from 'constants/chains'
import { useEffect, useMemo, useState } from 'react'

type OnLoadLaunchPad = {
  isLoading: boolean
  isSuccess: boolean
  error: string | null
}
const initialState: OnLoadLaunchPad = {
  isLoading: false,
  isSuccess: false,
  error: null,
}

export interface PhaseInfo {
  phase: string
  startTime: string
  endTime: string
  ended: boolean
  phaseType: string
  totalAmount: string
  staticDisplay: boolean

  rawStartDate: string
  rawEndDate: string
}

export interface CurrenyInfo {
  currencyAddress: string
  price: string
  currencyDecimals: string
}

interface LaunchPadDetails {
  campaignId: string
  chainId: number
  currencyInfo: CurrenyInfo[]
  allowedDenominations?: string[]
  limitPerUser: string
  phaseInfo: PhaseInfo[]
  phaseLength: number
  snapshotDate: string
  tokenAddress: string
  tokenDecimals: number
  formattedStartDate: string
  formattedEndDate: string
  actualTotalAmount: string

  minTokens: string
  maxTokens: string
}

export interface DerivedLaunchPadDetails extends LaunchPadDetails {
  currentPhaseInfo: PhaseInfo | undefined
  currentPhaseType: string
  upcoming: PhaseInfo[]
  pastSales: PhaseInfo[]
}

enum LaunchPadState {
  EXPIRED = 'expired',
  ACTIVE = 'active',
  UPCOMING = 'upcoming',
}

enum PhaseType {
  OFFCHAIN_WHITELIST = 'OFFCHAIN_WHITELIST',
  PRIVATE_WHITELIST = 'PRIVATE_WHITELIST',
  OPEN_FOR_ALL = 'OPEN_FOR_ALL',
}

const PhaseTypeText: { [key: string]: string } = {
  [PhaseType.OFFCHAIN_WHITELIST]: 'Phase 1: Whitelist Sales',
  [PhaseType.PRIVATE_WHITELIST]: 'Private whitelist allocation',
  [PhaseType.OPEN_FOR_ALL]: 'Phase 2: Public Sales',
}

interface LaunchPadResponse {
  [LaunchPadState.EXPIRED]: DerivedLaunchPadDetails[]
  [LaunchPadState.ACTIVE]: DerivedLaunchPadDetails[]
  [LaunchPadState.UPCOMING]: DerivedLaunchPadDetails[]
}
const initialLaunchPadResponse: LaunchPadResponse = {
  [LaunchPadState.EXPIRED]: [],
  [LaunchPadState.ACTIVE]: [],
  [LaunchPadState.UPCOMING]: [],
}

export interface ExtractedEvents {
  campaignId: string
  chainId: number
  tokenAddress: string
  tokenDecimals: number

  phaseType: string
  startTime: string
  endTime: string
  rawStartDate: string
  rawEndDate: string
}
interface MappedEvents {
  ALL_EXPIRED: ExtractedEvents[]
  ALL_UPCOMING: ExtractedEvents[]
}
// CampaignId for priotization display
const priorityCampaignId = '0x64756d6d79506f6f6c3300000000000000000000000000000000000000000000'
export const testPriorityCampaignId = '0x64756d6d79506f6f6c3400000000000000000000000000000000000000000000'

export const useGetLaunchPadCampaigns = () => {
  const { chainId, account, provider } = useWeb3React()
  const [state, setState] = useState<OnLoadLaunchPad>(initialState)
  const [launchPadDatas, setLaunchPadDatas] = useState<LaunchPadResponse>(initialLaunchPadResponse)

  const fetchLaunchPad = async () => {
    try {
      if (!chainId) throw 'chainId is required'

      setState({ ...initialState, isLoading: true })
      // const response = await fetch(GENESIS_API_URL + '/list', {
      const response = await fetch(GENESIS_API_URL + '/launchpad' + '/list?page=1&count=100', {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      })

      if (!response.ok) throw new Error(response.statusText)

      const result = (await response.json()) as LaunchPadResponse

      // const derivedDatas: DerivedLaunchPadDetails[] = []
      for (const launchPadKey in result) {
        if (Object.prototype.hasOwnProperty.call(result, launchPadKey)) {
          const r = launchPadKey as LaunchPadState

          result[r].forEach((i) => {
            i.currentPhaseInfo = undefined
            i.upcoming = []
            i.pastSales = []

            i.phaseInfo.forEach((p) => {
              p.rawStartDate = p.startTime
              p.rawEndDate = p.endTime
              const startTime = new Date(p.startTime)
              const endTime = new Date(p.endTime)
              const currentTimestamp = Date.now()

              // * take current phase
              if (currentTimestamp > startTime.getTime() && currentTimestamp < endTime.getTime()) {
                i.formattedStartDate = formatDateString(new Date(p.startTime))
                i.formattedEndDate = formatDateString(new Date(p.endTime))

                i.currentPhaseInfo = p
                i.currentPhaseType = PhaseTypeText[p.phaseType] || 'Unknown launchpad'
              }

              if (currentTimestamp < startTime.getTime()) {
                i.upcoming.push({ ...p, phaseType: PhaseTypeText[p.phaseType] || p.phaseType })
              }

              if (currentTimestamp > endTime.getTime()) {
                i.pastSales.push({ ...p, phaseType: PhaseTypeText[p.phaseType] || p.phaseType })
              }

              if (currentTimestamp > endTime.getTime() && p.staticDisplay === true) {
                i.formattedStartDate = formatDateString(new Date(p.startTime))
                i.formattedEndDate = formatDateString(new Date(p.endTime))

                i.currentPhaseInfo = p
                i.currentPhaseType = PhaseTypeText[p.phaseType] || 'Unknown launchpad'
              }
              p.startTime = formatDate(p.startTime)
              p.endTime = formatDate(p.endTime)
            })
          })
        }
      }
      setLaunchPadDatas(result)
      setState((p) => ({ ...p, isLoading: false, isSuccess: true }))
    } catch (error) {
      setState((p) => ({
        ...p,
        isSuccess: false,
        error: error || 'An error occurred',
      }))
    } finally {
      setState((p) => ({ ...p, isLoading: false }))
    }
  }

  useEffect(() => {
    fetchLaunchPad()
  }, [chainId, account])

  const activeLaunchPadChains = useMemo(() => {
    const availableChains: SupportedChainId[] = []
    if (launchPadDatas.active && launchPadDatas.active.length > 0) {
      launchPadDatas.active.forEach((_a) => {
        availableChains.push(_a.chainId)
      })
    }
    return availableChains
  }, [launchPadDatas])

  const mappedEvents: MappedEvents = useMemo(() => {
    const allPastSales: ExtractedEvents[] = []
    const allUpcoming: ExtractedEvents[] = []

    for (const anyEvent in launchPadDatas) {
      const r = anyEvent as LaunchPadState
      const currentTimestamp = Date.now()
      launchPadDatas[r].forEach((lpd) => {
        lpd.phaseInfo.forEach((_pi) => {
          const startTime = new Date(_pi.rawStartDate)
          const endTime = new Date(_pi.rawEndDate)
          if (currentTimestamp > endTime.getTime()) {
            allPastSales.push({
              campaignId: lpd.campaignId,
              chainId: lpd.chainId,
              tokenAddress: lpd.tokenAddress,
              tokenDecimals: lpd.tokenDecimals,

              phaseType: PhaseTypeText[_pi.phaseType] || 'Unknown',
              startTime: _pi.startTime,
              endTime: _pi.endTime,
              rawStartDate: _pi.rawStartDate,
              rawEndDate: _pi.rawEndDate,
            })
          }
          if (currentTimestamp < startTime.getTime()) {
            allUpcoming.push({
              campaignId: lpd.campaignId,
              chainId: lpd.chainId,
              tokenAddress: lpd.tokenAddress,
              tokenDecimals: lpd.tokenDecimals,

              phaseType: PhaseTypeText[_pi.phaseType] || 'Unknown',
              startTime: _pi.startTime,
              endTime: _pi.endTime,
              rawStartDate: _pi.rawStartDate,
              rawEndDate: _pi.rawEndDate,
            })
          }
        })
      })
    }

    const uniquePastSales = filterUniqueCampaigns(allPastSales, chainId || 1)
    const uniqueUpcomingSales = filterUniqueCampaigns(allUpcoming, chainId || 1)

    return {
      ALL_EXPIRED: uniquePastSales.sort((a, b) => new Date(b.rawEndDate).getTime() - new Date(a.rawEndDate).getTime()),
      ALL_UPCOMING: uniqueUpcomingSales,
    }
  }, [launchPadDatas])

  return {
    activeLaunchpadChains: activeLaunchPadChains,
    launchPadInfo: launchPadDatas?.active.find((lpd) => lpd.chainId === chainId),
    staticDisplayLaunchpad: launchPadDatas?.expired.find(
      (epd) => epd.chainId === chainId && epd.phaseInfo.find((p) => p.staticDisplay === true)
    ),
    fetchState: state,

    mappedEvents,
  }
}

const filterUniqueCampaigns = (campaigns: any[], chainId: number) => {
  const uniqueCampaignsMap = new Map()

  campaigns.forEach((campaign) => {
    const identifier = `${campaign.campaignId}-${campaign.phaseType}`

    if (!uniqueCampaignsMap.has(identifier)) {
      uniqueCampaignsMap.set(identifier, campaign)
    } else if (uniqueCampaignsMap.get(identifier).chainId !== chainId && campaign.chainId === chainId) {
      uniqueCampaignsMap.set(identifier, campaign) // Prioritize campaign with preferred chainId
    }
  })

  return Array.from(uniqueCampaignsMap.values())
}

const formatDate = (date: string) => {
  const _data = new Date(date)
  const formattedDate = `${_data.getDate()}/${_data.getMonth() + 1}/${_data.getFullYear()}`
  return formattedDate
}

const formatDateString = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    year: '2-digit' as const,
    month: '2-digit' as const,
    day: '2-digit' as const,
    hour: '2-digit' as const,
    minute: '2-digit' as const,
    second: '2-digit' as const,
  }
  return date.toLocaleString('en-US', options)
}

const formatToGMT8 = (isoString: string) => {
  const date = new Date(isoString)
  const gmt8Date = new Date(date.getTime())
  return gmt8Date
}
