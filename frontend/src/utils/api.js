// utils/api.js — Axios API client
import axios from 'axios';

// Clean up the URL to prevent double slashes (e.g. if URL ends with /)
const rawUrl = process.env.REACT_APP_API_URL || '';
const BASE_URL = rawUrl.endsWith('/') ? rawUrl.slice(0, -1) : rawUrl;

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.errors?.[0]?.msg ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export const calculateCosts = (payload) => api.post('/calculate', payload);
export const getProviders   = ()        => api.get('/providers');
export const getHistory     = (sid)     => api.get(`/history/${sid}`);
export const clearHistory   = (sid)     => api.delete(`/history/${sid}`);

export default api;
