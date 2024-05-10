import { Percent } from '@uniswap/sdk-core'
import { useWeb3React } from '@web3-react/core'
import MaxSlippageSettings from 'components/Settings/MaxSlippageSettings'
import RouterPreferenceMinimal from 'components/Settings/RouterPreferenceMinimal'
import TransactionDeadlineSettings from 'components/Settings/TransactionDeadlineSettings'
import { L2_CHAIN_IDS } from 'constants/chains'
import styled from 'styled-components'
import { Divider } from 'theme'

import * as styles from '../index.css'

const RouterSettngs = styled.div`
  margin-top: 24px;

  z-index: 999;
  border-radius: 24px;
  border: 4px solid #000;
  background: #fff;
  box-shadow: 3px 3px 0px 0px #000;
  padding: 25px 36px;

  width: 100%;

  @media only screen and (max-width: 1600px) {
    padding: 16px 20px;
  }

  #div-col {
    margin-top: 1.2em;
    margin-bottom: 0.8em;
    background: black !important;
    height: 2px;
  }
`
const Box = styled.div`
  width: ;
`
const RowFlex = styled.div`
  display: flex;
  flex-direction: row;
`
const ColFlex = styled.div`
  display: flex;
  flex-direction: column;

  .header {
    font-weight: 800;
    font-size: 18px;
  }
  .details {
    font-weight: 500;
    font-size: 16px;
  }
`
const Hanger = styled.div``

export const AutoRouter = ({ autoSlippage }: { autoSlippage: Percent }) => {
  const { chainId } = useWeb3React()
  const showDeadlineSettings = Boolean(chainId && !L2_CHAIN_IDS.includes(chainId))
  return (
    <RouterSettngs className={styles.OverrideRouterWrapper}>
      {/* <ColFlex>
          <div className="header">Auto Router API</div>
          <NunitoText className="details">Use DerpDeX API to get faster quotes.</NunitoText>
        </ColFlex> */}
      <RouterPreferenceMinimal />
      <Divider id="div-col" />
      <MaxSlippageSettings autoSlippage={autoSlippage} />
      {showDeadlineSettings && (
        <>
          <Divider />
          <TransactionDeadlineSettings />
        </>
      )}
    </RouterSettngs>
  )
}
