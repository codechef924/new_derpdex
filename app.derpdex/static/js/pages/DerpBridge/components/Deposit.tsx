/* eslint-disable object-shorthand */
import { CircularProgress, Modal } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import { ReactComponent as DerpGuru } from 'assets/svg/derp-guru.svg'
import { GloriaText } from 'components/CustomFonts/GloriaHallelujah'
import { NunitoText } from 'components/CustomFonts/Nunito'
import { getChainInfo, getChainInfoOrDefault } from 'constants/chainInfo'
import { SupportedChainId } from 'constants/chains'
import { useEffect, useState } from 'react'

import { BRIDGE_INFO_SUPPORTED_TOKEN, getSupportedBrigeAssets, SupportedNetworks } from '../_supported_token_bridge'
import { useClaimTx, useRequestSignatures, useSupportedDepositCallback } from '../hooks/deposit'
import { TTx } from '../hooks/useGetDetails'
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
import { CallbackStatus } from '../utils/useStoreDepositHash'
import { DEPOSIT } from './BridgeComponent'
import { InputToken } from './InputToken'
import { Switcher } from './Switcher'

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

const DEFAULT_NETWORK =
  process.env.REACT_APP_IS_TESTSITE === 'true' ? SupportedChainId.OPBNB_TESTNET : SupportedChainId.OPBNB_MAINNET
