import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Button,
  Box
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useBudgets } from '../../context/BudgetContext';
import { useWeb3 } from '../../context/Web3Context';
import BudgetCard from './BudgetCard';
import BudgetDialog from './BudgetDialog';
import TransactionList from '../../components/TransactionList';

const BudgetDashboard = () => {
  const { budgets, spending, refreshBudgets, transactions } = useBudgets();
  const { provider } = useWeb3();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Enhanced refresh logic
  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await refreshBudgets();
      console.log('Refreshed budgets:', budgets); // Debug log
    } finally {
      setIsLoading(false);
    }
  };

  // Listen for updates
  useEffect(() => {
    if (provider) {
      handleRefresh();
      
      const blockHandler = () => {
        console.log('New block detected');
        handleRefresh();
      };
      
      provider.on('block', blockHandler);
      return () => provider.removeListener('block', blockHandler);
    }
  }, [provider, refreshBudgets]);

  // Update on transaction changes
  useEffect(() => {
    if (transactions.length > 0) {
      const lastTx = transactions[transactions.length - 1];
      if (lastTx.status === 'confirmed') {
        handleRefresh();
      }
    }
  }, [transactions]);

  const handleOpenDialog = (category = null) => {
    setSelectedCategory(category);
    setDialogOpen(true);
  };

  const handleDialogClose = async () => {
    setDialogOpen(false);
    setSelectedCategory(null);
    setIsLoading(true);
    try {
      await refreshBudgets();
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    { id: 'food', label: 'Food & Groceries', color: '#4CAF50' },
    { id: 'transport', label: 'Transportation', color: '#2196F3' },
    { id: 'utilities', label: 'Utilities', color: '#FF9800' },
    { id: 'entertainment', label: 'Entertainment', color: '#9C27B0' }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Budget Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          New Budget
        </Button>
      </Box>

      <Grid container spacing={3}>
        {categories.map((category) => (
          <Grid item xs={12} md={6} lg={4} key={category.id}>
            <BudgetCard
              key={`${category.id}-${budgets[category.id]}`} // Force re-render on budget change
              category={category}
              budget={budgets[category.id]}
              spending={spending[category.id]}
              onEdit={() => handleOpenDialog(category.id)}
              isLoading={isLoading}
            />
          </Grid>
        ))}
      </Grid>

      <TransactionList transactions={transactions} />

      <BudgetDialog
        open={dialogOpen}
        category={selectedCategory}
        onClose={handleDialogClose}
      />
    </Container>
  );
};

export default BudgetDashboard;