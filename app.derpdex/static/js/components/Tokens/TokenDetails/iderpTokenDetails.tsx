import { Currency, Field } from '@derpdex/widgets'
import { Trans } from '@lingui/macro'
import { Trace } from '@uniswap/analytics'
import { InterfacePageName } from '@uniswap/analytics-events'
import { useWeb3React } from '@web3-react/core'
import { ReactComponent as BackToIcon } from 'assets/svg/back-to-icon.svg'
import { NunitoText } from 'components/CustomFonts/Nunito'
import CurrencyLogo from 'components/Logo/CurrencyLogo'
import { AboutSection } from 'components/Tokens/TokenDetails/About'
import AddressSection from 'components/Tokens/TokenDetails/AddressSection'
import BalanceSummary from 'components/Tokens/TokenDetails/BalanceSummary'
import { BreadcrumbNavLink } from 'components/Tokens/TokenDetails/BreadcrumbNavLink'
import MobileBalanceSummaryFooter from 'components/Tokens/TokenDetails/MobileBalanceSummaryFooter'
import ShareButton from 'components/Tokens/TokenDetails/ShareButton'
import TokenDetailsSkeleton, {
  Hr,
  LeftPanel,
  RightPanel,
  TokenDetailsLayout,
  TokenInfoContainer,
  TokenNameCell,
} from 'components/Tokens/TokenDetails/Skeleton'
import TokenSafetyMessage from 'components/TokenSafety/TokenSafetyMessage'
import TokenSafetyModal from 'components/TokenSafety/TokenSafetyModal'
import { SwapTokens } from 'components/Widget-VOIDED/inputs'
import { getTestnetTokenRemap } from 'constants/testnet-token-remapped'
import { NATIVE_CHAIN_ID, nativeOnChain } from 'constants/tokens'
import { checkWarning } from 'constants/tokenSafety'
import { TokenPriceQuery } from 'graphql/data/__generated__/types-and-hooks'
import { Chain, TokenQueryData } from 'graphql/data/Token'
import { QueryToken } from 'graphql/data/Token'
import { CHAIN_NAME_TO_CHAIN_ID, getTokenDetailsURL } from 'graphql/data/util'
import { useCurrency, useIsUserAddedTokenOnChain } from 'hooks/Tokens'
import { useAtom } from 'jotai'
import { UNKNOWN_TOKEN_SYMBOL, useTokenByChainId, useTokenFromActiveNetwork } from 'lib/hooks/useCurrency'
import { getTokenAddress } from 'lib/utils/analytics'
import { inputCurrencyAtom, outputCurrencyAtom } from 'pages/Swap/atoms'
import { SwapMinimal } from 'pages/Swap/index-minimal'
import { useCallback, useMemo, useState, useTransition } from 'react'
import { useNavigate } from 'react-router-dom'
import { SwapState } from 'state/swap/reducer'
import styled from 'styled-components/macro'
import { isAddress } from 'utils'
import { addressesAreEquivalent } from 'utils/addressesAreEquivalent'

import { OnChangeTimePeriod } from './ChartSection'
import { GeckoTerminal } from './GeckoTerminal'
import InvalidTokenDetails from './InvalidTokenDetails'

const TokenSymbol = styled.span`
  text-transform: uppercase;
  color: ${({ theme }) => theme.textSecondary};

  font-family: inherit;
`
const TokenActions = styled.div`
  display: flex;
  gap: 16px;
  color: ${({ theme }) => theme.textSecondary};
`

const DividerFullHeight = styled.div`
  height: 100vh;
  @media only screen and (max-width: 1440px) {
    height: unset;
  }
  width: 2px;
  background-color: black;

  @media only screen and (max-width: 768px) {
    display: none;
  }
`

function useOnChainToken(address: string | undefined, skip: boolean) {
  const token = useTokenFromActiveNetwork(skip || !address ? undefined : address)

  if (skip || !address || (token && token?.symbol === UNKNOWN_TOKEN_SYMBOL)) {
    return undefined
  } else {
    return token
  }
}

