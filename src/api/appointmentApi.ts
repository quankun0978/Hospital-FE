import { fetchData, fetchDataWithParams, postData, updateData } from './commonFunction';
import type { PaginatedResponse } from '../model/PaginatedResponse';

export interface CreateAppointmentRequest {
  patientId: string;
  doctorId: string;
  appointmentDate: string;
  timeType: string;
  reason?: string;
}

export interface AppointmentDetails {
  appointmentId: string;
  patientId: string;
  patientName?: string;
  doctorId: string;
  doctorName?: string;
  appointmentDate: string;
  timeType?: string;
  reason?: string;
  status: string;
  statusText: string;
  createdAt: string;
  updatedAt?: string;
}

export interface UpdateStatusRequest {
  status: string;
}

const appointmentApi = {
  // Tạo lịch hẹn mới
  create: (data: CreateAppointmentRequest) => 
    postData<{ appointmentId: string }>('/Appointment', data),

  // Lấy thông tin lịch hẹn theo ID
  getById: (id: string) => 
    fetchData<AppointmentDetails>(`/Appointment/${id}`),

  // Lấy danh sách lịch hẹn có phân trang
  getAll: (parameters: any) => 
    fetchDataWithParams<PaginatedResponse<AppointmentDetails>>('/Appointment', parameters),

  // Lấy danh sách lịch hẹn theo bệnh nhân
  getByPatientId: (patientId: string) => 
    fetchData<AppointmentDetails[]>(`/Appointment/patient/${patientId}`),

  // Lấy danh sách lịch hẹn theo bác sĩ
  getByDoctorId: (doctorId: string) => 
    fetchData<AppointmentDetails[]>(`/Appointment/doctor/${doctorId}`),

  // Lấy danh sách lịch hẹn theo người dùng
  getByUserId: (userId: string) => 
    fetchData<AppointmentDetails[]>(`/Appointment/user/${userId}`),

  // Cập nhật trạng thái lịch hẹn
  updateStatus: (id: string, data: UpdateStatusRequest) => 
    updateData<{ success: boolean }>(`/Appointment/${id}/status`, data),

  // Hủy lịch hẹn
  cancel: (id: string) => 
    updateData<{ success: boolean }>(`/Appointment/${id}/cancel`, {}),

  // Xác nhận lịch hẹn
  confirm: (id: string) => 
    updateData<{ success: boolean }>(`/Appointment/${id}/confirm`, {}),
};

export default appointmentApi; 