import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useNotification } from '../contexts/NotificationContext';

export const useContractEvents = (contract) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();

  useEffect(() => {
    if (!contract) return;

    const eventTypes = {
      TransactionAdded: {
        handler: (user, amount, category, isExpense, event) => ({
          type: 'TransactionAdded',
          user,
          amount: ethers.utils.formatEther(amount),
          category,
          isExpense,
          timestamp: new Date(),
          hash: event.transactionHash
        }),
        notification: (event) => `New ${event.isExpense ? 'expense' : 'income'}: ${event.amount} ETH`
      },
      BudgetUpdated: {
        handler: (user, newLimit, event) => ({
          type: 'BudgetUpdated',
          user,
          newLimit: ethers.utils.formatEther(newLimit),
          timestamp: new Date(),
          hash: event.transactionHash
        }),
        notification: (event) => `Budget updated to ${event.newLimit} ETH`
      }
    };

    const subscribeToEvents = () => {
      Object.entries(eventTypes).forEach(([eventName, { handler, notification }]) => {
        contract.on(eventName, (...args) => {
          const event = handler(...args);
          setEvents(prev => [event, ...prev]);
          showNotification('success', notification(event));
        });
      });
    };

    const loadHistoricalEvents = async () => {
      try {
        const filter = {
          fromBlock: 0,
          toBlock: 'latest'
        };

        const events = await Promise.all(
          Object.keys(eventTypes).map(async (eventName) => {
            const logs = await contract.queryFilter(eventName, filter.fromBlock, filter.toBlock);
            return logs.map(log => {
              const parsed = contract.interface.parseLog(log);
              return eventTypes[eventName].handler(...parsed.args, log);
            });
          })
        );

        setEvents(events.flat().sort((a, b) => b.timestamp - a.timestamp));
      } catch (error) {
        showNotification('error', 'Failed to load historical events');
      } finally {
        setLoading(false);
      }
    };

    subscribeToEvents();
    loadHistoricalEvents();

    return () => {
      contract.removeAllListeners();
    };
  }, [contract]);

  return { events, loading };
};