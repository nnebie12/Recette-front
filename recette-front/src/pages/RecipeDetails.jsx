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
import ConfirmationModal from '../components/common/ConfirmationModal';

const RecipeDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [recipe, setRecipe] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionId] = useState(generateSessionId());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); 


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
    if (!currentUser || !currentUser.id) {
        return; 
    }
    try {
      const favorites = await favoriteService.getUserFavorites(currentUser.id);
      setIsFavorite(favorites.some(f => f.recetteEntity?.id === parseInt(id)));
    } catch (error) {
      console.error('Error checking favorite:', error);
    }
  };

  const recordInteraction = async () => {
    if (!currentUser || !currentUser.id) {
        return; 
    }
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

  const handleDeleteRecipe = async () => {
    if (!currentUser || currentUser.id !== recipe.userEntity.id) {
        console.error("Accès non autorisé à la suppression.");
        return;
    }
    
    setLoading(true);
    try {
      await recipeService.deleteRecipe(id); 
      alert("Recette supprimée avec succès !");
      navigate('/recipes'); 
    } catch (error) {
      console.error('Error deleting recipe:', error);
      setLoading(false); 
      alert("Erreur lors de la suppression de la recette.");
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
          onDeleteRequest={() => setShowDeleteConfirm(true)}
        />
        <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteRecipe}
        title="Confirmation de Suppression"
        message={`Êtes-vous sûr de vouloir supprimer la recette "${recipe?.titre}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        confirmVariant="danger"
      />

      </div>
    </div>
  );
};

export default RecipeDetailsPage;