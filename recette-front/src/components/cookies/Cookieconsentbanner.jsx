import { ChevronDown, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useGDPRConsent } from '../../hooks/useGDPRConsent';

/**
 * Composant Cookie Consent Banner
 * Conforme RGPD Art. 5, 6, 7
 * - Consentement explicite et granulaire
 * - Option "Accepter tout" et "Rejeter tout"
 * - Détails transparents par catégorie
 */
const CookieConsentBanner = () => {
  const { consentGiven, consents, acceptAll, rejectAll, saveConsents, updateConsent } =
    useGDPRConsent();

  const [showDetails, setShowDetails] = useState(false);
  const [localConsents, setLocalConsents] = useState(consents);

  useEffect(() => {
    setLocalConsents(consents);
  }, [consents]);

  // Ne pas afficher si déjà consenti
  if (consentGiven && !showDetails) {
    return null;
  }

  const handleToggle = (type) => {
    if (type === 'necessary') return; // Impossible de désactiver
    setLocalConsents((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleSavePreferences = () => {
    saveConsents(localConsents);
    setShowDetails(false);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-orange-500 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {!showDetails ? (
          // Vue simple - acceptation rapide
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-2">
                🍪 Respect de votre vie privée
              </h3>
              <p className="text-sm text-gray-600">
                Nous utilisons des cookies pour améliorer votre expérience. 
                Les cookies essentiels sont toujours activés. 
                <button
                  onClick={() => setShowDetails(true)}
                  className="ml-1 text-orange-600 hover:text-orange-700 font-semibold underline"
                >
                  Personnaliser
                </button>
              </p>
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={rejectAll}
                className="flex-1 sm:flex-none px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors text-sm"
              >
                Refuser
              </button>
              <button
                onClick={acceptAll}
                className="flex-1 sm:flex-none px-4 py-2 text-white bg-orange-600 hover:bg-orange-700 rounded-lg font-medium transition-colors text-sm"
              >
                Accepter tout
              </button>
            </div>
          </div>
        ) : (
          // Vue détaillée - personnalisation granulaire
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                Préférences de consentement
              </h2>
              <button
                onClick={() => setShowDetails(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Consentements granulaires */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              
              {/* Essentiels - toujours actifs */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      🔒 Cookies essentiels
                    </h4>
                    <p className="text-sm text-gray-600">
                      Obligatoires pour le fonctionnement du site (authentification, sécurité, sessions)
                    </p>
                  </div>
                  <div className="ml-4">
                    <input
                      type="checkbox"
                      checked={true}
                      disabled
                      className="w-5 h-5 text-blue-600 cursor-not-allowed"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Toujours actif</p>
              </div>

              {/* Analytics */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      📊 Cookies d'analyse
                    </h4>
                    <p className="text-sm text-gray-600">
                      Nous aident à comprendre comment vous utilisez le site 
                      (pages visitées, durée, interactions). Anonymisé et sans ID personnel.
                    </p>
                  </div>
                  <div className="ml-4">
                    <input
                      type="checkbox"
                      checked={localConsents.analytics}
                      onChange={() => handleToggle('analytics')}
                      className="w-5 h-5 text-orange-600 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Marketing */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      📢 Cookies marketing
                    </h4>
                    <p className="text-sm text-gray-600">
                      Permettent de personnaliser les publicités et offres en fonction 
                      de vos intérêts culinaires.
                    </p>
                  </div>
                  <div className="ml-4">
                    <input
                      type="checkbox"
                      checked={localConsents.marketing}
                      onChange={() => handleToggle('marketing')}
                      className="w-5 h-5 text-orange-600 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Préférences */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      ⚙️ Cookies de préférences
                    </h4>
                    <p className="text-sm text-gray-600">
                      Mémorisent vos choix (langue, thème, filtres) pour une meilleure 
                      expérience utilisateur.
                    </p>
                  </div>
                  <div className="ml-4">
                    <input
                      type="checkbox"
                      checked={localConsents.preferences}
                      onChange={() => handleToggle('preferences')}
                      className="w-5 h-5 text-orange-600 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Liens légaux */}
            <div className="text-xs text-gray-500 space-y-1">
              <p>
                Pour en savoir plus : {' '}
                <a href="/privacy" className="text-orange-600 hover:underline">
                  Politique de confidentialité
                </a>
                {' '} • {' '}
                <a href="/gdpr" className="text-orange-600 hover:underline">
                  Vos droits RGPD
                </a>
              </p>
            </div>

            {/* Boutons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={rejectAll}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Rejeter tout
              </button>
              <button
                onClick={acceptAll}
                className="flex-1 px-4 py-2 text-white bg-orange-500 hover:bg-orange-600 rounded-lg font-medium transition-colors"
              >
                Accepter tout
              </button>
              <button
                onClick={handleSavePreferences}
                className="flex-1 px-4 py-2 text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg font-medium transition-colors border border-orange-200"
              >
                Enregistrer les préférences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CookieConsentBanner;