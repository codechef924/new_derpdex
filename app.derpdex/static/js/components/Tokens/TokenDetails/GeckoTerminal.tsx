import DerpThink from 'assets/images/derp-think.png'
import { GloriaText } from 'components/CustomFonts/GloriaHallelujah'
import { DerpCicularLoading } from 'components/DerpPack/circular-derp-mafia'
import { SupportedChainId } from 'constants/chains'
import { useGetPoolAddress } from 'hooks/useGetPoolAddress'
import { useIsMobile } from 'nft/hooks'
import styled from 'styled-components'

const CGBox = styled.div`
  display: flex;
  flex-direction: column;

  justify-content: center;
  align-items: center;

  width: 100%;
  height: 600px;
  overflow: hidden;
  padding: 16px;

  border-radius: 24px;
  border: 4px solid #000;
  background: #fff;
  box-shadow: 3px 3px 0px 0px #000;
`

const CGFRame = styled.iframe`
  width: 100%;
  height: 100%;
  border-radius: 8px;
`

const NotFoundBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const GeckoTerminalChainName: { [key: number]: string } = {
  [SupportedChainId.ZKSYNC_MAINNET]: 'zksync',
  [SupportedChainId.ZKSYNC_TESTNET]: 'zksync',
  [SupportedChainId.BASE_MAINNET]: 'base',
  [SupportedChainId.BASE_TESTNET]: 'base',
  [SupportedChainId.OPBNB_TESTNET]: 'opbnb',
  [SupportedChainId.OPBNB_MAINNET]: 'opbnb',
}
interface CGTInterface {
  token0?: string
  token1?: string
  pageChainId: number
}
export const GeckoTerminal = ({ token0, token1, pageChainId }: CGTInterface) => {
  const { poolAddress, loading, error } = useGetPoolAddress({ token0, token1, chainId: pageChainId })

  const isMobile = useIsMobile()
  return (
    <CGBox>
      {/* <div>Chart</div> */}
      {loading && !error && <DerpCicularLoading />}
      {!loading && error && (
        <NotFoundBox>
          <img src={DerpThink} alt="DerpDex-Think" />
          <GloriaText size="xxl">Chart unavailable at the moment</GloriaText>
        </NotFoundBox>
      )}

      {poolAddress && !loading && !error && (
        <CGFRame
          src={`https://www.geckoterminal.com/${
            GeckoTerminalChainName[pageChainId]
          }/pools/${poolAddress}?embed=1&info=0&swaps=0&token_address=${!token1 ? token0 : token1}`}
        ></CGFRame>
      )}
    </CGBox>
  )
}
