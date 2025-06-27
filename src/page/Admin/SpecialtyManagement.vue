<template>
  <AdminLayout 
    page-title="Quản lý chuyên khoa"
    :breadcrumbs="[{ name: 'Quản lý chuyên khoa' }]"
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
              placeholder="Tìm kiếm theo tên chuyên khoa..."
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
              Thêm chuyên khoa
            </AppButton>
            <button
              @click="loadSpecialties"
              class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              title="Làm mới"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Specialties table -->
        <AppTable
          :columns="columns"
          :data="specialties"
          :loading="loading"
          :pagination="paginationConfig"
          :row-key="record => record.specialtyId"
          @paginationChange="handlePaginationChange"
          empty-text="Không có chuyên khoa nào"
        >
          <!-- Image column -->
          <template #cell-image="{ record }">
            <div class="flex justify-center">
              <img
                v-if="record.imageUrl"
                :src="getImage(record.imageUrl)"
                :alt="record.name"
                class="w-12 h-12 object-cover rounded-lg border"
                @error="handleImageError"
              />
              <div v-else class="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
            </div>
          </template>

          <!-- Actions column -->
          <template #cell-actions="{ record }">
            <div class="flex items-center space-x-2 justify-center">
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
      @update:visible="isDeleteModalVisible = $event"
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
          Chuyên khoa <strong>{{ selectedSpecialty?.name }}</strong> sẽ bị xóa vĩnh viễn. 
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
import specialityApi from '@/api/specialityApi'
import AdminLayout from '@/layouts/AdminLayout.vue'
import AppCard from '@/components/common/Card/Card.vue'
import AppTable from '@/components/common/Table/Table.vue'
import AppModal from '@/components/common/Modal/Modal.vue'
import AppButton from '@/components/common/Button/Button.vue'
import Message from '@/plugins/message'
import { getImage } from '@/common/function'

const router = useRouter()
const authStore = useAuthStore()

// State
const loading = ref(false)
const modalLoading = ref(false)
const specialties = ref([])
const searchTerm = ref('')
const isDeleteModalVisible = ref(false)
const selectedSpecialty = ref(null)

// Pagination state
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})

// Table columns
const columns = [
  {
    title: 'Hình ảnh',
    key: 'image',
    align: 'center'
  },
  {
    title: 'Tên chuyên khoa',
    key: 'name',
    align: 'left'
  },
  {
    title: 'Mô tả',
    key: 'description',
    align: 'left'
  },
  {
    title: 'Slug',
    key: 'slug',
    align: 'left'
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
    `Hiển thị ${range[0]}-${range[1]} trong tổng số ${total} chuyên khoa`,
  pageSizeOptions: ['10', '20', '50', '100']
}))

// Methods
const loadSpecialties = async () => {
  try {
    loading.value = true
    
    // Sử dụng getAllSpecialties để lấy tất cả chuyên khoa
    const response = await specialityApi.getAllSpecialties()
    
    if (response.succeeded) {
      let allSpecialties = response.data || []
      
      // Filter theo searchTerm nếu có
      if (searchTerm.value) {
        const searchLower = searchTerm.value.toLowerCase()
        allSpecialties = allSpecialties.filter(specialty => 
          specialty.name?.toLowerCase().includes(searchLower) ||
          specialty.description?.toLowerCase().includes(searchLower)
        )
      }
      
      // Implement pagination manually
      const startIndex = (pagination.current - 1) * pagination.pageSize
      const endIndex = startIndex + pagination.pageSize
      
      specialties.value = allSpecialties.slice(startIndex, endIndex)
      pagination.total = allSpecialties.length
    } else {
      Message.error(response.message || 'Không thể tải danh sách chuyên khoa')
    }
  } catch (error) {
    console.error('Load specialties error:', error)
    Message.error('Lỗi khi tải danh sách chuyên khoa')
  } finally {
    loading.value = false
  }
}

const handlePaginationChange = ({ pageNumber, pageSize }) => {
  pagination.current = pageNumber
  pagination.pageSize = pageSize
  loadSpecialties()
}

const handleSearch = debounce(() => {
  pagination.current = 1
  loadSpecialties()
}, 500)

const handleImageError = (event) => {
  event.target.style.display = 'none'
}

// Navigation methods
const navigateToCreate = () => {
  router.push('/admin/specialties/create')
}

const navigateToEdit = (specialty) => {
  router.push(`/admin/specialties/${specialty.specialtyId}/edit`)
}

const confirmDelete = (specialty) => {
  selectedSpecialty.value = specialty
  isDeleteModalVisible.value = true
}

const handleDelete = async () => {
  try {
    modalLoading.value = true
    
    const response = await specialityApi.deleteSpecialty(selectedSpecialty.value.specialtyId)
    
    if (response.succeeded) {
      Message.success('Xóa chuyên khoa thành công')
      isDeleteModalVisible.value = false
      loadSpecialties()
    } else {
      Message.error(response.message || 'Không thể xóa chuyên khoa')
    }
  } catch (error) {
    console.error('Delete specialty error:', error)
    Message.error('Lỗi khi xóa chuyên khoa')
  } finally {
    modalLoading.value = false
  }
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
  loadSpecialties()
})
</script>

<style scoped>
</style> 