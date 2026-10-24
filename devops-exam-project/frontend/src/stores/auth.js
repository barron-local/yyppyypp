// ==============================================================================
// PINIA AUTH STORE: frontend/src/stores/auth.js
// เกณฑ์ข้อ 3.2.8.1 & 3.4.2.7: จัดการ State ผู้ใช้, Token JWT และ Role ด้วย Pinia
// ==============================================================================

import { defineStore } from 'pinia';
import api from '../services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    user: JSON.parse(localStorage.getItem('user') || 'null'),
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    role: (state) => state.user?.role || 'guest',
    isAdmin: (state) => state.user?.role === 'admin',
    canCreate: (state) => state.user?.role === 'admin' || state.user?.role === 'user1',
  },

  actions: {
    async login(username, password) {
      const response = await api.post('/auth/login', { username, password });
      const { token, user } = response.data.data;
      
      this.token = token;
      this.user = user;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    },

    logout() {
      this.token = '';
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
});