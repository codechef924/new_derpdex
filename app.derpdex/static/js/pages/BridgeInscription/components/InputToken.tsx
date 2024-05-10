import '@fontsource/gloria-hallelujah' // Defaults to weight 400

import { ReactComponent as ArrowDownIcon } from 'assets/svg/arrow-down-minimal.svg'
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { BRIDGE_INFO } from '../_supported_token_bridge'
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
  tokenList?: BRIDGE_INFO[]
  currentToken?: BRIDGE_INFO | null | undefined
  setCurrentToken?: (token: BRIDGE_INFO) => void
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
  tokenList?: BRIDGE_INFO[]
  currentToken?: BRIDGE_INFO | null | undefined
  setCurrentToken?: (token: BRIDGE_INFO) => void
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

export const InputToken = ({
  isInput = true,
  tokenData,
  currentToken,
  setCurrentToken,
  inputAmount = undefined,
  tokenList,
  setInputAmount,
  onMaxedAmount,
}: {
  isInput: boolean
  tokenData: DEPOSIT | WITHDRAW
  currentToken?: BRIDGE_INFO | null
  setCurrentToken?: (token: BRIDGE_INFO) => void
  inputAmount?: number | undefined
  tokenList?: BRIDGE_INFO[]
  setInputAmount?: Dispatch<SetStateAction<number | undefined>>
  onMaxedAmount?: () => void
}) => {
  const handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
    const newInputAmount = event.currentTarget.value
    setInputAmount?.(newInputAmount === '' ? undefined : Number(newInputAmount))
  }

  const [showNetworkList, setShowNetworkList] = useState<boolean>(false)
  const [showList, setShowList] = useState<boolean>(false)

  return (
    <InputTokenWrapper isInput={isInput}>
      {isInput && (
        <ColFlex className="first-col-network-and-input">
          <div className="chain-wrapper">
            <img src={tokenData.details?.logoUrl} />
            <span>{tokenData.details?.label}</span>
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
              <img src={tokenData.details?.logoUrl} />
              <span>{tokenData.details?.label}</span>
            </div>
          )}
        </ColFlex>
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
