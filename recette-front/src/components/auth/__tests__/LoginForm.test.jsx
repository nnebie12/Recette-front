import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import LoginForm from '../LoginForm';
import { AuthContext } from '../../../context/AuthContext';

const navigateMock = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

const renderForm = (login = vi.fn()) => render(
  <MemoryRouter>
    <AuthContext.Provider value={{ login }}>
      <LoginForm />
    </AuthContext.Provider>
  </MemoryRouter>
);

describe('LoginForm', () => {
  beforeEach(() => {
    navigateMock.mockClear();
  });

  it('affiche les erreurs de validation sans soumettre', async () => {
    const loginMock = vi.fn();

    renderForm(loginMock);

    fireEvent.submit(screen.getByRole('button', { name: 'Se connecter' }).closest('form'));

    expect(await screen.findByText("L'email est requis")).toBeInTheDocument();
    expect(screen.getByText('Le mot de passe est requis')).toBeInTheDocument();
    expect(loginMock).not.toHaveBeenCalled();
  });

  it('connecte l’utilisateur puis redirige vers l’accueil', async () => {
    const loginMock = vi.fn().mockResolvedValue({ id: 1 });

    renderForm(loginMock);

    fireEvent.change(screen.getByPlaceholderText('votre@email.com'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'secret' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Se connecter' }));

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith('test@example.com', 'secret');
    });

    expect(navigateMock).toHaveBeenCalledWith('/');
  });

  it('affiche le message backend en cas d’échec', async () => {
    const loginMock = vi.fn().mockRejectedValue(new Error('Identifiants invalides'));

    renderForm(loginMock);

    fireEvent.change(screen.getByPlaceholderText('votre@email.com'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'secret' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Se connecter' }));

    expect(await screen.findByText('Identifiants invalides')).toBeInTheDocument();
    expect(navigateMock).not.toHaveBeenCalled();
  });
});