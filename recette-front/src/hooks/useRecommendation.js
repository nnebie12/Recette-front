import { useState, useCallback } from 'react';
import { recommendationService } from '../services/recommendationService';

const extractRecipeIdFromLink = (link) => {
  if (!link || typeof link !== 'string') return null;
  const match = link.match(/\/recettes?\/(\d+)/i);
  return match ? Number(match[1]) : null;
};

const getPrimaryRecipeId = (recommendation) => {
  const details = recommendation?.recommandation;
  if (!Array.isArray(details) || details.length === 0) return null;
  return extractRecipeIdFromLink(details[0]?.lien);
};


export const useRecommendations = (userId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  /**
   * Charge toutes les recommandations
   */
  const loadRecommendations = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await recommendationService.getUserRecommendations(userId);
      setRecommendations(data);
      return data;
    } catch (err) {
      console.error("Erreur chargement recommandations:", err);
      setError("Impossible de charger les recommandations");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  /**
   * Charge les recommandations par type
   */
  const loadRecommendationsByType = useCallback(async (type) => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await recommendationService.getRecommendationsByType(userId, type);
      setRecommendations(data);
      return data;
    } catch (err) {
      console.error("Erreur chargement recommandations par type:", err);
      setError("Impossible de charger les recommandations");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  /**
   * Génère une recommandation (l'IA analyse automatiquement)
   */
  const generateRecommendation = useCallback(async (type) => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      let result;
      
      switch (type) {
        case 'PERSONNALISEE':
          result = await recommendationService.generatePersonalizedRecommendation(userId);
          break;
        case 'SAISONNIERE':
          result = await recommendationService.generateSeasonalRecommendation(userId);
          break;
        case 'HABITUDES':
          result = await recommendationService.generateHabitBasedRecommendation(userId);
          break;
        case 'CRENEAU_ACTUEL':
          result = await recommendationService.generateTimeslotRecommendation(userId);
          break;
        case 'ENGAGEMENT':
          result = await recommendationService.generateEngagementRecommendation(userId);
          break;
        default:
          result = await recommendationService.generatePersonalizedRecommendation(userId);
      }

      // Recharger les recommandations après génération
      await loadRecommendations();
      
      return result;
    } catch (err) {
      console.error("Erreur génération recommandation:", err);
      setError("Impossible de générer la recommandation");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId, loadRecommendations]);

  /**
   * Marque une recommandation comme utilisée
   */
  const sendFeedback = useCallback(async ({ recommendation, recipeId, action }) => {
    if (!userId) return;

    const effectiveRecipeId = recipeId ?? getPrimaryRecipeId(recommendation);
    if (!effectiveRecipeId) return;

    try {
      await recommendationService.sendRecommendationFeedback({
        userId,
        recipeId: effectiveRecipeId,
        action,
      });
    } catch (err) {
      console.error('Erreur envoi feedback recommandation:', err);
      setError('Le feedback recommandation n\'a pas pu être envoyé');
      throw err;
    }
  }, [userId]);

  const markAsUsed = useCallback(async (recommendation) => {
    try {
      const recommendationId = recommendation?.id;
      if (!recommendationId) {
        throw new Error('Identifiant de recommandation manquant');
      }

      await recommendationService.markRecommendationAsUsed(recommendationId);
      await sendFeedback({ recommendation, action: 'like' });
      
      // Mise à jour locale
      setRecommendations(prev => 
        prev.map(rec => 
          rec.id === recommendationId ? { ...rec, estUtilise: true } : rec
        )
      );
    } catch (err) {
      console.error("Erreur marquage utilisé:", err);
      setError("Impossible de marquer la recommandation comme utilisée");
      throw err;
    }
  }, [sendFeedback]);

  /**
   * Réinitialise l'état d'erreur
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    recommendations,
    loadRecommendations,
    loadRecommendationsByType,
    generateRecommendation,
    markAsUsed,
    sendFeedback,
    clearError
  };
};