import React, { useState } from 'react';
import './App.css';
import { ThemeProvider, createTheme, CssBaseline, Container } from '@mui/material';
import Navbar from './components/Layout/Navbar';
import TransactionForm from './components/Transaction/TransactionForm';
import TransactionHistory from './components/Transaction/TransactionHistory';
import ErrorBoundary from './components/common/ErrorBoundary';
import LoadingOverlay from './components/common/LoadingOverlay';
import { Web3Provider } from './context/Web3Context';

function App() {
  const [mode, setMode] = useState('light');

  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: '#1976d2',
      },
    },
  });

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ErrorBoundary>
      <Web3Provider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className="App">
            <Navbar toggleTheme={toggleTheme} />
            <Container>
              <TransactionForm />
              <TransactionHistory />
            </Container>
            <LoadingOverlay open={false} />
          </div>
        </ThemeProvider>
      </Web3Provider>
    </ErrorBoundary>
  );
}

export default App;