import { useWeb3React } from '@web3-react/core'
import { GENESIS_API_URL } from 'constants/chains'
import { useEffect, useState } from 'react'

const url = process.env.REACT_APP_IS_TESTSITE === 'true' ? 'http://localhost:8080' : GENESIS_API_URL

export const useCheckClaimed = () => {
  const { account, chainId } = useWeb3React()

  const [isClaimed, setIsClaimed] = useState<any>(false)

  const fetchIsClaimed = async () => {
    try {
      if (!account || !chainId) throw '[account/chainId is required]'

      const searchParams = new URLSearchParams({
        userAddress: account.toLowerCase(),
        chainId: chainId.toString(),
      })

      const response = await fetch(url + '/airdrop' + '/isClaimed' + `?${searchParams}`, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      })

      if (!response.ok) throw 'No response from server'

      const data = await response.json()
      return data
    } catch (err) {
      console.log('[fetchIsClaimed]', err)
      throw err
    }
  }

  const onInitCall = async () => {
    try {
      const results = await fetchIsClaimed()

      if (results) {
        const { isClaimed }: { isClaimed: any } = results

        setIsClaimed(isClaimed)
      }
    } catch (err) {
      console.log('[onInitCall]', err)
    }
  }

  useEffect(() => {
    if (account && chainId) {
      onInitCall()
    }
  }, [account, chainId])

  return {
    isClaimed,
  }
}
