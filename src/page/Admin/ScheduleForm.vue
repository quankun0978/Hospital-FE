<template>
  <AdminLayout 
    :page-title="isEditing ? 'Chỉnh sửa lịch khám' : 'Thêm lịch khám mới'"
    :breadcrumbs="[
      { name: 'Quản lý lịch khám', path: '/admin/schedules' },
      { name: isEditing ? 'Chỉnh sửa' : 'Thêm mới' }
    ]"
  >
    <div class="max-w-4xl mx-auto">
      <AppCard>
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Doctor Select (Only for Admin) -->
            <div v-if="userRole === 'R1'" class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Bác sĩ <span class="text-red-500">*</span>
              </label>
              <AppSelect
                v-model="formData.doctorId"
                :options="doctorOptions"
                placeholder="Chọn bác sĩ"
                required
                :loading="loadingDoctors"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                <span class="flex items-center">
                  <svg class="w-4 h-4 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  Ngày khám <span class="text-red-500">*</span>
                </span>
              </label>
              <div class="relative w-full">
                <input
                  type="date"
                  v-model="formData.date"
                  :min="tomorrow"
                  :max="maxDate"
                  required
                  class="px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white shadow-sm text-gray-700 font-medium transition-all duration-200 hover:border-primary text-sm w-full custom-date-input"
                />
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
              </div>
              <p class="text-xs text-gray-500 mt-1">
                Chọn ngày từ ngày mai đến {{ formatMaxDateLabel() }}
              </p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Thời gian khám <span class="text-red-500">*</span>
              </label>
              <AppSelect
                v-model="formData.timeType"
                :options="timeOptions"
                placeholder="Chọn thời gian"
                required
                :loading="loadingTimeOptions"
              />
            </div>
          </div>

          <!-- Action buttons -->
          <div class="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <AppButton
              variant="outline"
              @click="handleCancel"
              :disabled="loading"
            >
              Hủy
            </AppButton>
            <AppButton
              type="submit"
              variant="primary"
              :loading="loading"
            >
              {{ isEditing ? 'Cập nhật' : 'Tạo mới' }}
            </AppButton>
          </div>
        </form>
      </AppCard>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import scheduleApi from '@/api/scheduleApi'
import allCodeApi from '@/api/allCodeApi'
import AdminLayout from '@/layouts/AdminLayout.vue'
import AppCard from '@/components/common/Card/Card.vue'
import AppButton from '@/components/common/Button/Button.vue'
import AppSelect from '@/components/common/Select/Select.vue'
import Message from '@/plugins/message'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// State
const loading = ref(false)
const loadingDoctors = ref(false)
const loadingTimeOptions = ref(false)
const isEditing = computed(() => !!route.params.id)
const scheduleId = computed(() => route.params.id)

// User info
const userRole = computed(() => authStore.getUserRole)
const currentUserId = computed(() => authStore.getUserId)

// Tomorrow date for minimum date input (không cho tạo lịch hôm nay)
const tomorrow = computed(() => {
  const date = new Date()
  date.setDate(date.getDate() + 1) // Thêm 1 ngày
  return date.toISOString().split('T')[0]
})

// Max date (3 tháng từ hôm nay)
const maxDate = computed(() => {
  const date = new Date()
  date.setMonth(date.getMonth() + 3)
  return date.toISOString().split('T')[0]
})

