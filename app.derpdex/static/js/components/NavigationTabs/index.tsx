import { Trans } from '@lingui/macro'
import { Percent } from '@uniswap/sdk-core'
import DerpOnTable from 'assets/images/derp-on-table.png'
import DerpThrowTrash from 'assets/images/derp-throw-trash.png'
import { ReactComponent as BackToIcon } from 'assets/svg/back-to-icon.svg'
import { ReactComponent as GoToIcon } from 'assets/svg/go-to-arrow.svg'
import { DDButtonGradientXLV2 } from 'components/Button'
import { GloriaText } from 'components/CustomFonts/GloriaHallelujah'
import { BigNumber } from 'ethers'
import { useV3PositionFromTokenId } from 'hooks/useV3Positions'
import { useIsMobile } from 'nft/hooks'
import { ReactNode } from 'react'
import { ArrowLeft } from 'react-feather'
import { Link as HistoryLink, Link, useLocation, useParams } from 'react-router-dom'
import { useAppDispatch } from 'state/hooks'
import styled, { useTheme } from 'styled-components/macro'
import { ThemedText } from 'theme'
import { flexRowNoWrap } from 'theme/styles'

import Row, { RowBetween } from '../Row'
const Tabs = styled.div`
  ${flexRowNoWrap};
  align-items: center;
  border-radius: 3rem;
  justify-content: space-evenly;
`

const StyledHistoryLink = styled(HistoryLink)<{ flex: string | undefined }>`
  flex: ${({ flex }) => flex ?? 'none'};

  ${({ theme }) => theme.deprecated_mediaWidth.deprecated_upToMedium`
    flex: none;
    margin-right: 10px;
  `};
`

const ActiveText = styled.div`
  font-weight: 500;
  font-size: 20px;
`

const StyledArrowLeft = styled(ArrowLeft)`
  color: ${({ theme }) => theme.textPrimary};
`

const HoverText = styled(ThemedText.DerpBlack)`
  display: flex;
  align-items: center;
  gap: 16px;
  text-decoration: none;
  :hover {
    color: ${({ theme }) => theme.textPrimary};
    text-decoration: none;
  }
`

const HeaderLinkTitleColumn = styled.div`
  display: flex;
  flex-direction: column;

  gap: 22px;

  padding: 8px;

  @media only screen and (max-width: 768px) {
    padding: 16px 0px 16px 16px;
    justify-content: space-between;
  }
`

const TextTileGrad = styled.div`
  background: ${({ theme }) => theme.derpGradientPrimary};
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media (min-width: 768px) {
    font-size: 48px;
  }
  @media (max-width: 768px) {
    font-size: 20px;
  }
`

const ImgHolder = styled.img`
  @media (min-width: 768px) {
    max-width: 481px;
  }
  @media (max-width: 768px) {
    max-width: 231px;
  }
`

const HeaderWrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 3fr 3fr;

  border-bottom: 2px solid #000;
  padding: 1rem 1rem 0 1rem;

  width: 100%;

  @media only screen and (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }

  .button-placement {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: end;
  }

  @media only screen and (max-width: 768px) {
    .img-placement {
      display: flex;
      flex-direction: column;
      gap: 21px;
      img {
        height: 90px;
      }
      align-self: flex-end;
    }
  }
`

const ButtonOverride = styled(DDButtonGradientXLV2)`
  box-shadow: 3px 3px 0px 0px #000;

  // custom margin
  margin-bottom: 51px;
  margin-right: 20px;
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 12px 26px !important;

  @media only screen and (max-width: 768px) {
    padding: 8px 10px !important;
    margin-bottom: 0px;
    margin-right: 0px;
    font-size: 16px;
    min-height: 56px;
  }
`
const ImgPlacement = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 481px;

  img {
    height: 186px;
  }
`

export function FindPoolTabs({ origin }: { origin: string }) {
  return (
    <Tabs>
      <RowBetween style={{ padding: '1rem 1rem 0 1rem', position: 'relative' }}>
        <HistoryLink to={origin}>
          <StyledArrowLeft />
        </HistoryLink>
        <ActiveText style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          <Trans>Import V2 Pool</Trans>
        </ActiveText>
      </RowBetween>
    </Tabs>
  )
}

