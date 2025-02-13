import React, { useState } from 'react';
import { useTransaction } from '../hooks/useTransaction';
import { SecurityService } from '../services/SecurityService';
import { validateTransaction } from '../utils/validators';
import { handleContractError } from '../utils/errorHandler';
import {
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';

function TransactionForm({ contract }) {
  const { executeTransaction, loading } = useTransaction(contract);
  const securityService = new SecurityService(contract);
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: ''
  });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Validate input
      const validation = validateTransaction(formData);
      if (!validation.isValid) {
        throw new Error(Object.values(validation.errors)[0]);
      }

      // Security checks
      await securityService.validateTransactionSecurity(formData);

      // Execute transaction
      await executeTransaction(formData);
      setFormData({ amount: '', category: '', description: '' });
    } catch (error) {
      const handledError = handleContractError(error);
      setError(handledError.message);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Amount (ETH)"
        value={formData.amount}
        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        disabled={loading}
        margin="normal"
        required
      />

      <TextField
        fullWidth
        label="Category"
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        disabled={loading}
        margin="normal"
        required
      />

      <TextField
        fullWidth
        label="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        disabled={loading}
        margin="normal"
        multiline
        rows={3}
      />

      <Button
        type="submit"
        variant="contained"
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Submit Transaction'}
      </Button>
    </Box>
  );
}

export default TransactionForm;