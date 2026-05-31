import { apiService } from './api';

const FEEDBACK_ACTION_MAP = {
  like: 'like',
  liked: 'like',
  click: 'click',
  clicked: 'click',
  dismiss: 'dismiss',
  dismissed: 'dismiss',
};

export const normalizeRecommendationAction = (action) => {
  if (typeof action !== 'string') return 'click';
  const normalized = action.trim().toLowerCase();
  return FEEDBACK_ACTION_MAP[normalized] || 'click';
};

export const recommendationService = {

  getUserRecommendations: async (userId) => {
    const response = await apiService.get(`/v1/recommandations/user/${userId}`);
    return response.data;
  },

  getRecommendationsByType: async (userId, type) => {
    const response = await apiService.get(`/v1/recommandations/user/${userId}/type/${type}`);
    return response.data;
  },

  generatePersonalizedRecommendation: async (userId) => {
    const response = await apiService.post(`/v1/recommendations/personalized/${userId}`);
    return response.data;
  },

  generateSeasonalRecommendation: async (userId) => {
    const response = await apiService.post(`/v1/recommandations/user/${userId}/generer-saisonniere`);
    return response.data;
  },

  generateHabitBasedRecommendation: async (userId) => {
    const response = await apiService.post(`/v1/recommandations/user/${userId}/generer-habitudes`);
    return response.data;
  },

  generateTimeslotRecommendation: async (userId) => {
    const response = await apiService.post(`/v1/recommandations/user/${userId}/generer-creneau`);
    return response.data;
  },

  generateEngagementRecommendation: async (userId) => {
    const response = await apiService.post(`/v1/recommandations/user/${userId}/generer-engagement`);
    return response.data;
  },

  generateAllRecommendations: async (userId) => {
    const response = await apiService.post(`/v1/recommandations/user/${userId}/generer-toutes`);
    return response.data;
  },

  markRecommendationAsUsed: async (recommendationId) => {
    const response = await apiService.put(`/v1/recommandations/${recommendationId}/utilise`);
    return response.data;
  },

  sendRecommendationFeedback: async ({ userId, recipeId, action }) => {
    const payload = {
      userId,
      recipeId,
      action: normalizeRecommendationAction(action),
    };

    const response = await apiService.post('/v1/recommendations/feedback', payload);
    return response.data;
  },

  deleteUserRecommendations: async (userId) => {
    await apiService.delete(`/v1/recommandations/user/${userId}`);
  }
};