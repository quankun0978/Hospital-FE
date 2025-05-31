import { deleteData, fetchData, postData, updateData } from './commonFunction';

const patientRecordApi = {
  getByUserId: (userId: string) => fetchData(`/PatientRecord/user/${userId}`),
  create: (data: any) => postData('/PatientRecord', data),
  update: (id: string, data: any) => updateData(`/PatientRecord/${id}`, data),
  delete: (id: string) => deleteData(`/PatientRecord/${id}`),
};

export default patientRecordApi;
