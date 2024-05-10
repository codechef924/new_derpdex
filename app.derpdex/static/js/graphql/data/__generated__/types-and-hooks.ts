import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T;
export type InputMaybe<T> = T;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /**
   * The `AWSJSON` scalar type provided by AWS AppSync, represents a JSON string that
   * complies with [RFC 8259](https://tools.ietf.org/html/rfc8259).  Maps like
   * "**{\\"upvotes\\": 10}**", lists like "**[1,2,3]**", and scalar values like
   * "**\\"AWSJSON example string\\"**", "**1**", and "**true**" are accepted as
   * valid JSON and will automatically be parsed and loaded in the resolver mapping
   * templates as Maps, Lists, or Scalar values rather than as the literal input
   * strings.  Invalid JSON strings like "**{a: 1}**", "**{'a': 1}**" and "**Unquoted
   * string**" will throw GraphQL validation errors.
   */
  AWSJSON: any;
};

export type ActivityDetails = SwapOrderDetails | TransactionDetails;

/**   deprecated and replaced with TransactionType, please do not use this */
export enum ActivityType {
  Approve = 'APPROVE',
  Borrow = 'BORROW',
  Burn = 'BURN',
  Cancel = 'CANCEL',
  Claim = 'CLAIM',
  Deployment = 'DEPLOYMENT',
  Lend = 'LEND',
  Mint = 'MINT',
  Nft = 'NFT',
  Receive = 'RECEIVE',
  Repay = 'REPAY',
  Send = 'SEND',
  Stake = 'STAKE',
  Swap = 'SWAP',
  SwapOrder = 'SWAP_ORDER',
  Staking = 'Staking',
  Unknown = 'UNKNOWN',
  Unstake = 'UNSTAKE',
  Withdraw = 'WITHDRAW',
  Market = 'market',
  Money = 'money'
}

export type Amount = IAmount & {
  __typename?: 'Amount';
  currency?: Maybe<Currency>;
  id: Scalars['ID'];
  value: Scalars['Float'];
};

export type AmountChange = {
  __typename?: 'AmountChange';
  absolute?: Maybe<Amount>;
  id: Scalars['ID'];
  percentage?: Maybe<Amount>;
};

export type AssetActivity = {
  __typename?: 'AssetActivity';
  /** @deprecated use assetChanges field in details */
  assetChanges: Array<Maybe<AssetChange>>;
  chain: Chain;
  details: ActivityDetails;
  /** @deprecated not required, remove usage */
  gasUsed?: Maybe<Scalars['Float']>;
  id: Scalars['ID'];
  timestamp: Scalars['Int'];
  /** @deprecated use fields from details */
  transaction: Transaction;
  /** @deprecated use type field in details */
  type: ActivityType;
};

export type AssetChange = NftApproval | NftApproveForAll | NftTransfer | TokenApproval | TokenTransfer;

export enum Chain {
  Arbitrum = 'ARBITRUM',
  BaseMainnet = 'BASE_MAINNET',
  BaseTestnet = 'BASE_TESTNET',
  Bnb = 'BNB',
  BnbTestnet = 'BNB_TESTNET',
  Celo = 'CELO',
  Ethereum = 'ETHEREUM',
  EthereumGoerli = 'ETHEREUM_GOERLI',
  OpbnbMainnet = 'OPBNB_MAINNET',
  OpbnbTestnet = 'OPBNB_TESTNET',
  Optimism = 'OPTIMISM',
  Polygon = 'POLYGON',
  UnknownChain = 'UNKNOWN_CHAIN',
  ZksyncMainnet = 'ZKSYNC_MAINNET',
  ZksyncTestnet = 'ZKSYNC_TESTNET'
}

export enum CollectionSortableField {
  Volume = 'VOLUME'
}

export type ContractInput = {
  address?: InputMaybe<Scalars['String']>;
  chain: Chain;
};

export enum Currency {
  Eth = 'ETH',
  Matic = 'MATIC',
  Usd = 'USD'
}

export type Dimensions = {
  __typename?: 'Dimensions';
  height?: Maybe<Scalars['Float']>;
  id: Scalars['ID'];
  width?: Maybe<Scalars['Float']>;
};

export type EnsEntry = {
  __typename?: 'EnsEntry';
  address: Scalars['String'];
  ensDomainName: Scalars['String'];
  id: Scalars['ID'];
};

export enum HighLow {
  High = 'HIGH',
  Low = 'LOW'
}

export enum HistoryDuration {
  Day = 'DAY',
  Hour = 'HOUR',
  Max = 'MAX',
  Month = 'MONTH',
  Week = 'WEEK',
  Year = 'YEAR'
}

export type IAmount = {
  currency?: Maybe<Currency>;
  value: Scalars['Float'];
};

export type IContract = {
  address?: Maybe<Scalars['String']>;
  chain: Chain;
};

export type Image = {
  __typename?: 'Image';
  dimensions?: Maybe<Dimensions>;
  id: Scalars['ID'];
  url: Scalars['String'];
};

/**   TODO: deprecate this enum */
export enum MarketSortableField {
  MarketCap = 'MARKET_CAP',
  Volume = 'VOLUME'
}

export enum MediaType {
  Audio = 'AUDIO',
  Image = 'IMAGE',
  Raw = 'RAW',
  Video = 'VIDEO'
}

export type NftActivity = {
  __typename?: 'NftActivity';
  address: Scalars['String'];
  asset?: Maybe<NftAsset>;
  fromAddress: Scalars['String'];
  id: Scalars['ID'];
  marketplace?: Maybe<Scalars['String']>;
  orderStatus?: Maybe<OrderStatus>;
  price?: Maybe<Amount>;
  quantity?: Maybe<Scalars['Int']>;
  timestamp: Scalars['Int'];
  toAddress?: Maybe<Scalars['String']>;
  tokenId?: Maybe<Scalars['String']>;
  transactionHash?: Maybe<Scalars['String']>;
  type: NftActivityType;
  url?: Maybe<Scalars['String']>;
};

export type NftActivityConnection = {
  __typename?: 'NftActivityConnection';
  edges: Array<NftActivityEdge>;
  pageInfo: PageInfo;
};

export type NftActivityEdge = {
  __typename?: 'NftActivityEdge';
  cursor: Scalars['String'];
  node: NftActivity;
};

export type NftActivityFilterInput = {
  activityTypes?: InputMaybe<Array<NftActivityType>>;
  address?: InputMaybe<Scalars['String']>;
  tokenId?: InputMaybe<Scalars['String']>;
};

export enum NftActivityType {
  CancelListing = 'CANCEL_LISTING',
  Listing = 'LISTING',
  Sale = 'SALE',
  Transfer = 'TRANSFER'
}

export type NftApproval = {
  __typename?: 'NftApproval';
  approvedAddress: Scalars['String'];
  /**   can be erc721, erc1155, noncompliant */
  asset: NftAsset;
  id: Scalars['ID'];
  nftStandard: NftStandard;
};

export type NftApproveForAll = {
  __typename?: 'NftApproveForAll';
  approved: Scalars['Boolean'];
  /**   can be erc721, erc1155, noncompliant */
  asset: NftAsset;
  id: Scalars['ID'];
  nftStandard: NftStandard;
  operatorAddress: Scalars['String'];
};

export type NftAsset = {
  __typename?: 'NftAsset';
  animationUrl?: Maybe<Scalars['String']>;
  collection?: Maybe<NftCollection>;
  creator?: Maybe<NftProfile>;
  description?: Maybe<Scalars['String']>;
  flaggedBy?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  image?: Maybe<Image>;
  imageUrl?: Maybe<Scalars['String']>;
  isSpam?: Maybe<Scalars['Boolean']>;
  listings?: Maybe<NftOrderConnection>;
  mediaType?: Maybe<MediaType>;
  metadataUrl?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  nftContract?: Maybe<NftContract>;
  originalImage?: Maybe<Image>;
  /**   TODO: may need to be array to support erc1155 cases. not needed at the moment so will revisit. */
  ownerAddress?: Maybe<Scalars['String']>;
  rarities?: Maybe<Array<NftAssetRarity>>;
  smallImage?: Maybe<Image>;
  smallImageUrl?: Maybe<Scalars['String']>;
  suspiciousFlag?: Maybe<Scalars['Boolean']>;
  thumbnail?: Maybe<Image>;
  thumbnailUrl?: Maybe<Scalars['String']>;
  tokenId: Scalars['String'];
  traits?: Maybe<Array<NftAssetTrait>>;
};


export type NftAssetListingsArgs = {
  _fs?: InputMaybe<Scalars['String']>;
  after?: InputMaybe<Scalars['String']>;
  asc?: InputMaybe<Scalars['Boolean']>;
  before?: InputMaybe<Scalars['String']>;
  chain?: InputMaybe<Chain>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};

export type NftAssetConnection = {
  __typename?: 'NftAssetConnection';
  edges: Array<NftAssetEdge>;
  pageInfo: PageInfo;
  totalCount?: Maybe<Scalars['Int']>;
};

export type NftAssetEdge = {
  __typename?: 'NftAssetEdge';
  cursor: Scalars['String'];
  node: NftAsset;
};

export type NftAssetInput = {
  address: Scalars['String'];
  tokenId: Scalars['String'];
};

export type NftAssetRarity = {
  __typename?: 'NftAssetRarity';
  id: Scalars['ID'];
  provider?: Maybe<NftRarityProvider>;
  rank?: Maybe<Scalars['Int']>;
  score?: Maybe<Scalars['Float']>;
};

export enum NftAssetSortableField {
  Price = 'PRICE',
  Rarity = 'RARITY'
}

export type NftAssetTrait = {
  __typename?: 'NftAssetTrait';
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  rarity?: Maybe<Scalars['Float']>;
  value?: Maybe<Scalars['String']>;
};

export type NftAssetTraitInput = {
  name: Scalars['String'];
  values: Array<Scalars['String']>;
};

export type NftAssetsFilterInput = {
  listed?: InputMaybe<Scalars['Boolean']>;
  marketplaces?: InputMaybe<Array<NftMarketplace>>;
  maxPrice?: InputMaybe<Scalars['String']>;
  minPrice?: InputMaybe<Scalars['String']>;
  tokenIds?: InputMaybe<Array<Scalars['String']>>;
  tokenSearchQuery?: InputMaybe<Scalars['String']>;
  traits?: InputMaybe<Array<NftAssetTraitInput>>;
};

export type NftBalance = {
  __typename?: 'NftBalance';
  id: Scalars['ID'];
  lastPrice?: Maybe<TimestampedAmount>;
  listedMarketplaces?: Maybe<Array<NftMarketplace>>;
  listingFees?: Maybe<Array<Maybe<NftFee>>>;
  ownedAsset?: Maybe<NftAsset>;
  quantity?: Maybe<Scalars['Int']>;
};

export type NftBalanceConnection = {
  __typename?: 'NftBalanceConnection';
  edges: Array<NftBalanceEdge>;
  pageInfo: PageInfo;
};

export type NftBalanceEdge = {
  __typename?: 'NftBalanceEdge';
  cursor: Scalars['String'];
  node: NftBalance;
};

export type NftBalancesFilterInput = {
  addresses?: InputMaybe<Array<Scalars['String']>>;
  assets?: InputMaybe<Array<NftAssetInput>>;
  filterSpam?: InputMaybe<Scalars['Boolean']>;
};

export type NftCollection = {
  __typename?: 'NftCollection';
  bannerImage?: Maybe<Image>;
  /**
   *  TODO: support querying for collection assets here
   * assets(page: Int, pageSize: Int, orderBy: NftAssetSortableField): [NftAsset]
   */
  bannerImageUrl?: Maybe<Scalars['String']>;
  collectionId: Scalars['String'];
  creator?: Maybe<NftProfile>;
  description?: Maybe<Scalars['String']>;
  discordUrl?: Maybe<Scalars['String']>;
  homepageUrl?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  image?: Maybe<Image>;
  imageUrl?: Maybe<Scalars['String']>;
  instagramName?: Maybe<Scalars['String']>;
  isVerified?: Maybe<Scalars['Boolean']>;
  markets?: Maybe<Array<NftCollectionMarket>>;
  name?: Maybe<Scalars['String']>;
  nftContracts?: Maybe<Array<NftContract>>;
  numAssets?: Maybe<Scalars['Int']>;
  openseaUrl?: Maybe<Scalars['String']>;
  traits?: Maybe<Array<NftCollectionTrait>>;
  twitterName?: Maybe<Scalars['String']>;
};


export type NftCollectionMarketsArgs = {
  _fs?: InputMaybe<Scalars['String']>;
  currencies: Array<Currency>;
};


export type NftCollectionTraitsArgs = {
  _fs?: InputMaybe<Scalars['String']>;
};

export type NftCollectionConnection = {
  __typename?: 'NftCollectionConnection';
  edges: Array<NftCollectionEdge>;
  pageInfo: PageInfo;
};

