import { postData, fetchData } from './commonFunction';
import type { User } from '../model/User';

const authApi = {
  login: (data: { email: string; password: string }) => postData<{ accessToken: string; refreshToken: string; user: User }>('/auth/login', data),
  register: (data: { 
    username?: string; 
    password: string; 
    name: string; 
    email: string; 
    roleId: string; 
    fullName: string; 
    dateOfBirth?: string; 
    gender: string; 
    address: string; 
    phone: string; 
  }) => postData<User>('/auth/register', data),
  sendEmailVerification: (data: { email: string }) => postData<{ message: string }>('/auth/send-email-verification', data),
  verifyEmail: (data: { email: string; verificationCode: string }) => postData<{ message: string }>('/auth/verify-email', data),
  checkEmail: (email: string) => postData<{ message: string }>('/auth/check-email', { email }),
  refreshToken: (data: { refreshToken: string }) => postData<{ accessToken: string; refreshToken: string }>('/auth/refresh-token', data),
  sendOTP: (phone: string) => postData<{ message: string }>('/register/send-otp', { phone }),
  verifyOTP: (phone: string, otp: string) => postData<{ message: string }>('/register/verify-otp', { phone, otp }),
  checkExistsPhone:(phone: string) => postData<{ message: string }>('/Auth/check-phone', { phone }),
  
  // Forgot password functions
  forgotPassword: (data: { email: string }) => postData<{ success: boolean }>('/auth/forgot-password', data),
  validateResetToken: (token: string) => fetchData<{ email: string }>(`/auth/validate-reset-token?token=${encodeURIComponent(token)}`),
};

export default authApi;
export { authApi }; 