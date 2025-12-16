import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Recipes from './pages/Recipes';
import RecipeDetailsPage from './pages/RecipeDetails';
import Favorites from './pages/Favorites';
import Recommendations from './pages/Recommendations';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import ProfilePage from './pages/Profile';
import NotFoundPage from './pages/NotFound';
import AdminDashboard from './pages/AdminDashboard';
import { AuthContext } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('auth_token');
  return token ? children : <Navigate to="/login" />;
};

const AdminProtectedRoute = ({ children }) => {
  const { currentUser, loading } = React.useContext(AuthContext); 

  if (loading) {
    return <div className="text-center py-10">Vérification des droits...</div>; 
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Correction: Vérification plus flexible du rôle admin
  const isAdmin = currentUser.role && 
    (currentUser.role.toUpperCase() === 'ADMIN' || 
     currentUser.role.toUpperCase() === 'ADMINISTRATEUR');

  if (!isAdmin) {
    console.log('Accès refusé - Rôle actuel:', currentUser.role);
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/recipes" element={<Recipes />} />
              <Route path="/recipes/:id" element={<RecipeDetailsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected Routes */}
              <Route
                path="/favorites"
                element={
                  <ProtectedRoute>
                    <Favorites />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recommendations"
                element={
                  <ProtectedRoute>
                    <Recommendations />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <AdminProtectedRoute>
                    <AdminDashboard />
                  </AdminProtectedRoute>
                }
              />
              {/* 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;