import { fetchData, fetchDataWithParams, postData, updateData } from './commonFunction'

// Interface cho tạo lịch hẹn
export interface CreateAppointmentRequest {
  patientId: string
  doctorId: string
  appointmentDate: string
  timeType: string
  reason?: string
}

// Interface cho thông tin lịch hẹn chi tiết
export interface AppointmentDetails {
  appointmentId: string
  patientId: string
  patient?: {
    fullName: string
    phone: string
    email: string
    dateOfBirth: string
    gender: string
    address: string
    healthInsuranceNumber: string
    identityNumber: string
    ethnicity: string
    occupation: string
    patientCode: string
  }
  doctorId: string
  doctor?: {
    name: string
    email: string
  }
  appointmentDate: string
  timeType?: string
  reason?: string
  status: string
  createdAt: string
  updatedAt?: string
}

// Interface cho hoàn thành khám bệnh
export interface CompleteAppointmentRequest {
  appointmentId: string
  medicalNotes: string
  medicalImages: string[]
}

// Interface cho phân trang
export interface QueryParameters {
  pageNumber?: number
  pageSize?: number
  searchTerm?: string
  status?: string
  appointmentDate?: string
}

// Interface cho kết quả phân trang
export interface PaginatedResult<T> {
  data: T[]
  pageNumber: number
  pageSize: number
  totalPages: number
  totalRecords: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

const appointmentApi = {
  // Lấy danh sách lịch hẹn với phân trang và filter
  getAppointments: (params: QueryParameters) => 
    fetchDataWithParams<PaginatedResult<AppointmentDetails>>('/appointment', params),

  // Lấy chi tiết lịch hẹn theo ID
  getAppointmentById: (id: string) => 
    fetchData<AppointmentDetails>(`/appointment/${id}`),

  // Tạo lịch hẹn mới
  createAppointment: (data: CreateAppointmentRequest) => 
    postData<{ appointmentId: string }>('/appointment', data),

  // Lấy lịch hẹn theo bệnh nhân
  getAppointmentsByPatient: (patientId: string) => 
    fetchData<AppointmentDetails[]>(`/appointment/patient/${patientId}`),

  // Lấy lịch hẹn theo bác sĩ
  getAppointmentsByDoctor: (doctorId: string) => 
    fetchData<AppointmentDetails[]>(`/appointment/doctor/${doctorId}`),

  // Lấy lịch hẹn theo người dùng
  getAppointmentsByUser: (userId: string) => 
    fetchData<AppointmentDetails[]>(`/appointment/user/${userId}`),

  // Cập nhật trạng thái lịch hẹn
  updateAppointmentStatus: (id: string, status: string) => 
    updateData<{ success: boolean }>(`/appointment/${id}/status`, { status }),

  // Hủy lịch hẹn
  cancelAppointment: (id: string) => 
    updateData<{ success: boolean }>(`/appointment/${id}/cancel`, {}),

  // Xác nhận lịch hẹn
  confirmAppointment: (id: string) => 
    updateData<{ success: boolean }>(`/appointment/${id}/confirm`, {}),

  // Hoàn thành khám bệnh và gửi kết quả
  completeAppointment: (data: CompleteAppointmentRequest) => 
    postData<{ success: boolean }>('/appointment/complete', data)
}

export default appointmentApi 