import { apiService } from './api';

export const adminService = {
  // ==================== UTILISATEURS ====================
  
  /**
   * Récupère tous les utilisateurs avec pagination et filtres
   */
  getAllUsers: async (params = {}) => {
    try {
      const { page = 0, size = 50, sort = 'id,desc' } = params;
      const response = await apiService.get('/administrateur/users', {
        params: { page, size, sort }
      });
      
      return normalizeUserData(response.data);
    } catch (error) {
      console.error('Erreur getAllUsers:', error);
      throw new Error(`Impossible de charger les utilisateurs: ${error.message}`);
    }
  },

  /**
   * Récupère un utilisateur avec toutes ses données comportementales
   */
  getUserWithBehavior: async (userId) => {
    try {
      const [user, behavior] = await Promise.all([
        apiService.get(`/administrateur/users/${userId}`),
        apiService.get(`/v1/comportement-utilisateur/user/${userId}`)
      ]);
      
      return {
        ...normalizeUserData(user.data),
        behavior: behavior.data
      };
    } catch (error) {
      console.error(`Erreur getUserWithBehavior (${userId}):`, error);
      throw error;
    }
  },

  /**
   * Met à jour un utilisateur
   */
  updateUser: async (id, updatedData) => {
    try {
      const response = await apiService.put(`/administrateur/users/${id}`, updatedData);
      return normalizeUserData(response.data);
    } catch (error) {
      console.error('Erreur updateUser:', error);
      throw new Error(`Échec de la mise à jour de l'utilisateur: ${error.message}`);
    }
  },

  /**
   * Supprime un utilisateur
   */
  deleteUser: async (id) => {
    try {
      await apiService.delete(`/administrateur/users/${id}`);
    } catch (error) {
      console.error('Erreur deleteUser:', error);
      throw new Error(`Échec de la suppression de l'utilisateur: ${error.message}`);
    }
  },

  // ==================== RECETTES ====================
  
  deleteRecipe: async (id) => {
    try {
      await apiService.delete(`/administrateur/recettes/${id}`);
    } catch (error) {
      console.error('Erreur deleteRecipe:', error);
      throw new Error(`Échec de la suppression de la recette: ${error.message}`);
    }
  },

  // ==================== COMPORTEMENT & ANALYSE ====================
  
  /**
   * Récupère les statistiques globales du dashboard
   */
  getDashboardStats: async () => {
    try {
      const [users, rfmStats, engagedUsers] = await Promise.all([
        apiService.get('/administrateur/users'),
        apiService.get('/v1/comportement-utilisateur/stats/rfm'),
        apiService.get('/v1/comportement-utilisateur/engaged', {
          params: { scoreMinimum: 50 }
        })
      ]);

      const usersData = normalizeUserData(users.data);
      
      return {
        totalUsers: usersData.length,
        activeRecipes: usersData.reduce((acc, u) => acc + (u.recettesCount || 0), 0),
        totalComments: 0, // À implémenter si disponible
        avgRating: 4.6, // À calculer depuis les vraies données
        rfm: rfmStats.data || { champions: 0, fidele: 0, risque: 0, nouveau: 0 },
        engagedCount: engagedUsers.data?.length || 0
      };
    } catch (error) {
      console.error('Erreur getDashboardStats:', error);
      throw error;
    }
  },

  /**
   * Récupère tous les utilisateurs enrichis avec leurs données comportementales
   */
  getUsersWithBehavior: async () => {
    try {
      const users = await adminService.getAllUsers();
      
      // Charger les comportements en parallèle par batch de 10
      const batchSize = 10;
      const enrichedUsers = [];
      
      for (let i = 0; i < users.length; i += batchSize) {
        const batch = users.slice(i, i + batchSize);
        const behaviorPromises = batch.map(user =>
          apiService.get(`/v1/comportement-utilisateur/user/${user.id}`)
            .then(res => ({ ...user, behavior: res.data }))
            .catch(error => {
              console.warn(`Comportement non trouvé pour user ${user.id}:`, error.message);
              return { ...user, behavior: null };
            })
        );
        
        const batchResults = await Promise.all(behaviorPromises);
        enrichedUsers.push(...batchResults);
      }
      
      return enrichedUsers;
    } catch (error) {
      console.error('Erreur getUsersWithBehavior:', error);
      throw error;
    }
  },

  /**
   * Récupère les utilisateurs par profil comportemental
   */
  getUsersByProfile: async (profil) => {
    try {
      const response = await apiService.get(
        `/v1/comportement-utilisateur/profil/${profil}`
      );
      return parseJsonIfNeeded(response.data);
    } catch (error) {
      console.error('Erreur getUsersByProfile:', error);
      throw error;
    }
  },

  /**
   * Déclenche l'analyse comportementale pour un utilisateur
   */
  triggerAnalysis: async (userId) => {
    try {
      const response = await apiService.post(
        `/v1/comportement-utilisateur/user/${userId}/analyser`
      );
      return parseJsonIfNeeded(response.data);
    } catch (error) {
      console.error('Erreur triggerAnalysis:', error);
      throw error;
    }
  },

  /**
   * Récupère les patterns de navigation d'un utilisateur
   */
  getUserPatterns: async (userId) => {
    try {
      const response = await apiService.get(
        `/v1/comportement-utilisateur/user/${userId}/patterns`
      );
      return parseJsonIfNeeded(response.data);
    } catch (error) {
      console.error('Erreur getUserPatterns:', error);
      throw error;
    }
  },

  /**
   * Récupère les statistiques détaillées de comportement
   */
  getUserComportementStatistiques: async (userId) => {
    try {
      const response = await apiService.get(
        `/v1/comportement-utilisateur/user/${userId}/statistiques`
      );
      return parseJsonIfNeeded(response.data);
    } catch (error) {
      console.warn('Statistiques non disponibles:', error.message);
      return null;
    }
  },

  
  getRFMStats: async () => {
    try {
      const response = await apiService.get('/v1/comportement-utilisateur/stats/rfm');
      return response.data;
    } catch (error) {
      console.warn('Stats RFM non disponibles, retour de valeurs par défaut', error.message);
      return { champions: 0, fidele: 0, risque: 0, nouveau: 0 };
    }
  },

  // ==================== RECOMMENDATIONS MANAGEMENT ====================
  
  /**
   * Récupère toutes les recommandations (admin)
   */
  getAllRecommendations: async () => {
    const response = await apiService.get('/administrateur/recommandations');
    return response.data;
  },

  /**
   * Récupère les recommandations par utilisateur
   */
  getRecommendationsByUser: async (userId) => {
    const response = await apiService.get(`/administrateur/recommandations/user/${userId}`);
    return response.data;
  },

  /**
   * Récupère les recommandations par type
   */
  getRecommendationsByType: async (type) => {
    const response = await apiService.get(`/administrateur/recommandations/type/${type}`);
    return response.data;
  },

  /**
   * Récupère les statistiques des recommandations
   */
  getRecommendationStats: async () => {
    const response = await apiService.get('/administrateur/recommandations/stats');
    return response.data;
  },

  /**
   * Supprime une recommandation
   */
  deleteRecommendation: async (recommendationId) => {
    await apiService.delete(`/administrateur/recommandations/${recommendationId}`);
  },

  /**
   * Supprime toutes les recommandations d'un utilisateur
   */
  deleteUserRecommendations: async (userId) => {
    await apiService.delete(`/administrateur/recommandations/user/${userId}`);
  }
};

// ==================== FONCTIONS UTILITAIRES ====================

/**
 * Normalise les données utilisateur pour éviter les problèmes de format
 */
function normalizeUserData(data) {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch (Error) {
      throw new Error('Format de réponse invalide du serveur');
    }
  }

  if (Array.isArray(data)) {
    return data.map(cleanUserObject);
  } else if (data && typeof data === 'object') {
    if (Array.isArray(data.data)) return data.data.map(cleanUserObject);
    if (Array.isArray(data.users)) return data.users.map(cleanUserObject);
    return cleanUserObject(data);
  }

  return [];
}

/**
 * Nettoie un objet utilisateur en retirant les références circulaires
 */
function cleanUserObject(user) {
  return {
    id: user.id,
    nom: user.nom,
    prenom: user.prenom,
    email: user.email,
    role: user.role,
    preferenceAlimentaire: user.preferenceAlimentaire,
    recettesCount: user.recettes?.length || user.recettesCount || 0,
    dateCreation: user.dateCreation,
    dateModification: user.dateModification
  };
}

/**
 * Parse les données JSON si nécessaire
 */
function parseJsonIfNeeded(data) {
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch (Error) {
      console.error('Erreur de parsing JSON:', Error.message);
      return data;
    }
  }
  return data;
}