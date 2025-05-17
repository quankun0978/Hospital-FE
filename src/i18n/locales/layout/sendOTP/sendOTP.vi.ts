export default {
  steps: {
    verify: '1.Xác thực',
    password: '2.Mật khẩu',
    profile: '3.Tạo hồ sơ'
  },
  verify: {
    enterOtp: 'Nhập mã OTP vừa được gửi đến số',
    continue: 'Tiếp tục',
    notReceived: 'Không nhận được mã OTP?',
    tryAgain: 'Thử lại'
  },
  password: {
    title: 'Tạo mật khẩu',
    password: 'Mật khẩu',
    passwordPlaceholder: 'Nhập mật khẩu',
    confirmPassword: 'Xác nhận mật khẩu',
    confirmPasswordPlaceholder: 'Nhập lại mật khẩu',
    continue: 'Tiếp tục',
    errors: {
      required: 'Vui lòng nhập mật khẩu',
      minLength: 'Mật khẩu phải có ít nhất 6 ký tự',
      confirmRequired: 'Vui lòng xác nhận mật khẩu',
      notMatch: 'Mật khẩu không khớp'
    }
  },
  profile: {
    title: 'Tạo hồ sơ',
    fullName: 'Họ và tên',
    fullNamePlaceholder: 'Nhập họ và tên',
    dateOfBirth: 'Ngày sinh',
    gender: 'Giới tính',
    genderOptions: {
      male: 'Nam',
      female: 'Nữ'
    },
    address: 'Địa chỉ',
    addressPlaceholder: 'Nhập địa chỉ liên hệ',
    phone: 'Số điện thoại',
    phonePlaceholder: 'Nhập số điện thoại liên lạc',
    email: 'Email',
    emailPlaceholder: 'Nhập địa chỉ email',
    healthInsurance: 'Số bảo hiểm y tế (nếu có)',
    healthInsurancePlaceholder: 'Nhập số bảo hiểm y tế',
    complete: 'Hoàn tất',
    errors: {
      fullNameRequired: 'Vui lòng nhập họ và tên',
      phoneRequired: 'Vui lòng nhập số điện thoại',
      phoneInvalid: 'Số điện thoại không hợp lệ',
      emailInvalid: 'Email không hợp lệ'
    }
  }
}
