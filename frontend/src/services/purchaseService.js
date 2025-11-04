import api from '../lib/axios';
import { API_ENDPOINTS } from '../constants';

export const purchaseService = {
  createPurchase: async (sheetId) => {
    const { data } = await api.post(API_ENDPOINTS.CREATE_PURCHASE(sheetId));
    return data;
  },

  getMyPurchases: async (params = {}) => {
    const { data } = await api.get(API_ENDPOINTS.MY_PURCHASES, { params });
    return data;
  },

  checkPurchase: async (sheetId) => {
    const { data } = await api.get(API_ENDPOINTS.CHECK_PURCHASE(sheetId));
    return data;
  },

  downloadSheet: async (sheetId) => {
    const response = await api.get(API_ENDPOINTS.DOWNLOAD_SHEET(sheetId), {
      responseType: 'blob',
    });
    return response;
  },

  getMySales: async (params = {}) => {
    const { data } = await api.get(API_ENDPOINTS.MY_SALES, { params });
    return data;
  },
};