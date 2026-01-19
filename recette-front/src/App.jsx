import { useContext } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AboutUs from './components/about/AboutUs';
import Contact from './components/about/Contact';
import Team from './components/about/Team';
import Footer from './components/layout/Footer';
import Navbar from './components/layout/Navbar';
import LegalNotice from './components/legals/LegalNotice';
import PrivacyPolicy from './components/legals/PrivacyPolicy';
import TermsOfService from './components/legals/TermsOfService';
import { AuthContext } from './context/AuthContext';
import { AuthProvider } from './context/AuthProvider';
import AdminDashboard from './pages/AdminDashboard';
import Favorites from './pages/Favorites';
import Home from './pages/Home';
import LoginPage from './pages/Login';
import NotFoundPage from './pages/NotFound';
import ProfilePage from './pages/Profile';
import RecipeDetailsPage from './pages/RecipeDetails';
import Recipes from './pages/Recipes';
import RecommendationsPage from './pages/recommendationsPage.jsx';
import RegisterPage from './pages/Register';
import SearchHistoryPage from './pages/SearchHistoryPage';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('auth_token');
  return token ? children : <Navigate to="/login" />;
};

const AdminProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useContext(AuthContext);
  const token = localStorage.getItem('auth_token'); 

  // On attend que l'AuthContext ait fini de charger
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  }

  // Vérification du token physique
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Vérification du rôle admin
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

              <Route
                path="/search-history"
                element={
                  <ProtectedRoute>
                    <SearchHistoryPage />
                  </ProtectedRoute>
                }
              />

              {/* UNE SEULE ROUTE pour les recommandations IA */}
              <Route
                path="/recommendations"
                element={
                  <ProtectedRoute>
                    <RecommendationsPage />
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