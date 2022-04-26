import React, {useState, useEffect} from 'react';

export const TransactionContext = React.createContext()

let eth

if (typeof window !== 'undefined' ) {
    eth = window.ethereum
}


export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState()

  useEffect(() => {
    checkIfWalletIsConnected()
  }, [])

  const connectWallet = async (metamask = eth) => {
    try {
      if (!metamask) return alert('please install metamask')
      const accounts = await metamask.request({
        method: 'eth_requestAccounts',
      })
      setCurrentAccount(accounts[0])
    } catch (error) { 
      console.error(error)
      throw new Error('No ethereum Object.')
    }
  }

  const checkIfWalletIsConnected = async (metamask = eth) => {
    try {
      if (!metamask) return alert('please install metamask')

      const accounts = await metamask.request({ method: 'eth_accounts' })

      if (accounts.length) {
        setCurrentAccount(accounts[0])
        console.log('wallet is already connected!')
      }
    } catch (error) {
      console.error(error)
      throw new Error('No ethereum object.')
    }
  }

  const sendTransaction = async (
    metamask = eth,
    connectedAccount = currentAccount
  ) => {
    try {
      if (!metamask) return alert('Please install metamask')
      const { addressTo, amount } = formData
      const transactionContract = getEthereumContract()

      const parsedAmount = ethers.utils.parseEther(amount)

      await metamask.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: connectedAccount,
            to: addressTo,
            gas: '0x7EF40', //520000 Gwei
            value: parsedAmount._hex,
          },
        ],
      })

      const transactionHash = await transactionContract.publishTransaction(
        addressTo,
        parsedAmount,
        `Transferrring ETH ${parsedAmount} to ${addressTo}`,
        'TRANSFER'
      )

      setIsLoading(true)

      //Database
      // await transactionHash.wait(
      //   transactionHash.hash,
      //   amount,
      //   connectedAccount,
      //   addressTo
      // )

      setIsLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <TransactionContext.Provider
      value={{
        currentAccount,
        connectWallet,
      }}
    >
      {children}
    </TransactionContext.Provider>
  )
}