export type NftCollectionEdge = {
  __typename?: 'NftCollectionEdge';
  cursor: Scalars['String'];
  node: NftCollection;
};

export type NftCollectionMarket = {
  __typename?: 'NftCollectionMarket';
  floorPrice?: Maybe<TimestampedAmount>;
  floorPricePercentChange?: Maybe<TimestampedAmount>;
  id: Scalars['ID'];
  listings?: Maybe<TimestampedAmount>;
  marketplaces?: Maybe<Array<NftCollectionMarketplace>>;
  nftContracts?: Maybe<Array<NftContract>>;
  owners?: Maybe<Scalars['Int']>;
  percentListed?: Maybe<TimestampedAmount>;
  percentUniqueOwners?: Maybe<TimestampedAmount>;
  sales?: Maybe<TimestampedAmount>;
  totalVolume?: Maybe<TimestampedAmount>;
  volume?: Maybe<TimestampedAmount>;
  volume24h?: Maybe<Amount>;
  volumePercentChange?: Maybe<TimestampedAmount>;
};


export type NftCollectionMarketFloorPriceArgs = {
  _fs?: InputMaybe<Scalars['String']>;
};


export type NftCollectionMarketFloorPricePercentChangeArgs = {
  _fs?: InputMaybe<Scalars['String']>;
  duration?: InputMaybe<HistoryDuration>;
};


export type NftCollectionMarketMarketplacesArgs = {
  _fs?: InputMaybe<Scalars['String']>;
  marketplaces?: InputMaybe<Array<NftMarketplace>>;
};


export type NftCollectionMarketSalesArgs = {
  _fs?: InputMaybe<Scalars['String']>;
  duration?: InputMaybe<HistoryDuration>;
};


export type NftCollectionMarketVolumeArgs = {
  _fs?: InputMaybe<Scalars['String']>;
  duration?: InputMaybe<HistoryDuration>;
};


export type NftCollectionMarketVolumePercentChangeArgs = {
  _fs?: InputMaybe<Scalars['String']>;
  duration?: InputMaybe<HistoryDuration>;
};

export type NftCollectionMarketplace = {
  __typename?: 'NftCollectionMarketplace';
  floorPrice?: Maybe<Scalars['Float']>;
  id: Scalars['ID'];
  listings?: Maybe<Scalars['Int']>;
  marketplace?: Maybe<NftMarketplace>;
};

export type NftCollectionTrait = {
  __typename?: 'NftCollectionTrait';
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  stats?: Maybe<Array<NftCollectionTraitStats>>;
  values?: Maybe<Array<Scalars['String']>>;
};

export type NftCollectionTraitStats = {
  __typename?: 'NftCollectionTraitStats';
  assets?: Maybe<Scalars['Int']>;
  id: Scalars['ID'];
  listings?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type NftCollectionsFilterInput = {
  addresses?: InputMaybe<Array<Scalars['String']>>;
  nameQuery?: InputMaybe<Scalars['String']>;
};

export type NftContract = IContract & {
  __typename?: 'NftContract';
  address: Scalars['String'];
  chain: Chain;
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  standard?: Maybe<NftStandard>;
  symbol?: Maybe<Scalars['String']>;
  totalSupply?: Maybe<Scalars['Int']>;
};

export type NftFee = {
  __typename?: 'NftFee';
  basisPoints: Scalars['Int'];
  id: Scalars['ID'];
  payoutAddress: Scalars['String'];
};

export enum NftMarketSortableField {
  FloorPrice = 'FLOOR_PRICE',
  Volume = 'VOLUME'
}

export enum NftMarketplace {
  Cryptopunks = 'CRYPTOPUNKS',
  Foundation = 'FOUNDATION',
  Looksrare = 'LOOKSRARE',
  Nft20 = 'NFT20',
  Nftx = 'NFTX',
  Opensea = 'OPENSEA',
  Sudoswap = 'SUDOSWAP',
  X2Y2 = 'X2Y2'
}

export type NftOrder = {
  __typename?: 'NftOrder';
  address: Scalars['String'];
  auctionType?: Maybe<Scalars['String']>;
  createdAt: Scalars['Float'];
  endAt?: Maybe<Scalars['Float']>;
  id: Scalars['ID'];
  maker: Scalars['String'];
  marketplace: NftMarketplace;
  marketplaceUrl: Scalars['String'];
  orderHash?: Maybe<Scalars['String']>;
  price: Amount;
  protocolParameters?: Maybe<Scalars['AWSJSON']>;
  quantity: Scalars['Int'];
  startAt: Scalars['Float'];
  status: OrderStatus;
  taker?: Maybe<Scalars['String']>;
  tokenId?: Maybe<Scalars['String']>;
  type: OrderType;
};

export type NftOrderConnection = {
  __typename?: 'NftOrderConnection';
  edges: Array<NftOrderEdge>;
  pageInfo: PageInfo;
};

export type NftOrderEdge = {
  __typename?: 'NftOrderEdge';
  cursor: Scalars['String'];
  node: NftOrder;
};

export type NftProfile = {
  __typename?: 'NftProfile';
  address: Scalars['String'];
  id: Scalars['ID'];
  isVerified?: Maybe<Scalars['Boolean']>;
  profileImage?: Maybe<Image>;
  username?: Maybe<Scalars['String']>;
};

export enum NftRarityProvider {
  RaritySniper = 'RARITY_SNIPER'
}

export type NftRouteResponse = {
  __typename?: 'NftRouteResponse';
  calldata: Scalars['String'];
  id: Scalars['ID'];
  route?: Maybe<Array<NftTrade>>;
  sendAmount: TokenAmount;
  toAddress: Scalars['String'];
};

export enum NftStandard {
  Erc721 = 'ERC721',
  Erc1155 = 'ERC1155',
  Noncompliant = 'NONCOMPLIANT'
}

export type NftTrade = {
  __typename?: 'NftTrade';
  amount: Scalars['Int'];
  contractAddress: Scalars['String'];
  id: Scalars['ID'];
  marketplace: NftMarketplace;
  /**   price represents the current price of the NFT, which can be different from quotePrice */
  price: TokenAmount;
  /**   quotePrice represents the last quoted price of the NFT */
  quotePrice?: Maybe<TokenAmount>;
  tokenId: Scalars['String'];
  tokenType?: Maybe<NftStandard>;
};

export type NftTradeInput = {
  amount: Scalars['Int'];
  contractAddress: Scalars['String'];
  id: Scalars['ID'];
  marketplace: NftMarketplace;
  quotePrice?: InputMaybe<TokenAmountInput>;
  tokenId: Scalars['String'];
  tokenType?: InputMaybe<NftStandard>;
};

export type NftTransfer = {
  __typename?: 'NftTransfer';
  asset: NftAsset;
  direction: TransactionDirection;
  id: Scalars['ID'];
  nftStandard: NftStandard;
  recipient: Scalars['String'];
  sender: Scalars['String'];
};

export enum OrderStatus {
  Cancelled = 'CANCELLED',
  Executed = 'EXECUTED',
  Expired = 'EXPIRED',
  Valid = 'VALID'
}

export enum OrderType {
  Listing = 'LISTING',
  Offer = 'OFFER'
}

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']>;
  hasNextPage?: Maybe<Scalars['Boolean']>;
  hasPreviousPage?: Maybe<Scalars['Boolean']>;
  startCursor?: Maybe<Scalars['String']>;
};

/**   v2 pool parameters as defined by https://github.com/Uniswap/v2-sdk/blob/main/src/entities/pair.ts */
export type PairInput = {
  tokenAmountA: TokenAmountInput;
  tokenAmountB: TokenAmountInput;
};

export type PermitDetailsInput = {
  amount: Scalars['String'];
  expiration: Scalars['String'];
  nonce: Scalars['String'];
  token: Scalars['String'];
};

export type PermitInput = {
  details: PermitDetailsInput;
  sigDeadline: Scalars['String'];
  signature: Scalars['String'];
  spender: Scalars['String'];
};

/**   v3 pool parameters as defined by https://github.com/Uniswap/v3-sdk/blob/main/src/entities/pool.ts */
export type PoolInput = {
  fee: Scalars['Int'];
  liquidity: Scalars['String'];
  sqrtRatioX96: Scalars['String'];
  tickCurrent: Scalars['String'];
  tokenA: TokenInput;
  tokenB: TokenInput;
};

export type Portfolio = {
  __typename?: 'Portfolio';
  assetActivities?: Maybe<Array<Maybe<AssetActivity>>>;
  id: Scalars['ID'];
  /**   TODO: (michael.zhang) replace with paginated query */
  nftBalances?: Maybe<Array<Maybe<NftBalance>>>;
  ownerAddress: Scalars['String'];
  tokenBalances?: Maybe<Array<Maybe<TokenBalance>>>;
  tokensTotalDenominatedValue?: Maybe<Amount>;
  tokensTotalDenominatedValueChange?: Maybe<AmountChange>;
};


export type PortfolioAssetActivitiesArgs = {
  _fs?: InputMaybe<Scalars['String']>;
  includeOffChain?: InputMaybe<Scalars['Boolean']>;
  page?: InputMaybe<Scalars['Int']>;
  pageSize?: InputMaybe<Scalars['Int']>;
};


export type PortfolioTokensTotalDenominatedValueChangeArgs = {
  duration?: InputMaybe<HistoryDuration>;
};

export type Query = {
  __typename?: 'Query';
  ensEntry?: Maybe<EnsEntry>;
  nftActivity?: Maybe<NftActivityConnection>;
  nftAssets?: Maybe<NftAssetConnection>;
  nftBalances?: Maybe<NftBalanceConnection>;
  nftCollections?: Maybe<NftCollectionConnection>;
  nftCollectionsById?: Maybe<Array<Maybe<NftCollection>>>;
  nftRoute?: Maybe<NftRouteResponse>;
  portfolios?: Maybe<Array<Maybe<Portfolio>>>;
  /** @deprecated Use searchTokens */
  searchTokenProjects?: Maybe<Array<Maybe<TokenProject>>>;
  searchTokens?: Maybe<Array<Maybe<Token>>>;
  token?: Maybe<Token>;
  tokenDayDatas?: Maybe<Array<Maybe<TokenDayDatas>>>;
  tokenProjects?: Maybe<Array<Maybe<TokenProject>>>;
  tokens?: Maybe<Array<Maybe<Token>>>;
  topCollections?: Maybe<NftCollectionConnection>;
  topTokens?: Maybe<Array<Maybe<Token>>>;
};


export type QueryEnsEntryArgs = {
  chain: Chain;
  ensDomainName: Scalars['String'];
};


export type QueryNftActivityArgs = {
  _fs?: InputMaybe<Scalars['String']>;
  after?: InputMaybe<Scalars['String']>;
  chain?: InputMaybe<Chain>;
  filter?: InputMaybe<NftActivityFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
};


export type QueryNftAssetsArgs = {
  _fs?: InputMaybe<Scalars['String']>;
  address: Scalars['String'];
  after?: InputMaybe<Scalars['String']>;
  asc?: InputMaybe<Scalars['Boolean']>;
  before?: InputMaybe<Scalars['String']>;
  chain?: InputMaybe<Chain>;
  filter?: InputMaybe<NftAssetsFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<NftAssetSortableField>;
};


export type QueryNftBalancesArgs = {
  _fs?: InputMaybe<Scalars['String']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  chain?: InputMaybe<Chain>;
  filter?: InputMaybe<NftBalancesFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  ownerAddress: Scalars['String'];
};


export type QueryNftCollectionsArgs = {
  _fs?: InputMaybe<Scalars['String']>;
  after?: InputMaybe<Scalars['String']>;
  chain?: InputMaybe<Chain>;
  filter?: InputMaybe<NftCollectionsFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
};


