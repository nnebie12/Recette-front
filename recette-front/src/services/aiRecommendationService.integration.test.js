import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockPost = vi.fn();

vi.mock('./api', () => ({
  apiService: {
    post: mockPost,
  },
}));

const { aiRecommendationService } = await import('./aiRecommendationService');

describe('AI recommendation service contracts', () => {
  beforeEach(() => {
    mockPost.mockReset();
  });

  it('appelle le endpoint canonique pour personnalisee', async () => {
    const payload = { id: 100, recommendations: [] };
    mockPost.mockResolvedValue({ data: payload });

    const result = await aiRecommendationService.generatePersonalizedRecommendation(5, {}, {});

    expect(mockPost).toHaveBeenCalledWith('/v1/recommendations/personalized/5', {
      profil: 'NOUVEAU',
      scoreEngagement: 0,
      categories: [],
      types: [],
    });
    expect(result).toEqual({ success: true, data: payload });
  });

  it('ne masque plus les erreurs API et remonte une erreur explicite', async () => {
    mockPost.mockRejectedValue(new Error('Ressource non trouvée'));

    await expect(
      aiRecommendationService.generatePersonalizedRecommendation(5, {}, {})
    ).rejects.toThrow('Echec recommandation personnalisee: Ressource non trouvée');
  });

  it('utilise le endpoint backend pour la recommandation saisonniere', async () => {
    const payload = { success: true };
    mockPost.mockResolvedValue({ data: payload });

    const result = await aiRecommendationService.generateSeasonalRecommendation(9, 'HIVER', { ingredients: ['carotte'] });

    expect(mockPost).toHaveBeenCalledWith('/v1/recommandations/user/9/generer-saisonniere', {
      saison: 'HIVER',
      ingredients: ['carotte'],
    });
    expect(result).toEqual({ success: true, data: payload });
  });

  it('utilise le endpoint backend pour la recommandation habitudes', async () => {
    const payload = { success: true };
    mockPost.mockResolvedValue({ data: payload });

    const result = await aiRecommendationService.generateHabitBasedRecommendation(
      11,
      { typeRecette: 'Vegan', tempsPreparation: 'Rapide', difficulte: 'Facile' },
      { categories: ['plats'] }
    );

    expect(mockPost).toHaveBeenCalledWith('/v1/recommandations/user/11/generer-habitudes', {
      typeRecette: 'Vegan',
      tempsPreparation: 'Rapide',
      difficulte: 'Facile',
      categoriesPreferees: ['plats'],
    });
    expect(result).toEqual({ success: true, data: payload });
  });

  it('utilise le endpoint backend pour la recommandation creneau', async () => {
    const payload = { success: true };
    mockPost.mockResolvedValue({ data: payload });

    const result = await aiRecommendationService.generateTimeslotRecommendation(13, 'DINER', { preferences: ['leger'] });

    expect(mockPost).toHaveBeenCalledWith('/v1/recommandations/user/13/generer-creneau', {
      creneau: 'DINER',
      preferences: ['leger'],
    });
    expect(result).toEqual({ success: true, data: payload });
  });

  it('utilise le endpoint backend pour la recommandation engagement', async () => {
    const payload = { success: true };
    mockPost.mockResolvedValue({ data: payload });

    const result = await aiRecommendationService.generateEngagementRecommendation(15, 72);

    expect(mockPost).toHaveBeenCalledWith('/v1/recommandations/user/15/generer-engagement', {
      engagementScore: 72,
    });
    expect(result).toEqual({ success: true, data: payload });
  });
});
