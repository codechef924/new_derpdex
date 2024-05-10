// eslint-disable-next-line no-restricted-imports
import { t, Trans } from '@lingui/macro'
import { sendAnalyticsEvent, Trace, TraceEvent, useTrace } from '@uniswap/analytics'
import { BrowserEvent, InterfaceElementName, InterfaceEventName, InterfaceSectionName } from '@uniswap/analytics-events'
import { useWeb3React } from '@web3-react/core'
import clsx from 'clsx'
import useDebounce from 'hooks/useDebounce'
import { useOnClickOutside } from 'hooks/useOnClickOutside'
import { useFetchedTokenDatas } from 'hooks/useTokenData'
import { useTopTokenAddresses } from 'hooks/useTopTokens'
import { Box } from 'nft/components/Box'
import { Row } from 'nft/components/Flex'
import { magicalGradientOnHover } from 'nft/css/common.css'
import { useIsMobile, useIsTablet } from 'nft/hooks'
import { useIsNavSearchInputVisible } from 'nft/hooks/useIsNavSearchInputVisible'
import { ChangeEvent, useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components/macro'

import { ChevronLeftIcon, MagnifyingGlassIcon, NavMagnifyingGlassIcon } from '../../nft/components/icons'
import { NavIcon } from './NavIcon'
import * as styles from './SearchBar.css'
import { SearchBarDropdown } from './SearchBarDropdown'
import { SearchDerpDexToken } from './SuggestionRow'

const KeyShortCut = styled.div`
  background-color: ${({ theme }) => theme.hoverState};
  color: ${({ theme }) => theme.textSecondary};
  padding: 0px 8px;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 800;
  line-height: 16px;
  display: flex;
  align-items: center;
  opacity: 0.6;
  backdrop-filter: blur(60px);
`

export const SearchBar = () => {
  const [isOpen, toggleOpen] = useReducer((state: boolean) => !state, false)
  const [searchValue, setSearchValue] = useState('')
  const debouncedSearchValue = useDebounce(searchValue, 300)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { pathname } = useLocation()
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  const isNavSearchInputVisible = useIsNavSearchInputVisible()

  const [tokenDataSource, setTokenDataSource] = useState<SearchDerpDexToken[]>()

  useOnClickOutside(searchRef, () => {
    isOpen && toggleOpen()
  })

  const { loading, error, addresses } = useTopTokenAddresses()

  const {
    loading: loadingDatas,
    error: errorDatas,
    data: tokenDatas,
  } = useFetchedTokenDatas(addresses && isOpen ? addresses : [])

  useEffect(() => {
    isOpen ? setTokenDataSource(tokenDatas) : setTokenDataSource([])
  }, [isOpen])

  useEffect(() => {
    if (tokenDatas && tokenDatas?.length > 0 && !loadingDatas) {
      setTokenDataSource(tokenDatas)
    } else {
      setTokenDataSource([])
    }
  }, [loadingDatas])

  const searchResults: SearchDerpDexToken[] | undefined = useMemo(() => {
    if (debouncedSearchValue && debouncedSearchValue.length > 0 && tokenDataSource && tokenDataSource?.length > 0) {
      return tokenDatas?.filter((token) =>
        token.name?.toLocaleLowerCase().includes(debouncedSearchValue.toLocaleLowerCase())
      )
    } else if (debouncedSearchValue.length === 0) {
      return tokenDatas
    } else {
      return []
    }
  }, [debouncedSearchValue])

  useEffect(() => {
    if (searchResults && searchResults.length > 0) {
      setTokenDataSource(searchResults)
    }
  }, [searchResults])

  const { chainId } = useWeb3React()

  // close dropdown on escape
  useEffect(() => {
    const escapeKeyDownHandler = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        event.preventDefault()
        toggleOpen()
      }
    }

    document.addEventListener('keydown', escapeKeyDownHandler)

    return () => {
      document.removeEventListener('keydown', escapeKeyDownHandler)
    }
  }, [isOpen, toggleOpen])

  // clear searchbar when changing pages
  useEffect(() => {
    setSearchValue('')
  }, [pathname])

  // auto set cursor when searchbar is opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  const isMobileOrTablet = isMobile || isTablet || !isNavSearchInputVisible

  const trace = useTrace({ section: InterfaceSectionName.NAVBAR_SEARCH })

  const navbarSearchEventProperties = {
    navbar_search_input_text: debouncedSearchValue,
    hasInput: debouncedSearchValue && debouncedSearchValue.length > 0,
    ...trace,
  }
  const placeholderText = useMemo(() => {
    return isMobileOrTablet ? t`Search` : t`Search tokens on DerpDEX`
  }, [isMobileOrTablet])

  const handleKeyPress = useCallback(
    (event: any) => {
      if (event.key === '/') {
        event.preventDefault()
        !isOpen && toggleOpen()
      }
    },
    [isOpen]
  )

  useEffect(() => {
    const innerRef = inputRef.current

    if (innerRef !== null) {
      //only mount the listener when input available as ref
      document.addEventListener('keydown', handleKeyPress)
    }

    return () => {
      if (innerRef !== null) {
        document.removeEventListener('keydown', handleKeyPress)
      }
    }
  }, [handleKeyPress, inputRef])

  return (
    <Trace section={InterfaceSectionName.NAVBAR_SEARCH}>
      <Box
        data-cy="search-bar"
        // position={{ sm: 'fixed', md: 'absolute', xl: 'relative' }}
        // width={{ sm: isOpen ? 'viewWidth' : 'auto', md: 'auto' }}
        ref={searchRef}
        className={styles.searchBarContainerNft}
        display={{ sm: isOpen ? 'inline-block' : 'none', xl: 'inline-block' }}
      >
        <Row
          className={clsx(
            styles.nftSearchBar,
            !isOpen && !isMobile && magicalGradientOnHover,
            isMobileOrTablet && (isOpen ? styles.visible : styles.hidden)
          )}
          borderRadius={isOpen || isMobileOrTablet ? undefined : '8'}
          borderTopRightRadius={isOpen && !isMobile ? '8' : undefined}
          borderTopLeftRadius={isOpen && !isMobile ? '8' : undefined}
          borderBottomWidth={isOpen || isMobileOrTablet ? '0px' : '1px'}
          backgroundColor={isOpen ? 'backgroundSurface' : 'searchBackground'}
          onClick={() => !isOpen && toggleOpen()}
          gap="12"
        >
          <Box className={styles.searchContentLeftAlign}>
            <Box display={{ sm: 'none', md: 'flex' }}>
              <MagnifyingGlassIcon />
            </Box>
            <Box display={{ sm: 'flex', md: 'none' }} color="textTertiary" onClick={toggleOpen}>
              <ChevronLeftIcon />
            </Box>
          </Box>
          <TraceEvent
            events={[BrowserEvent.onFocus]}
            name={InterfaceEventName.NAVBAR_SEARCH_SELECTED}
            element={InterfaceElementName.NAVBAR_SEARCH_INPUT}
            properties={{ ...trace }}
          >
            <Trans
              id={placeholderText}
              render={({ translation }) => (
                <Box
                  as="input"
                  data-cy="search-bar-input"
                  placeholder={translation as string}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    !isOpen && toggleOpen()
                    setSearchValue(event.target.value)
                  }}
                  onBlur={() =>
                    sendAnalyticsEvent(InterfaceEventName.NAVBAR_SEARCH_EXITED, navbarSearchEventProperties)
                  }
                  className={`${styles.searchBarInput} ${styles.searchContentLeftAlign}`}
                  value={searchValue}
                  ref={inputRef}
                  width="full"
                />
              )}
            />
          </TraceEvent>
          {!isOpen && <KeyShortCut>/</KeyShortCut>}
        </Row>
        <Box className={`${clsx(isOpen ? styles.visible : styles.hidden)} ${styles.applyAbsolute}`}>
          {isOpen && (
            <SearchBarDropdown
              toggleOpen={toggleOpen}
              tokenDatas={tokenDataSource}
              queryText={debouncedSearchValue}
              hasInput={debouncedSearchValue.length > 0}
              isLoading={loadingDatas}
            />
          )}
        </Box>
      </Box>
      {isMobile && (
        <NavIcon onClick={toggleOpen} label={placeholderText}>
          <NavMagnifyingGlassIcon />
        </NavIcon>
      )}
    </Trace>
  )
}
