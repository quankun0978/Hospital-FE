<template>
  <div class="max-w-7xl mx-auto px-4 py-10 lg:py-20">
    <div class="max-w-md mx-auto bg-white rounded-lg p-8 shadow-sm">
      <h1 class="text-2xl font-bold mb-6 text-center">
        {{ isChangePassword ? 'Đổi mật khẩu' : 'Đặt lại mật khẩu' }}
      </h1>
      
      <!-- Loading state -->
      <div v-if="isValidatingToken" class="text-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p class="mt-2 text-gray-600">Đang xác thực token...</p>
      </div>

      <!-- Invalid token message -->
      <div v-else-if="!isValidToken && !isChangePassword" class="text-center py-8">
        <div class="text-red-500 mb-4">
          <svg class="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
        </div>
        <p class="text-red-700 font-medium">Token không hợp lệ hoặc đã hết hạn</p>
        <p class="text-gray-600 mt-2">Vui lòng yêu cầu một liên kết đặt lại mật khẩu mới.</p>
        <router-link to="/forgot-password" class="inline-block mt-4 text-primary hover:underline">
          Yêu cầu liên kết mới
        </router-link>
      </div>

      <!-- Reset/Change Password Form -->
      <form v-else @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Current Password (only for change password) -->
        <CustomInput
          v-if="isChangePassword"
          v-model="currentPassword"
          id="current-password"
          type="password"
          label="Mật khẩu hiện tại"
          placeholder="Nhập mật khẩu hiện tại"
          :error="currentPasswordError"
        />

        <!-- New Password -->
        <CustomInput
          v-model="newPassword"
          id="new-password"
          type="password"
          label="Mật khẩu mới"
          placeholder="Nhập mật khẩu mới"
          :error="newPasswordError"
        />

        <!-- Confirm Password -->
        <CustomInput
          v-model="confirmPassword"
          id="confirm-password"
          type="password"
          label="Xác nhận mật khẩu"
          placeholder="Nhập lại mật khẩu mới"
          :error="confirmPasswordError"
        />

        <!-- Password Requirements -->
        <div class="text-sm text-gray-600">
          <p class="font-medium mb-2">Yêu cầu mật khẩu:</p>
          <ul class="space-y-1 text-xs">
            <li class="flex items-center">
              <span :class="passwordChecks.length ? 'text-green-600' : 'text-gray-400'">
                {{ passwordChecks.length ? '✓' : '•' }}
              </span>
              <span class="ml-2">Ít nhất 6 ký tự</span>
            </li>
            <li class="flex items-center">
              <span :class="passwordChecks.hasUpperCase ? 'text-green-600' : 'text-gray-400'">
                {{ passwordChecks.hasUpperCase ? '✓' : '•' }}
              </span>
              <span class="ml-2">Có ít nhất 1 chữ hoa</span>
            </li>
            <li class="flex items-center">
              <span :class="passwordChecks.hasLowerCase ? 'text-green-600' : 'text-gray-400'">
                {{ passwordChecks.hasLowerCase ? '✓' : '•' }}
              </span>
              <span class="ml-2">Có ít nhất 1 chữ thường</span>
            </li>
            <li class="flex items-center">
              <span :class="passwordChecks.hasNumber ? 'text-green-600' : 'text-gray-400'">
                {{ passwordChecks.hasNumber ? '✓' : '•' }}
              </span>
              <span class="ml-2">Có ít nhất 1 số</span>
            </li>
          </ul>
        </div>
        
        <AppButton
          type="submit"
          variant="primary"
          :fullWidth="true"
          :disabled="isLoading"
        >
          <span v-if="isLoading">Đang xử lý...</span>
          <span v-else>
            {{ isChangePassword ? 'Đổi mật khẩu' : 'Đặt lại mật khẩu' }}
          </span>
        </AppButton>
      </form>

      <!-- Success message -->
      <div v-if="successMessage" class="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
        <p class="text-green-700 text-sm">{{ successMessage }}</p>
        <div class="mt-3 text-center">
          <router-link to="/login" class="text-primary text-sm font-medium hover:underline">
            Quay lại đăng nhập
          </router-link>
        </div>
      </div>

      <!-- Error message -->
      <div v-if="errorMessage" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
        <p class="text-red-700 text-sm">{{ errorMessage }}</p>
      </div>
      
      <!-- Navigation links -->
      <div v-if="!successMessage" class="mt-6 text-center space-x-4">
        <router-link to="/login" class="text-primary text-sm font-medium">
          Quay lại đăng nhập
        </router-link>
        <span class="text-gray-400">|</span>
        <router-link to="/forgot-password" class="text-primary text-sm font-medium">
          Yêu cầu liên kết mới
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import CustomInput from '../components/common/Input/Input.vue';
import AppButton from '../components/common/Button/Button.vue';
import { authApi } from '../api/authApi';
import { userApi } from '../api/userApi';
import { useAuthStore } from '../store/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

