import { useEffect } from 'react';

export const useEventListener = (contract) => {
  useEffect(() => {
    if (!contract) return;

    const handlers = {
      TransactionAdded: (...args) => {
        console.log('Transaction added:', args);
      },
      BudgetUpdated: (...args) => {
        console.log('Budget updated:', args);
      }
    };

    // Register all event listeners
    Object.entries(handlers).forEach(([event, handler]) => {
      contract.on(event, handler);
    });

    // Cleanup
    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        contract.off(event, handler);
      });
    };
  }, [contract]);
};