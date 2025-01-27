import React, { createContext, useState, useContext, useEffect } from 'react';
import { ethers } from 'ethers';

const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState('');
  const [error, setError] = useState(null);

  const initWeb3 = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask');
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      setProvider(provider);
      setAccount(address);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    initWeb3();
  }, []);

  return (
    <Web3Context.Provider value={{ provider, account, error }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);