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
import { ToastProvider } from './components/common/Toast';
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">Chargement...</div>
    );
  }

  if (!token) return <Navigate to="/login" replace />;

  const role = currentUser?.role?.toUpperCase() || '';
  const isAdmin = role === 'ADMIN' || role === 'ADMINISTRATEUR';

  if (!currentUser || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        {/* ToastProvider enveloppe toute l'app pour être disponible partout */}
        <ToastProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Routes publiques */}
                <Route path="/" element={<Home />} />
                <Route path="/recipes" element={<Recipes />} />
                <Route path="/recipes/:id" element={<RecipeDetailsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Routes légales */}
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/legal" element={<LegalNotice />} />

                {/* À propos */}
                <Route path="/about" element={<AboutUs />} />
                <Route path="/team" element={<Team />} />
                <Route path="/contact" element={<Contact />} />

                {/* Routes protégées */}
                <Route
                  path="/favorites"
                  element={<ProtectedRoute><Favorites /></ProtectedRoute>}
                />
                <Route
                  path="/search-history"
                  element={<ProtectedRoute><SearchHistoryPage /></ProtectedRoute>}
                />
                <Route
                  path="/recommendations"
                  element={<ProtectedRoute><RecommendationsPage /></ProtectedRoute>}
                />
                <Route
                  path="/profile"
                  element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}
                />
                <Route
                  path="/admin"
                  element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>}
                />

                {/* 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;