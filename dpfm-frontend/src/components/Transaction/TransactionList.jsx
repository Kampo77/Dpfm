import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  Paper, 
  Typography,
  Skeleton 
} from '@mui/material';
import { useTransactionEvents } from '../../hooks/useTransactionEvents';

const TransactionList = () => {
  const { transactions, loading } = useTransactionEvents();

  if (loading) {
    return (
      <Paper sx={{ p: 2, mt: 2 }}>
        {[1,2,3].map((i) => (
          <Skeleton key={i} height={60} />
        ))}
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Recent Transactions
      </Typography>
      <List>
        {transactions.map((tx) => (
          <ListItem key={tx.id} divider>
            <ListItemText
              primary={`${tx.amount} ETH - ${tx.category}`}
              secondary={new Date(tx.timestamp).toLocaleString()}
              sx={{
                color: tx.isIncome ? 'success.main' : 'error.main'
              }}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default TransactionList;