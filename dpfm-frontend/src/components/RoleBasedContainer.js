import React from 'react';
import { Box, Typography } from '@mui/material';

const RoleBasedContainer = ({ children, isAuthorized, ownerOnly, currentRole }) => {
  if (ownerOnly && currentRole !== 'owner') {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">
          This section is restricted to contract owner only
        </Typography>
      </Box>
    );
  }

  if (!isAuthorized) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">
          You need to be authorized to view this content
        </Typography>
      </Box>
    );
  }

  return children;
};

export default RoleBasedContainer;