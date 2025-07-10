<template>
  <div class="doctor-list-page">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-6">Danh sách bác sĩ</h1>
      
      <!-- Clinic Filter Badge -->
      <div v-if="clinicFilter" class="mb-4">
        <div class="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Bác sĩ tại: {{ clinicFilter }}
          <button 
            @click="clearFilters" 
            class="ml-2 text-blue-600 hover:text-blue-800"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Search and Filters -->
      <div class="bg-white rounded-lg shadow-sm pb-6 mb-8">
        <div class="max-w-md ">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              v-model="searchTerm" 
              type="text"
              class="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors" 
              placeholder="Tìm kiếm theo tên bác sĩ hoặc chuyên khoa" 
              @keyup.enter="handleSearch"
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3">
              <button 
                @click="handleSearch"
                class="text-gray-500 hover:text-primary focus:outline-none transition-colors"
              >
                <span class="sr-only">Tìm kiếm</span>
                <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Doctor Grid -->
      <div v-if="loading" class="flex justify-center items-center py-16">
        <div class="loader"></div>
      </div>
      <div v-else-if="error" class="text-center text-red-500 py-8">
        {{ error }}
      </div>
      <div v-else>
        <div v-if="doctors.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div v-for="doctor in doctors" :key="doctor.doctorId" class="bg-white rounded-lg shadow-sm overflow-hidden transition-shadow hover:shadow-md">
            <router-link :to="`/doctors/${doctor.doctorInfos[0].slug}`" class="block">
              <div class="w-full h-48 overflow-hidden bg-gray-100 flex items-center justify-center">
                <img 
                  :src="getDoctorImage(doctor)" 
                  :alt="doctor.name"
                  class="w-32 h-32 rounded-full object-cover transition-transform hover:scale-105" 
                />
              </div>
            </router-link>
            <div class="p-4">
              <router-link :to="`/doctors/${doctor.doctorInfos[0].slug}`" class="block">
                <h3 class="text-lg font-semibold text-gray-800 hover:text-primary transition-colors">
                  {{ getTitle(doctor) }} {{ doctor.name }}
                </h3>
              </router-link>
              <div v-if="getDoctorSpecialties(doctor).length > 0" class="mt-2">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="specialty in getDoctorSpecialties(doctor).slice(0, 2)"
                    :key="specialty"
                    class="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                  >
                    {{ specialty }}
                  </span>
                  <span
                    v-if="getDoctorSpecialties(doctor).length > 2"
                    class="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                  >
                    +{{ getDoctorSpecialties(doctor).length - 2 }}
                  </span>
                </div>
              </div>
              <p class="mt-2 text-sm text-gray-600 line-clamp-2">
                {{ getDoctorHospital(doctor) }}
              </p>
              <div v-if="doctor.experience" class="mt-2 flex items-center text-sm text-gray-500">
                <svg
                  class="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span>{{ doctor.experience }} năm kinh nghiệm</span>
              </div>
              <router-link 
                :to="`/doctors/${doctor.doctorInfos[0].slug}`" 
                class="mt-3 inline-flex items-center text-primary text-sm font-medium hover:underline"
              >
                Xem chi tiết
                <svg class="ml-1 w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </router-link>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-16 bg-white rounded-lg shadow-sm">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <h3 class="mt-2 text-lg font-medium text-gray-900">Không tìm thấy bác sĩ nào</h3>
          <p class="mt-1 text-gray-500">Vui lòng thử tìm kiếm với từ khóa khác.</p>
          <div class="mt-6">
            <button 
              @click="clearFilters" 
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>
        
        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex justify-center items-center space-x-2 mt-8">
          <button 
            @click="changePage(currentPage - 1)" 
            :disabled="currentPage === 1"
            class="px-4 py-2 border rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            :class="currentPage === 1 ? 'text-gray-400 border-gray-200' : 'text-gray-700 border-gray-300 hover:bg-gray-50'"
          >
            &laquo; Trước
          </button>
          
          <div v-for="page in visiblePageNumbers" :key="page" class="pagination-item">
            <button 
              v-if="page !== '...'"
              @click="changePage(page)" 
              :class="page === currentPage ? 'bg-primary text-white border-primary' : 'text-gray-700 border-gray-300 hover:bg-gray-50'"
              class="px-4 py-2 border rounded-md text-sm font-medium transition-colors"
            >
              {{ page }}
            </button>
            <span v-else class="px-3 py-2 text-gray-500">...</span>
          </div>
          
          <button 
            @click="changePage(currentPage + 1)" 
            :disabled="currentPage === totalPages"
            class="px-4 py-2 border rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            :class="currentPage === totalPages ? 'text-gray-400 border-gray-200' : 'text-gray-700 border-gray-300 hover:bg-gray-50'"
          >
            Sau &raquo;
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import doctorApi from '../api/doctorApi';
import { getImage } from '../common/function';

const route = useRoute();
const router = useRouter();

// State
const doctors = ref([]);
const loading = ref(true);
const error = ref('');
const searchTerm = ref('');
const currentPage = ref(1);
const totalPages = ref(1);
const pageSize = ref(12);
const totalItems = ref(0);
const clinicFilter = ref('');
const clinicId = ref('');

