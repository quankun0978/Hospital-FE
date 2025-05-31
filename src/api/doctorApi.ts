import { fetchData, fetchDataWithParams } from './commonFunction';
import type { Doctor } from '../model/Doctor';
import type { QueryParameters } from '../model/QueryParameters';
import type { PaginatedResponse } from '../model/PaginatedResponse';

const doctorApi = {
  getAll: () => fetchData<Doctor[]>('/doctors'),
  getById: (id: string | number) => fetchData<Doctor>(`/Doctor/${id}`),
  getBySlug: (slug: string) => fetchData<Doctor>(`/Doctor/by-slug/${slug}`),
  getBySpecialty: (specialty: string) => fetchData<Doctor[]>(`/doctors/specialty/${specialty}`),
  getDoctors: (parameters: QueryParameters) => 
    fetchDataWithParams<PaginatedResponse<Doctor>>('/Doctor', parameters),
};

export default doctorApi; 