export type QueryNftCollectionsByIdArgs = {
  collectionIds?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type QueryNftRouteArgs = {
  chain?: InputMaybe<Chain>;
  nftTrades: Array<NftTradeInput>;
  senderAddress: Scalars['String'];
  tokenTrades?: InputMaybe<Array<TokenTradeInput>>;
};


export type QueryPortfoliosArgs = {
  _fs?: InputMaybe<Scalars['String']>;
  chains?: InputMaybe<Array<Chain>>;
  ownerAddresses: Array<Scalars['String']>;
};


export type QuerySearchTokenProjectsArgs = {
  searchQuery: Scalars['String'];
};


export type QuerySearchTokensArgs = {
  _fs?: InputMaybe<Scalars['String']>;
  searchQuery: Scalars['String'];
};


export type QueryTokenArgs = {
  _fs?: InputMaybe<Scalars['String']>;
  address?: InputMaybe<Scalars['String']>;
  chain: Chain;
};


export type QueryTokenDayDatasArgs = {
  orderBy?: InputMaybe<TokenSortableField>;
  orderDirection?: InputMaybe<TokenSortableValue>;
  page?: InputMaybe<Scalars['Int']>;
  pageSize?: InputMaybe<Scalars['Int']>;
};


export type QueryTokenProjectsArgs = {
  _fs?: InputMaybe<Scalars['String']>;
  contracts: Array<ContractInput>;
};


export type QueryTokensArgs = {
  _fs?: InputMaybe<Scalars['String']>;
  contracts: Array<ContractInput>;
};


export type QueryTopCollectionsArgs = {
  _fs?: InputMaybe<Scalars['String']>;
  after?: InputMaybe<Scalars['String']>;
  chains?: InputMaybe<Array<Chain>>;
  cursor?: InputMaybe<Scalars['String']>;
  duration?: InputMaybe<HistoryDuration>;
  first?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<CollectionSortableField>;
};


export type QueryTopTokensArgs = {
  chain?: InputMaybe<Chain>;
  orderBy?: InputMaybe<TokenSortableField>;
  page?: InputMaybe<Scalars['Int']>;
  pageSize?: InputMaybe<Scalars['Int']>;
};

export enum SafetyLevel {
  Blocked = 'BLOCKED',
  MediumWarning = 'MEDIUM_WARNING',
  StrongWarning = 'STRONG_WARNING',
  Verified = 'VERIFIED'
}

export type SwapOrderDetails = {
  __typename?: 'SwapOrderDetails';
  hash: Scalars['String'];
  id: Scalars['ID'];
  inputToken: Token;
  inputTokenQuantity: Scalars['String'];
  offerer: Scalars['String'];
  outputToken: Token;
  outputTokenQuantity: Scalars['String'];
  status: SwapOrderStatus;
};

export enum SwapOrderStatus {
  Error = 'ERROR',
  Expired = 'EXPIRED',
  InsufficientFunds = 'INSUFFICIENT_FUNDS',
  Open = 'OPEN'
}

export type TimestampedAmount = IAmount & {
  __typename?: 'TimestampedAmount';
  currency?: Maybe<Currency>;
  id: Scalars['ID'];
  timestamp: Scalars['Int'];
  value: Scalars['Float'];
};

export type Token = IContract & {
  __typename?: 'Token';
  address?: Maybe<Scalars['String']>;
  chain: Chain;
  decimals?: Maybe<Scalars['Int']>;
  id: Scalars['ID'];
  market?: Maybe<TokenMarket>;
  name?: Maybe<Scalars['String']>;
  project?: Maybe<TokenProject>;
  standard?: Maybe<TokenStandard>;
  symbol?: Maybe<Scalars['String']>;
};


export type TokenMarketArgs = {
  currency?: InputMaybe<Currency>;
};


export type TokenProjectArgs = {
  _fs?: InputMaybe<Scalars['String']>;
};

export type TokenAmount = {
  __typename?: 'TokenAmount';
  currency: Currency;
  id: Scalars['ID'];
  value: Scalars['String'];
};

export type TokenAmountInput = {
  amount: Scalars['String'];
  token: TokenInput;
};

export type TokenApproval = {
  __typename?: 'TokenApproval';
  approvedAddress: Scalars['String'];
  /**   can be erc20 or native */
  asset: Token;
  id: Scalars['ID'];
  quantity: Scalars['String'];
  tokenStandard: TokenStandard;
};

export type TokenBalance = {
  __typename?: 'TokenBalance';
  blockNumber?: Maybe<Scalars['Int']>;
  blockTimestamp?: Maybe<Scalars['Int']>;
  denominatedValue?: Maybe<Amount>;
  id: Scalars['ID'];
  ownerAddress: Scalars['String'];
  quantity?: Maybe<Scalars['Float']>;
  token?: Maybe<Token>;
  tokenProjectMarket?: Maybe<TokenProjectMarket>;
};

export type TokenDayData_Filter = {
  data_gt?: InputMaybe<Scalars['Int']>;
};

export type TokenDayDatas = {
  __typename?: 'TokenDayDatas';
  date: Scalars['Int'];
  priceUSD?: Maybe<Scalars['String']>;
  token?: Maybe<TokenSubgraph>;
  totalValueLockedUSD?: Maybe<Scalars['String']>;
  volume?: Maybe<Scalars['String']>;
  volumeUSD?: Maybe<Scalars['String']>;
};

export type TokenInput = {
  address: Scalars['String'];
  chainId: Scalars['Int'];
  decimals: Scalars['Int'];
  isNative: Scalars['Boolean'];
};

export type TokenMarket = {
  __typename?: 'TokenMarket';
  id: Scalars['ID'];
  price?: Maybe<Amount>;
  priceHighLow?: Maybe<Amount>;
  priceHistory?: Maybe<Array<Maybe<TimestampedAmount>>>;
  pricePercentChange?: Maybe<Amount>;
  token: Token;
  totalValueLocked?: Maybe<Amount>;
  volume?: Maybe<Amount>;
};


export type TokenMarketPriceHighLowArgs = {
  duration: HistoryDuration;
  highLow: HighLow;
};


export type TokenMarketPriceHistoryArgs = {
  duration: HistoryDuration;
};


export type TokenMarketPricePercentChangeArgs = {
  duration: HistoryDuration;
};


export type TokenMarketVolumeArgs = {
  duration: HistoryDuration;
};

export type TokenProject = {
  __typename?: 'TokenProject';
  description?: Maybe<Scalars['String']>;
  homepageUrl?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  isSpam?: Maybe<Scalars['Boolean']>;
  logo?: Maybe<Image>;
  /** @deprecated use logo */
  logoUrl?: Maybe<Scalars['String']>;
  markets?: Maybe<Array<Maybe<TokenProjectMarket>>>;
  name?: Maybe<Scalars['String']>;
  safetyLevel?: Maybe<SafetyLevel>;
  /** @deprecated use logo */
  smallLogo?: Maybe<Image>;
  spamCode?: Maybe<Scalars['Int']>;
  tokens: Array<Token>;
  twitterName?: Maybe<Scalars['String']>;
};


export type TokenProjectMarketsArgs = {
  currencies: Array<Currency>;
};

export type TokenProjectMarket = {
  __typename?: 'TokenProjectMarket';
  currency: Currency;
  /** @deprecated Use marketCap */
  fullyDilutedMarketCap?: Maybe<Amount>;
  id: Scalars['ID'];
  marketCap?: Maybe<Amount>;
  price?: Maybe<Amount>;
  priceHighLow?: Maybe<Amount>;
  priceHistory?: Maybe<Array<Maybe<TimestampedAmount>>>;
  pricePercentChange?: Maybe<Amount>;
  /** @deprecated Use pricePercentChange */
  pricePercentChange24h?: Maybe<Amount>;
  tokenProject: TokenProject;
  /** @deprecated Use TokenMarket.volume for Uniswap volume */
  volume?: Maybe<Amount>;
  /** @deprecated Use TokenMarket.volume with duration DAY for Uniswap volume */
  volume24h?: Maybe<Amount>;
};


export type TokenProjectMarketPriceHighLowArgs = {
  duration: HistoryDuration;
  highLow: HighLow;
};


export type TokenProjectMarketPriceHistoryArgs = {
  duration: HistoryDuration;
};


export type TokenProjectMarketPricePercentChangeArgs = {
  duration: HistoryDuration;
};


export type TokenProjectMarketVolumeArgs = {
  duration: HistoryDuration;
};

export enum TokenSortableField {
  MarketCap = 'MARKET_CAP',
  Popularity = 'POPULARITY',
  TotalValueLocked = 'TOTAL_VALUE_LOCKED',
  Volume = 'VOLUME',
  Date = 'date'
}

export enum TokenSortableValue {
  Asc = 'asc',
  Desc = 'desc'
}

export enum TokenStandard {
  Erc20 = 'ERC20',
  Native = 'NATIVE'
}

export type TokenSubgraph = {
  __typename?: 'TokenSubgraph';
  id: Scalars['ID'];
  name: Scalars['String'];
  symbol: Scalars['String'];
};

export type TokenTradeInput = {
  permit?: InputMaybe<PermitInput>;
  routes?: InputMaybe<TokenTradeRoutesInput>;
  slippageToleranceBasisPoints?: InputMaybe<Scalars['Int']>;
  tokenAmount: TokenAmountInput;
};

export type TokenTradeRouteInput = {
  inputAmount: TokenAmountInput;
  outputAmount: TokenAmountInput;
  pools: Array<TradePoolInput>;
};

export type TokenTradeRoutesInput = {
  mixedRoutes?: InputMaybe<Array<TokenTradeRouteInput>>;
  tradeType: TokenTradeType;
  v2Routes?: InputMaybe<Array<TokenTradeRouteInput>>;
  v3Routes?: InputMaybe<Array<TokenTradeRouteInput>>;
};

export enum TokenTradeType {
  ExactInput = 'EXACT_INPUT',
  ExactOutput = 'EXACT_OUTPUT'
}

export type TokenTransfer = {
  __typename?: 'TokenTransfer';
  asset: Token;
  direction: TransactionDirection;
  id: Scalars['ID'];
  quantity: Scalars['String'];
  recipient: Scalars['String'];
  sender: Scalars['String'];
  tokenStandard: TokenStandard;
  transactedValue?: Maybe<Amount>;
};

export type TradePoolInput = {
  pair?: InputMaybe<PairInput>;
  pool?: InputMaybe<PoolInput>;
};

export type Transaction = {
  __typename?: 'Transaction';
  blockNumber: Scalars['Int'];
  from: Scalars['String'];
  gasLimit?: Maybe<Scalars['Float']>;
  hash: Scalars['String'];
  id: Scalars['ID'];
  maxFeePerGas?: Maybe<Scalars['Float']>;
  nonce: Scalars['Int'];
  status: TransactionStatus;
  to: Scalars['String'];
};

export type TransactionDetails = {
  __typename?: 'TransactionDetails';
  assetChanges: Array<Maybe<AssetChange>>;
  from: Scalars['String'];
  hash: Scalars['String'];
  id: Scalars['ID'];
  nonce: Scalars['Int'];
  status: TransactionStatus;
  to: Scalars['String'];
  type: TransactionType;
};

export enum TransactionDirection {
  In = 'IN',
  Out = 'OUT',
  Self = 'SELF'
}

export enum TransactionStatus {
  Confirmed = 'CONFIRMED',
  Failed = 'FAILED',
  Pending = 'PENDING'
}

export enum TransactionType {
  Approve = 'APPROVE',
  Mint = 'MINT',
  Receive = 'RECEIVE',
  Send = 'SEND',
  Swap = 'SWAP',
  SwapOrder = 'SWAP_ORDER',
  Unknown = 'UNKNOWN'
}

export type RecentlySearchedAssetsQueryVariables = Exact<{
  collectionAddresses: Array<Scalars['String']> | Scalars['String'];
  contracts: Array<ContractInput> | ContractInput;
}>;


export type RecentlySearchedAssetsQuery = { __typename?: 'Query', nftCollections?: { __typename?: 'NftCollectionConnection', edges: Array<{ __typename?: 'NftCollectionEdge', node: { __typename?: 'NftCollection', collectionId: string, isVerified?: boolean, name?: string, numAssets?: number, image?: { __typename?: 'Image', url: string }, nftContracts?: Array<{ __typename?: 'NftContract', address: string }>, markets?: Array<{ __typename?: 'NftCollectionMarket', floorPrice?: { __typename?: 'TimestampedAmount', currency?: Currency, value: number } }> } }> }, tokens?: Array<{ __typename?: 'Token', id: string, decimals?: number, name?: string, chain: Chain, standard?: TokenStandard, address?: string, symbol?: string, market?: { __typename?: 'TokenMarket', id: string, price?: { __typename?: 'Amount', id: string, value: number, currency?: Currency }, pricePercentChange?: { __typename?: 'Amount', id: string, value: number }, volume24H?: { __typename?: 'Amount', id: string, value: number, currency?: Currency } }, project?: { __typename?: 'TokenProject', id: string, logoUrl?: string, safetyLevel?: SafetyLevel } }> };

export type SearchTokensQueryVariables = Exact<{
  searchQuery: Scalars['String'];
}>;


export type SearchTokensQuery = { __typename?: 'Query', searchTokens?: Array<{ __typename?: 'Token', id: string, decimals?: number, name?: string, chain: Chain, standard?: TokenStandard, address?: string, symbol?: string, market?: { __typename?: 'TokenMarket', id: string, price?: { __typename?: 'Amount', id: string, value: number, currency?: Currency }, pricePercentChange?: { __typename?: 'Amount', id: string, value: number }, volume24H?: { __typename?: 'Amount', id: string, value: number, currency?: Currency } }, project?: { __typename?: 'TokenProject', id: string, logoUrl?: string, safetyLevel?: SafetyLevel } }> };

export type TokenQueryVariables = Exact<{
  chain: Chain;
  address?: InputMaybe<Scalars['String']>;
}>;


export type TokenQuery = { __typename?: 'Query', token?: { __typename?: 'Token', id: string, decimals?: number, name?: string, chain: Chain, address?: string, symbol?: string, standard?: TokenStandard, market?: { __typename?: 'TokenMarket', id: string, totalValueLocked?: { __typename?: 'Amount', id: string, value: number, currency?: Currency }, price?: { __typename?: 'Amount', id: string, value: number, currency?: Currency }, volume24H?: { __typename?: 'Amount', id: string, value: number, currency?: Currency }, priceHigh52W?: { __typename?: 'Amount', id: string, value: number }, priceLow52W?: { __typename?: 'Amount', id: string, value: number } }, project?: { __typename?: 'TokenProject', id: string, description?: string, homepageUrl?: string, twitterName?: string, logoUrl?: string, tokens: Array<{ __typename?: 'Token', id: string, chain: Chain, address?: string }> } } };

export type TokenPriceQueryVariables = Exact<{
  chain: Chain;
  address?: InputMaybe<Scalars['String']>;
  duration: HistoryDuration;
}>;


export type TokenPriceQuery = { __typename?: 'Query', token?: { __typename?: 'Token', id: string, address?: string, chain: Chain, market?: { __typename?: 'TokenMarket', id: string, price?: { __typename?: 'Amount', id: string, value: number }, priceHistory?: Array<{ __typename?: 'TimestampedAmount', id: string, timestamp: number, value: number }> } } };

export type UniswapPricesQueryVariables = Exact<{
  contracts: Array<ContractInput> | ContractInput;
}>;


export type UniswapPricesQuery = { __typename?: 'Query', tokens?: Array<{ __typename?: 'Token', id: string, address?: string, chain: Chain, standard?: TokenStandard, project?: { __typename?: 'TokenProject', id: string, markets?: Array<{ __typename?: 'TokenProjectMarket', id: string, price?: { __typename?: 'Amount', id: string, value: number } }> } }> };

export type TokenSpotPriceQueryVariables = Exact<{
  chain: Chain;
  address?: InputMaybe<Scalars['String']>;
}>;


export type TokenSpotPriceQuery = { __typename?: 'Query', token?: { __typename?: 'Token', id: string, address?: string, chain: Chain, name?: string, symbol?: string, project?: { __typename?: 'TokenProject', id: string, markets?: Array<{ __typename?: 'TokenProjectMarket', id: string, price?: { __typename?: 'Amount', id: string, value: number } }> } } };

export type TopTokens100QueryVariables = Exact<{
  duration: HistoryDuration;
  chain: Chain;
}>;


export type TopTokens100Query = { __typename?: 'Query', topTokens?: Array<{ __typename?: 'Token', id: string, name?: string, chain: Chain, address?: string, symbol?: string, standard?: TokenStandard, market?: { __typename?: 'TokenMarket', id: string, totalValueLocked?: { __typename?: 'Amount', id: string, value: number, currency?: Currency }, price?: { __typename?: 'Amount', id: string, value: number, currency?: Currency }, pricePercentChange?: { __typename?: 'Amount', id: string, currency?: Currency, value: number }, volume?: { __typename?: 'Amount', id: string, value: number, currency?: Currency } }, project?: { __typename?: 'TokenProject', id: string, logoUrl?: string } }> };

export type TopTokensSparklineQueryVariables = Exact<{
  duration: HistoryDuration;
  chain: Chain;
}>;


export type TopTokensSparklineQuery = { __typename?: 'Query', topTokens?: Array<{ __typename?: 'Token', id: string, address?: string, chain: Chain, market?: { __typename?: 'TokenMarket', id: string, priceHistory?: Array<{ __typename?: 'TimestampedAmount', id: string, timestamp: number, value: number }> } }> };

export type TopTokens100SubgraphQueryVariables = Exact<{ [key: string]: never; }>;


export type TopTokens100SubgraphQuery = { __typename?: 'Query', tokenDayDatas?: Array<{ __typename?: 'TokenDayDatas', date: number, priceUSD?: string, totalValueLockedUSD?: string, volumeUSD?: string, volume?: string, token?: { __typename?: 'TokenSubgraph', id: string, name: string, symbol: string } }> };

export type TrendingTokensQueryVariables = Exact<{
  chain: Chain;
}>;


export type TrendingTokensQuery = { __typename?: 'Query', topTokens?: Array<{ __typename?: 'Token', id: string, decimals?: number, name?: string, chain: Chain, standard?: TokenStandard, address?: string, symbol?: string, market?: { __typename?: 'TokenMarket', id: string, price?: { __typename?: 'Amount', id: string, value: number, currency?: Currency }, pricePercentChange?: { __typename?: 'Amount', id: string, value: number }, volume24H?: { __typename?: 'Amount', id: string, value: number, currency?: Currency } }, project?: { __typename?: 'TokenProject', id: string, logoUrl?: string, safetyLevel?: SafetyLevel } }> };

export type AssetQueryVariables = Exact<{
  address: Scalars['String'];
  orderBy?: InputMaybe<NftAssetSortableField>;
  asc?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<NftAssetsFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  last?: InputMaybe<Scalars['Int']>;
  before?: InputMaybe<Scalars['String']>;
}>;


export type AssetQuery = { __typename?: 'Query', nftAssets?: { __typename?: 'NftAssetConnection', totalCount?: number, edges: Array<{ __typename?: 'NftAssetEdge', cursor: string, node: { __typename?: 'NftAsset', id: string, name?: string, tokenId: string, animationUrl?: string, suspiciousFlag?: boolean, image?: { __typename?: 'Image', url: string }, smallImage?: { __typename?: 'Image', url: string }, collection?: { __typename?: 'NftCollection', name?: string, isVerified?: boolean, nftContracts?: Array<{ __typename?: 'NftContract', address: string, standard?: NftStandard }> }, listings?: { __typename?: 'NftOrderConnection', edges: Array<{ __typename?: 'NftOrderEdge', cursor: string, node: { __typename?: 'NftOrder', address: string, createdAt: number, endAt?: number, id: string, maker: string, marketplace: NftMarketplace, marketplaceUrl: string, orderHash?: string, quantity: number, startAt: number, status: OrderStatus, taker?: string, tokenId?: string, type: OrderType, protocolParameters?: any, price: { __typename?: 'Amount', currency?: Currency, value: number } } }> }, rarities?: Array<{ __typename?: 'NftAssetRarity', rank?: number }> } }>, pageInfo: { __typename?: 'PageInfo', endCursor?: string, hasNextPage?: boolean, hasPreviousPage?: boolean, startCursor?: string } } };

export type CollectionQueryVariables = Exact<{
  addresses: Array<Scalars['String']> | Scalars['String'];
}>;


export type CollectionQuery = { __typename?: 'Query', nftCollections?: { __typename?: 'NftCollectionConnection', edges: Array<{ __typename?: 'NftCollectionEdge', cursor: string, node: { __typename?: 'NftCollection', collectionId: string, description?: string, discordUrl?: string, homepageUrl?: string, instagramName?: string, isVerified?: boolean, name?: string, numAssets?: number, twitterName?: string, bannerImage?: { __typename?: 'Image', url: string }, image?: { __typename?: 'Image', url: string }, nftContracts?: Array<{ __typename?: 'NftContract', address: string, chain: Chain, name?: string, standard?: NftStandard, symbol?: string, totalSupply?: number }>, traits?: Array<{ __typename?: 'NftCollectionTrait', name?: string, values?: Array<string>, stats?: Array<{ __typename?: 'NftCollectionTraitStats', name?: string, value?: string, assets?: number, listings?: number }> }>, markets?: Array<{ __typename?: 'NftCollectionMarket', owners?: number, floorPrice?: { __typename?: 'TimestampedAmount', currency?: Currency, value: number }, totalVolume?: { __typename?: 'TimestampedAmount', value: number, currency?: Currency }, listings?: { __typename?: 'TimestampedAmount', value: number }, volume?: { __typename?: 'TimestampedAmount', value: number, currency?: Currency }, volumePercentChange?: { __typename?: 'TimestampedAmount', value: number, currency?: Currency }, floorPricePercentChange?: { __typename?: 'TimestampedAmount', value: number, currency?: Currency }, marketplaces?: Array<{ __typename?: 'NftCollectionMarketplace', marketplace?: NftMarketplace, listings?: number, floorPrice?: number }> }> } }>, pageInfo: { __typename?: 'PageInfo', endCursor?: string, hasNextPage?: boolean, hasPreviousPage?: boolean, startCursor?: string } } };

export type CollectionSearchQueryVariables = Exact<{
  query: Scalars['String'];
}>;


export type CollectionSearchQuery = { __typename?: 'Query', nftCollections?: { __typename?: 'NftCollectionConnection', edges: Array<{ __typename?: 'NftCollectionEdge', cursor: string, node: { __typename?: 'NftCollection', isVerified?: boolean, name?: string, numAssets?: number, image?: { __typename?: 'Image', url: string }, nftContracts?: Array<{ __typename?: 'NftContract', address: string, chain: Chain, name?: string, symbol?: string, totalSupply?: number }>, markets?: Array<{ __typename?: 'NftCollectionMarket', floorPrice?: { __typename?: 'TimestampedAmount', currency?: Currency, value: number } }> } }>, pageInfo: { __typename?: 'PageInfo', endCursor?: string, hasNextPage?: boolean, hasPreviousPage?: boolean, startCursor?: string } } };

export type DetailsQueryVariables = Exact<{
  address: Scalars['String'];
  tokenId: Scalars['String'];
}>;


export type DetailsQuery = { __typename?: 'Query', nftAssets?: { __typename?: 'NftAssetConnection', edges: Array<{ __typename?: 'NftAssetEdge', node: { __typename?: 'NftAsset', id: string, name?: string, ownerAddress?: string, tokenId: string, description?: string, animationUrl?: string, suspiciousFlag?: boolean, metadataUrl?: string, image?: { __typename?: 'Image', url: string }, smallImage?: { __typename?: 'Image', url: string }, originalImage?: { __typename?: 'Image', url: string }, creator?: { __typename?: 'NftProfile', address: string, isVerified?: boolean, profileImage?: { __typename?: 'Image', url: string } }, collection?: { __typename?: 'NftCollection', name?: string, isVerified?: boolean, numAssets?: number, twitterName?: string, discordUrl?: string, homepageUrl?: string, description?: string, image?: { __typename?: 'Image', url: string }, nftContracts?: Array<{ __typename?: 'NftContract', address: string, standard?: NftStandard }> }, listings?: { __typename?: 'NftOrderConnection', edges: Array<{ __typename?: 'NftOrderEdge', cursor: string, node: { __typename?: 'NftOrder', address: string, createdAt: number, endAt?: number, id: string, maker: string, marketplace: NftMarketplace, marketplaceUrl: string, orderHash?: string, quantity: number, startAt: number, status: OrderStatus, taker?: string, tokenId?: string, type: OrderType, protocolParameters?: any, price: { __typename?: 'Amount', currency?: Currency, value: number } } }> }, rarities?: Array<{ __typename?: 'NftAssetRarity', provider?: NftRarityProvider, rank?: number, score?: number }>, traits?: Array<{ __typename?: 'NftAssetTrait', name?: string, value?: string }> } }> } };

export type NftActivityQueryVariables = Exact<{
  filter?: InputMaybe<NftActivityFilterInput>;
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
}>;


export type NftActivityQuery = { __typename?: 'Query', nftActivity?: { __typename?: 'NftActivityConnection', edges: Array<{ __typename?: 'NftActivityEdge', node: { __typename?: 'NftActivity', id: string, address: string, tokenId?: string, type: NftActivityType, marketplace?: string, fromAddress: string, toAddress?: string, transactionHash?: string, orderStatus?: OrderStatus, quantity?: number, url?: string, timestamp: number, asset?: { __typename?: 'NftAsset', id: string, metadataUrl?: string, name?: string, suspiciousFlag?: boolean, image?: { __typename?: 'Image', id: string, url: string }, smallImage?: { __typename?: 'Image', id: string, url: string }, rarities?: Array<{ __typename?: 'NftAssetRarity', id: string, provider?: NftRarityProvider, rank?: number, score?: number }>, nftContract?: { __typename?: 'NftContract', id: string, standard?: NftStandard }, collection?: { __typename?: 'NftCollection', id: string, image?: { __typename?: 'Image', id: string, url: string } } }, price?: { __typename?: 'Amount', id: string, value: number } } }>, pageInfo: { __typename?: 'PageInfo', endCursor?: string, hasNextPage?: boolean, hasPreviousPage?: boolean, startCursor?: string } } };

export type NftBalanceQueryVariables = Exact<{
  ownerAddress: Scalars['String'];
  filter?: InputMaybe<NftBalancesFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  last?: InputMaybe<Scalars['Int']>;
  before?: InputMaybe<Scalars['String']>;
}>;


export type NftBalanceQuery = { __typename?: 'Query', nftBalances?: { __typename?: 'NftBalanceConnection', edges: Array<{ __typename?: 'NftBalanceEdge', node: { __typename?: 'NftBalance', listedMarketplaces?: Array<NftMarketplace>, ownedAsset?: { __typename?: 'NftAsset', id: string, animationUrl?: string, description?: string, flaggedBy?: string, name?: string, ownerAddress?: string, suspiciousFlag?: boolean, tokenId: string, collection?: { __typename?: 'NftCollection', id: string, isVerified?: boolean, name?: string, twitterName?: string, image?: { __typename?: 'Image', id: string, url: string }, nftContracts?: Array<{ __typename?: 'NftContract', id: string, address: string, chain: Chain, name?: string, standard?: NftStandard, symbol?: string, totalSupply?: number }>, markets?: Array<{ __typename?: 'NftCollectionMarket', id: string, floorPrice?: { __typename?: 'TimestampedAmount', id: string, value: number } }> }, image?: { __typename?: 'Image', id: string, url: string }, originalImage?: { __typename?: 'Image', id: string, url: string }, smallImage?: { __typename?: 'Image', id: string, url: string }, thumbnail?: { __typename?: 'Image', id: string, url: string }, listings?: { __typename?: 'NftOrderConnection', edges: Array<{ __typename?: 'NftOrderEdge', node: { __typename?: 'NftOrder', createdAt: number, marketplace: NftMarketplace, endAt?: number, price: { __typename?: 'Amount', id: string, value: number, currency?: Currency } } }> } }, listingFees?: Array<{ __typename?: 'NftFee', id: string, payoutAddress: string, basisPoints: number }>, lastPrice?: { __typename?: 'TimestampedAmount', id: string, currency?: Currency, timestamp: number, value: number } } }>, pageInfo: { __typename?: 'PageInfo', endCursor?: string, hasNextPage?: boolean, hasPreviousPage?: boolean, startCursor?: string } } };

export type NftRouteQueryVariables = Exact<{
  chain?: InputMaybe<Chain>;
  senderAddress: Scalars['String'];
  nftTrades: Array<NftTradeInput> | NftTradeInput;
  tokenTrades?: InputMaybe<Array<TokenTradeInput> | TokenTradeInput>;
}>;


export type NftRouteQuery = { __typename?: 'Query', nftRoute?: { __typename?: 'NftRouteResponse', id: string, calldata: string, toAddress: string, route?: Array<{ __typename?: 'NftTrade', amount: number, contractAddress: string, id: string, marketplace: NftMarketplace, tokenId: string, tokenType?: NftStandard, price: { __typename?: 'TokenAmount', id: string, currency: Currency, value: string }, quotePrice?: { __typename?: 'TokenAmount', id: string, currency: Currency, value: string } }>, sendAmount: { __typename?: 'TokenAmount', id: string, currency: Currency, value: string } } };

export type TrendingCollectionsQueryVariables = Exact<{
  size?: InputMaybe<Scalars['Int']>;
  timePeriod?: InputMaybe<HistoryDuration>;
}>;


export type TrendingCollectionsQuery = { __typename?: 'Query', topCollections?: { __typename?: 'NftCollectionConnection', edges: Array<{ __typename?: 'NftCollectionEdge', node: { __typename?: 'NftCollection', name?: string, isVerified?: boolean, nftContracts?: Array<{ __typename?: 'NftContract', address: string, totalSupply?: number }>, image?: { __typename?: 'Image', url: string }, bannerImage?: { __typename?: 'Image', url: string }, markets?: Array<{ __typename?: 'NftCollectionMarket', owners?: number, floorPrice?: { __typename?: 'TimestampedAmount', value: number }, totalVolume?: { __typename?: 'TimestampedAmount', value: number }, volume?: { __typename?: 'TimestampedAmount', value: number }, volumePercentChange?: { __typename?: 'TimestampedAmount', value: number }, floorPricePercentChange?: { __typename?: 'TimestampedAmount', value: number }, sales?: { __typename?: 'TimestampedAmount', value: number }, listings?: { __typename?: 'TimestampedAmount', value: number } }> } }> } };

export type PortfolioBalancesQueryVariables = Exact<{
  ownerAddress: Scalars['String'];
}>;


export type PortfolioBalancesQuery = { __typename?: 'Query', portfolios?: Array<{ __typename?: 'Portfolio', id: string, tokensTotalDenominatedValue?: { __typename?: 'Amount', id: string, value: number }, tokensTotalDenominatedValueChange?: { __typename?: 'AmountChange', absolute?: { __typename?: 'Amount', id: string, value: number }, percentage?: { __typename?: 'Amount', id: string, value: number } }, tokenBalances?: Array<{ __typename?: 'TokenBalance', id: string, quantity?: number, denominatedValue?: { __typename?: 'Amount', id: string, currency?: Currency, value: number }, tokenProjectMarket?: { __typename?: 'TokenProjectMarket', id: string, pricePercentChange?: { __typename?: 'Amount', id: string, value: number }, tokenProject: { __typename?: 'TokenProject', id: string, logoUrl?: string } }, token?: { __typename?: 'Token', id: string, chain: Chain, address?: string, name?: string, symbol?: string, standard?: TokenStandard, decimals?: number } }> }> };

export type NftAssetPartsFragment = { __typename?: 'NftAsset', id: string, name?: string, tokenId: string, nftContract?: { __typename?: 'NftContract', id: string, chain: Chain, address: string }, image?: { __typename?: 'Image', id: string, url: string }, collection?: { __typename?: 'NftCollection', id: string, name?: string } };

export type NftTransferPartsFragment = { __typename?: 'NftTransfer', id: string, nftStandard: NftStandard, sender: string, recipient: string, direction: TransactionDirection, asset: { __typename?: 'NftAsset', id: string, name?: string, tokenId: string, nftContract?: { __typename?: 'NftContract', id: string, chain: Chain, address: string }, image?: { __typename?: 'Image', id: string, url: string }, collection?: { __typename?: 'NftCollection', id: string, name?: string } } };

export type TokenAssetPartsFragment = { __typename?: 'Token', id: string, name?: string, symbol?: string, address?: string, decimals?: number, chain: Chain, standard?: TokenStandard, project?: { __typename?: 'TokenProject', id: string, isSpam?: boolean, logo?: { __typename?: 'Image', id: string, url: string } } };

export type TokenTransferPartsFragment = { __typename?: 'TokenTransfer', id: string, tokenStandard: TokenStandard, quantity: string, sender: string, recipient: string, direction: TransactionDirection, asset: { __typename?: 'Token', id: string, name?: string, symbol?: string, address?: string, decimals?: number, chain: Chain, standard?: TokenStandard, project?: { __typename?: 'TokenProject', id: string, isSpam?: boolean, logo?: { __typename?: 'Image', id: string, url: string } } }, transactedValue?: { __typename?: 'Amount', id: string, currency?: Currency, value: number } };

export type TokenApprovalPartsFragment = { __typename?: 'TokenApproval', id: string, tokenStandard: TokenStandard, approvedAddress: string, quantity: string, asset: { __typename?: 'Token', id: string, name?: string, symbol?: string, address?: string, decimals?: number, chain: Chain, standard?: TokenStandard, project?: { __typename?: 'TokenProject', id: string, isSpam?: boolean, logo?: { __typename?: 'Image', id: string, url: string } } } };

export type NftApprovalPartsFragment = { __typename?: 'NftApproval', id: string, nftStandard: NftStandard, approvedAddress: string, asset: { __typename?: 'NftAsset', id: string, name?: string, tokenId: string, nftContract?: { __typename?: 'NftContract', id: string, chain: Chain, address: string }, image?: { __typename?: 'Image', id: string, url: string }, collection?: { __typename?: 'NftCollection', id: string, name?: string } } };

export type NftApproveForAllPartsFragment = { __typename?: 'NftApproveForAll', id: string, nftStandard: NftStandard, operatorAddress: string, approved: boolean, asset: { __typename?: 'NftAsset', id: string, name?: string, tokenId: string, nftContract?: { __typename?: 'NftContract', id: string, chain: Chain, address: string }, image?: { __typename?: 'Image', id: string, url: string }, collection?: { __typename?: 'NftCollection', id: string, name?: string } } };

export type TransactionPartsFragment = { __typename?: 'Transaction', id: string, blockNumber: number, hash: string, status: TransactionStatus, to: string, from: string };

export type AssetActivityPartsFragment = { __typename?: 'AssetActivity', id: string, timestamp: number, type: ActivityType, chain: Chain, transaction: { __typename?: 'Transaction', id: string, blockNumber: number, hash: string, status: TransactionStatus, to: string, from: string }, assetChanges: Array<{ __typename: 'NftApproval', id: string, nftStandard: NftStandard, approvedAddress: string, asset: { __typename?: 'NftAsset', id: string, name?: string, tokenId: string, nftContract?: { __typename?: 'NftContract', id: string, chain: Chain, address: string }, image?: { __typename?: 'Image', id: string, url: string }, collection?: { __typename?: 'NftCollection', id: string, name?: string } } } | { __typename: 'NftApproveForAll', id: string, nftStandard: NftStandard, operatorAddress: string, approved: boolean, asset: { __typename?: 'NftAsset', id: string, name?: string, tokenId: string, nftContract?: { __typename?: 'NftContract', id: string, chain: Chain, address: string }, image?: { __typename?: 'Image', id: string, url: string }, collection?: { __typename?: 'NftCollection', id: string, name?: string } } } | { __typename: 'NftTransfer', id: string, nftStandard: NftStandard, sender: string, recipient: string, direction: TransactionDirection, asset: { __typename?: 'NftAsset', id: string, name?: string, tokenId: string, nftContract?: { __typename?: 'NftContract', id: string, chain: Chain, address: string }, image?: { __typename?: 'Image', id: string, url: string }, collection?: { __typename?: 'NftCollection', id: string, name?: string } } } | { __typename: 'TokenApproval', id: string, tokenStandard: TokenStandard, approvedAddress: string, quantity: string, asset: { __typename?: 'Token', id: string, name?: string, symbol?: string, address?: string, decimals?: number, chain: Chain, standard?: TokenStandard, project?: { __typename?: 'TokenProject', id: string, isSpam?: boolean, logo?: { __typename?: 'Image', id: string, url: string } } } } | { __typename: 'TokenTransfer', id: string, tokenStandard: TokenStandard, quantity: string, sender: string, recipient: string, direction: TransactionDirection, asset: { __typename?: 'Token', id: string, name?: string, symbol?: string, address?: string, decimals?: number, chain: Chain, standard?: TokenStandard, project?: { __typename?: 'TokenProject', id: string, isSpam?: boolean, logo?: { __typename?: 'Image', id: string, url: string } } }, transactedValue?: { __typename?: 'Amount', id: string, currency?: Currency, value: number } }> };

export type TransactionListQueryVariables = Exact<{
  account: Scalars['String'];
}>;


export type TransactionListQuery = { __typename?: 'Query', portfolios?: Array<{ __typename?: 'Portfolio', id: string, assetActivities?: Array<{ __typename?: 'AssetActivity', id: string, timestamp: number, type: ActivityType, chain: Chain, transaction: { __typename?: 'Transaction', id: string, blockNumber: number, hash: string, status: TransactionStatus, to: string, from: string }, assetChanges: Array<{ __typename: 'NftApproval', id: string, nftStandard: NftStandard, approvedAddress: string, asset: { __typename?: 'NftAsset', id: string, name?: string, tokenId: string, nftContract?: { __typename?: 'NftContract', id: string, chain: Chain, address: string }, image?: { __typename?: 'Image', id: string, url: string }, collection?: { __typename?: 'NftCollection', id: string, name?: string } } } | { __typename: 'NftApproveForAll', id: string, nftStandard: NftStandard, operatorAddress: string, approved: boolean, asset: { __typename?: 'NftAsset', id: string, name?: string, tokenId: string, nftContract?: { __typename?: 'NftContract', id: string, chain: Chain, address: string }, image?: { __typename?: 'Image', id: string, url: string }, collection?: { __typename?: 'NftCollection', id: string, name?: string } } } | { __typename: 'NftTransfer', id: string, nftStandard: NftStandard, sender: string, recipient: string, direction: TransactionDirection, asset: { __typename?: 'NftAsset', id: string, name?: string, tokenId: string, nftContract?: { __typename?: 'NftContract', id: string, chain: Chain, address: string }, image?: { __typename?: 'Image', id: string, url: string }, collection?: { __typename?: 'NftCollection', id: string, name?: string } } } | { __typename: 'TokenApproval', id: string, tokenStandard: TokenStandard, approvedAddress: string, quantity: string, asset: { __typename?: 'Token', id: string, name?: string, symbol?: string, address?: string, decimals?: number, chain: Chain, standard?: TokenStandard, project?: { __typename?: 'TokenProject', id: string, isSpam?: boolean, logo?: { __typename?: 'Image', id: string, url: string } } } } | { __typename: 'TokenTransfer', id: string, tokenStandard: TokenStandard, quantity: string, sender: string, recipient: string, direction: TransactionDirection, asset: { __typename?: 'Token', id: string, name?: string, symbol?: string, address?: string, decimals?: number, chain: Chain, standard?: TokenStandard, project?: { __typename?: 'TokenProject', id: string, isSpam?: boolean, logo?: { __typename?: 'Image', id: string, url: string } } }, transactedValue?: { __typename?: 'Amount', id: string, currency?: Currency, value: number } }> }> }> };

export const TransactionPartsFragmentDoc = gql`
    fragment TransactionParts on Transaction {
  id
  blockNumber
  hash
  status
  to
  from
}
    `;
export const TokenAssetPartsFragmentDoc = gql`
    fragment TokenAssetParts on Token {
  id
  name
  symbol
  address
  decimals
  chain
  standard
  project {
    id
    isSpam
    logo {
      id
      url
    }
  }
}
    `;
export const TokenTransferPartsFragmentDoc = gql`
    fragment TokenTransferParts on TokenTransfer {
  id
  asset {
    ...TokenAssetParts
  }
  tokenStandard
  quantity
  sender
  recipient
  direction
  transactedValue {
    id
    currency
    value
  }
}
    ${TokenAssetPartsFragmentDoc}`;
export const NftAssetPartsFragmentDoc = gql`
    fragment NFTAssetParts on NftAsset {
  id
  name
  nftContract {
    id
    chain
    address
  }
  tokenId
  image {
    id
    url
  }
  collection {
    id
    name
  }
}
    `;
export const NftTransferPartsFragmentDoc = gql`
    fragment NFTTransferParts on NftTransfer {
  id
  asset {
    ...NFTAssetParts
  }
  nftStandard
  sender
  recipient
  direction
}
    ${NftAssetPartsFragmentDoc}`;
export const TokenApprovalPartsFragmentDoc = gql`
    fragment TokenApprovalParts on TokenApproval {
  id
  asset {
    ...TokenAssetParts
  }
  tokenStandard
  approvedAddress
  quantity
}
    ${TokenAssetPartsFragmentDoc}`;
export const NftApprovalPartsFragmentDoc = gql`
    fragment NFTApprovalParts on NftApproval {
  id
  asset {
    ...NFTAssetParts
  }
  nftStandard
  approvedAddress
}
    ${NftAssetPartsFragmentDoc}`;
export const NftApproveForAllPartsFragmentDoc = gql`
    fragment NFTApproveForAllParts on NftApproveForAll {
  id
  asset {
    ...NFTAssetParts
  }
  nftStandard
  operatorAddress
  approved
}
    ${NftAssetPartsFragmentDoc}`;
export const AssetActivityPartsFragmentDoc = gql`
    fragment AssetActivityParts on AssetActivity {
  id
  timestamp
  type
  chain
  transaction {
    ...TransactionParts
  }
  assetChanges {
    __typename
    ... on TokenTransfer {
      ...TokenTransferParts
    }
    ... on NftTransfer {
      ...NFTTransferParts
    }
    ... on TokenApproval {
      ...TokenApprovalParts
    }
    ... on NftApproval {
      ...NFTApprovalParts
    }
    ... on NftApproveForAll {
      ...NFTApproveForAllParts
    }
  }
}
    ${TransactionPartsFragmentDoc}
${TokenTransferPartsFragmentDoc}
${NftTransferPartsFragmentDoc}
${TokenApprovalPartsFragmentDoc}
${NftApprovalPartsFragmentDoc}
${NftApproveForAllPartsFragmentDoc}`;
export const RecentlySearchedAssetsDocument = gql`
    query RecentlySearchedAssets($collectionAddresses: [String!]!, $contracts: [ContractInput!]!) {
  nftCollections(filter: {addresses: $collectionAddresses}) {
    edges {
      node {
        collectionId
        image {
          url
        }
        isVerified
        name
        numAssets
        nftContracts {
          address
        }
        markets(currencies: ETH) {
          floorPrice {
            currency
            value
          }
        }
      }
    }
  }
  tokens(contracts: $contracts) {
    id
    decimals
    name
    chain
    standard
    address
    symbol
    market(currency: USD) {
      id
      price {
        id
        value
        currency
      }
      pricePercentChange(duration: DAY) {
        id
        value
      }
      volume24H: volume(duration: DAY) {
        id
        value
        currency
      }
    }
    project {
      id
      logoUrl
      safetyLevel
    }
  }
}
    `;

/**
 * __useRecentlySearchedAssetsQuery__
 *
 * To run a query within a React component, call `useRecentlySearchedAssetsQuery` and pass it any options that fit your needs.
 * When your component renders, `useRecentlySearchedAssetsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRecentlySearchedAssetsQuery({
 *   variables: {
 *      collectionAddresses: // value for 'collectionAddresses'
 *      contracts: // value for 'contracts'
 *   },
 * });
 */
export function useRecentlySearchedAssetsQuery(baseOptions: Apollo.QueryHookOptions<RecentlySearchedAssetsQuery, RecentlySearchedAssetsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RecentlySearchedAssetsQuery, RecentlySearchedAssetsQueryVariables>(RecentlySearchedAssetsDocument, options);
      }
export function useRecentlySearchedAssetsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RecentlySearchedAssetsQuery, RecentlySearchedAssetsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RecentlySearchedAssetsQuery, RecentlySearchedAssetsQueryVariables>(RecentlySearchedAssetsDocument, options);
        }
