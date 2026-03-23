import { apiService } from './api';
import { STORAGE_KEYS } from '../utils/constants';

// Notifie l'extension Chrome d'un changement de session
function dispatchAuthEvent(type, payload = null) {
  try {
    window.dispatchEvent(
      new CustomEvent('recipe-ai:auth', {
        detail: { type, payload },
      })
    );
  } catch {
    // Extension non installée — pas bloquant
  }
}

export const authService = {
  login: async (email, motDePasse) => {
    const response = await apiService.post('/v1/auth/login', {
      email,
      motDePasse,
    });

    if (response.data.token) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token);

      // Récupérer l'utilisateur complet pour le passer à l'extension
      const user = await authService.getCurrentUser();

      // Synchronise l'extension Chrome
      dispatchAuthEvent('LOGIN', {
        token: response.data.token,
        user: {
          id: user.id,
          nom: `${user.prenom || ''} ${user.nom || ''}`.trim(),
          email: user.email,
        },
      });
    }

    return response.data;
  },

  register: async (userData) => {
    const response = await apiService.post('/v1/auth/register', userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);

    // Désynchronise l'extension Chrome
    dispatchAuthEvent('LOGOUT');
  },

  getCurrentUser: async () => {
    const response = await apiService.get('/v1/auth/me');
    const user = response.data;
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    return user;
  },

  validateToken: async () => {
    const response = await apiService.post('/v1/auth/validate');
    return response.data;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  getToken: () => {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  getStoredUser: () => {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  },
};