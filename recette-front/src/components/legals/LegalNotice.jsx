import { Scale } from 'lucide-react';

const LegalNotice = () => {
  return (
    <div className="bg-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center space-x-3 mb-8">
          <Scale className="w-8 h-8 text-orange-500" />
          <h1 className="text-3xl font-bold text-gray-900">Mentions Légales</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-600">
          <div className="p-6 border border-gray-100 rounded-xl bg-gray-50">
            <h2 className="font-bold text-gray-800 mb-2">Éditeur du site</h2>
            <p>RecipeApp SAS</p>
            <p>123 Avenue de la Cuisine</p>
            <p>75000 Paris, France</p>
            <p>Email: contact@RecipeApp.com</p>
          </div>

          <div className="p-6 border border-gray-100 rounded-xl bg-gray-50">
            <h2 className="font-bold text-gray-800 mb-2">Hébergement</h2>
            <p>Hébergé par : CloudService Inc.</p>
            <p>Région : Europe (Paris)</p>
          </div>

          <div className="md:col-span-2 p-6 border border-gray-100 rounded-xl bg-gray-50">
            <h2 className="font-bold text-gray-800 mb-2">Crédits</h2>
            <p>Icônes : Lucide React</p>
            <p>Intelligence Artificielle : Google Gemini API</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalNotice;