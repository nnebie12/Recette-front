import React, { useState } from 'react';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';

const RecipeFilter = ({ onFilter, onSearch }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    difficulty: '',
    maxTime: '',
    minRating: '',
    sortBy: 'date_desc'
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = {
      ...filters,
      [name]: value
    };
    setFilters(newFilters);
    if (onFilter) {
      onFilter(newFilters);
    }
  };

  const clearFilters = () => {
    const clearedFilters = {
      difficulty: '',
      maxTime: '',
      minRating: '',
      sortBy: 'date_desc'
    };
    setFilters(clearedFilters);
    setSearchTerm('');
    if (onFilter) {
      onFilter(clearedFilters);
    }
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="flex-1">
          <Input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Rechercher une recette..."
            icon={Search}
          />
        </div>
        <Button type="submit" variant="primary">
          Rechercher
        </Button>
        <Button
          type="button"
          variant="outline"
          icon={SlidersHorizontal}
          onClick={() => setShowFilters(!showFilters)}
        >
          Filtres
        </Button>
      </form>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filtres avancés
            </h3>
            <button
              onClick={clearFilters}
              className="text-sm text-orange-500 hover:text-orange-600 flex items-center"
            >
              <X className="w-4 h-4 mr-1" />
              Réinitialiser
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Difficulté
              </label>
              <select
                name="difficulty"
                value={filters.difficulty}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Toutes</option>
                <option value="FACILE">Facile</option>
                <option value="MOYEN">Moyen</option>
                <option value="DIFFICILE">Difficile</option>
              </select>
            </div>

            {/* Max Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Temps max (min)
              </label>
              <select
                name="maxTime"
                value={filters.maxTime}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Tous</option>
                <option value="15">15 min</option>
                <option value="30">30 min</option>
                <option value="60">1 heure</option>
                <option value="120">2 heures</option>
              </select>
            </div>

            {/* Min Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Note minimum
              </label>
              <select
                name="minRating"
                value={filters.minRating}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Toutes</option>
                <option value="4">4+ étoiles</option>
                <option value="3">3+ étoiles</option>
                <option value="2">2+ étoiles</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trier par
              </label>
              <select
                name="sortBy"
                value={filters.sortBy}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="date_desc">Plus récentes</option>
                <option value="date_asc">Plus anciennes</option>
                <option value="rating_desc">Mieux notées</option>
                <option value="time_asc">Temps croissant</option>
                <option value="time_desc">Temps décroissant</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeFilter;