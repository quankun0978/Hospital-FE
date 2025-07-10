<template>
  <AdminLayout
    page-title="Quản lý lịch hẹn"
    :breadcrumbs="[{ name: 'Quản lý lịch hẹn' }]"
  >
    <div>
      <!-- Header actions -->
      <div class="flex justify-between items-center mb-6">
        <div class="flex-1 max-w-md">
          <AppInput
            v-model="searchTerm"
            @input="handleSearch"
            placeholder="Tìm kiếm theo tên bệnh nhân, bác sĩ..."
            class="w-full"
          >
            <template #prefix>
              <svg
                class="w-4 h-4 text-gray-400"
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
            </template>
          </AppInput>
        </div>

        <div class="flex items-center space-x-4">
          <!-- Status filter -->
          <AppSelect
            v-model="statusFilter"
            @change="handleFilterChange"
            placeholder="Trạng thái"
            :options="statusOptions"
            class="w-40"
          />

          <!-- Date filter -->
          <AppInput
            v-model="dateFilter"
            @change="handleFilterChange"
            type="date"
            placeholder="Chọn ngày"
            class="w-40"
          />
        </div>
      </div>

      <!-- Appointments table -->
      <AppCard>
        <AppTable
          :columns="columns"
          :data="appointments"
          :loading="loading"
          :pagination="paginationConfig"
          @pagination-change="handlePaginationChange"
          row-key="appointmentId"
          empty-text="Không có lịch hẹn nào"
        >
          <!-- Patient info column -->
          <template #cell-patient="{ record }">
            <div class="flex items-center space-x-3">
              <div
                class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
              >
                <span class="text-xs font-medium text-gray-600">
                  {{
                    record.patient?.fullName
                      ? record.patient.fullName.charAt(0).toUpperCase()
                      : "P"
                  }}
                </span>
              </div>
              <div>
                <p class="font-medium text-gray-900">
                  {{ record.patient?.fullName || "N/A" }}
                </p>
                <p class="text-sm text-gray-500">
                  {{ record.patient?.phone || "" }}
                </p>
              </div>
            </div>
          </template>

          <!-- Doctor info column -->
          <template #cell-doctor="{ record }">
            <div>
              <p class="font-medium text-gray-900">
                {{ record.doctor?.name || "N/A" }}
              </p>
              <p class="text-sm text-gray-500">
                {{ record.doctor?.specialtyName || record.doctor?.email || "" }}
              </p>
              <p v-if="record.doctor?.positionName" class="text-xs text-gray-400">
                {{ record.doctor.positionName }}
              </p>
            </div>
          </template>

          <!-- Date time column -->
          <template #cell-datetime="{ record }">
            <div>
              <p class="font-medium text-gray-900">
                {{ formatDate(record.appointmentDate) }}
              </p>
              <p class="text-sm text-gray-500">
                {{ record.timeType || "N/A" }}
              </p>
            </div>
          </template>

          <!-- Status column -->
          <template #cell-status="{ record }">
            <StatusBadge
              :type="getStatusType(record.status)"
              :text="getStatusText(record.status)"
            />
          </template>

          <!-- Actions column -->
          <template #cell-actions="{ record }">
            <div class="flex items-center space-x-2 justify-center">
              <button
                @click="viewPatientInfo(record)"
                class="text-blue-600 hover:text-blue-800 transition-colors"
                title="Xem thông tin bệnh nhân"
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </button>
              <button
                v-if="record.status === 'S2'"
                @click="confirmAppointment(record)"
                class="text-green-600 hover:text-green-800 transition-colors"
                title="Xác nhận hoàn thành khám"
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
              <button
                v-if="!['S3', 'S4'].includes(record.status)"
                @click="cancelAppointment(record)"
                class="text-red-600 hover:text-red-800 transition-colors"
                title="Hủy lịch hẹn"
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
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            </div>
          </template>
        </AppTable>
      </AppCard>
    </div>

    <!-- Patient Info Modal -->
    <AppModal
      :visible="isPatientModalVisible"
      title="Thông tin bệnh nhân"
      @cancel="isPatientModalVisible = false"
      @update:visible="isPatientModalVisible = $event"
      width="lg"
      :show-footer="true"
      :show-ok-button="false"
      :show-cancel-button="true"
      cancel-text="Đóng"
      :mask-closable="true"
    >
      <div v-if="selectedPatient" class="space-y-6">
        <!-- Patient Avatar & Basic Info -->
        <div class="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
          <div
            class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center"
          >
            <svg
              class="w-8 h-8 text-blue-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
              />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">
              {{ selectedPatient.fullName || "Chưa có tên" }}
            </h3>
            <p class="text-sm text-gray-600">
              {{ selectedPatient.email || "Chưa có email" }}
            </p>
          </div>
        </div>

        <!-- Patient Details -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700"
              >Ngày sinh</label
            >
            <p class="text-sm text-gray-900 p-2 bg-gray-50 rounded">
              {{ formatDate(selectedPatient.dateOfBirth) || "Chưa cập nhật" }}
            </p>
          </div>
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700"
              >Giới tính</label
            >
            <p class="text-sm text-gray-900 p-2 bg-gray-50 rounded">
              {{ getGenderText(selectedPatient.gender) }}
            </p>
          </div>
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700"
              >Số điện thoại</label
            >
            <p class="text-sm text-gray-900 p-2 bg-gray-50 rounded">
              {{ selectedPatient.phone || "Chưa cập nhật" }}
            </p>
          </div>
          <div class="md:col-span-2 space-y-1">
            <label class="block text-sm font-medium text-gray-700"
              >Địa chỉ</label
            >
            <p class="text-sm text-gray-900 p-2 bg-gray-50 rounded">
              {{ selectedPatient.address || "Chưa cập nhật" }}
            </p>
          </div>
        </div>
      </div>

      <!-- Loading or No Data State -->
      <div v-else class="text-center py-8">
        <svg
          class="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        <p class="mt-2 text-sm text-gray-500">
          Không tìm thấy thông tin bệnh nhân
        </p>
      </div>
    </AppModal>

    <!-- Complete Appointment Modal -->
    <AppModal
      :visible="isCompleteModalVisible"
      title="Xác nhận hoàn thành khám bệnh"
      :loading="modalLoading"
      @ok="handleCompleteAppointment"
      @cancel="isCompleteModalVisible = false"
      @update:visible="isCompleteModalVisible = $event"
      ok-text="Gửi kết quả"
      cancel-text="Hủy"
      width="lg"
      :mask-closable="false"
    >
      <div v-if="selectedAppointment" class="space-y-4">
        <div class="bg-blue-50 p-4 rounded-lg">
          <h4 class="font-medium text-blue-900">Thông tin lịch khám</h4>
          <p class="text-sm text-blue-800">
            Bệnh nhân: {{ selectedAppointment.patient?.fullName }}
          </p>
          <p class="text-sm text-blue-800">
            Bác sĩ: {{ selectedAppointment.doctor?.name }}
            <span v-if="selectedAppointment.doctor?.specialtyName" class="text-xs">
              ({{ selectedAppointment.doctor.specialtyName }})
            </span>
          </p>
          <p class="text-sm text-blue-800">
            Ngày khám: {{ formatDate(selectedAppointment.appointmentDate) }}
          </p>
        </div>

        <!-- Medical images upload -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Ảnh đơn thuốc / Kết quả khám
          </label>
          <a-upload
            :file-list="medicalFileList"
            :before-upload="beforeUploadMedical"
            :on-remove="handleMedicalRemove"
            list-type="picture-card"
            accept="image/*"
            multiple
            :max-count="5"
          >
            <div>
              <plus-outlined />
              <div class="ant-upload-text">Tải ảnh lên</div>
            </div>
          </a-upload>
          <p class="text-xs text-gray-500 mt-1">
            Tối đa 5 ảnh, mỗi ảnh không quá 5MB
          </p>
        </div>

        <!-- Medical notes -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Ghi chú kết quả khám <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="medicalNotes"
            rows="4"
            placeholder="Nhập kết quả khám, chẩn đoán, và các lưu ý cho bệnh nhân..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          ></textarea>
        </div>
      </div>
    </AppModal>

    <!-- Cancel Appointment Modal -->
    <AppModal
      :visible="isCancelModalVisible"
      title="Xác nhận hủy lịch hẹn"
      :loading="modalLoading"
      @ok="handleCancelAppointment"
      @cancel="isCancelModalVisible = false"
      @update:visible="isCancelModalVisible = $event"
      ok-text="Hủy lịch hẹn"
      cancel-text="Đóng"
      width="sm"
      :mask-closable="false"
    >
      <div v-if="selectedAppointment" class="text-center">
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
          Bạn có chắc chắn muốn hủy?
        </p>
        <p class="text-sm text-gray-600">
          Lịch khám của bệnh nhân
          <strong>{{ selectedAppointment.patient?.fullName }}</strong> 
          với bác sĩ <strong>{{ selectedAppointment.doctor?.name }}</strong>
          vào ngày <strong>{{ formatDate(selectedAppointment.appointmentDate) }}</strong>
          sẽ bị hủy. Hành động này không thể hoàn tác.
        </p>
      </div>
    </AppModal>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth";
