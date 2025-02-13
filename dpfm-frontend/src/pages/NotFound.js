import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function NotFound() {
  const navigate = useNavigate();

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '80vh',
    }}>
      <Typography variant="h1" component="h1">
        404
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        Page Not Found
      </Typography>
      <Button 
        variant="contained" 
        onClick={() => navigate('/')}
        sx={{ mt: 2 }}
      >
        Return to Dashboard
      </Button>
    </Box>
  );
}

export default NotFound;