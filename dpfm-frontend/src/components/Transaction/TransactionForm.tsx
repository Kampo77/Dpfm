import React from 'react';
import { Card, CardContent, TextField, Button, Grid } from '@mui/material';

const TransactionForm = () => {
  return (
    <Card sx={{ maxWidth: 600, m: 2 }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Amount"
              type="number"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Category"
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" fullWidth>
              Add Transaction
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TransactionForm;