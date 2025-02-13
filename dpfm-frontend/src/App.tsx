import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useRoleManagement } from './hooks/useRoleManagement';
import AuthGuard from './components/AuthGuard';
import AdminPanel from './components/AdminPanel';

const App: React.FC = () => {
  const { contract } = useContract(CONTRACT_ADDRESS);
  const { isOwner, isAuthorized, loading } = useRoleManagement(contract);

  if (loading) {
    return <LoadingOverlay open message="Loading application..." />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={
            <AuthGuard isAuthorized={isAuthorized}>
              <FinancialDashboard contract={contract} />
            </AuthGuard>
          } 
        />
        <Route 
          path="/admin" 
          element={
            isOwner ? (
              <AdminPanel contract={contract} isOwner={isOwner} />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};