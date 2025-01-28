import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import { useWeb3 } from '../../context/Web3Context';
import { useBudgets } from '../../context/BudgetContext';

const BudgetDialog = ({ open, category, onClose }) => {
  const { provider, account, isConnected, connectWallet } = useWeb3();
  const { setBudget } = useBudgets();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    category: category || '',
    amount: ''
  });

  // Attempt to connect if not connected
  const handleConnect = async () => {
    setIsConnecting(true);
    setError('');
    try {
      await connectWallet();
    } catch (err) {
      setError('Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  // Submit the budget
  const handleSubmit = async () => {
    setIsProcessing(true);
    setError('');
    try {
      await setBudget(formData.category, ethers.utils.parseEther(formData.amount.toString()));
      onClose();
    } catch (err) {
      setError(err.message || 'Transaction failed');
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    // If not connected, show connect button
    console.log('BudgetDialog -> isConnected:', isConnected, 'account:', account);
  }, [isConnected, account]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {category ? 'Edit Budget' : 'Create New Budget'}
      </DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {!isConnected ? (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Button
              variant="contained"
              onClick={handleConnect}
              disabled={isConnecting}
              startIcon={isConnecting && <CircularProgress size={20} />}
            >
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </Button>
          </Box>
        ) : (
          <>
            <TextField
              select
              fullWidth
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              sx={{ mb: 2 }}
            >
              <MenuItem value="food">Food & Groceries</MenuItem>
              <MenuItem value="transport">Transportation</MenuItem>
              <MenuItem value="utilities">Utilities</MenuItem>
              <MenuItem value="entertainment">Entertainment</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Amount (ETH)"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              inputProps={{ min: 0, step: 0.01 }}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        {isConnected && (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isProcessing || !formData.category || !formData.amount}
            startIcon={isProcessing && <CircularProgress size={20} />}
          >
            {isProcessing ? 'Processing...' : category ? 'Update' : 'Create'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default BudgetDialog;