import api from '../lib/axios';
import { API_ENDPOINTS } from '../constants';

export const sheetService = {
  //Public
  getAllSheets: async (params = {}) => {
    const { data } = await api.get(API_ENDPOINTS.SHEETS, { params });
    return data;
  },

  getSheetById: async (id) => {
    const { data } = await api.get(API_ENDPOINTS.SHEET_DETAIL(id));
    return data;
  },

  //Seller only
  getMySheets: async (params = {}) => {
    const { data } = await api.get(API_ENDPOINTS.MY_SHEETS, { params });
    return data;
  },

  createSheet: async (formData) => {
    const { data } = await api.post(API_ENDPOINTS.CREATE_SHEET, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  updateSheet: async (id, formData) => {
    const { data } = await api.put(API_ENDPOINTS.UPDATE_SHEET(id), formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  deleteSheet: async (id) => {
    const { data } = await api.delete(API_ENDPOINTS.DELETE_SHEET(id));
    return data;
  },
};