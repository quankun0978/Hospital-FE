<template>
  <section class="bg-white">
    <!-- Breadcrumb -->
    <nav aria-label="breadcrumb" class="max-w-5xl mx-auto block">
      <ol role="list" class="flex flex-wrap space-x-2 px-4 py-2 text-sm">
        <li>
          <router-link to="/" class="hover:text-primary">Trang chủ</router-link>
        </li>
        <li>
          <span class="text-gray-300">/</span>
        </li>
        <li>
          <router-link to="/clinics" class="hover:text-primary">
            {{ clinic?.isHospital ? "Bệnh viện" : "Phòng khám" }}
          </router-link>
        </li>
      </ol>
    </nav>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center py-16">
      <a-spin size="large" />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center text-red-500 py-8">
      {{ error }}
    </div>

    <!-- Main Content -->
    <main v-else-if="clinic" class="flex flex-col mx-auto">
      <!-- Image Carousel Section -->
      <div class="lg:order-2 bg-white relative">
        <div class="relative max-w-5xl flex mx-auto lg:my-4">
          <div
            class="carousel-wrapper flex relative h-0 overflow-hidden lg:rounded-2xl w-3/5 mr-2"
            style="padding-bottom: 40%"
          >
            <div class="carousel-grid flex-1 md:grid absolute inset-0 w-full">
              <!-- Main Carousel -->
              <div class="relative overflow-hidden w-full">
                <a-carousel :dots="true" autoplay class="clinic-carousel">
                  <div
                    v-for="(image, index) in getCarouselImages()"
                    :key="index"
                    class="carousel-ratio fallback-bg"
                  >
                    <img
                      :src="image"
                      :alt="`${clinic.name} - Hình ${index + 1}`"
                      class="mx-auto object-fill w-full h-full"
                      width="1200"
                      height="628"
                    />
                  </div>
                </a-carousel>
              </div>

              <!-- Additional images grid (hidden on mobile) -->
            </div>
          </div>

          <!-- Tất cả ảnh trong một preview group -->
          <a-image-preview-group>
            <!-- Hiển thị ảnh fallback -->
            <div class="flex w-2/5 flex-wrap gap-2">
              <div
                v-for="(image, index) in getFallbackImages().slice(0, 4)"
                :key="`fallback-${index}`"
                class="cursor-zoom-in hidden md:block"
                style="width: 49%; height: 50%"
              >
                <a-image
                  :src="image"
                  :alt="`${clinic.name} - Hình phụ ${index + 1}`"
                  class="fallback-bg w-full h-full object-cover rounded-lg"
                  :preview="true"
                />
              </div>
            </div>

            <!-- View all button -->
            <div class="hidden md:block">
              <button
                @click="showAllImages"
                aria-label="View all"
                class="bg-black/70 flex gap-1 items-center px-2 py-0.5 absolute bottom-1 right-1 rounded-xl text-white hover:bg-black/80 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 512 512"
                  class="ionicon"
                >
                  <path
                    d="M350.54 148.68l-26.62-42.06C318.31 100.08 310.62 96 302 96h-92c-8.62 0-16.31 4.08-21.92 10.62l-26.62 42.06C155.85 155.23 148.62 160 140 160H80a32 32 0 00-32 32v192a32 32 0 0032 32h352a32 32 0 0032-32V192a32 32 0 00-32-32h-59c-8.65 0-16.85-4.77-22.46-11.32z"
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="32"
                  ></path>
                  <circle
                    cx="256"
                    cy="272"
                    r="80"
                    fill="none"
                    stroke="currentColor"
                    stroke-miterlimit="10"
                    stroke-width="32"
                  ></circle>
                  <path
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="32"
                    d="M124 158v-22h-24v22"
                  ></path>
                </svg>
                <span class="text-xs font-medium">{{
                  getTotalImagesCount()
                }}</span>
              </button>
            </div>

            <!-- Ảnh ẩn cho preview (carousel + fallback còn lại) -->
            <div style="display: none">
              <!-- Ảnh carousel (background) -->
              <a-image
                v-for="(image, index) in getCarouselImages()"
                :key="`carousel-hidden-${index}`"
                :src="image"
                :preview="true"
              />
              <!-- Ảnh fallback còn lại -->
              <a-image
                v-for="(image, index) in getFallbackImages().slice(4)"
                :key="`fallback-hidden-${index}`"
                :src="image"
                :preview="true"
              />
            </div>
          </a-image-preview-group>
        </div>
      </div>

      <div class="order-4">
        <div class="bg-white">
          <div class="max-w-5xl mx-auto flex justify-end">
            <button
              @click="bookAppointment()"
              class="bg-primary hospital-quick-booking w-2/5 hover:bg-blue-600 hover:text-white px-5 py-2.5 ml-auto text-sm leading-5 rounded-md font-semibold text-white lg:flex-initial truncate"
            >
              Đặt khám ngay
            </button>
          </div>
        </div>
      </div>
      <!-- Hospital Info -->
      <div class="lg:order-1" id="about">
        <div class="relative flex flex-col md:flex-row max-w-5xl mx-auto">
          <!-- Logo -->
          <div class="relative flex-none p-4 lg:px-6">
            <img
              :src="getClinicLogo()"
              :alt="clinic.name"
              class="w-24 h-24 md:w-28 md:h-28 object-contain mx-auto"
              width="100"
              height="100"
            />
          </div>

          <!-- Info -->
          <div class="flex-1 text-center md:text-left">
            <div class="px-4 md:px-0 md:py-4">
              <h1 class="text-lg md:text-2xl font-bold text-gray-800">
                {{ clinic.name }}
              </h1>
              <p class="text-sm md:text-base font-medium opacity-80">
                {{ clinic.address || "Địa chỉ sẽ được cập nhật" }}
              </p>
            </div>

            <!-- Navigation Links -->
            <div
              class="flex py-2 px-4 md:px-0 sm:justify-center md:justify-start hide-scroll-bar overflow-x-scroll md:overflow-x-visible gap-3 font-medium text-left"
            >
              <a
                v-if="clinic.website"
                :href="clinic.website"
                target="_blank"
                rel="noreferrer noopener"
                class="inline-flex items-center flex-none whitespace-nowrap border rounded-full py-1 px-2"
              >
                <span>Website</span>
              </a>

              <a
                v-if="clinic.phone"
                :href="`tel:${clinic.phone}`"
                target="_blank"
                rel="noreferrer noopener"
                class="inline-flex items-center flex-none whitespace-nowrap border rounded-full py-1 px-2"
              >
                <span>Tổng đài: {{ clinic.phone }}</span>
              </a>
            </div>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div class="border-y border-b-slate-200 border-t-slate-100">
          <div
            class="max-w-5xl mx-auto flex overflow-x-scroll hide-scroll-bar py-2"
          >
            <ul class="flex flex-1 flex-nowrap mx-4">
              <li class="inline-flex">
                <button
                  @click="scrollToInfo()"
                  :class="[
                    'font-semibold px-4 py-2 whitespace-nowrap hover:bg-slate-100 rounded-lg',
                    activeTab === 'info' ? 'active' : '',
                  ]"
                >
                  Thông tin
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->

      <!-- Tab Content -->
      <div class="order-5" id="intro">
        <div class="bg-white">
          <div class="max-w-5xl mx-auto">
            <!-- Information Tab Content -->
            <div v-show="activeTab === 'info'">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Left Column: Introduction -->
                <div class="flex flex-col space-y-6">
                  <!-- Introduction -->
                  <div class="p-4 md:p-6">
                    <h2 class="text-lg font-semibold">Giới thiệu</h2>
                    <div class="mt-4 prose max-w-none">
                      <div
                        v-if="clinic.contentHTML"
                        v-html="clinic.contentHTML"
                      ></div>
                      <div v-else-if="clinic.description">
                        <p>{{ clinic.description }}</p>
                      </div>
                      <div v-else>
                        <h2>Đặt khám {{ clinic.name }}</h2>
                        <p>
                          Với lượng bệnh nhân thăm khám ngày càng tăng cao,
                          {{ clinic.name }} khuyến khích người dân đặt khám
                          trước khi đến để hạn chế thời gian xếp hàng chờ đợi.
                        </p>
                      </div>
                    </div>
                    <div>
                      <button
                        class="text-sm font-medium rounded-full py-1 text-gray-600 hover:text-primary"
                      >
                        ...Xem thêm
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Right Column: Working Hours, Contact Support & Specialties -->
                <div class="flex flex-col">
                  <!-- Working Hours -->
                  <div class="p-4">
                    <h2 class="text-lg font-semibold">Giờ làm việc</h2>
                    <div class="mt-4 text-base">
                      <ul class="space-y-2">
                        <li class="flex justify-between pb-2 border-b text-sm">
                          <div class="font-semibold">Thứ 2 - Thứ 7</div>
                          <div class="tabular-nums">
                            {{ clinic.openTime || "7h" }} -
                            {{ clinic.closeTime || "19h" }}
                          </div>
                        </li>
                        <li class="flex justify-between pb-2 border-b text-sm">
                          <div class="font-semibold">Chủ nhật</div>
                          <div class="tabular-nums">7h - 11h30</div>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <!-- Contact Support -->
                  <div class="p-4">
                    <h2 class="text-lg font-semibold">Tổng đài hỗ trợ</h2>
                    <div class="text-base">
                      <p class="mb-4 text-sm opacity-80">
                        Trong trường hợp bạn cần hỗ trợ thêm thông tin, vui lòng
                        liên hệ tổng đài bên dưới để được trợ giúp.
                      </p>
                      <ul>
                        <li class="my-1">
                          <a
                            href="tel:19002805"
                            target="_blank"
                            rel="noreferrer noopener"
                            class="font-medium inline-flex items-center border-b border-slate-100 hover:border-b-primary"
                          >
                            Tổng đài: 1900-2805
                          </a>
                        </li>
                        <li v-if="clinic.phone" class="my-1">
                          <a
                            :href="`tel:${clinic.phone}`"
                            target="_blank"
                            rel="noreferrer noopener"
                            class="font-medium inline-flex items-center border-b border-slate-100 hover:border-b-primary"
                          >
                            Tổng đài {{ clinic.name }}: {{ clinic.phone }}
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <!-- Specialties -->
                  <div class="p-4">
                    <h2 class="text-lg font-semibold">
                      {{ clinic.isHospital ? "Chuyên khoa" : "Chuyên khám" }}
                    </h2>
                    <div
                      class="mt-4 space-y-3"
                      v-if="clinic.specialties && clinic.specialties.length > 0"
                    >
                      <div
                        v-for="specialty in clinic.specialties"
                        :key="specialty.id"
                        class="flex items-center p-3 border border-gray-200 rounded-lg hover:border-primary hover:bg-blue-50 transition-colors cursor-pointer"
                      >
                        <span class="text-gray-800 font-medium">{{
                          specialty.name
                        }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </section>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import ClinicCardsContainer from "@/components/Layout/Section/Booking/ClinicCardsContainer.vue";
import clinicApi from "../api/clinicApi";
import { getImage } from "../common/function";

const apiUrl = import.meta.env.VITE_API_BASE_URL;
const route = useRoute();
const router = useRouter();

// State
const clinic = ref(null);
const loading = ref(true);
const error = ref("");
const activeTab = ref("info"); // Tab state

const additionalImages = ref([
  "https://cdn.youmed.vn/photos/c77387d0-f050-41a7-bd8f-e95ab1efab9d.jpg",
  "https://cdn.youmed.vn/photos/c69b51ec-c33c-4da1-92ca-9645093a0b34.jpeg",
  "https://cdn.youmed.vn/photos/294fe70b-f718-44dd-9aa0-8895f98837aa.jpg",
  "https://cdn.youmed.vn/photos/cb4cd8f2-0e6d-4a32-ba22-e0e99c86766b.jpg",
]);

// Hàm lấy dữ liệu từ API
const fetchClinicDetails = async () => {
  loading.value = true;
  error.value = "";

  try {
    const slug = route.params.slug;
    if (!slug) {
      error.value = "Không tìm thấy thông tin phòng khám";
      loading.value = false;
      return;
    }

    // Gọi API
    const response = await clinicApi.getClinicBySlug(slug);

    if (response.succeeded && response.data) {
      clinic.value = response.data;
      console.log("Clinic data:", clinic.value); // Debug log
    } else {
      error.value = response.message || "Không thể tải thông tin cơ sở y tế";
    }
  } catch (err) {
    console.error("Lỗi khi lấy thông tin cơ sở y tế:", err);
    error.value = "Đã xảy ra lỗi khi tải thông tin cơ sở y tế";
  } finally {
    loading.value = false;
  }
};

// Hàm lấy hình ảnh carousel (background)
const getCarouselImages = () => {
  if (clinic.value?.clinicImages && clinic.value.clinicImages.length > 0) {
    // Lọc ra các hình ảnh background cho carousel
    const backgroundImages = clinic.value.clinicImages
      .filter((img) => img.isBackground)
      .map((img) => getImage(img.imageFallbackUrl));

    if (backgroundImages.length > 0) {
      return backgroundImages;
    }
  }

  // Sử dụng hình ảnh mặc định nếu không có
  return [];
};

// Hàm lấy hình ảnh fallback
const getFallbackImages = () => {
  if (clinic.value?.clinicImages && clinic.value.clinicImages.length > 0) {
    // Lọc ra các hình ảnh fallback
    const fallbackImages = clinic.value.clinicImages
      .filter((img) => !img.isBackground)
      .map((img) => getImage(img.imageFallbackUrl));

    if (fallbackImages.length > 0) {
      return fallbackImages;
    }
  }

  // Sử dụng hình ảnh mặc định nếu không có
  return additionalImages.value;
};

// Hàm lấy tất cả hình ảnh cho preview
const getAllImages = () => {
  const carouselImages = getCarouselImages();
  const fallbackImages = getFallbackImages();
  return [...carouselImages, ...fallbackImages];
};

// Hàm lấy logo phòng khám
const getClinicLogo = () => {
  if (clinic.value?.logoImg) {
    return getImage(clinic.value.logoImg);
  }
  return "";
};

// Hàm tính tổng số hình ảnh
const getTotalImagesCount = () => {
  const carouselCount = getCarouselImages().length;
  const fallbackCount = getFallbackImages().length;
  return carouselCount + fallbackCount;
};

// Hàm hiển thị tất cả ảnh bắt đầu từ ảnh đầu tiên
const showAllImages = async () => {
  await nextTick();

  // Tìm và click vào ảnh ẩn đầu tiên để bắt đầu preview từ ảnh carousel
  const hiddenImages = document.querySelectorAll(
    '[style="display: none;"] .ant-image img'
  );
  if (hiddenImages.length > 0) {
    hiddenImages[0].click();
  } else {
    // Fallback: click vào ảnh fallback đầu tiên nếu có
    const fallbackImages = document.querySelectorAll(".ant-image img");
    if (fallbackImages.length > 0) {
      fallbackImages[0].click();
    }
  }
};

// Hàm đặt lịch khám
const bookAppointment = () => {
  // Chuyển hướng đến trang danh sách bác sĩ với filter theo clinic
  const clinicIdValue = clinic.value.clinicId || clinic.value.id;

  router.push({
    path: "/doctors",
    query: {
      clinic: clinic.value.name,
      clinicId: clinicIdValue,
    },
  });
};

// Hàm scroll xuống phần thông tin
const scrollToInfo = () => {
  activeTab.value = "info";

  // Scroll lên phần thông tin
  setTimeout(() => {
    const infoSection = document.getElementById("intro");
    if (infoSection) {
      infoSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, 100);
};

// Hook lifecycle
onMounted(() => {
  fetchClinicDetails();
});
</script>

<style scoped>
:deep(.ant-image) {
  height: 100%;
}
:deep(.ant-image-img) {
  height: 100%;
}
/* Carousel styles */
.carousel-wrapper {
  position: relative;
  height: 0;
  overflow: hidden;
  padding-bottom: 40%;
}

.carousel-grid {
  display: flex;
  gap: 2px;
  position: absolute;
  inset: 0;
}

.carousel-ratio {
  position: relative;
  width: 100%;
  height: 100%;
}

.fallback-bg {
  background-color: #f5f5f5;
}

/* Ant Design Carousel customization */
:deep(.clinic-carousel) {
  height: 100%;
  grid-column: 1;
  grid-row: 1 / 3;
}

:deep(.clinic-carousel .ant-carousel-inner) {
  height: 100%;
}

:deep(.clinic-carousel .slick-list) {
  height: 100%;
}

:deep(.clinic-carousel .slick-track) {
  height: 100%;
}

:deep(.slick-slider) {
  height: 100%;
}

:deep(.clinic-carousel .slick-slide) {
  height: 100%;
}

:deep(.clinic-carousel .slick-slide > div) {
  height: 100%;
}

:deep(.clinic-carousel .carousel-ratio) {
  height: 100%;
}

:deep(.clinic-carousel img) {
  width: 100%;
  height: 100%;
}

/* Dots style */
:deep(.clinic-carousel .ant-carousel-dots) {
  bottom: 10px;
}

:deep(.clinic-carousel .ant-carousel-dots li button) {
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  width: 8px;
  height: 8px;
}

:deep(.clinic-carousel .ant-carousel-dots li.ant-carousel-dots-active button) {
  background: white;
}

/* Grid images positioning */
.carousel-grid > div:nth-child(2) {
  grid-column: 2;
  grid-row: 1;
}

.carousel-grid > div:nth-child(3) {
  grid-column: 3;
  grid-row: 1;
}

.carousel-grid > div:nth-child(4) {
  grid-column: 2;
  grid-row: 2;
}

.carousel-grid > div:nth-child(5) {
  grid-column: 3;
  grid-row: 2;
}

/* Hide scroll bar */
.hide-scroll-bar::-webkit-scrollbar {
  display: none;
}

.hide-scroll-bar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Active tab style */
.active {
  color: #2563eb;
  background-color: rgba(37, 99, 235, 0.1);
}

/* Button styles */
.text-primary {
  color: #2563eb;
}

.bg-primary {
  background-color: #2563eb;
}

.hover\:bg-primary-dark:hover {
  background-color: #1d4ed8;
}

.hover\:text-primary:hover {
  color: #2563eb;
}

.hover\:border-b-primary:hover {
  border-bottom-color: #2563eb;
}

/* Responsive grid */
@media (max-width: 768px) {
  .carousel-grid {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
  }

  .carousel-grid > div:first-child {
    grid-column: 1;
    grid-row: 1;
  }

  .carousel-grid > div:not(:first-child) {
    display: none;
  }
}

/* Fixed bottom button */
@media (max-width: 768px) {
  .hospital-quick-booking {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 50;
    margin: 0;
    border-radius: 0;
  }
}
.cursor-zoom-in {
  width: 49%;
  height: 50%;
}
</style>
