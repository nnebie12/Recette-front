import { Check, ChefHat, ChevronDown, ChevronUp, Clock, ExternalLink, Star, Users } from 'lucide-react';
import { useState } from 'react';
import { apiService } from '../../services/api';
import Button from '../common/Button';

const RecommendationList = ({ recommendations, loading, onMarkAsUsed }) => {
  const [expandedIds, setExpandedIds] = useState([]);
  const [recipesDetails, setRecipesDetails] = useState({});
  const [loadingRecipes, setLoadingRecipes] = useState({});

  // Fonction pour extraire l'ID de la recette depuis le lien
  const extractRecipeId = (lien) => {
    if (!lien) return null;
    const match = lien.match(/\/recettes?\/(\d+)/i);
    return match ? match[1] : null;
  };

  // Charger les détails d'une recette
  const loadRecipeDetails = async (recipeId) => {
    if (recipesDetails[recipeId] || loadingRecipes[recipeId]) return;

    setLoadingRecipes(prev => ({ ...prev, [recipeId]: true }));
    
    try {
      const response = await apiService.get(`/recettes/${recipeId}`);
      setRecipesDetails(prev => ({ ...prev, [recipeId]: response.data }));
    } catch (error) {
      console.error('Erreur chargement recette:', error);
    } finally {
      setLoadingRecipes(prev => ({ ...prev, [recipeId]: false }));
    }
  };

  // Toggle expansion d'une recommandation
  const toggleExpand = (recommandationId, detail) => {
    const isExpanded = expandedIds.includes(recommandationId);
    
    if (!isExpanded) {
      const recipeId = extractRecipeId(detail.lien);
      if (recipeId) {
        loadRecipeDetails(recipeId);
      }
      setExpandedIds([...expandedIds, recommandationId]);
    } else {
      setExpandedIds(expandedIds.filter(id => id !== recommandationId));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Aucune recommandation disponible
        </h3>
        <p className="text-gray-500">
          Générez votre première recommandation pour commencer !
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {recommendations.map((recommendation) => (
        <div
          key={recommendation.id}
          className={`bg-white rounded-lg shadow-md overflow-hidden transition-all ${
            recommendation.estUtilise ? 'opacity-60' : ''
          }`}
        >
          {/* Header de la recommandation */}
          <div className="bg-gradient-to-r from-orange-50 to-pink-50 px-6 py-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full">
                  {recommendation.type}
                </span>
                <span className="text-sm text-gray-600">
                  Score: {recommendation.score?.toFixed(1) || 'N/A'}/100
                </span>
              </div>
              {recommendation.estUtilise && (
                <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                  <Check className="w-4 h-4" />
                  Utilisée
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600">
              Générée le {new Date(recommendation.dateRecommandation).toLocaleDateString('fr-FR')}
            </p>
          </div>

          {/* Liste des recettes recommandées */}
          <div className="p-6 space-y-4">
            {recommendation.recommandation?.map((detail, index) => {
              const recipeId = extractRecipeId(detail.lien);
              const isExpanded = expandedIds.includes(`${recommendation.id}-${index}`);
              const recipeDetails = recipeId ? recipesDetails[recipeId] : null;
              const isLoadingRecipe = recipeId ? loadingRecipes[recipeId] : false;

              return (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* En-tête de la recette */}
                  <div className="p-4 bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                          {detail.titre}
                        </h4>
                        <p className="text-gray-600 mb-3">{detail.description}</p>
                        
                        {/* Tags */}
                        {detail.tags && detail.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {detail.tags.map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Raison de la recommandation */}
                        {detail.raison && (
                          <p className="text-sm text-gray-500 italic">
                            💡 {detail.raison}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 ml-4">
                        <a
                          href={detail.lien}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-500 hover:text-orange-600"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                        {recipeId && (
                          <button
                            onClick={() => toggleExpand(`${recommendation.id}-${index}`, detail)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5" />
                            ) : (
                              <ChevronDown className="w-5 h-5" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Détails de la recette (si expandée) */}
                  {isExpanded && recipeId && (
                    <div className="p-4 bg-white border-t border-gray-200">
                      {isLoadingRecipe ? (
                        <div className="flex justify-center py-4">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                        </div>
                      ) : recipeDetails ? (
                        <div className="space-y-4">
                          {/* Infos rapides */}
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            {recipeDetails.tempsPreparation && (
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {recipeDetails.tempsPreparation} min
                              </div>
                            )}
                            {recipeDetails.nombrePersonnes && (
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {recipeDetails.nombrePersonnes} pers.
                              </div>
                            )}
                            {recipeDetails.difficulte && (
                              <div className="flex items-center gap-1">
                                <ChefHat className="w-4 h-4" />
                                {recipeDetails.difficulte}
                              </div>
                            )}
                            {recipeDetails.noteGlobale && (
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-500" />
                                {recipeDetails.noteGlobale.toFixed(1)}
                              </div>
                            )}
                          </div>

                          {/* Ingrédients */}
                          {recipeDetails.ingredients && recipeDetails.ingredients.length > 0 && (
                            <div>
                              <h5 className="font-semibold text-gray-900 mb-2">
                                Ingrédients :
                              </h5>
                              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {recipeDetails.ingredients.map((ingredient, idx) => (
                                  <li
                                    key={idx}
                                    className="flex items-start gap-2 text-sm text-gray-600"
                                  >
                                    <span className="text-orange-500 mt-1">•</span>
                                    <span>{ingredient}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Étapes de préparation */}
                          {recipeDetails.etapes && recipeDetails.etapes.length > 0 && (
                            <div>
                              <h5 className="font-semibold text-gray-900 mb-3">
                                Préparation :
                              </h5>
                              <ol className="space-y-3">
                                {recipeDetails.etapes.map((etape, idx) => (
                                  <li
                                    key={idx}
                                    className="flex gap-3"
                                  >
                                    <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                                      {idx + 1}
                                    </span>
                                    <span className="text-sm text-gray-700 pt-0.5">
                                      {etape}
                                    </span>
                                  </li>
                                ))}
                              </ol>
                            </div>
                          )}

                          {/* Conseils */}
                          {recipeDetails.conseil && (
                            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                              <h5 className="font-semibold text-blue-900 mb-1">
                                💡 Conseil du chef :
                              </h5>
                              <p className="text-sm text-blue-800">
                                {recipeDetails.conseil}
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-center text-gray-500 py-4">
                          Impossible de charger les détails de cette recette
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Actions sur la recommandation */}
          {!recommendation.estUtilise && (
            <div className="px-6 pb-4">
              <Button
                variant="primary"
                size="sm"
                icon={Check}
                onClick={() => onMarkAsUsed(recommendation.id)}
                fullWidth
              >
                Marquer comme utilisée
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default RecommendationList;