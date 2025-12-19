import { apiService } from './api';

export const userBehaviorService = {
  // Analyse complète (RFM, Churn, Patterns)
  getAdvancedAnalysis: async (userId) => {
    const response = await apiService.get(`/v1/comportement-utilisateur/user/${userId}/analyse-avancee`);
    return response.data;
  },

  // Risque de Churn spécifique
  getChurnRisk: async (userId) => {
    const response = await apiService.get(`/v1/comportement-utilisateur/user/${userId}/risque-churn`);
    return response.data;
  },

  // Segmentation RFM
  getRFMSegmentation: async (userId) => {
    const response = await apiService.get(`/v1/comportement-utilisateur/user/${userId}/segmentation-rfm`);
    return response.data;
  },

  // Actions d'engagement recommandées par l'IA
  getEngagementActions: async (userId) => {
    const response = await apiService.get(`/v1/comportement-utilisateur/user/${userId}/actions-engagement`);
    return response.data;
  },

  // Stats globales pour le dashboard (Admin)
  getGlobalAnalytics: async () => {
    // Supposons un endpoint qui agrège les données de tous les comportements
    const response = await apiService.get('/v1/comportement-utilisateur/stats-globales');
    return response.data;
  },

  // Récupère les stats globales pour le visualiseur RFM
  getGlobalRFMStats: async () => {
    try {
      // Note: Assurez-vous d'avoir cet endpoint ou calculez-le depuis la liste
      const response = await apiService.get('/v1/comportement-utilisateur/engaged');
      // Logique simplifiée pour l'exemple : on compte par profil
      return response.data; 
    } catch (error) {
      console.error("Erreur stats globales:", error.message);
      return { champions: 0, fidele: 0, risque: 0, nouveau: 0 };
    }
  },
};