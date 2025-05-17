import { useI18n as vueUseI18n } from 'vue-i18n';

// Composable giúp dễ dàng sử dụng i18n trong ứng dụng
export function useI18n() {
  const { t, locale, availableLocales } = vueUseI18n();

  // Hàm thay đổi ngôn ngữ
  const changeLocale = (newLocale: string) => {
    locale.value = newLocale;
    // Có thể lưu locale vào localStorage để nhớ lựa chọn của người dùng
    localStorage.setItem('locale', newLocale);
  };

  // Lấy ngôn ngữ hiện tại
  const currentLocale = () => locale.value;

  // Lấy danh sách ngôn ngữ có sẵn
  const getAvailableLocales = () => availableLocales;

  return {
    t, // Hàm dịch
    locale, // Ngôn ngữ hiện tại (reactive)
    changeLocale, // Hàm thay đổi ngôn ngữ
    currentLocale, // Hàm lấy ngôn ngữ hiện tại
    getAvailableLocales // Hàm lấy danh sách ngôn ngữ có sẵn
  };
} 