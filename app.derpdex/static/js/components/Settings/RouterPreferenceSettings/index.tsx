import '@fontsource/poppins' // Defaults to weight 400

import { Trans } from '@lingui/macro'
import Column from 'components/Column'
import { NunitoText } from 'components/CustomFonts/Nunito'
import Radio from 'components/Radio'
import { RowBetween, RowFixed } from 'components/Row'
import Toggle from 'components/Toggle'
import { RouterPreference } from 'state/routing/slice'
import { useRouterPreference } from 'state/user/hooks'
import styled from 'styled-components/macro'
import { ThemedText } from 'theme'
const Preference = styled(Radio)`
  background: ${({ theme }) => theme.derpGray2};
  padding: 12px 16px;
`

const PreferencesContainer = styled(Column)`
  gap: 1.5px;
  border-radius: 12px;
  overflow: hidden;
`

const PoppinsText = styled.span`
  font-family: 'Poppins';
  color: #000;
  font-weight: 700;
  font-size: 12px;
`

export default function RouterPreferenceSettings() {
  const [routerPreference, setRouterPreference] = useRouterPreference()

  const isAutoRoutingActive = routerPreference === RouterPreference.AUTO

  return (
    <Column gap="md">
      <RowBetween gap="sm">
        <RowFixed>
          <Column gap="xs">
            <NunitoText size="xl" weight={700}>
              <Trans>Auto Router API</Trans>
            </NunitoText>
            <PoppinsText>
              <Trans>Use the DerpDeX API to get faster quotes.</Trans>
            </PoppinsText>
          </Column>
        </RowFixed>
        <Toggle
          id="toggle-optimized-router-button"
          isActive={isAutoRoutingActive}
          toggle={() => setRouterPreference(isAutoRoutingActive ? RouterPreference.API : RouterPreference.AUTO)}
        />
      </RowBetween>
      {!isAutoRoutingActive && (
        <PreferencesContainer>
          <Preference
            isActive={routerPreference === RouterPreference.API}
            toggle={() => setRouterPreference(RouterPreference.API)}
          >
            <Column gap="xs">
              <ThemedText.BodyPrimary>
                <Trans>DerpDEX API</Trans>
              </ThemedText.BodyPrimary>
              <ThemedText.Caption color="textSecondary">
                <Trans>Finds the best route on the DerpDEX API Protocol</Trans>
              </ThemedText.Caption>
            </Column>
          </Preference>
          <Preference
            isActive={routerPreference === RouterPreference.CLIENT}
            toggle={() => setRouterPreference(RouterPreference.CLIENT)}
          >
            <Column gap="xs">
              <ThemedText.BodyPrimary>
                <Trans>DerpDEX client</Trans>
              </ThemedText.BodyPrimary>
              <ThemedText.Caption color="textSecondary">
                <Trans>
                  Finds the best route on the DerpDEX Protocol through your browser. May result in high latency and
                  prices.
                </Trans>
              </ThemedText.Caption>
            </Column>
          </Preference>
        </PreferencesContainer>
      )}
    </Column>
  )
}
