import { useWeb3React } from '@web3-react/core'
import { ReactComponent as ArrowRightIcon } from 'assets/svg/arrow-right-icon-pale.svg'
import { Connection, ConnectionType, getConnections, networkConnection } from 'connection'
import { ErrorCode } from 'connection/utils'
import { isSupportedChain } from 'constants/chains'
import { useCallback, useEffect, useState } from 'react'
import { useAppDispatch } from 'state/hooks'
import { updateSelectedWallet } from 'state/user/reducer'
import styled from 'styled-components'

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  border: 2px solid #000;
  background: #fff;
  box-shadow: 3px 3px 0px 0px #000;
  padding: 25px 19px;
`

const WalletWrapper = styled.div`
  border-radius: 16px;
  border: 2px solid #000;
  background: #fff;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 33px;
  width: 100%;
  padding: 22px 22px;
  cursor: pointer;

  &:hover {
    background: rgb(241 241 241);
  }
  img {
    width: 84px;
  }
  .connection-info {
    display: flex;
    flex-direction: column;
    gap: 10px;

    #name {
      font-weight: 700;
      font-size: 30px;
    }
    #description {
      font-size: 16px;
      font-weight: 400;
      color: ${({ theme }) => theme.derpGray1};
    }
  }
  .arrow {
    flex-grow: 1;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    margin-right: 10px;
  }

  @media only screen and (max-width: 768px) {
    gap: 16px;
    padding: 12px 10px;
    justify-content: space-between;

    img {
      max-width: 60px;
    }

    .connection-info {
      display: flex;
      flex-direction: column;
      gap: 10px;

      #name {
        font-weight: 700;
        font-size: 20px;
      }
      #description {
        font-size: 12px;
        font-weight: 400;
        color: ${({ theme }) => theme.derpGray1};
      }
    }

    svg {
      max-height 28px;
    }
  }
`

function didUserReject(connection: Connection, error: any): boolean {
  return (
    error?.code === ErrorCode.USER_REJECTED_REQUEST ||
    (connection.type === ConnectionType.WALLET_CONNECT && error?.toString?.() === ErrorCode.WC_MODAL_CLOSED) ||
    (connection.type === ConnectionType.COINBASE_WALLET && error?.toString?.() === ErrorCode.CB_REJECTED_REQUEST)
  )
}

export const ConnectWallet = () => {
  const { chainId, account, connector } = useWeb3React()
  const connections = getConnections()
  const [pendingConnection, setPendingConnection] = useState<Connection | undefined>()
  const [pendingError, setPendingError] = useState<any>()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (chainId && isSupportedChain(chainId) && connector !== networkConnection.connector) {
      networkConnection.connector.activate(chainId)
    }
  }, [chainId, connector])

  const tryActivation = useCallback(
    async (connection: Connection) => {
      // Skips wallet connection if the connection should override the default behavior, i.e. install metamask or launch coinbase app
      if (connection.overrideActivate?.()) return

      try {
        setPendingConnection(connection)
        setPendingError(undefined)

        await connection.connector.activate()
        console.debug(`connection activated: ${connection.getName()}`)
        dispatch(updateSelectedWallet({ wallet: connection.type }))
      } catch (error) {
        console.debug(`web3-react connection error: ${JSON.stringify(error)}`)
        // TODO(WEB-3162): re-add special treatment for already-pending injected errors
        if (didUserReject(connection, error)) {
          setPendingConnection(undefined)
        } else {
          setPendingError(error)
        }
      }
    },
    [dispatch, setPendingError]
  )

  return (
    <BodyWrapper>
      {/* <div>Login to Portal using Metamask</div> */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {connections
          .filter((condition) => condition.shouldDisplay())
          .map((conn, index) => (
            <WalletWrapper onClick={() => tryActivation(conn)} key={index}>
              <div>
                <img src={conn.getIcon?.(false)} />
              </div>
              <div className="connection-info">
                <span id="name">{conn.getName()}</span>
                <span id="description">Connect using {conn.getName()}</span>
              </div>
              <div className="arrow">
                <ArrowRightIcon />
              </div>
            </WalletWrapper>
          ))}
      </div>
    </BodyWrapper>
  )
}
