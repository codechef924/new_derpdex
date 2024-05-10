/* eslint-disable import/no-unused-modules */
/* eslint-disable @typescript-eslint/no-unused-vars */
import CurrencyLogo from 'components/Logo/CurrencyLogo'
import { SupportedChainId } from 'constants/chains'
import { useCurrency } from 'hooks/Tokens'
import { useMemo } from 'react'
import styled from 'styled-components'

import { ExtractedEvents } from '../hooks/useGetLaunchpadCampaigns'
import { ColFlex, RowFlex, Text } from '../stylings'

const SalesWrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 2fr 0.5fr;
  min-width: 912px;
  padding: 16px 24px;
  justify-content: space-between;
  align-items: center;
  border-radius: 12px;
  border: 2px solid #000;

  @media only screen and (max-width: 768px) {
    min-width: unset;
  }

  // backdrop-filter: blur(2px);
  background: #fff;

  .datetime,
  .button {
    justify-self: end;
  }

  .datetime {
    grid-column: 3;
  }
`

export const SalesRowV2 = ({ mappedEvent }: { mappedEvent: ExtractedEvents }) => {
  const findChainId: SupportedChainId = useMemo(() => {
    return mappedEvent.chainId
  }, [mappedEvent])
  const currencyDisplay = useCurrency(mappedEvent.tokenAddress, findChainId)

  return (
    <SalesWrapper>
      <RowFlex gap={16}>
        <CurrencyLogo
          style={{ border: '2px solid #000', borderRadius: '50%', maxHeight: '52px' }}
          size="48px"
          currency={currencyDisplay}
          isDerp={true}
        />
        <ColFlex>
          <Text size="xl" weight={700}>
            {currencyDisplay?.name?.toUpperCase()}
          </Text>
          <Text size="lg" weight={400} color="#889199">
            {mappedEvent.phaseType}
          </Text>
        </ColFlex>
      </RowFlex>
      {/* <StyledButton disabled={!withdrawInfoState.canWithdraw} className="button" onClick={() => onWithdrawClaim()}>
        <GloriaText size="xl">Withdraw</GloriaText>
      </StyledButton> */}
      <Text className="datetime" size="md2" weight={500}>
        {mappedEvent.startTime}
      </Text>
    </SalesWrapper>
  )
}
