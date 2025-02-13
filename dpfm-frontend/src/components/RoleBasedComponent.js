import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import { checkPermission } from '../utils/permissionManager';

function RoleBasedComponent({ 
  children, 
  requiredRole, 
  userRole, 
  fallbackMessage 
}) {
  if (!checkPermission(requiredRole, userRole)) {
    return (
      <Box 
        sx={{ 
          p: 2, 
          bgcolor: 'warning.light', 
          borderRadius: 1,
          color: 'warning.dark'
        }}
      >
        <Typography>
          {fallbackMessage || 'You do not have permission to view this content'}
        </Typography>
      </Box>
    );
  }

  return children;
}

RoleBasedComponent.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.string.isRequired,
  userRole: PropTypes.string.isRequired,
  fallbackMessage: PropTypes.string
};

export default RoleBasedComponent;