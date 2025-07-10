<template>
  <AdminLayout 
    page-title="Quản lý bài viết"
    :breadcrumbs="[{ name: 'Quản lý bài viết' }]"
  >
    <div>
      <AppCard>
        <!-- Actions bar -->
        <div class="mb-6 flex items-center justify-between">
          <div class="relative">
            <input
              v-model="searchTerm"
              @input="handleSearch"
              type="text"
              placeholder="Tìm kiếm theo tiêu đề, tác giả..."
              class="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <AppButton
              variant="primary"
              @click="navigateToCreate"
            >
              Thêm bài viết
            </AppButton>
            <button
              @click="loadArticles"
              class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              title="Làm mới"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Articles table -->
        <AppTable
          :columns="columns"
          :data="articles"
          :loading="loading"
          :pagination="paginationConfig"
          :row-key="record => record.articleId"
          @paginationChange="handlePaginationChange"
          empty-text="Không có bài viết nào"
        >
          <!-- Image column -->
          <template #cell-imageUrl="{ record }">
            <div class="flex justify-center">
              <img
                v-if="record.imageUrl"
                :src="getImage(record.imageUrl)"
                alt="Article image"
                class="w-12 h-12 object-cover rounded-md border border-gray-200"
                @error="onImageError"
              />
              <div
                v-else
                class="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center border border-gray-200"
              >
                <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
            </div>
          </template>

          <!-- Author column -->
          <template #cell-authorName="{ record }">
            <div class="flex items-center">
              <div class="flex-shrink-0 h-8 w-8">
                <div class="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-700">
                  {{ getAuthorInitials(record.authorName) }}
                </div>
              </div>
              <div class="ml-3">
                <div class="text-sm font-medium text-gray-900">
                  {{ record.authorName || 'Không xác định' }}
                </div>
              </div>
            </div>
          </template>

          <!-- Status column -->
          <template #cell-status>
            <StatusBadge
              :type="'success'"
              :text="'Đã xuất bản'"
            />
          </template>

          <!-- Date column -->
          <template #cell-publishedAt="{ record }">
            <div class="text-sm text-gray-900">
              {{ formatDateTime(record.publishedAt) }}
            </div>
            <div v-if="record.updatedAt" class="text-xs text-gray-500">
              Cập nhật: {{ formatDateTime(record.updatedAt) }}
            </div>
          </template>

          <!-- Actions column -->
          <template #cell-actions="{ record }">
            <div class="flex items-center space-x-2 justify-center">
              <button
                @click="viewArticle(record)"
                class="text-green-600 hover:text-green-800 transition-colors"
                title="Xem bài viết"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              </button>
              <button
                @click="navigateToEdit(record)"
                class="text-blue-600 hover:text-blue-800 transition-colors"
                title="Chỉnh sửa"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
              </button>
              <button
                @click="confirmDelete(record)"
                class="text-red-600 hover:text-red-800 transition-colors"
                title="Xóa"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </div>
          </template>
        </AppTable>
      </AppCard>
    </div>

    <!-- Delete Confirmation Modal -->
    <AppModal
      :visible="isDeleteModalVisible"
      title="Xác nhận xóa"
      :loading="modalLoading"
      @ok="handleDelete"
      @cancel="isDeleteModalVisible = false"
      ok-text="Xóa"
      cancel-text="Hủy"
      width="sm"
    >
      <div class="text-center">
        <svg class="mx-auto mb-4 w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
        </svg>
        <p class="text-lg font-medium text-gray-900 mb-2">Bạn có chắc chắn muốn xóa?</p>
        <p class="text-sm text-gray-600">
          Bài viết <strong>{{ selectedArticle?.title }}</strong> sẽ bị xóa vĩnh viễn. 
          Hành động này không thể hoàn tác.
        </p>
      </div>
    </AppModal>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import articleApi from '@/api/articleApi'
import AdminLayout from '@/layouts/AdminLayout.vue'
import AppCard from '@/components/common/Card/Card.vue'
import AppTable from '@/components/common/Table/Table.vue'
import AppButton from '@/components/common/Button/Button.vue'
import AppModal from '@/components/common/Modal/Modal.vue'
import StatusBadge from '@/components/common/StatusBadge/StatusBadge.vue'
import Message from '@/plugins/message'
import { getImage } from '@/common/function'