// Form fields
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

// Form errors
const currentPasswordError = ref('');
const newPasswordError = ref('');
const confirmPasswordError = ref('');

// Form state
const isLoading = ref(false);
const isValidatingToken = ref(false);
const isValidToken = ref(true);
const successMessage = ref('');
const errorMessage = ref('');

// Determine mode: reset password (with token) or change password (for logged in user)
const isChangePassword = computed(() => {
  return !route.query.token && authStore.isAuthenticated;
});

// Password validation
const passwordChecks = computed(() => {
  const password = newPassword.value;
  return {
    length: password.length >= 6,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
  };
});

// Watch for password changes to clear errors
watch([newPassword, confirmPassword], () => {
  newPasswordError.value = '';
  confirmPasswordError.value = '';
});

watch(currentPassword, () => {
  currentPasswordError.value = '';
});

// Validate token on mount (for reset password mode)
onMounted(async () => {
  if (!isChangePassword.value) {
    const token = route.query.token;
    if (!token) {
      isValidToken.value = false;
      return;
    }

    await validateToken(token);
  } 
});

const validateToken = async (token) => {
  try {
    isValidatingToken.value = true;
    const response = await authApi.validateResetToken(token);
    
    if (response.succeeded) {
      isValidToken.value = true;
    } else {
      isValidToken.value = false;
    }
  } catch (error) {
    console.error('Token validation error:', error);
    isValidToken.value = false;
  } finally {
    isValidatingToken.value = false;
  }
};

const validateForm = () => {
  let isValid = true;
  
  // Clear previous errors
  currentPasswordError.value = '';
  newPasswordError.value = '';
  confirmPasswordError.value = '';
  errorMessage.value = '';

  // Validate current password (for change password mode)
  if (isChangePassword.value && !currentPassword.value) {
    currentPasswordError.value = 'Mật khẩu hiện tại là bắt buộc';
    isValid = false;
  }

  // Validate new password
  if (!newPassword.value) {
    newPasswordError.value = 'Mật khẩu mới là bắt buộc';
    isValid = false;
  } else if (newPassword.value.length < 6) {
    newPasswordError.value = 'Mật khẩu phải có ít nhất 6 ký tự';
    isValid = false;
  }

  // Validate confirm password
  if (!confirmPassword.value) {
    confirmPasswordError.value = 'Xác nhận mật khẩu là bắt buộc';
    isValid = false;
  } else if (newPassword.value !== confirmPassword.value) {
    confirmPasswordError.value = 'Mật khẩu xác nhận không khớp';
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  isLoading.value = true;
  successMessage.value = '';
  errorMessage.value = '';

  try {
    let response;
    
    if (isChangePassword.value) {
      // Change password for logged in user
      const userId = authStore.user?.userId;
      if (!userId) {
        errorMessage.value = 'Không tìm thấy thông tin người dùng';
        return;
      }

      response = await userApi.changePassword(userId, {
        currentPassword: currentPassword.value,
        newPassword: newPassword.value,
        confirmPassword: confirmPassword.value
      });
    } else {
      // Reset password with token
      const token = route.query.token;
      response = await userApi.resetPassword({
        token,
        newPassword: newPassword.value,
        confirmPassword: confirmPassword.value
      });
    }
    
    if (response.succeeded) {
      successMessage.value = isChangePassword.value 
        ? 'Đổi mật khẩu thành công! Bạn sẽ được đăng xuất để đăng nhập lại.'
        : 'Đặt lại mật khẩu thành công! Bạn có thể đăng nhập với mật khẩu mới.';
      
      // Clear form
      currentPassword.value = '';
      newPassword.value = '';
      confirmPassword.value = '';

      // If change password, logout user to force re-login
      if (isChangePassword.value) {
        setTimeout(() => {
          authStore.logout();
          router.push('/login');
        }, 2000);
      }
    } else {
      errorMessage.value = response.message || 'Có lỗi xảy ra. Vui lòng thử lại.';
    }
  } catch (error) {
    console.error('Password reset/change error:', error);
    errorMessage.value = 'Có lỗi xảy ra. Vui lòng thử lại.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.text-primary {
  color: #2563eb;
}

.border-primary {
  border-color: #2563eb;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style> 