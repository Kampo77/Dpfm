import { useState, useCallback } from 'react';

export const useErrorHandler = () => {
  const [error, setError] = useState(null);

  const handleError = useCallback((err) => {
    // Network errors
    if (!navigator.onLine) {
      setError({ 
        message: 'Network error', 
        details: 'Please check your internet connection' 
      });
      return;
    }

    // Form validation
    if (err.type === 'validation') {
      setError({ 
        message: 'Validation error', 
        details: err.details || 'Please check your input' 
      });
      return;
    }

    // Existing blockchain errors
    if (err.code === 4001) {
      setError({ 
        message: 'Transaction rejected', 
        details: 'User denied transaction' 
      });
    } else if (err.code === -32603) {
      setError({ 
        message: 'Transaction failed', 
        details: 'Internal blockchain error' 
      });
    } else if (err.message.includes('insufficient funds')) {
      setError({ 
        message: 'Insufficient funds', 
        details: 'Please check your wallet balance' 
      });
    } else {
      setError({ 
        message: 'Operation failed', 
        details: err.message 
      });
    }
  }, []);

  const clearError = () => setError(null);

  return { error, handleError, clearError };
};