import { t, Trans } from '@lingui/macro'
import Row from 'components/Row'
import { Settings } from 'react-feather'
import { useUserSlippageTolerance } from 'state/user/hooks'
import { SlippageTolerance } from 'state/user/types'
import styled from 'styled-components/macro'
import { ThemedText } from 'theme'
import validateUserSlippageTolerance, { SlippageValidationResult } from 'utils/validateUserSlippageTolerance'

const Icon = styled(Settings)`
  height: 24px;
  width: 24px;
  > * {
    stroke: ${({ theme }) => theme.derpGray1};
  }
`

const Button = styled.button<{ isActive: boolean }>`
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  cursor: pointer;
  outline: none;

  :not([disabled]):hover {
    opacity: 0.7;
  }

  ${({ isActive }) => isActive && `opacity: 0.7`}
`

const IconContainer = styled(Row)`
  padding: 5px 10px;
  border-radius: 16px;
  gap: 5px;
  justify-content: center;
  align-items: center;
`

const IconContainerWithSlippage = styled(IconContainer)<{ displayWarning?: boolean }>`
  div {
    color: ${({ theme, displayWarning }) => (displayWarning ? theme.accentWarning : theme.textSecondary)};
  }

  background-color: ${({ theme, displayWarning }) =>
    displayWarning ? theme.accentWarningSoft : theme.backgroundModule};
`

const ButtonContent = () => {
  const [userSlippageTolerance] = useUserSlippageTolerance()

  if (userSlippageTolerance === SlippageTolerance.Auto) {
    return (
      <IconContainer>
        <Icon />
      </IconContainer>
    )
  }

  const isInvalidSlippage = validateUserSlippageTolerance(userSlippageTolerance) !== SlippageValidationResult.Valid

  return (
    <IconContainerWithSlippage data-testid="settings-icon-with-slippage" gap="sm" displayWarning={isInvalidSlippage}>
      <ThemedText.Caption>
        <Trans>{userSlippageTolerance.toFixed(2)}% slippage</Trans>
      </ThemedText.Caption>
      <Icon />
    </IconContainerWithSlippage>
  )
}

export default function MenuButton({
  disabled,
  onClick,
  isActive,
}: {
  disabled: boolean
  onClick: () => void
  isActive: boolean
}) {
  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      isActive={isActive}
      id="open-settings-dialog-button"
      data-testid="open-settings-dialog-button"
      aria-label={t`Transaction Settings`}
    >
      <ButtonContent />
    </Button>
  )
}