export type RecentlySearchedAssetsQueryHookResult = ReturnType<typeof useRecentlySearchedAssetsQuery>;
export type RecentlySearchedAssetsLazyQueryHookResult = ReturnType<typeof useRecentlySearchedAssetsLazyQuery>;
export type RecentlySearchedAssetsQueryResult = Apollo.QueryResult<RecentlySearchedAssetsQuery, RecentlySearchedAssetsQueryVariables>;
export const SearchTokensDocument = gql`
    query SearchTokens($searchQuery: String!) {
  searchTokens(searchQuery: $searchQuery) {
    id
    decimals
    name
    chain
    standard
    address
    symbol
    market(currency: USD) {
      id
      price {
        id
        value
        currency
      }
      pricePercentChange(duration: DAY) {
        id
        value
      }
      volume24H: volume(duration: DAY) {
        id
        value
        currency
      }
    }
    project {
      id
      logoUrl
      safetyLevel
    }
  }
}
    `;

/**
 * __useSearchTokensQuery__
 *
 * To run a query within a React component, call `useSearchTokensQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchTokensQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchTokensQuery({
 *   variables: {
 *      searchQuery: // value for 'searchQuery'
 *   },
 * });
 */
export function useSearchTokensQuery(baseOptions: Apollo.QueryHookOptions<SearchTokensQuery, SearchTokensQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchTokensQuery, SearchTokensQueryVariables>(SearchTokensDocument, options);
      }
