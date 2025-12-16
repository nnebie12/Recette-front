import { apiService } from './api';

export const adminService = {
  // --- Utilisateurs ---
  getAllUsers: async () => {
    try {
      const response = await apiService.get('/administrateur/users');
      console.log('Response getAllUsers:', response);
      
      let data = response.data;
      
      // Si c'est une chaîne, la parser en JSON
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
          console.log('Données parsées:', data);
        } catch (parseError) {
          console.error('Erreur de parsing JSON:', parseError);
          throw new Error('Format de réponse invalide du serveur');
        }
      }
      
      // Nettoyer les références circulaires dans les recettes
      if (Array.isArray(data)) {
        data = data.map(user => ({
          id: user.id,
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          role: user.role,
          preferenceAlimentaire: user.preferenceAlimentaire,
          // Ne pas inclure les recettes complètes pour éviter les références circulaires
          recettesCount: user.recettes?.length || 0
        }));
      }
      
      return data;
    } catch (error) {
      console.error('Erreur getAllUsers:', error);
      throw error;
    }
  },
  
  updateUser: async (id, updatedData) => {
    try {
      const response = await apiService.put(`/administrateur/users/${id}`, updatedData);
      let data = response.data;
      
      // Parser si nécessaire
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }
      
      return data;
    } catch (error) {
      console.error('Erreur updateUser:', error);
      throw error;
    }
  },
  
  deleteUser: async (id) => {
    try {
      await apiService.delete(`/administrateur/users/${id}`);
    } catch (error) {
      console.error('Erreur deleteUser:', error);
      throw error;
    }
  },

  // --- Recettes ---
  deleteRecipe: async (id) => {
    try {
      await apiService.delete(`/administrateur/recettes/${id}`);
    } catch (error) {
      console.error('Erreur deleteRecipe:', error);
      throw error;
    }
  },

  // --- Comportement ---
  getUsersByProfile: async (profil) => {
    try {
      const response = await apiService.get(`/administrateur/comportements/profil/${profil}`);
      let data = response.data;
      
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }
      
      return data;
    } catch (error) {
      console.error('Erreur getUsersByProfile:', error);
      throw error;
    }
  },
  
  triggerAnalysis: async (userId) => {
    try {
      const response = await apiService.post(`/administrateur/comportements/analyser/${userId}`);
      let data = response.data;
      
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }
      
      return data;
    } catch (error) {
      console.error('Erreur triggerAnalysis:', error);
      throw error;
    }
  },
  
  getUserPatterns: async (userId) => {
    try {
      const response = await apiService.get(`/administrateur/comportements/patterns/${userId}`);
      let data = response.data;
      
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }
      
      return data;
    } catch (error) {
      console.error('Erreur getUserPatterns:', error);
      throw error;
    }
  },

  getUserComportementStatistiques: async (userId) => {
    try {
      const response = await apiService.get(`/administrateur/comportements/statistiques/${userId}`);
      let data = response.data;
      
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }
      
      return data;
    } catch (error) {
      console.error('Erreur getUserComportementStatistiques:', error);
      console.warn('Endpoint statistiques non disponible, retour de données vides');
      return null;
    }
  },

  // --- Recommandations IA ---
  triggerRecommendation: async (userId, type) => {
    try {
      const response = await apiService.post(
        `/ai-recommendations/generate/${userId}`, 
        null, 
        { params: { type: type.toUpperCase() } }
      );
      let data = response.data;
      
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }
      
      return data;
    } catch (error) {
      console.error('Erreur triggerRecommendation:', error);
      throw error;
    }
  },
  
  triggerPersonalizedRecommendation: async (userId) => {
    try {
      const response = await apiService.post(`/ai-recommendations/generate/personalized/${userId}`);
      let data = response.data;
      
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }
      
      return data;
    } catch (error) {
      console.error('Erreur triggerPersonalizedRecommendation:', error);
      throw error;
    }
  },
};