import { apiService } from './api';

export const aiRecommendationService = {
  /**
   * Génère une recommandation personnalisée basée sur le comportement utilisateur
   */
  generatePersonalizedRecommendation: async (userId, userBehavior, userPreferences) => {
    try {
      const response = await apiService.post(`/v1/recommendations/personalized/${userId}`, {
        profil: userBehavior?.profil || 'NOUVEAU',
        scoreEngagement: userBehavior?.scoreEngagement || 0,
        categories: userPreferences?.categories || [],
        types: userPreferences?.types || []
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error("Erreur lors de la génération de recommandation IA:", error);
      throw new Error(`Echec recommandation personnalisee: ${error.message}`);
    }
  },

  /**
   * Génère une recommandation saisonnière
   */
  generateSeasonalRecommendation: async (userId, season, userPreferences) => {
    try {
      const response = await apiService.post(`/ai/recommendations/seasonal/${userId}`, {
        saison: season || 'PRINTEMPS',
        ingredients: userPreferences?.ingredients || []
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error("Erreur lors de la génération de recommandation saisonnière:", error);
      throw new Error(`Echec recommandation saisonniere: ${error.message}`);
    }
  },

  /**
   * Génère une recommandation basée sur les habitudes
   */
  generateHabitBasedRecommendation: async (userId, habits, browsing) => {
    try {
      const response = await apiService.post(`/ai/recommendations/habit-based/${userId}`, {
        typeRecette: habits?.typeRecette || 'Varié',
        tempsPreparation: habits?.tempsPreparation || 'Moyen',
        difficulte: habits?.difficulte || 'Intermédiaire',
        categoriesPreferees: browsing?.categories || []
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error("Erreur lors de la génération de recommandation par habitudes:", error);
      throw new Error(`Echec recommandation habitudes: ${error.message}`);
    }
  },

  /**
   * Génère une recommandation pour un créneau horaire
   */
  generateTimeslotRecommendation: async (userId, timeslot, userPreferences) => {
    try {
      const response = await apiService.post(`/ai/recommendations/timeslot/${userId}`, {
        creneau: timeslot || 'DEJEUNER',
        preferences: userPreferences?.preferences || []
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error("Erreur lors de la génération de recommandation par créneau:", error);
      throw new Error(`Echec recommandation creneau: ${error.message}`);
    }
  },

  /**
   * Génère une recommandation pour améliorer l'engagement
   */
  generateEngagementRecommendation: async (userId, engagementScore) => {
    try {
      const response = await apiService.post(`/ai/recommendations/engagement/${userId}`, {
        engagementScore: engagementScore || 50
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error("Erreur lors de la génération de recommandation d'engagement:", error);
      throw new Error(`Echec recommandation engagement: ${error.message}`);
    }
  }
};