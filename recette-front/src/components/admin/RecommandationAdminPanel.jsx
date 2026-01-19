import { Calendar, Download, Eye, Filter, Sparkles, Trash2, TrendingUp, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import Button from '../common/Button';
import Card from '../common/Card';
import ConfirmationModal from '../common/ConfirmationModal';
import Loading from '../common/Loading';

const RECOMMENDATION_TYPES = {
  PERSONNALISEE: { label: 'Personnalisée', color: 'orange', icon: Sparkles },
  SAISONNIERE: { label: 'Saisonnière', color: 'green', icon: Calendar },
  HABITUDES: { label: 'Habitudes', color: 'purple', icon: TrendingUp },
  CRENEAU_ACTUEL: { label: 'Par Créneau', color: 'blue', icon: Calendar },
  ENGAGEMENT: { label: 'Engagement', color: 'yellow', icon: TrendingUp },
};

const RecommendationAdminPanel = ({ adminService }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('ALL');
  const [filterUser, setFilterUser] = useState('');
  const [selectedRec, setSelectedRec] = useState(null);
  const [recToDelete, setRecToDelete] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    utilisees: 0,
    parType: {}
  });

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getAllRecommendations();
      setRecommendations(data);
      calculateStats(data);
    } catch (err) {
      console.error('Erreur chargement recommandations:', err);
      setError('Impossible de charger les recommandations.');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const parType = {};
    Object.keys(RECOMMENDATION_TYPES).forEach(type => {
      parType[type] = data.filter(r => r.type === type).length;
    });

    setStats({
      total: data.length,
      utilisees: data.filter(r => r.estUtilise).length,
      parType
    });
  };

  const handleDeleteRecommendation = async () => {
    if (!recToDelete) return;

    try {
      await adminService.deleteRecommendation(recToDelete.id);
      await loadRecommendations();
      setRecToDelete(null);
    } catch (err) {
      console.error('Erreur suppression:', err);
      alert('Erreur lors de la suppression de la recommandation.');
    }
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Type', 'User ID', 'Date', 'Score', 'Utilisée', 'Recommandations'];
    const rows = filteredRecommendations.map(rec => [
      rec.id,
      rec.type,
      rec.userId,
      new Date(rec.dateRecommandation).toLocaleDateString(),
      rec.score || 'N/A',
      rec.estUtilise ? 'Oui' : 'Non',
      JSON.stringify(rec.recommandation)
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recommendations_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredRecommendations = recommendations.filter(rec => {
    if (filterType !== 'ALL' && rec.type !== filterType) return false;
    if (filterUser && !rec.userId.toString().includes(filterUser)) return false;
    return true;
  });

  const tauxUtilisation = stats.total > 0 
    ? ((stats.utilisees / stats.total) * 100).toFixed(1) 
    : 0;

  if (loading) return <Loading message="Chargement des recommandations..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-orange-500" />
            Gestion des Recommandations IA
          </h2>
          <p className="text-gray-600 mt-1">
            Visualisez et gérez toutes les recommandations générées par le système
          </p>
        </div>
        <Button variant="secondary" onClick={exportToCSV} disabled={filteredRecommendations.length === 0}>
          <Download className="w-4 h-4 mr-2" />
          Exporter CSV
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Recommandations</p>
              <p className="text-3xl font-bold text-orange-600">{stats.total}</p>
            </div>
            <Sparkles className="w-10 h-10 text-orange-400 opacity-50" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Utilisées</p>
              <p className="text-3xl font-bold text-green-600">{stats.utilisees}</p>
            </div>
            <TrendingUp className="w-10 h-10 text-green-400 opacity-50" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Taux d'utilisation</p>
              <p className="text-3xl font-bold text-blue-600">{tauxUtilisation}%</p>
            </div>
            <div className="w-10 h-10">
              <svg className="transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  strokeDasharray={`${tauxUtilisation}, 100`}
                />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Types actifs</p>
              <p className="text-3xl font-bold text-purple-600">
                {Object.values(stats.parType).filter(v => v > 0).length}
              </p>
            </div>
            <Filter className="w-10 h-10 text-purple-400 opacity-50" />
          </div>
        </Card>
      </div>

      {/* Statistiques par type */}
      <Card>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-orange-500" />
          Répartition par Type
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {Object.entries(RECOMMENDATION_TYPES).map(([key, config]) => {
            const IconComponent = config.icon;
            const count = stats.parType[key] || 0;
            return (
              <div key={key} className={`p-3 bg-${config.color}-50 border border-${config.color}-200 rounded-lg`}>
                <div className="flex items-center gap-2 mb-1">
                  <IconComponent className={`w-4 h-4 text-${config.color}-600`} />
                  <p className="text-xs font-medium text-gray-600">{config.label}</p>
                </div>
                <p className={`text-2xl font-bold text-${config.color}-600`}>{count}</p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Filtres */}
      <Card>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrer par Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="ALL">Tous les types</option>
              {Object.entries(RECOMMENDATION_TYPES).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rechercher par User ID
            </label>
            <input
              type="text"
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
              placeholder="Ex: 1178"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <Button variant="secondary" onClick={() => { setFilterType('ALL'); setFilterUser(''); }}>
            Réinitialiser
          </Button>
        </div>
      </Card>

      {/* Liste des recommandations */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">
          Recommandations ({filteredRecommendations.length})
        </h3>
        
        {filteredRecommendations.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Aucune recommandation trouvée avec ces filtres</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRecommendations.map((rec) => {
                  const typeConfig = RECOMMENDATION_TYPES[rec.type] || {};
                  const IconComponent = typeConfig.icon || Sparkles;
                  
                  return (
                    <tr key={rec.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">#{rec.id}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-${typeConfig.color}-100 text-${typeConfig.color}-700`}>
                          <IconComponent className="w-3 h-3" />
                          {typeConfig.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {rec.userId}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(rec.dateRecommandation).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className="font-semibold text-orange-600">
                          {rec.score ? `${rec.score.toFixed(1)}%` : 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          rec.estUtilise 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {rec.estUtilise ? 'Utilisée' : 'En attente'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setSelectedRec(rec)}
                            title="Voir les détails"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => setRecToDelete(rec)}
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modal détails */}
      {selectedRec && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Détails de la recommandation #{selectedRec.id}</h3>
                <button onClick={() => setSelectedRec(null)} className="text-gray-500 hover:text-gray-700">
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Type</p>
                    <p className="font-semibold">{RECOMMENDATION_TYPES[selectedRec.type]?.label}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">User ID</p>
                    <p className="font-semibold">{selectedRec.userId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-semibold">{new Date(selectedRec.dateRecommandation).toLocaleString('fr-FR')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Score</p>
                    <p className="font-semibold">{selectedRec.score || 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Recommandations</p>
                  <pre className="bg-gray-50 p-4 rounded-lg text-xs overflow-x-auto">
                    {JSON.stringify(selectedRec.recommandation, null, 2)}
                  </pre>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button variant="secondary" onClick={() => setSelectedRec(null)}>
                  Fermer
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal suppression */}
      <ConfirmationModal
        isOpen={!!recToDelete}
        onClose={() => setRecToDelete(null)}
        onConfirm={handleDeleteRecommendation}
        title="Supprimer la recommandation"
        message={`Voulez-vous vraiment supprimer la recommandation #${recToDelete?.id} ? Cette action est irréversible.`}
        confirmText="Supprimer"
        confirmVariant="danger"
      />
    </div>
  );
};

export default RecommendationAdminPanel;