import '@fontsource/gloria-hallelujah' // Defaults to weight 400

import { ReactComponent as ArrowDownIcon } from 'assets/svg/arrow-down-minimal.svg'
import { DerpFilterOption } from 'pages/Cultivate/components/FilterOption'
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import { EllipsisStyle } from 'theme'

import { BRIDGE_INFO_SUPPORTED_TOKEN } from '../_supported_token_bridge'
import { BridgeSelectColumn, ColFlex, TokenToBridge } from '../stylings'
import BridgeCurrencyLogo from '../utils/BridgeCurrencyLogo'
import { DEPOSIT, WITHDRAW } from './BridgeComponent'

const ModalBgWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99999999;
  display: flex;
  justify-content: center;
  align-items: center;

  @media only screen and (max-width: 768px) {
    padding-top: 40px;
  }
`

const ModalPopup = styled.div`
  border-radius: 16px;
  border: 2px solid #000;
  background: #fff;
  box-shadow: 3px 3px 0px 0px #000;
  padding: 20px;
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  .token-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    padding: 6px 8px;
    cursor: pointer;

    &:hover {
      border-radius: 8px;
      background: ${({ theme }) => theme.derpGradientPrimary};
      color: white;
    }
  }

  .tokenActive {
    border-radius: 8px;
    background: ${({ theme }) => theme.derpGradientPrimary};
    color: white;
    font-weight: 600;
  }
`

const InputCustomFilter = styled.input`
  background: ${({ theme }) => theme.derpGray2};
  border-radius: 8px;
  border: 2px solid #000;
  // background: #FFF;
  box-shadow: 3px 3px 0px 0px #000;
  outline: none;
  text-align: left;
  width: 100%;
  padding-left: 10px;
  font-size: 16px;
  font-weight: 400;
  height: 40px;
  color: ${({ theme }) => theme.black};
  -moz-appearance: textfield; /* Firefox */
  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  ::placeholder {
    font-size: 16px;
    font-weight: 400;
    font-family: "Gloria Hallelujah",
    color: ${({ theme }) => theme.derpGray1};
  }
  // border: 1px solid ${({ theme }) => theme.derpGray2};
  // border-radius: 8px;
`

const ModalBodySelections = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  // justify-content: center;

  overflow-y: scroll;
  max-height: 350px;
  @media only screen and (max-width: 768px) {
    max-height: 200px;
  }

  /* Style the scrollbar */
  scrollbar-width: thin;
  scrollbar-color: #888888 #f0f0f0; /* thumb color, track color */

  /* For Firefox */
  scrollbar-width: thin;
  scrollbar-color: #888888 #f0f0f0;

  /* Hide the default scrollbar for WebKit browsers */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 8px;
    background-color: #888888;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #666666;
  }

  &::-webkit-scrollbar-track {
    background-color: #f0f0f0;
  }
`

const ModalContent = ({
  tokenList,
  currentToken,
  setCurrentToken,
  setShowList,
}: {
  tokenList?: BRIDGE_INFO_SUPPORTED_TOKEN[]
  currentToken?: BRIDGE_INFO_SUPPORTED_TOKEN | null | undefined
  setCurrentToken?: (token: BRIDGE_INFO_SUPPORTED_TOKEN) => void
  setShowList?: (showList: boolean) => void
}) => {
  const [filterValue, setFilterValue] = useState('')
  const modalRef = useRef<HTMLDivElement>(null)
  const filterInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        if (!setShowList) return
        setShowList(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [setShowList])

  useEffect(() => {
    if (filterInputRef.current) {
      filterInputRef.current.focus()
    }
  }, [filterValue])

  const Filterable = () => {
    return (
      <InputCustomFilter
        type="text"
        placeholder="Filter tokens"
        value={filterValue}
        onChange={(e) => setFilterValue(e.target.value)}
        ref={filterInputRef}
      />
    )
  }

  const filteredTokens = tokenList?.filter((token) => token.symbol.toLowerCase().includes(filterValue.toLowerCase()))

  return (
    <ModalBgWrapper>
      <ModalPopup id="modal-popup" ref={modalRef}>
        <Filterable />
        <ModalBodySelections>
          {filteredTokens &&
            filteredTokens.map((token, index) => (
              <div
                className={`token-item ${currentToken === token && 'tokenActive'}`}
                key={index}
                onClick={() => {
                  setCurrentToken && setCurrentToken(token)
                  setShowList && setShowList(false)
                }}
              >
                <BridgeCurrencyLogo style={{ marginRight: '2px' }} currency={token} isL1={true} size="24px" />
                {token.symbol}
              </div>
            ))}
        </ModalBodySelections>
      </ModalPopup>
    </ModalBgWrapper>
  )
}

