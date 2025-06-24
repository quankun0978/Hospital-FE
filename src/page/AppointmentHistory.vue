<template>
  <section class="bg-gray-100">
    <div class="max-w-7xl mx-auto md:p-4 grid grid-cols-1 md:grid-cols-12 md:gap-4 lg:py-10">
      <!-- Sidebar -->
      <div class="col-span-1 md:col-span-3">
        <div class="bg-white md:rounded-md">
          <ul class="flex overflow-y-auto hide-scroll-bar md:py-4 md:flex-col">
            <li>
              <router-link class="menu-item item-active" to="/appointments">Lịch khám</router-link>
            </li>
            <li>
              <a class="menu-item" href="/dat-kham/thanh-toan">Lịch sử thanh toán</a>
            </li>
            <li>
              <router-link class="menu-item" to="/patient-record">Hồ sơ</router-link>
            </li>
            <li>
              <a class="menu-item" href="/dat-kham/tai-khoan">Tài khoản</a>
            </li>
            <li><a class="menu-item" href="/dat-kham/logout">Đăng xuất</a></li>
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
                <a-input-search
                  v-model="searchTerm"
                  placeholder="Tìm kiếm theo tên bác sĩ, lý do khám..."
                  size="large"
                  class="max-w-md"
                />
              </div>
              <div class="flex gap-4">
                <a-select
                  v-model="statusFilter"
                  placeholder="Trạng thái"
                  style="width: 150px"
                  size="large"
                >
                  <a-select-option value="">Tất cả</a-select-option>
                  <a-select-option value="P">Chờ xác nhận</a-select-option>
                  <a-select-option value="S1">Đã xác nhận</a-select-option>
                  <a-select-option value="S">Đã lên lịch</a-select-option>
                  <a-select-option value="C">Hoàn thành</a-select-option>
                  <a-select-option value="N">Đã hủy</a-select-option>
                </a-select>
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
                          {{ appointment.doctorName || 'Bác sĩ' }}
                        </h3>
                        <p class="text-gray-600 text-sm">{{ appointment.patientName }}</p>
                      </div>
                      <div class="text-right">
                        <a-tag :color="getStatusColor(appointment.status)">
                          {{ appointment.statusText }}
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
                          {{ appointment.timeType || 'Chưa xác định' }}
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
                  <a-button 
                    v-if="appointment.status === 'P' || appointment.status === 'S' || appointment.status === 'S1'"
                    type="text" 
                    danger
                    @click="cancelAppointment(appointment.appointmentId)"
                    :loading="cancelingIds.includes(appointment.appointmentId)"
                  >
                    Hủy lịch
                  </a-button>
                  <a-button type="primary" ghost @click="viewDetails(appointment)">
                    Xem chi tiết
                  </a-button>
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
      v-model="detailModalVisible"
      title="Chi tiết lịch khám"
      :footer="null"
      width="600px"
    >
      <div v-if="selectedAppointment" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-sm font-medium text-gray-500">Bác sĩ</label>
            <p class="text-base text-gray-900">{{ selectedAppointment.doctorName }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500">Bệnh nhân</label>
            <p class="text-base text-gray-900">{{ selectedAppointment.patientName }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500">Ngày khám</label>
            <p class="text-base text-gray-900">{{ formatDate(selectedAppointment.appointmentDate) }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500">Giờ khám</label>
            <p class="text-base text-gray-900">{{ selectedAppointment.timeType }}</p>
          </div>
          <div class="col-span-2">
            <label class="text-sm font-medium text-gray-500">Trạng thái</label>
            <div class="mt-1">
              <a-tag :color="getStatusColor(selectedAppointment.status)">
                {{ selectedAppointment.statusText }}
              </a-tag>
            </div>
          </div>
          <div class="col-span-2">
            <label class="text-sm font-medium text-gray-500">Lý do khám</label>
            <p class="text-base text-gray-900">{{ selectedAppointment.reason || 'Không có ghi chú' }}</p>
          </div>
        </div>
      </div>
    </a-modal>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
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

// Reactive data
const appointments = ref([])
const loading = ref(false)
const searchTerm = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const cancelingIds = ref([])

// Modal
const detailModalVisible = ref(false)
const selectedAppointment = ref(null)

// Computed
const totalAppointments = computed(() => appointments.value.length)

const filteredAppointments = computed(() => {
  let filtered = [...appointments.value]

  // Filter by search term
  if (searchTerm.value && searchTerm.value.trim()) {
    const term = searchTerm.value.toLowerCase().trim()
    filtered = filtered.filter(appointment => 
      (appointment.doctorName && appointment.doctorName.toLowerCase().includes(term)) ||
      (appointment.reason && appointment.reason.toLowerCase().includes(term)) ||
      (appointment.patientName && appointment.patientName.toLowerCase().includes(term))
    )
  }

  // Filter by status
  if (statusFilter.value && statusFilter.value.trim()) {
    filtered = filtered.filter(appointment => appointment.status === statusFilter.value)
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

    const response = await appointmentApi.getByUserId(userId)
    appointments.value = response.data || []
  } catch (error) {
    console.error('Error fetching appointments:', error)
    message.error('Có lỗi xảy ra khi tải danh sách lịch khám')
  } finally {
    loading.value = false
  }
}

// Watch for search and filter changes to reset pagination
watch([searchTerm, statusFilter], () => {
  currentPage.value = 1
})

const cancelAppointment = async (appointmentId) => {
  try {
    cancelingIds.value.push(appointmentId)
    await appointmentApi.cancel(appointmentId)
    message.success('Hủy lịch khám thành công')
    await fetchAppointments()
  } catch (error) {
    console.error('Error canceling appointment:', error)
    message.error('Có lỗi xảy ra khi hủy lịch khám')
  } finally {
    cancelingIds.value = cancelingIds.value.filter(id => id !== appointmentId) 
  }
}

const viewDetails = (appointment) => {
  selectedAppointment.value = appointment
  detailModalVisible.value = true
}

const getStatusColor = (status) => {
  switch (status) {
    case 'P': return 'orange'
    case 'S1': return 'green'
    case 'S': return 'blue'
    case 'C': return 'purple'
    case 'N': return 'red'
    default: return 'default'
  }
}

const formatDate = (dateString) => {
  return dayjs(dateString).format('dddd, DD/MM/YYYY')
}

const formatDateTime = (dateString) => {
  return dayjs(dateString).format('DD/MM/YYYY HH:mm')
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
</style>
