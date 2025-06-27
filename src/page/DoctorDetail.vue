<template>
  <div class="doctor-detail-page bg-slate-100">
    <div class="max-w-4xl mx-auto py-8">
      <div v-if="loading" class="flex justify-center items-center py-16">
        <div class="loader"></div>
      </div>
      <div v-else-if="error" class="text-center text-red-500 py-8">
        {{ error }}
      </div>
      <template v-else-if="doctor">
        <!-- Breadcrumb -->
        <div class="flex text-sm mb-6 text-gray-500">
          <router-link to="/" class="hover:text-primary">{{
            t("pages.home.common.home")
          }}</router-link>
          <span class="mx-2">/</span>
          <router-link to="/doctors" class="hover:text-primary">{{
            t("pages.home.common.doctor")
          }}</router-link>
          <span class="mx-2">/</span>
          <span class="text-gray-800">{{ doctor.name }}</span>
        </div>

        <main>
          <!-- Thông tin bác sĩ -->
          <div
            id="bio"
            class="bg-white flex flex-col md:flex-row items-stretch relative lg:rounded-t-xl"
          >
            <div class="p-4 pb-0 md:p-6 text-center">
              <div
                class="relative aspect-square rounded-full overflow-hidden mx-auto w-40 h-40 md:w-44 md:h-44 bg-slate-200"
              >
                <img
                  priority
                  width="180"
                  height="180"
                  class="object-cover absolute inset-0"
                  :alt="doctor.name"
                  loading="eager"
                  fetchpriority="high"
                  :src="getDoctorImage(doctor)"
                />
              </div>
            </div>

            <div class="flex flex-col justify-center flex-1 p-4 md:pl-0 gap-2">
              <h1 class="text-lg text-center md:text-left md:text-xl">
                <span class="md:hidden">{{ getShortTitle(doctor) }}</span>
                <span class="hidden md:inline-block">{{
                  getTitle(doctor)
                }}</span>
                {{ doctor.name }}
              </h1>

              <div
                class="flex items-center justify-center md:justify-start divide-x"
              >
                <div class="font-semibold flex items-center pr-2 text-primary">
                  <img
                    width="20"
                    height="20"
                    src="@/assets/images/verified.svg"
                    alt="Bác sĩ"
                  />
                  Bác sĩ
                </div>
                <div class="pl-1" v-if="doctor.experience">
                  <strong>{{ doctor.experience }}</strong> năm kinh nghiệm
                </div>
              </div>

              <div
                id="specialties"
                class="flex flex-col md:flex-row md:items-end md:gap-3 items-center"
              >
                <h2 class="text-gray-600 text-sm mb-0 doctorinfo-label">
                  Chuyên khoa
                </h2>
                <div class="space-x-2">
                  <h3
                    v-for="(specialty, index) in getDoctorSpecialties(doctor)"
                    :key="index"
                    class="inline-block px-2 py-1 text-xs bg-blue-100 text-green-800 rounded mt-1"
                  >
                    <router-link
                      :to="`/doctors?specialty=${encodeURIComponent(
                        specialty
                      )}`"
                      class="font-medium text-primary mr-1"
                    >
                      {{ specialty }}
                    </router-link>
                  </h3>
                </div>
              </div>

              <div
                class="flex flex-col md:flex-row md:items-end md:gap-3"
                v-if="doctor.position"
              >
                <h2 class="text-gray-600 text-sm doctorinfo-label">Chức vụ</h2>
                <p class="font-medium">{{ doctor.position }}</p>
              </div>

              <div
                class="flex flex-col md:flex-row md:gap-3"
                v-if="getDoctorHospital(doctor)"
              >
                <h2 class="text-gray-600 text-sm doctorinfo-label">
                  Nơi công tác
                </h2>
                <div>
                  <div v-if="doctor.clinics && doctor.clinics.length > 0">
                    <div
                      v-for="clinic in doctor.clinics"
                      :key="clinic.clinicId"
                      class="mb-2"
                    >
                      <router-link
                        :to="`/clinics/${clinic.slug}`"
                        class="font-medium text-primary hover:underline"
                      >
                        {{ clinic.name }}
                      </router-link>
                      <p v-if="clinic.address" class="text-sm text-gray-600">
                        {{ clinic.address }}
                      </p>
                      <span
                        v-if="clinic.isHospital"
                        class="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded mt-1"
                      >
                        Bệnh viện
                      </span>
                      <span
                        v-else
                        class="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded mt-1"
                      >
                        Phòng khám
                      </span>
                    </div>
                  </div>
                  <p v-else class="font-medium">
                    {{ getDoctorHospital(doctor) }}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <button
                class="absolute top-2 md:top-4 md:right-4 right-2 flex items-center border px-2 rounded-full py-1 group"
              >
                <svg width="16" viewBox="0 0 512 512">
                  <path
                    fill="#fbbf24"
                    d="M416 480L256 357.41 96 480V32h320z"
                  ></path>
                </svg>
                <span class="text-gray-500 text-xs">Yêu thích</span>
              </button>
            </div>
          </div>

          <!-- Điều hướng cho mobile -->
          <div class="bg-white sticky top-0 z-50 md:hidden">
            <div
              class="flex flex-nowrap border-b border-slate-100 shadow overflow-x-scroll items-stretch"
            >
              <button class="text-center py-3 px-4 font-medium flex-shrink-0">
                Thông tin
              </button>
              <button class="text-center py-3 px-4 font-medium flex-shrink-0">
                Giới thiệu
              </button>
              <button class="text-center py-3 px-4 font-medium flex-shrink-0">
                Chuyên khám
              </button>
            </div>
          </div>

          <!-- Lưu ý đặt khám -->
          <div class="bg-orange-50 p-4">
            <div class="flex items-center text-orange-600">
              <svg width="16" height="16" viewBox="0 0 16 16">
                <path
                  d="M3.24343 4.33294L3.24379 4.33273L7.19485 2.04737C7.19521 2.04717 7.19557 2.04696 7.19593 2.04675C7.69613 1.76143 8.30593 1.76291 8.79675 2.04625C8.79676 2.04626 8.79677 2.04626 8.79679 2.04627L12.7535 4.331C12.754 4.3313 12.7545 4.3316 12.755 4.33191C13.2495 4.62321 13.5543 5.14695 13.5601 5.72223V10.2799C13.5601 10.8556 13.2545 11.3834 12.7635 11.6669L12.7634 11.6669L8.80537 13.9525C8.80505 13.9527 8.80472 13.9528 8.80439 13.953C8.30417 14.2384 7.6943 14.237 7.20343 13.9536L3.24518 11.6679C2.7506 11.3765 2.44678 10.8468 2.44678 10.2799V5.71992C2.44678 5.1442 2.75236 4.61645 3.24343 4.33294ZM8.827 11.6601L8.83629 11.6508L8.84509 11.6411C8.94153 11.5339 9.01918 11.4128 9.07498 11.2789C9.12963 11.1477 9.16678 10.9958 9.16678 10.8333C9.16678 10.6734 9.13085 10.5238 9.07769 10.3942C9.01646 10.2377 8.93158 10.1215 8.84509 10.0254L8.83629 10.0157L8.827 10.0064C8.50056 9.67993 7.99421 9.57288 7.55779 9.75695C7.40294 9.81808 7.28773 9.90238 7.1923 9.98827L7.18252 9.99707L7.17322 10.0064C6.94754 10.232 6.83344 10.5349 6.83344 10.8333C6.83344 10.9696 6.85425 11.1245 6.91857 11.2789L6.9252 11.2948L6.9329 11.3102C6.98806 11.4205 7.0585 11.5337 7.15513 11.6411L7.17274 11.6606L7.1923 11.6782C7.28839 11.7647 7.40454 11.8496 7.56102 11.9108C7.69066 11.964 7.84029 11.9999 8.00011 11.9999C8.30776 11.9999 8.60311 11.884 8.827 11.6601ZM8.00011 4.16659C7.45064 4.16659 7.00011 4.61711 7.00011 5.16659V8.66659C7.00011 9.21606 7.45064 9.66659 8.00011 9.66659C8.54959 9.66659 9.00011 9.21606 9.00011 8.66659V5.16659C9.00011 4.61711 8.54959 4.16659 8.00011 4.16659Z"
                  fill="currentColor"
                  stroke="currentColor"
                ></path>
              </svg>
              <label class="ml-1 font-medium">Lưu ý</label>
            </div>
            <div class="text-base text-gray-900">
              * Nếu bệnh nhân bận việc không đến khám được vui lòng hủy lịch
              khám đã đặt và đặt lại ngày khác. Xin cảm ơn!
            </div>
          </div>

          <!-- Đặt khám nhanh -->
          <div class="bg-white" id="doctor-booking">
            <details
              open
              class="group [&_summary::-webkit-details-marker]:hidden"
            >
              <summary
                class="flex items-center justify-between cursor-pointer py-4"
              >
                <h2 class="text-lg font-semibold mb-0 pl-4 md:pl-6">
                  Đặt khám nhanh
                </h2>
                <span
                  class="mx-2 flex-shrink-0 rounded-full p-1.5 text-white group-open:text-gray-600 bg-primary group-open:bg-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    class="h-4 w-4 flex-shrink-0 transition duration-300 group-open:-rotate-180"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </span>
              </summary>

              <!-- Date Picker -->
              <div class="px-4 md:px-6 py-4 border-b bg-gray-50">
                <label class="block text-sm font-medium text-gray-700 mb-3">
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    Chọn ngày khám
                  </span>
                </label>
                <div class="relative">
                  <input
                    type="date"
                    v-model="selectedDateValue"
                    @change="onDateChange"
                    :min="minDate"
                    :max="maxDate"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white shadow-sm text-gray-700 font-medium transition-all duration-200 hover:border-primary"
                  />
                  <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
                <p class="text-xs text-gray-500 mt-2">
                  Chọn ngày trong vòng 3 tháng tới
                </p>
              </div>

              <div class="relative px-8 md:px-5">
                <!-- Ngày khám -->
                <div class="h-16 w-full">
                  <div v-if="loadingSchedules" class="flex justify-center items-center h-full">
                    <div class="loader"></div>
                  </div>
                  <div v-else-if="availableDates.length === 0" class="flex justify-center items-center h-full">
                    <p class="text-gray-500">Chưa có lịch khám</p>
                  </div>
                  <div v-else
                    class="flex flex-row overflow-auto hide-scroll-bar scroll"
                  >
                    <div
                      v-for="(date, index) in availableDates"
                      :key="index"
                      :class="[
                        'pl-5 pr-5 flex flex-col items-center py-2 whitespace-nowrap mx-px cursor-pointer',
                        selectedDate === index
                          ? 'border-b-primary bg-blue-50 border-b-4'
                          : '',
                      ]"
                      @click="selectDate(index)"
                    >
                      <p class="font-semibold">{{ date.label }}</p>
                      <span
                        :class="[
                          'text-sm',
                          date.timeSlots && date.timeSlots.length > 0 ? 'text-green-500' : 'text-gray-500',
                        ]"
                      >
                        {{ date.timeSlots ? date.timeSlots.length : 0 }} khung giờ
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Điều hướng lịch -->
                <button
                  aria-label="scroll left"
                  class="absolute bottom-1/2 translate-y-1/2 left-0 bg-white rounded-full p-2 text-gray-500 ring-1 ring-gray-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="48"
                      d="M328 112L184 256l144 144"
                    ></path>
                  </svg>
                </button>
                <button
                  aria-label="scroll right"
                  class="absolute bottom-1/2 translate-y-1/2 right-0 bg-white rounded-full p-2 text-gray-500 ring-1 ring-gray-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="48"
                      d="M184 112l144 144-144 144"
                    ></path>
                  </svg>
                </button>
              </div>

              <!-- Khung giờ khám -->
              <div class="relative">
                <div class="px-2 pt-2 md:px-4 md:pt-4">
                  <div v-if="loadingSchedules" class="text-center py-4">
                    <div class="loader mx-auto"></div>
                    <p class="text-gray-500 mt-2">Đang tải lịch khám...</p>
                  </div>
                  <div v-else-if="availableDates.length === 0" class="text-center py-4">
                    <p class="text-gray-500">Bác sĩ chưa có lịch khám</p>
                  </div>
                  <div v-else-if="availableDates[selectedDate]" class="font-medium">
                    <div class="flex items-center">
                      <img
                        width="20"
                        height="20"
                        loading="lazy"
                        src="@/assets/images/sun-fog.svg"
                        alt="Buổi chiều"
                      />
                      <p class="ml-1 text-sm pr-1">Buổi chiều</p>
                      <div class="h-px w-full bg-slate-200 flex-1"></div>
                    </div>

                    <div
                      class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 py-3 overflow-x-auto max-h-52"
                    >
                      <button
                        v-for="(slot, index) in availableDates[selectedDate]
                          .timeSlots"
                        :key="index"
                        aria-label="Slot"
                        :disabled="!slot.available"
                        :class="[
                          'text-center border rounded-md py-3 tabular-nums transition relative',
                          selectedTimeSlot === slot.time
                            ? 'bg-primary text-white border-primary'
                            : slot.available
                            ? 'hover:text-white hover:border-white hover:bg-primary'
                            : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed',
                        ]"
                        @click="slot.available ? selectTimeSlot(slot.time) : null"
                      >
                        {{ slot.time }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </details>
          </div>

          <!-- Giới thiệu bác sĩ -->
          <div class="max-w-none" v-if="doctorMarkdownHTML">
            <div v-html="doctorMarkdownHTML"></div>
          </div>

          <!-- Bottom navigation -->
          <div
            class="sticky flex z-[90] gap-4 bottom-0 bg-white p-2 md:px-6 md:py-4 border-t border-t-slate-100 md:flex-row"
          >
            <a
              href="tel:19002805"
              class="text-xs md:text-base justify-center flex flex-col"
            >
              <span class="mb-0 leading-3">Hỗ trợ đặt khám </span>
              <span class="font-bold">1900-2805</span>
            </a>
            <div class="flex flex-1 gap-2">
              <button
                @click="bookAppointment(doctor.doctorInfos?.[0])"
                class="flex flex-1 truncate hover:text-white justify-center uppercase px-4 py-3 text-white font-semibold text-sm bg-primary rounded-md"
              >
                Đặt khám ngay
              </button>
            </div>
          </div>
        </main>
      </template>
    </div>

    <!-- Popup thêm hồ sơ -->
    <PopupPatientRecord
      :visible="showPopup"
      :mode="popupMode"
      :record="popupRecord"
      @close="showPopup = false"
      @success="reloadRecords"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import doctorApi from "../api/doctorApi";
import scheduleApi from "../api/scheduleApi";
import { Markdown } from "../model/Markdown";
import SunFog from "../assets/images/sun-fog.svg";
import Message from "@/plugins/message";
import { defineAsyncComponent } from "vue";

// Import popup component
const PopupPatientRecord = defineAsyncComponent(() =>
  import("@/components/common/Popup/PopupPatientRecord.vue")
);

const route = useRoute();
const router = useRouter();

// State
const doctor = ref(null);
const doctorMarkdownHTML = ref("");
const loading = ref(true);
const error = ref("");
const selectedDate = ref(0);
const selectedTimeSlot = ref(null);
const availableDates = ref([]);
const loadingSchedules = ref(false);
const selectedDateValue = ref('');

// Popup state
const showPopup = ref(false);
const popupMode = ref("add");
const popupRecord = ref(null);

// Date picker constraints
const minDate = ref('');
const maxDate = ref('');

// Khởi tạo date constraints
const initializeDateConstraints = () => {
  const today = new Date();
  const maxDateObj = new Date();
  maxDateObj.setMonth(today.getMonth() + 3); // Cho phép đặt lịch trong 3 tháng tới
  
  minDate.value = today.toISOString().split('T')[0];
  maxDate.value = maxDateObj.toISOString().split('T')[0];
  
  // Set default selected date to today
  selectedDateValue.value = minDate.value;
};

// Hàm lấy lịch khám của bác sĩ
const fetchDoctorSchedules = async (doctorSlug, selectedDate = null) => {
  loadingSchedules.value = true;
  
  try {
    console.log('Fetching schedules for doctor:', doctorSlug, 'date:', selectedDate);
    
    // Gọi API thực để lấy schedules với date parameter
    const params = new URLSearchParams();
    if (selectedDate) {
      params.append('date', selectedDate);
    }
    
    const url = selectedDate 
      ? `schedules/doctor/slug/${doctorSlug}?${params.toString()}`
      : `schedules/doctor/slug/${doctorSlug}`;
    
    const response = await scheduleApi.getSchedulesByDoctorSlug(doctorSlug, selectedDate);
    
    if (response.data.succeeded && response.data.data) {
      const groupedSchedules = groupSchedulesByDate(response.data.data);
      availableDates.value = groupedSchedules;
    } else {
      availableDates.value = [];
    }
    
  } catch (error) {
    console.error('Error fetching doctor schedules:', error);
    availableDates.value = [];
  } finally {
    loadingSchedules.value = false;
  }
};

// Hàm nhóm schedules theo ngày
const groupSchedulesByDate = (schedules) => {
  const grouped = schedules.reduce((acc, schedule) => {
    const date = schedule.date;
    if (!acc[date]) {
      acc[date] = {
        label: formatDateLabel(date),
        date: date,
        timeSlots: []
      };
    }
    acc[date].timeSlots.push({
      id: schedule.timeType,
      time: schedule.timeTypeText,
      available: schedule.isActive,
      scheduleId: schedule.id
    });
    return acc;
  }, {});
  
  return Object.values(grouped).sort((a, b) => new Date(a.date) - new Date(b.date));
};

// Hàm format label ngày
const formatDateLabel = (dateString) => {
  const date = new Date(dateString);
  const options = { 
    weekday: 'short', 
    day: '2-digit', 
    month: '2-digit'
  };
  return date.toLocaleDateString('vi-VN', options);
};

// Hàm lấy dữ liệu từ API
const fetchDoctorDetails = async () => {
  loading.value = true;
  error.value = "";

  try {
    const slug = route.params.slug;
    if (!slug) {
      error.value = "Không tìm thấy thông tin bác sĩ";
      loading.value = false;
      return;
    }

    // Gọi API lấy thông tin bác sĩ theo slug
    const response = await doctorApi.getDoctorBySlug(slug);
    console.log(response);
    if (response.succeeded && response.data) {
      doctor.value = response.data;
      
      // Sau khi lấy được doctor, gọi tiếp API lấy markdown
      try {
        const response = await doctorApi.getDoctorMarkdown(doctor.value.doctorId);
        if (response.succeeded && response.data && response.data.contentHTML) {
          doctorMarkdownHTML.value = response.data.contentHTML;
        } else {
          doctorMarkdownHTML.value = "";
        }
      } catch (err) {
        console.log("No markdown content found for doctor");
        doctorMarkdownHTML.value = "";
      }

      // Lấy lịch khám của bác sĩ
      await fetchDoctorSchedules(slug);
    } else {
      error.value = response.message || "Không thể tải thông tin bác sĩ";
    }
  } catch (err) {
    console.error("Lỗi khi lấy thông tin bác sĩ:", err);
    error.value = "Đã xảy ra lỗi khi tải thông tin bác sĩ";
  } finally {
    loading.value = false;
  }
};

// Các hàm xử lý dữ liệu hiển thị
const getTitle = (doctor) => {
  // Lấy chức danh đầy đủ của bác sĩ từ thông tin chi tiết nếu có
  const position = doctor.doctorInfos?.[0]?.positionName;
  if (position) return position;

  // Mặc định là Bác sĩ
  return "Bác sĩ";
};

const getShortTitle = (doctor) => {
  // Lấy chức danh viết tắt của bác sĩ
  const position = doctor.doctorInfos?.[0]?.positionName;
  if (!position) return "BS.";

  // Chuyển đổi chức danh thành viết tắt
  return position
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + ".")
    .join(" ");
};

const getDoctorImage = (doctor) => {
  // Lấy hình ảnh từ thông tin chi tiết nếu có
  const imageUrl = "https://localhost:7038" + doctor.doctorInfos?.[0]?.imageUrl;
  if (imageUrl) return imageUrl;

  // Hình ảnh mặc định nếu không có
  return "https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2023/05/timmach.png?width=300";
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
  return specialties.length > 0 ? specialties : ["Đa khoa"];
};

const getDoctorHospital = (doctor) => {
  // Sử dụng dữ liệu clinics thực từ API
  if (doctor.clinics && doctor.clinics.length > 0) {
    return doctor.clinics[0].name;
  }

  // Fallback: Lấy tên bệnh viện/phòng khám từ thông tin chi tiết
  return doctor.doctorInfos?.[0]?.clinicName || "";
};

// Xử lý chọn ngày
const selectDate = (index) => {
  selectedDate.value = index;
};

// Xử lý chọn khung giờ
const selectTimeSlot = (slot) => {
  selectedTimeSlot.value = slot;

  // Lấy ngày đã chọn
  const dateLabel = availableDates.value[selectedDate.value].label;
  const slug = route.params.slug;

  // Chuyển hướng sang trang appointment-step với thông tin đầy đủ
  router.push({
    path: "/appointment-step",
    query: {
      doctorSlug: slug,
      doctorName: doctor.value?.name || "",
      time: `${dateLabel} ${slot}`,
      date: dateLabel,
      timeSlot: slot,
    },
  });
};

// Hàm đặt lịch khám
const bookAppointment = (doctorInfo) => {
  if (!doctor.value) {
    Message.error("Không tìm thấy thông tin bác sĩ");
    return;
  }

  // Validate đã chọn thời gian chưa
  if (!selectedTimeSlot.value) {
    Message.warning("Vui lòng chọn khung giờ khám trước khi đặt lịch!");
    // Scroll đến phần chọn giờ
    document.getElementById("doctor-booking")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    return;
  }

  const slug = route.params.slug;
  const dateLabel = availableDates.value[selectedDate.value].label;

  // Chuyển hướng đến trang appointment-step với thông tin đầy đủ
  router.push({
    path: "/appointment-step",
    query: {
      doctorSlug: slug,
      doctorId: doctor.value.doctorId,
      doctorName: doctor.value.name,
      clinicName: getDoctorHospital(doctor.value),
      specialty: getDoctorSpecialties(doctor.value)[0] || "",
      date: dateLabel,
      timeSlot: selectedTimeSlot.value,
      time: `${dateLabel} ${selectedTimeSlot.value}`,
    },
  });
};

// Popup functions
const openAddPopup = () => {
  popupMode.value = "add";
  popupRecord.value = null;
  showPopup.value = true;
};

const reloadRecords = () => {
  // Có thể cần reload danh sách hồ sơ nếu có
  Message.success("Thêm hồ sơ mới thành công!");
};

// Xử lý thay đổi date picker
const onDateChange = async () => {
  if (selectedDateValue.value && doctor.value) {
    await fetchDoctorSchedules(route.params.slug, selectedDateValue.value);
    selectedDate.value = 0; // Reset về ngày đầu tiên
    selectedTimeSlot.value = null; // Reset time slot
  }
};

// Hook lifecycle
onMounted(async () => {
  initializeDateConstraints();
  await fetchDoctorDetails();
  
  // Sau khi lấy được doctor, tự động lấy lịch hôm nay
  if (doctor.value) {
    await fetchDoctorSchedules(route.params.slug, selectedDateValue.value);
  }
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

.doctorinfo-label {
  min-width: 90px;
}

.hide-scroll-bar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.hide-scroll-bar::-webkit-scrollbar {
  display: none;
}

.prose {
  max-width: 65ch;
  line-height: 1.75;
}

.prose p {
  margin-top: 1em;
  margin-bottom: 1em;
}

.prose a {
  color: #2563eb;
  text-decoration: underline;
  font-weight: 500;
}

.prose ul {
  margin-top: 1.25em;
  margin-bottom: 1.25em;
  list-style-type: disc;
  padding-left: 1.5em;
}

.prose li {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}
</style>

