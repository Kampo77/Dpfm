import React from 'react';
import { Box, Container, CircularProgress } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import NetworkStatus from './NetworkStatus';

function DashboardLayout({ children }) {
  const { loading, initialized } = useAuth();

  if (!initialized) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ position: 'fixed', top: 16, right: 16 }}>
        <NetworkStatus />
      </Box>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {children}
      </Container>
    </>
  );
}

export default DashboardLayout;