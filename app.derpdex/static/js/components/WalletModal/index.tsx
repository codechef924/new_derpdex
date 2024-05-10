import { sendAnalyticsEvent } from '@uniswap/analytics'
import { InterfaceEventName, WalletConnectionResult } from '@uniswap/analytics-events'
import { useWeb3React } from '@web3-react/core'
import { useAccountDrawer } from 'components/AccountDrawer'
import { sendEvent } from 'components/analytics'
import { AutoColumn } from 'components/Column'
import { AutoRow } from 'components/Row'
import { Connection, ConnectionType, getConnections, networkConnection } from 'connection'
import { ErrorCode } from 'connection/utils'
import { isSupportedChain } from 'constants/chains'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useAppDispatch } from 'state/hooks'
import { updateSelectedWallet } from 'state/user/reducer'
import styled from 'styled-components/macro'
import { ThemedText } from 'theme'
import { flexColumnNoWrap } from 'theme/styles'

import ConnectionErrorView from './ConnectionErrorView'
import Option from './Option'

const Wrapper = styled.div`
  ${flexColumnNoWrap};
  background-color: ${({ theme }) => theme.backgroundSurface};
  width: 100%;
  padding: 14px 16px 16px;
  flex: 1;
`

const OptionGrid = styled.div`
  display: grid;
  grid-gap: 2px;
  border-radius: 12px;
  overflow: hidden;
  ${({ theme }) => theme.deprecated_mediaWidth.deprecated_upToMedium`
    grid-template-columns: 1fr;
  `};
`

const PrivacyPolicyWrapper = styled.div`
  padding: 0 4px;
`

function didUserReject(connection: Connection, error: any): boolean {
  return (
    error?.code === ErrorCode.USER_REJECTED_REQUEST ||
    (connection.type === ConnectionType.WALLET_CONNECT && error?.toString?.() === ErrorCode.WC_MODAL_CLOSED) ||
    (connection.type === ConnectionType.COINBASE_WALLET && error?.toString?.() === ErrorCode.CB_REJECTED_REQUEST)
  )
}

export default function WalletModal({ openSettings }: { openSettings: () => void }) {
  const dispatch = useAppDispatch()
  const { connector, chainId } = useWeb3React()
  const [drawerOpen, toggleWalletDrawer] = useAccountDrawer()

  const [pendingConnection, setPendingConnection] = useState<Connection | undefined>()
  const [pendingError, setPendingError] = useState<any>()

  const connections = getConnections()

  useEffect(() => {
    // Clean up errors when the dropdown closes
    return () => setPendingError(undefined)
  }, [setPendingError])

  const openOptions = useCallback(() => {
    if (pendingConnection) {
      setPendingError(undefined)
      setPendingConnection(undefined)
    }
  }, [pendingConnection, setPendingError])

  // Keep the network connector in sync with any active user connector to prevent chain-switching on wallet disconnection.
  useEffect(() => {
    if (chainId && isSupportedChain(chainId) && connector !== networkConnection.connector) {
      networkConnection.connector.activate(chainId)
    }
  }, [chainId, connector])

  // Used to track the state of the drawer in async function
  const drawerOpenRef = useRef(drawerOpen)
  drawerOpenRef.current = drawerOpen

  const tryActivation = useCallback(
    async (connection: Connection) => {
      // Skips wallet connection if the connection should override the default behavior, i.e. install metamask or launch coinbase app
      if (connection.overrideActivate?.()) return

      // log selected wallet
      sendEvent({
        category: 'Wallet',
        action: 'Change Wallet',
        label: connection.type,
      })

      try {
        setPendingConnection(connection)
        setPendingError(undefined)

        await connection.connector.activate()
        console.debug(`connection activated: ${connection.getName()}`)
        dispatch(updateSelectedWallet({ wallet: connection.type }))
        if (drawerOpenRef.current) toggleWalletDrawer()
      } catch (error) {
        console.debug(`web3-react connection error: ${JSON.stringify(error)}`)
        // TODO(WEB-3162): re-add special treatment for already-pending injected errors
        if (didUserReject(connection, error)) {
          setPendingConnection(undefined)
        } else {
          setPendingError(error)

          sendAnalyticsEvent(InterfaceEventName.WALLET_CONNECT_TXN_COMPLETED, {
            result: WalletConnectionResult.FAILED,
            wallet_type: connection.getName(),
          })
        }
      }
    },
    [dispatch, setPendingError, toggleWalletDrawer]
  )

  return (
    <Wrapper data-testid="wallet-modal">
      <AutoRow justify="space-between" width="100%" marginBottom="16px">
        <ThemedText.SubHeader>Connect a wallet</ThemedText.SubHeader>
        {/* <IconButton Icon={Settings} onClick={openSettings} data-testid="wallet-settings" /> */}
      </AutoRow>
      {pendingError ? (
        pendingConnection && (
          <ConnectionErrorView openOptions={openOptions} retryActivation={() => tryActivation(pendingConnection)} />
        )
      ) : (
        <AutoColumn gap="16px">
          <OptionGrid data-testid="option-grid">
            {connections.map((connection) =>
              connection.shouldDisplay() ? (
                <Option
                  key={connection.getName()}
                  connection={connection}
                  activate={() => tryActivation(connection)}
                  pendingConnectionType={pendingConnection?.type}
                />
              ) : null
            )}
          </OptionGrid>
          {/* <PrivacyPolicyWrapper>
            <PrivacyPolicyNotice />
          </PrivacyPolicyWrapper> */}
        </AutoColumn>
      )}
    </Wrapper>
  )
}