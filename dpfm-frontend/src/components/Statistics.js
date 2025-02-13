import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid,
  CircularProgress 
} from '@mui/material';
import { ethers } from 'ethers';

function Statistics({ contract }) {
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalSpent: ethers.BigNumber.from(0),
    totalIncome: ethers.BigNumber.from(0),
    feesCollected: ethers.BigNumber.from(0)
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (contract) {
      loadStatistics();
    }
  }, [contract]);

  const loadStatistics = async () => {
    try {
      const transactions = await contract.getUserTransactions();
      let spent = ethers.BigNumber.from(0);
      let income = ethers.BigNumber.from(0);

      transactions.forEach(tx => {
        if (tx.isExpense) {
          spent = spent.add(tx.amount);
        } else {
          income = income.add(tx.amount);
        }
      });

      const fees = await contract.feesBalance();

      setStats({
        totalTransactions: transactions.length,
        totalSpent: spent,
        totalIncome: income,
        feesCollected: fees
      });
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ flexGrow: 1, mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Transactions
              </Typography>
              <Typography variant="h5">
                {stats.totalTransactions}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Spent
              </Typography>
              <Typography variant="h5">
                {ethers.utils.formatEther(stats.totalSpent)} ETH
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Income
              </Typography>
              <Typography variant="h5">
                {ethers.utils.formatEther(stats.totalIncome)} ETH
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Fees Collected
              </Typography>
              <Typography variant="h5">
                {ethers.utils.formatEther(stats.feesCollected)} ETH
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

Statistics.propTypes = {
  contract: PropTypes.object.isRequired
};

export default Statistics;