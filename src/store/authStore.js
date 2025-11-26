import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '../config/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      setTokens: (token, refreshToken) => set({ token, refreshToken }),
      
      login: async (credentials) => {
        set({ isLoading: true });
        try {
          // Mock login - replace with actual API call
          const mockUser = {
            id: '1',
            email: credentials.email,
            username: credentials.email.split('@')[0],
            firstName: 'John',
            lastName: 'Doe',
            avatar: null,
            createdAt: new Date().toISOString(),
          };
          
          const mockToken = 'mock-jwt-token-' + Date.now();
          const mockRefreshToken = 'mock-refresh-token-' + Date.now();

          set({
            user: mockUser,
            token: mockToken,
            refreshToken: mockRefreshToken,
            isAuthenticated: true,
            isLoading: false,
          });

          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, mockToken);
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, mockRefreshToken);
          
          return { success: true, user: mockUser };
        } catch (error) {
          set({ isLoading: false });
          return { success: false, error: error.message };
        }
      },

      register: async (userData) => {
        set({ isLoading: true });
        try {
          // Mock registration - replace with actual API call
          const mockUser = {
            id: Date.now().toString(),
            email: userData.email,
            username: userData.username,
            firstName: userData.firstName,
            lastName: userData.lastName,
            avatar: null,
            createdAt: new Date().toISOString(),
          };

          const mockToken = 'mock-jwt-token-' + Date.now();
          const mockRefreshToken = 'mock-refresh-token-' + Date.now();

          set({
            user: mockUser,
            token: mockToken,
            refreshToken: mockRefreshToken,
            isAuthenticated: true,
            isLoading: false,
          });

          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, mockToken);
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, mockRefreshToken);

          return { success: true, user: mockUser };
        } catch (error) {
          set({ isLoading: false });
          return { success: false, error: error.message };
        }
      },

      logout: () => {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      checkAuth: () => {
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        if (token) {
          // In production, validate token with backend
          set({ isAuthenticated: true });
        }
      },
    }),
    {
      name: STORAGE_KEYS.USER_DATA,
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
      }),
    }
  )
);