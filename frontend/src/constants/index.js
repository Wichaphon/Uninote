const IS_DEV = import.meta.env.DEV;

export const API_BASE_URL = IS_DEV
  ? '/api'
  : (import.meta.env.VITE_API_URL || 'https://uninote-backend.onrender.com/api');

//Routes
export const ROUTES = {
  HOME: '/',
  EXPLORE: '/explore',
  LOGIN: '/login',
  SIGNUP: '/signup',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  SHEETS: '/sheets',
  SHEET_DETAIL: '/sheets/:id',
  MY_PURCHASES: '/purchases',
  MY_SHEETS: '/my-sheets',
  ADMIN: '/admin',
};

//Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  USER: 'user',
};

//API Endpoints
export const API_ENDPOINTS = {
  //Auth
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  
  //User
  ME: '/users/me',
  UPDATE_PROFILE: '/users/me',
  UPLOAD_AVATAR: '/users/me/avatar',
  CHANGE_PASSWORD: '/users/me/password',
  
  //Seller
  APPLY_SELLER: '/seller/apply',
  SELLER_PROFILE: '/seller/profile',
  
  //Sheets
  SHEETS: '/sheets',
  SHEET_DETAIL: (id) => `/sheets/${id}`,
  MY_SHEETS: '/sheets/my/sheets',
  CREATE_SHEET: '/sheets',
  UPDATE_SHEET: (id) => `/sheets/${id}`,
  DELETE_SHEET: (id) => `/sheets/${id}`,
  
  //Purchases
  CREATE_PURCHASE: (id) => `/purchases/${id}`,
  MY_PURCHASES: '/purchases/my/purchases',
  CHECK_PURCHASE: (id) => `/purchases/check/${id}`,
  DOWNLOAD_SHEET: (id) => `/purchases/download/${id}`,
  MY_SALES: '/purchases/my/sales',
  
  //Reviews
  RATE_SHEET: (id) => `/reviews/${id}`,
  MY_REVIEW: (id) => `/reviews/my/${id}`,
  SHEET_RATING: (id) => `/reviews/${id}`,
  
  //Admin
  PENDING_SELLERS: '/admin/sellers/pending',
  APPROVE_SELLER: (id) => `/admin/sellers/${id}/approve`,
  REJECT_SELLER: (id) => `/admin/sellers/${id}/reject`,
  ALL_USERS: '/admin/users',
  TOGGLE_USER: (id) => `/admin/users/${id}/toggle-status`,
  ALL_SHEETS_ADMIN: '/admin/sheets',
  TOGGLE_SHEET: (id) => `/admin/sheets/${id}/toggle-status`,
  DASHBOARD_STATS: '/admin/stats/dashboard',
  ALL_PURCHASES: '/admin/purchases',
};