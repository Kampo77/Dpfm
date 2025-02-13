import React from 'react';
import { Chip } from '@mui/material';
import { useNetwork } from '../hooks/useNetwork';

function NetworkStatus() {
  const { isConnected, chainId, networkName } = useNetwork();

  return (
    <Chip
      label={isConnected ? `Connected to ${networkName}` : 'Not Connected'}
      color={isConnected ? 'success' : 'error'}
      variant="outlined"
      size="small"
    />
  );
}

export default NetworkStatus;