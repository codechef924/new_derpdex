import { ERC20Abi } from '@looksrare/sdk'
import { formatNumber, NumberType } from '@uniswap/conedison/format'
import { useWeb3React } from '@web3-react/core'
import { ReactComponent as WarningIcon } from 'assets/svg/warning.svg'
import { useToggleAccountDrawer } from 'components/AccountDrawer'
import { GloriaText } from 'components/CustomFonts/GloriaHallelujah'
import { NunitoText } from 'components/CustomFonts/Nunito'
import CurrencyLogo from 'components/Logo/CurrencyLogo'
import { Input as NumericalInput } from 'components/NumericalInput'
import Row from 'components/Row'
import { LoadingBubble } from 'components/Tokens/loading'
import { SupportedChainId } from 'constants/chains'
import { BigNumber, Contract, ethers } from 'ethers'
import { useCurrency } from 'hooks/Tokens'
import useNativeCurrency from 'lib/hooks/useNativeCurrency'
import { useIsMobile } from 'nft/hooks'
import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import DerpTokenImg from '../assets/Derpdex X.png'
import { isNative } from '../constants'
import { useAllocateLaunchpad } from '../hooks/useAllocateLaunchpad'
import { useGetAmountSold } from '../hooks/useGetAmountSold'
import { CurrenyInfo, DerivedLaunchPadDetails } from '../hooks/useGetLaunchpadCampaigns'
import { useGetUserInfo } from '../hooks/useGetUserInfo'
import { useWithdrawClaim } from '../hooks/useWithdrawClaim'
import { ColFlex, LoadingDots, RowFlex, StyledButton, Text } from '../stylings'
import { NetworkSwitcher } from './NetworkSwitcher'
import { ShowUnavailable } from './ShowUnavailable'

const BorderedContainer = styled.div`
  background: #fff;
  border: 2px solid #000;
  box-shadow: 4px 4px 0px 0px #000;
`
export const LaunchPadPanelContainer = styled(BorderedContainer)`
  max-width: 914px;
  width: 100%;
  border-radius: 24px;

  padding: 22px 26px;
  width: 914px;
  min-width: 914px;
  // height: 100%;
  min-height: 660px;

  @media only screen and (max-width: 768px) {
    min-width: unset;
    width: 100%;
    padding: 16px 16px;
  }
`

const LaunchPadDetailsContainer = styled(BorderedContainer)`
  margin-top: 27px;
  border-radius: 12px;
  width: 100%;
  padding: 23px 37px;
  background: #f5f5f5;

  display: grid;
  grid-template-columns: 1fr 1fr 2fr;

  @media only screen and (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 16px 16px;
  }
`

const ItemDetails = styled(ColFlex)``

const LaunchpadDetailsArea = styled.div`
  margin-top: 31px;
  display: grid;
  grid-template-columns: 1.5fr 2fr 1fr;
  @media only screen and (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-left: 12px;
  }
`
const LaunchpadDetailsAreaChild = styled(ColFlex)`
  gap: 6px;
`

const TopRow = styled(RowFlex)`
  align-items: center;
`

const AlignedCenterRow = styled(RowFlex)`
  align-items: center;
  justify-content: flex-start;
  gap: 16px;

  &.purchase-input-area {
    .derp-output {
      font-size: 18px;
    }
    @media only screen and (max-width: 768px) {
      gap: 8px;
      .derp-output {
        font-size: 14px;
        white-space: nowrap;
      }
    }
  }
`

const WarningWrapper = styled(RowFlex)`
  width: unset;
  align-items: center;
  color: #e44b4b;
  gap: 8px;
  text-transform: capitalize;
  svg {
    width: 18px;
    height: 18px;
  }
`

const ButtonArea = styled(ColFlex)`
  height: 110px;
  gap: 12px;
`

const getAbbreviation = (datetime?: string) => {
  if (!datetime) return 'GMT'
  const date = new Date(datetime)
  const timezoneAbbreviation = date.toLocaleTimeString('en-us', { timeZoneName: 'short' }).split(' ')[2]
  return timezoneAbbreviation
}

