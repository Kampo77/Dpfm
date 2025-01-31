import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/contracts';
import { useWeb3 } from './Web3Context';

export const BudgetContext = createContext();

export const BudgetProvider = ({ children }) => {
  const { provider, account } = useWeb3();
  const [budgets, setBudgets] = useState({});
  const [spending, setSpending] = useState({});
  const [contract, setContract] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [];
  });

  // Save transactions to localStorage
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Initialize contract and load initial data
  useEffect(() => {
    if (provider && account) {
      const signer = provider.getSigner();
      const budgetContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );
      setContract(budgetContract);
      
      // Listen for new blocks instead of specific event
      provider.on("block", () => {
        refreshBudgets();
      });

      // Initial load
      refreshBudgets();

      return () => {
        provider.removeAllListeners("block");
      };
    }
  }, [provider, account]);

  const setBudget = async (category, amount) => {
    if (!contract || !account) {
      throw new Error('Contract not initialized');
    }

    try {
      // Validate category
      if (typeof category !== 'string' || !['food', 'transport', 'utilities', 'entertainment'].includes(category)) {
        throw new Error('Invalid category');
      }

      // Validate and parse amount
      if (!amount || isNaN(amount)) {
        throw new Error('Invalid amount');
      }

      // Convert amount to Wei
      const parsedAmount = ethers.utils.parseEther(amount.toString());
      
      // Call contract method
      const tx = await contract.setBudget(parsedAmount, category);
      
      // Add transaction to state
      const newTx = {
        hash: tx.hash,
        category,
        amount: parsedAmount,
        status: 'pending',
        timestamp: Date.now()
      };
      
      setTransactions(prev => [...prev, newTx]);

      // Wait for confirmation
      const receipt = await tx.wait();
      
      // Update transaction status
      setTransactions(prev => 
        prev.map(t => 
          t.hash === tx.hash 
            ? {...t, status: 'confirmed'} 
            : t
        )
      );

      // Refresh budgets after successful transaction
      await refreshBudgets();
      return receipt;
    } catch (error) {
      console.error('setBudget error:', error);
      throw new Error(`Failed to set budget: ${error.message}`);
    }
  };

  // Add cleanup for old transactions
  useEffect(() => {
    const ONE_HOUR = 3600000;
    const cleanup = () => {
      setTransactions(prev => 
        prev.filter(tx => Date.now() - tx.timestamp < ONE_HOUR)
      );
    };
    
    const interval = setInterval(cleanup, ONE_HOUR);
    return () => clearInterval(interval);
  }, []);

  const refreshBudgets = async () => {
    if (!contract || !account) return;
    setIsLoading(true);
    try {
      const budgetData = await contract.getBudgets(account);
      console.log('Fetched budgets:', budgetData);
      setBudgets(budgetData);
    } catch (error) {
      console.error('Error refreshing budgets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BudgetContext.Provider value={{
      budgets,
      spending,
      setBudget,
      refreshBudgets,
      isLoading,
      transactions // Add transactions to context
    }}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudgets = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudgets must be used within a BudgetProvider');
  }
  return context;
};