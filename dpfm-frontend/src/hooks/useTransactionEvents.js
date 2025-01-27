import { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';

export const useTransactionEvents = () => {
  const { contract } = useWeb3();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!contract) return;

    const loadTransactions = async () => {
      try {
        const txs = await contract.getUserTransactions();
        setTransactions(txs);
      } catch (error) {
        console.error('Failed to load transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    const handleNewTransaction = async (user, id, amount, category, isIncome, event) => {
      const block = await event.getBlock();
      setTransactions(prev => [...prev, {
        id: id.toString(),
        user,
        amount,
        category,
        isIncome,
        timestamp: block.timestamp * 1000
      }]);
    };

    loadTransactions();
    contract.on('TransactionAdded', handleNewTransaction);

    return () => {
      contract.off('TransactionAdded', handleNewTransaction);
    };
  }, [contract]);

  return { transactions, loading };
};