import { apiService } from './api';

export const searchHistoryService = {
  // Enregistrer une nouvelle recherche
  recordSearch: async (userId, terme, filtres = []) => {
    try {
      const response = await apiService.post('/v1/historique-recherche', filtres, {
        params: { userId, terme }
      });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la recherche:", error);
      throw error;
    }
  },

  // Récupérer l'historique de l'utilisateur
  getUserHistory: async (userId) => {
    try {
      const response = await apiService.get(`/v1/historique-recherche/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Erreur récupération historique:", error);
      return [];
    }
  },

  // Récupérer les termes fréquents (utile pour l'IA côté Front)
  getFrequentTerms: async (userId) => {
    try {
      const response = await apiService.get(`/v1/historique-recherche/user/${userId}/statistiques`);
      return response.data; // Retourne souvent une Map<String, Long>
    } catch (error) {
      console.error("Erreur stats recherches:", error);
      return {};
    }
  }
};