// Import các file ngôn ngữ tiếng Việt
import loginVI from './layout/login/login.vi';
import homeVI from './layout/home/home.vi';
import forgotPasswordVI from './components/forgotPassword/forgotPassword.vi';
import sendOTPVI from './layout/sendOTP/sendOTP.vi';
import headerVI from './components/header/header.vi';
import footerVI from './components/footer/footer.vi';
import sectionVI from './components/section/section.vi';
import searchResultVI from './layout/search/search.vi';
import articleVI from './layout/admin/article.vi';

// Tổng hợp tất cả bản dịch tiếng Việt
export default {
  // Các trang
  pages: {
    login: loginVI,
    home: homeVI,
    forgotPassword: forgotPasswordVI,
    sendOTP: sendOTPVI,
    searchResult: searchResultVI
  },
  
  // Các thành phần
  components: {
    header: headerVI,
    footer: footerVI,
    section: sectionVI
  },

  // Admin
  admin: {
    article: articleVI
  }
}; 