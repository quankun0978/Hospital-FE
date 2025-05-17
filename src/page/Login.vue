<template>
  <div class="login-page">
    <div
      class="max-w-7xl mx-auto md:px-6 py-10 lg:py-32 md:grid md:grid-cols-12"
    >
      <div class="md:flex md:col-span-6 lg:col-span-7">
        <a href="http://youmed.vn/apps" target="_blank">
          <img
            width="500"
            height="500"
            loading="lazy"
            src="https://youmed.vn/dat-kham/assets/img/booking/png/Login.png"
            alt="Đặt khám"
            class="mx-auto"
          />
        </a>
      </div>
      <div class="md:col-span-6 lg:col-span-5">
        <div
          class="bg-white md:rounded-lg p-6 md:ring-1 ring-slate-100 md:max-w-md"
        >
          <!-- Thông báo lỗi chung -->
          <div v-if="apiError" class="message error">
            {{ apiError }}
          </div>

          <!-- Tab navigation -->
          <div class="flex border-b mb-6">
            <router-link
              to="/login?action=login"
              class="w-1/2 py-2 text-center font-medium"
              :class="{
                'text-primary border-b-2 border-primary active': activeTab === 'login',
                'text-gray-500 hover:text-gray-700': activeTab !== 'login'
              }"
              @click="handleTabChange('login')"
            >
              {{ t('pages.login.tabNavigation.login') }}
            </router-link>
            <router-link
              to="/login?action=register"
              class="w-1/2 py-2 text-center font-medium"
              :class="{
                'text-primary border-b-2 border-primary':
                  activeTab === 'register',
              }"
              @click="handleTabChange('register')"
            >
              {{ t('pages.login.tabNavigation.register') }}
            </router-link>
          </div>

          <!-- Đăng nhập form -->
          <form
            v-if="activeTab === 'login'"
            class="flex flex-col gap-6"
            @submit.prevent="handleLogin"
          >
            <!-- Hiển thị thông báo lỗi login form -->
            <div v-if="loginFormError" class="message error">
              {{ loginFormError }}
            </div>
            
            <div class="space-y-4">
              <Input
                v-model="loginForm.phone"
                id="login-phone"
                :label="t('pages.login.loginForm.phone')"
                :placeholder="t('pages.login.loginForm.phone')"
                inputmode="numeric"
                pattern="[0-9]*"
                maxlength="10"
              />
              <Input
                v-model="loginForm.password"
                id="login-password"
                type="password"
                :label="t('pages.login.loginForm.password')"
                :placeholder="t('pages.login.validation.passwordRequired')"
                minlength="6"
              />
            </div>

            <div class="flex flex-row justify-between items-center font-medium">
              <label class="flex items-center">
                <input
                  type="checkbox"
                  v-model="loginForm.remember"
                  class="mr-2"
                />
                <span class="text-sm text-gray-700">{{ t('pages.login.loginForm.rememberPassword') }}</span>
              </label>
              <router-link
                to="/forgot-password"
                class="cursor-pointer text-sm text-primary"
              >
                {{ t('pages.login.loginForm.forgotPassword') }}
              </router-link>
            </div>

            <AppButton 
              type="submit" 
              variant="primary" 
              :disabled="isLoading"
            >
              <span v-if="isLoading">Đang xử lý...</span>
              <span v-else>{{ t('pages.login.loginForm.loginButton') }}</span>
            </AppButton>

            <div class="text-center text-sm p-6 border-t mt-8">
              {{ t('pages.login.loginForm.noAccount') }}
              <span
                class="font-medium cursor-pointer text-primary"
                @click="handleTabChange('register')"
              >
                {{ t('pages.login.loginForm.registerNow') }}
              </span>
            </div>
          </form>

          <!-- Đăng ký form -->
          <form
            v-if="activeTab === 'register'"
            class="flex flex-col gap-6"
            @submit.prevent="handleRegister"
          >
            <!-- Hiển thị thông báo lỗi register form -->
            <div v-if="registerFormError" class="message error">
              {{ registerFormError }}
            </div>
            
            <div class="ant-form flex flex-col gap-8 ng-untouched ng-pristine ng-invalid ant-form-inline">
              <div>
                <div class="ant-form-item ant-row">
                  <div class="ant-form-item-control ng-tns-c14-3 ant-col ng-star-inserted">
                    <div class="ant-form-item-control-input">
                      <div class="ant-form-item-control-input-content">
                        <label
                          for="phoneNumber"
                          class="block mb-1 text-sm font-medium text-gray-700 ng-tns-c14-3"
                        >Số điện thoại</label>
                        <div
                          class="flex rounded-md shadow-sm ng-tns-c14-3"
                        >
                          <span
                            class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-200 bg-gray-50 text-gray-500 text-sm font-medium"
                          ><img
                            width="18"
                            height="18"
                            alt="VN"
                            src="@/assets/images/vn.svg"
                          />
                          +84</span>
                          <input
                            v-model="registerForm.phone"
                            placeholder="Nhập số điện thoại để tiếp tục"
                            inputmode="numeric"
                            pattern="[0-9]*"
                            class="px-3 py-2 focus:ring-primary focus:border-primary flex-1 block w-full placeholder:text-sm border border-gray-200 rounded-none rounded-r-md"
                            type="text"
                            maxlength="10"
                          />
                        </div>
                      </div>
                    </div>
                    <p v-if="registerErrors.phone" class="mt-1 text-sm text-red-600">
                      {{ registerErrors.phone }}
                    </p>
                  </div>
                </div>
                <div class="ant-form-item ant-row">
                  <div class="ant-form-item-control ng-tns-c14-4 ant-col ng-star-inserted">
                    <div class="ant-form-item-control-input">
                      <div class="ant-form-item-control-input-content">
                        <div
                          id="recaptcha-container-create"
                          class="py-6 ng-tns-c14-4 "
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="text-sm text-gray-700 pb-4">
                <label
                  class="ant-checkbox-wrapper ant-checkbox-wrapper-checked ng-untouched ng-pristine ng-valid ng-star-inserted"
                >
                  <span class="ant-checkbox ant-checkbox-checked flex items-center gap-1">
                    <input
                      type="checkbox"
                      v-model="registerForm.termsAccepted"
                      class="ant-checkbox-input"
                    />
                    <span class="ant-checkbox-inner"></span>
                    <span>Tôi đã đọc và đồng ý với các điều khoản và điều kiện sử dụng</span>
                  </span>
                </label>
              </div>
              <div>
                <AppButton
                  type="submit"
                  :variant="canRegister ? 'primary' : 'disable'"
                  :fullWidth="true"
                  :disabled="!canRegister || isLoading"
                >
                  <span v-if="isLoading">Đang xử lý...</span>
                  <span v-else>Gửi OTP</span>
                </AppButton>
              </div>
            </div>

            <div
              class="text-center text-sm p-6 border-t mt-8"
            >
              Đã có tài khoản?
              <span
                class="font-medium cursor-pointer text-primary"
                @click="handleTabChange('login')"
              >
                Đăng nhập ngay
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import Input from "../components/common/Input/Input.vue";
import AppButton from "../components/common/Button/Button.vue";
import { useI18n } from '../i18n/useI18n';
import { authApi } from '../api/commonFunction';
import { initRecaptcha, sendOTP, checkFirebaseConfig } from '../services/firebase/firebase';
import registerService from '../services/api/registerService';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { showToast } from '../plugins/toast.ts';
import { useAuthStore } from '../store/auth';

