/* eslint-disable import/no-unused-modules */
import { useWeb3React } from '@web3-react/core'
import { getChainInfo } from 'constants/chainInfo'
import { CHAIN_NAME_TO_CHAIN_ID, validateUrlChainParam } from 'graphql/data/util'
import { atom, useAtom } from 'jotai'
import { useIsMobile } from 'nft/hooks'
import { ToggleOption } from 'pages/xDERP/components/Toggle'
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

import { ResponsiveFlex } from '../stylings'
import CultivateTable from './CultivateTable'
import NetworkFilter from './NetworkFilter'
import SearchBar from './Search'

const ComponentWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  gap: 26.5px;
`

const FlexPanel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  width: 100%;

  @media only screen and (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`

export enum TableOption {
  LIVE = 'Live',
  FINISHED = 'Finished',
}

export const stakingView = atom<string>(TableOption.LIVE)

const TablePanel = ({
  currentTableOption,
  setCurrentTableOption,
}: {
  currentTableOption: TableOption
  setCurrentTableOption: React.Dispatch<TableOption>
}) => {
  const isMobile = useIsMobile()
  return (
    <FlexPanel>
      <ToggleOption currentTableOption={currentTableOption} setCurrentTableOption={setCurrentTableOption} />
      <ResponsiveFlex gap={isMobile ? 16 : 16}>
        <NetworkFilter />
        <SearchBar />
      </ResponsiveFlex>
    </FlexPanel>
  )
}

export const Table = () => {
  const [currentTableOption, setCurrentTableOption] = useState<TableOption>(TableOption.LIVE)
  const { chainName } = useParams<{ chainName?: string }>()
  const { chainId } = useWeb3React()

  const [stakingViewOption, setStakingViewOption] = useAtom(stakingView)

  useEffect(() => {
    setStakingViewOption(currentTableOption)
  }, [currentTableOption])

  const validatedChainName = useMemo(() => {
    return validateUrlChainParam(chainName)
  }, [chainName])

  const chainInfo = useMemo(() => {
    if (!validatedChainName) {
      return getChainInfo(chainId || CHAIN_NAME_TO_CHAIN_ID.ZKSYNC_MAINNET)
    } else {
      return getChainInfo(CHAIN_NAME_TO_CHAIN_ID[validatedChainName])
    }
  }, [chainId, validatedChainName])

  const currentChainName = useMemo(() => {
    return chainInfo?.label
  }, [chainInfo])

  return (
    <ComponentWrapper>
      <TablePanel currentTableOption={currentTableOption} setCurrentTableOption={setCurrentTableOption} />
      <CultivateTable />
    </ComponentWrapper>
  )
}
