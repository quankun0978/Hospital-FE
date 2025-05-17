import { createI18n } from 'vue-i18n';
import vi from './locales/vi';
import en from './locales/en';

// Cấu trúc đa ngôn ngữ tối ưu
const messages = {
  vi,
  en
};

const i18n = createI18n({
  legacy: false, // sử dụng composition API
  locale: 'vi', // ngôn ngữ mặc định
  fallbackLocale: 'en', // ngôn ngữ dự phòng
  messages
});

export default i18n; 