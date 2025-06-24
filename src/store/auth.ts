import { defineStore } from 'pinia';
import authApi from '../api/authApi';
import type { User } from '../model/User';
import { constants } from '../constants/constants';
interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  accessToken: string;
  refreshToken: string;
  isRefreshing: boolean;
  message: string;
}


export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isLoggedIn: false,
    user: null,
    accessToken: '',
    refreshToken: '',
    isRefreshing: false,
    message: '',
  }),
  
  getters: {
    getUserName: (state) => state.user?.name || state.user?.username || '',
    getUserEmail: (state) => state.user?.email || '',
    getUserPhone: (state) => state.user?.phone || '',
    getUserRole: (state) => state.user?.roleId || '',
    isAuthenticated: (state) => state.isLoggedIn && !!state.accessToken,
    hasTokens: (state) => !!state.accessToken && !!state.refreshToken,
    hasRefreshToken: (state) => !!state.refreshToken,
    hasAccessToken: (state) => !!state.accessToken,
  },

  actions: {
    // Thiết lập user info
    setUser(userData: User | null) {
      this.user = userData;
      localStorage.setItem('userId', userData?.userId || '');
      localStorage.setItem('userName', userData?.name || userData?.username || '');
      localStorage.setItem('userEmail', userData?.email || '');
      localStorage.setItem('Phone', userData?.phone || '');
      localStorage.setItem('userRole', userData?.roleId || '');
    },
    
    // Thiết lập tokens
    setTokens(accessToken: string, refreshToken: string = '') {
      this.accessToken = accessToken;
      this.refreshToken = refreshToken || this.refreshToken;
      this.isLoggedIn = !!accessToken;
      
      // Lưu vào localStorage
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
      }
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
    },
    
    // Khởi tạo từ localStorage
    initializeFromLocalStorage() {
      const accessToken = localStorage.getItem('accessToken') || '';
      const refreshToken = localStorage.getItem('refreshToken') || '';
      
      if (accessToken || refreshToken) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.isLoggedIn = !!accessToken;
        
        // Khôi phục user info từ localStorage
        const userInfo = {
          userId: localStorage.getItem('userId') || '',
          name: localStorage.getItem('userName') || '',
          username: localStorage.getItem('userName') || '',
          email: localStorage.getItem('userEmail') || '',
          phone: localStorage.getItem('Phone') || '',
          roleId: localStorage.getItem('userRole') || '',
        };
        
        if (userInfo.userId) {
          this.setUser(userInfo as User);
        }
      }
    },
    
    // Đăng nhập
    async login(email: string, password: string): Promise<boolean> {
      try {
        const response = await authApi.login({ email, password });
        
        if (response.succeeded && response.data) {
          const { accessToken, refreshToken, user } = response.data;
          
          // Lưu tokens
          this.setTokens(accessToken, refreshToken);
          
          // Lưu user info
          this.setUser(user);
          
          // Lưu user info vào localStorage
          
          return true;
        }
        this.message = response.message;
        return false;
      } catch (error) {
        console.error('Login error:', error);
        return false;
      }
    },
    
    // Refresh access token
    async refreshAccessToken(): Promise<string | null> {
      if (this.isRefreshing) {
        // Nếu đang refresh, đợi một chút rồi return token hiện tại
        await new Promise(resolve => setTimeout(resolve, 100));
        return this.accessToken || null;
      }
      
      if (!this.refreshToken) {
        console.error('No refresh token available');
        this.logout();
        return null;
      }
      
      try {
        this.isRefreshing = true;
        
        const response = await authApi.refreshToken({
          refreshToken: this.refreshToken
        });
        
        if (response.succeeded && response.data) {
          const { accessToken, refreshToken: newRefreshToken } = response.data;
          
          // Cập nhật tokens
          this.setTokens(accessToken, newRefreshToken);
          
          return accessToken;
        } else {
          throw new Error('Refresh token failed');
        }
      } catch (error) {
        console.error('Refresh token error:', error);
        this.logout();
        return null;
      } finally {
        this.isRefreshing = false;
      }
    },
    
    // Kiểm tra và đảm bảo có access token hợp lệ
    async ensureAuthenticated(): Promise<boolean> {
      // Nếu không có cả 2 token, logout ngay
      if (!this.hasTokens) {
        this.logout();
        return false;
      }
      
      // Nếu có access token, cho phép request
      if (this.hasAccessToken) {
        return true;
      }
      
      // Nếu chỉ có refresh token, thử refresh
      if (this.hasRefreshToken) {
        const newAccessToken = await this.refreshAccessToken();
        return !!newAccessToken;
      }
      
      // Không có token nào, logout
      this.logout();
      return false;
    },
    
    // Đăng xuất
    logout() {
      // Xóa state
      this.isLoggedIn = false;
      this.user = null;
      this.accessToken = '';
      this.refreshToken = '';
      this.isRefreshing = false;
      // Xóa localStorage
      this.clearCache();
    },

    clearCache(){
      this.setUser(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('Phone');
      localStorage.removeItem('userRole');
    },
    
    // Validate authentication state
    async validateAuthState(path:string): Promise<boolean> {
      try {
        const me = this
        // Nếu không có token nào, logout
        if (!this.hasTokens && constants.ROUTE_PERMISSION.includes(path)) {
          this.logout();
          return false;
        }
        
        // Nếu có access token, thử gọi API để validate
        if (this.hasAccessToken) {
          // Có thể gọi API getUserProfile ở đây để validate
          return true;
        }
        
        // Nếu chỉ có refresh token, thử refresh
        if (this.hasRefreshToken) {
          const newAccessToken = await this.refreshAccessToken();
          return !!newAccessToken;
        }
        
       
        return false;
      } catch (error) {
        console.error('Validate auth state error:', error);
        this.logout();
        return false;
      }
    }
  }
}); 