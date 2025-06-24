<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header tìm kiếm -->
    <section class="bg-white sticky top-0 md:top-14 z-[90] border-b">
      <div class="max-w-4xl mx-auto pt-4 px-4">
        <form 
          @submit.prevent="handleSearch" 
          class="relative"
        >
          <input
            v-model="searchQuery"
            type="search"
            :placeholder="t('pages.searchResult.placeholder')"
            class="w-full pl-6 pr-10 py-3 border-0 rounded-full bg-gray-100 focus:bg-white ring-inset focus:ring-2 ring-primary"
          />
          <button
            type="submit"
            aria-label="search"
            class="right-4 absolute bottom-[12px]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 512 512"
              class="text-primary"
            >
              <path
                d="M221.09 64a157.09 157.09 0 10157.09 157.09A157.1 157.1 0 00221.09 64z"
                fill="none"
                stroke="currentColor"
                stroke-miterlimit="10"
                stroke-width="32"
              />
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-miterlimit="10"
                stroke-width="32"
                d="M338.29 338.29L448 448"
              />
            </svg>
          </button>
        </form>

        <!-- AI Search Tip -->
        <div class="flex gap-2 pt-2 text-sm min-h-[20px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 512 512"
            class="flex-none text-gray-500 text-purple-600"
          >
            <path
              fill="currentColor"
              d="M208 512a24.84 24.84 0 01-23.34-16l-39.84-103.6a16.06 16.06 0 00-9.19-9.19L32 343.34a25 25 0 010-46.68l103.6-39.84a16.06 16.06 0 009.19-9.19L184.66 144a25 25 0 0146.68 0l39.84 103.6a16.06 16.06 0 009.19 9.19l103 39.63a25.49 25.49 0 0116.63 24.1 24.82 24.82 0 01-16 22.82l-103.6 39.84a16.06 16.06 0 00-9.19 9.19L231.34 496A24.84 24.84 0 01208 512z"
            />
          </svg>
          <div class="min-h-[20px] w-full">
            <p>{{ t('pages.searchResult.aiTip') }}</p>
          </div>
        </div>

        <!-- Bộ lọc -->
        <div class="flex whitespace-nowrap gap-2   py-2">
          <!-- Sort dropdown -->
          <div class="relative">
            <button
              @click="toggleSortFilter"
              class="flex h-9 justify-center px-3 text-sm items-center gap-1 border rounded-full bg-gray-100 border-gray-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 512 512" class="text-gray-400">
                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M112 244l144-144 144 144M256 120v292"/>
              </svg>
              {{ getSortLabel(sortBy, sortOrder) }}
            </button>
            
            <!-- Sort dropdown menu -->
            <div v-if="showSortFilter" class="absolute z-10 mt-1 w-48 bg-white border rounded-md shadow-lg">
              <div 
                v-for="option in sortOptions" 
                :key="option.value"
                @click="selectSortOption(option.value, option.order)"
                class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                :class="{ 'bg-blue-50 text-blue-600': sortBy === option.value && sortOrder === option.order }"
              >
                {{ option.label }}
              </div>
            </div>
          </div>

          <!-- Filters -->
          <div class="relative">
            <button
              @click="toggleAdvancedFilters"
              class="flex h-9 justify-center px-3 text-sm items-center gap-1 border rounded-full"
              :class="hasActiveFilters ? 'bg-primary text-white border-primary' : 'bg-gray-100 border-gray-50'"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 512 512" class="text-current">
                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M368 128h80M64 128h240M368 384h80M64 384h240M208 256h240M64 256h80"/>
                <circle cx="336" cy="128" r="32" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/>
                <circle cx="176" cy="256" r="32" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/>
                <circle cx="336" cy="384" r="32" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/>
              </svg>
              {{ t('pages.searchResult.filters') }}
              <span v-if="activeFiltersCount > 0" class="bg-red-500 text-white text-xs rounded-full px-1 min-w-[16px] h-4 flex items-center justify-center">
                {{ activeFiltersCount }}
              </span>
            </button>
          </div>

          <!-- Nơi khám -->
          <div class="relative">
            <button
              @click="toggleLocationFilter"
              class="flex h-9 justify-center px-3 text-sm items-center gap-1 border rounded-full bg-gray-100 border-gray-50"
            >
              <span class="hidden sm:block">{{ t('pages.searchResult.location') }}:</span>
              {{ selectedLocation || t('pages.searchResult.all') }}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 512 512"
                class="text-gray-400"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="48"
                  d="M112 184l144 144 144-144"
                />
              </svg>
            </button>
            
            <!-- Location dropdown menu -->
            <div v-if="showLocationFilter" class="absolute z-10 mt-1 w-48 bg-white border rounded-md shadow-lg">
              <div 
                @click="selectLocation('')"
                class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                :class="{ 'bg-blue-50 text-blue-600': !selectedLocation }"
              >
                {{ t('pages.searchResult.all') }}
              </div>
              <div 
                v-for="location in locationOptions" 
                :key="location"
                @click="selectLocation(location)"
                class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                :class="{ 'bg-blue-50 text-blue-600': selectedLocation === location }"
              >
                {{ location }}
              </div>
            </div>
          </div>

          <!-- Chuyên khoa -->
          <div class="relative">
            <button
              @click="toggleSpecialtyFilter"
              class="flex justify-center pl-2 pr-3 py-1 text-sm items-center gap-1 bg-gray-100 rounded-full border-gray-50 h-9"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                class="w-4 h-4"
              >
                <path
                  d="M432 96h-48V80a48.05 48.05 0 00-48-48H176a48.05 48.05 0 00-48 48v16H80a64.07 64.07 0 00-64 64v256a64 64 0 0064 64h352a64 64 0 0064-64V160a64.07 64.07 0 00-64-64z"
                />
              </svg>
              {{ selectedSpecialty || t('pages.searchResult.selectSpecialty') }}
            </button>
            
            <!-- Specialty dropdown menu -->
            <div v-if="showSpecialtyFilter" class="absolute z-10 mt-1 w-56 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
              <div 
                @click="selectSpecialty('')"
                class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                :class="{ 'bg-blue-50 text-blue-600': !selectedSpecialty }"
              >
                {{ t('pages.searchResult.all') }}
              </div>
              <div 
                v-for="specialty in specialtyOptions" 
                :key="specialty"
                @click="selectSpecialty(specialty)"
                class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                :class="{ 'bg-blue-50 text-blue-600': selectedSpecialty === specialty }"
                             >
                 {{ specialty }}
               </div>
             </div>
           </div>

          <!-- Loại -->
          <div class="relative">
            <button
              @click="toggleTypeFilter"
              class="flex h-9 justify-center px-3 text-sm items-center gap-1 border rounded-full bg-gray-100 border-gray-50"
            >
              {{ getTypeLabel(selectedType) }}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 512 512"
                class="text-gray-400"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="48"
                  d="M112 184l144 144 144-144"
                />
              </svg>
            </button>
            
            <!-- Type dropdown menu -->
            <div v-if="showTypeFilter" class="absolute z-10 mt-1 w-48 bg-white border rounded-md shadow-lg">
              <div 
                @click="selectType('all')"
                class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                :class="{ 'bg-blue-50 text-blue-600': selectedType === 'all' }"
              >
                {{ t('pages.searchResult.all') }}
              </div>
              <div 
                @click="selectType('doctor')"
                class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                :class="{ 'bg-blue-50 text-blue-600': selectedType === 'doctor' }"
              >
                {{ t('pages.searchResult.doctors') }}
              </div>
              <div 
                @click="selectType('clinic')"
                class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                :class="{ 'bg-blue-50 text-blue-600': selectedType === 'clinic' }"
              >
                {{ t('pages.searchResult.clinics') }}
              </div>
              <div 
                @click="selectType('hospital')"
                class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                :class="{ 'bg-blue-50 text-blue-600': selectedType === 'hospital' }"
              >
                {{ t('pages.searchResult.hospitals') }}
              </div>
            </div>
          </div>
        </div>

        <!-- Advanced Filters Panel -->
        <div v-if="showAdvancedFilters" class="mt-2 p-4 bg-gray-50 rounded-lg border">
                      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- Rating filter -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('pages.searchResult.minRating') }}</label>
                <select v-model="filters.minRating" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="0">{{ t('pages.searchResult.any') }}</option>
                <option value="3">3+ ⭐</option>
                <option value="4">4+ ⭐</option>
                <option value="4.5">4.5+ ⭐</option>
              </select>
            </div>

                          <!-- Price range -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('pages.searchResult.priceRange') }}</label>
              <div class="flex gap-2">
                <input 
                  v-model="filters.minPrice" 
                  type="number" 
                  placeholder="Min"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <input 
                  v-model="filters.maxPrice" 
                  type="number" 
                  placeholder="Max"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <!-- Online consultation -->
            <div>
              <label class="flex items-center space-x-2">
                <input 
                  v-model="filters.onlineOnly" 
                  type="checkbox"
                  class="rounded border-gray-300 text-primary focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                />
                <span class="text-sm font-medium text-gray-700">{{ t('pages.searchResult.onlineConsultationOnly') }}</span>
              </label>
            </div>
          </div>

          <div class="mt-4 flex gap-2">
            <button 
              @click="applyFilters"
              class="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600"
            >
              {{ t('pages.searchResult.applyFilters') }}
            </button>
            <button 
              @click="clearFilters"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              {{ t('pages.searchResult.clearFilters') }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Kết quả tìm kiếm -->
    <section class="bg-gray-50 pb-10 md:pt-2">
      <div class="max-w-4xl mx-auto bg-white overflow-hidden md:border md:rounded-md border-slate-200">
        <!-- Header kết quả -->
        <div class="p-4 border-b" v-if="searchResults">
          <h1 class="text-sm text-gray-700 font-normal">
            {{ t('pages.searchResult.foundResults', { count: searchResults.totalResults }) }}
          </h1>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="p-8 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p class="mt-4 text-gray-600">{{ t('pages.searchResult.loading') }}</p>
        </div>

        <!-- Danh sách kết quả -->
        <div v-else-if="searchResults && searchResults.results.length > 0" class="bg-slate-100 divide-y">
          <div
            v-for="result in searchResults.results"
            :key="`${result.type}-${result.id}`"
            class="relative flex-1 bg-white p-4 lg:p-6 flex flex-col lg:flex-row gap-4 group"
          >
            <!-- Link chính -->
            <router-link
              :to="getResultLink(result)"
              class="flex flex-row flex-1 gap-4 hover:text-gray-800"
            >
              <!-- Hình ảnh -->
              <div class="flex-none relative aspect-square w-28 h-28 sm:w-32 sm:h-32 overflow-hidden border border-slate-100 mx-auto"
                   :class="result.type === 'doctor' ? 'rounded-full bg-slate-100' : 'rounded-xl'">
                <img
                  :src="getImage(result.image) || getDefaultImage(result.type)"
                  :alt="result.name"
                  class="absolute inset-0 object-contain w-full h-full"
                  loading="lazy"
                />
              </div>

              <!-- Thông tin -->
              <div class="flex-1 overflow-hidden">
                <!-- Tên và chức danh -->
                <div class="flex items-center flex-wrap gap-2">
                  <h2 class="md:text-lg font-semibold group-hover:underline">
                    <span class="pr-1" v-if="result.title">{{ result.title}}</span>
                    <span v-html="getHighlightedText(result.name, result.highlights)"></span>
                  </h2>
                </div>

                <!-- Chuyên khoa -->
                <ul v-if="result.specialties && result.specialties.length > 0" 
                    class="flex gap-2 my-2 overflow-y-auto hide-scroll-bar">
                  <li
                    v-for="specialty in result.specialties"
                    :key="specialty"
                    class="font-medium text-sm bg-gray-100 rounded-full px-3 py-1 whitespace-nowrap"
                  >
                    <span v-html="getHighlightedText(specialty, result.highlights)"></span>
                  </li>
                </ul>

                <!-- Địa chỉ -->
                <div v-if="result.address" class="flex gap-2 items-start">
                  <p class="text-sm line-clamp-2" :title="result.address">
                    <span v-html="getHighlightedText(result.address, result.highlights)"></span>
                  </p>
                </div>

                <!-- Rating -->
                <div v-if="result.rating > 0" class="flex gap-1 items-center mt-2">
                  <div class="flex">
                    <svg
                      v-for="i in 5"
                      :key="i"
                      class="w-4 h-4"
                      :class="i <= result.rating ? 'text-yellow-400' : 'text-gray-300'"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  </div>
                  <span class="text-sm text-gray-600">
                    ({{ result.reviewCount }} {{ t('pages.searchResult.reviews') }})
                  </span>
                </div>
              </div>
            </router-link>

            <!-- Nút đặt khám -->
            <div class="flex justify-center z-50 lg:flex-col gap-2">
              <button
                v-if="result.type === 'doctor' && result.isOnline"
                @click.stop="bookOnlineAppointment(result)"
                class="w-36 bg-green-500 text-center hover:bg-green-600 hover:text-white px-5 py-2.5 text-sm leading-5 rounded-md font-semibold text-white lg:flex-initial truncate ml-auto"
              >
                {{ t('pages.searchResult.bookOnlineConsultation') }}
              </button>
              <button
                @click.stop="bookAppointment(result)"
                class="w-36 bg-primary text-center hover:bg-blue-600 hover:text-white px-5 py-2.5 text-sm leading-5 rounded-md font-semibold text-white lg:flex-initial truncate ml-auto"
              >
                {{ t('pages.searchResult.bookAppointment') }}
              </button>
            </div>
          </div>
        </div>

        <!-- Không có kết quả -->
        <div v-else-if="!loading" class="p-8 text-center">
          <div class="text-gray-400 mb-4">
            <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ t('pages.searchResult.noResults') }}</h3>
          <p class="text-gray-600">{{ t('pages.searchResult.noResultsDesc') }}</p>
        </div>

        <!-- Phân trang -->
        <div v-if="searchResults && searchResults.totalPages > 1" class="p-4">
          <Pagination
            :current-page="currentPage"
            :total-pages="searchResults.totalPages"
            :total-results="searchResults.totalResults"
            @page-change="handlePageChange"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from '@/i18n/useI18n';
