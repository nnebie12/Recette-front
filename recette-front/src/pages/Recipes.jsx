import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { recipeService } from '../services/recipeService';
import { favoriteService } from '../services/favoriteService';
import RecipeList from '../components/recipe/RecipeList';
import RecipeFilter from '../components/recipe/RecipeFilter';
import { sortRecipes, filterRecipes } from '../utils/helpers';
import RecipeCreate from '../components/recipe/RecipeCreate';
import Button from '../components/common/Button';


const Recipes = () => {
  const { currentUser, loading: authLoading } = useContext(AuthContext);
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [showCreateModal, setShowCreateModal] = useState(false);


  useEffect(() => {
    loadRecipes();
    if (currentUser && currentUser.id) {
      loadFavorites();
    }
  }, [currentUser]);

  const loadRecipes = async () => {
    setLoading(true);
    try {
      const data = await recipeService.getAllRecipes();
      setRecipes(data);
      setFilteredRecipes(data);
    } catch (error) {
      console.error('Error loading recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecipeCreate = async (recipeData) => {
    if (!currentUser || !currentUser.id) {
      console.error("User not authenticated for creation.");
      return;
    }
    setLoading(true);
    try {
      await recipeService.createRecipe(currentUser.id, recipeData); 

      await loadRecipes(); 
      
      setShowCreateModal(false);

    } catch (error) {
      console.error('Error creating recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const data = await favoriteService.getUserFavorites(currentUser.id);
      setFavorites(data);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    applyFilters(recipes, newFilters);
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      applyFilters(recipes, filters);
      return;
    }

    const filtered = recipes.filter(recipe =>
      recipe.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    applyFilters(filtered, filters);
  };

  const applyFilters = (recipesToFilter, filterOptions) => {
    let filtered = filterRecipes(recipesToFilter, filterOptions);
    filtered = sortRecipes(filtered, filterOptions.sortBy);
    setFilteredRecipes(filtered);
  };

  const handleToggleFavorite = async (recipeId) => {
    if (!currentUser) return;

    try {
      const isFav = favorites.some(f => f.recetteEntity?.id === recipeId);
      
      if (isFav) {
        await favoriteService.removeFavorite(currentUser.id, recipeId);
      } else {
        await favoriteService.addFavorite(currentUser.id, recipeId);
      }
      
      await loadFavorites();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Toutes les recettes
          </h1>
          <p className="text-gray-600">
            {filteredRecipes.length} recette{filteredRecipes.length > 1 ? 's' : ''} disponible{filteredRecipes.length > 1 ? 's' : ''}
          </p>
        </div>

        <Button 
        onClick={() => setShowCreateModal(true)}
        disabled={authLoading}>
          + Nouvelle recette
        </Button>

        <RecipeCreate
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreated={handleRecipeCreate}
        />

        <div className="mb-8">
          <RecipeFilter onFilter={handleFilter} onSearch={handleSearch} />
        </div>

        <RecipeList
          recipes={filteredRecipes}
          loading={loading}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
        />
      </div>
    </div>
  );
};

export default Recipes;