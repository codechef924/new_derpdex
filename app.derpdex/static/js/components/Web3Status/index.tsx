import { Trans } from '@lingui/macro'
import { Box } from '@mui/material'
import { sendAnalyticsEvent, TraceEvent } from '@uniswap/analytics'
import { BrowserEvent, InterfaceElementName, InterfaceEventName } from '@uniswap/analytics-events'
import { useWeb3React } from '@web3-react/core'
import PortfolioDrawer, { useAccountDrawer } from 'components/AccountDrawer'
import PrefetchBalancesWrapper from 'components/AccountDrawer/PrefetchBalancesWrapper'
import { GloriaText } from 'components/CustomFonts/GloriaHallelujah'
import Loader from 'components/Icons/LoadingSpinner'
import { IconWrapper } from 'components/Identicon/StatusIcon'
import { useGetConnection } from 'connection'
import { isSupportedChain } from 'constants/chains'
import { Portal } from 'nft/components/common/Portal'
import { useIsMobile } from 'nft/hooks'
import { useIsNftClaimAvailable } from 'nft/hooks/useIsNftClaimAvailable'
import { darken } from 'polished'
import { useCallback, useMemo } from 'react'
import { AlertTriangle } from 'react-feather'
import { useAppSelector } from 'state/hooks'
import styled from 'styled-components/macro'
import { colors } from 'theme/colors'
import { flexRowNoWrap } from 'theme/styles'

import { isTransactionRecent, useAllTransactions } from '../../state/transactions/hooks'
import { TransactionDetails } from '../../state/transactions/types'
import { shortenAddress } from '../../utils'
import { ButtonSecondary } from '../Button'
import { RowBetween } from '../Row'

// https://stackoverflow.com/a/31617326
const FULL_BORDER_RADIUS = 9999

const Web3StatusGeneric = styled(ButtonSecondary)`
  ${flexRowNoWrap};
  width: 100%;
  align-items: center;
  padding: 0.5rem;
  border-radius: ${FULL_BORDER_RADIUS}px;
  cursor: pointer;
  user-select: none;
  height: 36px;
  margin-right: 2px;
  margin-left: 2px;
  :focus {
    outline: none;
  }
`
const DDWeb3StatusGeneric = styled(ButtonSecondary)`
  ${flexRowNoWrap};
  width: 100%;
  align-items: center;
  padding: 0.5rem;
  border-radius: ${FULL_BORDER_RADIUS}px;
  cursor: pointer;
  user-select: none;
  height: 36px;
  margin-right: 2px;
  margin-left: 2px;
  :focus {
    outline: none;
  }
`
const Web3StatusError = styled(Web3StatusGeneric)`
  background-color: ${({ theme }) => theme.accentFailure};
  border: 1px solid ${({ theme }) => theme.accentFailure};
  color: ${({ theme }) => theme.white};
  font-weight: 500;
  :hover,
  :focus {
    background-color: ${({ theme }) => darken(0.1, theme.accentFailure)};
  }
`

const DDWeb3StatusError = styled.div`
  background-color: ${({ theme }) => theme.accentFailure};
  display: flex;
  align-items: center;
  cursor: pointer;
  color: ${({ theme }) => theme.white};
  padding: 13px 31.5px;
  font-weight: 600;
  border-radius: 8px;
  font-size: 20px;
  line-height: 24px;
  :hover,
  :focus {
    background-color: ${({ theme }) => darken(0.1, theme.accentFailure)};
  }

  @media only screen and (max-width: 768px) {
    font-size: 12px;
    padding: 0;
  }
`

const Web3StatusConnectWrapper = styled.div<{ faded?: boolean }>`
  ${flexRowNoWrap};
  align-items: center;
  background-color: ${({ theme }) => theme.accentActionSoft};
  border-radius: ${FULL_BORDER_RADIUS}px;
  border: none;
  padding: 0;
  height: 40px;
  background: ${({ theme }) => theme.brandedGradient};

  color: ${({ theme }) => theme.accentAction};
  :hover {
    color: ${({ theme }) => theme.accentActionSoft};
    stroke: ${({ theme }) => theme.accentActionSoft};
  }

  transition: ${({
    theme: {
      transition: { duration, timing },
    },
  }) => `${duration.fast} color ${timing.in}`};
`
const DDWeb3StatusConnectWrapper = styled.div<{ faded?: boolean }>`
  align-items: center;
  padding: 13px 20.5px;
  // background: linear-gradient(135deg, #a372ff 0%, #46c9d2 95.1%);
  border-radius: 8px;
  font-size: 24px;
  font-weight: 600;
  line-height: 24px;
  cursor: pointer;

  @media only screen and (max-width: 768px) {
    font-size: 16px;
    padding: 0;
  }

  color: ${({ theme }) => theme.black};
  :hover {
    color: ${({ theme }) => theme.derpGray1};
    stroke: ${({ theme }) => theme.derpGray1};
  }

  transition: ${({
    theme: {
      transition: { duration, timing },
    },
  }) => `${duration.fast} color ${timing.in}`};
`

