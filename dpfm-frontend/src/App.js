import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { Web3Provider } from './context/Web3Context';
import { BudgetProvider } from './context/BudgetContext';
import Navbar from './components/Layout/Navbar';
import BudgetDashboard from './pages/Budget/BudgetDashboard';

function App() {
  const [mode, setMode] = useState('light');

  const theme = createTheme({
    palette: {
      mode,
      primary: { main: '#1976d2' },
    },
  });

  const handleThemeToggle = () => {
    setMode((prevMode) => prevMode === 'light' ? 'dark' : 'light');
  };

  return (
    <Web3Provider>
      <BudgetProvider>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Navbar toggleTheme={handleThemeToggle} />
            <Routes>
              <Route path="/" element={<BudgetDashboard />} />
              <Route path="/budget" element={<BudgetDashboard />} />
            </Routes>
          </ThemeProvider>
        </BrowserRouter>
      </BudgetProvider>
    </Web3Provider>
  );
}

export default App;