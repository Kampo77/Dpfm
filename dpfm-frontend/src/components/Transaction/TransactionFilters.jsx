import React from 'react';
import { Box, TextField, MenuItem, DatePicker } from '@mui/material';
import { useTransactions } from '../../context/TransactionContext';

const TransactionFilters = () => {
  const { filters, setFilters } = useTransactions();

  return (
    <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
      <TextField
        select
        label="Category"
        value={filters.category}
        onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
      >
        <MenuItem value="all">All Categories</MenuItem>
        <MenuItem value="food">Food</MenuItem>
        <MenuItem value="transport">Transport</MenuItem>
        <MenuItem value="utilities">Utilities</MenuItem>
      </TextField>

      <TextField
        select
        label="Type"
        value={filters.type}
        onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
      >
        <MenuItem value="all">All Types</MenuItem>
        <MenuItem value="income">Income</MenuItem>
        <MenuItem value="expense">Expense</MenuItem>
      </TextField>

      <DatePicker
        label="Start Date"
        value={filters.startDate}
        onChange={(date) => setFilters(prev => ({ ...prev, startDate: date }))}
        renderInput={(params) => <TextField {...params} />}
      />

      <DatePicker
        label="End Date"
        value={filters.endDate}
        onChange={(date) => setFilters(prev => ({ ...prev, endDate: date }))}
        renderInput={(params) => <TextField {...params} />}
      />
    </Box>
  );
};

export default TransactionFilters;