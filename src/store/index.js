import { createPinia } from "pinia";

// Tạo pinia instance
const pinia = createPinia();

// Export pinia instance để sử dụng trong main.js
export default pinia;

// Export các store
export { useAuthStore } from './auth.ts';
