<template>
  <AdminLayout 
    :page-title="isEditing ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'"
    :breadcrumbs="[
      { name: 'Quản lý người dùng', path: '/admin/users' },
      { name: isEditing ? 'Chỉnh sửa' : 'Thêm mới' }
    ]"
  >
    <div class="max-w-4xl mx-auto">
      <AppCard>
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tên đăng nhập <span class="text-red-500">*</span>
              </label>
              <AppInput
                v-model="formData.username"
                placeholder="Nhập tên đăng nhập"
                :disabled="isEditing"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Họ và tên <span class="text-red-500">*</span>
              </label>
              <AppInput
                v-model="formData.name"
                placeholder="Nhập họ và tên"
                required
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <AppInput
                v-model="formData.email"
                disabled
                type="email"
                placeholder="Nhập email"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Vai trò <span class="text-red-500">*</span>
              </label>
              <AppSelect
                v-model="formData.roleId"
                :options="roleOptions"
                placeholder="Chọn vai trò"
                required
              />
            </div>
          </div>

          <div v-if="!isEditing" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu <span class="text-red-500">*</span>
              </label>
              <AppInput
                v-model="formData.password"
                type="password"
                placeholder="Nhập mật khẩu"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Xác nhận mật khẩu <span class="text-red-500">*</span>
              </label>
              <AppInput
                v-model="formData.confirmPassword"
                type="password"
                placeholder="Nhập lại mật khẩu"
                required
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
import { ref, computed, onMounted, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import adminApi from '@/api/adminApi'
import AdminLayout from '@/layouts/AdminLayout.vue'
import AppCard from '@/components/common/Card/Card.vue'
import AppButton from '@/components/common/Button/Button.vue'
import AppInput from '@/components/common/Input/Input.vue'
import AppSelect from '@/components/common/Select/Select.vue'
import Message from '@/plugins/message'
import { generateSlug } from '@/common/function'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// State
const loading = ref(false)
const isEditing = computed(() => !!route.params.id)
const userId = computed(() => route.params.id)

// Form data
const formData = reactive({
  username: '',
  name: '',
  email: '',
  roleId: '',
  password: '',
  confirmPassword: ''
})

// Role options
const roleOptions = [
  { value: 'R1', label: 'Quản trị viên' },
  { value: 'R2', label: 'Bác sĩ' },
  { value: 'R3', label: 'Bệnh nhân' }
]

// Auto-generate username when name changes (only for create mode)
watch(() => formData.name, (newName) => {
  if (!isEditing.value && newName) {
    formData.username = generateSlug(newName)
  }
})

// Methods
const loadUser = async () => {
  if (!isEditing.value) return
  
  try {
    loading.value = true
    const response = await adminApi.getUserById(userId.value)
    
    if (response.succeeded && response.data) {
      const user = response.data
      formData.username = user.username || ''
      formData.name = user.name || ''
      formData.email = user.email || ''
      formData.roleId = user.roleId || ''
    } else {
      Message.error('Không thể tải thông tin người dùng')
      router.push('/admin/users')
    }
  } catch (error) {
    console.error('Load user error:', error)
    Message.error('Lỗi khi tải thông tin người dùng')
    router.push('/admin/users')
  } finally {
    loading.value = false
  }
}

const validateForm = () => {
  if (!formData.username.trim()) {
    Message.error('Vui lòng nhập tên đăng nhập')
    return false
  }
  
  if (!formData.name.trim()) {
    Message.error('Vui lòng nhập họ và tên')
    return false
  }
  
  if (!formData.roleId) {
    Message.error('Vui lòng chọn vai trò')
    return false
  }
  
  if (!isEditing.value) {
    if (!formData.password) {
      Message.error('Vui lòng nhập mật khẩu')
      return false
    }
    
    if (formData.password !== formData.confirmPassword) {
      Message.error('Mật khẩu xác nhận không khớp')
      return false
    }
    
    if (formData.password.length < 6) {
      Message.error('Mật khẩu phải có ít nhất 6 ký tự')
      return false
    }
  }
  
  return true
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  try {
    loading.value = true
    
    if (isEditing.value) {
      const updateData = {
        username: formData.username,
        name: formData.name,
        email: formData.email || '', // Đảm bảo email được gửi
        roleId: formData.roleId
      }
      
      const response = await adminApi.updateUser(userId.value, updateData)
      
      if (response.succeeded) {
        Message.success('Cập nhật người dùng thành công')
        router.push('/admin/users')
      } else {
        Message.error(response.message || 'Không thể cập nhật người dùng')
      }
    } else {
      const createData = {
        username: formData.username,
        name: formData.name,
        email: formData.email,
        roleId: formData.roleId,
        password: formData.password
      }
      
      const response = await adminApi.createUser(createData)
      
      if (response.succeeded) {
        Message.success('Tạo người dùng thành công')
        router.push('/admin/users')
      } else {
        Message.error(response.message || 'Không thể tạo người dùng')
      }
    }
  } catch (error) {
    console.error('Submit error:', error)
    Message.error('Lỗi khi xử lý dữ liệu')
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  router.push('/admin/users')
}

// Lifecycle
onMounted(() => {
  if (isEditing.value) {
    loadUser()
  }
})
</script>

<style scoped>
</style> 