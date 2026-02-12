import React, { useState, useMemo } from 'react';
import { Search, ChefHat, Globe, Leaf, Clock, Star, Users, Filter, X } from 'lucide-react';

// Données de recettes pré-remplies
const RECIPES_DATA = [
  {
    id: 1,
    titre: "Ratatouille Provençale",
    description: "Un classique de la cuisine française avec des légumes du soleil mijotés à la perfection",
    type: "PLAT",
    cuisine: "FRANCAISE",
    regime: "VEGETARIEN",
    difficulte: "MOYEN",
    tempsPreparation: 30,
    tempsCuisson: 45,
    portions: 4,
    image: "https://images.unsplash.com/photo-1572453800999-e8d2d1589b7c?w=800&q=80",
    ingredients: [
      "2 aubergines",
      "3 courgettes",
      "4 tomates",
      "2 poivrons rouges",
      "1 oignon",
      "4 gousses d'ail",
      "Huile d'olive",
      "Herbes de Provence"
    ],
    etapes: [
      "Couper tous les légumes en dés",
      "Faire revenir l'oignon et l'ail",
      "Ajouter les légumes progressivement",
      "Laisser mijoter 45 minutes"
    ],
    moyenneNotes: 4.8,
    nombreNotes: 156
  },
  {
    id: 2,
    titre: "Sushi Maki Classique",
    description: "Rouleaux de sushi traditionnels au saumon et avocat",
    type: "ENTREE",
    cuisine: "JAPONAISE",
    regime: "POISSON",
    difficulte: "DIFFICILE",
    tempsPreparation: 45,
    tempsCuisson: 20,
    portions: 2,
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&q=80",
    ingredients: [
      "200g riz à sushi",
      "4 feuilles nori",
      "200g saumon frais",
      "1 avocat",
      "Vinaigre de riz",
      "Sauce soja",
      "Wasabi",
      "Gingembre mariné"
    ],
    etapes: [
      "Cuire et assaisonner le riz",
      "Préparer les garnitures",
      "Étaler le riz sur le nori",
      "Rouler et couper"
    ],
    moyenneNotes: 4.9,
    nombreNotes: 203
  },
  {
    id: 3,
    titre: "Tiramisu Italien",
    description: "Le dessert italien par excellence, crémeux et savoureux",
    type: "DESSERT",
    cuisine: "ITALIENNE",
    regime: "VEGETARIEN",
    difficulte: "FACILE",
    tempsPreparation: 30,
    tempsCuisson: 0,
    portions: 6,
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80",
    ingredients: [
      "500g mascarpone",
      "6 œufs",
      "100g sucre",
      "300ml café fort",
      "30 biscuits à la cuillère",
      "Cacao en poudre",
      "Amaretto (optionnel)"
    ],
    etapes: [
      "Séparer les blancs des jaunes",
      "Mélanger mascarpone et jaunes",
      "Monter les blancs en neige",
      "Tremper les biscuits et monter"
    ],
    moyenneNotes: 4.7,
    nombreNotes: 189
  },
  {
    id: 4,
    titre: "Tacos al Pastor",
    description: "Tacos mexicains authentiques avec viande marinée aux épices",
    type: "PLAT",
    cuisine: "MEXICAINE",
    regime: "VIANDE",
    difficulte: "MOYEN",
    tempsPreparation: 20,
    tempsCuisson: 15,
    portions: 4,
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80",
    ingredients: [
      "500g porc",
      "Ananas frais",
      "Tortillas de maïs",
      "Coriandre fraîche",
      "Oignon",
      "Citron vert",
      "Épices mexicaines",
      "Piments"
    ],
    etapes: [
      "Mariner la viande",
      "Griller avec l'ananas",
      "Chauffer les tortillas",
      "Assembler et garnir"
    ],
    moyenneNotes: 4.6,
    nombreNotes: 142
  },
  {
    id: 5,
    titre: "Pad Thai",
    description: "Nouilles sautées thaïlandaises avec crevettes et cacahuètes",
    type: "PLAT",
    cuisine: "THAILANDAISE",
    regime: "FRUITS_DE_MER",
    difficulte: "MOYEN",
    tempsPreparation: 25,
    tempsCuisson: 10,
    portions: 2,
    image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800&q=80",
    ingredients: [
      "200g nouilles de riz",
      "200g crevettes",
      "2 œufs",
      "Germes de soja",
      "Cacahuètes",
      "Sauce Pad Thai",
      "Citron vert",
      "Coriandre"
    ],
    etapes: [
      "Faire tremper les nouilles",
      "Sauter les crevettes",
      "Ajouter les nouilles et sauce",
      "Garnir et servir"
    ],
    moyenneNotes: 4.5,
    nombreNotes: 178
  },
  {
    id: 6,
    titre: "Salade César",
    description: "Grande salade classique avec poulet grillé et parmesan",
    type: "ENTREE",
    cuisine: "AMERICAINE",
    regime: "VIANDE",
    difficulte: "FACILE",
    tempsPreparation: 20,
    tempsCuisson: 15,
    portions: 2,
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&q=80",
    ingredients: [
      "Laitue romaine",
      "Poulet grillé",
      "Parmesan",
      "Croûtons",
      "Sauce César",
      "Anchois",
      "Ail",
      "Citron"
    ],
    etapes: [
      "Griller le poulet",
      "Préparer la sauce",
      "Laver et couper la salade",
      "Assembler et mélanger"
    ],
    moyenneNotes: 4.4,
    nombreNotes: 234
  },
  {
    id: 7,
    titre: "Mousse au Chocolat",
    description: "Dessert léger et aérien au chocolat noir intense",
    type: "DESSERT",
    cuisine: "FRANCAISE",
    regime: "VEGETARIEN",
    difficulte: "FACILE",
    tempsPreparation: 20,
    tempsCuisson: 5,
    portions: 4,
    image: "https://images.unsplash.com/photo-1541599468348-e96984315921?w=800&q=80",
    ingredients: [
      "200g chocolat noir",
      "4 œufs",
      "30g sucre",
      "1 pincée de sel",
      "Crème fouettée (optionnel)"
    ],
    etapes: [
      "Faire fondre le chocolat",
      "Séparer blancs et jaunes",
      "Monter les blancs en neige",
      "Incorporer délicatement"
    ],
    moyenneNotes: 4.9,
    nombreNotes: 267
  },
  {
    id: 8,
    titre: "Buddha Bowl Végétarien",
    description: "Bowl complet et équilibré avec quinoa et légumes rôtis",
    type: "PLAT",
    cuisine: "MODERNE",
    regime: "VEGETARIEN",
    difficulte: "FACILE",
    tempsPreparation: 15,
    tempsCuisson: 30,
    portions: 2,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
    ingredients: [
      "Quinoa",
      "Patate douce",
      "Pois chiches",
      "Avocat",
      "Chou kale",
      "Graines de sésame",
      "Sauce tahini",
      "Citron"
    ],
    etapes: [
      "Cuire le quinoa",
      "Rôtir les légumes",
      "Préparer la sauce",
      "Assembler le bowl"
    ],
    moyenneNotes: 4.7,
    nombreNotes: 198
  }
];

