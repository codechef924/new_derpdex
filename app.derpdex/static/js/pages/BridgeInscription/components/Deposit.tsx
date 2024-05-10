/* eslint-disable object-shorthand */
import { CircularProgress, Modal } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import { ReactComponent as DerpGuru } from 'assets/svg/derp-guru.svg'
import { GloriaText } from 'components/CustomFonts/GloriaHallelujah'
import { NunitoText } from 'components/CustomFonts/Nunito'
import { SupportedChainId } from 'constants/chains'
import { useEffect, useState } from 'react'

import { BRIDGE_INFO } from '../_supported_token_bridge'
import { useMintTx, useRequestSignatures, useSupportedDepositCallback } from '../hooks/deposit'
import {
  BalanceMaxBox,
  BlurredBalance,
  DepositOrWithdrawBody,
  FixedHeight,
  InvalidTextWrapper,
  ListOfDepositStatus,
  MaxButton,
  ModalComponent,
  OverridedBridgeButton,
  RowOfDepositStatus,
} from '../stylings'
import AssetLogo from '../utils/AssetLogo'
import { CallbackStatus, useStoreDepositHash } from '../utils/useStoreDepositHash'
import { DEPOSIT, WITHDRAW } from './BridgeComponent'
import { InputToken } from './InputToken'
import { Switcher } from './Switcher'
import { useNetworkChange } from './useNetworkChange'

type TTx = {
  blockNumber: number
  trx_id: string
  from_address: string
  to_address: string
  decode_data: string
  block_time: number
  amount?: number
  logoURI?: string
  symbol?: string
}

const DEFAULT_NETWORK =
  process.env.REACT_APP_IS_TESTSITE === 'true' ? SupportedChainId.OPBNB_TESTNET : SupportedChainId.OPBNB_MAINNET
