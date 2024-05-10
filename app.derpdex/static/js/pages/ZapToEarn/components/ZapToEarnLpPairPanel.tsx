import { Trans } from '@lingui/macro'
import { Currency, CurrencyAmount, Percent } from '@uniswap/sdk-core'
import { Pair } from '@uniswap/v2-sdk'
import { useWeb3React } from '@web3-react/core'
import { ReactComponent as DropDownV2 } from 'assets/svg/dropdown-v2.svg'
import { ButtonGray } from 'components/Button'
import { AutoColumn } from 'components/Column'
import { NunitoText } from 'components/CustomFonts/Nunito'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import { loadingOpacityMixin } from 'components/Loader/styled'
import CurrencyLogo from 'components/Logo/CurrencyLogo'
import { RowFixed } from 'components/Row'
import PoolSearchModal from 'components/SearchModal/PoolSearchModal'
import { isSupportedChain } from 'constants/chains'
import { darken } from 'polished'
import { ReactNode, useCallback, useState } from 'react'
import { Lock } from 'react-feather'
import styled, { useTheme } from 'styled-components/macro'
import { flexColumnNoWrap, flexRowNoWrap } from 'theme/styles'
import { formatCurrencyAmount } from 'utils/formatCurrencyAmount'

import { Input as NumericalInput } from '../../../components/NumericalInput'
import { useCurrencyBalance } from '../../../state/connection/hooks'
import { ThemedText } from '../../../theme'
import { ParsedPoolInfoState, RawPoolInfoState } from '../hooks/ZapToEarnPools.jotai'

const InputPanel = styled.div<{ hideInput?: boolean }>`
  ${flexColumnNoWrap};
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '8px')};
  z-index: 1;
  width: ${({ hideInput }) => (hideInput ? '100%' : 'initial')};
  transition: height 1s ease;
  will-change: height;
  // width: 448px;

  flex-shrink: 0;
`

const ColumnFlex = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  .label {
    color: #afbdc8;
    font-weight: 500;
  }

  .styled-input-override {
    display: flex;
    align-items: center;
    gap: 2px;

    font-size: 36px;

    @media only screen and (max-width: 1600px) {
      font-size: 24px;
    }
  }
`

const RowFlexBetween = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;

  justify-content: space-between;
  align-items: center;

  &.padded {
    padding: 0px 10px 0px 10px;
  }

  .balance {
    font-size: 14px;
    color: #afbdc8;
    font-weight: 500;
  }
`

const BalanceStyled = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;

  img {
    width: 14px;
    height: 14px;
  }

  .balance {
    font-size: 14px;
    color: #afbdc8;
    font-weight: 500;
  }
`

const FixedContainer = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
`

const Container = styled.div<{ hideInput: boolean }>`
  border-radius: 16px;
  border: 2px solid #000;
  background: #fff;
  width: ${({ hideInput }) => (hideInput ? '100%' : 'initial')};
  padding: 10px 12px;
  @media only screen and (max-width: 1600px) {
    padding: 4px 10px 4px 12px;
  }
`

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CurrencySelect = styled(ButtonGray)<{
  visible: boolean
  selected: boolean
  hideInput?: boolean
  disabled?: boolean
}>`
  align-items: center;
  background-color: ${({ selected, theme }) => (selected ? theme.backgroundInteractive : theme.accentAction)};
  opacity: ${({ disabled }) => (!disabled ? 1 : 0.4)};
  box-shadow: ${({ selected }) => (selected ? 'none' : '0px 6px 10px rgba(0, 0, 0, 0.075)')};
  color: ${({ selected, theme }) => (selected ? theme.textPrimary : theme.white)};
  cursor: pointer;
  height: unset;
  border-radius: 8px;
  outline: none;
  user-select: none;
  border: none;
  font-size: 24px;
  font-weight: 400;
  width: ${({ hideInput }) => (hideInput ? '100%' : 'initial')};
  padding: ${({ selected }) => (selected ? '4px 8px 4px 4px' : '6px 6px 6px 8px')};
  gap: 8px;
  justify-content: space-between;
  margin-left: ${({ hideInput }) => (hideInput ? '0' : '12px')};

  &:hover,
  &:active {
    background-color: ${({ theme, selected }) => (selected ? theme.backgroundInteractive : theme.accentAction)};
  }

  &:before {
    background-size: 100%;
    border-radius: inherit;

    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;
    content: '';
  }

  &:hover:before {
    background-color: ${({ theme }) => theme.stateOverlayHover};
  }

  &:active:before {
    background-color: ${({ theme }) => theme.stateOverlayPressed};
  }

  visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};
`

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ZapPoolSelect = styled(ButtonGray)<{
  visible: boolean
  selected: boolean
  hideInput?: boolean
  disabled?: boolean
}>`
  border-radius: 100px;
  background: #e8eef2;

  cursor: pointer;

  display: flex;
  width: 111px;
  height: 57px;
  padding: 6px 10px;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;

  @media only screen and (max-width: 1600px) {
    // padding: 2px 6px;
    height: auto;
    min-height: 44px;
    width: 90px;
    img {
      width: 32px;
      height: auto;
    }
    .missing-image-logo {
      --size: 32px;
      width: 32px;
      height: 32px;
      line-height: 32px;
    }
  }

  // margin-right: 6px;

  margin-left: ${({ hideInput }) => (hideInput ? '0' : '12px')};

  &:hover,
  &:active {
    background: ${({ theme, selected }) => (selected ? theme.backgroundInteractive : theme.derpGradientPrimary)};
  }

  &:before {
    background-size: 100%;
    border-radius: inherit;

    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;
    content: '';
  }

  &:hover:before {
    background-color: ${({ theme }) => theme.stateOverlayHover};
  }

  &:active:before {
    background-color: ${({ theme }) => theme.stateOverlayPressed};
  }

  visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};
`