function useDefinedChainIdToken(address: string | undefined, skip: boolean, chainId: number) {
  const token = useTokenByChainId(address, chainId)

  const isValidToken = token?.wrapped.symbol === 'UNKNOWNN'
  const tokenFallback = useCurrency(address, chainId)
  const finalizedToken = useMemo(() => {
    if (isValidToken) {
      return token
    } else {
      return tokenFallback
    }
  }, [isValidToken, tokenFallback])

  if (!finalizedToken) {
    return undefined
  } else {
    return finalizedToken
  }
}

// Selects most relevant token based on data available, preferring native > query > on-chain
// Token will be null if still loading from on-chain, and undefined if unavailable
function useRelevantToken(
  address: string | undefined,
  pageChainId: number,
  tokenQueryData: TokenQueryData | undefined
) {
  const { chainId: activeChainId } = useWeb3React()

  const queryToken = useMemo(() => {
    if (!address) return undefined
    if (address === NATIVE_CHAIN_ID) return nativeOnChain(pageChainId)
    if (tokenQueryData) return new QueryToken(address, tokenQueryData)
    return undefined
  }, [pageChainId, address, tokenQueryData])
  // fetches on-chain token if query data is missing and page chain matches global chain (else fetch won't work)
  const skipOnChainFetch = Boolean(queryToken) || pageChainId !== activeChainId
  const onChainToken = useOnChainToken(address, skipOnChainFetch)

  return useMemo(
    () => ({ token: queryToken ?? onChainToken, didFetchFromChain: !queryToken }),
    [onChainToken, queryToken]
  )
}

// Selects most relevant token based on data available, preferring native > query > given chainId
// Token will be null if still loading from on-chain, and undefined if unavailable
function useRelevantTokenDefinedChainId(
  address: string | undefined,
  pageChainId: number,
  tokenQueryData: TokenQueryData | undefined
) {
  const queryToken = useMemo(() => {
    if (!address) return undefined
    if (address === NATIVE_CHAIN_ID) return nativeOnChain(pageChainId)
    if (tokenQueryData) return new QueryToken(address, tokenQueryData)
    return undefined
  }, [pageChainId, address, tokenQueryData])
  // fetches on-chain token if query data is missing and page chain matches global chain (else fetch won't work)
  const skipOnChainFetch = Boolean(queryToken)

  const onChainToken = useDefinedChainIdToken(address, skipOnChainFetch, pageChainId)

  return useMemo(
    () => ({ token: queryToken ?? onChainToken, didFetchFromChain: !queryToken }),
    [onChainToken, queryToken]
  )
}

