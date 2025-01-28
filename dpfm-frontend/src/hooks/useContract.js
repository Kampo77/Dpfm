import { useMemo } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '../context/Web3Context';
import { CONTRACT_ADDRESS } from '../contracts/addresses';
import { FINANCIAL_MANAGER_ABI } from '../contracts/abis';

export const useContract = () => {
  const { provider, account } = useWeb3();

  const contract = useMemo(() => {
    if (!provider || !account) return null;
    return new ethers.Contract(
      CONTRACT_ADDRESS,
      FINANCIAL_MANAGER_ABI,
      provider.getSigner()
    );
  }, [provider, account]);

  return contract;
};