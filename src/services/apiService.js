import axios from 'axios';
import { API_CONFIG, API_ENDPOINTS, DEFAULT_HEADERS, apiCache } from '../config/api.js';
import { mockLogs } from '../utils/mockData.js';

// Development mode flag - set to true to always use mock data
const FORCE_MOCK_DATA = false; // Force to use real API

// Request interceptor for timeout
const createAbortSignal = (timeout = API_CONFIG.TIMEOUT) => {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeout);
  return controller.signal;
};

// Retry mechanism
const retry = async (fn, retries = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0 && !error.name === 'AbortError') {
      await new Promise(resolve => setTimeout(resolve, delay));
      return retry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
};

// Enhanced fetch with error handling
const enhancedFetch = async (url, options = {}) => {
  const signal = createAbortSignal(options.timeout || API_CONFIG.TIMEOUT);

  const config = {
    ...options,
    signal,
    headers: {
      ...DEFAULT_HEADERS,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    return response;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
};

// Main API service class
class ApiService {
  constructor() {
    console.log('🏭 ApiService constructor called');
    console.log('🏭 API_CONFIG:', API_CONFIG);

    this.baseURL = API_CONFIG.BASE_URL;
    this.isOnline = navigator.onLine;
    this.requestQueue = new Map();

    console.log('🏭 ApiService initialized with baseURL:', this.baseURL);
    console.log('🏭 Online status:', this.isOnline);

    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  // Generate cache key
  generateCacheKey(endpoint, params) {
    const searchParams = new URLSearchParams(params).toString();
    return `${endpoint}?${searchParams}`;
  }

  // Build URL with parameters
  buildURL(endpoint, params = {}) {
    console.log('🔗 Building URL with baseURL:', this.baseURL, 'endpoint:', endpoint, 'params:', params);

    // Fix URL construction - use endpoint as first arg, baseURL as second arg
    const url = new URL(endpoint, this.baseURL);

    // Clean params - remove null/undefined values
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== 'null') {
        url.searchParams.append(key, value);
      }
    });

    const finalURL = url.toString();
    console.log('🔗 Final URL:', finalURL);
    return finalURL;
  }

  // Get logs with caching and performance optimizations
  async getLogs(params = {}, options = {}) {
    console.log('🎰 ApiService.getLogs called with params:', params);
    console.log('🎰 API_CONFIG:', API_CONFIG);

    const defaultParams = {
      clientCode: API_CONFIG.CLIENT_CODE || '011c381271',
      key: API_CONFIG.API_KEY,
      gateway: API_CONFIG.GATEWAY,
      ...params
    };

    console.log('🎰 Final params after merge:', defaultParams);
    const cacheKey = this.generateCacheKey(API_ENDPOINTS.LOGS, defaultParams);
    console.log('🎰 Generated cache key:', cacheKey);

    // Check cache first if enabled
    if (API_CONFIG.ENABLE_CACHE && !options.skipCache) {
      const cachedData = apiCache.get(cacheKey);
      if (cachedData) {
        console.log('🟢 Returning cached data');
        return cachedData;
      }
    }

    // Check if request is already in progress
    if (this.requestQueue.has(cacheKey)) {
      console.log('🔄 Request already in progress, waiting...');
      return this.requestQueue.get(cacheKey);
    }

    const requestPromise = this.makeRequest(defaultParams, options);
    this.requestQueue.set(cacheKey, requestPromise);

    try {
      const result = await requestPromise;

      // Cache successful results
      if (API_CONFIG.ENABLE_CACHE && result) {
        apiCache.set(cacheKey, result);
      }

      return result;
    } catch (error) {
      console.error('❌ API Request failed:', error);
      console.error('❌ Full error object:', JSON.stringify(error, null, 2));
      throw error; // Don't catch, let it bubble up to see real error
    } finally {
      this.requestQueue.delete(cacheKey);
    }
  }

    // Make actual API request with fallback
  async makeRequest(params, options = {}) {
    console.log('🔧 DEBUG: FORCE_MOCK_DATA =', FORCE_MOCK_DATA);
    console.log('🔧 DEBUG: isOnline =', this.isOnline);
    console.log('🔧 DEBUG: params =', params);

    // Force mock data mode for development
    if (FORCE_MOCK_DATA) {
      console.log('🎭 Force mock data mode enabled');
      return this.getFallbackData();
    }

    // If offline, return cached data or mock data
    if (!this.isOnline) {
      console.warn('📶 Offline mode - using fallback data');
      return this.getFallbackData();
    }

    try {
      console.log('🌐 Making API request to:', this.baseURL);

      const url = this.buildURL(API_ENDPOINTS.LOGS, params);
      console.log('📡 Request URL:', url);

      // Create axios instance with timeout
      const axiosInstance = axios.create({
        timeout: options.timeout || API_CONFIG.TIMEOUT,
        headers: {
          ...DEFAULT_HEADERS,
          ...options.headers,
        },
        withCredentials: false, // Disable credentials for CORS
      });

      console.log('🚀 Making axios request to:', url);
      const response = await retry(
        () => axiosInstance.get(url),
        options.retries || 2
      );

      console.log('📊 Response status:', response.status);
      console.log('📊 Response headers:', response.headers);
      const data = response.data;
      console.log('🔥 RAW API Response type:', typeof data);
      console.log('🔥 RAW API Response length:', data?.length);
      console.log('🔥 RAW API Response first item:', data?.[0]);
      console.log('🔥 RAW API Response isArray:', Array.isArray(data));

      // Validate response format
      if (!Array.isArray(data)) {
        console.warn('⚠️ Unexpected response format, using fallback');
        console.warn('Response type:', typeof data);
        console.warn('Response:', data);
        return this.getFallbackData();
      }

      console.log(`✅ API Success: ${data.length} logs received`);
      console.log('📊 Sample data:', data.slice(0, 2));
      return data;

    } catch (error) {
      console.error('💥 API Error details:', error);
      console.error('💥 Error message:', error.message);
      console.error('💥 Error response:', error.response?.data);
      console.error('💥 Error stack:', error.stack);

      // If it's a network error or timeout, try fallback
      if (error.code === 'ECONNABORTED' || error.code === 'NETWORK_ERROR' || !error.response) {
        console.warn('🔄 Network error, using fallback data');
        return this.getFallbackData();
      }

      // For other errors, throw to see what's wrong
      throw error;
    }
  }

  // Fallback data (mock or cached)
  getFallbackData() {
    // Try to get any cached data first
    return mockLogs;
  }

  // Clear cache manually
  clearCache() {
    apiCache.clear();
    console.log('🧹 Cache cleared');
  }

  // Prefetch data for better UX
  async prefetchLogs(params = {}) {
    try {
      await this.getLogs(params, { skipCache: false });
      console.log('⚡ Data prefetched successfully');
    } catch (error) {
      console.warn('⚡ Prefetch failed:', error.message);
    }
  }

  // Get API status
  async getStatus() {
    try {
      const response = await enhancedFetch(`${this.baseURL}/health`, {
        method: 'HEAD',
        timeout: 5000
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Convenience export
export const fetchLogsFromAPI = (params, options) => {
  console.log('🎯 fetchLogsFromAPI called with params:', params, 'options:', options);
  const result = apiService.getLogs(params, options);
  console.log('🎯 fetchLogsFromAPI returning:', result);
  return result;
};
