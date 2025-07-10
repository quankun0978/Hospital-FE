<template>
  <header
    class="w-full sticky top-0 bg-white z-[1000] border-b border-b-slate-100"
  >
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
          <img
            width="200"
            style="height: 40px"
            src="@/assets/images/logo.svg"
            alt="Hospital"
          />
        </router-link>
      </div>
      <nav
        id="primary-menu"
        :class="[
          'bg-white fixed z-[100] top-0 right-0 left-0 transition-all duration-300 lg:transform-none lg:flex lg:h-auto lg:relative',
          'h-screen lg:h-auto overflow-y-auto lg:overflow-visible',
          isMenuOpen && 'translate-x-0',
        ]"
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
          <ul
            id="primary"
            class="px-6 lg:px-0 font-semibold lg:flex text-sm items-center"
          >
            <li
              class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children dropdown group nav-item"
            >
              <a
                href="#"
                data-toggle="dropdown"
                aria-expanded="false"
                class="dropdown-toggle nav-link"
                id="menu-item-dropdown-51"
                >Đặt khám</a
              >
              <ul
                class="dropdown-menu group-hover:block group-hover:block overflow-hidden lg:hidden lg:absolute lg:top-75 lg:bg-white lg:rounded-xl lg:shadow-yu"
                aria-labelledby="menu-item-dropdown-51"
              >
                <li
                  class="mt-4 menu-item menu-item-type-custom menu-item-object-custom nav-item"
                >
                  <router-link
                    :to="{ name: 'search', query: { type: 'doctor' } }"
                    class="dropdown-item flex-col md:items-start md:p-4 md:mx-4 md:rounded-lg"
                  >
                    Đặt khám theo bác sĩ
                    <p
                      class="hidden md:block text-sm font-normal text-gray-700"
                    >
                      Tìm kiếm và đặt lịch khám với bác sĩ chuyên khoa
                    </p>
                  </router-link>
                </li>
                <li
                  class="menu-item menu-item-type-custom menu-item-object-custom nav-item"
                >
                  <router-link
                    :to="{ name: 'search', query: { type: 'hospital' } }"
                    class="dropdown-item flex-col md:items-start md:p-4 md:mx-4 md:rounded-lg"
                  >
                    Đặt khám theo bệnh viện
                    <p
                      class="hidden md:block text-sm font-normal text-gray-700"
                    >
                      Tìm kiếm và đặt lịch khám các bác sĩ tại bệnh viện
                    </p>
                  </router-link>
                </li>
                <li
                  class="menu-item menu-item-type-custom menu-item-object-custom nav-item"
                >
                  <router-link
                    :to="{ name: 'search', query: { type: 'clinic' } }"
                    class="dropdown-item flex-col md:items-start md:p-4 md:mx-4 md:rounded-lg"
                  >
                    Đặt khám theo phòng khám
                    <p
                      class="hidden md:block text-sm font-normal text-gray-700"
                    >
                      Tìm kiếm và đặt lịch khám các bác sĩ tại phòng khám
                    </p>
                  </router-link>
                </li>

                <li
                  class="mt-4 dropdown-footer menu-item menu-item-type-custom menu-item-object-custom nav-item"
                >
                  <a href="tel:19002805" class="dropdown-item"
                    >Hỗ trợ: 1900-2805</a
                  >
                </li>
              </ul>
            </li>
            <li
              class="menu-item menu-item-type-post_type menu-item-object-page nav-item"
            >
              <a href="#" class="nav-link">Tư vấn trực tuyến</a>
            </li>

            <li
              class="menu-item menu-item-type-custom menu-item-object-custom nav-item"
            >
              <a href="#" @click="scrollToNews" class="nav-link">Tin tức</a>
            </li>
          </ul>
        </div>

        <a
          href="#"
          target="_blank"
          class="flex lg:hidden items-center px-6 py-4 space-x-2 bg-slate-100 mt-4 mb-24"
        >
          <img :src="downloadAppIcon" alt="Download App" />
          <div class="block">
            <p class="text-sm font-semibold text-gray-800">Tải app Hospital</p>
            <p class="text-xs font-medium text-gray-500">
              Đặt khám nhanh chóng, tiện lợi
            </p>
          </div>
        </a>
      </nav>

      <div class="inline-flex space-x-3 items-center">
        <!-- Phần user info - khi chưa đăng nhập -->
        <div id="user-info" class="p-3" v-if="!isLoggedIn">
          <router-link to="/login">
            <AppButton
              additionalClasses="py-2"
              variant="outline"
              size="md"
              rounded="sm"
            >
              Đăng nhập
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
            <img :src="arrowDownIcon" alt="Arrow Down" width="16" height="16" />
          </button>

          <!-- Dropdown Menu -->
          <div
            v-if="isUserDropdownOpen"
            class="absolute w-[170px] right-0 mt-1 w-56 bg-white rounded shadow border border-gray-100 z-[1001]"
          >
            <div class="p-3 border-b border-gray-100">
              <p class="text-xs text-gray-500">Tài khoản của tôi</p>
              <p class="text-sm font-medium text-gray-800 truncate">
                {{ userName }}
              </p>
              <p class="text-xs text-gray-600 truncate">{{ userEmail }}</p>
            </div>
            <ul>
              <li v-if="isAdminOrDoctor" class="border-b border-gray-100">
                <router-link
                  to="/admin"
                  class="block px-4 py-2 text-sm hover:bg-gray-50"
                >
                  Trang quản lý
                </router-link>
              </li>
              <li class="border-b border-gray-100">
                <router-link
                  to="/appointments"
                  class="block px-4 py-2 text-sm hover:bg-gray-50"
                >
                  Lịch khám của tôi
                </router-link>
              </li>
              <li class="border-b border-gray-100">
                <router-link
                  to="/patient-record"
                  class="block px-4 py-2 text-sm hover:bg-gray-50"
                >
                  Hồ sơ
                </router-link>
              </li>
              <li class="border-b border-gray-100">
                <router-link
                  to="/change-password"
                  class="block px-4 py-2 text-sm hover:bg-gray-50"
                >
                  Đổi mật khẩu
                </router-link>
              </li>
              <li>
                <button
                  @click="logout"
                  class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                >
                  Đăng xuất
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
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import menuToggleIcon from "@/assets/images/menu-toggle.svg";
import closeMenuIcon from "@/assets/images/close-menu.svg";
import downloadAppIcon from "@/assets/images/download-app.svg";
import arrowDownIcon from "@/assets/images/arrow-down.svg";
import AppButton from "@/components/common/Button/Button.vue";
import { useAuthStore } from "@/store/auth";
import { nextTick } from "vue";

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
const userRole = computed(() => authStore.getUserRole);