type TokenDetailsProps = {
  urlAddress: string | undefined
  inputTokenAddress?: string
  chain: Chain
  tokenQuery: any //TokenQuery
  tokenPriceQuery: TokenPriceQuery | undefined
  onChangeTimePeriod: OnChangeTimePeriod
}
export default function DerpTokenDetails({
  urlAddress,
  inputTokenAddress,
  chain,
  tokenQuery,
  tokenPriceQuery,
  onChangeTimePeriod,
}: TokenDetailsProps) {
  const [inputCurrency, setInputCurrency] = useAtom(inputCurrencyAtom)
  const [outputCurrency, setOutputCurrency] = useAtom(outputCurrencyAtom)

  if (!urlAddress) {
    throw new Error('Invalid token details route: tokenAddress param is undefined')
  }
  const address = useMemo(
    () => (urlAddress === NATIVE_CHAIN_ID ? urlAddress : isAddress(urlAddress) || undefined),
    [urlAddress]
  )

  const pageChainId = CHAIN_NAME_TO_CHAIN_ID[chain]

  const tokenQueryData = tokenQuery.token
  const { chainId: connectedChainId } = useWeb3React()

  // const crossChainMap = useMemo(
  //   () =>
  //     tokenQueryData?.project?.tokens.reduce((map, current) => {
  //       if (current) map[current.chain] = current.address
  //       return map
  //     }, {} as { [key: string]: string | undefined }) ?? {},
  //   [tokenQueryData]
  // )

  //! USDED ON GETTING TOKEN DETAILS BASED ON URL PARAMS
  const { token: detailedToken, didFetchFromChain } = useRelevantTokenDefinedChainId(
    address,
    pageChainId,
    tokenQueryData
  )

  const { token: inputToken } = useRelevantToken(inputTokenAddress || address, pageChainId, undefined)

  const tokenWarning = address ? checkWarning(address) : null
  const isBlockedToken = tokenWarning?.canProceed === false
  const navigate = useNavigate()

  // Wrapping navigate in a transition prevents Suspense from unnecessarily showing fallbacks again.
  const [isPending, startTokenTransition] = useTransition()
  // const navigateToTokenForChain = useCallback(
  //   (update: Chain) => {
  //     if (!address) return
  //     const bridgedAddress = crossChainMap[update]
  //     if (bridgedAddress) {
  //       startTokenTransition(() => navigate(getTokenDetailsURL({ address: bridgedAddress, chain: update })))
  //     } else if (didFetchFromChain || detailedToken?.isNative) {
  //       startTokenTransition(() => navigate(getTokenDetailsURL({ address, chain: update })))
  //     }
  //   },
  //   [address, crossChainMap, didFetchFromChain, navigate, detailedToken?.isNative]
  // )
  // useOnGlobalChainSwitch(navigateToTokenForChain)

  const handleCurrencyChange = useCallback(
    (tokens: Pick<SwapState, Field.INPUT | Field.OUTPUT>) => {
      if (
        //@ts-ignore
        addressesAreEquivalent(tokens[Field.INPUT]?.currencyId, address) || //@ts-ignore
        addressesAreEquivalent(tokens[Field.OUTPUT]?.currencyId, address)
      ) {
        return
      }

      const newDefaultTokenID = tokens[Field.OUTPUT]?.currencyId ?? tokens[Field.INPUT]?.currencyId
      startTokenTransition(() =>
        navigate(
          getTokenDetailsURL({
            // The function falls back to "NATIVE" if the address is null
            address: newDefaultTokenID === 'ETH' ? null : newDefaultTokenID,
            chain,
            inputAddress:
              // If only one token was selected before we navigate, then it was the default token and it's being replaced.
              // On the new page, the *new* default token becomes the output, and we don't have another option to set as the input token.
              tokens[Field.INPUT] && tokens[Field.INPUT]?.currencyId !== newDefaultTokenID
                ? tokens[Field.INPUT]?.currencyId
                : null,
          })
        )
      )
    },
    [address, chain, navigate]
  )

  const navigateToWidgetSelectedToken = useCallback(
    (tokens: SwapTokens) => {
      const newDefaultToken = tokens[Field.OUTPUT] ?? tokens.default
      const address = newDefaultToken?.isNative ? NATIVE_CHAIN_ID : newDefaultToken?.address
      startTokenTransition(() =>
        navigate(
          getTokenDetailsURL({
            address,
            chain,
            inputAddress: tokens[Field.INPUT] ? getTokenAddress(tokens[Field.INPUT] as Currency) : null,
          })
        )
      )
    },
    [chain, navigate]
  )

  const [continueSwap, setContinueSwap] = useState<{ resolve: (value: boolean | PromiseLike<boolean>) => void }>()

  const [openTokenSafetyModal, setOpenTokenSafetyModal] = useState(false)

  // Show token safety modal if Swap-reviewing a warning token, at all times if the current token is blocked
  const shouldShowSpeedbump = !useIsUserAddedTokenOnChain(address, pageChainId) && tokenWarning !== null
  const onReviewSwapClick = useCallback(
    () => new Promise<boolean>((resolve) => (shouldShowSpeedbump ? setContinueSwap({ resolve }) : resolve(true))),
    [shouldShowSpeedbump]
  )

  const onResolveSwap = useCallback(
    (value: boolean) => {
      continueSwap?.resolve(value)
      setContinueSwap(undefined)
    },
    [continueSwap, setContinueSwap]
  )
  // address will never be undefined if token is defined; address is checked here to appease typechecker
  if (detailedToken === undefined || !address) {
    return <InvalidTokenDetails pageChainId={pageChainId} isInvalidAddress={!address} />
  }

  return (
    <Trace
      page={InterfacePageName.TOKEN_DETAILS_PAGE}
      properties={{ tokenAddress: address, tokenName: detailedToken?.name }}
      shouldLogImpression
    >
      <TokenDetailsLayout>
        {detailedToken && !isPending ? (
          <LeftPanel>
            <BreadcrumbNavLink to={`/tokens/${chain.toLowerCase()}`}>
              <BackToIcon data-testid="token-details-return-button" />
              <NunitoText>Back to Token List</NunitoText>
            </BreadcrumbNavLink>
            <TokenInfoContainer data-testid="token-info-container">
              <TokenNameCell>
                <CurrencyLogo currency={detailedToken} size="32px" hideL2Icon={false} />
                <NunitoText
                  size="xxl"
                  weight={700}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  {detailedToken.name ?? <Trans>Name not found</Trans>}
                  <TokenSymbol>{detailedToken.symbol ?? <Trans>Symbol not found</Trans>}</TokenSymbol>
                </NunitoText>
              </TokenNameCell>
              <TokenActions>
                <ShareButton currency={detailedToken} />
              </TokenActions>
            </TokenInfoContainer>

            <GeckoTerminal
              token0={
                process.env.REACT_APP_IS_TESTSITE === 'false' && inputCurrency
                  ? inputCurrency.address?.toLowerCase()
                  : process.env.REACT_APP_IS_TESTSITE === 'true' && inputCurrency?.symbol
                  ? getTestnetTokenRemap(pageChainId, inputCurrency.symbol)
                  : getTestnetTokenRemap(pageChainId, 'UNDEFINED')
              }
              token1={
                process.env.REACT_APP_IS_TESTSITE === 'false' && outputCurrency
                  ? outputCurrency.address?.toLowerCase()
                  : process.env.REACT_APP_IS_TESTSITE === 'true' && outputCurrency?.symbol
                  ? getTestnetTokenRemap(pageChainId, outputCurrency.symbol)
                  : getTestnetTokenRemap(pageChainId, 'UNDEFINED')
              }
              pageChainId={pageChainId}
            />

            {/* <ChartSection tokenPriceQuery={tokenPriceQuery} onChangeTimePeriod={onChangeTimePeriod} /> */}

            {/* <StatsSection
              chainId={pageChainId}
              address={address}
              TVL={tokenQueryData?.market?.totalValueLocked?.value}
              volume24H={tokenQueryData?.market?.volume24H?.value}
              priceHigh52W={tokenQueryData?.market?.priceHigh52W?.value}
              priceLow52W={tokenQueryData?.market?.priceLow52W?.value}
            /> */}
            <Hr />
            <AboutSection
              address={address}
              chainId={pageChainId}
              description={tokenQueryData?.project?.description}
              homepageUrl={tokenQueryData?.project?.homepageUrl}
              twitterName={tokenQueryData?.project?.twitterName}
            />
            {!detailedToken.isNative && <AddressSection address={address} />}
          </LeftPanel>
        ) : (
          <TokenDetailsSkeleton />
        )}
        <DividerFullHeight></DividerFullHeight>
        <RightPanel onClick={() => isBlockedToken && setOpenTokenSafetyModal(true)}>
          <div style={{ pointerEvents: isBlockedToken ? 'none' : 'auto' }}>
            {/* <Widget
              defaultTokens={{
                [Field.INPUT]: inputToken ?? undefined,
                default: detailedToken ?? undefined,
              }}
              onDefaultTokenChange={navigateToWidgetSelectedToken}
              onReviewSwapClick={onReviewSwapClick}
            /> */}
            <SwapMinimal
              chainId={pageChainId}
              prefilledState={{
                [Field.INPUT]: { currencyId: detailedToken?.wrapped.address ?? undefined },
                // [Field.INPUT]: inputToken ?? undefined,
                // default: detailedToken ?? undefined,
              }}
              onCurrencyChange={handleCurrencyChange}
              disableTokenInputs={pageChainId !== connectedChainId}

              // onReviewSwapClick={onReviewSwapClick}
            />
          </div>
          {tokenWarning && <TokenSafetyMessage tokenAddress={address} warning={tokenWarning} />}
          {detailedToken && <BalanceSummary token={detailedToken} />}
        </RightPanel>
        {detailedToken && <MobileBalanceSummaryFooter token={detailedToken} />}
        <TokenSafetyModal
          isOpen={openTokenSafetyModal || !!continueSwap}
          tokenAddress={address}
          onContinue={() => onResolveSwap(true)}
          onBlocked={() => {
            setOpenTokenSafetyModal(false)
          }}
          onCancel={() => onResolveSwap(false)}
          showCancel={true}
        />
      </TokenDetailsLayout>
    </Trace>
  )
}
