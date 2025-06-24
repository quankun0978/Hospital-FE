<template>
  <div class="otp-page">
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
          <!-- Hiển thị thông báo lỗi -->
          <div v-if="errorMessage" class="message error">
            {{ errorMessage }}
          </div>

          <!-- Tab steps -->
          <div class="flex border-b mb-6">
            <div
              class="w-1/3 py-2 text-center font-medium"
              :class="{
                'text-primary border-b-2 border-primary': currentStep === 1,
                'text-gray-500': currentStep !== 1,
              }"
            >
              {{ t("pages.sendOTP.steps.verify") }}
            </div>
            <div
              class="w-1/3 py-2 text-center font-medium"
              :class="{
                'text-primary border-b-2 border-primary': currentStep === 2,
                'text-gray-500': currentStep !== 2,
              }"
            >
              {{ t("pages.sendOTP.steps.password") }}
            </div>
            <div
              class="w-1/3 py-2 text-center font-medium"
              :class="{
                'text-primary border-b-2 border-primary': currentStep === 3,
                'text-gray-500': currentStep !== 3,
              }"
            >
              {{ t("pages.sendOTP.steps.profile") }}
            </div>
          </div>

          <!-- Tab content -->
          <div class="ant-tabs-content-holder">
            <div class="ant-tabs-content">
              <!-- Tab 1: Xác thực OTP -->
              <div
                v-if="currentStep === 1"
                class="ant-tabs-tabpane ant-tabs-tabpane-active"
              >
                <div class="border-bottom">
                  <div
                    class="wrapper-otp flex flex-col justify-center items-center"
                  >
                    <p class="text-sm-w500 my-6">
                      {{ t("pages.sendOTP.verify.enterOtp") }} {{ email }}
                    </p>
                    <div class="flex gap-2" ref="otpInputContainer">
                      <input
                        v-for="(digit, index) in otpDigits"
                        :key="index"
                        v-model="otpDigits[index]"
                        @input="(event) => onOtpInput(index, event)"
                        @keydown="(event) => onKeyDown(event, index)"
                        ref="otpInputs"
                        type="tel"
                        maxlength="1"
                        autocomplete="one-time-code"
                        class="otp-input"
                        pattern="\d*"
                      />
                    </div>
                  </div>
                  <div class="flex justify-center">
                    <AppButton
                      :variant="isOtpComplete ? 'primary' : 'disable'"
                      :disabled="!isOtpComplete || loading"
                      @click="verifyOtp"
                      :additionalClasses="'w-full md:w-auto md:px-10 mt-10 mb-6'"
                    >
                      {{
                        loading
                          ? t("pages.home.common.loading")
                          : t("pages.sendOTP.verify.continue")
                      }}
                    </AppButton>
                  </div>
                </div>
                <div
                  class="flex flex-col gap-2 items-center text-sm-w500 mt-6 mb-[60px] text-center"
                >
                  {{ t("pages.sendOTP.verify.notReceived") }}
                  <span
                    class="text-primary cursor-pointer"
                    @click="resendOtp"
                    >{{ t("pages.sendOTP.verify.tryAgain") }}</span
                  >
                </div>
              </div>

              <!-- Tab 2: Mật khẩu -->
              <div
                v-if="currentStep === 2"
                class="ant-tabs-tabpane ant-tabs-tabpane-active"
              >
                <div class="border-bottom">
                  <div class="flex flex-col gap-6 px-4">
                    <h2 class="text-lg font-medium text-center">
                      {{ t("pages.sendOTP.password.title") }}
                    </h2>
                    <div class="space-y-4">
                      <Input
                        v-model="passwordForm.password"
                        id="password"
                        type="password"
                        :label="t('pages.sendOTP.password.password')"
                        :placeholder="
                          t('pages.sendOTP.password.passwordPlaceholder')
                        "
                        :error="passwordErrors.password"
                      />
                      <Input
                        v-model="passwordForm.confirmPassword"
                        id="confirm-password"
                        type="password"
                        :label="t('pages.sendOTP.password.confirmPassword')"
                        :placeholder="
                          t('pages.sendOTP.password.confirmPasswordPlaceholder')
                        "
                        :error="passwordErrors.confirmPassword"
                      />
                    </div>
                    <div class="flex justify-center">
                      <AppButton
                        variant="primary"
                        @click="submitPassword"
                        :disabled="loading"
                        :additionalClasses="'w-full md:w-auto md:px-10 mt-6 mb-6'"
                      >
                        {{
                          loading
                            ? t("pages.home.common.loading")
                            : t("pages.sendOTP.password.continue")
                        }}
                      </AppButton>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Tab 3: Tạo hồ sơ -->
              <div
                v-if="currentStep === 3"
                class="ant-tabs-tabpane ant-tabs-tabpane-active"
              >
                <div class="border-bottom">
                  <div class="flex flex-col gap-6 px-4">
                    <h2 class="text-lg font-medium text-center">
                      {{ t("pages.sendOTP.profile.title") }}
                    </h2>
                    <div class="space-y-4">
                      <Input
                        v-model="profileForm.fullName"
                        id="full-name"
                        :label="t('pages.sendOTP.profile.fullName')"
                        :placeholder="
                          t('pages.sendOTP.profile.fullNamePlaceholder')
                        "
                        :error="profileErrors.fullName"
                      />
                      <div class="grid grid-cols-2 gap-4">
                        <div>
                          <InputDate
                            v-model="profileForm.dateOfBirth"
                            :label="t('pages.sendOTP.profile.dateOfBirth')"
                          />
                        </div>
                        <div>
                          <Select
                            v-model="profileForm.gender"
                            :label="t('pages.sendOTP.profile.gender')"
                            :options="[
                              {
                                value: 'M',
                                label: t(
                                  'pages.sendOTP.profile.genderOptions.male'
                                ),
                              },
                              {
                                value: 'F',
                                label: t(
                                  'pages.sendOTP.profile.genderOptions.female'
                                ),
                              },
                            ]"
                          />
                        </div>
                      </div>
                      <Input
                        v-model="profileForm.address"
                        id="address"
                        :label="t('pages.sendOTP.profile.address')"
                        :placeholder="
                          t('pages.sendOTP.profile.addressPlaceholder')
                        "
                        :error="profileErrors.address"
                      />
                      <Input
                        v-model="profileForm.phone"
                        id="phone"
                        :label="t('pages.sendOTP.profile.phone')"
                        :placeholder="
                          t('pages.sendOTP.profile.phonePlaceholder')
                        "
                        :error="profileErrors.phone"
                      />
                      <Input
                        v-model="profileForm.healthInsuranceNumber"
                        id="health-insurance"
                        :label="t('pages.sendOTP.profile.healthInsurance')"
                        :placeholder="
                          t('pages.sendOTP.profile.healthInsurancePlaceholder')
                        "
                        :error="profileErrors.healthInsuranceNumber"
                      />
                    </div>
                    <div class="flex justify-center">
                      <AppButton
                        variant="primary"
                        @click="submitProfile"
                        :disabled="loading"
                        :additionalClasses="'w-full md:w-auto md:px-10 mt-6 mb-6'"
                      >
                        {{
                          loading
                            ? t("pages.home.common.loading")
                            : t("pages.sendOTP.profile.complete")
                        }}
                      </AppButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import Input from "../components/common/Input/Input.vue";
