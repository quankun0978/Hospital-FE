import { fetchData, updateData, postData } from './commonFunction';
import type { User } from '../model/User';

const userApi = {
  getProfile: () => fetchData<User>('/user/profile'),
  updateProfile: (data: Partial<User>) => updateData<User>('/user/profile', data),
  changePassword: (userId: string, data: { currentPassword: string; newPassword: string; confirmPassword: string }) => 
    postData<{ success: boolean }>(`/user/${userId}/change-password`, data),
  getUserByID: (id: string) => fetchData<User>(`/user/${id}`),
  resetPassword: (data: { token: string; newPassword: string; confirmPassword: string }) => 
    postData<{ success: boolean }>('/user/reset-password', data),
};

export default userApi;
export { userApi }; 