import { t } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'
import { MouseoverTooltip } from 'components/Tooltip'
import { useGetConnection } from 'connection'
import { getChainInfo } from 'constants/chainInfo'
import { SupportedChainId } from 'constants/chains'
import { useOnClickOutside } from 'hooks/useOnClickOutside'
import useSelectChain from 'hooks/useSelectChain'
import useSyncChainQuery from 'hooks/useSyncChainQuery'
import { Box } from 'nft/components/Box'
import { Portal } from 'nft/components/common/Portal'
import { Column } from 'nft/components/Flex'
import { useIsMobile } from 'nft/hooks'
import { useCallback, useMemo, useRef, useState } from 'react'
import { AlertTriangle, ChevronDown, ChevronUp } from 'react-feather'
import { useLocation } from 'react-router-dom'
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import styled from 'styled-components'
import { useTheme } from 'styled-components/macro'

import * as styles from './ChainSelector.css'
import ChainSelectorRow from './ChainSelectorRow'
import { NavDropdown } from './NavDropdown'

export const CHAIN_SELECTOR =
  process.env.REACT_APP_IS_TESTSITE === 'true'
    ? [SupportedChainId.ZKSYNC_TESTNET, SupportedChainId.BASE_TESTNET, SupportedChainId.OPBNB_TESTNET]
    : [SupportedChainId.ZKSYNC_MAINNET, SupportedChainId.BASE_MAINNET, SupportedChainId.OPBNB_MAINNET]

const NETWORK_SELECTOR_CHAINS = [
  // SupportedChainId.MAINNET,
  // SupportedChainId.POLYGON,
  // SupportedChainId.OPTIMISM,
  // SupportedChainId.ARBITRUM_ONE,
  // SupportedChainId.CELO,
  // SupportedChainId.BNB,
  ...CHAIN_SELECTOR,
]

interface ChainSelectorProps {
  leftAlign?: boolean
}

const ChainContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: #fff;
  padding: 17px 14px;
  max-height: 49px;
  border-radius: 8px;
  border: 2px solid #000;
  box-shadow: -4px 4px 0px 0px #ddd3d3;
  gap: 4px;

  @media only screen and (max-width: 768px) {
    padding: 2px 14px;
    min-height: 34px;
  }
`

export const ChainSelector = ({ leftAlign }: ChainSelectorProps) => {
  const { chainId, connector } = useWeb3React()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const location = useLocation()
  const isMobile = useIsMobile()

  const theme = useTheme()

  const ref = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  useOnClickOutside(ref, () => setIsOpen(false), [modalRef])

  const info = chainId ? getChainInfo(chainId) : undefined

  const selectChain = useSelectChain()
  useSyncChainQuery()

  const [pendingChainId, setPendingChainId] = useState<SupportedChainId | undefined>(undefined)

  const onSelectChain = useCallback(
    async (targetChainId: SupportedChainId) => {
      setPendingChainId(targetChainId)
      await selectChain(targetChainId)
      setPendingChainId(undefined)
      setIsOpen(false)
    },
    [selectChain, setIsOpen]
  )

  const SupportedNetworkSelector = useMemo(() => {
    if (location.pathname === '/xderp' || location.pathname === '/derp-bridge') {
      if (process.env.REACT_APP_IS_TESTSITE === 'true') {
        return [SupportedChainId.GOERLI, ...NETWORK_SELECTOR_CHAINS]
      } else {
        return [SupportedChainId.MAINNET, ...NETWORK_SELECTOR_CHAINS]
      }
    }

    return NETWORK_SELECTOR_CHAINS
  }, [location])

  const getConnection = useGetConnection()
  const connectionType = getConnection(connector).type
  // const isUniWallet = connectionType === ConnectionType.UNIWALLET

  if (!chainId) {
    return null
  }

  const isSupported = !!info

  const dropdown = (
    <NavDropdown left={isMobile ? '0' : 'auto'} right={leftAlign ? 'auto' : '0'} ref={modalRef}>
      {/* <NavDropdownBottomRight ref={modalRef}> */}
      <Column paddingX="8">
        {SupportedNetworkSelector.map((chainId: SupportedChainId) => (
          <ChainSelectorRow
            // disabled={!UniWalletSupportedChains.includes(chainId)}
            onSelectChain={onSelectChain}
            targetChain={chainId}
            key={chainId}
            isPending={chainId === pendingChainId}
          />
        ))}
      </Column>
      {/* </NavDropdownBottomRight> */}
    </NavDropdown>
  )

  const chevronProps = {
    height: 20,
    width: 20,
    color: theme.textSecondary,
  }

  return (
    <Box order={isMobile ? 1 : 0} position="relative" ref={ref}>
      <MouseoverTooltip text={t`Your wallet's current network is unsupported.`} disabled={isSupported}>
        <ChainContainer onClick={() => setIsOpen(!isOpen)}>
          {/* <Row
          as="button"
          gap="8"
          className={styles.ChainSelector}
          background={isOpen ? 'accentActiveSoft' : 'none'}
          onClick={() => setIsOpen(!isOpen)}
        > */}
          {!isSupported ? (
            <AlertTriangle size={20} color={theme.textSecondary} />
          ) : (
            <img src={info.logoUrl} alt={info.label} className={styles.Image} data-testid="chain-selector-logo" />
          )}
          {isOpen ? <ChevronUp {...chevronProps} /> : <ChevronDown {...chevronProps} />}
          {/* </Row> */}
        </ChainContainer>
      </MouseoverTooltip>
      {isOpen && (isMobile ? <Portal>{dropdown}</Portal> : <>{dropdown}</>)}
    </Box>
  )
}
