/* eslint-disable object-shorthand */
import { CircularProgress, Modal } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import { ReactComponent as ArrowDownIcon } from 'assets/svg/derp-arrow-down.svg'
import { ReactComponent as DerpGuru } from 'assets/svg/derp-guru.svg'
import { GloriaText } from 'components/CustomFonts/GloriaHallelujah'
import { NunitoText } from 'components/CustomFonts/Nunito'
import { getChainInfo } from 'constants/chainInfo'
import { SupportedChainId } from 'constants/chains'
import { RPC_URLS } from 'constants/networks'
import { isBNB } from 'constants/tokens'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { L1Signer, Provider } from 'zksync-web3'

import {
  BRIDGE_DEPOSIT_ADDRESS,
  BRIDGE_INFO,
  getBridgeDepositAddress,
  L1_BRIDGE,
  L1_OPBNB_BRIDGE,
} from './_supported_token_bridge'
import { useApproveAllowance, useValidateApproveBridge } from './approveBridge'
import { DEPOSIT, WITHDRAW } from './BridgeComponent'
import { useSupportedDepositCallback } from './hooks/deposit'
import { InputToken } from './InputToken'
import {
  BalanceEstimate,
  BalanceMaxBox,
  BlurredBalance,
  DepoitOrWithdrawToAnotherWrapper,
  DepositOrWithdrawBody,
  EstimateFeeText,
  FixedHeight,
  InvalidTextWrapper,
  ListOfDepositStatus,
  MaxButton,
  ModalComponent,
  OverridedBridgeButton,
  RowOfDepositStatus,
  StyledInput,
} from './stylings'
import { Switcher } from './Switcher'
import { useNetworkChange } from './useNetworkChange'
import AssetLogo from './utils/AssetLogo'
import { CallbackStatus, CHAIN_MAPPED, useStoreDepositHash } from './utils/useStoreDepositHash'
import { API_ENDPOINT } from './utils/useVarieties'

