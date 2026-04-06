import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthContext } from '../../context/AuthContext';
import Favorites from '../Favorites';

vi.mock('../../services/favoriteService', () => ({
  favoriteService: {
    getUserFavorites: vi.fn(),
    removeFavorite: vi.fn(),
  },
}));

vi.mock('../../components/recipe/RecipeList', () => ({
  default: ({ recipes, onToggleFavorite }) => (
    <div>
      {recipes.map((recipe) => (
        <div key={recipe.id}>
          <span>{recipe.titre}</span>
          <button onClick={() => onToggleFavorite(recipe.id)}>remove-{recipe.id}</button>
        </div>
      ))}
    </div>
  ),
}));

const { favoriteService } = await import('../../services/favoriteService');

describe('Favorites page', () => {
  beforeEach(() => {
    favoriteService.getUserFavorites.mockResolvedValue([
      { recetteEntity: { id: 5, titre: 'Crumble' } },
      { recetteEntity: { id: 8, titre: 'Tajine' } },
    ]);
    favoriteService.removeFavorite.mockResolvedValue(undefined);
  });

  it('charge les favoris et permet d’en retirer un', async () => {
    render(
      <AuthContext.Provider value={{ currentUser: { id: 21 } }}>
        <Favorites />
      </AuthContext.Provider>
    );

    expect(await screen.findByText('Crumble')).toBeInTheDocument();
    expect(screen.getByText('Tajine')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'remove-5' }));

    await waitFor(() => {
      expect(favoriteService.removeFavorite).toHaveBeenCalledWith(21, 5);
    });

    expect(favoriteService.getUserFavorites).toHaveBeenCalledTimes(2);
  });
});