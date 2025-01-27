import React, { createContext, useState, useContext, useEffect } from 'react';
import { ethers } from 'ethers';
import FinancialManager from '../contracts/FileStorage.json';

const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const initializeWeb3 = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not installed');
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      
      const contract = new ethers.Contract(
        process.env.REACT_APP_CONTRACT_ADDRESS,
        FinancialManager.abi,
        signer
      );

      setProvider(provider);
      setContract(contract);
      setAccount(accounts[0]);

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts) => {
        setAccount(accounts[0]);
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeWeb3();
    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners();
      }
    };
  }, []);

  const connectWallet = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      setAccount(accounts[0]);
    } catch (err) {
      setError(err.message);
    }
  };

  const value = {
    contract,
    provider,
    account,
    loading,
    error,
    connectWallet
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

export default Web3Context;