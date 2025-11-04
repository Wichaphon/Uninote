import api from '../lib/axios';
import { API_ENDPOINTS } from '../constants';

export const reviewService = {
  rateSheet: async (sheetId, rating) => {
    const { data } = await api.post(API_ENDPOINTS.RATE_SHEET(sheetId), { rating });
    return data;
  },

  getMyReview: async (sheetId) => {
    const { data } = await api.get(API_ENDPOINTS.MY_REVIEW(sheetId));
    return data;
  },

  getSheetRating: async (sheetId) => {
    const { data } = await api.get(API_ENDPOINTS.SHEET_RATING(sheetId));
    return data;
  },
};