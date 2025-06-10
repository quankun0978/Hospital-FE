import { createRouter, createWebHistory } from "vue-router";
import Home from "@/page/Home.vue";
import Login from "@/page/Login.vue";
import ForgotPassword from "@/page/ForgotPassword.vue";
import SendOTP from "@/page/SendOTP.vue";
import DoctorList from "@/page/DoctorList.vue";
import DoctorDetail from "@/page/DoctorDetail.vue";
import ClinicList from "@/page/ClinicList.vue";
import ClinicDetail from "@/page/ClinicDetail.vue";
import PatientRecord from "@/page/PatientRecord.vue";
import AppointmentStep from "@/page/Appointment/AppointmentStep.vue";
import ConfirmAppointment from "@/page/ConfirmAppointment.vue";
const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
    meta: {
      title: "Hospital - Trang chủ",
    },
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: {
      title: "Hospital - Đăng nhập",
    },
  },
  {
    path: "/patient-record",
    name: "patient-record",
    component: PatientRecord,
    meta: {
      title: "Hospital - Hồ sơ bệnh nhân",
    },
  },
  {
    path: "/forgot-password",
    name: "forgot-password",
    component: ForgotPassword,
    meta: {
      title: "Hospital - Quên mật khẩu",
    },
  },
  {
    path: "/send-otp",
    name: "send-otp",
    component: SendOTP,
    meta: {
      title: "Hospital - Xác thực OTP",
    },
  },
  {
    path: "/doctors",
    name: "doctors",
    component: DoctorList,
    meta: {
      title: "Hospital - Danh sách bác sĩ",
    },
  },
  {
    path: "/doctors/:slug",
    name: "doctor-detail",
    component: DoctorDetail,
    meta: {
      title: "Hospital - Chi tiết bác sĩ",
    },
  },
  {
    path: "/clinics",
    name: "clinics",
    component: ClinicList,
    meta: {
      title: "Hospital - Danh sách cơ sở y tế",
    },
  },
  {
    path: "/hospitals",
    name: "hospitals",
    component: ClinicList,
    props: { defaultFilter: "hospital" },
    meta: {
      title: "Hospital - Danh sách bệnh viện",
    },
  },
  {
    path: "/clinics/:id",
    name: "clinic-detail",
    component: ClinicDetail,
    meta: {
      title: "Hospital - Chi tiết cơ sở y tế",
    },
  },
  {
    path: "/appointment-step",
    name: "appointment-step",
    component: AppointmentStep,
    meta: {
      title: "Hospital - Đặt lịch khám",
    },
  },
  {
    path: "/confirm-appointment",
    name: "confirm-appointment",
    component: ConfirmAppointment,
    meta: {
      title: "Hospital - Xác nhận lịch khám",
    },
  },
  // Thêm các route khác ở đây nếu cần
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    // Luôn cuộn về đầu trang khi chuyển trang
    return { top: 0 };
  },
});

// Thêm navigation guard để thay đổi title khi route thay đổi
router.beforeEach((to, from, next) => {
  // Cập nhật title dựa trên meta.title của route
  document.title = to.meta.title || "Bệnh viện";
  next();
});

// Middleware đơn giản để kiểm tra đăng nhập
router.beforeEach((to, from, next) => {
  // Danh sách các route bắt buộc phải đăng nhập
  const protectedRoutes = ["/profile", "/appointments", "/payment-history"];

  // Kiểm tra xem route hiện tại có yêu cầu đăng nhập không
  const requiresAuth = protectedRoutes.includes(to.path);

  // Kiểm tra người dùng đã đăng nhập chưa
  const isAuthenticated = localStorage.getItem("accessToken");

  if (requiresAuth && !isAuthenticated) {
    // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập và truy cập route bảo vệ
    next("/login");
  } else {
    // Tiếp tục bình thường
    next();
  }
});

// Thêm guard để ngăn người dùng đã đăng nhập truy cập trang login
router.beforeEach((to, from, next) => {
  // Danh sách các route chỉ dành cho người dùng chưa đăng nhập
  const authRoutes = ["/login", "/forgot-password", "/send-otp"];

  // Kiểm tra người dùng đã đăng nhập chưa
  const isAuthenticated =
    localStorage.getItem("accessToken") && localStorage.getItem("Phone");

  if (authRoutes.includes(to.path) && isAuthenticated) {
    // Nếu đã đăng nhập và cố truy cập trang đăng nhập, chuyển hướng về trang chủ
    next("/");
  } else {
    // Tiếp tục bình thường
    next();
  }
});

export default router;
