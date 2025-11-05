import axios from '../lib/axios';

export const authService = {
  register: async (userData) => {
    const { data } = await axios.post('/auth/register', userData);
    return data;
  },

  login: async (email, password) => {
    const response = await axios.post('/auth/login', { email, password });
    return response.data;
  },

  logout: async () => {
    await axios.post('/auth/logout');
  },

  getProfile: async () => {
    const response = await axios.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (updates) => {
    const { data } = await axios.put('/auth/profile', updates);
    return data;
  },

  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const { data } = await axios.post('/auth/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
};