import React, { useState, useEffect, useContext } from 'react';
import { TrendingUp, RefreshCw } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { recommendationService } from '../services/recommendationService';
import RecommendationList from '../components/recommendation/RecommendationList';
import Button from '../components/common/Button';

const Recommendations = () => {
  const { currentUser } = useContext(AuthContext);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (currentUser) {
      loadRecommendations();
    }
  }, [currentUser]);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      const data = await recommendationService.getUserRecommendations(currentUser.id);
      setRecommendations(data);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateRecommendation = async (type) => {
  setGenerating(true);
  try {
    switch (type) {
      case 'PERSONNALISEE':
        await recommendationService.generatePersonalizedRecommendation(currentUser.id);
        break;
      case 'SAISONNIERE':
        await recommendationService.generateSeasonalRecommendation(currentUser.id);
        break;
      case 'CRENEAU':
        await recommendationService.generateTimeslotRecommendation(currentUser.id);
        break;
      case 'HABITUDES':
        await recommendationService.generateHabitBasedRecommendation(currentUser.id);
        break;
      default:
        await recommendationService.generatePersonalizedRecommendation(currentUser.id);
    }

    await loadRecommendations();
  } catch (error) {
    console.error('Error generating recommendation:', error);
  } finally {
    setGenerating(false);
  }
};


  const handleMarkAsUsed = async (recommendationId) => {
    try {
      await recommendationService.markRecommendationAsUsed(recommendationId);
      await loadRecommendations();
    } catch (error) {
      console.error('Error marking recommendation as used:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <TrendingUp className="w-8 h-8 text-orange-500" />
                <h1 className="text-3xl font-bold text-gray-900">
                  Recommandations personnalisées
                </h1>
              </div>
              <p className="text-gray-600">
                Découvrez des recettes adaptées à vos goûts et habitudes
              </p>
            </div>
            
            <Button
              variant="outline"
              icon={RefreshCw}
              onClick={() => loadRecommendations()}
              disabled={loading}
            >
              Actualiser
            </Button>
          </div>

          {/* Generate Recommendations */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="font-semibold text-gray-900 mb-4">
              Générer de nouvelles recommandations
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleGenerateRecommendation('PERSONNALISEE')}
                loading={generating}
                fullWidth
              >
                Personnalisées
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleGenerateRecommendation('SAISONNIERE')}
                loading={generating}
                fullWidth
              >
                Saisonnières
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleGenerateRecommendation('CRENEAU')}
                loading={generating}
                fullWidth
              >
                Par créneau
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleGenerateRecommendation('HABITUDES')}
                loading={generating}
                fullWidth
              >
                Habitudes
              </Button>
            </div>
          </div>
        </div>

        <RecommendationList
          recommendations={recommendations}
          loading={loading}
          onMarkAsUsed={handleMarkAsUsed}
        />
      </div>
    </div>
  );
};

export default Recommendations;