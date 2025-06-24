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
                Ngày khám <span class="text-red-500">*</span>
              </label>
              <AppInput
                v-model="formData.date"
                type="date"
                :min="today"
                required
              />
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
import AppInput from '@/components/common/Input/Input.vue'
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

// Today date for minimum date input
const today = computed(() => {
  const date = new Date()
  return date.toISOString().split('T')[0]
})

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
  
  // Check if date is not in the past
  const selectedDate = new Date(formData.date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  if (selectedDate < today) {
    Message.error('Không thể chọn ngày trong quá khứ')
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
</style> 