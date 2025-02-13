import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { 
  Box, 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemText,
  Chip,
  CircularProgress 
} from '@mui/material';
import { ethers } from 'ethers';

const TransactionMonitor = ({ contract, transaction, onComplete }) => {
  const [transactions, setTransactions] = useState([]);
  const [status, setStatus] = useState('pending');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!contract) return;

    const transactionFilter = contract.filters.TransactionAdded();
    const paidTransactionFilter = contract.filters.PaidTransactionAdded();

    const handleNewTransaction = (user, transactionId, amount, category, isExpense) => {
      setTransactions(prev => [{
        id: transactionId.toString(),
        user,
        amount: ethers.utils.formatEther(amount),
        category,
        isExpense,
        timestamp: new Date()
      }, ...prev].slice(0, 10));
    };

    contract.on(transactionFilter, handleNewTransaction);
    contract.on(paidTransactionFilter, handleNewTransaction);

    return () => {
      contract.off(transactionFilter, handleNewTransaction);
      contract.off(paidTransactionFilter, handleNewTransaction);
    };
  }, [contract]);

  useEffect(() => {
    if (!transaction) return;

    const monitorTransaction = async () => {
      try {
        const receipt = await transaction.wait();
        setStatus(receipt.status === 1 ? 'success' : 'failed');
        onComplete && onComplete(receipt);
      } catch (err) {
        setStatus('failed');
        setError(err.message);
      }
    };

    monitorTransaction();
  }, [transaction]);

  if (!transaction) return null;

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {status === 'pending' && <CircularProgress size={20} />}
        <Typography>
          Transaction {transaction.hash}:
          {status === 'pending' && ' Processing...'}
          {status === 'success' && ' Completed successfully'}
          {status === 'failed' && ` Failed: ${error || 'Unknown error'}`}
        </Typography>
      </Box>
      <Typography variant="h6" gutterBottom>
        Recent Transactions
      </Typography>
      <List>
        {transactions.map((tx) => (
          <ListItem key={tx.id} divider>
            <ListItemText
              primary={`${tx.amount} ETH - ${tx.category}`}
              secondary={`${new Date(tx.timestamp).toLocaleString()}`}
            />
            <Chip 
              label={tx.isExpense ? 'Expense' : 'Income'}
              color={tx.isExpense ? 'error' : 'success'}
              size="small"
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

TransactionMonitor.propTypes = {
  contract: PropTypes.object,
  transaction: PropTypes.object,
  onComplete: PropTypes.func
};

export default TransactionMonitor;