import { searchService } from '@/services/searchService';
import Pagination from '@/components/common/Pagination/Pagination.vue';
import { getImage } from '@/common/function';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

// Reactive data
const searchQuery = ref('');
const selectedType = ref('all');
const selectedSpecialty = ref('');
const selectedLocation = ref('');
const currentPage = ref(1);
const searchResults = ref(null);
const loading = ref(false);
const sortBy = ref('relevance');
const sortOrder = ref('desc');
const showSortFilter = ref(false);
const showAdvancedFilters = ref(false);
const filters = ref({
  minRating: 0,
  minPrice: 0,
  maxPrice: 0,
  onlineOnly: false
});

// Computed
const pageSize = 12;

const sortOptions = computed(() => [
  { value: 'relevance', order: 'desc', label: t('pages.searchResult.sortByRelevance') },
  { value: 'rating', order: 'desc', label: t('pages.searchResult.sortByRatingHigh') },
  { value: 'rating', order: 'asc', label: t('pages.searchResult.sortByRatingLow') },
  { value: 'price', order: 'asc', label: t('pages.searchResult.sortByPriceLow') },
  { value: 'price', order: 'desc', label: t('pages.searchResult.sortByPriceHigh') },
  { value: 'reviewCount', order: 'desc', label: t('pages.searchResult.sortByReviews') },
  { value: 'distance', order: 'asc', label: t('pages.searchResult.sortByDistance') }
]);

