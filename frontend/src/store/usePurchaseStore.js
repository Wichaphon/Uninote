import { create } from 'zustand';
import { purchaseService } from '../services/purchaseService';

const usePurchaseStore = create((set, get) => ({
  purchases: [],
  sales: [],
  pagination: null,
  isLoading: false,
  error: null,

  //Create purchase 
  createPurchase: async (sheetId) => {
    set({ isLoading: true, error: null });
    try {
      const data = await purchaseService.createPurchase(sheetId);
      set({ isLoading: false });
      //Redirect to Stripe Checkout
      window.location.href = data.checkoutUrl;
      return data;
    } catch (error) {
      set({ isLoading: false, error: error.response?.data?.error });
      throw error;
    }
  },

  //Fetch my purchases
  fetchMyPurchases: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const data = await purchaseService.getMyPurchases(params);
      set({ 
        purchases: data.purchases, 
        pagination: data.pagination,
        isLoading: false 
      });
    } 
    catch (error) {
      set({ isLoading: false, error: error.response?.data?.error });
    }
  },

  //Check if purchased
  checkPurchase: async (sheetId) => {
    try {
      const data = await purchaseService.checkPurchase(sheetId);
      return data;
    } 
    catch (error) {
      return { purchased: false };
    }
  },

  //Download sheet
  downloadSheet: async (sheetId) => {
    set({ isLoading: true, error: null });
    try {
      const data = await purchaseService.downloadSheet(sheetId);
      set({ isLoading: false });
      //Open download URL
      window.open(data.downloadUrl, '_blank');
      return data;
    } catch (error) {
      set({ isLoading: false, error: error.response?.data?.error });
      throw error;
    }
  },

  //seller
  fetchMySales: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const data = await purchaseService.getMySales(params);
      set({ 
        sales: data.sales, 
        pagination: data.pagination,
        isLoading: false 
      });
    } catch (error) {
      set({ isLoading: false, error: error.response?.data?.error });
    }
  },

  clearError: () => set({ error: null }),
}));

export default usePurchaseStore;