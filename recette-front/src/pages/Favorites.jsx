import { useState, useEffect, useContext } from 'react';
import { Heart } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { favoriteService } from '../services/favoriteService';
import RecipeList from '../components/recipe/RecipeList';

const Favorites = () => {
  const { currentUser } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      loadFavorites();
    }
  }, [currentUser]);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const data = await favoriteService.getUserFavorites(currentUser.id);
      setFavorites(data);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (recipeId) => {
    try {
      await favoriteService.removeFavorite(currentUser.id, recipeId);
      await loadFavorites();
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const favoriteRecipes = favorites.map(fav => fav.recetteEntity).filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Heart className="w-8 h-8 text-red-500 fill-red-500" />
            <h1 className="text-3xl font-bold text-gray-900">
              Mes recettes favorites
            </h1>
          </div>
          <p className="text-gray-600">
            {favoriteRecipes.length} recette{favoriteRecipes.length > 1 ? 's' : ''} sauvegardée{favoriteRecipes.length > 1 ? 's' : ''}
          </p>
        </div>

        <RecipeList
          recipes={favoriteRecipes}
          loading={loading}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          emptyMessage="Vous n'avez pas encore de recettes favorites"
        />
      </div>
    </div>
  );
};

export default Favorites;