const hasActiveFilters = computed(() => {
  return filters.value.minRating > 0 || 
         filters.value.minPrice > 0 || 
         filters.value.maxPrice > 0 || 
         filters.value.onlineOnly;
});

const activeFiltersCount = computed(() => {
  let count = 0;
  if (filters.value.minRating > 0) count++;
  if (filters.value.minPrice > 0) count++;
  if (filters.value.maxPrice > 0) count++;
  if (filters.value.onlineOnly) count++;
  return count;
});

const getSortLabel = (sortBy, sortOrder) => {
  const option = sortOptions.value.find(opt => opt.value === sortBy && opt.order === sortOrder);
  return option ? option.label : t('pages.searchResult.sortByRelevance');
};

const getHighlightedText = (text, highlights) => {
  if (!highlights || Object.keys(highlights).length === 0) {
    return text;
  }
  
  let highlightedText = text;
  Object.values(highlights).forEach(matches => {
    matches.forEach(match => {
      const regex = new RegExp(`(${match})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
    });
  });
  
  return highlightedText;
};

// Methods
const handleSearch = async () => {
  loading.value = true;
  currentPage.value = 1;
  
  await updateURL();
  await performSearch();
};

const performSearch = async () => {
  try {
    loading.value = true;
    
    const params = {
      q: searchQuery.value,
      page: currentPage.value,
      pageSize: pageSize,
      type: selectedType.value,
      specialty: selectedSpecialty.value,
      location: selectedLocation.value,
      sortBy: sortBy.value,
      sortOrder: sortOrder.value,
      minRating: filters.value.minRating,
      minPrice: filters.value.minPrice,
      maxPrice: filters.value.maxPrice,
      onlineOnly: filters.value.onlineOnly
    };
    
    console.log('Tham số tìm kiếm:', params);
    
    // Sử dụng MeiliSearch nếu có dữ liệu đã được index, fallback về globalSearch
    let response;
    try {
      response = await searchService.meiliSearch(params);
      console.log('Kết quả MeiliSearch:', response);
      // Nếu MeiliSearch trả về kết quả trống và đây là lần đầu tìm kiếm
      if (response.totalResults === 0 && currentPage.value === 1) {
        console.log('MeiliSearch không có kết quả, fallback về globalSearch');
        response = await searchService.globalSearch(params);
        console.log('Kết quả globalSearch:', response);
      }
    } catch (meiliError) {
      console.log('MeiliSearch lỗi, fallback về globalSearch:', meiliError);
      response = await searchService.globalSearch(params);
      console.log('Kết quả globalSearch sau lỗi:', response);
    }
    
    searchResults.value = response;
  } catch (error) {
    console.error('Lỗi tìm kiếm:', error);
    // Có thể thêm thông báo lỗi cho người dùng
  } finally {
    loading.value = false;
  }
};

const handlePageChange = (page) => {
  currentPage.value = page;
  updateURL();
  performSearch();
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const updateURL = () => {
  const query = {
    q: searchQuery.value,
    page: currentPage.value,
    type: selectedType.value,
    sortBy: sortBy.value,
    sortOrder: sortOrder.value
  };
  
  if (selectedSpecialty.value) query.specialty = selectedSpecialty.value;
  if (selectedLocation.value) query.location = selectedLocation.value;
  
  router.replace({ name: 'search', query });
};

const getResultLink = (result) => {
  if (result.type === 'doctor') {
    return { name: 'doctor-detail', params: { slug: result.slug } };
  } else {
    return { name: 'clinic-detail', params: { slug: result.slug } };
  }
};

const getDefaultImage = (type) => {
  return type === 'doctor' 
    ? '/images/default-doctor.png' 
    : '/images/default-clinic.png';
};

const getTypeLabel = (type) => {
  const labels = {
    all: t('pages.searchResult.all'),
    doctor: t('pages.searchResult.doctors'),
    clinic: t('pages.searchResult.clinics'),
    hospital: t('pages.searchResult.hospitals')
  };
  return labels[type] || labels.all;
};  

const toggleTypeFilter = () => {
  showTypeFilter.value = !showTypeFilter.value;
  showLocationFilter.value = false;
  showSpecialtyFilter.value = false;
  showSortFilter.value = false;
};

const selectType = (type) => {
  selectedType.value = type;
  showTypeFilter.value = false;
  currentPage.value = 1;
  updateURL();
  performSearch();
};

const toggleLocationFilter = () => {
  showLocationFilter.value = !showLocationFilter.value;
  showSpecialtyFilter.value = false;
  showTypeFilter.value = false;
};

const toggleSpecialtyFilter = () => {
  showSpecialtyFilter.value = !showSpecialtyFilter.value;
  showLocationFilter.value = false;
  showTypeFilter.value = false;
};

const toggleSortFilter = () => {
  showSortFilter.value = !showSortFilter.value;
};

const selectSortOption = (value, order) => {
  sortBy.value = value;
  sortOrder.value = order;
  showSortFilter.value = false;
  currentPage.value = 1;
  updateURL();
  performSearch();
};

const toggleAdvancedFilters = () => {
  showAdvancedFilters.value = !showAdvancedFilters.value;
};

const applyFilters = () => {
  // Reset to first page when applying filters
  currentPage.value = 1;
  showAdvancedFilters.value = false;
  performSearch();
};

const clearFilters = () => {
  filters.value = {
    minRating: 0,
    minPrice: 0,
    maxPrice: 0,
    onlineOnly: false
  };
  currentPage.value = 1;
  showAdvancedFilters.value = false;
  performSearch();
};

const bookAppointment = (result) => {
  if (result.type === 'doctor') {
    router.push({ 
      name: 'appointment-step', 
      query: { 
        doctorSlug: result.slug,
        doctorId: result.id,
        doctorName: result.name,
        clinicName: result.address,
        specialty: result.specialties?.[0] || ''
      } 
    });
  } else {
    router.push({ 
      name: 'clinic-detail', 
      params: { slug: result.slug },
      query: { action: 'book' }
    });
  }
};

const bookOnlineAppointment = (result) => {
  router.push({ 
    name: 'appointment-step', 
    query: { 
      doctorSlug: result.slug,
      doctorId: result.id,
      doctorName: result.name,
      clinicName: result.address,
      specialty: result.specialties?.[0] || '',
      type: 'online' 
    } 
  });
};

// Initialize from URL params
const initializeFromURL = () => {
  const urlQuery = route.query;
  
  searchQuery.value = urlQuery.q || '';
  currentPage.value = parseInt(urlQuery.page) || 1;
  selectedType.value = urlQuery.type || 'all';
  selectedSpecialty.value = urlQuery.specialty || '';
  selectedLocation.value = urlQuery.location || '';
  sortBy.value = urlQuery.sortBy || 'relevance';
  sortOrder.value = urlQuery.sortOrder || 'desc';
};

// Watchers
watch(() => route.query, () => {
  initializeFromURL();
  // Thực hiện tìm kiếm ngay cả khi không có từ khóa (để hiển thị kết quả theo filter)
  performSearch();
});

// Lifecycle
onMounted(() => {
  initializeFromURL();
  // Thực hiện tìm kiếm ngay cả khi không có từ khóa (để hiển thị kết quả theo filter)
  performSearch();
  
  // Thêm event listener để đóng dropdown khi click bên ngoài
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

// Thêm các dropdown states và methods
const showLocationFilter = ref(false);
const showSpecialtyFilter = ref(false);
const showTypeFilter = ref(false);

// Location options - có thể lấy từ API hoặc hardcode
const locationOptions = [
  'Hà Nội',
  'Hồ Chí Minh',
  'Đà Nẵng',
  'Hải Phòng',
  'Cần Thơ'
];

// Specialty options - có thể lấy từ API hoặc hardcode  
const specialtyOptions = [
  'Tim mạch',
  'Thần kinh',
  'Tiêu hóa',
  'Hô hấp',
  'Nội tiết',
  'Da liễu',
  'Mắt',
  'Tai Mũi Họng',
  'Răng Hàm Mặt',
  'Sản Phụ khoa'
];

const selectLocation = (location) => {
  selectedLocation.value = selectedLocation.value === location ? '' : location;
  showLocationFilter.value = false;
  currentPage.value = 1;
  updateURL();
  performSearch();
};

const selectSpecialty = (specialty) => {
  selectedSpecialty.value = selectedSpecialty.value === specialty ? '' : specialty;
  showSpecialtyFilter.value = false;
  currentPage.value = 1;
  updateURL();
  performSearch();
};

// Close dropdowns when clicking outside
const handleClickOutside = (event) => {
  const target = event.target;
  const dropdowns = document.querySelectorAll('.relative');
  
  let clickedInside = false;
  dropdowns.forEach(dropdown => {
    if (dropdown.contains(target)) {
      clickedInside = true;
    }
  });
  
  if (!clickedInside) {
    showLocationFilter.value = false;
    showSpecialtyFilter.value = false;
    showTypeFilter.value = false;
    showSortFilter.value = false;
  }
};
</script>

<style scoped>
.hide-scroll-bar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.hide-scroll-bar::-webkit-scrollbar {
  display: none;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 