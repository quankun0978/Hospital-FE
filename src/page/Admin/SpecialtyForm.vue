<template>
  <AdminLayout 
    :page-title="isEditing ? 'Chỉnh sửa chuyên khoa' : 'Thêm chuyên khoa mới'"
    :breadcrumbs="[
      { name: 'Quản lý chuyên khoa', path: '/admin/specialties' },
      { name: isEditing ? 'Chỉnh sửa' : 'Thêm mới' }
    ]"
  >
    <div class="max-w-4xl mx-auto">
      <AppCard>
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tên chuyên khoa <span class="text-red-500">*</span>
              </label>
              <AppInput
                v-model="formData.name"
                placeholder="Nhập tên chuyên khoa"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Slug (URL thân thiện)
              </label>
              <AppInput
                v-model="formData.slug"
                placeholder="vd: tim-mach"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Mô tả
            </label>
            <textarea
              v-model="formData.description"
              rows="4"
              placeholder="Nhập mô tả về chuyên khoa"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>

          <!-- Hình ảnh chuyên khoa -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Hình ảnh chuyên khoa
            </label>
            <div class="space-y-4">
              <!-- Hiển thị ảnh hiện tại -->
              <div v-if="formData.imageUrl" class="flex items-center space-x-4">
                <a-image
                  :src="getImage(formData.imageUrl)"
                  :width="120"
                  :height="80"
                  class="object-cover rounded-lg border"
                  fallback="https://via.placeholder.com/120x80?text=No+Image"
                />
                <div>
                  <p class="text-sm text-gray-600">Ảnh hiện tại</p>
                  <a-button 
                    size="small" 
                    danger 
                    @click="handleImageRemove"
                    :disabled="loading"
                  >
                    Xóa ảnh
                  </a-button>
                </div>
              </div>
              
              <!-- Upload ảnh mới -->
              <a-upload
                :file-list="imageFileList"
                :before-upload="beforeUpload"
                :on-remove="handleImageRemove"
                list-type="picture-card"
                :show-upload-list="false"
                accept="image/*"
              >
                <div v-if="!formData.imageUrl">
                  <plus-outlined />
                  <div class="ant-upload-text">Tải ảnh lên</div>
                </div>
                <div v-else>
                  <edit-outlined />
                  <div class="ant-upload-text">Thay đổi</div>
                </div>
              </a-upload>
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
import { PlusOutlined, EditOutlined } from '@ant-design/icons-vue'
import specialityApi from '@/api/specialityApi'
import imageApi from '@/api/imageApi'
import AdminLayout from '@/layouts/AdminLayout.vue'
import AppCard from '@/components/common/Card/Card.vue'
import AppButton from '@/components/common/Button/Button.vue'
import AppInput from '@/components/common/Input/Input.vue'
import Message from '@/plugins/message'
import { generateSlug, getImage } from '@/common/function'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// State
const loading = ref(false)
const isEditing = computed(() => !!route.params.id)
const specialtyId = computed(() => route.params.id)

// Image upload state
const imageFileList = ref([])
const uploadedImageUrl = ref('')

// Form data
const formData = reactive({
  name: '',
  description: '',
  slug: '',
  imageUrl: ''
})

// Auto-generate slug when name changes
watch(() => formData.name, (newName) => {
  if (!isEditing.value && newName) {
    formData.slug = generateSlug(newName)
  }
})

// Image upload methods
const beforeUpload = async (file) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    Message.error('Chỉ được tải lên file hình ảnh!')
    return false
  }
  
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isLt5M) {
    Message.error('Kích thước file không được vượt quá 5MB!')
    return false
  }

  try {
    loading.value = true
    const response = await imageApi.uploadSpecialtyImage(file)
    
    console.log('Upload image response:', response)
    
    if (response.succeeded) {
      uploadedImageUrl.value = response.data?.imageUrl || ''
      formData.imageUrl = uploadedImageUrl.value
      Message.success('Tải ảnh lên thành công!')
      
      imageFileList.value = [{
        uid: Date.now().toString(),
        name: file.name,
        status: 'done',
        url: getImage(uploadedImageUrl.value)
      }]
    } else {
      console.error('Upload failed:', response)
      Message.error(response.message || 'Không thể tải ảnh lên')
    }
  } catch (error) {
    console.error('Upload error:', error)
    Message.error('Lỗi khi tải ảnh lên')
  } finally {
    loading.value = false
  }

  return false
}

const handleImageRemove = () => {
  imageFileList.value = []
  uploadedImageUrl.value = ''
  formData.imageUrl = ''
}

// Methods
const loadSpecialty = async () => {
  if (!isEditing.value) return
  
  try {
    loading.value = true
    const response = await specialityApi.getSpecialtyById(specialtyId.value)
    
    if (response.succeeded && response.data) {
      const specialty = response.data
      formData.name = specialty.name || ''
      formData.description = specialty.description || ''
      formData.slug = specialty.slug || ''
      formData.imageUrl = specialty.imageUrl || ''
      
      // Set image file list if specialty has image
      if (specialty.imageUrl) {
        imageFileList.value = [{
          uid: '1',
          name: 'specialty-image.jpg',
          status: 'done',
          url: getImage(specialty.imageUrl)
        }]
      }
    } else {
      Message.error('Không thể tải thông tin chuyên khoa')
      router.push('/admin/specialties')
    }
  } catch (error) {
    console.error('Load specialty error:', error)
    Message.error('Lỗi khi tải thông tin chuyên khoa')
    router.push('/admin/specialties')
  } finally {
    loading.value = false
  }
}

const validateForm = () => {
  if (!formData.name.trim()) {
    Message.error('Vui lòng nhập tên chuyên khoa')
    return false
  }
  
  return true
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  try {
    loading.value = true
    
    const finalImageUrl = uploadedImageUrl.value || formData.imageUrl
    
    if (isEditing.value) {
      const updateData = {
        name: formData.name,
        description: formData.description,
        slug: formData.slug,
        imageUrl: finalImageUrl
      }
      
      const response = await specialityApi.updateSpecialty(specialtyId.value, updateData)
      
      if (response.succeeded) {
        Message.success('Cập nhật chuyên khoa thành công')
        router.push('/admin/specialties')
      } else {
        Message.error(response.message || 'Không thể cập nhật chuyên khoa')
      }
    } else {
      const createData = {
        name: formData.name,
        description: formData.description,
        slug: formData.slug,
        imageUrl: finalImageUrl
      }
      
      const response = await specialityApi.createSpecialty(createData)
      
      if (response.succeeded) {
        Message.success('Tạo chuyên khoa thành công')
        router.push('/admin/specialties')
      } else {
        Message.error(response.message || 'Không thể tạo chuyên khoa')
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
  router.push('/admin/specialties')
}

// Lifecycle
onMounted(() => {
  if (isEditing.value) {
    loadSpecialty()
  }
})
</script>

<style scoped>
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}

:deep(.ant-form-item) {
  margin-bottom: 0px;
}
</style> 