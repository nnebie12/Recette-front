import { apiService } from './api';

export const favoriteService = {
  // Get user favorites
  getUserFavorites: async (userId) => {
    const response = await apiService.get(`/favoris/${userId}`);
    // Sécurité : s'assure que data est un tableau
    return Array.isArray(response.data) ? response.data : [];
  },

  // Add recipe to favorites
  addFavorite: async (userId, recetteId) => {
    const response = await apiService.post(`/favoris/${userId}/${recetteId}`);
    return response.data;
  },

  // Remove recipe from favorites
  removeFavorite: async (userId, recetteId) => {
    await apiService.delete(`/favoris/${userId}/${recetteId}`);
  },

  // Check if recipe is favorite
  isFavorite: async (userId, recetteId, favorites = null) => {
    // Si des favoris sont passés en paramètre, on vérifie que c'est un tableau
    if (favorites && Array.isArray(favorites)) {
      return favorites.some(fav => fav.recetteEntity?.id === recetteId);
    }
    
    try {
      const userFavorites = await favoriteService.getUserFavorites(userId);
      
      // Sécurité supplémentaire ici aussi
      const favoritesArray = Array.isArray(userFavorites) ? userFavorites : [];
      return favoritesArray.some(fav => fav.recetteEntity?.id === recetteId);
    } catch (error) {
      console.error('Error checking favorite:', error);
      return false;
    }
  }
};