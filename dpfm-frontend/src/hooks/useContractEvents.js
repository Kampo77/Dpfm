import { useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';

export const useContractEvents = () => {
  const { contract } = useWeb3();
  
  useEffect(() => {
    if (!contract) return;
    
    const transactionHandler = (user, id, amount) => {
      console.log('New transaction:', { user, id, amount });
    };
    
    contract.on('TransactionAdded', transactionHandler);
    return () => contract.off('TransactionAdded', transactionHandler);
  }, [contract]);
};