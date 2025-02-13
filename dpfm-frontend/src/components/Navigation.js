import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Chip
} from '@mui/material';
import { useWeb3 } from '../contexts/Web3Context';

function Navigation() {
  const { isConnected, account, isOwner, connect } = useWeb3();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Financial Manager
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {isConnected ? (
            <>
              <Button
                color="inherit"
                onClick={() => navigate('/')}
                variant={location.pathname === '/' ? 'outlined' : 'text'}
              >
                Dashboard
              </Button>
              
              <Button
                color="inherit"
                onClick={() => navigate('/transactions')}
                variant={location.pathname === '/transactions' ? 'outlined' : 'text'}
              >
                Transactions
              </Button>

              {isOwner && (
                <Button
                  color="inherit"
                  onClick={() => navigate('/admin')}
                  variant={location.pathname === '/admin' ? 'outlined' : 'text'}
                >
                  Admin
                </Button>
              )}

              <Chip
                label={`${account.slice(0, 6)}...${account.slice(-4)}`}
                color="secondary"
                variant="outlined"
              />
            </>
          ) : (
            <Button color="inherit" onClick={connect}>
              Connect Wallet
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navigation;