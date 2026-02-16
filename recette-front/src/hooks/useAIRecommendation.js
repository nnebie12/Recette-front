import { useState, useCallback } from 'react';
import { aiRecommendationService } from '../services/aiRecommendationService';
import { recommendationService } from '../services/recommendationService';

/**
 * Hook personnalisé pour gérer la génération de recommandations IA
 */
export const useAIRecommendation = (userId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastRecommendation, setLastRecommendation] = useState(null);

  /**
   * Génère une recommandation personnalisée avec l'IA
   */
  const generatePersonalized = useCallback(async (userBehavior, userPreferences) => {
    setLoading(true);
    setError(null);
    
    try {
      // Génération par l'IA via le backend
      const aiResult = await aiRecommendationService.generatePersonalizedRecommendation(
        userId,
        userBehavior,
        userPreferences
      );

      if (!aiResult.success) {
        console.warn("Utilisation des recommandations de secours");
        setError("Recommandation de secours utilisée");
      }

      // La recommandation est déjà sauvegardée par le backend
      setLastRecommendation(aiResult.data);
      return aiResult.data;
    } catch (err) {
      console.error("Erreur génération personnalisée:", err);
      setError("Impossible de générer la recommandation");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  /**
   * Génère une recommandation saisonnière avec l'IA
   */
  const generateSeasonal = useCallback(async (season, userPreferences) => {
    setLoading(true);
    setError(null);
    
    try {
      const aiResult = await aiRecommendationService.generateSeasonalRecommendation(
        userId,
        season,
        userPreferences
      );

      if (!aiResult.success) {
        aiResult.data = aiResult.fallback;
      }

      const savedRecommendation = await recommendationService.addRecommendation(
        userId,
        'SAISONNIERE',
        aiResult.data.recommendations,
        aiResult.data.score
      );

      setLastRecommendation(savedRecommendation);
      return savedRecommendation;
    } catch (err) {
      console.error("Erreur génération saisonnière:", err);
      setError("Impossible de générer la recommandation");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  /**
   * Génère une recommandation basée sur les habitudes avec l'IA
   */
  const generateHabitBased = useCallback(async (habits, browsing) => {
    setLoading(true);
    setError(null);
    
    try {
      const aiResult = await aiRecommendationService.generateHabitBasedRecommendation(
        userId,
        habits,
        browsing
      );

      if (!aiResult.success) {
        aiResult.data = aiResult.fallback;
      }

      const savedRecommendation = await recommendationService.addRecommendation(
        userId,
        'HABITUDES',
        aiResult.data.recommendations,
        aiResult.data.score
      );

      setLastRecommendation(savedRecommendation);
      return savedRecommendation;
    } catch (err) {
      console.error("Erreur génération habitudes:", err);
      setError("Impossible de générer la recommandation");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  /**
   * Génère une recommandation par créneau horaire avec l'IA
   */
  const generateTimeslot = useCallback(async (timeslot, userPreferences) => {
    setLoading(true);
    setError(null);
    
    try {
      const aiResult = await aiRecommendationService.generateTimeslotRecommendation(
        userId,
        timeslot,
        userPreferences
      );

      if (!aiResult.success) {
        aiResult.data = aiResult.fallback;
      }

      const savedRecommendation = await recommendationService.addRecommendation(
        userId,
        'CRENEAU_ACTUEL',
        aiResult.data.recommendations,
        aiResult.data.score
      );

      setLastRecommendation(savedRecommendation);
      return savedRecommendation;
    } catch (err) {
      console.error("Erreur génération créneau:", err);
      setError("Impossible de générer la recommandation");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  /**
   * Génère une recommandation d'engagement avec l'IA
   */
  const generateEngagement = useCallback(async (engagementScore, userActivity) => {
    setLoading(true);
    setError(null);
    
    try {
      const aiResult = await aiRecommendationService.generateEngagementRecommendation(
        userId,
        engagementScore,
        userActivity
      );

      if (!aiResult.success) {
        aiResult.data = aiResult.fallback;
      }

      const savedRecommendation = await recommendationService.addRecommendation(
        userId,
        'ENGAGEMENT',
        aiResult.data.recommendations,
        aiResult.data.score
      );

      setLastRecommendation(savedRecommendation);
      return savedRecommendation;
    } catch (err) {
      console.error("Erreur génération engagement:", err);
      setError("Impossible de générer la recommandation");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  /**
   * Réinitialise l'état d'erreur
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    lastRecommendation,
    generatePersonalized,
    generateSeasonal,
    generateHabitBased,
    generateTimeslot,
    generateEngagement,
    clearError
  };
};