export function useSearchTokensLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchTokensQuery, SearchTokensQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchTokensQuery, SearchTokensQueryVariables>(SearchTokensDocument, options);
        }
export type SearchTokensQueryHookResult = ReturnType<typeof useSearchTokensQuery>;
export type SearchTokensLazyQueryHookResult = ReturnType<typeof useSearchTokensLazyQuery>;
export type SearchTokensQueryResult = Apollo.QueryResult<SearchTokensQuery, SearchTokensQueryVariables>;
export const TokenDocument = gql`
    query Token($chain: Chain!, $address: String = null) {
  token(chain: $chain, address: $address) {
    id
    decimals
    name
    chain
    address
    symbol
    standard
    market(currency: USD) {
      id
      totalValueLocked {
        id
        value
        currency
      }
      price {
        id
        value
        currency
      }
      volume24H: volume(duration: DAY) {
        id
        value
        currency
      }
      priceHigh52W: priceHighLow(duration: YEAR, highLow: HIGH) {
        id
        value
      }
      priceLow52W: priceHighLow(duration: YEAR, highLow: LOW) {
        id
        value
      }
    }
    project {
      id
      description
      homepageUrl
      twitterName
      logoUrl
      tokens {
        id
        chain
        address
      }
    }
  }
}
    `;

