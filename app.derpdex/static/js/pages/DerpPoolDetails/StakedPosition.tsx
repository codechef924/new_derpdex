import { Trans } from '@lingui/macro'
import DerpPotato from 'assets/images/derp-potato.png'
import { GloriaText } from 'components/CustomFonts/GloriaHallelujah'
import { NunitoText } from 'components/CustomFonts/Nunito'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import { RowBetween } from 'components/Row'
import { CHAIN_NAME_TO_CHAIN_ID, validateUrlChainParam } from 'graphql/data/util'
import { useCurrency } from 'hooks/Tokens'
import { Link, useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components/macro'

const StakedContainer = styled.div`
  border-radius: 20px;
  border: 2px solid ${({ theme }) => theme.white};
  background: rgba(31, 31, 31, 0.7);
  box-shadow: 3px 3px 0px 0px ${({ theme }) => theme.white};
  backdrop-filter: blur(6px);
  display: flex;
  padding: 24px 24px 30px 24px;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
`

const StakedTitle = styled(NunitoText)`
  color: ${({ theme }) => theme.derpPurp1};
  margin-bottom: 8px;
`

const StakedLabel = styled(NunitoText)`
  font-size: 14px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.5);
`

const NoPositionContainer = styled.div`
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
  flex-shrink: 0;
  width: 100%;
  padding-top: 53px;
  padding-bottom: 53px;
  text-align: center;
`

const NoPositionImg = styled.img`
  width: 100px;
  height: 100px;
  margin-bottom: 40px;
`

const NoPositionText = styled(NunitoText)`
  color: #afbdc8;
  margin-bottom: 32px;
`

const AddNewPositionText = styled(NunitoText)`
  color: ${({ theme }) => theme.derpPurp1};
  margin-bottom: 14px;
`

const NewPositionBtn = styled.button`
  border-radius: 100px;
  border: 2px solid ${({ theme }) => theme.black};
  background: ${({ theme }) => theme.white};
  box-shadow: 3px 3px 0px 0px ${({ theme }) => theme.black};
  padding: 4px 16px;
  cursor: pointer;
`

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
`

const ButtonText = styled(GloriaText)`
  color: ${({ theme }) => theme.black};
  font-size: 16px;
  font-weight: 400;
`

const PositionItem = styled(RowBetween)`
  width: 100%;
  border-radius: 12px;
  border: 2px solid #fff;
  background: rgba(31, 31, 31, 0.7);
  backdrop-filter: blur(6px);
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  cursor: pointer;
`

const PositionItemLogo = styled.div`
  display: flex;
  gap: 15px;
  justify-content: flex-start;
  align-items: center;
  .pool-info-root {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .symbol-merge {
    display: flex;
    color: white;
    font-size: 16px;
    font-weight: 600;
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

const PositionItemPrice = styled.div`
  display: flex;
  align-items: center;

  @media only screen and (max-width: 768px) {
    display: none;
  }
`

const PositionPrice = styled(NunitoText)`
  color: ${({ theme }) => theme.white};
`

// eslint-disable-next-line react/prop-types
const PositionItemLogoComponent = ({
  token0,
  token1,
  chainId,
}: {
  token0: string
  token1: string
  chainId: number
}) => {
  const currency0 = useCurrency(token0, chainId)
  const currency1 = useCurrency(token1, chainId)

  return <DoubleCurrencyLogo margin={true} currency0={currency0} currency1={currency1} size={30} />
}

interface PoolProps {
  pools: NonNullable<any>
  token0: NonNullable<any>
  token1: NonNullable<any>
  feeTier: NonNullable<any>
}

export const StakedPosition = (props: PoolProps) => {
  const { pools, token0, token1, feeTier } = props
  const filterNetwork = validateUrlChainParam(useParams<{ chainName?: string }>().chainName?.toUpperCase())
  const chainId = CHAIN_NAME_TO_CHAIN_ID[filterNetwork]
  const navigate = useNavigate()

  return (
    <>
      <StakedContainer>
        <RowBetween>
          <StakedTitle size="lg" weight={700}>
            <Trans>Staked Positions</Trans>
          </StakedTitle>

          <StakedLabel>
            <Trans>({pools && Array.isArray(pools) ? pools.length : 0}) positions</Trans>
          </StakedLabel>
        </RowBetween>

        {pools.length === 0 && (
          <NoPositionContainer>
            <NoPositionImg src={DerpPotato} alt="derp-potato" />
            <NoPositionText size="lg" weight={700}>
              <Trans>You do not have any available position</Trans>
            </NoPositionText>
            <AddNewPositionText size="xl" weight={700}>
              <Trans>Add more position through</Trans>
            </AddNewPositionText>

            <ButtonContainer>
              <NewPositionBtn>
                <ButtonText as={Link} to={`/add/${token0}/${token1}/${feeTier}`}>
                  <Trans>Add Liquidity</Trans>
                </ButtonText>
              </NewPositionBtn>

              <NewPositionBtn>
                <ButtonText as={Link} to="/zap-to-earn">
                  <Trans>Zap to Earn</Trans>
                </ButtonText>
              </NewPositionBtn>
            </ButtonContainer>
          </NoPositionContainer>
        )}

        {pools.map((pool: any) => (
          <PositionItem key={pool.positionId} onClick={() => navigate(`/pools/${pool.positionId}`)}>
            <PositionItemLogo>
              <PositionItemLogoComponent token0={pool.token0} token1={pool.token1} chainId={chainId} />
              <div className="pool-info-root">
                <div className="symbol-merge">
                  <NunitoText size="lg" weight={700}>
                    {pool.token0Symbol}/{pool.token1Symbol}-LP #
                  </NunitoText>
                  <div className="fee-tier">
                    <NunitoText size="sm" weight={700}>
                      {pool.feeTier / 10000}
                    </NunitoText>
                  </div>
                </div>
              </div>
            </PositionItemLogo>

            <PositionItemPrice>
              <PositionPrice size="lg" weight={700}>
                ${(pool.amount0USD + pool.amount1USD).toFixed(2) || 0}
              </PositionPrice>
            </PositionItemPrice>
          </PositionItem>
        ))}

        {/* <PositionItem>
          <PositionItemLogo>
            <DoubleCurrencyLogo
              margin={true}
              currency0={useCurrency(pool.token0.address, chainId)}
              currency1={useCurrency(pool.token1.address, chainId)}
              size={30}
            />
            <div className="pool-info-root">
              <div className="symbol-merge">
                <NunitoText size="lg" weight={700}>
                  {pool.token0.symbol}/{pool.token1.symbol}-LP #1
                </NunitoText>
                <div className="fee-tier">
                  <NunitoText size="sm" weight={700}>
                    {pool.feeTier / 10000}
                  </NunitoText>
                </div>
              </div>
            </div>
          </PositionItemLogo>

          <PositionItemPrice>
            <PositionPrice size="lg" weight={700}>
              $500.00
            </PositionPrice>
          </PositionItemPrice>
        </PositionItem> */}
      </StakedContainer>
    </>
  )
}
