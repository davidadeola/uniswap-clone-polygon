import React, {useState, useEffect} from 'react';

export const TransactionContext = React.createContext()

let eth

if (typeof window !== 'undefined' ) {
    eth = window.ethereum
}

const SAMPLE_MESSAGE = 'This is a sample message'

export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState()

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

  return (
    <TransactionContext.Provider
      value={{
        currentAccount,
        connectWallet,
        SAMPLE_MESSAGE
      }}
    >
      {children}
    </TransactionContext.Provider>
  )
}