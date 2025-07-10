<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-50 flex items-center justify-center bg-[#00000073]"
  >
    <div class="bg-white rounded-lg shadow-lg w-full max-w-lg relative">
      <button
        class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        @click="$emit('close')"
      >
        <span class="text-2xl">&times;</span>
      </button>
      <div class="p-6">
        <h2 class="text-lg font-semibold mb-4">
          {{ mode === "add" ? "Thêm hồ sơ mới" : "Cập nhật hồ sơ" }}
        </h2>
        <form @submit.prevent="handleSubmit">
          <div class="space-y-4">
            <div>
              <label class="block font-medium mb-1"
                >Họ và tên <span class="text-red-500">*</span></label
              >
              <input
                v-model="form.fullName"
                required
                class="input"
                placeholder="Nhập họ và tên"
              />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block font-medium mb-1"
                  >Ngày sinh <span class="text-red-500">*</span></label
                >
                <input
                  v-model="form.dateOfBirth"
                  type="date"
                  required
                  class="input"
                />
              </div>
              <div>
                <label class="block font-medium mb-1"
                  >Giới tính <span class="text-red-500">*</span></label
                >
                <select v-model="form.gender" required class="input">
                  <option value="M">Nam</option>
                  <option value="F">Nữ</option>
                </select>
              </div>
            </div>
            <div>
              <label class="block font-medium mb-1"
                >Địa chỉ <span class="text-red-500">*</span></label
              >
              <input
                v-model="form.address"
                required
                class="input"
                placeholder="Nhập địa chỉ"
              />
            </div>
            <div>
              <label class="block font-medium mb-1"
                >Số điện thoại <span class="text-red-500">*</span></label
              >
              <input
                v-model="form.phone"
                required
                class="input"
                placeholder="Nhập số điện thoại"
              />
            </div>
            <div>
              <label class="block font-medium mb-1">Email</label>
              <input
                v-model="form.email"
                class="input"
                placeholder="Nhập email"
                type="email"
              />
            </div>
          </div>
          <div class="flex justify-end mt-6">
            <button
              type="submit"
              class="bg-primary text-white font-medium rounded-lg px-6 py-2 hover:bg-blue-700 transition"
              :disabled="loading"
            >
              {{
                loading
                  ? "Đang lưu..."
                  : mode === "add"
                  ? "Thêm hồ sơ mới"
                  : "Cập nhật hồ sơ"
              }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import patientRecordApi from "../../../api/patientRecordApi";

const props = defineProps({
  visible: Boolean,
  mode: { type: String, default: "add" }, // add | update
  record: { type: Object, default: null },
});
const emit = defineEmits(["close", "success"]);
const userId = localStorage.getItem("userId");

const loading = ref(false);

const form = ref({
  fullName: "",
  dateOfBirth: "",
  gender: "M",
  address: "",
  userId: userId,
  phone: "",
  email: "",
  patientId: "",
});

// Format date for input type="date" (YYYY-MM-DD)
const formatDateForInput = (date: any) => {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  // Sử dụng getFullYear, getMonth, getDate để tránh timezone offset
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0"); // getMonth() trả về 0-11
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

watch(
  () => props.record,
  (val: any) => {
    if (props.mode === "update" && val) {
      Object.assign(form.value, {
        ...val,
        dateOfBirth: formatDateForInput(val.dateOfBirth),
        userId: userId, // Ensure userId is preserved
      });
    } else if (props.mode === "add") {
      Object.assign(form.value, {
        fullName: "",
        dateOfBirth: "",
        gender: "M",
        address: "",
        userId: userId,
        phone: "",
        email: "",
      });
    }
  },
  { immediate: true }
);

async function handleSubmit() {
  loading.value = true;
  try {
    if (props.mode === "add") {
      await patientRecordApi.create(form.value);
    } else {
      await patientRecordApi.update(form.value.patientId, form.value);
    }
    emit("success");
    emit("close");
  } catch (e) {
    alert("Có lỗi xảy ra!");
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.input {
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 15px;
  outline: none;
  transition: border 0.2s;
}
.input:focus {
  border-color: #2563eb;
}
</style>
