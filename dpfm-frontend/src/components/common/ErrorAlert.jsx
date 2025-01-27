import React from 'react';
import { Alert, Snackbar } from '@mui/material';

const ErrorAlert = ({ error, onClose }) => (
  <Snackbar 
    open={!!error} 
    autoHideDuration={6000} 
    onClose={onClose}
  >
    <Alert 
      severity="error" 
      onClose={onClose}
      variant="filled"
    >
      {error}
    </Alert>
  </Snackbar>
);

export default ErrorAlert;