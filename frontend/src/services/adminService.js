import api from '../lib/axios';
import { API_ENDPOINTS } from '../constants';

export const adminService = {
  //Seller Management
  getPendingSellers: async () => {
    const { data } = await api.get(API_ENDPOINTS.PENDING_SELLERS);
    return data;
  },

  approveSeller: async (sellerId) => {
    const { data } = await api.post(API_ENDPOINTS.APPROVE_SELLER(sellerId));
    return data;
  },

  rejectSeller: async (sellerId) => {
    const { data } = await api.post(API_ENDPOINTS.REJECT_SELLER(sellerId));
    return data;
  },

  //User Management
  getAllUsers: async (params = {}) => {
    const { data } = await api.get(API_ENDPOINTS.ALL_USERS, { params });
    return data;
  },

  toggleUserStatus: async (userId) => {
    const { data } = await api.patch(API_ENDPOINTS.TOGGLE_USER(userId));
    return data;
  },

  //Sheet Management
  getAllSheetsAdmin: async (params = {}) => {
    const { data } = await api.get(API_ENDPOINTS.ALL_SHEETS_ADMIN, { params });
    return data;
  },
  toggleSheetStatus: async (sheetId) => {
    const { data } = await api.patch(API_ENDPOINTS.TOGGLE_SHEET(sheetId));
    return data;
  },

  //Dashboard
  getDashboardStats: async () => {
    const { data } = await api.get(API_ENDPOINTS.DASHBOARD_STATS);
    return data;
  },

  //Purchases
  getAllPurchases: async (params = {}) => {
    const { data } = await api.get(API_ENDPOINTS.ALL_PURCHASES, { params });
    return data;
  },
};