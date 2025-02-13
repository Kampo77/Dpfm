import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export function useNetwork() {
  const [networkState, setNetworkState] = useState({
    isConnected: false,
    chainId: null,
    networkName: ''
  });

  useEffect(() => {
    const checkNetwork = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const network = await provider.getNetwork();
        
        setNetworkState({
          isConnected: true,
          chainId: network.chainId,
          networkName: network.name
        });
      }
    };

    checkNetwork();

    if (window.ethereum) {
      window.ethereum.on('chainChanged', checkNetwork);
      window.ethereum.on('networkChanged', checkNetwork);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('chainChanged', checkNetwork);
        window.ethereum.removeListener('networkChanged', checkNetwork);
      }
    };
  }, []);

  return networkState;
}