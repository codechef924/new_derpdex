/* eslint-disable import/no-unused-modules */
import { Trans } from '@lingui/macro'
import { sendAnalyticsEvent } from '@uniswap/analytics'
import { InterfaceElementName, SwapEventName } from '@uniswap/analytics-events'
import { Percent, TradeType } from '@uniswap/sdk-core'
import { useWeb3React } from '@web3-react/core'
import Card from 'components/Card'
import Column from 'components/Column'
import { LoadingRows } from 'components/Loader/styled'
import { SUPPORTED_GAS_ESTIMATE_CHAIN_IDS } from 'constants/chains'
import useNativeCurrency from 'lib/hooks/useNativeCurrency'
import { InterfaceTrade } from 'state/routing/types'
import styled from 'styled-components/macro'
import formatPriceImpact from 'utils/formatPriceImpact'

import { Separator, ThemedText } from '../../theme'
import { RowBetween, RowFixed } from '../Row'
import { MouseoverTooltip, TooltipSize } from '../Tooltip'
import RouterLabel from './RouterLabel'
import * as style from './style.css'
import SwapRoute from './SwapRoute'
const StyledCard = styled(Card)`
  padding: 0;
`

const RowEnd = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  font-size: 14px;
`

interface AdvancedSwapDetailsProps {
  trade: InterfaceTrade
  allowedSlippage: Percent
  syncing?: boolean
  isAggregator?: boolean
}

function TextWithLoadingPlaceholder({
  syncing,
  width,
  children,
}: {
  syncing: boolean
  width: number
  children: JSX.Element
}) {
  return syncing ? (
    <LoadingRows data-testid="loading-rows">
      <div style={{ height: '15px', width: `${width}px` }} />
    </LoadingRows>
  ) : (
    children
  )
}

export function AdvancedSwapDetails({
  trade,
  allowedSlippage,
  syncing = false,
  isAggregator = false,
  aggregatorPriceImpact,
}: AdvancedSwapDetailsProps & { aggregatorPriceImpact?: number }) {
  const { chainId } = useWeb3React()
  const nativeCurrency = useNativeCurrency(chainId)

  return (
    <Column gap="md">
      <Separator />
      {!trade.gasUseEstimateUSD || !chainId || !SUPPORTED_GAS_ESTIMATE_CHAIN_IDS.includes(chainId) ? null : (
        <RowBetween>
          <MouseoverTooltip
            text={
              <Trans>
                The fee paid to miners who process your transaction. This must be paid in {nativeCurrency.symbol}.
              </Trans>
            }
          >
            <ThemedText.BodySmallNunito color="textSecondary">
              <Trans>Network fee</Trans>
            </ThemedText.BodySmallNunito>
          </MouseoverTooltip>
          <TextWithLoadingPlaceholder syncing={syncing} width={50}>
            <ThemedText.BodySmallNunito>~${trade.gasUseEstimateUSD}</ThemedText.BodySmallNunito>
          </TextWithLoadingPlaceholder>
        </RowBetween>
      )}

      <RowBetween>
        <MouseoverTooltip text={<Trans>The impact your trade has on the market price of this pool.</Trans>}>
          <ThemedText.BodySmallNunito color="textSecondary">
            <Trans>Price Impact</Trans>
          </ThemedText.BodySmallNunito>
        </MouseoverTooltip>
        <TextWithLoadingPlaceholder syncing={syncing} width={50}>
          <ThemedText.BodySmall>
            {trade.priceImpact && !isAggregator ? (
              formatPriceImpact(trade.priceImpact)
            ) : aggregatorPriceImpact ? (
              <>{aggregatorPriceImpact?.toFixed(2)}%</>
            ) : (
              '-'
            )}
          </ThemedText.BodySmall>
        </TextWithLoadingPlaceholder>
      </RowBetween>

      <RowBetween>
        <RowFixed>
          <MouseoverTooltip
            text={
              <Trans>
                The minimum amount you are guaranteed to receive. If the price slips any further, your transaction will
                revert.
              </Trans>
            }
          >
            <ThemedText.BodySmallNunito color="textSecondary">
              {trade.tradeType === TradeType.EXACT_INPUT ? <Trans>Minimum output</Trans> : <Trans>Maximum input</Trans>}
            </ThemedText.BodySmallNunito>
          </MouseoverTooltip>
        </RowFixed>
        <TextWithLoadingPlaceholder syncing={syncing} width={70}>
          <ThemedText.BodySmallNunito>
            {trade.tradeType === TradeType.EXACT_INPUT
              ? `${trade.minimumAmountOut(allowedSlippage).toSignificant(6)} ${trade.outputAmount.currency.symbol}`
              : `${trade.maximumAmountIn(allowedSlippage).toSignificant(6)} ${trade.inputAmount.currency.symbol}`}
          </ThemedText.BodySmallNunito>
        </TextWithLoadingPlaceholder>
      </RowBetween>
      <RowBetween>
        <RowFixed>
          <MouseoverTooltip
            text={
              <Trans>
                The amount you expect to receive at the current market price. You may receive less or more if the market
                price changes while your transaction is pending.
              </Trans>
            }
          >
            <ThemedText.BodySmallNunito color="textSecondary">
              <Trans>Expected output</Trans>
            </ThemedText.BodySmallNunito>
          </MouseoverTooltip>
        </RowFixed>
        <TextWithLoadingPlaceholder syncing={syncing} width={65}>
          <ThemedText.BodySmallNunito>
            {`${trade.outputAmount.toSignificant(6)} ${trade.outputAmount.currency.symbol}`}
          </ThemedText.BodySmallNunito>
        </TextWithLoadingPlaceholder>
      </RowBetween>
      <Separator />
      {!isAggregator ? (
        <RowBetween>
          <ThemedText.BodySmall color="textSecondary">
            <Trans>Order routing</Trans>
          </ThemedText.BodySmall>
          <MouseoverTooltip
            size={TooltipSize.Large}
            text={<SwapRoute data-testid="swap-route-info" trade={trade} syncing={syncing} />}
            onOpen={() => {
              sendAnalyticsEvent(SwapEventName.SWAP_AUTOROUTER_VISUALIZATION_EXPANDED, {
                element: InterfaceElementName.AUTOROUTER_VISUALIZATION_ROW,
              })
            }}
          >
            <RouterLabel />
          </MouseoverTooltip>
        </RowBetween>
      ) : (
        <RowFixed
          style={{
            width: '100%',
          }}
          className={style.rowconfig}
        >
          <RowEnd>Run By Aggregator</RowEnd>
        </RowFixed>
      )}
    </Column>
  )
}
