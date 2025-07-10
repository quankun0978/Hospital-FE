<template>
  <div class="clinic-list-page">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-6">Cơ sở y tế</h1>

      <!-- Filter tabs -->
      <div class="mb-6 border-b border-gray-200">
        <ul class="flex flex-wrap -mb-px text-sm font-medium text-center">
          <li class="mr-2">
            <a
              @click.prevent="setFilter('all')"
              class="inline-block p-4 cursor-pointer"
              :class="
                filter === 'all'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700'
              "
            >
              Tất cả
            </a>
          </li>
          <li class="mr-2">
            <a
              @click.prevent="setFilter('hospital')"
              class="inline-block p-4 cursor-pointer"
              :class="
                filter === 'hospital'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700'
              "
            >
              Bệnh viện
            </a>
          </li>
          <li class="mr-2">
            <a
              @click.prevent="setFilter('clinic')"
              class="inline-block p-4 cursor-pointer"
              :class="
                filter === 'clinic'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700'
              "
            >
              Phòng khám
            </a>
          </li>
        </ul>
      </div>

      <!-- Search and Filters -->
      <div class="bg-white rounded-lg shadow-sm pb-6 mb-8">
        <div class="max-w-md ">
          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <svg
                class="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              v-model="searchTerm"
              type="text"
              class="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              placeholder="Tìm kiếm theo tên hoặc địa chỉ"
              @keyup.enter="handleSearch"
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3">
              <button
                @click="handleSearch"
                class="text-gray-500 hover:text-primary focus:outline-none transition-colors"
              >
                <span class="sr-only">Tìm kiếm</span>
                <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Clinic Grid -->
      <div v-if="loading" class="flex justify-center items-center py-16">
        <div class="loader"></div>
      </div>
      <div v-else-if="error" class="text-center text-red-500 py-8">
        {{ error }}
      </div>
      <div v-else>
        <div
          v-if="filteredClinics.length > 0"
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          <div
            v-for="clinic in filteredClinics"
            :key="clinic.clinicId"
            class="bg-white rounded-lg shadow-sm overflow-hidden transition-shadow hover:shadow-md"
          >
            <router-link :to="`/clinics/${clinic.slug}`" class="block">
              <div class="w-full h-48 overflow-hidden">
                <img
                  :src="getClinicImage(clinic)"
                  :alt="clinic.name"
                  class="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
            </router-link>
            <div class="p-4">
              <router-link :to="`/clinics/${clinic.slug}`" class="block">
                <h3
                  class="text-lg font-semibold text-gray-800 hover:text-primary transition-colors"
                >
                  {{ clinic.name }}
                </h3>
              </router-link>
              <p
                v-if="clinic.isHospital"
                class="mt-1 text-xs text-primary font-medium"
              >
                Bệnh viện
              </p>
              <p v-else class="mt-1 text-xs text-blue-500 font-medium">
                Phòng khám
              </p>
              <p class="mt-1 text-sm text-gray-600 line-clamp-2">
                {{ clinic.address }}
              </p>
              <div class="mt-2 flex items-center text-sm text-gray-500">
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
                <span
                  >{{ clinic.openTime || "08:00" }} -
                  {{ clinic.closeTime || "17:00" }}</span
                >
              </div>
              <router-link
                :to="`/clinics/${clinic.slug}`"
                class="mt-3 inline-flex items-center text-primary text-sm font-medium hover:underline"
              >
                Xem chi tiết
                <svg
                  class="ml-1 w-4 h-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </router-link>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-16 bg-white rounded-lg shadow-sm">
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
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <h3 class="mt-2 text-lg font-medium text-gray-900">
            Không tìm thấy kết quả nào
          </h3>
          <p class="mt-1 text-gray-500">
            Vui lòng thử tìm kiếm với từ khóa khác hoặc chọn bộ lọc khác.
          </p>
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
        <div
          v-if="totalPages > 1"
          class="flex justify-center items-center space-x-2 mt-8"
        >
          <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-4 py-2 border rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            :class="
              currentPage === 1
                ? 'text-gray-400 border-gray-200'
                : 'text-gray-700 border-gray-300 hover:bg-gray-50'
            "
          >
            &laquo; Trước
          </button>

          <div
            v-for="page in visiblePageNumbers"
            :key="page"
            class="pagination-item"
          >
            <button
              v-if="page !== '...'"
              @click="changePage(page)"
              :class="
                page === currentPage
                  ? 'bg-primary text-white border-primary'
                  : 'text-gray-700 border-gray-300 hover:bg-gray-50'
              "
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
            :class="
              currentPage === totalPages
                ? 'text-gray-400 border-gray-200'
                : 'text-gray-700 border-gray-300 hover:bg-gray-50'
            "
          >
            Sau &raquo;
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import clinicApi from "../api/clinicApi";
import { getImage } from "../common/function";
const route = useRoute();
const router = useRouter();

// Props
const props = defineProps({
  defaultFilter: {
    type: String,
    default: "all", // 'all', 'hospital', hoặc 'clinic'
  },
});

