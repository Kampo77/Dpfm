import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  TextField,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
import FinancialManager from '../artifacts/contracts/FinancialManager.sol/FinancialManager.json';
import BudgetManager from './BudgetManager';
import ErrorHandler from './ErrorHandler';
import RoleBasedContainer from './RoleBasedContainer';
import { validateTransaction } from '../utils/transactionValidator';
import TransactionMonitor from './TransactionMonitor';
import TransactionHistory from './TransactionHistory';
import { useNotification } from '../contexts/NotificationContext';
import ConfirmationDialog from './ConfirmationDialog';
import { ROLES } from '../utils/permissionManager';
import RoleBasedComponent from './RoleBasedComponent';
import { Web3Handler } from '../utils/web3Handler';
import EventViewer from './EventViewer';

const FinancialDashboard = ({ contractAddress, userRole }) => {
  const { showNotification } = useNotification();
  const [transactions, setTransactions] = useState([]);
  const [budget, setBudget] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [pendingTransaction, setPendingTransaction] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    transaction: null
  });
  const [web3Handler] = useState(() => new Web3Handler());
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  const [newTransaction, setNewTransaction] = useState({
    amount: '',
    category: '',
    description: '',
    isExpense: true
  });

  useEffect(() => {
    loadTransactions();
    loadBudget();
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        await web3Handler.connect();
        setConnectionStatus('connected');
        
        web3Handler.listenToAccountChanges((account) => {
          setConnectionStatus(account ? 'connected' : 'disconnected');
        });
      } catch (error) {
        setConnectionStatus('failed');
        console.error('Connection failed:', error);
      }
    };

    init();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, FinancialManager.abi, signer);
      
      const txs = await contract.getUserTransactions();
      setTransactions(txs);
    } catch (err) {
      setError('Failed to load transactions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadBudget = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, FinancialManager.abi, signer);
      
      const budgetLimit = await contract.getBudgetLimit();
      setBudget(ethers.utils.formatEther(budgetLimit));
    } catch (err) {
      console.error('Error loading budget:', err);
    }
  };

  const handleSubmitTransaction = async (e) => {
    e.preventDefault();
    const { isValid, errors } = validateTransaction(newTransaction);
    
    if (!isValid) {
      setError(Object.values(errors).join(', '));
      return;
    }

    setLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, FinancialManager.abi, signer);

      const tx = await contract.addTransaction(
        ethers.utils.parseEther(newTransaction.amount),
        newTransaction.category,
        newTransaction.description || '',
        newTransaction.isExpense
      );

      await tx.wait();
      loadTransactions();
      setNewTransaction({ amount: '', category: '', description: '', isExpense: true });
    } catch (err) {
      setError('Transaction failed: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmTransaction = async () => {
    setIsProcessing(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, FinancialManager.abi, signer);

      const tx = await contract.addTransaction(
        ethers.utils.parseEther(pendingTransaction.amount),
        pendingTransaction.category,
        pendingTransaction.description,
        pendingTransaction.isExpense
      );

      await tx.wait();
      loadTransactions();
      setNewTransaction({ amount: '', category: '', description: '', isExpense: true });
      setConfirmationOpen(false);
      setPendingTransaction(null);
    } catch (err) {
      setError('Transaction failed');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTransactionSubmit = async (transaction) => {
    setConfirmDialog({
      open: true,
      transaction
    });
  };

  const handleConfirm = async () => {
    try {
      // Process transaction
      await processTransaction(confirmDialog.transaction);
      showNotification('success', 'Transaction processed successfully');
    } catch (error) {
      showNotification('error', error.message || 'Failed to process transaction');
    } finally {
      setConfirmDialog({ open: false, transaction: null });
    }
  };

  const handleTransactionSubmit = async (transactionData) => {
    try {
      const tx = await contract.addTransaction(
        ethers.utils.parseEther(transactionData.amount),
        transactionData.category,
        transactionData.description,
        transactionData.isExpense
      );
      setCurrentTransaction(tx);
    } catch (error) {
      console.error('Transaction failed:', error);
    }
  };

  return (
    <RoleBasedContainer isAuthorized={isAuthorized} currentRole={userRole}>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Statistics contract={contract} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Add New Transaction</Typography>
                <form onSubmit={handleSubmitTransaction}>
                  <TextField
                    fullWidth
                    label="Amount (ETH)"
                    type="number"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Category"
                    value={newTransaction.category}
                    onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Description"
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                    margin="normal"
                  />
                  <Button 
                    type="submit" 
                    variant="contained" 
                    disabled={loading}
                    sx={{ mt: 2 }}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Add Transaction'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Current Budget: {budget} ETH</Typography>
                {transactions.map((tx, index) => (
                  <Box key={index} sx={{ mt: 2, p: 2, bgcolor: 'background.paper' }}>
                    <Typography>Amount: {ethers.utils.formatEther(tx.amount)} ETH</Typography>
                    <Typography>Category: {tx.category}</Typography>
                    <Typography>Type: {tx.isExpense ? 'Expense' : 'Income'}</Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <BudgetManager contractAddress={contractAddress} />
          </Grid>

          <Grid item xs={12}>
            <TransactionMonitor contract={contract} />
          </Grid>
        </Grid>

        <TransactionHistory contract={contract} />
        <EventViewer contract={contract} />
      </Box>

      <Dialog open={confirmationOpen} onClose={() => setConfirmationOpen(false)}>
        <DialogTitle>Confirm Transaction</DialogTitle>
        <DialogContent>
          Are you sure you want to process this transaction?
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setConfirmationOpen(false)} 
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmTransaction}
            disabled={isProcessing}
            color="primary"
          >
            {isProcessing ? <CircularProgress size={24} /> : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>

      <ErrorHandler 
        error={error} 
        onClose={() => setError(null)} 
      />

      <ConfirmationDialog
        open={confirmDialog.open}
        title="Confirm Transaction"
        message="Are you sure you want to process this transaction?"
        onConfirm={handleConfirm}
        onCancel={() => setConfirmDialog({ open: false, transaction: null })}
        loading={loading}
      />

      <TransactionMonitor 
        transaction={currentTransaction}
        onComplete={() => setCurrentTransaction(null)}
      />
    </RoleBasedContainer>
  );
};

FinancialDashboard.propTypes = {
  contract: PropTypes.object.isRequired,
  userRole: PropTypes.string.isRequired
};

export default FinancialDashboard;