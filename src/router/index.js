import { createRouter, createWebHistory } from "vue-router";
import Home from "@/page/Home.vue";
import Login from "@/page/Login.vue";
import ForgotPassword from "@/page/ForgotPassword.vue";
import ResetPassword from "@/page/ResetPassword.vue";
import SendOTP from "@/page/SendOTP.vue";
import DoctorList from "@/page/DoctorList.vue";
import DoctorDetail from "@/page/DoctorDetail.vue";
import ClinicList from "@/page/ClinicList.vue";
import ClinicDetail from "@/page/ClinicDetail.vue";
import ClinicDoctors from "@/page/ClinicDoctors.vue";
import PatientRecord from "@/page/PatientRecord.vue";
import AppointmentStep from "@/page/Appointment/AppointmentStep.vue";
import ConfirmAppointment from "@/page/ConfirmAppointment.vue";
import SearchResult from "@/page/SearchResult.vue";
import AdminDashboard from "@/page/Admin/AdminDashboard.vue";
import UserManagement from "@/page/Admin/UserManagement.vue";
import UserForm from "@/page/Admin/UserForm.vue";
import ClinicManagement from "@/page/Admin/ClinicManagement.vue";
import ArticleDetail from "@/page/ArticleDetail.vue";
import ArticleManagement from "@/page/Admin/ArticleManagement.vue";
import { authGuard, guestGuard } from "./authGuard";

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
    beforeEnter: guestGuard,
    meta: {
      title: "Hospital - Đăng nhập",
    },
  },
  {
    path: "/patient-record",
    name: "patient-record",
    component: PatientRecord,
    beforeEnter: authGuard,
    meta: {
      title: "Hospital - Hồ sơ bệnh nhân",
      requiresAuth: true,
    },
  },
  {
    path: "/forgot-password",
    name: "forgot-password",
    component: ForgotPassword,
    beforeEnter: guestGuard,
    meta: {
      title: "Hospital - Quên mật khẩu",
    },
  },
  {
    path: "/reset-password",
    name: "reset-password",
    component: ResetPassword,
    beforeEnter: guestGuard,
    meta: {
      title: "Hospital - Đặt lại mật khẩu",
    },
  },
  {
    path: "/change-password",
    name: "change-password",
    component: ResetPassword,
    beforeEnter: authGuard,
    meta: {
      title: "Hospital - Đổi mật khẩu",
      requiresAuth: true,
    },
  },
  {
    path: "/send-otp",
    name: "send-otp",
    component: SendOTP,
    beforeEnter: guestGuard,
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
    path: "/clinics/:slug",
    name: "clinic-detail",
    component: ClinicDetail,
    meta: {
      title: "Hospital - Chi tiết cơ sở y tế",
    },
  },
  {
    path: "/clinics/:slug/doctors",
    name: "clinic-doctors",
    component: ClinicDoctors,
    meta: {
      title: "Hospital - Danh sách bác sĩ",
    },
  },
  {
    path: "/appointment-step",
    name: "appointment-step",
    component: AppointmentStep,
    beforeEnter: authGuard,
    meta: {
      title: "Hospital - Đặt lịch khám",
      requiresAuth: true,
    },
  },
  {
    path: "/confirm-appointment",
    name: "confirm-appointment",
    component: ConfirmAppointment,
    beforeEnter: authGuard,
    meta: {
      title: "Hospital - Xác nhận lịch khám",
      requiresAuth: true,
    },
  },
  {
    path: "/search",
    name: "search",
    component: SearchResult,
    meta: {
      title: "Hospital - Kết quả tìm kiếm",
    },
  },
  {
    path: "/appointments",
    name: "appointments",
    component: () => import("@/page/AppointmentHistory.vue"),
    beforeEnter: authGuard,
    meta: {
      title: "Hospital - Lịch khám của tôi",
      requiresAuth: true,
    },
  },
  {
    path: "/articles/:slug",
    name: "article-detail",
    component: ArticleDetail,
    meta: {
      title: "Hospital - Chi tiết bài viết",
    },
  },
  {
    path: "/admin",
    name: "admin-dashboard",
    component: AdminDashboard,
    beforeEnter: authGuard,
    meta: {
      title: "Hospital - Quản trị viên",
      requiresAuth: true,
      requiresRole: ["R1", "R2"] // Admin hoặc Doctor
    },
  },
  {
    path: "/admin/users",
    name: "admin-users",
    component: UserManagement,
    beforeEnter: authGuard,
    meta: {
      title: "Hospital - Quản lý người dùng",
      requiresAuth: true,
      requiresRole: ["R1"] // Chỉ Admin
    },
  },
  {
    path: "/admin/users/create",
    name: "admin-users-create",
    component: UserForm,
    beforeEnter: authGuard,
    meta: {
      title: "Hospital - Thêm người dùng",
      requiresAuth: true,
      requiresRole: ["R1"] // Chỉ Admin
    },
  },
  {
    path: "/admin/users/:id/edit",
    name: "admin-users-edit",
    component: UserForm,
    beforeEnter: authGuard,
    meta: {
      title: "Hospital - Chỉnh sửa người dùng",
      requiresAuth: true,
      requiresRole: ["R1"] // Chỉ Admin
    },
  },
  {
    path: "/admin/clinics",
    name: "admin-clinics",
    component: ClinicManagement,
    beforeEnter: authGuard,
    meta: {
      title: "Hospital - Quản lý cơ sở y tế",
      requiresAuth: true,
      requiresRole: ["R1"] // Chỉ Admin
    },
  },
  {
    path: "/admin/clinics/create",
    name: "admin-clinics-create",
    component: () => import("@/page/Admin/ClinicForm.vue"),
    beforeEnter: authGuard,
    meta: {
      title: "Hospital - Thêm cơ sở y tế",
      requiresAuth: true,
      requiresRole: ["R1"] // Chỉ Admin
    },
  },
  {
    path: "/admin/clinics/:id/edit",
    name: "admin-clinics-edit",
    component: () => import("@/page/Admin/ClinicForm.vue"),
    beforeEnter: authGuard,
    meta: {
      title: "Hospital - Chỉnh sửa cơ sở y tế",
      requiresAuth: true,
      requiresRole: ["R1"] // Chỉ Admin
    },
  },
  {
    path: "/admin/doctors",
    name: "admin-doctors",
    component: () => import("@/page/Admin/DoctorManagement.vue"),
    beforeEnter: authGuard,
    meta: {
      title: "Hospital - Quản lý bác sĩ",
      requiresAuth: true,
      requiresRole: ["R1"] // Chỉ Admin
    },
  },
  {
    path: "/admin/doctors/create",
    name: "admin-doctors-create",
    component: () => import("@/page/Admin/DoctorForm.vue"),
    beforeEnter: authGuard,
    meta: {
      title: "Hospital - Thêm thông tin bác sĩ",
      requiresAuth: true,
      requiresRole: ["R1"] // Chỉ Admin
    },
  },
  {
    path: "/admin/doctors/:id/edit",
    name: "admin-doctors-edit",
    component: () => import("@/page/Admin/DoctorForm.vue"),
    beforeEnter: authGuard,
    meta: {
      title: "Hospital - Chỉnh sửa thông tin bác sĩ",
      requiresAuth: true,
      requiresRole: ["R1"] // Chỉ Admin
    },
  },
  {
    path: "/admin/schedules",
    name: "admin-schedules",
    component: () => import("@/page/Admin/ScheduleManagement.vue"),
    beforeEnter: authGuard,
    meta: {
      title: "Hospital - Quản lý lịch khám",
      requiresAuth: true,
      requiresRole: ["R1", "R2"] // Admin và Doctor đều có thể truy cập
    },
  },
  {
    path: "/admin/schedules/create",
    name: "admin-schedules-create",
    component: () => import("@/page/Admin/ScheduleForm.vue"),
    beforeEnter: authGuard,
    meta: {
      title: "Hospital - Thêm lịch khám",
      requiresAuth: true,
      requiresRole: ["R1", "R2"] // Admin và Doctor đều có thể tạo lịch
    },
  },
  {
    path: "/admin/schedules/:id/edit",
    name: "admin-schedules-edit",
    component: () => import("@/page/Admin/ScheduleForm.vue"),
    beforeEnter: authGuard,
    meta: {
      title: "Hospital - Chỉnh sửa lịch khám",
      requiresAuth: true,
      requiresRole: ["R1", "R2"] // Admin và Doctor đều có thể sửa lịch
    },
  },
  {
    path: "/admin/appointments",
    name: "admin-appointments",
    component: () => import("@/page/Admin/AppointmentManagement.vue"),
    beforeEnter: authGuard,
    meta: {
      title: "Hospital - Quản lý lịch hẹn",
      requiresAuth: true,
      requiresRole: ["R1", "R2"] // Admin và Doctor đều có thể truy cập
    },
  },
  {
    path: "/admin/articles",
    name: "admin-articles",
    component: ArticleManagement,
    beforeEnter: authGuard,
    meta: {
      title: "Hospital - Quản lý bài viết",
      requiresAuth: true,
      requiresRole: ["R1"] // Chỉ Admin
    },
  },
  {
    path: "/admin/articles/create",
    name: "admin-articles-create",
    component: () => import("@/page/Admin/ArticleForm.vue"),
    beforeEnter: authGuard,
    meta: {
      title: "Hospital - Thêm bài viết",
      requiresAuth: true,
      requiresRole: ["R1"] // Chỉ Admin
    },
  },
  {
    path: "/admin/articles/:id/edit",
    name: "admin-articles-edit",
    component: () => import("@/page/Admin/ArticleForm.vue"),
    beforeEnter: authGuard,
    meta: {
      title: "Hospital - Chỉnh sửa bài viết",
      requiresAuth: true,
      requiresRole: ["R1"] // Chỉ Admin
    },
  },
  {
    path: "/admin/specialties",
    name: "admin-specialties",
    component: () => import("@/page/Admin/SpecialtyManagement.vue"),
    beforeEnter: authGuard,
    meta: {
      title: "Hospital - Quản lý chuyên khoa",
      requiresAuth: true,
      requiresRole: ["R1"] // Chỉ Admin
    },
  },
  {
    path: "/admin/specialties/create",
    name: "admin-specialties-create",
    component: () => import("@/page/Admin/SpecialtyForm.vue"),
    beforeEnter: authGuard,
    meta: {
      title: "Hospital - Thêm chuyên khoa",
      requiresAuth: true,
      requiresRole: ["R1"] // Chỉ Admin
    },
  },
  {
    path: "/admin/specialties/:id/edit",
    name: "admin-specialties-edit",
    component: () => import("@/page/Admin/SpecialtyForm.vue"),
    beforeEnter: authGuard,
    meta: {
      title: "Hospital - Chỉnh sửa chuyên khoa",
      requiresAuth: true,
      requiresRole: ["R1"] // Chỉ Admin
    },
  },
  // Thêm các route khác ở đây nếu cần
  
  // VÍ DỤ: Thêm route mới cho trang Dịch vụ y tế
  // {
  //   path: "/dich-vu",
  //   name: "services",
  //   component: () => import("@/page/Services.vue"),
  //   meta: {
  //     title: "Hospital - Dịch vụ y tế",
  //   },
  // },
  // {
  //   path: "/dich-vu/:slug",
  //   name: "service-detail",
  //   component: () => import("@/page/ServiceDetail.vue"),
  //   meta: {
  //     title: "Hospital - Chi tiết dịch vụ",
  //   },
  // },
  // {
  //   path: "/lien-he",
  //   name: "contact",
  //   component: () => import("@/page/Contact.vue"),
  //   meta: {
  //     title: "Hospital - Liên hệ",
  //   },
  // },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    // Luôn cuộn về đầu trang khi chuyển trang
    return { top: 0 };
  },
});

// Global navigation guard để thay đổi title (không check auth)
router.beforeEach((to, from, next) => {
  // Cập nhật title dựa trên meta.title của route
  document.title = to.meta.title || "Bệnh viện";
  next();
});

export default router;