// State
const clinics = ref([]);
const loading = ref(true);
const error = ref("");
const searchTerm = ref("");
const currentPage = ref(1);
const totalPages = ref(1);
const pageSize = ref(12);
const totalItems = ref(0);
const filter = ref(props.defaultFilter); // Sử dụng prop defaultFilter làm giá trị mặc định

// Lọc phòng khám theo loại (bệnh viện hoặc phòng khám)
const filteredClinics = computed(() => {
  let filtered = clinics.value;
  
  // Filter theo type
  if (filter.value === "hospital") {
    filtered = filtered.filter((clinic) => clinic.isHospital);
  } else if (filter.value === "clinic") {
    filtered = filtered.filter((clinic) => !clinic.isHospital);
  }
  
  // Filter theo search term (client-side filtering for better UX)
  if (searchTerm.value) {
    const searchLower = searchTerm.value.toLowerCase();
    filtered = filtered.filter((clinic) => 
      clinic.name.toLowerCase().includes(searchLower) ||
      (clinic.address && clinic.address.toLowerCase().includes(searchLower))
    );
  }
  
  return filtered;
});

// Lấy thông tin tìm kiếm và trang từ URL
onMounted(() => {
  const { search, page, type } = route.query;
  if (search) searchTerm.value = search.toString();
  if (page) currentPage.value = parseInt(page) || 1;
  
  // Sử dụng type từ query hoặc defaultFilter từ props
  if (type && ["all", "hospital", "clinic"].includes(type.toString())) {
    filter.value = type.toString();
  } else if (props.defaultFilter) {
    filter.value = props.defaultFilter;
  }

  fetchClinics();
});

// Hàm lấy dữ liệu từ API
const fetchClinics = async () => {
  loading.value = true;
  error.value = "";

  try {
    // Thiết lập các tham số phân trang
    const parameters = {
      pageNumber: currentPage.value,
      pageSize: pageSize.value,
      search: searchTerm.value || undefined,
    };

    // Gọi API
    const response = await clinicApi.getClinics(parameters);

    if (response.data) {
      clinics.value = response.data || [];
      totalPages.value = response.totalPages || 1;
      totalItems.value = response.totalCount || 0;

      // Cập nhật URL với tham số tìm kiếm và trang
      updateUrlParams();
    } else {
      error.value = response.message || "Không thể tải danh sách phòng khám";
    }
  } catch (err) {
    console.error("Lỗi khi lấy dữ liệu phòng khám:", err);
    error.value = "Có lỗi xảy ra khi tải danh sách phòng khám";
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

  if (filter.value !== "all") {
    query.type = filter.value;
  } else {
    delete query.type;
  }

  router.replace({ query });
};

// Thiết lập bộ lọc
const setFilter = (filterType) => {
  filter.value = filterType;
  currentPage.value = 1;
  updateUrlParams();
};

// Xử lý tìm kiếm
const handleSearch = () => {
  currentPage.value = 1;
  updateUrlParams();
  fetchClinics();
};

// Xóa tìm kiếm và bộ lọc
const clearFilters = () => {
  searchTerm.value = "";
  filter.value = "all";
  currentPage.value = 1;
  updateUrlParams();
  fetchClinics();
};

// Thay đổi trang
const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  updateUrlParams();
  fetchClinics();

  // Cuộn lên đầu trang
  window.scrollTo({ top: 0, behavior: "smooth" });
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
    pages.push("...");
  }

  // Hiển thị các trang xung quanh trang hiện tại
  const start = Math.max(2, currentPageNumber - 1);
  const end = Math.min(totalPages.value - 1, currentPageNumber + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (currentPageNumber < totalPages.value - 2) {
    pages.push("...");
  }

  // Luôn hiển thị trang cuối cùng
  if (totalPages.value > 1) {
    pages.push(totalPages.value);
  }

  return pages;
});

// Hàm lấy hình ảnh phòng khám
const getClinicImage = (clinic) => {
  // Hình ảnh mặc định nếu không có
  return getImage(clinic.imageUrl);
};
// Theo dõi thay đổi của bộ lọc
watch(filter, () => {
  currentPage.value = 1;
  updateUrlParams();
  fetchClinics();
});

// Theo dõi thay đổi route để cập nhật filter khi cần
watch(() => route.query, (newQuery) => {
  const { search, page, type } = newQuery;
  
  // Cập nhật searchTerm nếu thay đổi
  if (search !== searchTerm.value) {
    searchTerm.value = search ? search.toString() : "";
  }
  
  // Cập nhật currentPage nếu thay đổi
  const newPage = page ? parseInt(page) || 1 : 1;
  if (newPage !== currentPage.value) {
    currentPage.value = newPage;
  }
  
  // Cập nhật filter nếu thay đổi
  const newType = type && ["all", "hospital", "clinic"].includes(type.toString()) 
    ? type.toString() 
    : props.defaultFilter || "all";
  if (newType !== filter.value) {
    filter.value = newType;
  }
}, { immediate: false });
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
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
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
</style>
