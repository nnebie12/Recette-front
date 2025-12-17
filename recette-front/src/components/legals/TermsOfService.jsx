import { ShieldCheck } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="bg-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center space-x-3 mb-8">
          <ShieldCheck className="w-8 h-8 text-orange-500" />
          <h1 className="text-3xl font-bold text-gray-900">Conditions d'Utilisation</h1>
        </div>
        
        <div className="prose prose-orange text-gray-600 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-800">1. Acceptation des conditions</h2>
            <p>En accédant à RecipeApp, vous acceptez d'être lié par les présentes conditions d'utilisation et toutes les lois et réglementations applicables.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800">2. Utilisation du Service</h2>
            <p>Vous vous engagez à ne pas utiliser le service à des fins illégales. Vous êtes responsable du contenu que vous publiez (recettes, commentaires).</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800">3. Propriété Intellectuelle</h2>
            <p>Le contenu original de RecipeApp est la propriété exclusive de l'éditeur. Les recettes partagées par les utilisateurs restent leur propriété, mais ils accordent à RecipeApp une licence d'affichage.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;