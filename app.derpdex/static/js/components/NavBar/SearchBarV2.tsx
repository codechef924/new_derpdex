// eslint-disable-next-line no-restricted-imports
import { t } from '@lingui/macro'
import { sendAnalyticsEvent, Trace, useTrace } from '@uniswap/analytics'
import { InterfaceEventName, InterfaceSectionName } from '@uniswap/analytics-events'
import { useWeb3React } from '@web3-react/core'
import { ReactComponent as DerpMafia } from 'assets/svg/derp-mafia.svg'
import { ReactComponent as KeypressImg } from 'assets/svg/keypress.svg'
import clsx from 'clsx'
import useDebounce from 'hooks/useDebounce'
import { useOnClickOutside } from 'hooks/useOnClickOutside'
import { useFetchedTokenDatas } from 'hooks/useTokenData'
import { useTopTokenAddresses } from 'hooks/useTopTokens'
import { Box } from 'nft/components/Box'
import { useIsMobile, useIsTablet } from 'nft/hooks'
import { useIsNavSearchInputVisible } from 'nft/hooks/useIsNavSearchInputVisible'
import { ChangeEvent, useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components/macro'

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

// //////////
type ElongateWhenOpenedInMobile = {
  isOpen: boolean
  isTestsite: boolean
}
const BarContainer = styled.div<ElongateWhenOpenedInMobile>`
  position: relative;
  border-radius: 8px;
  border: 2px solid #000;
  background: #fff;
  box-shadow: -4px 4px 0px 0px #ddd3d3;
  width: 100%;

  @media only screen and (max-width: 768px) {
    width: ${({ isOpen }) => (isOpen ? '100%' : 'auto')};
  }
  height: 49px;
  padding: 6px 6px 6px 69px;

  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;

  .derp-mafia {
    position: absolute;
    bottom: 0;
    left: 0;
    margin-left: 8px;
  }

  .is-input {
    ::placeholder {
      color: ${({ theme }) => theme.textTertiary};
      font-family: 'Gloria Hallelujah';
    }
  }

  ${({ isOpen, isTestsite }) =>
    isOpen
      ? `
      @media only screen and (max-width: 768px) {
        z-index: 5;
        left: 0;
        top: ${isTestsite ? 'unset' : '68%'};
        margin-left: 5%;
        position: absolute;
        max-width: 350px;
        transition: width 1s ease-in-out;
      }
    `
      : null}
`

const KeypressStyled = styled.div`
  padding: 6px;
  border-radius: 4px;
  background: #afbdc8;
  height: 100%;
  width: 35px;
`
type DisplayOnlyWhenOpen = {
  isOpen: boolean
  isTestsite?: boolean
}
const MobileSearchStyled = styled.div<DisplayOnlyWhenOpen>`
  position: absolute;
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  left: 0;
  width: 100vw;
  height: ${({ isTestsite }) => (isTestsite ? '68px' : '40%')};
  top: ${({ isTestsite }) => (isTestsite ? '0' : 'unset')};
  z-index: 3;

  background: white;
`

export const SearchBarV2 = () => {
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
  } = useFetchedTokenDatas(addresses ? addresses : [])

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
      <BarContainer
        isTestsite={process.env.REACT_APP_IS_TESTSITE === 'false' ? false : true}
        ref={searchRef}
        isOpen={isOpen}
        onClick={() => !isOpen && toggleOpen()}
      >
        <DerpMafia className="derp-mafia" />
        <Box
          as="input"
          data-cy="search-bar-input"
          placeholder={placeholderText as string}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            !isOpen && toggleOpen()
            setSearchValue(event.target.value)
          }}
          onBlur={() => sendAnalyticsEvent(InterfaceEventName.NAVBAR_SEARCH_EXITED, navbarSearchEventProperties)}
          className={`${styles.searchBarInput} ${styles.searchContentLeftAlign} is-input`}
          value={searchValue}
          ref={inputRef}
          width="full"
        />
        <KeypressStyled>
          <KeypressImg />
        </KeypressStyled>
        {!isMobile && (
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
        )}
      </BarContainer>
      {isMobile && isOpen && (
        <MobileSearchStyled
          isTestsite={process.env.REACT_APP_IS_TESTSITE === 'false' ? false : true}
          ref={searchRef}
          isOpen={isOpen}
        >
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
        </MobileSearchStyled>
      )}
    </Trace>
  )
}
