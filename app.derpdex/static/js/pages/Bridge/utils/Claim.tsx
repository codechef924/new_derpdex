/* eslint-disable import/no-unused-modules */
import { Alert, CircularProgress, Snackbar } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import { GloriaText } from 'components/CustomFonts/GloriaHallelujah'
import { SupportedChainId } from 'constants/chains'
import { RPC_URLS } from 'constants/networks'
import { ethers } from 'ethers'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ExplorerDataType, getExplorerLink } from 'utils/getExplorerLink'
import { L1Signer, Provider } from 'zksync-web3'

import { AlertBox, ClaimBtn } from '../stylings'
import { useNetworkChange } from '../useNetworkChange'
import { API_ENDPOINT, useCheckIsWithdrawalFinalized, useFinalizedWithdrawal } from './useVarieties'

type SnackbarType = 'SUCCESS' | 'ERROR' | 'UNDEFINED'

export interface State {
  open: boolean
  message: string
  type: SnackbarType
  link?: string
}
export function ClaimCallback({
  transactionHash,
  timestamp,
  setShouldReload,
}: {
  transactionHash: string
  timestamp: number
  setShouldReload: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [isClaimable, setIsClaimable] = useState(false)
  const { chainId, provider, account } = useWeb3React()

  // Snackbar
  const [state, setState] = useState<State>({
    open: false,
    message: '',
    type: 'UNDEFINED',
    link: undefined,
  })
  const { open } = state

  const handleClose = () => {
    setState({ open: false, message: '', type: 'UNDEFINED', link: undefined })
  }
  // Snackbar

  const {
    isErrorCheckWithdrawalFinalized,
    isAlreadyWithdrawalFinalized,
    isLoadingCheckIsWithdrawalFinalized,
    isSuccessCheckIsWithdrawalFinalized,
    checkIsWithdrawalFinalized,
  } = useCheckIsWithdrawalFinalized()

  const [isPendingTimelapse, setIsPendingTimelapse] = useState<boolean>(false)
  useEffect(() => {
    if (chainId && Date.now() - timestamp > 60 * 60 * 1000) {
      setIsPendingTimelapse(false)
      checkIsWithdrawalFinalized(
        transactionHash,
        chainId === SupportedChainId.ZKSYNC_MAINNET || chainId === SupportedChainId.MAINNET
          ? false
          : chainId === SupportedChainId.ZKSYNC_TESTNET || chainId === SupportedChainId.GOERLI
          ? true
          : false
      )
    } else {
      setIsPendingTimelapse(true)
    }
  }, [chainId])

  const {
    isErrorFinalizedWithdrawal,
    finalizedHash,
    isLoadingFinalizedWithdrawal,
    isSuccessFinalizedWithdrawal,
    finalizeWithdrawal,
  } = useFinalizedWithdrawal()

  const [isLoadingClaim, setIsLoadingClaim] = useState<boolean>(false)
  const claimer = async (transactionHash: string) => {
    if (chainId && provider && account && window.ethereum) {
      setIsLoadingClaim(true)
      try {
        await window.ethereum?.request({
          method: 'wallet_switchEthereumChain',
          params: [
            {
              chainId: `0x${
                chainId === 324 ? SupportedChainId.MAINNET : chainId === 280 ? SupportedChainId.GOERLI : chainId
              }`,
            },
          ],
        })

        const providerInjected = new ethers.providers.Web3Provider(window.ethereum, 'any')

        const SignerL1 = providerInjected.getSigner()

        const zksyncProvider = new Provider(
          RPC_URLS[chainId === 1 ? SupportedChainId.ZKSYNC_MAINNET : SupportedChainId.ZKSYNC_TESTNET][0]
        )

        const signer = L1Signer.from(SignerL1, zksyncProvider)
        await finalizeWithdrawal(
          transactionHash,
          signer,
          chainId === 324 || chainId === 1 ? false : chainId === 280 || chainId === 5 ? true : false
        )
      } catch (err) {
        console.log(err)
      }
      setIsLoadingClaim(false)
    }
  }

  useEffect(() => {
    if (isErrorFinalizedWithdrawal) {
      setState({ open: true, message: 'Unable to Claim. Please try again.', type: 'ERROR', link: undefined })
    }
  }, [isErrorFinalizedWithdrawal])

  useEffect(() => {
    if (isSuccessFinalizedWithdrawal) {
      console.log('Success')
      setShouldReload(true)
      setState({ open: true, message: 'Claim Success!', type: 'SUCCESS', link: finalizedHash })
    }
  }, [isSuccessFinalizedWithdrawal])

  return (
    <>
      {!isLoadingClaim ? (
        <ClaimBtn
          onClick={() => claimer(transactionHash)}
          className="grid-4"
          isClaimable={
            !isAlreadyWithdrawalFinalized && !isLoadingCheckIsWithdrawalFinalized && isSuccessCheckIsWithdrawalFinalized
          }
        >
          <GloriaText size="lg">
            {isLoadingCheckIsWithdrawalFinalized && <CircularProgress style={{ color: '#a372ff' }} size={14} />}
            {!isSuccessCheckIsWithdrawalFinalized &&
              !isLoadingCheckIsWithdrawalFinalized &&
              !isErrorCheckWithdrawalFinalized &&
              'In Progress'}
            {!isAlreadyWithdrawalFinalized &&
              !isLoadingCheckIsWithdrawalFinalized &&
              !isErrorCheckWithdrawalFinalized &&
              isSuccessCheckIsWithdrawalFinalized &&
              'Claim'}
          </GloriaText>
        </ClaimBtn>
      ) : (
        <ClaimBtn className="grid-4" isClaimable={false}>
          <GloriaText size="lg">Claiming</GloriaText>
        </ClaimBtn>
      )}

      <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} open={open} onClose={handleClose}>
        <AlertBox>
          <Alert
            className={state.type === 'ERROR' ? 'is-error' : state.type === 'SUCCESS' ? 'is-success' : undefined}
            severity={state.type === 'ERROR' ? 'error' : state.type === 'SUCCESS' ? 'success' : undefined}
          >
            {state.message}&nbsp;
            {state.link && (
              <a
                href={chainId ? getExplorerLink(chainId, finalizedHash, ExplorerDataType.TRANSACTION) : ''}
                target="_blank"
                rel="noreferrer"
                style={{
                  textDecoration: 'none',
                }}
              >
                View Transaction
              </a>
            )}
          </Alert>
        </AlertBox>
      </Snackbar>
    </>
  )
}

