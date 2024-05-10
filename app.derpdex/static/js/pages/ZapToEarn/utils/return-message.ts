import { Reason } from '../hooks/useZapToEarnAllowance'

export const returnMsg = (
  supportedToken: boolean,
  allowanceState: {
    isApproved: boolean
    Reason: string
  },
  step1: boolean,
  step2: boolean,
  tokenSymbol?: string
) => {
  if (!supportedToken) {
    return `Token is not supported`
  }
  if (!allowanceState.isApproved && allowanceState.Reason === Reason.ZERO_ALLOWANCE) {
    return `Approve ${tokenSymbol}`
  } else if (!allowanceState.isApproved && allowanceState.Reason === Reason.ALLOWANCE_EXCEEDED) {
    return `Increase ${tokenSymbol} Allowance`
  }

  if (step1 && step2) {
    return `Zap ${tokenSymbol}`
  } else if (step1 && !step2) {
    return `Insufficient ${tokenSymbol} Balance`
  } else {
    return `Enter ${tokenSymbol} amount to zap`
  }
}
