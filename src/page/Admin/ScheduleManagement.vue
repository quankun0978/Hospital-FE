<template>
  <AdminLayout
    page-title="Quản lý lịch khám"
    :breadcrumbs="[{ name: 'Quản lý lịch khám' }]"
  >
    <div>
      <AppCard>
        <!-- Actions bar -->
        <div class="mb-6 flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="relative">
              <input
                v-model="searchTerm"
                @input="handleSearch"
                type="text"
                placeholder="Tìm kiếm theo tên bác sĩ, thời gian..."
                class="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <svg
                  class="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            <!-- Doctor filter (Only for Admin) -->
            <div v-if="userRole === 'R1'" class="flex items-center space-x-2">
              <label class="text-sm font-medium text-gray-700">Bác sĩ:</label>
              <select
                v-model="selectedDoctorId"
                @change="loadSchedules"
                class="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tất cả bác sĩ</option>
                <option
                  v-for="doctor in doctors"
                  :key="doctor.id"
                  :value="doctor.id"
                >
                  {{ doctor.name }}
                </option>
              </select>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <AppButton variant="primary" @click="navigateToCreate">
              Thêm lịch khám
            </AppButton>
            <button
              @click="loadSchedules"
              class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              title="Làm mới"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Schedules table -->
        <AppTable
          :columns="columns"
          :data="schedules"
          :loading="loading"
          :pagination="paginationConfig"
          :row-key="(record) => record.id"
          @paginationChange="handlePaginationChange"
          empty-text="Không có lịch khám nào"
        >
          <!-- Date column -->
          <template #cell-date="{ record }">
            {{ formatDate(record.date) }}
          </template>

          <!-- Actions column -->
          <template #cell-actions="{ record }">
            <div class="flex items-center space-x-2 justify-center">
              <button
                @click="navigateToEdit(record)"
                class="text-blue-600 hover:text-blue-800 transition-colors"
                title="Chỉnh sửa"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <button
                @click="confirmDelete(record)"
                class="text-red-600 hover:text-red-800 transition-colors"
                title="Xóa"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
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
        <svg
          class="mx-auto mb-4 w-12 h-12 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        <p class="text-lg font-medium text-gray-900 mb-2">
          Bạn có chắc chắn muốn xóa?
        </p>
        <p class="text-sm text-gray-600">
          Lịch khám ngày
          <strong>{{ formatDate(selectedSchedule?.date) }}</strong> -
          <strong>{{ selectedSchedule?.timeTypeText }}</strong> của bác sĩ
          <strong>{{ selectedSchedule?.doctorName }}</strong> sẽ bị xóa vĩnh
          viễn. Hành động này không thể hoàn tác.
        </p>
      </div>
    </AppModal>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth";
import scheduleApi from "@/api/scheduleApi";
import AdminLayout from "@/layouts/AdminLayout.vue";
import AppCard from "@/components/common/Card/Card.vue";
import AppTable from "@/components/common/Table/Table.vue";
import AppButton from "@/components/common/Button/Button.vue";
import AppModal from "@/components/common/Modal/Modal.vue";
import Message from "@/plugins/message";

const router = useRouter();
const authStore = useAuthStore();

// State
const loading = ref(false);
const modalLoading = ref(false);
const schedules = ref([]);
const doctors = ref([]);
const searchTerm = ref("");
const startDate = ref("");
const endDate = ref("");
const selectedDoctorId = ref("");
const isDeleteModalVisible = ref(false);
const selectedSchedule = ref(null);

// User info
const userRole = computed(() => authStore.getUserRole);

// Pagination state
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
});

// Table columns
const columns = computed(() => {
  const baseColumns = [
    {
      title: "Ngày khám",
      key: "date",
      align: "center",
    },
    {
      title: "Thời gian",
      key: "timeTypeText",
      align: "center",
    },
    {
      title: "Thao tác",
      key: "actions",
      align: "center",
    },
  ];

  // Add doctor column for admin
  if (userRole.value === "R1") {
    baseColumns.splice(2, 0, {
      title: "Bác sĩ",
      key: "doctorName",
      align: "left",
    });
  }

  return baseColumns;
});

// Pagination config for table
const paginationConfig = computed(() => ({
  current: pagination.current,
  pageSize: pagination.pageSize,
  total: pagination.total,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total, range) =>
    `Hiển thị ${range[0]}-${range[1]} trong tổng số ${total} lịch khám`,
  pageSizeOptions: ["10", "20", "50", "100"],
}));

// Methods
const loadSchedules = async () => {
  try {
    loading.value = true;
    const params = {
      pageNumber: pagination.current,
      pageSize: pagination.pageSize,
    };

    // Add search term if provided
    if (searchTerm.value) {
      params.searchTerm = searchTerm.value;
    }

    let response;
    if (userRole.value === "R1") {
      // Admin can see all schedules or filter by doctor
      if (selectedDoctorId.value) {
        params.doctorId = selectedDoctorId.value;
        response = await scheduleApi.getSchedulesByDoctor(params);
      } else {
        response = await scheduleApi.getSchedules(params);
      }
    } else {
      // Doctor can only see own schedules
      response = await scheduleApi.getSchedulesByDoctor(params);
    }

    if (response.data.succeeded) {
      schedules.value = response.data.data.data || [];
      pagination.total = response.data.totalCount || 0;
      pagination.current = response.data.currentPage || 1;
      pagination.pageSize = response.data.pageSize || 10;
    } else {
      Message.error(response.message || "Không thể tải danh sách lịch khám");
    }
  } catch (error) {
    console.error("Load schedules error:", error);
    Message.error("Lỗi khi tải danh sách lịch khám");
  } finally {
    loading.value = false;
  }
};

const loadDoctors = async () => {
  if (userRole.value !== "R1") return;

  try {
    const response = await scheduleApi.getDoctors();
    if (response.data.succeeded) {
      doctors.value = response.data.data || [];
    } else {
      Message.error("Không thể tải danh sách bác sĩ");
    }
  } catch (error) {
    console.error("Load doctors error:", error);
    Message.error("Lỗi khi tải danh sách bác sĩ");
  }
};

const handlePaginationChange = ({ pageNumber, pageSize }) => {
  pagination.current = pageNumber;
  pagination.pageSize = pageSize;
  loadSchedules();
};

const handleSearch = debounce(() => {
  pagination.current = 1;
  loadSchedules();
}, 500);

// Navigation methods
const navigateToCreate = () => {
  router.push("/admin/schedules/create");
};

const navigateToEdit = (schedule) => {
  router.push(`/admin/schedules/${schedule.id}/edit`);
};

const confirmDelete = (schedule) => {
  selectedSchedule.value = schedule;
  isDeleteModalVisible.value = true;
};

const handleDelete = async () => {
  // Prevent double-click
  if (modalLoading.value) return;

  try {
    modalLoading.value = true;

    const response = await scheduleApi.deleteSchedule(
      selectedSchedule.value.id
    );

    if (response.data.succeeded) {
      Message.success("Xóa lịch khám thành công");
      isDeleteModalVisible.value = false;
      selectedSchedule.value = null;
      loadSchedules();
    } else {
      Message.error(response.message || "Không thể xóa lịch khám");
    }
  } catch (error) {
    console.error("Delete schedule error:", error);
    Message.error("Lỗi khi xóa lịch khám");
  } finally {
    modalLoading.value = false;
  }
};

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
};

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Lifecycle
onMounted(async () => {
  await Promise.all([loadSchedules(), loadDoctors()]);
});
</script>

<style scoped>
.form-group {
  margin-bottom: 1rem;
}
</style>
