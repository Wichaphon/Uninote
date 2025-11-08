import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS, API_ENDPOINTS } from '../constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, 
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getAccessToken = () => localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

export const setAccessToken = (token) => {
  if (token) {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    delete api.defaults.headers.common['Authorization'];
  }
};

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken(); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      error.response?.data?.code === 'TOKEN_EXPIRED' &&
      !originalRequest._retry
    ) {
      
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(
          `${API_BASE_URL}${API_ENDPOINTS.REFRESH}`, 
          {},
          { withCredentials: true }
        );

        setAccessToken(data.accessToken);
        processQueue(null, data.accessToken);

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
        
      } catch (refreshError) {
        processQueue(refreshError, null);
        
        setAccessToken(null);
        localStorage.removeItem(STORAGE_KEYS.USER);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;