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
                'text-primary border-b-2 border-primary active':
                  activeTab === 'login',
                'text-gray-500 hover:text-gray-700': activeTab !== 'login',
              }"
              @click="handleTabChange('login')"
            >
              {{ t("pages.login.tabNavigation.login") }}
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
              {{ t("pages.login.tabNavigation.register") }}
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
                v-model="loginForm.email"
                id="login-email"
                type="email"
                :label="'Email'"
                :placeholder="'Nhập email của bạn'"
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
                <span class="text-sm text-gray-700">{{
                  t("pages.login.loginForm.rememberPassword")
                }}</span>
              </label>
              <router-link
                to="/forgot-password"
                class="cursor-pointer text-sm text-primary"
              >
                {{ t("pages.login.loginForm.forgotPassword") }}
              </router-link>
            </div>

            <AppButton type="submit" variant="primary" :disabled="isLoading">
              <span v-if="isLoading">Đang xử lý...</span>
              <span v-else>{{ t("pages.login.loginForm.loginButton") }}</span>
            </AppButton>

            <div class="text-center text-sm p-6 border-t mt-8">
              {{ t("pages.login.loginForm.noAccount") }}
              <span
                class="font-medium cursor-pointer text-primary"
                @click="handleTabChange('register')"
              >
                {{ t("pages.login.loginForm.registerNow") }}
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

            <div class="space-y-4">
              <Input
                v-model="registerForm.email"
                id="register-email"
                type="email"
                :label="'Email'"
                :placeholder="'Nhập email để tiếp tục'"
                :error="registerErrors.email"
              />

              <div class="flex items-center">
                <input
                  type="checkbox"
                  v-model="registerForm.termsAccepted"
                  class="mr-2"
                />
                <span class="text-sm text-gray-700">
                  Tôi đã đọc và đồng ý với các điều khoản và điều kiện sử dụng
                </span>
              </div>
            </div>

            <AppButton
              type="submit"
              :variant="canRegister ? 'primary' : 'disable'"
              :fullWidth="true"
              :disabled="!canRegister || isLoading"
            >
              <span v-if="isLoading">Đang xử lý...</span>
              <span v-else>Gửi mã xác thực</span>
            </AppButton>

            <div class="text-center text-sm p-6 border-t mt-8">
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
import { useI18n } from "../i18n/useI18n";
import authApi from "../api/authApi.ts";
import Message from "../plugins/message.ts";
import { useAuthStore } from "@/store/auth";

const { t } = useI18n();
const authStore = useAuthStore();

const route = useRoute();
const router = useRouter();
const activeTab = ref("login");

const loginForm = ref({
  email: "",
  password: "",
  remember: false,
});

const registerForm = ref({
  email: "",
  termsAccepted: true,
});

const loginErrors = ref({
  email: "",
  password: "",
});

const registerErrors = ref({
  email: "",
});

const isLoading = ref(false);
const apiError = ref("");
const loginFormError = ref("");
const registerFormError = ref("");

const canRegister = computed(() => {
  return (
    registerForm.value.email &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerForm.value.email) &&
    registerForm.value.termsAccepted
  );
});

onMounted(() => {
  // Kiểm tra nếu người dùng đã đăng nhập thì chuyển hướng
  if (authStore.isAuthenticated) {
    router.push("/");
    return;
  }

  // Xác định tab active dựa trên tham số URL
  if (route.query.action === "register") {
    activeTab.value = "register";
  } else {
    activeTab.value = "login";
  }
});

const validateLogin = () => {
  let isValid = true;
  loginErrors.value = { email: "", password: "" };
  loginFormError.value = "";

  if (!loginForm.value.email) {
    loginFormError.value = "Vui lòng nhập đầy đủ thông tin đăng nhập.";
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginForm.value.email)) {
    loginFormError.value = "Email không hợp lệ.";
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
  registerErrors.value = { email: "" };
  registerFormError.value = "";

  if (!registerForm.value.email) {
    registerErrors.value.email = "Vui lòng nhập email";
    registerFormError.value = "Vui lòng nhập email.";
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerForm.value.email)) {
    registerErrors.value.email = "Email không hợp lệ";
    registerFormError.value = "Email không hợp lệ.";
    isValid = false;
  }

  if (!registerForm.value.termsAccepted) {
    registerFormError.value =
      "Vui lòng đồng ý với điều khoản và điều kiện sử dụng.";
    isValid = false;
  }

  return isValid;
};

const handleLogin = async () => {
  if (validateLogin()) {
    isLoading.value = true;
    apiError.value = "";
    loginFormError.value = "";

    try {
      // Sử dụng auth store method login
      const success = await authStore.login(
        loginForm.value.email,
        loginForm.value.password
      );

      if (success) {
        // Chuyển hướng đến trang chính
        router.push("/");
        Message.success("Đăng nhập thành công!");
      }
      else{
        loginFormError.value = authStore.message;
      }
    } catch (error) {
      loginFormError.value = error.message;
    } finally {
      isLoading.value = false;
    }
  }
};

const handleRegister = async () => {
  if (validateRegister()) {
    isLoading.value = true;
    apiError.value = "";
    registerFormError.value = "";

    try {
      // Kiểm tra xem email đã tồn tại chưa
      const checkEmail = await authApi.checkEmail(registerForm.value.email);

      if (!checkEmail.success) {
        apiError.value = checkEmail.message;
        isLoading.value = false;
        return;
      }

      // Gửi mã xác thực email
      const result = await authApi.sendEmailVerification({
        email: registerForm.value.email,
      });

      if (result.succeeded) {
        Message.success("Mã xác thực đã được gửi đến email của bạn!");

        // Chuyển đến trang SendOTP với email đã đăng ký
        router.push({
          path: "/send-otp",
          query: { email: registerForm.value.email },
        });
      } else {
        console.error("Lỗi gửi email:", result.message);
        registerFormError.value =
          "Không thể gửi mã xác thực. Vui lòng thử lại sau.";
      }
    } catch (error) {
      console.error("Send email verification error:", error);
      registerFormError.value =
        "Đã có lỗi xảy ra: " + (error.message || "Không xác định");
    } finally {
      isLoading.value = false;
    }
  }
};

// Thêm xử lý khi chuyển tab
const handleTabChange = (tab) => {
  activeTab.value = tab;
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
