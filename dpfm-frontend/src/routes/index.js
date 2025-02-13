import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthGuard from '../guards/AuthGuard';
import DashboardLayout from '../components/DashboardLayout';
import { NotFoundPage, UnauthorizedPage } from '../pages/ErrorPages';
import Dashboard from '../pages/Dashboard';
import Transactions from '../pages/Transactions';
import AdminPanel from '../pages/AdminPanel';

export const routes = [
  {
    path: '/',
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Dashboard />
        </DashboardLayout>
      </AuthGuard>
    ),
  },
  {
    path: '/transactions',
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Transactions />
        </DashboardLayout>
      </AuthGuard>
    ),
  },
  {
    path: '/admin',
    element: (
      <AuthGuard requiredRole="ADMIN">
        <DashboardLayout>
          <AdminPanel />
        </DashboardLayout>
      </AuthGuard>
    ),
  },
  {
    path: '/unauthorized',
    element: <UnauthorizedPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];