import InputDate from "../components/common/Input/InputDate.vue";
import Select from "../components/common/Select/Select.vue";
import AppButton from "../components/common/Button/Button.vue";
import authApi from "../api/authApi";
import Message from "../plugins/message";

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

// Các trạng thái quản lý
const currentStep = ref(1);
const email = ref("");
const loading = ref(false);
const errorMessage = ref("");

// OTP
const otpDigits = ref(["", "", "", "", "", ""]);
const otpInputs = ref([]);
const otpInputContainer = ref(null);

const isOtpComplete = computed(() => {
  return otpDigits.value.every((digit) => digit !== "");
});

// Form mật khẩu
const passwordForm = ref({
  password: "",
  confirmPassword: "",
});

const passwordErrors = ref({
  password: "",
  confirmPassword: "",
});

// Form hồ sơ
const profileForm = ref({
  fullName: "",
  dateOfBirth: "",
  gender: "M",
  address: "",
  phone: "",
  healthInsuranceNumber: "",
});

const profileErrors = ref({
  fullName: "",
  address: "",
  phone: "",
  healthInsuranceNumber: "",
});

// Tối ưu hóa hàm xử lý nhập OTP để giảm độ trễ
const onOtpInput = (index, event) => {
  const input = event.target;
  const value = input.value;

  // Đảm bảo chỉ nhập số
  if (/^\d*$/.test(value)) {
    // Tự động focus vào ô tiếp theo chỉ khi có giá trị hợp lệ
    if (value && index < 5) {
      const nextInput = otpInputs.value[index + 1];
      if (nextInput) nextInput.focus();
    }
  } else {
    // Nếu không phải số, xóa giá trị
    otpDigits.value[index] = "";
  }
};

