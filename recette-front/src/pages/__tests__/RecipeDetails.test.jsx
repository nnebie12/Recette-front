import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthContext } from '../../context/AuthContext';
import RecipeDetailsPage from '../RecipeDetails';

const navigateMock = vi.fn();
const toastMock = {
  success: vi.fn(),
  info: vi.fn(),
  error: vi.fn(),
};

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: '42' }),
    useNavigate: () => navigateMock,
  };
});

vi.mock('../../services/recipeService', () => ({
  recipeService: {
    getRecipeById: vi.fn(),
    recordInteraction: vi.fn(),
    addComment: vi.fn(),
    addNote: vi.fn(),
    deleteRecipe: vi.fn(),
  },
}));

vi.mock('../../services/favoriteService', () => ({
  favoriteService: {
    getUserFavorites: vi.fn(),
    addFavorite: vi.fn(),
    removeFavorite: vi.fn(),
  },
}));

vi.mock('../../context/ToastContext', () => ({
  useToast: () => toastMock,
}));

vi.mock('../../utils/helpers', async () => {
  const actual = await vi.importActual('../../utils/helpers');
  return {
    ...actual,
    generateSessionId: () => 'session-test',
  };
});

vi.mock('../../components/common/Loading', () => ({
  default: ({ message }) => <div>{message}</div>,
}));

vi.mock('../../components/common/ConfirmationModal', () => ({
  default: ({ isOpen, onConfirm, confirmText }) => (
    isOpen ? <button onClick={onConfirm}>{confirmText}</button> : null
  ),
}));

vi.mock('../../components/common/Button', () => ({
  default: ({ children, onClick }) => <button onClick={onClick}>{children}</button>,
}));

vi.mock('../../components/recipe/RecipeDetail', () => ({
  default: ({ recipe, isFavorite, onToggleFavorite, onAddComment, onDeleteRequest }) => (
    <div>
      <div>{recipe.titre}</div>
      <div>{isFavorite ? 'favorite-on' : 'favorite-off'}</div>
      <button onClick={onToggleFavorite}>toggle-favorite</button>
      <button onClick={() => onAddComment({ contenu: 'Super recette' })}>add-comment</button>
      <button onClick={onDeleteRequest}>open-delete</button>
    </div>
  ),
}));

const { recipeService } = await import('../../services/recipeService');
const { favoriteService } = await import('../../services/favoriteService');

const recipePayload = {
  id: 42,
  titre: 'Gratin dauphinois',
  userEntity: { id: 9 },
  commentaires: [],
};

describe('RecipeDetails page', () => {
  beforeEach(() => {
    navigateMock.mockClear();
    Object.values(toastMock).forEach((fn) => fn.mockClear());
    recipeService.getRecipeById.mockResolvedValue(recipePayload);
    recipeService.recordInteraction.mockResolvedValue(undefined);
    recipeService.addComment.mockResolvedValue(undefined);
    recipeService.deleteRecipe.mockResolvedValue(undefined);
    favoriteService.getUserFavorites.mockResolvedValue([{ recetteEntity: { id: 42 } }]);
    favoriteService.addFavorite.mockResolvedValue(undefined);
    favoriteService.removeFavorite.mockResolvedValue(undefined);
  });

  it('charge la recette, vérifie les favoris et enregistre un commentaire enrichi', async () => {
    render(
      <AuthContext.Provider value={{ currentUser: { id: 9, prenom: 'Nina', nom: 'Fall' } }}>
        <RecipeDetailsPage />
      </AuthContext.Provider>
    );

    expect(await screen.findByText('Gratin dauphinois')).toBeInTheDocument();

    await waitFor(() => {
      expect(recipeService.recordInteraction).toHaveBeenCalledWith(9, 42, 'CONSULTATION', 'session-test');
    });

    expect(screen.getByText('favorite-on')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'add-comment' }));

    await waitFor(() => {
      expect(recipeService.addComment).toHaveBeenCalledWith(42, 9, {
        contenu: 'Super recette',
        userId: '9',
        userName: 'Nina Fall',
      });
    });

    expect(toastMock.success).toHaveBeenCalledWith('Commentaire ajouté !');
  });

  it('redirige vers login quand un invité tente de gérer les favoris', async () => {
    favoriteService.getUserFavorites.mockResolvedValue([]);

    render(
      <AuthContext.Provider value={{ currentUser: null }}>
        <RecipeDetailsPage />
      </AuthContext.Provider>
    );

    expect(await screen.findByText('Gratin dauphinois')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'toggle-favorite' }));

    expect(navigateMock).toHaveBeenCalledWith('/login');
  });
});