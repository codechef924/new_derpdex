/* eslint-disable import/no-unused-modules */
import { useWeb3React } from '@web3-react/core'
import DerpTokenDetails from 'components/Tokens/TokenDetails/iderpTokenDetails'
import { TokenDetailsPageSkeleton } from 'components/Tokens/TokenDetails/Skeleton'
import { CHAIN_IDS_TO_NAMES, SupportedChainId } from 'constants/chains'
import { NATIVE_CHAIN_ID } from 'constants/tokens'
import { Chain, useTokenPriceQuery } from 'graphql/data/__generated__/types-and-hooks'
import { useTopTokensSubgraph } from 'graphql/data/TopTokens'
import { TimePeriod, toHistoryDuration, validateUrlChainParam } from 'graphql/data/util'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { getNativeTokenDBAddress } from 'utils/nativeTokens'

export const pageTimePeriodAtom = atomWithStorage<TimePeriod>('tokenDetailsTimePeriod', TimePeriod.DAY)

const getChainName = (chainId: SupportedChainId) => {
  return CHAIN_IDS_TO_NAMES[chainId]
}

export default function TokenDetailsPage() {
  const { tokenAddress, chainName } = useParams<{
    tokenAddress: string
    chainName?: Chain
  }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { chainId } = useWeb3React()
  const connectedChain: any = chainId ? getChainName(chainId) : CHAIN_IDS_TO_NAMES[SupportedChainId.ZKSYNC_TESTNET]
  const chain = validateUrlChainParam(chainName)
  const tokenAddressRemap =
    tokenAddress === NATIVE_CHAIN_ID || tokenAddress === undefined ? NATIVE_CHAIN_ID : tokenAddress
  useEffect(() => {
    if (connectedChain) {
      // navigate(`/token/${connectedChain}/${tokenAddressRemap}${location.search}`)
      navigate(`/token/${chainName}/${tokenAddressRemap}${location.search}`)
    }
  }, [connectedChain, tokenAddress, tokenAddressRemap, chainName])
  useEffect(() => {
    if (connectedChain) validateUrlChainParam(connectedChain)
  }, [chain, connectedChain])

  const isNative = tokenAddress === NATIVE_CHAIN_ID
  const [timePeriod, setTimePeriod] = useAtom(pageTimePeriodAtom)
  const [detailedTokenAddress, duration] = useMemo(
    /* tokenAddress will always be defined in the path for for this page to render, but useParams will always
      return optional arguments; nullish coalescing operator is present here to appease typechecker */
    () => [isNative ? getNativeTokenDBAddress(chain) : tokenAddressRemap ?? '', toHistoryDuration(timePeriod)],
    [chain, isNative, timePeriod, tokenAddressRemap]
  )

  const parsedQs = useParsedQueryString()

  const parsedInputTokenAddress: string | undefined = useMemo(() => {
    return typeof parsedQs.inputCurrency === 'string' ? (parsedQs.inputCurrency as string) : undefined
  }, [parsedQs])

  // const { data: tokenQuery } = useTokenQuery({
  //   variables: {
  //     address: detailedTokenAddress,
  //     chain,
  //   },
  //   errorPolicy: 'all',
  // })
  //@ts-ignore
  const { tokens: tokenQuery, loadingTokens } = useTopTokensSubgraph(chainName)

  const { data: tokenPriceQuery } = useTokenPriceQuery({
    variables: {
      address: detailedTokenAddress,
      chain,
      duration,
    },
    errorPolicy: 'all',
  })

  // Saves already-loaded chart data into state to display while tokenPriceQuery is undefined timePeriod input changes
  const [currentPriceQuery, setCurrentPriceQuery] = useState(tokenPriceQuery)
  useEffect(() => {
    if (tokenPriceQuery) setCurrentPriceQuery(tokenPriceQuery)
  }, [setCurrentPriceQuery, tokenPriceQuery])

  if (!tokenQuery) return <TokenDetailsPageSkeleton />

  return (
    // <TokenDetails
    //   urlAddress={tokenAddress}
    //   chain={chain}
    //   tokenQuery={tokenQuery}
    //   tokenPriceQuery={currentPriceQuery}
    //   onChangeTimePeriod={setTimePeriod}
    //   inputTokenAddress={parsedInputTokenAddress}
    // />
    <DerpTokenDetails
      urlAddress={tokenAddressRemap}
      chain={chain}
      tokenQuery={tokenQuery}
      tokenPriceQuery={currentPriceQuery}
      onChangeTimePeriod={setTimePeriod}
      inputTokenAddress={parsedInputTokenAddress}
    />
    // <>Nothing to see</>
  )
}
