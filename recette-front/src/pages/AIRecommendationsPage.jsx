
import { useState, useEffect, useContext } from 'react';
import { RefreshCw, Sparkles, Brain, Zap, TrendingUp, Leaf } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { recommendationService } from '../services/recommendationService';
import { useAIRecommendation } from '../hooks/useAIRecommendation';
import RecommendationList from '../components/recommendation/RecommendationList';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';

const AIRecommendationsPage = () => {
  const { currentUser } = useContext(AuthContext);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userBehavior, setUserBehavior] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  const {
    loading: aiLoading,
    error: aiError,
    generatePersonalized,
    generateSeasonal,
    generateHabitBased,
    generateTimeslot,
    generateEngagement,
    clearError
  } = useAIRecommendation(currentUser?.id);

  useEffect(() => {
    if (currentUser) {
      loadRecommendations();
      loadUserBehavior();
    }
  }, [currentUser]);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      const data = await recommendationService.getUserRecommendations(currentUser.id);
      setRecommendations(data);
    } catch (error) {
      console.error('Erreur chargement recommandations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserBehavior = async () => {
    try {
      setUserBehavior({
        profil: 'ACTIF',
        scoreEngagement: 75,
        preferences: {
          categories: ['Italien', 'Asiatique', 'Desserts'],
          types: ['Rapide', 'Végétarien'],
          ingredients: ['Tomates', 'Basilic', 'Soja']
        },
        habits: {
          typeRecette: 'Rapide',
          tempsPreparation: 'Court',
          difficulte: 'Facile'
        },
        browsing: {
          categories: ['Italien', 'Desserts']
        }
      });
    } catch (error) {
      console.error('Erreur chargement comportement:', error);
    }
  };

  const handleGenerateAIRecommendation = async (type) => {
    clearError();
    
    try {
      switch (type) {
        case 'PERSONNALISEE': { 
          await generatePersonalized(
            { 
              profil: userBehavior?.profil,
              scoreEngagement: userBehavior?.scoreEngagement 
            },
            userBehavior?.preferences
          );
          break;
        }

        case 'SAISONNIERE': { 
          const currentSeason = getCurrentSeason();
          await generateSeasonal(currentSeason, userBehavior?.preferences);
          break;
        }
          
        case 'HABITUDES': { 
          await generateHabitBased(userBehavior?.habits, userBehavior?.browsing);
          break;
        } 
          
        case 'CRENEAU': { 
          const currentTimeslot = getCurrentTimeslot();
          await generateTimeslot(currentTimeslot, userBehavior?.preferences);
          break;
        } 
          
        case 'ENGAGEMENT': { 
          await generateEngagement(
            userBehavior?.scoreEngagement || 50,
            { derniereLecture: 'Récente' }
          );
          break;
        } 
          
        default: { 
          await generatePersonalized(
            { 
              profil: userBehavior?.profil,
              scoreEngagement: userBehavior?.scoreEngagement 
            },
            userBehavior?.preferences
          );
        }
      }

      // Recharger les recommandations après génération
      await loadRecommendations();
    } catch (error) {
      console.error('Erreur génération IA:', error);
    }
  };

  const handleMarkAsUsed = async (recommendationId) => {
    try {
      await recommendationService.markRecommendationAsUsed(recommendationId);
      await loadRecommendations();
    } catch (error) {
      console.error('Erreur marquage utilisé:', error);
    }
  };

  const getCurrentSeason = () => {
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 5) return 'PRINTEMPS';
    if (month >= 6 && month <= 8) return 'ETE';
    if (month >= 9 && month <= 11) return 'AUTOMNE';
    return 'HIVER';
  };

  const getCurrentTimeslot = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 11) return 'PETIT_DEJEUNER';
    if (hour >= 11 && hour < 15) return 'DEJEUNER';
    if (hour >= 15 && hour < 18) return 'GOUTER';
    return 'DINER';
  };

  const filteredRecommendations = activeTab === 'all' 
    ? recommendations 
    : recommendations.filter(rec => rec.type === activeTab);

  if (!currentUser) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-red-700">Accès refusé</h3>
        <p className="text-gray-500">Vous devez être connecté pour voir vos recommandations.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Recommandations IA
                  </h1>
                  <p className="text-gray-600 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-orange-500" />
                    Propulsées par l'intelligence artificielle
                  </p>
                </div>
              </div>
            </div>
            
            <Button
              variant="outline"
              icon={RefreshCw}
              onClick={loadRecommendations}
              disabled={loading}
            >
              Actualiser
            </Button>
          </div>

          {/* AI Error Display */}
          {aiError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{aiError}</p>
              <button
                onClick={clearError}
                className="mt-2 text-xs text-red-600 underline"
              >
                Fermer
              </button>
            </div>
          )}

          {/* User Engagement Score */}
          {userBehavior && (
            <div className="bg-white rounded-lg p-4 shadow-md mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-700">
                    Score d'engagement
                  </h3>
                  <p className="text-2xl font-bold text-orange-600">
                    {userBehavior.scoreEngagement}/100
                  </p>
                </div>
                <Zap className="w-12 h-12 text-orange-400" />
              </div>
            </div>
          )}

          {/* Generate AI Recommendations */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-orange-500" />
              <h3 className="font-semibold text-gray-900">
                Générer des recommandations IA
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              L'IA analyse votre comportement et vos préférences pour créer des recommandations personnalisées
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleGenerateAIRecommendation('PERSONNALISEE')}
                loading={aiLoading}
                fullWidth
              >
                <Sparkles className="w-4 h-4 mr-1" />
                Personnalisée
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleGenerateAIRecommendation('SAISONNIERE')}
                loading={aiLoading}
                fullWidth
              >
                Saisonnière
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleGenerateAIRecommendation('CRENEAU')}
                loading={aiLoading}
                fullWidth
              >
                Par créneau
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleGenerateAIRecommendation('HABITUDES')}
                loading={aiLoading}
                fullWidth
              >
                Habitudes
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleGenerateAIRecommendation('ENGAGEMENT')}
                loading={aiLoading}
                fullWidth
              >
                Engagement
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-4">
            {[
              { key: 'all', label: 'Toutes' },
              { key: 'PERSONNALISEE', label: 'Personnalisées' },
              { key: 'SAISONNIERE', label: 'Saisonnières' },
              { key: 'HABITUDES', label: 'Habitudes' },
              { key: 'CRENEAU_ACTUEL', label: 'Par Créneau' },
              { key: 'ENGAGEMENT', label: 'Engagement' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Recommendations List */}
        {loading ? (
          <Loading message="Chargement des recommandations..." />
        ) : (
          <RecommendationList
            recommendations={filteredRecommendations}
            loading={loading}
            onMarkAsUsed={handleMarkAsUsed}
          />
        )}
      </div>
    </div>
  );
};

export default AIRecommendationsPage;