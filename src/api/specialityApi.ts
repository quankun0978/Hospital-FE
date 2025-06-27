import { fetchData, fetchDataWithParams, postData, updateData, deleteData } from './commonFunction';
import type { Specialty } from '../model/Specialty';
import type { PaginatedResponse } from '../model/PaginatedResponse';

const specialityApi = {
  // Lấy tất cả chuyên khoa
  getAll: () => fetchData<Specialty[]>('/specialty'),
  
  // Lấy chuyên khoa theo ID
  getById: (id: string | number) => fetchData<Specialty>(`/specialty/${id}`),
  
  // Lấy danh sách chuyên khoa với phân trang và filter
  getSpecialties: (parameters: any) => 
    fetchDataWithParams<PaginatedResponse<Specialty>>('/specialty', parameters),
  
  // Lấy chuyên khoa theo slug
  getBySlug: (slug: string) => fetchData<Specialty>(`/specialty/slug/${slug}`),

  // Thêm các methods mới cho admin management
  // Lấy tất cả chuyên khoa với phân trang
  getAllSpecialties: (parameters: any = { pageNumber: 1, pageSize: 1000 }) => 
    fetchDataWithParams<PaginatedResponse<Specialty>>('/specialty', parameters),

  // Lấy chuyên khoa theo ID cho admin
  getSpecialtyById: (id: string) => fetchData<Specialty>(`/specialty/${id}`),

  // Tạo chuyên khoa mới
  createSpecialty: (data: any) => postData<Specialty>('/specialty', data),

  // Cập nhật chuyên khoa
  updateSpecialty: (id: string, data: any) => updateData<Specialty>(`/specialty/${id}`, data),

  // Xóa chuyên khoa
  deleteSpecialty: (id: string) => deleteData<any>(`/specialty/${id}`)
};

export default specialityApi;
