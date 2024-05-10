import '@fontsource/nunito' // Defaults to weight 400

import { Trans } from '@lingui/macro'
import { Box } from '@mui/material'
import { Currency } from '@uniswap/sdk-core'
import { useWeb3React } from '@web3-react/core'
import DerpHappy from 'assets/images/derp-happy.png'
import TxSuccessDerpRemoval from 'assets/images/tx-success.png'
import WojakSad from 'assets/images/wojak-sad.png'
import { NunitoText } from 'components/CustomFonts/Nunito'
import { ExplorerList } from 'components/ExplorerLink'
import { getChainInfo } from 'constants/chainInfo'
import { SupportedChainId, SupportedL2ChainId } from 'constants/chains'
import useCurrencyLogoURIs from 'lib/hooks/useCurrencyLogoURIs'
import { useIsMobile } from 'nft/hooks'
import { ReactNode, useCallback, useState } from 'react'
import { AlertCircle, ArrowUpCircle, CheckCircle } from 'react-feather'
import { useNavigate } from 'react-router-dom'
import { useIsTransactionConfirmed, useTransaction } from 'state/transactions/hooks'
import styled, { useTheme } from 'styled-components/macro'
import { isL2ChainId } from 'utils/chains'
import { ExplorerDataType, getExplorerLink } from 'utils/getExplorerLink'

import Circle from '../../assets/images/blue-loader.svg'
import { ExternalLink, ThemedText } from '../../theme'
import { CloseIcon, CustomLightSpinner } from '../../theme'
import { TransactionSummary } from '../AccountDetails/TransactionSummary'
import { ButtonLight, ButtonPrimary, DDButtonPrimary } from '../Button'
import { AutoColumn, ColumnCenter } from '../Column'
import Modal from '../Modal'
import Row, { RowBetween, RowFixed } from '../Row'
import AnimatedConfirmation from './AnimatedConfirmation'
const Wrapper = styled.div`
  position: relative;
  // background-color: ${({ theme }) => theme.backgroundSurface};
  border-radius: 8px;
  // outline: 1px solid ${({ theme }) => theme.backgroundOutline};
  width: 100%;
  // padding: 16px;
`

const BottomSection = styled(AutoColumn)`
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
`

const ConfirmedIcon = styled(ColumnCenter)<{ inline?: boolean; transactionSuccess?: boolean }>`
  padding: ${({ inline }) => (inline ? '20px 0' : '32px 0;')};
  ${({ transactionSuccess }) => transactionSuccess && `display: none;`}
`

const StyledLogo = styled.img`
  height: 16px;
  width: 16px;
  margin-left: 6px;
`

const ConfirmationModalContentWrapper = styled(AutoColumn)`
  padding-bottom: 12px;
`
const ExplorerHolder = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  background: #413f3f;
  border-radius: 8px;
  width: 231px;
  height: 28px;
  font-size: 14px;
  color: white;
  font-weight: 600;
`

const ColumnFixed = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  * {
    font-family: 'Nunito' !important;
  }
`

const BoldText = styled.div`
  color: black;
  font-weight: 600;
  font-size: 14px;
`

