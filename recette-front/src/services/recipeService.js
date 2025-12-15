import { apiService } from './api';
import { STORAGE_KEYS } from '../utils/constants';

export const authService = {
  // Login user
  login: async (email, motDePasse) => {
    const response = await apiService.post('/v1/auth/login', { 
      email, 
      motDePasse 
    });
    
    if (response.data.token) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
    }
    
    return response.data;
  },

  // Register new user
  register: async (userData) => {
    const response = await apiService.post('/v1/auth/register', userData);
    return response.data;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await apiService.get('/v1/auth/me');
    const user = response.data;
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    return user;
  },

  // Validate token
  validateToken: async () => {
    const response = await apiService.post('/v1/auth/validate');
    return response.data;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  // Get stored token
  getToken: () => {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  // Get stored user
  getStoredUser: () => {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  }
};