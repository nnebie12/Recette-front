// recette-front/src/services/recommendationService.js

import { apiService } from './api';

export const recommendationService = {
  // Get user recommendations
  getUserRecommendations: async (userId) => {
    const response = await apiService.get(`/v1/recommandations/user/${userId}`);
    return response.data;
  },

  // Get recommendations by type
  getRecommendationsByType: async (userId, type) => {
    const response = await apiService.get(`/v1/recommandations/user/${userId}/type/${type}`);
    return response.data;
  },

  // Add a new recommendation (pour l'IA)
  addRecommendation: async (userId, type, recommendations, score) => {
    const response = await apiService.post('/v1/recommandations', {
      userId,
      type,
      recommandation: recommendations,
      score,
      dateRecommandation: new Date().toISOString(),
      estUtilise: false
    });
    return response.data;
  },

  // Generate personalized recommendation (backend)
  generatePersonalizedRecommendation: async (userId) => {
    const response = await apiService.post(`/ai-recommendations/generate/personalized/${userId}`);
    return response.data;
  },

  // Generate seasonal recommendation (backend)
  generateSeasonalRecommendation: async (userId) => {
    const response = await apiService.post(`/ai-recommendations/generate/seasonal/${userId}`);
    return response.data;
  },

  // Generate timeslot recommendation (backend)
  generateTimeslotRecommendation: async (userId) => {
    const response = await apiService.post(`/ai-recommendations/generate/timeslot/${userId}`);
    return response.data;
  },

  // Generate habit-based recommendation (backend)
  generateHabitBasedRecommendation: async (userId) => {
    const response = await apiService.post(`/ai-recommendations/generate/habit-based/${userId}`);
    return response.data;
  },

  // Generate engagement recommendation (backend)
  generateEngagementRecommendation: async (userId) => {
    const response = await apiService.post(`/ai-recommendations/generate/engagement/${userId}`);
    return response.data;
  },

  // Generate recommendation by type (backend)
  generateRecommendationByType: async (userId, type) => {
    const response = await apiService.post(`/ai-recommendations/generate/${userId}`, null, {
      params: { type }
    });
    return response.data;
  },

  // Mark recommendation as used
  markRecommendationAsUsed: async (recommandationId) => {
    const response = await apiService.put(`/v1/recommandations/${recommandationId}/utilise`);
    return response.data;
  },

  // Delete user recommendations
  deleteUserRecommendations: async (userId) => {
    await apiService.delete(`/v1/recommandations/user/${userId}`);
  }
};