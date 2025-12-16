import { useState, useContext } from 'react';
import { Clock, Star, Heart, User, Calendar, MessageCircle, Trash2 } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import Button from '../common/Button';
import Card from '../common/Card';
import { formatCookingTime, formatDate, getDifficultyColor } from '../../utils/helpers';
import CommentList from '../comment/CommentList';
import CommentForm from '../comment/CommentForm';
import RatingForm from '../rating/RatingForm';
import RecipeEdit from './RecipeEdit';



const RecipeDetail = ({ recipe, isFavorite, onToggleFavorite, onAddComment, onAddRating, onReload, onDeleteRequest }) => {
  const { currentUser } = useContext(AuthContext);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  

  const totalTime = (recipe.tempsPreparation || 0) + (recipe.tempsCuisson || 0);
  const averageRating = recipe.moyenneNotes || 0;

  const handleCommentSubmit = (commentData) => {
    if (onAddComment) {
      onAddComment(commentData);
      setShowCommentForm(false);
    }
  };

  const handleRatingSubmit = (ratingData) => {
    if (onAddRating) {
      onAddRating(ratingData);
      setShowRatingForm(false);
    }
  };

  const reloadRecipe = () => {
    onReload?.();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Image */}
          <div className="relative h-96 bg-gradient-to-br from-orange-200 to-red-200 rounded-lg overflow-hidden">
            {recipe.imageUrl ? (
              <img
                src={recipe.imageUrl}
                alt={recipe.titre}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-9xl">🍳</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {recipe.titre}
                </h1>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(recipe.difficulte)}`}>
                  {recipe.difficulte || 'MOYEN'}
                </span>
              </div>
              {currentUser && (
                <Button
                  variant="ghost"
                  onClick={() => onToggleFavorite && onToggleFavorite(recipe.id)}
                >
                  <Heart
                    className={`w-6 h-6 ${
                      isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
                    }`}
                  />
                </Button>
              )}
            </div>

            <p className="text-gray-600 mb-6">
              {recipe.description}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-500">Temps total</p>
                  <p className="font-semibold">{formatCookingTime(totalTime)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-sm text-gray-500">Note moyenne</p>
                  <p className="font-semibold">
                    {averageRating.toFixed(1)} / 5 ({recipe.nombreNotes || 0} avis)
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-500">Auteur</p>
                  <p className="font-semibold">{recipe.userName || 'Anonyme'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-500">Publié le</p>
                  <p className="font-semibold">{formatDate(recipe.dateCreation)}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            {currentUser && (
              <div className="space-y-2">
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => setShowRatingForm(!showRatingForm)}
                >
                  <Star className="w-5 h-5 mr-2" />
                  Noter cette recette
                </Button>

                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => setEditOpen(true)}
                >
                  Modifier la recette
                </Button>
                  {editOpen && ( 
                <RecipeEdit
                  recipe={recipe}
                  isOpen={editOpen}
                  onClose={() => setEditOpen(false)}
                  onUpdate={reloadRecipe}
                />
                  )}
                
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => setShowCommentForm(!showCommentForm)}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Ajouter un commentaire
                </Button>
                <Button 
                variant="danger" 
                onClick={onDeleteRequest} 
              >
                <Trash2 className="w-5 h-5" />
              </Button>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Rating Form */}
      {showRatingForm && currentUser && (
        <Card>
          <h3 className="text-xl font-semibold mb-4">Noter cette recette</h3>
          <RatingForm onSubmit={handleRatingSubmit} />
        </Card>
      )}

      {/* Preparation & Cooking Times */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-xl font-semibold mb-4">⏱️ Temps de préparation</h3>
          <p className="text-2xl font-bold text-orange-500">
            {formatCookingTime(recipe.tempsPreparation)}
          </p>
        </Card>

        <Card>
          <h3 className="text-xl font-semibold mb-4">🔥 Temps de cuisson</h3>
          <p className="text-2xl font-bold text-orange-500">
            {formatCookingTime(recipe.tempsCuisson)}
          </p>
        </Card>
      </div>

      {/* Ingredients */}
      {recipe.ingredients && recipe.ingredients.length > 0 && (
        <Card>
          <h3 className="text-xl font-semibold mb-4">🥘 Ingrédients</h3>
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                <span className="font-medium">{ingredient.quantite}</span>
                <span className="ml-2">{ingredient.ingredientName}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Comments Section */}
      <Card>
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <MessageCircle className="w-6 h-6 mr-2" />
          Commentaires ({recipe.nombreCommentaires || 0})
        </h3>

        {showCommentForm && currentUser && (
          <div className="mb-6">
            <CommentForm onSubmit={handleCommentSubmit} />
          </div>
        )}

        {recipe.commentaires && recipe.commentaires.length > 0 ? (
          <CommentList comments={recipe.commentaires} />
        ) : (
          <p className="text-gray-500 text-center py-8">
            Aucun commentaire pour le moment. Soyez le premier à commenter !
          </p>
        )}
      </Card>
      
    </div>
  );
};

export default RecipeDetail;