// Lấy thông tin tìm kiếm và trang từ URL
onMounted(() => {
  const { search, page, clinic, clinicId: cId } = route.query;
  if (search) searchTerm.value = search.toString();
  if (page) currentPage.value = parseInt(page) || 1;
  if (clinic) clinicFilter.value = clinic.toString();
  if (cId) clinicId.value = cId.toString();
  
  fetchDoctors();
});

// Hàm lấy dữ liệu từ API
const fetchDoctors = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    // Thiết lập các tham số phân trang
    const parameters = {
      pageNumber: currentPage.value,
      pageSize: pageSize.value,
      search: searchTerm.value || undefined,
      clinicId: clinicId.value || undefined
    };
    
    // Gọi API
    const response = await doctorApi.getDoctors(parameters);
    
    if (response.data) {
      doctors.value = response.data || [];
      totalPages.value = response.totalPages || 1;
      totalItems.value = response.totalCount || 0;
      
      // Cập nhật URL với tham số tìm kiếm và trang
      updateUrlParams();
    } else {
      error.value = response.message || "Không thể tải danh sách bác sĩ";
    }
  } catch (err) {
    console.error('Lỗi khi lấy dữ liệu bác sĩ:', err);
    error.value = "Có lỗi xảy ra khi tải danh sách bác sĩ";
  } finally {
    loading.value = false;
  }
};

// Cập nhật URL với tham số tìm kiếm và trang
const updateUrlParams = () => {
  const query = { ...route.query };
  
  if (searchTerm.value) {
    query.search = searchTerm.value;
  } else {
    delete query.search;
  }
  
  if (currentPage.value > 1) {
    query.page = currentPage.value.toString();
  } else {
    delete query.page;
  }
  
  if (clinicFilter.value) {
    query.clinic = clinicFilter.value;
  } else {
    delete query.clinic;
  }
  
  if (clinicId.value) {
    query.clinicId = clinicId.value;
  } else {
    delete query.clinicId;
  }
  
  router.replace({ query });
};

// Xử lý tìm kiếm
const handleSearch = () => {
  currentPage.value = 1;
  updateUrlParams();
  fetchDoctors();
};

// Xóa tìm kiếm và bộ lọc
const clearFilters = () => {
  searchTerm.value = '';
  clinicFilter.value = '';
  clinicId.value = '';
  currentPage.value = 1;
  updateUrlParams();
  fetchDoctors();
};

// Thay đổi trang
const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  updateUrlParams();
  fetchDoctors();
  
  // Cuộn lên đầu trang
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Xử lý hiển thị số trang
const visiblePageNumbers = computed(() => {
  if (totalPages.value <= 7) {
    return Array.from({ length: totalPages.value }, (_, i) => i + 1);
  }
  
  const pages = [];
  const currentPageNumber = currentPage.value;
  
  // Luôn hiển thị trang đầu tiên
  pages.push(1);
  
  if (currentPageNumber > 3) {
    pages.push('...');
  }
  
  // Hiển thị các trang xung quanh trang hiện tại
  const start = Math.max(2, currentPageNumber - 1);
  const end = Math.min(totalPages.value - 1, currentPageNumber + 1);
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  if (currentPageNumber < totalPages.value - 2) {
    pages.push('...');
  }
  
  // Luôn hiển thị trang cuối cùng
  if (totalPages.value > 1) {
    pages.push(totalPages.value);
  }
  
  return pages;
});

// Các hàm xử lý dữ liệu hiển thị
const getTitle = (doctor) => {
  // Lấy chức danh của bác sĩ từ thông tin chi tiết nếu có
  const position = doctor.doctorInfos?.[0]?.positionName;
  if (position) return position;
  
  // Mặc định là BS.
  return 'BS.';
};

const getDoctorImage = (doctor) => {
  // Lấy hình ảnh từ thông tin chi tiết nếu có
  return getImage(doctor.doctorInfos?.[0]?.imageUrl);
};

const getDoctorSpecialties = (doctor) => {
  // Sử dụng dữ liệu specialties thực từ API
  if (doctor.specialties && doctor.specialties.length > 0) {
    return doctor.specialties.map((specialty) => specialty.name);
  }

  // Fallback: Sử dụng positionName nếu không có specialties
  const specialties = [];
  if (doctor.doctorInfos && doctor.doctorInfos.length > 0) {
    doctor.doctorInfos.forEach((info) => {
      if (info.positionName && !specialties.includes(info.positionName)) {
        specialties.push(info.positionName);
      }
    });
  }

  // Nếu không có thông tin, trả về mảng rỗng
  return specialties.length > 0 ? specialties : ['Đa khoa'];
};

const getDoctorHospital = (doctor) => {
  // Sử dụng dữ liệu clinics thực từ API
  if (doctor.clinics && doctor.clinics.length > 0) {
    return doctor.clinics[0].name;
  }

  // Fallback: Lấy tên bệnh viện/phòng khám từ thông tin chi tiết
  return doctor.doctorInfos?.[0]?.clinicName || '';
};
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

.border-primary {
  border-color: #2563eb;
}

.focus\:ring-primary:focus {
  --tw-ring-color: #2563eb;
}

.focus\:border-primary:focus {
  border-color: #2563eb;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 

