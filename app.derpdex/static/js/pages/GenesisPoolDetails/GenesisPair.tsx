import { Trans } from '@lingui/macro'
import { NunitoText } from 'components/CustomFonts/Nunito'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import { CHAIN_NAME_TO_CHAIN_ID, validateUrlChainParam } from 'graphql/data/util'
import { useCurrency } from 'hooks/Tokens'
import { useIsMobile } from 'nft/hooks'
import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components/macro'
import { shortenAddress } from 'utils'

const Container = styled.div`
  display: flex;
  padding: 16px 24px;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  row-gap: 10px;
  flex-shrink: 0;
  flex-wrap: wrap;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  border: 2px solid #000;
  box-shadow: 3px 3px 0px 0px #000;
  backdrop-filter: blur(6px);
  width: 100%;
`

const PoolName = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  .pool-info-root {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .symbol-merge {
    display: flex;
    color: black;
    font-size: 16px;
    font-weight: 600;
    align-items: center;
  }
  .pool-info {
    display: flex;
    gap: 5px;
    align-items: center;
  }
  .bounded-dexname {
    display: flex;
    padding: 3px 10px;
    background: ${({ theme }) => theme.derpGray2};
    color: #000 !important;
    font-size: 14px;
    font-weight: 600;
    border-radius: 8px;
  }
  .fee-tier {
    display: flex;
    justify-content: center;
    padding: 1px 8px;
    background-color: ${({ theme }) => theme.derpPurp2};
    font-size: 14px;
    font-weight: 600;
    color: white !important;
    border-radius: 100px;
    margin-left: 8px;
  }
`

const ApyButton = styled.button`
  padding: 8px 18px;
  border-radius: 8px;
  background: ${({ theme }) => theme.white};
  cursor: pointer;
`

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
`

type BtnOpts = {
  disabled?: boolean
}
const AddMoreBtn = styled.button<BtnOpts>`
  padding: 8px 18px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  background: #fff;
  background: ${({ disabled }) =>
    disabled ? 'grey' : 'linear-gradient(270deg, #46c9d2 0%, #a372ff 100%), linear-gradient(0deg, #ffffff, #ffffff)'};
  color: ${({ disabled }) => (disabled ? '#000' : '#fff')};
  cursor: ${({ disabled }) => (disabled ? 'initial' : 'pointer')};
`

interface PoolProps {
  pool: NonNullable<any>
  onOpen: () => void
}

export const GenesisPair = (props: PoolProps) => {
  const { pool, onOpen } = props
  const filterNetwork = validateUrlChainParam(useParams<{ chainName?: string }>().chainName?.toUpperCase())
  const chainId = CHAIN_NAME_TO_CHAIN_ID[filterNetwork]

  const navigate = useNavigate()
  const isMobile = useIsMobile()

  const disabled = useMemo(() => {
    const timestamp = Date.now() / 1000
    if (timestamp < 1696867200) return false
    else return true
  }, [])

  return (
    <Container>
      <PoolName>
        <DoubleCurrencyLogo
          margin={true}
          currency0={useCurrency(pool.token0.address, chainId)}
          currency1={useCurrency(pool.token1.address, chainId)}
          size={30}
        />
        <div className="pool-info-root">
          <div className="symbol-merge">
            <NunitoText size="lg" weight={700}>
              {pool.token0.symbol}/{pool.token1.symbol}
            </NunitoText>
            <div className="fee-tier">
              <NunitoText size="sm" weight={700}>
                {pool.feeTier / 10000}
              </NunitoText>
            </div>
          </div>
          <div className="pool-info">
            <div className="bounded-dexname">
              <NunitoText size="md" weight={700}>
                {isMobile ? (pool.poolAddress ? shortenAddress(pool.poolAddress) : '') : pool.poolAddress}
              </NunitoText>
            </div>
          </div>
        </div>
      </PoolName>

      <ButtonContainer>
        <AddMoreBtn
          disabled={disabled}
          onClick={() => navigate(`/add/${pool.token0.address}/${pool.token1.address}/${pool.feeTier}`)}
        >
          <NunitoText size="lg" weight={700}>
            <Trans>Add More</Trans>
          </NunitoText>
        </AddMoreBtn>

        <ApyButton onClick={onOpen}>
          <NunitoText size="lg" weight={700}>
            <Trans>APR Calculator</Trans>
          </NunitoText>
        </ApyButton>
      </ButtonContainer>
    </Container>
  )
}
