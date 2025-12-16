import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { adminService } from '../services/adminService';
import { useNavigate } from 'react-router-dom';
import { Users, ChefHat, TrendingUp, BarChart3, Calendar, Menu } from 'lucide-react';
import Loading from '../components/common/Loading';
import UserManagementColumn from '../components/admin/UserManagementColumn';
import RecipeManagementColumn from '../components/admin/RecipeManagementColumn';
import AnalyticsColumn from '../components/admin/AnalyticsColumn';
import StatsOverview from '../components/admin/StatsOverview';

const AdminDashboard = () => {
  const { currentUser, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analyticsData, setAnalyticsData] = useState({
    totalUsers: 0,
    activeRecipes: 0,
    totalComments: 0,
    avgRating: 0
  });

  useEffect(() => {
    if (!authLoading) {
      const isAdmin = currentUser?.role && 
        (currentUser.role.toUpperCase() === 'ADMIN' || 
         currentUser.role.toUpperCase() === 'ADMINISTRATEUR');

      if (!currentUser || !isAdmin) {
        navigate('/');
      } else {
        loadAllData();
      }
    }
  }, [currentUser, authLoading, navigate]);

  const loadAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      await loadUsers();
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

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

  if (authLoading || loading) {
    return <Loading fullScreen message="Chargement du tableau de bord..." />;
  }

  const isAdmin = currentUser?.role && 
    (currentUser.role.toUpperCase() === 'ADMIN' || 
     currentUser.role.toUpperCase() === 'ADMINISTRATEUR');

  if (!currentUser || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-orange-500 transition-colors">
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord Admin</h1>
                <p className="text-gray-500 text-sm">Gestion • Aujourd'hui</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="text-gray-900 font-semibold">
                  {currentUser?.prenom} {currentUser?.nom}
                </div>
                <div className="text-gray-500 text-xs">Administrateur</div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">
                  {currentUser?.prenom?.[0]}{currentUser?.nom?.[0]}
                </span>
              </div>
            </div>
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
    </div>
  );
};

export default AdminDashboard;