import { apiService } from './api';

export const favoriteService = {
  // Get user favorites
  getUserFavorites: async (userId) => {
    const response = await apiService.get(`/favoris/${userId}`);
    return response.data;
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
    if (favorites) {
      return favorites.some(fav => fav.recetteEntity?.id === recetteId);
    }
    
    try {
      const userFavorites = await favoriteService.getUserFavorites(userId);
      return userFavorites.some(fav => fav.recetteEntity?.id === recetteId);
    } catch (error) {
    console.error('Error checking favorite:', error);
    return false;
  }
  }
};