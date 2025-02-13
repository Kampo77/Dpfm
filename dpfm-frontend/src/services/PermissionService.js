export class PermissionService {
  constructor(contract) {
    this.contract = contract;
    this.permissionCache = new Map();
  }

  async hasPermission(address, permission) {
    const cacheKey = `${address}-${permission}`;
    if (this.permissionCache.has(cacheKey)) {
      return this.permissionCache.get(cacheKey);
    }

    const hasPermission = await this.contract.hasRole(permission, address);
    this.permissionCache.set(cacheKey, hasPermission);
    
    // Cache invalidation after 5 minutes
    setTimeout(() => {
      this.permissionCache.delete(cacheKey);
    }, 5 * 60 * 1000);

    return hasPermission;
  }
}