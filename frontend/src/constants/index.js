//API Base URL
export const API_BASE_URL = 'https://uninote-backend.onrender.com/api';

//API Endpoints
export const API_ENDPOINTS = {
  //Auth
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    LOGOUT_ALL: '/auth/logout-all',
  },

  //User
  USER: {
    ME: '/users/me',
    UPDATE_PROFILE: '/users/me',
    UPLOAD_AVATAR: '/users/me/avatar',
    DELETE_AVATAR: '/users/me/avatar',
    CHANGE_PASSWORD: '/users/me/password',
    DELETE_ACCOUNT: '/users/me',
  },

  //Seller
  SELLER: {
    APPLY: '/seller/apply',
    PROFILE: '/seller/profile',
    UPDATE_PROFILE: '/seller/profile',
  },

  //Sheets
  SHEETS: {
    GET_ALL: '/sheets',
    GET_BY_ID: (id) => `/sheets/${id}`,
    CREATE: '/sheets',
    MY_SHEETS: '/sheets/my/sheets',
    UPDATE: (id) => `/sheets/${id}`,
    DELETE: (id) => `/sheets/${id}`,
  },

  //Purchases
  PURCHASES: {
    CREATE: (sheetId) => `/purchases/${sheetId}`,
    MY_PURCHASES: '/purchases/my/purchases',
    CHECK_STATUS: (sheetId) => `/purchases/check/${sheetId}`,
    DOWNLOAD: (sheetId) => `/purchases/download/${sheetId}`,
    MY_SALES: '/purchases/my/sales',
  },

  //Reviews
  REVIEWS: {
    RATE_SHEET: (sheetId) => `/reviews/${sheetId}`,
    MY_REVIEW: (sheetId) => `/reviews/my/${sheetId}`,
    GET_RATING: (sheetId) => `/reviews/${sheetId}`,
  },

  //Admin
  ADMIN: {
    PENDING_SELLERS: '/admin/sellers/pending',
    APPROVE_SELLER: (sellerId) => `/admin/sellers/${sellerId}/approve`,
    REJECT_SELLER: (sellerId) => `/admin/sellers/${sellerId}/reject`,
    GET_USERS: '/admin/users',
    TOGGLE_USER_STATUS: (userId) => `/admin/users/${userId}/toggle-status`,
    GET_SHEETS: '/admin/sheets',
    TOGGLE_SHEET_STATUS: (sheetId) => `/admin/sheets/${sheetId}/toggle-status`,
    DASHBOARD_STATS: '/admin/stats/dashboard',
    GET_PURCHASES: '/admin/purchases',
  },
};

//User Roles
export const USER_ROLES = {
  USER: 'USER',
  SELLER: 'SELLER',
  ADMIN: 'ADMIN',
};

//Purchase Status
export const PURCHASE_STATUS = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
};

//Seller Status
export const SELLER_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
};

//File Upload Limits
export const UPLOAD_LIMITS = {
  AVATAR: {
    MAX_SIZE: 5 * 1024 * 1024, //5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  },
  PDF: {
    MAX_SIZE: 50 * 1024 * 1024, //50MB
    ALLOWED_TYPES: ['application/pdf'],
  },
};

//Validation Rules
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 6,
  SHOP_NAME_MIN_LENGTH: 3,
  SHOP_NAME_MAX_LENGTH: 100,
  TITLE_MAX_LENGTH: 200,
  DESCRIPTION_MAX_LENGTH: 2000,
  SUBJECT_MAX_LENGTH: 100,
  MAX_PRICE: 999999.99,
};

//Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};