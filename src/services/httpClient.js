import axios from 'axios';
import { API_BASE_URL } from '../config/env';

// Create a dedicated axios instance to avoid polluting the global default.
export const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  withCredentials: false, // set true only if you rely on cookies
});

// Attach auth token if present
http.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore storage errors
  }
  return config;
});

// Normalize errors
http.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalized = {
      message: error.response?.data?.message || error.message || 'Request failed',
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
    };
    return Promise.reject(normalized);
  }
);

export const setAuthToken = (token) => {
  if (!token) return;
  localStorage.setItem('authToken', token);
};