import { PlusOutlined } from "@ant-design/icons-vue";
import appointmentApi from "@/api/appointmentApi";
import imageApi from "@/api/imageApi";
import AdminLayout from "@/layouts/AdminLayout.vue";
import AppCard from "@/components/common/Card/Card.vue";
import AppTable from "@/components/common/Table/Table.vue";
import AppModal from "@/components/common/Modal/Modal.vue";
import AppButton from "@/components/common/Button/Button.vue";
import AppInput from "@/components/common/Input/Input.vue";
import AppSelect from "@/components/common/Select/Select.vue";
import StatusBadge from "@/components/common/StatusBadge/StatusBadge.vue";
import Message from "@/plugins/message";
import { getImage } from "../../common/function";

const router = useRouter();
const authStore = useAuthStore();

// State
const loading = ref(false);
const modalLoading = ref(false);
const appointments = ref([]);
const searchTerm = ref("");
const statusFilter = ref("");
const dateFilter = ref("");

// Modal states
const isPatientModalVisible = ref(false);
const isCompleteModalVisible = ref(false);
const isCancelModalVisible = ref(false);
const selectedAppointment = ref(null);
const selectedPatient = ref(null);

// Medical result form
const medicalFileList = ref([]);
const medicalNotes = ref("");
const uploadedMedicalImages = ref([]);

