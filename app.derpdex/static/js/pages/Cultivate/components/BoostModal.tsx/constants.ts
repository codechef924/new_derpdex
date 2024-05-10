export enum WEEK_OPTION {
  _1W = '1',
  _5W = '5',
  _10W = '10',
  _25W = '25',
  MAX = '52',
}

const DURATION_OPTIONS_TESTNET = [
  {
    label: WEEK_OPTION._1W + 'W',
    terms: WEEK_OPTION._1W,
    seconds: 120,
  },
  {
    label: WEEK_OPTION._5W + 'W',
    terms: WEEK_OPTION._5W,
    seconds: 240,
  },
  {
    label: WEEK_OPTION._10W + 'W',
    terms: WEEK_OPTION._10W,
    seconds: 6048000,
  },
  {
    label: WEEK_OPTION._25W + 'W',
    terms: WEEK_OPTION._25W,
    seconds: 15120000,
  },
  {
    label: 'MAX',
    terms: WEEK_OPTION.MAX,
    seconds: 31536000,
  },
]

const DURATION_OPTIONS_MAINNET = [
  {
    label: WEEK_OPTION._1W + 'W',
    terms: WEEK_OPTION._1W,
    seconds: 604800,
  },
  {
    label: WEEK_OPTION._5W + 'W',
    terms: WEEK_OPTION._5W,
    seconds: 3024000,
  },
  {
    label: WEEK_OPTION._10W + 'W',
    terms: WEEK_OPTION._10W,
    seconds: 6048000,
  },
  {
    label: WEEK_OPTION._25W + 'W',
    terms: WEEK_OPTION._25W,
    seconds: 15120000,
  },
  {
    label: 'MAX',
    terms: WEEK_OPTION.MAX,
    seconds: 31536000,
  },
]

export const DURATION_OPTIONS =
  process.env.REACT_APP_IS_TESTSITE === 'true' ? DURATION_OPTIONS_TESTNET : DURATION_OPTIONS_MAINNET