/**
 * __useTokenQuery__
 *
 * To run a query within a React component, call `useTokenQuery` and pass it any options that fit your needs.
 * When your component renders, `useTokenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTokenQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *      address: // value for 'address'
 *   },
 * });
 */
export function useTokenQuery(baseOptions: Apollo.QueryHookOptions<TokenQuery, TokenQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TokenQuery, TokenQueryVariables>(TokenDocument, options);
      }
export function useTokenLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TokenQuery, TokenQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TokenQuery, TokenQueryVariables>(TokenDocument, options);
        }
export type TokenQueryHookResult = ReturnType<typeof useTokenQuery>;
export type TokenLazyQueryHookResult = ReturnType<typeof useTokenLazyQuery>;
export type TokenQueryResult = Apollo.QueryResult<TokenQuery, TokenQueryVariables>;
export const TokenPriceDocument = gql`
    query TokenPrice($chain: Chain!, $address: String = null, $duration: HistoryDuration!) {
  token(chain: $chain, address: $address) {
    id
    address
    chain
    market(currency: USD) {
      id
      price {
        id
        value
      }
      priceHistory(duration: $duration) {
        id
        timestamp
        value
      }
    }
  }
}
    `;

/**
 * __useTokenPriceQuery__
 *
 * To run a query within a React component, call `useTokenPriceQuery` and pass it any options that fit your needs.
 * When your component renders, `useTokenPriceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTokenPriceQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *      address: // value for 'address'
 *      duration: // value for 'duration'
 *   },
 * });
 */
export function useTokenPriceQuery(baseOptions: Apollo.QueryHookOptions<TokenPriceQuery, TokenPriceQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TokenPriceQuery, TokenPriceQueryVariables>(TokenPriceDocument, options);
      }
export function useTokenPriceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TokenPriceQuery, TokenPriceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TokenPriceQuery, TokenPriceQueryVariables>(TokenPriceDocument, options);
        }
export type TokenPriceQueryHookResult = ReturnType<typeof useTokenPriceQuery>;
export type TokenPriceLazyQueryHookResult = ReturnType<typeof useTokenPriceLazyQuery>;
export type TokenPriceQueryResult = Apollo.QueryResult<TokenPriceQuery, TokenPriceQueryVariables>;
export const UniswapPricesDocument = gql`
    query UniswapPrices($contracts: [ContractInput!]!) {
  tokens(contracts: $contracts) {
    id
    address
    chain
    standard
    project {
      id
      markets(currencies: [USD]) {
        id
        price {
          id
          value
        }
      }
    }
  }
}
    `;

/**
 * __useUniswapPricesQuery__
 *
 * To run a query within a React component, call `useUniswapPricesQuery` and pass it any options that fit your needs.
 * When your component renders, `useUniswapPricesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUniswapPricesQuery({
 *   variables: {
 *      contracts: // value for 'contracts'
 *   },
 * });
 */
export function useUniswapPricesQuery(baseOptions: Apollo.QueryHookOptions<UniswapPricesQuery, UniswapPricesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UniswapPricesQuery, UniswapPricesQueryVariables>(UniswapPricesDocument, options);
      }
export function useUniswapPricesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UniswapPricesQuery, UniswapPricesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UniswapPricesQuery, UniswapPricesQueryVariables>(UniswapPricesDocument, options);
        }
export type UniswapPricesQueryHookResult = ReturnType<typeof useUniswapPricesQuery>;
export type UniswapPricesLazyQueryHookResult = ReturnType<typeof useUniswapPricesLazyQuery>;
export type UniswapPricesQueryResult = Apollo.QueryResult<UniswapPricesQuery, UniswapPricesQueryVariables>;
export const TokenSpotPriceDocument = gql`
    query TokenSpotPrice($chain: Chain!, $address: String = null) {
  token(chain: $chain, address: $address) {
    id
    address
    chain
    name
    symbol
    project {
      id
      markets(currencies: [USD]) {
        id
        price {
          id
          value
        }
      }
    }
  }
}
    `;

/**
 * __useTokenSpotPriceQuery__
 *
 * To run a query within a React component, call `useTokenSpotPriceQuery` and pass it any options that fit your needs.
 * When your component renders, `useTokenSpotPriceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTokenSpotPriceQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *      address: // value for 'address'
 *   },
 * });
 */
export function useTokenSpotPriceQuery(baseOptions: Apollo.QueryHookOptions<TokenSpotPriceQuery, TokenSpotPriceQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TokenSpotPriceQuery, TokenSpotPriceQueryVariables>(TokenSpotPriceDocument, options);
      }