// Pagination state
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
});

// Status options
const statusOptions = [
  { value: "", label: "Tất cả" },
  { value: "S1", label: "Lịch hẹn mới" },
  { value: "S2", label: "Đã xác nhận" },
  { value: "S3", label: "Đã khám xong" },
  { value: "S4", label: "Đã hủy" },
];

// Table columns
const columns = [
  {
    title: "Bệnh nhân",
    key: "patient",
    align: "left",
  },
  {
    title: "Bác sĩ",
    key: "doctor",
    align: "left",
  },
  {
    title: "Ngày giờ khám",
    key: "datetime",
    align: "center",
  },
  {
    title: "Lý do khám",
    key: "reason",
    align: "left",
  },
  {
    title: "Trạng thái",
    key: "status",
    align: "center",
  },
  {
    title: "Thao tác",
    key: "actions",
    align: "center",
  },
];

// Pagination config for table
const paginationConfig = computed(() => ({
  current: pagination.current,
  pageSize: pagination.pageSize,
  total: pagination.total,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total, range) =>
    `Hiển thị ${range[0]}-${range[1]} trong tổng số ${total} lịch hẹn`,
  pageSizeOptions: ["10", "20", "50", "100"],
}));

// Helper methods
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("vi-VN");
};

const getGenderText = (gender) => {
  switch (gender) {
    case "M":
      return "Nam";
    case "F":
      return "Nữ";
    default:
      return "N/A";
  }
};

const getStatusType = (status) => {
  switch (status) {
    case "S1":
      return "warning"; // Lịch hẹn mới
    case "S2":
      return "info"; // Đã xác nhận
    case "S3":
      return "success"; // Đã khám xong
    case "S4":
      return "danger"; // Đã hủy
    default:
      return "default";
  }
};

const getStatusText = (status) => {
  switch (status) {
    case "S1":
      return "Lịch hẹn mới";
    case "S2":
      return "Đã xác nhận";
    case "S3":
      return "Đã khám xong";
    case "S4":
      return "Đã hủy";
    default:
      return "N/A";
  }
};

// Methods
const loadAppointments = async () => {
  try {
    loading.value = true;
    const params = {
      pageNumber: pagination.current,
      pageSize: pagination.pageSize,
      searchTerm: searchTerm.value || undefined,
      status: statusFilter.value || undefined,
      appointmentDate: dateFilter.value || undefined,
    };

    const response = await appointmentApi.getAppointments(params);

    if (response.succeeded) {
      appointments.value = response.data || [];

      // Handle pagination
      const paginationHeader = response.headers?.["x-pagination"];
      if (paginationHeader) {
        const paginationInfo = JSON.parse(paginationHeader);
        pagination.total = paginationInfo.totalCount || 0;
        pagination.current = paginationInfo.currentPage || 1;
        pagination.pageSize = paginationInfo.pageSize || 10;
      } else {
        pagination.total = appointments.value.length;
      }
    } else {
      Message.error(response.message || "Không thể tải danh sách lịch hẹn");
    }
  } catch (error) {
    console.error("Load appointments error:", error);
    Message.error("Lỗi khi tải danh sách lịch hẹn");
  } finally {
    loading.value = false;
  }
};

