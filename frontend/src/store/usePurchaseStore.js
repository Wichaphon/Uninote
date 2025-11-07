import { create } from 'zustand';
import { purchaseService } from '../services/purchaseService';

const usePurchaseStore = create((set) => ({
  purchases: [],
  sales: [],
  isLoading: false,
  error: null,

  fetchMyPurchases: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await purchaseService.getMyPurchases();
      set({ purchases: data.purchases || [], isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.error || 'Failed to fetch purchases',
        purchases: []
      });
    }
  },

  fetchMySales: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await purchaseService.getMySales();
      set({ sales: data.sales || [], isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.error || 'Failed to fetch sales',
        sales: []
      });
    }
  },

  createPurchase: async (sheetId) => {
    set({ isLoading: true, error: null });
    try {
      const data = await purchaseService.createPurchase(sheetId);
      set({ isLoading: false });
      
      if (data.checkoutUrl) { 
        window.location.href = data.checkoutUrl;
      }
      
      return data;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.error || 'Failed to create purchase' 
      });
      throw error;
    }
  },

  checkPurchase: async (sheetId) => {
    try {
      const data = await purchaseService.checkPurchase(sheetId);
      return data;
    } catch (error) {
      throw error;
    }
  },

  //Download Sheet
  downloadSheet: async (sheetId) => {
    set({ error: null });
    try {
      const data = await purchaseService.downloadSheet(sheetId);
      return data;
    } catch (error) {
      set({ error: error.response?.data?.error || 'Download failed' });
      throw error;
    }
  },
}));

export default usePurchaseStore;