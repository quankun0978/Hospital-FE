import { fetchData, fetchDataWithParams, postData, updateData, deleteData } from './commonFunction';
import axios from './axios';

// Interface cho Clinic
export interface Clinic {
  clinicId: string;
  name: string;
  slug?: string;
  address?: string;
  phone?: string;
  email?: string;
  description?: string;
  imageUrl?: string;
  logoImg?: string;
  isHospital?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Interface cho tạo clinic mới
export interface CreateClinicDto {
  name: string;
  address?: string;
  description?: string;
  slug?: string;
  imageUrl?: string;
  logoImg?: string;
  isHospital?: boolean;
}

// Interface cho cập nhật clinic
export interface UpdateClinicDto {
  name: string;
  address?: string;
  description?: string;
  slug?: string;
  imageUrl?: string;
  logoImg?: string;
  isHospital?: boolean;
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

const clinicApi = {
  // Lấy clinic có phân trang
  getClinics: (params: QueryParameters) => fetchDataWithParams<PaginatedResult<Clinic>>('/clinic', params),
  
  // Lấy clinic theo ID
  getClinicById: (id: string) => fetchData<Clinic>(`/clinic/${id}`),
  
  // Lấy clinic theo slug
  getClinicBySlug: (slug: string) => fetchData<Clinic>(`/clinic/slug/${slug}`),
  
  // Tạo clinic mới với JSON
  createClinic: async (data: CreateClinicDto) => {
    try {
      const response = await axios.post('/clinic', data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return {
        succeeded: response.data.succeeded,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error: any) {
      return {
        succeeded: false,
        message: error.response?.data?.message || 'Lỗi khi tạo cơ sở y tế'
      };
    }
  },
  
  // Cập nhật clinic với JSON
  updateClinic: async (id: string, data: UpdateClinicDto) => {
    try {
      const response = await axios.put(`/clinic/${id}`, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return {
        succeeded: response.data.succeeded,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error: any) {
      return {
        succeeded: false,
        message: error.response?.data?.message || 'Lỗi khi cập nhật cơ sở y tế'
      };
    }
  },
  
  // Xóa clinic
  deleteClinic: (id: string) => deleteData(`/clinic/${id}`),
};

export default clinicApi; 