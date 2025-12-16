import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { adminService } from '../services/adminService';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/common/Loading';
import UserManagement from '../components/admin/UserManagement';
import RecipeAdminPanel from '../components/admin/RecipeAdminPanel'; 
import AnalyticsPanel from '../components/admin/AnalyticsPanel';

const TABS = {
  USERS: 'users',
  RECIPES: 'recipes',
  ANALYTICS: 'analytics',
};

const AdminDashboard = () => {
  const { currentUser, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(TABS.USERS);
  
  useEffect(() => {
    if (!authLoading) {
      // Vérification plus flexible du rôle
      const isAdmin = currentUser?.role && 
        (currentUser.role.toUpperCase() === 'ADMIN' || 
         currentUser.role.toUpperCase() === 'ADMINISTRATEUR');

      if (!currentUser || !isAdmin) {
        console.log('Redirection - Utilisateur non autorisé');
        navigate('/');
      } else {
        console.log('Accès autorisé - Rôle:', currentUser.role);
      }
    }
  }, [currentUser, authLoading, navigate]);

  if (authLoading) {
    return <Loading fullScreen message="Vérification des accès Administrateur..." />;
  }
  
  // Vérification du rôle admin
  const isAdmin = currentUser?.role && 
    (currentUser.role.toUpperCase() === 'ADMIN' || 
     currentUser.role.toUpperCase() === 'ADMINISTRATEUR');

  if (!currentUser || !isAdmin) {
    return null; 
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-8xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6">
          Tableau de Bord Administrateur
        </h1>
        
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <TabButton 
              name="Gestion des Utilisateurs" 
              tabId={TABS.USERS} 
              activeTab={activeTab} 
              onClick={setActiveTab} 
            />
            <TabButton 
              name="Gestion des Recettes" 
              tabId={TABS.RECIPES} 
              activeTab={activeTab} 
              onClick={setActiveTab} 
            />
            <TabButton 
              name="Analyse Comportementale" 
              tabId={TABS.ANALYTICS} 
              activeTab={activeTab} 
              onClick={setActiveTab} 
            />
          </nav>
        </div>

        <div>
          {activeTab === TABS.USERS && <UserManagement adminService={adminService} />}
          {activeTab === TABS.RECIPES && <RecipeAdminPanel adminService={adminService} />}
          {activeTab === TABS.ANALYTICS && <AnalyticsPanel adminService={adminService} />}
        </div>
        
      </div>
    </div>
  );
};

const TabButton = ({ name, tabId, activeTab, onClick }) => (
  <button
    onClick={() => onClick(tabId)}
    className={`${
      activeTab === tabId
        ? 'border-indigo-500 text-indigo-600'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
  >
    {name}
  </button>
);

export default AdminDashboard;