const { t } = useI18n();
const authStore = useAuthStore();

const route = useRoute();
const router = useRouter();
const activeTab = ref("login");

// Firebase recaptcha verifier
const recaptchaVerifier = ref(null);

// Thêm biến theo dõi trạng thái reCAPTCHA
const recaptchaVerified = ref(false);

const loginForm = ref({
  phone: "",
  password: "",
  remember: false,
});

const registerForm = ref({
  phone: "",
  password: "",
  termsAccepted: true,
});

const loginErrors = ref({
  phone: "",
  password: "",
});

const registerErrors = ref({
  phone: "",
  password: "",
});

const isLoading = ref(false);
const apiError = ref('');
const userName = localStorage.getItem("")
// Thêm biến theo dõi lỗi form
const loginFormError = ref('');
const registerFormError = ref('');
const canRegister = computed(() => {
  return (
    registerForm.value.phone &&
    registerForm.value.phone.length === 10 &&
    registerForm.value.termsAccepted &&
    recaptchaVerified.value
  );
});

onMounted(() => {
  // Kiểm tra nếu người dùng đã đăng nhập thì chuyển hướng
  if (localStorage.getItem("accessToken") && localStorage.getItem("Phone")) {
    router.push("/");
    return;
  }

  // Xác định tab active dựa trên tham số URL
  if (route.query.action === "register") {
    activeTab.value = "register";
  } else {
    activeTab.value = "login";
  }

  // Khởi tạo Firebase RecaptchaVerifier nếu đang ở tab đăng ký
  if (activeTab.value === "register") {
    initFirebaseRecaptcha();
  }
});

