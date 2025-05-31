import { fetchData, postData, updateData } from './commonFunction';
import type { Patient } from '../model/Patient';

const patientApi = {
  getAll: () => fetchData<Patient[]>('/patients'),
  getById: (id: string | number) => fetchData<Patient>(`/patients/${id}`),
  create: (data: Partial<Patient>) => postData<Patient>('/patients', data),
  update: (id: string | number, data: Partial<Patient>) => updateData<Patient>(`/patients/${id}`, data),
};

export default patientApi; 