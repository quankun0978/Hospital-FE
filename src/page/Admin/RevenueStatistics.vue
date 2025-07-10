<template>
  <AdminLayout
    page-title="Thống kê doanh thu"
    :breadcrumbs="[{ name: 'Thống kê doanh thu' }]"
  >
    <div class="space-y-6">
      <!-- Filter Section -->
      <AppCard>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Từ ngày
            </label>
            <InputDate
              v-model="filters.fromDate"
              placeholder="Chọn ngày bắt đầu"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Đến ngày
            </label>
            <InputDate
              v-model="filters.toDate"
              placeholder="Chọn ngày kết thúc"
            />
          </div>
          <div class="flex space-x-2">
            <AppButton
              variant="primary"
              @click="loadStatistics"
              :loading="loading"
            >
              Xem thống kê
            </AppButton>
            <AppButton
              variant="secondary"
              @click="exportReport"
              :loading="exportLoading"
              :disabled="!statistics"
            >
              Xuất báo cáo
            </AppButton>
          </div>
        </div>
      </AppCard>

      <!-- Summary Cards -->
      <div v-if="statistics" class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div
                class="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center"
              >
                <svg
                  class="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  ></path>
                </svg>
              </div>
            </div>
            <div class="ms-2 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Tổng doanh thu
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ formatCurrency(statistics.totalRevenue) }}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div
                class="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center"
              >
                <svg
                  class="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h2m0-13h2a2 2 0 012 2v11a2 2 0 01-2 2H9m3-13h3a2 2 0 012 2v3m-3 1h3m-3 2h3m-6 1h6M9 15v2M9 11v2"
                  ></path>
                </svg>
              </div>
            </div>
            <div class="ms-2 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Tổng lịch khám
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ statistics.totalAppointments }}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div
                class="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center"
              >
                <svg
                  class="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  ></path>
                </svg>
              </div>
            </div>
            <div class="ms-2 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Trung bình/ngày
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ formatCurrency(statistics.averageRevenuePerDay) }}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div
                class="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center"
              >
                <svg
                  class="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  ></path>
                </svg>
              </div>
            </div>
            <div class="ms-2 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Số bác sĩ
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ statistics.topDoctors.length }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div v-if="chartData" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Revenue Chart -->
        <AppCard>
          <div class="mb-4">
            <h3 class="text-lg font-medium text-gray-900">
              Biểu đồ doanh thu theo ngày
            </h3>
            <p class="text-sm text-gray-600">
              Doanh thu hàng ngày trong khoảng thời gian đã chọn
            </p>
          </div>
          <div class="h-80">
            <Line :data="revenueChartConfig" :options="chartOptions" />
          </div>
        </AppCard>

        <!-- Appointments Chart -->
        <AppCard>
          <div class="mb-4">
            <h3 class="text-lg font-medium text-gray-900">
              Biểu đồ lịch khám theo ngày
            </h3>
            <p class="text-sm text-gray-600">
              Số lượng lịch khám hàng ngày trong khoảng thời gian đã chọn
            </p>
          </div>
          <div class="h-80">
            <Bar :data="appointmentChartConfig" :options="chartOptions" />
          </div>
        </AppCard>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && !statistics" class="text-center py-12">
        <svg
          class="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          ></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">
          Chưa có dữ liệu thống kê
        </h3>
        <p class="mt-1 text-sm text-gray-500">
          Chọn khoảng thời gian để xem thống kê doanh thu
        </p>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from "vue";
import { useAuthStore } from "@/store/auth";
import statisticsApi from "@/api/statisticsApi";
import AdminLayout from "@/layouts/AdminLayout.vue";
import AppCard from "@/components/common/Card/Card.vue";
import AppButton from "@/components/common/Button/Button.vue";
import InputDate from "@/components/common/Input/InputDate.vue";
import Message from "@/plugins/message";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar } from "vue-chartjs";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const authStore = useAuthStore();

