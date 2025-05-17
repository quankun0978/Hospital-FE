export default {
  steps: {
    verify: '1.Verification',
    password: '2.Password',
    profile: '3.Create Profile'
  },
  verify: {
    enterOtp: 'Enter the OTP sent to',
    continue: 'Continue',
    notReceived: 'Didn\'t receive OTP?',
    tryAgain: 'Try again'
  },
  password: {
    title: 'Create Password',
    password: 'Password',
    passwordPlaceholder: 'Enter password',
    confirmPassword: 'Confirm Password',
    confirmPasswordPlaceholder: 'Re-enter password',
    continue: 'Continue',
    errors: {
      required: 'Please enter a password',
      minLength: 'Password must be at least 6 characters',
      confirmRequired: 'Please confirm your password',
      notMatch: 'Passwords do not match'
    }
  },
  profile: {
    title: 'Create Profile',
    fullName: 'Full Name',
    fullNamePlaceholder: 'Enter your full name',
    dateOfBirth: 'Date of Birth',
    gender: 'Gender',
    genderOptions: {
      male: 'Male',
      female: 'Female'
    },
    address: 'Address',
    addressPlaceholder: 'Enter your contact address',
    phone: 'Phone Number',
    phonePlaceholder: 'Enter your contact phone number',
    email: 'Email',
    emailPlaceholder: 'Enter your email address',
    healthInsurance: 'Health Insurance Number (if any)',
    healthInsurancePlaceholder: 'Enter health insurance number',
    complete: 'Complete',
    errors: {
      fullNameRequired: 'Please enter your full name',
      phoneRequired: 'Please enter your phone number',
      phoneInvalid: 'Invalid phone number',
      emailInvalid: 'Invalid email address'
    }
  }
}
