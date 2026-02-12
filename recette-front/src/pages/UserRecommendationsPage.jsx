import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { recommendationService } from '../services/recommendationService';
import RecommendationList from '../components/recommendations/RecommendationList';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';
import { RefreshCw, Zap } from 'lucide-react';

const TYPE_OPTIONS = [
  { key: 'ALL', label: 'Toutes les recommandations' },
  { key: 'PERSONNALISEE', label: 'Personnalisées' },
  { key: 'SAISONNIERE', label: 'Saisonnières' },
  { key: 'CRENEAU', label: 'Par Créneau' },
  { key: 'HABITUDES', label: 'Par Habitudes' },
  { key: 'ENGAGEMENT', label: 'Engagement' },
];

const UserRecommendationsPage = () => {
  const { currentUser, loading: authLoading } = useContext(AuthContext);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState(TYPE_OPTIONS[0].key);
  const [markLoadingId, setMarkLoadingId] = useState(null);

  const userId = currentUser?.id; 

  const fetchRecommendations = async (type = selectedType) => {
    if (!userId) return;

    setLoading(true);
    setError(null);
    try {
      let data;
      if (type === 'ALL') {
        data = await recommendationService.getUserRecommendations(userId);
      } else {
        data = await recommendationService.getRecommendationsByType(userId, type);
      }
      setRecommendations(data);
    } catch (err) {
      console.error("Erreur lors du chargement des recommandations:", err);
      setError("Impossible de charger les recommandations. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsUsed = async (recommandationId) => {
    setMarkLoadingId(recommandationId);
    setError(null);
    try {
      await recommendationService.markRecommendationAsUsed(recommandationId);
      
      // Mettre à jour l'état local pour refléter le changement immédiatement sans recharger toute la liste
      setRecommendations(prevRecs => 
        prevRecs.map(rec => 
          rec.id === recommandationId ? { ...rec, estUtilise: true } : rec
        )
      );
    } catch (err) {
      console.error("Erreur lors du marquage comme utilisé:", err);
      setError("Erreur lors de la mise à jour du statut. Veuillez réessayer.");
    } finally {
      setMarkLoadingId(null);
    }
  };
  
  // Charge initiale 
  useEffect(() => {
    if (userId) {
      fetchRecommendations(selectedType);
    }
  }, [userId, selectedType]);


  if (authLoading) {
    return <Loading fullScreen message="Vérification de l'utilisateur..." />;
  }

  if (!userId) {
    return (
        <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-red-700">Accès refusé</h3>
            <p className="text-gray-500">Vous devez être connecté pour voir vos recommandations.</p>
        </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center">
          <Zap className="w-8 h-8 text-orange-600 mr-3" />
          Vos Recommandations IA
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Découvrez les suggestions personnalisées basées sur votre comportement et vos préférences culinaires.
        </p>
      </header>

      {error && (
        <div className="p-4 mb-6 text-sm text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      {/* Barre de Filtrage et Rafraîchissement */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4 items-center">
          <label htmlFor="type-filter" className="text-sm font-medium text-gray-700">
            Filtrer par type:
          </label>
          <select
            id="type-filter"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
          >
            {TYPE_OPTIONS.map(option => (
              <option key={option.key} value={option.key}>{option.label}</option>
            ))}
          </select>
        </div>
        
        <Button 
          variant="secondary" 
          onClick={() => fetchRecommendations()} 
          loading={loading}
          icon={RefreshCw}
        >
          Rafraîchir
        </Button>
      </div>

      {/* Liste des Recommandations */}
      <RecommendationList 
        recommendations={recommendations} 
        loading={loading}
        onMarkAsUsed={handleMarkAsUsed}
        markLoadingId={markLoadingId}
      />
    </div>
  );
};

export default UserRecommendationsPage;