// Tối ưu hóa hàm xử lý keydown
const onKeyDown = (event, index) => {
  // Xử lý khi nhấn Backspace
  if (event.key === "Backspace" && !otpDigits.value[index] && index > 0) {
    const prevInput = otpInputs.value[index - 1];
    if (prevInput) {
      prevInput.focus();
      // Sử dụng nextTick thay vì setTimeout
      nextTick(() => {
        try {
          otpDigits.value[index - 1] = "";
        } catch (error) {
          console.error("Lỗi khi xóa giá trị của ô input trước đó:", error);
        }
      });
    }
  }
};

// Tự động focus vào ô đầu tiên
const focusFirstInput = () => {
  // Sử dụng nextTick thay vì setTimeout để tránh lỗi timeout
  nextTick(() => {
    try {
      if (otpInputs.value && otpInputs.value.length > 0 && otpInputs.value[0]) {
        otpInputs.value[0].focus();
      }
    } catch (error) {
      console.error("Lỗi khi focus vào ô input đầu tiên:", error);
    }
  });
};

// Xác thực OTP với backend API
const verifyOtp = async () => {
  if (!isOtpComplete.value) return;

  try {
    loading.value = true;
    errorMessage.value = "";
    const otpCode = otpDigits.value.join("");

    console.log("Verifying OTP:", { email: email.value, verificationCode: otpCode });

    if (!email.value) {
      errorMessage.value = "Email không hợp lệ";
      Message.error(errorMessage.value);
      return;
    }

    // Gọi API xác thực email
    const response = await authApi.verifyEmail({
      email: email.value,
      verificationCode: otpCode
    });

    console.log("Verify response:", response);

    if (response && response.succeeded) {
      // Chuyển sang bước tiếp theo
      currentStep.value = 2;
      errorMessage.value = "";
      Message.success("Xác thực email thành công!");
    } else {
      errorMessage.value = response?.message || "Mã OTP không chính xác hoặc đã hết hạn.";
      Message.error(errorMessage.value);
    }
  } catch (error) {
    console.error("Lỗi xác thực OTP:", error);
    console.error("Error details:", error.response);
    
    if (error.response?.data) {
      if (error.response.data.errors && error.response.data.errors.length > 0) {
        errorMessage.value = error.response.data.errors[0];
      } else if (error.response.data.message) {
        errorMessage.value = error.response.data.message;
      } else {
        errorMessage.value = "Mã OTP không chính xác hoặc đã hết hạn.";
      }
    } else {
      errorMessage.value = "Có lỗi xảy ra trong quá trình xác thực. Vui lòng thử lại.";
    }
    Message.error(errorMessage.value);
  } finally {
    loading.value = false;
  }
};

// Gửi lại OTP
const resendOtp = async () => {
  try {
    loading.value = true;
    errorMessage.value = "";

    // Gọi API gửi lại email verification
    const response = await authApi.sendEmailVerification({ email: email.value });

    if (response.succeeded) {
      Message.success("Đã gửi lại mã xác thực đến email của bạn!");
      // Reset OTP inputs
      otpDigits.value = ["", "", "", "", "", ""];
      focusFirstInput();
    } else {
      errorMessage.value = response.message || "Không thể gửi lại mã xác thực.";
      Message.error(errorMessage.value);
    }
  } catch (error) {
    console.error("Lỗi gửi lại OTP:", error);
    errorMessage.value = error.response?.data?.message || "Có lỗi xảy ra khi gửi lại mã xác thực.";
    Message.error(errorMessage.value);
  } finally {
    loading.value = false;
  }
};

// Xác thực và gửi mật khẩu
const validatePassword = () => {
  let isValid = true;
  passwordErrors.value = { password: "", confirmPassword: "" };

  if (!passwordForm.value.password) {
    passwordErrors.value.password = t("pages.sendOTP.password.errors.required");
    isValid = false;
  } else if (passwordForm.value.password.length < 6) {
    passwordErrors.value.password = t(
      "pages.sendOTP.password.errors.minLength"
    );
    isValid = false;
  }

  if (!passwordForm.value.confirmPassword) {
    passwordErrors.value.confirmPassword = t(
      "pages.sendOTP.password.errors.confirmRequired"
    );
    isValid = false;
  } else if (
    passwordForm.value.password !== passwordForm.value.confirmPassword
  ) {
    passwordErrors.value.confirmPassword = t(
      "pages.sendOTP.password.errors.notMatch"
    );
    isValid = false;
  }

  return isValid;
};

