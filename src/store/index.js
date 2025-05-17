import { createPinia } from 'pinia';

// Tạo pinia instance
const pinia = createPinia();

// Export pinia instance để sử dụng trong main.js
export default pinia;

// Re-export các store để dễ import
export * from './auth'; 