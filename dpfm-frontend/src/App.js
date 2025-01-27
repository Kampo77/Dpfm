import React from 'react';
import './App.css';
import { ThemeProvider, createTheme, CssBaseline, Container } from '@mui/material';
import Navbar from './components/Layout/Navbar';
import TransactionForm from './components/Transaction/TransactionForm';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <Navbar />
        <Container>
          <TransactionForm />
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default App;