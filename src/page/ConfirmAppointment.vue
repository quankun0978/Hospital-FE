<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Loading State -->
      <div v-if="loading" class="text-center">
        <div class="loader mx-auto mb-4"></div>
        <h2 class="text-lg font-medium text-gray-900">Đang xác nhận lịch khám...</h2>
        <p class="text-gray-600">Vui lòng đợi một chút.</p>
      </div>

      <!-- Success State -->
      <div v-else-if="confirmed" class="text-center">
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
          <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Xác nhận thành công!</h2>
        
        <div class="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Thông tin lịch khám</h3>
          <div v-if="appointmentDetails" class="text-left space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-600">Bệnh nhân:</span>
              <span class="font-medium">{{ appointmentDetails.patientName }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Bác sĩ:</span>
              <span class="font-medium">{{ appointmentDetails.doctorName }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Ngày khám:</span>
              <span class="font-medium">{{ formatDate(appointmentDetails.appointmentDate) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Giờ khám:</span>
              <span class="font-medium">{{ appointmentDetails.timeType }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Trạng thái:</span>
              <span class="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                {{ appointmentDetails.statusText }}
              </span>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <p class="text-gray-600">
            Lịch khám của bạn đã được xác nhận thành công. Vui lòng đến đúng giờ hẹn.
          </p>
          
          <div class="flex space-x-4">
            <button
              @click="goHome"
              class="flex-1 bg-primary text-white py-3 px-4 rounded-md hover:bg-primary-hover transition"
            >
              Về trang chủ
            </button>
            <button
              @click="viewAppointments"
              class="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-md hover:bg-gray-300 transition"
            >
              Xem lịch khám
            </button>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else class="text-center">
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
          <svg class="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
        
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Xác nhận thất bại</h2>
        <p class="text-gray-600 mb-6">{{ errorMessage }}</p>
        
        <div class="space-y-4">
          <button
            @click="retry"
            class="w-full bg-primary text-white py-3 px-4 rounded-md hover:bg-primary-hover transition"
          >
            Thử lại
          </button>
          <button
            @click="goHome"
            class="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-md hover:bg-gray-300 transition"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import appointmentApi from '@/api/appointmentApi';
import Message from '@/plugins/message';

const route = useRoute();
const router = useRouter();

// State
const loading = ref(true);
const confirmed = ref(false);
const errorMessage = ref('');
const appointmentDetails = ref(null);

// Lấy appointmentId từ query params
const appointmentId = route.query.id;

// Xác nhận lịch khám
const confirmAppointment = async () => {
  if (!appointmentId) {
    errorMessage.value = 'Không tìm thấy mã lịch khám.';
    loading.value = false;
    return;
  }

  try {
    loading.value = true;
    
    // Gọi API xác nhận
    const confirmResponse = await appointmentApi.confirm(appointmentId);
    
    if (confirmResponse.succeeded) {
      // Lấy thông tin chi tiết lịch khám
      const detailResponse = await appointmentApi.getById(appointmentId);
      
      if (detailResponse.succeeded) {
        appointmentDetails.value = detailResponse.data;
        confirmed.value = true;
        Message.success('Xác nhận lịch khám thành công!');
      } else {
        confirmed.value = true; // Vẫn xác nhận thành công nhưng không lấy được detail
      }
    } else {
      errorMessage.value = confirmResponse.message || 'Có lỗi xảy ra khi xác nhận lịch khám.';
    }
  } catch (error) {
    console.error('Lỗi khi xác nhận lịch khám:', error);
    errorMessage.value = 'Có lỗi xảy ra khi xác nhận lịch khám.';
  } finally {
    loading.value = false;
  }
};

// Thử lại
const retry = () => {
  errorMessage.value = '';
  confirmAppointment();
};

// Về trang chủ
const goHome = () => {
  router.push('/');
};

// Xem danh sách lịch khám (nếu có)
const viewAppointments = () => {
  router.push('/appointments');
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Hook lifecycle
onMounted(() => {
  confirmAppointment();
});
</script>

<style scoped>
.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #2563eb;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.bg-primary {
  background-color: #2563eb;
}

.text-primary {
  color: #2563eb;
}

.bg-primary-hover {
  background-color: #1d4ed8;
}
</style> 