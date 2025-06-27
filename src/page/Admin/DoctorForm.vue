<template>
  <AdminLayout 
    :page-title="isEditing ? 'Chỉnh sửa thông tin bác sĩ' : 'Thêm thông tin bác sĩ mới'"
    :breadcrumbs="[
      { name: 'Quản lý bác sĩ', path: '/admin/doctors' },
      { name: isEditing ? 'Chỉnh sửa' : 'Thêm mới' }
    ]"
  >
    <div class="max-w-4xl mx-auto">
      <AppCard>
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Bác sĩ <span class="text-red-500">*</span>
              </label>
              
              <!-- Show doctor name when editing -->
              <div v-if="isEditing" class="px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                <span class="text-gray-900">{{ selectedDoctorName }}</span>
                <span class="text-sm text-gray-500 ml-2">(Không thể thay đổi)</span>
              </div>
              
              <!-- Show select dropdown when creating new -->
              <AppSelect
                v-else
                v-model="formData.doctorId"
                :options="userOptions"
                placeholder="Chọn bác sĩ"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Mức giá <span class="text-red-500">*</span>
              </label>
              <AppSelect
                v-model="formData.priceId"
                :options="priceOptions"
                placeholder="Chọn mức giá"
                required
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Chức vụ
              </label>
              <AppSelect
                v-model="formData.positionId"
                :options="positionOptions"
                placeholder="Chọn chức vụ"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Phòng khám
              </label>
              <AppSelect
                v-model="formData.clinicId"
                :options="clinicOptions"
                placeholder="Chọn phòng khám"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Slug (URL thân thiện)
              </label>
              <AppInput
                v-model="formData.slug"
                placeholder="vd: bac-si-nguyen-van-a"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Số lượt khám
              </label>
              <AppInput
                v-model="formData.count"
                type="number"
                placeholder="Nhập số lượt khám"
                min="0"
              />
            </div>
          </div>

          <!-- Hình ảnh bác sĩ -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Hình ảnh bác sĩ
            </label>
            <div class="space-y-4">
              <!-- Hiển thị ảnh hiện tại -->
              <div v-if="formData.imageUrl" class="flex items-center space-x-4">
                <a-image
                  :src="getImage(formData.imageUrl)"
                  :width="120"
                  :height="120"
                  class="object-cover rounded-lg border"
                  fallback="https://via.placeholder.com/120x120?text=No+Image"
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

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Ghi chú
            </label>
            <textarea
              v-model="formData.note"
              rows="3"
              placeholder="Nhập ghi chú về bác sĩ"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>

          <!-- Chuyên khoa -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Chuyên khoa
            </label>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              <div
                v-for="specialty in specialtyOptions"
                :key="specialty.value"
                class="flex items-center"
              >
                <input
                  :id="`specialty-${specialty.value}`"
                  v-model="formData.selectedSpecialties"
                  :value="specialty.value"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                >
                <label
                  :for="`specialty-${specialty.value}`"
                  class="ml-2 block text-sm text-gray-900"
                >
                  {{ specialty.label }}
                </label>
              </div>
            </div>
          </div>

          <!-- Nội dung chi tiết -->
          <div>
            <CKEditor
              ref="ckEditorRef"
              v-model="formData.contentHtml"
              label="Thông tin chi tiết bác sĩ"
              placeholder="Nhập thông tin chi tiết về bác sĩ (kinh nghiệm, chuyên môn, thành tích, v.v.)"
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
import doctorApi from '@/api/doctorApi'
import imageApi from '@/api/imageApi'
import specialityApi from '@/api/specialityApi'
import AdminLayout from '@/layouts/AdminLayout.vue'
import AppCard from '@/components/common/Card/Card.vue'
import AppButton from '@/components/common/Button/Button.vue'
import AppInput from '@/components/common/Input/Input.vue'
import AppSelect from '@/components/common/Select/Select.vue'
import CKEditor from '@/components/common/Editor/CKEditor.vue'
import Message from '@/plugins/message'
import { generateSlug, getImage } from '@/common/function'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// State
const loading = ref(false)
const isEditing = computed(() => !!route.params.id)
const doctorId = computed(() => route.params.id)
const ckEditorRef = ref(null)
let editorInstance = null

// Doctor name for editing mode
const selectedDoctorName = ref('')

// Image upload state
const imageFileList = ref([])
const uploadedImageUrl = ref('')

