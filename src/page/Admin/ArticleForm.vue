<template>
  <AdminLayout 
    :page-title="isEditing ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới'"
    :breadcrumbs="[
      { name: 'Quản lý bài viết', path: '/admin/articles' },
      { name: isEditing ? 'Chỉnh sửa' : 'Thêm mới' }
    ]"
  >
    <div class="max-w-6xl mx-auto">
      <AppCard>
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tiêu đề <span class="text-red-500">*</span>
              </label>
              <AppInput
                v-model="formData.title"
                placeholder="Nhập tiêu đề bài viết"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Slug (URL thân thiện)
              </label>
              <div class="relative">
                <AppInput
                  v-model="formData.slug"
                  placeholder="Slug sẽ được tạo tự động"
                  :disabled="autoGenerateSlug"
                />
                <AppButton
                  type="button"
                  variant="outline"
                  size="sm"
                  class="absolute right-2 top-1/2 transform -translate-y-1/2"
                  @click="generateSlugFromTitle"
                >
                  Tạo lại
                </AppButton>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Danh mục
              </label>
              <AppSelect
                v-model="formData.category"
                :options="categoryOptions"
                placeholder="Chọn danh mục"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Ngày xuất bản
              </label>
              <AppInputDate
                v-model="formData.publishedAt"
                placeholder="Chọn ngày xuất bản"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Mô tả ngắn
            </label>
            <textarea
              v-model="formData.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập mô tả ngắn cho bài viết..."
            ></textarea>
          </div>

          <div>
            <CKEditor
              ref="ckEditorRef"
              v-model="formData.contentHtml"
              label="Nội dung bài viết"
              placeholder="Nhập nội dung bài viết..."
              :required="true"
              :min-height="400"
              @change="onContentChange"
              @ready="onEditorReady"
            />
            
            <!-- Debug button - remove after testing -->
            <div class="mt-2 flex gap-2">
              <button
                type="button"
                @click="debugContent"
                class="px-3 py-1 text-xs bg-gray-500 text-white rounded"
              >
                Debug Content
              </button>
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
              {{ isEditing ? 'Cập nhật' : 'Xuất bản' }}
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
import articleApi from '@/api/articleApi'
import AdminLayout from '@/layouts/AdminLayout.vue'
import AppCard from '@/components/common/Card/Card.vue'
import AppButton from '@/components/common/Button/Button.vue'
import AppInput from '@/components/common/Input/Input.vue'
import AppInputDate from '@/components/common/Input/InputDate.vue'
import AppSelect from '@/components/common/Select/Select.vue'
import CKEditor from '@/components/common/Editor/CKEditor.vue'
import Message from '@/plugins/message'
import { generateSlug } from '@/common/function'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// State
const loading = ref(false)
const isEditing = computed(() => !!route.params.id)
const articleId = computed(() => route.params.id)
const autoGenerateSlug = ref(true)
const ckEditorRef = ref(null)
let editorInstance = null // Không reactive để tránh proxy conflict

// Form data
const formData = reactive({
  title: '',
  slug: '',
  description: '',
  content: '',
  contentHtml: '',
  category: '',
  publishedAt: new Date().toISOString().split('T')[0]
})

// Category options
const categoryOptions = [
  { value: 'tin-tuc', label: 'Tin tức' },
  { value: 'suc-khoe', label: 'Sức khỏe' },
  { value: 'kien-thuc-y-khoa', label: 'Kiến thức y khoa' },
  { value: 'chuyen-gia', label: 'Chuyên gia' },
  { value: 'dich-vu', label: 'Dịch vụ' },
  { value: 'khac', label: 'Khác' }
]

// Methods
const onContentChange = (htmlContent) => {
  // CKEditor tự động cập nhật contentHtml, cập nhật content từ HTML
  formData.content = htmlContent.replace(/<[^>]*>/g, '').trim()
  console.log('Content changed:', {
    htmlLength: htmlContent.length,
    textLength: formData.content.length,
    hasContent: !!formData.content
  })
}

const onEditorReady = (editor) => {
  console.log('CKEditor ready')
  editorInstance = editor // Lưu vào biến non-reactive
  
  // Nếu đang edit và có content, set lại
  if (isEditing.value && formData.contentHtml) {
    editor.setData(formData.contentHtml)
  }
}

