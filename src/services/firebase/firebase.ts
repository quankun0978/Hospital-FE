import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { showToast } from '../../plugins/toast.ts';

// Cấu hình Firebase của bạn
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Khởi tạo Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();

// Kiểm tra cài đặt Firebase
const checkFirebaseConfig = () => {
  
  // Kiểm tra xem Firebase đã được khởi tạo đúng chưa
  if (!firebase.apps.length) {
    console.error('Firebase app chưa được khởi tạo!');
    return false;
  }
  
  // Kiểm tra thông tin cấu hình
  const missingConfig = [];
  if (!firebaseConfig.apiKey || firebaseConfig.apiKey.includes('YOUR_')) missingConfig.push('apiKey');
  if (!firebaseConfig.authDomain || firebaseConfig.authDomain.includes('your-')) missingConfig.push('authDomain');
  if (!firebaseConfig.projectId || firebaseConfig.projectId.includes('your-')) missingConfig.push('projectId');
  
  if (missingConfig.length > 0) {
    console.error('Thông tin cấu hình Firebase bị thiếu hoặc không chính xác:', missingConfig.join(', '));
    return false;
  }
  
  return true;
};

// Khởi tạo RecaptchaVerifier
const initRecaptcha = (containerId: string) => {
  const recaptchaVerifier = new firebase.auth.RecaptchaVerifier(containerId, {
    'size': 'normal',
    'callback': () => {
      // reCAPTCHA solved, allow signInWithPhoneNumber.
    },
    'expired-callback': () => {
      // Response expired. Ask user to solve reCAPTCHA again.
    }
  });
  
  return recaptchaVerifier;
};

// Gửi mã OTP đến số điện thoại
const sendOTP = async (phoneNumber: string, recaptchaVerifier: any) => {
  try {
    // Kiểm tra cấu hình Firebase trước khi gửi OTP
    if (!checkFirebaseConfig()) {
      return {
        success: false,
        error: new Error('Cấu hình Firebase không hợp lệ'),
        errorMessage: 'Cấu hình Firebase không hợp lệ. Vui lòng kiểm tra lại.'
      };
    }
    
    
    // Render recaptcha trước khi gửi SMS
    await recaptchaVerifier.render();
    
    const confirmationResult = await auth.signInWithPhoneNumber(phoneNumber, recaptchaVerifier);
    
    // Hiển thị thông báo thành công
    showToast.success(`Mã OTP đã được gửi đến số điện thoại ${phoneNumber}. Vui lòng kiểm tra tin nhắn của bạn.`);
    
    return {
      success: true,
      confirmationResult
    };
  } catch (error: any) {
    console.error('Chi tiết lỗi khi gửi OTP:', error);
    
    let errorMessage = 'Không thể gửi mã OTP.';
    if (error.code) {
      switch(error.code) {
        case 'auth/invalid-phone-number':
          errorMessage = 'Số điện thoại không hợp lệ.';
          break;
        case 'auth/missing-phone-number':
          errorMessage = 'Vui lòng nhập số điện thoại.';
          break;
        case 'auth/quota-exceeded':
          errorMessage = 'Đã vượt quá số lần gửi OTP cho phép. Vui lòng thử lại sau.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'Tài khoản này đã bị vô hiệu hóa.';
          break;
        case 'auth/captcha-check-failed':
          errorMessage = 'Xác thực Captcha thất bại. Vui lòng thử lại.';
          break;
        default:
          errorMessage = `Lỗi: ${error.message || 'Không xác định'}`;
      }
    }
    
    // Hiển thị thông báo lỗi
    showToast.error(`Lỗi gửi OTP: ${errorMessage}`);
    
    return {
      success: false,
      error: error,
      errorMessage
    };
  }
};

// Xác thực mã OTP
const verifyOTP = async (confirmationResult: any, otpCode: string) => {
  try {
    const credential = await confirmationResult.confirm(otpCode);
    const user = credential.user;
    const idToken = await user.getIdToken();
    
    return {
      success: true,
      user,
      idToken
    };
  } catch (error) {
    console.error('Lỗi khi xác thực OTP:', error);
    return {
      success: false,
      error
    };
  }
};

// Đăng nhập với credential
const signInWithCredential = async (auth: any, credential: any) => {
  try {
    return await auth.signInWithCredential(credential);
  } catch (error) {
    console.error('Lỗi khi đăng nhập với credential:', error);
    throw error;
  }
};

export {
  auth,
  initRecaptcha,
  sendOTP,
  verifyOTP,
  signInWithCredential,
  checkFirebaseConfig
};
