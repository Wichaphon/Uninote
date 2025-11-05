import api from '../lib/axios';
import { API_ENDPOINTS } from '../constants';

const createFilename = (title) => {
  if (!title) return 'sheet.pdf';
  
  const safe = title
    .trim()
    .replace(/[<>:"/\\|?*]/g, '')              
    .replace(/[^a-zA-Z0-9ก-๙\s\-_().]/g, '')   
    .replace(/\s+/g, '_')                       
    .replace(/_{2,}/g, '_')                    
    .replace(/^_+|_+$/g, '')                    
    .substring(0, 200);                         
  
  return safe ? `${safe}.pdf` : 'sheet.pdf';
};

export const purchaseService = {
  getMyPurchases: async () => {
    const { data } = await api.get('/purchases/my/purchases');
    return data;
  },

  getMySales: async () => {
  try {
    const { data } = await api.get('/purchases/my/sales');
    return data;
  } catch (error) {
    console.error('getMySales error:', error);
    throw error;
  }
},

  createPurchase: async (sheetId) => {
    const { data } = await api.post(API_ENDPOINTS.PURCHASES, { sheetId });
    return data;
  },

  checkPurchase: async (sheetId) => {
    const { data } = await api.get(`/purchases/check/${sheetId}`);
    return data;
  },

  downloadSheet: async (sheetId) => {
    try {
      const { data } = await api.get(`/purchases/download/${sheetId}`);
      
      if (!data.downloadUrl) {
        throw new Error('Download URL not available');
      }

      const filename = createFilename(data.sheet?.title);
      console.log('📥 Downloading as:', filename);

      //Fetch and download file
      const response = await fetch(data.downloadUrl);
      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename; 
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return data;
    } catch (error) {
      console.error('downloadSheet error:', error);
      throw error;
    }
  },
};