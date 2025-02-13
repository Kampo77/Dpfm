import React from 'react';
import { Alert, Snackbar } from '@mui/material';

const ErrorHandler = ({ error, onClose }) => {
  return (
    <Snackbar 
      open={!!error} 
      autoHideDuration={6000} 
      onClose={onClose}
    >
      <Alert severity="error" onClose={onClose}>
        {error?.message || 'An unknown error occurred'}
      </Alert>
    </Snackbar>
  );
};

export default ErrorHandler;