const CATEGORIES = {
  type: [
    { value: 'ENTREE', label: 'Entrées', icon: '🥗' },
    { value: 'PLAT', label: 'Plats', icon: '🍽️' },
    { value: 'DESSERT', label: 'Desserts', icon: '🍰' }
  ],
  cuisine: [
    { value: 'FRANCAISE', label: 'Française', icon: '🇫🇷' },
    { value: 'ITALIENNE', label: 'Italienne', icon: '🇮🇹' },
    { value: 'JAPONAISE', label: 'Japonaise', icon: '🇯🇵' },
    { value: 'MEXICAINE', label: 'Mexicaine', icon: '🇲🇽' },
    { value: 'THAILANDAISE', label: 'Thaïlandaise', icon: '🇹🇭' },
    { value: 'AMERICAINE', label: 'Américaine', icon: '🇺🇸' },
    { value: 'MODERNE', label: 'Moderne', icon: '✨' }
  ],
  regime: [
    { value: 'VEGETARIEN', label: 'Végétarien', icon: '🥬' },
    { value: 'VIANDE', label: 'Viande', icon: '🥩' },
    { value: 'POISSON', label: 'Poisson', icon: '🐟' },
    { value: 'FRUITS_DE_MER', label: 'Fruits de mer', icon: '🦐' }
  ]
};