const handlePaginationChange = ({ pageNumber, pageSize }) => {
  pagination.current = pageNumber;
  pagination.pageSize = pageSize;
  loadAppointments();
};

const handleSearch = debounce(() => {
  pagination.current = 1;
  loadAppointments();
}, 500);

const handleFilterChange = () => {
  pagination.current = 1;
  loadAppointments();
};

// Modal methods
const viewPatientInfo = (appointment) => {
  selectedPatient.value = appointment.patient;
  isPatientModalVisible.value = true;
};

const confirmAppointment = (appointment) => {
  selectedAppointment.value = appointment;
  medicalNotes.value = "";
  medicalFileList.value = [];
  uploadedMedicalImages.value = [];
  isCompleteModalVisible.value = true;
};

const cancelAppointment = (appointment) => {
  selectedAppointment.value = appointment;
  isCancelModalVisible.value = true;
};

// Medical image upload
const beforeUploadMedical = async (file) => {
  const isImage = file.type.startsWith("image/");
  if (!isImage) {
    Message.error("Chỉ được tải lên file hình ảnh!");
    return false;
  }

  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isLt5M) {
    Message.error("Kích thước file không được vượt quá 5MB!");
    return false;
  }

  try {
    const response = await imageApi.uploadMedicalImage(file);

    if (response.succeeded) {
      uploadedMedicalImages.value.push(response.data.imageUrl);
      Message.success("Tải ảnh lên thành công!");

      medicalFileList.value.push({
        uid: Date.now().toString(),
        name: file.name,
        status: "done",
        url: getImage(response.data.imageUrl),
      });
    } else {
      Message.error(response.message || "Không thể tải ảnh lên");
    }
  } catch (error) {
    console.error("Upload medical image error:", error);
    Message.error("Lỗi khi tải ảnh lên");
  }

  return false;
};

const handleMedicalRemove = (file) => {
  const index = medicalFileList.value.findIndex((f) => f.uid === file.uid);
  if (index > -1) {
    medicalFileList.value.splice(index, 1);
    uploadedMedicalImages.value.splice(index, 1);
  }
};

// Complete appointment
const handleCompleteAppointment = async () => {
  if (!medicalNotes.value.trim()) {
    Message.error("Vui lòng nhập ghi chú kết quả khám");
    return;
  }

  // Prevent double submission
  if (modalLoading.value) {
    console.log("Already processing, ignoring duplicate request");
    return;
  }

  try {
    modalLoading.value = true;

    const data = {
      appointmentId: selectedAppointment.value.appointmentId,
      medicalNotes: medicalNotes.value,
      medicalImages: uploadedMedicalImages.value,
    };

    console.log("Sending complete appointment request:", data);
    const response = await appointmentApi.completeAppointment(data);

    if (response.succeeded) {
      Message.success("Hoàn thành khám bệnh và gửi kết quả thành công");
      isCompleteModalVisible.value = false;
      loadAppointments();
    } else {
      Message.error(response.message || "Không thể hoàn thành khám bệnh");
    }
  } catch (error) {
    console.error("Complete appointment error:", error);
    Message.error("Lỗi khi hoàn thành khám bệnh");
  } finally {
    modalLoading.value = false;
  }
};

// Cancel appointment
const handleCancelAppointment = async () => {
  try {
    modalLoading.value = true;

    const response = await appointmentApi.cancelAppointment(
      selectedAppointment.value.appointmentId
    );

    if (response.succeeded) {
      Message.success("Hủy lịch hẹn thành công");
      isCancelModalVisible.value = false;
      loadAppointments();
    } else {
      Message.error(response.message || "Không thể hủy lịch hẹn");
    }
  } catch (error) {
    console.error("Cancel appointment error:", error);
    Message.error("Lỗi khi hủy lịch hẹn");
  } finally {
    modalLoading.value = false;
  }
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
onMounted(() => {
  loadAppointments();
});
</script>

<style scoped>
:deep(.ant-form-item) {
  margin-bottom: 0px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
