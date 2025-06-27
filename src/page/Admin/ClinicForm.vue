<template>
  <AdminLayout 
    :page-title="isEditing ? 'Chỉnh sửa cơ sở y tế' : 'Thêm cơ sở y tế mới'"
    :breadcrumbs="[
      { name: 'Quản lý cơ sở y tế', path: '/admin/clinics' },
      { name: isEditing ? 'Chỉnh sửa' : 'Thêm mới' }
    ]"
  >
    <div class="max-w-4xl mx-auto">
      <AppCard>
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tên cơ sở y tế <span class="text-red-500">*</span>
              </label>
              <AppInput
                v-model="formData.name"
                placeholder="Nhập tên cơ sở y tế"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Slug (URL thân thiện)
              </label>
              <AppInput
                v-model="formData.slug"
                placeholder="vd: benh-vien-abc"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Địa chỉ
            </label>
            <AppInput
              v-model="formData.address"
              placeholder="Nhập địa chỉ"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Mô tả ngắn
            </label>
            <textarea
              v-model="formData.description"
              rows="3"
              placeholder="Nhập mô tả ngắn"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>

          <!-- Hình ảnh chính -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Hình ảnh chính
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

          <!-- Logo -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Logo
            </label>
            <div class="space-y-4">
              <!-- Hiển thị logo hiện tại -->
              <div v-if="formData.logoImg" class="flex items-center space-x-4">
                <a-image
                  :src="getImage(formData.logoImg)"
                  :width="80"
                  :height="80"
                  class="object-cover rounded-lg border"
                  fallback="https://via.placeholder.com/80x80?text=No+Logo"
                />
                <div>
                  <p class="text-sm text-gray-600">Logo hiện tại</p>
                  <a-button 
                    size="small" 
                    danger 
                    @click="handleLogoRemove"
                    :disabled="loading"
                  >
                    Xóa logo
                  </a-button>
                </div>
              </div>
              
              <!-- Upload logo mới -->
              <a-upload
                :file-list="logoFileList"
                :before-upload="beforeLogoUpload"
                :on-remove="handleLogoRemove"
                list-type="picture-card"
                :show-upload-list="false"
                accept="image/*"
              >
                <div v-if="!formData.logoImg">
                  <plus-outlined />
                  <div class="ant-upload-text">Tải logo lên</div>
                </div>
                <div v-else>
                  <edit-outlined />
                  <div class="ant-upload-text">Thay đổi</div>
                </div>
              </a-upload>
            </div>
          </div>

          <div class="flex items-center">
            <input
              id="isHospital"
              v-model="formData.isHospital"
              type="checkbox"
              class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            >
            <label for="isHospital" class="ml-2 block text-sm text-gray-900">
              Là bệnh viện (không tick = phòng khám)
            </label>
          </div>

          <!-- Nội dung chi tiết -->
          <div>
            <CKEditor
              ref="ckEditorRef"
              v-model="formData.contentHtml"
              label="Nội dung chi tiết cơ sở y tế"
              placeholder="Nhập nội dung chi tiết về cơ sở y tế (dịch vụ, trang thiết bị, đội ngũ bác sĩ, v.v.)"
              :required="false"
              :min-height="400"
              @change="onContentChange"
              @ready="onEditorReady"
            />
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
import clinicApi from '@/api/clinicApi'
import imageApi from '@/api/imageApi'
import AdminLayout from '@/layouts/AdminLayout.vue'
import AppCard from '@/components/common/Card/Card.vue'
import AppButton from '@/components/common/Button/Button.vue'
import AppInput from '@/components/common/Input/Input.vue'
import CKEditor from '@/components/common/Editor/CKEditor.vue'
import Message from '@/plugins/message'
import { generateSlug, getImage } from '@/common/function'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// State
const loading = ref(false)
const isEditing = computed(() => !!route.params.id)
const clinicId = computed(() => route.params.id)
const ckEditorRef = ref(null)
let editorInstance = null // Không reactive để tránh proxy conflict

// Image upload state
const imageFileList = ref([])
const logoFileList = ref([])
const uploadedImageUrl = ref('')
const uploadedLogoUrl = ref('')

// Form data
const formData = reactive({
  name: '',
  address: '',
  description: '',
  slug: '',
  imageUrl: '',
  logoImg: '',
  isHospital: false,
  contentHtml: '',
  contentMarkdown: ''
})

// Methods
const onContentChange = (htmlContent) => {
  // Cập nhật cả contentHtml và contentMarkdown
  formData.contentHtml = htmlContent
  formData.contentMarkdown = htmlContent.replace(/<[^>]*>/g, '').trim()
  
  console.log('Content changed:', {
    htmlLength: htmlContent.length,
    markdownLength: formData.contentMarkdown.length
  })
}

const onEditorReady = (editor) => {
  console.log('CKEditor ready for clinic')
  editorInstance = editor

  // Nếu đang edit và có content, set lại
  if (isEditing.value && formData.contentHtml) {
    console.log('Setting initial clinic content:', formData.contentHtml.substring(0, 100) + '...')
    editor.setData(formData.contentHtml)
  }
}

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
    const response = await imageApi.uploadClinicImage(file)
    
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

