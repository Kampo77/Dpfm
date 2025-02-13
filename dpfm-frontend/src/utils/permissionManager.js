export const ROLES = {
  OWNER: 'OWNER',
  AUTHORIZED: 'AUTHORIZED',
  USER: 'USER'
};

export const checkPermission = (requiredRole, userRole) => {
  const roleHierarchy = {
    [ROLES.OWNER]: 3,
    [ROLES.AUTHORIZED]: 2,
    [ROLES.USER]: 1
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};