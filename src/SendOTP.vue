<template>
  <div class="send-otp-container">
    <h2>Xác thực số điện thoại</h2>
    
    <!-- Giai đoạn nhập số điện thoại -->
    <div v-if="!showOtpInput" class="phone-input-section">
      <div class="form-group">
        <label for="phone">Số điện thoại:</label>
        <div class="phone-input">
          <span class="country-code">+84</span>
          <input 
            id="phone" 
            type="text" 
            v-model="phoneNumber" 
            placeholder="Nhập số điện thoại" 
            maxlength="9"
          />
        </div>
        <p class="note">Nhập số điện thoại không bao gồm số 0 đầu tiên</p>
      </div>
      <button class="submit-btn" @click="sendOTP" :disabled="isLoading">
        {{ isLoading ? 'Đang gửi...' : 'Gửi mã OTP' }}
      </button>
      <div id="recaptcha-container"></div>
    </div>
    
    <!-- Giai đoạn nhập OTP -->
    <div v-else class="otp-input-section">
      <div class="form-group">
        <label for="otp">Mã OTP:</label>
        <div class="otp-input">
          <input 
            id="otp" 
            type="text" 
            v-model="otpCode" 
            placeholder="Nhập mã OTP" 
            maxlength="6"
          />
        </div>
        <p class="timer">Mã OTP hết hạn sau: {{ formatTime(timer) }}</p>
      </div>
      <button class="submit-btn" @click="verifyOTP" :disabled="isVerifying">
        {{ isVerifying ? 'Đang xác thực...' : 'Xác nhận' }}
      </button>
      <button class="resend-btn" @click="resendOTP" :disabled="timer > 0 || isLoading">
        Gửi lại mã OTP
      </button>
    </div>
    
    <!-- Thông báo -->
    <div v-if="message" class="message" :class="{ error: isError }">
      {{ message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import { auth } from '../firebase';
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  ConfirmationResult,
  PhoneAuthProvider
} from 'firebase/auth';

// Các biến trạng thái
const phoneNumber = ref('');
const otpCode = ref('');
const message = ref('');
const isError = ref(false);
const isLoading = ref(false);
const isVerifying = ref(false);
const showOtpInput = ref(false);
const timer = ref(0);
const timerInterval = ref<number | null>(null);
const confirmationResult = ref<ConfirmationResult | null>(null);
const recaptchaVerifier = ref<RecaptchaVerifier | null>(null);

// Khởi tạo reCAPTCHA verifier
const initRecaptcha = () => {
  if (!recaptchaVerifier.value) {
    recaptchaVerifier.value = new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': 'normal',
      'callback': () => {
        // reCAPTCHA đã được giải quyết
      },
      'expired-callback': () => {
        // reCAPTCHA đã hết hạn
        message.value = 'reCAPTCHA đã hết hạn, vui lòng làm mới trang';
        isError.value = true;
      }
    });
  }
};

// Gửi OTP
const sendOTP = async () => {
  if (!phoneNumber.value.trim()) {
    message.value = 'Vui lòng nhập số điện thoại';
    isError.value = true;
    return;
  }
  
  if (!/^\d{9}$/.test(phoneNumber.value)) {
    message.value = 'Số điện thoại không hợp lệ';
    isError.value = true;
    return;
  }
  
  try {
    isLoading.value = true;
    message.value = '';
    isError.value = false;
    
    initRecaptcha();
    
    // Định dạng số điện thoại theo chuẩn quốc tế
    const formattedPhoneNumber = `+84${phoneNumber.value}`;
    
    // Gửi OTP
    confirmationResult.value = await signInWithPhoneNumber(
      auth, 
      formattedPhoneNumber, 
      recaptchaVerifier.value!
    );
    
    // Hiển thị form nhập OTP
    showOtpInput.value = true;
    
    // Bắt đầu đếm ngược
    startTimer();
    
    message.value = 'Mã OTP đã được gửi đến số điện thoại của bạn';
    isError.value = false;
  } catch (error: any) {
    console.error('Lỗi khi gửi OTP:', error);
    message.value = `Lỗi: ${error.message || 'Không thể gửi OTP'}`;
    isError.value = true;
    
    // Reset reCAPTCHA
    if (recaptchaVerifier.value) {
      recaptchaVerifier.value.clear();
      recaptchaVerifier.value = null;
    }
  } finally {
    isLoading.value = false;
  }
};

// Xác thực OTP
const verifyOTP = async () => {
  if (!otpCode.value.trim()) {
    message.value = 'Vui lòng nhập mã OTP';
    isError.value = true;
    return;
  }
  
  try {
    isVerifying.value = true;
    message.value = '';
    isError.value = false;
    
    if (!confirmationResult.value) {
      throw new Error('Phiên xác thực không hợp lệ');
    }
    
    // Xác thực OTP
    const result = await confirmationResult.value.confirm(otpCode.value);
    
    // Xác thực thành công
    message.value = 'Xác thực thành công!';
    isError.value = false;
    
    // Dừng đếm ngược
    stopTimer();
    
    // Có thể thực hiện các hành động sau khi xác thực thành công
  } catch (error: any) {
    message.value = `Lỗi: ${error.message || 'Mã OTP không đúng'}`;
    isError.value = true;
  } finally {
    isVerifying.value = false;
  }
};

// Gửi lại OTP
const resendOTP = async () => {
  otpCode.value = '';
  stopTimer();
  await sendOTP();
};

// Bắt đầu đếm ngược
const startTimer = () => {
  timer.value = 60;
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
  }
  timerInterval.value = setInterval(() => {
    if (timer.value > 0) {
      timer.value--;
    } else {
      stopTimer();
    }
  }, 1000) as unknown as number;
};

// Dừng đếm ngược
const stopTimer = () => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
    timerInterval.value = null;
  }
};

// Định dạng thời gian
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Dọn dẹp khi component bị hủy
onUnmounted(() => {
  stopTimer();
  if (recaptchaVerifier.value) {
    recaptchaVerifier.value.clear();
  }
});
</script>

<style scoped>
.send-otp-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}

.phone-input,
.otp-input {
  display: flex;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.country-code {
  background-color: #f5f5f5;
  padding: 10px 12px;
  border-right: 1px solid #ddd;
  color: #333;
  font-weight: 500;
}

input {
  flex: 1;
  padding: 10px 12px;
  border: none;
  outline: none;
  font-size: 16px;
}

.note {
  font-size: 12px;
  color: #666;
  margin-top: 6px;
}

.timer {
  font-size: 14px;
  color: #e74c3c;
  margin-top: 6px;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: background-color 0.3s;
}

.submit-btn:hover {
  background-color: #45a049;
}

.submit-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.resend-btn {
  width: 100%;
  padding: 10px;
  background-color: transparent;
  color: #2196f3;
  border: 1px solid #2196f3;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
  font-size: 14px;
  transition: all 0.3s;
}

.resend-btn:hover {
  background-color: #e3f2fd;
}

.resend-btn:disabled {
  color: #cccccc;
  border-color: #cccccc;
  cursor: not-allowed;
}

.message {
  margin-top: 20px;
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

#recaptcha-container {
  margin: 15px 0;
}
</style>