const beforeLogoUpload = async (file) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    Message.error('Chỉ được tải lên file hình ảnh!')
    return false
  }
  
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    Message.error('Kích thước file logo không được vượt quá 2MB!')
    return false
  }

  try {
    loading.value = true
    const response = await imageApi.uploadClinicLogo(file)
    
    console.log('Upload logo response:', response)
    
    if (response.succeeded) {
      uploadedLogoUrl.value = response.data?.imageUrl || ''
      formData.logoImg = uploadedLogoUrl.value
      Message.success('Tải logo lên thành công!')
      
      logoFileList.value = [{
        uid: Date.now().toString(),
        name: file.name,
        status: 'done',
        url: getImage(uploadedLogoUrl.value)
      }]
    } else {
      console.error('Upload logo failed:', response)
      Message.error(response.message || 'Không thể tải logo lên')
    }
  } catch (error) {
    console.error('Upload logo error:', error)
    Message.error('Lỗi khi tải logo lên')
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

const handleLogoRemove = () => {
  logoFileList.value = []
  uploadedLogoUrl.value = ''
  formData.logoImg = ''
}

// Methods
const loadClinic = async () => {
  if (!isEditing.value) return
  
  try {
    loading.value = true
    const response = await clinicApi.getClinicById(clinicId.value)
    
    if (response.succeeded && response.data) {
      const clinic = response.data
      formData.name = clinic.name || ''
      formData.address = clinic.address || ''
      formData.description = clinic.description || ''
      formData.slug = clinic.slug || ''
      formData.imageUrl = clinic.imageUrl || ''
      formData.logoImg = clinic.logoImg || ''
      formData.isHospital = clinic.isHospital || false
      
      // Set image file list if clinic has image
      if (clinic.imageUrl) {
        imageFileList.value = [{
          uid: '1',
          name: 'clinic-image.jpg',
          status: 'done',
          url: getImage(clinic.imageUrl)
        }]
      }
      
      // Set logo file list if clinic has logo
      if (clinic.logoImg) {
        logoFileList.value = [{
          uid: '2',
          name: 'clinic-logo.jpg',
          status: 'done',
          url: getImage(clinic.logoImg)
        }]
      }

      // Load markdown content
      await loadClinicMarkdown()
    } else {
      Message.error('Không thể tải thông tin cơ sở y tế')
      router.push('/admin/clinics')
    }
  } catch (error) {
    console.error('Load clinic error:', error)
    Message.error('Lỗi khi tải thông tin cơ sở y tế')
    router.push('/admin/clinics')
  } finally {
    loading.value = false
  }
}

const loadClinicMarkdown = async () => {
  if (!isEditing.value) return
  
  try {
    const response = await clinicApi.getClinicMarkdown(clinicId.value)
    
    if (response.succeeded && response.data) {
      const markdown = response.data
      formData.contentHtml = markdown.contentHTML || ''
      formData.contentMarkdown = markdown.contentMarkdown || ''
      
      // Set content to editor after a delay to ensure it's ready
      setTimeout(() => {
        if (editorInstance && formData.contentHtml) {
          console.log('Setting clinic content to editor after load:', formData.contentHtml.substring(0, 100) + '...')
          editorInstance.setData(formData.contentHtml)
        }
      }, 200)
    }
  } catch (error) {
    // Không hiển thị lỗi nếu chưa có markdown content
    console.log('No markdown content found for clinic')
  }
}

const validateForm = () => {
  if (!formData.name.trim()) {
    Message.error('Vui lòng nhập tên cơ sở y tế')
    return false
  }
  
  return true
}

const handleSubmit = async () => {
  // Đợi một chút để CKEditor sync dữ liệu
  await new Promise(resolve => setTimeout(resolve, 100))
  
  if (!validateForm()) return
  
  try {
    loading.value = true
    
    // Lấy nội dung cuối cùng từ CKEditor
    let finalContentHtml = formData.contentHtml
    if (editorInstance && editorInstance.getData) {
      finalContentHtml = editorInstance.getData()
    }

    // Tạo content markdown từ HTML (loại bỏ tags)
    const finalContentMarkdown = finalContentHtml.replace(/<[^>]*>/g, '').trim()
    
    const finalImageUrl = uploadedImageUrl.value || formData.imageUrl
    const finalLogoUrl = uploadedLogoUrl.value || formData.logoImg
    
    if (isEditing.value) {
      const updateData = {
        name: formData.name,
        address: formData.address,
        description: formData.description,
        slug: formData.slug,
        imageUrl: finalImageUrl,
        logoImg: finalLogoUrl,
        isHospital: formData.isHospital,
        contentHtml: finalContentHtml,
        contentMarkdown: finalContentMarkdown
      }
      
      const response = await clinicApi.updateClinic(clinicId.value, updateData)
      
      if (response.succeeded) {
        Message.success('Cập nhật cơ sở y tế thành công')
        router.push('/admin/clinics')
      } else {
        Message.error(response.message || 'Không thể cập nhật cơ sở y tế')
      }
    } else {
      const createData = {
        name: formData.name,
        address: formData.address,
        description: formData.description,
        slug: formData.slug,
        imageUrl: finalImageUrl,
        logoImg: finalLogoUrl,
        isHospital: formData.isHospital,
        contentHtml: finalContentHtml,
        contentMarkdown: finalContentMarkdown
      }
      
      const response = await clinicApi.createClinic(createData)
      
      if (response.succeeded) {
        Message.success('Tạo cơ sở y tế thành công')
        router.push('/admin/clinics')
      } else {
        Message.error(response.message || 'Không thể tạo cơ sở y tế')
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
  router.push('/admin/clinics')
}

// Lifecycle
onMounted(() => {
  if (isEditing.value) {
    loadClinic()
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