function ConfirmationPendingContent({
  onDismiss,
  pendingText,
  inline,
}: {
  onDismiss: () => void
  pendingText: ReactNode
  inline?: boolean // not in modal
}) {
  return (
    <Wrapper className="override-modal" id="overridable-modal">
      <AutoColumn gap="md">
        {!inline && (
          <RowBetween>
            <div />
            <CloseIcon onClick={onDismiss} />
          </RowBetween>
        )}
        <ConfirmedIcon inline={inline}>
          <CustomLightSpinner src={Circle} alt="loader" size={inline ? '40px' : '90px'} />
        </ConfirmedIcon>
        <AutoColumn gap="md" justify="center">
          <ThemedText.SubHeaderLarge color="textPrimary" textAlign="center">
            <Trans>Waiting for confirmation</Trans>
          </ThemedText.SubHeaderLarge>
          <ThemedText.SubHeader color="textPrimary" textAlign="center">
            {pendingText}
          </ThemedText.SubHeader>
          <ThemedText.SubHeaderSmall color="textSecondary" textAlign="center" marginBottom="12px">
            <Trans>Confirm this transaction in your wallet</Trans>
          </ThemedText.SubHeaderSmall>
        </AutoColumn>
      </AutoColumn>
    </Wrapper>
  )
}
function TransactionSubmittedContent({
  onDismiss,
  chainId,
  hash,
  currencyToAdd,
  inline,
}: {
  onDismiss: () => void
  hash?: string
  chainId: number
  currencyToAdd?: Currency
  inline?: boolean // not in modal
}) {
  const theme = useTheme()
  console.log('did you enter', hash)
  const { connector } = useWeb3React()

  const token = currencyToAdd?.wrapped
  const logoURL = useCurrencyLogoURIs(token)[0]

  const [success, setSuccess] = useState<boolean | undefined>()

  const addToken = useCallback(() => {
    if (!token?.symbol || !connector.watchAsset) return
    connector
      .watchAsset({
        address: token.address,
        symbol: token.symbol,
        decimals: token.decimals,
        image: logoURL,
      })
      .then(() => setSuccess(true))
      .catch(() => setSuccess(false))
  }, [connector, logoURL, token])

  return (
    <Wrapper>
      <AutoColumn>
        {!inline && (
          <RowBetween>
            <div />
            <CloseIcon onClick={onDismiss} />
          </RowBetween>
        )}
        <ConfirmedIcon inline={inline}>
          <ArrowUpCircle strokeWidth={1} size={inline ? '40px' : '75px'} color={theme.accentActive} />
        </ConfirmedIcon>
        <ConfirmationModalContentWrapper gap="md" justify="center">
          <ThemedText.MediumHeader textAlign="center">
            <Trans>Transaction submitted</Trans>
          </ThemedText.MediumHeader>
          {currencyToAdd && connector.watchAsset && (
            <ButtonLight mt="12px" padding="6px 12px" width="fit-content" onClick={addToken}>
              {!success ? (
                <RowFixed>
                  <Trans>Add {currencyToAdd.symbol}</Trans>
                </RowFixed>
              ) : (
                <RowFixed>
                  <Trans>Added {currencyToAdd.symbol} </Trans>
                  <CheckCircle size="16px" stroke={theme.accentSuccess} style={{ marginLeft: '6px' }} />
                </RowFixed>
              )}
            </ButtonLight>
          )}
          <ButtonPrimary onClick={onDismiss} style={{ margin: '20px 0 0 0' }} data-testid="dismiss-tx-confirmation">
            <ThemedText.HeadlineSmall color={theme.accentTextLightPrimary}>
              {inline ? <Trans>Return</Trans> : <Trans>Close</Trans>}
            </ThemedText.HeadlineSmall>
          </ButtonPrimary>
          {chainId && hash && (
            <ExternalLink href={getExplorerLink(chainId, hash, ExplorerDataType.TRANSACTION)}>
              <ThemedText.Link color={theme.accentAction}>
                <Trans>View on {chainId === SupportedChainId.MAINNET ? 'Etherscan' : 'Block Explorer'}</Trans>
              </ThemedText.Link>
            </ExternalLink>
          )}
        </ConfirmationModalContentWrapper>
      </AutoColumn>
    </Wrapper>
  )
}

type AdjustMargin = {
  transactionSuccess?: boolean
}
const TitleDiv = styled.div<AdjustMargin>`
  text-align: center;
  color: #000;
  text-align: center;
  font-family: Inter !important;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;

  @media only screen and (max-width: 768px) {
    font-size: 20px !important;
  }

  ${({ transactionSuccess }) => transactionSuccess && `margin-top: 90px;`}
`

export enum ModalType {
  REMOVE_LIQUIDITY = 'Remove_Liquidity',
  INCREASE_LIQUIDITY = 'Increase_Liquidity',
}
type AutoType = {
  modalType?: string
}
const OverridableAutoColumn = styled(AutoColumn)<AutoType>`
  ${({ modalType }) => {
    if (modalType === ModalType.REMOVE_LIQUIDITY || modalType === ModalType.INCREASE_LIQUIDITY) {
      return `
        padding: 25px 78px 32px 78px;
        .row-box {
          width: 343px;
        }

        @media only screen and (max-width: 768px) {
          padding: 20px 12px;
          .row-box {
            width: 322px;
          }
        }

      `
    } else {
      return null
    }
  }}
`

const ConfirmImg = styled.img`
  min-width: 135px;
`

export function ConfirmationModalContentLiquidity({
  title,
  bottomContent,
  onDismiss,
  topContent,
  headerContent,
  disableCloseButton = false,
}: {
  title?: ReactNode
  onDismiss: () => void
  topContent: () => ReactNode
  bottomContent?: () => ReactNode
  headerContent?: () => ReactNode
  disableCloseButton?: boolean
}) {
  return (
    <Wrapper>
      <AutoColumn>
        <Row>
          {headerContent?.()}
          <Row justify="center" marginLeft="24px">
            {title && <ThemedText.SubHeader>{title}</ThemedText.SubHeader>}
          </Row>
          {!disableCloseButton && <CloseIcon onClick={onDismiss} data-testid="confirmation-close-icon" />}
        </Row>
        {topContent()}
      </AutoColumn>
      {bottomContent && <BottomSection gap="12px">{bottomContent()}</BottomSection>}
    </Wrapper>
  )
}

