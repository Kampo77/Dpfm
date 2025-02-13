import { useState } from 'react';
import { useNotification } from './useNotification';
import { ethers } from 'ethers';

export function useTransactionProcessor() {
  const [processing, setProcessing] = useState(false);
  const { showNotification } = useNotification();

  const processTransaction = async (action) => {
    if (processing) {
      showNotification('warning', 'Transaction already in progress');
      return;
    }

    setProcessing(true);
    try {
      const tx = await action();
      const receipt = await tx.wait();
      showNotification('success', `Transaction completed: ${receipt.transactionHash}`);
      return receipt;
    } catch (error) {
      if (error.code === 4001) {
        showNotification('info', 'Transaction cancelled by user');
      } else if (error.code === -32603) {
        showNotification('error', 'Transaction failed. Check your balance and gas settings.');
      } else {
        showNotification('error', error.message);
      }
      throw error;
    } finally {
      setProcessing(false);
    }
  };

  return { processing, processTransaction };
}