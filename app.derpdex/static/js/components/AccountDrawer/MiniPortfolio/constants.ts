import { t } from '@lingui/macro'
import { TransactionStatus } from 'graphql/data/__generated__/types-and-hooks'
import { TransactionType } from 'state/transactions/types'

// use even number because rows are in groups of 2
export const DEFAULT_NFT_QUERY_AMOUNT = 26

const TransactionTitleTable: { [key in TransactionType]: { [state in TransactionStatus]: string } } = {
  [TransactionType.SWAP]: {
    [TransactionStatus.Pending]: t`Swapping`,
    [TransactionStatus.Confirmed]: t`Swapped`,
    [TransactionStatus.Failed]: t`Swap failed`,
  },
  [TransactionType.WRAP]: {
    [TransactionStatus.Pending]: t`Wrapping`,
    [TransactionStatus.Confirmed]: t`Wrapped`,
    [TransactionStatus.Failed]: t`Wrap failed`,
  },
  [TransactionType.ADD_LIQUIDITY_V3_POOL]: {
    [TransactionStatus.Pending]: t`Adding liquidity`,
    [TransactionStatus.Confirmed]: t`Added liquidity`,
    [TransactionStatus.Failed]: t`Add liquidity failed`,
  },
  [TransactionType.REMOVE_LIQUIDITY_V3]: {
    [TransactionStatus.Pending]: t`Removing liquidity`,
    [TransactionStatus.Confirmed]: t`Removed liquidity`,
    [TransactionStatus.Failed]: t`Remove liquidity failed`,
  },
  [TransactionType.CREATE_V3_POOL]: {
    [TransactionStatus.Pending]: t`Creating pool`,
    [TransactionStatus.Confirmed]: t`Created pool`,
    [TransactionStatus.Failed]: t`Create pool failed`,
  },
  [TransactionType.COLLECT_FEES]: {
    [TransactionStatus.Pending]: t`Collecting fees`,
    [TransactionStatus.Confirmed]: t`Collected fees`,
    [TransactionStatus.Failed]: t`Collect fees failed`,
  },
  [TransactionType.APPROVAL]: {
    [TransactionStatus.Pending]: t`Approving`,
    [TransactionStatus.Confirmed]: t`Approved`,
    [TransactionStatus.Failed]: t`Approval failed`,
  },
  [TransactionType.CLAIM]: {
    [TransactionStatus.Pending]: t`Claiming`,
    [TransactionStatus.Confirmed]: t`Claimed`,
    [TransactionStatus.Failed]: t`Claim failed`,
  },
  [TransactionType.BUY]: {
    [TransactionStatus.Pending]: t`Buying`,
    [TransactionStatus.Confirmed]: t`Bought`,
    [TransactionStatus.Failed]: t`Buy failed`,
  },
  [TransactionType.SEND]: {
    [TransactionStatus.Pending]: t`Sending`,
    [TransactionStatus.Confirmed]: t`Sent`,
    [TransactionStatus.Failed]: t`Send failed`,
  },
  [TransactionType.RECEIVE]: {
    [TransactionStatus.Pending]: t`Receiving`,
    [TransactionStatus.Confirmed]: t`Received`,
    [TransactionStatus.Failed]: t`Receive failed`,
  },
  [TransactionType.MINT]: {
    [TransactionStatus.Pending]: t`Minting`,
    [TransactionStatus.Confirmed]: t`Minted`,
    [TransactionStatus.Failed]: t`Mint failed`,
  },
  [TransactionType.BURN]: {
    [TransactionStatus.Pending]: t`Burning`,
    [TransactionStatus.Confirmed]: t`Burned`,
    [TransactionStatus.Failed]: t`Burn failed`,
  },
  [TransactionType.VOTE]: {
    [TransactionStatus.Pending]: t`Voting`,
    [TransactionStatus.Confirmed]: t`Voted`,
    [TransactionStatus.Failed]: t`Vote failed`,
  },
  [TransactionType.QUEUE]: {
    [TransactionStatus.Pending]: t`Queuing`,
    [TransactionStatus.Confirmed]: t`Queued`,
    [TransactionStatus.Failed]: t`Queue failed`,
  },
  [TransactionType.EXECUTE]: {
    [TransactionStatus.Pending]: t`Executing`,
    [TransactionStatus.Confirmed]: t`Executed`,
    [TransactionStatus.Failed]: t`Execute failed`,
  },
  [TransactionType.BORROW]: {
    [TransactionStatus.Pending]: t`Borrowing`,
    [TransactionStatus.Confirmed]: t`Borrowed`,
    [TransactionStatus.Failed]: t`Borrow failed`,
  },
  [TransactionType.REPAY]: {
    [TransactionStatus.Pending]: t`Repaying`,
    [TransactionStatus.Confirmed]: t`Repaid`,
    [TransactionStatus.Failed]: t`Repay failed`,
  },
  [TransactionType.DEPLOY]: {
    [TransactionStatus.Pending]: t`Deploying`,
    [TransactionStatus.Confirmed]: t`Deployed`,
    [TransactionStatus.Failed]: t`Deploy failed`,
  },
  [TransactionType.CANCEL]: {
    [TransactionStatus.Pending]: t`Cancelling`,
    [TransactionStatus.Confirmed]: t`Cancelled`,
    [TransactionStatus.Failed]: t`Cancel failed`,
  },
  [TransactionType.DELEGATE]: {
    [TransactionStatus.Pending]: t`Delegating`,
    [TransactionStatus.Confirmed]: t`Delegated`,
    [TransactionStatus.Failed]: t`Delegate failed`,
  },
  [TransactionType.DEPOSIT_LIQUIDITY_STAKING]: {
    [TransactionStatus.Pending]: t`Depositing`,
    [TransactionStatus.Confirmed]: t`Deposited`,
    [TransactionStatus.Failed]: t`Deposit failed`,
  },
  [TransactionType.WITHDRAW_LIQUIDITY_STAKING]: {
    [TransactionStatus.Pending]: t`Withdrawing`,
    [TransactionStatus.Confirmed]: t`Withdrew`,
    [TransactionStatus.Failed]: t`Withdraw failed`,
  },
  [TransactionType.ADD_LIQUIDITY_V2_POOL]: {
    [TransactionStatus.Pending]: t`Adding V2 liquidity`,
    [TransactionStatus.Confirmed]: t`Added V2 liquidity`,
    [TransactionStatus.Failed]: t`Add V2 liquidity failed`,
  },
  [TransactionType.MIGRATE_LIQUIDITY_V3]: {
    [TransactionStatus.Pending]: t`Migrating liquidity`,
    [TransactionStatus.Confirmed]: t`Migrated liquidity`,
    [TransactionStatus.Failed]: t`Migrate liquidity failed`,
  },
  [TransactionType.SUBMIT_PROPOSAL]: {
    [TransactionStatus.Pending]: t`Submitting proposal`,
    [TransactionStatus.Confirmed]: t`Submitted proposal`,
    [TransactionStatus.Failed]: t`Submit proposal failed`,
  },
  [TransactionType.BRIDGE_DEPOSIT]: {
    [TransactionStatus.Pending]: t`Submitting Deposit to zkSync Era`,
    [TransactionStatus.Confirmed]: t`Deposit Submitted (Up to 5 minutes)`,
    [TransactionStatus.Failed]: t`Failed to deposit from L1 to L2 on DerpDex Token Bridge`,
  },
  [TransactionType.BRIDGE_DEPOSIT_TRANSFER]: {
    [TransactionStatus.Pending]: t`Transfer inscription for wrapping into ERC-20 tokens `,
    [TransactionStatus.Confirmed]: t`Transferring process is submitted`,
    [TransactionStatus.Failed]: t`Failed to transfer inscription`,
  },
  [TransactionType.BRIDGE_DEPOSIT_MINT]: {
    [TransactionStatus.Pending]: t`Minting ERC-20 tokens`,
    [TransactionStatus.Confirmed]: t`Minting process is submitted`,
    [TransactionStatus.Failed]: t`Failed to mint ERC-20 tokens`,
  },
  [TransactionType.BRIDGE_WITHDRAW]: {
    [TransactionStatus.Pending]: t`Submitting Withdrawal to Mainnet`,
    [TransactionStatus.Confirmed]: t`Withdrawal Submitted (Up to 24H)`,
    [TransactionStatus.Failed]: t`Failed to withdraw from L2 to L1 DerpDex Token Bridge`,
  },
  [TransactionType.BRIDGE_WITHDRAW_OPBNB]: {
    [TransactionStatus.Pending]: t`Submitting Withdrawal to Mainnet`,
    [TransactionStatus.Confirmed]: t`Withdrawal Submitted (Up to 7D)`,
    [TransactionStatus.Failed]: t`Failed to withdraw from L2 to L1 DerpDex Token Bridge`,
  },
  [TransactionType.BRIDGE_WITHDRAW_BURN]: {
    [TransactionStatus.Pending]: t`Submitting Unwrap transactions to Mainnet`,
    [TransactionStatus.Confirmed]: t`Unwrap transaction is submitted `,
    [TransactionStatus.Failed]: t`Failed to unwrap from ERC-20 token to inscription`,
  },
  [TransactionType.CLAIM_DERPPOINTS]: {
    [TransactionStatus.Pending]: t`Submitting Claim DerpPoints to Mainnet`,
    [TransactionStatus.Confirmed]: t`DerpPoints claimed`,
    [TransactionStatus.Failed]: t`Failed to claim DerpPoints`,
  },
  [TransactionType.REDEEM_DERPPOINTS]: {
    [TransactionStatus.Pending]: t`Submitting Redeem DerpPoints to Mainnet`,
    [TransactionStatus.Confirmed]: t`DerpPoints Redeemed`,
    [TransactionStatus.Failed]: t`Failed to redeem DerpPoints`,
  },
  [TransactionType.STAKE_LP]: {
    [TransactionStatus.Pending]: t`Staking Position on Yield Farming`,
    [TransactionStatus.Confirmed]: t`Position Staked on Yield Farming`,
    [TransactionStatus.Failed]: t`Failed to Stake on Yield Farming`,
  },
  [TransactionType.UNSTAKE_LP]: {
    [TransactionStatus.Pending]: t`Unstaking Position on Yield Farming`,
    [TransactionStatus.Confirmed]: t`Position Unstaked from Yield Farming`,
    [TransactionStatus.Failed]: t`Failed to Unstake from Yield Farming`,
  },

  [TransactionType.DERP_BRIDGE_BRIDGE]: {
    [TransactionStatus.Pending]: t`Submitting Bridge transaction`,
    [TransactionStatus.Confirmed]: t`Bridge transaction submitted`,
    [TransactionStatus.Failed]: t`Failed to submit Bridge transaction`,
  },

  [TransactionType.DERP_BRIDGE_CLAIM]: {
    [TransactionStatus.Pending]: t`Submitting Claim transaction`,
    [TransactionStatus.Confirmed]: t`Claim transaction submitted`,
    [TransactionStatus.Failed]: t`Failed to submit Claim transaction`,
  },
}

const AlternateTransactionTitleTable: { [key in TransactionType]?: { [state in TransactionStatus]: string } } = {
  [TransactionType.WRAP]: {
    [TransactionStatus.Pending]: t`Unwrapping`,
    [TransactionStatus.Confirmed]: t`Unwrapped`,
    [TransactionStatus.Failed]: t`Unwrap failed`,
  },
}

export function getActivityTitle(type: TransactionType, status: TransactionStatus, alternate?: boolean) {
  if (alternate) {
    const alternateTitle = AlternateTransactionTitleTable[type]
    if (alternateTitle !== undefined) return alternateTitle[status]
  }
  return TransactionTitleTable[type][status]
}
