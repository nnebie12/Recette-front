import React from 'react';
import RecipeCard from './RecipeCard';
import Loading from '../common/Loading';

const RecipeList = ({ 
  recipes, 
  loading, 
  favorites = [], 
  onToggleFavorite,
  emptyMessage = "Aucune recette trouvée" 
}) => {
  if (loading) {
    return <Loading message="Chargement des recettes..." />;
  }

  if (!recipes || recipes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🍳</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          {emptyMessage}
        </h3>
        <p className="text-gray-500">
          Essayez de modifier vos critères de recherche
        </p>
      </div>
    );
  }

  const isFavorite = (recipeId) => {
    return favorites.some(fav => fav.recetteEntity?.id === recipeId);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          isFavorite={isFavorite(recipe.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
};

export default RecipeList;