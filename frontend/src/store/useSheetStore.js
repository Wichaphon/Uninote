import { create } from 'zustand';
import { sheetService } from '../services/sheetService';

const useSheetStore = create((set, get) => ({
  sheets: [],
  currentSheet: null,
  mySheets: [],
  pagination: null,
  filters: {
    page: 1,
    limit: 20,
    search: '',
    subject: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'createdAt',
    order: 'desc',
  },
  isLoading: false,
  error: null,

  //Fetch all sheets pub
  fetchSheets: async (customFilters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const filters = { ...get().filters, ...customFilters };
      const data = await sheetService.getAllSheets(filters);
      set({ 
        sheets: data.sheets, 
        pagination: data.pagination,
        filters,
        isLoading: false 
      });
    } catch (error) {
      set({ isLoading: false, error: error.response?.data?.error });
    }
  },

  //Fetch sheet by ID
  fetchSheetById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const data = await sheetService.getSheetById(id);
      set({ currentSheet: data.sheet, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: error.response?.data?.error });
    }
  },

  //Fetch sheets (seller)
  fetchMySheets: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const data = await sheetService.getMySheets(params);
      set({ mySheets: data.sheets, pagination: data.pagination, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: error.response?.data?.error });
    }
  },

  //Create sheet
  createSheet: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      const data = await sheetService.createSheet(formData);
      set({ isLoading: false });
      return data;
    } catch (error) {
      set({ isLoading: false, error: error.response?.data?.error });
      throw error;
    }
  },

  updateSheet: async (id, formData) => {
    set({ isLoading: true, error: null });
    try {
      const data = await sheetService.updateSheet(id, formData);
      
      set({ currentSheet: data.sheet, isLoading: false });
      
      const mySheets = get().mySheets;
      const updatedMySheets = mySheets.map(sheet => 
        sheet.id === id ? data.sheet : sheet
      );
      set({ mySheets: updatedMySheets });
      
      return data.sheet;
    } catch (error) {
      set({ isLoading: false, error: error.response?.data?.error });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
  //Delete sheet
  deleteSheet: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await sheetService.deleteSheet(id);
      set({ isLoading: false });
      get().fetchMySheets();
    } catch (error) {
      set({ isLoading: false, error: error.response?.data?.error });
      throw error;
    }
  },
  setFilters: (newFilters) => {
    set({ filters: { ...get().filters, ...newFilters } });
  },
  clearError: () => set({ error: null }),
}));

export default useSheetStore;