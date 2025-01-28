import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  CircularProgress,
  useMediaQuery,
  Snackbar,
  Alert,
  Tooltip
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountBalanceWallet,
  Brightness4,
  Brightness7
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const Navbar = ({ toggleTheme }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [error, setError] = useState('');
  const [userPreferences, setUserPreferences] = useState(() => {
    const saved = localStorage.getItem('userPreferences');
    return saved ? JSON.parse(saved) : { theme: 'light' };
  });

  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
  }, [userPreferences]);

  const handleThemeToggle = () => {
    setUserPreferences(prev => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light'
    }));
    toggleTheme();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('Please install MetaMask!');
      return;
    }

    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      setWalletAddress(accounts[0]);
      handleMobileMenuClose();
    } catch (err) {
      setError('Failed to connect wallet: ' + err.message);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          DpFm Portfolio Manager
        </Typography>
        
        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              onClick={handleMobileMenuOpen}
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={mobileMenuAnchor}
              open={Boolean(mobileMenuAnchor)}
              onClose={handleMobileMenuClose}
              TransitionProps={{ timeout: 200 }}
            >
              <MenuItem onClick={handleThemeToggle}>
                {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                <Typography sx={{ ml: 1 }}>Toggle Theme</Typography>
              </MenuItem>
              <MenuItem onClick={connectWallet} disabled={isConnecting}>
                <AccountBalanceWallet />
                <Typography sx={{ ml: 1 }}>
                  {isConnecting ? 'Connecting...' : 
                    walletAddress ? 
                    `${walletAddress.slice(0,6)}...${walletAddress.slice(-4)}` : 
                    'Connect Wallet'
                  }
                </Typography>
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              color="inherit"
              onClick={connectWallet}
              disabled={isConnecting}
              startIcon={isConnecting ? 
                <CircularProgress size={20} color="inherit" /> : 
                <AccountBalanceWallet />
              }
            >
              {walletAddress ? 
                `${walletAddress.slice(0,6)}...${walletAddress.slice(-4)}` : 
                'Connect Wallet'
              }
            </Button>
            <Tooltip title={`Switch to ${theme.palette.mode === 'dark' ? 'light' : 'dark'} mode`}>
              <IconButton onClick={handleThemeToggle} color="inherit">
                {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Toolbar>
      <Snackbar 
        open={Boolean(error)} 
        autoHideDuration={6000} 
        onClose={() => setError('')}
      >
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>
    </AppBar>
  );
};

Navbar.propTypes = {
  toggleTheme: PropTypes.func.isRequired
};

export default Navbar;