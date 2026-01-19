import { apiService } from './api';


export const recommendationService = {
  /**
   * Récupère toutes les recommandations d'un utilisateur
   */
  getUserRecommendations: async (userId) => {
    const response = await apiService.get(`/v1/recommandations/user/${userId}`);
    return response.data;
  },

  /**
   * Récupère les recommandations par type
   */
  getRecommendationsByType: async (userId, type) => {
    const response = await apiService.get(`/v1/recommandations/user/${userId}/type/${type}`);
    return response.data;
  },

  /**
   * Génère une recommandation personnalisée (IA automatique)
   * L'IA analyse automatiquement le comportement et les préférences
   */
  generatePersonalizedRecommendation: async (userId) => {
    try {
      const response = await apiService.post(`/ai/recommendations/personalized/${userId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error("Erreur génération recommandation personnalisée:", error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Génère une recommandation saisonnière (IA automatique)
   */
  generateSeasonalRecommendation: async (userId) => {
    try {
      const response = await apiService.post(`/ai/recommendations/seasonal/${userId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error("Erreur génération recommandation saisonnière:", error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Génère une recommandation basée sur les habitudes (IA automatique)
   */
  generateHabitBasedRecommendation: async (userId) => {
    try {
      const response = await apiService.post(`/ai/recommendations/habit-based/${userId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error("Erreur génération recommandation habitudes:", error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Génère une recommandation par créneau horaire (IA automatique)
   */
  generateTimeslotRecommendation: async (userId) => {
    try {
      const response = await apiService.post(`/ai/recommendations/timeslot/${userId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error("Erreur génération recommandation créneau:", error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Génère une recommandation d'engagement (IA automatique)
   */
  generateEngagementRecommendation: async (userId) => {
    try {
      const response = await apiService.post(`/ai/recommendations/engagement/${userId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error("Erreur génération recommandation engagement:", error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Marque une recommandation comme utilisée
   */
  markRecommendationAsUsed: async (recommendationId) => {
    const response = await apiService.put(`/v1/recommandations/${recommendationId}/utilise`);
    return response.data;
  },

  /**
   * Supprime toutes les recommandations d'un utilisateur
   */
  deleteUserRecommendations: async (userId) => {
    await apiService.delete(`/v1/recommandations/user/${userId}`);
  }
};