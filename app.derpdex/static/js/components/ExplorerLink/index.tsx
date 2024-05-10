/* eslint-disable import/no-unused-modules */

import { Trans } from '@lingui/macro'
import { getChainInfo } from 'constants/chainInfo'
import { SupportedChainId } from 'constants/chains'
import styled from 'styled-components'
import { ExternalLink } from 'theme'
import { ExplorerDataType, getExplorerLink, getOKLink } from 'utils/getExplorerLink'

const ColumnFixed = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  * {
    font-family: 'Nunito' !important;
  }
`
const BoldText = styled.div`
  color: black;
  font-weight: 600;
  font-size: 14px;
`

const ExplorerHolder = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  background: #413f3f;
  border-radius: 8px;
  width: 231px;
  height: 28px;
  font-size: 14px;
  color: white;
  font-weight: 600;
`

// NOT SHOWING OKLINK IF NOT SUPPORTED YET
const OKLINK_SUPPORTED = [SupportedChainId.ZKSYNC_MAINNET, SupportedChainId.ZKSYNC_TESTNET]

export const ExplorerList = ({ chainId, hash }: { chainId: number; hash: string }) => {
  return (
    <ColumnFixed
      style={{
        gap: '6px',
      }}
    >
      <BoldText>Transaction Hash</BoldText>
      <ColumnFixed
        style={{
          gap: '6px',
        }}
      >
        <ExternalLink href={getExplorerLink(chainId, hash, ExplorerDataType.TRANSACTION)} color="textSecondary">
          <ExplorerHolder>
            <Trans>{getChainInfo(chainId)?.label} Explorer</Trans>
          </ExplorerHolder>
        </ExternalLink>
        {OKLINK_SUPPORTED.includes(chainId) && (
          <ExternalLink href={getOKLink(hash)} color="textSecondary">
            <ExplorerHolder>
              <Trans>OKLink Explorer</Trans>
            </ExplorerHolder>
          </ExternalLink>
        )}
      </ColumnFixed>
    </ColumnFixed>
  )
}
