import React, { useState, useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography
} from '@mui/material';
import { useWeb3 } from '../../context/Web3Context';
import { transactionService } from '../../services/transactionService';

const TransactionHistory = () => {
  const { contract } = useWeb3();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const txs = await transactionService.getUserTransactions(contract);
        setTransactions(txs);
      } catch (error) {
        console.error('Failed to load transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    if (contract) {
      loadTransactions();
    }
  }, [contract]);

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Transaction History
      </Typography>
      <List>
        {transactions.map((tx) => (
          <ListItem key={tx.id}>
            <ListItemText
              primary={`${tx.amount} ETH - ${tx.category}`}
              secondary={new Date(tx.timestamp).toLocaleString()}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default TransactionHistory;