const ModalNetworkContent = ({
  tokenList,
  currentToken,
  setCurrentToken,
  setShowList,
}: {
  tokenList?: BRIDGE_INFO_SUPPORTED_TOKEN[]
  currentToken?: BRIDGE_INFO_SUPPORTED_TOKEN | null | undefined
  setCurrentToken?: (token: BRIDGE_INFO_SUPPORTED_TOKEN) => void
  setShowList?: (showList: boolean) => void
}) => {
  const [filterValue, setFilterValue] = useState('')
  const modalRef = useRef<HTMLDivElement>(null)
  const filterInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        if (!setShowList) return
        setShowList(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [setShowList])

  useEffect(() => {
    if (filterInputRef.current) {
      filterInputRef.current.focus()
    }
  }, [filterValue])

  const Filterable = () => {
    return (
      <InputCustomFilter
        type="text"
        placeholder="Filter tokens"
        value={filterValue}
        onChange={(e) => setFilterValue(e.target.value)}
        ref={filterInputRef}
      />
    )
  }

  const filteredTokens = tokenList?.filter((token) => token.symbol.toLowerCase().includes(filterValue.toLowerCase()))

  return (
    <ModalBgWrapper>
      <ModalPopup id="modal-popup" ref={modalRef}>
        <ModalBodySelections>
          {filteredTokens &&
            filteredTokens.map((token, index) => (
              <div
                className={`token-item ${currentToken === token && 'tokenActive'}`}
                key={index}
                onClick={() => {
                  setCurrentToken && setCurrentToken(token)
                  setShowList && setShowList(false)
                }}
              >
                <BridgeCurrencyLogo style={{ marginRight: '2px' }} currency={token} isL1={true} size="24px" />
                {token.symbol}
              </div>
            ))}
        </ModalBodySelections>
      </ModalPopup>
    </ModalBgWrapper>
  )
}

const MenuTimeFlyout = styled.span`
  min-width: 240px;
  max-height: 350px;
  overflow: auto;
  border-radius: 8px;
  border: 2px solid #000;
  background: #fff;
  padding: 8px;
  display: flex;
  flex-direction: column;
  font-size: 16px;
  position: absolute;
  top: 0px;
  z-index: 100;
  left: 10px;
`
const InternalMenuItem = styled.div`
  flex: 1;
  padding: 12px 8px;
  color: ${({ theme }) => theme.textPrimary};

  :hover {
    cursor: pointer;
    text-decoration: none;
  }
`

const InternalLinkMenuItem = styled(InternalMenuItem)<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-decoration: none;
  cursor: pointer;
  border-radius: 8px;

  :hover {
    background-color: ${({ theme }) => theme.hoverState};
    text-decoration: none;
  }

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 60%;
      pointer-events: none;
    `}
`
const NetworkLabel = styled.div`
  ${EllipsisStyle}
  display: flex;
  gap: 8px;
  align-items: center;

  font-size: 16px;
  font-weight: 700;
  color: #000;
`
const Logo = styled.img`
  height: 20px;
  width: 20px;
`
const CheckContainer = styled.div`
  display: flex;
  flex-direction: flex-end;
`

const DerpNetworkFilterOption = styled(DerpFilterOption)`
  width: 100%;
  border-radius: 8px;
  border: 2px solid #000;
  background: #fff;
  box-shadow: -4px 4px 0px 0px #ddd3d3;
`

