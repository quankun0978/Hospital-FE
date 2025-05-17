import axiosInstance from './axios';
import type { AxiosResponse } from 'axios';

// =============== INTERFACES/MODELS ===============

// Interface chung cho response từ API
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
}

// Interface cho QueryParameters
export interface QueryParameters {
  PageNumber?: number;
  PageSize?: number;
  search?: string;
  sortBy?: string;
  sortDirection?: string;
}

// Class cơ sở cho các entity
export class BaseEntity {
  id: string | number;

  constructor(id: string | number) {
    this.id = id;
  }
}

// Class cho User
export class User extends BaseEntity {
  username: string;
  email: string;
  phone: string;
  role: string;

  constructor(data: Partial<User>) {
    super(data.id || '');
    this.username = data.username || '';
    this.email = data.email || '';
    this.phone = data.phone || '';
    this.role = data.role || '';
  }
}

// Class cho Doctor
export class Doctor extends BaseEntity {
  name: string;
  specialty: string;
  description: string;
  avatar: string;

  constructor(data: Partial<Doctor>) {
    super(data.id || '');
    this.name = data.name || '';
    this.specialty = data.specialty || '';
    this.description = data.description || '';
    this.avatar = data.avatar || '';
  }
}

// Class cho Patient
export class Patient extends BaseEntity {
  name: string;
  phone: string;
  dateOfBirth: Date;
  address: string;

  constructor(data: Partial<Patient>) {
    super(data.id || '');
    this.name = data.name || '';
    this.phone = data.phone || '';
    this.dateOfBirth = data.dateOfBirth || new Date();
    this.address = data.address || '';
  }
}

// =============== PHƯƠNG THỨC API CHUNG ===============

// Phương thức GET chung
export const fetchData = async <T>(url: string): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await axiosInstance.get(url);
    return response.data;
  } catch (error: any) {
    return handleApiError<T>(error);
  }
};

// Phương thức GET với tham số
export const fetchDataWithParams = async <T>(url: string, params: any): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await axiosInstance.get(url, { params });
    return response.data;
  } catch (error: any) {
    return handleApiError<T>(error);
  }
};

// Phương thức POST chung
export const postData = async <T>(url: string, data: any): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await axiosInstance.post(url, data);
    return response.data;
  } catch (error: any) {
    return handleApiError<T>(error);
  }
};

// Phương thức PUT chung
export const updateData = async <T>(url: string, data: any): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await axiosInstance.put(url, data);
    return response.data;
  } catch (error: any) {
    return handleApiError<T>(error);
  }
};

// Phương thức DELETE chung
export const deleteData = async <T>(url: string): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await axiosInstance.delete(url);
    return response.data;
  } catch (error: any) {
    return handleApiError<T>(error);
  }
};

// Hàm xử lý lỗi chung
export const handleApiError = <T>(error: any): ApiResponse<T> => {
  if (error.response) {
    // Máy chủ trả về lỗi (status code không phải 2xx)
    return {
      success: false,
      message: error.response.data.errors[0] || 'Lỗi từ máy chủ',
      errors: error.response.data.errors,
    };
  } else if (error.request) {
    // Không nhận được phản hồi từ máy chủ
    return {
      success: false,
      message: 'Không thể kết nối đến máy chủ',
    };
  } else {
    // Lỗi khi thiết lập request
    return {
      success: false,
      message: error.message || 'Đã xảy ra lỗi',
    };
  }
};

// =============== API CỤ THỂ ===============

// API Authentication
export const authApi = {
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
};

// API User
export const userApi = {
  getProfile: () => fetchData<User>('/user/profile'),
  updateProfile: (data: Partial<User>) => updateData<User>('/user/profile', data),
  changePassword: (data: { oldPassword: string; newPassword: string }) => 
    postData<{ message: string }>('/user/change-password', data),
};

// API Doctor
export interface DoctorInfo {
  id: number;
  doctorId: string;
  priceId: string;
  priceName: string;
  positionId: string;
  positionName: string;
  clinicId?: string;
  clinicName: string;
  slug: string;
  note: string;
  imageUrl: string;
  count?: number;
}

export interface Doctor {
  doctorId: string;
  name: string;
  username: string;
  phone: string;
  roleId: string;
  roleName: string;
  doctorInfos: DoctorInfo[];
}

export interface PaginatedResponse<T> {
  items: T[];
  PageNumber: number;
  PageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export const doctorApi = {
  getAll: () => fetchData<Doctor[]>('/doctors'),
  getById: (id: string | number) => fetchData<Doctor>(`/Doctor/${id}`),
  getBySpecialty: (specialty: string) => fetchData<Doctor[]>(`/doctors/specialty/${specialty}`),
  getDoctors: (parameters: QueryParameters) => 
    fetchDataWithParams<PaginatedResponse<Doctor>>('/Doctor', parameters),
};

// API Patient
export const patientApi = {
  getAll: () => fetchData<Patient[]>('/patients'),
  getById: (id: string | number) => fetchData<Patient>(`/patients/${id}`),
  create: (data: Partial<Patient>) => postData<Patient>('/patients', data),
  update: (id: string | number, data: Partial<Patient>) => updateData<Patient>(`/patients/${id}`, data),
};

// API Clinic
export interface Clinic {
  clinicId: string;
  name: string;
  address: string;
  description?: string;
  imageUrl?: string;
  phone?: string;
  email?: string;
  openTime?: string;
  closeTime?: string;
  latitude?: number;
  longitude?: number;
  slug?: string;
}

export const clinicApi = {
  getAll: () => fetchData<Clinic[]>('/Clinic'),
  getById: (id: string | number) => fetchData<Clinic>(`/clinics/${id}`),
  getClinics: (parameters: any) => 
    fetchDataWithParams<PaginatedResponse<Clinic>>('/Clinic', parameters),
};
