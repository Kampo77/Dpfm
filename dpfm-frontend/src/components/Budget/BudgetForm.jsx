import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Alert,
  Collapse
} from '@mui/material';
import { useBudgets } from '../../context/BudgetContext';

const BudgetForm = () => {
  const { setBudget } = useBudgets();
  const [formData, setFormData] = useState({
    category: '',
    amount: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      await setBudget(formData.category, formData.amount);
      setSuccess(true);
      setFormData({ category: '', amount: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          select
          label="Category"
          value={formData.category}
          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
          required
          fullWidth
        >
          <MenuItem value="food">Food</MenuItem>
          <MenuItem value="transport">Transport</MenuItem>
          <MenuItem value="utilities">Utilities</MenuItem>
          <MenuItem value="entertainment">Entertainment</MenuItem>
        </TextField>

        <TextField
          label="Budget Amount (ETH)"
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
          required
          fullWidth
          inputProps={{ min: 0, step: 0.01 }}
        />

        <Button type="submit" variant="contained">
          Set Budget
        </Button>
      </Box>

      <Collapse in={!!error || success}>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">Budget updated successfully!</Alert>}
      </Collapse>
    </Box>
  );
};

export default BudgetForm;