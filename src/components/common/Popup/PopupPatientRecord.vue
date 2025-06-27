<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center bg-[#00000073]">
    <div class="bg-white rounded-lg shadow-lg w-full max-w-lg relative">
      <button class="absolute top-4 right-4 text-gray-400 hover:text-gray-600" @click="$emi"Text"">
        <span class="text-2xl">&times;</span>
      </button>
      <div class="p-6">
        <h2 class="text-lg font-semibold mb-4">{{ mode === 'add' ? 'ThÃªm há»“ sÆ¡ má»›i' : 'Cáº­p nháº­t há»“ sÆ¡' }}</h2>
        <form @submit.prevent="handleSubmit">
          <div class="space-y-4">
            <div>
              <label class="block font-medium mb-1">Há» vÃ  tÃªn <span class="text-red-500">*</span></label>
              <input v-model="form.fullName" required class="input" placeholder="Nháº­p há» vÃ  tÃªn" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block font-medium mb-1">NgÃ y sinh <span class="text-red-500">*</span></label>
                <input v-model="form.dateOfBirth" type="date" required class="input" />
              </div>
              <div>
                <label class="block font-medium mb-1">Giá»›i tÃ­nh <span class="text-red-500">*</span></label>
                <select v-model="form.gender" required class="input">
                  <option value="M">Nam</option>
                  <option value="F">Ná»¯</option>
                </select>
              </div>
            </div>
            <div>
              <label class="block font-medium mb-1">Äá»‹a chá»‰ <span class="text-red-500">*</span></label>
              <input v-model="form.address" required class="input" placeholder="Nháº­p Ä‘á»‹a chá»‰" />
            </div>
            <div>
              <label class="block font-medium mb-1">Sá»‘ Ä‘iá»‡n thoáº¡i <span class="text-red-500">*</span></label>
              <input v-model="form.phone" required class="input" placeholder="Nháº­p sá»‘ Ä‘iá»‡n thoáº¡i" />
            </div>
            <div>
              <label class="block font-medium mb-1">Email</label>
              <input v-model="form.email" class="input" placeholder="Nháº­p email" type="email" />
            </div>
            <div>
              <label class="block font-medium mb-1">MÃ£ tháº» BHYT</label>
              <input v-model="form.healthInsuranceNumber" class="input" placeholder="Nháº­p mÃ£ tháº» BHYT" />
            </div>
          </div>
          <div class="flex justify-end mt-6">
            <button type="submit" class="bg-primary text-white font-medium rounded-lg px-6 py-2 hover:bg-blue-700 transition" :disabled="loading">
              {{ loading ? 'Äang lÆ°u...' : (mode === 'add' ? 'ThÃªm há»“ sÆ¡ má»›i' : 'Cáº­p nháº­t há»“ sÆ¡') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import patientRecordApi from '../../../api/patientRecordApi';

const props = defineProps({
  visible: Boolean,
  mode: { type: String, default: 'add' }, // add | update
  record: { type: Object, default: null },
});
const emit = defineEmits(['close', 'success']);
const userId = localStorage.getItem("userId");

const loading = ref(false);

const form = ref({
  fullName: '',
  dateOfBirth: '',
  gender: 'M',
  address: '',
  userId: userId,
  phone: '',
  email: '',
  healthInsuranceNumber: '',
  patientId: '',
});

// Format date for input type="date" (YYYY-MM-DD)
const formatDateForInput = (date: any) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  // Sá»­ dá»¥ng getFullYear, getMonth, getDate Ä‘á»ƒ trÃ¡nh timezone offset
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStar"Text"; // getMonth() tráº£ vá» 0-11
  const day = String(d.getDate()).padStar"Text";
  
  return `${year}-${month}-${day}`;
};

watch(() => props.record, (val: any) => {
  if (props.mode === 'update' && val) {
    Object.assign(form.value, {
      ...val,
      dateOfBirth: formatDateForInpu"Text",
      userId: userId, // Ensure userId is preserved
    });
  } else if (props.mode === 'add') {
    Object.assign(form.value, {
      fullName: '', dateOfBirth: '', gender: 'M', address: '', userId: userId, phone: '', email: '', healthInsuranceNumber: '',
    });
  }
}, { immediate: true });

async function handleSubmit() {
  loading.value = true;
  try {
    if (props.mode === 'add') {
      await patientRecordApi.create(form.value);
    } else {
      await patientRecordApi.update(form.value.patientId, form.value);
    }
    emi"Text";
    emi"Text";
  } catch (e) {
    aler"Text";
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