export const LaunchPadPanel = ({
  activeLaunchpadChains,
  launchPadInfo,
  isEnded,
}: {
  activeLaunchpadChains: SupportedChainId[]
  launchPadInfo: DerivedLaunchPadDetails
  isEnded?: boolean
}) => {
  const { account, chainId, provider } = useWeb3React()
  // toggle wallet when disconnected
  const toggleWalletDrawer = useToggleAccountDrawer()

  const launchPadCurrency = useCurrency(launchPadInfo.tokenAddress, Number(launchPadInfo.chainId))

  const [purchaseAmount, setPurchaseAmount] = useState('')
  const [currencyAmount, setCurrencyAmount] = useState('0')
  const [selectedCurrencyIndex, setSelectedCurrencyIndex] = useState(0)
  const [currencySymbol, setCurrencySymbol] = useState<string>('UNK')

  // * contract interaction to purchase
  const { allocationState, onAllocateLaunchpad, selectedERC20AllowanceState, approveERC20, approvalERC20State } =
    useAllocateLaunchpad({
      campaignId: launchPadInfo.campaignId,
      amount: purchaseAmount,
      currencyInfo: launchPadInfo.currencyInfo[selectedCurrencyIndex],
    })

  const { amountSoldData } = useGetAmountSold({
    launchPadInfo,
    shouldRefetch: allocationState.isSuccess,
  })

  // * get-campaign-info (from api)
  // const { fetchOverallCampaignInfoState, overallCampaignInfo } = useGetOverallCampaignInfo({
  //   campaignId: launchPadInfo.campaignId,
  //   shouldRefetch: allocationState.isSuccess,
  // })

  // * info (User info from api)
  const { userInfoDatasContractCallState, userInfoText, isWhiteListed, userInfoDatas, fetchUserInfoState } =
    useGetUserInfo({
      campaignId: launchPadInfo.campaignId,
      chainId: launchPadInfo.chainId,
      shouldRefetch: allocationState.isSuccess,
    })

  const isAmountExceedOrLess = useMemo(() => {
    if (parseInt(purchaseAmount) > 0 && userInfoDatasContractCallState) {
      if (purchaseAmount && parseInt(purchaseAmount) < parseInt(launchPadInfo.minTokens)) {
        return 'Amount less than minimum allowed'
      } else if (
        parseFloat(userInfoDatasContractCallState.amountClaimed) + parseFloat(purchaseAmount) >
        parseFloat(launchPadInfo.maxTokens)
      ) {
        return 'Amount exceeded maximum allowed'
      }
    }
    return null
  }, [launchPadInfo, purchaseAmount, userInfoDatasContractCallState])

  const isFullyPurchased = useMemo(() => {
    if (userInfoDatasContractCallState) {
      if (parseFloat(userInfoDatasContractCallState.amountClaimed) === parseFloat(launchPadInfo.maxTokens)) {
        return 'Fully Purchased'
      }
    }
    return null
  }, [launchPadInfo.maxTokens, userInfoDatasContractCallState])

  const {
    withdrawActionText,
    withdrawInfoState,
    withdrawActionState,
    onWithdrawClaim,
    chainIdsToClaim,
    isLoading,
    isInClaimableChainId,
  } = useWithdrawClaim({
    launchPadInfo,
  })

  const shouldShowClaim = useMemo(() => {
    if (launchPadInfo.currentPhaseInfo?.staticDisplay && launchPadInfo.currentPhaseInfo.ended) {
      return true
    } else {
      return false
    }
  }, [launchPadInfo])

  const [openNetworkModal, setOpenNetworkModal] = useState<boolean>(false)

  useEffect(() => {
    if (isInClaimableChainId) setOpenNetworkModal(false)
  }, [isInClaimableChainId])

  const shouldDisableClaim = useMemo(() => {
    // Check 1: If API checked that user has amountClaim then enable (For all any chains)
    // Check 2.1: If contract checked that claim function enabled by admin
    if (withdrawActionState.isLoading || !withdrawInfoState.canWithdraw) {
      return true
    } else {
      // Check 2.2: If contract is enabled for claim function, then not disabling the button
      return false
    }
  }, [withdrawActionState.isLoading, withdrawInfoState.canWithdraw])

  const [userBalance, setUserBalance] = useState<string>('0')

  const balanceOf = async () => {
    try {
      if (!account || !provider) throw 'Account/Provider required'
      let balance: BigNumber
      const signer = provider.getSigner()
      if (launchPadInfo.currencyInfo[selectedCurrencyIndex].currencyAddress !== isNative) {
        const erc20Contract = new Contract(
          launchPadInfo.currencyInfo[selectedCurrencyIndex].currencyAddress,
          ERC20Abi,
          provider
        )
        balance = (await erc20Contract.balanceOf(account)) as BigNumber
      } else {
        balance = (await signer.getBalance()) as BigNumber
      }
      setUserBalance(
        ethers.utils.formatUnits(balance, launchPadInfo.currencyInfo[selectedCurrencyIndex].currencyDecimals)
      )
    } catch (error) {
      console.log('[Err balanceOf]', error)
    }
  }

  useEffect(() => {
    balanceOf()
    setPurchaseAmount('')
    setCurrencyAmount('')
  }, [account, selectedCurrencyIndex, allocationState.isSuccess, chainId])

  const isExceedUserBalance = useMemo(() => {
    if (parseFloat(userBalance) < parseFloat(currencyAmount)) return true
    else return false
  }, [currencyAmount, userBalance])

  const textString = useMemo(() => {
    if (fetchUserInfoState.isLoading) {
      return 'Loading'
    } else if (userInfoText) {
      return userInfoText
    } else if (isFullyPurchased) {
      return isFullyPurchased
    } else if (allocationState.isLoading) {
      return 'Purchasing'
    } else if (isExceedUserBalance) {
      return 'Insufficient Balance'
    }
    return 'Purchase'
  }, [allocationState.isLoading, fetchUserInfoState.isLoading, isFullyPurchased, userInfoText, isExceedUserBalance])

  return (
    <>
      <ColFlex margin="40px 0px 0px 0px">
        {launchPadInfo && launchPadInfo.chainId === chainId ? (
          <LaunchPadPanelContainer>
            <TopRow>
              <RowFlex gap={16}>
                <CurrencyLogo
                  style={{ border: '2px solid #000', borderRadius: '50%' }}
                  size="48px"
                  currency={launchPadCurrency}
                  backupImg={DerpTokenImg}
                  isDerp={true}
                />
                <ColFlex>
                  <Text size="xl" weight={700}>
                    {launchPadCurrency?.name?.toUpperCase()}
                  </Text>
                  <Text size="lg" weight={400} color="#889199">
                    {launchPadInfo.currentPhaseType}
                  </Text>
                </ColFlex>
              </RowFlex>
              <Text size="md2" weight={500}>
                {launchPadInfo && launchPadInfo?.currentPhaseInfo?.startTime}
              </Text>
            </TopRow>
            <LaunchPadDetailsContainer>
              <ItemDetails>
                <Text size="md2" weight={500} color="#889199">
                  Funds Allocated
                </Text>
                <Text size="lg" weight={700}>
                  {launchPadInfo && launchPadInfo.currentPhaseInfo ? (
                    <>
                      {formatNumber(parseFloat(launchPadInfo.actualTotalAmount) * 0.0000001, NumberType.FiatTokenPrice)}
                    </>
                  ) : (
                    <>$0</>
                  )}
                </Text>
              </ItemDetails>
              <ItemDetails>
                <Text size="md2" weight={500} color="#889199">
                  Funds Collected
                </Text>
                {amountSoldData.isLoading ? (
                  <LoadingBubble width="80" />
                ) : (
                  <Text size="lg" weight={700}>
                    {amountSoldData ? (
                      <>{formatNumber(parseInt(amountSoldData.amountSold) * 0.0000001, NumberType.FiatTokenPrice)}</>
                    ) : (
                      <>$0</>
                    )}
                  </Text>
                )}
              </ItemDetails>
              <ItemDetails>
                <Text size="md2" weight={500} color="#889199">
                  Duration ({getAbbreviation(launchPadInfo.currentPhaseInfo?.rawEndDate)})
                </Text>
                <Text size="lg" weight={700}>
                  {launchPadInfo.formattedStartDate.replace(',', ' @')} -{' '}
                  {launchPadInfo.formattedEndDate.replace(',', ' @')}
                </Text>
              </ItemDetails>
            </LaunchPadDetailsContainer>

            <LaunchpadDetailsArea>
              <LaunchpadDetailsAreaChild>
                <Text size="lg2" weight={700}>
                  PURCHASED AMOUNT
                </Text>
                <Text style={{ display: 'flex', alignItems: 'end' }} size="xl" weight={700} color="#A372FF">
                  {userInfoDatasContractCallState.isLoading ? (
                    <LoadingBubble width="80px" />
                  ) : (
                    <>
                      {userInfoDatasContractCallState ? (
                        <>
                          $
                          {formatNumber(
                            parseFloat(userInfoDatasContractCallState.amountClaimed) * 0.0000001,
                            NumberType.SwapTradeAmount
                          )}
                          &nbsp;
                          <Text style={{ marginBottom: '2px' }} size="lg" weight={700} color="#000">
                            (
                            {formatNumber(
                              parseFloat(userInfoDatasContractCallState.amountClaimed),
                              NumberType.SwapTradeAmount
                            )}{' '}
                            DERP)
                          </Text>
                        </>
                      ) : (
                        <>$0</>
                      )}
                    </>
                  )}
                </Text>
              </LaunchpadDetailsAreaChild>
              <LaunchpadDetailsAreaChild>
                <Text size="lg2" weight={700}>
                  IDO PRICE
                </Text>
                <Text style={{ display: 'flex', alignItems: 'end' }} size="xl" weight={700} color="#A372FF">
                  $0.0000001 &nbsp;
                  <Text style={{ marginBottom: '2px' }} size="lg" weight={700} color="#000">
                    (10% DISCOUNT)
                  </Text>
                </Text>
              </LaunchpadDetailsAreaChild>
              <LaunchpadDetailsAreaChild>
                <Text size="lg2" weight={700}>
                  TGE LISTING
                </Text>
                <Text style={{ display: 'flex', alignItems: 'end' }} size="xl" weight={700} color="#A372FF">
                  $0.00000011
                </Text>
              </LaunchpadDetailsAreaChild>
            </LaunchpadDetailsArea>
            <AlignedCenterRow>
              <PurchaseSelector
                purchaseState={allocationState.isSuccess}
                purchaseAmount={purchaseAmount}
                setPurchaseAmount={setPurchaseAmount}
                setSelectedCurrencyIndex={setSelectedCurrencyIndex}
                setCurrencyAmount={setCurrencyAmount}
                currencySymbol={currencySymbol}
                setCurrencySymbol={setCurrencySymbol}
                launchPadInfo={launchPadInfo}
                amountClaimed={userInfoDatasContractCallState.amountClaimed}
                userBalance={userBalance}
              />
            </AlignedCenterRow>

            <RowFlex margin="20px 0px 0px 0px" style={{ width: 'unset' }} gap={8}>
              <NunitoText weight={500}>
                Minimum:{' '}
                {formatNumber(
                  parseFloat(launchPadInfo.minTokens) *
                    parseFloat(launchPadInfo.currencyInfo[selectedCurrencyIndex]?.price || '0'),
                  NumberType.SwapTradeAmount
                )}{' '}
                {currencySymbol} ({launchPadInfo.minTokens} {launchPadCurrency?.symbol})
              </NunitoText>
              <NunitoText weight={500}>
                Maximum:{' '}
                {formatNumber(
                  parseFloat(launchPadInfo.maxTokens) *
                    parseFloat(launchPadInfo.currencyInfo[selectedCurrencyIndex]?.price || '0'),
                  NumberType.SwapTradeAmount
                )}{' '}
                {currencySymbol} ({launchPadInfo.maxTokens} {launchPadCurrency?.symbol})
              </NunitoText>
            </RowFlex>

            <ButtonArea>
              <AlignedCenterRow margin="25px 0px 0px 0px">
                <>
                  {!account ? (
                    <StyledButton disabled={isEnded} onClick={() => toggleWalletDrawer()} width="235px">
                      <GloriaText>{isEnded ? 'Ended' : 'Connect Wallet'}</GloriaText>
                    </StyledButton>
                  ) : !isEnded ? (
                    <>
                      {selectedERC20AllowanceState.isSuccess ? (
                        <StyledButton
                          disabled={
                            allocationState.isLoading ||
                            !account ||
                            fetchUserInfoState.isLoading ||
                            userInfoText !== null ||
                            purchaseAmount === '' ||
                            purchaseAmount === '0' ||
                            isAmountExceedOrLess !== null ||
                            isFullyPurchased !== null ||
                            isExceedUserBalance
                          }
                          onClick={() => onAllocateLaunchpad()}
                          width="235px"
                        >
                          <GloriaText size="lg">
                            {allocationState.isLoading ? <LoadingDots>Purchasing</LoadingDots> : <>{textString}</>}
                          </GloriaText>
                        </StyledButton>
                      ) : (
                        <StyledButton
                          disabled={approvalERC20State.isLoading || userInfoText !== null || isFullyPurchased !== null}
                          onClick={() => approveERC20()}
                          width="235px"
                        >
                          <GloriaText>
                            {userInfoText !== null ? (
                              <>{userInfoText}</>
                            ) : isFullyPurchased !== null ? (
                              <>{isFullyPurchased}</>
                            ) : (
                              <>{approvalERC20State.isLoading ? <LoadingDots>Approving</LoadingDots> : <>Approve</>}</>
                            )}
                          </GloriaText>
                        </StyledButton>
                      )}
                    </>
                  ) : (
                    <StyledButton disabled={true}>
                      <GloriaText>Ended</GloriaText>
                    </StyledButton>
                  )}
                </>
                {shouldShowClaim && (
                  <StyledButton
                    disabled={
                      // If nothing to claim on all networks
                      (shouldDisableClaim && !(chainIdsToClaim.length > 0)) || !(chainIdsToClaim.length > 0)
                    }
                    onClick={() => (isInClaimableChainId ? onWithdrawClaim() : setOpenNetworkModal(true))}
                    width="235px"
                  >
                    <Row style={{ justifyContent: 'center' }} gap="8px">
                      <GloriaText>
                        {withdrawActionState.isLoading ? (
                          <LoadingDots>Claiming</LoadingDots>
                        ) : (
                          <>{withdrawActionText}</>
                        )}
                      </GloriaText>
                      <>
                        {!withdrawActionState.isLoading && chainIdsToClaim.length > 0 && (
                          <>( {chainIdsToClaim.length} )</>
                        )}
                      </>
                    </Row>
                  </StyledButton>
                )}
                <>
                  <NetworkSwitcher chainIdsToSwitch={chainIdsToClaim} openNetworkModal={openNetworkModal} />
                </>
              </AlignedCenterRow>
              {allocationState.error && (
                <WarningWrapper>
                  <WarningIcon />
                  <NunitoText size="md2" weight={600}>
                    {allocationState.error}
                  </NunitoText>
                </WarningWrapper>
              )}
              {isAmountExceedOrLess && (
                <WarningWrapper>
                  <WarningIcon />
                  <NunitoText size="md2" weight={600}>
                    {isAmountExceedOrLess}
                  </NunitoText>
                </WarningWrapper>
              )}
            </ButtonArea>
            <ColFlex margin="48px 0px 0px 0px">
              <Text size="lg" weight={700}>
                Terms and Condition
              </Text>
              <ol style={{ paddingInlineStart: '20px', marginBlockStart: '0px', marginBlockEnd: '0px' }}>
                <li>
                  <Text>
                    All the sales will be FCFS basis, each wallet is only allowed to purchase a maximum 1,500 USD worth.
                  </Text>
                </li>
                <li>
                  <Text>Current DERP allocation is 0.5% ($50,000) for fundraising.</Text>
                </li>
                <li>
                  <Text>Public sales will be unlocked after Phase 1 completed.</Text>
                </li>
              </ol>
            </ColFlex>
          </LaunchPadPanelContainer>
        ) : (
          <ShowUnavailable activeLaunchpadChains={activeLaunchpadChains} />
        )}
      </ColFlex>
      {/* {isEnded && <EndedModal />} */}
    </>
  )
}