const ModalNetworkSelector = ({
  networkList,
  currentNetwork,
  setCurrentNetwork,
  setShowList,
}: {
  networkList?: Array<ChainInfo>
  currentNetwork?: ChainInfo | null | undefined
  setCurrentNetwork?: (network: ChainInfo) => void
  setShowList?: (showList: boolean) => void
}) => {
  const [filterValue, setFilterValue] = useState('')
  const modalRef = useRef<HTMLDivElement>(null)
  const filterInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        if (!setShowList) return
        setShowList(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [setShowList])

  useEffect(() => {
    if (filterInputRef.current) {
      filterInputRef.current.focus()
    }
  }, [filterValue])

  const Filterable = () => {
    return (
      <InputCustomFilter
        type="text"
        placeholder="Filter tokens"
        value={filterValue}
        onChange={(e) => setFilterValue(e.target.value)}
        ref={filterInputRef}
      />
    )
  }

  console.log('networkList', networkList)

  // const filteredTokens = tokenList?.filter((token) => token.symbol.toLowerCase().includes(filterValue.toLowerCase()))

  return (
    <DerpStyledMenu ref={modalRef}>
      <MenuTimeFlyout>
        {networkList &&
          networkList.map((network, index) => {
            return (
              <InternalLinkMenuItem
                key={network.chainId}
                data-testid={`genesis-pool-network-filter-option-${network.chainName.toLowerCase()}`}
                onClick={() => {
                  setCurrentNetwork && setCurrentNetwork({ ...network })
                  setShowList && setShowList(false)
                }}
              >
                <NetworkLabel>
                  <Logo src={network.logoUrl} />
                  {network.chainName}
                </NetworkLabel>
              </InternalLinkMenuItem>
            )
          })}
      </MenuTimeFlyout>
    </DerpStyledMenu>
  )
  // return (
  //   <ModalBgWrapper>
  //     <ModalPopup id="modal-popup" ref={modalRef}>
  //       <ModalBodySelections>
  //         {networkList &&
  //           networkList.map((network, index) => (
  //             <div
  //               className={`token-item ${network.label === currentNetwork?.label && 'tokenActive'}`}
  //               key={index}
  //               onClick={() => {
  //                 setCurrentNetwork && setCurrentNetwork(network)
  //                 setShowList && setShowList(false)
  //               }}
  //             >
  //               <img src={network.logoUrl} /> <span>{network.label}</span>
  //               {/*                 <BridgeCurrencyLogo style={{ marginRight: '2px' }} currency={token} isL1={true} size="24px" />
  //               {token.symbol} */}
  //             </div>
  //           ))}
  //       </ModalBodySelections>
  //     </ModalPopup>
  //   </ModalBgWrapper>
  // )
}

const InputTokenWrapper = styled.div<{
  isInput: boolean
}>`
  display: flex;
  flex-direction: ${({ isInput }) => (isInput ? 'row' : 'row')};
  justify-content: ${({ isInput }) => (!isInput ? 'space-between' : 'none')};
  align-items: ${({ isInput }) => (!isInput ? 'center' : 'none')};
  width: 100%;
  border-radius: 16px;
  border: 2px solid #000;
  background: #fff;
  padding: 6px 6px 6px 10px;
  min-height: 82px;

  .chain-wrapper-input {
    border: 2px solid #b9b9b9;
    padding: 4px 6px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
    width: 100%;
    img {
      max-width: 23px;
    }
    span {
      font-size: 16px;
      color: ${({ theme }) => theme.derpGray1};
      white-space: nowrap;
    }
    cursor: pointer;
  }

  .chain-wrapper {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
    width: 100%;
    img {
      max-width: 23px;
    }
    span {
      font-size: 16px;
      color: ${({ theme }) => theme.derpGray1};
      white-space: nowrap;
    }
  }
  .token-style {
    font-size: 16px;
    font-weight: 400;
  }
`

const InputCustom = styled.input`
  background: transparent;
  border: none;
  outline: none;
  text-align: left;
  width: 100%;
  font-size: 24px;
  font-weight: 400;
  color: ${({ theme }) => theme.black};
  -moz-appearance: textfield; /* Firefox */
  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  ::placeholder {
    font-size: 24px;
    font-weight: 400;
    color: ${({ theme }) => theme.derpGray1};
  }
`

