<template>
  <div class="clinic-cards-container" :class="{ 'loading': loading }">
    <div v-if="loading" class="flex justify-center items-center py-8">
      <div class="loader"></div>
    </div>
    <div v-else-if="error" class="text-center text-red-500 py-4">
      {{ error }}
    </div>
    <template v-else>
      <!-- Hiển thị HospitalCard cho những cơ sở y tế là bệnh viện (isHospital = true) -->
      <HospitalCard 
        v-for="clinic in hospitals" 
        :key="'hospital-'+clinic.clinicId" 
        :name="clinic.name" 
        :address="clinic.address"
        :bannerImage="getClinicImage(clinic)"
        :logoImage="getLogoImage(clinic)"
        :link="`/clinics/${clinic.slug}`"
        :weekdayHours="clinic.openTime ? clinic.openTime + ' - ' + clinic.closeTime : '7h30 - 16h30'"
        :weekendHours="clinic.openTime ? clinic.openTime + ' - ' + clinic.closeTime : '7h30 - 11h30'"
      />
      
      <!-- Hiển thị ClinicCard cho những cơ sở y tế là phòng khám (isHospital = false) -->
      <ClinicCard 
        v-for="clinic in regularClinics" 
        :key="'clinic-'+clinic.clinicId" 
        :name="clinic.name" 
        :address="clinic.address"
        :image="getClinicImage(clinic)"
        :link="`/clinics/${clinic.slug}`"
      />
      
      <div v-if="clinics.length === 0" class="text-center text-gray-500 py-4">
        Không có phòng khám nào
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import ClinicCard from './ClinicCard.vue';
import HospitalCard from './HospitalCard.vue';
import clinicApi from '../../../../api/clinicApi';
// Props
const props = defineProps({
  limit: {
    type: Number,
    default: 10
  },
  searchTerm: {
    type: String,
    default: ''
  },
  showOnlyHospitals: {
    type: Boolean,
    default: false
  },
  showOnlyClinics: {
    type: Boolean,
    default: false
  }
});

// State
const clinics = ref([]);
const loading = ref(true);
const error = ref('');

// Computed properties để phân loại bệnh viện và phòng khám
const hospitals = computed(() => {
  return clinics.value.filter(clinic => clinic.isHospital);
});

const regularClinics = computed(() => {
  return clinics.value.filter(clinic => !clinic.isHospital);
});

// Hàm lấy dữ liệu từ API
const fetchClinics = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    // Thiết lập các tham số phân trang
    const parameters = {
      pageNumber: 1,
      pageSize: props.limit,
      search: props.searchTerm || undefined
    };
    
    // Gọi API
    const response = await clinicApi.getClinics(parameters);
    
    if (response.data) {
      // Lọc kết quả nếu cần
      if (props.showOnlyHospitals) {
        clinics.value = response.data.filter(clinic => clinic.isHospital) || [];
      } else if (props.showOnlyClinics) {
        clinics.value = response.data.filter(clinic => !clinic.isHospital) || [];
      } else {
        clinics.value = response.data || [];
      }
    } else {
      error.value = response.message || 'Lỗi khi tải dữ liệu';
    }
  } catch (err) {
    console.error('Lỗi khi lấy dữ liệu phòng khám:', err);
    error.value = 'Lỗi khi tải dữ liệu';
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

// Hàm lấy hình ảnh phòng khám
const getLogoImage = (clinic) => {
  // Lấy hình ảnh từ thông tin chi tiết nếu có
  const imageUrl = clinic.logoImg ? "https://localhost:7038" + clinic.logoImg : null;
  if (imageUrl) return imageUrl;
  
  // Hình ảnh mặc định nếu không có
  return 'https://cdn.youmed.vn/photos/186f542e-45e0-416b-9050-b258bfd2317b.png?width=60';
};

// Hook lifecycle
onMounted(() => {
  fetchClinics();
});
</script>

<style scoped>
.clinic-cards-container {
  display: flex;
  flex-wrap: nowrap;
  gap: 1rem;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}

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
</style> 