const StepperHorizontal = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 4px;
  justify-content: space-between;
  align-items: center;
  margin-top: 33px;

  @media only screen and (max-width: 768px) {
    justify-content: flex-start !important;
  }
`

const Dot = styled.div<{ active: boolean }>`
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  border-radius: 50%;
  background-color: ${(props) => (props.active ? '#FF5656' : '#F5F5F5')};
`

const StepConnector = styled.div<{ active: boolean }>`
  flex-grow: 1;
  height: 4px;
  background-color: ${(props) => (props.active ? '#FF5656' : '#F5F5F5')};
  width: 150px;

  @media only screen and (max-width: 768px) {
    width: 135px;
  }
`
const StepContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`

const LoadingStepper: React.FC<{
  hash?: string
  confirmed: boolean
  transactionSuccess: boolean
}> = ({ hash, confirmed, transactionSuccess }) => {
  const isFirstStepActive = true
  const isSecondStepActive = isFirstStepActive && confirmed
  const isThirdStepActive = transactionSuccess && isSecondStepActive

  return (
    <StepperHorizontal>
      <StepContainer>
        <Dot active={isFirstStepActive} />
        <StepConnector active={isFirstStepActive} />
      </StepContainer>
      <StepContainer>
        <Dot active={isSecondStepActive} />
        <StepConnector active={isSecondStepActive} />
      </StepContainer>
      <StepContainer>
        <Dot active={isThirdStepActive} />
      </StepContainer>
    </StepperHorizontal>
  )
}

const AbsoluteHeaderImg = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  transform: translateY(-137px);

  img {
    width: 231px;
  }
`

const AbsoluteButtonBottom = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  transform: translateY(39px);
`

const ButtonDark = styled(DDButtonPrimary)`
  border-radius: 12px !important;
  background: #000 !important;
  max-width: 236px !important;
  padding: 16px 40px !important;
`