const RecipeCatalog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [selectedRegime, setSelectedRegime] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const filteredRecipes = useMemo(() => {
    return RECIPES_DATA.filter(recipe => {
      const matchSearch = recipe.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchType = !selectedType || recipe.type === selectedType;
      const matchCuisine = !selectedCuisine || recipe.cuisine === selectedCuisine;
      const matchRegime = !selectedRegime || recipe.regime === selectedRegime;
      
      return matchSearch && matchType && matchCuisine && matchRegime;
    });
  }, [searchTerm, selectedType, selectedCuisine, selectedRegime]);

  const clearFilters = () => {
    setSelectedType('');
    setSelectedCuisine('');
    setSelectedRegime('');
    setSearchTerm('');
  };

  const hasActiveFilters = selectedType || selectedCuisine || selectedRegime || searchTerm;

  const getDifficultyColor = (difficulty) => {
    const colors = {
      FACILE: 'bg-green-100 text-green-800',
      MOYEN: 'bg-yellow-100 text-yellow-800',
      DIFFICILE: 'bg-red-100 text-red-800'
    };
    return colors[difficulty] || colors.MOYEN;
  };

  if (selectedRecipe) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setSelectedRecipe(null)}
            className="mb-6 flex items-center text-orange-600 hover:text-orange-700 font-medium"
          >
            ← Retour à la liste
          </button>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <img
              src={selectedRecipe.image}
              alt={selectedRecipe.titre}
              className="w-full h-96 object-cover"
            />
            
            <div className="p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {selectedRecipe.titre}
                  </h1>
                  <p className="text-gray-600 text-lg">{selectedRecipe.description}</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getDifficultyColor(selectedRecipe.difficulte)}`}>
                  {selectedRecipe.difficulte}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-4 my-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <Clock className="w-6 h-6 mx-auto text-orange-500 mb-1" />
                  <p className="text-sm text-gray-600">Préparation</p>
                  <p className="font-bold">{selectedRecipe.tempsPreparation} min</p>
                </div>
                <div className="text-center">
                  <ChefHat className="w-6 h-6 mx-auto text-orange-500 mb-1" />
                  <p className="text-sm text-gray-600">Cuisson</p>
                  <p className="font-bold">{selectedRecipe.tempsCuisson} min</p>
                </div>
                <div className="text-center">
                  <Users className="w-6 h-6 mx-auto text-orange-500 mb-1" />
                  <p className="text-sm text-gray-600">Portions</p>
                  <p className="font-bold">{selectedRecipe.portions}</p>
                </div>
                <div className="text-center">
                  <Star className="w-6 h-6 mx-auto text-yellow-500 mb-1" />
                  <p className="text-sm text-gray-600">Note</p>
                  <p className="font-bold">{selectedRecipe.moyenneNotes}/5</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mt-8">
                <div>
                  <h2 className="text-2xl font-bold mb-4 flex items-center">
                    <span className="mr-2">📝</span> Ingrédients
                  </h2>
                  <ul className="space-y-2">
                    {selectedRecipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4 flex items-center">
                    <span className="mr-2">👨‍🍳</span> Étapes
                  </h2>
                  <ol className="space-y-3">
                    {selectedRecipe.etapes.map((etape, index) => (
                      <li key={index} className="flex">
                        <span className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold mr-3">
                          {index + 1}
                        </span>
                        <span className="pt-1">{etape}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {CATEGORIES.type.find(t => t.value === selectedRecipe.type)?.label}
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                  {CATEGORIES.cuisine.find(c => c.value === selectedRecipe.cuisine)?.label}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {CATEGORIES.regime.find(r => r.value === selectedRecipe.regime)?.label}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <ChefHat className="w-12 h-12 text-orange-600 mr-3" />
            <h1 className="text-5xl font-bold text-gray-900">
              Catalogue de Recettes
            </h1>
          </div>
          <p className="text-xl text-gray-600">
            {filteredRecipes.length} recette{filteredRecipes.length > 1 ? 's' : ''} disponible{filteredRecipes.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
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
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center font-medium"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filtres
            </button>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center font-medium"
              >
                <X className="w-5 h-5 mr-2" />
                Réinitialiser
              </button>
            )}
          </div>

          {showFilters && (
            <div className="border-t border-gray-200 pt-6 space-y-6">
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
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <span className="text-2xl mr-2">{type.icon}</span>
                      <span className="font-medium">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cuisine */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  Cuisine
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  {CATEGORIES.cuisine.map(cuisine => (
                    <button
                      key={cuisine.value}
                      onClick={() => setSelectedCuisine(selectedCuisine === cuisine.value ? '' : cuisine.value)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedCuisine === cuisine.value
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <span className="text-xl mr-2">{cuisine.icon}</span>
                      <span className="font-medium text-sm">{cuisine.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Régime */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Leaf className="w-5 h-5 mr-2" />
                  Régime alimentaire
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  {CATEGORIES.regime.map(regime => (
                    <button
                      key={regime.value}
                      onClick={() => setSelectedRegime(selectedRegime === regime.value ? '' : regime.value)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedRegime === regime.value
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <span className="text-xl mr-2">{regime.icon}</span>
                      <span className="font-medium text-sm">{regime.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recipe Grid */}
        {filteredRecipes.length === 0 ? (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRecipes.map(recipe => (
              <div
                key={recipe.id}
                onClick={() => setSelectedRecipe(recipe)}
                className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all hover:scale-105 hover:shadow-2xl"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={recipe.image}
                    alt={recipe.titre}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 flex items-center bg-white px-2 py-1 rounded-full shadow-md">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="font-bold text-sm">{recipe.moyenneNotes}</span>
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getDifficultyColor(recipe.difficulte)}`}>
                      {recipe.difficulte}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
                    {recipe.titre}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {recipe.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{recipe.tempsPreparation + recipe.tempsCuisson} min</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{recipe.portions} pers.</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                      {CATEGORIES.type.find(t => t.value === recipe.type)?.icon}
                    </span>
                    <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs">
                      {CATEGORIES.cuisine.find(c => c.value === recipe.cuisine)?.icon}
                    </span>
                    <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs">
                      {CATEGORIES.regime.find(r => r.value === recipe.regime)?.icon}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeCatalog;