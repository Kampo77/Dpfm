import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Box
} from '@mui/material';

function BudgetManager({ contractAddress }) {
  const [budget, setBudget] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentBudget, setCurrentBudget] = useState(null);

  useEffect(() => {
    loadCurrentBudget();
  }, []);

  const loadCurrentBudget = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, FinancialManager.abi, signer);
      
      const budgetLimit = await contract.getBudgetLimit();
      const budgetData = await contract.budgets(await signer.getAddress());
      
      setCurrentBudget({
        limit: ethers.utils.formatEther(budgetLimit),
        category: budgetData.category
      });
    } catch (err) {
      console.error('Error loading budget:', err);
      setError('Failed to load current budget');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, FinancialManager.abi, signer);

      const tx = await contract.setBudget(
        ethers.utils.parseEther(budget),
        category
      );

      await tx.wait();
      setSuccess('Budget updated successfully!');
      loadCurrentBudget();
      setBudget('');
      setCategory('');
    } catch (err) {
      console.error('Error setting budget:', err);
      setError(err.message || 'Failed to set budget');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ minWidth: 275, mt: 2 }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          Budget Management
        </Typography>

        {currentBudget && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6">Current Budget</Typography>
            <Typography>Limit: {currentBudget.limit} ETH</Typography>
            <Typography>Category: {currentBudget.category}</Typography>
          </Box>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Budget Amount (ETH)"
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            margin="normal"
            required
          />
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Set Budget'}
          </Button>
        </form>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {success}
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

export default BudgetManager;