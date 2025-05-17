import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    user: {
      id: '',
      name: '',
      email: '',
      phone: '',
      role: ''
    },
    token: ''
  }),
  
  getters: {
    getUserName: (state) => state.user.name,
    getUserEmail: (state) => state.user.email,
    getUserPhone: (state) => state.user.phone,
    getUserRole: (state) => state.user.role,
    isAuthenticated: (state) => state.isLoggedIn && !!state.token
  },
  
  actions: {
    setUser(userData) {
      if (!userData) return;
      
      this.user.id = userData.id || '';
      this.user.name = userData.name || userData.username || '';
      this.user.email = userData.email || '';
      this.user.phone = userData.phone || '';
      this.user.role = userData.role || '';
    },
    
    setToken(token) {
      this.token = token;
      this.isLoggedIn = !!token;
    },
    
    initializeFromLocalStorage() {
      // Khôi phục trạng thái từ localStorage
      const token = localStorage.getItem('accessToken');
      if (token) {
        this.setToken(token);
        this.setUser({
          id: localStorage.getItem('userId') || '',
          name: localStorage.getItem('userName') || '',
          email: localStorage.getItem('userEmail') || '',
          phone: localStorage.getItem('Phone') || '',
          role: localStorage.getItem('userRole') || ''
        });
      }
    },
    
    login(userData, token) {
      // Cập nhật trạng thái store
      this.setUser(userData);
      this.setToken(token);
      
      // Lưu thông tin vào localStorage
      localStorage.setItem('accessToken', token);
      localStorage.setItem('userId', userData.id || '');
      localStorage.setItem('userName', userData.name || userData.username || '');
      localStorage.setItem('userEmail', userData.email || '');
      localStorage.setItem('Phone', userData.phone || '');
      localStorage.setItem('userRole', userData.role || '');
    },
    
    logout() {
      // Xóa trạng thái trong store
      this.setToken('');
      this.setUser({});
      this.isLoggedIn = false;
      
      // Xóa thông tin trong localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('Phone');
      localStorage.removeItem('userRole');
    }
  }
}); 