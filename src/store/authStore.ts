import { create } from 'zustand';
import { User, Organisation } from '../types';
import { MOCK_USER, MOCK_ORGANISATION } from '../lib/mockData';

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

export const initDemoMode = () => {
  if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
    useAuthStore.setState({
      user: MOCK_USER,
      organisation: MOCK_ORGANISATION,
      isAuthenticated: true,
      isLoading: false,
    });
  }
};
