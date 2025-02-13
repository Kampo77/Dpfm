import { useState, useEffect } from 'react';

export const useRoleManagement = (contract) => {
  const [isOwner, setIsOwner] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkRoles();
  }, [contract]);

  const checkRoles = async () => {
    if (!contract) return;
    
    try {
      const signer = contract.signer;
      const address = await signer.getAddress();
      
      const [hasOwnerRole, hasAuthorizedRole] = await Promise.all([
        contract.owner().then((owner) => owner.toLowerCase() === address.toLowerCase()),
        contract.hasRole(await contract.AUTHORIZED_ROLE(), address)
      ]);

      setIsOwner(hasOwnerRole);
      setIsAuthorized(hasAuthorizedRole);
    } catch (error) {
      console.error('Error checking roles:', error);
    } finally {
      setLoading(false);
    }
  };

  return { isOwner, isAuthorized, loading };
};