// Khởi tạo Firebase RecaptchaVerifier
const initFirebaseRecaptcha = () => {
  try {
    // Kiểm tra cấu hình Firebase
    const isConfigValid = checkFirebaseConfig();
    if (!isConfigValid) {
      console.error('Cấu hình Firebase không hợp lệ!');
      apiError.value = 'Cấu hình Firebase không hợp lệ. Vui lòng liên hệ quản trị viên.';
      showToast.error('Cấu hình Firebase không hợp lệ. Vui lòng liên hệ quản trị viên.');
      return;
    }
    
    // Clear container trước khi tạo mới recaptcha
    const container = document.getElementById('recaptcha-container-create');
    if (container) {
      container.innerHTML = '';
    }
    
    // Đợi một chút để DOM được render
    setTimeout(() => {
      try {
        // Cập nhật callback để theo dõi trạng thái xác thực reCAPTCHA
        recaptchaVerifier.value = new firebase.auth.RecaptchaVerifier('recaptcha-container-create', {
          'size': 'normal',
          'callback': (response) => {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
            recaptchaVerified.value = true;
            showToast.success('Xác thực Captcha thành công!');
          },
          'expired-callback': () => {
            // Response expired. Ask user to solve reCAPTCHA again.
            recaptchaVerified.value = false;
            showToast.warning('Captcha đã hết hạn. Vui lòng xác thực lại.');
          }
        });
        
        
        // Render reCAPTCHA ngay lập tức
        recaptchaVerifier.value.render().then(function(widgetId) {
        }).catch(function(error) {
          console.error('Lỗi khi render Recaptcha:', error);
          showToast.error('Không thể hiển thị Captcha. Vui lòng làm mới trang và thử lại.');
          // Thử lại render nếu gặp lỗi
          setTimeout(() => {
            try {
              recaptchaVerifier.value.render();
            } catch (e) {
              showToast.error('Lỗi hiển thị Captcha. Vui lòng làm mới trang và thử lại sau.');
            }
          }, 500);
        });
      } catch (error) {
        showToast.error('Lỗi khởi tạo Captcha. Vui lòng làm mới trang và thử lại.');
      }
    }, 500); // Tăng thời gian chờ lên để đảm bảo DOM đã được render
  } catch (error) {
    apiError.value = 'Lỗi khởi tạo Recaptcha. Vui lòng thử lại.';
    showToast.error('Lỗi khởi tạo Captcha. Vui lòng làm mới trang và thử lại.');
  }
};

const validateLogin = () => {
  let isValid = true;
  loginErrors.value = { phone: "", password: "" };
  loginFormError.value = '';

  if (!loginForm.value.phone) {
    loginFormError.value = "Vui lòng nhập đầy đủ thông tin đăng nhập.";
    isValid = false;
  } else if (!/^[0-9]{10}$/.test(loginForm.value.phone)) {
    loginFormError.value = "Số điện thoại không hợp lệ.";
    isValid = false;
  }

  if (!loginForm.value.password) {
    if (!loginFormError.value) {
      loginFormError.value = "Vui lòng nhập đầy đủ thông tin đăng nhập.";
    }
    isValid = false;
  } else if (loginForm.value.password.length < 6) {
    loginFormError.value = "Mật khẩu phải có ít nhất 6 ký tự.";
    isValid = false;
  }

  return isValid;
};

const validateRegister = () => {
  let isValid = true;
  registerErrors.value = { phone: "" };
  registerFormError.value = '';

  if (!registerForm.value.phone) {
    registerErrors.value.phone = "Vui lòng nhập số điện thoại";
    registerFormError.value = "Vui lòng nhập số điện thoại.";
    isValid = false;
  } else if (!/^[0-9]{10}$/.test(registerForm.value.phone)) {
    registerErrors.value.phone = "Số điện thoại không hợp lệ";
    registerFormError.value = "Số điện thoại không hợp lệ.";
    isValid = false;
  }

  if (!registerForm.value.termsAccepted) {
    registerFormError.value = "Vui lòng đồng ý với điều khoản và điều kiện sử dụng.";
    isValid = false;
  }
  
  if (!recaptchaVerified.value) {
    registerFormError.value = "Vui lòng xác thực Captcha trước khi tiếp tục.";
    isValid = false;
  }

  return isValid;
};

