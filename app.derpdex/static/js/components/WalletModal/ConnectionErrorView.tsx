import { Trans } from '@lingui/macro'
import { ButtonEmpty, DDBaseButtonLight } from 'components/Button'
import { GloriaText } from 'components/CustomFonts/GloriaHallelujah'
import { AlertTriangle } from 'react-feather'
import styled from 'styled-components/macro'
import { ThemedText } from 'theme'
import { flexColumnNoWrap } from 'theme/styles'

const Wrapper = styled.div`
  ${flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  width: 100%;
`

const AlertTriangleIcon = styled(AlertTriangle)`
  width: 90px;
  height: 90px;
  stroke-width: 1;
  margin: 36px;
  color: ${({ theme }) => theme.accentCritical};
`

const Text = styled.div`
  color: #000;
  margin-bottom: 20px;
`

export default function ConnectionErrorView({
  retryActivation,
  openOptions,
}: {
  retryActivation: () => void
  openOptions: () => void
}) {
  return (
    <Wrapper>
      <AlertTriangleIcon />
      <ThemedText.HeadlineSmall marginBottom="8px">
        <Trans>Error connecting</Trans>
      </ThemedText.HeadlineSmall>
      <ThemedText.BodyPrimary fontSize={16} marginBottom={24} lineHeight="24px" textAlign="center">
        <Trans>
          The connection attempt failed. Please click try again and follow the steps to connect in your wallet.
        </Trans>
      </ThemedText.BodyPrimary>
      <DDBaseButtonLight $borderRadius="16px" onClick={retryActivation}>
        <GloriaText>
          <Trans>Try Again</Trans>
        </GloriaText>
      </DDBaseButtonLight>
      <ButtonEmpty width="fit-content" padding="0" marginTop={20}>
        <Text onClick={openOptions}>
          <Trans>Back to wallet selection</Trans>
        </Text>
      </ButtonEmpty>
    </Wrapper>
  )
}
