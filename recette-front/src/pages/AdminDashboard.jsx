import React, { useState, useEffect, useCallback, useContext } from 'react';
import { adminService } from '../services/adminService';
import { userBehaviorService } from '../services/userBehaviorService';
import AIQuickActions from '../components/admin/AIQuickActions';
import RFMVisualizer from '../components/admin/RFMVisualizer';
import RecommendationAdminPanel from '../components/admin/RecommandationAdminPanel';
import UserManagement from '../components/admin/UserManagement';
import RecipeAdminPanel from '../components/admin/RecipeAdminPanel';
import AnalyticsPanel from '../components/admin/AnalyticsPanel';
import { Loader2, AlertCircle, RefreshCw, Users, ShieldCheck, TrendingUp, Activity, Sparkles, Settings, BarChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AnalyticsColumn from '../components/admin/AnalyticsColumn';
import UserManagementColumn from '../components/admin/UserManagementColumn';
import RecipeManagementColumn from '../components/admin/RecipeManagementColumn';
import StatsOverview from '../components/admin/StatsOverview';

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

  const loadAllIntelligence = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Charger les statistiques globales (rapide)
      setLoadingProgress(prev => ({ ...prev, stats: true }));
      const dashboardStats = await adminService.getDashboardStats();
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
      setUsers(basicUsers);
      setLoadingProgress(prev => ({ ...prev, users: false }));

      // Enrichir avec les comportements (lent, en arrière-plan)
      setLoadingProgress(prev => ({ ...prev, behaviors: true }));
      const enriched = await enrichUsersWithBehavior(basicUsers);
      setEnrichedUsers(enriched);
      setLoadingProgress(prev => ({ ...prev, behaviors: false }));

    } catch (err) {
      console.error('Erreur lors du chargement:', err);
      setError(`Erreur serveur: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Enrichissement optimisé des utilisateurs avec comportement
  const enrichUsersWithBehavior = async (baseUsers) => {
    const batchSize = 5;
    const enriched = [];

    for (let i = 0; i < baseUsers.length; i += batchSize) {
      const batch = baseUsers.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (user) => {
        try {
          const behaviorData = await userBehaviorService.getAdvancedAnalysis(user.id);
          return { ...user, ai: behaviorData };
        } catch (err) {
          console.warn(`Comportement IA non disponible pour ${user.id}`, err.message);
          return { 
            ...user, 
            ai: { 
              metriques: { 
                scoreEngagement: 0, 
                risqueChurn: 0,
                profilUtilisateur: 'NOUVEAU' 
              } 
            } 
          };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      enriched.push(...batchResults);
    }

    return enriched;
  };

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

  // Sécurité et initialisation
  useEffect(() => {
    if (authLoading) return;

    if (!currentUser) {
      navigate('/login');
      return;
    }

    const isAdmin = currentUser?.role && 
      (currentUser.role.toUpperCase() === 'ADMIN' || 
       currentUser.role.toUpperCase() === 'ADMINISTRATEUR');
       
    if (!isAdmin) {
      navigate('/');
      return;
    }

    loadAllIntelligence();
  }, [currentUser, authLoading, navigate, loadAllIntelligence]);

  // Logique de tri optimisée
  const sortedUsers = React.useMemo(() => {
    const usersToSort = enrichedUsers.length > 0 ? enrichedUsers : users;
    
    return [...usersToSort].sort((a, b) => {
      if (sortBy === 'churn') {
        const aChurn = a.ai?.metriques?.risqueChurn || 0;
        const bChurn = b.ai?.metriques?.risqueChurn || 0;
        return bChurn - aChurn;
      }
      
      if (sortBy === 'engagement') {
        const aScore = a.ai?.metriques?.scoreEngagement || 0;
        const bScore = b.ai?.metriques?.scoreEngagement || 0;
        return bScore - aScore;
      }
      
      return (a.nom || '').localeCompare(b.nom || '');
    });
  }, [enrichedUsers, users, sortBy]);

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
            onClick={loadAllIntelligence}
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
              
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800">Utilisateurs enrichis IA</h3>
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

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50/50 border-b border-slate-100">
                    <tr>
                      <th className="p-5 text-[10px] font-black text-slate-400 uppercase">Utilisateur</th>
                      <th className="p-5 text-[10px] font-black text-slate-400 uppercase text-center">Engagement</th>
                      <th className="p-5 text-[10px] font-black text-slate-400 uppercase text-center">Churn</th>
                      <th className="p-5 text-[10px] font-black text-slate-400 uppercase">Profil</th>
                      <th className="p-5 text-[10px] font-black text-slate-400 uppercase">Recettes</th>
                      <th className="p-5 text-[10px] font-black text-slate-400 uppercase text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedUsers.map((user) => {
                      const engagement = user.ai?.metriques?.scoreEngagement || 0;
                      const churn = user.ai?.metriques?.risqueChurn || 0;
                      const profil = user.ai?.metriques?.profilUtilisateur || 'NOUVEAU';
                      
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
                          <td className="p-5">
                            <span className="text-sm font-bold text-slate-700">{user.recettesCount || 0}</span>
                          </td>
                          <td className="p-5 text-right">
                            <AIQuickActions userId={user.id} userName={user.prenom} />
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