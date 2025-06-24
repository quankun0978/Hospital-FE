<template>
  <section class="bg-slate-50 min-h-screen py-8">
    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center py-16">
      <a-spin size="large" />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center text-red-500 py-8">
      {{ error }}
    </div>

    <!-- Main Content -->
    <div v-else-if="clinic" class="max-w-6xl mx-auto px-4">
      <!-- Breadcrumb -->
      <nav aria-label="breadcrumb" class="mb-6">
        <ol role="list" class="flex flex-wrap space-x-2 text-sm">
          <li>
            <router-link to="/" class="hover:text-primary">Trang chủ</router-link>
          </li>
          <li>
            <span class="text-gray-300">/</span>
          </li>
          <li>
            <router-link to="/clinics" class="hover:text-primary">
              {{ clinic.isHospital ? "Bệnh viện" : "Phòng khám" }}
            </router-link>
          </li>
          <li>
            <span class="text-gray-300">/</span>
          </li>
          <li>
            <router-link :to="`/clinics/${route.params.slug}`" class="hover:text-primary">
              {{ clinic.name }}
            </router-link>
          </li>
          <li>
            <span class="text-gray-300">/</span>
          </li>
          <li class="text-gray-600">Bác sĩ</li>
        </ol>
      </nav>

      <!-- Header -->
      <div class="bg-white rounded-lg p-6 mb-6 shadow-sm">
        <div class="flex items-center gap-4">
          <img
            v-if="clinic.logoImg"
            :src="getClinicLogo()"
            :alt="clinic.name"
            class="w-16 h-16 object-contain rounded-lg"
          />
          <div>
            <h1 class="text-2xl font-bold text-gray-800">
              Bác sĩ tại {{ clinic.name }}
            </h1>
            <p class="text-gray-600 mt-1">
              {{ clinic.address }}
            </p>
            <div class="flex items-center gap-2 mt-2">
              <span
                :class="[
                  'inline-block px-3 py-1 text-xs rounded-full',
                  clinic.isHospital
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
                ]"
              >
                {{ clinic.isHospital ? 'Bệnh viện' : 'Phòng khám' }}
              </span>
              <span class="text-sm text-gray-500">
                {{ doctors.length }} bác sĩ
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Danh sách bác sĩ -->
      <div v-if="doctors.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="doctor in doctors"
          :key="doctor.doctorId"
          class="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <!-- Ảnh bác sĩ -->
          <div class="flex flex-col items-center text-center">
            <div class="relative w-24 h-24 rounded-full overflow-hidden mb-4 bg-gray-100">
              <img
                :src="getDoctorImage(doctor)"
                :alt="doctor.doctorName"
                class="w-full h-full object-cover"
                @error="handleImageError"
              />
            </div>

            <!-- Thông tin bác sĩ -->
            <h3 class="text-lg font-semibold text-gray-800 mb-2">
              {{ getFullDoctorTitle(doctor) }} {{ doctor.doctorName }}
            </h3>

            <!-- Chức vụ -->
            <p v-if="doctor.positionName" class="text-sm text-blue-600 mb-2 font-medium">
              {{ doctor.positionName }}
            </p>

            <!-- Giá khám -->
            <p v-if="doctor.priceName" class="text-sm text-gray-600 mb-4">
              Phí khám: {{ doctor.priceName }}
            </p>

            <!-- Ghi chú -->
            <p v-if="doctor.note" class="text-sm text-gray-500 mb-4 line-clamp-2">
              {{ doctor.note }}
            </p>

            <!-- Actions -->
            <div class="flex gap-2 w-full">
              <button
                @click="viewDoctorDetail(doctor)"
                class="flex-1 px-4 py-2 text-sm border border-primary text-primary rounded-lg hover:bg-blue-50 transition-colors"
              >
                Xem chi tiết
              </button>
              <button
                @click="bookAppointment(doctor)"
                class="flex-1 px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Đặt lịch ngay
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="bg-white rounded-lg p-12 text-center shadow-sm">
        <div class="text-gray-400 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          Hiện tại chưa có bác sĩ
        </h3>
        <p class="text-gray-500">
          {{ clinic.name }} hiện chưa có thông tin bác sĩ. Vui lòng quay lại sau.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import clinicApi from "../api/clinicApi";
import Message from "@/plugins/message";

const route = useRoute();
const router = useRouter();

// State
const clinic = ref(null);
const doctors = ref([]);
const loading = ref(true);
const error = ref("");

// Lấy dữ liệu clinic và danh sách bác sĩ
const fetchClinicDoctors = async () => {
  loading.value = true;
  error.value = "";

  try {
    const slug = route.params.slug;
    if (!slug) {
      error.value = "Không tìm thấy thông tin cơ sở y tế";
      loading.value = false;
      return;
    }

    // Gọi API lấy thông tin clinic
    const response = await clinicApi.getBySlug(slug);

    if (response.succeeded && response.data) {
      clinic.value = response.data;
      doctors.value = response.data.doctors || [];
      console.log("Clinic data:", clinic.value);
      console.log("Doctors:", doctors.value);
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

// Hàm lấy logo clinic
const getClinicLogo = () => {
  if (clinic.value?.logoImg) {
    return "https://localhost:7038" + clinic.value.logoImg;
  }
  return "https://cdn.youmed.vn/photos/fb4179f1-d0e9-4e2a-98a2-26e6efe7add8.png";
};

// Hàm lấy ảnh bác sĩ
const getDoctorImage = (doctor) => {
  if (doctor.imageUrl) {
    return "https://localhost:7038" + doctor.imageUrl;
  }
  return "https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2023/05/timmach.png?width=300";
};

// Hàm xử lý lỗi ảnh
const handleImageError = (event) => {
  event.target.src = "https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2023/05/timmach.png?width=300";
};

// Hàm lấy tiêu đề đầy đủ của bác sĩ
const getFullDoctorTitle = (doctor) => {
  if (doctor.positionName) {
    // Nếu đã có chức vụ thì không cần thêm "Bác sĩ"
    return "";
  }
  return "Bác sĩ";
};

// Hàm xem chi tiết bác sĩ
const viewDoctorDetail = (doctor) => {
  if (doctor.slug) {
    router.push(`/doctors/${doctor.slug}`);
  } else {
    Message.warning("Không tìm thấy thông tin chi tiết bác sĩ");
  }
};

// Hàm đặt lịch khám
const bookAppointment = (doctor) => {
  if (doctor.slug) {
    router.push(`/doctors/${doctor.slug}`);
  } else {
    Message.warning("Không thể đặt lịch khám cho bác sĩ này");
  }
};

// Hook lifecycle
onMounted(() => {
  fetchClinicDoctors();
});
</script>

<style scoped>
.text-primary {
  color: #2563eb;
}

.bg-primary {
  background-color: #2563eb;
}

.border-primary {
  border-color: #2563eb;
}

.hover\:bg-blue-50:hover {
  background-color: #eff6ff;
}

.hover\:bg-blue-600:hover {
  background-color: #2563eb;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 