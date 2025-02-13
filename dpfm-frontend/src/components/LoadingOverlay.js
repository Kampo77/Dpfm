import React from 'react';
import PropTypes from 'prop-types';
import { Backdrop, CircularProgress, Typography, Box } from '@mui/material';

function LoadingOverlay({ open, message }) {
  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        flexDirection: 'column'
      }}
      open={open}
    >
      <CircularProgress color="inherit" />
      {message && (
        <Box mt={2}>
          <Typography>{message}</Typography>
        </Box>
      )}
    </Backdrop>
  );
}

LoadingOverlay.propTypes = {
  open: PropTypes.bool.isRequired,
  message: PropTypes.string
};

export default LoadingOverlay;