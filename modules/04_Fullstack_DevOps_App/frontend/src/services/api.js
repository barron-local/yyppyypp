// ==============================================================================
// AXIOS CLIENT: frontend/src/services/api.js
// เกณฑ์ข้อ 3.2.8.1 & 3.4.2.7: HTTP Client พร้อม Request Interceptor แนบ Bearer JWT Token
// ==============================================================================

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
});

// Request Interceptor: แนบ Authorization Bearer Token ในทุก Request โดยอัตโนมัติ
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: จัดการ Error 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export default api;