const PurchaseOptionWrapper = styled.div`
  margin-top: 36px;
  gap: 10px;
`

const PurchaseAmountRow = styled(RowFlex)`
  gap: 16px;
  height: 60px;
  align-items: flex-end;
`

const ResponsiveFlex = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const InputContainer = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  align-items: center;
  justify-content: space-between;

  height: 49px;
  width: 218px;
  padding: 0px 9px 0px 15px;

  border-radius: 12px;
  border: 2px solid #000;

  background: #fff;

  overflow: hidden;
  @media only screen and (max-width: 768px) {
    height: 48px;
    width: 164px;
    // padding: 12px 16px;
  }

  .on-max {
    justify-self: flex-end;
  }
`

const StyledNumericalInput = styled(NumericalInput)<{ $loading: boolean }>`
  text-align: left;
  font-size: 16px;

  height: 100%;
  width: 100%;

  ::placeholder {
    color: #afbdc8;
    font-size: 16px;
    opacity: 1; /* Firefox */
  }

  @media only screen and (max-width: 768px) {
    font-size: 14px;
  }
`
const StyledClickableText = styled(NunitoText)`
  background: #a372ff;
  border-radius: 8px;
  padding: 4px 8px;

  color: #fff;
  font-weight: 600;

  font-size: 18px;
  cursor: pointer;
  @media only screen and (max-width: 768px) {
    font-size: 14px;
  }
