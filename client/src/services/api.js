import axios from 'axios';

// Resolves correct API base URL dynamically for local dev and production deployments
const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;

  const isBrowser = typeof window !== 'undefined';
  const isLocalHost =
    isBrowser &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname === '[::1]');

  // In production deployment (e.g. *.vercel.app), if envUrl is missing, points to localhost, or points to obsolete Render instance, use active Render backend
  if (isBrowser && !isLocalHost) {
    if (
      !envUrl ||
      envUrl.includes('localhost') ||
      envUrl.includes('127.0.0.1') ||
      envUrl.includes('campusiq-vb32.onrender.com')
    ) {
      return 'https://studentlens-qvp7.onrender.com/api';
    }
  }

  const rawUrl = envUrl || 'http://localhost:5000/api';
  return rawUrl.trim().replace(/\/+$/, '');
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: attach Authorization Bearer token from localStorage
api.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('studentlens_token') || localStorage.getItem('campusiq_token')
        : null;
    if (token && token !== 'null' && token !== 'undefined') {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for centralized error message formatting and token cleanup
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token is invalid or expired, clean up local storage tokens
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('studentlens_token');
      localStorage.removeItem('campusiq_token');
    }

    // Standardize error message extraction
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred. Please try again.';
    const enhancedError = new Error(message);
    enhancedError.response = error.response;
    enhancedError.status = error.response?.status;
    return Promise.reject(enhancedError);
  }
);

export default api;
