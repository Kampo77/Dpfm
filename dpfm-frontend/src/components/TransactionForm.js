import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, CircularProgress } from '@mui/material';
import FormField from './FormField';
import { validateTransactionForm } from '../utils/formValidation';
import { useNotification } from '../contexts/NotificationContext';

function TransactionForm({ onSubmit, loading }) {
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: ''
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateTransactionForm(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showNotification('error', 'Please correct form errors');
      return;
    }

    try {
      await onSubmit(formData);
      setFormData({ amount: '', category: '', description: '' });
      setErrors({});
      showNotification('success', 'Transaction submitted successfully');
    } catch (error) {
      showNotification('error', error.message || 'Failed to submit transaction');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <FormField
        label="Amount (ETH)"
        type="number"
        value={formData.amount}
        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        error={errors.amount}
        disabled={loading}
        required
      />

      <FormField
        label="Category"
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        error={errors.category}
        disabled={loading}
        required
      />

      <FormField
        label="Description"
        multiline
        rows={3}
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        error={errors.description}
        disabled={loading}
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

TransactionForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool
};

export default TransactionForm;