`

type SelectedType = {
  isSelected?: boolean
}
const PurchaseCurrencyButton = styled.div<SelectedType>`
  display: inline-flex;
  padding: 12px 20px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  max-height: 49px;
  border: ${({ isSelected }) => (!isSelected ? '1px dashed #000' : 'unset')};
  background: ${({ isSelected }) => (!isSelected ? '#fff' : 'linear-gradient(270deg, #46C9D2 0%, #A372FF 100%)')};
  * {
    color: ${({ isSelected }) => (!isSelected ? '#000' : '#fff')};
    font-size: 18px;
    font-weight: 700;
  }
  transition: margin-bottom 0.3s ease; /* Add this transition property */
  cursor: pointer;
  margin-bottom: ${({ isSelected }) => (!isSelected ? 'unset' : '11px')};
`

type CurrencyType = {
  currencyType: string
}
const HashMapBalance = new Map()
const PurchaseSelector = ({
  purchaseState,
  purchaseAmount,
  setPurchaseAmount,
  setSelectedCurrencyIndex,
  setCurrencyAmount,
  currencySymbol,
  setCurrencySymbol,
  launchPadInfo,
  amountClaimed,
  userBalance,
}: {
  purchaseState: boolean
  purchaseAmount: string
  setPurchaseAmount: React.Dispatch<string>
  setCurrencyAmount: React.Dispatch<string>
  setSelectedCurrencyIndex: React.Dispatch<number>
  currencySymbol: string
  setCurrencySymbol: React.Dispatch<string>
  launchPadInfo: DerivedLaunchPadDetails
  amountClaimed: string
  userBalance: string
}) => {
  const { account, provider } = useWeb3React()
  const isMobile = useIsMobile()
  const [amountToAllocate, setAmountToAllocate] = useState<string>('')
  const [derpAmountToPurchase, setDerpAmountToPurchase] = useState<string>('0')
  const [currencyIndexSelect, setCurrencyIndexSelect] = useState<number>(0)

  useEffect(() => {
    setPurchaseAmount(
      (
        parseFloat(amountToAllocate) / parseFloat(launchPadInfo.currencyInfo[currencyIndexSelect]?.price || '0') || 0
      ).toFixed()
    )
    setDerpAmountToPurchase(
      (
        parseFloat(amountToAllocate) / parseFloat(launchPadInfo.currencyInfo[currencyIndexSelect]?.price || '0') || 0
      ).toFixed()
    )
    setCurrencyAmount(amountToAllocate)
  }, [amountToAllocate, currencyIndexSelect, launchPadInfo.currencyInfo])

  const onHandleSelectOption = (index: number) => {
    setCurrencyIndexSelect(index)
    setSelectedCurrencyIndex(index)
  }

  const onHandleUserInput = (value: string) => {
    // Regex to match numbers with up to 4 decimal places
    if (/^\d*\.?\d{0,4}$/.test(value)) {
      setAmountToAllocate(value)
    }
  }

  const roundDownToFourDecimals = (value: number) => {
    return (Math.floor(value * 10000) / 10000).toString()
  }

  const setMax = () => {
    if (amountClaimed && launchPadInfo.currencyInfo[currencyIndexSelect]) {
      const diff = parseFloat(launchPadInfo.maxTokens) - parseFloat(amountClaimed)
      const convertedVal = diff * parseFloat(launchPadInfo.currencyInfo[currencyIndexSelect]?.price || '0') || 0
      const balance = parseFloat(userBalance) - 0.001 // Buffer for gas fees
      if (balance > convertedVal) {
        setAmountToAllocate(
          roundDownToFourDecimals(diff * parseFloat(launchPadInfo.currencyInfo[currencyIndexSelect]?.price || '0'))
        )
      } else {
        setAmountToAllocate(roundDownToFourDecimals(balance > 0 ? balance : 0))
      }
    }
  }

  useEffect(() => {
    if (purchaseState === true || account) {
      setAmountToAllocate('')
      setDerpAmountToPurchase('0')
    }
  }, [account, purchaseState])

  return (
    <PurchaseOptionWrapper>
      <Text size="lg2" weight={700}>
        PURCHASE
      </Text>
      <ResponsiveFlex>
        <PurchaseAmountRow>
          {launchPadInfo.currencyInfo.length > 0 ? (
            <>
              {launchPadInfo.currencyInfo.map((_c, index) => (
                <>
                  {_c.currencyAddress === isNative ? (
                    <NativeCurrencyDisplay
                      isSelected={currencyIndexSelect === index}
                      setCurrencySymbol={setCurrencySymbol}
                      onClick={() => onHandleSelectOption(index)}
                    />
                  ) : (
                    <CurrencyDisplay
                      currencyInfo={_c}
                      isSelected={currencyIndexSelect === index}
                      setCurrencySymbol={setCurrencySymbol}
                      onClick={() => onHandleSelectOption(index)}
                    />
                  )}
                </>
              ))}
            </>
          ) : (
            <></>
          )}
          {!isMobile && (
            <AlignedCenterRow>
              <InputContainer>
                <StyledNumericalInput
                  className="token-amount-input"
                  disabled={false}
                  onUserInput={onHandleUserInput}
                  value={amountToAllocate}
                  placeholder="Enter Amount"
                  $loading={false}
                />
                <StyledClickableText onClick={() => setMax()} className="on-max">
                  MAX
                </StyledClickableText>
              </InputContainer>{' '}
              <NunitoText size="lg2" weight={600}>
                ≈&nbsp;&nbsp;{formatNumber(parseFloat(derpAmountToPurchase), NumberType.SwapTradeAmount)} DERP
              </NunitoText>
            </AlignedCenterRow>
          )}
        </PurchaseAmountRow>
        {isMobile && (
          <AlignedCenterRow className="purchase-input-area">
            <InputContainer>
              <StyledNumericalInput
                className="token-amount-input"
                disabled={false}
                onUserInput={onHandleUserInput}
                value={amountToAllocate}
                placeholder="Enter Amount"
                $loading={false}
              />
              <StyledClickableText onClick={() => setMax()} className="on-max">
                MAX
              </StyledClickableText>
            </InputContainer>{' '}
            <NunitoText className="derp-output" size="lg2" weight={600}>
              ≈&nbsp;&nbsp;{formatNumber(parseFloat(derpAmountToPurchase), NumberType.SwapTradeAmount)} DERP
            </NunitoText>
          </AlignedCenterRow>
        )}
      </ResponsiveFlex>
    </PurchaseOptionWrapper>
  )
}

const NativeCurrencyDisplay = ({
  isSelected,
  setCurrencySymbol,
  onClick,
}: {
  isSelected: boolean
  setCurrencySymbol: React.Dispatch<string>
  onClick: () => void
}) => {
  const { chainId } = useWeb3React()
  const nativeCurrencyData = useNativeCurrency(chainId)

  useEffect(() => {
    if (isSelected && nativeCurrencyData?.symbol) {
      setCurrencySymbol(nativeCurrencyData.symbol)
    }
  }, [nativeCurrencyData, isSelected])

  return (
    <PurchaseCurrencyButton isSelected={isSelected} onClick={onClick}>
      <Text>{nativeCurrencyData?.symbol}</Text>
    </PurchaseCurrencyButton>
  )
}

const CurrencyDisplay = ({
  currencyInfo,
  isSelected,
  setCurrencySymbol,
  onClick,
}: {
  currencyInfo: CurrenyInfo
  isSelected: boolean
  setCurrencySymbol: React.Dispatch<string>
  onClick: () => void
}) => {
  const currencyData = useCurrency(currencyInfo.currencyAddress)

  useEffect(() => {
    if (isSelected && currencyData?.symbol) {
      setCurrencySymbol(currencyData.symbol)
    }
  }, [currencyData, isSelected])

  return (
    <PurchaseCurrencyButton isSelected={isSelected} onClick={onClick}>
      <Text>{currencyData?.symbol}</Text>
    </PurchaseCurrencyButton>
  )
}
