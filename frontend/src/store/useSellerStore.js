import { create } from 'zustand';
import { sellerService } from '../services/sellerService';

const useSellerStore = create((set) => ({
  sellerProfile: null,
  isLoading: false,
  error: null,

  //Get seller profile
  fetchSellerProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await sellerService.getSellerProfile();
      set({ 
        sellerProfile: data.sellerProfile, 
        isLoading: false 
      });
      return data.sellerProfile;
    } catch (error) {
      console.error('fetchSellerProfile error:', error);
      set({ 
        isLoading: false, 
        error: error.response?.data?.error || 'Failed to fetch seller profile',
        sellerProfile: null
      });
      throw error;
    }
  },

  //Update seller profile
  updateSellerProfile: async (updates) => {
    set({ isLoading: true, error: null });
    try {
      const data = await sellerService.updateSellerProfile(updates);
      set({ 
        sellerProfile: data.sellerProfile, 
        isLoading: false 
      });
      return data.sellerProfile;
    } catch (error) {
      console.error('updateSellerProfile error:', error);
      set({ 
        isLoading: false, 
        error: error.response?.data?.error || 'Failed to update seller profile'
      });
      throw error;
    }
  },

  //Apply to become seller
  applySeller: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const result = await sellerService.applySeller(data);
      set({ isLoading: false });
      return result;
    } catch (error) {
      console.error('applySeller error:', error);
      set({ 
        isLoading: false, 
        error: error.response?.data?.error || 'Failed to apply'
      });
      throw error;
    }
  },

  //Clear error
  clearError: () => set({ error: null }),
}));

export default useSellerStore;