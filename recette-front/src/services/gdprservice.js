/**
 * Service RGPD - Gestion des droits de l'utilisateur
 * Conforme RGPD Art. 15 (accès), 17 (suppression), 20 (portabilité)
 */

const API_BASE = '/api/v1';

export const gdprService = {
  /**
   * Art. 15 RGPD - Droit d'accès
   * Récupère toutes les données personnelles de l'utilisateur
   */
  requestDataAccess: async () => {
    try {
      const response = await fetch(`${API_BASE}/users/gdpr/export`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la demande d\'accès:', error);
      throw error;
    }
  },

  /**
   * Art. 20 RGPD - Droit à la portabilité
   * Exporte les données au format JSON/CSV portable
   */
  requestDataPortability: async (format = 'json') => {
    try {
      const response = await fetch(
        `${API_BASE}/users/gdpr/export?format=${format}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}`);
      }

      const filename = `gourmetgo-data-${new Date().toISOString().split('T')[0]}.${
        format === 'csv' ? 'csv' : 'json'
      }`;

      // Créer un blob et télécharger
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      return { success: true, filename };
    } catch (error) {
      console.error('Erreur portabilité des données:', error);
      throw error;
    }
  },

  /**
   * Art. 17 RGPD - Droit à l'oubli (suppression)
   * Supprime définitivement le compte et toutes les données associées
   */
  requestDataDeletion: async (password) => {
    try {
      const response = await fetch(`${API_BASE}/users/gdpr/delete`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Mot de passe incorrect');
        }
        throw new Error(`Erreur ${response.status}: Impossible de supprimer le compte`);
      }

      const data = await response.json();
      
      // Nettoyer le localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('gdpr_consent');
      localStorage.removeItem('gdpr_consent_timestamp');

      return data;
    } catch (error) {
      console.error('Erreur suppression:', error);
      throw error;
    }
  },

  /**
   * Art. 16 RGPD - Droit de rectification
   * Modifie les données personnelles
   */
  updatePersonalData: async (updates) => {
    try {
      const response = await fetch(`${API_BASE}/users/me`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur modification données:', error);
      throw error;
    }
  },

  /**
   * Restriction du traitement (Art. 18)
   * L'utilisateur peut restreindre l'utilisation de ses données
   */
  restrictProcessing: async (restrictionType) => {
    try {
      const response = await fetch(`${API_BASE}/users/gdpr/restrict`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ restrictionType }),
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur restriction traitement:', error);
      throw error;
    }
  },

  /**
   * Récupère la liste des cookies et des trackers actifs
   */
  getActiveTrackers: async () => {
    try {
      const response = await fetch(`${API_BASE}/users/gdpr/trackers`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur récupération trackers:', error);
      return { trackers: [] };
    }
  },

  /**
   * Récupère l'historique des consentements
   */
  getConsentHistory: async () => {
    try {
      const response = await fetch(`${API_BASE}/users/gdpr/consent-history`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur historique consentements:', error);
      return { history: [] };
    }
  },

  /**
   * Révoque le consentement pour une catégorie spécifique
   */
  revokeConsent: async (category) => {
    try {
      const response = await fetch(`${API_BASE}/users/gdpr/consent/revoke`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category }),
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur révocation consentement:', error);
      throw error;
    }
  },

  /**
   * Envoie une demande RGPD formelle (requête modérée par équipe légale)
   */
  submitFormalGDPRRequest: async (requestType, reason = '') => {
    try {
      const response = await fetch(`${API_BASE}/users/gdpr/formal-request`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestType, // 'access', 'deletion', 'portability', 'rectification'
          reason,
          timestamp: new Date().toISOString(),
          // Ne pas envoyer d'IP - elle est automatiquement loggée par le serveur
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur demande formelle RGPD:', error);
      throw error;
    }
  },
};