import { fetchData, fetchDataWithParams } from './commonFunction';
import type { Clinic } from '../model/Clinic';
import type { PaginatedResponse } from '../model/PaginatedResponse';

const clinicApi = {
  getAll: () => fetchData<Clinic[]>('/Clinic'),
  getById: (id: string | number) => fetchData<Clinic>(`/clinics/${id}`),
  getClinics: (parameters: any) => 
    fetchDataWithParams<PaginatedResponse<Clinic>>('/Clinic', parameters),
};

export default clinicApi; 