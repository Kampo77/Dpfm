import React, { useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Button,
  Box
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useBudgets } from '../../context/BudgetContext';
import BudgetCard from './BudgetCard';
import BudgetDialog from './BudgetDialog';

const BudgetDashboard = () => {
  const { budgets, spending } = useBudgets();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleOpenDialog = (category = null) => {
    setSelectedCategory(category);
    setDialogOpen(true);
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
              category={category}
              budget={budgets[category.id]}
              spending={spending[category.id]}
              onEdit={() => handleOpenDialog(category.id)}
            />
          </Grid>
        ))}
      </Grid>

      <BudgetDialog
        open={dialogOpen}
        category={selectedCategory}
        onClose={() => {
          setDialogOpen(false);
          setSelectedCategory(null);
        }}
      />
    </Container>
  );
};

export default BudgetDashboard;