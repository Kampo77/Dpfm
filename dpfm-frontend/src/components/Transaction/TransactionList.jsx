import React, { useState } from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  Paper, 
  Typography,
  Skeleton,
  Pagination, 
  Select, 
  MenuItem, 
  Tooltip,
  IconButton,
  FormControl,
  InputLabel,
  Box
} from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';
import { useTransactionEvents } from '../../hooks/useTransactionEvents';
import ErrorAlert from '../common/ErrorAlert';
import { handleTransactionError } from '../../utils/errorHandlers';

const ITEMS_PER_PAGE = 5;

const TransactionList = () => {
  const { transactions, loading, error } = useTransactionEvents();
  const [page, setPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState({
    category: '',
    type: 'all'
  });

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilter(prev => ({
      ...prev,
      [name]: value
    }));
    setPage(1);
  };

  if (error) {
    const message = handleTransactionError(error);
    setErrorMessage(message);
  }

  const filteredTransactions = transactions?.filter(tx => {
    if (filter.category && tx.category !== filter.category) return false;
    if (filter.type === 'income' && !tx.isIncome) return false;
    if (filter.type === 'expense' && tx.isIncome) return false;
    return true;
  }) || [];

  const paginatedTransactions = filteredTransactions.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  if (loading) {
    return (
      <Paper sx={{ p: 2, mt: 2 }}>
        {[1,2,3].map((i) => (
          <Skeleton key={i} height={60} />
        ))}
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h6">
          Transactions
          <Tooltip title="View and filter your transactions">
            <IconButton size="small">
              <InfoOutlined />
            </IconButton>
          </Tooltip>
        </Typography>

        <Box display="flex" gap={2}>
          <FormControl size="small">
            <InputLabel>Type</InputLabel>
            <Select
              value={filter.type}
              name="type"
              onChange={handleFilterChange}
              sx={{ width: 120 }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="income">Income</MenuItem>
              <MenuItem value="expense">Expense</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <List>
        {paginatedTransactions.map((tx) => (
          <ListItem key={tx.id} divider>
            <ListItemText
              primary={`${tx.amount} ETH - ${tx.category}`}
              secondary={new Date(tx.timestamp).toLocaleString()}
              sx={{
                color: tx.isIncome ? 'success.main' : 'error.main'
              }}
            />
          </ListItem>
        ))}
      </List>

      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination
          count={Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE)}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
        />
      </Box>
      
      <ErrorAlert 
        error={errorMessage}
        onClose={() => setErrorMessage('')}
      />
    </Paper>
  );
};

export default TransactionList;