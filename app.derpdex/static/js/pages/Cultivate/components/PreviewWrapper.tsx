import { Currency } from '@uniswap/sdk-core'
import { ReactComponent as LinkIcon } from 'assets/svg/link-icon.svg'
import { ReactComponent as ViewContractIcon } from 'assets/svg/view-contract.svg'
import { getChainInfo } from 'constants/chainInfo'
import { SupportedChainId } from 'constants/chains'
import { PositionFields } from 'hooks/useCultivatePoolDatas'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { ExplorerDataType, getExplorerLink } from 'utils/getExplorerLink'

import DerpOverlay from '../assets/Derp-Farm-Small.png'
import { Text } from '../stylings'
const PreviewWrapper = styled.div`
  position: relative;
  padding: 30px 8px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  grid-column: 1;

  gap: 8px;
  z-index: 999;
  overflow: hidden;

  img {
    position: absolute;
    // width: 100%;
    bottom: 0;
    left: 0;
    z-index: 1;
    margin-left: 16px;
  }
`

const StyledTextLink = styled(Text)`
  display: flex;
  cursor: pointer;
  align-items: center;
  gap: 8px;
  text-wrap: nowrap;

  width: 100%;
  justify-content: flex-start;

  &:hover {
    color: blue;
  }
  z-index: 2;
`

const InnerBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  opacity: 0.8;
  z-index: 2;

  gap: 18px;

  padding: 0px 8px;
`

const INFO_PAGE_PREFIX: { [key: number]: string } = {
  [SupportedChainId.ZKSYNC_MAINNET]: 'zksync',
  [SupportedChainId.ZKSYNC_TESTNET]: 'zksync_testnet',
  [SupportedChainId.BASE_MAINNET]: 'base',
  [SupportedChainId.BASE_TESTNET]: 'base_testnet',
  [SupportedChainId.OPBNB_MAINNET]: 'opbnb',
  [SupportedChainId.OPBNB_TESTNET]: 'opbnb_testnet',
}

export const PreviewPools = ({
  currencyPairInfo,
  positionItems,
  chainId,
}: {
  currencyPairInfo: {
    feeTier: number
    pair: (Currency | null | undefined)[]
  }
  positionItems: PositionFields[]
  chainId: number
}) => {
  const navigate = useNavigate()

  return (
    <PreviewWrapper>
      <InnerBox>
        <StyledTextLink
          onClick={() =>
            navigate(
              `/add/${currencyPairInfo.pair[0]?.wrapped.address}/${currencyPairInfo.pair[1]?.wrapped.address}/${currencyPairInfo.feeTier}`
            )
          }
          size="lg"
          weight={700}
        >
          Add {currencyPairInfo.pair[0]?.symbol}-{currencyPairInfo.pair[1]?.symbol} LP
        </StyledTextLink>
        <StyledTextLink
          onClick={() =>
            window.open(`${getChainInfo(chainId)?.infoLink}pools/${positionItems[0].poolAddress}`, '_blank')
          }
          size="lg"
          weight={700}
          color="#A372FF"
        >
          See Pair Info <LinkIcon />
        </StyledTextLink>
        <StyledTextLink
          onClick={() =>
            window.open(`${getExplorerLink(chainId, positionItems[0].poolAddress, ExplorerDataType.ADDRESS)}`)
          }
          size="lg"
          weight={700}
          color="#A372FF"
        >
          View Contract <ViewContractIcon />
        </StyledTextLink>
      </InnerBox>
      <img src={DerpOverlay} />
    </PreviewWrapper>
  )
}
