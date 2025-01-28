import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

export const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  const connectWallet = async () => {
    console.log('Connecting wallet...');
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        
        setProvider(provider);
        setAccount(accounts[0]);
        setIsConnected(true);
        
        console.log('Wallet connected:', { account: accounts[0] });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Connection error:', error);
      return false;
    }
  };

  useEffect(() => {
    const init = async () => {
      console.log('Initializing Web3Context...');
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          console.log('Found existing connection:', accounts[0]);
          await connectWallet();
        }
      }
    };

    init();

    window.ethereum?.on('accountsChanged', async (accounts) => {
      console.log('Account changed:', accounts);
      if (accounts.length > 0) {
        await connectWallet();
      } else {
        setProvider(null);
        setAccount('');
        setIsConnected(false);
      }
    });
  }, []);

  const value = {
    provider,
    account,
    isConnected,
    connectWallet
  };

  console.log('Web3Context state:', value);

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);

export default Web3Context;