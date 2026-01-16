import { apiService } from './api';

export const interactionService = {
  // Enregistrer une interaction (CLIC, FAVORIS, VUE_DETAIL, etc.)
  recordInteraction: async (userId, typeInteraction, entiteId, dureeConsultation = null) => {
    try {
      const response = await apiService.post('/v1/interactions', null, {
        params: { userId, typeInteraction, entiteId, dureeConsultation }
      });
      return response.data;
    } catch (error) {
      console.error("Erreur enregistrement interaction:", error);
    }
  },

  // Récupérer les interactions d'un utilisateur
  getUserInteractions: async (userId) => {
    const response = await apiService.get(`/v1/interactions/user/${userId}`);
    return response.data;
  },

  // Récupérer par type (ex: pour voir tous les clics récents)
  getInteractionsByType: async (userId, type) => {
    const response = await apiService.get(`/v1/interactions/user/${userId}/type/${type}`);
    return response.data;
  }
};