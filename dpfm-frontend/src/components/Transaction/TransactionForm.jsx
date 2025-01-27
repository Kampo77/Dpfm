import React, { useState } from 'react';
import { Card, CardContent, TextField, Button, Grid, CircularProgress, Snackbar, Alert } from '@mui/material';
import { useWeb3 } from '../../context/Web3Context';
import { transactionService } from '../../services/transactionService';
import TransactionList from './TransactionList';

const TransactionForm = () => {
  const { contract } = useWeb3();
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({
    amount: '',
    category: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const validateForm = () => {
    const errors = {};
    if (!formData.amount) errors.amount = 'Amount is required';
    if (!formData.category) errors.category = 'Category is required';
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setLoading(true);
    try {
      await transactionService.addTransaction(
        contract,
        formData.amount,
        formData.category,
        formData.description,
        false
      );
      // Clear form after success
      setFormData({ amount: '', category: '', description: '' });
      setShowSuccess(true); // Show success message
    } catch (error) {
      console.error('Transaction failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card sx={{ maxWidth: 600, m: 2 }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Amount"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleChange}
                  error={!!formErrors.amount}
                  helperText={formErrors.amount}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  error={!!formErrors.category}
                  helperText={formErrors.category}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12}>
                <Button 
                  variant="contained" 
                  fullWidth 
                  type="submit"
                  disabled={loading}
                  startIcon={loading && <CircularProgress size={20} />}
                >
                  {loading ? 'Processing...' : 'Add Transaction'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
      <TransactionList />
      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
      >
        <Alert severity="success">
          Transaction added successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default TransactionForm;