const handleLogin = async () => {
  if (validateLogin()) {
    isLoading.value = true;
    apiError.value = '';
    loginFormError.value = '';
    
    try {
      const response = await authApi.login({
        phone: loginForm.value.phone,
        password: loginForm.value.password
      });
      
      if (response.succeeded) {
        const token = response.data.token;
        const user = response.data.user || {};
        
        // Sử dụng Pinia store để đăng nhập
        authStore.login(user, token);
                      
        // Chuyển hướng đến trang chính mà không reload trang
        router.push('/');
        showToast.success('Đăng nhập thành công!');
      } else {
        loginFormError.value = response.message || 'Đăng nhập thất bại, vui lòng thử lại.';
      }
    } catch (error) {
      console.error('Login error:', error);
      loginFormError.value = 'Đã có lỗi xảy ra, vui lòng thử lại sau.';
    } finally {
      isLoading.value = false;
    }
  }
};

const handleRegister = async () => {
  if (validateRegister()) {
    isLoading.value = true;
    apiError.value = '';
    registerFormError.value = '';
    
    try {
      // Kiểm tra xem người dùng đã xác thực reCAPTCHA chưa
      if (!recaptchaVerified.value) {
        registerFormError.value = 'Vui lòng xác thực Captcha trước khi tiếp tục';
        showToast.warning('Vui lòng xác thực Captcha trước khi tiếp tục');
        isLoading.value = false;
        return;
      }
      
      // Định dạng số điện thoại (+84...)
      const phoneNumberFormatted = `+84${registerForm.value.phone.substring(1)}`;      
      // Kiểm tra số điện thoại đã tồn tại chưa
     // const checkResult = await registerService.checkPhoneExists(registerForm.value.phone);
      
    //  if (checkResult.exists) {
     //   apiError.value = 'Số điện thoại này đã được đăng ký. Vui lòng đăng nhập hoặc sử dụng số điện thoại khác.';
     //   isLoading.value = false;
     //   return;
     // }
      
      // Nếu chưa khởi tạo recaptcha, khởi tạo lại
      if (!recaptchaVerifier.value) {
        initFirebaseRecaptcha();
        registerFormError.value = 'Cần xác thực Captcha lại. Vui lòng thử lại.';
        isLoading.value = false;
        return;
      }
      
      // Gửi OTP qua Firebase sử dụng verifier đã được xác thực
      const otpResult = await sendOTP(phoneNumberFormatted, recaptchaVerifier.value);
      
      if (otpResult.success) {
        // Lưu confirmationResult vào localStorage để sử dụng ở trang SendOTP
        localStorage.setItem('firebaseConfirmationResult', JSON.stringify(otpResult.confirmationResult));
        
        // Thông báo cho người dùng bằng toast thay vì alert
        showToast.success('Mã OTP đã được gửi đến số điện thoại của bạn!');
        
        // Chuyển đến trang SendOTP với số điện thoại đã đăng ký
        router.push({
          path: '/send-otp',
          query: { phone: registerForm.value.phone }
        });
      } else {
        console.error('Lỗi gửi OTP:', otpResult.error);
        registerFormError.value = 'Không thể gửi mã OTP. Vui lòng thử lại sau. Lỗi: ' + (otpResult.error ? otpResult.error.message : 'Không xác định');
        
        // Reset recaptcha để người dùng có thể thử lại
        recaptchaVerified.value = false;  
        if (recaptchaVerifier.value) {
          try {
            recaptchaVerifier.value.clear();
          } catch (e) {
            console.error('Lỗi khi clear recaptcha:', e);
          }
          recaptchaVerifier.value = null;
          setTimeout(() => {
            initFirebaseRecaptcha();
          }, 500);
        }
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      registerFormError.value = 'Đã có lỗi xảy ra: ' + (error.message || 'Không xác định');
      
      // Reset recaptcha nếu có lỗi
      recaptchaVerified.value = false;
      if (recaptchaVerifier.value) {
        try {
          recaptchaVerifier.value.clear();
          recaptchaVerifier.value = null;
          setTimeout(() => {
            initFirebaseRecaptcha();
          }, 500);
        } catch (e) {
          console.error('Lỗi khi reset recaptcha:', e);
        }
      }
    } finally {
      isLoading.value = false;
    }
  }
};

// Thêm xử lý khi chuyển tab
const handleTabChange = (tab) => {
  activeTab.value = tab;
  if (tab === 'register') {
    // Khi chuyển sang tab đăng ký, khởi tạo reCAPTCHA
    setTimeout(() => {
      initFirebaseRecaptcha();
    }, 300);
  }
};
</script>

<style scoped>
.login-page {
  --tw-bg-opacity: 1;
  background-color: rgb(249 250 251 / var(--tw-bg-opacity));
}

.message {
  padding: 10px;
  border-radius: 4px;
  background-color: #e3f2fd;
  color: #2196f3;
  font-size: 14px;
}

.message.error {
  background-color: #ffebee;
  color: #e53935;
}
</style>
