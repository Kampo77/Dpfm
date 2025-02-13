import { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';

export function useAuth() {
  const { account, isConnected } = useWeb3();
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      setLoading(false);
      setInitialized(true);
    };

    init();
  }, [account]);

  return {
    isAuthenticated: isConnected,
    loading,
    initialized,
    account
  };
}