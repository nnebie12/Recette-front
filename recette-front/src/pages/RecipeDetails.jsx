import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { recipeService } from '../services/recipeService';
import { favoriteService } from '../services/favoriteService';
import RecipeDetail from '../components/recipe/RecipeDetail';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';
import { generateSessionId } from '../utils/helpers';

const RecipeDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [recipe, setRecipe] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionId] = useState(generateSessionId());

  useEffect(() => {
    loadRecipe();
    if (currentUser) {
      checkFavorite();
      recordInteraction();
    }
  }, [id, currentUser]);

  const loadRecipe = async () => {
    setLoading(true);
    try {
      const data = await recipeService.getRecipeById(id);
      setRecipe(data);
    } catch (error) {
      console.error('Error loading recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkFavorite = async () => {
    try {
      const favorites = await favoriteService.getUserFavorites(currentUser.id);
      setIsFavorite(favorites.some(f => f.recetteEntity?.id === parseInt(id)));
    } catch (error) {
      console.error('Error checking favorite:', error);
    }
  };

  const recordInteraction = async () => {
    try {
      await recipeService.recordInteraction(
        currentUser.id,
        parseInt(id),
        'CONSULTATION',
        sessionId
      );
    } catch (error) {
      console.error('Error recording interaction:', error);
    }
  };

  const handleToggleFavorite = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    try {
      if (isFavorite) {
        await favoriteService.removeFavorite(currentUser.id, parseInt(id));
      } else {
        await favoriteService.addFavorite(currentUser.id, parseInt(id));
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleAddComment = async (commentData) => {
    if (!currentUser) return;

    try {
      await recipeService.addComment(
        parseInt(id),
        currentUser.id,
        {
          ...commentData,
          userId: currentUser.id.toString(),
          userName: `${currentUser.prenom} ${currentUser.nom}`
        }
      );
      await loadRecipe();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleAddRating = async (ratingData) => {
    if (!currentUser) return;

    try {
      await recipeService.addNote(
        parseInt(id),
        currentUser.id,
        {
          ...ratingData,
          userId: currentUser.id.toString(),
          recetteId: id
        }
      );
      await loadRecipe();
    } catch (error) {
      console.error('Error adding rating:', error);
    }
  };

  if (loading) {
    return <Loading fullScreen message="Chargement de la recette..." />;
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Recette non trouvée
          </h2>
          <p className="text-gray-600 mb-4">
            Cette recette n'existe pas ou a été supprimée
          </p>
          <Button onClick={() => navigate('/recipes')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux recettes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>

        <RecipeDetail
          recipe={recipe}
          isFavorite={isFavorite}
          onToggleFavorite={handleToggleFavorite}
          onAddComment={handleAddComment}
          onAddRating={handleAddRating}
        />
      </div>
    </div>
  );
};

export default RecipeDetailsPage;