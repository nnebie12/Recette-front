import { Shield, Eye, Lock, Users, AlertCircle, Mail } from 'lucide-react';
import Card from '../components/common/Card';

/**
 * Politique de Confidentialité - Conforme RGPD
 * Art. 5 : Licéité, loyauté, transparence
 * Art. 13-14 : Informations à fournir
 */
const PrivacyPolicy = () => {
  const sections = [
    {
      icon: Shield,
      title: '1. Responsable du traitement',
      content: (
        <div className="space-y-2 text-sm text-gray-600">
          <p>
            <strong>Entité :</strong> GourmetGo SAS
          </p>
          <p>
            <strong>Siège :</strong> Paris, France
          </p>
          <p>
            <strong>Email RGPD :</strong>{' '}
            <a href="mailto:privacy@gourmetgo.com" className="text-orange-600 hover:underline">
              privacy@gourmetgo.com
            </a>
          </p>
          <p>
            <strong>Délai de réponse RGPD :</strong> 30 jours max (Art. 12 RGPD)
          </p>
        </div>
      ),
    },
    {
      icon: Eye,
      title: '2. Données personnelles collectées',
      content: (
        <div className="space-y-3 text-sm text-gray-600">
          <div>
            <p className="font-semibold text-gray-900">📝 Données d'inscription :</p>
            <ul className="list-disc ml-5 mt-1">
              <li>Nom, prénom, email</li>
              <li>Mot de passe (hashé en BCrypt facteur 12)</li>
              <li>Préférences alimentaires optionnelles</li>
              <li>Date d'inscription</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-gray-900">🍽️ Données de contenu :</p>
            <ul className="list-disc ml-5 mt-1">
              <li>Recettes créées</li>
              <li>Favoris</li>
              <li>Commentaires et notes</li>
              <li>Historique de recherche (optionnel)</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-gray-900">📊 Données comportementales (MongoDB) :</p>
            <ul className="list-disc ml-5 mt-1">
              <li>Interactions (vues, clics, durée)</li>
              <li>Profil utilisateur RFM (NOUVEAU, DÉBUTANT, OCCASIONNEL, ACTIF, FIDÈLE)</li>
              <li>Historique de recherche (anonymisé après 180j - TTL)</li>
              <li>Recommandations personnalisées</li>
            </ul>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-2">
            <p className="text-blue-900 font-semibold">🔐 Données JAMAIS collectées :</p>
            <p className="text-blue-800 text-xs mt-1">
              ❌ Données biométriques • ❌ Localisation GPS • ❌ Numéro de carte bancaire 
              • ❌ Numéro de sécurité sociale • ❌ Données de santé
            </p>
          </div>
        </div>
      ),
    },
    {
      icon: Lock,
      title: '3. Base légale du traitement (Art. 6 RGPD)',
      content: (
        <div className="space-y-2 text-sm text-gray-600">
          <div>
            <p className="font-semibold text-gray-900">✅ Consentement explicite :</p>
            <p className="ml-4 text-xs mt-1">
              Cookies analytiques, marketing, préférences : via banneau consentement granulaire
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">✅ Exécution du contrat :</p>
            <p className="ml-4 text-xs mt-1">
              Authentification, stockage recettes, gestion favoris
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">✅ Intérêt légitime :</p>
            <p className="ml-4 text-xs mt-1">
              Recommandations personnalisées, sécurité, amélioration de service
            </p>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 mt-2">
            <p className="text-yellow-900 font-semibold">⚠️ Droit d'opposition (Art. 21) :</p>
            <p className="text-yellow-800 text-xs mt-1">
              Vous pouvez vous opposer au traitement pour marketing à tout moment.
            </p>
          </div>
        </div>
      ),
    },
    {
      icon: Users,
      title: '4. Partage des données',
      content: (
        <div className="space-y-2 text-sm text-gray-600">
          <p>
            <strong>Pas de partage avec tiers</strong> (sauf obligations légales)
          </p>
          <div className="bg-green-50 p-3 rounded-lg border border-green-200 mt-2">
            <p className="text-green-900 font-semibold">✅ Données 100% confidentielles</p>
            <p className="text-green-800 text-xs mt-1">
              Vos données restent sur les serveurs de GourmetGo. 
              Aucun partage avec Facebook, Google, ou autres annonceurs.
            </p>
          </div>
        </div>
      ),
    },
    {
      icon: AlertCircle,
      title: '5. Durée de conservation des données',
      content: (
        <div className="space-y-2 text-sm text-gray-600">
          <table className="w-full text-xs">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Donnée</th>
                <th className="p-2 text-left">Durée</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="p-2">Profil utilisateur (MySQL)</td>
                <td className="p-2">Durée du compte + 30j (Art. 17)</td>
              </tr>
              <tr className="border-t">
                <td className="p-2">Recettes et favoris</td>
                <td className="p-2">Durée du compte</td>
              </tr>
              <tr className="border-t">
                <td className="p-2">Historique recherche (MongoDB)</td>
                <td className="p-2">180 jours (TTL automatique)</td>
              </tr>
              <tr className="border-t">
                <td className="p-2">Logs de sécurité</td>
                <td className="p-2">90 jours pour audit</td>
              </tr>
              <tr className="border-t">
                <td className="p-2">Données analytiques</td>
                <td className="p-2">Anonymisées après 12 mois</td>
              </tr>
              <tr className="border-t">
                <td className="p-2">Consentements (Art. 7)</td>
                <td className="p-2">Historique conservé 3 ans</td>
              </tr>
            </tbody>
          </table>
        </div>
      ),
    },
    {
      icon: Mail,
      title: '6. Vos droits (Art. 15-21 RGPD)',
      content: (
        <div className="space-y-2 text-sm text-gray-600">
          <div>
            <p className="font-semibold text-gray-900">📥 Art. 15 - Droit d'accès</p>
            <p className="ml-4 text-xs mt-1">
              Télécharger TOUTES vos données en JSON/CSV
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">✏️ Art. 16 - Rectification</p>
            <p className="ml-4 text-xs mt-1">
              Modifier nom, email, préférences directement dans le profil
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">🗑️ Art. 17 - Droit à l'oubli</p>
            <p className="ml-4 text-xs mt-1">
              Supprimer définitivement votre compte et données associées
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">📦 Art. 20 - Portabilité</p>
            <p className="ml-4 text-xs mt-1">
              Exporter vos données dans un format standard et portable
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">🚫 Art. 21 - Opposition</p>
            <p className="ml-4 text-xs mt-1">
              Refuser marketing, recommandations, consentements à tout moment
            </p>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 mt-3">
            <p className="text-orange-900 font-semibold">
              ⚡ Exercez vos droits dans{' '}
              <a href="/gdpr" className="text-orange-700 hover:underline font-bold">
                Mes droits RGPD
              </a>
            </p>
          </div>
        </div>
      ),
    },
    {
      icon: Lock,
      title: '7. Sécurité des données',
      content: (
        <div className="space-y-2 text-sm text-gray-600">
          <div>
            <p className="font-semibold text-gray-900">🔐 Mots de passe :</p>
            <p className="ml-4 text-xs mt-1">
              Hashés avec BCrypt (facteur 12). Jamais stockés en clair.
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">🔑 Authentification :</p>
            <p className="ml-4 text-xs mt-1">
              JWT (JSON Web Tokens) avec expiration 24h. Pas de session.
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">🔒 Transport :</p>
            <p className="ml-4 text-xs mt-1">
              HTTPS TLS 1.3 obligatoire. Certificats Let's Encrypt.
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">🛡️ Infrastructure :</p>
            <p className="ml-4 text-xs mt-1">
              Docker Compose isolé. MySQL 8 + MongoDB Atlas. Backups journaliers.
            </p>
          </div>
          <div className="bg-red-50 p-3 rounded-lg border border-red-200 mt-2">
            <p className="text-red-900 font-semibold">🚨 Violation de données ?</p>
            <p className="text-red-800 text-xs mt-1">
              Contactez{' '}
              <a href="mailto:security@gourmetgo.com" className="text-red-700 hover:underline font-bold">
                security@gourmetgo.com
              </a>{' '}
              Nous notifierons les autorités dans les 72h (Art. 33 RGPD)
            </p>
          </div>
        </div>
      ),
    },
    {
      icon: AlertCircle,
      title: '8. Cookies et trackers',
      content: (
        <div className="space-y-2 text-sm text-gray-600">
          <table className="w-full text-xs">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Type</th>
                <th className="p-2 text-left">But</th>
                <th className="p-2 text-left">Durée</th>
                <th className="p-2 text-left">Consentement</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="p-2 font-semibold">Essentiels</td>
                <td className="p-2 text-xs">Auth, session, sécurité</td>
                <td className="p-2 text-xs">24h</td>
                <td className="p-2 text-xs">✅ Obligatoire</td>
              </tr>
              <tr className="border-t">
                <td className="p-2 font-semibold">Analytics</td>
                <td className="p-2 text-xs">Pages vues, durée, clics</td>
                <td className="p-2 text-xs">13 mois</td>
                <td className="p-2 text-xs">⚠️ Consentement</td>
              </tr>
              <tr className="border-t">
                <td className="p-2 font-semibold">Marketing</td>
                <td className="p-2 text-xs">Offres, publicités</td>
                <td className="p-2 text-xs">24 mois</td>
                <td className="p-2 text-xs">⚠️ Consentement</td>
              </tr>
              <tr className="border-t">
                <td className="p-2 font-semibold">Préférences</td>
                <td className="p-2 text-xs">Langue, thème, filtres</td>
                <td className="p-2 text-xs">1 an</td>
                <td className="p-2 text-xs">⚠️ Consentement</td>
              </tr>
            </tbody>
          </table>
        </div>
      ),
    },
    {
      icon: Users,
      title: '9. Transferts internationaux',
      content: (
        <div className="space-y-2 text-sm text-gray-600">
          <p>
            <strong>Pas de transferts en dehors de l'UE/EEE</strong>
          </p>
          <p className="text-xs mt-2">
            Vos données restent en France et EU. Conformément à l'Art. 44-50 RGPD.
          </p>
          <p className="text-xs mt-2">
            <strong>Sauf MongoDB Atlas :</strong> Serveurs EU-WEST-1 (Irlande), certifiés 
            Data Processing Agreement.
          </p>
        </div>
      ),
    },
    {
      icon: Mail,
      title: '10. Contact & Réclamations',
      content: (
        <div className="space-y-2 text-sm text-gray-600">
          <p>
            <strong>Email RGPD :</strong>{' '}
            <a href="mailto:privacy@gourmetgo.com" className="text-orange-600 hover:underline">
              privacy@gourmetgo.com
            </a>
          </p>
          <p className="text-xs mt-2">
            <strong>Autorité de contrôle (CNIL) :</strong> Vous pouvez déposer une réclamation 
            auprès de la CNIL en cas de non-respect.
          </p>
          <p className="text-xs mt-2">
            <strong>Délai de réponse :</strong> 30 jours maximum (Art. 12 RGPD)
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🛡️ Politique de Confidentialité
          </h1>
          <p className="text-gray-600 mb-2">
            Conforme au Règlement Général sur la Protection des Données (RGPD) UE 2016/679
          </p>
          <p className="text-xs text-gray-500">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>

        {/* Navigation rapide */}
        <Card className="bg-orange-50 border border-orange-200 mb-8">
          <p className="text-sm text-orange-900 font-semibold mb-3">
            📋 Navigation rapide :
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {sections.map((section, idx) => (
              <a
                key={idx}
                href={`#section-${idx}`}
                className="text-xs text-orange-700 hover:text-orange-900 hover:underline"
              >
                {section.title}
              </a>
            ))}
          </div>
        </Card>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, idx) => {
            const Icon = section.icon;
            return (
              <Card key={idx} id={`section-${idx}`}>
                <div className="flex gap-4 mb-4">
                  <Icon className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                  <h2 className="text-lg font-bold text-gray-900">{section.title}</h2>
                </div>
                {section.content}
              </Card>
            );
          })}
        </div>

        {/* Footer */}
        <Card className="mt-8 bg-blue-50 border border-blue-200">
          <p className="text-sm text-blue-900">
            <strong>💡 Questions sur le RGPD ?</strong>
          </p>
          <p className="text-xs text-blue-800 mt-2">
            Consultez{' '}
            <a
              href="/gdpr"
              className="text-blue-700 hover:underline font-semibold"
            >
              Mes droits RGPD
            </a>{' '}
            ou écrivez à{' '}
            <a
              href="mailto:privacy@gourmetgo.com"
              className="text-blue-700 hover:underline font-semibold"
            >
              privacy@gourmetgo.com
            </a>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;