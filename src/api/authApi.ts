import { postData } from './commonFunction';
import type { User } from '../model/User';

const authApi = {
  login: (data: { phone: string; password: string }) => postData<{ token: string; user: User }>('/auth/login', data),
  register: (data: { 
    username: string; 
    password: string; 
    name: string; 
    phone: string; 
    roleId: string; 
    fullName: string; 
    dateOfBirth: string; 
    gender: string; 
    address: string; 
    email: string; 
    healthInsuranceNumber: string 
  }) => postData<User>('/auth/register', data),
  sendOTP: (phone: string) => postData<{ message: string }>('/register/send-otp', { phone }),
  verifyOTP: (phone: string, otp: string) => postData<{ message: string }>('/register/verify-otp', { phone, otp }),
  checkExistsPhone:(phone: string) => postData<{ message: string }>('/Auth/check-phone', { phone }),

};

export default authApi; 