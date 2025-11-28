import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '../config/api';

const API_URL = "http://localhost:8000/api/v1";

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
          // REAL API CALL
          const response = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            })
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Login failed');
          }

          const data = await response.json();
          
          // Map backend response to frontend format
          const user = {
            id: data.user.id,
            email: data.user.email,
            username: data.user.username,
            firstName: data.user.full_name?.split(' ')[0] || '',
            lastName: data.user.full_name?.split(' ')[1] || '',
            avatar: data.user.avatar_url || null,
            createdAt: data.user.created_at,
          };

          set({
            user: user,
            token: data.access_token,
            refreshToken: data.access_token, // Backend doesn't have separate refresh token yet
            isAuthenticated: true,
            isLoading: false,
          });

          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.access_token);
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.access_token);
          
          return { success: true, user: user };
        } catch (error) {
          set({ isLoading: false });
          return { success: false, error: error.message };
        }
      },

      register: async (userData) => {
        set({ isLoading: true });
        try {
          // REAL API CALL
          const response = await fetch(`${API_URL}/users/registration`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: userData.email,
              username: userData.username,
              password: userData.password,
              full_name: `${userData.firstName} ${userData.lastName}`,
              user_type: userData.userType || 'student'
            })
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Registration failed');
          }

          const data = await response.json();
          
          // Map backend response to frontend format
          const user = {
            id: data.user.id,
            email: data.user.email,
            username: data.user.username,
            firstName: data.user.full_name?.split(' ')[0] || '',
            lastName: data.user.full_name?.split(' ')[1] || '',
            avatar: data.user.avatar_url || null,
            createdAt: data.user.created_at,
          };

          set({
            user: user,
            token: data.access_token,
            refreshToken: data.access_token,
            isAuthenticated: true,
            isLoading: false,
          });

          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.access_token);
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.access_token);

          return { success: true, user: user };
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
        if (token && token !== 'null' && !token.startsWith('mock-jwt')) {
          // Token exists and is not a mock token
          set({ isAuthenticated: true });
        } else {
          // Clear invalid tokens
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
          set({ isAuthenticated: false });
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