export function useTokenSpotPriceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TokenSpotPriceQuery, TokenSpotPriceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TokenSpotPriceQuery, TokenSpotPriceQueryVariables>(TokenSpotPriceDocument, options);
        }
export type TokenSpotPriceQueryHookResult = ReturnType<typeof useTokenSpotPriceQuery>;
export type TokenSpotPriceLazyQueryHookResult = ReturnType<typeof useTokenSpotPriceLazyQuery>;
export type TokenSpotPriceQueryResult = Apollo.QueryResult<TokenSpotPriceQuery, TokenSpotPriceQueryVariables>;
export const TopTokens100Document = gql`
    query TopTokens100($duration: HistoryDuration!, $chain: Chain!) {
  topTokens(pageSize: 100, page: 1, chain: $chain, orderBy: VOLUME) {
    id
    name
    chain
    address
    symbol
    standard
    market(currency: USD) {
      id
      totalValueLocked {
        id
        value
        currency
      }
      price {
        id
        value
        currency
      }
      pricePercentChange(duration: $duration) {
        id
        currency
        value
      }
      volume(duration: $duration) {
        id
        value
        currency
      }
    }
    project {
      id
      logoUrl
    }
  }
}
    `;

/**
 * __useTopTokens100Query__
 *
 * To run a query within a React component, call `useTopTokens100Query` and pass it any options that fit your needs.
 * When your component renders, `useTopTokens100Query` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTopTokens100Query({
 *   variables: {
 *      duration: // value for 'duration'
 *      chain: // value for 'chain'
 *   },
 * });
 */
export function useTopTokens100Query(baseOptions: Apollo.QueryHookOptions<TopTokens100Query, TopTokens100QueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TopTokens100Query, TopTokens100QueryVariables>(TopTokens100Document, options);
      }
export function useTopTokens100LazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TopTokens100Query, TopTokens100QueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TopTokens100Query, TopTokens100QueryVariables>(TopTokens100Document, options);
        }
export type TopTokens100QueryHookResult = ReturnType<typeof useTopTokens100Query>;
export type TopTokens100LazyQueryHookResult = ReturnType<typeof useTopTokens100LazyQuery>;
export type TopTokens100QueryResult = Apollo.QueryResult<TopTokens100Query, TopTokens100QueryVariables>;
export const TopTokensSparklineDocument = gql`
    query TopTokensSparkline($duration: HistoryDuration!, $chain: Chain!) {
  topTokens(pageSize: 100, page: 1, chain: $chain, orderBy: VOLUME) {
    id
    address
    chain
    market(currency: USD) {
      id
      priceHistory(duration: $duration) {
        id
        timestamp
        value
      }
    }
  }
}
    `;

/**
 * __useTopTokensSparklineQuery__
 *
 * To run a query within a React component, call `useTopTokensSparklineQuery` and pass it any options that fit your needs.
 * When your component renders, `useTopTokensSparklineQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTopTokensSparklineQuery({
 *   variables: {
 *      duration: // value for 'duration'
 *      chain: // value for 'chain'
 *   },
 * });
 */
export function useTopTokensSparklineQuery(baseOptions: Apollo.QueryHookOptions<TopTokensSparklineQuery, TopTokensSparklineQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TopTokensSparklineQuery, TopTokensSparklineQueryVariables>(TopTokensSparklineDocument, options);
      }
export function useTopTokensSparklineLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TopTokensSparklineQuery, TopTokensSparklineQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TopTokensSparklineQuery, TopTokensSparklineQueryVariables>(TopTokensSparklineDocument, options);
        }
export type TopTokensSparklineQueryHookResult = ReturnType<typeof useTopTokensSparklineQuery>;
export type TopTokensSparklineLazyQueryHookResult = ReturnType<typeof useTopTokensSparklineLazyQuery>;
export type TopTokensSparklineQueryResult = Apollo.QueryResult<TopTokensSparklineQuery, TopTokensSparklineQueryVariables>;
export const TopTokens100SubgraphDocument = gql`
    query TopTokens100Subgraph {
  tokenDayDatas(pageSize: 100, orderBy: date, orderDirection: desc) {
    date
    priceUSD
    totalValueLockedUSD
    volumeUSD
    volume
    token {
      id
      name
      symbol
    }
  }
}
    `;

/**
 * __useTopTokens100SubgraphQuery__
 *
 * To run a query within a React component, call `useTopTokens100SubgraphQuery` and pass it any options that fit your needs.
 * When your component renders, `useTopTokens100SubgraphQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTopTokens100SubgraphQuery({
 *   variables: {
 *   },
 * });
 */
export function useTopTokens100SubgraphQuery(baseOptions?: Apollo.QueryHookOptions<TopTokens100SubgraphQuery, TopTokens100SubgraphQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TopTokens100SubgraphQuery, TopTokens100SubgraphQueryVariables>(TopTokens100SubgraphDocument, options);
      }
export function useTopTokens100SubgraphLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TopTokens100SubgraphQuery, TopTokens100SubgraphQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TopTokens100SubgraphQuery, TopTokens100SubgraphQueryVariables>(TopTokens100SubgraphDocument, options);
        }
export type TopTokens100SubgraphQueryHookResult = ReturnType<typeof useTopTokens100SubgraphQuery>;
export type TopTokens100SubgraphLazyQueryHookResult = ReturnType<typeof useTopTokens100SubgraphLazyQuery>;
export type TopTokens100SubgraphQueryResult = Apollo.QueryResult<TopTokens100SubgraphQuery, TopTokens100SubgraphQueryVariables>;
export const TrendingTokensDocument = gql`
    query TrendingTokens($chain: Chain!) {
  topTokens(pageSize: 4, page: 1, chain: $chain, orderBy: VOLUME) {
    id
    decimals
    name
    chain
    standard
    address
    symbol
    market(currency: USD) {
      id
      price {
        id
        value
        currency
      }
      pricePercentChange(duration: DAY) {
        id
        value
      }
      volume24H: volume(duration: DAY) {
        id
        value
        currency
      }
    }
    project {
      id
      logoUrl
      safetyLevel
    }
  }
}
    `;

/**
 * __useTrendingTokensQuery__
 *
 * To run a query within a React component, call `useTrendingTokensQuery` and pass it any options that fit your needs.
 * When your component renders, `useTrendingTokensQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTrendingTokensQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *   },
 * });
 */
export function useTrendingTokensQuery(baseOptions: Apollo.QueryHookOptions<TrendingTokensQuery, TrendingTokensQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TrendingTokensQuery, TrendingTokensQueryVariables>(TrendingTokensDocument, options);
      }
export function useTrendingTokensLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TrendingTokensQuery, TrendingTokensQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TrendingTokensQuery, TrendingTokensQueryVariables>(TrendingTokensDocument, options);
        }
export type TrendingTokensQueryHookResult = ReturnType<typeof useTrendingTokensQuery>;
export type TrendingTokensLazyQueryHookResult = ReturnType<typeof useTrendingTokensLazyQuery>;
export type TrendingTokensQueryResult = Apollo.QueryResult<TrendingTokensQuery, TrendingTokensQueryVariables>;
export const AssetDocument = gql`
    query Asset($address: String!, $orderBy: NftAssetSortableField, $asc: Boolean, $filter: NftAssetsFilterInput, $first: Int, $after: String, $last: Int, $before: String) {
  nftAssets(
    address: $address
    orderBy: $orderBy
    asc: $asc
    filter: $filter
    first: $first
    after: $after
    last: $last
    before: $before
  ) {
    edges {
      node {
        id
        name
        image {
          url
        }
        smallImage {
          url
        }
        tokenId
        animationUrl
        suspiciousFlag
        collection {
          name
          isVerified
          nftContracts {
            address
            standard
          }
        }
        listings(first: 1) {
          edges {
            node {
              address
              createdAt
              endAt
              id
              maker
              marketplace
              marketplaceUrl
              orderHash
              price {
                currency
                value
              }
              quantity
              startAt
              status
              taker
              tokenId
              type
              protocolParameters
            }
            cursor
          }
        }
        rarities {
          rank
        }
      }
      cursor
    }
    totalCount
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}
    `;

/**
 * __useAssetQuery__
 *
 * To run a query within a React component, call `useAssetQuery` and pass it any options that fit your needs.
 * When your component renders, `useAssetQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAssetQuery({
 *   variables: {
 *      address: // value for 'address'
 *      orderBy: // value for 'orderBy'
 *      asc: // value for 'asc'
 *      filter: // value for 'filter'
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      last: // value for 'last'
 *      before: // value for 'before'
 *   },
 * });
 */
export function useAssetQuery(baseOptions: Apollo.QueryHookOptions<AssetQuery, AssetQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AssetQuery, AssetQueryVariables>(AssetDocument, options);
      }
export function useAssetLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AssetQuery, AssetQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AssetQuery, AssetQueryVariables>(AssetDocument, options);
        }
export type AssetQueryHookResult = ReturnType<typeof useAssetQuery>;
export type AssetLazyQueryHookResult = ReturnType<typeof useAssetLazyQuery>;
export type AssetQueryResult = Apollo.QueryResult<AssetQuery, AssetQueryVariables>;
export const CollectionDocument = gql`
    query Collection($addresses: [String!]!) {
  nftCollections(filter: {addresses: $addresses}) {
    edges {
      cursor
      node {
        bannerImage {
          url
        }
        collectionId
        description
        discordUrl
        homepageUrl
        image {
          url
        }
        instagramName
        isVerified
        name
        numAssets
        twitterName
        nftContracts {
          address
          chain
          name
          standard
          symbol
          totalSupply
        }
        traits {
          name
          values
          stats {
            name
            value
            assets
            listings
          }
        }
        markets(currencies: ETH) {
          floorPrice {
            currency
            value
          }
          owners
          totalVolume {
            value
            currency
          }
          listings {
            value
          }
          volume(duration: DAY) {
            value
            currency
          }
          volumePercentChange(duration: DAY) {
            value
            currency
          }
          floorPricePercentChange(duration: DAY) {
            value
            currency
          }
          marketplaces {
            marketplace
            listings
            floorPrice
          }
        }
      }
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}
    `;

/**
 * __useCollectionQuery__
 *
 * To run a query within a React component, call `useCollectionQuery` and pass it any options that fit your needs.
 * When your component renders, `useCollectionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCollectionQuery({
 *   variables: {
 *      addresses: // value for 'addresses'
 *   },
 * });
 */
export function useCollectionQuery(baseOptions: Apollo.QueryHookOptions<CollectionQuery, CollectionQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CollectionQuery, CollectionQueryVariables>(CollectionDocument, options);
      }
export function useCollectionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CollectionQuery, CollectionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CollectionQuery, CollectionQueryVariables>(CollectionDocument, options);
        }
export type CollectionQueryHookResult = ReturnType<typeof useCollectionQuery>;
export type CollectionLazyQueryHookResult = ReturnType<typeof useCollectionLazyQuery>;
export type CollectionQueryResult = Apollo.QueryResult<CollectionQuery, CollectionQueryVariables>;
export const CollectionSearchDocument = gql`
    query CollectionSearch($query: String!) {
  nftCollections(filter: {nameQuery: $query}) {
    edges {
      cursor
      node {
        image {
          url
        }
        isVerified
        name
        numAssets
        nftContracts {
          address
          chain
          name
          symbol
          totalSupply
        }
        markets(currencies: ETH) {
          floorPrice {
            currency
            value
          }
        }
      }
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}
    `;

/**
 * __useCollectionSearchQuery__
 *
 * To run a query within a React component, call `useCollectionSearchQuery` and pass it any options that fit your needs.
 * When your component renders, `useCollectionSearchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCollectionSearchQuery({
 *   variables: {
 *      query: // value for 'query'
 *   },
 * });
 */
export function useCollectionSearchQuery(baseOptions: Apollo.QueryHookOptions<CollectionSearchQuery, CollectionSearchQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CollectionSearchQuery, CollectionSearchQueryVariables>(CollectionSearchDocument, options);
      }
export function useCollectionSearchLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CollectionSearchQuery, CollectionSearchQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CollectionSearchQuery, CollectionSearchQueryVariables>(CollectionSearchDocument, options);
        }
