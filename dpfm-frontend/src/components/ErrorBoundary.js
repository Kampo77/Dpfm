import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Button } from '@mui/material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log error to service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Typography variant="h5" color="error">
            Something went wrong
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {this.state.error?.message || 'An unexpected error occurred'}
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => window.location.reload()}
          >
            Reload Application
          </Button>
          {process.env.NODE_ENV === 'development' && (
            <Typography
              variant="caption"
              component="pre"
              sx={{
                mt: 2,
                p: 2,
                bgcolor: 'grey.100',
                borderRadius: 1,
                overflow: 'auto'
              }}
            >
              {this.state.errorInfo?.componentStack}
            </Typography>
          )}
        </Box>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired
};

export default ErrorBoundary;