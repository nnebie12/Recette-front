import React, { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import Card from '../common/Card';

const PROFIL_OPTIONS = [
  'TOUS', 
  'ACTIF', 
  'FIDÈLE', 
  'EXPLORATEUR', 
  'OCCASIONNEL'
];

const RECOMMENDATION_TYPES = {
  PERSONNALISEE: 'Recommandation Personnalisée (Profile)',
  SAISONNIERE: 'Recommandation Saisonnière',
  HABITUDES: 'Recommandation basée sur les Habitudes',
  CRENEAU_ACTUEL: 'Recommandation par Créneau Horaire',
  ENGAGEMENT: 'Recommandation d\'Amélioration de l\'Engagement',
};

const AnalyticsPanel = ({ adminService }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // États pour la section 'Recherche par Profil'
  const [selectedProfile, setSelectedProfile] = useState(PROFIL_OPTIONS[0]);
  const [profileUsers, setProfileUsers] = useState([]);

  // États pour la section 'Analyse Utilisateur'
  const [targetUserId, setTargetUserId] = useState('');
  const [userPatterns, setUserPatterns] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [recTargetUserId, setRecTargetUserId] = useState('');
  const [recType, setRecType] = useState(Object.keys(RECOMMENDATION_TYPES)[0]);
  const [recResult, setRecResult] = useState(null);
  const [recLoading, setRecLoading] = useState(false);
  const [recError, setRecError] = useState(null);

  // --- Logique de recherche par Profil ---
  const handleSearchByProfile = async () => {
    setLoading(true);
    setError(null);
    setProfileUsers([]);
    try {
      if (selectedProfile === 'TOUS') {
        // Optionnel : Vous pourriez appeler getAllUsers si nécessaire, ou ignorer
        setProfileUsers([]); 
        return; 
      }
      
      const data = await adminService.getUsersByProfile(selectedProfile);
      setProfileUsers(data);
    } catch (err) {
      console.error("Erreur recherche par profil:", err);
      setError(`Erreur lors de la recherche des utilisateurs pour le profil ${selectedProfile}.`);
    } finally {
      setLoading(false);
    }
  };

  // --- Logique d'analyse utilisateur ---
  const handleAnalyzeUser = async () => {
    if (!targetUserId) return;

    setLoading(true);
    setError(null);
    setUserPatterns(null);
    setUserStats(null);
    
    try {
      // 1. Déclencher l'analyse (POST)
      await adminService.triggerAnalysis(parseInt(targetUserId));

      // 2. Récupérer les patterns (GET)
      const patterns = await adminService.getUserPatterns(parseInt(targetUserId));
      setUserPatterns(patterns);
      
      // 3. Récupérer les statistiques (GET)
      const stats = await adminService.getUserComportementStatistiques(parseInt(targetUserId));
      setUserStats(stats);
      
    } catch (err) {
      console.error("Erreur lors de l'analyse:", err);
      setError(`Erreur lors de l'analyse ou de la récupération des données pour l'utilisateur ID ${targetUserId}.`);
    } finally {
      setLoading(false);
    }
  };

  // --- Logique pour déclencher la Recommandation IA ---
  const handleTriggerRecommendation = async () => {
    if (!recTargetUserId || !recType) return;

    setRecLoading(true);
    setRecError(null);
    setRecResult(null);

    try {
      const result = await adminService.triggerRecommendation(parseInt(recTargetUserId), recType);
      setRecResult(result);
      setRecError(null);
    } catch (err) {
      console.error(`Erreur lors du déclenchement de la recommandation ${recType}:`, err);
      setRecError(`Impossible de générer la recommandation ${RECOMMENDATION_TYPES[recType]} pour l'ID ${recTargetUserId}.`);
      setRecResult(null);
    } finally {
      setRecLoading(false);
    }
  };


  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Analyse Comportementale (MongoDB)</h2>
      
      {error && <div className="p-3 bg-red-100 text-red-600 rounded-md">{error}</div>}
      
      {/* SECTION 1: Recherche par Profil */}
      <div className="bg-white shadow sm:rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Recherche par Profil de Comportement</h3>
        <div className="flex space-x-3 items-end">
          <div className="flex-grow">
            <label htmlFor="profil-select" className="block text-sm font-medium text-gray-700 mb-1">
              Sélectionner un Profil
            </label>
            <select
              id="profil-select"
              value={selectedProfile}
              onChange={(e) => setSelectedProfile(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              {PROFIL_OPTIONS.map((profil) => (
                <option key={profil} value={profil}>
                  {profil}
                </option>
              ))}
            </select>
          </div>
          <Button onClick={handleSearchByProfile} loading={loading} disabled={loading || selectedProfile === 'TOUS'}>
            Rechercher
          </Button>
        </div>

        {profileUsers.length > 0 && (
          <div className="mt-4 p-4 border rounded-md bg-indigo-50">
            <h4 className="font-semibold mb-2">Utilisateurs correspondants au profil "{selectedProfile}" :</h4>
            <ul className="text-sm space-y-1 max-h-40 overflow-y-auto">
              {profileUsers.map((comp) => (
                <li key={comp.userId} className="text-gray-700">
                  ID: {comp.userId} - Score: {comp.scoreEngagement}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* SECTION 2: Analyse Détaillée par Utilisateur */}
      <div className="bg-white shadow sm:rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Analyse Détaillée par Utilisateur</h3>
        <div className="flex space-x-3 items-end">
          <div className="flex-grow">
            <label htmlFor="user-id-input" className="block text-sm font-medium text-gray-700 mb-1">
              ID de l'utilisateur à analyser
            </label>
            <Input
              id="user-id-input"
              type="number"
              value={targetUserId}
              onChange={(e) => setTargetUserId(e.target.value)}
              placeholder="Ex: 123"
            />
          </div>
          <Button onClick={handleAnalyzeUser} loading={loading} disabled={loading || !targetUserId}>
            Analyser et Afficher
          </Button>
        </div>

        {/* Affichage des Résultats d'Analyse */}
        {(userPatterns || userStats) && (
          <div className="mt-6 p-4 border rounded-md bg-gray-50">
            <h4 className="font-bold mb-3 text-lg">Résultats de l'Analyse pour ID: {targetUserId}</h4>

            {userStats && (
              <div className="mb-4">
                <h5 className="font-semibold text-gray-800">Statistiques de Comportement</h5>
                {/* Afficher les statistiques sous forme de liste ou de tableau. Exemple simple: */}
                <pre className="mt-2 p-2 text-xs bg-gray-100 rounded-md overflow-x-auto">
                  {JSON.stringify(userStats, null, 2)}
                </pre>
              </div>
            )}

            {userPatterns && (
              <div>
                <h5 className="font-semibold text-gray-800">Patterns de Navigation</h5>
                {userPatterns.patternsNavigation?.length > 0 ? (
                  <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                    {userPatterns.patternsNavigation.map((pattern, index) => (
                      <li key={index}>{pattern}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-gray-500">Aucun pattern de navigation détecté.</p>
                )}
              </div>
            )}
          </div>
        )}
        {/* SECTION 3: Déclenchement Manuel des Recommandations IA */}
      <Card>
        <h3 className="text-xl font-semibold mb-4 text-indigo-700">Déclenchement Manuel des Recommandations IA</h3>
        <p className="text-gray-600 mb-6">Force la génération d'un type spécifique de recommandation pour un utilisateur.</p>

        {recError && <div className="p-3 mb-4 bg-red-100 text-red-700 rounded-md">{recError}</div>}
        
        <div className="space-y-4">
            {/* Champ ID Utilisateur */}
            <div>
                <label htmlFor="rec-user-id" className="block text-sm font-medium text-gray-700 mb-1">ID de l'utilisateur cible</label>
                <Input
                    id="rec-user-id"
                    type="number"
                    value={recTargetUserId}
                    onChange={(e) => setRecTargetUserId(e.target.value)}
                    placeholder="ID utilisateur (Ex: 1)"
                />
            </div>
            
            {/* Sélecteur de Type de Recommandation */}
            <div>
                <label htmlFor="rec-type-select" className="block text-sm font-medium text-gray-700 mb-1">Type de Recommandation</label>
                <select
                    id="rec-type-select"
                    value={recType}
                    onChange={(e) => setRecType(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    {Object.entries(RECOMMENDATION_TYPES).map(([key, label]) => (
                        <option key={key} value={key}>
                            {label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Bouton de Déclenchement */}
            <div className="pt-2">
                <Button 
                    onClick={handleTriggerRecommendation} 
                    loading={recLoading}
                    disabled={recLoading || !recTargetUserId || !recType}
                    variant="primary"
                >
                    Générer la Recommandation
                </Button>
            </div>
        </div>

        {/* Affichage du Résultat */}
        {recResult && (
          <div className="mt-6 p-4 border border-green-300 rounded-md bg-green-50">
            <h4 className="font-bold mb-2 text-md text-green-800">✅ Recommandation Générée :</h4>
            <p className="text-sm text-gray-700">Type généré : <strong>{RECOMMENDATION_TYPES[recType]}</strong></p>
            {/* Afficher l'objet RecommandationIA retourné (simulé par un JSON brut) */}
            <pre className="mt-2 p-2 text-xs bg-green-100 rounded-md overflow-x-auto text-green-900">
              {JSON.stringify(recResult, null, 2)}
            </pre>
          </div>
        )}
      </Card>
      </div>
    </div>
  );
};

export default AnalyticsPanel;