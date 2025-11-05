import { create } from 'zustand';
import api, { setAccessToken, getAccessToken } from '../lib/axios';
import { API_ENDPOINTS, STORAGE_KEYS } from '../constants';

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem(STORAGE_KEYS.USER)) || null,
  isLoading: false,
  isAuthChecking: true, 
  error: null,

  initializeAuth: async () => {
    set({ isAuthChecking: true });
    
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    const storedToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

    if (storedUser && storedToken) {
      try {
        //Verify token 
        const { data } = await api.get(API_ENDPOINTS.ME);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
        set({ user: data.user, isAuthChecking: false });
      } catch (error) {
        //Token invalid
        console.error('Token verification failed:', error);
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        setAccessToken(null);
        set({ user: null, isAuthChecking: false });
      }
    } else {
      set({ isAuthChecking: false });
    }
  },

  //Register
  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post(API_ENDPOINTS.REGISTER, userData);
      set({ isLoading: false });
      return data;
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Registration failed';
      set({ isLoading: false, error: errorMsg });
      throw error;
    }
  },

  //Login
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post(API_ENDPOINTS.LOGIN, { email, password });
      
      setAccessToken(data.accessToken);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
      
      set({ user: data.user, isLoading: false });
      return data;
    } 
    catch (error) {
      const errorMsg = error.response?.data?.error || 'Login failed';
      set({ isLoading: false, error: errorMsg });
      throw error;
    }
  },

  //Logout
  logout: async () => {
    set({ isLoading: true });
    try {
      await api.post(API_ENDPOINTS.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAccessToken(null);
      localStorage.removeItem(STORAGE_KEYS.USER);
      set({ user: null, isLoading: false });
    }
  },

  //Get Profile
  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get(API_ENDPOINTS.ME);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
      set({ user: data.user, isLoading: false });
      return data.user;
    } catch (error) {
      set({ isLoading: false, error: error.response?.data?.error });
      throw error;
    }
  },

  //Update Profile
  updateProfile: async (updates) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.put(API_ENDPOINTS.UPDATE_PROFILE, updates);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
      set({ user: data.user, isLoading: false });
      return data.user;
    } catch (error) {
      set({ isLoading: false, error: error.response?.data?.error });
      throw error;
    }
  },

  //Upload Avatar
  uploadAvatar: async (file) => {
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const { data } = await api.put(API_ENDPOINTS.UPLOAD_AVATAR, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
      set({ user: data.user, isLoading: false });
      return data.user;
    } catch (error) {
      set({ isLoading: false, error: error.response?.data?.error });
      throw error;
    }
  },

  //Delete Avatar
  deleteAvatar: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.delete(API_ENDPOINTS.DELETE_AVATAR);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
      set({ user: data.user, isLoading: false });
      return data.user;
    } catch (error) {
      set({ isLoading: false, error: error.response?.data?.error });
      throw error;
    }
  },

  //Clear Error
  clearError: () => set({ error: null }),
}));

export default useAuthStore;