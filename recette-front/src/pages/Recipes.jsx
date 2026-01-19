import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, ChefHat, Filter, X, Clock, Users, Star } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { recipeService } from '../services/recipeService';
import { favoriteService } from '../services/favoriteService';
import { searchHistoryService } from '../services/searchHistoryService';
import RecipeList from '../components/recipe/RecipeList';
import RecipeCreate from '../components/recipe/RecipeCreate';
import Button from '../components/common/Button';

const CATEGORIES = {
  cuisine: [
    { value: 'francaise', label: 'Française', icon: '🇫🇷' },
    { value: 'italienne', label: 'Italienne', icon: '🇮🇹' },
    { value: 'japonaise', label: 'Japonaise', icon: '🇯🇵' },
    { value: 'mexicaine', label: 'Mexicaine', icon: '🇲🇽' },
    { value: 'thailandaise', label: 'Thaïlandaise', icon: '🇹🇭' },
    { value: 'americaine', label: 'Américaine', icon: '🇺🇸' }
  ],
  type: [
    { value: 'entree', label: 'Entrées', icon: '🥗' },
    { value: 'plat', label: 'Plats', icon: '🍽️' },
    { value: 'dessert', label: 'Desserts', icon: '🍰' }
  ],
  difficulty: [
    { value: 'FACILE', label: 'Facile', color: 'bg-green-100 text-green-800' },
    { value: 'MOYEN', label: 'Moyen', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'DIFFICILE', label: 'Difficile', color: 'bg-red-100 text-red-800' }
  ]
};

