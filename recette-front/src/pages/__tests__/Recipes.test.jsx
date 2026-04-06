import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthContext } from '../../context/AuthContext';
import Recipes from '../Recipes';

const recipeListSpy = vi.fn();

vi.mock('../../services/recipeService', () => ({
  recipeService: {
    getAllRecipes: vi.fn(),
    createRecipe: vi.fn(),
  },
}));

vi.mock('../../services/favoriteService', () => ({
  favoriteService: {
    getUserFavorites: vi.fn(),
    addFavorite: vi.fn(),
    removeFavorite: vi.fn(),
  },
}));

vi.mock('../../services/searchHistoryService', () => ({
  searchHistoryService: {
    recordSearch: vi.fn(),
  },
}));

vi.mock('../../components/recipe/RecipeList', () => ({
  default: (props) => {
    recipeListSpy(props);
    return (
      <div data-testid="recipe-list">
        {props.recipes.map((recipe) => (
          <div key={recipe.id}>{recipe.titre}</div>
        ))}
      </div>
    );
  },
}));

vi.mock('../../components/recipe/RecipeCreate', () => ({
  default: ({ isOpen }) => (isOpen ? <div>RecipeCreateOpen</div> : null),
}));

const { recipeService } = await import('../../services/recipeService');
const { favoriteService } = await import('../../services/favoriteService');
const { searchHistoryService } = await import('../../services/searchHistoryService');

const renderPage = (route = '/recipes?cuisine=italienne') => {
  const currentUser = { id: 7, prenom: 'Aya', nom: 'Test' };

  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthContext.Provider value={{ currentUser, loading: false }}>
        <Recipes />
      </AuthContext.Provider>
    </MemoryRouter>
  );
};

describe('Recipes page', () => {
  beforeEach(() => {
    recipeListSpy.mockClear();
    recipeService.getAllRecipes.mockResolvedValue([
      { id: 1, titre: 'Pasta', description: 'Italie', cuisine: 'italienne', typeRecette: 'plat', difficulte: 'FACILE', vegetarien: true, dateCreation: '2026-04-01', tempsPreparation: 10, tempsCuisson: 15 },
      { id: 2, titre: 'Soupe', description: 'France', cuisine: 'francaise', typeRecette: 'entree', difficulte: 'MOYEN', vegetarien: true, dateCreation: '2026-04-02', tempsPreparation: 20, tempsCuisson: 10 },
    ]);
    favoriteService.getUserFavorites.mockResolvedValue([{ recetteEntity: { id: 1 } }]);
    searchHistoryService.recordSearch.mockResolvedValue(undefined);
  });

  it('filtre les recettes selon la query string et enregistre la recherche', async () => {
    renderPage();

    expect(await screen.findByRole('heading', { name: 'Cuisine Italienne' })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Pasta')).toBeInTheDocument();
    });

    expect(screen.queryByText('Soupe')).not.toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('Rechercher une recette...'), {
      target: { value: 'Pasta' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Rechercher' }));

    await waitFor(() => {
      expect(searchHistoryService.recordSearch).toHaveBeenCalledWith(7, 'Pasta', []);
    });
  });
});