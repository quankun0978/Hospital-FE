import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

// Cấu hình domain backend
const BASE_URL = 'https://localhost:7038/api';

// Tạo instance axios
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: '*/*',
  }
});

// Thêm interceptor request
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // Lấy token từ localStorage
    const token = localStorage.getItem('accessToken');
    // Nếu có token, thêm vào header
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  }
);

// Thêm interceptor response
axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  async (error: AxiosError): Promise<AxiosResponse | AxiosError> => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    
    // Xử lý lỗi 401 Unauthorized
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Logic refresh token có thể thêm vào đây
        // const refreshToken = localStorage.getItem('refreshToken');
        // Gọi API refresh token
        // Cập nhật token mới
        
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Nếu refresh token thất bại, chuyển về trang login
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
