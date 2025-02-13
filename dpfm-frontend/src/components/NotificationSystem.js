import React from 'react';
import PropTypes from 'prop-types';
import { Snackbar, Alert } from '@mui/material';

function NotificationSystem({ notification, onClose }) {
  if (!notification) return null;

  return (
    <Snackbar
      open={!!notification}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert 
        onClose={onClose} 
        severity={notification.type} 
        variant="filled"
      >
        {notification.message}
      </Alert>
    </Snackbar>
  );
}

NotificationSystem.propTypes = {
  notification: PropTypes.shape({
    type: PropTypes.oneOf(['success', 'error', 'info', 'warning']),
    message: PropTypes.string
  }),
  onClose: PropTypes.func.isRequired
};

export default NotificationSystem;