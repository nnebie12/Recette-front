import { Lock } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="bg-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center space-x-3 mb-8">
          <Lock className="w-8 h-8 text-orange-500" />
          <h1 className="text-3xl font-bold text-gray-900">Politique de Confidentialité</h1>
        </div>

        <div className="prose prose-orange text-gray-600 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-800">Collecte des données</h2>
            <p>Nous collectons les informations que vous nous fournissez directement : nom, email et préférences alimentaires pour personnaliser vos recommandations via notre IA.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800">Utilisation de l'IA</h2>
            <p>Vos préférences sont traitées de manière anonymisée par nos services d'intelligence artificielle pour générer des suggestions de recettes pertinentes.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800">Vos droits (RGPD)</h2>
            <p>Conformément à la réglementation, vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles depuis votre espace profil.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;