export const DepositBridge = ({
  tokenList,
  currentToken,
  setCurrentToken,
  depositTokenData,
  withdrawTokenData,
  onSwitch,
  batchGetBalance,
  txList,
}: {
  tokenList: BRIDGE_INFO[]
  currentToken: BRIDGE_INFO
  setCurrentToken?: (token: BRIDGE_INFO) => void
  depositTokenData: DEPOSIT
  withdrawTokenData: WITHDRAW
  onSwitch: () => void
  batchGetBalance: () => void
  txList: TTx[]
}) => {
  const [selectedNetwork, setSelectedNetwork] = useState<SupportedChainId>(DEFAULT_NETWORK)
  const { changeNetwork, isChangedtoL1 } = useNetworkChange({
    targetNetwork: selectedNetwork,
  })

  const [inputAmount, setInputAmount] = useState<number | undefined>(undefined)
  const [otherRecipient, setOtherRecipient] = useState<string | undefined>()

  const { chainId, provider, connector, account } = useWeb3React()
  const [isDepositLoading, setIsDepositLoading] = useState<boolean>(false)
  const [isSuccessDeposit, setSuccessDeposit] = useState<boolean>(false)
  const [isInsufficientFunds, setIsInsufficientFunds] = useState<boolean>(false)
  const [itemForMint, setItemForMint] = useState<TTx | undefined>(undefined)

  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  // TODO: [Inscriptions] This is to get the deposit transactions list
  const {
    storedDepositHash,
    addReceiptToLocalStorage,
    dismissStatus,
    depositList: storedDepositListState,
  } = useStoreDepositHash()

  const { depositCallback } = useSupportedDepositCallback({
    currentToken,
    inputAmount,
    otherRecipient,
    setIsInsufficientFunds,
    setIsDepositLoading,
    setSuccessDeposit,
    batchGetBalance,
    setInputAmount,
    handleOpen,
  })

  const {
    isLoading: isSignatureLoading,
    isSuccess: isSuccessSignature,
    isError: isErrorSignature,
    signatures,
    requestSignatures,
  } = useRequestSignatures()

  const {
    isLoading: isMintLoading,
    isSuccess: isSuccessMint,
    isError: isErrorMint,
    mintTx,
  } = useMintTx({
    batchGetBalance,
  })

  useEffect(() => {
    if (account && provider && currentToken && chainId) {
      storedDepositHash()
    }
  }, [account, chainId, currentToken, provider, isSuccessDeposit])

  useEffect(() => {
    if (isSuccessSignature && signatures && account && provider && currentToken && chainId) {
      mintTx({
        signatures,
        symbol: currentToken.symbol,
        inputAmount: itemForMint?.amount,
      }).then(() => {
        setItemForMint(undefined)
      })
    }
  }, [isSuccessSignature, signatures])

  const onHandleDeposit = async () => {
    if (!isChangedtoL1) {
      try {
        await changeNetwork()
      } catch (error) {
        console.log('Error while changing network:', error)
        return
      }
    } else {
      // await runDepositCallback()
      // await testDeposit()
      await depositCallback()
    }
  }

  const finaliseMint = async (item: TTx) => {
    setItemForMint(item)
    await requestSignatures({ chainId, symbol: currentToken.symbol, txHash: item.trx_id })
  }

  const onClickMaxBalance = () => {
    setInputAmount(depositTokenData.balance)
  }

  return (
    <>
      <DepositOrWithdrawBody>
        <BalanceMaxBox>
          <BlurredBalance>Balance: {depositTokenData.balance}</BlurredBalance>
          <MaxButton onClick={onClickMaxBalance}>MAX</MaxButton>
        </BalanceMaxBox>
        <InputToken
          onMaxedAmount={onClickMaxBalance}
          inputAmount={inputAmount}
          setInputAmount={setInputAmount}
          currentToken={currentToken}
          setCurrentToken={setCurrentToken}
          isInput={true}
          tokenData={depositTokenData}
          tokenList={tokenList}
        />
        <Switcher onSwitch={() => onSwitch()} />
        <InputToken isInput={false} tokenData={withdrawTokenData} />
        {!isDepositLoading && (
          <OverridedBridgeButton
            onClick={() => (isChangedtoL1 ? onHandleDeposit() : changeNetwork())}
            disabled={
              (inputAmount && inputAmount.toString().length > 0 && inputAmount <= depositTokenData.balance) ||
              !isChangedtoL1
                ? false
                : true
            }
          >
            <GloriaText size="xl">{isChangedtoL1 ? 'Transfer' : 'Switch Network'}</GloriaText>
          </OverridedBridgeButton>
        )}

        {isDepositLoading && (
          <OverridedBridgeButton disabled={true}>
            <GloriaText size="xl">
              {isDepositLoading ? <CircularProgress style={{ color: '#a372ff' }} size={18} /> : null}
            </GloriaText>
          </OverridedBridgeButton>
        )}
        {inputAmount && inputAmount > depositTokenData.balance ? (
          <InvalidTextWrapper style={{ marginTop: '10px' }}>Insufficient balance</InvalidTextWrapper>
        ) : null}
      </DepositOrWithdrawBody>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ModalComponent>
          <div className="content">
            <div className="text-area">
              <NunitoText size="xl" weight={600}>
                Your <span>ETH balance is insufficient</span> to cover the value and gas.
                <div>Please change the amount and try again.</div>
              </NunitoText>
            </div>
            <div className="absolute-derp">
              <DerpGuru />
            </div>
          </div>
          {/* <NunitoText size="xl">Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</NunitoText> */}
        </ModalComponent>
      </Modal>

      {txList.length > 0 && (
        <ListOfDepositStatus
          style={{
            marginTop: '25px',
          }}
        >
          <FixedHeight>
            <RowOfDepositStatus>
              {txList.map((item) => {
                return (
                  <>
                    <AssetLogo backupImg={item.logoURI} />
                    <div className="text">
                      {item.amount} {item.symbol}
                    </div>
                    <div className="grid-state">
                      <CallbackStatus
                        depositData={item}
                        itemForMint={itemForMint}
                        functionToCall={() => {
                          // dismissStatus(item.trx_id)
                          finaliseMint(item)
                        }}
                      />
                    </div>
                  </>
                )
              })}
            </RowOfDepositStatus>
          </FixedHeight>
        </ListOfDepositStatus>
      )}
    </>
  )
}
