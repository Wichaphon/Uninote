import api from '../lib/axios';
import { API_ENDPOINTS } from '../constants';

export const sellerService = {
  applySeller: async (sellerData) => {
    const { data } = await api.post(API_ENDPOINTS.APPLY_SELLER, sellerData);
    return data;
  },

  getSellerProfile: async () => {
    const { data } = await api.get(API_ENDPOINTS.SELLER_PROFILE);
    return data;
  },

  updateSellerProfile: async (updates) => {
    const { data } = await api.put(API_ENDPOINTS.SELLER_PROFILE, updates);
    return data;
  },
};