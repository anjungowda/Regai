import { create } from 'zustand';
import { User, Organisation } from '../types';

interface AuthState {
  user: User | null;
  organisation: Organisation | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setOrganisation: (org: Organisation | null) => void;
  setLoading: (isLoading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  organisation: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setOrganisation: (organisation) => set({ organisation }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => set({ user: null, organisation: null, isAuthenticated: false }),
}));