function L2Content({
  onDismiss,
  chainId,
  hash,
  pendingText,
  inline,
  title,
  modalType,
}: {
  onDismiss: () => void
  hash?: string
  chainId: SupportedL2ChainId
  currencyToAdd?: Currency
  pendingText: ReactNode
  inline?: boolean // not in modal
  title?: string
  modalType?: string
}) {
  const isMobile = useIsMobile()
  const theme = useTheme()
  const navigate = useNavigate()

  const transaction = useTransaction(hash)
  const confirmed = useIsTransactionConfirmed(hash)
  const transactionSuccess = transaction?.receipt?.status === 1

  // convert unix time difference to seconds
  const secondsToConfirm = transaction?.confirmedTime
    ? (transaction.confirmedTime - transaction.addedTime) / 1000
    : undefined

  const info = getChainInfo(chainId)

  return (
    <Wrapper>
      {transactionSuccess && (
        <AbsoluteHeaderImg>
          <img src={TxSuccessDerpRemoval} alt="derp-success" />
        </AbsoluteHeaderImg>
      )}
      <OverridableAutoColumn modalType={modalType}>
        {/* {!inline && hash && (
          <RowBetween mb="16px">
            <Badge>
              <RowFixed>
                <StyledLogo src={info.logoUrl} style={{ margin: '0 8px 0 0' }} />
                {info.label}
              </RowFixed>
            </Badge>
            <CloseIcon onClick={onDismiss} />
          </RowBetween>
        )} */}
        <Box className="row-box">
          {title ? (
            <TitleDiv transactionSuccess={transactionSuccess}>{title}</TitleDiv>
          ) : (
            <TitleDiv transactionSuccess={transactionSuccess}></TitleDiv>
          )}
          <LoadingStepper hash={hash} confirmed={confirmed} transactionSuccess={transactionSuccess} />
          <ConfirmedIcon transactionSuccess={transactionSuccess} inline={inline}>
            {confirmed ? (
              transactionSuccess ? (
                // <CheckCircle strokeWidth={1} size={inline ? '40px' : '90px'} color={theme.accentSuccess} />
                <Box display="none">
                  <AnimatedConfirmation />
                </Box>
              ) : (
                <AlertCircle strokeWidth={1} size={inline ? '40px' : '90px'} color={theme.accentFailure} />
              )
            ) : (
              <>
                {modalType === ModalType.INCREASE_LIQUIDITY && <ConfirmImg src={DerpHappy} alt="derp-happy" />}
                {modalType === ModalType.REMOVE_LIQUIDITY && <ConfirmImg src={WojakSad} alt="wojak-sad" />}
              </>
              // <CustomLightSpinner src={Circle} alt="loader" size={inline ? '40px' : '90px'} />
            )}
          </ConfirmedIcon>
          <AutoColumn gap="md" justify="center">
            <NunitoText
              style={{
                textAlign: 'center',
              }}
              size="xxl"
              weight={600}
            >
              {!hash ? (
                <Trans>Confirm transaction in wallet</Trans>
              ) : !confirmed ? (
                <Trans>Transaction Submitted</Trans>
              ) : transactionSuccess ? (
                <Box display="none">
                  <Trans>Success</Trans>
                </Box>
              ) : (
                <Trans>Error</Trans>
              )}
            </NunitoText>
            <ThemedText.BodySecondary textAlign="center">
              <NunitoText>{transaction ? <TransactionSummary info={transaction.info} /> : pendingText}</NunitoText>
            </ThemedText.BodySecondary>
            {chainId && hash && transactionSuccess && <ExplorerList chainId={chainId} hash={hash} />}
            {secondsToConfirm && (
              <ThemedText.SubHeaderSmall
                color={theme.textTertiary}
                marginTop="20px"
                paddingBottom={isMobile ? '20px' : 'unset'}
              >
                <NunitoText>
                  <Trans>Transaction completed in </Trans>
                  <span style={{ fontWeight: 500, marginLeft: '4px', color: theme.textPrimary }}>
                    {secondsToConfirm} seconds 🎉
                  </span>
                </NunitoText>
              </ThemedText.SubHeaderSmall>
            )}

            {/* {transactionSuccess && (
              <DDButtonPrimary
                onClick={() => {
                  navigate('/pools#myPools')
                }}
                style={{ margin: '4px 0 0 0' }}
              >
                <ThemedText.SubHeaderLarge style={{ color: 'white', fontWeight: '600', fontSize: '20px' }}>
                  {inline && <Trans>Return</Trans>}
                </ThemedText.SubHeaderLarge>
              </DDButtonPrimary>
            )} */}
            {inline && (
              <DDButtonPrimary onClick={onDismiss} style={{ margin: '4px 0 0 0' }}>
                <ThemedText.SubHeaderLarge style={{ color: 'white', fontWeight: '600', fontSize: '20px' }}>
                  {inline && <Trans>Return</Trans>}
                </ThemedText.SubHeaderLarge>
              </DDButtonPrimary>
            )}
          </AutoColumn>
        </Box>
      </OverridableAutoColumn>
      {transactionSuccess && !inline && (
        <AbsoluteButtonBottom>
          <ButtonDark
            onClick={() => {
              navigate('/pools#myPools')
            }}
          >
            <ThemedText.SubHeaderLarge style={{ color: 'white', fontWeight: '600', fontSize: '20px' }}>
              <NunitoText>
                <Trans>View My Pools</Trans>
              </NunitoText>
            </ThemedText.SubHeaderLarge>
          </ButtonDark>
        </AbsoluteButtonBottom>
      )}
    </Wrapper>
  )
}

interface ConfirmationModalProps {
  isOpen: boolean
  onDismiss: () => void
  hash?: string
  reviewContent: () => ReactNode
  attemptingTxn: boolean
  pendingText: ReactNode
  currencyToAdd?: Currency
  title?: string
  modalType?: string
}

export default function TransactionConfirmationModalLiquidity({
  isOpen,
  onDismiss,
  attemptingTxn,
  hash,
  pendingText,
  reviewContent,
  currencyToAdd,
  title,
  modalType,
}: ConfirmationModalProps) {
  const { chainId } = useWeb3React()

  if (!chainId) return null
  // confirmation screen
  return (
    <Modal isOpen={isOpen} $scrollOverlay={true} onDismiss={onDismiss} maxHeight={90}>
      {isL2ChainId(chainId) && (hash || attemptingTxn) ? (
        <L2Content
          modalType={modalType}
          title={title}
          chainId={chainId}
          hash={hash}
          onDismiss={onDismiss}
          pendingText={pendingText}
        />
      ) : attemptingTxn ? (
        <ConfirmationPendingContent onDismiss={onDismiss} pendingText={pendingText} />
      ) : hash ? (
        <TransactionSubmittedContent
          chainId={chainId}
          hash={hash}
          onDismiss={onDismiss}
          currencyToAdd={currencyToAdd}
        />
      ) : (
        reviewContent()
      )}
    </Modal>
  )
}
