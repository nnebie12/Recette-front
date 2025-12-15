import React, { useState, useEffect, useContext } from 'react';
import { User, Mail, Award, Heart, MessageCircle, Star } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { recipeService } from '../services/recipeService';
import { favoriteService } from '../services/favoriteService';
import { userService } from '../services/userService';
import Card from '../components/common/Card';
import RecipeList from '../components/recipe/RecipeList';
import Loading from '../components/common/Loading';
import { getProfileColor } from '../utils/helpers';

const ProfilePage = () => {
  const { currentUser } = useContext(AuthContext);
  const [userRecipes, setUserRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [userBehavior, setUserBehavior] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('recipes');

  useEffect(() => {
    if (currentUser) {
      loadUserData();
    }
  }, [currentUser]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      const [recipes, favs, behavior] = await Promise.all([
        recipeService.getRecipesByUser(currentUser.id),
        favoriteService.getUserFavorites(currentUser.id),
        userService.getUserBehavior(currentUser.id).catch(() => null)
      ]);
      
      setUserRecipes(recipes);
      setFavorites(favs);
      setUserBehavior(behavior);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading fullScreen message="Chargement du profil..." />;
  }

  const stats = [
    {
      icon: Award,
      label: 'Recettes créées',
      value: userRecipes.length,
      color: 'text-orange-500'
    },
    {
      icon: Heart,
      label: 'Favoris',
      value: favorites.length,
      color: 'text-red-500'
    },
    {
      icon: MessageCircle,
      label: 'Commentaires',
      value: userBehavior?.metriques?.nombreCommentairesLaisses || 0,
      color: 'text-blue-500'
    },
    {
      icon: Star,
      label: 'Score engagement',
      value: userBehavior?.metriques?.scoreEngagement?.toFixed(1) || 'N/A',
      color: 'text-yellow-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <div className="flex items-start space-x-6">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {currentUser.prenom} {currentUser.nom}
              </h1>
              <div className="flex items-center space-x-4 text-gray-600 mb-4">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>{currentUser.email}</span>
                </div>
              </div>
              
              {userBehavior?.metriques?.profilUtilisateur && (
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getProfileColor(userBehavior.metriques.profilUtilisateur)}`}>
                  {userBehavior.metriques.profilUtilisateur}
                </span>
              )}
              
              {currentUser.preferenceAlimentaire && (
                <p className="text-gray-600 mt-2">
                  <strong>Préférences alimentaires:</strong> {currentUser.preferenceAlimentaire}
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-2`} />
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('recipes')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'recipes'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Mes recettes ({userRecipes.length})
              </button>
              <button
                onClick={() => setActiveTab('favorites')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'favorites'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Favoris ({favorites.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'recipes' && (
          <RecipeList
            recipes={userRecipes}
            favorites={favorites}
            emptyMessage="Vous n'avez pas encore créé de recettes"
          />
        )}

        {activeTab === 'favorites' && (
          <RecipeList
            recipes={favorites.map(f => f.recetteEntity).filter(Boolean)}
            favorites={favorites}
            emptyMessage="Vous n'avez pas encore de recettes favorites"
          />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;