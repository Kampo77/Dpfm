import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import FinancialManager from '../artifacts/contracts/FinancialManager.sol/FinancialManager.json';

export const useContract = (contractAddress) => {
  const [contract, setContract] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initContract = async () => {
      try {
        if (typeof window.ethereum !== 'undefined') {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(
            contractAddress,
            FinancialManager.abi,
            signer
          );
          setContract(contract);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    initContract();
  }, [contractAddress]);

  return { contract, error, loading };
};