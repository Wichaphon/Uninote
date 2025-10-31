import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../constants/index.js';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, //(refresh token)
});

//Request interceptor - Add access token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//Response interceptor - Handle token refresh
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

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    //If error is not 401 or request already retried, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Check if it's a token expired error
    if (error.response?.data?.code === 'TOKEN_EXPIRED') {
      if (isRefreshing) {
        //If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        //Try to refresh token
        const response = await axios.post(
          `${API_BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`,
          {},
          { withCredentials: true }
        );

        const { accessToken } = response.data;
        
        //Save new token
        localStorage.setItem('accessToken', accessToken);
        
        //Update default header
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        
        //Process queued requests
        processQueue(null, accessToken);
        
        //Retry original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
        
      } catch (refreshError) {
        //Refresh failed - logout user
        processQueue(refreshError, null);
        
        //Clear auth data
        localStorage.removeItem('accessToken');

        //Redirect to login
        window.location.href = '/login';
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;