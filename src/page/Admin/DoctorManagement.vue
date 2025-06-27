<template>
  <AdminLayout 
    page-title="Quản lý bác sĩ"
    :breadcrumbs="[{ name: 'Quản lý bác sĩ' }]"
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
              placeholder="Tìm kiếm theo tên, email, chuyên khoa..."
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
              Thêm thông tin bác sĩ
            </AppButton>
            <button
              @click="loadDoctors"
              class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              title="Làm mới"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Doctors table -->
        <AppTable
          :columns="columns"
          :data="doctors"
          :loading="loading"
          :pagination="paginationConfig"
          :row-key="record => record.doctorId"
          @paginationChange="handlePaginationChange"
          empty-text="Không có thông tin bác sĩ nào"
        >
          <!-- Doctor name column -->
          <template #cell-doctorName="{ record }">
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0 h-10 w-10">
                <img
                  v-if="record.imageUrl"
                  :src="getImage(record.imageUrl)"
                  :alt="getDoctorName(record)"
                  class="h-10 w-10 rounded-full object-cover"
                />
                <div
                  v-else
                  class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center"
                >
                  <svg class="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </div>
              </div>
              <div>
                <div class="text-sm font-medium text-gray-900">
                  {{ getDoctorName(record) }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ record.doctor?.email }}
                </div>
              </div>
            </div>
          </template>

          <!-- Position column -->
          <template #cell-position="{ record }">
            <StatusBadge
              :type="'info'"
              :text="record.position?.valueVi || 'Chưa xác định'"
            />
          </template>

          <!-- Price column -->
          <template #cell-price="{ record }">
            <StatusBadge
              :type="'success'"
              :text="record.price?.valueVi || 'Chưa xác định'"
            />
          </template>

          <!-- Clinic column -->
          <template #cell-clinic="{ record }">
            <span class="text-sm text-gray-900">
              {{ record.clinic?.name || 'Chưa gán phòng khám' }}
            </span>
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
          Thông tin bác sĩ <strong>{{ getDoctorName(selectedDoctor) }}</strong> sẽ bị xóa vĩnh viễn. 
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
import doctorApi from '@/api/doctorApi'
import AdminLayout from '@/layouts/AdminLayout.vue'
import AppCard from '@/components/common/Card/Card.vue'
import AppTable from '@/components/common/Table/Table.vue'
import AppModal from '@/components/common/Modal/Modal.vue'
import AppButton from '@/components/common/Button/Button.vue'
import StatusBadge from '@/components/common/StatusBadge/StatusBadge.vue'
import Message from '@/plugins/message'
import { getImage } from '@/common/function'

const router = useRouter()
const authStore = useAuthStore()

// State
const loading = ref(false)
const modalLoading = ref(false)
const doctors = ref([])
const searchTerm = ref('')
const isDeleteModalVisible = ref(false)
const selectedDoctor = ref(null)

// Pagination state
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})

// Table columns
const columns = [
  {
    title: 'Bác sĩ',
    key: 'name',
    align: 'left'
  },
  {
    title: 'Chức vụ',
    key: 'positionName',
    align: 'center'
  },
  {
    title: 'Mức giá',
    key: 'priceName',
    align: 'center'
  },
  {
    title: 'Phòng khám',
    key: 'clinicName',
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
    `Hiển thị ${range[0]}-${range[1]} trong tổng số ${total} bác sĩ`,
  pageSizeOptions: ['10', '20', '50', '100']
}))

// Helper methods
const getDoctorName = (doctor) => {
  if (!doctor?.doctor) return 'N/A'
  return `${doctor.doctor.firstName || ''} ${doctor.doctor.lastName || ''}`.trim() || doctor.doctor.email
}

// Methods
const loadDoctors = async () => {
  try {
    loading.value = true
    const params = {
      pageNumber: pagination.current,
      pageSize: pagination.pageSize,
      searchTerm: searchTerm.value || undefined
    }
    
    const response = await doctorApi.getDoctors(params)
    
    if (response.succeeded) {
      const data  = response.data.map(item => {
        const doctorInfo = item.doctorInfos
        return {
          doctorId: item.doctorId,
          name: item.name,
          positionName: doctorInfo[0].positionName,
          priceName: doctorInfo[0].priceName,
          clinicName: doctorInfo[0].clinicName,
          slug: doctorInfo[0].slug,
        }
      })
      doctors.value = data || []
      // Lấy thông tin pagination từ headers hoặc response metadata
      const paginationHeader = response.headers?.['x-pagination']
      if (paginationHeader) {
        const paginationInfo = JSON.parse(paginationHeader)
        pagination.total = paginationInfo.totalCount || 0
        pagination.current = paginationInfo.currentPage || 1
        pagination.pageSize = paginationInfo.pageSize || 10
      } else {
        // Fallback nếu không có header
        pagination.total = doctors.value.length
        pagination.current = pagination.current
        pagination.pageSize = pagination.pageSize
      }
    } else {
      Message.error(response.message || 'Không thể tải danh sách bác sĩ')
    }
  } catch (error) {
    console.error('Load doctors error:', error)
    Message.error('Lỗi khi tải danh sách bác sĩ')
  } finally {
    loading.value = false
  }
}

const handlePaginationChange = ({ pageNumber, pageSize }) => {
  pagination.current = pageNumber
  pagination.pageSize = pageSize
  loadDoctors()
}

const handleSearch = debounce(() => {
  pagination.current = 1
  loadDoctors()
}, 500)

// Navigation methods
const navigateToCreate = () => {
  router.push('/admin/doctors/create')
}

const navigateToEdit = (doctor) => {
  router.push(`/admin/doctors/${doctor.doctorId}/edit`)
}

const confirmDelete = (doctor) => {
  selectedDoctor.value = doctor
  isDeleteModalVisible.value = true
}

const handleDelete = async () => {
  try {
    modalLoading.value = true
    
    const response = await doctorApi.deleteDoctor(selectedDoctor.value.doctorId)
    
    if (response.success) {
      Message.success('Xóa thông tin bác sĩ thành công')
      isDeleteModalVisible.value = false
      loadDoctors()
    } else {
      Message.error(response.message || 'Không thể xóa thông tin bác sĩ')
    }
  } catch (error) {
    console.error('Delete doctor error:', error)
    Message.error('Lỗi khi xóa thông tin bác sĩ')
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
  loadDoctors()
})
</script>

<style scoped>
</style> 