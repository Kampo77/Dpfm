import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  Paper, 
  Typography,
  Skeleton,
  Alert
} from '@mui/material';
import { useTransactionEvents } from '../../hooks/useTransactionEvents';
import { useWeb3 } from '../../context/Web3Context';

const TransactionHistory = () => {
  const { transactions, loading } = useTransactionEvents();
  const { provider, account, error } = useWeb3();

  if (!provider || !account) {
    return (
      <Alert severity="info">
        Please connect your wallet
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        {error}
      </Alert>
    );
  }

  if (loading) {
    return (
      <Paper sx={{ p: 2 }}>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} height={60} />
        ))}
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Recent Transactions
      </Typography>
      <List>
        {transactions.map((tx) => (
          <ListItem key={tx.id} divider>
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