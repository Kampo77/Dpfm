import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Chip,
  Box,
  Typography
} from '@mui/material';
import { ethers } from 'ethers';

const TransactionList = ({ transactions }) => {
  const sortedTransactions = [...transactions].sort((a, b) => b.timestamp - a.timestamp);
  
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Recent Transactions
      </Typography>
      <List>
        {sortedTransactions.map((tx) => (
          <ListItem
            key={tx.hash}
            secondaryAction={
              <Chip
                label={tx.status}
                color={tx.status === 'confirmed' ? 'success' : 'warning'}
              />
            }
          >
            <ListItemText
              primary={`${tx.category} - ${ethers.utils.formatEther(tx.amount)} ETH`}
              secondary={`Transaction: ${tx.hash.slice(0, 6)}...${tx.hash.slice(-4)}`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default TransactionList;