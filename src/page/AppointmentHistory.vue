<template>
  <section class="bg-gray-100">
    <div class="max-w-7xl mx-auto md:p-4 grid grid-cols-1 md:grid-cols-12 md:gap-4 lg:py-10">
      <!-- Sidebar -->
      <div class="col-span-1 md:col-span-3">
        <div class="bg-white md:rounded-md">
          <ul class="flex overflow-y-auto hide-scroll-bar md:py-4 md:flex-col">
            <li v-if="isAdminOrDoctor">
              <router-link class="menu-item" to="/admin">Trang quản lý</router-link>
            </li>
            <li>
              <router-link class="menu-item item-active" to="/appointments">Lịch khám của tôi</router-link>
            </li>
            <li>
              <router-link class="menu-item" to="/patient-record">Hồ sơ</router-link>
            </li>
            <li>
              <router-link class="menu-item" to="/change-password">Đổi mật khẩu</router-link>
            </li>
            <li>
              <button class="menu-item w-full text-left" @click="logout">Đăng xuất</button>
            </li>
          </ul>
        </div>
      </div>

      <!-- Main content -->
      <main class="flex-1 flex flex-col md:col-span-9">
        <div class="bg-white shadow rounded-lg">
          <!-- Header -->
          <div class="p-6 border-b">
            <div class="flex items-center justify-between">
              <div>
                <h1 class="text-2xl font-bold text-gray-900">Lịch khám của tôi</h1>
                <p class="text-gray-600 mt-1">Quản lý và theo dõi các lịch hẹn khám bệnh</p>
              </div>
              <div class="text-right">
                <div class="text-2xl font-bold text-blue-600">{{ totalAppointments }}</div>
                <div class="text-sm text-gray-500">Tổng số lịch khám</div>
              </div>
            </div>
          </div>

          <!-- Filter Section -->
          <div class="p-6 border-b">
            <div class="flex flex-wrap gap-4 items-center">
              <div class="flex-1 min-w-64">
                <div class="relative">
                  <input
                  v-model="searchTerm"
                    type="text"
                  placeholder="Tìm kiếm theo tên bác sĩ, lý do khám..."
                    class="w-full max-w-md pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  />
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div class="flex gap-4">
                <input
                  v-model="dateFilter"
                  type="date"
                  class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white"
                  style="width: 160px"
                  title="Lọc theo ngày khám"
                />
                <select
                  v-model="statusFilter"
                  class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white"
                  style="width: 150px"
                >
                  <option value="">Tất cả</option>
                  <option value="S1">Lịch hẹn mới</option>
                  <option value="S2">Đã xác nhận</option>
                  <option value="S3">Đã khám xong</option>
                  <option value="S4">Đã hủy</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="p-6">
            <!-- Loading State -->
            <div v-if="loading" class="text-center py-12">
              <a-spin size="large" />
              <p class="mt-4 text-gray-500">Đang tải dữ liệu...</p>
            </div>

            <!-- Empty State -->
            <div v-else-if="filteredAppointments.length === 0 && !loading" class="text-center py-12">
              <div class="text-6xl mb-4">📅</div>
              <h3 class="text-xl font-semibold text-gray-700 mb-2">Chưa có lịch khám nào</h3>
              <p class="text-gray-500 mb-6">Bạn chưa có lịch khám nào được đặt trong hệ thống</p>
              <router-link to="/search">
                <a-button type="primary" size="large">
                  Đặt lịch khám ngay
                </a-button>
              </router-link>
            </div>

            <!-- Appointments List -->
            <div v-else class="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              <div
                v-for="appointment in paginatedAppointments"
                :key="appointment.appointmentId"
                class="border rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
              >
                <div class="flex items-start justify-between">
                  <!-- Appointment Info -->
                  <div class="flex-1">
                    <div class="flex items-center gap-4 mb-4">
                      <div class="flex-shrink-0">
                        <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span class="text-blue-600 font-semibold text-lg">
                            BS
                          </span>
                        </div>
                      </div>
                      <div class="flex-1">
                        <h3 class="text-lg font-semibold text-gray-900 mb-1">
                          {{ appointment.doctor?.name || appointment.doctorName || 'Bác sĩ' }}
                        </h3>
                        <p class="text-gray-600 text-sm">{{ appointment.patient?.fullName || appointment.patientName || 'Bệnh nhân' }}</p>
                      </div>
                      <div class="text-right">
                        <a-tag :color="getStatusColor(appointment.status)">
                          {{ getStatusText(appointment.status) }}
                        </a-tag>
                      </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div class="flex items-center gap-2">
                        <CalendarOutlined class="text-gray-400" />
                        <span class="text-sm text-gray-700">
                          {{ formatDate(appointment.appointmentDate) }}
                        </span>
                      </div>
                      <div class="flex items-center gap-2">
                        <ClockCircleOutlined class="text-gray-400" />
                        <span class="text-sm text-gray-700">
                          {{ appointment.timeTypeText || 'Chưa xác định' }}
                        </span>
                      </div>
                      <div class="flex items-center gap-2">
                        <FileTextOutlined class="text-gray-400" />
                        <span class="text-sm text-gray-700">
                          {{ appointment.reason || 'Không có ghi chú' }}
                        </span>
                      </div>
                    </div>

                    <div class="text-xs text-gray-500">
                      Đặt lịch: {{ formatDateTime(appointment.createdAt) }}
                      <span v-if="appointment.updatedAt" class="ml-4">
                        Cập nhật: {{ formatDateTime(appointment.updatedAt) }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
                  <button 
                    v-if="canCancelAppointment(appointment)"
                    @click="cancelAppointment(appointment.appointmentId)"
                    :disabled="cancelingIds.includes(appointment.appointmentId)"
                    class="transition-colors btn focus:outline-none shadow btn-outline text-red-600 border-red-300 hover:bg-red-600 hover:text-white hover:border-red-600 py-2 px-4 text-sm rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span v-if="cancelingIds.includes(appointment.appointmentId)">Đang hủy...</span>
                    <span v-else>Hủy lịch</span>
                  </button>
                  <button 
                    @click="viewDetails(appointment)"
                    class="transition-colors btn focus:outline-none shadow btn-outline py-2 px-4 text-sm rounded"
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>

            <!-- Pagination -->
            <div v-if="filteredAppointments.length > pageSize" class="flex justify-center mt-8">
              <a-pagination
                v-model="currentPage"
                :total="filteredAppointments.length"
                :page-size="pageSize"
                :show-size-changer="false"
                :show-quick-jumper="true"
                :show-total="(total, range) => `${range[0]}-${range[1]} của ${total} lịch khám`"
              />
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Detail Modal -->
    <a-modal
      :visible="detailModalVisible"
      @update:visible="detailModalVisible = $event"
      title="Chi tiết lịch khám"
      width="800px"
      :loading="modalLoading"
      :closable="true"
      :maskClosable="true"
      class="detail-modal"
    >
      <template #footer>
        <div class="flex justify-end">
          <a-button @click="detailModalVisible = false" type="primary">
            Đóng
          </a-button>
        </div>
      </template>
      <!-- Loading state -->
      <div v-if="modalLoading" class="text-center py-8">
        <a-spin size="large" />
        <p class="mt-4 text-gray-500">Đang tải thông tin...</p>
      </div>
      
      <!-- Content -->
      <div v-else-if="selectedAppointment" class="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
        <!-- Thông tin lịch khám -->
        <div class="border-b pb-4">
          <h3 class="text-lg font-semibold text-gray-800 mb-3">Thông tin lịch khám</h3>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-sm font-medium text-gray-500">Bác sĩ</label>
            <p class="text-base text-gray-900">{{ selectedAppointment.doctor?.name || selectedAppointment.doctorName || 'Bác sĩ' }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500">Ngày khám</label>
            <p class="text-base text-gray-900">{{ formatDate(selectedAppointment.appointmentDate) }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500">Giờ khám</label>
              <p class="text-base text-gray-900">{{ selectedAppointment.timeTypeText || selectedAppointment.timeType || 'Chưa xác định' }}</p>
          </div>
            <div>
            <label class="text-sm font-medium text-gray-500">Trạng thái</label>
            <div class="mt-1">
              <a-tag :color="getStatusColor(selectedAppointment.status)">
                {{ getStatusText(selectedAppointment.status) }}
              </a-tag>
            </div>
          </div>
          <div class="col-span-2">
            <label class="text-sm font-medium text-gray-500">Lý do khám</label>
            <p class="text-base text-gray-900">{{ selectedAppointment.reason || 'Không có ghi chú' }}</p>
          </div>
        </div>
        </div>

        <!-- Thông tin hồ sơ bệnh nhân -->
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-3">Thông tin hồ sơ bệnh nhân</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-gray-500">Họ và tên</label>
              <p class="text-base text-gray-900">{{ selectedAppointment.patient?.fullName || 'Chưa cập nhật' }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">Điện thoại</label>
              <p class="text-base text-gray-900">{{ selectedAppointment.patient?.phone || 'Chưa cập nhật' }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">Email</label>
              <p class="text-base text-gray-900">{{ selectedAppointment.patient?.email || 'Chưa cập nhật' }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">Ngày sinh</label>
              <p class="text-base text-gray-900">{{ selectedAppointment.patient?.dateOfBirth ? formatDate(selectedAppointment.patient.dateOfBirth) : 'Chưa cập nhật' }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">Giới tính</label>
              <p class="text-base text-gray-900">
                {{ selectedAppointment.patient?.gender === 'M' ? 'Nam' : 
                   selectedAppointment.patient?.gender === 'F' ? 'Nữ' : 'Chưa cập nhật' }}
              </p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">Mã bệnh nhân</label>
              <p class="text-base text-gray-900">{{ selectedAppointment.patient?.patientCode || 'Chưa cập nhật' }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">Mã BHYT</label>
              <p class="text-base text-gray-900">{{ selectedAppointment.patient?.healthInsuranceNumber || 'Chưa cập nhật' }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">Số CMND/CCCD</label>
              <p class="text-base text-gray-900">{{ selectedAppointment.patient?.identityNumber || 'Chưa cập nhật' }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">Dân tộc</label>
              <p class="text-base text-gray-900">{{ selectedAppointment.patient?.ethnicity || 'Chưa cập nhật' }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">Nghề nghiệp</label>
              <p class="text-base text-gray-900">{{ selectedAppointment.patient?.occupation || 'Chưa cập nhật' }}</p>
            </div>
            <div class="col-span-2">
              <label class="text-sm font-medium text-gray-500">Địa chỉ</label>
              <p class="text-base text-gray-900">{{ selectedAppointment.patient?.address || 'Chưa cập nhật' }}</p>
            </div>
          </div>
        </div>

        <!-- Thông tin thời gian -->
        <div class="border-t pt-4">
          <h3 class="text-lg font-semibold text-gray-800 mb-3">Thông tin thời gian</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-gray-500">Thời gian đặt lịch</label>
              <p class="text-base text-gray-900">{{ formatDateTime(selectedAppointment.createdAt) }}</p>
            </div>
            <div v-if="selectedAppointment.updatedAt">
              <label class="text-sm font-medium text-gray-500">Cập nhật lần cuối</label>
              <p class="text-base text-gray-900">{{ formatDateTime(selectedAppointment.updatedAt) }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- No data state -->
      <div v-else class="text-center py-8">
        <div class="text-6xl mb-4">📅</div>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">Không có thông tin</h3>
        <p class="text-gray-500">Không thể tải thông tin chi tiết lịch khám</p>
      </div>
    </a-modal>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import appointmentApi from '@/api/appointmentApi'
import { useAuthStore } from '@/store/auth'
import { 
  CalendarOutlined, 
  ClockCircleOutlined, 
  FileTextOutlined 
} from '@ant-design/icons-vue'
import dayjs from 'dayjs'

const authStore = useAuthStore()
const router = useRouter()

// Reactive data
const appointments = ref([])
const loading = ref(false)
const searchTerm = ref('')
const statusFilter = ref('')
const dateFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const cancelingIds = ref([])

// Modal
const detailModalVisible = ref(false)
const selectedAppointment = ref(null)
const modalLoading = ref(false)

// Computed
const totalAppointments = computed(() => appointments.value.length)

// Kiểm tra quyền admin hoặc doctor
const isAdminOrDoctor = computed(() => {
  const userRole = authStore.getUserRole
  return userRole === 'R1' || userRole === 'R2'
})

const filteredAppointments = computed(() => {
  let filtered = [...appointments.value]

  // Filter by search term
  if (searchTerm.value && searchTerm.value.trim()) {
    const term = searchTerm.value.toLowerCase().trim()
    console.log('Searching for term:', term)
    
    filtered = filtered.filter(appointment => {
      // Tìm kiếm tên bác sĩ (kiểm tra cả 2 cấu trúc có thể có)
      const doctorName = appointment.doctor?.name || appointment.doctorName || ''
      
      // Tìm kiếm tên bệnh nhân (kiểm tra cả 2 cấu trúc có thể có)  
      const patientName = appointment.patient?.fullName || appointment.patientName || ''
      
      // Lý do khám
      const reason = appointment.reason || ''
      
      const matchesDoctor = doctorName.toLowerCase().includes(term)
      const matchesPatient = patientName.toLowerCase().includes(term)
      const matchesReason = reason.toLowerCase().includes(term)
      
      const shouldInclude = matchesDoctor || matchesPatient || matchesReason
      
      // Debug log cho first appointment
      if (appointment === appointments.value[0]) {
        console.log('Search debug:', {
          term,
          doctorName,
          patientName,
          reason,
          matchesDoctor,
          matchesPatient, 
          matchesReason,
          shouldInclude
        })
      }
      
      return shouldInclude
    })
  }

  // Filter by status
  if (statusFilter.value && statusFilter.value.trim()) {
    filtered = filtered.filter(appointment => appointment.status === statusFilter.value)
  }

  // Filter by date
  if (dateFilter.value && dateFilter.value.trim()) {
    filtered = filtered.filter(appointment => {
      const appointmentDate = dayjs(appointment.appointmentDate).format('YYYY-MM-DD')
      return appointmentDate === dateFilter.value
    })
  }

  return filtered
})

const paginatedAppointments = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredAppointments.value.slice(start, end)
})

// Methods
const fetchAppointments = async () => {
  try {
    loading.value = true
    const userId = localStorage.getItem('userId')
    if (!userId) {
      message.error('Không tìm thấy thông tin người dùng')
      return
    }

    const response = await appointmentApi.getAppointmentsByUser(userId)
    appointments.value = response.data || []
    
    // Debug: Log cấu trúc dữ liệu để kiểm tra
    if (appointments.value.length > 0) {
      console.log('Sample appointment data:', appointments.value[0])
    }

  } catch (error) {
    console.error('Error fetching appointments:', error)
    message.error('Có lỗi xảy ra khi tải danh sách lịch khám')
  } finally {
    loading.value = false
  }
}

// Watch for search and filter changes to reset pagination
watch([searchTerm, statusFilter, dateFilter], () => {
  currentPage.value = 1
})

// Kiểm tra có thể hủy lịch hay không (chỉ trong 10 phút và trạng thái S1)
const canCancelAppointment = (appointment) => {
  // Chỉ cho phép hủy với trạng thái S1 (lịch hẹn mới) - không cho phép hủy khi đã xác nhận (S2)
  if (appointment.status !== 'S1') {
    return false
  }
  
  // Kiểm tra thời gian (chỉ cho phép hủy trong vòng 10 phút)
  const createdTime = new Date(appointment.createdAt)
  const currentTime = new Date()
  const timeDiff = (currentTime - createdTime) / (1000 * 60) // Chuyển đổi sang phút
  
  return timeDiff <= 10
}

const cancelAppointment = async (appointmentId) => {
  try {
    cancelingIds.value.push(appointmentId)
    await appointmentApi.cancelAppointment(appointmentId)
    message.success('Hủy lịch khám thành công')
    await fetchAppointments()
  } catch (error) {
    console.error('Error canceling appointment:', error)
    message.error('Có lỗi xảy ra khi hủy lịch khám')
  } finally {
    cancelingIds.value = cancelingIds.value.filter(id => id !== appointmentId) 
  }
}

const viewDetails = async (appointment) => {
  try {
    modalLoading.value = true
    console.log('Fetching appointment details for ID:', appointment.appointmentId)
    
    // Gọi API để lấy chi tiết appointment với đầy đủ thông tin patient
    const response = await appointmentApi.getAppointmentById(appointment.appointmentId)
    console.log('Appointment details response:', response)
    
    if (response && response.data) {
      selectedAppointment.value = response.data
      console.log('Selected appointment set:', response.data)
    } else {
      selectedAppointment.value = appointment
      console.log('Using fallback appointment data')
    }
    
    detailModalVisible.value = true
    console.log('Modal should be visible now')
  } catch (error) {
    console.error('Error fetching appointment details:', error)
    message.error('Không thể tải chi tiết lịch khám')
    // Fallback sử dụng data có sẵn
  selectedAppointment.value = appointment
  detailModalVisible.value = true
  } finally {
    modalLoading.value = false
  }
}

const getStatusColor = (status) => {
  switch (status) {
    case 'S1': return 'orange'    // Lịch hẹn mới 
    case 'S2': return 'blue'      // Đã xác nhận
    case 'S3': return 'green'     // Đã khám xong
    case 'S4': return 'red'       // Đã hủy
    default: return 'default'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'S1': return 'Lịch hẹn mới'
    case 'S2': return 'Đã xác nhận'
    case 'S3': return 'Đã khám xong'
    case 'S4': return 'Đã hủy'
    default: return 'Không xác định'
  }
}

const formatDate = (dateString) => {
  return dayjs(dateString).format('DD/MM/YYYY')
}

const formatDateTime = (dateString) => {
  return dayjs(dateString).format('DD/MM/YYYY HH:mm')
}

// Đăng xuất
const logout = () => {
  authStore.logout()
  router.push('/')
}

// Lifecycle
onMounted(() => {
  fetchAppointments()
})
</script>

<style scoped>
.menu-item {
  display: block;
  padding: 14px 24px;
  color: #222;
  font-weight: 500;
  border-left: 3px solid transparent;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}
.menu-item:hover {
  background: #f1f5f9;
  color: #2563eb;
}
.item-active {
  color: #2563eb;
  background: #e6f0fd;
  border-left: 3px solid #2563eb;
}

:deep(.ant-select-selector) {
  border-radius: 8px !important;
}

:deep(.ant-input) {
  border-radius: 8px !important;
}

:deep(.ant-btn) {
  border-radius: 6px !important;
}

:deep(.ant-pagination-item) {
  border-radius: 6px !important;
}

/* Custom button styles */
.btn {
  font-weight: 600;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-outline {
  display: inline-block;
  border: 1px solid rgb(25 117 220);
  background-color: rgb(255 255 255);
  color: rgb(25 117 220);
}

.btn-outline:hover {
  background-color: rgb(25 117 220);
  color: rgb(255 255 255);
}

.btn-outline:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 2px rgba(96 165 250, 0.75);
}

/* Custom scrollbar for appointment list */
.max-h-\[500px\]::-webkit-scrollbar {
  width: 6px;
}

.max-h-\[500px\]::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.max-h-\[500px\]::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.max-h-\[500px\]::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Custom scrollbar for modal content */
.max-h-\[70vh\]::-webkit-scrollbar {
  width: 6px;
}

.max-h-\[70vh\]::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.max-h-\[70vh\]::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.max-h-\[70vh\]::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Modal style improvements */
:deep(.detail-modal .ant-modal-header) {
  border-bottom: 1px solid #f0f0f0;
  padding: 16px 24px;
}

:deep(.detail-modal .ant-modal-body) {
  padding: 24px;
}

:deep(.detail-modal .ant-modal-footer) {
  border-top: 1px solid #f0f0f0;
  padding: 10px 16px;
  text-align: right;
}

:deep(.detail-modal .ant-modal-close-x) {
  width: 46px;
  height: 46px;
  line-height: 46px;
  font-size: 16px;
  color: #999;
}

:deep(.detail-modal .ant-modal-close-x:hover) {
  color: #666;
}
</style>
