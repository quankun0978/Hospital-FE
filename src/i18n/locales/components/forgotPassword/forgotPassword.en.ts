export default {
  title: "Forgot Password",
  form: {
    email: "Email",
    emailPlaceholder: "Enter your email address",
    submitButton: "Send Reset Link"
  },
  validation: {
    emailRequired: "Email is required",
    emailInvalid: "Invalid email format"
  },
  navigation: {
    backToLogin: "Back to Login"
  },
  messages: {
    success: "Password reset link has been sent to your email. Please check your inbox.",
    error: "Error occurred while sending reset password email",
    genericError: "An error occurred. Please try again later."
  }
}; 