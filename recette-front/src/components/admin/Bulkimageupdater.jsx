import { useState, useEffect } from 'react';
import { ImageIcon, RefreshCw, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { recipeService } from '../../services/recipeService';
import { getAutoImage } from '../../services/imageService';
import Button from '../common/Button';
import Card from '../common/Card';

/**
 * Composant admin pour ajouter automatiquement des images
 * à toutes les recettes qui n'en ont pas encore.
 *
 * À placer dans le dashboard admin, onglet "Recettes".
 */
const BulkImageUpdater = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState({ done: 0, errors: 0, total: 0 });
  const [currentRecipe, setCurrentRecipe] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    loadRecipesWithoutImages();
  }, []);

  const loadRecipesWithoutImages = async () => {
    setLoading(true);
    try {
      const all = await recipeService.getAllRecipes();
      const withoutImages = all.filter((r) => !r.imageUrl || r.imageUrl === '');
      setRecipes(withoutImages);
    } catch (err) {
      console.error('Erreur chargement recettes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkUpdate = async () => {
    if (recipes.length === 0) return;

    setProcessing(true);
    setDone(false);
    setResults({ done: 0, errors: 0, total: recipes.length });

    for (const recipe of recipes) {
      setCurrentRecipe(recipe.titre);
      try {
        const imageUrl = getAutoImage(recipe);

        await recipeService.updateRecipe(recipe.id, {
          ...recipe,
          imageUrl,
        });

        setResults((prev) => ({ ...prev, done: prev.done + 1 }));
      } catch {
        setResults((prev) => ({ ...prev, errors: prev.errors + 1 }));
      }

      // Petite pause pour ne pas surcharger l'API
      await new Promise((r) => setTimeout(r, 200));
    }

    setProcessing(false);
    setDone(true);
    setCurrentRecipe('');
    // Recharger la liste
    await loadRecipesWithoutImages();
  };

  const progressPercent =
    results.total > 0
      ? Math.round(((results.done + results.errors) / results.total) * 100)
      : 0;

  return (
    <Card>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-orange-100 rounded-lg">
          <ImageIcon className="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Ajout automatique d'images</h3>
          <p className="text-sm text-gray-500">
            Ajoute une image Unsplash aux recettes qui n'en ont pas
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-gray-500 py-4">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Analyse des recettes...</span>
        </div>
      ) : (
        <>
          {/* Résumé */}
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg mb-4 text-sm">
            <span className="text-gray-600">
              <strong className="text-orange-600">{recipes.length}</strong> recette
              {recipes.length > 1 ? 's' : ''} sans image
            </span>
            <button
              onClick={loadRecipesWithoutImages}
              className="ml-auto text-gray-400 hover:text-gray-600"
              title="Actualiser"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Barre de progression */}
          {processing && (
            <div className="mb-4 space-y-2">
              <div className="flex justify-between text-xs text-gray-500">
                <span className="truncate max-w-[200px]">{currentRecipe}</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex gap-4 text-xs">
                <span className="text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  {results.done} réussies
                </span>
                {results.errors > 0 && (
                  <span className="text-red-500 flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    {results.errors} erreurs
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Résultat final */}
          {done && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
              <p className="text-green-800 font-medium flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Terminé — {results.done} image{results.done > 1 ? 's' : ''} ajoutée
                {results.done > 1 ? 's' : ''}
                {results.errors > 0 && `, ${results.errors} erreur${results.errors > 1 ? 's' : ''}`}
              </p>
            </div>
          )}

          {/* Aperçu des recettes à traiter */}
          {recipes.length > 0 && !processing && !done && (
            <div className="mb-4 max-h-40 overflow-y-auto space-y-1">
              {recipes.slice(0, 8).map((r) => (
                <div
                  key={r.id}
                  className="flex items-center gap-2 text-sm text-gray-600 py-1"
                >
                  <span className="w-2 h-2 bg-orange-300 rounded-full flex-shrink-0" />
                  <span className="truncate">{r.titre}</span>
                </div>
              ))}
              {recipes.length > 8 && (
                <p className="text-xs text-gray-400 pl-4">
                  +{recipes.length - 8} autres recettes...
                </p>
              )}
            </div>
          )}

          <Button
            variant="primary"
            onClick={handleBulkUpdate}
            loading={processing}
            disabled={recipes.length === 0 || processing}
            fullWidth
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            {recipes.length === 0
              ? 'Toutes les recettes ont une image ✓'
              : `Ajouter des images (${recipes.length} recettes)`}
          </Button>
        </>
      )}
    </Card>
  );
};

export default BulkImageUpdater;