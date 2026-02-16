// utils/storage.js

export class StorageManager {
  async get(key) {
    const result = await chrome.storage.local.get([key]);
    return result[key] || null;
  }

  async set(key, value) {
    await chrome.storage.local.set({ [key]: value });
  }

  async remove(key) {
    await chrome.storage.local.remove(key);
  }

  async clear() {
    await chrome.storage.local.clear();
  }

  // User methods
  async getCurrentUser() {
    return this.get('currentUser');
  }

  async setCurrentUser(user) {
    await this.set('currentUser', user);
  }

  // Shopping list methods
  async getShoppingList(userId) {
    const key = `shopping_list_${userId}`;
    return this.get(key) || [];
  }

  async setShoppingList(list, userId) {
    const key = `shopping_list_${userId}`;
    await this.set(key, list);
  }

  // Saved recipes methods
  async getSavedRecipes(userId) {
    const key = `saved_recipes_${userId}`;
    return this.get(key) || [];
  }

  async saveRecipe(recipe, userId) {
    const recipes = await this.getSavedRecipes(userId);
    recipes.push({
      ...recipe,
      savedAt: new Date().toISOString()
    });
    await this.set(`saved_recipes_${userId}`, recipes);
  }

  // Cache methods
  async cacheRecommendations(userId, recommendations, ttl = 600000) {
    await this.set(`recommendations_${userId}`, {
      data: recommendations,
      cachedAt: Date.now(),
      ttl
    });
  }

  async getCachedRecommendations(userId) {
    const cached = await this.get(`recommendations_${userId}`);
    
    if (!cached) return null;
    
    const age = Date.now() - cached.cachedAt;
    if (age > cached.ttl) {
      await this.remove(`recommendations_${userId}`);
      return null;
    }
    
    return cached.data;
  }

  // Cleanup old data
  async cleanupOldData() {
    const ALL_KEYS = await chrome.storage.local.get(null);
    const now = Date.now();
    const MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

    for (const [key, value] of Object.entries(ALL_KEYS)) {
      if (value.cachedAt && (now - value.cachedAt) > MAX_AGE) {
        await this.remove(key);
      }
    }
  }
}

export default new StorageManager();