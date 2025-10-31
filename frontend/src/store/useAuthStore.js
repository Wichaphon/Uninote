import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axiosInstance from '../lib/axios';
import { API_ENDPOINTS } from '../constants';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      setAccessToken: (token) => {
        if (token) {
          localStorage.setItem('accessToken', token);
          axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
        } else {
          localStorage.removeItem('accessToken');
          delete axiosInstance.defaults.headers.common.Authorization;
        }
        set({ accessToken: token });
      },

      setLoading: (isLoading) => set({ isLoading }),
      
      setError: (error) => set({ error }),

      //Register
      register: async (credentials) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.post(
            API_ENDPOINTS.AUTH.REGISTER,
            credentials
          );
          
          set({ isLoading: false });
          return { success: true, data: response.data };
        } catch (error) {
          const errorMessage = error.response?.data?.error || error.response?.data?.errors || 'Registration failed';
          set({ isLoading: false, error: errorMessage });
          return { success: false, error: errorMessage };
        }
      },

      //Login
      login: async (credentials) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.post(
            API_ENDPOINTS.AUTH.LOGIN,
            credentials
          );
          
          const { user, accessToken } = response.data;
          
          //Set token
          get().setAccessToken(accessToken);
          
          //Set user
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false,
            error: null 
          });
          
          return { success: true, data: response.data };
        } catch (error) {
          const errorMessage = error.response?.data?.error || 'Login failed';
          set({ isLoading: false, error: errorMessage });
          return { success: false, error: errorMessage };
        }
      },

      //Logout
      logout: async () => {
        try {
          await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          //Clear state on logout
          get().setAccessToken(null);
          set({ 
            user: null, 
            isAuthenticated: false,
            error: null 
          });
        }
      },

      //Logout from all devices
      logoutAll: async () => {
        try {
          await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT_ALL);
        } catch (error) {
          console.error('Logout all error:', error);
        } finally {
          get().setAccessToken(null);
          set({ 
            user: null, 
            isAuthenticated: false,
            error: null 
          });
        }
      },

      //Fetch current user profile
      fetchUser: async () => {
        try {
          set({ isLoading: true });
          
          const response = await axiosInstance.get(API_ENDPOINTS.USER.ME);
          
          set({ 
            user: response.data.user, 
            isAuthenticated: true,
            isLoading: false 
          });
          
          return { success: true, data: response.data.user };
        } catch (error) {
          
          //If fetch fails, clear auth state
          get().setAccessToken(null);
          set({ 
            user: null, 
            isAuthenticated: false,
            isLoading: false 
          });
          return { success: false, error: error.message };
        }
      },

      //Update user profile
      updateProfile: async (data) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.put(
            API_ENDPOINTS.USER.UPDATE_PROFILE,
            data
          );
          
          set({ 
            user: response.data.user,
            isLoading: false 
          });
          
          return { success: true, data: response.data };
        } catch (error) {
          const errorMessage = error.response?.data?.error || error.response?.data?.errors || 'Update failed';
          set({ isLoading: false, error: errorMessage });
          return { success: false, error: errorMessage };
        }
      },

      //Update avatar
      updateAvatar: async (file) => {
        try {
          set({ isLoading: true, error: null });
          
          const formData = new FormData();
          formData.append('avatar', file);
          
          const response = await axiosInstance.put(
            API_ENDPOINTS.USER.UPLOAD_AVATAR,
            formData,
          );
          
          set({ 
            user: response.data.user,
            isLoading: false 
          });
          
          return { success: true, data: response.data };
        } catch (error) {
          const errorMessage = error.response?.data?.error || 'Upload failed';
          set({ isLoading: false, error: errorMessage });
          return { success: false, error: errorMessage };
        }
      },

      //Delete avatar
      deleteAvatar: async () => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.delete(
            API_ENDPOINTS.USER.DELETE_AVATAR
          );
          
          set({ 
            user: response.data.user,
            isLoading: false 
          });
          
          return { success: true, data: response.data };
        } catch (error) {
          const errorMessage = error.response?.data?.error || 'Delete failed';
          set({ isLoading: false, error: errorMessage });
          return { success: false, error: errorMessage };
        }
      },

      //Change password
      changePassword: async (data) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosInstance.put(
            API_ENDPOINTS.USER.CHANGE_PASSWORD,
            data
          );
          
          //Logout after password change
          get().setAccessToken(null);
          set({ 
            user: null,
            isAuthenticated: false,
            isLoading: false 
          });
          
          return { success: true, data: response.data };
        } catch (error) {
          const errorMessage = error.response?.data?.error || 'Change password failed';
          set({ isLoading: false, error: errorMessage });
          return { success: false, error: errorMessage };
        }
      },

      //Initialize auth on app load
      initAuth: async () => {
        const token = localStorage.getItem('accessToken');
        
        if (token) {
          get().setAccessToken(token);
          await get().fetchUser();
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

export default useAuthStore;