const Web3StatusConnected = styled(Web3StatusGeneric)<{
  pending?: boolean
  isClaimAvailable?: boolean
}>`
  background-color: ${({ pending, theme }) => (pending ? theme.accentAction : theme.deprecated_bg1)};
  border: 1px solid ${({ pending, theme }) => (pending ? theme.accentAction : theme.deprecated_bg1)};
  color: ${({ pending, theme }) => (pending ? theme.white : theme.textPrimary)};
  font-weight: 500;
  border: ${({ isClaimAvailable }) => isClaimAvailable && `1px solid ${colors.purple300}`};
  :hover,
  :focus {
    border: 1px solid ${({ theme }) => darken(0.05, theme.deprecated_bg3)};

    :focus {
      border: 1px solid
        ${({ pending, theme }) =>
          pending ? darken(0.1, theme.accentAction) : darken(0.1, theme.backgroundInteractive)};
    }
  }

  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.lg}px`}) {
    width: ${({ pending }) => !pending && '36px'};

    ${IconWrapper} {
      margin-right: 0;
    }
  }
`

const DDWeb3StatusConnected = styled.div<{
  pending?: boolean
  isClaimAvailable?: boolean
}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  :hover,
  :focus {
    // border: 1px solid ${({ theme }) => darken(0.05, theme.derpGray2)};
  }

  @media only screen and (max-width: ${({ theme }) => `768px`}) {
    width: ${({ pending }) => !pending && '70px'};
    // height: 40px;
    justify-content: 'center';

    overflow: hidden;

    ${IconWrapper} {
      margin-right: 0;
    }
  }
`

const AddressAndChevronContainer = styled.div`
  display: flex;
  overflow: hidden;

  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.navSearchInputVisible}px`}) {
    display: none;
  }
`

const Text = styled.p`
  flex: 1 1 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0 0.5rem 0 0.25rem;
  font-size: 1rem;
  width: fit-content;
  font-weight: 500;
`

const NetworkIcon = styled(AlertTriangle)`
  margin-left: 0.25rem;
  margin-right: 0.5rem;
  width: 16px;
  height: 16px;
`

// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime
}

const StyledConnectButton = styled.button`
  background-color: transparent;
  border: none;
  border-top-left-radius: ${FULL_BORDER_RADIUS}px;
  border-bottom-left-radius: ${FULL_BORDER_RADIUS}px;
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
  padding: 10px 12px;
  color: inherit;
`

const Web3StatusFlexBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  @media only screen and (max-width: 768px) {
    flex-direction: row;
    gap: 6px;
  }
`

const FixedSizing = styled.div`
  @media only screen and (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 34px;
  }
`

const ConnectedToStyled = () => {
  const isMobile = useIsMobile()
  return (
    <Box display="flex" alignItems="center" gap="8px">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="18" viewBox="0 0 14 18" fill="none">
        <path
          d="M5.39802 15.8334C5.46746 13.6902 4.67754 12.1007 3.84423 10.538C3.54042 9.97538 3.02829 9.72533 2.39462 9.76104C1.93457 9.78783 1.47452 9.81463 1.01446 9.78784C0.511004 9.75212 0.11171 9.38599 0.0162258 8.9395C-0.0705776 8.54659 0.198509 7.98402 0.641205 7.7697C0.945016 7.61789 1.29223 7.43928 1.62208 7.43928C2.75921 7.43035 3.40155 6.70705 3.96577 5.84978C4.63415 4.85856 4.99871 3.7334 5.31989 2.59037C5.45009 2.13495 5.56294 1.67951 5.71919 1.23302C5.86675 0.813313 6.15321 0.518633 6.61327 0.500772C7.06464 0.482912 7.37713 0.777594 7.58546 1.14372C7.72434 1.39375 7.81115 1.68844 7.85455 1.9742C7.95872 2.61715 8.0021 3.26904 8.09759 3.92092C8.34932 5.60866 9.86838 7.04638 11.4916 7.16247C12.0124 7.19818 12.5332 7.19818 13.0454 7.26962C13.5488 7.34106 13.9308 7.74291 13.9915 8.17155C14.061 8.65376 13.6964 9.19847 13.1495 9.36814C12.594 9.52888 12.0211 9.60925 11.4656 9.76998C9.24339 10.3951 8.07155 11.8239 7.84587 14.1992C7.7851 14.7886 7.80246 15.3869 7.75906 15.9762C7.72434 16.5388 7.48128 16.9942 7.01255 17.3068C6.35284 17.7443 5.53691 17.405 5.42407 16.6281C5.35462 16.2709 5.39802 15.9137 5.39802 15.8334Z"
          fill="black"
        />
      </svg>
      {!isMobile && <GloriaText size="xl">Connected:</GloriaText>}
    </Box>
  )
}

