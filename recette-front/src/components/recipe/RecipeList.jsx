import Loading from '../common/Loading';
import RecipeCard from './RecipeCard';

const RecipeList = ({ 
  recipes, 
  loading, 
  favorites = [], 
  onToggleFavorite,
  emptyMessage = "Aucune recette trouvée",
  categories = [] 
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

  const isFavorite = (recipeId) => favorites.some(fav => fav.recetteEntity?.id === recipeId);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* CATEGORIES */}
      {categories.length > 0 && (
        <aside className="w-full lg:w-1/4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 sticky top-20">
            <h4 className="text-sm font-bold text-gray-600 uppercase mb-3">Catégories</h4>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => cat.onClick?.()}
                    className="w-full text-left text-gray-700 hover:text-orange-500 hover:bg-orange-50 transition-colors px-3 py-1 rounded-lg text-sm font-medium"
                  >
                    {cat.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      )}

      {/* RECIPES */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            isFavorite={isFavorite(recipe.id)}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </div>
  );
};

export default RecipeList;
