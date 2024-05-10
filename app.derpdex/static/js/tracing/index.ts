import 'components/analytics'

import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'
import { initializeAnalytics, OriginApplication } from '@uniswap/analytics'
import { SharedEventName } from '@uniswap/analytics-events'
import { isSentryEnabled } from 'utils/env'
import { getEnvName, isProductionEnv } from 'utils/env'

import { beforeSend } from './errors'

// Dump some metadata into the window to allow client verification.
window.GIT_COMMIT_HASH = process.env.REACT_APP_GIT_COMMIT_HASH

// Actual KEYs are set by proxy servers.
const AMPLITUDE_DUMMY_KEY = 'f959cb7dad2592b5e80f0114155ac8c2'
export const STATSIG_DUMMY_KEY = 'client-x8uOGyWevb8Pi6yn3HChGSOFr1gq7832jWfA6B1ifue'

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  release: process.env.REACT_APP_GIT_COMMIT_HASH,
  environment: getEnvName(),
  enabled: isSentryEnabled(),
  tracesSampleRate: Number(process.env.REACT_APP_SENTRY_TRACES_SAMPLE_RATE ?? 0),
  integrations: [
    new BrowserTracing({
      startTransactionOnLocationChange: false,
      startTransactionOnPageLoad: true,
    }),
  ],
  beforeSend,
})

initializeAnalytics(AMPLITUDE_DUMMY_KEY, OriginApplication.INTERFACE, {
  proxyUrl: process.env.REACT_APP_AMPLITUDE_PROXY_URL,
  defaultEventName: SharedEventName.PAGE_VIEWED,
  commitHash: process.env.REACT_APP_GIT_COMMIT_HASH,
  isProductionEnv: isProductionEnv(),
})

// Galxe
/**
 * Send event to Galxe
 * @param walletAddress User wallet address
 * @param type Either 'swap' or 'liquidity'
 */
export const sendEventToGalxe = async (walletAddress: string, type: string) => {
  if (!process.env.REACT_APP_IS_TESTSITE) return

  const path = type === 'swap' ? '/sendSwapToGalxe' : '/sendLiquidityToGalxe'

  const response = await fetch(process.env.REACT_APP_GALXE_API_URL + path, {
    method: 'POST',
    body: JSON.stringify({
      walletAddress,
    }),
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  })

  await response.json()
}
