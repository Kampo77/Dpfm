export class CacheService {
  constructor() {
    this.cache = new Map();
    this.expiry = new Map();
  }

  set(key, value, ttl = 300000) { // 5 minutes default
    this.cache.set(key, value);
    this.expiry.set(key, Date.now() + ttl);
  }

  get(key) {
    if (this.expiry.has(key) && Date.now() > this.expiry.get(key)) {
      this.cache.delete(key);
      this.expiry.delete(key);
      return null;
    }
    return this.cache.get(key);
  }
}