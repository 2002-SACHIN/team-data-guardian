import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Team = 'X' | 'Y' | 'Z' | 'A';

interface AuthState {
  isAuthenticated: boolean;
  currentTeam: Team | null;
  login: (team: Team) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      currentTeam: null,
      login: (team) => set({ isAuthenticated: true, currentTeam: team }),
      logout: () => set({ isAuthenticated: false, currentTeam: null }),
    }),
    {
      name: 'team-auth-storage',
    }
  )
);

export const hasAccessToData = (teamWithAccess: Team, currentTeam: Team | null): boolean => {
  if (!currentTeam) return false;
  if (currentTeam === 'A') return true; // Team A has access to all data
  return teamWithAccess === currentTeam;
};
