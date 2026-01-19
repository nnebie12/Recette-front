import { useState, useEffect, useContext } from 'react';
import { Brain, RefreshCw, Sparkles, Leaf, Clock, TrendingUp, Zap } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useRecommendations } from '../hooks/useRecommendation';
import RecommendationList from '../components/recommendation/RecommendationList';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';

const RECOMMENDATION_TYPES = [
  { key: 'PERSONNALISEE', label: 'Personnalisée', icon: Sparkles, color: 'orange' },
  { key: 'SAISONNIERE', label: 'Saisonnière', icon: Leaf, color: 'green' },
  { key: 'CRENEAU', label: 'Par créneau', icon: Clock, color: 'blue' },
  { key: 'HABITUDES', label: 'Habitudes', icon: TrendingUp, color: 'purple' },
  { key: 'ENGAGEMENT', label: 'Engagement', icon: Zap, color: 'yellow' },
];

const FILTER_TABS = [
  { key: 'ALL', label: 'Toutes' },
  ...RECOMMENDATION_TYPES.map(({ key, label }) => ({ key, label })),
];

const RecommendationsPage = () => {
  const { currentUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('ALL');

  const {
    loading,
    error,
    recommendations,
    loadRecommendations,
    loadRecommendationsByType,
    generateRecommendation,
    markAsUsed,
    clearError
  } = useRecommendations(currentUser?.id);

  // Chargement initial
  useEffect(() => {
    if (currentUser?.id) {
      loadRecommendations();
    }
  }, [currentUser?.id, loadRecommendations]);

  // Chargement par type
  useEffect(() => {
    if (currentUser?.id && activeTab !== 'ALL') {
      loadRecommendationsByType(activeTab);
    } else if (currentUser?.id) {
      loadRecommendations();
    }
  }, [activeTab, currentUser?.id, loadRecommendations, loadRecommendationsByType]);

  const handleGenerateRecommendation = async (type) => {
    try {
      await generateRecommendation(type);
    } catch (error) {
      console.error('Erreur génération:', error);
    }
  };

  const handleMarkAsUsed = async (recommendationId) => {
    try {
      await markAsUsed(recommendationId);
    } catch (error) {
      console.error('Erreur marquage:', error);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-red-700 mb-2">Accès refusé</h3>
          <p className="text-gray-500">Vous devez être connecté pour voir vos recommandations.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl shadow-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Recommandations IA
                </h1>
                <p className="text-gray-600 flex items-center gap-2 mt-1">
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  Générées automatiquement selon votre comportement
                </p>
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

          {/* Messages d'erreur */}
          {error && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">{error}</p>
              <button
                onClick={clearError}
                className="mt-2 text-xs text-yellow-700 underline hover:text-yellow-900"
              >
                Fermer
              </button>
            </div>
          )}

          {/* Générateur de recommandations IA */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-orange-500" />
              <h3 className="font-semibold text-gray-900">
                Générer des recommandations IA
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              L'IA analyse automatiquement votre comportement, vos interactions et votre historique pour créer des recommandations personnalisées
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {RECOMMENDATION_TYPES.map((type) => {
                const IconComponent = type.icon;
                return (
                  <Button
                    key={type.key}
                    variant="primary"
                    size="sm"
                    onClick={() => handleGenerateRecommendation(type.key)}
                    loading={loading}
                    fullWidth
                    className="flex items-center justify-center gap-2"
                  >
                    <IconComponent className="w-4 h-4" />
                    {type.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Filtres par onglets */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-4 overflow-x-auto">
            {FILTER_TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pb-3 px-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Liste des recommandations */}
        {loading ? (
          <Loading message="Chargement des recommandations..." />
        ) : (
          <RecommendationList
            recommendations={recommendations}
            loading={loading}
            onMarkAsUsed={handleMarkAsUsed}
          />
        )}
      </div>
    </div>
  );
};

export default RecommendationsPage;