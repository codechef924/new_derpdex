import { Trans } from '@lingui/macro'
import { TraceEvent } from '@uniswap/analytics'
import { BrowserEvent, InterfaceElementName, SwapEventName } from '@uniswap/analytics-events'
import { Currency, CurrencyAmount, Percent } from '@uniswap/sdk-core'
import { Pair } from '@uniswap/v2-sdk'
import { useWeb3React } from '@web3-react/core'
import { GloriaText } from 'components/CustomFonts/GloriaHallelujah'
import { NunitoText } from 'components/CustomFonts/Nunito'
import { isSupportedChain } from 'constants/chains'
import { useFiatOnRampButtonEnabled } from 'featureFlags/flags/fiatOnRampButton'
import useCurrencyBalance from 'lib/hooks/useCurrencyBalance'
import { darken } from 'polished'
import { ReactNode } from 'react'
import styled, { useTheme } from 'styled-components/macro'
import { ThemedText } from 'theme'
import { flexRowNoWrap } from 'theme/styles'
import { formatCurrencyAmount } from 'utils/formatCurrencyAmount'

import { RowBetween, RowFixed } from '../Row'
import SwapBuyFiatButton from './SwapBuyFiatButton'

const StyledSwapHeader = styled(RowBetween)`
  // margin-bottom: 10px;
  color: ${({ theme }) => theme.textSecondary};
`

const HeaderButtonContainer = styled(RowFixed)`
  // padding: 0 12px;
  gap: 16px;
  font-size: 24px;
  @media only screen and (min-width: 768px) and (max-width: 1600px) {
    font-size: 20px;
    color: #000;
  }

  @media only screen and (max-width: 768px) {
    font-size: 20px;
  }
`

const StyledBalanceMax = styled.button<{ disabled?: boolean }>`
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  opacity: ${({ disabled }) => (!disabled ? 1 : 0.4)};
  padding: 4px 6px;
  pointer-events: ${({ disabled }) => (!disabled ? 'initial' : 'none')};

  font-size: 16px;
  font-weight: 600;
  background: ${({ theme }) => theme.derpGradientPrimary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-fill-color: transparent;

  :hover {
    opacity: ${({ disabled }) => (!disabled ? 0.8 : 0.4)};
  }

  :focus {
    outline: none;
  }
`

const LabelRow = styled.div`
  ${flexRowNoWrap};
  align-items: center;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.75rem;
  line-height: 1rem;

  span:hover {
    cursor: pointer;
    color: ${({ theme }) => darken(0.2, theme.textSecondary)};
  }
`

const FiatRow = styled(LabelRow)`
  justify-content: flex-end;
  min-height: 20px;
  padding: 8px 0px 0px 0px;
`

interface SwapHeaderProps {
  value: string
  onUserInput: (value: string) => void
  onMax?: () => void
  showMaxButton: boolean
  label?: ReactNode
  onCurrencySelect?: (currency: Currency) => void
  currency?: Currency | null
  hideBalance?: boolean
  pair?: Pair | null
  hideInput?: boolean
  otherCurrency?: Currency | null
  fiatValue?: { data?: number; isLoading: boolean }
  priceImpact?: Percent
  id: string
  showCommonBases?: boolean
  showCurrencyAmount?: boolean
  disableNonToken?: boolean
  renderBalance?: (amount: CurrencyAmount<Currency>) => ReactNode
  locked?: boolean
  loading?: boolean
  disabled?: boolean
}

export default function SwapHeader({
  autoSlippage,
  value,
  onUserInput,
  onMax,
  showMaxButton,
  onCurrencySelect,
  currency,
  otherCurrency,
  id,
  showCommonBases,
  showCurrencyAmount,
  disableNonToken,
  renderBalance,
  fiatValue,
  priceImpact,
  pair = null, // used for double token logo
  hideInput = false,
  hideBalance = false,
  locked = false,
  loading = false,
  disabled = false,
  fromTokenDetails = false,
}: { autoSlippage: Percent } & SwapHeaderProps & { fromTokenDetails?: boolean }) {
  const fiatOnRampButtonEnabled = useFiatOnRampButtonEnabled()
  const { account, chainId } = useWeb3React()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const theme = useTheme()

  const chainAllowed = isSupportedChain(chainId)

  return (
    <StyledSwapHeader>
      <HeaderButtonContainer>
        {!fromTokenDetails ? (
          <Trans>
            <GloriaText id="send-text">Send</GloriaText>
          </Trans>
        ) : (
          <ThemedText.SubHeader>
            <Trans>
              <NunitoText id="send-text" size="xl" weight={700}>
                Swap
              </NunitoText>
            </Trans>
          </ThemedText.SubHeader>
        )}

        {fiatOnRampButtonEnabled && <SwapBuyFiatButton />}
      </HeaderButtonContainer>
      <RowFixed>
        {Boolean(!hideInput && !hideBalance) && (
          <FiatRow>
            <RowBetween>
              {/* <LoadingOpacityContainer $loading={loading}>
                {fiatValue && <FiatValue fiatValue={fiatValue} priceImpact={priceImpact} />}
              </LoadingOpacityContainer> */}
              {account ? (
                <RowFixed style={{ height: '17px' }}>
                  <ThemedText.DeprecatedBody
                    data-testid="balance-text"
                    color={theme.textSecondary}
                    fontWeight={400}
                    fontSize={14}
                    style={{ display: 'inline' }}
                  >
                    {!hideBalance && currency && selectedCurrencyBalance ? (
                      renderBalance ? (
                        renderBalance(selectedCurrencyBalance)
                      ) : (
                        <Trans>Balance: {formatCurrencyAmount(selectedCurrencyBalance, 4)}</Trans>
                      )
                    ) : null}
                  </ThemedText.DeprecatedBody>
                  {showMaxButton && selectedCurrencyBalance ? (
                    <TraceEvent
                      events={[BrowserEvent.onClick]}
                      name={SwapEventName.SWAP_MAX_TOKEN_AMOUNT_SELECTED}
                      element={InterfaceElementName.MAX_TOKEN_AMOUNT_BUTTON}
                    >
                      <StyledBalanceMax onClick={onMax}>
                        <Trans>Max</Trans>
                      </StyledBalanceMax>
                    </TraceEvent>
                  ) : null}
                </RowFixed>
              ) : (
                <span />
              )}
            </RowBetween>
          </FiatRow>
        )}
      </RowFixed>
      {/* <RowFixed>
        <SettingsTab autoSlippage={autoSlippage} />
      </RowFixed> */}
    </StyledSwapHeader>
  )
}
