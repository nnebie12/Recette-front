import React, { useState, useEffect, useCallback, useContext } from 'react';
import { adminService } from '../services/adminService';
import { userBehaviorService } from '../services/userBehaviorService';
import AIQuickActions from '../components/admin/AIQuickActions';
import RFMVisualizer from '../components/admin/RFMVisualizer';
import { Loader2, AlertCircle, RefreshCw, Users, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AnalyticsColumn from '../components/admin/AnalyticsColumn';
import UserManagementColumn from '../components/admin/UserManagementColumn';
import RecipeManagementColumn from '../components/admin/RecipeManagementColumn';
import StatsOverview from '../components/admin/StatsOverview';


const AdminDashboard = () => {
  const { currentUser, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [users, setUsers] = useState([]);
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
  

  // 1. Définition de la fonction de chargement des données
  const loadAllIntelligence = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [mysqlUsers, globalData] = await Promise.all([
        adminService.getAllUsers(),
        userBehaviorService.getGlobalRFMStats()
      ]);

      const enrichedUsers = await Promise.all(
        mysqlUsers.map(async (u) => {
          try {
            const aiData = await userBehaviorService.getAdvancedAnalysis(u.id);
            return { ...u, ai: aiData };
          } catch (innerErr) {
            console.warn(`Données IA non trouvées pour ${u.id}:`, innerErr.message);
            return { ...u, ai: null };
          }
        })
      );

      setUsers(enrichedUsers);
      setRfmStats(globalData || { champions: 0, fidele: 0, risque: 0, nouveau: 0 });
    } catch (err) {
      setError(`Erreur serveur: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadUsers = async () => {
      try {
        const data = await adminService.getAllUsers();
        const usersArray = Array.isArray(data) ? data : [];
        setUsers(usersArray);
        
        setAnalyticsData({
          totalUsers: usersArray.length,
          activeRecipes: usersArray.reduce((acc, u) => acc + (u.recettesCount || 0), 0),
          totalComments: 150,
          avgRating: 4.6
        });
      } catch (err) {
        console.error('Error loading users:', err);
        setUsers([]);
      }
    };

  // 2. SÉCURITÉ : On vérifie l'accès AVANT de charger ou d'afficher quoi que ce soit
  useEffect(() => {
    if (authLoading) return;

    if (!currentUser) {
      navigate('/login');
      return;
    }

  const isAdmin = currentUser?.role && 
  (currentUser.role.toUpperCase() === 'ADMIN' || 
   currentUser.role.toUpperCase() === 'ADMINISTRATEUR');    if (!isAdmin) {
      navigate('/');
      return;
    }

    loadAllIntelligence();
  }, [currentUser, authLoading, navigate, loadAllIntelligence]);

  // 3. LOGIQUE DE TRI (Réactivée et sécurisée)
  const sortedUsers = [...users].sort((a, b) => {
    if (sortBy === 'churn') {
      return (b.ai?.metriques?.risqueChurn || 0) - (a.ai?.metriques?.risqueChurn || 0);
    }
    if (sortBy === 'engagement') {
      return (b.ai?.metriques?.scoreEngagement || 0) - (a.ai?.metriques?.scoreEngagement || 0);
    }
    return (a.nom || '').localeCompare(b.nom || '');
  });

  // 4. ÉCRANS D'ÉTAT (Chargement et Sécurité)
  if (authLoading || (loading && users.length === 0)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
        <p className="text-slate-600 font-bold animate-pulse text-center">
          Vérification des accès Admin...<br/>
          <span className="text-xs font-normal text-slate-400">Synchronisation MySQL & MongoDB</span>
        </p>
      </div>
    );
  }

  // Empêcher l'affichage si l'utilisateur n'est pas admin (pendant la redirection)
  if (!currentUser || !currentUser.role?.toUpperCase().includes('ADMIN')) return null;

  return (
    <div className="bg-slate-50 min-h-screen p-4 md:p-8">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="text-orange-500" size={24} />
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Intelligence</h1>
          </div>
          <p className="text-slate-500 text-sm">Vue unifiée des données relationnelles et comportementales</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={loadAllIntelligence} 
            className="p-3 bg-white border rounded-2xl shadow-sm hover:bg-slate-50 transition-all"
            title="Rafraîchir les données"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin text-orange-500' : 'text-slate-600'} />
          </button>

          <div className="flex-1 md:flex-none flex items-center bg-white p-2 rounded-2xl shadow-sm border px-4">
            <Users size={16} className="text-slate-400 mr-2" />
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-sm font-bold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="engagement">🔥 Trier par Engagement</option>
              <option value="churn">⚠️ Trier par Risque</option>
              <option value="name">👤 Trier par Nom</option>
            </select>
          </div>
        </div>
      </header>

      {/* Main Content */}
            <main className="max-w-[1800px] mx-auto px-6 py-8">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {error}
                </div>
              )}
      
              {/* Stats Overview */}
              <StatsOverview data={analyticsData} />
      
              {/* Kanban Board Layout */}
              <div className="flex gap-6 overflow-x-auto pb-4">
                <UserManagementColumn 
                  users={users} 
                  onReload={loadUsers}
                />
                
                <RecipeManagementColumn 
                  users={users}
                />
                
                <AnalyticsColumn 
                  users={users}
                />
              </div>
            </main>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700">
          <AlertCircle size={20} />
          <p className="text-sm font-bold">{error}</p>
        </div>
      )}

      {/* SEGMENTATION RFM */}
      <RFMVisualizer stats={rfmStats} />

      {/* TABLEAU DES UTILISATEURS */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden relative">
        {loading && users.length > 0 && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <Loader2 className="animate-spin text-orange-500" />
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Utilisateur</th>
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Engagement (IA)</th>
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Risque Churn</th>
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase">Profil</th>
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((user) => (
                <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400">
                        {user.prenom?.[0]}{user.nom?.[0]}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 leading-none mb-1">{user.prenom} {user.nom}</p>
                        <p className="text-[11px] text-slate-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="bg-orange-500 h-full transition-all duration-1000" 
                          style={{ width: `${user.ai?.metriques?.scoreEngagement || 0}%` }} 
                        />
                      </div>
                      <span className="text-[10px] font-black text-slate-500">{Math.round(user.ai?.metriques?.scoreEngagement || 0)}%</span>
                    </div>
                  </td>
                  <td className="p-5 text-center">
                    <span className={`text-xs font-black px-2 py-1 rounded-md ${
                      (user.ai?.metriques?.risqueChurn || 0) > 50 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                    }`}>
                      {Math.round(user.ai?.metriques?.risqueChurn || 0)}%
                    </span>
                  </td>
                  <td className="p-5">
                    <span className="px-3 py-1 bg-white border border-slate-100 text-[10px] font-bold text-slate-600 rounded-lg shadow-sm uppercase">
                      {user.ai?.metriques?.profilUtilisateur || 'Nouveau'}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <AIQuickActions userId={user.id} userName={user.prenom} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;