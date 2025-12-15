import { apiService } from './api';

export const userService = {
  // Get all users
  getAllUsers: async () => {
    const response = await apiService.get('/v1/users');
    return response.data;
  },

  // Get user by ID
  getUserById: async (id) => {
    const response = await apiService.get(`/v1/users/${id}`);
    return response.data;
  },

  // Update user
  updateUser: async (id, userData) => {
    const response = await apiService.put(`/v1/users/${id}`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (id) => {
    await apiService.delete(`/v1/users/${id}`);
  },

  // Get user behavior
  getUserBehavior: async (userId) => {
    const response = await apiService.get(`/v1/comportement-utilisateur/user/${userId}`);
    return response.data;
  },

  // Get or create user behavior
  getOrCreateUserBehavior: async (userId) => {
    const response = await apiService.get(`/v1/comportement-utilisateur/user/${userId}/or-create`);
    return response.data;
  },

  // Update user behavior
  updateUserBehavior: async (userId, behaviorData) => {
    const response = await apiService.put(`/v1/comportement-utilisateur/user/${userId}`, behaviorData);
    return response.data;
  },

  // Refresh user metrics
  refreshUserMetrics: async (userId) => {
    await apiService.post(`/v1/comportement-utilisateur/user/${userId}/refresh-metrics`);
  },

  // Record search
  recordSearch: async (userId, terme, nombreResultats, rechercheFructueuse, filtres = []) => {
    const response = await apiService.post(`/v1/comportement-utilisateur/user/${userId}/record-search`, 
      filtres,
      {
        params: {
          terme,
          nombreResultats,
          rechercheFructueuse
        }
      }
    );
    return response.data;
  },

  // Get frequent search terms
  getFrequentSearchTerms: async (userId) => {
    const response = await apiService.get(`/v1/comportement-utilisateur/user/${userId}/frequent-terms`);
    return response.data;
  },

  // Get engaged users
  getEngagedUsers: async (scoreMinimum = 50) => {
    const response = await apiService.get('/v1/comportement-utilisateur/engaged', {
      params: { scoreMinimum }
    });
    return response.data;
  },

  // Get users by profile
  getUsersByProfile: async (profil) => {
    const response = await apiService.get(`/v1/comportement-utilisateur/profil/${profil}`);
    return response.data;
  }
};