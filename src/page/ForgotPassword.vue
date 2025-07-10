<template>
  <div class="forgot-password-page">
    <div class="max-w-7xl mx-auto md:px-6 py-10 lg:py-32 md:grid md:grid-cols-12">
      <div class="md:flex md:col-span-6 lg:col-span-7">
        <a href="/" target="_blank">
          <img
            width="500"
            height="500"
            loading="lazy"
            src="https://youmed.vn/dat-kham/assets/img/booking/png/Login.png"
            alt="Đăng nhập"
            class="mx-auto"
          />
        </a>
      </div>
      <div class="md:col-span-6 lg:col-span-5">
        <div class="bg-white md:rounded-lg p-6 md:ring-1 ring-slate-100 md:max-w-md">
          <h1 class="text-2xl font-bold mb-6 text-center">Quên mật khẩu</h1>
          
          <!-- Thông báo lỗi chung -->
          <div v-if="formError" class="message error">
            {{ formError }}
          </div>

          <!-- Success message -->
          <div v-if="successMessage" class="message success">
            {{ successMessage }}
          </div>
          
          <form @submit.prevent="handleSubmit" class="flex flex-col gap-6">
            <div class="space-y-4">
              <Input
                v-model="email"
                id="forgot-password-email"
                type="email"
                :label="'Địa chỉ email'"
                :placeholder="'Nhập email của bạn'"
              />
            </div>
            
            <AppButton
              type="submit"
              variant="primary"
              :fullWidth="true"
              :disabled="isLoading"
            >
              <span v-if="isLoading">Đang gửi...</span>
              <span v-else>Gửi link đặt lại mật khẩu</span>
            </AppButton>

            <div class="text-center text-sm p-6 border-t mt-8">
              <router-link to="/login" class="font-medium cursor-pointer text-primary">
                Quay lại đăng nhập
              </router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Input from '../components/common/Input/Input.vue';
import AppButton from '../components/common/Button/Button.vue';
import { authApi } from '../api/authApi';
import Message from '../plugins/message.ts';

const email = ref('');
const isLoading = ref(false);
const successMessage = ref('');
const formError = ref('');

const validateForm = () => {
  formError.value = '';
  
  if (!email.value) {
    formError.value = 'Vui lòng nhập địa chỉ email';
    return false;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    formError.value = 'Địa chỉ email không hợp lệ';
    return false;
  }
  
  return true;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  isLoading.value = true;
  successMessage.value = '';
  formError.value = '';

  try {
    const response = await authApi.forgotPassword({ email: email.value });
    
    if (response.succeeded) {
      successMessage.value = response.message || 'Link đặt lại mật khẩu đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư.';
      email.value = ''; // Clear form
      Message.success('Email đặt lại mật khẩu đã được gửi!');
    } else {
      formError.value = response.message || 'Có lỗi xảy ra khi gửi email reset password';
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    formError.value = 'Có lỗi xảy ra. Vui lòng thử lại sau.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.forgot-password-page {
  --tw-bg-opacity: 1;
  background-color: rgb(249 250 251 / var(--tw-bg-opacity));
}

.message {
  padding: 10px;
  border-radius: 4px;
  background-color: #e3f2fd;
  color: #2196f3;
  font-size: 14px;
  margin-bottom: 1rem;
}

.message.error {
  background-color: #ffebee;
  color: #e53935;
}

.message.success {
  background-color: #e8f5e8;
  color: #2e7d32;
}

.text-primary {
  color: #2563eb;
}
</style> 

