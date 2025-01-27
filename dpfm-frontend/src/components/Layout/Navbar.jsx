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
  useTheme,
  Snackbar,
  Alert,
  Tooltip,
  Fade,
  Zoom
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountBalanceWallet,
  Brightness4,
  Brightness7
} from '@mui/icons-material';

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

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
  }, [userPreferences]);

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
    } catch (err) {
      setError('Failed to connect wallet: ' + err.message);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <>
      <AppBar position="static" elevation={2}>
        <Toolbar>
          <Zoom in={true} style={{ transitionDelay: '100ms' }}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              dPFM
            </Typography>
          </Zoom>

          {isMobile ? (
            <Fade in={true}>
              <>
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  onClick={handleMobileMenuOpen}
                  sx={{ mr: 2 }}
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  anchorEl={mobileMenuAnchor}
                  open={Boolean(mobileMenuAnchor)}
                  onClose={handleMobileMenuClose}
                >
                  <MenuItem onClick={handleMobileMenuClose}>Dashboard</MenuItem>
                  <MenuItem onClick={handleMobileMenuClose}>Transactions</MenuItem>
                  <MenuItem onClick={handleMobileMenuClose}>Budget</MenuItem>
                  <MenuItem onClick={handleMobileMenuClose}>Settings</MenuItem>
                </Menu>
              </>
            </Fade>
          ) : (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Fade in={true} style={{ transitionDelay: '200ms' }}>
                <Tooltip title="View your dashboard" arrow placement="bottom">
                  <Button color="inherit">Dashboard</Button>
                </Tooltip>
              </Fade>
              <Fade in={true} style={{ transitionDelay: '300ms' }}>
                <Tooltip title="Manage transactions" arrow placement="bottom">
                  <Button color="inherit">Transactions</Button>
                </Tooltip>
              </Fade>
              <Fade in={true} style={{ transitionDelay: '400ms' }}>
                <Tooltip title="Set your budget" arrow placement="bottom">
                  <Button color="inherit">Budget</Button>
                </Tooltip>
              </Fade>
            </Box>
          )}

          <Fade in={true} style={{ transitionDelay: '500ms' }}>
            <Tooltip title="Switch theme" arrow placement="bottom">
              <IconButton 
                color="inherit" 
                onClick={() => {
                  toggleTheme();
                  setUserPreferences(prev => ({
                    ...prev,
                    theme: prev.theme === 'light' ? 'dark' : 'light'
                  }));
                }}
                sx={{ ml: 1 }}
              >
                {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Tooltip>
          </Fade>

          <Fade in={true} style={{ transitionDelay: '600ms' }}>
            <Tooltip 
              title={walletAddress ? "Connected wallet" : "Connect your wallet"} 
              arrow 
              placement="bottom"
            >
              <Button
                color="inherit"
                startIcon={isConnecting ? <CircularProgress size={20} color="inherit" /> : <AccountBalanceWallet />}
                onClick={connectWallet}
                disabled={isConnecting}
                sx={{ ml: 1 }}
              >
                {walletAddress 
                  ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
                  : 'Connect Wallet'}
              </Button>
            </Tooltip>
          </Fade>
        </Toolbar>
      </AppBar>

      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError('')}
        TransitionComponent={Fade}
      >
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

Navbar.propTypes = {
  toggleTheme: PropTypes.func.isRequired
};

export default Navbar;