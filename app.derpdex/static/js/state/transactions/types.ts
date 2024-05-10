import { TradeType } from '@uniswap/sdk-core'

import { VoteOption } from '../governance/types'

export interface SerializableTransactionReceipt {
  to: string
  from: string
  contractAddress: string
  transactionIndex: number
  blockHash: string
  transactionHash: string
  blockNumber: number
  status?: number
}

/**
 * Be careful adding to this enum, always assign a unique value (typescript will not prevent duplicate values).
 * These values is persisted in state and if you change the value it will cause errors
 */
export enum TransactionType {
  APPROVAL = 0,
  SWAP,
  DEPOSIT_LIQUIDITY_STAKING,
  WITHDRAW_LIQUIDITY_STAKING,
  CLAIM,
  VOTE,
  DELEGATE,
  WRAP,
  CREATE_V3_POOL,
  ADD_LIQUIDITY_V3_POOL,
  ADD_LIQUIDITY_V2_POOL,
  MIGRATE_LIQUIDITY_V3,
  COLLECT_FEES,
  REMOVE_LIQUIDITY_V3,
  SUBMIT_PROPOSAL,
  QUEUE,
  EXECUTE,
  BUY,
  SEND,
  RECEIVE,
  MINT,
  BURN,
  BORROW,
  REPAY,
  DEPLOY,
  CANCEL,

  BRIDGE_DEPOSIT,
  BRIDGE_DEPOSIT_MINT,
  BRIDGE_DEPOSIT_TRANSFER,
  BRIDGE_WITHDRAW,
  BRIDGE_WITHDRAW_OPBNB,
  BRIDGE_WITHDRAW_BURN,

  CLAIM_DERPPOINTS,
  REDEEM_DERPPOINTS,

  STAKE_LP,
  UNSTAKE_LP,

  DERP_BRIDGE_BRIDGE,
  DERP_BRIDGE_CLAIM,
}

interface BaseTransactionInfo {
  type: TransactionType
}

export interface VoteTransactionInfo extends BaseTransactionInfo {
  type: TransactionType.VOTE
  governorAddress: string
  proposalId: number
  decision: VoteOption
  reason: string
}

export interface QueueTransactionInfo extends BaseTransactionInfo {
  type: TransactionType.QUEUE
  governorAddress: string
  proposalId: number
}

export interface ExecuteTransactionInfo extends BaseTransactionInfo {
  type: TransactionType.EXECUTE
  governorAddress: string
  proposalId: number
}

export interface DelegateTransactionInfo extends BaseTransactionInfo {
  type: TransactionType.DELEGATE
  delegatee: string
}

export interface ApproveTransactionInfo extends BaseTransactionInfo {
  type: TransactionType.APPROVAL
  tokenAddress: string
  spender: string
}

interface BaseSwapTransactionInfo extends BaseTransactionInfo {
  type: TransactionType.SWAP
  tradeType: TradeType
  inputCurrencyId: string
  outputCurrencyId: string
}

export interface ExactInputSwapTransactionInfo extends BaseSwapTransactionInfo {
  tradeType: TradeType.EXACT_INPUT
  inputCurrencyAmountRaw: string
  expectedOutputCurrencyAmountRaw: string
  minimumOutputCurrencyAmountRaw: string
}
export interface ExactOutputSwapTransactionInfo extends BaseSwapTransactionInfo {
  tradeType: TradeType.EXACT_OUTPUT
  outputCurrencyAmountRaw: string
  expectedInputCurrencyAmountRaw: string
  maximumInputCurrencyAmountRaw: string
}

interface DepositLiquidityStakingTransactionInfo {
  type: TransactionType.DEPOSIT_LIQUIDITY_STAKING
  token0Address: string
  token1Address: string
}

interface WithdrawLiquidityStakingTransactionInfo {
  type: TransactionType.WITHDRAW_LIQUIDITY_STAKING
  token0Address: string
  token1Address: string
}

export interface WrapTransactionInfo {
  type: TransactionType.WRAP
  unwrapped: boolean
  currencyAmountRaw: string
  chainId?: number
}

export interface ClaimTransactionInfo {
  type: TransactionType.CLAIM
  recipient: string
  uniAmountRaw?: string
}

export interface CreateV3PoolTransactionInfo {
  type: TransactionType.CREATE_V3_POOL
  baseCurrencyId: string
  quoteCurrencyId: string
}