const submitPassword = () => {
  if (!validatePassword()) return;

  // Chuyển sang bước tiếp theo
  currentStep.value = 3;
};

// Xác thực và gửi thông tin hồ sơ
const validateProfile = () => {
  let isValid = true;
  profileErrors.value = {
    fullName: "",
    address: "",
    phone: "",
    healthInsuranceNumber: "",
  };

  if (!profileForm.value.fullName) {
    profileErrors.value.fullName = t(
      "pages.sendOTP.profile.errors.fullNameRequired"
    );
    isValid = false;
  }

  if (!profileForm.value.phone) {
    profileErrors.value.phone = t("pages.sendOTP.profile.errors.phoneRequired");
    isValid = false;
  } else if (!/^\d{10,11}$/.test(profileForm.value.phone)) {
    profileErrors.value.phone = t("pages.sendOTP.profile.errors.phoneInvalid");
    isValid = false;
  }

  return isValid;
};

const submitProfile = async () => {
  if (!validateProfile()) return;

  try {
    if (loading.value) return;

    loading.value = true;
    errorMessage.value = "";

    // Format dateOfBirth đúng định dạng ISO nếu có
    const formattedDateOfBirth = profileForm.value.dateOfBirth
      ? new Date(profileForm.value.dateOfBirth).toISOString()
      : "";

    // Chuẩn bị dữ liệu gửi
    const registerData = {
      // Thông tin User
      password: passwordForm.value.password,
      name: profileForm.value.fullName,
      email: email.value, // Sử dụng email thay vì phone
      roleId: "R3", // R3 là vai trò bệnh nhân
      
      // Thông tin PatientRecord
      fullName: profileForm.value.fullName,
      dateOfBirth: formattedDateOfBirth,
      gender: profileForm.value.gender,
      address: profileForm.value.address,
      phone: profileForm.value.phone, // Phone của bệnh nhân
      healthInsuranceNumber: profileForm.value.healthInsuranceNumber,
    };

    console.log("Register data:", registerData);

    const response = await authApi.register(registerData);

    if (response.succeeded) {
      // Lưu thông tin vào localStorage
      if (response.data) {
        localStorage.setItem("Email", response.data.email || email.value);
        localStorage.setItem("userId", response.data.userId);
      }

      Message.success("Đăng ký tài khoản thành công!");
      router.push("/login");
    } else {
      errorMessage.value = response.message || "Không thể đăng ký tài khoản.";
      Message.error(errorMessage.value);
    }
  } catch (error) {
    console.error("Register error:", error);
    
    if (error.response?.data?.errors?.length > 0) {
      errorMessage.value = error.response.data.errors[0];
    } else if (error.response?.data?.message) {
      errorMessage.value = error.response.data.message;
    } else {
      errorMessage.value = "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.";
    }
    Message.error(errorMessage.value);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  try {
    // Lấy email từ query params
    if (route.query.email) {
      email.value = route.query.email;
    } else {
      errorMessage.value = 'Không tìm thấy thông tin email. Vui lòng quay lại trang đăng ký.';
      Message.error(errorMessage.value);
    }

    // Tự động focus vào ô nhập OTP đầu tiên
    nextTick(() => {
      focusFirstInput();
    });
  } catch (error) {
    console.error("Lỗi trong onMounted:", error);
    errorMessage.value = "Đã xảy ra lỗi khi khởi tạo trang.";
    Message.error(errorMessage.value);
  }
});
</script>

<style scoped>
.otp-page {
  --tw-bg-opacity: 1;
  background-color: rgb(249 250 251 / var(--tw-bg-opacity));
}

.otp-input {
  width: 40px;
  height: 40px;
  text-align: center;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1.25rem;
  font-weight: 500;
  margin: 0 4px;
}

.otp-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
}

.text-primary {
  color: #2563eb;
}

.bg-primary {
  background-color: #2563eb;
}

.hover\:bg-primary-dark:hover {
  background-color: #1d4ed8;
}

.message {
  margin-top: 10px;
  margin-bottom: 10px;
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

.text-sm-w500 {
  font-size: 0.875rem;
  font-weight: 500;
}
</style>
