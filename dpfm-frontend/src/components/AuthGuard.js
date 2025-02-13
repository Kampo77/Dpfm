import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import PropTypes from 'prop-types';

function AuthGuard({ isAuthorized, children, onConnect }) {
  if (!isAuthorized) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        p: 4 
      }}>
        <Typography variant="h6" color="error" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1" gutterBottom>
          You need to be authorized to view this content.
        </Typography>
        {onConnect && (
          <Button 
            variant="contained" 
            onClick={onConnect}
            sx={{ mt: 2 }}
          >
            Connect Wallet
          </Button>
        )}
      </Box>
    );
  }

  return <>{children}</>;
}

AuthGuard.propTypes = {
  isAuthorized: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  onConnect: PropTypes.func
};

export default AuthGuard;