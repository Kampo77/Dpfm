import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import BudgetList from './BudgetList';
import BudgetForm from './BudgetForm';

const BudgetManagement = () => {
  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Budget Management
      </Typography>
      <BudgetForm />
      <BudgetList />
    </Paper>
  );
};

export default BudgetManagement;