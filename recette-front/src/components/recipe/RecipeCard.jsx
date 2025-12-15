import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Star, Heart, MessageCircle, User } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import Card from '../common/Card';
import { formatCookingTime, getDifficultyColor } from '../../utils/helpers';

const RecipeCard = ({ recipe, isFavorite, onToggleFavorite }) => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const totalTime = (recipe.tempsPreparation || 0) + (recipe.tempsCuisson || 0);
  const averageRating = recipe.moyenneNotes || 0;

  const handleClick = () => {
    navigate(`/recipes/${recipe.id}`);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (currentUser && onToggleFavorite) {
      onToggleFavorite(recipe.id);
    } else if (!currentUser) {
      navigate('/login');
    }
  };

  return (
    <Card hover onClick={handleClick} className="overflow-hidden group">
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-orange-200 to-red-200 overflow-hidden">
        {recipe.imageUrl ? (
          <img
            src={recipe.imageUrl}
            alt={recipe.titre}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl">🍳</span>
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg hover:scale-110 transition-transform"
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
            }`}
          />
        </button>

        {/* Difficulty Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(recipe.difficulte)}`}>
            {recipe.difficulte || 'MOYEN'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-500 transition-colors">
          {recipe.titre}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {recipe.description}
        </p>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{formatCookingTime(totalTime)}</span>
            </div>

            <div className="flex items-center">
              <Star className="w-4 h-4 mr-1 text-yellow-400" />
              <span>{averageRating.toFixed(1)}</span>
            </div>

            <div className="flex items-center">
              <MessageCircle className="w-4 h-4 mr-1" />
              <span>{recipe.nombreCommentaires || 0}</span>
            </div>
          </div>
        </div>

        {/* Author */}
        <div className="flex items-center text-sm text-gray-500 pt-3 border-t border-gray-100">
          <User className="w-4 h-4 mr-1" />
          <span>Par {recipe.userName || 'Anonyme'}</span>
        </div>
      </div>
    </Card>
  );
};

export default RecipeCard;