export const DepositBridge = ({
  tokenList,
  currentToken,
  setCurrentToken,
  depositTokenData,
  withdrawTokenData,
  onSwitch,
  batchGetBalance,
}: {
  tokenList: BRIDGE_INFO[]
  currentToken: BRIDGE_INFO
  setCurrentToken?: (token: BRIDGE_INFO) => void
  depositTokenData: DEPOSIT
  withdrawTokenData: WITHDRAW
  onSwitch: () => void
  batchGetBalance: () => void
}) => {
  const { changeNetwork, isChangedtoL1 } = useNetworkChange()

  const [estimateFee, setEstimateFee] = useState<string | undefined>()
  const [inputAmount, setInputAmount] = useState<number | undefined>(undefined)
  const [expandOtherRecipient, setExpandOtherRecipient] = useState<boolean>(false)
  const [otherRecipient, setOtherRecipient] = useState<string | undefined>()

  const { chainId, provider, connector, account } = useWeb3React()
  const [isDepositLoading, setIsDepositLoading] = useState<boolean>(false)
  const [isSuccessDeposit, setSuccessDeposit] = useState<boolean>(false)
  const [isInsufficientFunds, setIsInsufficientFunds] = useState<boolean>(false)

  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const { validateIfApproved, isApproved, setIsApproved } = useValidateApproveBridge()

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

  useEffect(() => {
    if (account && provider && currentToken && chainId) {
      storedDepositHash()
      if (!currentToken.isNative) {
        const signer = provider.getSigner()
        validateIfApproved({
          contract_addresss: currentToken.L1Address,
          // spender: chainId === 1 ? getBridgeDepositAddress[1] : getBridgeDepositAddress[5],
          spender: BRIDGE_DEPOSIT_ADDRESS[chainId],
          account,
          signer,
        })
      } else {
        setIsApproved(true)
      }
    }
  }, [account, chainId, currentToken, provider, isSuccessDeposit])

  const [isLoadingEstimateDeposit, setIsLoadingEstimateDeposit] = useState<boolean>(false)

  const getDepositFee = async () => {
    try {
      setIsLoadingEstimateDeposit(true)
      if (provider && account && chainId) {
        if (L1_BRIDGE.includes(chainId)) {
          const etherProvider = new ethers.providers.JsonRpcProvider(RPC_URLS[chainId as SupportedChainId][0])
          const etherSigner = etherProvider.getSigner(account)

          const zksyncProvider = new Provider(
            RPC_URLS[chainId === 1 ? SupportedChainId.ZKSYNC_MAINNET : SupportedChainId.ZKSYNC_TESTNET][0]
          )

          const signerL1 = L1Signer.from(etherSigner, zksyncProvider)

          const txofDeposit = await signerL1.getDepositTx({
            to: account,
            token: currentToken.L1Address,
            amount: ethers.utils.parseUnits(inputAmount ? inputAmount.toString() : '0', currentToken.decimals),
            bridgeAddress: chainId === 1 ? getBridgeDepositAddress[1] : getBridgeDepositAddress[5],
            // gasPerPubdataByte: REQUIRED_L1_TO_L2_GAS_PER_PUBDATA_LIMIT,
          })

          const L1gasPrice = await signerL1.getGasPrice()

          const estimation = await signerL1.estimateGasDeposit(txofDeposit)

          console.log(
            `Estimation ${ethers.utils.formatEther(estimation.mul(L1gasPrice))} ETH with gas of ${L1gasPrice}`
          )
          setEstimateFee(ethers.utils.formatEther(estimation.mul(L1gasPrice)))
          setIsLoadingEstimateDeposit(false)
        } else if (L1_OPBNB_BRIDGE.includes(chainId)) {
          const payload = {
            isTestnet: process.env.REACT_APP_IS_TESTSITE === 'true' ? true : false,
            inputAmount,
            token: {
              address: currentToken.L1Address,
              symbol: currentToken.symbol,
              decimals: currentToken.decimals,
            },
          }
          // API
          const result = await fetch(`${API_ENDPOINT}/estimate-deposit`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          })
          if (result.ok) {
            const estimationResult = await result.json()
            const estimation = estimationResult.gas
            console.log(`Estimation ${estimation} BNB`)
            setEstimateFee(estimation)
            setIsLoadingEstimateDeposit(false)
          } else {
            setIsLoadingEstimateDeposit(false)
            setEstimateFee('0')
          }
        } else {
          setIsLoadingEstimateDeposit(false)
        }
      }
    } catch (err) {
      setEstimateFee(undefined)
      setIsLoadingEstimateDeposit(false)
      console.log(err)
    }
  }
  useEffect(() => {
    getDepositFee()
    setIsInsufficientFunds(false)
  }, [inputAmount, currentToken])

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

  const { isLoadingApprove, approveAllowance } = useApproveAllowance()

  const handleApproval = async () => {
    try {
      if (provider && account && isChangedtoL1 && chainId) {
        const signer = provider.getSigner()
        //! Depositing L1 requires provider of L2 interchange, do not confuse mainnet with testnet
        const zksyncProvider = new Provider(
          RPC_URLS[chainId === 1 ? SupportedChainId.ZKSYNC_MAINNET : SupportedChainId.ZKSYNC_TESTNET][0]
        )
        const signerL1 = L1Signer.from(signer, zksyncProvider)

        const result = await approveAllowance({
          contract_addresss: currentToken.L1Address,
          spender: getBridgeDepositAddress[chainId],
          account,
          signer: signerL1,
        })
        setIsApproved(true)
      }
    } catch (error) {
      setIsApproved(false)
      console.log(error)
    }
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
        <BalanceEstimate>
          <BlurredBalance>Balance: {withdrawTokenData.balance}</BlurredBalance>
          <EstimateFeeText>
            Estimated fee:{' '}
            {!isLoadingEstimateDeposit && (
              <>
                {estimateFee ? estimateFee : '-'} {chainId && isBNB(CHAIN_MAPPED[chainId]) ? 'BNB' : 'ETH'}
              </>
            )}
            &nbsp;
            {isLoadingEstimateDeposit && <CircularProgress style={{ color: '#a372ff' }} size={14} />}
          </EstimateFeeText>
        </BalanceEstimate>
        <DepoitOrWithdrawToAnotherWrapper onClick={() => setExpandOtherRecipient(!expandOtherRecipient)}>
          Deposit to another address on&nbsp;
          {chainId && getChainInfo(chainId)?.label}
          <ArrowDownIcon />
        </DepoitOrWithdrawToAnotherWrapper>
        {expandOtherRecipient && (
          <div
            style={{
              width: '100%',
              marginTop: '10px',
            }}
          >
            <StyledInput
              value={otherRecipient}
              onInput={(e) => {
                setOtherRecipient(e.currentTarget.value)
              }}
              placeholder="Input Receiver Address"
            />
          </div>
        )}
        {!isDepositLoading && !isLoadingApprove && (
          <OverridedBridgeButton
            onClick={() =>
              isChangedtoL1 && isApproved
                ? onHandleDeposit()
                : isChangedtoL1 && !isApproved
                ? handleApproval()
                : changeNetwork()
            }
            disabled={
              (inputAmount && inputAmount.toString().length > 0 && inputAmount <= depositTokenData.balance) ||
              !isChangedtoL1 ||
              !isApproved
                ? false
                : true
            }
          >
            <GloriaText size="xl">
              {isChangedtoL1 && isApproved
                ? 'Deposit'
                : isChangedtoL1 && !isApproved
                ? 'Approve token'
                : 'Switch Network'}
            </GloriaText>
          </OverridedBridgeButton>
        )}

        {(isDepositLoading || isLoadingApprove) && (
          <OverridedBridgeButton disabled={true}>
            <GloriaText size="xl">
              {isDepositLoading || isLoadingApprove ? (
                <CircularProgress style={{ color: '#a372ff' }} size={18} />
              ) : null}
            </GloriaText>
          </OverridedBridgeButton>
        )}
        {inputAmount && inputAmount > depositTokenData.balance ? (
          <InvalidTextWrapper style={{ marginTop: '10px' }}>Insufficient balance</InvalidTextWrapper>
        ) : null}
        {/* {isInsufficientFunds ? (
          <InvalidTextWrapper style={{ marginTop: '10px' }}>Insufficient funds</InvalidTextWrapper>
        ) : null} */}
        <div
          style={{
            margin: '30px 0 0 0',
            color: '#98a1c0',
          }}
        >
          <NunitoText size="lg" weight={500}>
            Up to 5 minutes
          </NunitoText>
        </div>
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

      {storedDepositListState && storedDepositListState.length > 0 && (
        <ListOfDepositStatus
          style={{
            marginTop: '25px',
          }}
        >
          <FixedHeight>
            <RowOfDepositStatus>
              {storedDepositListState.map((item) => {
                return (
                  <>
                    <AssetLogo address={item.logDetails.tokenAddress} backupImg={item.logDetails.logoUrl} />
                    <div className="text">
                      {item.logDetails.amount} {item.logDetails.symbol}
                    </div>
                    <div className="grid-state">
                      <CallbackStatus
                        receipt={item.receipt}
                        dismissStatus={() => dismissStatus(item.receipt.transactionHash)}
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
