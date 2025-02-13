import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useNotification } from '../contexts/NotificationContext';

export const useContractEvents = (contract) => {
  const [events, setEvents] = useState([]);
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!contract) return;

    const handleTransaction = async (user, amount, category, isExpense, event) => {
      try {
        const block = await event.getBlock();
        const timestamp = new Date(block.timestamp * 1000);
        
        const newEvent = {
          type: 'TransactionAdded',
          user,
          amount: ethers.utils.formatEther(amount),
          category,
          isExpense,
          timestamp,
          transactionHash: event.transactionHash
        };

        setEvents(prev => [newEvent, ...prev]);
        showNotification('success', `New transaction: ${newEvent.amount} ETH - ${category}`);
      } catch (error) {
        setError(error);
        showNotification('error', 'Failed to process transaction event');
      }
    };

    const handleBudgetUpdate = async (user, newLimit, event) => {
      try {
        const block = await event.getBlock();
        const timestamp = new Date(block.timestamp * 1000);

        const newEvent = {
          type: 'BudgetUpdated',
          user,
          newLimit: ethers.utils.formatEther(newLimit),
          timestamp,
          transactionHash: event.transactionHash
        };

        setEvents(prev => [newEvent, ...prev]);
        showNotification('info', `Budget updated to: ${newEvent.newLimit} ETH`);
      } catch (error) {
        setError(error);
        showNotification('error', 'Failed to process budget update event');
      }
    };

    contract.on("TransactionAdded", handleTransaction);
    contract.on("BudgetUpdated", handleBudgetUpdate);

    return () => {
      contract.off("TransactionAdded", handleTransaction);
      contract.off("BudgetUpdated", handleBudgetUpdate);
    };
  }, [contract]);

  return { events, isLoading, error };
};