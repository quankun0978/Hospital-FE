import { fetchData, fetchDataWithParams, postData, updateData, deleteData } from './commonFunction';

// Interface cho User
export interface User {
  userId: string;
  username?: string;
  name: string;
  email?: string;
  roleId: string;
  role?: {
    codeKey: string;
    value: string;
  };
}

// Interface cho tạo user mới
export interface CreateUserDto {
  username?: string;
  password: string;
  name: string;
  email?: string;
  roleId: string;
}

// Interface cho cập nhật user
export interface UpdateUserDto {
  username?: string;
  name: string;
  email?: string;
  roleId: string;
}

// Interface cho phân trang
export interface QueryParameters {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Interface cho kết quả phân trang
export interface PaginatedResult<T> {
  data: T[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

const adminApi = {
  // Lấy tất cả user
  getAllUsers: () => fetchData<User[]>('/user/all'),
  
  // Lấy user có phân trang
  getUsers: (params: QueryParameters) => fetchDataWithParams<PaginatedResult<User>>('/user', params),
  
  // Lấy user theo ID
  getUserById: (id: string) => fetchData<User>(`/user/${id}`),
  
  // Tạo user mới
  createUser: (data: CreateUserDto) => postData<{ userId: string }>('/user', data),
  
  // Cập nhật user
  updateUser: (id: string, data: UpdateUserDto) => updateData<{ success: boolean }>(`/user/${id}`, data),
  
  // Xóa user
  deleteUser: (id: string) => deleteData(`/user/${id}`),
};

export default adminApi; 