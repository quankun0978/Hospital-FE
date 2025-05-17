<template>
  <header class="w-full sticky top-0 bg-white z-[1000] border-b border-b-slate-100">
    <div class="flex relative items-stretch">
      <div class="flex items-center space-x-2 mr-auto p-4">
        <button 
          type="button" 
          aria-label="Toggle navigation"
          class="primary-menu-toggle lg:hidden text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300"
          @click="toggleMenu"
        >
          <span class="sr-only">Navigation</span>
          <img :src="menuToggleIcon" alt="Menu Toggle" />
        </button>
        <router-link to="/">
          <img width="118" height="25" src="https://cdn.youmed.vn/wp-content/themes/youmed/images/logo.svg" alt="YouMed" />
        </router-link>
      </div>
      <nav 
        id="primary-menu" 
        :class="['bg-white absolute z-[100] top-0 right-0 left-0 transition transform origin-top-right h-screen lg:flex lg:h-auto overflow-scroll lg:overflow-visible lg:relative', isMenuOpen.value ? 'block' : 'hidden']"
      >
        <div class="lg:hidden sticky top-0">
          <button 
            arial-label="Toggle navigation" 
            class="bg-slate-100 rounded-full p-1 m-3 primary-menu-toggle"
            @click="toggleMenu"
          >
            <span class="sr-only">Close Navigation</span>
            <img :src="closeMenuIcon" alt="Close Menu" />
          </button>
        </div>
        <div class="lg:flex items-stretch">
          <ul id="primary" class="px-6 lg:px-0 font-semibold lg:flex text-sm items-center">
            <li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children dropdown group nav-item">
              <a href="#" data-toggle="dropdown" aria-expanded="false" class="dropdown-toggle nav-link" id="menu-item-dropdown-51">{{ t('components.header.booking.title') }}</a>
              <ul class="dropdown-menu group-hover:block group-hover:block overflow-hidden lg:hidden lg:absolute lg:top-75 lg:bg-white lg:rounded-xl lg:shadow-yu" aria-labelledby="menu-item-dropdown-51">
                <li class="mt-4 menu-item menu-item-type-custom menu-item-object-custom nav-item">
                  <a href="#" class="dropdown-item flex-col md:items-start md:p-4 md:mx-4 md:rounded-lg">
                    {{ t('components.header.booking.doctor') }}
                    <p class="hidden md:block text-sm font-normal text-gray-700">{{ t('components.header.booking.doctorDesc') }}</p>
                  </a>
                </li>
                <li class="menu-item menu-item-type-custom menu-item-object-custom nav-item">
                  <a href="#" class="dropdown-item flex-col md:items-start md:p-4 md:mx-4 md:rounded-lg">
                    {{ t('components.header.booking.hospital') }}
                    <p class="hidden md:block text-sm font-normal text-gray-700">{{ t('components.header.booking.hospitalDesc') }}</p>
                  </a>
                </li>
                <li class="menu-item menu-item-type-custom menu-item-object-custom nav-item">
                  <a href="#" class="dropdown-item flex-col md:items-start md:p-4 md:mx-4 md:rounded-lg">
                    {{ t('components.header.booking.clinic') }}
                    <p class="hidden md:block text-sm font-normal text-gray-700">{{ t('components.header.booking.clinicDesc') }}</p>
                  </a>
                </li>
                <li class="menu-item menu-item-type-custom menu-item-object-custom nav-item">
                  <a href="#" class="dropdown-item flex-col md:items-start md:p-4 md:mx-4 md:rounded-lg">
                    {{ t('components.header.booking.vaccination') }}
                    <p class="hidden md:block text-sm font-normal text-gray-700">{{ t('components.header.booking.vaccinationDesc') }}</p>
                  </a>
                </li>
                <li class="menu-item menu-item-type-custom menu-item-object-custom nav-item">
                  <a href="#" class="dropdown-item flex-col md:items-start md:p-4 md:mx-4 md:rounded-lg">
                    {{ t('components.header.booking.labTest') }}
                    <p class="hidden md:block text-sm font-normal text-gray-700">{{ t('components.header.booking.labTestDesc') }}</p>
                  </a>
                </li>
                <li class="mt-4 dropdown-footer menu-item menu-item-type-custom menu-item-object-custom nav-item">
                  <a href="tel:19002805" class="dropdown-item">{{ t('components.header.booking.support') }}</a>
                </li>
              </ul>
            </li>
            <li class="menu-item menu-item-type-post_type menu-item-object-page nav-item">
              <a href="#" class="nav-link">{{ t('components.header.other.onlineConsultation') }}</a>
            </li>
            <li class="menu-item menu-item-type-custom menu-item-object-custom nav-item">
              <a target="_blank" rel="noopener noreferrer" href="#" class="nav-link">{{ t('components.header.other.store') }}</a>
            </li>
            <li class="menu-item menu-item-type-custom menu-item-object-custom nav-item">
              <a href="#" class="nav-link">{{ t('components.header.other.news') }}</a>
            </li>
          </ul>
        </div>
        <div class="lg:flex items-center">
          <ul id="menu-second" class="px-6 lg:px-0 lg:flex text-sm font-normal">
            <li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children dropdown group nav-item">
              <a href="#" data-toggle="dropdown" aria-expanded="false" class="dropdown-toggle nav-link" id="menu-item-dropdown-60">{{ t('components.header.medicalStaff.title') }}</a>
              <ul class="dropdown-menu group-hover:block group-hover:block overflow-hidden lg:hidden lg:absolute lg:top-75 lg:bg-white lg:rounded-xl lg:shadow-yu" aria-labelledby="menu-item-dropdown-60">
                <li class="menu-item menu-item-type-post_type menu-item-object-page nav-item">
                  <a href="#" class="dropdown-item">{{ t('components.header.medicalStaff.doctor') }}</a>
                </li>
                <li class="menu-item menu-item-type-post_type menu-item-object-page nav-item">
                  <a href="#" class="dropdown-item">{{ t('components.header.medicalStaff.clinic') }}</a>
                </li>
                <li class="menu-item menu-item-type-custom menu-item-object-custom nav-item">
                  <a target="_blank" rel="noopener noreferrer" href="#" class="dropdown-item">{{ t('components.header.medicalStaff.y360') }}</a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <a href="#" target="_blank" class="flex lg:hidden items-center px-6 py-4 space-x-2 bg-slate-100 mt-4 mb-24">
          <img :src="downloadAppIcon" alt="Download App" />
          <div class="block">
            <p class="text-sm font-semibold text-gray-800">{{ t('components.header.other.downloadApp') }}</p>
            <p class="text-xs font-medium text-gray-500">{{ t('components.header.other.downloadAppDesc') }}</p>
          </div>
        </a>
      </nav>
      <div class="language-switcher-container">
        <LanguageSwitcher/>
      </div>
      <div class="inline-flex space-x-3 items-center">
        <!-- Phần user info - khi chưa đăng nhập -->
        <div id="user-info" class="p-3" v-if="!isLoggedIn">
          <router-link to="/login">
            <AppButton additionalClasses="py-3" variant="outline" size="md" rounded="sm">
              {{ t('components.header.navigation.login') }}
            </AppButton>
          </router-link>
        </div>
        
        <!-- Phần dropdown cho người dùng đã đăng nhập -->
        <div id="user-dropdown" class="relative p-3" v-else>
          <button 
            @click="toggleUserDropdown"
            class="flex items-center gap-2 focus:outline-none"
          >

            <span class="text-sm font-medium">{{ userName }}</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              class="h-4 w-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <!-- Dropdown Menu -->
          <div 
            v-if="isUserDropdownOpen"
            class="absolute w-[170px] right-0 mt-1 w-56 bg-white rounded shadow border border-gray-100 z-[1001]"
          >
            <div class="p-3 border-b border-gray-100">
              <p class="text-xs text-gray-500">{{ t('components.header.navigation.myAccount') }}</p>
              <p class="text-sm font-medium text-gray-800 truncate">{{ userName }}</p>
              <p class="text-xs text-gray-600 truncate">{{ userEmail }}</p>
            </div>
            <ul>
              <li class="border-b border-gray-100">
                <router-link to="/appointments" class="block px-4 py-2 text-sm hover:bg-gray-50">
                  Lịch khám
                </router-link>
              </li>
              <li class="border-b border-gray-100">
                <router-link to="/payment-history" class="block px-4 py-2 text-sm hover:bg-gray-50">
                  Lịch sử thanh toán
                </router-link>
              </li>
              <li class="border-b border-gray-100">
                <router-link to="/profile" class="block px-4 py-2 text-sm hover:bg-gray-50">
                  Hồ sơ
                </router-link>
              </li>
              <li>
                <button @click="logout" class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50">
                  {{ t('components.header.navigation.logout') }}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
     
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useI18n } from '@/i18n/useI18n';
import { useRoute, useRouter } from 'vue-router';
import menuToggleIcon from '@/assets/images/menu-toggle.svg';
import closeMenuIcon from '@/assets/images/close-menu.svg';
import downloadAppIcon from '@/assets/images/download-app.svg';
import LanguageSwitcher from '@/components/LanguageSwitcher.vue';
import AppButton from '@/components/common/Button/Button.vue';
import { userApi } from '@/api/commonFunction';
import { useAuthStore } from '@/store/auth';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

