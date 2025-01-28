import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, ABI } from '../contracts/config';
import { useWeb3 } from './Web3Context';

export const BudgetContext = createContext();

export const BudgetProvider = ({ children }) => {
  const { provider, account } = useWeb3();
  const [budgets, setBudgets] = useState({});
  const [spending, setSpending] = useState({});

  const fetchBudgets = useCallback(async () => {
    if (!provider || !account) return;
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
      const categories = ['food', 'transport', 'utilities', 'entertainment'];
      
      const budgetPromises = categories.map(category => 
        contract.getBudget(category)
      );
      const spendingPromises = categories.map(category => 
        contract.getMonthlySpending(account, category)
      );

      const [budgetResults, spendingResults] = await Promise.all([
        Promise.all(budgetPromises),
        Promise.all(spendingPromises)
      ]);

      const newBudgets = {};
      const newSpending = {};
      
      categories.forEach((category, index) => {
        newBudgets[category] = budgetResults[index];
        newSpending[category] = spendingResults[index];
      });

      setBudgets(newBudgets);
      setSpending(newSpending);
    } catch (error) {
      console.error('Failed to fetch budgets:', error);
    }
  }, [provider, account]);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const setBudget = async (category, amount) => {
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider.getSigner());
      const tx = await contract.setBudget(amount, category);
      await tx.wait();
      await fetchBudgets();
    } catch (error) {
      throw new Error('Failed to set budget: ' + error.message);
    }
  };

  return (
    <BudgetContext.Provider value={{
      budgets,
      spending,
      setBudget,
      fetchBudgets
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