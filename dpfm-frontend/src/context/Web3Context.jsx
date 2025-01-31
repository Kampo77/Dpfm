import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { SUPPORTED_CHAIN_ID } from '../config/contracts';

export const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState(null);

  const switchToSepolia = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${SUPPORTED_CHAIN_ID.toString(16)}` }],
      });
      return true;
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${SUPPORTED_CHAIN_ID.toString(16)}`,
              chainName: 'Sepolia',
              nativeCurrency: {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18
              },
              rpcUrls: ['https://sepolia.infura.io/v3/'],
              blockExplorerUrls: ['https://sepolia.etherscan.io']
            }]
          });
          return true;
        } catch (addError) {
          throw new Error('Failed to add Sepolia network');
        }
      }
      throw new Error('Failed to switch to Sepolia network');
    }
  };

  const connectWallet = async () => {
    console.log('Connecting wallet...');
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();
      
      if (network.chainId !== SUPPORTED_CHAIN_ID) {
        await switchToSepolia();
      }

      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      
      setProvider(provider);
      setAccount(address);
      setIsConnected(true);
      setChainId(network.chainId);
      
      return true;
    } catch (error) {
      console.error('Wallet connection error:', error);
      throw error;
    }
  };

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const network = await provider.getNetwork();
          setChainId(network.chainId);
          
          const accounts = await window.ethereum.request({ 
            method: 'eth_accounts' 
          });
          
          if (accounts.length > 0) {
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            
            setProvider(provider);
            setAccount(address);
            setIsConnected(true);
            
            console.log('Initialized:', { 
              account: address,
              chainId: network.chainId 
            });
          }
        } catch (error) {
          console.error('Initialization error:', error);
        }
      }
    };

    init();

    if (window.ethereum) {
      window.ethereum.on('chainChanged', connectWallet);
      window.ethereum.on('accountsChanged', connectWallet);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('chainChanged', connectWallet);
        window.ethereum.removeListener('accountsChanged', connectWallet);
      }
    };
  }, []);

  return (
    <Web3Context.Provider value={{
      provider,
      account,
      isConnected,
      chainId,
      connectWallet
    }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);

export default Web3Context;