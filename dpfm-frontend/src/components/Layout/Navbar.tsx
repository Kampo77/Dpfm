import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  AccountBalanceWallet,
  Brightness4,
  Brightness7,
  Menu as MenuIcon
} from '@mui/icons-material';

interface NavbarProps {
  toggleTheme?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleTheme }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [walletAddress, setWalletAddress] = React.useState<string>('');

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {isMobile && (
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          dPFM
        </Typography>

        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 2, mr: 2 }}>
            <Button color="inherit">Dashboard</Button>
            <Button color="inherit">Transactions</Button>
            <Button color="inherit">Budget</Button>
            <Button color="inherit">Analytics</Button>
          </Box>
        )}

        <IconButton color="inherit" onClick={toggleTheme}>
          {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
        </IconButton>

        <Button
          color="inherit"
          startIcon={<AccountBalanceWallet />}
          onClick={connectWallet}
        >
          {walletAddress 
            ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
            : 'Connect Wallet'}
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;