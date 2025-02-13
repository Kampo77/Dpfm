import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText
} from '@mui/material';

export default function TransactionConfirmation({ open, transaction, onConfirm, onCancel }) {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>Confirm Transaction</DialogTitle>
      <DialogContent>
        <List>
          <ListItem>
            <ListItemText 
              primary="Amount"
              secondary={`${transaction?.amount} ETH`}
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Category"
              secondary={transaction?.category}
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Gas Estimation"
              secondary={transaction?.gasEstimate}
            />
          </ListItem>
        </List>
        <Typography color="warning.main">
          Please verify all details before confirming
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={onConfirm} variant="contained" color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}