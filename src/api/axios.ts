import axios from 'axios';
import { useAuthStore } from '../store/auth';
import Message from '../plugins/message';

const API_BASE_URL = 'https://localhost:7038/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Accept': 'application/json',
    'Accept-Charset': 'utf-8'
  },
});

// Request interceptor để thêm token vào header
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor để xử lý refresh token tự động
let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Nếu lỗi 401 và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = localStorage.getItem('refreshToken');
      const accessToken = localStorage.getItem('accessToken');
      // Nếu không có refresh token, logout
      if (!refreshToken && !accessToken) {
        const authStore = useAuthStore();
        authStore.logout();
        return Promise.reject(error);
      }
      
      // Đánh dấu đã retry để tránh vòng lặp
      originalRequest._retry = true;
      
      try {
        // Nếu đang refresh, đợi kết quả
        if (isRefreshing) {
          await refreshPromise;
          
          // Lấy token mới từ localStorage và thử lại request
          const newAccessToken = localStorage.getItem('accessToken');
          if (newAccessToken) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axiosInstance(originalRequest);
          }
        } else {
          // Bắt đầu process refresh
          isRefreshing = true;
          
          refreshPromise = axios.post(`${API_BASE_URL}/Auth/refresh-token`, {
            refreshToken: refreshToken
          });
          
          const refreshResponse = await refreshPromise;
          
          if (refreshResponse.data.success && refreshResponse.data.data) {
            const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data.data;
            
            // Lưu tokens mới
            localStorage.setItem('accessToken', accessToken);
            if (newRefreshToken) {
              localStorage.setItem('refreshToken', newRefreshToken);
            }
            
            // Cập nhật header cho request ban đầu
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            
            // Thử lại request ban đầu
            return axiosInstance(originalRequest);
          } else {
            throw new Error('Refresh token failed');
          }
        }
      } catch (refreshError) {
        console.error('Auto refresh token failed:', refreshError);
        
        // Refresh thất bại, logout user
        const authStore = useAuthStore();
        authStore.logout();
        
        Message.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
        
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
