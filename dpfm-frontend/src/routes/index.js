import { Navigate } from 'react-router-dom';
import FinancialDashboard from '../components/FinancialDashboard';
import AdminPanel from '../components/AdminPanel';
import TransactionHistory from '../components/TransactionHistory';
import NotFound from '../pages/NotFound';

export const routes = [
  {
    path: '/',
    element: <FinancialDashboard />,
    requiresAuth: true
  },
  {
    path: '/transactions',
    element: <TransactionHistory />,
    requiresAuth: true
  },
  {
    path: '/admin',
    element: <AdminPanel />,
    requiresAuth: true,
    requiresOwner: true
  },
  {
    path: '/404',
    element: <NotFound />
  },
  {
    path: '*',
    element: <Navigate to="/404" replace />
  }
];