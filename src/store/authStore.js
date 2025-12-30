import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const API_URL = 'http://localhost:8000/api/v1';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const response = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
          });

          if (!response.ok) {
            const error = await response.json();
            set({ isLoading: false });
            return { success: false, error: error.detail || 'Login failed' };
          }

          const data = await response.json();
          
          // Map user_type to role for frontend consistency
          const user = {
            ...data.user,
            role: data.user.user_type,
          };

          set({
            user,
            token: data.access_token,
            isAuthenticated: true,
            isLoading: false,
          });

          return { success: true, user };
        } catch (error) {
          console.error('Login error:', error);
          set({ isLoading: false });
          return { success: false, error: 'Network error. Please try again.' };
        }
      },

      register: async (userData) => {
        set({ isLoading: true });
        try {
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
              user_type: userData.role || 'student',
              student_class: userData.studentClass || null,
            }),
          });

          if (!response.ok) {
            const error = await response.json();
            set({ isLoading: false });
            return { success: false, error: error.detail || 'Registration failed' };
          }

          const data = await response.json();
          
          // Map user_type to role for frontend consistency
          const user = {
            ...data.user,
            role: data.user.user_type,
          };

          set({
            user,
            token: data.access_token,
            isAuthenticated: true,
            isLoading: false,
          });

          return { success: true, user };
        } catch (error) {
          console.error('Registration error:', error);
          set({ isLoading: false });
          return { success: false, error: 'Network error. Please try again.' };
        }
      },

      logout: () => {
        console.log('AuthStore: Logging out');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      checkAuth: async () => {
        const { token } = get();
        
        if (!token) {
          console.log('AuthStore: No token found');
          return false;
        }

        try {
          console.log('AuthStore: Checking auth with token');
          const response = await fetch(`${API_URL}/users/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            console.log('AuthStore: Auth check failed');
            get().logout();
            return false;
          }

          const userData = await response.json();
          console.log('AuthStore: User verified', userData);
          
          // Map user_type to role for frontend consistency
          const user = {
            ...userData,
            role: userData.user_type,
          };
          
          set({
            user,
            isAuthenticated: true,
          });
          
          return true;
        } catch (error) {
          console.error('AuthStore: Auth check error', error);
          get().logout();
          return false;
        }
      },

      updateUser: (userData) => {
        set({ user: userData });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);