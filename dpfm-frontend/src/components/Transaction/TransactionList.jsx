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
import ErrorAlert from '../common/ErrorAlert';
import { handleTransactionError } from '../../utils/errorHandlers';

const TransactionList = () => {
  const { transactions, loading, error } = useTransactionEvents();
  const [newItems, setNewItems] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setNewItems(transactions);
  }, [transactions]);

  if (error) {
    const message = handleTransactionError(error);
    setErrorMessage(message);
  }

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
    <>
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
      <ErrorAlert 
        error={errorMessage}
        onClose={() => setErrorMessage('')}
      />
    </>
  );
};

export default TransactionList;