const BalancePlaceholder = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.derpGray1};
`

const MaxButton = styled.div`
  font-size: 16px;
  font-weight: 600;
  background: ${({ theme }) => theme.derpGradientPrimary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-fill-color: transparent;
  cursor: pointer;
`

const SelectOption = styled.div`
  position: absolute;
  display: flex;
  gap: 4px;
  background: white;
  flex-direction: column;
  top: 100%;
  left: 0;
  border-radius: 8px;
  border: 2px solid rgb(236 234 234);
  overflow: hidden;
  width: 100%;

  .token-item {
    display: flex;
    flex-direction: row;

    gap: 10px;
    padding: 6px 8px;
    cursor: pointer;

    &:hover {
      background: ${({ theme }) => theme.derpGradientPrimary};
    }
  }

  .tokenActive {
    background: ${({ theme }) => theme.derpGradientPrimary};
    color: white;
    font-weight: 600;
  }
`
const DerpStyledMenu = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
  width: 210px;
  @media only screen and (max-width: 720px) {
    width: 100%;
  }
`
type ChainInfo = {
  chainId: number
  chainName: string
  logoUrl: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
}

export const InputToken = ({
  isInput = true,
  tokenData,
  currentToken,
  setCurrentToken,
  inputAmount = undefined,
  tokenList,
  setInputAmount,
  onMaxedAmount,

  networkList,
  setTargetChain,
  currentChain,
}: {
  isInput: boolean
  tokenData?: DEPOSIT | WITHDRAW
  currentToken?: BRIDGE_INFO_SUPPORTED_TOKEN | null
  setCurrentToken?: (token: BRIDGE_INFO_SUPPORTED_TOKEN) => void
  inputAmount?: number | undefined
  tokenList?: BRIDGE_INFO_SUPPORTED_TOKEN[]
  setInputAmount?: Dispatch<SetStateAction<number | undefined>>
  onMaxedAmount?: () => void

  networkList?: Array<ChainInfo>
  setTargetChain?: (network: ChainInfo) => void
  currentChain?: ChainInfo | null
}) => {
  const handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
    const newInputAmount = event.currentTarget.value
    setInputAmount?.(newInputAmount === '' ? undefined : Number(newInputAmount))
  }

  const [showNetworkList, setShowNetworkList] = useState<boolean>(false)
  const [showList, setShowList] = useState<boolean>(false)
  // const [networkList, setNetworkList] = useState<L1ChainInfo[] | L2ChainInfo[]>(false)

  return (
    <InputTokenWrapper isInput={isInput}>
      {isInput && (
        <ColFlex className="first-col-network-and-input">
          <div className="chain-wrapper">
            <img src={tokenData?.details?.logoUrl} />
            <span>{tokenData?.details?.label}</span>
          </div>

          {/* <div className="chain-wrapper-input">
            <img src={tokenData.details?.logoUrl} />
            <span>{tokenData.details?.label}</span>
            <ArrowDownIcon width={12} />
          </div> */}

          <div>
            <InputCustom type="number" onInput={handleInputChange} value={inputAmount} placeholder="0.00" autoFocus />
          </div>
        </ColFlex>
      )}
      {!isInput && (
        <ColFlex>
          {!isInput && (
            <div className="chain-wrapper">
              <img src={currentChain?.logoUrl} />
              <span>{currentChain?.chainName}</span>
            </div>
          )}
        </ColFlex>
      )}
      {!isInput && (
        <BridgeSelectColumn>
          <TokenToBridge onClick={() => setShowNetworkList(!showNetworkList)}>
            <ArrowDownIcon width={12} />
          </TokenToBridge>

          {showNetworkList && (
            <ModalNetworkSelector
              setShowList={setShowNetworkList}
              networkList={networkList}
              setCurrentNetwork={setTargetChain}
              // currentToken={}
              // setCurrentNetwork={}
            />
          )}
        </BridgeSelectColumn>
      )}
      {isInput && (
        <BridgeSelectColumn>
          <TokenToBridge onClick={() => setShowList(!showList)}>
            <BridgeCurrencyLogo isL1={true} style={{ marginRight: '2px' }} currency={currentToken} size="48px" />
            <div className="token-style">{currentToken?.symbol}</div>
            <ArrowDownIcon width={12} />
          </TokenToBridge>

          {/* {showNetworkList && (
            <ModalNetworkContent
              setShowList={setShowList}
              tokenList={tokenList}
              currentToken={currentToken}
              setCurrentToken={setCurrentToken}
            />
          )} */}

          {showList && (
            <ModalContent
              setShowList={setShowList}
              tokenList={tokenList}
              currentToken={currentToken}
              setCurrentToken={setCurrentToken}
            />
          )}
        </BridgeSelectColumn>
      )}
    </InputTokenWrapper>
  )
}