// Options
const userOptions = ref([])
const priceOptions = ref([])
const positionOptions = ref([])
const clinicOptions = ref([])
const specialtyOptions = ref([])

// Form data
const formData = reactive({
  doctorId: '',
  priceId: '',
  positionId: '',
  clinicId: '',
  slug: '',
  note: '',
  imageUrl: '',
  count: 0,
  contentHtml: '',
  contentMarkdown: '',
  selectedSpecialties: []
})

// Methods
const onContentChange = (htmlContent) => {
  formData.contentHtml = htmlContent
  formData.contentMarkdown = htmlContent.replace(/<[^>]*>/g, '').trim()
  
  console.log('Content changed:', {
    htmlLength: htmlContent.length,
    markdownLength: formData.contentMarkdown.length
  })
}

const onEditorReady = (editor) => {
  console.log('CKEditor ready for doctor')
  editorInstance = editor

  if (isEditing.value && formData.contentHtml) {
    console.log('Setting initial doctor content:', formData.contentHtml.substring(0, 100) + '...')
    editor.setData(formData.contentHtml)
  }
}

// Auto-generate slug when doctor changes
watch(() => formData.doctorId, (newDoctorId) => {
  if (!isEditing.value && newDoctorId) {
    const selectedUser = userOptions.value.find(u => u.value === newDoctorId)
    if (selectedUser) {
      formData.slug = generateSlug(selectedUser.label)
    }
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
    const response = await imageApi.uploadDoctorImage(file)
    
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

// Load options
const loadUsers = async () => {
  try {
    let response;
    if (isEditing.value) {
      // Khi edit, hiển thị tất cả bác sĩ (để có thể thấy bác sĩ hiện tại trong dropdown)
      response = await doctorApi.getUsersByRole('R2');
    } else {
      // Khi tạo mới, chỉ hiển thị bác sĩ chưa có thông tin
      response = await doctorApi.getUsersByRoleWithoutDoctorInfo('R2');
    }
    
    if (response.succeeded && response.data) {
      userOptions.value = response.data.map(user => ({
        value: user.userId,
        label: `${user.name || ''}`.trim() || user.email
      }));
    }
  } catch (error) {
    console.error('Load users error:', error);
  }
};

const loadAllCodes = async () => {
  try {
    // Load price options
    const priceResponse = await doctorApi.getAllcodes('PRICE')
    if (priceResponse.succeeded && priceResponse.data) {
      priceOptions.value = priceResponse.data.map(code => ({
        value: code.codeKey,
        label: code.valueVi
      }))
    }

    // Load position options
    const positionResponse = await doctorApi.getAllcodes('POSITION')
    if (positionResponse.succeeded && positionResponse.data) {
      positionOptions.value = positionResponse.data.map(code => ({
        value: code.codeKey,
        label: code.valueVi
      }))
    }
  } catch (error) {
    console.error('Load allcodes error:', error)
  }
}

const loadClinics = async () => {
  try {
    const response = await doctorApi.getClinics({ pageSize: 1000 })
    if (response.succeeded && response.data) {
      clinicOptions.value = response.data.map(clinic => ({
        value: clinic.clinicId,
        label: clinic.name
      }))
    }
  } catch (error) {
    console.error('Load clinics error:', error)
  }
}

const loadSpecialties = async () => {
  try {
    const response = await specialityApi.getAllSpecialties()
    if (response.succeeded && response.data) {
      specialtyOptions.value = response.data.map(specialty => ({
        value: specialty.specialtyId,
        label: specialty.name
      }))
    }
  } catch (error) {
    console.error('Load specialties error:', error)
  }
}

const loadDoctor = async () => {
  if (!isEditing.value) return
  
  try {
    loading.value = true
    const response = await doctorApi.getDoctorById(doctorId.value)
    
    if (response.succeeded && response.data) {
      const doctor = response.data
      
      // Store doctor name for display
      selectedDoctorName.value = doctor.name || 'Không có tên'
      
      // Get the first DoctorInfo (there should be only one for edit)
      const doctorInfo = doctor.doctorInfos && doctor.doctorInfos.length > 0 ? doctor.doctorInfos[0] : null
      
      if (!doctorInfo) {
        Message.error('Không tìm thấy thông tin chi tiết bác sĩ')
        router.push('/admin/doctors')
        return
      }
      
      formData.doctorId = doctor.doctorId || ''
      formData.priceId = doctorInfo.priceId || ''
      formData.positionId = doctorInfo.positionId || ''
      formData.clinicId = doctorInfo.clinicId || ''
      formData.slug = doctorInfo.slug || ''
      formData.note = doctorInfo.note || ''
      formData.imageUrl = doctorInfo.imageUrl || ''
      formData.count = doctorInfo.count || 0
      
      // Set image file list if doctor has image
      if (doctorInfo.imageUrl) {
        imageFileList.value = [{
          uid: '1',
          name: 'doctor-image.jpg',
          status: 'done',
          url: getImage(doctorInfo.imageUrl)
        }]
      }

      // Load selected specialties for this doctor
      if (doctor.specialties && doctor.specialties.length > 0) {
        formData.selectedSpecialties = doctor.specialties.map(s => s.specialtyId)
      }

      // Load markdown content
      await loadDoctorMarkdown()
    } else {
      Message.error('Không thể tải thông tin bác sĩ')
      router.push('/admin/doctors')
    }
  } catch (error) {
    console.error('Load doctor error:', error)
    Message.error('Lỗi khi tải thông tin bác sĩ')
    router.push('/admin/doctors')
  } finally {
    loading.value = false
  }
}

const loadDoctorMarkdown = async () => {
  if (!isEditing.value) return
  
  try {
    const response = await doctorApi.getDoctorMarkdown(doctorId.value)
    
    if (response.succeeded && response.data) {
      const markdown = response.data
      formData.contentHtml = markdown.contentHTML || ''
      formData.contentMarkdown = markdown.contentMarkdown || ''
      
      // Set content to editor after a delay to ensure it's ready
      setTimeout(() => {
        if (editorInstance && formData.contentHtml) {
          console.log('Setting doctor content to editor after load:', formData.contentHtml.substring(0, 100) + '...')
          editorInstance.setData(formData.contentHtml)
        }
      }, 200)
    }
  } catch (error) {
    console.log('No markdown content found for doctor')
  }
}

const validateForm = () => {
  if (!formData.doctorId) {
    Message.error('Vui lòng chọn bác sĩ')
    return false
  }
  
  if (!formData.priceId) {
    Message.error('Vui lòng chọn mức giá')
    return false
  }
  
  return true
}

const handleSubmit = async () => {
  await new Promise(resolve => setTimeout(resolve, 100))
  
  if (!validateForm()) return
  
  try {
    loading.value = true
    
    let finalContentHtml = formData.contentHtml
    if (editorInstance && editorInstance.getData) {
      finalContentHtml = editorInstance.getData()
    }

    const finalContentMarkdown = finalContentHtml.replace(/<[^>]*>/g, '').trim()
    const finalImageUrl = uploadedImageUrl.value || formData.imageUrl
    
    if (isEditing.value) {
      const updateData = {
        priceId: formData.priceId,
        positionId: formData.positionId || null,
        clinicId: formData.clinicId || null,
        slug: formData.slug,
        note: formData.note,
        imageUrl: finalImageUrl,
        count: parseInt(formData.count) || 0,
        contentHtml: finalContentHtml,
        contentMarkdown: finalContentMarkdown,
        selectedSpecialties: formData.selectedSpecialties || []
      }
      
      const response = await doctorApi.updateDoctor(doctorId.value, updateData)
      
      if (response.succeeded) {
        Message.success('Cập nhật thông tin bác sĩ thành công')
        router.push('/admin/doctors')
      } else {
        Message.error(response.message || 'Không thể cập nhật thông tin bác sĩ')
      }
    } else {
      const createData = {
        doctorId: formData.doctorId,
        priceId: formData.priceId,
        positionId: formData.positionId || null,
        clinicId: formData.clinicId || null,
        slug: formData.slug,
        note: formData.note,
        imageUrl: finalImageUrl,
        count: parseInt(formData.count) || 0,
        contentHtml: finalContentHtml,
        contentMarkdown: finalContentMarkdown,
        selectedSpecialties: formData.selectedSpecialties || []
      }
      
      const response = await doctorApi.createDoctor(createData)
      
      if (response.succeeded) {
        Message.success('Tạo thông tin bác sĩ thành công')
        router.push('/admin/doctors')
      } else {
        Message.error(response.message || 'Không thể tạo thông tin bác sĩ')
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
  router.push('/admin/doctors')
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    loadUsers(),
    loadAllCodes(),
    loadClinics(),
    loadSpecialties()
  ])
  
  if (isEditing.value) {
    await loadDoctor()
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