import { ArrowRight, ChefHat, Clock, Star, TrendingUp } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import RecipeList from '../components/recipe/RecipeList';
import { AuthContext } from '../context/AuthContext';
import { recipeService } from '../services/recipeService';

const Home = () => {
  const { currentUser } = useContext(AuthContext);
  const [recentRecipes, setRecentRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentRecipes();
  }, []);

  const loadRecentRecipes = async () => {
    try {
      const recipes = await recipeService.getAllRecipes();
      // Get the 8 most recent recipes
      const sorted = recipes.sort((a, b) => 
        new Date(b.dateCreation) - new Date(a.dateCreation)
      );
      setRecentRecipes(sorted.slice(0, 8));
    } catch (error) {
      console.error('Error loading recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <ChefHat className="w-20 h-20" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Bienvenue sur RecipeApp
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Découvrez, partagez et savourez des milliers de recettes
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {currentUser ? (
                <>
                  <Link to="/recipes">
                    <Button variant="secondary" size="lg">
                      Explorer les recettes
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Link to="/recommendations">
                    <Button variant="ghost" size="lg" className="text-white border-white hover:bg-white/10">
                      <TrendingUp className="mr-2 w-5 h-5" />
                      Mes recommandations
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register">
                    <Button variant="secondary" size="lg">
                      Commencer gratuitement
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Link to="/recipes">
                    <Button variant="ghost" size="lg" className="text-white border-white hover:bg-white/10">
                      Découvrir les recettes
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pourquoi choisir RecipeApp ?
            </h2>
            <p className="text-gray-600">
              Une expérience culinaire unique avec des fonctionnalités innovantes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Recommandations IA</h3>
              <p className="text-gray-600">
                Recevez des suggestions personnalisées basées sur vos goûts et habitudes
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Recettes rapides</h3>
              <p className="text-gray-600">
                Filtrez par temps de préparation et trouvez la recette parfaite
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Communauté active</h3>
              <p className="text-gray-600">
                Partagez vos avis et découvrez les recettes les mieux notées
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Recipes Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Recettes récentes
              </h2>
              <p className="text-gray-600">
                Découvrez les dernières créations de notre communauté
              </p>
            </div>
            <Link to="/recipes">
              <Button variant="outline">
                Voir tout
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <Loading />
          ) : (
            <RecipeList recipes={recentRecipes} />
          )}
        </div>
      </section>

      {/* CTA Section */}
      {!currentUser && (
        <section className="py-16 bg-gradient-to-r from-orange-500 to-red-500">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Prêt à commencer votre aventure culinaire ?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Rejoignez des milliers de passionnés de cuisine
            </p>
            <Link to="/register">
              <Button variant="secondary" size="lg">
                Créer mon compte gratuitement
              </Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;