import { useAuthStore } from '../store/auth';

// Auth middleware plugin
export default {
  install(app: any) {
    // Khởi tạo auth store khi app start
    const authStore = useAuthStore();
    
    // Khởi tạo từ localStorage
    authStore.initializeFromLocalStorage();
    
    // Validate auth state
    authStore.validateAuthState();
    
    // Thêm global property để truy cập auth store từ component
    app.config.globalProperties.$auth = authStore;
    
    // Provide auth store để có thể inject trong component
    app.provide('auth', authStore);
  }
}; 