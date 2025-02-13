import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useWeb3 } from '../contexts/Web3Context';
import LoadingOverlay from './LoadingOverlay';

function ProtectedRoute({ children, requiresOwner }) {
  const { isConnected, isOwner, loading } = useWeb3();
  const location = useLocation();

  if (loading) {
    return <LoadingOverlay open message="Checking authentication..." />;
  }

  if (!isConnected) {
    return <Navigate to="/connect" state={{ from: location }} replace />;
  }

  if (requiresOwner && !isOwner) {
    return <Navigate to="/" replace />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiresOwner: PropTypes.bool
};

export default ProtectedRoute;