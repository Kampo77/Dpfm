import { useState, useEffect, useCallback } from 'react';
import { useContract } from './useContract';
import { useWeb3 } from '../context/Web3Context';

export const useTransactions = () => {
  const contract = useContract();
  const { account } = useWeb3();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTransactions = useCallback(async () => {
    if (!contract || !account) return;
    
    setLoading(true);
    try {
      const txs = await contract.getUserTransactions();
      setTransactions(txs);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  }, [contract, account]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return { transactions, loading, fetchTransactions };
};