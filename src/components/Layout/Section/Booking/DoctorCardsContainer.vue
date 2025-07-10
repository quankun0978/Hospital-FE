<template>
  <div class="doctor-cards-container" :class="{ loading: loading }">
    <div v-if="loading" class="flex justify-center items-center py-8">
      <div class="loader"></div>
    </div>
    <div v-else-if="error" class="text-center text-red-500 py-4">
      {{ error }}
    </div>
    <template v-else>
      <DoctorCard
        v-for="doctor in doctors"
        :key="doctor.doctorId"
        :name="doctor.name"
        :title="getTitle(doctor)"
        :image="getDoctorImage(doctor)"
        :link="`/doctors/${doctor.doctorInfos[0].slug}`"
        :specialties="getDoctorSpecialties(doctor)"
        :hospital="getDoctorHospital(doctor)"
      />
      <div v-if="doctors.length === 0" class="text-center text-gray-500 py-4">
        Không có bác sĩ nào
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import DoctorCard from "./DoctorCard.vue";
import doctorApi from "@/api/doctorApi";
import { getImage } from "@/common/function";
// Props
const props = defineProps({
  limit: {
    type: Number,
    default: 10,
  },
  searchTerm: {
    type: String,
    default: "",
  },
});

// State
const doctors = ref([]);
const loading = ref(true);
const error = ref("");

// Hàm lấy dữ liệu từ API
const fetchDoctors = async () => {
  loading.value = true;
  error.value = "";

  try {
    // Thiết lập các tham số phân trang
    const parameters = {
      pageNumber: 1,
      pageSize: props.limit,
      search: props.searchTerm || undefined,
    };

    // Gọi API
    const response = await doctorApi.getDoctors(parameters);

    if (response.data) {
      doctors.value = response.data || [];
    } else {
      error.value = response.message || "Lỗi khi tải dữ liệu";
    }
  } catch (err) {
    console.error("Lỗi khi lấy dữ liệu bác sĩ:", err);
    error.value = "Lỗi khi tải dữ liệu";
  } finally {
    loading.value = false;
  }
};

// Các hàm xử lý dữ liệu hiển thị
const getTitle = (doctor) => {
  // Lấy chức danh của bác sĩ từ thông tin chi tiết nếu có
  const position = doctor.doctorInfos?.[0]?.positionName;
  if (position) return position;
  console.log(doctor);
  // Mặc định là BS.
  return "BS.";
};

const getDoctorImage = (doctor) => {
  // Lấy hình ảnh từ thông tin chi tiết nếu có
  return getImage(doctor.doctorInfos?.[0]?.imageUrl);
};

const getDoctorSpecialties = (doctor) => {
  // Trong thực tế, specialties có thể được lấy từ một API khác hoặc từ hệ thống phân loại
  // Tạm thời, chúng ta có thể dựa vào priceId hoặc positionName để xác định chuyên khoa
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
  // Lấy tên bệnh viện/phòng khám từ thông tin chi tiết
  return doctor.doctorInfos?.[0]?.clinicName || "";
};

// Hook lifecycle
onMounted(() => {
  fetchDoctors();
});
</script>

<style scoped>
.doctor-cards-container {
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
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
