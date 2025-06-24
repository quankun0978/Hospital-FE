import axios from './axios'

export interface CreateScheduleDto {
  date: string
  timeType: string
  doctorId: string
}

export interface UpdateScheduleDto {
  date: string
  timeType: string
  doctorId: string
}

export interface ScheduleResponseDto {
  id: number
  date: string
  timeType: string
  timeTypeText: string
  doctorId: string
  doctorName: string
  doctorEmail: string
}

export interface DoctorOptionDto {
  id: string
  name: string
  email: string
}

const scheduleApi = {
  // Lấy danh sách lịch khám (Admin only)
  getSchedules: (params: any) => {
    return axios.get('/Schedule', { params })
  },

  // Lấy lịch khám của bác sĩ
  getSchedulesByDoctor: (params: any) => {
    return axios.get('/Schedule/doctor', { params })
  },

  // Lấy chi tiết lịch khám
  getScheduleById: (id: number) => {
    return axios.get(`/Schedule/${id}`)
  },

  // Tạo lịch khám mới
  createSchedule: (data: CreateScheduleDto) => {
    return axios.post('/Schedule', data)
  },

  // Cập nhật lịch khám
  updateSchedule: (id: number, data: UpdateScheduleDto) => {
    return axios.put(`/Schedule/${id}`, data)
  },

  // Xóa lịch khám
  deleteSchedule: (id: number) => {
    return axios.delete(`/Schedule/${id}`)
  },

  // Lấy danh sách bác sĩ (Admin only)
  getDoctors: () => {
    return axios.get('/Schedule/doctors')
  },

  // Lấy lịch khám theo khoảng thời gian
  getSchedulesByDateRange: (params: {
    startDate: string
    endDate: string
    doctorId?: string
  }) => {
    return axios.get('/Schedule/date-range', { params })
  },

  // Lấy lịch khám của bác sĩ theo doctorId
  getSchedulesByDoctorId: (doctorId: string) => {
    return axios.get(`/Schedule/doctor/${doctorId}`);
  },

  // Lấy lịch khám của bác sĩ theo slug
  getSchedulesByDoctorSlug: (slug: string, date?: string) => {
    const params = new URLSearchParams();
    if (date) {
      params.append('date', date);
    }
    
    const url = date 
      ? `/Schedule/doctor/slug/${slug}?${params.toString()}`
      : `/Schedule/doctor/slug/${slug}`;
      
    return axios.get(url);
  },
}

export default scheduleApi 