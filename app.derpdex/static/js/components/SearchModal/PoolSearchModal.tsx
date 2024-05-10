import { Currency, Token } from '@uniswap/sdk-core'
import ModalV2 from 'components/Modal/index-v2'
import TokenSafety from 'components/TokenSafety'
import { RawPoolInfoState } from 'pages/ZapToEarn/hooks/ZapToEarnPools.jotai'
import { memo, useCallback, useEffect, useState } from 'react'
import { useUserAddedTokens } from 'state/user/hooks'

import useLast from '../../hooks/useLast'
import { useWindowSize } from '../../hooks/useWindowSize'
import { PoolSearch } from './PoolSearch'

interface PoolSearchModalProps {
  isOpen: boolean
  onDismiss: () => void
  selectedCurrency?: Currency | null
  selectedPool?: RawPoolInfoState | null
  otherSelectedCurrency?: Currency | null
  showCommonBases?: boolean
  showCurrencyAmount?: boolean
  disableNonToken?: boolean
  onlyShowCurrenciesWithBalance?: boolean
}

enum PoolModalView {
  search,
  importToken,
  tokenSafety,
}

export default memo(function PoolSearchModal({
  isOpen,
  onDismiss,

  selectedCurrency,
  selectedPool,

  otherSelectedCurrency,
  showCommonBases = false,
  showCurrencyAmount = true,
  disableNonToken = false,
  onlyShowCurrenciesWithBalance = false,
}: PoolSearchModalProps) {
  const [modalView, setModalView] = useState<PoolModalView>(PoolModalView.search)
  const lastOpen = useLast(isOpen)
  const userAddedTokens = useUserAddedTokens()

  useEffect(() => {
    if (isOpen && !lastOpen) {
      setModalView(PoolModalView.search)
    }
  }, [isOpen, lastOpen])

  const showTokenSafetySpeedbump = (token: Token) => {
    setWarningToken(token)
    setModalView(PoolModalView.tokenSafety)
  }

  const handlePoolSelect = useCallback(
    (pool: RawPoolInfoState, hasWarning?: boolean) => {
      // if (hasWarning && pool.address && !userAddedTokens.find((token) => token.equals(currency))) {
      //   showTokenSafetySpeedbump(currency)
      // } else {
      //   onPoolSelect(pool)
      //   onDismiss()
      // }
      onDismiss()
    },
    [onDismiss, userAddedTokens]
  )
  // used for token safety
  const [warningToken, setWarningToken] = useState<Token | undefined>()

  const { height: windowHeight } = useWindowSize()
  // change min height if not searching
  let modalHeight: number | undefined = 80
  let content = null
  switch (modalView) {
    case PoolModalView.search:
      if (windowHeight) {
        // Converts pixel units to vh for Modal component
        modalHeight = Math.min(Math.round((680 / windowHeight) * 100), 80)
      }
      content = (
        <PoolSearch
          isOpen={isOpen}
          onDismiss={onDismiss}
          onPoolSelect={handlePoolSelect}
          selectedPool={selectedPool}
          otherSelectedCurrency={otherSelectedCurrency}
          showCommonBases={showCommonBases}
          showCurrencyAmount={showCurrencyAmount}
          disableNonToken={disableNonToken}
          onlyShowCurrenciesWithBalance={onlyShowCurrenciesWithBalance}
        />
      )
      break
    case PoolModalView.tokenSafety:
      modalHeight = undefined
      if (warningToken) {
        content = (
          <TokenSafety
            tokenAddress={warningToken.address}
            onContinue={() => handlePoolSelect(warningToken)}
            onCancel={() => setModalView(PoolModalView.search)}
            showCancel={true}
          />
        )
      }
      break
  }

  return (
    <ModalV2 showCloseButton={true} isOpen={isOpen} onDismiss={onDismiss} maxWidth={490} maxHeight={70} minHeight={67}>
      {content}
    </ModalV2>
  )
})