// Format max date label for display
const formatMaxDateLabel = () => {
  const date = new Date()
  date.setMonth(date.getMonth() + 3)
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

// Form data
const formData = reactive({
  doctorId: '',
  date: '',
  timeType: ''
})

// Options
const doctorOptions = ref([])
const timeOptions = ref([])

// Methods
const loadDoctors = async () => {
  if (userRole.value !== 'R1') return
  
  try {
    loadingDoctors.value = true
    const response = await scheduleApi.getDoctors()
    if (response.data.succeeded) {
      doctorOptions.value = (response.data.data || []).map(doctor => ({
        value: doctor.id,
        label: `${doctor.name} (${doctor.email})`
      }))
    } else {
      Message.error('Không thể tải danh sách bác sĩ')
    }
  } catch (error) {
    console.error('Load doctors error:', error)
    Message.error('Lỗi khi tải danh sách bác sĩ')
  } finally {
    loadingDoctors.value = false
  }
}

const loadTimeOptions = async () => {
  try {
    loadingTimeOptions.value = true
    const response = await allCodeApi.getCodeOptions('TIME')
    if (response.succeeded) {
      timeOptions.value = (response.data || []).map(time => ({
        value: time.codeKey,
        label: time.valueVi
      }))
    } else {
      Message.error('Không thể tải danh sách thời gian khám')
    }
  } catch (error) {
    console.error('Load time options error:', error)
    Message.error('Lỗi khi tải danh sách thời gian khám')
  } finally {
    loadingTimeOptions.value = false
  }
}

const loadSchedule = async () => {
  if (!isEditing.value) return
  
  try {
    loading.value = true
    const response = await scheduleApi.getScheduleById(scheduleId.value)
    
    if (response.succeeded && response.data) {
      const schedule = response.data
      formData.doctorId = schedule.doctorId
      formData.date = schedule.date.split('T')[0] // Format date for input
      formData.timeType = schedule.timeType
    } else {
      Message.error('Không thể tải thông tin lịch khám')
      router.push('/admin/schedules')
    }
  } catch (error) {
    console.error('Load schedule error:', error)
    Message.error('Lỗi khi tải thông tin lịch khám')
    router.push('/admin/schedules')
  } finally {
    loading.value = false
  }
}

const validateForm = () => {
  if (userRole.value === 'R1' && !formData.doctorId) {
    Message.error('Vui lòng chọn bác sĩ')
    return false
  }
  
  if (!formData.date) {
    Message.error('Vui lòng chọn ngày khám')
    return false
  }
  
  if (!formData.timeType) {
    Message.error('Vui lòng chọn thời gian khám')
    return false
  }
  
  // Enhanced date validation
  const selectedDate = new Date(formData.date)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  
  // Reset time để so sánh chỉ ngày
  today.setHours(0, 0, 0, 0)
  tomorrow.setHours(0, 0, 0, 0)
  selectedDate.setHours(0, 0, 0, 0)
  
  if (selectedDate < tomorrow) {
    Message.error('Chỉ có thể tạo lịch khám từ ngày mai trở đi')
    return false
  }
  
  // Kiểm tra không được quá 3 tháng
  const maxAllowedDate = new Date(today)
  maxAllowedDate.setMonth(today.getMonth() + 3)
  maxAllowedDate.setHours(0, 0, 0, 0)
  
  if (selectedDate > maxAllowedDate) {
    Message.error('Chỉ có thể tạo lịch khám trong vòng 3 tháng tới')
    return false
  }
  
  return true
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  try {
    loading.value = true
    
    const submitData = {
      doctorId: userRole.value === 'R1' ? formData.doctorId : currentUserId.value,
      date: formData.date,
      timeType: formData.timeType
    }
    
    let response
    if (isEditing.value) {
      response = await scheduleApi.updateSchedule(scheduleId.value, submitData)
    } else {
      response = await scheduleApi.createSchedule(submitData)
    }
    
    if (response.data.succeeded) {
      Message.success(isEditing.value ? 'Cập nhật lịch khám thành công' : 'Tạo lịch khám thành công')
      router.push('/admin/schedules')
    } else {
      Message.error(response.data.message || 'Có lỗi xảy ra')
    }
  } catch (error) {
    console.error('Submit error:', error)
    Message.error('Lỗi khi lưu lịch khám')
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  router.push('/admin/schedules')
}

// Initialize form for doctor role
const initializeForm = () => {
  if (userRole.value === 'R2') {
    formData.doctorId = currentUserId.value
  }
}

// Lifecycle
onMounted(async () => {
  initializeForm()
  await Promise.all([
    loadTimeOptions(),
    loadDoctors()
  ])
  
  if (isEditing.value) {
    await loadSchedule()
  }
})
</script>

<style scoped>
.text-primary {
  color: #2563eb;
}

.bg-primary {
  background-color: #2563eb;
}

/* Custom date input styling */
.custom-date-input::-webkit-calendar-picker-indicator {
  opacity: 0;
  position: absolute;
  right: 0;
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.custom-date-input {
  position: relative;
}

.custom-date-input::-webkit-inner-spin-button,
.custom-date-input::-webkit-clear-button {
  display: none;
}

.custom-date-input:focus {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.custom-date-input:hover {
  border-color: #2563eb;
}
</style> 