// Kiểm tra quyền admin hoặc doctor
const isAdminOrDoctor = computed(() => {
  return userRole.value === "R1" || userRole.value === "R2";
});

watch(isMenuOpen, async (newVal) => {
  const menu = document.getElementById("primary-menu");
  const width = window.innerWidth;
  if (width < 800 && !newVal) {
    menu.classList.remove("-translate-x-full");
    menu.classList.add("translate-x-0");
  }
});

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
  if (!userName.value) return "";
  return userName.value.charAt(0).toUpperCase();
});

// Đăng xuất
function logout() {
  // Sử dụng Pinia store để đăng xuất
  authStore.logout();

  // Đóng dropdown nếu đang mở
  isUserDropdownOpen.value = false;
  router.push("/");
}

// Scroll đến mục tin tức
function scrollToNews(event) {
  event.preventDefault();
  
  // Kiểm tra xem có đang ở trang Home không
  if (route.path === '/') {
    // Nếu đang ở trang Home, scroll đến section tin tức
    setTimeout(() => {
      const newsSection = document.querySelector('.home-page .news-section') || 
                         document.querySelector('[class*="news"]') ||
                         document.querySelector('h1, h2, h3, h4, h5, h6').parentElement;
      
      // Tìm element chứa text "Tin tức y tế"
      const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      let targetElement = null;
      
      for (let element of elements) {
        if (element.textContent.includes('Tin tức y tế')) {
          targetElement = element;
          break;
        }
      }
      
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  } else {
    // Nếu không ở trang Home, chuyển về Home và scroll
    router.push('/').then(() => {
      setTimeout(() => {
        const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        let targetElement = null;
        
        for (let element of elements) {
          if (element.textContent.includes('Tin tức y tế')) {
            targetElement = element;
            break;
          }
        }
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 500); // Tăng thời gian chờ để page load xong
    });
  }
}

// Xử lý sự kiện click bên ngoài để đóng menu
function handleOutsideClick(e) {
  const menu = document.getElementById("primary-menu");
  const toggles = document.querySelectorAll(".primary-menu-toggle");
  const userDropdown = document.getElementById("user-dropdown");

  // Đóng menu chính khi click bên ngoài
  let isOutsideMenuClick = true;
  if (menu && menu.contains(e.target)) {
    isOutsideMenuClick = false;
  }
  toggles.forEach((toggle) => {
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
onMounted(async () => {
  // Auth store đã được khởi tạo từ plugin, chỉ cần validate
  await authStore.validateAuthState(route.path);

  document.addEventListener("click", handleOutsideClick);
});

onUnmounted(() => {
  document.removeEventListener("click", handleOutsideClick);
});

watch(userEmail, async (newVal) => {
  if (!newVal) {
    isUserDropdownOpen.value = false;
  }
});
</script>

<style scoped>
/* Thêm media query cho mobile */
@media (max-width: 768px) {
  #primary-menu {
    transform: translateX(-100%);
  }

  #primary-menu.translate-x-0 {
    transform: translateX(0);
  }
}

/* Các style khác giữ nguyên */
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

.primary-menu-toggle {
  cursor: pointer;
  transition: all 0.3s ease;
}

.primary-menu-toggle:hover {
  opacity: 0.8;
}

/* Overlay khi menu mobile mở */
#primary-menu::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: -1;
}

#primary-menu.translate-x-0::before {
  opacity: 1;
  visibility: visible;
}

@media (min-width: 1024px) {
  #primary-menu::before {
    display: none;
  }
}
</style>
