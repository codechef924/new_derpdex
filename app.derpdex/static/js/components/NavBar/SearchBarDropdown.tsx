import { Trans } from '@lingui/macro'
import { useTrace } from '@uniswap/analytics'
import { InterfaceSectionName, NavBarSearchTypes } from '@uniswap/analytics-events'
import { useWeb3React } from '@web3-react/core'
import Badge from 'components/Badge'
import { SupportedChainId } from 'constants/chains'
import { SafetyLevel } from 'graphql/data/__generated__/types-and-hooks'
import { SearchToken } from 'graphql/data/SearchTokens'
import { CHAIN_ID_TO_BACKEND_NAME } from 'graphql/data/util'
import { useIsNftPage } from 'hooks/useIsNftPage'
import { Box } from 'nft/components/Box'
import { Column, Row } from 'nft/components/Flex'
import { TrendingArrow } from 'nft/components/icons'
import { subheadSmall } from 'nft/css/common.css'
import { GenieCollection, TrendingCollection } from 'nft/types'
import { ReactNode, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components/macro'
import { ThemedText } from 'theme'

import BnbLogoURI from '../../assets/svg/bnb-logo.svg'
import * as styles from './SearchBar.css'
import { SearchDerpDexToken, TokenRow } from './SuggestionRow'

function isCollection(suggestion: GenieCollection | SearchToken | TrendingCollection) {
  return (suggestion as SearchToken).decimals === undefined
}

interface SearchBarDropdownSectionProps {
  toggleOpen: () => void
  suggestions: SearchDerpDexToken[]
  header: JSX.Element
  headerIcon?: JSX.Element
  hoveredIndex: number | undefined
  startingIndex: number
  setHoveredIndex: (index: number | undefined) => void
  isLoading?: boolean
  eventProperties: Record<string, unknown>
}

const SearchBarDropdownSection = ({
  toggleOpen,
  suggestions,
  header,
  headerIcon = undefined,
  hoveredIndex,
  startingIndex,
  setHoveredIndex,
  isLoading,
  eventProperties,
}: SearchBarDropdownSectionProps) => {
  const { chainId } = useWeb3React()
  const chainName = CHAIN_ID_TO_BACKEND_NAME[chainId ? chainId : 324 /* 280 */]

  return (
    <Column className={styles.searchBarRoot} gap="12" data-cy="searchbar-dropdown">
      <Row paddingX="16" paddingY="4" gap="8" color="gray300" className={subheadSmall} style={{ lineHeight: '20px' }}>
        {headerIcon ? headerIcon : null}
        <Box>{header}</Box>
      </Row>
      <Column gap="12">
        {suggestions.map((suggestion, index) => (
          <TokenRow
            key={suggestion.address}
            token={suggestion as SearchDerpDexToken}
            chain={chainName}
            isHovered={hoveredIndex === index + startingIndex}
            setHoveredIndex={setHoveredIndex}
            toggleOpen={toggleOpen}
            index={index + startingIndex}
            eventProperties={{
              position: index + startingIndex,
              selected_search_result_name: suggestion.name,
              selected_search_result_address: suggestion.address,
              ...eventProperties,
            }}
          />
        ))}
      </Column>
    </Column>
  )
}

function isKnownToken(token: SearchToken) {
  return token.project?.safetyLevel == SafetyLevel.Verified || token.project?.safetyLevel == SafetyLevel.MediumWarning
}

const BNBLogo = styled.img`
  height: 20px;
  width: 20px;
  margin-right: 8px;
`
const BNBComingSoonBadge = styled(Badge)`
  align-items: center;
  background-color: ${({ theme }) => theme.backgroundModule};
  color: ${({ theme }) => theme.textSecondary};
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  opacity: 1;
  padding: 8px;
  margin: 16px 16px 4px;
  width: calc(100% - 32px);
`

interface SearchBarDropdownProps {
  toggleOpen: () => void
  tokenDatas: SearchDerpDexToken[] | undefined
  queryText: string
  hasInput: boolean
  isLoading: boolean
}

export const SearchBarDropdown = ({
  toggleOpen,
  tokenDatas,
  queryText,
  hasInput,
  isLoading,
}: SearchBarDropdownProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | undefined>(0)

  const { pathname } = useLocation()
  const { chainId } = useWeb3React()
  const isNFTPage = useIsNftPage()
  const isTokenPage = pathname.includes('/tokens')
  const [resultsState, setResultsState] = useState<ReactNode>()

  // const { data: searchHistory } = useRecentlySearchedAssets()
  // const shortenedHistory = useMemo(() => tokenDatas?.slice(0, 2) ?? [...Array<SearchDerpDexToken>(2)], [tokenDatas])

  const totalSuggestions = 5

  // Navigate search results via arrow keys
  // useEffect(() => {
  //   const keyDownHandler = (event: KeyboardEvent) => {
  //     if (event.key === 'ArrowUp') {
  //       event.preventDefault()
  //       if (!hoveredIndex) {
  //         setHoveredIndex(totalSuggestions - 1)
  //       } else {
  //         setHoveredIndex(hoveredIndex - 1)
  //       }
  //     } else if (event.key === 'ArrowDown') {
  //       event.preventDefault()
  //       if (hoveredIndex && hoveredIndex === totalSuggestions - 1) {
  //         setHoveredIndex(0)
  //       } else {
  //         setHoveredIndex((hoveredIndex ?? -1) + 1)
  //       }
  //     }
  //   }

  //   document.addEventListener('keydown', keyDownHandler)

  //   return () => {
  //     document.removeEventListener('keydown', keyDownHandler)
  //   }
  // }, [toggleOpen, hoveredIndex, totalSuggestions])

  const trace = JSON.stringify(useTrace({ section: InterfaceSectionName.NAVBAR_SEARCH }))

  useEffect(() => {
    const eventProperties = { total_suggestions: totalSuggestions, query_text: queryText, ...JSON.parse(trace) }
    if (!isLoading && tokenDatas) {
      const tokenSearchResults =
        tokenDatas && tokenDatas.length > 0 ? (
          <SearchBarDropdownSection
            hoveredIndex={hoveredIndex}
            startingIndex={0}
            setHoveredIndex={setHoveredIndex}
            toggleOpen={toggleOpen}
            suggestions={tokenDatas}
            eventProperties={{
              suggestion_type: NavBarSearchTypes.TOKEN_SUGGESTION,
              ...eventProperties,
            }}
            header={<Trans>Tokens</Trans>}
          />
        ) : (
          <Box className={styles.notFoundContainer}>
            <Trans>No tokens found.</Trans>
          </Box>
        )

      // * This is NFT search * //
      // const collectionSearchResults =
      //   collections.length > 0 ? (
      //     <SearchBarDropdownSection
      //       hoveredIndex={hoveredIndex}
      //       startingIndex={showCollectionsFirst ? 0 : tokens.length}
      //       setHoveredIndex={setHoveredIndex}
      //       toggleOpen={toggleOpen}
      //       suggestions={collections}
      //       eventProperties={{
      //         suggestion_type: NavBarSearchTypes.COLLECTION_SUGGESTION,
      //         ...eventProperties,
      //       }}
      //       header={<Trans>NFT Collections</Trans>}
      //     />
      //   ) : (
      //     <Box className={styles.notFoundContainer}>No NFT collections found.</Box>
      //   )

      const currentState = () =>
        hasInput ? (
          // Empty or Up to 8 combined tokens and nfts
          <Column gap="20">{tokenSearchResults}</Column>
        ) : (
          // Recent Searches, Trending Tokens, Trending Collections
          <Column gap="20">
            <SearchBarDropdownSection
              hoveredIndex={hoveredIndex}
              startingIndex={0}
              setHoveredIndex={setHoveredIndex}
              toggleOpen={toggleOpen}
              suggestions={tokenDatas && tokenDatas?.length > 0 ? tokenDatas : []}
              eventProperties={{
                suggestion_type: NavBarSearchTypes.TOKEN_TRENDING,
                // ...eventProperties,s
              }}
              header={<Trans>Popular tokens</Trans>}
              headerIcon={<TrendingArrow />}
              isLoading={!isLoading}
            />
            {/* {shortenedHistory.length > 0 && (
              <SearchBarDropdownSection
                hoveredIndex={hoveredIndex}
                startingIndex={0}
                setHoveredIndex={setHoveredIndex}
                toggleOpen={toggleOpen}
                suggestions={shortenedHistory}
                eventProperties={{
                  suggestion_type: NavBarSearchTypes.RECENT_SEARCH,
                  ...eventProperties,
                }}
                header={<Trans>Recent searches</Trans>}
                headerIcon={<ClockIcon />}
                isLoading={!searchHistory}
              />
            )} */}
            {/* {!isNFTPage && tokenDatas && (
              <SearchBarDropdownSection
                hoveredIndex={hoveredIndex}
                startingIndex={0}
                setHoveredIndex={setHoveredIndex}
                toggleOpen={toggleOpen}
                suggestions={tokenDatas}
                eventProperties={{
                  suggestion_type: NavBarSearchTypes.TOKEN_TRENDING,
                  // ...eventProperties,s
                }}
                header={<Trans>Popular tokens</Trans>}
                headerIcon={<TrendingArrow />}
                isLoading={!loading}
              />
            )} */}
            {/* {!isTokenPage && (
              <SearchBarDropdownSection
                hoveredIndex={hoveredIndex}
                startingIndex={shortenedHistory.length + (isNFTPage ? 0 : trendingTokens?.length ?? 0)}
                setHoveredIndex={setHoveredIndex}
                toggleOpen={toggleOpen}
                suggestions={formattedTrendingCollections as unknown as GenieCollection[]}
                eventProperties={{
                  suggestion_type: NavBarSearchTypes.COLLECTION_TRENDING,
                  ...eventProperties,
                }}
                header={<Trans>Popular NFT collections</Trans>}
                headerIcon={<TrendingArrow />}
                isLoading={trendingCollectionsAreLoading}
              />
            )} */}
          </Column>
        )

      setResultsState(currentState)
    }
  }, [toggleOpen, queryText, hasInput, isLoading])

  const showBNBComingSoonBadge = chainId === SupportedChainId.BNB && !isLoading

  return (
    <Box className={styles.searchBarDropdownNft}>
      <Box opacity={isLoading ? '0.3' : '1'} transition="125">
        <Column gap="20">
          <SearchBarDropdownSection
            hoveredIndex={hoveredIndex}
            startingIndex={0}
            setHoveredIndex={setHoveredIndex}
            toggleOpen={toggleOpen}
            suggestions={tokenDatas && tokenDatas?.length > 0 ? tokenDatas : []}
            eventProperties={{
              suggestion_type: NavBarSearchTypes.TOKEN_TRENDING,
              // ...eventProperties,s
            }}
            header={<Trans>Popular tokens</Trans>}
            headerIcon={<TrendingArrow />}
            isLoading={!isLoading}
          />
        </Column>
        {showBNBComingSoonBadge && (
          <BNBComingSoonBadge>
            <BNBLogo src={BnbLogoURI} />
            <ThemedText.BodySmall color="textSecondary" fontSize="14px" fontWeight="400" lineHeight="20px">
              <Trans>Coming soon: search and explore tokens on BNB Chain</Trans>
            </ThemedText.BodySmall>
          </BNBComingSoonBadge>
        )}
      </Box>
    </Box>
  )
}
