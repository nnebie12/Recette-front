import { useEffect, useState } from 'react';

/**
 * Hook personnalisé pour gérer les consentements RGPD/GDPR
 * Stocke les préférences dans localStorage
 */
export const useGDPRConsent = () => {
  const [consents, setConsents] = useState({
    necessary: true, // Toujours true (nécessaires au fonctionnement)
    analytics: false,
    marketing: false,
    preferences: false,
  });

  const [consentGiven, setConsentGiven] = useState(false);

  // Charger les consentements depuis localStorage au montage
  useEffect(() => {
    const storedConsent = localStorage.getItem('gdpr_consent');
    const consentTimestamp = localStorage.getItem('gdpr_consent_timestamp');

    if (storedConsent) {
      try {
        const parsed = JSON.parse(storedConsent);
        setConsents(parsed);
        setConsentGiven(true);

        // Log pour conformité (sans données sensibles)
        console.log(
          `[GDPR] Consentements chargés (timestamp: ${consentTimestamp})`
        );
      } catch (error) {
        console.error('Erreur lors du chargement des consentements:', error);
      }
    }
  }, []);

  // Sauvegarder les consentements
  const saveConsents = (newConsents) => {
    setConsents(newConsents);
    setConsentGiven(true);
    localStorage.setItem('gdpr_consent', JSON.stringify(newConsents));
    localStorage.setItem('gdpr_consent_timestamp', new Date().toISOString());

    // Tracker les consentements auprès du backend
    trackConsentBackend(newConsents);
  };

  // Accepter tous les consentements
  const acceptAll = () => {
    const allConsents = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    saveConsents(allConsents);
  };

  // Accepter seulement les essentiels
  const acceptEssentialOnly = () => {
    const essentialConsents = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };
    saveConsents(essentialConsents);
  };

  // Rejeter tous les optionnels
  const rejectAll = () => {
    acceptEssentialOnly();
  };

  // Mettre à jour les consentements sélectivement
  const updateConsent = (type, value) => {
    if (type === 'necessary') return; // Ne pas permettre de désactiver les essentiels

    const updated = { ...consents, [type]: value };
    saveConsents(updated);
  };

  // Envoyer au backend pour logging/conformité
  const trackConsentBackend = async (consentData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return; // Non tracké si pas connecté

      await fetch('/api/v1/users/consent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          consents: consentData,
          timestamp: new Date().toISOString(),
          // Ne PAS envoyer d'IP ou d'identifiants
        }),
      }).catch(() => {
        // Silencieux si le backend n'est pas disponible
      });
    } catch (error) {
      console.error('Erreur envoi consentements:', error);
    }
  };

  // Supprimer tous les consentements (droit à l'oubli)
  const revokeAllConsents = () => {
    localStorage.removeItem('gdpr_consent');
    localStorage.removeItem('gdpr_consent_timestamp');
    setConsents({
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    });
    setConsentGiven(false);
  };

  return {
    consents,
    consentGiven,
    saveConsents,
    acceptAll,
    acceptEssentialOnly,
    rejectAll,
    updateConsent,
    revokeAllConsents,
  };
};