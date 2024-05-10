import { Trans } from '@lingui/macro'
import { Trace } from '@uniswap/analytics'
import { InterfacePageName } from '@uniswap/analytics-events'
import { GloriaText } from 'components/CustomFonts/GloriaHallelujah'
import { MAX_WIDTH_MEDIA_BREAKPOINT, MEDIUM_MEDIA_BREAKPOINT } from 'components/Tokens/constants'
import { filterStringAtom } from 'components/Tokens/state'
import NetworkFilter from 'components/Tokens/TokenTable/NetworkFilter'
import SearchBar from 'components/Tokens/TokenTable/SearchBar'
import TokenTable from 'components/Tokens/TokenTable/TokenTable'
import { MouseoverTooltip } from 'components/Tooltip'
import { useResetAtom } from 'jotai/utils'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components/macro'

const ExploreContainer = styled.div`
  width: 100%;
  min-width: 320px;
  padding: 68px 12px 68px;
  z-index: 1;

  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    padding-top: 48px;
  }

  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.sm}px`}) {
    padding-top: 70px;
    padding-bottom: 70px;
  }
`
const TitleContainer = styled.div`
  margin-bottom: 32px;
  max-width: ${MAX_WIDTH_MEDIA_BREAKPOINT};
  margin-left: auto;
  margin-right: auto;
  display: flex;
`

const TitleContainerBase = styled.div`
  display: flex;
  font-size: 32px !important;
  @media only screen and (max-width: 768px) {
    font-size: 16px !important;
  }
`

const FiltersContainer = styled.div`
  display: flex;
  gap: 8px;
  height: 40px;

  @media only screen and (max-width: ${MEDIUM_MEDIA_BREAKPOINT}) {
    order: 2;
  }
`

const DerpFiltersContainer = styled.div`
  display: flex;
  gap: 8px;
  height: auto;

  @media only screen and (max-width: ${MEDIUM_MEDIA_BREAKPOINT}) {
    order: 2;
  }
`

const SearchContainer = styled(FiltersContainer)`
  margin-left: 8px;
  width: 100%;

  @media only screen and (max-width: ${MEDIUM_MEDIA_BREAKPOINT}) {
    margin: 0px;
    order: 1;
  }
`

const DerpSearchContainer = styled(DerpFiltersContainer)`
  margin-left: 8px;
  width: 100%;

  @media only screen and (max-width: ${MEDIUM_MEDIA_BREAKPOINT}) {
    margin: 0px;
    order: 1;
  }
`

const FiltersWrapper = styled.div`
  display: flex;
  max-width: ${MAX_WIDTH_MEDIA_BREAKPOINT};
  margin: 0 auto;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.textTertiary};
  flex-direction: row;

  @media only screen and (max-width: ${MEDIUM_MEDIA_BREAKPOINT}) {
    flex-direction: column;
    gap: 8px;
  }
`

const FiltersWrapperBase = styled.div`
  display: flex;
  color: ${({ theme }) => theme.textTertiary};
  flex-direction: row;

  @media only screen and (max-width: ${MEDIUM_MEDIA_BREAKPOINT}) {
    flex-direction: column;
    gap: 8px;
    width: 100%;
    height: auto;
  }
`

const FlexContainerBetween = styled.div`
  max-width: ${MAX_WIDTH_MEDIA_BREAKPOINT};
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 19px;

  @media only screen and (max-width: ${MEDIUM_MEDIA_BREAKPOINT}) {
    flex-direction: column;
    gap: 8px;
  }
`

const Tokens = () => {
  const resetFilterString = useResetAtom(filterStringAtom)
  const location = useLocation()

  useEffect(() => {
    resetFilterString()
  }, [location, resetFilterString])

  return (
    <Trace page={InterfacePageName.TOKENS_PAGE} shouldLogImpression>
      <ExploreContainer>
        <FlexContainerBetween>
          <TitleContainerBase>
            <MouseoverTooltip
              text={<Trans>This table contains the top tokens by DerpDEX volume, sorted based on your input.</Trans>}
              placement="bottom"
            >
              <Trans>
                <GloriaText>Top tokens on DerpDEX</GloriaText>
              </Trans>
            </MouseoverTooltip>
          </TitleContainerBase>
          <FiltersWrapperBase>
            <DerpFiltersContainer>
              <NetworkFilter />
              {/* <TimeSelector /> */}
            </DerpFiltersContainer>
            <DerpSearchContainer>
              <SearchBar />
            </DerpSearchContainer>
          </FiltersWrapperBase>
        </FlexContainerBetween>
        <TokenTable />
      </ExploreContainer>
    </Trace>
  )
}

export default Tokens
