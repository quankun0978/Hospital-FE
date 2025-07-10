import { fetchData, fetchDataWithParams, postData, updateData, deleteData } from './commonFunction';
import axios from './axios';

// Interface cho Doctor
export interface Doctor {
  id: number;
  doctorId: string;
  priceId: string;
  positionId?: string;
  clinicId?: string;
  slug?: string;
  note?: string;
  imageUrl?: string;
  count?: number;
  doctor?: {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    gender?: string;
  };
  price?: {
    codeKey: string;
    type: string;
    valueEn: string;
    valueVi: string;
  };
  position?: {
    codeKey: string;
    type: string;
    valueEn: string;
    valueVi: string;
  };
  clinic?: {
    clinicId: string;
    name: string;
    address?: string;
  };
}

// Interface cho Doctor Markdown
export interface DoctorMarkdown {
  id: string;
  doctorId: string;
  contentHTML: string;
  contentMarkdown: string;
  description?: string;
}

// Interface cho tạo doctor mới
export interface CreateDoctorDto {
  doctorId: string;
  priceId: string;
  positionId?: string;
  clinicId?: string;
  slug?: string;
  note?: string;
  imageUrl?: string;
  count?: number;
  contentHtml?: string;
  contentMarkdown?: string;
}

// Interface cho cập nhật doctor
export interface UpdateDoctorDto {
  priceId?: string;
  positionId?: string;
  clinicId?: string;
  slug?: string;
  note?: string;
  imageUrl?: string;
  count?: number;
  contentHtml?: string;
  contentMarkdown?: string;
}

// Interface cho phân trang
export interface QueryParameters {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  roleId?: string;
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

export interface User {
  userId: string;
  username: string;
  email: string;
  name: string;
  roleId: string;
  roleName: string;
}

export interface DoctorInfo {
  id: number;
  doctorId: string;
  priceId: string;
  positionId?: string;
  clinicId?: string;
  slug: string;
  note?: string;
  imageUrl?: string;
  count: number;
  priceName?: string;
  positionName?: string;
  clinicName?: string;
}

export interface Clinic {
  clinicId: string;
  name: string;
  address?: string;
  isHospital: boolean;
  slug: string;
}

export interface Specialty {
  specialtyId: string;
  name: string;
}

export interface AllCode {
  codeKey: string;
  type: string;
  valueVi: string;
  valueEn: string;
}

const doctorApi = {
  // Lấy doctor có phân trang
  getDoctors: (params: QueryParameters) => fetchDataWithParams<PaginatedResult<Doctor>>('/doctor', params),
  
  // Lấy doctor theo ID
  getDoctorById: (id: string) => fetchData<Doctor>(`/doctor/${id}`),
  
  // Lấy doctor theo slug
  getDoctorBySlug: (slug: string) => fetchData<Doctor>(`/Doctor/by-slug/${slug}`),
  
  // Lấy markdown content của doctor
  getDoctorMarkdown: (id: string) => fetchData<DoctorMarkdown>(`/doctor/${id}/markdown`),
  
  // Lấy users theo role và chưa có DoctorInfo (để thêm mới)
  getUsersByRoleWithoutDoctorInfo: (roleId: string, params: QueryParameters = {}) => fetchDataWithParams<User[]>(`/User/by-role/${roleId}/without-doctor-info`, params),
  
  // Lấy users theo role (tất cả, dùng khi edit)
  getUsersByRole: (roleId: string, params: QueryParameters = {}) => fetchDataWithParams<User[]>(`/User/by-role/${roleId}`, params),
  
  // Lấy danh sách allcodes theo type (sử dụng endpoint options)
  getAllcodes: (type: string) => fetchData<any[]>(`/allcode/options/${type}`),
  
  // Lấy danh sách clinics
  getClinics: (params: QueryParameters) => fetchDataWithParams<PaginatedResult<any>>('/clinic', params),
  
  // Tạo doctor mới với JSON
  createDoctor: async (data: CreateDoctorDto) => {
    try {
      console.log('Creating doctor with data:', data);
      
      const response = await axios.post('/doctor', data, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Accept-Charset': 'utf-8'
        }
      });

      return {
        succeeded: response.data.succeeded,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error: any) {
      console.error('Create doctor error:', error);
      return {
        succeeded: false,
        message: error.response?.data?.message || 'Lỗi khi tạo thông tin bác sĩ'
      };
    }
  },
  
  // Cập nhật doctor với JSON
  updateDoctor: async (id: string, data: UpdateDoctorDto) => {
    try {
      console.log('Updating doctor with data:', data);
      
      const response = await axios.put(`/doctor/${id}`, data, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Accept-Charset': 'utf-8'
        }
      });

      return {
        succeeded: response.data.succeeded,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error: any) {
      console.error('Update doctor error:', error);
      return {
        succeeded: false,
        message: error.response?.data?.message || 'Lỗi khi cập nhật thông tin bác sĩ'
      };
    }
  },
  
  // Xóa doctor
  deleteDoctor: (id: string) => deleteData(`/doctor/${id}`),
};

export default doctorApi; 