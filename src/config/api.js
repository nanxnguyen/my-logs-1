// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://register-b-api.hsc.com.vn',
  CLIENT_CODE: import.meta.env.VITE_API_CLIENT_CODE || '011c381271',
  API_KEY: import.meta.env.VITE_API_KEY || 'AHDUWND72KD826S5E7NG93HE7SK27H4F',
  GATEWAY: import.meta.env.VITE_API_GATEWAY || 'UPDATE_USER_INFO',
  TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000,
  ENABLE_CACHE: import.meta.env.VITE_ENABLE_CACHE !== 'false',
  CACHE_DURATION: parseInt(import.meta.env.VITE_CACHE_DURATION) || 300000, // 5 minutes
};

// API Endpoints
export const API_ENDPOINTS = {
  LOGS: '/banking-services/v2/logs'
};

// Request defaults
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// Cache implementation
class ApiCache {
  constructor() {
    this.cache = new Map();
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  set(key, data, duration = API_CONFIG.CACHE_DURATION) {
    this.cache.set(key, {
      data,
      expiry: Date.now() + duration
    });
  }

  clear() {
    this.cache.clear();
  }

  delete(key) {
    this.cache.delete(key);
  }

  // Clean expired entries
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

export const apiCache = new ApiCache();

// Cleanup cache every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    apiCache.cleanup();
  }, 300000);
}
