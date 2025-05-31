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
                'text-gray-500': currentStep !== 1
              }"
            >
              {{ t('pages.sendOTP.steps.verify') }}
            </div>
            <div 
              class="w-1/3 py-2 text-center font-medium"
              :class="{
                'text-primary border-b-2 border-primary': currentStep === 2,
                'text-gray-500': currentStep !== 2
              }"
            >
              {{ t('pages.sendOTP.steps.password') }}
            </div>
            <div 
              class="w-1/3 py-2 text-center font-medium"
              :class="{
                'text-primary border-b-2 border-primary': currentStep === 3,
                'text-gray-500': currentStep !== 3
              }"
            >
              {{ t('pages.sendOTP.steps.profile') }}
            </div>
          </div>

          <!-- Tab content -->
          <div class="ant-tabs-content-holder">
            <div class="ant-tabs-content">
              <!-- Tab 1: Xác thực OTP -->
              <div v-if="currentStep === 1" class="ant-tabs-tabpane ant-tabs-tabpane-active">
                <div class="border-bottom">
                  <div class="wrapper-otp flex flex-col justify-center items-center">
                    <p class="text-sm-w500 my-6">
                      {{ t('pages.sendOTP.verify.enterOtp') }} {{ phoneNumber }}
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
                      {{ loading ? t('pages.home.common.loading') : t('pages.sendOTP.verify.continue') }}
                    </AppButton>
                  </div>
                </div>
                <div class="flex flex-col gap-2 items-center text-sm-w500 mt-6 mb-[60px] text-center">
                  {{ t('pages.sendOTP.verify.notReceived') }}
                  <span class="text-primary cursor-pointer" @click="resendOtp">{{ t('pages.sendOTP.verify.tryAgain') }}</span>
                </div>
              </div>

              <!-- Tab 2: Mật khẩu -->
              <div v-if="currentStep === 2" class="ant-tabs-tabpane ant-tabs-tabpane-active">
                <div class="border-bottom">
                  <div class="flex flex-col gap-6 px-4">
                    <h2 class="text-lg font-medium text-center">{{ t('pages.sendOTP.password.title') }}</h2>
                    <div class="space-y-4">
                      <Input
                        v-model="passwordForm.password"
                        id="password"
                        type="password"
                        :label="t('pages.sendOTP.password.password')"
                        :placeholder="t('pages.sendOTP.password.passwordPlaceholder')"
                        :error="passwordErrors.password"
                      />
                      <Input
                        v-model="passwordForm.confirmPassword"
                        id="confirm-password"
                        type="password"
                        :label="t('pages.sendOTP.password.confirmPassword')"
                        :placeholder="t('pages.sendOTP.password.confirmPasswordPlaceholder')"
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
                        {{ loading ? t('pages.home.common.loading') : t('pages.sendOTP.password.continue') }}
                      </AppButton>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Tab 3: Tạo hồ sơ -->
              <div v-if="currentStep === 3" class="ant-tabs-tabpane ant-tabs-tabpane-active">
                <div class="border-bottom">
                  <div class="flex flex-col gap-6 px-4">
                    <h2 class="text-lg font-medium text-center">{{ t('pages.sendOTP.profile.title') }}</h2>
                    <div class="space-y-4">
                      <Input
                        v-model="profileForm.fullName"
                        id="full-name"
                        :label="t('pages.sendOTP.profile.fullName')"
                        :placeholder="t('pages.sendOTP.profile.fullNamePlaceholder')"
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
                              { value: 'M', label: t('pages.sendOTP.profile.genderOptions.male') },
                              { value: 'F', label: t('pages.sendOTP.profile.genderOptions.female') }
                            ]"
                          />
                        </div>
                      </div>
                      <Input
                        v-model="profileForm.address"
                        id="address"
                        :label="t('pages.sendOTP.profile.address')"
                        :placeholder="t('pages.sendOTP.profile.addressPlaceholder')"
                        :error="profileErrors.address"
                      />
                      <Input
                        v-model="profileForm.phone"
                        id="phone"
                        :label="t('pages.sendOTP.profile.phone')"
                        :placeholder="t('pages.sendOTP.profile.phonePlaceholder')"
                        :error="profileErrors.phone"
                      />
                      <Input
                        v-model="profileForm.email"
                        id="email"
                        :label="t('pages.sendOTP.profile.email')"
                        type="email"
                        :placeholder="t('pages.sendOTP.profile.emailPlaceholder')"
                        :error="profileErrors.email"
                      />
                      <Input
                        v-model="profileForm.healthInsuranceNumber"
                        id="health-insurance"
                        :label="t('pages.sendOTP.profile.healthInsurance')"
                        :placeholder="t('pages.sendOTP.profile.healthInsurancePlaceholder')"
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
                        {{ loading ? t('pages.home.common.loading') : t('pages.sendOTP.profile.complete') }}
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
import { ref, computed, onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import Input from '../components/common/Input/Input.vue';
import InputDate from '../components/common/Input/InputDate.vue';
import Select from '../components/common/Select/Select.vue';
import AppButton from '../components/common/Button/Button.vue';
import { PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '@/services/firebase/firebase';
import axios from '../api/axios';
import authApi from '../api/authApi';
const route = useRoute();
const router = useRouter();
const { t } = useI18n();

// Các trạng thái quản lý
const currentStep = ref(1);
const phoneNumber = ref('');
const loading = ref(false);
const errorMessage = ref('');

// Biến lưu trữ trạng thái Firebase
const confirmationResult = ref(null);
const firebaseUser = ref(null);
const firebaseIdToken = ref('');

// OTP
const otpDigits = ref(['', '', '', '', '', '']);
const otpInputs = ref([]);
const otpInputContainer = ref(null);

const isOtpComplete = computed(() => {
  return otpDigits.value.every(digit => digit !== '');
});

// Form mật khẩu
const passwordForm = ref({
  password: '',
  confirmPassword: ''
});

const passwordErrors = ref({
  password: '',
  confirmPassword: ''
});

// Form hồ sơ
const profileForm = ref({
  fullName: '',
  dateOfBirth: '',
  gender: 'M',
  address: '',
  phone: '',
  email: '',
  healthInsuranceNumber: ''
});

const profileErrors = ref({
  fullName: '',
  address: '',
  phone: '',
  email: '',
  healthInsuranceNumber: ''
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
    otpDigits.value[index] = '';
  }
};

// Tối ưu hóa hàm xử lý keydown
const onKeyDown = (event, index) => {
  // Xử lý khi nhấn Backspace
  if (event.key === 'Backspace' && !otpDigits.value[index] && index > 0) {
    const prevInput = otpInputs.value[index - 1];
    if (prevInput) {
      prevInput.focus();
      // Sử dụng nextTick thay vì setTimeout
      nextTick(() => {
        try {
          otpDigits.value[index - 1] = '';
        } catch (error) {
          console.error('Lỗi khi xóa giá trị của ô input trước đó:', error);
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
      console.error('Lỗi khi focus vào ô input đầu tiên:', error);
    }
  });
};

// Đọc confirmationResult từ localStorage
const getConfirmationResultFromStorage = () => {
  try {
    const savedConfirmationResult = localStorage.getItem('firebaseConfirmationResult');
    if (savedConfirmationResult) {
      return JSON.parse(savedConfirmationResult);
    }
    return null;
  } catch (error) {
    console.error('Lỗi khi đọc confirmationResult từ localStorage:', error);
    return null;
  }
};

// Xác thực OTP trực tiếp với Firebase
const verifyOtp = async () => {
  if (!isOtpComplete.value) return;
  
  try {
    loading.value = true;
    const otpCode = otpDigits.value.join('');
    
    // Lấy thông tin xác thực từ localStorage
    const savedConfirmationResult = getConfirmationResultFromStorage();
    
    if (!savedConfirmationResult || !savedConfirmationResult.verificationId) {
      errorMessage.value = 'Phiên xác thực không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.';
      loading.value = false;
      return;
    }
    
    try {
      // Tạo credential với verificationId và OTP
      const credential = PhoneAuthProvider.credential(
        savedConfirmationResult.verificationId,
        otpCode
      );
      
      // Đăng nhập với credential
      const userCredential = await signInWithCredential(auth, credential);
      
      // Lưu thông tin người dùng
      firebaseUser.value = userCredential.user;
      
      // Lấy token ID
      firebaseIdToken.value = await userCredential.user.getIdToken();
      
      // Xóa thông tin xác thực khỏi localStorage sau khi xác thực thành công
      localStorage.removeItem('firebaseConfirmationResult');
      
      // Chuyển sang bước tiếp theo
      currentStep.value = 2;
      errorMessage.value=""
      
      loading.value = false;
    } catch (otpError) {
      console.error('Lỗi xác thực OTP:', otpError);
      errorMessage.value = 'Mã OTP không chính xác hoặc đã hết hạn.';
      loading.value = false;
    }
  } catch (error) {
    console.error('Lỗi xác thực OTP:', error);
    errorMessage.value = 'Có lỗi xảy ra trong quá trình xác thực. Vui lòng thử lại.';
    loading.value = false;
  }
};

// Gửi lại OTP (trở về trang đăng ký)
const resendOtp = () => {
  // Trở về trang đăng ký để gửi lại OTP
  router.push({
    path: '/login',
    query: { 
      action: 'register',
      phone: phoneNumber.value,
      resend: 'true'
    }
  });
};

// Xác thực và gửi mật khẩu
const validatePassword = () => {
  let isValid = true;
  passwordErrors.value = { password: '', confirmPassword: '' };

  if (!passwordForm.value.password) {
    passwordErrors.value.password = t('pages.sendOTP.password.errors.required');
    isValid = false;
  } else if (passwordForm.value.password.length < 6) {
    passwordErrors.value.password = t('pages.sendOTP.password.errors.minLength');
    isValid = false;
  }

  if (!passwordForm.value.confirmPassword) {
    passwordErrors.value.confirmPassword = t('pages.sendOTP.password.errors.confirmRequired');
    isValid = false;
  } else if (passwordForm.value.password !== passwordForm.value.confirmPassword) {
    passwordErrors.value.confirmPassword = t('pages.sendOTP.password.errors.notMatch');
    isValid = false;
  }

  return isValid;
};

const submitPassword = () => {
  if (!validatePassword()) return;
  
  // Không cần gọi API, chỉ lưu mật khẩu vào biến cục bộ để gửi sau cùng với profile
  currentStep.value = 3;
};

// Xác thực và gửi thông tin hồ sơ
const validateProfile = () => {
  let isValid = true;
  profileErrors.value = { 
    fullName: '',
    address: '',
    phone: '',
    email: '',
    healthInsuranceNumber: ''
  };

  if (!profileForm.value.fullName) {
    profileErrors.value.fullName = t('pages.sendOTP.profile.errors.fullNameRequired');
    isValid = false;
  }
  
  if (!profileForm.value.phone) {
    profileErrors.value.phone = t('pages.sendOTP.profile.errors.phoneRequired');
    isValid = false;
  } else if (!/^\d{10,11}$/.test(profileForm.value.phone)) {
    profileErrors.value.phone = t('pages.sendOTP.profile.errors.phoneInvalid');
    isValid = false;
  }
  
  if (profileForm.value.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.value.email)) {
    profileErrors.value.email = t('pages.sendOTP.profile.errors.emailInvalid');
    isValid = false;
  }

  return isValid;
};

const submitProfile = async () => {
  if (!validateProfile()) return;
  
  try {
    // Tránh gọi lại API nếu đang loading
    if (loading.value) {
      return;
    }
    
    loading.value = true;
    errorMessage.value = '';
    
    if (!firebaseUser.value || !firebaseIdToken.value) {
      errorMessage.value = 'Xác thực Firebase không hợp lệ. Vui lòng thử lại.';
      loading.value = false;
      return;
    }
    
    // Format dateOfBirth đúng định dạng ISO nếu có
    const formattedDateOfBirth = profileForm.value.dateOfBirth 
      ? new Date(profileForm.value.dateOfBirth).toISOString() 
      : '';
    
    // Chuẩn bị dữ liệu gửi
    const registerData = {
      // Thông tin User (sử dụng số điện thoại ban đầu dùng để xác thực OTP)
      password: passwordForm.value.password,
      name: profileForm.value.fullName,
      phone: phoneNumber.value, // Số điện thoại ban đầu dùng cho User và user.Phone
      roleId: "R3", // R3 là vai trò bệnh nhân
      PhonePatient: profileForm.value.phone,
      // Thông tin PatientRecord
      fullName: profileForm.value.fullName,
      dateOfBirth: formattedDateOfBirth,
      gender: profileForm.value.gender,
      address: profileForm.value.address,
      email: profileForm.value.email,
      // Phone của PatientRecord sẽ được backend sử dụng từ PatientRecord.Phone
      // Trong trường hợp backend không có trường riêng, đảm bảo phone của user sẽ được dùng
      healthInsuranceNumber: profileForm.value.healthInsuranceNumber
    };
    
    
    try {
      // Sử dụng authApi.register để đăng ký người dùng
      const response = await authApi.register(registerData);
            
      if (response.succeeded) {
        // Lưu token vào localStorage nếu backend trả về token
        // if (response.data && response.data.token) {
        //   localStorage.setItem('accessToken', response.data.token);
        // }
        
        // Lưu thông tin người dùng vào localStorage
        if (response.data && response.data.phone) {
          localStorage.setItem('Phone', response.data.phone);
          // Lưu thêm email người dùng vào localStorage
        }
        
        // Chuyển hướng đến trang chủ
        window.location.reload();
        router.push('/');
      } else {
        errorMessage.value = response.message || 'Không thể đăng ký tài khoản.';
      }
    } catch (apiError) {
      console.error('API Error:', apiError);
      
      // Hiển thị thông báo lỗi chi tiết
      if (apiError.response) {
        // Server trả về response với status code nằm ngoài range 2xx
        console.error('Error data:', apiError.response.data);
        console.error('Error status:', apiError.response.status);
        
      //  errorMessage.value = `Lỗi: ${apiError.response.status} - ${apiError.response.data.message || 'Không thể kết nối đến server'}`;
      errorMessage.value=apiError.response.data.errors[0]
      } else if (apiError.request) {
        // Request được gửi nhưng không nhận được response
        console.error('No response received:', apiError.request);
        errorMessage.value = 'Không nhận được phản hồi từ server. Vui lòng kiểm tra kết nối mạng.';
      } else {
        // Có lỗi khi thiết lập request
        console.error('Request error:', apiError.message);
        errorMessage.value = `Lỗi khi gửi yêu cầu: ${apiError.message}`;
      }
    } finally {
      // Đảm bảo loading được set về false trong mọi trường hợp
      loading.value = false;
    }
  } catch (error) {
    console.error('General error:', error);
    errorMessage.value = 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.';
    loading.value = false;
  }
};

onMounted(async () => {
  try {
    // Lấy số điện thoại từ query params
    if (route.query.phone) {
      phoneNumber.value = route.query.phone;
    }
    
    // Kiểm tra xem có confirmationResult trong localStorage không
    // const savedConfirmationResult = getConfirmationResultFromStorage();
    // if (!savedConfirmationResult) {
    //   errorMessage.value = 'Không tìm thấy thông tin xác thực. Vui lòng quay lại trang đăng ký.';
    // }
    
    // Đảm bảo DOM đã được render trước khi focus
    nextTick(() => {
      // Tự động focus vào ô nhập OTP đầu tiên sau khi component được mount
      focusFirstInput();
    });
  } catch (error) {
    console.error('Lỗi trong onMounted:', error);
    errorMessage.value = 'Đã xảy ra lỗi khi khởi tạo trang.';
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