// State
const loading = ref(false);
const exportLoading = ref(false);
const statistics = ref(null);
const chartData = ref(null);

// Filters
const filters = reactive({
  fromDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0], // 30 days ago
  toDate: new Date().toISOString().split("T")[0], // today
});

// Chart configurations
const revenueChartConfig = computed(() => {
  if (!chartData.value) return {};

  return {
    labels: chartData.value.labels,
    datasets: [
      {
        label: "Doanh thu (VND)",
        data: chartData.value.data,
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };
});

const appointmentChartConfig = computed(() => {
  if (!chartData.value) return {};

  return {
    labels: chartData.value.labels,
    datasets: [
      {
        label: "Số lịch khám",
        data: chartData.value.appointmentCounts,
        backgroundColor: "rgba(34, 197, 94, 0.8)",
        borderColor: "rgb(34, 197, 94)",
        borderWidth: 1,
      },
    ],
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      display: true,
      title: {
        display: true,
        text: 'Ngày',
      },
    },
    y: {
      beginAtZero: true,
      display: true,
      title: {
        display: true,
        text: 'Giá trị',
      },
      ticks: {
        stepSize: 1,
        callback: function (value) {
          // Chỉ hiển thị số nguyên
          if (Number.isInteger(value)) {
            return value;
          }
        },
      },
    },
  },
  plugins: {
    legend: {
      display: true,
      position: "top",
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            // Format currency for revenue chart
            if (context.dataset.label === 'Doanh thu (VND)') {
              label += formatCurrency(context.parsed.y);
            } else {
              label += context.parsed.y;
            }
          }
          return label;
        },
      },
    },
  },
};

// Methods
const loadStatistics = async () => {
  if (!filters.fromDate || !filters.toDate) {
    Message.error("Vui lòng chọn khoảng thời gian");
    return;
  }

  if (new Date(filters.fromDate) > new Date(filters.toDate)) {
    Message.error("Ngày bắt đầu không thể lớn hơn ngày kết thúc");
    return;
  }

  try {
    loading.value = true;

    // Load statistics and chart data in parallel
    const [statisticsResponse, chartResponse] = await Promise.all([
      statisticsApi.getRevenueStatistics({
        fromDate: filters.fromDate,
        toDate: filters.toDate,
      }),
      statisticsApi.getRevenueChartData({
        fromDate: filters.fromDate,
        toDate: filters.toDate,
      }),
    ]);

    if (statisticsResponse.succeeded) {
      statistics.value = statisticsResponse.data;
    } else {
      Message.error(
        statisticsResponse.message || "Không thể tải thống kê doanh thu"
      );
    }

    if (chartResponse.succeeded) {
      chartData.value = chartResponse.data;
    } else {
      Message.error(chartResponse.message || "Không thể tải dữ liệu biểu đồ");
    }
  } catch (error) {
    console.error("Load statistics error:", error);
    Message.error("Lỗi khi tải thống kê doanh thu");
  } finally {
    loading.value = false;
  }
};

const exportReport = async () => {
  if (!statistics.value) {
    Message.error("Vui lòng xem thống kê trước khi xuất báo cáo");
    return;
  }

  try {
    exportLoading.value = true;

    const response = await statisticsApi.exportRevenueReport({
      fromDate: filters.fromDate,
      toDate: filters.toDate,
    });

    if (response.succeeded) {
      Message.success("Xuất báo cáo thành công");
    } else {
      Message.error(response.message || "Lỗi khi xuất báo cáo");
    }
  } catch (error) {
    console.error("Export report error:", error);
    Message.error("Lỗi khi xuất báo cáo");
  } finally {
    exportLoading.value = false;
  }
};

// Helper methods
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const getDoctoInitials = (name) => {
  if (!name) return "N/A";
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// Lifecycle
onMounted(() => {
  // Load default statistics on mount
  loadStatistics();
});
</script>

<style scoped></style>