// Trạng thái menu
const isMenuOpen = ref(false);
const isUserDropdownOpen = ref(false);

// Sử dụng Pinia store cho trạng thái đăng nhập và thông tin người dùng
const isLoggedIn = computed(() => authStore.isAuthenticated);
const userName = computed(() => authStore.getUserName);
const userEmail = computed(() => authStore.getUserEmail);

// Phương thức chuyển đổi menu
function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}

// Phương thức chuyển đổi user dropdown
function toggleUserDropdown() {
  isUserDropdownOpen.value = !isUserDropdownOpen.value;
}

// Lấy chữ cái đầu của tên người dùng để hiển thị trong avatar
const userInitials = computed(() => {
  if (!userName.value) return '';
  return userName.value.charAt(0).toUpperCase();
});

// Đăng xuất
function logout() {
  // Sử dụng Pinia store để đăng xuất
  authStore.logout();
  
  // Đóng dropdown nếu đang mở
  isUserDropdownOpen.value = false;
  
  // Chuyển hướng về trang đăng nhập mà không refresh trang
  router.push('/login');
}

// Hàm lấy thông tin người dùng từ API
async function fetchUserProfile() {
  // try {
  //   const response = await userApi.getProfile();
  //   if (response.success && response.data) {
  //     // Cập nhật thông tin người dùng vào Pinia store
  //     authStore.setUser(response.data);
  //   }
  // } catch (error) {
  //   console.error('Lỗi khi lấy thông tin người dùng:', error);
  // }
}