export interface AddLiquidityV3PoolTransactionInfo {
  type: TransactionType.ADD_LIQUIDITY_V3_POOL
  createPool: boolean
  baseCurrencyId: string
  quoteCurrencyId: string
  feeAmount: number
  expectedAmountBaseRaw: string
  expectedAmountQuoteRaw: string
}

export interface AddLiquidityV2PoolTransactionInfo {
  type: TransactionType.ADD_LIQUIDITY_V2_POOL
  baseCurrencyId: string
  quoteCurrencyId: string
  expectedAmountBaseRaw: string
  expectedAmountQuoteRaw: string
}

export interface MigrateV2LiquidityToV3TransactionInfo {
  type: TransactionType.MIGRATE_LIQUIDITY_V3
  baseCurrencyId: string
  quoteCurrencyId: string
  isFork: boolean
}

export interface CollectFeesTransactionInfo {
  type: TransactionType.COLLECT_FEES
  currencyId0: string
  currencyId1: string
  expectedCurrencyOwed0: string
  expectedCurrencyOwed1: string
}

export interface RemoveLiquidityV3TransactionInfo {
  type: TransactionType.REMOVE_LIQUIDITY_V3
  baseCurrencyId: string
  quoteCurrencyId: string
  expectedAmountBaseRaw: string
  expectedAmountQuoteRaw: string
}

interface SubmitProposalTransactionInfo {
  type: TransactionType.SUBMIT_PROPOSAL
}

interface BridgeDeposit {
  type: TransactionType.BRIDGE_DEPOSIT
  symbol: string
  amount: string
}

interface BridgeDepositTransfer {
  type: TransactionType.BRIDGE_DEPOSIT_TRANSFER
  symbol: string
  amount: string
}

interface BridgeDepositMint {
  type: TransactionType.BRIDGE_DEPOSIT_MINT
  symbol: string
  amount: string
}

interface BridgeWithdraw {
  type: TransactionType.BRIDGE_WITHDRAW
  symbol: string
  amount: string
}

interface BridgeWithdrawOpBNB {
  type: TransactionType.BRIDGE_WITHDRAW_OPBNB
  symbol: string
  amount: string
}

interface BridgeWithdrawBurn {
  type: TransactionType.BRIDGE_WITHDRAW_BURN
  symbol: string
  amount: string
}

interface ClaimDerpPointsInfo {
  type: TransactionType.CLAIM_DERPPOINTS
}

interface RedeemDerpPoints {
  type: TransactionType.REDEEM_DERPPOINTS
}

interface StakeLiquidity {
  type: TransactionType.STAKE_LP
  positionId: string
}

interface UnstakeLiquidity {
  type: TransactionType.UNSTAKE_LP
  positionId: string
}

interface DerpBridgeDeposit {
  type: TransactionType.DERP_BRIDGE_BRIDGE
  symbol: string
  amount: string
}

interface DerpBridgeClaim {
  type: TransactionType.DERP_BRIDGE_CLAIM
  symbol: string
  amount: string
}

export type TransactionInfo =
  | ApproveTransactionInfo
  | ExactOutputSwapTransactionInfo
  | ExactInputSwapTransactionInfo
  | ClaimTransactionInfo
  | VoteTransactionInfo
  | QueueTransactionInfo
  | ExecuteTransactionInfo
  | DelegateTransactionInfo
  | DepositLiquidityStakingTransactionInfo
  | WithdrawLiquidityStakingTransactionInfo
  | WrapTransactionInfo
  | CreateV3PoolTransactionInfo
  | AddLiquidityV3PoolTransactionInfo
  | AddLiquidityV2PoolTransactionInfo
  | MigrateV2LiquidityToV3TransactionInfo
  | CollectFeesTransactionInfo
  | RemoveLiquidityV3TransactionInfo
  | SubmitProposalTransactionInfo
  | BridgeDeposit
  | BridgeDepositMint
  | BridgeDepositTransfer
  | BridgeWithdraw
  | BridgeWithdrawOpBNB
  | BridgeWithdrawBurn
  | ClaimDerpPointsInfo
  | RedeemDerpPoints
  | StakeLiquidity
  | UnstakeLiquidity
  | DerpBridgeDeposit
  | DerpBridgeClaim

export interface TransactionDetails {
  hash: string
  receipt?: SerializableTransactionReceipt
  lastCheckedBlockNumber?: number
  addedTime: number
  confirmedTime?: number
  from: string
  info: TransactionInfo
}