const ButtonNavigateComponent = ({
  adding,
  token0Address,
  token1Address,
  feeAmount,
  tokenId,
}: {
  adding: boolean
  token0Address?: string
  token1Address?: string
  feeAmount?: number
  tokenId?: BigNumber
}) => {
  return (
    <div className="button-placement">
      {adding ? (
        <Link to={`/remove/${tokenId}`} style={{ textDecoration: 'none' }}>
          <ButtonOverride>
            <GloriaText>Remove Liquidity</GloriaText>
            <GoToIcon />
          </ButtonOverride>
        </Link>
      ) : (
        <Link
          to={`/increase/${token0Address}/${token1Address}/${feeAmount}/${tokenId}`}
          style={{ textDecoration: 'none' }}
        >
          <ButtonOverride>
            <GloriaText>Increase Liquidity</GloriaText>
            <GoToIcon />
          </ButtonOverride>
        </Link>
      )}
    </div>
  )
}

export function AddRemoveTabs({
  adding,
  creating,
  autoSlippage,
  positionID,
  children,
}: {
  adding: boolean
  creating: boolean
  autoSlippage: Percent
  positionID?: string
  showBackLink?: boolean
  children?: ReactNode
}) {
  const isMobile = useIsMobile()
  const theme = useTheme()
  // reset states on back
  const dispatch = useAppDispatch()
  const location = useLocation()

  // detect if back should redirect to v3 or v2 pool page
  const poolLink = location.pathname.includes('add/v2')
    ? '/pools/v2'
    : '/pools' + (positionID ? `/${positionID.toString()}` : '')

  // Since Add or remove component do not consume the props
  const poolLinkOnRemove = location.pathname.includes('remove/')

  const { tokenId: tokenIdFromUrl } = useParams<{ tokenId?: string }>()

  const parsedTokenId = tokenIdFromUrl ? BigNumber.from(tokenIdFromUrl) : undefined
  const { loading, position: positionDetails } = useV3PositionFromTokenId(parsedTokenId)

  const { token0: token0Address, token1: token1Address, fee: feeAmount, tokenId } = positionDetails || {}

  return (
    <Tabs>
      <HeaderWrapper>
        <HeaderLinkTitleColumn>
          <Link
            data-cy="visit-pool"
            style={{ textDecoration: 'none', width: 'fit-content', marginBottom: '0.5rem' }}
            to={poolLink}
          >
            <HoverText>
              <Trans>
                <BackToIcon /> Back
              </Trans>
            </HoverText>
          </Link>
          <TextTileGrad>
            {creating ? (
              <Trans>Create a pair</Trans>
            ) : adding ? (
              <Trans>
                <GloriaText>Add Liquidity</GloriaText>
              </Trans>
            ) : (
              <Trans>
                <GloriaText>Remove Liquidity</GloriaText>
              </Trans>
            )}
          </TextTileGrad>
        </HeaderLinkTitleColumn>
        <ImgPlacement className="img-placement">
          {isMobile && (
            <ButtonNavigateComponent
              adding={adding}
              token0Address={token0Address}
              token1Address={token1Address}
              feeAmount={feeAmount}
              tokenId={tokenId}
            />
          )}
          {adding ? (
            <ImgHolder src={DerpOnTable} alt="derp-on-table" />
          ) : (
            <ImgHolder src={DerpThrowTrash} alt="derp-throw-trash" />
          )}
        </ImgPlacement>
        {!isMobile && (
          <ButtonNavigateComponent
            adding={adding}
            token0Address={token0Address}
            token1Address={token1Address}
            feeAmount={feeAmount}
            tokenId={tokenId}
          />
        )}

        {/* <Box id="add-liquidity-box" style={{ marginRight: '.5rem' }}>
          {children}
        </Box> */}
        {/* <SettingsTab autoSlippage={autoSlippage} /> */}
      </HeaderWrapper>
    </Tabs>
  )
}

export function CreateProposalTabs() {
  return (
    <Tabs>
      <Row style={{ padding: '1rem 1rem 0 1rem' }}>
        <HistoryLink to="/vote">
          <StyledArrowLeft />
        </HistoryLink>
        <ActiveText style={{ marginLeft: 'auto', marginRight: 'auto' }}>Create Proposal</ActiveText>
      </Row>
    </Tabs>
  )
}