const debugContent = () => {
  console.log('=== DEBUG CONTENT ===')
  console.log('formData.contentHtml:', formData.contentHtml)
  console.log('formData.content:', formData.content)
  
  if (editorInstance && editorInstance.getData) {
    const editorData = editorInstance.getData()
    console.log('Editor getData():', editorData)
    console.log('Editor text content:', editorData.replace(/<[^>]*>/g, '').trim())
  } else {
    console.log('CKEditor instance not available')
  }
  console.log('====================')
}

// Auto-generate slug when title changes
watch(() => formData.title, (newTitle) => {
  if (autoGenerateSlug.value && newTitle) {
    formData.slug = generateSlug(newTitle)
  }
})

const generateSlugFromTitle = () => {
  if (formData.title) {
    formData.slug = generateSlug(formData.title)
  }
}

const loadArticle = async () => {
  if (!isEditing.value) return
  
  try {
    loading.value = true
    const response = await articleApi.getArticleById(articleId.value)
    
    if (response.succeeded && response.data) {
      const article = response.data
      formData.title = article.title || ''
      formData.slug = article.slug || ''
      formData.description = article.description || ''
      formData.content = article.content || ''
      formData.contentHtml = article.contentHtml || ''
      formData.category = article.category || ''
      
      // Format date for input
      if (article.publishedAt) {
        formData.publishedAt = new Date(article.publishedAt).toISOString().split('T')[0]
      }
      
      // Disable auto-generate slug when editing
      autoGenerateSlug.value = false
    } else {
      Message.error('Không thể tải thông tin bài viết')
      router.push('/admin/articles')
    }
  } catch (error) {
    console.error('Load article error:', error)
    Message.error('Lỗi khi tải thông tin bài viết')
    router.push('/admin/articles')
  } finally {
    loading.value = false
  }
}

const validateForm = () => {
  if (!formData.title.trim()) {
    Message.error('Vui lòng nhập tiêu đề bài viết')
    return false
  }
  
  // Lấy nội dung trực tiếp từ CKEditor instance
  let currentContentHtml = formData.contentHtml
  if (editorInstance && editorInstance.getData) {
    currentContentHtml = editorInstance.getData()
    // Cập nhật lại formData
    formData.contentHtml = currentContentHtml
    formData.content = currentContentHtml.replace(/<[^>]*>/g, '').trim()
  }
  
  // Kiểm tra nội dung thực tế (loại bỏ HTML tags và whitespace)
  const textContent = currentContentHtml.replace(/<[^>]*>/g, '').trim()
  console.log('Validation check:', {
    contentHtml: currentContentHtml,
    textContent: textContent,
    hasTextContent: !!textContent
  })
  
  if (!textContent) {
    Message.error('Vui lòng nhập nội dung bài viết')
    return false
  }
  
  if (!formData.publishedAt) {
    Message.error('Vui lòng chọn ngày xuất bản')
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
    
    const submitData = {
      title: formData.title.trim(),
      slug: formData.slug.trim() || generateSlug(formData.title),
      description: formData.description.trim(),
      content: formData.content.trim(),
      contentHtml: formData.contentHtml,
      category: formData.category,
      publishedAt: new Date(formData.publishedAt).toISOString()
    }
    
    console.log('=== SUBMIT DEBUG ===')
    console.log('Submit data:', submitData)
    console.log('ContentHtml length:', submitData.contentHtml.length)
    console.log('ContentHtml preview:', submitData.contentHtml.substring(0, 200) + '...')
    console.log('Has Vietnamese chars:', /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(submitData.contentHtml))
    console.log('===================')
    
    if (isEditing.value) {
      const response = await articleApi.updateArticle(articleId.value, submitData)
      
      if (response.succeeded) {
        Message.success('Cập nhật bài viết thành công')
        router.push('/admin/articles')
      } else {
        Message.error(response.message || 'Không thể cập nhật bài viết')
      }
    } else {
      const response = await articleApi.createArticle(submitData)
      
      if (response.succeeded) {
        Message.success('Tạo bài viết thành công')
        router.push('/admin/articles')
      } else {
        Message.error(response.message || 'Không thể tạo bài viết')
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
  router.push('/admin/articles')
}

// Lifecycle
onMounted(() => {
  if (isEditing.value) {
    loadArticle()
  }
})
</script>

<style scoped>

</style> 