function Web3StatusInner() {
  const { account, connector, chainId, ENSName } = useWeb3React()
  const getConnection = useGetConnection()
  const connection = getConnection(connector)
  const [, toggleAccountDrawer] = useAccountDrawer()
  const handleWalletDropdownClick = useCallback(() => {
    sendAnalyticsEvent(InterfaceEventName.ACCOUNT_DROPDOWN_BUTTON_CLICKED)
    toggleAccountDrawer()
  }, [toggleAccountDrawer])
  const isClaimAvailable = useIsNftClaimAvailable((state) => state.isClaimAvailable)

  const error = useAppSelector((state) => state.connection.errorByConnectionType[getConnection(connector).type])

  const allTransactions = useAllTransactions()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions.filter((tx) => !tx.receipt).map((tx) => tx.hash)

  const hasPendingTransactions = !!pending.length
  // const hasPendingTransactions = true

  if (!chainId) {
    return null
  } else if (error) {
    return (
      <DDWeb3StatusError onClick={handleWalletDropdownClick}>
        <NetworkIcon />
        <Text>
          <Trans>Error</Trans>
        </Text>
      </DDWeb3StatusError>
    )
  } else if (account) {
    return (
      <TraceEvent
        events={[BrowserEvent.onClick]}
        name={InterfaceEventName.MINI_PORTFOLIO_TOGGLED}
        properties={{ type: 'open' }}
      >
        <DDWeb3StatusConnected
          data-testid="web3-status-connected"
          onClick={handleWalletDropdownClick}
          pending={hasPendingTransactions}
          isClaimAvailable={isClaimAvailable}
        >
          <Web3StatusFlexBox>
            {!hasPendingTransactions && <ConnectedToStyled />}
            {hasPendingTransactions ? (
              <RowBetween>
                <Text
                  style={{
                    fontSize: '20px',
                    color: 'white',
                    fontWeight: 600,
                  }}
                >
                  <Trans>{pending?.length} Pending</Trans>
                </Text>{' '}
                <Loader stroke="white" />
              </RowBetween>
            ) : (
              <>
                {isSupportedChain(chainId) ? (
                  <GloriaText size="lg">{ENSName || shortenAddress(account)}</GloriaText>
                ) : (
                  <Text
                    style={{
                      fontSize: '20px',
                      color: 'white',
                      fontWeight: 600,
                    }}
                  >
                    Error
                  </Text>
                )}
              </>
            )}
          </Web3StatusFlexBox>
        </DDWeb3StatusConnected>
      </TraceEvent>
    )
  } else {
    return (
      <TraceEvent
        events={[BrowserEvent.onClick]}
        name={InterfaceEventName.CONNECT_WALLET_BUTTON_CLICKED}
        element={InterfaceElementName.CONNECT_WALLET_BUTTON}
      >
        <DDWeb3StatusConnectWrapper
          tabIndex={0}
          faded={false}
          onKeyPress={(e) => e.key === 'Enter' && handleWalletDropdownClick()}
          onClick={handleWalletDropdownClick}
        >
          <GloriaText>
            <Trans>Connect</Trans>
          </GloriaText>
        </DDWeb3StatusConnectWrapper>
      </TraceEvent>
    )
  }
}

export default function Web3Status() {
  return (
    <PrefetchBalancesWrapper>
      <FixedSizing>
        <Web3StatusInner />
      </FixedSizing>
      <Portal>
        <PortfolioDrawer />
      </Portal>
    </PrefetchBalancesWrapper>
  )
}