const Recipes = () => {
  const { currentUser, loading: authLoading } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState(searchParams.get('cuisine') || '');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || '');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [isVegetarian, setIsVegetarian] = useState(searchParams.get('diet') === 'vegetarien');
  const [maxTime, setMaxTime] = useState('');
  const [sortBy, setSortBy] = useState('date_desc');

  useEffect(() => {
    loadRecipes();
    if (currentUser && currentUser.id) {
      loadFavorites();
    }
  }, [currentUser]);

  useEffect(() => {
    applyFilters();
  }, [recipes, searchTerm, selectedCuisine, selectedType, selectedDifficulty, isVegetarian, maxTime, sortBy]);

  useEffect(() => {
    // Mettre à jour les filtres quand l'URL change
    setSelectedCuisine(searchParams.get('cuisine') || '');
    setSelectedType(searchParams.get('type') || '');
    setIsVegetarian(searchParams.get('diet') === 'vegetarien');
  }, [searchParams]);

  const loadRecipes = async () => {
    setLoading(true);
    try {
      const data = await recipeService.getAllRecipes();
      setRecipes(data);
    } catch (error) {
      console.error('Error loading recipes:', error);
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

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    
    // Enregistrer la recherche dans l'historique
    if (currentUser && searchTerm && searchTerm.trim()) {
      try {
        await searchHistoryService.recordSearch(currentUser.id, searchTerm, []);
        console.log('Recherche enregistrée:', searchTerm);
      } catch (error) {
        console.error('Erreur enregistrement recherche:', error);
      }
    }
  };

  const applyFilters = () => {
    let filtered = [...recipes];

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(recipe =>
        recipe.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par cuisine
    if (selectedCuisine) {
      filtered = filtered.filter(r => 
        r.cuisine?.toLowerCase() === selectedCuisine.toLowerCase()
      );
    }

    // Filtre par type
    if (selectedType) {
      filtered = filtered.filter(r => 
        r.typeRecette?.toLowerCase() === selectedType.toLowerCase()
      );
    }

    // Filtre par difficulté
    if (selectedDifficulty) {
      filtered = filtered.filter(r => r.difficulte === selectedDifficulty);
    }

    // Filtre végétarien
    if (isVegetarian) {
      filtered = filtered.filter(r => r.vegetarien === true);
    }

    // Filtre par temps
    if (maxTime) {
      const maxMinutes = parseInt(maxTime);
      filtered = filtered.filter(r => 
        (r.tempsPreparation || 0) + (r.tempsCuisson || 0) <= maxMinutes
      );
    }

    // Tri
    filtered = sortRecipes(filtered, sortBy);

    setFilteredRecipes(filtered);
  };

  const sortRecipes = (recipesToSort, sortOption) => {
    const sorted = [...recipesToSort];
    
    switch (sortOption) {
      case 'date_desc':
        return sorted.sort((a, b) => new Date(b.dateCreation) - new Date(a.dateCreation));
      case 'date_asc':
        return sorted.sort((a, b) => new Date(a.dateCreation) - new Date(b.dateCreation));
      case 'time_asc':
        return sorted.sort((a, b) => 
          ((a.tempsPreparation || 0) + (a.tempsCuisson || 0)) - 
          ((b.tempsPreparation || 0) + (b.tempsCuisson || 0))
        );
      case 'time_desc':
        return sorted.sort((a, b) => 
          ((b.tempsPreparation || 0) + (b.tempsCuisson || 0)) - 
          ((a.tempsPreparation || 0) + (a.tempsCuisson || 0))
        );
      default:
        return sorted;
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCuisine('');
    setSelectedType('');
    setSelectedDifficulty('');
    setIsVegetarian(false);
    setMaxTime('');
    setSortBy('date_desc');
    setSearchParams({});
  };

  const hasActiveFilters = searchTerm || selectedCuisine || selectedType || selectedDifficulty || isVegetarian || maxTime;

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

  const getPageTitle = () => {
    if (selectedCuisine) {
      const cuisine = CATEGORIES.cuisine.find(c => c.value === selectedCuisine);
      return `Cuisine ${cuisine?.label}`;
    }
    if (selectedType) {
      const type = CATEGORIES.type.find(t => t.value === selectedType);
      return type?.label;
    }
    if (isVegetarian) return 'Recettes végétariennes';
    return 'Toutes les recettes';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <ChefHat className="w-12 h-12 text-orange-600 mr-3" />
            <h1 className="text-5xl font-bold text-gray-900">
              {getPageTitle()}
            </h1>
          </div>
          <p className="text-xl text-gray-600">
            {filteredRecipes.length} recette{filteredRecipes.length > 1 ? 's' : ''} disponible{filteredRecipes.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Bouton Nouvelle Recette */}
        <div className="mb-6 flex justify-center">
          <Button 
            onClick={() => setShowCreateModal(true)}
            disabled={authLoading}
            variant="primary"
          >
            + Nouvelle recette
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher une recette..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              Rechercher
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center font-medium"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filtres
            </button>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="px-6 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center font-medium"
              >
                <X className="w-5 h-5 mr-2" />
                Réinitialiser
              </button>
            )}
          </form>

          {/* Panneau de filtres avancés */}
          {showFilters && (
            <div className="border-t border-gray-200 pt-6 space-y-6">
              {/* Cuisine */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  🌍 Cuisine
                </h3>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {CATEGORIES.cuisine.map(cuisine => (
                    <button
                      key={cuisine.value}
                      onClick={() => setSelectedCuisine(selectedCuisine === cuisine.value ? '' : cuisine.value)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedCuisine === cuisine.value
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <span className="text-xl mr-2">{cuisine.icon}</span>
                      <span className="font-medium text-sm">{cuisine.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Type de plat */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  🍽️ Type de plat
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {CATEGORIES.type.map(type => (
                    <button
                      key={type.value}
                      onClick={() => setSelectedType(selectedType === type.value ? '' : type.value)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedType === type.value
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <span className="text-2xl mr-2">{type.icon}</span>
                      <span className="font-medium">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulté */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  📊 Difficulté
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {CATEGORIES.difficulty.map(diff => (
                    <button
                      key={diff.value}
                      onClick={() => setSelectedDifficulty(selectedDifficulty === diff.value ? '' : diff.value)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedDifficulty === diff.value
                          ? `border-orange-500 ${diff.color}`
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <span className="font-medium">{diff.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Temps max et Végétarien */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-900 mb-2">
                    ⏱️ Temps maximum
                  </label>
                  <select
                    value={maxTime}
                    onChange={(e) => setMaxTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Peu importe</option>
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 heure</option>
                    <option value="120">2 heures</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-900 mb-2">
                    📋 Trier par
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="date_desc">Plus récentes</option>
                    <option value="date_asc">Plus anciennes</option>
                    <option value="time_asc">Temps croissant</option>
                    <option value="time_desc">Temps décroissant</option>
                  </select>
                </div>
              </div>

              {/* Végétarien */}
              <div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isVegetarian}
                    onChange={(e) => setIsVegetarian(e.target.checked)}
                    className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="ml-3 text-lg font-medium text-gray-900">
                    🌱 Recettes végétariennes uniquement
                  </span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Liste des recettes */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des recettes...</p>
          </div>
        ) : filteredRecipes.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Aucune recette trouvée
            </h3>
            <p className="text-gray-600">
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        ) : (
          <RecipeList
            recipes={filteredRecipes}
            loading={loading}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {/* Modal de création */}
        <RecipeCreate
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreated={handleRecipeCreate}
        />
      </div>
    </div>
  );
};

export default Recipes;