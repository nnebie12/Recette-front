import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AdminDashboard from '../AdminDashboard';
import { AuthContext } from '../../context/AuthContext';

const navigateMock = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock('../../services/adminService', () => ({
  adminService: {
    getDashboardStats: vi.fn(),
    getAllUsers: vi.fn(),
    getUserNlpInsight: vi.fn(),
  },
}));

vi.mock('../../services/userBehaviorService', () => ({
  userBehaviorService: {
    getAdvancedAnalysis: vi.fn(),
  },
}));

vi.mock('../../components/admin/AIQuickActions', () => ({
  default: () => <div>AIQuickActionsMock</div>,
}));

vi.mock('../../components/admin/RFMVisualizer', () => ({
  default: () => <div>RFMVisualizerMock</div>,
}));

vi.mock('../../components/admin/RecommandationAdminPanel', () => ({
  default: () => <div>RecommendationAdminPanelMock</div>,
}));

vi.mock('../../components/admin/UserManagement', () => ({
  default: () => <div>UserManagementMock</div>,
}));

vi.mock('../../components/admin/RecipeAdminPanel', () => ({
  default: () => <div>RecipeAdminPanelMock</div>,
}));

vi.mock('../../components/admin/AnalyticsPanel', () => ({
  default: () => <div>AnalyticsPanelMock</div>,
}));

vi.mock('../../components/admin/AnalyticsColumn', () => ({
  default: () => <div>AnalyticsColumnMock</div>,
}));

vi.mock('../../components/admin/UserManagementColumn', () => ({
  default: () => <div>UserManagementColumnMock</div>,
}));

vi.mock('../../components/admin/RecipeManagementColumn', () => ({
  default: () => <div>RecipeManagementColumnMock</div>,
}));

vi.mock('../../components/admin/StatsOverview', () => ({
  default: ({ data }) => <div>StatsOverviewMock-{data.totalUsers}</div>,
}));

const { adminService } = await import('../../services/adminService');
const { userBehaviorService } = await import('../../services/userBehaviorService');

describe('AdminDashboard page', () => {
  beforeEach(() => {
    navigateMock.mockClear();
    adminService.getDashboardStats.mockResolvedValue({
      totalUsers: 2,
      activeRecipes: 3,
      totalComments: 7,
      avgRating: 4.4,
      rfm: { champions: 1, fidele: 1, risque: 0, nouveau: 0 },
    });
    adminService.getAllUsers.mockResolvedValue([
      { id: 1, prenom: 'Ada', nom: 'Lovelace', email: 'ada@example.com', recettesCount: 2 },
      { id: 2, prenom: 'Grace', nom: 'Hopper', email: 'grace@example.com', recettesCount: 1 },
    ]);
    adminService.getUserNlpInsight.mockResolvedValue({
      summary: 'Utilisateur engagé',
      keywords: ['engage'],
    });
    userBehaviorService.getAdvancedAnalysis.mockResolvedValue({
      metriques: {
        scoreEngagement: 75,
        risqueChurn: 10,
        profilUtilisateur: 'ACTIF',
      },
    });
  });

  it('redirige un utilisateur non admin', async () => {
    render(
      <AuthContext.Provider value={{ currentUser: { id: 1, role: 'USER' }, loading: false }}>
        <AdminDashboard />
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/');
    });
  });

  it('affiche le dashboard pour un admin', async () => {
    render(
      <AuthContext.Provider value={{ currentUser: { id: 1, prenom: 'Admin', nom: 'Root', role: 'ADMIN' }, loading: false }}>
        <AdminDashboard />
      </AuthContext.Provider>
    );

    expect(await screen.findByText('Admin Intelligence')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('StatsOverviewMock-2')).toBeInTheDocument();
    });

    expect(screen.getByText('UserManagementColumnMock')).toBeInTheDocument();
    expect(screen.getByText('RecipeManagementColumnMock')).toBeInTheDocument();
    expect(screen.getByText('AnalyticsColumnMock')).toBeInTheDocument();
  });
});