<template>
  <div class="max-w-7xl mx-auto px-4 py-10 lg:py-20">
    <div class="max-w-md mx-auto bg-white rounded-lg p-8 shadow-sm">
      <h1 class="text-2xl font-bold mb-6 text-center">{{ t('pages.forgotPassword.title') }}</h1>
      
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <CustomInput
          v-model="phone"
          id="forgot-password-phone"
          :label="t('pages.forgotPassword.form.phone')"
          :placeholder="t('pages.forgotPassword.form.phonePlaceholder')"
          inputmode="numeric"
          pattern="[0-9]*"
          maxlength="10"
          :error="phoneError"
        />
        
        <AppButton
          type="submit"
          variant="primary"
          :fullWidth="true"
        >
          {{ t('pages.forgotPassword.form.submitButton') }}
        </AppButton>
      </form>
      
      <div class="mt-6 text-center">
        <router-link to="/login" class="text-primary text-sm font-medium">
          {{ t('pages.forgotPassword.navigation.backToLogin') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import CustomInput from '../components/common/Input/Input.vue';
import AppButton from '../components/common/Button/Button.vue';
import { useI18n } from '../i18n/useI18n';

const { t } = useI18n();
const phone = ref('');
const phoneError = ref('');

const validatePhone = () => {
  if (!phone.value) {
    phoneError.value = t('pages.forgotPassword.validation.phoneRequired');
    return false;
  } else if (!/^[0-9]{10}$/.test(phone.value)) {
    phoneError.value = t('pages.forgotPassword.validation.phoneInvalid');
    return false;
  }
  phoneError.value = '';
  return true;
};

const handleSubmit = () => {
  if (validatePhone()) {
    console.log('Đã gửi yêu cầu đặt lại mật khẩu cho số điện thoại:', phone.value);
    // Xử lý gửi yêu cầu đặt lại mật khẩu ở đây
  }
};
</script>

<style scoped>
</style> 