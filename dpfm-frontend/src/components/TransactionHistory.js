import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography
} from '@mui/material';
import { ethers } from 'ethers';

function TransactionHistory({ contract }) {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filter, setFilter] = useState({
    category: '',
    type: 'all',
    dateRange: 'all'
  });

  useEffect(() => {
    loadTransactions();
  }, [contract]);

  useEffect(() => {
    applyFilters();
  }, [filter, transactions]);

  const loadTransactions = async () => {
    try {
      const txs = await contract.getUserTransactions();
      const formattedTxs = txs.map(tx => ({
        ...tx,
        amount: ethers.utils.formatEther(tx.amount),
        timestamp: new Date().toISOString() // In real app, get from blockchain
      }));
      setTransactions(formattedTxs);
      setFilteredTransactions(formattedTxs);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...transactions];

    if (filter.category) {
      filtered = filtered.filter(tx => 
        tx.category.toLowerCase().includes(filter.category.toLowerCase())
      );
    }

    if (filter.type !== 'all') {
      filtered = filtered.filter(tx => 
        filter.type === 'expense' ? tx.isExpense : !tx.isExpense
      );
    }

    // Date range filtering
    if (filter.dateRange !== 'all') {
      const now = new Date();
      const cutoff = new Date();
      
      switch (filter.dateRange) {
        case 'week':
          cutoff.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoff.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          cutoff.setFullYear(now.getFullYear() - 1);
          break;
        default:
          break;
      }

      filtered = filtered.filter(tx => 
        new Date(tx.timestamp) >= cutoff
      );
    }

    setFilteredTransactions(filtered);
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Transaction History
      </Typography>
      
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          label="Category Filter"
          value={filter.category}
          onChange={(e) => setFilter({ ...filter, category: e.target.value })}
          size="small"
        />
        
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={filter.type}
            label="Type"
            onChange={(e) => setFilter({ ...filter, type: e.target.value })}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="expense">Expenses</MenuItem>
            <MenuItem value="income">Income</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={filter.dateRange}
            label="Time Range"
            onChange={(e) => setFilter({ ...filter, dateRange: e.target.value })}
          >
            <MenuItem value="all">All Time</MenuItem>
            <MenuItem value="week">Last Week</MenuItem>
            <MenuItem value="month">Last Month</MenuItem>
            <MenuItem value="year">Last Year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Amount (ETH)</TableCell>
              <TableCell>Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTransactions.map((tx, index) => (
              <TableRow key={index}>
                <TableCell>{new Date(tx.timestamp).toLocaleDateString()}</TableCell>
                <TableCell>{tx.category}</TableCell>
                <TableCell>{tx.description}</TableCell>
                <TableCell align="right">{tx.amount}</TableCell>
                <TableCell>{tx.isExpense ? 'Expense' : 'Income'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

TransactionHistory.propTypes = {
  contract: PropTypes.object.isRequired
};

export default TransactionHistory;