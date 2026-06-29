import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileJson,
  FileText,
  Lock,
  LogOut,
  RefreshCw,
  Trash2,
  Users,
  XCircle,
} from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Loading from '../components/common/Loading';
import { AuthContext } from '../context/AuthContext';
import { gdprService } from '../services/gdprservice';
import { useGDPRConsent } from '../hooks/useGDPRConsent';

/**
 * Page RGPD complète
 * Conforme RGPD Art. 5, 6, 7, 13, 15, 17, 18, 20, 21
 */
const GDPRPage = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useContext(AuthContext);
  const { revokeAllConsents } = useGDPRConsent();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [consentHistory, setConsentHistory] = useState([]);

  // Charger l'historique des consentements
  const loadConsentHistory = async () => {
    try {
      setLoading(true);
      const history = await gdprService.getConsentHistory();
      setConsentHistory(history.history || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'consent-history') {
      loadConsentHistory();
    }
  }, [activeTab]);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="text-center p-8 max-w-md">
          <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Accès refusé</h2>
          <p className="text-gray-600 mb-4">
            Vous devez être connecté pour gérer vos droits RGPD.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Se connecter
          </button>
        </Card>
      </div>
    );
  }

  // Télécharger les données
  const handleExportData = async (format) => {
    try {
      setLoading(true);
      setError(null);
      await gdprService.requestDataPortability(format);
      setSuccess(
        `✅ Données exportées en ${format.toUpperCase()}. Vérifiez vos téléchargements.`
      );
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Supprimer le compte
  const handleDeleteAccount = async () => {
    if (!deletePassword.trim()) {
      setError('Veuillez entrer votre mot de passe');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Confirmer la suppression
      const confirmed = window.confirm(
        '⚠️ ATTENTION : Cette action est IRRÉVERSIBLE!\n\n' +
          'Toutes vos données seront définitivement supprimées dans les 30 jours.\n\n' +
          'Êtes-vous absolument sûr?'
      );

      if (!confirmed) return;

      await gdprService.requestDataDeletion(deletePassword);

      // Nettoyer et rediriger
      revokeAllConsents();
      logout();

      setSuccess(
        '✅ Compte supprimé. Vos données seront effacées dans 30 jours (Art. 17 RGPD).'
      );
      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      setError(err.message || 'Erreur lors de la suppression du compte');
    } finally {
      setLoading(false);
      setDeletePassword('');
    }
  };

  const tabs = [
    { key: 'overview', label: '📋 Vue d\'ensemble', icon: Users },
    { key: 'access', label: '👁️ Accès aux données', icon: FileText },
    { key: 'manage', label: '⚙️ Gestion des données', icon: RefreshCw },
    { key: 'consent-history', label: '🍪 Historique consentements', icon: CheckCircle2 },
    { key: 'delete', label: '🗑️ Supprimer le compte', icon: Trash2, danger: true },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🛡️ Vos droits RGPD
          </h1>
          <p className="text-gray-600">
            Gérez vos données personnelles conformément au Règlement Général sur 
            la Protection des Données (RGPD).
          </p>
        </div>

        {/* Messages */}
        {error && (
          <Card className="mb-6 bg-red-50 border border-red-200 p-4 flex items-start gap-4">
            <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900">Erreur</h3>
              <p className="text-sm text-red-800 mt-1">{error}</p>
            </div>
          </Card>
        )}

        {success && (
          <Card className="mb-6 bg-green-50 border border-green-200 p-4 flex items-start gap-4">
            <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-900">Succès</h3>
              <p className="text-sm text-green-800 mt-1">{success}</p>
            </div>
          </Card>
        )}

        {/* Onglets */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-3 px-4 font-medium text-sm whitespace-nowrap transition-colors border-b-2 ${
                    activeTab === tab.key
                      ? `border-orange-500 ${
                          tab.danger ? 'text-red-600' : 'text-orange-600'
                        }`
                      : `border-transparent text-gray-600 hover:text-gray-900`
                  }`}
                >
                  <Icon className="w-4 h-4 inline mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {loading && <Loading message="Traitement en cours..." />}

        {/* CONTENU DES ONGLETS */}

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <Card className="bg-blue-50 border border-blue-200 p-6">
              <div className="flex gap-4">
                <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Conformité RGPD
                  </h3>
                  <p className="text-sm text-blue-800 mb-3">
                    GourmetGo respecte les articles clés du RGPD :
                  </p>
                  <ul className="text-sm text-blue-800 space-y-1 ml-4">
                    <li>✅ Art. 5 : Transparence et légalité du traitement</li>
                    <li>✅ Art. 6 : Consentement explicite (cookies granulaires)</li>
                    <li>✅ Art. 15 : Droit d'accès à vos données</li>
                    <li>✅ Art. 17 : Droit à l'oubli (suppression complète)</li>
                    <li>✅ Art. 20 : Portabilité des données</li>
                    <li>✅ Art. 21 : Droit d'opposition au marketing</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Infos utilisateur */}
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">
                📌 Vos informations
              </h3>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Nom:</strong> {currentUser?.prenom} {currentUser?.nom}
                </p>
                <p>
                  <strong>Email:</strong> {currentUser?.email}
                </p>
                <p>
                  <strong>Compte créé:</strong>{' '}
                  {currentUser?.createdAt
                    ? new Date(currentUser.createdAt).toLocaleDateString('fr-FR')
                    : 'N/A'}
                </p>
              </div>
            </Card>

            {/* Actions rapides */}
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">
                Actions rapides
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setActiveTab('access')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <FileText className="w-5 h-5 text-orange-600 mb-2" />
                  <p className="font-semibold text-gray-900">Accéder à mes données</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Art. 15 - Télécharger toutes vos données
                  </p>
                </button>
                <button
                  onClick={() => setActiveTab('manage')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <RefreshCw className="w-5 h-5 text-blue-600 mb-2" />
                  <p className="font-semibold text-gray-900">Modifier mes données</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Art. 16 - Corriger vos informations
                  </p>
                </button>
                <button
                  onClick={() => setActiveTab('consent-history')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-600 mb-2" />
                  <p className="font-semibold text-gray-900">Mes consentements</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Historique de vos choix de consentement
                  </p>
                </button>
                <button
                  onClick={() => setActiveTab('delete')}
                  className="p-4 border border-red-200 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-left"
                >
                  <Trash2 className="w-5 h-5 text-red-600 mb-2" />
                  <p className="font-semibold text-red-900">Supprimer le compte</p>
                  <p className="text-xs text-red-700 mt-1">
                    Art. 17 - Droit à l'oubli
                  </p>
                </button>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'access' && (
          <div className="space-y-6">
            <Card>
              <h3 className="font-semibold text-gray-900 mb-2">
                📥 Exporter vos données (Art. 20 RGPD)
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Téléchargez une copie de toutes vos données personnelles. 
                Vous pouvez les utiliser ou les transférer à un autre service.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => handleExportData('json')}
                  disabled={loading}
                  className="p-4 border-2 border-orange-500 rounded-lg hover:bg-orange-50 transition-colors disabled:opacity-50"
                >
                  <FileJson className="w-6 h-6 text-orange-600 mb-2" />
                  <p className="font-semibold text-gray-900">Format JSON</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Structure complète de vos données
                  </p>
                </button>
                <button
                  onClick={() => handleExportData('csv')}
                  disabled={loading}
                  className="p-4 border-2 border-orange-500 rounded-lg hover:bg-orange-50 transition-colors disabled:opacity-50"
                >
                  <Download className="w-6 h-6 text-orange-600 mb-2" />
                  <p className="font-semibold text-gray-900">Format CSV</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Tableau Excel compatible
                  </p>
                </button>
              </div>
            </Card>

            <Card className="bg-blue-50 border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>💡 À savoir :</strong> Vos données incluent votre profil, 
                recettes, favoris, historique de recherche et comportement d'utilisation 
                (anonymisé). Les données restent confidentielles.
              </p>
            </Card>
          </div>
        )}

        {activeTab === 'manage' && (
          <div className="space-y-6">
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">
                ✏️ Gérer vos données personnelles (Art. 16 RGPD)
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Modifiez ou supprimez vos données directement depuis votre profil.
              </p>

              <div className="space-y-4">
                <button
                  onClick={() => navigate('/profile')}
                  className="w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <p className="font-semibold text-gray-900">👤 Modifier mon profil</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Prenom, nom, email, préférences alimentaires
                  </p>
                </button>

                <button
                  onClick={() => navigate('/preferences')}
                  className="w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <p className="font-semibold text-gray-900">⚙️ Préférences privées</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Langue, thème, newsletters, notifications
                  </p>
                </button>

                <button
                  onClick={() => navigate('/privacy-settings')}
                  className="w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <p className="font-semibold text-gray-900">🔒 Paramètres de confidentialité</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Qui peut voir mes recettes, mes favoris, mon activité
                  </p>
                </button>
              </div>
            </Card>

            <Card className="bg-yellow-50 border border-yellow-200">
              <p className="text-sm text-yellow-900">
                <strong>⚠️ Important :</strong> Certaines données (historique d'accès, 
                logs de sécurité) ne peuvent pas être modifiées, mais peuvent être 
                supprimées avec le compte (Art. 17).
              </p>
            </Card>
          </div>
        )}

        {activeTab === 'consent-history' && (
          <div className="space-y-6">
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">
                🍪 Historique de vos consentements
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Consultez chaque décision de consentement que vous avez prise, 
                avec dates et timestamps.
              </p>

              {consentHistory.length > 0 ? (
                <div className="space-y-3">
                  {consentHistory.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {item.consents?.analytics ? '✅' : '❌'} Analytics
                            {item.consents?.marketing ? ' ✅ Marketing' : ''}
                            {item.consents?.preferences ? ' ✅ Préférences' : ''}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(item.timestamp).toLocaleString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-sm">
                  Aucun historique de consentement enregistré.
                </p>
              )}
            </Card>

            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">
                🔄 Révoquer des consentements
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Vous pouvez à tout moment révoquer un consentement donné précédemment.
              </p>
              <button
                onClick={() => navigate('/cookie-settings')}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Gérer mes consentements
              </button>
            </Card>
          </div>
        )}

        {activeTab === 'delete' && (
          <div className="space-y-6">
            <Card className="bg-red-50 border-2 border-red-400 p-6">
              <div className="flex gap-4">
                <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-red-900 text-lg mb-2">
                    ⚠️ Suppression définitive du compte
                  </h3>
                  <p className="text-red-800 mb-4">
                    Cette action est <strong>IRRÉVERSIBLE</strong>. Toutes vos données seront 
                    supprimées conformément à l'Art. 17 RGPD (droit à l'oubli).
                  </p>
                  <ul className="text-sm text-red-800 space-y-2 ml-4 list-disc">
                    <li>Vos recettes, favoris, commentaires seront supprimés</li>
                    <li>Votre compte ne sera plus accessible</li>
                    <li>Les données analytiques seront anonymisées</li>
                    <li>Vous recevrez une confirmation par email</li>
                    <li>Délai de suppression : 30 jours max</li>
                  </ul>
                </div>
              </div>
            </Card>

            {!showDeleteConfirm ? (
              <Card>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-5 h-5" />
                  Supprimer mon compte
                </button>
              </Card>
            ) : (
              <Card>
                <h3 className="font-semibold text-gray-900 mb-4">
                  Confirmer la suppression
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Entrez votre mot de passe pour confirmer la suppression.
                </p>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    placeholder="Entrez votre mot de passe"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
                  >
                    {loading ? 'Suppression...' : 'Confirmer la suppression'}
                  </button>
                </div>
              </Card>
            )}

            <Card className="bg-green-50 border border-green-200">
              <p className="text-sm text-green-900">
                <strong>💚 Besoin d'aide ?</strong> Consultez notre{' '}
                <a href="/privacy" className="text-green-700 hover:underline font-semibold">
                  politique de confidentialité
                </a>{' '}
                ou contactez{' '}
                <a href="mailto:privacy@gourmetgo.com" className="text-green-700 hover:underline font-semibold">
                  privacy@gourmetgo.com
                </a>
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default GDPRPage;