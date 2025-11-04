import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/authService';
import { setAccessToken } from '../lib/axios';
import { STORAGE_KEYS } from '../constants';
import { handleError } from '../lib/utils';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const data = await authService.register(userData);
          set({ isLoading: false });
          return { success: true, data };
        } catch (error) {
          const errorMsg = handleError(error);
          set({ isLoading: false, error: errorMsg });
          return { success: false, error: errorMsg };
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const data = await authService.login(email, password);
          setAccessToken(data.accessToken);
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
          set({ user: data.user, isAuthenticated: true, isLoading: false });
          return { success: true, data };
        } catch (error) {
          const errorMsg = handleError(error);
          set({ isLoading: false, error: errorMsg });
          return { success: false, error: errorMsg };
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await authService.logout();
        } catch (error) {
          console.error('Logout error:', handleError(error));
        } finally {
          setAccessToken(null);
          localStorage.removeItem(STORAGE_KEYS.USER);
          set({ user: null, isAuthenticated: false, isLoading: false, error: null });
        }
      },

      fetchProfile: async () => {
        set({ isLoading: true, error: null });
        try {
          const data = await authService.getProfile();
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
          set({ user: data.user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          const errorMsg = handleError(error);
          set({ isLoading: false, error: errorMsg });
          await get().logout(); // Ensure logout is awaited
          throw error;
        }
      },

      updateProfile: async (updates) => {
        set({ isLoading: true, error: null });
        try {
          const data = await authService.updateProfile(updates);
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
          set({ user: data.user, isLoading: false });
          return { success: true, user: data.user };
        } catch (error) {
          const errorMsg = handleError(error);
          set({ isLoading: false, error: errorMsg });
          return { success: false, error: errorMsg };
        }
      },

      uploadAvatar: async (file) => {
        set({ isLoading: true, error: null });
        try {
          const data = await authService.uploadAvatar(file);
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
          set({ user: data.user, isLoading: false });
          return { success: true, user: data.user };
        } 
        catch (error) {
          const errorMsg = handleError(error);
          set({ isLoading: false, error: errorMsg });
          return { success: false, error: errorMsg };
        }
      },

      checkAuthStatus: async () => {
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        try {
          await get().fetchProfile();
          set({ isAuthenticated: true });
        } catch (error) {
          set({ isAuthenticated: false, user: null });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;