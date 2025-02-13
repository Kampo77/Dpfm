import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

function LoadingSpinner({ message }) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="200px"
    >
      <CircularProgress />
      {message && (
        <Typography 
          variant="body2" 
          sx={{ mt: 2, color: 'text.secondary' }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
}

export default LoadingSpinner;