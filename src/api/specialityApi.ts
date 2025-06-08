import { fetchData, fetchDataWithParams } from './commonFunction';
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
};

export default specialityApi;
