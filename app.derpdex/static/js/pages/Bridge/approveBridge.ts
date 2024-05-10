/* eslint-disable @typescript-eslint/no-restricted-imports */
/* eslint-disable import/no-unused-modules */
import { MaxUint256 } from '@derpdex/permit2-sdk'
import { useWeb3React } from '@web3-react/core'
import { Erc20__factory } from 'abis/types'
import { BigNumberish, ethers } from 'ethers'
import { useState } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { TransactionType } from 'state/transactions/types'

export const useValidateApproveBridge = () => {
  const [isApproved, setIsApproved] = useState<boolean>(false)
  const { provider } = useWeb3React()

  const validateIfApproved = async ({
    contract_addresss,
    spender,
    account,
    signer,
  }: {
    contract_addresss: string
    spender: string
    account: string
    signer: ethers.providers.JsonRpcSigner
  }) => {
    try {
      const contract = new ethers.Contract(contract_addresss, Erc20__factory.abi, signer)
      const allowance = await contract.allowance(account, spender)
      console.log('allowance', allowance)
      if (!allowance || Number(allowance) === 0) {
        setIsApproved(false)
      } else {
        setIsApproved(true)
      }
    } catch (err) {
      setIsApproved(false)
      console.log(err)
    }
  }
  return {
    isApproved,
    setIsApproved,
    validateIfApproved,
  }
}

export const useApproveAllowance = () => {
  const [isAllowanceApproved, setIsAllowanceApproved] = useState<boolean>(false)
  const [isLoadingApprove, setIsLoadingApprove] = useState<boolean>(false)
  const addTransaction = useTransactionAdder()
  const approveAllowance = async ({
    contract_addresss,
    spender,
    account,
    signer,
  }: {
    contract_addresss: string
    spender: string
    account: string
    signer: ethers.providers.JsonRpcSigner
  }) => {
    try {
      const contract = new ethers.Contract(contract_addresss, Erc20__factory.abi, signer)
      const allowance = await contract.allowance(account, spender)

      if (!allowance || Number(allowance) === 0) {
        setIsLoadingApprove(true)
        const maxInt: BigNumberish = MaxUint256.toString()
        const response = await contract.approve(spender, maxInt)

        const resolvePending = await response.wait()
        setIsAllowanceApproved(true)
        const result = {
          resolvePending,
          info: {
            type: TransactionType.APPROVAL,
            tokenAddress: contract.address,
            spender: account,
          },
        }
        addTransaction(response, {
          type: TransactionType.APPROVAL,
          tokenAddress: contract.address,
          spender,
        })
        setIsLoadingApprove(false)
      } else {
        setIsAllowanceApproved(true)
      }
    } catch (err) {
      setIsLoadingApprove(false)
      setIsAllowanceApproved(false)
      console.log(err)
      throw err
    }
  }

  return {
    isLoadingApprove,
    approveAllowance,
  }
}
