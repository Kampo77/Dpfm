import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from './Web3Context';

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const { provider, account } = useWeb3();
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({
    category: 'all',
    startDate: null,
    endDate: null,
    type: 'all' // income/expense
  });

  const filterTransactions = (txs) => {
    return txs.filter(tx => {
      const categoryMatch = filters.category === 'all' || tx.category === filters.category;
      const typeMatch = filters.type === 'all' || tx.isIncome === (filters.type === 'income');
      const dateMatch = (!filters.startDate || new Date(tx.timestamp) >= filters.startDate) &&
                       (!filters.endDate || new Date(tx.timestamp) <= filters.endDate);
      return categoryMatch && typeMatch && dateMatch;
    });
  };

  const addTransaction = async (amount, category, description, isIncome) => {
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider.getSigner());
      const tx = await contract.addTransaction(amount, category, description, isIncome);
      await tx.wait();
      await fetchTransactions();
    } catch (error) {
      throw new Error('Failed to add transaction: ' + error.message);
    }
  };

  const fetchTransactions = async () => {
    if (!provider || !account) return;
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
      const txs = await contract.getUserTransactions();
      setTransactions(txs);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [provider, account]);

  return (
    <TransactionContext.Provider value={{
      transactions: filterTransactions(transactions),
      filters,
      setFilters,
      addTransaction,
      fetchTransactions
    }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => useContext(TransactionContext);