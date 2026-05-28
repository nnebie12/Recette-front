import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthContext } from '../../context/AuthContext';
import ProfilePage from '../Profile';

vi.mock('../../services/recipeService', () => ({
  recipeService: {
    getRecipesByUser: vi.fn(),
  },
}));

vi.mock('../../services/favoriteService', () => ({
  favoriteService: {
    getUserFavorites: vi.fn(),
  },
}));

vi.mock('../../services/userService', () => ({
  userService: {
    getUserBehavior: vi.fn(),
  },
}));

vi.mock('../../components/recipe/RecipeList', () => ({
  default: ({ recipes }) => (
    <div data-testid="recipe-list">
      {recipes.map((recipe) => (
        <div key={recipe.id}>{recipe.titre}</div>
      ))}
    </div>
  ),
}));

vi.mock('../SearchHistoryPage', () => ({
  default: () => <div>HistoriqueMock</div>,
}));

const { recipeService } = await import('../../services/recipeService');
const { favoriteService } = await import('../../services/favoriteService');
const { userService } = await import('../../services/userService');

describe('Profile page', () => {
  beforeEach(() => {
    recipeService.getRecipesByUser.mockResolvedValue([
      { id: 1, titre: 'Tarte citron' },
      { id: 2, titre: 'Quiche' },
    ]);
    favoriteService.getUserFavorites.mockResolvedValue([
      { recetteEntity: { id: 3, titre: 'Pasta' } },
    ]);
    userService.getUserBehavior.mockResolvedValue({
      metriques: {
        nombreCommentairesLaisses: 4,
        scoreEngagement: 8.3,
        profilUtilisateur: 'ACTIF',
      },
    });
  });

  it('affiche les données utilisateur et permet de basculer vers l’activité', async () => {
    render(
      <AuthContext.Provider value={{ currentUser: { id: 12, prenom: 'Lina', nom: 'Diallo', email: 'lina@example.com', preferenceAlimentaire: 'Végétarienne' } }}>
        <ProfilePage />
      </AuthContext.Provider>
    );

    expect(await screen.findByText('Lina Diallo')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('ACTIF')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Activité' }));

    await waitFor(() => {
      expect(screen.getByText('HistoriqueMock')).toBeInTheDocument();
    });
  });
});