// Xử lý sự kiện click bên ngoài để đóng menu
function handleOutsideClick(e) {
  const menu = document.getElementById('primary-menu');
  const toggles = document.querySelectorAll('.primary-menu-toggle');
  const userDropdown = document.getElementById('user-dropdown');
  
  // Đóng menu chính khi click bên ngoài
  let isOutsideMenuClick = true;
  if (menu && menu.contains(e.target)) {
    isOutsideMenuClick = false;
  }
  toggles.forEach(toggle => {
    if (toggle.contains(e.target)) {
      isOutsideMenuClick = false;
    }
  });
  
  if (isOutsideMenuClick && isMenuOpen.value) {
    isMenuOpen.value = false;
  }
  
  // Đóng user dropdown khi click bên ngoài
  if (userDropdown && !userDropdown.contains(e.target)) {
    isUserDropdownOpen.value = false;
  }
}

// Hook lifecycle
onMounted(() => {
  // Khởi tạo trạng thái từ localStorage
  authStore.initializeFromLocalStorage();
  
  // Nếu đã đăng nhập, lấy thông tin người dùng từ API
  if (isLoggedIn.value) {
    fetchUserProfile();
  }
  
  document.addEventListener('click', handleOutsideClick);
});

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick);
});
</script>

<style scoped>
.language-switcher-container {
  display: flex;
  justify-content: flex-end;
}

.text-primary {
  color: #2563eb;
}

.bg-primary {
  background-color: #2563eb;
}
</style>
