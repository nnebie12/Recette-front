import { BookOpen, ChefHat, ChevronDown, Clock, Heart, Home, LogOut, Menu, TrendingUp, User, X } from 'lucide-react';
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [recipesMenuOpen, setRecipesMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <ChefHat className="w-8 h-8 text-orange-500" />
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              RecetteApp
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-2 text-gray-700 hover:text-orange-500 transition-colors">
              <Home className="w-5 h-5" />
              <span>Accueil</span>
            </Link>

            {/* Menu déroulant Recettes */}
            <div 
              className="relative"
              onMouseEnter={() => setRecipesMenuOpen(true)}
              onMouseLeave={() => setRecipesMenuOpen(false)}
            >
              <button className="flex items-center space-x-2 text-gray-700 hover:text-orange-500 transition-colors">
                <BookOpen className="w-5 h-5" />
                <span>Recettes</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {recipesMenuOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 border border-gray-200">
                  <Link
                    to="/recipes"
                    className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition"
                  >
                    📚 Toutes les recettes
                  </Link>
                  
                  <div className="border-t my-2"></div>
                  
                  <div className="px-4 py-1 text-xs font-semibold text-gray-500 uppercase">
                    Par pays
                  </div>
                  <Link to="/recipes?cuisine=francaise" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition">
                    🇫🇷 Française
                  </Link>
                  <Link to="/recipes?cuisine=italienne" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition">
                    🇮🇹 Italienne
                  </Link>
                  <Link to="/recipes?cuisine=japonaise" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition">
                    🇯🇵 Japonaise
                  </Link>
                  <Link to="/recipes?cuisine=mexicaine" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition">
                    🇲🇽 Mexicaine
                  </Link>
                  
                  <div className="border-t my-2"></div>
                  
                  <div className="px-4 py-1 text-xs font-semibold text-gray-500 uppercase">
                    Par type
                  </div>
                  <Link to="/recipes?type=entree" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition">
                    🥗 Entrées
                  </Link>
                  <Link to="/recipes?type=plat" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition">
                    🍽️ Plats
                  </Link>
                  <Link to="/recipes?type=dessert" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition">
                    🍰 Desserts
                  </Link>
                  
                  <div className="border-t my-2"></div>
                  
                  <Link to="/recipes?diet=vegetarien" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition">
                    🌱 Végétarien
                  </Link>
                </div>
              )}
            </div>

            {currentUser && (
              <>
                <Link to="/favorites" className="flex items-center space-x-2 text-gray-700 hover:text-orange-500 transition-colors">
                  <Heart className="w-5 h-5" />
                  <span>Favoris</span>
                </Link>
                <Link to="/recommendations" className="flex items-center space-x-2 text-gray-700 hover:text-orange-500 transition-colors">
                  <TrendingUp className="w-5 h-5" />
                  <span>Recommandations</span>
                </Link>
                <Link to="/search-history" className="flex items-center space-x-2 text-gray-700 hover:text-orange-500 transition-colors">
                  <Clock className="w-5 h-5" />
                  <span>Historique</span>
                </Link>
              </>
            )}
          </div>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 px-4 py-2 bg-orange-50 rounded-full hover:bg-orange-100 transition-colors"
                >
                  <User className="w-5 h-5 text-orange-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {currentUser.prenom || currentUser.nom}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-700" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User className="w-4 h-4 inline mr-2" />
                      Mon Profil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="w-4 h-4 inline mr-2" />
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="px-4 py-2 text-orange-500 hover:text-orange-600 font-medium">
                  Connexion
                </Link>
                <Link to="/register" className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium">
                  Inscription
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-700 hover:text-orange-500"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-2">
              <Link to="/" className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                <Home className="w-5 h-5" />
                <span>Accueil</span>
              </Link>
              <Link to="/recipes" className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                <BookOpen className="w-5 h-5" />
                <span>Recettes</span>
              </Link>

              {currentUser && (
                <>
                  <Link to="/favorites" className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                    <Heart className="w-5 h-5" />
                    <span>Favoris</span>
                  </Link>
                  <Link to="/recommendations" className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                    <TrendingUp className="w-5 h-5" />
                    <span>Recommandations</span>
                  </Link>
                  <Link to="/search-history" className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                    <Clock className="w-5 h-5" />
                    <span>Historique</span>
                  </Link>
                  <Link to="/profile" className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                    <User className="w-5 h-5" />
                    <span>Mon Profil</span>
                  </Link>
                  <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="w-full flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                    <LogOut className="w-5 h-5" />
                    <span>Déconnexion</span>
                  </button>
                </>
              )}

              {!currentUser && (
                <div className="px-4 py-2 space-y-2">
                  <Link to="/login" className="block w-full text-center px-4 py-2 text-orange-500 border border-orange-500 rounded-lg hover:bg-orange-50" onClick={() => setMobileMenuOpen(false)}>
                    Connexion
                  </Link>
                  <Link to="/register" className="block w-full text-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600" onClick={() => setMobileMenuOpen(false)}>
                    Inscription
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;