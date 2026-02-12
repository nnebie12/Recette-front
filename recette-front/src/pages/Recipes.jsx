import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, ChefHat, Filter, X } from 'lucide-react';
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
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState(searchParams.get('cuisine') || '');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || '');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [isVegetarian, setIsVegetarian] = useState(searchParams.get('diet') === 'vegetarien');
  const [maxTime, setMaxTime] = useState('');
  const [sortBy, setSortBy] = useState('date_desc');

  useEffect(() => {
    loadRecipes();
    if (currentUser && currentUser.id) loadFavorites();
  }, [currentUser]);

  useEffect(() => applyFilters(), [recipes, searchTerm, selectedCuisine, selectedType, selectedDifficulty, isVegetarian, maxTime, sortBy]);

  useEffect(() => {
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
      console.error(error);
    } finally { setLoading(false); }
  };

  const loadFavorites = async () => {
    try {
      const data = await favoriteService.getUserFavorites(currentUser.id);
      setFavorites(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (currentUser && searchTerm?.trim()) {
      try { await searchHistoryService.recordSearch(currentUser.id, searchTerm, []); } 
      catch (error) { console.error(error); }
    }
  };

  const applyFilters = () => {
    let filtered = [...recipes];
    if (searchTerm) filtered = filtered.filter(r => r.titre?.toLowerCase().includes(searchTerm.toLowerCase()) || r.description?.toLowerCase().includes(searchTerm.toLowerCase()));
    if (selectedCuisine) filtered = filtered.filter(r => r.cuisine?.toLowerCase() === selectedCuisine.toLowerCase());
    if (selectedType) filtered = filtered.filter(r => r.typeRecette?.toLowerCase() === selectedType.toLowerCase());
    if (selectedDifficulty) filtered = filtered.filter(r => r.difficulte === selectedDifficulty);
    if (isVegetarian) filtered = filtered.filter(r => r.vegetarien === true);
    if (maxTime) {
      const maxMinutes = parseInt(maxTime);
      filtered = filtered.filter(r => (r.tempsPreparation || 0) + (r.tempsCuisson || 0) <= maxMinutes);
    }
    setFilteredRecipes(sortRecipes(filtered, sortBy));
  };

  const sortRecipes = (recipesToSort, sortOption) => {
    const sorted = [...recipesToSort];
    switch (sortOption) {
      case 'date_desc': return sorted.sort((a, b) => new Date(b.dateCreation) - new Date(a.dateCreation));
      case 'date_asc': return sorted.sort((a, b) => new Date(a.dateCreation) - new Date(b.dateCreation));
      case 'time_asc': return sorted.sort((a, b) => ((a.tempsPreparation||0)+(a.tempsCuisson||0)) - ((b.tempsPreparation||0)+(b.tempsCuisson||0)));
      case 'time_desc': return sorted.sort((a, b) => ((b.tempsPreparation||0)+(b.tempsCuisson||0)) - ((a.tempsPreparation||0)+(a.tempsCuisson||0)));
      default: return sorted;
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

  const handleRecipeCreate = async (recipeData) => {
    if (!currentUser?.id) return;
    setLoading(true);
    try { await recipeService.createRecipe(currentUser.id, recipeData); await loadRecipes(); setShowCreateModal(false); }
    catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  const handleToggleFavorite = async (recipeId) => {
    if (!currentUser) return;
    try {
      const isFav = favorites.some(f => f.recetteEntity?.id === recipeId);
      if (isFav) await favoriteService.removeFavorite(currentUser.id, recipeId);
      else await favoriteService.addFavorite(currentUser.id, recipeId);
      await loadFavorites();
    } catch (error) { console.error(error); }
  };

  const getPageTitle = () => {
    if (selectedCuisine) return `Cuisine ${CATEGORIES.cuisine.find(c => c.value === selectedCuisine)?.label}`;
    if (selectedType) return CATEGORIES.type.find(t => t.value === selectedType)?.label;
    if (isVegetarian) return 'Recettes végétariennes';
    return 'Toutes les recettes';
  };

  const hasActiveFilters = searchTerm || selectedCuisine || selectedType || selectedDifficulty || isVegetarian || maxTime;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <ChefHat className="w-12 h-12 text-orange-600 mr-3" />
            <h1 className="text-5xl font-bold text-gray-900">{getPageTitle()}</h1>
          </div>
          <p className="text-xl text-gray-600">
            {filteredRecipes.length} recette{filteredRecipes.length > 1 ? 's' : ''} disponible{filteredRecipes.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Bouton Nouvelle Recette */}
        <div className="mb-6 flex justify-center">
          <Button onClick={() => setShowCreateModal(true)} disabled={authLoading} variant="primary">
            + Nouvelle recette
          </Button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input type="text" placeholder="Rechercher une recette..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <button type="submit" className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium">Rechercher</button>
            <button type="button" onClick={() => setShowFilters(!showFilters)} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center font-medium">
              <Filter className="w-5 h-5 mr-2" /> Filtres
            </button>
            {hasActiveFilters && <button type="button" onClick={clearFilters} className="px-6 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center font-medium"><X className="w-5 h-5 mr-2" />Réinitialiser</button>}
          </form>
        </div>

        {/* Layout filtres + liste */}
        <div className="flex flex-col lg:flex-row gap-6">
          {showFilters && (
            <aside className="w-full lg:w-1/4">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 sticky top-20">
                <h4 className="text-sm font-bold text-gray-600 uppercase mb-3">Filtres</h4>

                {/* Cuisine */}
                <div className="mb-4">
                  <h5 className="font-semibold text-gray-900 mb-2 flex items-center">🌍 Cuisine</h5>
                  <div className="grid grid-cols-3 md:grid-cols-2 gap-2">
                    {CATEGORIES.cuisine.map(c => (
                      <button key={c.value} onClick={() => setSelectedCuisine(selectedCuisine === c.value ? '' : c.value)} className={`p-2 rounded-lg border-2 transition-all text-sm font-medium ${selectedCuisine === c.value ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 hover:border-orange-300'}`}>
                        <span className="mr-2">{c.icon}</span>{c.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Type */}
                <div className="mb-4">
                  <h5 className="font-semibold text-gray-900 mb-2 flex items-center">🍽️ Type</h5>
                  <div className="grid grid-cols-3 gap-2">
                    {CATEGORIES.type.map(t => (
                      <button key={t.value} onClick={() => setSelectedType(selectedType === t.value ? '' : t.value)} className={`p-2 rounded-lg border-2 transition-all text-sm font-medium ${selectedType === t.value ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 hover:border-purple-300'}`}>
                        <span className="mr-2">{t.icon}</span>{t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Difficulté */}
                <div className="mb-4">
                  <h5 className="font-semibold text-gray-900 mb-2 flex items-center">📊 Difficulté</h5>
                  <div className="grid grid-cols-3 gap-2">
                    {CATEGORIES.difficulty.map(d => (
                      <button key={d.value} onClick={() => setSelectedDifficulty(selectedDifficulty === d.value ? '' : d.value)} className={`p-2 rounded-lg border-2 transition-all text-sm font-medium ${selectedDifficulty === d.value ? `border-orange-500 ${d.color}` : 'border-gray-200 hover:border-orange-300'}`}>
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          )}

          {/* Liste des recettes */}
          <div className="flex-1">
            <RecipeList recipes={filteredRecipes} loading={loading} favorites={favorites} onToggleFavorite={handleToggleFavorite} />
          </div>
        </div>

        {/* Modal de création */}
        <RecipeCreate isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} onCreated={handleRecipeCreate} />
      </div>
    </div>
  );
};

export default Recipes;
