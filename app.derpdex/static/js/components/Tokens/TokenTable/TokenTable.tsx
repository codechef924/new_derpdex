import { Trans } from '@lingui/macro'
import { TokenDayDatas } from 'graphql/data/__generated__/types-and-hooks'
import { PAGE_SIZE, useTopTokensSubgraph } from 'graphql/data/TopTokens'
import { validateUrlChainParam } from 'graphql/data/util'
import { useAtomValue } from 'jotai/utils'
import { ReactNode, useEffect, useState } from 'react'
import { AlertTriangle } from 'react-feather'
import { useParams } from 'react-router-dom'
import styled from 'styled-components/macro'

import { MAX_WIDTH_MEDIA_BREAKPOINT } from '../constants'
import { filterStringAtom, sortAscendingAtom, sortMethodAtom, TokenSortMethod } from '../state'
import { HeaderRow, LoadedRowSubgraph, LoadingRow } from './TokenRow'

const GridContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: ${MAX_WIDTH_MEDIA_BREAKPOINT};
  background-color: ${({ theme }) => theme.backgroundSurface};
  box-shadow: 3px 3px 0px 2px #000;
  margin-left: auto;
  margin-right: auto;
  border-radius: 16px;
  justify-content: center;
  align-items: center;
  border: 0.15em solid ${({ theme }) => theme.black};
`

const TokenDataContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  height: 100%;
  width: 100%;
`

const NoTokenDisplay = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 60px;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 16px;
  font-weight: 500;
  align-items: center;
  padding: 0px 28px;
  gap: 8px;
`

const BoundedBorderDiv = styled.div`
  width: 100%;
  padding: 0px 14px;
`

const BorderBottom = styled.div`
  border-bottom: 0.17em solid ${({ theme }) => theme.black};
`

function NoTokensState({ message }: { message: ReactNode }) {
  return (
    <GridContainer>
      <HeaderRow />
      <NoTokenDisplay>{message}</NoTokenDisplay>
    </GridContainer>
  )
}

const LoadingRows = ({ rowCount }: { rowCount: number }) => (
  <>
    {Array(rowCount)
      .fill(null)
      .map((_, index) => {
        return <LoadingRow key={index} first={index === 0} last={index === rowCount - 1} />
      })}
  </>
)

function LoadingTokenTable({ rowCount = PAGE_SIZE }: { rowCount?: number }) {
  return (
    <GridContainer>
      <HeaderRow />
      <TokenDataContainer>
        <LoadingRows rowCount={rowCount} />
      </TokenDataContainer>
    </GridContainer>
  )
}

export default function TokenTable() {
  const chainName = validateUrlChainParam(useParams<{ chainName?: string }>().chainName)

  // const { /* tokens, tokenSortRank, loadingTokens, */ sparklines } = useTopTokens(chainName)

  const { tokens, loadingTokens } = useTopTokensSubgraph(chainName)

  const [loadedTokens, setLoadedTokens] = useState<TokenDayDatas[]>()
  const sortMethod = useAtomValue(sortMethodAtom)
  const sortAscending = useAtomValue(sortAscendingAtom)

  const sortProperties: Record<TokenSortMethod, keyof TokenDayDatas> = {
    [TokenSortMethod.PRICE]: 'priceUSD',
    // [TokenSortMethod.PERCENT_CHANGE]: 'percentChange',
    [TokenSortMethod.TOTAL_VALUE_LOCKED]: 'totalValueLockedUSD',
    [TokenSortMethod.VOLUME]: 'volumeUSD',
    [TokenSortMethod.PERCENT_CHANGE]: '__typename', //;TODO when percent change is implemented
  }

  useEffect(() => {
    if (loadedTokens) {
      const sortProperty = sortProperties[sortMethod]
      const sortedTokens = [...loadedTokens].sort((a, b) => {
        if (sortAscending) {
          return Number(a[sortProperty]) - Number(b[sortProperty])
        } else {
          return Number(b[sortProperty]) - Number(a[sortProperty])
        }
      })
      setLoadedTokens(sortedTokens)
    }
  }, [sortAscending])

  useEffect(() => {
    if (tokens && !loadingTokens) {
      setLoadedTokens(tokens)
    }
  }, [loadingTokens])

  const currentString = useAtomValue(filterStringAtom)

  useEffect(() => {
    if (currentString.length > 0) {
      const filteredTokensByInput = tokens?.filter(
        (token) =>
          token.token?.name.toLocaleLowerCase().includes(currentString.toLocaleLowerCase()) ||
          token.token?.symbol.toLocaleLowerCase().includes(currentString.toLocaleLowerCase())
      )
      setLoadedTokens(filteredTokensByInput)
    } else {
      setLoadedTokens(tokens)
    }
  }, [currentString])

  /* loading and error state */
  if (loadingTokens) {
    return <LoadingTokenTable rowCount={PAGE_SIZE} />
  } else if (!loadedTokens) {
    return (
      <NoTokensState
        message={
          <>
            <AlertTriangle size={16} />
            <Trans>An error occurred loading tokens. Please try again.</Trans>
          </>
        }
      />
    )
  } else if (loadedTokens?.length === 0) {
    return <NoTokensState message={<Trans>No tokens found</Trans>} />
  } else {
    return (
      <GridContainer>
        <HeaderRow />
        <TokenDataContainer>
          {loadedTokens.map((token, index) => (
            <>
              {token?.token?.id && (
                // <LoadedRow
                //   key={token.address}
                //   tokenListIndex={index}
                //   tokenListLength={tokens.length}
                //   token={token}
                //   // sparklineMap={sparklines}
                //   // sortRank={tokenSortRank[token.address]}
                // />
                <LoadedRowSubgraph
                  key={token.token.id}
                  tokenListIndex={index}
                  tokenListLength={loadedTokens.length}
                  token={token}
                  chain={chainName}
                />
              )}
              {token?.token?.id && index !== loadedTokens.length - 1 && (
                <BoundedBorderDiv>
                  <BorderBottom />
                </BoundedBorderDiv>
              )}
            </>
          ))}
        </TokenDataContainer>
      </GridContainer>
    )
  }
}
