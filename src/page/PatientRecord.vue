<template>
  <section class="bg-gray-100">
    <div
      class="max-w-7xl mx-auto md:p-4 grid grid-cols-1 md:grid-cols-12 md:gap-4 lg:py-10"
    >
      <div class="col-span-1 md:col-span-3">
        <div class="bg-white md:rounded-md">
          <ul class="flex overflow-y-auto hide-scroll-bar md:py-4 md:flex-col">
            <li v-if="isAdminOrDoctor">
              <router-link class="menu-item" to="/admin">Trang quản lý</router-link>
            </li>
            <li>
              <router-link class="menu-item" to="/appointments">Lịch khám của tôi</router-link>
            </li>
            <li>
              <router-link class="menu-item item-active" to="/patient-record">Hồ sơ</router-link>
            </li>
            <li>
              <router-link class="menu-item" to="/change-password">Đổi mật khẩu</router-link>
            </li>
            <li>
              <button class="menu-item w-full text-left" @click="logout">Đăng xuất</button>
            </li>
          </ul>
        </div>
      </div>
      <!-- Main content -->
      <main class="flex-1 flex flex-col md:flex-row md:col-span-9 rounded-lg">
        <!-- Danh sách hồ sơ -->
        <div class="bg-white shadow w-1/3 flex flex-col">
          <div class="p-4 border-b">
            <input
              v-model="searchQuery"
              placeholder="Tìm nhanh hồ sơ"
              type="search"
              class="w-full placeholder:text-sm rounded border border-gray-200 bg-white focus:shadow"
            />
          </div>
          <div class="overflow-y-auto max-h-[400px] lg:max-h-[600px]">
            <div
              v-for="(record, idx) in patientRecords"
              :key="record.patientId"
              class="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50"
              :class="{
                'bg-gray-50':
                  selectedRecord &&
                  selectedRecord.patientId === record.patientId,
              }"
              @click="selectRecord(record)"
            >
              <div class="relative w-12 h-12">
                <img :src="BlockFamily" alt="Primary" class="w-12 h-12" />
                <!-- <img :src="idx === 0 ? '/assets/img/booking/svg/Family-Block.svg' : '/assets/img/booking/svg/bulkFolder.svg'" alt="Primary" class="w-12 h-12" /> -->
                <div class="absolute inset-0 flex items-center justify-center">
                  <span
                    class="absolute z-10 w-8 h-8 rounded-full bg-[#22d3ee]"
                  ></span>
                  <div class="absolute z-20 text-sm text-white font-bold">
                    {{ getInitials(record.fullName) }}
                  </div>
                  <span
                    v-if="idx === 0"
                    class="absolute z-20 text-xs bg-gray-400 rounded-full -top-1 right-0 text-white px-1"
                    >Tôi</span
                  >
                  <span
                    v-else
                    class="absolute z-20 text-xs bg-gray-400 rounded-full -top-1 right-0 text-white px-1"
                    >Cha</span
                  >
                </div>
              </div>
              <div class="flex flex-col">
                <h2 class="font-medium text-base">{{ record.fullName }}</h2>
                <p class="text-gray-600 text-sm">
                  {{ formatDate(record.dateOfBirth) }}
                </p>
              </div>
            </div>
          </div>
          <div class="p-4 border-t">
            <button
              class="w-full bg-[#e6f0fd] text-primary font-medium rounded-lg py-2 hover:bg-primary hover:text-white transition"
              @click="openAddPopup"
            >
              Thêm hồ sơ
            </button>
          </div>
        </div>
        <!-- Chi tiết hồ sơ -->
        <div class="bg-white shadow flex-1 min-w-[320px] flex flex-col">
          <div v-if="selectedRecord">
            <div class="p-6 flex gap-4 items-center border-b">
              <div
                class="relative flex items-center justify-center w-16 h-16 rounded-full bg-[#22d3ee]"
              >
                <div class="absolute text-xl text-white font-bold">
                  {{ getInitials(selectedRecord.fullName) }}
                </div>
              </div>
              <div>
                <h3 class="text-lg font-bold uppercase">
                  {{ selectedRecord.fullName }}
                </h3>
                <p class="text-gray-500 text-sm">
                  Mã BN: {{ selectedRecord.patientCode || "--" }}
                </p>
              </div>
            </div>
            <div class="bg-orange-50 p-3 flex flex-row items-center border-b">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.24331 4.33318L3.24367 4.33298L7.19472 2.04762C7.19509 2.04741 7.19545 2.0472 7.19581 2.047C7.69601 1.76168 8.3058 1.76315 8.79663 2.04649C8.79664 2.0465 8.79665 2.04651 8.79667 2.04651L12.7533 4.33124C12.7539 4.33155 12.7544 4.33185 12.7549 4.33215C13.2494 4.62345 13.5542 5.1472 13.56 5.72248V10.2802C13.56 10.8559 13.2544 11.3836 12.7633 11.6671L12.7633 11.6672L8.80525 13.9527C8.80493 13.9529 8.8046 13.9531 8.80427 13.9533C8.30404 14.2387 7.69418 14.2372 7.20331 13.9538L3.24506 11.6682C2.75048 11.3768 2.44666 10.847 2.44666 10.2802V5.72016C2.44666 5.14444 2.75224 4.61669 3.24331 4.33318ZM8.82687 11.6604L8.83617 11.6511L8.84497 11.6413C8.94141 11.5342 9.01905 11.4131 9.07486 11.2791C9.1295 11.148 9.16666 10.996 9.16666 10.8335C9.16666 10.6737 9.13072 10.5241 9.07756 10.3944C9.01633 10.2379 8.93146 10.1218 8.84497 10.0257L8.83617 10.0159L8.82688 10.0066C8.50044 9.68017 7.99409 9.57313 7.55766 9.75719C7.40282 9.81832 7.28761 9.90262 7.19217 9.98851L7.1824 9.99731L7.1731 10.0066C6.94742 10.2323 6.83332 10.5352 6.83332 10.8335C6.83332 10.9699 6.85412 11.1248 6.91845 11.2791L6.92507 11.295L6.93278 11.3104C6.98794 11.4208 7.05838 11.5339 7.15501 11.6413L7.17261 11.6609L7.19217 11.6785C7.28827 11.765 7.40442 11.8498 7.56089 11.9111C7.69054 11.9642 7.84017 12.0002 7.99999 12.0002C8.30764 12.0002 8.60299 11.8843 8.82687 11.6604ZM7.99999 4.16683C7.45051 4.16683 6.99999 4.61735 6.99999 5.16683V8.66683C6.99999 9.21631 7.45051 9.66683 7.99999 9.66683C8.54946 9.66683 8.99999 9.21631 8.99999 8.66683V5.16683C8.99999 4.61735 8.54946 4.16683 7.99999 4.16683Z"
                  fill="#F97316"
                  stroke="#F97316"
                ></path>
              </svg>
              <p class="ml-1 text-sm">
                Hoàn thiện thông tin để đặt khám và quản lý hồ sơ y tế được tốt
                hơn.
              </p>
            </div>
            <div class="p-6 space-y-3">
              <h4 class="font-medium">Thông tin cơ bản</h4>
              <div class="flex justify-between">
                <span class="whitespace-nowrap mr-2">Họ và tên</span
                ><span class="font-medium text-right">{{
                  selectedRecord.fullName
                }}</span>
              </div>
              <div class="flex justify-between">
                <span class="whitespace-nowrap mr-2">Điện thoại</span
                ><span class="font-medium text-right">{{
                  selectedRecord.phone
                }}</span>
              </div>
              <div class="flex justify-between">
                <span class="whitespace-nowrap mr-2">Ngày sinh</span
                ><span class="font-medium text-right">{{
                  formatDate(selectedRecord.dateOfBirth)
                }}</span>
              </div>
              <div class="flex justify-between">
                <span class="whitespace-nowrap mr-2">Giới tính</span
                ><span class="font-medium text-right">{{
                  selectedRecord.gender === "M"
                    ? "Nam"
                    : selectedRecord.gender === "F"
                    ? "Nữ"
                    : "--"
                }}</span>
              </div>
              <div class="flex justify-between">
                <span class="whitespace-nowrap mr-2">Địa chỉ</span
                ><span class="font-medium text-right">{{
                  selectedRecord.address
                }}</span>
              </div>
            </div>
            <div class="p-6 space-y-3">
              <h4 class="font-medium">Thông tin bổ sung</h4>
              <div class="flex justify-between">
                <span class="whitespace-nowrap mr-2">Mã BHYT</span
                ><span class="font-medium text-right">{{
                  selectedRecord.healthInsuranceNumber || "--"
                }}</span>
              </div>
              <div class="flex justify-between">
                <span class="whitespace-nowrap mr-2">Số CMND/CCCD</span
                ><span class="font-medium text-right">{{
                  selectedRecord.identityNumber || "--"
                }}</span>
              </div>
              <div class="flex justify-between">
                <span class="whitespace-nowrap mr-2">Dân tộc</span
                ><span class="font-medium text-right">{{
                  selectedRecord.ethnicity || "--"
                }}</span>
              </div>
              <div class="flex justify-between">
                <span class="whitespace-nowrap mr-2">Nghề nghiệp</span
                ><span class="font-medium text-right">{{
                  selectedRecord.occupation || "--"
                }}</span>
              </div>
              <div class="flex justify-between">
                <span class="whitespace-nowrap mr-2">Email</span
                ><span class="font-medium text-right">{{
                  selectedRecord.email || "--"
                }}</span>
              </div>
            </div>
            <div class="p-6 flex justify-end">
              <button
                class="bg-primary text-white font-medium rounded-lg px-6 py-2 hover:bg-blue-700 transition"
                @click="openUpdatePopup"
              >
                Thay đổi thông tin
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
    <PopupPatientRecord
      :visible="showPopup"
      :mode="popupMode"
      :record="popupRecord"
      @close="showPopup = false"
      @success="reloadRecords"
    />
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, defineAsyncComponent } from "vue";
import { useRouter } from 'vue-router';
import patientRecordApi from "../api/patientRecordApi";
import { useAuthStore } from '../store/auth';
import BlockFamily from "../assets/images/family-block.svg";
const PopupPatientRecord = defineAsyncComponent(
  () => import("../components/common/Popup/PopupPatientRecord.vue")
);

