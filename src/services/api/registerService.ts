import axios from '../../api/axios';
const API_URL = 'api/Register';

// Service xử lý các API liên quan đến đăng ký
const registerService = {
  // Kiểm tra số điện thoại đã tồn tại chưa
  checkPhoneExists: async (phone: string) => {
    try {
      const response = await axios.post(`${API_URL}/check-phone`, { phone });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi kiểm tra số điện thoại:', error);
      throw error;
    }
  },

  // Xác thực Firebase Token và tiếp tục quy trình đăng ký
  verifyFirebaseToken: async (phone: string, idToken: string) => {
    try {
      const response = await axios.post(`${API_URL}/verify-token`, {
        phone,
        idToken
      });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi xác thực token:', error);
      throw error;
    }
  },

  // Thiết lập mật khẩu cho tài khoản
  setPassword: async (phone: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/set-password`, {
        phone,
        password
      });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi thiết lập mật khẩu:', error);
      throw error;
    }
  },

  // Tạo hồ sơ người dùng
  createProfile: async (profileData: any) => {
    try {
      const response = await axios.post(`${API_URL}/create-profile`, profileData);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tạo hồ sơ:', error);
      throw error;
    }
  }
};

export default registerService; 