const router = useRouter()
const authStore = useAuthStore()

// State
const loading = ref(false)
const modalLoading = ref(false)
const articles = ref([])
const searchTerm = ref('')
const isDeleteModalVisible = ref(false)
const selectedArticle = ref(null)

// Pagination state
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})

// Table columns
const columns = [
  {
    title: 'Ảnh',
    key: 'imageUrl',
    align: 'center',
    width: '80px'
  },
  {
    title: 'Tiêu đề',
    key: 'title',
    align: 'left',
    width: '25%'
  },
  {
    title: 'Tác giả',
    key: 'authorName',
    align: 'left'
  },
  {
    title: 'Trạng thái',
    key: 'status',
    align: 'center'
  },
  {
    title: 'Ngày xuất bản',
    key: 'publishedAt',
    align: 'center'
  },
  {
    title: 'Thao tác',
    key: 'actions',
    align: 'center'
  }
]

// Pagination config for table
const paginationConfig = computed(() => ({
  current: pagination.current,
  pageSize: pagination.pageSize,
  total: pagination.total,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total, range) => 
    `Hiển thị ${range[0]}-${range[1]} trong tổng số ${total} bài viết`,
  pageSizeOptions: ['10', '20', '50', '100']
}))

// Methods
const loadArticles = async () => {
  try {
    loading.value = true
    const params = {
      pageNumber: pagination.current,
      pageSize: pagination.pageSize,
      searchTerm: searchTerm.value || undefined,
      sortBy: 'publishedat',
      sortOrder: 'desc'
    }
    
    const response = await articleApi.getArticles(params)
    
    if (response.succeeded) {
      articles.value = response.data.data || []
      pagination.total = response.data.totalCount || 0
      pagination.current = response.data.currentPage || 1
      pagination.pageSize = response.data.pageSize || 10
    } else {
      Message.error(response.message || 'Không thể tải danh sách bài viết')
    }
  } catch (error) {
    console.error('Load articles error:', error)
    Message.error('Lỗi khi tải danh sách bài viết')
  } finally {
    loading.value = false
  }
}

const handlePaginationChange = ({ pageNumber, pageSize }) => {
  pagination.current = pageNumber
  pagination.pageSize = pageSize
  loadArticles()
}

const handleSearch = debounce(() => {
  pagination.current = 1
  loadArticles()
}, 500)

// Navigation methods
const navigateToCreate = () => {
  router.push('/admin/articles/create')
}

const navigateToEdit = (article) => {
  router.push(`/admin/articles/${article.articleId}/edit`)
}

const viewArticle = (article) => {
  if (article.slug) {
    window.open(`/articles/${article.slug}`, '_blank')
  } else {
    Message.warning('Bài viết chưa có slug')
  }
}

const confirmDelete = (article) => {
  selectedArticle.value = article
  isDeleteModalVisible.value = true
}

const handleDelete = async () => {
  try {
    modalLoading.value = true
    
    const response = await articleApi.deleteArticle(selectedArticle.value.articleId)
    
    if (response.succeeded) {
      Message.success('Xóa bài viết thành công')
      isDeleteModalVisible.value = false
      loadArticles()
    } else {
      Message.error(response.message || 'Không thể xóa bài viết')
    }
  } catch (error) {
    console.error('Delete article error:', error)
    Message.error('Lỗi khi xóa bài viết')
  } finally {
    modalLoading.value = false
  }
}

// Helper methods
const getAuthorInitials = (name) => {
  if (!name) return 'N/A'
  return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2)
}

const formatDateTime = (dateString) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const onImageError = (event) => {
  event.target.style.display = 'none'
  event.target.parentElement.innerHTML = `
    <div class="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center border border-gray-200">
      <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
      </svg>
    </div>
  `
}

// Debounce function
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Lifecycle
onMounted(() => {
  loadArticles()
})
</script>

<style scoped>
</style> 