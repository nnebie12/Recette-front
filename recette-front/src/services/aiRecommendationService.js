import { apiService } from './api';

export const aiRecommendationService = {
  /**
   * Génère une recommandation personnalisée basée sur le comportement utilisateur
   */
  generatePersonalizedRecommendation: async (userId, userBehavior, userPreferences) => {
    try {
      const response = await apiService.post(`/ai/recommendations/personalized/${userId}`, {
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
      return {
        success: false,
        error: error.message,
        fallback: generateFallbackRecommendations()
      };
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
      return {
        success: false,
        error: error.message,
        fallback: generateFallbackRecommendations()
      };
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
      return {
        success: false,
        error: error.message,
        fallback: generateFallbackRecommendations()
      };
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
      return {
        success: false,
        error: error.message,
        fallback: generateFallbackRecommendations()
      };
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
      return {
        success: false,
        error: error.message,
        fallback: generateFallbackRecommendations()
      };
    }
  }
};

// ============= Recommandations de secours =============

function generateFallbackRecommendations() {
  return {
    recommendations: [
      {
        titre: "Recettes Populaires",
        description: "Découvrez nos recettes les plus appréciées par la communauté",
        lien: "/recettes/populaires",
        tags: ["populaire", "communauté", "favoris"],
        raison: "Ces recettes plaisent à la majorité des utilisateurs"
      },
      {
        titre: "Recettes Rapides",
        description: "Des recettes délicieuses prêtes en moins de 30 minutes",
        lien: "/recettes/rapides",
        tags: ["rapide", "facile", "30min"],
        raison: "Idéal pour les emplois du temps chargés"
      },
      {
        titre: "Recettes de Saison",
        description: "Profitez des ingrédients frais et de saison",
        lien: "/recettes/saison",
        tags: ["saison", "frais", "local"],
        raison: "Les meilleurs ingrédients du moment"
      }
    ],
    score: 50.0
  };
}