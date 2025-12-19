import { apiService } from './api';

export const recipeService = {
  uploadRecipeImage: async (recipeId, file) => {
    const formData = new FormData();
    formData.append('file', file); 

    const response = await apiService.post(
      `/v1/recettes/${recipeId}/upload-image`, 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  // Get all recipes
  getAllRecipes: async () => {
    const response = await apiService.get('/v1/recettes/all');
    return response.data;
  },

  // Get recipe by ID
  getRecipeById: async (id) => {
    const response = await apiService.get(`/v1/recettes/${id}`);
    return response.data;
  },

  // Get recipe details (with comments, notes, etc.)
  getRecipeDetails: async (id) => {
    const response = await apiService.get(`/v1/recettes/${id}/details`);
    return response.data;
  },

  // Get recipes by user
  getRecipesByUser: async (userId) => {
    const response = await apiService.get(`/v1/recettes/user/${userId}`);
    return response.data;
  },

  // Create recipe
  createRecipe: async (userId, recipeData) => {
    const response = await apiService.post(`/v1/recettes/user/${userId}`, recipeData);
    return response.data;
  },

  // Update recipe
  updateRecipe: async (id, recipeData) => {
    const response = await apiService.put(`/v1/recettes/${id}`, recipeData);
    return response.data;
  },

  // Delete recipe
  deleteRecipe: async (id) => {
    await apiService.delete(`/v1/recettes/${id}`);
  },

  // Get recipe ingredients
  getRecipeIngredients: async (recipeId) => {
    const response = await apiService.get(`/v1/recettes/${recipeId}/ingredients`);
    return response.data;
  },

  // Add ingredient to recipe
  addIngredientToRecipe: async (recipeId, ingredientId, quantite) => {
    await apiService.post(`/v1/recettes/${recipeId}/ingredients/${ingredientId}`, null, {
      params: { quantite }
    });
  },

  // Remove ingredient from recipe
  removeIngredientFromRecipe: async (recipeId, ingredientId) => {
    await apiService.delete(`/v1/recettes/${recipeId}/ingredients/${ingredientId}`);
  },

  // Get recipe comments
  getRecipeComments: async (recipeId) => {
    const response = await apiService.get(`/v1/recettes/${recipeId}/commentaires`);
    return response.data;
  },

  // Add comment to recipe
  addComment: async (recipeId, userId, commentData) => {
    const response = await apiService.post(
      `/v1/recettes/${recipeId}/commentaires/user/${userId}`, 
      commentData
    );
    return response.data;
  },

  // Get recipe notes/ratings
  getRecipeNotes: async (recipeId) => {
    const response = await apiService.get(`/v1/recettes/${recipeId}/notes`);
    return response.data;
  },

  // Get average rating
  getAverageRating: async (recipeId) => {
    const response = await apiService.get(`/v1/recettes/${recipeId}/moyenne-notes`);
    return response.data;
  },

  // Add note/rating to recipe
  addNote: async (recipeId, userId, noteData) => {
    const response = await apiService.post(
      `/v1/recettes/${recipeId}/notes/user/${userId}`, 
      noteData
    );
    return response.data;
  },

  // Record interaction with recipe
  recordInteraction: async (idUser, idRecette, typeInteraction, sessionId, additionalData = {}) => {
    const response = await apiService.post('/v1/recette-interactions/registrer-complete', 
      additionalData,
      {
        params: {
          idUser,
          idRecette,
          typeInteraction,
          sessionId,
          ...additionalData
        }
      }
    );
    return response.data;
  },

  // Get recipe statistics
  getRecipeStatistics: async (recipeId) => {
    const response = await apiService.get(`/v1/recette-interactions/statistiques/recette/${recipeId}/details`);
    return response.data;
  }
};