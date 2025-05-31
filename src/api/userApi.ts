import { fetchData, updateData, postData } from './commonFunction';
import type { User } from '../model/User';

const userApi = {
  getProfile: () => fetchData<User>('/user/profile'),
  updateProfile: (data: Partial<User>) => updateData<User>('/user/profile', data),
  changePassword: (data: { oldPassword: string; newPassword: string }) => 
    postData<{ message: string }>('/user/change-password', data),
};

export default userApi; 