export type CollectionSearchQueryHookResult = ReturnType<typeof useCollectionSearchQuery>;
export type CollectionSearchLazyQueryHookResult = ReturnType<typeof useCollectionSearchLazyQuery>;
export type CollectionSearchQueryResult = Apollo.QueryResult<CollectionSearchQuery, CollectionSearchQueryVariables>;
export const DetailsDocument = gql`
    query Details($address: String!, $tokenId: String!) {
  nftAssets(address: $address, filter: {listed: false, tokenIds: [$tokenId]}) {
    edges {
      node {
        id
        name
        ownerAddress
        image {
          url
        }
        smallImage {
          url
        }
        originalImage {
          url
        }
        tokenId
        description
        animationUrl
        suspiciousFlag
        creator {
          address
          profileImage {
            url
          }
          isVerified
        }
        collection {
          name
          isVerified
          numAssets
          twitterName
          discordUrl
          homepageUrl
          image {
            url
          }
          nftContracts {
            address
            standard
          }
          description
        }
        listings(first: 1) {
          edges {
            node {
              address
              createdAt
              endAt
              id
              maker
              marketplace
              marketplaceUrl
              orderHash
              price {
                currency
                value
              }
              quantity
              startAt
              status
              taker
              tokenId
              type
              protocolParameters
            }
            cursor
          }
        }
        rarities {
          provider
          rank
          score
        }
        metadataUrl
        traits {
          name
          value
        }
      }
    }
  }
}
    `;

/**
 * __useDetailsQuery__
 *
 * To run a query within a React component, call `useDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDetailsQuery({
 *   variables: {
 *      address: // value for 'address'
 *      tokenId: // value for 'tokenId'
 *   },
 * });
 */
export function useDetailsQuery(baseOptions: Apollo.QueryHookOptions<DetailsQuery, DetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DetailsQuery, DetailsQueryVariables>(DetailsDocument, options);
      }
export function useDetailsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DetailsQuery, DetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DetailsQuery, DetailsQueryVariables>(DetailsDocument, options);
        }
export type DetailsQueryHookResult = ReturnType<typeof useDetailsQuery>;
export type DetailsLazyQueryHookResult = ReturnType<typeof useDetailsLazyQuery>;
export type DetailsQueryResult = Apollo.QueryResult<DetailsQuery, DetailsQueryVariables>;
export const NftActivityDocument = gql`
    query NftActivity($filter: NftActivityFilterInput, $after: String, $first: Int) {
  nftActivity(filter: $filter, after: $after, first: $first) {
    edges {
      node {
        id
        address
        tokenId
        asset {
          id
          metadataUrl
          image {
            id
            url
          }
          smallImage {
            id
            url
          }
          name
          rarities {
            id
            provider
            rank
            score
          }
          suspiciousFlag
          nftContract {
            id
            standard
          }
          collection {
            id
            image {
              id
              url
            }
          }
        }
        type
        marketplace
        fromAddress
        toAddress
        transactionHash
        price {
          id
          value
        }
        orderStatus
        quantity
        url
        timestamp
      }
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}
    `;

/**
 * __useNftActivityQuery__
 *
 * To run a query within a React component, call `useNftActivityQuery` and pass it any options that fit your needs.
 * When your component renders, `useNftActivityQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNftActivityQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      after: // value for 'after'
 *      first: // value for 'first'
 *   },
 * });
 */
export function useNftActivityQuery(baseOptions?: Apollo.QueryHookOptions<NftActivityQuery, NftActivityQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NftActivityQuery, NftActivityQueryVariables>(NftActivityDocument, options);
      }
export function useNftActivityLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NftActivityQuery, NftActivityQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NftActivityQuery, NftActivityQueryVariables>(NftActivityDocument, options);
        }
export type NftActivityQueryHookResult = ReturnType<typeof useNftActivityQuery>;
export type NftActivityLazyQueryHookResult = ReturnType<typeof useNftActivityLazyQuery>;
export type NftActivityQueryResult = Apollo.QueryResult<NftActivityQuery, NftActivityQueryVariables>;
export const NftBalanceDocument = gql`
    query NftBalance($ownerAddress: String!, $filter: NftBalancesFilterInput, $first: Int, $after: String, $last: Int, $before: String) {
  nftBalances(
    ownerAddress: $ownerAddress
    filter: $filter
    first: $first
    after: $after
    last: $last
    before: $before
  ) {
    edges {
      node {
        ownedAsset {
          id
          animationUrl
          collection {
            id
            isVerified
            image {
              id
              url
            }
            name
            twitterName
            nftContracts {
              id
              address
              chain
              name
              standard
              symbol
              totalSupply
            }
            markets(currencies: ETH) {
              id
              floorPrice {
                id
                value
              }
            }
          }
          description
          flaggedBy
          image {
            id
            url
          }
          originalImage {
            id
            url
          }
          name
          ownerAddress
          smallImage {
            id
            url
          }
          suspiciousFlag
          tokenId
          thumbnail {
            id
            url
          }
          listings(first: 1) {
            edges {
              node {
                price {
                  id
                  value
                  currency
                }
                createdAt
                marketplace
                endAt
              }
            }
          }
        }
        listedMarketplaces
        listingFees {
          id
          payoutAddress
          basisPoints
        }
        lastPrice {
          id
          currency
          timestamp
          value
        }
      }
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}
    `;

/**
 * __useNftBalanceQuery__
 *
 * To run a query within a React component, call `useNftBalanceQuery` and pass it any options that fit your needs.
 * When your component renders, `useNftBalanceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNftBalanceQuery({
 *   variables: {
 *      ownerAddress: // value for 'ownerAddress'
 *      filter: // value for 'filter'
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      last: // value for 'last'
 *      before: // value for 'before'
 *   },
 * });
 */
export function useNftBalanceQuery(baseOptions: Apollo.QueryHookOptions<NftBalanceQuery, NftBalanceQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NftBalanceQuery, NftBalanceQueryVariables>(NftBalanceDocument, options);
      }
export function useNftBalanceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NftBalanceQuery, NftBalanceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NftBalanceQuery, NftBalanceQueryVariables>(NftBalanceDocument, options);
        }
export type NftBalanceQueryHookResult = ReturnType<typeof useNftBalanceQuery>;
export type NftBalanceLazyQueryHookResult = ReturnType<typeof useNftBalanceLazyQuery>;
export type NftBalanceQueryResult = Apollo.QueryResult<NftBalanceQuery, NftBalanceQueryVariables>;
export const NftRouteDocument = gql`
    query NftRoute($chain: Chain = ETHEREUM, $senderAddress: String!, $nftTrades: [NftTradeInput!]!, $tokenTrades: [TokenTradeInput!]) {
  nftRoute(
    chain: $chain
    senderAddress: $senderAddress
    nftTrades: $nftTrades
    tokenTrades: $tokenTrades
  ) {
    id
    calldata
    route {
      amount
      contractAddress
      id
      marketplace
      price {
        id
        currency
        value
      }
      quotePrice {
        id
        currency
        value
      }
      tokenId
      tokenType
    }
    sendAmount {
      id
      currency
      value
    }
    toAddress
  }
}
    `;

/**
 * __useNftRouteQuery__
 *
 * To run a query within a React component, call `useNftRouteQuery` and pass it any options that fit your needs.
 * When your component renders, `useNftRouteQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNftRouteQuery({
 *   variables: {
 *      chain: // value for 'chain'
 *      senderAddress: // value for 'senderAddress'
 *      nftTrades: // value for 'nftTrades'
 *      tokenTrades: // value for 'tokenTrades'
 *   },
 * });
 */
export function useNftRouteQuery(baseOptions: Apollo.QueryHookOptions<NftRouteQuery, NftRouteQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NftRouteQuery, NftRouteQueryVariables>(NftRouteDocument, options);
      }
export function useNftRouteLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NftRouteQuery, NftRouteQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NftRouteQuery, NftRouteQueryVariables>(NftRouteDocument, options);
        }
export type NftRouteQueryHookResult = ReturnType<typeof useNftRouteQuery>;
export type NftRouteLazyQueryHookResult = ReturnType<typeof useNftRouteLazyQuery>;
export type NftRouteQueryResult = Apollo.QueryResult<NftRouteQuery, NftRouteQueryVariables>;
export const TrendingCollectionsDocument = gql`
    query TrendingCollections($size: Int, $timePeriod: HistoryDuration) {
  topCollections(first: $size, duration: $timePeriod) {
    edges {
      node {
        name
        nftContracts {
          address
          totalSupply
        }
        image {
          url
        }
        bannerImage {
          url
        }
        isVerified
        markets(currencies: ETH) {
          floorPrice {
            value
          }
          owners
          totalVolume {
            value
          }
          volume(duration: $timePeriod) {
            value
          }
          volumePercentChange(duration: $timePeriod) {
            value
          }
          floorPricePercentChange(duration: $timePeriod) {
            value
          }
          sales {
            value
          }
          listings {
            value
          }
        }
      }
    }
  }
}
    `;

/**
 * __useTrendingCollectionsQuery__
 *
 * To run a query within a React component, call `useTrendingCollectionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTrendingCollectionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTrendingCollectionsQuery({
 *   variables: {
 *      size: // value for 'size'
 *      timePeriod: // value for 'timePeriod'
 *   },
 * });
 */
export function useTrendingCollectionsQuery(baseOptions?: Apollo.QueryHookOptions<TrendingCollectionsQuery, TrendingCollectionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TrendingCollectionsQuery, TrendingCollectionsQueryVariables>(TrendingCollectionsDocument, options);
      }
export function useTrendingCollectionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TrendingCollectionsQuery, TrendingCollectionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TrendingCollectionsQuery, TrendingCollectionsQueryVariables>(TrendingCollectionsDocument, options);
        }
export type TrendingCollectionsQueryHookResult = ReturnType<typeof useTrendingCollectionsQuery>;
export type TrendingCollectionsLazyQueryHookResult = ReturnType<typeof useTrendingCollectionsLazyQuery>;
export type TrendingCollectionsQueryResult = Apollo.QueryResult<TrendingCollectionsQuery, TrendingCollectionsQueryVariables>;
export const PortfolioBalancesDocument = gql`
    query PortfolioBalances($ownerAddress: String!) {
  portfolios(
    ownerAddresses: [$ownerAddress]
    chains: [ETHEREUM, POLYGON, ARBITRUM, OPTIMISM, BNB]
  ) {
    id
    tokensTotalDenominatedValue {
      id
      value
    }
    tokensTotalDenominatedValueChange(duration: DAY) {
      absolute {
        id
        value
      }
      percentage {
        id
        value
      }
    }
    tokenBalances {
      id
      quantity
      denominatedValue {
        id
        currency
        value
      }
      tokenProjectMarket {
        id
        pricePercentChange(duration: DAY) {
          id
          value
        }
        tokenProject {
          id
          logoUrl
        }
      }
      token {
        id
        chain
        address
        name
        symbol
        standard
        decimals
      }
    }
  }
}
    `;

/**
 * __usePortfolioBalancesQuery__
 *
 * To run a query within a React component, call `usePortfolioBalancesQuery` and pass it any options that fit your needs.
 * When your component renders, `usePortfolioBalancesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePortfolioBalancesQuery({
 *   variables: {
 *      ownerAddress: // value for 'ownerAddress'
 *   },
 * });
 */
export function usePortfolioBalancesQuery(baseOptions: Apollo.QueryHookOptions<PortfolioBalancesQuery, PortfolioBalancesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PortfolioBalancesQuery, PortfolioBalancesQueryVariables>(PortfolioBalancesDocument, options);
      }
export function usePortfolioBalancesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PortfolioBalancesQuery, PortfolioBalancesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PortfolioBalancesQuery, PortfolioBalancesQueryVariables>(PortfolioBalancesDocument, options);
        }
export type PortfolioBalancesQueryHookResult = ReturnType<typeof usePortfolioBalancesQuery>;
export type PortfolioBalancesLazyQueryHookResult = ReturnType<typeof usePortfolioBalancesLazyQuery>;
export type PortfolioBalancesQueryResult = Apollo.QueryResult<PortfolioBalancesQuery, PortfolioBalancesQueryVariables>;
export const TransactionListDocument = gql`
    query TransactionList($account: String!) {
  portfolios(ownerAddresses: [$account]) {
    id
    assetActivities(pageSize: 50, page: 1) {
      ...AssetActivityParts
    }
  }
}
    ${AssetActivityPartsFragmentDoc}`;

/**
 * __useTransactionListQuery__
 *
 * To run a query within a React component, call `useTransactionListQuery` and pass it any options that fit your needs.
 * When your component renders, `useTransactionListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTransactionListQuery({
 *   variables: {
 *      account: // value for 'account'
 *   },
 * });
 */
export function useTransactionListQuery(baseOptions: Apollo.QueryHookOptions<TransactionListQuery, TransactionListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TransactionListQuery, TransactionListQueryVariables>(TransactionListDocument, options);
      }
export function useTransactionListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TransactionListQuery, TransactionListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TransactionListQuery, TransactionListQueryVariables>(TransactionListDocument, options);
        }
export type TransactionListQueryHookResult = ReturnType<typeof useTransactionListQuery>;
export type TransactionListLazyQueryHookResult = ReturnType<typeof useTransactionListLazyQuery>;
export type TransactionListQueryResult = Apollo.QueryResult<TransactionListQuery, TransactionListQueryVariables>;