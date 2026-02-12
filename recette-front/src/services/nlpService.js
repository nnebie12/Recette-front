import { apiService } from './api';

export const nlpService = {

  semanticSearch: async (query) => {
    const res = await apiService.post(
      `/api/v1/nlp/search/semantic`,
      { query }
    );
    return res.data;
  },

  analyzeSentiment: async (text) => {
    const res = await apiService.post(
      `/api/v1/nlp/sentiment`,
      { text }
    );
    return res.data;
  },

  getRecipeSentiment: async (recipeId) => {
    const res = await apiService.get(
      `/api/v1/nlp/sentiment/recipe/${recipeId}`
    );
    return res.data;
  },

  getKeywords: async (recipeId) => {
    const res = await apiService.get(
      `/api/v1/nlp/keywords/${recipeId}`
    );
    return res.data;
  }
};
