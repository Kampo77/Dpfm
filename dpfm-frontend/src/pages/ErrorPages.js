import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center" 
      minHeight="80vh"
    >
      <Typography variant="h1">404</Typography>
      <Typography variant="h5" gutterBottom>Page Not Found</Typography>
      <Button 
        variant="contained" 
        onClick={() => navigate('/')}
      >
        Return to Dashboard
      </Button>
    </Box>
  );
}

export function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center" 
      minHeight="80vh"
    >
      <Typography variant="h1">401</Typography>
      <Typography variant="h5" gutterBottom>Unauthorized Access</Typography>
      <Typography variant="body1" gutterBottom>
        You don't have permission to view this page
      </Typography>
      <Button 
        variant="contained" 
        onClick={() => navigate('/')}
      >
        Return to Dashboard
      </Button>
    </Box>
  );
}