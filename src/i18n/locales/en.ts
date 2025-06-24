// Import các file ngôn ngữ tiếng Anh
import loginEN from './layout/login/login.en';
import homeEN from './layout/home/home.en';
import forgotPasswordEN from './components/forgotPassword/forgotPassword.en';
import sendOTPEN from './layout/sendOTP/sendOTP.en';
import headerEN from './components/header/header.en';
import footerEN from './components/footer/footer.en';
import sectionEN from './components/section/section.en';
import searchResultEN from './layout/search/search.en';
import articleEN from './layout/admin/article.en';

// Tổng hợp tất cả bản dịch tiếng Anh
export default {
  // Các trang
  pages: {
    login: loginEN,
    home: homeEN,
    forgotPassword: forgotPasswordEN,
    sendOTP: sendOTPEN,
    searchResult: searchResultEN
  },
  
  // Các thành phần
  components: {
    header: headerEN,
    footer: footerEN,
    section: sectionEN
  },

  // Admin
  admin: {
    article: articleEN
  }
}; 