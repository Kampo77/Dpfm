import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from '@mui/material';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          dPFM
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit">Dashboard</Button>
          <Button color="inherit">Transactions</Button>
          <Button color="inherit">Budget</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;