const SupportedChainIdToProve = [SupportedChainId.BNB, SupportedChainId.BNB_TESTNET]

enum MessageStatus {
  UNCONFIRMED_L1_TO_L2_MESSAGE = 0,
  FAILED_L1_TO_L2_MESSAGE = 1,
  STATE_ROOT_NOT_PUBLISHED = 2,
  READY_TO_PROVE = 3,
  IN_CHALLENGE_PERIOD = 4,
  READY_FOR_RELAY = 5,
  RELAYED = 6,
}

export interface IWITHDRAW_STATE {
  transactionHash: string
  blockNumber: number
  isTestnet: boolean
}

export const ClaimOpBnB = ({
  transactionHash,
  timestamp,
  blockNumber,
  setShouldReload,
  batchGetBalance,
  getAllAvailableWithdrawal,
  setState,
}: {
  transactionHash: string
  timestamp: number
  blockNumber: number
  setShouldReload: React.Dispatch<React.SetStateAction<boolean>>
  batchGetBalance: () => void
  getAllAvailableWithdrawal: (address: string, isTestnet?: boolean | undefined) => Promise<void>
  setState: React.Dispatch<React.SetStateAction<State>>
}) => {
  const { chainId, provider, account } = useWeb3React()
  const [isRefetch, setIsRefetch] = useState<boolean>(false)
  const [isProving, setIsProving] = useState<boolean>(false)
  const [isFinalizing, setIsFinalizing] = useState<boolean>(false)

  // Snackbar

  // opBNB requires 2-steps validation to withdraw to BNB

  const [withdrawStep, setWithdrawStep] = useState<MessageStatus | undefined>(undefined)

  const checkIfReadyToProveOrFInalizeWithdraw = async () => {
    setIsRefetch(true)
    try {
      const payload: IWITHDRAW_STATE = {
        transactionHash,
        blockNumber,
        isTestnet: process.env.REACT_APP_IS_TESTSITE === 'true' ? true : false,
      }

      const result = await fetch(`${API_ENDPOINT}/withdraw-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      // RESULT
      if (result.ok) {
        const withdrawStatus = await result.json()
        const status = withdrawStatus.status as MessageStatus

        if (status === MessageStatus.RELAYED) {
          const onUpdate = await fetch(`${API_ENDPOINT}/update-withdrawal`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json', // IMPORTANT
            },
            body: JSON.stringify({
              transactionHash,
              isTestnet: process.env.REACT_APP_IS_TESTSITE === 'true' ? true : false,
            }),
          })
          setShouldReload(true)
          setIsRefetch(true)
        } else {
          setWithdrawStep(status)
          setIsRefetch(false)
        }
      } else {
        throw 'Unable to get withdraw status'
      }
    } catch (err) {
      console.log('[Err checkIfReadyToProve]', err)
      setWithdrawStep(undefined)
      setIsRefetch(false)
    }
  }

  const { changeNetwork, isChangedtoL1 } = useNetworkChange()

  const [shouldReloadStatus, setShouldReloadStatus] = useState<boolean>(false)

  const handleProveWithdraw = useCallback(async () => {
    try {
      setIsProving(true)
      if (!isChangedtoL1) {
        await changeNetwork()
      }

      if (!chainId || !account || !transactionHash || !provider || withdrawStep !== MessageStatus.READY_TO_PROVE) {
        throw 'Not ready to prove'
      }

      const payload = {
        transactionHash,
        isTestnet: process.env.REACT_APP_IS_TESTSITE === 'true' ? true : false,
      }

      // API
      const result = await fetch(`${API_ENDPOINT}/prove-withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (result.ok) {
        const proveResult = await result.json()
        const signer = await provider.getSigner()

        const proveTx = await signer.sendTransaction(proveResult.tx)

        const receipt = await proveTx.wait()
        setState({ open: true, message: 'Withdraw Proven', type: 'SUCCESS', link: proveTx.hash })
        setIsProving(false)
        setShouldReloadStatus(true)
        setShouldReload(true)
      } else {
        throw 'Unable to get build transaction'
      }
    } catch (err) {
      setIsProving(false)
      console.log('[Err handleProveWithdraw]', err)
    }
  }, [account, chainId, transactionHash, withdrawStep, blockNumber, isChangedtoL1])

  const handleWithdrawFinalize = useCallback(async () => {
    try {
      setShouldReload(false)
      setIsFinalizing(true)
      if (!isChangedtoL1) {
        await changeNetwork()
      }

      if (!chainId || !account || !transactionHash || !provider || withdrawStep !== MessageStatus.READY_FOR_RELAY) {
        throw 'Not ready to finalize'
      }

      const payload = {
        transactionHash,
        isTestnet: process.env.REACT_APP_IS_TESTSITE === 'true' ? true : false,
      }
      // API
      const result = await fetch(`${API_ENDPOINT}/finalize-withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (result.ok) {
        const finalizeTxBuildResult = await result.json()
        const signer = await provider.getSigner()

        const finalizeTx = await signer.sendTransaction(finalizeTxBuildResult.tx)
        const receipt = await finalizeTx.wait()
        setState({ open: true, message: 'Withdraw success!', type: 'SUCCESS', link: finalizeTx.hash })

        await fetch(`${API_ENDPOINT}/update-withdrawal`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', // IMPORTANT
          },
          body: JSON.stringify({
            transactionHash,
            isTestnet: process.env.REACT_APP_IS_TESTSITE === 'true' ? true : false,
          }),
        })
        // await getAllAvailableWithdrawal(account, process.env.REACT_APP_IS_TESTSITE === 'true' ? true : false)

        setShouldReload(true)
        setShouldReloadStatus(true)
        batchGetBalance()
        setIsFinalizing(false)
      } else {
        throw 'Unable to get build transaction'
      }
    } catch (err) {
      setIsFinalizing(false)
      console.log('[Err handleWithdrawFinalize]', err)
    }
  }, [account, chainId, transactionHash, withdrawStep, blockNumber, isChangedtoL1])

  useEffect(() => {
    if (chainId && transactionHash) {
      checkIfReadyToProveOrFInalizeWithdraw()
    }
  }, [chainId, transactionHash, shouldReloadStatus])

  const StepperComponent = useMemo(() => {
    if (withdrawStep && withdrawStep === MessageStatus.READY_TO_PROVE && !isRefetch) {
      return (
        <>
          <ClaimBtn
            isClaimable={withdrawStep === MessageStatus.READY_TO_PROVE && !isProving}
            onClick={handleProveWithdraw}
          >
            Prove
          </ClaimBtn>
        </>
      )
    } else if (withdrawStep && withdrawStep === MessageStatus.READY_FOR_RELAY && !isRefetch) {
      return (
        <>
          <ClaimBtn
            isClaimable={withdrawStep === MessageStatus.READY_FOR_RELAY && !isFinalizing}
            onClick={handleWithdrawFinalize}
          >
            Finalize
          </ClaimBtn>
        </>
      )
    } else if (
      (withdrawStep && withdrawStep === MessageStatus.STATE_ROOT_NOT_PUBLISHED && !isRefetch) ||
      (withdrawStep && withdrawStep === MessageStatus.IN_CHALLENGE_PERIOD && !isRefetch)
    ) {
      return (
        <>
          <ClaimBtn isClaimable={false}>Pending</ClaimBtn>
        </>
      )
    } else {
      return (
        <>
          <ClaimBtn isClaimable={false}>Verifying</ClaimBtn>
        </>
      )
    }
  }, [handleProveWithdraw, handleWithdrawFinalize, withdrawStep, isProving, isFinalizing, isRefetch])

  return <>{StepperComponent}</>
}
