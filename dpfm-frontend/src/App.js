import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { Web3Provider } from './contexts/Web3Context';
import { BudgetProvider } from './context/BudgetContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Navigation from './components/Navigation';
import BudgetDashboard from './pages/Budget/BudgetDashboard';
import FinancialDashboard from './components/FinancialDashboard';
import NotFound from './pages/NotFound';
import ErrorBoundary from './components/ErrorBoundary';
import { useRoleManagement } from './hooks/useRoleManagement';
import ProtectedRoute from './components/ProtectedRoute';
import AdminPanel from './components/AdminPanel';
import LoadingOverlay from './components/LoadingOverlay';
import { useContract } from './hooks/useContract';
import { routes } from './routes';

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;

function App() {
  const [mode, setMode] = useState('light');
  const { contract } = useContract(CONTRACT_ADDRESS);
  const { isOwner, isAuthorized, loading } = useRoleManagement(contract);

  const theme = createTheme({
    palette: {
      mode,
      primary: { main: '#1976d2' },
      secondary: { main: '#dc004e' },
    },
  });

  const handleThemeToggle = () => {
    setMode((prevMode) => prevMode === 'light' ? 'dark' : 'light');
  };

  if (loading) {
    return <LoadingOverlay open message="Loading application..." />;
  }

  return (
    <ErrorBoundary>
      <NotificationProvider>
        <Web3Provider>
          <BudgetProvider>
            <BrowserRouter>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <Navigation toggleTheme={handleThemeToggle} />
                <Routes>
                  {routes.map((route) => (
                    <Route
                      key={route.path}
                      path={route.path}
                      element={
                        route.requiresAuth ? (
                          <ProtectedRoute requiresOwner={route.requiresOwner}>
                            {route.element}
                          </ProtectedRoute>
                        ) : (
                          route.element
                        )
                      }
                    />
                  ))}
                </Routes>
                {isAuthorized && (
                  <FinancialDashboard 
                    contractAddress="YOUR_DEPLOYED_CONTRACT_ADDRESS"
                  />
                )}
              </ThemeProvider>
            </BrowserRouter>
          </BudgetProvider>
        </Web3Provider>
      </NotificationProvider>
    </ErrorBoundary>
  );
}

export default App;