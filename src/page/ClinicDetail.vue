<template>
  <div class="clinic-detail-page">
    <div class="container mx-auto px-4 py-8">
      <div v-if="loading" class="flex justify-center items-center py-16">
        <div class="loader"></div>
      </div>
      <div v-else-if="error" class="text-center text-red-500 py-8">
        {{ error }}
      </div>
      <template v-else-if="clinic">
        <!-- Breadcrumb -->
        <div class="flex text-sm mb-6 text-gray-500">
          <router-link to="/" class="hover:text-primary">{{ t('common.home') }}</router-link>
          <span class="mx-2">/</span>
          <router-link to="/clinics" class="hover:text-primary">
            {{ clinic.isHospital ? 'Bệnh viện' : 'Phòng khám' }}
          </router-link>
          <span class="mx-2">/</span>
          <span class="text-gray-800">{{ clinic.name }}</span>
        </div>

        <!-- Clinic Profile Section -->
        <div class="bg-white rounded-lg shadow-sm p-6 mb-8 flex flex-col md:flex-row gap-8">
          <!-- Clinic Image -->
          <div class="w-full md:w-1/3 lg:w-1/4">
            <div class="rounded-lg overflow-hidden w-full aspect-square">
              <img 
                :src="getClinicImage(clinic)" 
                :alt="clinic.name"
                class="w-full h-full object-cover" 
              />
            </div>
          </div>
          
          <!-- Clinic Info -->
          <div class="w-full md:w-2/3 lg:w-3/4">
            <div class="flex items-center mb-2">
              <h1 class="text-2xl md:text-3xl font-bold text-gray-800">
                {{ clinic.name }}
              </h1>
              <span v-if="clinic.isHospital" class="ml-4 px-2 py-1 bg-primary bg-opacity-10 text-primary text-xs font-semibold rounded">
                Bệnh viện
              </span>
              <span v-else class="ml-4 px-2 py-1 bg-blue-500 bg-opacity-10 text-blue-500 text-xs font-semibold rounded">
                Phòng khám
              </span>
            </div>
            
            <div class="text-gray-600 space-y-3 mt-4">
              <p v-if="clinic.address" class="flex items-start">
                <span class="flex-shrink-0 mr-2">
                  <svg class="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                  </svg>
                </span>
                <span>{{ clinic.address }}</span>
              </p>
              
              <p v-if="clinic.phone" class="flex items-start">
                <span class="flex-shrink-0 mr-2">
                  <svg class="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                  </svg>
                </span>
                <span>{{ clinic.phone }}</span>
              </p>
              
              <p v-if="clinic.email" class="flex items-start">
                <span class="flex-shrink-0 mr-2">
                  <svg class="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                  </svg>
                </span>
                <span>{{ clinic.email }}</span>
              </p>
              
              <p v-if="clinic.openTime && clinic.closeTime" class="flex items-start">
                <span class="flex-shrink-0 mr-2">
                  <svg class="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
                  </svg>
                </span>
                <span>Thời gian làm việc: {{ clinic.openTime }} - {{ clinic.closeTime }}</span>
              </p>
            </div>
            
            <div v-if="clinic.description" class="mt-6 pt-6 border-t">
              <h2 class="text-xl font-semibold mb-4">Giới thiệu</h2>
              <div class="text-gray-700">
                {{ clinic.description }}
              </div>
            </div>
            
            <div class="mt-6 pt-6 border-t">
              <button 
                @click="bookAppointment()" 
                class="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
              >
                Đặt lịch khám
              </button>
            </div>
          </div>
        </div>
        
        <!-- Map Section (nếu có tọa độ) -->
        <div v-if="clinic.latitude && clinic.longitude" class="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 class="text-xl font-semibold mb-4">Bản đồ</h2>
          <div class="h-80 bg-gray-200 rounded-lg">
            <!-- Có thể tích hợp Google Maps hoặc bản đồ khác ở đây -->
            <div class="flex items-center justify-center h-full text-gray-500">
              Bản đồ sẽ được hiển thị tại đây.
            </div>
          </div>
        </div>
        
        <!-- Similar Clinics Section -->
        <div class="mt-12">
          <h2 class="text-2xl font-bold text-gray-800 mb-6">
            {{ clinic.isHospital ? 'Bệnh viện khác' : 'Phòng khám khác' }}
          </h2>
          <div class="flex overflow-x-auto gap-4 pb-4">
            <ClinicCardsContainer 
              :limit="4" 
              :showOnlyHospitals="clinic.isHospital"
              :showOnlyClinics="!clinic.isHospital"
            />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from '@/i18n/useI18n';
import ClinicCardsContainer from '@/components/Layout/Section/Booking/ClinicCardsContainer.vue';
import clinicApi from '../api/clinicApi';
const { t } = useI18n();
const route = useRoute();
const router = useRouter();

// State
const clinic = ref(null);
const loading = ref(true);
const error = ref('');

// Hàm lấy dữ liệu từ API
const fetchClinicDetails = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    const clinicId = route.params.id;
    if (!clinicId) {
      error.value = 'Không tìm thấy thông tin phòng khám';
      loading.value = false;
      return;
    }
    
    // Gọi API
    const response = await clinicApi.getById(clinicId);
    
    if (response.success && response.data) {
      clinic.value = response.data;
    } else {
      error.value = response.message || 'Không thể tải thông tin cơ sở y tế';
    }
  } catch (err) {
    console.error('Lỗi khi lấy thông tin cơ sở y tế:', err);
    error.value = 'Đã xảy ra lỗi khi tải thông tin cơ sở y tế';
  } finally {
    loading.value = false;
  }
};

// Hàm lấy hình ảnh phòng khám
const getClinicImage = (clinic) => {
  // Lấy hình ảnh từ thông tin chi tiết nếu có
  const imageUrl = clinic.imageUrl ? "https://localhost:7038" + clinic.imageUrl : null;
  if (imageUrl) return imageUrl;
  
  // Hình ảnh mặc định nếu không có
  return 'https://cdn.youmed.vn/photos/186f542e-45e0-416b-9050-b258bfd2317b.png?width=60';
};

// Hàm đặt lịch khám
const bookAppointment = () => {
  // Chuyển hướng đến trang đặt lịch khám với thông tin phòng khám
  router.push({
    path: '/book-appointment',
    query: { 
      clinicId: clinic.value.clinicId
    }
  });
};

// Hook lifecycle
onMounted(() => {
  fetchClinicDetails();
});
</script>

<style scoped>
.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.text-primary {
  color: #2563eb;
}

.bg-primary {
  background-color: #2563eb;
}

.hover\:bg-primary-dark:hover {
  background-color: #1d4ed8;
}
</style> 