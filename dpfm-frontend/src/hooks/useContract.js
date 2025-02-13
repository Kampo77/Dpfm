import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_CONFIG } from '../config/contract';

export function useContract() {
  const [contract, setContract] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initContract = async () => {
      try {
        if (window.ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const contractInstance = new ethers.Contract(
            CONTRACT_CONFIG.address,
            CONTRACT_CONFIG.abi,
            signer
          );
          setContract(contractInstance);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    initContract();
  }, []);

  return { contract, error };
}