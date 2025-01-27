import React, { useState } from 'react';
import './App.css';
import { ThemeProvider, createTheme, CssBaseline, Container } from '@mui/material';
import Navbar from './components/Layout/Navbar';
import TransactionForm from './components/Transaction/TransactionForm';

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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <Navbar toggleTheme={toggleTheme} />
        <Container>
          <TransactionForm />
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default App;