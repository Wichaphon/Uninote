import api from '../lib/axios';
import { API_ENDPOINTS } from '../constants';

export const authService = {
  register: async (userData) => {
    const { data } = await api.post(API_ENDPOINTS.REGISTER, userData);
    return data;
  },

  login: async (email, password) => {
    const { data } = await api.post(API_ENDPOINTS.LOGIN, { email, password });
    return data;
  },

  logout: async () => {
    const { data } = await api.post(API_ENDPOINTS.LOGOUT);
    return data;
  },

  logoutAll: async () => {
    const { data } = await api.post(API_ENDPOINTS.LOGOUT_ALL);
    return data;
  },

  refresh: async () => {
    const { data } = await api.post(API_ENDPOINTS.REFRESH);
    return data;
  },

  getProfile: async () => {
    const { data } = await api.get(API_ENDPOINTS.ME);
    return data;
  },

  updateProfile: async (updates) => {
    const { data } = await api.put(API_ENDPOINTS.UPDATE_PROFILE, updates);
    return data;
  },

  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const { data } = await api.put(API_ENDPOINTS.UPLOAD_AVATAR, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  deleteAvatar: async () => {
    const { data } = await api.delete(API_ENDPOINTS.DELETE_AVATAR);
    return data;
  },

  changePassword: async (currentPassword, newPassword) => {
    const { data } = await api.put(API_ENDPOINTS.CHANGE_PASSWORD, {
      currentPassword,
      newPassword,
    });
    return data;
  },

  deleteAccount: async (password) => {
    const { data } = await api.delete(API_ENDPOINTS.DELETE_ACCOUNT, {
      data: { password },
    });
    return data;
  },
};