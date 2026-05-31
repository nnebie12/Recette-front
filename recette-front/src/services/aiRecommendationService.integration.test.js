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
});
