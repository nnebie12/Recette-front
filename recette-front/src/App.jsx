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
import AIRecommendationsPage from './pages/AIRecommendationsPage';
import TermsOfService from './components/legals/TermsOfService';
import PrivacyPolicy from './components/legals/PrivacyPolicy';
import LegalNotice from './components/legals/LegalNotice';
import AboutUs from './components/about/AboutUs';
import Team from './components/about/Team';
import Contact from './components/about/Contact';
import RecipeCatalog from './pages/RecipeCatalog';
import { useContext } from 'react';
import SearchHistoryPage from './pages/SearchHistoryPage';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('auth_token');
  return token ? children : <Navigate to="/login" />;
};

const AdminProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useContext(AuthContext);
  const token = localStorage.getItem('auth_token'); 

  // 1. On attend que l'AuthContext ait fini de charger
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  }

  // 2. Vérification du token physique
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 3. Vérification du rôle admin
  const role = currentUser?.role?.toUpperCase() || "";
  const isAdmin = role === 'ADMIN' || role === 'ADMINISTRATEUR';

  if (!currentUser || !isAdmin) {
    console.warn("Accès refusé : Profil non admin", role);
    return <Navigate to="/" replace />;
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
              <Route path="/catalog" element={<RecipeCatalog />} />
              <Route path="/recipes/:id" element={<RecipeDetailsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Legal Routes */}
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/legal" element={<LegalNotice />} />

              {/* About Routes */}
              <Route path="/about" element={<AboutUs />} />
              <Route path="/team" element={<Team />} />
              <Route path="/contact" element={<Contact />} />

              {/* Protected Routes */}
              <Route
                path="/favorites"
                element={
                  <ProtectedRoute>
                    <Favorites />
                  </ProtectedRoute>
                }
              />

              {/* Protected Routes */}
              <Route
                path="/search-history"
                element={
                  <ProtectedRoute>
                    <SearchHistoryPage />
                  </ProtectedRoute>
                }
              />

              {<Route
                path="/recommendations"
                element={
                  <ProtectedRoute>
                    <Recommendations />
                  </ProtectedRoute>
                }
              />}
              <Route 
              path="/recommendations/ai" 
              element={<AIRecommendationsPage 

              />} />

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