const InputRow = styled.div`
  ${flexRowNoWrap};
  align-items: center;
  justify-content: space-between;
  height: 100%;
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

const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

const StyledDropDown = styled(DropDownV2)<{ selected: boolean }>`
  margin: 0 0.25rem 0 0.35rem;
  height: 20.560000000000002px;
  margin-left: 25px;

  path {
    stroke: ${({ selected, theme }) => (selected ? theme.textPrimary : theme.white)};
    stroke-width: 2px;
  }
`

const StyledTokenName = styled.span<{ active?: boolean }>`
  ${({ active }) => (active ? '  margin: 0 0.25rem 0 0.25rem;' : '  margin: 0 0.25rem 0 0.25rem;')}
  font-size: 20px;
  font-weight: 600;
`

const StyledBalanceMax = styled.button<{ disabled?: boolean }>`
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  opacity: ${({ disabled }) => (!disabled ? 1 : 0.4)};
  // padding: 4px 6px;
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

const StyledNumericalInput = styled(NumericalInput)<{ $loading: boolean }>`
  ${loadingOpacityMixin};
  text-align: left;
  font-size: 36px;
  line-height: 44px;
  font-variant: small-caps;

  height: 100%;
  width: 100%;

  @media only screen and (max-width: 1600px) {
    font-size: 24px;
  }
  opacity: 1 !important;
`

interface ZapToEarnLpPairPanelProps {
  pool?: ParsedPoolInfoState | null
  value: string
  onUserInput: (value: string) => void
  onMax?: () => void
  showMaxButton: boolean
  label?: ReactNode
  onPoolSelect?: (pool: RawPoolInfoState) => void
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
  lpAddress?: string
}

export default function ZapToEarnLpPairPanel({
  pool,
  lpAddress,
  value,
  label,
  onUserInput,
  onMax,
  showMaxButton,
  onPoolSelect,
  currency,
  otherCurrency,
  id,
  showCommonBases,
  showCurrencyAmount,
  disableNonToken,
  renderBalance,
  fiatValue,
  priceImpact,
  hideBalance = false,
  pair = null, // used for double token logo
  hideInput = false,
  locked = false,
  loading = false,
  disabled = false,
  ...rest
}: ZapToEarnLpPairPanelProps) {
  const [modalOpen, setModalOpen] = useState(false)

  const { account, chainId } = useWeb3React()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const theme = useTheme()

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  const chainAllowed = isSupportedChain(chainId)

  return (
    <InputPanel id={id} hideInput={hideInput} {...rest}>
      {locked && (
        <FixedContainer>
          <AutoColumn gap="sm" justify="center">
            <Lock />
            <ThemedText.DeprecatedLabel fontSize="12px" textAlign="center" padding="0 12px">
              <Trans>The market price is outside your specified price range. Single-asset deposit only.</Trans>
            </ThemedText.DeprecatedLabel>
          </AutoColumn>
        </FixedContainer>
      )}
      {showMaxButton && selectedCurrencyBalance ? (
        <RowFlexBetween className="padded">
          <BalanceStyled>
            <CurrencyLogo currency={currency} />
            <NunitoText className="balance">
              {!hideBalance && currency && selectedCurrencyBalance ? (
                renderBalance ? (
                  renderBalance(selectedCurrencyBalance)
                ) : (
                  <Trans>Balance: {formatCurrencyAmount(selectedCurrencyBalance, 4)}</Trans>
                )
              ) : null}
            </NunitoText>
          </BalanceStyled>
          <StyledBalanceMax onClick={onMax}>
            <Trans>Max</Trans>
          </StyledBalanceMax>
        </RowFlexBetween>
      ) : // </TraceEvent>
      null}
      <Container id="zap-input" hideInput={hideInput}>
        <InputRow style={hideInput ? { paddingLeft: '0', borderRadius: '8px' } : {}}>
          <ColumnFlex id="input-flex">
            {label && <NunitoText className="label">{label}</NunitoText>}
            {!hideInput && (
              <NunitoText className="styled-input-override">
                $
                <StyledNumericalInput
                  className="token-amount-input"
                  value={value}
                  onUserInput={onUserInput}
                  disabled={true}
                  $loading={true}
                />
              </NunitoText>
            )}
          </ColumnFlex>

          <ZapPoolSelect
            disabled={!chainAllowed || disabled}
            visible={pool !== undefined}
            selected={!!currency}
            hideInput={hideInput}
            className="open-currency-select-button"
            onClick={() => {
              setModalOpen(true)
            }}
          >
            <Aligner>
              <RowFixed>
                <DoubleCurrencyLogo margin={true} currency0={pool?.token1} currency1={pool?.token0} size={32} />
              </RowFixed>
              <StyledDropDown selected={true} />
            </Aligner>
          </ZapPoolSelect>
        </InputRow>
        {/* {Boolean(!hideInput && !hideBalance) && (
          <FiatRow>
            <RowBetween>
              <LoadingOpacityContainer $loading={loading}>
                {fiatValue && <FiatValue fiatValue={fiatValue} priceImpact={priceImpact} />}
              </LoadingOpacityContainer>
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
        )} */}
      </Container>
      <PoolSearchModal
        isOpen={modalOpen}
        onDismiss={handleDismissSearch}
        selectedCurrency={currency}
        otherSelectedCurrency={otherCurrency}
        showCommonBases={showCommonBases}
        showCurrencyAmount={showCurrencyAmount}
        disableNonToken={disableNonToken}
      />
    </InputPanel>
  )
}
