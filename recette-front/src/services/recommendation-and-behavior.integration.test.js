import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockGet = vi.fn();
const mockPost = vi.fn();
const mockPut = vi.fn();
const mockDelete = vi.fn();
const mockPatch = vi.fn();

vi.mock('./api', () => ({
  apiService: {
    get: mockGet,
    post: mockPost,
    put: mockPut,
    delete: mockDelete,
    patch: mockPatch,
  },
}));

const { recommendationService } = await import('./recommendationService');
const { userBehaviorService } = await import('./userBehaviorService');

describe('API integration contracts - recommendations and behavior', () => {
  beforeEach(() => {
    mockGet.mockReset();
    mockPost.mockReset();
    mockPut.mockReset();
    mockDelete.mockReset();
    mockPatch.mockReset();
  });

  it('utilise le endpoint canonique pour la recommandation personnalisée', async () => {
    const payload = { success: true };
    mockPost.mockResolvedValue({ data: payload });

    const data = await recommendationService.generatePersonalizedRecommendation(42);

    expect(mockPost).toHaveBeenCalledWith('/v1/recommendations/personalized/42');
    expect(data).toEqual(payload);
  });

  it('récupère les stats globales de comportement', async () => {
    const payload = { totalUsers: 10, churnRiskAverage: 22.5 };
    mockGet.mockResolvedValue({ data: payload });

    const data = await userBehaviorService.getGlobalAnalytics();

    expect(mockGet).toHaveBeenCalledWith('/v1/comportement-utilisateur/stats-globales');
    expect(data).toEqual(payload);
  });

  it('envoie un feedback recommandation normalisé', async () => {
    const payload = { stored: true };
    mockPost.mockResolvedValue({ data: payload });

    const data = await recommendationService.sendRecommendationFeedback({
      userId: 7,
      recipeId: 99,
      action: 'LIKED',
    });

    expect(mockPost).toHaveBeenCalledWith('/v1/recommendations/feedback', {
      userId: 7,
      recipeId: 99,
      action: 'like',
    });
    expect(data).toEqual(payload);
  });
});
