<template>
  <AdminLayout 
    page-title="Quản lý cơ sở y tế"
    :breadcrumbs="[{ name: 'Quản lý cơ sở y tế' }]"
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
              placeholder="Tìm kiếm theo tên, địa chỉ..."
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
              Thêm cơ sở y tế
            </AppButton>
            <button
              @click="loadClinics"
              class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              title="Làm mới"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Clinics table -->
        <AppTable
          :columns="columns"
          :data="clinics"
          :loading="loading"
          :pagination="paginationConfig"
          :row-key="record => record.clinicId"
          @paginationChange="handlePaginationChange"
          empty-text="Không có cơ sở y tế nào"
        >
          <!-- Type column -->
          <template #cell-type="{ record }">
            <StatusBadge
              :type="record.isHospital ? 'info' : 'success'"
              :text="record.isHospital ? 'Bệnh viện' : 'Phòng khám'"
            />
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
          Cơ sở y tế <strong>{{ selectedClinic?.name }}</strong> sẽ bị xóa vĩnh viễn. 
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
import clinicApi from '@/api/clinicApi'
import AdminLayout from '@/layouts/AdminLayout.vue'
import AppCard from '@/components/common/Card/Card.vue'
import AppTable from '@/components/common/Table/Table.vue'
import AppModal from '@/components/common/Modal/Modal.vue'
import StatusBadge from '@/components/common/StatusBadge/StatusBadge.vue'
import Message from '@/plugins/message'
import { getImage } from '@/common/function'

const router = useRouter()
const authStore = useAuthStore()

// State
const loading = ref(false)
const modalLoading = ref(false)
const clinics = ref([])
const searchTerm = ref('')
const isDeleteModalVisible = ref(false)
const selectedClinic = ref(null)

// Pagination state
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})

// Table columns
const columns = [
  {
    title: 'Tên cơ sở y tế',
    key: 'name',
    align: 'left'
  },
  {
    title: 'Địa chỉ',
    key: 'address',
    align: 'left'
  },
  {
    title: 'Loại hình',
    key: 'type',
    align: 'center'
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
    `Hiển thị ${range[0]}-${range[1]} trong tổng số ${total} cơ sở y tế`,
  pageSizeOptions: ['10', '20', '50', '100']
}))

// Methods
const loadClinics = async () => {
  try {
    loading.value = true
    const params = {
      pageNumber: pagination.current,
      pageSize: pagination.pageSize,
      searchTerm: searchTerm.value || undefined
    }
    
    const response = await clinicApi.getClinics(params)
    
    if (response.succeeded) {
      // API trả về trực tiếp array data, không phải object với data property
      clinics.value = response.data || []
      // Lấy thông tin pagination từ headers hoặc response metadata
      const paginationHeader = response.headers?.['x-pagination']
      if (paginationHeader) {
        const paginationInfo = JSON.parse(paginationHeader)
        pagination.total = paginationInfo.totalCount || 0
        pagination.current = paginationInfo.currentPage || 1
        pagination.pageSize = paginationInfo.pageSize || 10
      } else {
        // Fallback nếu không có header
        pagination.total = clinics.value.length
        pagination.current = pagination.current
        pagination.pageSize = pagination.pageSize
      }
    } else {
      Message.error(response.message || 'Không thể tải danh sách cơ sở y tế')
    }
  } catch (error) {
    console.error('Load clinics error:', error)
    Message.error('Lỗi khi tải danh sách cơ sở y tế')
  } finally {
    loading.value = false
  }
}

const handlePaginationChange = ({ pageNumber, pageSize }) => {
  pagination.current = pageNumber
  pagination.pageSize = pageSize
  loadClinics()
}

const handleSearch = debounce(() => {
  pagination.current = 1
  loadClinics()
}, 500)

// Navigation methods
const navigateToCreate = () => {
  router.push('/admin/clinics/create')
}

const navigateToEdit = (clinic) => {
  router.push(`/admin/clinics/${clinic.clinicId}/edit`)
}

const confirmDelete = (clinic) => {
  selectedClinic.value = clinic
  isDeleteModalVisible.value = true
}

const handleDelete = async () => {
  try {
    modalLoading.value = true
    
    const response = await clinicApi.deleteClinic(selectedClinic.value.clinicId)
    
    if (response.success) {
      Message.success('Xóa cơ sở y tế thành công')
      isDeleteModalVisible.value = false
      loadClinics()
    } else {
      Message.error(response.message || 'Không thể xóa cơ sở y tế')
    }
  } catch (error) {
    console.error('Delete clinic error:', error)
    Message.error('Lỗi khi xóa cơ sở y tế')
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
  loadClinics()
})
</script>

<style scoped>
</style>
