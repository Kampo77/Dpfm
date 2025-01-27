import React, { useEffect, useState } from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  Paper, 
  Typography,
  Skeleton,
  Fade
} from '@mui/material';
import { useTransactionEvents } from '../../hooks/useTransactionEvents';

const TransactionList = () => {
  const { transactions, loading } = useTransactionEvents();
  const [newItems, setNewItems] = useState([]);

  useEffect(() => {
    setNewItems(transactions);
  }, [transactions]);

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
        Transaction History
      </Typography>
      <List>
        {newItems.map((tx) => (
          <Fade in key={tx.id}>
            <ListItem divider>
              <ListItemText
                primary={`${tx.amount} ETH - ${tx.category}`}
                secondary={new Date(tx.timestamp).toLocaleString()}
                sx={{
                  color: tx.isIncome ? 'success.main' : 'error.main'
                }}
              />
            </ListItem>
          </Fade>
        ))}
      </List>
    </Paper>
  );
};

export default TransactionList;