const router = useRouter();
const authStore = useAuthStore();

const searchQuery = ref("");
const patientRecords = ref<any[]>([]);
const selectedRecord = ref<any | null>(null);

const showPopup = ref(false);
const popupMode = ref<"add" | "update">("add");
const userId = localStorage.getItem("userId");
const popupRecord = ref<any>(null);

// Kiểm tra quyền admin hoặc doctor
const isAdminOrDoctor = computed(() => {
  const userRole = authStore.getUserRole;
  return userRole === 'R1' || userRole === 'R2';
});

// Đăng xuất
const logout = () => {
  authStore.logout();
  router.push('/');
};

function getInitials(name: string) {
  if (!name) return "";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
function formatDate(date: string | Date | null) {
  if (!date) return "--";
  const d = new Date(date);
  return d.toLocaleDateString("vi-VN");
}
function selectRecord(record: any) {
  selectedRecord.value = record;
}

function openAddPopup() {
  popupMode.value = "add";
  popupRecord.value = null;
  showPopup.value = true;
}
function openUpdatePopup() {
  if (!selectedRecord.value) return;
  popupMode.value = "update";
  popupRecord.value = { ...selectedRecord.value };
  showPopup.value = true;
}
async function reloadRecords() {
  // const userId = localStorage.getItem('userId');
  const res = await patientRecordApi.getByUserId(userId);
  patientRecords.value = Array.isArray(res) ? res : [res];
  selectedRecord.value = patientRecords.value[0] || null;
}

onMounted(async () => {
  // Giả sử đã có userId, thực tế lấy từ store hoặc localStorage
  const userId = localStorage.getItem("userId");
  //   if (userId) {
  const res = await patientRecordApi.getByUserId(userId);
  patientRecords.value = Array.isArray(res) ? res : [res];
  selectedRecord.value = patientRecords.value[0] || null;
  //   }
});
</script>

<style scoped>
.menu-item {
  display: block;
  padding: 14px 24px;
  color: #222;
  font-weight: 500;
  border-left: 3px solid transparent;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}
.menu-item:hover {
  background: #f1f5f9;
  color: #2563eb;
}
.item-active {
  color: #2563eb;
  background: #e6f0fd;
  border-left: 3px solid #2563eb;
}
</style>
