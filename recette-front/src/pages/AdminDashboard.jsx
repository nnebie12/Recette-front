import React, { useState, useEffect, useCallback, useContext } from 'react';
import { adminService } from '../services/adminService';
import { userBehaviorService } from '../services/userBehaviorService';
import AIQuickActions from '../components/admin/AIQuickActions';
import RFMVisualizer from '../components/admin/RFMVisualizer';
import RecommendationAdminPanel from '../components/admin/RecommandationAdminPanel';
import UserManagement from '../components/admin/UserManagement';
import RecipeAdminPanel from '../components/admin/RecipeAdminPanel';
import AnalyticsPanel from '../components/admin/AnalyticsPanel';
import { Loader2, AlertCircle, RefreshCw, Users, ShieldCheck, TrendingUp, Activity, Sparkles, Settings, BarChart, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AnalyticsColumn from '../components/admin/AnalyticsColumn';
import UserManagementColumn from '../components/admin/UserManagementColumn';
import RecipeManagementColumn from '../components/admin/RecipeManagementColumn';
import StatsOverview from '../components/admin/StatsOverview';
import { isAdminRole } from '../utils/helpers';

// ✅ Comptes calibrés pour la démo de soutenance (NOUVEAU → FIDÈLE).
// Ils sont poussés en tête du batch d'enrichissement pour être disponibles
// dans le tout premier aller-retour réseau, sans attendre les ~800 autres users.
const DEMO_IDS = [2047, 2048, 2049, 2050, 2051];

const AdminDashboard = () => {
  const { currentUser, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [users, setUsers] = useState([]);
  const [enrichedUsers, setEnrichedUsers] = useState([]);
  const [rfmStats, setRfmStats] = useState({ champions: 0, fidele: 0, risque: 0, nouveau: 0 });
  const [sortBy, setSortBy] = useState('engagement');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analyticsData, setAnalyticsData] = useState({
    totalUsers: 0,
    activeRecipes: 0,
    totalComments: 0,
    avgRating: 0
  });
  const [loadingProgress, setLoadingProgress] = useState({
    users: false,
    behaviors: false,
    stats: false
  });

  // ✅ Recherche rapide par ID — filet de sécurité pour la démo.
  // Bypass complet du batch : un seul appel réseau ciblé, indépendant
  // de l'état de chargement du tableau des 800 utilisateurs.
  const [quickSearchId, setQuickSearchId] = useState('');
  const [quickSearchLoading, setQuickSearchLoading] = useState(false);

  const loadAllIntelligence = useCallback(async (isCancelled = () => false) => {
    setLoading(true);
    setError(null);

    try {
      setLoadingProgress(prev => ({ ...prev, stats: true }));
      const dashboardStats = await adminService.getDashboardStats();
      if (isCancelled()) return;
      setAnalyticsData({
        totalUsers: dashboardStats.totalUsers,
        activeRecipes: dashboardStats.activeRecipes,
        totalComments: dashboardStats.totalComments || 0,
        avgRating: dashboardStats.avgRating || 0
      });
      setRfmStats(dashboardStats.rfm);
      setLoadingProgress(prev => ({ ...prev, stats: false }));

      // Charger les utilisateurs de base (moyen)
      setLoadingProgress(prev => ({ ...prev, users: true }));
      const basicUsers = await adminService.getAllUsers();
      if (isCancelled()) return;
      setUsers(basicUsers);
      setLoadingProgress(prev => ({ ...prev, users: false }));

      // ✅ Priorise les comptes démo en tête de liste : ils passent dans
      // le premier lot de 40 au lieu d'attendre leur tour parmi ~800 users.
      const prioritizedUsers = [
        ...basicUsers.filter(u => DEMO_IDS.includes(u.id)),
        ...basicUsers.filter(u => !DEMO_IDS.includes(u.id))
      ];

      // Enrichir avec les comportements 
      setLoadingProgress(prev => ({ ...prev, behaviors: true }));
      try {
        await enrichUsersWithBehavior(prioritizedUsers, setEnrichedUsers);
      } finally {
        if (!isCancelled()) {
          setLoadingProgress(prev => ({ ...prev, behaviors: false }));
        }
      }

    } catch (err) {
      if (!isCancelled()) {
        console.error('Erreur lors du chargement:', err);
        setError(`Erreur serveur: ${err.message}`);
      }
    } finally {
      if (!isCancelled()) {
        setLoading(false);
      }
    }
  }, []);

  // Enrichissement optimisé des utilisateurs avec comportement
  // ✅ Le NLP est retiré du chargement initial : c'est probablement lui qui
  // plombe les 800 requêtes (LLM local via Ollama = plusieurs secondes/appel).
  // Il est désormais chargé à la demande via handleLoadNlp, clic par clic.
  const enrichUsersWithBehavior = async (baseUsers, onBatchDone) => {
  const batchSize = 40; 
  const enriched = [];

  for (let i = 0; i < baseUsers.length; i += batchSize) {
    const batch = baseUsers.slice(i, i + batchSize);

    const batchPromises = batch.map(async (user) => {
      try {
        const behaviorData = await userBehaviorService.getAdvancedAnalysis(user.id);

        return {
          ...user,
          ai: behaviorData,
          nlp: null // chargé à la demande, voir handleLoadNlp
        };
      } catch (err) {
              console.error(`Erreur chargement NLP pour user ${user.id}:`, err);
        return {
          ...user,
          ai: {
            comportementBase: { metriques: { scoreEngagement: 0, profilUtilisateur: 'NOUVEAU' } },
            analyticsAvances: { risqueChurn: { score: 0 }, scoreRFM: { segment: 'N/A' } }
          },
          nlp: null
        };
      }
    });

    const batchResults = await Promise.all(batchPromises);
    enriched.push(...batchResults);
    onBatchDone?.([...enriched]); 
  }

  return enriched;
};

  // ✅ Chargement du NLP à la demande, pour un seul utilisateur à la fois
  const handleLoadNlp = useCallback(async (userId) => {
    try {
      const nlpData = await adminService.getUserNlpInsight(userId);
      setEnrichedUsers(prev =>
        prev.map(u => (u.id === userId ? { ...u, nlp: nlpData } : u))
      );
    } catch (err) {
      console.error(`Erreur chargement NLP pour user ${userId}:`, err);
    }
  }, []);

  // ✅ Recherche rapide par ID : un seul appel réseau ciblé, sans attendre
  // le batch complet. Utile si le tableau est encore en train de charger
  // le jour de la soutenance.
  const handleQuickSearch = useCallback(async () => {
    const id = quickSearchId.trim();
    if (!id) return;

    setQuickSearchLoading(true);
    setError(null);
    try {
      const numericId = Number(id);
      const baseUser = users.find(u => String(u.id) === id) || { id: numericId };
      const behaviorData = await userBehaviorService.getAdvancedAnalysis(id);
      const nlpData = await adminService.getUserNlpInsight(id).catch(() => null);

      const userEntry = { ...baseUser, ai: behaviorData, nlp: nlpData };

      setEnrichedUsers(prev => {
        const exists = prev.some(u => String(u.id) === id);
        return exists
          ? prev.map(u => (String(u.id) === id ? userEntry : u))
          : [userEntry, ...prev];
      });
    } catch (err) {
      console.error('Erreur recherche rapide:', err);
      setError(`Utilisateur ${id} introuvable ou erreur: ${err.message}`);
    } finally {
      setQuickSearchLoading(false);
    }
  }, [quickSearchId, users]);

  // Rechargement rapide (utilisateurs uniquement)
  const quickReload = useCallback(async () => {
    try {
      const basicUsers = await adminService.getAllUsers();
      setUsers(basicUsers);
      
      setAnalyticsData(prev => ({
        ...prev,
        totalUsers: basicUsers.length,
        activeRecipes: basicUsers.reduce((acc, u) => acc + (u.recettesCount || 0), 0)
      }));
    } catch (err) {
      console.error('Erreur rechargement rapide:', err);
    }
  }, []);

  
  useEffect(() => {
    if (authLoading) return;

    if (!currentUser) {
      navigate('/login');
      return;
    }

    const isAdmin = isAdminRole(currentUser?.role);

    if (!isAdmin) {
      navigate('/');
      return;
    }

    let cancelled = false;
    loadAllIntelligence(() => cancelled);

    return () => {
      cancelled = true;
    };
  }, [currentUser, authLoading, navigate, loadAllIntelligence]);

  // Logique de tri optimisée
  const sortedUsers = React.useMemo(() => {
    const usersToSort = enrichedUsers.length > 0 ? enrichedUsers : users;
    
    return [...usersToSort].sort((a, b) => {
      if (sortBy === 'churn') {
        const aChurn = a.ai?.analyticsAvances?.risqueChurn?.score || 0;
        const bChurn = b.ai?.analyticsAvances?.risqueChurn?.score || 0;
        return bChurn - aChurn;
      }
      
      if (sortBy === 'engagement') {
        const aScore = a.ai?.comportementBase?.metriques?.scoreEngagement || 0;
        const bScore = b.ai?.comportementBase?.metriques?.scoreEngagement || 0;
        return bScore - aScore;
      }
      
      return (a.nom || '').localeCompare(b.nom || '');
    });
  }, [enrichedUsers, users, sortBy]);

  // ✅ Filtre réellement l'affichage (par ID, nom, prénom ou email) —
  // en plus de handleQuickSearch qui va chercher un utilisateur manquant.
  // Le filtre s'applique en tapant, indépendamment du clic sur "Go".
  const displayedUsers = React.useMemo(() => {
    const term = quickSearchId.trim().toLowerCase();
    if (!term) return sortedUsers;

    return sortedUsers.filter(u => {
      const idMatch = String(u.id).toLowerCase().includes(term);
      const nameMatch = `${u.prenom || ''} ${u.nom || ''}`.toLowerCase().includes(term);
      const emailMatch = (u.email || '').toLowerCase().includes(term);
      return idMatch || nameMatch || emailMatch;
    });
  }, [sortedUsers, quickSearchId]);


  // Indicateur de progression
  const ProgressIndicator = () => {
    if (!loading && !Object.values(loadingProgress).some(v => v)) return null;

    return (
      <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 border-l-4 border-orange-500 z-50">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
          <div>
            <p className="font-bold text-sm text-slate-800">Chargement en cours...</p>
            <div className="text-xs text-slate-500 space-y-1 mt-1">
              {loadingProgress.stats && <div>✓ Statistiques globales</div>}
              {loadingProgress.users && <div>→ Utilisateurs ({users.length})</div>}
              {loadingProgress.behaviors && (
                <div>→ Analyse comportementale ({enrichedUsers.length}/{users.length})</div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Écrans de chargement
  if (authLoading || (loading && users.length === 0)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
        <p className="text-slate-600 font-bold animate-pulse text-center">
          Vérification des accès Admin...<br/>
          <span className="text-xs font-normal text-slate-400">
            Synchronisation MySQL & MongoDB
          </span>
        </p>
      </div>
    );
  }

  if (!currentUser || !currentUser.role?.toUpperCase().includes('ADMIN')) {
    return null;
  }

  const TABS = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart },
    { id: 'recommendations', label: 'Recommandations IA', icon: Sparkles },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'recipes', label: 'Recettes', icon: Settings },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  ];

  return (
    <div className="bg-slate-50 min-h-screen p-4 md:p-8">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="text-orange-500" size={24} />
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Admin Intelligence
            </h1>
          </div>
          <p className="text-slate-500 text-sm">
            Vue unifiée des données relationnelles et comportementales
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={quickReload}
            className="p-3 bg-white border rounded-2xl shadow-sm hover:bg-slate-50 transition-all"
          >
            <RefreshCw size={20} className="text-slate-600" />
          </button>

          <button 
            onClick={() => loadAllIntelligence()}
            className="p-3 bg-orange-500 text-white rounded-2xl shadow-sm hover:bg-orange-600 transition-all"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </header>

      {/* TABS NAVIGATION */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-4 overflow-x-auto">
          {TABS.map(tab => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      <ProgressIndicator />

      {/* CONTENT BY TAB */}
      <main className="max-w-[1800px] mx-auto">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {activeTab === 'dashboard' && (
          <>
            <StatsOverview data={analyticsData} />
            <RFMVisualizer stats={rfmStats} />
            
            <div className="flex gap-6 overflow-x-auto pb-4 mb-8">
              <UserManagementColumn users={users} onReload={quickReload} />
              <RecipeManagementColumn users={users} />
              <AnalyticsColumn users={users} />
            </div>

            {/* Tableau utilisateurs */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden relative">
              {loadingProgress.behaviors && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="animate-spin text-orange-500 mx-auto mb-2" />
                    <p className="text-xs text-slate-600">
                      Enrichissement IA ({enrichedUsers.length}/{users.length})
                    </p>
                  </div>
                </div>
              )}
              
              <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                <h3 className="font-bold text-slate-800">
                  Utilisateurs enrichis IA
                  {quickSearchId.trim() && (
                    <span className="ml-2 text-xs font-normal text-slate-400">
                      ({displayedUsers.length} résultat{displayedUsers.length > 1 ? 's' : ''})
                    </span>
                  )}
                </h3>

                <div className="flex items-center gap-3 flex-wrap">
                  {/* ✅ Recherche rapide par ID — filet de sécurité démo */}
                  <div className="flex items-center gap-1 border border-slate-200 rounded-lg px-2 py-1.5 bg-white">
                    <Search size={14} className="text-slate-400" />
                    <input
                      type="text"
                      value={quickSearchId}
                      onChange={(e) => setQuickSearchId(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleQuickSearch()}
                      placeholder="Filtrer par ID, nom, email…"
                      className="text-sm outline-none w-40"
                    />
                    <button
                      onClick={handleQuickSearch}
                      disabled={quickSearchLoading}
                      title="Aller chercher cet utilisateur sur le serveur s'il n'apparaît pas déjà dans la liste ci-dessous"
                      className="text-xs font-bold text-orange-600 px-2 py-1 hover:bg-orange-50 rounded-md disabled:opacity-50"
                    >
                      {quickSearchLoading ? '...' : 'Go'}
                    </button>
                  </div>

                  <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-sm border border-slate-200 rounded-lg px-3 py-2"
                  >
                    <option value="engagement">🔥 Engagement</option>
                    <option value="churn">⚠️ Risque Churn</option>
                    <option value="name">👤 Nom</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50/50 border-b border-slate-100">
                    <tr>
                      <th className="p-5 text-[10px] font-black text-slate-400 uppercase">Utilisateur</th>
                      <th className="p-5 text-[10px] font-black text-slate-400 uppercase text-center">Engagement</th>
                      <th className="p-5 text-[10px] font-black text-slate-400 uppercase text-center">Churn</th>
                      <th className="p-5 text-[10px] font-black text-slate-400 uppercase">Profil</th>
                      <th className="p-5 text-[10px] font-black text-slate-400 uppercase text-center">Score</th>
                      <th className="p-5 text-[10px] font-black text-slate-400 uppercase">Recettes</th>
                      <th className="p-5 text-[10px] font-black text-slate-400 uppercase text-right">Actions</th>
                      <th className="p-5 text-[10px] font-black text-slate-400 uppercase"> 🧠 NLP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedUsers.length === 0 && (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-sm text-slate-400">
                          Aucun utilisateur ne correspond à « {quickSearchId} » dans la liste déjà chargée.
                          Clique sur <span className="font-bold text-orange-500">Go</span> pour aller le chercher directement sur le serveur.
                        </td>
                      </tr>
                    )}
                    {displayedUsers.map((user) => {
  // 1. On récupère le score brut d'engagement du backend
  const rawScore = user.ai?.comportementBase?.metriques?.scoreEngagement ?? 0;
  
  // 2. On calcule le pourcentage d'engagement (capé proprement à 100% max)
  const engagement = Math.min(rawScore * 10, 100);
  
  const churn = user.ai?.analyticsAvances?.risqueChurn?.score || 0;
  
  // 3. Filet de sécurité démo : Recalculer dynamiquement le profil si le backend 
  // n'a pas mis à jour le champ profilUtilisateur en adéquation avec le score brut
  let profil = user.ai?.comportementBase?.metriques?.profilUtilisateur || 'NOUVEAU';
  if (rawScore > 6.0) profil = 'FIDELE';
  else if (rawScore > 4.0) profil = 'ACTIF';
  else if (rawScore > 2.0) profil = 'OCCASIONNEL';
  else if (rawScore > 0) profil = 'DEBUTANT';

  return (
    <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50/80">
      <td className="p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400">
            {user.prenom?.[0]}{user.nom?.[0]}
          </div>
          <div>
            <p className="font-bold text-slate-800">{user.prenom} {user.nom}</p>
            <p className="text-[11px] text-slate-400">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="p-5 text-center">
        <div className="flex flex-col items-center gap-1">
          <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="bg-orange-500 h-full" style={{ width: `${engagement}%` }} />
          </div>
          {/* Correction ici : On affiche le pourcentage capé à 100% */}
          <span className="text-[10px] font-black text-slate-500">{Math.round(engagement)}%</span>
        </div>
      </td>
      <td className="p-5 text-center">
        <span className={`text-xs font-black px-2 py-1 rounded-md ${
          churn > 50 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
        }`}>
          {Math.round(churn)}%
        </span>
      </td>
      <td className="p-5">
        <span className="px-3 py-1 bg-white border text-[10px] font-bold text-slate-600 rounded-lg uppercase">
          {profil}
        </span>
      </td>
      <td className="p-5 text-center">
        <span className="text-sm font-black text-slate-700">{rawScore.toFixed(1)}</span>
      </td>
      <td className="p-5">
        <span className="text-sm font-bold text-slate-700">{user.recettesCount || 0}</span>
      </td>
      <td className="p-5 text-right">
        <AIQuickActions
            userId={user.id}
            userName={user.prenom}
            nlp={user.nlp}
          />
      </td>
      <td className="p-5 max-w-[220px]">
        {user.nlp ? (
          <div className="space-y-1">
            <p className="text-xs text-slate-700 font-semibold line-clamp-2">
              {user.nlp.summary}
            </p>
            <div className="flex flex-wrap gap-1">
              {user.nlp.keywords?.slice(0, 3).map(k => (
                <span
                  key={k}
                  className="text-[9px] px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full font-bold"
                >
                  {k}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <button
            onClick={() => handleLoadNlp(user.id)}
            className="text-[10px] italic text-orange-500 hover:text-orange-600 hover:underline"
          >
            Charger l'analyse NLP
          </button>
        )}
      </td>
    </tr>
  );
})}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'recommendations' && (
          <RecommendationAdminPanel adminService={adminService} />
        )}

        {activeTab === 'users' && (
          <UserManagement adminService={adminService} />
        )}

        {activeTab === 'recipes' && (
          <RecipeAdminPanel adminService={adminService} />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsPanel adminService={adminService} />
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;