import React from 'react';
import { Alert, Snackbar, Typography, Box } from '@mui/material';

const ErrorAlert = ({ error, onClose, details }) => (
  <Snackbar 
    open={!!error} 
    autoHideDuration={6000} 
    onClose={onClose}
    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
  >
    <Alert 
      severity="error" 
      onClose={onClose}
      variant="filled"
      sx={{ width: '100%' }}
    >
      <Typography variant="subtitle2">{error}</Typography>
      {details && (
        <Box mt={1}>
          <Typography variant="caption" color="textSecondary">
            {details}
          </Typography>
        </Box>
      )}
      {error?.code && (
        <Box mt={1}>
          <Typography variant="caption" color="textSecondary">
            Error Code: {error.code}
          </Typography>
        </Box>
      )}
    </Alert>
  </Snackbar>
);

export default ErrorAlert;