export const DepositBridge = ({
  tokenList,
  currentToken,
  setCurrentToken,
  depositTokenData,
  onSwitch,
  updateTxStatus,
  updateBalance,
  txList,
  getDepositDetails,
}: {
  tokenList: BRIDGE_INFO_SUPPORTED_TOKEN[]
  currentToken: BRIDGE_INFO_SUPPORTED_TOKEN
  setCurrentToken?: (token: BRIDGE_INFO_SUPPORTED_TOKEN) => void
  depositTokenData: DEPOSIT
  onSwitch: () => void
  updateTxStatus: (txn: any) => void
  updateBalance: (tokenAddress: string, userAddress?: string) => void
  txList: TTx[]
  getDepositDetails: (walletAddress: string, token: BRIDGE_INFO_SUPPORTED_TOKEN, chainId: number) => Promise<void>
}) => {
  const [selectedNetwork, setSelectedNetwork] = useState<SupportedChainId>(DEFAULT_NETWORK)
  const [targetChain, setTargetChain] = useState<ChainInfo>()
  // const { changeNetwork, isChangedtoL1 } = useNetworkChange({
  //   targetNetwork: selectedNetwork,
  // })

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

  const { depositCallback } = useSupportedDepositCallback({
    //@ts-ignore
    targetChainId: targetChain?.chainId,
    currentToken,
    inputAmount,
    otherRecipient,
    setIsInsufficientFunds,
    setIsDepositLoading,
    setSuccessDeposit,
    updateTxStatus,
    updateBalance,
    setInputAmount,
    handleOpen,
  })

  const {
    isLoading: isSignatureLoading,
    isSuccess: isSuccessSignature,
    isError: isErrorSignature,
    signatures,
    requestSignatures,
    setSignatures,
  } = useRequestSignatures({
    updateTxStatus,
  })

  const {
    isLoading: isMintLoading,
    isSuccess: isSuccessMint,
    isError: isErrorMint,
    claimTx,
  } = useClaimTx({
    updateTxStatus,
    updateBalance,
    getDepositDetails,
  })

  const changeNetwork = async (_targetNetwork?: SupportedChainId) => {
    try {
      if (chainId && provider) {
        await connector.activate(_targetNetwork ? _targetNetwork : selectedNetwork)

        return true
      }

      return false
    } catch (error) {
      console.log('Error while changing network:', error)
      return false
    }
  }

  useEffect(() => {
    const executeTx = async () => {
      try {
        if (isSuccessSignature && signatures && account && provider && currentToken && chainId) {
          setSelectedNetwork(signatures.targetChainId)
          if (chainId != signatures.targetChainId) {
            if (!(await changeNetwork(signatures.targetChainId))) throw new Error('Failed to change network')
          } else {
            if ((await claimTx(signatures)) == false) throw new Error('Failed to claim tx')
            setItemForMint(undefined)
            setSignatures(null)
          }
        }
      } catch (error) {
        console.log(error)
        setItemForMint(undefined)
        setSignatures(null)
        updateTxStatus({
          type: 'CLAIM',
          status: 'BRIDGED',
          tokenAddress: signatures.sourceChainTokenAddress,
          sourceChainId: signatures.sourceChainId,
          nonce: signatures.nonce,
        })
      }
    }
    executeTx()
  }, [isSuccessSignature, signatures, chainId])

  const onHandleDeposit = async () => {
    if (!isSupportedNetwork()) {
      try {
        await changeNetwork()
      } catch (error) {
        console.log('Error while changing network:', error)
        return
      }
    } else {
      // await runDepositCallback()
      // await testDeposit()
      console.log('depositCallback', targetChain)
      if (targetChain?.chainId) await depositCallback(targetChain?.chainId)
    }
  }

  const finaliseMint = async (item: TTx) => {
    setItemForMint(item)
    await requestSignatures({ chainId, symbol: currentToken.symbol, txHash: item.trx_id })
  }

  const finaliseClaim = async (item: any) => {
    try {
      setItemForMint(item)
      updateTxStatus({
        type: 'CLAIM',
        status: 'CLAIMED_PENDING',
        tokenAddress: item.tokenAddress,
        sourceChainId: item.sourceChainId,
        nonce: item.nonce,
      })
      await requestSignatures(item)
    } catch (error) {
      // console.log('finaliseClaim', error)
      updateTxStatus({
        type: 'CLAIM',
        status: 'BRIDGED',
        tokenAddress: item.tokenAddress,
        sourceChainId: item.sourceChainId,
        nonce: item.nonce,
      })
    }
  }

  const onClickMaxBalance = () => {
    setInputAmount(depositTokenData.balance)
  }

  const isSupportedNetwork = () => {
    return chainId && getSupportedBrigeAssets(chainId).length > 0
  }

  const [supportedNetworkInfo, setSupportedNetworkInfo] = useState<Array<ChainInfo>>()

  useEffect(() => {
    const allNetworks: Array<ChainInfo> = []

    SupportedNetworks.forEach((network) => {
      const networkInfo = getChainInfo(network)

      if (network != chainId) {
        allNetworks.push({
          chainId: network,
          chainName: networkInfo.label,
          logoUrl: networkInfo.logoUrl,
          nativeCurrency: {
            name: networkInfo.nativeCurrency.name,
            symbol: networkInfo.nativeCurrency.symbol,
            decimals: networkInfo.nativeCurrency.decimals,
          },
        })
      }
    })

    setSupportedNetworkInfo(allNetworks)
    setTargetChain(allNetworks.find((network) => network.chainId != chainId))
  }, [chainId])

  const isBridgingAllowed = () => {
    let transactionCondtion = true

    if (txList && txList.length > 0) {
      const bridgeTransaction = txList.find(
        (item) =>
          item.sourceChainId == chainId &&
          item.targetChainId == targetChain?.chainId &&
          item.tokenAddress?.toLowerCase() == currentToken.address.toLowerCase() &&
          // item.status == 'BRIDGED'
          item.status != 'CLAIMED'
      )

      if (bridgeTransaction) transactionCondtion = false
    }
    if (inputAmount && inputAmount > 0 && depositTokenData.balance > 0 && transactionCondtion) return true
    return false
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
        <InputToken
          isInput={false}
          networkList={supportedNetworkInfo}
          setTargetChain={setTargetChain}
          currentChain={targetChain}
        />
        {!isDepositLoading && (
          <OverridedBridgeButton
            onClick={() => (isSupportedNetwork() ? onHandleDeposit() : changeNetwork())}
            disabled={isBridgingAllowed() || !isSupportedNetwork() ? false : true}
          >
            <GloriaText size="xl">{isSupportedNetwork() ? 'Bridge' : 'Switch Network'}</GloriaText>
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
                      {item.amount} {item.symbol} from {getChainInfoOrDefault(item.sourceChainId).label} to{' '}
                      {getChainInfoOrDefault(item.targetChainId).label}
                    </div>
                    <div className="grid-state">
                      <CallbackStatus
                        depositData={item}
                        txList={txList}
                        itemForMint={itemForMint}
                        updateStatus={updateTxStatus}
                        functionToCall={finaliseClaim}
                        /* functionToCall={() => {
                          console.log('item', item)
                          // dismissStatus(item.trx_id)
                          // finaliseMint(item)
                          finaliseClaim(item)
                        }} */
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
