// eslint-disable-next-line no-restricted-imports
import { Percent } from '@uniswap/sdk-core'
import { useWeb3React } from '@web3-react/core'
import { AutoColumn } from 'components/Column'
import { L2_CHAIN_IDS } from 'constants/chains'
import { useOnClickOutside } from 'hooks/useOnClickOutside'
import { isSupportedChainId } from 'lib/hooks/routing/clientSideSmartOrderRouter'
import { useRef } from 'react'
import { useModalIsOpen, useToggleSettingsMenu } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/reducer'
import styled from 'styled-components/macro'
import { Divider } from 'theme'

import MaxSlippageSettings from './MaxSlippageMinimal'
import MenuButton from './MenuButton'
import RouterPreferenceSettings from './RouterPreferenceSettings'
import TransactionDeadlineSettings from './TransactionDeadlineSettings'

const Menu = styled.div`
  position: relative;
`

const MenuFlyout = styled(AutoColumn)`
  min-width: 20.125rem;
  border-radius: 24px;
  border: 3px solid #000;
  background: #fff;
  box-shadow: 3px 3px 0px 2px #000;
  position: absolute;
  top: 100%;
  margin-top: 10px;
  right: 0;
  z-index: 100;
  color: ${({ theme }) => theme.textPrimary};
  ${({ theme }) => theme.deprecated_mediaWidth.deprecated_upToMedium`
    min-width: 18.125rem;
  `};
  user-select: none;
  gap: 16px;
  padding: 1rem;
`

export default function SettingsTabLiquidity({ autoSlippage }: { autoSlippage: Percent }) {
  const { chainId } = useWeb3React()
  const showDeadlineSettings = Boolean(chainId && !L2_CHAIN_IDS.includes(chainId))

  const node = useRef<HTMLDivElement | null>(null)
  const isOpen = useModalIsOpen(ApplicationModal.SETTINGS)

  const toggleMenu = useToggleSettingsMenu()
  useOnClickOutside(node, isOpen ? toggleMenu : undefined)

  const isSupportedChain = isSupportedChainId(chainId)

  return (
    <Menu ref={node}>
      <MenuButton disabled={!isSupportedChain} isActive={isOpen} onClick={toggleMenu} />
      {isOpen && (
        <MenuFlyout>
          <RouterPreferenceSettings />
          <Divider />
          <MaxSlippageSettings autoSlippage={autoSlippage} />
          {showDeadlineSettings && (
            <>
              <Divider />
              <TransactionDeadlineSettings />
            </>
          )}
        </MenuFlyout>
      )}
    </Menu>
  )
}
